import mongoose, { Document, Model, Schema, Types } from "mongoose"

export type WalletTransactionType =
  | "TOPUP"
  | "PURCHASE"
  | "REFUND"
  | "CREDIT_PURCHASE"
  | "CREDIT_REPAYMENT"
  | "ADJUSTMENT"

export type WalletTransactionDirection = "CREDIT" | "DEBIT"

export type WalletTransactionStatus =
  | "PENDING"
  | "SUCCESS"
  | "FAILED"
  | "REVERSED"

export interface IWalletTransaction extends Document {
  walletId: Types.ObjectId
  buyerId: Types.ObjectId

  type: WalletTransactionType
  amount: number
  direction: WalletTransactionDirection

  balanceBefore: number
  balanceAfter: number

  reference: string
  description?: string

  status: WalletTransactionStatus

  metadata?: Record<string, unknown>

  createdAt: Date
  updatedAt: Date
}

const WalletTransactionSchema = new Schema<IWalletTransaction>(
  {
    walletId: {
      type: Schema.Types.ObjectId,
      ref: "Wallet",
      required: true,
      index: true,
    },

    buyerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: [
        "TOPUP",
        "PURCHASE",
        "REFUND",
        "CREDIT_PURCHASE",
        "CREDIT_REPAYMENT",
        "ADJUSTMENT",
      ],
      required: true,
      index: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0.01,
    },

    direction: {
      type: String,
      enum: ["CREDIT", "DEBIT"],
      required: true,
    },

    balanceBefore: {
      type: Number,
      required: true,
      min: 0,
    },

    balanceAfter: {
      type: Number,
      required: true,
      min: 0,
    },

    reference: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED", "REVERSED"],
      default: "PENDING",
      index: true,
    },

    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
)

/**
 * Useful for retrieving a buyer's wallet history
 * in chronological order.
 */
WalletTransactionSchema.index({
  buyerId: 1,
  createdAt: -1,
})

/**
 * Useful for retrieving transactions
 * belonging to a particular wallet.
 */
WalletTransactionSchema.index({  walletId: 1,  createdAt: -1, })

export const WalletTransaction: Model<IWalletTransaction> =  mongoose.models.WalletTransaction ||  mongoose.model<IWalletTransaction>(    "WalletTransaction", WalletTransactionSchema )

