// /controllers/platform-config.controller.ts

"use server";

import { getServerSession } from "next-auth";
import { Types } from "mongoose";

import { authOptions } from "@/auth";
import { connectToDB } from "@/lib/connectToDB";
import { IPlatformConfig, PlatformConfig } from "@/models/PlatformConfig";

/* =========================================================
   TYPES
========================================================= */

export interface MatchingWeights {
  availabilityWeight: number;
  priceWeight: number;
  supplierTypeWeight: number;
  fulfillmentWeight: number;
  reliabilityWeight: number;
}

export interface PlatformConfigResponse {
  id: string;
  key: string;

  defaultCommissionPercent: number;

  matchingWeights: MatchingWeights;

  minCreditApprovalLimit: number;

  maxCreditApprovalLimit: number;

  autoAdvanceSupplierTimeoutSeconds: number;

  currency: "NGN";

  updatedBy?: string;

  createdAt: string;

  updatedAt: string;
}

/* =========================================================
   DEFAULT CONFIG
========================================================= */

const DEFAULT_MATCHING_WEIGHTS: MatchingWeights = {
  availabilityWeight: 20,
  priceWeight: 35,
  supplierTypeWeight: 5,
  fulfillmentWeight: 15,
  reliabilityWeight: 25,
};

/* =========================================================
   ADMIN SESSION
========================================================= */

async function getAdminSession() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error("Unauthorized.");
  }

  if (session.user.role !== "admin") {
    throw new Error(
      "Only administrators can access platform configuration."
    );
  }

  if (!session.user.id) {
    throw new Error(
      "Administrator ID is missing from the session."
    );
  }

  return session;
}

/* =========================================================
   VALIDATE MATCHING WEIGHTS
========================================================= */

function validateMatchingWeights(
  weights: MatchingWeights
) {
  const values = [
    weights.availabilityWeight,
    weights.priceWeight,
    weights.supplierTypeWeight,
    weights.fulfillmentWeight,
    weights.reliabilityWeight,
  ];

  for (const value of values) {
    if (
      typeof value !== "number" ||
      !Number.isFinite(value)
    ) {
      throw new Error(
        "All matching weights must be valid numbers."
      );
    }

    if (value < 0 || value > 100) {
      throw new Error(
        "Each matching weight must be between 0% and 100%."
      );
    }
  }

  const total = values.reduce(
    (sum, value) => sum + value,
    0
  );

  if (total !== 100) {
    throw new Error(
      `Matching weights must total exactly 100%. Current total: ${total}%.`
    );
  }
}

/* =========================================================
   SERIALIZE PLATFORM CONFIG
========================================================= */

function serializePlatformConfig(
  config: IPlatformConfig
): PlatformConfigResponse {
  return {
    id: config._id.toString(),

    key: config.key,

    defaultCommissionPercent:
      config.defaultCommissionPercent,

    matchingWeights: {
      availabilityWeight:
        config.matchingWeights.availabilityWeight,

      priceWeight:
        config.matchingWeights.priceWeight,

      supplierTypeWeight:
        config.matchingWeights.supplierTypeWeight,

      fulfillmentWeight:
        config.matchingWeights.fulfillmentWeight,

      reliabilityWeight:
        config.matchingWeights.reliabilityWeight,
    },

    minCreditApprovalLimit:
      config.minCreditApprovalLimit,

    maxCreditApprovalLimit:
      config.maxCreditApprovalLimit,

    autoAdvanceSupplierTimeoutSeconds:
      config.autoAdvanceSupplierTimeoutSeconds,

    currency: config.currency,

    updatedBy: config.updatedBy
      ? config.updatedBy.toString()
      : undefined,

    createdAt: config.createdAt.toISOString(),

    updatedAt: config.updatedAt.toISOString(),
  };
}

/* =========================================================
   GET PLATFORM CONFIG
========================================================= */

export async function getPlatformConfig(): Promise<
  PlatformConfigResponse
> {
  await getAdminSession();

  await connectToDB();

  let config = await PlatformConfig.findOne({
    key: "default",
  }).lean();

  /**
   * Create the platform configuration automatically
   * the first time the admin opens the configuration page.
   */
  if (!config) {
    const created =
      await PlatformConfig.create({
        key: "default",

        matchingWeights:
          DEFAULT_MATCHING_WEIGHTS,

        defaultCommissionPercent: 10,

        minCreditApprovalLimit: 500000,

        maxCreditApprovalLimit: 20000000,

        autoAdvanceSupplierTimeoutSeconds: 300,

        currency: "NGN",
      });

    config = created.toObject();
  }

  return serializePlatformConfig(config);
}

/* =========================================================
   GET MATCHING WEIGHTS
========================================================= */

export async function getMatchingWeights(): Promise<MatchingWeights> {
  const config = await getPlatformConfig();

  return config.matchingWeights;
}

/* =========================================================
   UPDATE MATCHING WEIGHTS
========================================================= */

export async function updateMatchingWeights(
  weights: MatchingWeights
): Promise<{
  success: true;
  matchingWeights: MatchingWeights;
}> {
  const session = await getAdminSession();

  validateMatchingWeights(weights);

  await connectToDB();

  if (!Types.ObjectId.isValid(session.user.id)) {
    throw new Error("Invalid administrator ID.");
  }

  const config =
    await PlatformConfig.findOneAndUpdate(
      {
        key: "default",
      },
      {
        $set: {
          matchingWeights: weights,

          updatedBy: new Types.ObjectId(
            session.user.id
          ),
        },
      },
      {
        upsert: true,
        returnDocument: "after",
        runValidators: true,
      }
    ).lean();

  if (!config) {
    throw new Error(
      "Failed to update platform configuration."
    );
  }

  return {
    success: true,

    matchingWeights: {
      availabilityWeight:
        config.matchingWeights.availabilityWeight,

      priceWeight:
        config.matchingWeights.priceWeight,

      supplierTypeWeight:
        config.matchingWeights.supplierTypeWeight,

      fulfillmentWeight:
        config.matchingWeights.fulfillmentWeight,

      reliabilityWeight:
        config.matchingWeights.reliabilityWeight,
    },
  };
}