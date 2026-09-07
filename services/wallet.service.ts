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

interface WalletResult {
  success: boolean;

  alreadyProcessed?: boolean;

  wallet?: unknown;

  transaction?: unknown;

  message?: string;
}

/* =========================================================
   HELPERS
========================================================= */

function toObjectId(
  value: string | Types.ObjectId
): Types.ObjectId {
  if (value instanceof Types.ObjectId) {
    return value;
  }

  if (!Types.ObjectId.isValid(value)) {
    throw new Error(
      "Invalid MongoDB ObjectId."
    );
  }

  return new Types.ObjectId(value);
}

/**
 * Financial amounts are stored in NGN at application level.
 *
 * Gateway-specific conversion, e.g. NGN -> kobo for Paystack,
 * happens at the payment-provider boundary.
 */
function validateAmount(amount: number) {
  if (!Number.isFinite(amount)) {
    throw new Error(
      "Invalid wallet amount."
    );
  }

  if (amount <= 0) {
    throw new Error(
      "Wallet amount must be greater than zero."
    );
  }

  const rounded =
    Math.round(
      (amount + Number.EPSILON) * 100
    ) / 100;

  if (rounded !== amount) {
    throw new Error(
      "Wallet amount cannot contain more than 2 decimal places."
    );
  }
}

function mergeMetadata(
  metadata: Record<string, unknown> | undefined,
  financialMetadata: Record<string, unknown>
) {
  return {
    ...(metadata ?? {}),
    ...financialMetadata,
  };
}

/* =========================================================
   EXISTING TRANSACTION / IDEMPOTENCY
========================================================= */

async function findExistingTransaction(
  reference: string,
  session?: ClientSession
) {
  const query =
    WalletTransaction.findOne({
      reference,
    });

  if (session) {
    query.session(session);
  }

  return query.lean();
}

/* =========================================================
   GET / CREATE WALLET
========================================================= */

export async function getOrCreateBuyerWallet(
  buyerId: string | Types.ObjectId
) {
  await connectToDB();

  const buyerObjectId =
    toObjectId(buyerId);

  const buyer = await User.findById(
    buyerObjectId
  )
    .select(
      "_id role status firstName lastName organizationName"
    )
    .lean();

  if (!buyer) {
    throw new Error(
      "Buyer account not found."
    );
  }

  if (buyer.role !== "buyer") {
    throw new Error(
      "Only buyer accounts can have buyer wallets."
    );
  }

  if (buyer.status !== "active") {
    throw new Error(
      "Buyer account is not active."
    );
  }

  let wallet =
    await Wallet.findOne({
      buyerId: buyerObjectId,
    });

  if (!wallet) {
    const buyerName =
      `${buyer.firstName ?? ""} ${
        buyer.lastName ?? ""
      }`.trim() ||
      buyer.organizationName ||
      "Buyer";

    try {
      wallet =
        await Wallet.create({
          buyerId:
            buyerObjectId,

          buyerName,

          currency: "NGN",

          availableBalance: 0,

          heldBalance: 0,

          totalDeposited: 0,

          totalSpent: 0,

          totalRefunded: 0,

          totalReversed: 0,

          status: "ACTIVE",
        });
    } catch (error: unknown) {
      /**
       * buyerId is unique.
       *
       * If two requests attempted wallet creation
       * simultaneously, retrieve the wallet created
       * by the competing request.
       */
      wallet =
        await Wallet.findOne({
          buyerId: buyerObjectId,
        });

      if (!wallet) {
        throw error;
      }
    }
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

  const buyerObjectId =
    toObjectId(buyerId);

  const wallet =
    await Wallet.findOne({
      buyerId: buyerObjectId,
    }).lean();

  return wallet ?? null;
}

/* =========================================================
   GET WALLET BALANCE
========================================================= */

export async function getBuyerWalletBalance(
  buyerId: string | Types.ObjectId
) {
  const wallet =
    await getBuyerWallet(
      buyerId
    );

  if (!wallet) {
    return {
      balance: 0,

      availableBalance: 0,

      heldBalance: 0,

      totalDeposited: 0,

      totalSpent: 0,

      totalRefunded: 0,

      totalReversed: 0,

      currency: "NGN" as const,

      status: "ACTIVE" as const,
    };
  }

  return {
    /**
     * `balance` retained for compatibility
     * with existing UI components.
     */
    balance:
      wallet.availableBalance,

    availableBalance:
      wallet.availableBalance,

    heldBalance:
      wallet.heldBalance,

    totalDeposited:
      wallet.totalDeposited,

    totalSpent:
      wallet.totalSpent,

    totalRefunded:
      wallet.totalRefunded,

    totalReversed:
      wallet.totalReversed,

    currency:
      wallet.currency,

    status:
      wallet.status,
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
    type?:
      | "TOPUP"
      | "REFUND"
      | "REVERSAL"
      | "ADJUSTMENT";
  }
): Promise<WalletResult> {
  await connectToDB();

  validateAmount(
    params.amount
  );

  const buyerId =
    toObjectId(params.buyerId);

  const transactionType =
    params.type ?? "TOPUP";

  /*
   * Fast idempotency check.
   *
   * The unique reference index remains the
   * final database-level protection.
   */
  const existingTransaction =
    await findExistingTransaction(
      params.reference
    );

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
    (await Wallet.startSession());

  const ownsSession =
    !params.session;

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
      balanceBefore +
      params.amount;

    const heldBalanceBefore =
      wallet.heldBalance;

    const heldBalanceAfter =
      heldBalanceBefore;

    wallet.availableBalance =
      balanceAfter;

    switch (transactionType) {
      case "TOPUP":
        wallet.totalDeposited +=
          params.amount;
        break;

      case "REFUND":
        wallet.totalRefunded +=
          params.amount;
        break;

      case "REVERSAL":
        wallet.totalReversed +=
          params.amount;
        break;

      case "ADJUSTMENT":
        break;
    }

    await wallet.save({
      session,
    });

    const transaction =
      await WalletTransaction.create(
        [
          {
            walletId:
              wallet._id,

            buyerId,

            type:
              transactionType,

            amount:
              params.amount,

            direction:
              "CREDIT" as WalletTransactionDirection,

            balanceBefore,

            balanceAfter,

            reference:
              params.reference,

            description:
              params.description,

            status:
              "SUCCESS",

            source:
              params.source,

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
              mergeMetadata(
                params.metadata,
                {
                  availableBalanceBefore:
                    balanceBefore,

                  availableBalanceAfter:
                    balanceAfter,

                  heldBalanceBefore,

                  heldBalanceAfter,
                }
              ),
          },
        ],
        {
          session,
        }
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
    type?:
      | "PURCHASE"
      | "ADJUSTMENT";
  }
): Promise<WalletResult> {
  await connectToDB();

  validateAmount(
    params.amount
  );

  const buyerId =
    toObjectId(params.buyerId);

  const transactionType =
    params.type ?? "PURCHASE";

  const existingTransaction =
    await findExistingTransaction(
      params.reference
    );

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
    (await Wallet.startSession());

  const ownsSession =
    !params.session;

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
      balanceBefore -
      params.amount;

    const heldBalanceBefore =
      wallet.heldBalance;

    const heldBalanceAfter =
      heldBalanceBefore;

    wallet.availableBalance =
      balanceAfter;

    if (
      transactionType ===
      "PURCHASE"
    ) {
      wallet.totalSpent +=
        params.amount;
    }

    await wallet.save({
      session,
    });

    const transaction =
      await WalletTransaction.create(
        [
          {
            walletId:
              wallet._id,

            buyerId,

            type:
              transactionType,

            amount:
              params.amount,

            direction:
              "DEBIT" as WalletTransactionDirection,

            balanceBefore,

            balanceAfter,

            reference:
              params.reference,

            description:
              params.description,

            status:
              "SUCCESS",

            source:
              params.source,

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
              mergeMetadata(
                params.metadata,
                {
                  availableBalanceBefore:
                    balanceBefore,

                  availableBalanceAfter:
                    balanceAfter,

                  heldBalanceBefore,

                  heldBalanceAfter,
                }
              ),
          },
        ],
        {
          session,
        }
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

/**
 * Moves money:
 *
 * availableBalance
 *       ↓
 * heldBalance
 *
 * No money is considered spent yet.
 */
export async function holdWalletFunds(
  params: Omit<
    WalletMutationParams,
    "type"
  >
): Promise<WalletResult> {
  await connectToDB();

  validateAmount(
    params.amount
  );

  const buyerId =
    toObjectId(params.buyerId);

  const existingTransaction =
    await findExistingTransaction(
      params.reference
    );

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
    (await Wallet.startSession());

  const ownsSession =
    !params.session;

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
        "Insufficient available wallet balance."
      );
    }

    const availableBefore =
      wallet.availableBalance;

    const availableAfter =
      availableBefore -
      params.amount;

    const heldBefore =
      wallet.heldBalance;

    const heldAfter =
      heldBefore +
      params.amount;

    /*
     * HOLD:
     *
     * Available ↓
     * Held ↑
     *
     * Total wallet value remains unchanged.
     */
    wallet.availableBalance =
      availableAfter;

    wallet.heldBalance =
      heldAfter;

    await wallet.save({
      session,
    });

    const transaction =
      await WalletTransaction.create(
        [
          {
            walletId:
              wallet._id,

            buyerId,

            type:
              "HOLD",

            amount:
              params.amount,

            direction:
              "DEBIT" as WalletTransactionDirection,

            /*
             * Existing ledger contract:
             *
             * balanceBefore / balanceAfter
             * represent AVAILABLE balance.
             */
            balanceBefore:
              availableBefore,

            balanceAfter:
              availableAfter,

            reference:
              params.reference,

            description:
              params.description ||
              "Wallet funds held for order",

            status:
              "SUCCESS",

            source:
              params.source,

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
              mergeMetadata(
                params.metadata,
                {
                  operation:
                    "HOLD",

                  availableBalanceBefore:
                    availableBefore,

                  availableBalanceAfter:
                    availableAfter,

                  heldBalanceBefore:
                    heldBefore,

                  heldBalanceAfter:
                    heldAfter,
                }
              ),
          },
        ],
        {
          session,
        }
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
   RELEASE WALLET HOLD
========================================================= */

/**
 * Moves money:
 *
 * heldBalance
 *       ↓
 * availableBalance
 *
 * This happens when an order is cancelled,
 * rejected, expired, or otherwise no longer
 * requires the reserved wallet funds.
 */
export async function releaseWalletHold(
  params: Omit<
    WalletMutationParams,
    "type"
  >
): Promise<WalletResult> {
  await connectToDB();

  validateAmount(
    params.amount
  );

  const buyerId =
    toObjectId(params.buyerId);

  const existingTransaction =
    await findExistingTransaction(
      params.reference
    );

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
    (await Wallet.startSession());

  const ownsSession =
    !params.session;

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
      wallet.heldBalance <
      params.amount
    ) {
      throw new Error(
        "Insufficient held wallet balance."
      );
    }

    const availableBefore =
      wallet.availableBalance;

    const availableAfter =
      availableBefore +
      params.amount;

    const heldBefore =
      wallet.heldBalance;

    const heldAfter =
      heldBefore -
      params.amount;

    wallet.availableBalance =
      availableAfter;

    wallet.heldBalance =
      heldAfter;

    await wallet.save({
      session,
    });

    const transaction =
      await WalletTransaction.create(
        [
          {
            walletId:
              wallet._id,

            buyerId,

            type:
              "RELEASE",

            amount:
              params.amount,

            direction:
              "CREDIT" as WalletTransactionDirection,

            balanceBefore:
              availableBefore,

            balanceAfter:
              availableAfter,

            reference:
              params.reference,

            description:
              params.description ||
              "Wallet funds released",

            status:
              "SUCCESS",

            source:
              params.source,

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
              mergeMetadata(
                params.metadata,
                {
                  operation:
                    "RELEASE",

                  availableBalanceBefore:
                    availableBefore,

                  availableBalanceAfter:
                    availableAfter,

                  heldBalanceBefore:
                    heldBefore,

                  heldBalanceAfter:
                    heldAfter,
                }
              ),
          },
        ],
        {
          session,
        }
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
   CAPTURE WALLET HOLD
========================================================= */

/**
 * Converts held money into an actual purchase.
 *
 * IMPORTANT:
 *
 * The original HOLD already removed the amount
 * from availableBalance.
 *
 * Therefore CAPTURE must NOT debit availableBalance
 * again.
 *
 * Instead:
 *
 * heldBalance ↓
 * totalSpent ↑
 */
export async function captureWalletHold(
  params: Omit<
    WalletMutationParams,
    "type"
  >
): Promise<WalletResult> {
  await connectToDB();

  validateAmount(
    params.amount
  );

  const buyerId =
    toObjectId(params.buyerId);

  const existingTransaction =
    await findExistingTransaction(
      params.reference
    );

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
    (await Wallet.startSession());

  const ownsSession =
    !params.session;

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
      wallet.heldBalance <
      params.amount
    ) {
      throw new Error(
        "Insufficient held wallet balance."
      );
    }

    const availableBefore =
      wallet.availableBalance;

    const availableAfter =
      availableBefore;

    const heldBefore =
      wallet.heldBalance;

    const heldAfter =
      heldBefore -
      params.amount;

    wallet.heldBalance =
      heldAfter;

    wallet.totalSpent +=
      params.amount;

    await wallet.save({
      session,
    });

    const transaction =
      await WalletTransaction.create(
        [
          {
            walletId:
              wallet._id,

            buyerId,

            type:
              "PURCHASE",

            amount:
              params.amount,

            /**
             * The actual money was removed from
             * availableBalance at HOLD time.
             *
             * CAPTURE therefore does not create
             * another available-balance debit.
             */
            direction:
              "DEBIT" as WalletTransactionDirection,

            balanceBefore:
              availableBefore,

            balanceAfter:
              availableAfter,

            reference:
              params.reference,

            description:
              params.description ||
              "Wallet-held funds captured for order",

            status:
              "SUCCESS",

            source:
              params.source,

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
              mergeMetadata(
                params.metadata,
                {
                  operation:
                    "CAPTURE",

                  availableBalanceBefore:
                    availableBefore,

                  availableBalanceAfter:
                    availableAfter,

                  heldBalanceBefore:
                    heldBefore,

                  heldBalanceAfter:
                    heldAfter,
                }
              ),
          },
        ],
        {
          session,
        }
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
   REFUND WALLET
========================================================= */

export async function refundWallet(
  params: Omit<
    WalletMutationParams,
    "type"
  >
): Promise<WalletResult> {
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

    source?: WalletTransactionSource;

    orderId?: string | Types.ObjectId;
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
    Math.max(
      options?.limit ?? 20,
      1
    ),
    100
  );

  const skip =
    (page - 1) * limit;

  const filter: Record<
    string,
    unknown
  > = {
    buyerId:
      buyerObjectId,
  };

  if (options?.type) {
    filter.type =
      options.type;
  }

  if (options?.status) {
    filter.status =
      options.status;
  }

  if (options?.source) {
    filter.source =
      options.source;
  }

  if (options?.orderId) {
    filter.orderId =
      toObjectId(
        options.orderId
      );
  }

  const [
    transactions,
    total,
  ] = await Promise.all([
    WalletTransaction.find(
      filter
    )
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