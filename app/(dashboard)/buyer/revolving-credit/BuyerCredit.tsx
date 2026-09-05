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

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

type CreditAccount = {
  id: string;
  buyerId: string;
  creditLimit: number;
  creditUsed: number;
  availableCredit: number;
  outstandingBalance: number;
  creditTermDays: number;
  dueDate: string;
  status: "ACTIVE" | "SUSPENDED" | "PENDING";
  approvedAt: string;
  lastUpdatedAt: string;
};

type CreditTransactionType =
  | "CREDIT_PURCHASE"
  | "REPAYMENT"
  | "CREDIT_ADJUSTMENT"
  | "CREDIT_APPROVAL";

type CreditTransactionDirection = "CHARGE" | "REPAYMENT" | "ADJUSTMENT";

type CreditTransaction = {
  id: string;
  reference: string;
  type: CreditTransactionType;
  direction: CreditTransactionDirection;
  description: string;
  amount: number;
  balanceAfter: number;
  createdAt: string;
};

/* -------------------------------------------------------------------------- */
/* Mock Data                                                                  */
/* -------------------------------------------------------------------------- */

const mockCreditAccount: CreditAccount = {
  id: "credit_buyer_001",
  buyerId: "buyer_001",
  creditLimit: 3_000_000,
  creditUsed: 615_000,
  availableCredit: 2_385_000,
  outstandingBalance: 615_000,
  creditTermDays: 30,
  dueDate: "2026-09-18T23:59:59",
  status: "ACTIVE",
  approvedAt: "2026-07-15T10:30:00",
  lastUpdatedAt: "2026-09-05T09:30:00",
};

const mockCreditTransactions: CreditTransaction[] = [
  {
    id: "ctx_001",
    reference: "MS-CRD-2026-000184",
    type: "CREDIT_PURCHASE",
    direction: "CHARGE",
    description:
      "Paracetamol 500mg — 5,000 tablets from May & Baker Nigeria Plc",
    amount: 615_000,
    balanceAfter: 615_000,
    createdAt: "2026-08-19T14:25:00",
  },
  {
    id: "ctx_002",
    reference: "MS-REP-260820-001",
    type: "REPAYMENT",
    direction: "REPAYMENT",
    description: "Institutional bank transfer repayment settlement",
    amount: 300_000,
    balanceAfter: 315_000,
    createdAt: "2026-08-20T11:40:00",
  },
  {
    id: "ctx_003",
    reference: "MS-CRD-2026-000181",
    type: "CREDIT_PURCHASE",
    direction: "CHARGE",
    description:
      "Amoxicillin 500mg — 2,000 capsules from Fidson Healthcare Plc",
    amount: 510_000,
    balanceAfter: 825_000,
    createdAt: "2026-08-21T09:15:00",
  },
  {
    id: "ctx_004",
    reference: "MS-REP-260825-001",
    type: "REPAYMENT",
    direction: "REPAYMENT",
    description: "Partial credit facility repayment",
    amount: 510_000,
    balanceAfter: 315_000,
    createdAt: "2026-08-25T16:10:00",
  },
  {
    id: "ctx_005",
    reference: "MS-CRD-2026-000190",
    type: "CREDIT_PURCHASE",
    direction: "CHARGE",
    description:
      "Ibuprofen 400mg — 3,500 tablets from Emzor Pharmaceutical Industries Ltd",
    amount: 630_000,
    balanceAfter: 945_000,
    createdAt: "2026-08-28T13:05:00",
  },
  {
    id: "ctx_006",
    reference: "MS-REP-260901-001",
    type: "REPAYMENT",
    direction: "REPAYMENT",
    description: "Institutional bank transfer repayment settlement",
    amount: 330_000,
    balanceAfter: 615_000,
    createdAt: "2026-09-01T10:20:00",
  },
];

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

const BuyerCredit: React.FC = () => {
  const [creditAccount, setCreditAccount] =
    useState<CreditAccount>(mockCreditAccount);

  const [creditTransactions, setCreditTransactions] = useState<
    CreditTransaction[]
  >(mockCreditTransactions);

  const [repayAmount, setRepayAmount] = useState<number>(100_000);
  const [isRepaying, setIsRepaying] = useState<boolean>(false);
  const [showRepayModal, setShowRepayModal] = useState<boolean>(false);

  /* ------------------------------------------------------------------------ */
  /* Derived Values                                                           */
  /* ------------------------------------------------------------------------ */

  const limit = creditAccount.creditLimit;
  const used = creditAccount.creditUsed;
  const avail = creditAccount.availableCredit;

  const percentUsed = useMemo(() => {
    if (limit <= 0) return 0;

    return Math.min(100, Math.round((used / limit) * 100));
  }, [limit, used]);

  const formatCurrency = (amount: number) =>
    `₦${amount.toLocaleString("en-NG")}`;

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-NG", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  /* ------------------------------------------------------------------------ */
  /* Repayment                                                                */
  /* ------------------------------------------------------------------------ */

  const handleRepay = async () => {
    if (repayAmount <= 0) {
      toast.error("Invalid amount", {
        description: "Repayment must be greater than zero.",
      });
      return;
    }

    if (repayAmount > creditAccount.outstandingBalance) {
      toast.error("Invalid repayment amount", {
        description: `You cannot repay more than the outstanding balance of ${formatCurrency(
          creditAccount.outstandingBalance
        )}.`,
      });
      return;
    }

    setIsRepaying(true);

    try {
      // Simulate institutional bank transfer settlement.
      await new Promise((resolve) => setTimeout(resolve, 900));

      const previousBalance = creditAccount.outstandingBalance;
      const newOutstandingBalance = Math.max(
        0,
        previousBalance - repayAmount
      );

      const newCreditUsed = newOutstandingBalance;
      const newAvailableCredit = Math.min(
        creditAccount.creditLimit,
        creditAccount.availableCredit + repayAmount
      );

      const transaction: CreditTransaction = {
        id: `ctx_${Date.now()}`,
        reference: `MS-REP-${new Date()
          .toISOString()
          .slice(2, 10)
          .replace(/-/g, "")}-${String(
          creditTransactions.length + 1
        ).padStart(3, "0")}`,
        type: "REPAYMENT",
        direction: "REPAYMENT",
        description: "Institutional bank transfer repayment settlement",
        amount: repayAmount,
        balanceAfter: newOutstandingBalance,
        createdAt: new Date().toISOString(),
      };

      setCreditTransactions((previous) => [
        transaction,
        ...previous,
      ]);

      setCreditAccount((previous) => ({
        ...previous,
        creditUsed: newCreditUsed,
        outstandingBalance: newOutstandingBalance,
        availableCredit: newAvailableCredit,
        lastUpdatedAt: new Date().toISOString(),
      }));

      setShowRepayModal(false);

      toast.success("Credit Repayment Settled", {
        description: `${formatCurrency(
          repayAmount
        )} has been applied to your revolving credit balance.`,
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

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-xl font-bold text-slate-900">
            Revolving Institutional Credit Facility
          </h1>

          <p className="text-xs text-slate-500 mt-0.5">
            Admin-approved Net 30-day deferred settlement facility for
            verified healthcare systems
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowRepayModal(true)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition flex items-center gap-1.5 cursor-pointer self-start"
        >
          <CreditCard className="w-4 h-4" />
          <span>Make Credit Facility Repayment</span>
        </button>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Credit Summary Cards                                              */}
      {/* ------------------------------------------------------------------ */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Available Credit */}
        <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white p-6 rounded-2xl shadow-lg relative">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-300 mb-1">
            Available Credit Limit
          </div>

          <div className="font-mono text-2xl font-bold mt-2">
            {formatCurrency(avail)}
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-emerald-200/80">
            <span>
              Approved Limit: {formatCurrency(limit)}
            </span>

            <span>Terms: Net 30 Days</span>
          </div>
        </div>

        {/* Outstanding Balance */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Outstanding Balance Due
            </div>

            <div className="font-mono text-xl font-bold text-amber-700 mt-1">
              {formatCurrency(creditAccount.outstandingBalance)}
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Due Date: {formatDate(creditAccount.dueDate)}
            </span>

            <span className="text-emerald-700 font-semibold">
              0% Interest Net Terms
            </span>
          </div>
        </div>

        {/* Utilization Gauge */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
              <span>Facility Utilization</span>

              <span className="font-mono font-bold text-slate-900">
                {percentUsed}%
              </span>
            </div>

            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mt-2">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  percentUsed > 80
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

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />

            <span>Admin-guaranteed institutional facility</span>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Facility Status                                                    */}
      {/* ------------------------------------------------------------------ */}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>

            <div>
              <p className="text-xs font-bold text-slate-900">
                Credit Facility Active
              </p>

              <p className="text-[11px] text-slate-500">
                Your institutional credit facility is available for eligible
                procurement orders.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px]">
            <span className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-bold">
              {creditAccount.status}
            </span>

            <span className="text-slate-400">
              Updated {formatDate(creditAccount.lastUpdatedAt)}
            </span>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Credit Repayment Modal                                             */}
      {/* ------------------------------------------------------------------ */}

      {showRepayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-start justify-between gap-4 mb-1">
              <div>
                <h3 className="font-display font-bold text-slate-900 text-base">
                  Repay Credit Line
                </h3>

                <p className="text-xs text-slate-500 mt-1">
                  Restore your revolving facility limit by settling
                  outstanding balances.
                </p>
              </div>

              <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                <CreditCard className="w-4 h-4 text-emerald-600" />
              </div>
            </div>

            <div className="mt-5 space-y-4 text-xs">
              {/* Outstanding */}
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">
                    Current Outstanding
                  </span>

                  <span className="font-mono font-bold text-amber-700">
                    {formatCurrency(
                      creditAccount.outstandingBalance
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <span className="text-slate-500">
                    Available After Repayment
                  </span>

                  <span className="font-mono font-bold text-emerald-700">
                    {formatCurrency(
                      Math.min(
                        creditAccount.creditLimit,
                        creditAccount.availableCredit + repayAmount
                      )
                    )}
                  </span>
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Repayment Amount (₦)
                </label>

                <input
                  type="number"
                  min={1}
                  max={creditAccount.outstandingBalance}
                  value={repayAmount}
                  onChange={(e) =>
                    setRepayAmount(Number(e.target.value))
                  }
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl font-mono text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400"
                />

                <div className="flex items-center justify-between mt-1.5 text-[10px] text-slate-400">
                  <span>Minimum: ₦1</span>

                  <span>
                    Maximum:{" "}
                    {formatCurrency(
                      creditAccount.outstandingBalance
                    )}
                  </span>
                </div>
              </div>

              {/* Settlement notice */}
              <div className="flex gap-2 p-3 rounded-xl bg-blue-50 border border-blue-100">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />

                <div className="text-[11px] text-blue-800">
                  <p className="font-bold">
                    Institutional Settlement
                  </p>

                  <p className="mt-0.5 text-blue-700">
                    This mock transaction simulates a successful bank
                    transfer settlement.
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowRepayModal(false)}
                  disabled={isRepaying}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold cursor-pointer hover:bg-slate-50 transition disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={
                    isRepaying ||
                    repayAmount <= 0 ||
                    repayAmount >
                      creditAccount.outstandingBalance
                  }
                  onClick={handleRepay}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {isRepaying ? (
                    <span className="flex items-center justify-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 animate-pulse" />
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

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-slate-500" />

            <h2 className="font-display text-sm font-bold text-slate-900 uppercase tracking-wider">
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
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10.5px] border-b border-slate-100">
              <tr>
                <th className="py-3 px-4 font-semibold">
                  Reference
                </th>

                <th className="py-3 px-4 font-semibold">
                  Type & Description
                </th>

                <th className="py-3 px-4 font-semibold">
                  Timestamp
                </th>

                <th className="py-3 px-4 font-semibold text-right">
                  Amount
                </th>

                <th className="py-3 px-4 font-semibold text-right">
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
                creditTransactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className="hover:bg-slate-50 transition"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                      {tx.reference}
                    </td>

                    <td className="py-3 px-4 min-w-[280px]">
                      <div className="flex items-center gap-2">
                        {tx.direction === "REPAYMENT" ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        )}

                        <div>
                          <div className="font-semibold text-slate-900">
                            {tx.type.replace(/_/g, " ")}
                          </div>

                          <div className="text-[11px] text-slate-500">
                            {tx.description}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                      {formatDate(tx.createdAt)}
                    </td>

                    <td
                      className={`py-3 px-4 text-right font-mono font-bold whitespace-nowrap ${
                        tx.direction === "REPAYMENT"
                          ? "text-emerald-700"
                          : "text-amber-800"
                      }`}
                    >
                      {tx.direction === "REPAYMENT" ? "-" : "+"}
                      {formatCurrency(tx.amount)}
                    </td>

                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 whitespace-nowrap">
                      {formatCurrency(tx.balanceAfter)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BuyerCredit;