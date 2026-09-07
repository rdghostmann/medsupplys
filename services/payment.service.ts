// /services/payment.service.ts

"use server";

import { Types } from "mongoose";

import { connectToDB } from "@/lib/connectToDB";

import PaymentTransaction from "@/models/PaymentTransaction";
import { User } from "@/models/User";

import {
  creditWallet,
  getOrCreateBuyerWallet,
} from "@/services/wallet.service";

import { generatePaymentReference } from "@/lib/payment-reference";

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

const providers = {
  PAYSTACK: new PaystackPaymentProvider(),
  FLUTTERWAVE: new FlutterwavePaymentProvider(),
};

function getProvider(
  provider: PaymentProviderName
) {
  return providers[provider];
}

function assertValidAmount(amount: number) {
  if (!Number.isFinite(amount)) {
    throw new Error("Invalid wallet top-up amount");
  }

  if (amount < 100) {
    throw new Error("Minimum wallet top-up is ₦100");
  }

  if (amount > 50_000_000) {
    throw new Error(
      "Wallet top-up amount exceeds the allowed limit"
    );
  }
}

function assertValidProvider(
  provider: PaymentProviderName
) {
  if (
    provider !== "PAYSTACK" &&
    provider !== "FLUTTERWAVE"
  ) {
    throw new Error("Unsupported payment provider");
  }
}

/**
 * Initialize a wallet top-up.
 *
 * This creates our internal PaymentTransaction first,
 * then initializes the external payment gateway.
 */
export async function initializeWalletTopup(params: {
  buyerId: string;
  provider: PaymentProviderName;
  amount: number;
  callbackUrl: string;
}) {
  await connectToDB();

  assertValidAmount(params.amount);
  assertValidProvider(params.provider);

  if (!Types.ObjectId.isValid(params.buyerId)) {
    throw new Error("Invalid buyer ID");
  }

  const buyer = await User.findById(
    params.buyerId
  ).lean();

  if (!buyer) {
    throw new Error("Buyer account not found");
  }

  if (buyer.role !== "buyer") {
    throw new Error(
      "Only buyers can fund a buyer wallet"
    );
  }

  if (buyer.status !== "active") {
    throw new Error("Buyer account is not active");
  }

  const wallet =
    await getOrCreateBuyerWallet(
      params.buyerId
    );

  if (!wallet) {
    throw new Error("Unable to create or retrieve wallet");
  }

  if (wallet.status !== "ACTIVE") {
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

      walletId: wallet._id,

      provider: paymentProvider,

      purpose: "wallet_topup",

      reference,

      amount: params.amount,

      currency: "NGN",

      status: "pending",

      metadata: {
        buyerId: params.buyerId,
        provider: params.provider,
      },
    });

  const paymentTransactionId =
    paymentTransaction._id.toString();

  try {
    const provider =
      getProvider(params.provider);

    const buyerName =
      `${buyer.firstName ?? ""} ${
        buyer.lastName ?? ""
      }`.trim() ||
      buyer.organizationName ||
      buyer.email;

    const result =
      await provider.initializePayment({
        buyerId: params.buyerId,

        email: buyer.email,

        name: buyerName,

        phone: buyer.phone,

        amount: params.amount,

        currency: "NGN",

        reference,

        purpose: "WALLET_TOPUP",

        callbackUrl: params.callbackUrl,

        metadata: {
          paymentTransactionId,
          buyerId: params.buyerId,
          purpose: "wallet_topup",
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

      paymentTransactionId,

      reference,

      provider: params.provider,

      checkoutUrl:
        result.checkoutUrl,
    };
  } catch (error) {
    await PaymentTransaction.findByIdAndUpdate(
      paymentTransactionId,
      {
        $set: {
          status: "failed",
        },
        $setOnInsert: {},
        $push: {},
      }
    );

    // Preserve existing metadata and add the failure reason.
    await PaymentTransaction.findByIdAndUpdate(
      paymentTransactionId,
      {
        $set: {
          status: "failed",
          "metadata.initializationError":
            error instanceof Error
              ? error.message
              : "Payment initialization failed",
        },
      }
    );

    throw error;
  }
}

/**
 * Verify a wallet top-up.
 *
 * Browser:
 *   verifyWalletTopup(reference, authenticatedBuyerId)
 *
 * Webhook:
 *   verifyWalletTopup(reference)
 *
 * The browser path enforces buyer ownership.
 * The webhook path does not require a user session.
 */
export async function verifyWalletTopup(
  reference: string,
  buyerId?: string
) {
  await connectToDB();

  const normalizedReference =
    String(reference ?? "").trim();

  if (!normalizedReference) {
    throw new Error(
      "Payment reference is required"
    );
  }

  const payment =
    await PaymentTransaction.findOne({
      reference: normalizedReference,
    });

  if (!payment) {
    throw new Error(
      "Payment transaction not found"
    );
  }

  if (
    payment.purpose !== "wallet_topup"
  ) {
    throw new Error(
      "Invalid payment purpose"
    );
  }

  /**
   * Browser ownership protection.
   */
  if (buyerId) {
    if (
      !Types.ObjectId.isValid(buyerId)
    ) {
      throw new Error(
        "Invalid buyer ID"
      );
    }

    if (
      payment.buyerId.toString() !==
      buyerId
    ) {
      throw new Error(
        "You are not authorized to verify this payment"
      );
    }
  }

  /**
   * Idempotency.
   */
  if (
    payment.status === "successful"
  ) {
    return {
      success: true,
      alreadyProcessed: true,
      status: "SUCCESS" as const,
      reference: payment.reference,
      amount: payment.amount,
      provider: payment.provider,
    };
  }

  let verification: VerifyPaymentResult;

  /**
   * Flutterwave verification requires
   * the Flutterwave transaction ID.
   */
  if (
    payment.provider === "flutterwave"
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
  }

  /**
   * Paystack verifies using our internal
   * Paystack reference.
   */
  else if (
    payment.provider === "paystack"
  ) {
    verification =
      await getProvider(
        "PAYSTACK"
      ).verifyPayment(
        payment.reference
      );
  }

  else {
    throw new Error(
      "Unsupported payment provider"
    );
  }

  /**
   * Payment is not successful.
   */
  if (
    verification.status !== "SUCCESS"
  ) {
    await PaymentTransaction.findByIdAndUpdate(
      payment._id,
      {
        $set: {
          status:
            verification.status === "FAILED"
              ? "failed"
              : "pending",

          gatewayResponse:
            verification.raw,
        },
      }
    );

    return {
      success: false,

      status: verification.status,

      reference:
        payment.reference,

      amount:
        payment.amount,

      provider:
        payment.provider,
    };
  }

  /**
   * Never trust gateway SUCCESS alone.
   *
   * Validate our internal transaction
   * against the verified gateway response.
   */
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

  return finalizeWalletTopup(
    payment._id.toString(),
    verification
  );
}

/**
 * Final wallet fulfillment.
 *
 * Gateway payment:
 *     verified SUCCESS
 *
 * Internal wallet:
 *     creditWallet()
 *
 * Ledger:
 *     immutable SUCCESS transaction
 */
export async function finalizeWalletTopup(
  paymentTransactionId: string,
  verification: VerifyPaymentResult
) {
  await connectToDB();

  if (
    !Types.ObjectId.isValid(
      paymentTransactionId
    )
  ) {
    throw new Error(
      "Invalid payment transaction ID"
    );
  }

  const payment =
    await PaymentTransaction.findById(
      paymentTransactionId
    );

  if (!payment) {
    throw new Error(
      "Payment transaction not found"
    );
  }

  /**
   * Idempotency.
   */
  if (
    payment.status === "successful"
  ) {
    return {
      success: true,
      alreadyProcessed: true,
      reference: payment.reference,
      amount: payment.amount,
      provider: payment.provider,
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
   * Revalidate the verified gateway data.
   */
  if (
    verification.status !== "SUCCESS"
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

  /**
   * Keep providerReference synchronized with
   * the verified gateway response.
   */
  if (
    verification.providerReference
  ) {
    await PaymentTransaction.findByIdAndUpdate(
      payment._id,
      {
        $set: {
          providerReference:
            verification.providerReference,
        },
      }
    );
  }

  /**
   * This reference must be unique.
   *
   * creditWallet() should enforce uniqueness
   * at the wallet-ledger level as well.
   */
  const walletReference =
    `WALLET-TOPUP-${payment.reference}`;

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

  /**
   * Only mark PaymentTransaction successful
   * after the wallet ledger operation succeeds.
   *
   * The update is conditional on pending status.
   */
  await PaymentTransaction.findOneAndUpdate(
    {
      _id: payment._id,
      status: "pending",
    },
    {
      $set: {
        status: "successful",

        providerReference:
          verification.providerReference ??
          payment.providerReference,

        verifiedAt: new Date(),

        gatewayResponse:
          verification.raw,
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

    provider:
      payment.provider,
  };
}