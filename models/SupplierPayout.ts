// /models/SupplierPayout.ts

import {
  Schema,
  model,
  models,
  Document,
  Model,
} from "mongoose";

export type SupplierPayoutStatus =
  | "PENDING"
  | "PROCESSING"
  | "SETTLED"
  | "FAILED"
  | "REVERSED";

export interface ISupplierPayout extends Document {
  supplierId: Schema.Types.ObjectId;

  supplierName: string;

  amount: number;

  transferFee: number;

  netAmount: number;

  status: SupplierPayoutStatus;

  reference: string;

  bankName: string;

  accountNumber: string;

  accountName: string;

  orderIds: Schema.Types.ObjectId[];

  failureReason?: string;

  processedAt?: Date;

  createdAt: Date;

  updatedAt: Date;
}

const SupplierPayoutSchema =
  new Schema<ISupplierPayout>(
    {
      supplierId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
      },

      supplierName: {
        type: String,
        required: true,
      },

      amount: {
        type: Number,
        required: true,
        min: 0,
      },

      transferFee: {
        type: Number,
        default: 0,
        min: 0,
      },

      netAmount: {
        type: Number,
        required: true,
        min: 0,
      },

      status: {
        type: String,
        enum: [
          "PENDING",
          "PROCESSING",
          "SETTLED",
          "FAILED",
          "REVERSED",
        ],
        default: "PENDING",
        index: true,
      },

      reference: {
        type: String,
        required: true,
        unique: true,
        index: true,
      },

      bankName: {
        type: String,
        required: true,
      },

      accountNumber: {
        type: String,
        required: true,
      },

      accountName: {
        type: String,
        required: true,
      },

      orderIds: [
        {
          type: Schema.Types.ObjectId,
          ref: "Order",
        },
      ],

      failureReason: String,

      processedAt: Date,
    },
    {
      timestamps: true,
      versionKey: false,
    }
  );

SupplierPayoutSchema.index({
  supplierId: 1,
  status: 1,
  createdAt: -1,
});

export const SupplierPayout: Model<ISupplierPayout> =
  models.SupplierPayout ||
  model<ISupplierPayout>(
    "SupplierPayout",
    SupplierPayoutSchema
  );