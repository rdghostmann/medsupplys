// /lib/payment-reference.ts

import crypto from "crypto"

export type PaymentProvider = "PAYSTACK" | "FLUTTERWAVE"

export function generatePaymentReference(provider: PaymentProvider): string {
  const random = crypto.randomBytes(8).toString("hex").toUpperCase()

  return `MS-${provider}-${Date.now()}-${random}`
}
