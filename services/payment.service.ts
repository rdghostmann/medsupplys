// /services/payment.service.ts

"use server"

import { Types } from "mongoose"

import { connectToDB } from "@/lib/connectToDB"

import PaymentTransaction from "@/models/PaymentTransaction"
import { User } from "@/models/User"

import { creditWallet, getOrCreateBuyerWallet } from "@/services/wallet.service"

import { generatePaymentReference } from "@/lib/payment-reference"

import { PaystackPaymentProvider } from "@/services/payments/paystack.service"

import { FlutterwavePaymentProvider } from "@/services/payments/flutterwave.service"

import type {
  PaymentProvider as PaymentProviderName,
  VerifyPaymentResult,
} from "@/services/payments/payment.types"

const providers = {
  PAYSTACK: new PaystackPaymentProvider(),
  FLUTTERWAVE: new FlutterwavePaymentProvider(),
}

function getProvider(provider: PaymentProviderName) {
  return providers[provider]
}

function assertValidAmount(amount: number) {
  if (!Number.isFinite(amount)) {
    throw new Error("Invalid wallet top-up amount")
  }

  if (amount < 100) {
    throw new Error("Minimum wallet top-up is ₦100")
  }

  if (amount > 50_000_000) {
    throw new Error("Wallet top-up amount exceeds the allowed limit")
  }
}

function assertValidProvider(provider: PaymentProviderName) {
  if (provider !== "PAYSTACK" && provider !== "FLUTTERWAVE") {
    throw new Error("Unsupported payment provider")
  }
}

/**
 * Initialize a wallet top-up.
 *
 * This creates our internal PaymentTransaction first,
 * then initializes the external payment gateway.
 */
export async function initializeWalletTopup(params: {
  buyerId: string
  provider: PaymentProviderName
  amount: number
  callbackUrl: string
}) {
  await connectToDB()

  assertValidAmount(params.amount)
  assertValidProvider(params.provider)

  if (!Types.ObjectId.isValid(params.buyerId)) {
    throw new Error("Invalid buyer ID")
  }

  const buyer = await User.findById(params.buyerId).lean()

  if (!buyer) {
    throw new Error("Buyer account not found")
  }

  if (buyer.role !== "buyer") {
    throw new Error("Only buyers can fund a buyer wallet")
  }

  if (buyer.status !== "active") {
    throw new Error("Buyer account is not active")
  }

  const wallet = await getOrCreateBuyerWallet(params.buyerId)

  if (!wallet) {
    throw new Error("Unable to create or retrieve wallet")
  }

  if (wallet.status !== "ACTIVE") {
    throw new Error("Wallet is not currently available")
  }

  const reference = generatePaymentReference(params.provider)

  const paymentProvider =
    params.provider === "PAYSTACK" ? "paystack" : "flutterwave"

  const paymentTransaction = await PaymentTransaction.create({
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
  })

  const paymentTransactionId = paymentTransaction._id.toString()

  try {
    const provider = getProvider(params.provider)

    const buyerName =
      `${buyer.firstName ?? ""} ${buyer.lastName ?? ""}`.trim() ||
      buyer.organizationName ||
      buyer.email

    const result = await provider.initializePayment({
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
    })

    await PaymentTransaction.findByIdAndUpdate(paymentTransactionId, {
      $set: {
        providerReference: result.providerReference,
      },
    })

    return {
      success: true,

      paymentTransactionId,

      reference,

      provider: params.provider,

      checkoutUrl: result.checkoutUrl,
    }
  } catch (error) {
    // Preserve existing metadata and add the failure reason.
    await PaymentTransaction.findByIdAndUpdate(paymentTransactionId, {
      $set: {
        status: "failed",
        "metadata.initializationError":
          error instanceof Error
            ? error.message
            : "Payment initialization failed",
      },
    })

    throw error
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
export async function verifyWalletTopup(reference: string, buyerId?: string) {
  await connectToDB()

  const normalizedReference = String(reference ?? "").trim()

  if (!normalizedReference) {
    throw new Error("Payment reference is required")
  }

  const payment = await PaymentTransaction.findOne({
    reference: normalizedReference,
  })

  if (!payment) {
    throw new Error("Payment transaction not found")
  }

  if (payment.purpose !== "wallet_topup") {
    throw new Error("Invalid payment purpose")
  }

  /**
   * Browser ownership protection.
   */
  if (buyerId) {
    if (!Types.ObjectId.isValid(buyerId)) {
      throw new Error("Invalid buyer ID")
    }

    if (payment.buyerId.toString() !== buyerId) {
      throw new Error("You are not authorized to verify this payment")
    }
  }

  /**
   * Idempotency.
   */
  if (payment.status === "successful") {
    return {
      success: true,
      alreadyProcessed: true,
      status: "SUCCESS" as const,
      reference: payment.reference,
      amount: payment.amount,
      provider: payment.provider,
    }
  }

  let verification: VerifyPaymentResult

  /**
   * Flutterwave verification requires
   * the Flutterwave transaction ID.
   */
  if (payment.provider === "flutterwave") {
    if (!payment.providerReference) {
      throw new Error("Flutterwave transaction ID is missing")
    }

    verification = await getProvider("FLUTTERWAVE").verifyPayment(
      payment.providerReference
    )
  } else if (payment.provider === "paystack") {

  /**
   * Paystack verifies using our internal
   * Paystack reference.
   */
    verification = await getProvider("PAYSTACK").verifyPayment(
      payment.reference
    )
  } else {
    throw new Error("Unsupported payment provider")
  }

  /**
   * Payment is not successful.
   */
  if (verification.status !== "SUCCESS") {
    await PaymentTransaction.findByIdAndUpdate(payment._id, {
      $set: {
        status: verification.status === "FAILED" ? "failed" : "pending",

        gatewayResponse: verification.raw,
      },
    })

    return {
      success: false,

      status: verification.status,

      reference: payment.reference,

      amount: payment.amount,

      provider: payment.provider,
    }
  }

  /**
   * Never trust gateway SUCCESS alone.
   *
   * Validate our internal transaction
   * against the verified gateway response.
   */
  if (verification.reference !== payment.reference) {
    throw new Error("Payment reference mismatch")
  }

  if (verification.currency !== payment.currency) {
    throw new Error("Payment currency mismatch")
  }

  if (Number(verification.amount) !== Number(payment.amount)) {
    throw new Error("Payment amount mismatch")
  }

  return finalizeWalletTopup(payment._id.toString(), verification)
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
 *
 * PaymentTransaction:
 *     pending -> successful
 *
 * The wallet ledger reference is idempotent:
 *
 *     WALLET-TOPUP-{payment.reference}
 *
 * This protects against:
 * - browser callback + webhook arriving together
 * - duplicate webhook deliveries
 * - user refreshing the callback page
 * - repeated verification requests
 */
export async function finalizeWalletTopup(
  paymentTransactionId: string,
  verification: VerifyPaymentResult
) {
  await connectToDB()

  if (!Types.ObjectId.isValid(paymentTransactionId)) {
    throw new Error("Invalid payment transaction ID")
  }

  /**
   * Load the internal payment transaction.
   */
  const payment = await PaymentTransaction.findById(paymentTransactionId)

  if (!payment) {
    throw new Error("Payment transaction not found")
  }

  /**
   * ---------------------------------------------------------
   * 1. IDEMPOTENCY
   * ---------------------------------------------------------
   *
   * If another callback/webhook already finalized
   * this PaymentTransaction, nothing else needs to happen.
   */
  if (payment.status === "successful") {
    return {
      success: true,
      alreadyProcessed: true,
      reference: payment.reference,
      amount: payment.amount,
      provider: payment.provider,
    }
  }

  /**
   * A failed/cancelled payment cannot be finalized.
   */
  if (payment.status !== "pending") {
    throw new Error(`Payment cannot be finalized from status ${payment.status}`)
  }

  /**
   * ---------------------------------------------------------
   * 2. VALIDATE VERIFIED GATEWAY RESPONSE
   * ---------------------------------------------------------
   *
   * Never trust the fact that the gateway reported SUCCESS.
   *
   * The verified gateway response must match our own
   * PaymentTransaction exactly.
   */
  if (verification.status !== "SUCCESS") {
    throw new Error("Payment is not successful")
  }

  if (verification.reference !== payment.reference) {
    throw new Error("Payment reference mismatch")
  }

  if (verification.currency !== payment.currency) {
    throw new Error("Payment currency mismatch")
  }

  if (Number(verification.amount) !== Number(payment.amount)) {
    throw new Error("Payment amount mismatch")
  }

  /**
   * ---------------------------------------------------------
   * 3. SYNCHRONIZE PROVIDER REFERENCE
   * ---------------------------------------------------------
   */
  if (
    verification.providerReference &&
    payment.providerReference !== verification.providerReference
  ) {
    payment.providerReference = verification.providerReference
  }

  /**
   * ---------------------------------------------------------
   * 4. IDEMPOTENT WALLET REFERENCE
   * ---------------------------------------------------------
   *
   * This reference is deterministic.
   *
   * The same gateway payment can therefore never create
   * multiple successful wallet credits.
   */
  const walletReference = `WALLET-TOPUP-${payment.reference}`

  /**
   * ---------------------------------------------------------
   * 5. CREDIT WALLET
   * ---------------------------------------------------------
   *
   * creditWallet() is responsible for:
   *
   * - wallet balance mutation
   * - immutable wallet ledger entry
   * - ledger uniqueness
   * - concurrent duplicate protection
   *
   * If browser callback and webhook arrive simultaneously,
   * only one request will actually create the wallet credit.
   */
  const walletResult = await creditWallet({
    buyerId: payment.buyerId.toString(),

    amount: payment.amount,

    reference: walletReference,

    description: `Wallet top-up via ${payment.provider}`,

    source: payment.provider === "paystack" ? "PAYSTACK" : "FLUTTERWAVE",

    paymentTransactionId: payment._id.toString(),
  })

  /**
   * A successful wallet operation is required before
   * the payment can be marked successful.
   */
  if (!walletResult.success) {
    throw new Error(
      walletResult.message ?? "Wallet top-up could not be completed"
    )
  }

  /**
   * ---------------------------------------------------------
   * 6. ATOMIC PAYMENT STATE TRANSITION
   * ---------------------------------------------------------
   *
   * This is the important hardening.
   *
   * Only a PaymentTransaction that is STILL pending
   * may transition to successful.
   *
   * If two requests arrive simultaneously:
   *
   * Request A:
   *   pending -> successful  ✅
   *
   * Request B:
   *   pending -> successful  ❌
   *
   * Request B will not overwrite the already-finalized
   * transaction because of the status predicate.
   */
  const finalizedPayment = await PaymentTransaction.findOneAndUpdate(
    {
      _id: payment._id,

      status: "pending",
    },
    {
      $set: {
        status: "successful",

        providerReference:
          verification.providerReference ?? payment.providerReference,

        verifiedAt: new Date(),

        gatewayResponse: verification.raw,
      },
    },
    {
      new: true,
    }
  )

  /**
   * ---------------------------------------------------------
   * 7. HANDLE CONCURRENT FINALIZATION
   * ---------------------------------------------------------
   *
   * If this request lost the race, the wallet credit was
   * already safely handled by creditWallet() and another
   * request has changed PaymentTransaction to successful.
   *
   * We therefore re-read the payment and treat the operation
   * as already processed.
   */
  if (!finalizedPayment) {
    const currentPayment = await PaymentTransaction.findById(payment._id).lean()

    if (currentPayment?.status === "successful") {
      return {
        success: true,
        alreadyProcessed: true,
        reference: currentPayment.reference,
        amount: currentPayment.amount,
        provider: currentPayment.provider,
      }
    }

    /**
     * This is an unexpected state:
     *
     * wallet credit succeeded, but the payment could not
     * transition from pending -> successful.
     *
     * Do not pretend the operation failed silently.
     */
    throw new Error(
      "Wallet was credited, but payment finalization could not be completed"
    )
  }

  /**
   * ---------------------------------------------------------
   * 8. SUCCESS
   * ---------------------------------------------------------
   */
  return {
    success: true,

    alreadyProcessed: walletResult.alreadyProcessed,

    reference: finalizedPayment.reference,

    amount: finalizedPayment.amount,

    provider: finalizedPayment.provider,
  }
}
