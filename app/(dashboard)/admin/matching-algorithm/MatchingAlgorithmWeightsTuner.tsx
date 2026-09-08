"use client";

import { useMemo, useState } from "react";
import { Save, Sliders } from "lucide-react";
import { toast } from "sonner";

import {
  updateMatchingWeights,
  type MatchingWeights as PlatformMatchingWeights,
} from "@/controllers/platform-config.controller";

/* =========================================================
   UI TYPE
========================================================= */

type MatchingWeights = {
  availability: number;
  priceCompetitiveness: number;
  supplierType: number;
  fulfillmentHistory: number;
  reliability: number;
};

/* =========================================================
   PROPS
========================================================= */

interface MatchingAlgorithmWeightsTunerProps {
  matchingWeights: PlatformMatchingWeights;
}

/* =========================================================
   COMPONENT
========================================================= */

export default function MatchingAlgorithmWeightsTuner({
  matchingWeights,
}: MatchingAlgorithmWeightsTunerProps) {
  /**
   * Convert database naming into UI naming.
   */
  const initialWeights: MatchingWeights = {
    availability:
      matchingWeights.availabilityWeight,

    priceCompetitiveness:
      matchingWeights.priceWeight,

    supplierType:
      matchingWeights.supplierTypeWeight,

    fulfillmentHistory:
      matchingWeights.fulfillmentWeight,

    reliability:
      matchingWeights.reliabilityWeight,
  };

  const [weights, setWeights] =
    useState<MatchingWeights>(initialWeights);

  const [isSavingWeights, setIsSavingWeights] =
    useState(false);

  /* =======================================================
     TOTAL WEIGHT
  ======================================================= */

  const totalWeight = useMemo(
    () =>
      Object.values(weights).reduce(
        (total, weight) => total + weight,
        0
      ),
    [weights]
  );

  /* =======================================================
     UPDATE WEIGHT
  ======================================================= */

  const updateWeight = (
    key: keyof MatchingWeights,
    value: number
  ) => {
    setWeights((current) => ({
      ...current,
      [key]: value,
    }));
  };

  /* =======================================================
     SAVE
  ======================================================= */

  const handleSaveWeights = async () => {
    if (totalWeight !== 100) {
      toast.error(
        `Total weight must equal 100%. Current total: ${totalWeight}%`
      );

      return;
    }

    try {
      setIsSavingWeights(true);

      /**
       * Convert UI naming back into
       * PlatformConfig naming.
       */
      const payload: PlatformMatchingWeights = {
        availabilityWeight:
          weights.availability,

        priceWeight:
          weights.priceCompetitiveness,

        supplierTypeWeight:
          weights.supplierType,

        fulfillmentWeight:
          weights.fulfillmentHistory,

        reliabilityWeight:
          weights.reliability,
      };

      const result =
        await updateMatchingWeights(payload);

      if (!result.success) {
        throw new Error(
          "Failed to update matching weights."
        );
      }

      toast.success(
        "Supplier matching weights deployed successfully."
      );
    } catch (error) {
      console.error(
        "[MATCHING WEIGHTS] Failed to save:",
        error
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to deploy matching weights. Please try again."
      );
    } finally {
      setIsSavingWeights(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="mx-auto w-full max-w-7xl space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="font-display text-xl font-bold text-slate-900">
            Matching Algorithm Weights Tuner
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Configure how the supplier matching engine
            scores, ranks, and prioritizes verified
            suppliers.
          </p>
        </div>

        {/* MATCHING ALGORITHM WEIGHTS TUNER */}
        <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          {/* Header */}
          <div className="flex flex-col justify-between gap-4 border-b border-slate-100 pb-4 sm:flex-row sm:items-center">
            <div>
              <h3 className="flex items-center gap-2 font-display text-base font-bold text-slate-900">
                <Sliders className="h-5 w-5 text-blue-600" />

                <span>
                  Multi-Factor Supplier Matching Scoring
                  Model
                </span>
              </h3>

              <p className="mt-0.5 max-w-3xl text-xs text-slate-500">
                Calibrate how the engine scores and ranks
                verified suppliers when a hospital issues a
                procurement request.
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="block text-xs text-slate-400">
                Total Allocated Weight
              </span>

              <span
                className={`font-mono text-lg font-bold ${
                  totalWeight === 100
                    ? "text-emerald-700"
                    : "text-red-600"
                }`}
              >
                {totalWeight}% / 100%
              </span>
            </div>
          </div>

          {/* Weight Controls */}
          <div className="grid grid-cols-1 gap-6 text-xs md:grid-cols-2">
            {/* Availability */}
            <div className="space-y-2 rounded-xl border border-slate-100 bg-slate-50 p-4">
              <div className="flex justify-between gap-4 font-semibold text-slate-800">
                <span>
                  1. Stock Availability &amp; MOQ Match
                </span>

                <span className="font-mono font-bold text-blue-600">
                  {weights.availability}%
                </span>
              </div>

              <input
                type="range"
                min="0"
                max="50"
                step="1"
                value={weights.availability}
                onChange={(e) =>
                  updateWeight(
                    "availability",
                    Number(e.target.value)
                  )
                }
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-blue-600"
              />

              <p className="text-[11px] text-slate-500">
                Penalizes low stock and rewards immediate
                fulfillment capacity.
              </p>
            </div>

            {/* Price */}
            <div className="space-y-2 rounded-xl border border-slate-100 bg-slate-50 p-4">
              <div className="flex justify-between gap-4 font-semibold text-slate-800">
                <span>
                  2. Price Competitiveness
                </span>

                <span className="font-mono font-bold text-blue-600">
                  {weights.priceCompetitiveness}%
                </span>
              </div>

              <input
                type="range"
                min="0"
                max="50"
                step="1"
                value={weights.priceCompetitiveness}
                onChange={(e) =>
                  updateWeight(
                    "priceCompetitiveness",
                    Number(e.target.value)
                  )
                }
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-blue-600"
              />

              <p className="text-[11px] text-slate-500">
                Compares unit price against the lowest
                available offer in the verified pool.
              </p>
            </div>

            {/* Supplier Tier */}
            <div className="space-y-2 rounded-xl border border-slate-100 bg-slate-50 p-4">
              <div className="flex justify-between gap-4 font-semibold text-slate-800">
                <span>
                  3. Supplier Tier Hierarchy
                </span>

                <span className="font-mono font-bold text-blue-600">
                  {weights.supplierType}%
                </span>
              </div>

              <input
                type="range"
                min="0"
                max="50"
                step="1"
                value={weights.supplierType}
                onChange={(e) =>
                  updateWeight(
                    "supplierType",
                    Number(e.target.value)
                  )
                }
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-blue-600"
              />

              <p className="text-[11px] text-slate-500">
                Importer (100 pts) &gt; Distributor (70 pts)
                &gt; Retailer (40 pts).
              </p>
            </div>

            {/* Fulfillment */}
            <div className="space-y-2 rounded-xl border border-slate-100 bg-slate-50 p-4">
              <div className="flex justify-between gap-4 font-semibold text-slate-800">
                <span>
                  4. Fulfillment Rate History
                </span>

                <span className="font-mono font-bold text-blue-600">
                  {weights.fulfillmentHistory}%
                </span>
              </div>

              <input
                type="range"
                min="0"
                max="50"
                step="1"
                value={weights.fulfillmentHistory}
                onChange={(e) =>
                  updateWeight(
                    "fulfillmentHistory",
                    Number(e.target.value)
                  )
                }
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-blue-600"
              />

              <p className="text-[11px] text-slate-500">
                Historical delivery on-time rate and low
                rejection count.
              </p>
            </div>

            {/* Reliability */}
            <div className="space-y-2 rounded-xl border border-slate-100 bg-slate-50 p-4 md:col-span-2">
              <div className="flex justify-between gap-4 font-semibold text-slate-800">
                <span>
                  5. Reliability &amp; Quality Rating
                </span>

                <span className="font-mono font-bold text-blue-600">
                  {weights.reliability}%
                </span>
              </div>

              <input
                type="range"
                min="0"
                max="50"
                step="1"
                value={weights.reliability}
                onChange={(e) =>
                  updateWeight(
                    "reliability",
                    Number(e.target.value)
                  )
                }
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-blue-600"
              />

              <p className="text-[11px] text-slate-500">
                Buyer star ratings and NAFDAC compliance
                audit scores.
              </p>
            </div>
          </div>

          {/* Validation */}
          {totalWeight !== 100 && (
            <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-xs text-red-700">
              <span className="font-semibold">
                Weight allocation is invalid.
              </span>{" "}
              Adjust the scoring factors until the total
              allocation equals exactly 100%.
            </div>
          )}

          {/* Save */}
          <div className="flex justify-end border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={handleSaveWeights}
              disabled={
                isSavingWeights ||
                totalWeight !== 100
              }
              className="flex cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save className="h-4 w-4" />

              <span>
                {isSavingWeights
                  ? "Saving..."
                  : "Deploy Calibrated Weights"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}