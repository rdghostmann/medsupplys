// /models/PlatformConfig.ts

import {
  Schema,
  model,
  models,
  Document,
  Model,
} from "mongoose";

export interface IMatchingWeights {
  availabilityWeight: number;
  priceWeight: number;
  supplierTypeWeight: number;
  fulfillmentWeight: number;
  reliabilityWeight: number;
}

export interface IPlatformConfig
  extends Document {
  key: string;

  defaultCommissionPercent: number;

  matchingWeights: IMatchingWeights;

  minCreditApprovalLimit: number;

  maxCreditApprovalLimit: number;

  autoAdvanceSupplierTimeoutSeconds: number;

  currency: "NGN";

  updatedBy?: Schema.Types.ObjectId;

  createdAt: Date;

  updatedAt: Date;
}

const MatchingWeightsSchema =
  new Schema<IMatchingWeights>(
    {
      availabilityWeight: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
      },

      priceWeight: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
      },

      supplierTypeWeight: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
      },

      fulfillmentWeight: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
      },

      reliabilityWeight: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
      },
    },
    { _id: false }
  );

const PlatformConfigSchema =
  new Schema<IPlatformConfig>(
    {
      key: {
        type: String,
        required: true,
        unique: true,
        default: "default",
      },

      defaultCommissionPercent: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
        default: 10,
      },

      matchingWeights: {
        type: MatchingWeightsSchema,
        required: true,
        default: {
          availabilityWeight: 25,
          priceWeight: 35,
          supplierTypeWeight: 20,
          fulfillmentWeight: 10,
          reliabilityWeight: 10,
        },
      },

      minCreditApprovalLimit: {
        type: Number,
        required: true,
        min: 0,
        default: 500000,
      },

      maxCreditApprovalLimit: {
        type: Number,
        required: true,
        min: 0,
        default: 20000000,
      },

      autoAdvanceSupplierTimeoutSeconds: {
        type: Number,
        required: true,
        min: 1,
        default: 300,
      },

      currency: {
        type: String,
        enum: ["NGN"],
        default: "NGN",
      },

      updatedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    },
    {
      timestamps: true,
      versionKey: false,
    }
  );

/*
 * Protect matching engine integrity.
 *
 * The five weights must always total 100.
 */
PlatformConfigSchema.pre(
  "validate",
  async function () {
    const weights = this.matchingWeights;

    if (!weights) {
      throw new Error("Matching weights are required");
    }

    const total =
      weights.availabilityWeight +
      weights.priceWeight +
      weights.supplierTypeWeight +
      weights.fulfillmentWeight +
      weights.reliabilityWeight;

    if (total !== 100) {
      throw new Error(
        `Matching weights must total 100%. Current total: ${total}%`
      );
    }

    if (
      this.minCreditApprovalLimit >
      this.maxCreditApprovalLimit
    ) {
      throw new Error(
        "Minimum credit approval limit cannot exceed maximum credit approval limit"
      );
    }
  }
);

export const PlatformConfig:
  Model<IPlatformConfig> =
  models.PlatformConfig ||
  model<IPlatformConfig>(
    "PlatformConfig",
    PlatformConfigSchema
  );