// /models/CreditTransaction.ts

import { Schema, Types, model, models, Document, Model } from "mongoose"

export type CreditTransactionType =
  | "CREDIT_PURCHASE"
  | "PAYMENT"
  | "ADJUSTMENT"
  | "REVERSAL"
  | "INTEREST"
  | "FEE"

export type CreditTransactionDirection = "CHARGE" | "PAYMENT" | "CREDIT"

export interface ICreditTransaction extends Document {
  creditAccountId: Types.ObjectId

  buyerId: Types.ObjectId

  type: CreditTransactionType

  amount: number

  direction: CreditTransactionDirection

  balanceBefore: number

  balanceAfter: number

  reference: string

  procurementId?: Types.ObjectId

  orderId?: Types.ObjectId

  description: string

  metadata?: Record<string, unknown>

  createdAt: Date
}

const CreditTransactionSchema = new Schema<ICreditTransaction>(
  {
    creditAccountId: {
      type: Schema.Types.ObjectId,
      ref: "CreditAccount",
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
        "CREDIT_PURCHASE",
        "PAYMENT",
        "ADJUSTMENT",
        "REVERSAL",
        "INTEREST",
        "FEE",
      ],
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    direction: {
      type: String,
      enum: ["CHARGE", "PAYMENT", "CREDIT"],
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
    },

    procurementId: {
      type: Schema.Types.ObjectId,
      ref: "Procurement",
      index: true,
    },

    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      index: true,
    },

    description: {
      type: String,
      required: true,
    },

    metadata: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
    versionKey: false,
  }
)

CreditTransactionSchema.index({
  buyerId: 1,
  createdAt: -1,
})

CreditTransactionSchema.index({
  procurementId: 1,
  createdAt: -1,
})

export const CreditTransaction: Model<ICreditTransaction> =
  models.CreditTransaction ||
  model<ICreditTransaction>("CreditTransaction", CreditTransactionSchema)
