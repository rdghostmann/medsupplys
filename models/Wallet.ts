// /models/Wallet.ts

import {
  Schema,
  model,
  models,
  Document,
  Model,
} from "mongoose";

export type WalletStatus =
  | "ACTIVE"
  | "FROZEN"
  | "SUSPENDED"
  | "CLOSED";

export interface IWallet extends Document {
  buyerId: Schema.Types.ObjectId;

  buyerName: string;

  balance: number;

  currency: "NGN";

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

    balance: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    currency: {
      type: String,
      enum: ["NGN"],
      default: "NGN",
    },

    status: {
      type: String,
      enum: [
        "ACTIVE",
        "FROZEN",
        "SUSPENDED",
        "CLOSED",
      ],
      default: "ACTIVE",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Wallet: Model<IWallet> =
  models.Wallet ||
  model<IWallet>("Wallet", WalletSchema);