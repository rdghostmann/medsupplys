// BuyerCredit.tsx
"use client";

import React, { useMemo, useState } from "react";
import {
  CreditCard,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  History,
  ShieldCheck,
  Clock,
} from "lucide-react";
import { toast } from "sonner";

import type {
  CurrentBuyerCreditAccount,
  CurrentBuyerCreditTransaction,
} from "@/controllers/buyer.actions";

/* -------------------------------------------------------------------------- */
/* Props                                                                      */
/* -------------------------------------------------------------------------- */

interface BuyerCreditProps {
  creditAccount: CurrentBuyerCreditAccount | null;
  creditTransactions: CurrentBuyerCreditTransaction[];
}

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

const BuyerCredit: React.FC<BuyerCreditProps> = ({
  creditAccount,
  creditTransactions,
}) => {
  const [repayAmount, setRepayAmount] =
    useState<number>(100_000);

  const [isRepaying, setIsRepaying] =
    useState<boolean>(false);

  const [showRepayModal, setShowRepayModal] =
    useState<boolean>(false);

  /* ------------------------------------------------------------------------ */
  /* Derived Values                                                           */
  /* ------------------------------------------------------------------------ */

  const limit = creditAccount?.creditLimit ?? 0;

  const used = creditAccount?.creditUsed ?? 0;

  const avail = creditAccount?.availableCredit ?? 0;

  const outstandingBalance =
    creditAccount?.outstandingBalance ?? 0;

  const percentUsed = useMemo(() => {
    if (limit <= 0) return 0;

    return Math.min(
      100,
      Math.round((used / limit) * 100)
    );
  }, [limit, used]);

  const formatCurrency = (amount: number) =>
    `₦${amount.toLocaleString("en-NG")}`;

  const formatDate = (date?: string) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-NG", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  /* ------------------------------------------------------------------------ */
  /* No Credit Facility                                                       */
  /* ------------------------------------------------------------------------ */

  if (!creditAccount) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-xl font-bold text-slate-900">
            Revolving Institutional Credit Facility
          </h1>

          <p className="mt-0.5 text-xs text-slate-500">
            Admin-approved deferred settlement facility for
            verified healthcare systems.
          </p>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

            <div>
              <h2 className="text-sm font-bold text-amber-900">
                No Credit Facility Available
              </h2>

              <p className="mt-1 text-xs leading-relaxed text-amber-800">
                Your buyer account does not currently have an
                approved revolving credit facility. Contact
                MedSupply administration if you believe this is
                an error.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ------------------------------------------------------------------------ */
  /* Repayment                                                                */
  /* ------------------------------------------------------------------------ */

  const handleRepay = async () => {
    if (repayAmount <= 0) {
      toast.error("Invalid amount", {
        description:
          "Repayment must be greater than zero.",
      });

      return;
    }

    if (repayAmount > outstandingBalance) {
      toast.error("Invalid repayment amount", {
        description: `You cannot repay more than the outstanding balance of ${formatCurrency(
          outstandingBalance
        )}.`,
      });

      return;
    }

    setIsRepaying(true);

    try {
      /*
       * IMPORTANT:
       * This is still a UI simulation.
       *
       * The next step should replace this with a real
       * Server Action that creates a CreditTransaction
       * and atomically updates CreditAccount.
       */
      await new Promise((resolve) =>
        setTimeout(resolve, 900)
      );

      setShowRepayModal(false);

      toast.success("Repayment Request Submitted", {
        description: `${formatCurrency(
          repayAmount
        )} repayment has been submitted for settlement.`,
      });

      setRepayAmount(100_000);
    } catch (error) {
      toast.error("Repayment failed", {
        description:
          error instanceof Error
            ? error.message
            : "Unable to process the repayment.",
      });
    } finally {
      setIsRepaying(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* ------------------------------------------------------------------ */}
      {/* Header                                                             */}
      {/* ------------------------------------------------------------------ */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-xl font-bold text-slate-900">
            Revolving Institutional Credit Facility
          </h1>

          <p className="mt-0.5 text-xs text-slate-500">
            Admin-approved Net 30-day deferred settlement
            facility for verified healthcare systems
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowRepayModal(true)}
          disabled={
            creditAccount.status !== "ACTIVE" ||
            outstandingBalance <= 0
          }
          className="flex cursor-pointer items-center gap-1.5 self-start rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <CreditCard className="h-4 w-4" />

          <span className="text-[11px]">
            Credit Facility Repayment
          </span>
        </button>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Credit Summary Cards                                               */}
      {/* ------------------------------------------------------------------ */}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Available Credit */}
        <div className="relative rounded-2xl bg-linear-to-br from-slate-900 via-emerald-950 to-slate-900 p-6 text-white shadow-lg">
          <div className="mb-1 text-xs font-bold uppercase tracking-wider text-emerald-300">
            Available Credit Limit
          </div>

          <div className="mt-2 font-mono text-2xl font-bold">
            {formatCurrency(avail)}
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-[11px] text-emerald-200/80">
            <span>
              Approved Limit: {formatCurrency(limit)}
            </span>

            <span>
              Terms: Net{" "}
              {"30 Days"}
              {/* {creditAccount.terms || "30 Days"} */}
            </span>
          </div>
        </div>

        {/* Outstanding Balance */}
        <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div>
            <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Outstanding Balance Due
            </div>

            <div className="mt-1 font-mono text-xl font-bold text-amber-700">
              {formatCurrency(outstandingBalance)}
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />

              Due Date:{" "}
              {formatDate(creditAccount.dueDate)}
            </span>

            <span className="font-semibold text-emerald-700">
              {creditAccount.interestRatePercent}% Interest
            </span>
          </div>
        </div>

        {/* Utilization Gauge */}
        <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div>
            <div className="mb-1 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-500">
              <span>Facility Utilization</span>

              <span className="font-mono font-bold text-slate-900">
                {percentUsed}%
              </span>
            </div>

            <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full transition-all duration-300 ${percentUsed > 80
                    ? "bg-red-500"
                    : percentUsed > 50
                      ? "bg-amber-500"
                      : "bg-emerald-500"
                  }`}
                style={{
                  width: `${percentUsed}%`,
                }}
              />
            </div>
          </div>

          <div className="mt-3 flex items-center gap-1.5 border-t border-slate-100 pt-3 text-[11px] text-slate-400">
            <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />

            <span>
              Admin-guaranteed institutional facility
            </span>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Facility Status                                                    */}
      {/* ------------------------------------------------------------------ */}

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            </div>

            <div>
              <p className="text-xs font-bold text-slate-900">
                Credit Facility{" "}
                {creditAccount.status === "ACTIVE"
                  ? "Active"
                  : creditAccount.status}
              </p>

              <p className="text-[11px] text-slate-500">
                Your institutional credit facility is available
                for eligible procurement orders.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px]">
            <span className="rounded-lg bg-emerald-50 px-2 py-1 font-bold text-emerald-700">
              {creditAccount.status}
            </span>

            <span className="text-slate-400">
              Updated{" "}
              {formatDate(creditAccount.updatedAt)}
            </span>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Credit Repayment Modal                                             */}
      {/* ------------------------------------------------------------------ */}

      {showRepayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="mb-1 flex items-start justify-between gap-4">
              <div>
                <h3 className="font-display text-base font-bold text-slate-900">
                  Repay Credit Line
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Restore your revolving facility availability by
                  settling an outstanding credit balance.
                </p>
              </div>

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
                <CreditCard className="h-4 w-4 text-emerald-600" />
              </div>
            </div>

            <div className="mt-5 space-y-4 text-xs">
              {/* Outstanding */}
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">
                    Current Outstanding
                  </span>

                  <span className="font-mono font-bold text-amber-700">
                    {formatCurrency(outstandingBalance)}
                  </span>
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <span className="text-slate-500">
                    Available After Repayment
                  </span>

                  <span className="font-mono font-bold text-emerald-700">
                    {formatCurrency(
                      Math.min(
                        creditAccount.creditLimit,
                        creditAccount.availableCredit +
                        repayAmount
                      )
                    )}
                  </span>
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="mb-1 block font-semibold text-slate-700">
                  Repayment Amount (₦)
                </label>

                <input
                  type="number"
                  min={1}
                  max={outstandingBalance}
                  value={repayAmount}
                  onChange={(event) =>
                    setRepayAmount(
                      Number(event.target.value)
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 font-mono text-sm font-bold focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />

                <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Minimum: ₦1</span>

                  <span>
                    Maximum:{" "}
                    {formatCurrency(outstandingBalance)}
                  </span>
                </div>
              </div>

              {/* Settlement notice */}
              <div className="flex gap-2 rounded-xl border border-blue-100 bg-blue-50 p-3">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />

                <div className="text-[11px] text-blue-800">
                  <p className="font-bold">
                    Institutional Settlement
                  </p>

                  <p className="mt-0.5 text-blue-700">
                    Repayments are applied against your outstanding
                    credit balance and restore equivalent available
                    credit after settlement.
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() =>
                    setShowRepayModal(false)
                  }
                  disabled={isRepaying}
                  className="flex-1 cursor-pointer rounded-xl border border-slate-200 py-2.5 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={
                    isRepaying ||
                    repayAmount <= 0 ||
                    repayAmount > outstandingBalance
                  }
                  onClick={handleRepay}
                  className="flex-1 cursor-pointer rounded-xl bg-emerald-600 py-2.5 font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isRepaying ? (
                    <span className="flex items-center justify-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 animate-pulse" />
                      Processing...
                    </span>
                  ) : (
                    "Confirm Repayment"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Credit Transactions Ledger                                         */}
      {/* ------------------------------------------------------------------ */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-slate-500" />

            <h2 className="font-display text-sm font-bold uppercase tracking-wider text-slate-900">
              Credit Facility Activity & Charges (
              {creditTransactions.length})
            </h2>
          </div>

          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Net 30 Facility
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 bg-slate-50 text-[10.5px] uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">
                  Reference
                </th>

                <th className="px-4 py-3 font-semibold">
                  Type & Description
                </th>

                <th className="px-4 py-3 font-semibold">
                  Timestamp
                </th>

                <th className="px-4 py-3 text-right font-semibold">
                  Amount
                </th>

                <th className="px-4 py-3 text-right font-semibold">
                  Outstanding Balance
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {creditTransactions.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-8 text-center text-slate-400"
                  >
                    No credit transactions on record.
                  </td>
                </tr>
              ) : (
                creditTransactions.map((tx) => {
                  const isPayment =
                    tx.direction === "PAYMENT";

                  return (
                    <tr
                      key={tx.id}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="whitespace-nowrap px-4 py-3 font-mono font-bold text-slate-900">
                        {tx.reference}
                      </td>

                      <td className="min-w-70 px-4 py-3">
                        <div className="flex items-center gap-2">
                          {isPayment ? (
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                          ) : (
                            <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                          )}

                          <div>
                            <div className="font-semibold text-slate-900">
                              {tx.type.replace(
                                /_/g,
                                " "
                              )}
                            </div>

                            <div className="text-[11px] text-slate-500">
                              {tx.description}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-4 py-3 font-mono text-[11px] text-slate-500">
                        {formatDate(tx.createdAt)}
                      </td>

                      <td
                        className={`whitespace-nowrap px-4 py-3 text-right font-mono font-bold ${isPayment
                            ? "text-emerald-700"
                            : "text-amber-800"
                          }`}
                      >
                        {isPayment ? "-" : "+"}
                        {formatCurrency(tx.amount)}
                      </td>

                      <td className="whitespace-nowrap px-4 py-3 text-right font-mono font-bold text-slate-900">
                        {formatCurrency(tx.balanceAfter)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BuyerCredit;