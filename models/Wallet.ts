
// /models/Wallet.ts

import {
  Schema,
  Types,
  model,
  models,
  Document,
  Model,
} from "mongoose";

export type WalletStatus =
  | "ACTIVE"
  | "SUSPENDED"
  | "LOCKED";

export interface IWallet extends Document {
  buyerId: Types.ObjectId;

  buyerName: string;

  currency: "NGN";

  availableBalance: number;

heldBalance: number;

  totalDeposited: number;

  totalSpent: number;

  totalRefunded: number;

  totalReversed: number;

  status: WalletStatus;

  createdAt: Date;

  updatedAt: Date;
}

const WalletSchema = new Schema<IWallet>(
  {
    buyerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    buyerName: {
      type: String,
      required: true,
    },

    currency: {
      type: String,
      enum: ["NGN"],
      default: "NGN",
      required: true,
    },

    availableBalance: {
      type: Number,
      default: 0,
      min: 0,
    },

    heldBalance: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalDeposited: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalSpent: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalRefunded: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalReversed: {
      type: Number,
      default: 0,
      min: 0,
    },

    status: {
      type: String,
      enum: [
        "ACTIVE",
        "SUSPENDED",
        "LOCKED",
      ],
      default: "ACTIVE",
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

WalletSchema.index({
  buyerId: 1,
  status: 1,
});

export const Wallet: Model<IWallet> =
  models.Wallet ||
  model<IWallet>("Wallet", WalletSchema);