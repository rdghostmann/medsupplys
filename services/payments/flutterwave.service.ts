// /services/payments/flutterwave.service.ts

import type {
  InitializePaymentParams,
  InitializePaymentResult,
  VerifyPaymentResult,
} from "./payment.types";

import type { PaymentProvider } from "./payment-provider";

const FLUTTERWAVE_BASE_URL =
  "https://api.flutterwave.com/v3";

function getFlutterwaveSecretKey(): string {
  const key = process.env.FLW_SECRET_KEY;

  if (!key) {
    throw new Error(
      "FLW_SECRET_KEY is not configured"
    );
  }

  return key;
}

export class FlutterwavePaymentProvider
  implements PaymentProvider
{
  async initializePayment(
    params: InitializePaymentParams
  ): Promise<InitializePaymentResult> {
    const secretKey =
      getFlutterwaveSecretKey();

    const response = await fetch(
      `${FLUTTERWAVE_BASE_URL}/payments`,
      {
        method: "POST",

        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          tx_ref: params.reference,

          amount: params.amount,

          currency: params.currency,

          redirect_url: params.callbackUrl,

          customer: {
            email: params.email,

            name: params.name,

            ...(params.phone
              ? {
                  phonenumber: params.phone,
                }
              : {}),
          },

          customizations: {
            title: "MedSupply Wallet",
            description:
              "Buyer wallet top-up",
          },

          meta: {
            buyerId: params.buyerId,

            purpose: params.purpose,

            ...(params.metadata ?? {}),
          },
        }),

        cache: "no-store",
      }
    );

    const data = await response.json();

    if (
      !response.ok ||
      data?.status !== "success"
    ) {
      throw new Error(
        data?.message ||
          "Unable to initialize Flutterwave payment"
      );
    }

    const checkoutUrl =
      data?.data?.link;

    if (!checkoutUrl) {
      throw new Error(
        "Flutterwave did not return a checkout URL"
      );
    }

    return {
      success: true,

      provider: "FLUTTERWAVE",

      reference: params.reference,

      checkoutUrl,

      message: data.message,
    };
  }

  async verifyPayment(
    reference: string
  ): Promise<VerifyPaymentResult> {
    /**
     * Flutterwave verification requires
     * the provider transaction ID.
     *
     * Therefore this method expects `reference`
     * to be the provider transaction ID when
     * used directly.
     *
     * The main payment service resolves the
     * stored providerReference before calling
     * this method.
     */
    const secretKey =
      getFlutterwaveSecretKey();

    const response = await fetch(
      `${FLUTTERWAVE_BASE_URL}/transactions/${encodeURIComponent(
        reference
      )}/verify`,
      {
        method: "GET",

        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/json",
        },

        cache: "no-store",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,

        provider: "FLUTTERWAVE",

        reference,

        amount: 0,

        currency: "NGN",

        status: "FAILED",

        raw: data,

        message:
          data?.message ||
          "Unable to verify Flutterwave transaction",
      };
    }

    const transaction =
      data?.data;

    if (!transaction) {
      return {
        success: false,

        provider: "FLUTTERWAVE",

        reference,

        amount: 0,

        currency: "NGN",

        status: "FAILED",

        raw: data,

        message:
          "Flutterwave verification returned no transaction",
      };
    }

    const status =
      transaction.status === "successful"
        ? "SUCCESS"
        : transaction.status === "failed"
        ? "FAILED"
        : "PENDING";

    return {
      success: status === "SUCCESS",

      provider: "FLUTTERWAVE",

      reference:
        transaction.tx_ref ??
        reference,

      providerReference:
        transaction.id
          ? String(transaction.id)
          : undefined,

      amount:
        Number(transaction.amount),

      currency:
        transaction.currency ?? "NGN",

      status,

      raw: transaction,

      message:
        transaction.processor_response,
    };
  }
}