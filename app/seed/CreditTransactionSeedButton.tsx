"use client";

import { useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Database,
  Loader2,
  RefreshCcw,
} from "lucide-react";
import { toast } from "sonner";
import { type CreditTransactionSeedStatus, seedCreditTransactionAction } from "@/lib/seed/seed-credit-transaction.actions";

// import {
//   seedCreditTransactionAction,
//   type CreditTransactionSeedStatus,
// } from "@/lib/actions/seed-credit-transaction.actions";

const formatCurrency = (amount: number) => {
  return `₦${amount.toLocaleString("en-NG")}`;
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleString("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

export default function CreditTransactionSeedButton() {
  const [isSeeding, setIsSeeding] = useState(false);

  const [result, setResult] =
    useState<CreditTransactionSeedStatus | null>(null);

  const handleSeed = async () => {
    setIsSeeding(true);
    setResult(null);

    toast.loading("Seeding credit transaction...", {
      id: "credit-transaction-seed",
      description:
        "Initializing MedSupply credit transaction data.",
    });

    try {
      const response =
        await seedCreditTransactionAction();

      setResult(response);

      if (response.success) {
        toast.success(
          "Credit transaction seeded successfully",
          {
            id: "credit-transaction-seed",
            description: response.transaction
              ? `${response.transaction.reference} has been initialized.`
              : response.message,
          }
        );
      } else {
        toast.error("Credit transaction seed failed", {
          id: "credit-transaction-seed",
          description:
            response.error || response.message,
        });
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unexpected error occurred.";

      const failedResult: CreditTransactionSeedStatus = {
        success: false,
        message: "Failed to seed credit transaction.",
        error: message,
      };

      setResult(failedResult);

      toast.error("Credit transaction seed failed", {
        id: "credit-transaction-seed",
        description: message,
      });
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Seed Button */}
      <button
        type="button"
        onClick={handleSeed}
        disabled={isSeeding}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
      >
        {isSeeding ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Seeding Database...
          </>
        ) : result?.success ? (
          <>
            <RefreshCcw className="h-4 w-4" />
            Re-seed Credit Transaction
          </>
        ) : (
          <>
            <Database className="h-4 w-4" />
            Seed Credit Transaction
          </>
        )}
      </button>

      {/* Loading Status */}
      {isSeeding && (
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
          <div className="flex items-start gap-3">
            <Loader2 className="mt-0.5 h-5 w-5 animate-spin text-blue-600" />

            <div>
              <p className="text-sm font-semibold text-blue-900">
                Seeding Credit Transaction
              </p>

              <p className="mt-1 text-xs text-blue-700">
                Connecting to MongoDB and creating the
                credit transaction record...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Success Status */}
      {!isSeeding && result?.success && result.transaction && (
        <div className="overflow-hidden rounded-2xl border border-emerald-200 bg-emerald-50">
          {/* Header */}
          <div className="flex items-start gap-3 border-b border-emerald-200 p-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            </div>

            <div>
              <p className="text-sm font-bold text-emerald-900">
                Credit Transaction Seeded
              </p>

              <p className="mt-0.5 text-xs text-emerald-700">
                {result.message}
              </p>
            </div>

            <span className="ml-auto rounded-lg bg-emerald-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
              SUCCESS
            </span>
          </div>

          {/* Transaction Details */}
          <div className="grid grid-cols-1 gap-px bg-emerald-200 sm:grid-cols-2 lg:grid-cols-3">
            {/* Reference */}
            <div className="bg-white p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Reference
              </p>

              <p className="mt-1 font-mono text-xs font-bold text-slate-900">
                {result.transaction.reference}
              </p>
            </div>

            {/* Buyer */}
            <div className="bg-white p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Buyer
              </p>

              <p className="mt-1 text-xs font-semibold text-slate-900">
                {result.transaction.buyerName}
              </p>
            </div>

            {/* Transaction Type */}
            <div className="bg-white p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Transaction Type
              </p>

              <p className="mt-1 text-xs font-bold text-amber-700">
                {result.transaction.direction}
              </p>
            </div>

            {/* Amount */}
            <div className="bg-white p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Amount
              </p>

              <p className="mt-1 font-mono text-sm font-bold text-slate-900">
                {formatCurrency(
                  result.transaction.amount
                )}
              </p>
            </div>

            {/* Balance Before */}
            <div className="bg-white p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Balance Before
              </p>

              <p className="mt-1 font-mono text-sm font-bold text-slate-900">
                {formatCurrency(
                  result.transaction.balanceBefore
                )}
              </p>
            </div>

            {/* Balance After */}
            <div className="bg-white p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Balance After
              </p>

              <p className="mt-1 font-mono text-sm font-bold text-amber-700">
                {formatCurrency(
                  result.transaction.balanceAfter
                )}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="border-t border-emerald-200 bg-white p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Description
            </p>

            <p className="mt-1 text-xs text-slate-600">
              {result.transaction.description}
            </p>
          </div>

          {/* Metadata */}
          <div className="flex flex-col gap-2 border-t border-emerald-200 bg-slate-50 p-4 text-[10px] text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <span>
              Transaction ID:{" "}
              <span className="font-mono font-semibold text-slate-700">
                {result.transaction.id}
              </span>
            </span>

            <span>
              Created:{" "}
              <span className="font-semibold text-slate-700">
                {formatDate(
                  result.transaction.createdAt
                )}
              </span>
            </span>
          </div>
        </div>
      )}

      {/* Failure Status */}
      {!isSeeding && result && !result.success && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-100">
              <AlertCircle className="h-5 w-5 text-red-600" />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-bold text-red-900">
                Credit Transaction Seed Failed
              </p>

              <p className="mt-1 text-xs text-red-700">
                {result.error || result.message}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}