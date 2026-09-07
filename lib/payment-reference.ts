// lib/payment-reference.ts
import crypto from "crypto";

export function generatePaymentReference(
  provider: "PAYSTACK" | "FLUTTERWAVE"
) {
  const random = crypto
    .randomBytes(8)
    .toString("hex")
    .toUpperCase();

  return `MS-${provider}-${Date.now()}-${random}`;
}