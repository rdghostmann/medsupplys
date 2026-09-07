// lib/seed/wallet.seed.ts

import { connectToDB } from "@/lib/connectToDB";

import { User } from "@/models/User";
import { Wallet } from "@/models/Wallet";
import { WalletTransaction } from "@/models/WalletTransaction";

export async function seedBuyerWallet() {
  await connectToDB();

  const buyer =
    await User.findOne({
      username: "luth-procurement",
      role: "buyer",
    }).select(
        "_id username firstName lastName organizationName"
    );

  if (!buyer) {
    throw new Error(
      "Buyer 'luth-procurement' was not found. Seed users first."
    );
  }

  const buyerId = buyer._id;

  const buyerName =
    buyer.organizationName ||
    `${buyer.firstName || ""} ${
      buyer.lastName || ""
    }`.trim();

  /**
   * ==========================================================
   * BUYER WALLET
   * ==========================================================
   *
   * We use buyerId as the unique identity.
   *
   * The old:
   *
   *   wlt-buyer-1
   *
   * is an application seed reference only.
   *
   * MongoDB generates the actual _id.
   */
  const wallet =
    await Wallet.findOneAndUpdate(
      {
        buyerId,
      },
      {
        $set: {
          buyerName,
          balance: 1_450_000,
          currency: "NGN",
          status: "ACTIVE",
        },
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );

  if (!wallet) {
    throw new Error(
      "Unable to create Buyer wallet."
    );
  }

  /**
   * ==========================================================
   * WALLET TRANSACTIONS
   * ==========================================================
   */

  const transactions = [
    {
      seedId: "wtx-001",

      walletId: wallet._id,
      buyerId,

      type: "TOPUP" as const,

      amount: 2_000_000,

      direction: "CREDIT" as const,

      balanceBefore: 0,

      balanceAfter: 2_000_000,

      reference:
        "PSTK_TOPUP_88492019",

      description:
        "Paystack Direct Bank Gateway Settlement — Wallet Funding",

      status: "SUCCESS" as const,

      metadata: {
        gateway: "Paystack",
        channel: "card_or_bank",
      },

      createdAt:
        new Date(
          "2025-01-10T09:15:00.000Z"
        ),
    },

    {
      seedId: "wtx-002",

      walletId: wallet._id,
      buyerId,

      type: "PURCHASE" as const,

      amount: 550_000,

      direction: "DEBIT" as const,

      balanceBefore: 2_000_000,

      balanceAfter: 1_450_000,

      reference:
        "MS_PUR_ORD-8821",

      description:
        "Payment for Order #ORD-8821 (Amoxicillin 500mg Batch EMB-44)",

      status: "SUCCESS" as const,

      metadata: {
        orderId: "ord-8821",
      },

      createdAt:
        new Date(
          "2025-01-12T14:20:00.000Z"
        ),
    },
  ];

  const transactionResults = {
    created: [] as string[],
    updated: [] as string[],
  };

  /**
   * Reference is unique, so it gives us
   * a reliable idempotency key.
   */
  for (const transaction of transactions) {
    const {
      seedId,
      ...transactionDocument
    } = transaction;

    const existing =
      await WalletTransaction.findOne({
        reference:
          transactionDocument.reference,
      });

    if (existing) {
      await WalletTransaction.updateOne(
        {
          _id: existing._id,
        },
        {
          $set: {
            walletId:
              wallet._id,
            buyerId,
            type:
              transactionDocument.type,
            amount:
              transactionDocument.amount,
            direction:
              transactionDocument.direction,
            balanceBefore:
              transactionDocument.balanceBefore,
            balanceAfter:
              transactionDocument.balanceAfter,
            description:
              transactionDocument.description,
            status:
              transactionDocument.status,
            metadata:
              transactionDocument.metadata,
          },
        }
      );

      transactionResults.updated.push(
        seedId
      );
    } else {
      await WalletTransaction.create(
        transactionDocument
      );

      transactionResults.created.push(
        seedId
      );
    }
  }

  return {
    success: true,

    buyer: {
      _id: buyer._id.toString(),
      username: buyer.username,
      organizationName:
        buyer.organizationName,
    },

    wallet: {
      _id: wallet._id.toString(),
      buyerId:
        wallet.buyerId.toString(),
      buyerName:
        wallet.buyerName,
      balance: wallet.balance,
      currency: wallet.currency,
      status: wallet.status,
    },

    transactions: {
      total: transactions.length,
      ...transactionResults,
    },
  };
}