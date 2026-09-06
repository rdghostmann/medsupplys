"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Database,
  Loader2,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { seedBuyerProcurementCreditOrders, SeedStatus } from "@/controllers/seed-buyer.actions";


export default function SeedBuyerProcurementButton() {
  const [loading, setLoading] =
    useState(false);

  const [result, setResult] =
    useState<SeedStatus | null>(null);

  async function handleSeed() {
    setLoading(true);
    setResult(null);

    try {
      const response =
        await seedBuyerProcurementCreditOrders();

      setResult(response);

      if (response.success) {
        toast.success(
          "MedSupply buyer seed completed successfully."
        );
      } else {
        toast.error(
          response.error ??
            "Seeding failed."
        );
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unexpected error.";

      toast.error(message);

      setResult({
        success: false,
        message:
          "Unexpected seeding error.",
        error: message,
        steps: [
          {
            name: "Seed Process",
            status: "failed",
            message,
          },
        ],
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full space-y-4 md:w-auto">
      {/* Button */}
      <button
        type="button"
        onClick={handleSeed}
        disabled={loading}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Seeding Database...
          </>
        ) : (
          <>
            <Database className="h-4 w-4" />
            Seed Buyer Data
          </>
        )}
      </button>

      {/* Status */}
      {loading && (
        <div className="flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
          <Loader2 className="h-4 w-4 animate-spin" />

          <span>
            Connecting to database and seeding
            buyer procurement data...
          </span>
        </div>
      )}

      {/* Result */}
      {result && (
        <div
          className={`rounded-2xl border p-5 ${
            result.success
              ? "border-emerald-200 bg-emerald-50"
              : "border-red-200 bg-red-50"
          }`}
        >
          {/* Result Header */}
          <div className="flex items-start gap-3">
            {result.success ? (
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
            ) : (
              <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
            )}

            <div>
              <h3
                className={`font-semibold ${
                  result.success
                    ? "text-emerald-900"
                    : "text-red-900"
                }`}
              >
                {result.success
                  ? "Seed Completed"
                  : "Seed Failed"}
              </h3>

              <p
                className={`mt-1 text-sm ${
                  result.success
                    ? "text-emerald-700"
                    : "text-red-700"
                }`}
              >
                {result.message}
              </p>
            </div>
          </div>

          {/* Steps */}
          {result.steps &&
            result.steps.length > 0 && (
              <div className="mt-5 space-y-2">
                {result.steps.map(
                  (step, index) => (
                    <div
                      key={`${step.name}-${index}`}
                      className="flex items-center justify-between rounded-lg border border-white/70 bg-white/70 px-3 py-2"
                    >
                      <span className="text-sm font-medium text-slate-700">
                        {step.name}
                      </span>

                      <span
                        className={`text-xs font-semibold ${
                          step.status ===
                          "success"
                            ? "text-emerald-600"
                            : "text-red-600"
                        }`}
                      >
                        {step.status ===
                        "success"
                          ? "SUCCESS"
                          : "FAILED"}
                      </span>
                    </div>
                  )
                )}
              </div>
            )}

          {/* Summary */}
          {result.success && (
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <SummaryItem
                label="Credit Limit"
                value={`₦${Number(
                  result.creditAccount
                    ?.creditLimit ?? 0
                ).toLocaleString()}`}
              />

              <SummaryItem
                label="Available Credit"
                value={`₦${Number(
                  result.creditAccount
                    ?.availableCredit ?? 0
                ).toLocaleString()}`}
              />

              <SummaryItem
                label="Procurement"
                value={
                  result.procurement
                    ?.procurementNumber ??
                  "—"
                }
              />

              <SummaryItem
                label="Orders"
                value={String(
                  result.orders
                    ?.length ?? 0
                )}
              />
            </div>
          )}

          {/* Error */}
          {result.error && (
            <div className="mt-4 rounded-lg bg-red-100 p-3 text-sm text-red-700">
              <strong>Error:</strong>{" "}
              {result.error}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* =========================================================
   SUMMARY ITEM
========================================================= */

function SummaryItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <p className="text-xs text-slate-500">
        {label}
      </p>

      <p className="mt-1 truncate text-sm font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}