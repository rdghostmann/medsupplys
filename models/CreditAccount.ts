// /models/CreditAccount.ts

import {
  Schema,
  model,
  models,
  Document,
  Model,
} from "mongoose";

export type CreditAccountStatus =
  | "PENDING"
  | "ACTIVE"
  | "SUSPENDED"
  | "EXPIRED"
  | "CLOSED";

export type CreditRatingTier =
  | "A"
  | "B"
  | "C"
  | "UNRATED";

export interface ICreditAccount
  extends Document {
  buyerId: Schema.Types.ObjectId;

  buyerName: string;

  creditLimit: number;

  availableCredit: number;

  creditUsed: number;

  outstandingBalance: number;

  status: CreditAccountStatus;

  ratingTier: CreditRatingTier;

  approvedBy?: Schema.Types.ObjectId;

  approvedAt?: Date;

  dueDate?: Date;

  terms: string;

  interestRatePercent: number;

  createdAt: Date;

  updatedAt: Date;
}

const CreditAccountSchema =
  new Schema<ICreditAccount>(
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

      creditLimit: {
        type: Number,
        required: true,
        min: 0,
        default: 0,
      },

      availableCredit: {
        type: Number,
        required: true,
        min: 0,
        default: 0,
      },

      creditUsed: {
        type: Number,
        required: true,
        min: 0,
        default: 0,
      },

      outstandingBalance: {
        type: Number,
        required: true,
        min: 0,
        default: 0,
      },

      status: {
        type: String,
        enum: [
          "PENDING",
          "ACTIVE",
          "SUSPENDED",
          "EXPIRED",
          "CLOSED",
        ],
        default: "PENDING",
        index: true,
      },

      ratingTier: {
        type: String,
        enum: [
          "A",
          "B",
          "C",
          "UNRATED",
        ],
        default: "UNRATED",
      },

      approvedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },

      approvedAt: Date,

      dueDate: Date,

      terms: {
        type: String,
        required: true,
      },

      interestRatePercent: {
        type: Number,
        min: 0,
        default: 0,
      },
    },
    {
      timestamps: true,
      versionKey: false,
    }
  );

export const CreditAccount:
  Model<ICreditAccount> =
  models.CreditAccount ||
  model<ICreditAccount>(
    "CreditAccount",
    CreditAccountSchema
  );