// models/PaymentTransaction.ts

import mongoose, { Schema, Document, Model } from "mongoose";

export type PaymentProvider =
  | "paystack"
  | "flutterwave";

export type PaymentStatus =
  | "pending"
  | "successful"
  | "failed"
  | "cancelled";

export type PaymentPurpose =
  | "wallet_topup"
  | "order_payment";

export interface IPaymentTransaction extends Document {
  buyerId: mongoose.Types.ObjectId;

  walletId: mongoose.Types.ObjectId;

  provider: PaymentProvider;

  reference: string;

  providerReference?: string;

  amount: number;

  currency: "NGN";

  purpose: PaymentPurpose;

  status: PaymentStatus;

  gatewayResponse?: Record<string, unknown>;

  metadata?: Record<string, unknown>;

  verifiedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const PaymentTransactionSchema =
  new Schema<IPaymentTransaction>(
    {
      buyerId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
      },

      walletId: {
        type: Schema.Types.ObjectId,
        ref: "Wallet",
        required: true,
        index: true,
      },

      provider: {
        type: String,
        enum: ["paystack", "flutterwave"],
        required: true,
      },

      reference: {
        type: String,
        required: true,
        unique: true,
        index: true,
      },

      providerReference: {
        type: String,
        index: true,
      },

      amount: {
        type: Number,
        required: true,
        min: 1,
      },

      currency: {
        type: String,
        enum: ["NGN"],
        default: "NGN",
      },

      purpose: {
        type: String,
        enum: ["wallet_topup", "order_payment"],
        required: true,
      },

      status: {
        type: String,
        enum: [
          "pending",
          "successful",
          "failed",
          "cancelled",
        ],
        default: "pending",
        index: true,
      },

      gatewayResponse: {
        type: Schema.Types.Mixed,
      },

      metadata: {
        type: Schema.Types.Mixed,
      },

      verifiedAt: Date,
    },
    {
      timestamps: true,
    }
  );

PaymentTransactionSchema.index({
  userId: 1,
  createdAt: -1,
});

const PaymentTransaction: Model<IPaymentTransaction> =
  mongoose.models.PaymentTransaction ||
  mongoose.model<IPaymentTransaction>(
    "PaymentTransaction",
    PaymentTransactionSchema
  );

export default PaymentTransaction;