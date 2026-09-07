// /models/WalletTransaction.ts

import {
  Schema,
  Types,
  model,
  models,
  Document,
  Model,
} from "mongoose";

export type WalletTransactionType =
  | "TOPUP"
  | "PURCHASE"
  | "REFUND"
  | "REVERSAL"
  | "ADJUSTMENT"
  | "HOLD"
  | "RELEASE";

export type WalletTransactionDirection =
  | "CREDIT"
  | "DEBIT";

export type WalletTransactionStatus =
  | "PENDING"
  | "SUCCESS"
  | "FAILED"
  | "REVERSED";

export type WalletTransactionSource =
  | "PAYSTACK"
  | "FLUTTERWAVE"
  | "ORDER"
  | "REFUND"
  | "ADMIN"
  | "SYSTEM";


export interface IWalletTransaction
  extends Document {
  walletId: Types.ObjectId;

  buyerId: Types.ObjectId;

  type: WalletTransactionType;

  amount: number;

  direction: WalletTransactionDirection;

  balanceBefore: number;

  balanceAfter: number;

  reference: string;

  description: string;

  status: WalletTransactionStatus;

  source: WalletTransactionSource;

  paymentTransactionId?: Types.ObjectId;

  orderId?: Types.ObjectId;

  metadata?: Record<string, unknown>;

  createdAt: Date;
}

const WalletTransactionSchema =
  new Schema<IWalletTransaction>(
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
          "REVERSAL",
          "ADJUSTMENT",
          "HOLD",
          "RELEASE",
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
      },

      description: {
        type: String,
        required: true,
      },

      status: {
        type: String,
        enum: [
          "PENDING",
          "SUCCESS",
          "FAILED",
          "REVERSED",
        ],
        default: "PENDING",
      },

       source: {
        type: String,
        enum: [
          "PAYSTACK",
          "FLUTTERWAVE",
          "ORDER",
          "REFUND",
          "ADMIN",
          "SYSTEM",
        ],
        required: true,
      },

      paymentTransactionId: {
        type: Schema.Types.ObjectId,
        ref: "PaymentTransaction",
        index: true,
      },

      orderId: {
        type: Schema.Types.ObjectId,
        ref: "Order",
        index: true,
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
  );

WalletTransactionSchema.index({
  buyerId: 1,
  createdAt: -1,
});

export const WalletTransaction:
  Model<IWalletTransaction> =
  models.WalletTransaction ||
  model<IWalletTransaction>(
    "WalletTransaction",
    WalletTransactionSchema
  );