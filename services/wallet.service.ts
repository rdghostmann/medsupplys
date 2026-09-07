// /services/wallet.service.ts

"use server";

import {
  ClientSession,
  Types,
} from "mongoose";

import { connectToDB } from "@/lib/connectToDB";

import { User } from "@/models/User";
import { Wallet } from "@/models/Wallet";
import {
  WalletTransaction,
  WalletTransactionType,
  WalletTransactionDirection,
  WalletTransactionSource,
} from "@/models/WalletTransaction";

/* =========================================================
   TYPES
========================================================= */

interface WalletMutationParams {
  buyerId: string | Types.ObjectId;

  amount: number;

  reference: string;

  description: string;

  source: WalletTransactionSource;

  type: WalletTransactionType;

  paymentTransactionId?: string | Types.ObjectId;

  orderId?: string | Types.ObjectId;

  metadata?: Record<string, unknown>;

  session?: ClientSession;
}

/* =========================================================
   HELPERS
========================================================= */

function toObjectId(
  value: string | Types.ObjectId
): Types.ObjectId {
  return value instanceof Types.ObjectId
    ? value
    : new Types.ObjectId(value);
}

function validateAmount(amount: number) {
  if (!Number.isFinite(amount)) {
    throw new Error("Invalid wallet amount.");
  }

  if (amount <= 0) {
    throw new Error(
      "Wallet amount must be greater than zero."
    );
  }

  // Keep financial values to 2 decimal places.
  if (
    Math.round((amount + Number.EPSILON) * 100) /
      100 !==
    amount
  ) {
    throw new Error(
      "Wallet amount cannot contain more than 2 decimal places."
    );
  }
}

/* =========================================================
   GET / CREATE WALLET
========================================================= */

export async function getOrCreateBuyerWallet(
  buyerId: string | Types.ObjectId
) {
  await connectToDB();

  const buyerObjectId = toObjectId(buyerId);

  const buyer = await User.findById(
    buyerObjectId
  )
    .select("_id role status")
    .lean();

  if (!buyer) {
    throw new Error("Buyer account not found.");
  }

  if (buyer.role !== "buyer") {
    throw new Error(
      "Only buyer accounts can have buyer wallets."
    );
  }

  if (buyer.status !== "active") {
    throw new Error(
      "Your account is not active."
    );
  }

  let wallet = await Wallet.findOne({
    buyerId: buyerObjectId,
  });

  if (!wallet) {
    wallet = await Wallet.create({
      buyerId: buyerObjectId,
      currency: "NGN",
      availableBalance: 0,
      totalDeposited: 0,
      totalSpent: 0,
      totalRefunded: 0,
      totalReversed: 0,
      status: "ACTIVE",
    });
  }

  return wallet;
}

/* =========================================================
   GET WALLET
========================================================= */

export async function getBuyerWallet(
  buyerId: string | Types.ObjectId
) {
  await connectToDB();

  const buyerObjectId = toObjectId(buyerId);

  const wallet = await Wallet.findOne({
    buyerId: buyerObjectId,
  }).lean();

  if (!wallet) {
    return null;
  }

  return wallet;
}

/* =========================================================
   GET BALANCE
========================================================= */

export async function getBuyerWalletBalance(
  buyerId: string | Types.ObjectId
) {
  const wallet =
    await getBuyerWallet(buyerId);

  if (!wallet) {
    return {
      balance: 0,
      currency: "NGN" as const,
      status: "ACTIVE" as const,
    };
  }

  return {
    balance: wallet.availableBalance,
    currency: wallet.currency,
    status: wallet.status,
  };
}

/* =========================================================
   CREDIT WALLET
========================================================= */

export async function creditWallet(
  params: Omit<
    WalletMutationParams,
    "type"
  > & {
    type?: "TOPUP" | "REFUND" | "REVERSAL" | "ADJUSTMENT";
  }
) {
  await connectToDB();

  validateAmount(params.amount);

  const buyerId = toObjectId(
    params.buyerId
  );

  /*
   * Idempotency check.
   *
   * A reference can only produce one successful
   * wallet ledger entry.
   */
  const existingTransaction =
    await WalletTransaction.findOne({
      reference: params.reference,
    }).lean();

  if (existingTransaction) {
    return {
      success:
        existingTransaction.status ===
        "SUCCESS",

      alreadyProcessed: true,

      transaction:
        existingTransaction,
    };
  }

  const session =
    params.session ??
    await Wallet.startSession();

  const ownsSession = !params.session;

  try {
    if (ownsSession) {
      session.startTransaction();
    }

    const wallet =
      await Wallet.findOne({
        buyerId,
      }).session(session);

    if (!wallet) {
      throw new Error(
        "Buyer wallet not found."
      );
    }

    if (wallet.status !== "ACTIVE") {
      throw new Error(
        "Wallet is not active."
      );
    }

    const balanceBefore =
      wallet.availableBalance;

    const balanceAfter =
      balanceBefore + params.amount;

    wallet.availableBalance =
      balanceAfter;

    /*
     * TOPUP contributes to deposited funds.
     */
    if (
      params.type === undefined ||
      params.type === "TOPUP"
    ) {
      wallet.totalDeposited +=
        params.amount;
    }

    if (params.type === "REFUND") {
      wallet.totalRefunded +=
        params.amount;
    }

    if (params.type === "REVERSAL") {
      wallet.totalReversed +=
        params.amount;
    }

    await wallet.save({ session });

    const transaction =
      await WalletTransaction.create(
        [
          {
            walletId: wallet._id,

            buyerId,

            type:
              params.type ?? "TOPUP",

            amount: params.amount,

            direction:
              "CREDIT" as WalletTransactionDirection,

            balanceBefore,

            balanceAfter,

            reference:
              params.reference,

            description:
              params.description,

            status: "SUCCESS",

            source: params.source,

            paymentTransactionId:
              params.paymentTransactionId
                ? toObjectId(
                    params.paymentTransactionId
                  )
                : undefined,

            orderId:
              params.orderId
                ? toObjectId(
                    params.orderId
                  )
                : undefined,

            metadata:
              params.metadata,
          },
        ],
        { session }
      );

    if (ownsSession) {
      await session.commitTransaction();
    }

    return {
      success: true,

      alreadyProcessed: false,

      wallet,

      transaction:
        transaction[0],
    };
  } catch (error) {
    if (ownsSession) {
      await session.abortTransaction();
    }

    throw error;
  } finally {
    if (ownsSession) {
      await session.endSession();
    }
  }
}

/* =========================================================
   DEBIT WALLET
========================================================= */

export async function debitWallet(
  params: Omit<
    WalletMutationParams,
    "type"
  > & {
    type?: "PURCHASE" | "ADJUSTMENT";
  }
) {
  await connectToDB();

  validateAmount(params.amount);

  const buyerId = toObjectId(
    params.buyerId
  );

  /*
   * Prevent duplicate debit.
   */
  const existingTransaction =
    await WalletTransaction.findOne({
      reference: params.reference,
    }).lean();

  if (existingTransaction) {
    return {
      success:
        existingTransaction.status ===
        "SUCCESS",

      alreadyProcessed: true,

      transaction:
        existingTransaction,
    };
  }

  const session =
    params.session ??
    await Wallet.startSession();

  const ownsSession = !params.session;

  try {
    if (ownsSession) {
      session.startTransaction();
    }

    const wallet =
      await Wallet.findOne({
        buyerId,
      }).session(session);

    if (!wallet) {
      throw new Error(
        "Buyer wallet not found."
      );
    }

    if (wallet.status !== "ACTIVE") {
      throw new Error(
        "Wallet is not active."
      );
    }

    if (
      wallet.availableBalance <
      params.amount
    ) {
      throw new Error(
        "Insufficient wallet balance."
      );
    }

    const balanceBefore =
      wallet.availableBalance;

    const balanceAfter =
      balanceBefore - params.amount;

    wallet.availableBalance =
      balanceAfter;

    if (
      params.type === undefined ||
      params.type === "PURCHASE"
    ) {
      wallet.totalSpent +=
        params.amount;
    }

    await wallet.save({ session });

    const transaction =
      await WalletTransaction.create(
        [
          {
            walletId: wallet._id,

            buyerId,

            type:
              params.type ?? "PURCHASE",

            amount: params.amount,

            direction:
              "DEBIT" as WalletTransactionDirection,

            balanceBefore,

            balanceAfter,

            reference:
              params.reference,

            description:
              params.description,

            status: "SUCCESS",

            source: params.source,

            paymentTransactionId:
              params.paymentTransactionId
                ? toObjectId(
                    params.paymentTransactionId
                  )
                : undefined,

            orderId:
              params.orderId
                ? toObjectId(
                    params.orderId
                  )
                : undefined,

            metadata:
              params.metadata,
          },
        ],
        { session }
      );

    if (ownsSession) {
      await session.commitTransaction();
    }

    return {
      success: true,

      alreadyProcessed: false,

      wallet,

      transaction:
        transaction[0],
    };
  } catch (error) {
    if (ownsSession) {
      await session.abortTransaction();
    }

    throw error;
  } finally {
    if (ownsSession) {
      await session.endSession();
    }
  }
}

/* =========================================================
   HOLD WALLET FUNDS
========================================================= */

export async function holdWalletFunds(
  params: Omit<
    WalletMutationParams,
    "type"
  >
) {
  return debitWallet({
    ...params,

    type: "PURCHASE",

    description:
      params.description ||
      "Wallet funds held for order",
  });
}

/* =========================================================
   RELEASE WALLET HOLD
========================================================= */

export async function releaseWalletHold(
  params: Omit<
    WalletMutationParams,
    "type"
  >
) {
  return creditWallet({
    ...params,

    type: "REVERSAL",

    description:
      params.description ||
      "Wallet funds released",
  });
}

/* =========================================================
   CAPTURE WALLET HOLD
========================================================= */

export async function captureWalletHold(
  params: Omit<
    WalletMutationParams,
    "type"
  >
) {
  /*
   * The debit has already occurred when the
   * funds were held.
   *
   * Therefore capture does NOT debit again.
   *
   * This method exists as a domain operation so
   * the order-payment workflow can explicitly
   * mark the hold as captured later.
   */
  return {
    success: true,
    captured: true,
    reference: params.reference,
  };
}

/* =========================================================
   REFUND WALLET
========================================================= */

export async function refundWallet(
  params: Omit<
    WalletMutationParams,
    "type"
  >
) {
  return creditWallet({
    ...params,

    type: "REFUND",

    description:
      params.description ||
      "Order refund credited to wallet",
  });
}

/* =========================================================
   WALLET TRANSACTION HISTORY
========================================================= */

export async function getWalletTransactions(
  buyerId: string | Types.ObjectId,
  options?: {
    page?: number;
    limit?: number;
    type?: WalletTransactionType;
    status?: string;
  }
) {
  await connectToDB();

  const buyerObjectId =
    toObjectId(buyerId);

  const page = Math.max(
    options?.page ?? 1,
    1
  );

  const limit = Math.min(
    Math.max(options?.limit ?? 20, 1),
    100
  );

  const skip =
    (page - 1) * limit;

  const filter: Record<
    string,
    unknown
  > = {
    buyerId: buyerObjectId,
  };

  if (options?.type) {
    filter.type = options.type;
  }

  if (options?.status) {
    filter.status = options.status;
  }

  const [
    transactions,
    total,
  ] = await Promise.all([
    WalletTransaction.find(filter)
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit)
      .lean(),

    WalletTransaction.countDocuments(
      filter
    ),
  ]);

  return {
    transactions,

    pagination: {
      page,

      limit,

      total,

      pages: Math.ceil(
        total / limit
      ),
    },
  };
}