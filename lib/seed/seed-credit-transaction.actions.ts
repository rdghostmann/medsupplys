"use server";

import { seedCreditTransaction } from "@/lib/seed/creditTransaction.seed";

export interface CreditTransactionSeedStatus {
  success: boolean;
  message: string;
  error?: string;

  transaction?: {
    id: string;
    creditAccountId: string;
    buyerId: string;
    buyerName: string;
    reference: string;
    amount: number;
    direction: string;
    balanceBefore: number;
    balanceAfter: number;
    description: string;
    orderId?: string;
    createdAt: string;
  };
}

export async function seedCreditTransactionAction(): Promise<CreditTransactionSeedStatus> {
  try {
    const transaction = await seedCreditTransaction();

    return {
      success: true,
      message: "Credit transaction seeded successfully.",
      transaction,
    };
  } catch (error) {
    console.error(
      "Credit transaction seed failed:",
      error
    );

    return {
      success: false,
      message: "Failed to seed credit transaction.",
      error:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred while seeding the credit transaction.",
    };
  }
}