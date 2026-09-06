// lib/seed/creditTransaction.seed.ts
import { Types } from "mongoose";

import { connectToDB } from "@/lib/connectToDB";
import { User } from "@/models/User";
import { CreditAccount } from "@/models/CreditAccount";
import { CreditTransaction } from "@/models/CreditTransaction";
import { Order } from "@/models/Order";

const BUYER_ID = new Types.ObjectId(
  "6a9cb82d853e785e43c110b8"
);

const BUYER_NAME =
  "Lagos University Teaching Hospital (LUTH)";

const TRANSACTION_REFERENCE = "CRD_ORD-8820";

export async function seedCreditTransaction() {
  await connectToDB();

  const buyer = await User.findById(BUYER_ID)
    .select("_id username role organizationName")
    .lean();

  if (!buyer) {
    throw new Error(
      `Buyer ${BUYER_ID.toString()} was not found.`
    );
  }

  if (buyer.role !== "buyer") {
    throw new Error(
      `User ${BUYER_ID.toString()} is not a buyer.`
    );
  }

  const creditAccount = await CreditAccount.findOne()
    .where("buyerId")
    .equals(BUYER_ID.toString())
    .select("_id buyerId")
    .lean();

  if (!creditAccount) {
    throw new Error(
      `Credit account for buyer ${BUYER_ID.toString()} was not found.`
    );
  }

  const matchingOrder = await Order.findOne()
    .where("orderNumber")
    .equals("ORD-8820")
    .select("_id")
    .lean();

  const creditTransaction = await CreditTransaction.findOneAndUpdate(
    {
      reference: TRANSACTION_REFERENCE,
    },
    {
      $set: {
        creditAccountId: creditAccount._id,
        buyerId: BUYER_ID,
        type: "CREDIT_PURCHASE",
        amount: 1_200_000,
        direction: "CHARGE",
        balanceBefore: 0,
        balanceAfter: 1_200_000,
        reference: TRANSACTION_REFERENCE,
        ...(matchingOrder
          ? { orderId: matchingOrder._id }
          : {}),
        description:
          "Net-30 Credit Procurement for Artemether ACT Forte Course",
        createdAt: new Date(
          "2025-01-11T11:00:00.000Z"
        ),
      },
    },
    {
      upsert: true,
      new: true,
      includeResultMetadata: false,
      setDefaultsOnInsert: true,
    }
  );

  if (!creditTransaction) {
    throw new Error(
      "Failed to seed credit transaction."
    );
  }

  return {
    id: creditTransaction._id.toString(),
    creditAccountId:
      creditTransaction.creditAccountId.toString(),
    buyerId: creditTransaction.buyerId.toString(),
    buyerName: BUYER_NAME,
    reference: creditTransaction.reference,
    amount: creditTransaction.amount,
    direction: creditTransaction.direction,
    balanceBefore: creditTransaction.balanceBefore,
    balanceAfter: creditTransaction.balanceAfter,
    description: creditTransaction.description,
    orderId: creditTransaction.orderId?.toString(),
    createdAt: creditTransaction.createdAt.toISOString(),
  };
}
