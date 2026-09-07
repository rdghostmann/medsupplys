// /services/payments/paystack.service.ts

import type {
  InitializePaymentParams,
  InitializePaymentResult,
  VerifyPaymentResult,
} from "./payment.types";

import type { PaymentProvider } from "./payment-provider";

const PAYSTACK_BASE_URL =
  "https://api.paystack.co";

function getPaystackSecretKey(): string {
  const key = process.env.PAYSTACK_SECRET_KEY;

  if (!key) {
    throw new Error(
      "PAYSTACK_SECRET_KEY is not configured"
    );
  }

  return key;
}

function toKobo(amount: number): number {
  return Math.round(amount * 100);
}

export class PaystackPaymentProvider
  implements PaymentProvider
{
  async initializePayment(
    params: InitializePaymentParams
  ): Promise<InitializePaymentResult> {
    const secretKey = getPaystackSecretKey();

    const amountInKobo = toKobo(params.amount);

    const response = await fetch(
      `${PAYSTACK_BASE_URL}/transaction/initialize`,
      {
        method: "POST",

        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email: params.email,

          amount: String(amountInKobo),

          currency: params.currency,

          reference: params.reference,

          callback_url: params.callbackUrl,

          metadata: JSON.stringify({
            buyerId: params.buyerId,
            purpose: params.purpose,
            ...(params.metadata ?? {}),
          }),
        }),

        cache: "no-store",
      }
    );

    const data = await response.json();

    if (!response.ok || !data?.status) {
      throw new Error(
        data?.message ||
          "Unable to initialize Paystack payment"
      );
    }

    const authorizationUrl =
      data?.data?.authorization_url;

    if (!authorizationUrl) {
      throw new Error(
        "Paystack did not return a checkout URL"
      );
    }

    return {
      success: true,

      provider: "PAYSTACK",

      reference:
        data.data.reference ??
        params.reference,

      checkoutUrl: authorizationUrl,

      providerReference:
        data.data.access_code,

      message: data.message,
    };
  }

  async verifyPayment(
    reference: string
  ): Promise<VerifyPaymentResult> {
    const secretKey = getPaystackSecretKey();

    const response = await fetch(
      `${PAYSTACK_BASE_URL}/transaction/verify/${encodeURIComponent(
        reference
      )}`,
      {
        method: "GET",

        headers: {
          Authorization: `Bearer ${secretKey}`,
        },

        cache: "no-store",
      }
    );

    const data = await response.json();

    if (!response.ok || !data?.status) {
      return {
        success: false,

        provider: "PAYSTACK",

        reference,

        amount: 0,

        currency: "NGN",

        status: "FAILED",

        raw: data,

        message:
          data?.message ||
          "Unable to verify Paystack transaction",
      };
    }

    const transaction = data?.data;

    if (!transaction) {
      return {
        success: false,

        provider: "PAYSTACK",

        reference,

        amount: 0,

        currency: "NGN",

        status: "FAILED",

        raw: data,

        message:
          "Paystack verification returned no transaction",
      };
    }

    const status =
      transaction.status === "success"
        ? "SUCCESS"
        : transaction.status === "failed"
        ? "FAILED"
        : "PENDING";

    return {
      success: status === "SUCCESS",

      provider: "PAYSTACK",

      reference:
        transaction.reference ?? reference,

      providerReference:
        transaction.id
          ? String(transaction.id)
          : undefined,

      amount:
        Number(transaction.amount) / 100,

      currency:
        transaction.currency ?? "NGN",

      status,

      raw: transaction,

      message: transaction.gateway_response,
    };
  }
}