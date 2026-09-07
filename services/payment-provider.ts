// services/payment-provider.ts

import { InitializePaymentParams, InitializePaymentResult, VerifyPaymentResult } from "@/types";


export interface PaymentProvider {
  initializePayment(
    params: InitializePaymentParams
  ): Promise<InitializePaymentResult>;

  verifyPayment(
    reference: string
  ): Promise<VerifyPaymentResult>;
}