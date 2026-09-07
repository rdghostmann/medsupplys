// /services/payment.service.ts

"use server";

import {
  Types,
} from "mongoose";

import { connectToDB } from "@/lib/connectToDB";

import PaymentTransaction from "@/models/PaymentTransaction";

import {
  creditWallet,
  getOrCreateBuyerWallet,
} from "@/services/wallet.service";

import {
  generatePaymentReference,
} from "@/lib/payment-reference";

import {
  PaystackPaymentProvider,
} from "@/services/payments/paystack.service";

import {
  FlutterwavePaymentProvider,
} from "@/services/payments/flutterwave.service";

import type {
  PaymentProvider as PaymentProviderName,
  VerifyPaymentResult,
} from "@/services/payments/payment.types";
import { User } from "@/models/User";

const providers = {
  PAYSTACK:
    new PaystackPaymentProvider(),

  FLUTTERWAVE:
    new FlutterwavePaymentProvider(),
};

function getProvider(
  provider: PaymentProviderName
) {
  return providers[provider];
}

function assertValidAmount(
  amount: number
) {
  if (!Number.isFinite(amount)) {
    throw new Error(
      "Invalid wallet top-up amount"
    );
  }

  if (amount < 100) {
    throw new Error(
      "Minimum wallet top-up is ₦100"
    );
  }

  if (amount > 50_000_000) {
    throw new Error(
      "Wallet top-up amount exceeds the allowed limit"
    );
  }
}

export async function initializeWalletTopup(params: {
  buyerId: string;

  provider: PaymentProviderName;

  amount: number;

  callbackUrl: string;
}) {
  await connectToDB();

  assertValidAmount(params.amount);

  if (!Types.ObjectId.isValid(params.buyerId)) {
    throw new Error(
      "Invalid buyer ID"
    );
  }

  const buyer = await User.findById(
    params.buyerId
  ).lean();

  if (!buyer) {
    throw new Error(
      "Buyer account not found"
    );
  }

  if (buyer.role !== "buyer") {
    throw new Error(
      "Only buyers can fund a buyer wallet"
    );
  }

  if (buyer.status !== "active") {
    throw new Error(
      "Buyer account is not active"
    );
  }

  const wallet =
    await getOrCreateBuyerWallet(params.buyerId);

  if (
    wallet &&
    wallet.status !== "ACTIVE"
  ) {
    throw new Error(
      "Wallet is not currently available"
    );
  }

  const reference =
    generatePaymentReference(
      params.provider
    );

  const paymentProvider =
    params.provider === "PAYSTACK"
      ? "paystack"
      : "flutterwave";

  const paymentTransaction =
    await PaymentTransaction.create({
      buyerId: buyer._id,

      walletId:
        wallet?._id,

      provider: paymentProvider,

      purpose:
        "wallet_topup",

      reference,

      amount:
        params.amount,

      currency:
        "NGN",

      status:
        "pending",

      metadata: {
        buyerId:
          params.buyerId,
      },
    });

  const paymentTransactionId =
    paymentTransaction._id.toString();

  try {
    const provider =
      getProvider(params.provider);

    const result =
      await provider.initializePayment({
        buyerId:
          params.buyerId,

        email:
          buyer.email,

        name:
          `${buyer.firstName ?? ""} ${
            buyer.lastName ?? ""
          }`.trim() ||
          buyer.organizationName ||
          buyer.email,

        phone:
          buyer.phone,

        amount:
          params.amount,

        currency:
          "NGN",

        reference,

        purpose:
          "WALLET_TOPUP",

        callbackUrl:
          params.callbackUrl,

        metadata: {
          paymentTransactionId,
        },
      });

    await PaymentTransaction.findByIdAndUpdate(
      paymentTransactionId,
      {
        $set: {
          providerReference:
            result.providerReference,
        },
      }
    );

    return {
      success: true,

      paymentTransactionId:
        paymentTransactionId,

      reference,

      provider:
        params.provider,

      checkoutUrl:
        result.checkoutUrl,
    };
  } catch (error) {
    await PaymentTransaction.findByIdAndUpdate(
      paymentTransactionId,
      {
        $set: {
          status: "failed",

          metadata: {
            error:
              error instanceof Error
                ? error.message
                : "Payment initialization failed",
          },
        },
      }
    );

    throw error;
  }
}

/**
 * Resolve the gateway transaction and
 * complete the wallet top-up.
 */
export async function verifyWalletTopup(
  reference: string
) {
  await connectToDB();

  const payment =
    await PaymentTransaction.findOne({
      reference,
    });

  if (!payment) {
    throw new Error(
      "Payment transaction not found"
    );
  }

  if (
    payment.purpose !==
    "wallet_topup"
  ) {
    throw new Error(
      "Invalid payment purpose"
    );
  }

  /**
   * Idempotency:
   *
   * If the payment has already been
   * completed, do not credit the wallet again.
   */
  if (
    payment.status === "successful"
  ) {
    return {
      success: true,

      alreadyProcessed: true,

      reference:
        payment.reference,

      amount:
        payment.amount,
    };
  }

  let verification:
    VerifyPaymentResult;

  if (
    payment.provider ===
    "flutterwave"
  ) {
    if (!payment.providerReference) {
      throw new Error(
        "Flutterwave transaction ID is missing"
      );
    }

    verification =
      await getProvider(
        "FLUTTERWAVE"
      ).verifyPayment(
        payment.providerReference
      );
  } else {
    verification =
      await getProvider(
        "PAYSTACK"
      ).verifyPayment(
        payment.reference
      );
  }

  /**
   * Never credit based merely on
   * redirect/webhook status.
   *
   * Validate:
   * - successful status
   * - exact internal reference
   * - exact amount
   * - NGN currency
   */
  if (
    verification.status !==
    "SUCCESS"
  ) {
    await PaymentTransaction.findByIdAndUpdate(
      payment._id,
      {
        $set: {
          status:
            verification.status ===
            "FAILED"
              ? "failed"
              : "pending",
        },
      }
    );

    return {
      success: false,

      status:
        verification.status,

      reference:
        payment.reference,
    };
  }

  if (
    verification.reference !==
    payment.reference
  ) {
    throw new Error(
      "Payment reference mismatch"
    );
  }

  if (
    verification.currency !==
    "NGN"
  ) {
    throw new Error(
      "Payment currency mismatch"
    );
  }

  if (
    Number(verification.amount) !==
    Number(payment.amount)
  ) {
    throw new Error(
      "Payment amount mismatch"
    );
  }

  return finalizeWalletTopup(
    payment._id.toString(),
    verification
  );
}

/**
 * Final wallet top-up fulfillment.
 *
 * This function is deliberately centralized
 * so both callbacks and webhooks eventually
 * follow the same fulfillment path.
 */
export async function finalizeWalletTopup(
  paymentTransactionId: string,

  verification: VerifyPaymentResult
) {
  await connectToDB();

  const payment =
    await PaymentTransaction.findById(
      paymentTransactionId
    );

  if (!payment) {
    throw new Error(
      "Payment transaction not found"
    );
  }

  if (
    payment.status === "successful"
  ) {
    return {
      success: true,

      alreadyProcessed: true,

      reference:
        payment.reference,

      amount:
        payment.amount,
    };
  }

  if (
    payment.status !== "pending"
  ) {
    throw new Error(
      `Payment cannot be finalized from status ${payment.status}`
    );
  }

  /**
   * Revalidate transaction data before
   * delivering wallet value.
   */
  if (
    verification.status !==
    "SUCCESS"
  ) {
    throw new Error(
      "Payment is not successful"
    );
  }

  if (
    verification.reference !==
    payment.reference
  ) {
    throw new Error(
      "Payment reference mismatch"
    );
  }

  if (
    verification.currency !==
    payment.currency
  ) {
    throw new Error(
      "Payment currency mismatch"
    );
  }

  if (
    Number(verification.amount) !==
    Number(payment.amount)
  ) {
    throw new Error(
      "Payment amount mismatch"
    );
  }

  const walletReference =
    `WALLET-TOPUP-${payment.reference}`;

  try {
    await creditWallet({
      buyerId:
        payment.buyerId.toString(),

      amount:
        payment.amount,

      reference:
        walletReference,

      description:
        `Wallet top-up via ${payment.provider}`,

      source:
        payment.provider === "paystack"
          ? "PAYSTACK"
          : "FLUTTERWAVE",

      paymentTransactionId:
        payment._id.toString(),
    });
  } catch (error) {
    /**
     * Do NOT silently mark the gateway payment
     * as failed here.
     *
     * The gateway payment succeeded.
     *
     * The ledger operation is independently
     * idempotent and should be retried/reconciled.
     */
    throw error;
  }

  await PaymentTransaction.findOneAndUpdate(
    {
      _id: payment._id,
      status: "pending",
    },
    {
      $set: {
        status: "successful",
        providerReference:
          verification.providerReference,
        verifiedAt: new Date(),
        gatewayResponse: verification.raw,
      },
    }
  );

  return {
    success: true,

    alreadyProcessed: false,

    reference:
      payment.reference,

    amount:
      payment.amount,
  };
}