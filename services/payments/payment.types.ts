// /services/payments/payment.types.ts

export type PaymentProvider =
  | "PAYSTACK"
  | "FLUTTERWAVE";

export type PaymentPurpose =
  | "WALLET_TOPUP";

export type PaymentStatus =
  | "PENDING"
  | "SUCCESS"
  | "FAILED"
  | "CANCELLED"
  | "ABANDONED"
  | "REVERSED";

export interface InitializePaymentParams {
  buyerId: string;
  email: string;
  name: string;
  phone?: string;

  amount: number;
  currency: "NGN";

  reference: string;

  purpose: PaymentPurpose;

  callbackUrl: string;

  metadata?: Record<string, unknown>;
}

export interface InitializePaymentResult {
  success: boolean;

  provider: PaymentProvider;

  reference: string;

  checkoutUrl: string;

  providerReference?: string;

  message?: string;
}

export interface VerifyPaymentResult {
  success: boolean;

  provider: PaymentProvider;

  reference: string;

  providerReference?: string;

  amount: number;

  currency: string;

  status:
    | "SUCCESS"
    | "FAILED"
    | "PENDING";

  raw?: unknown;

  message?: string;
}

