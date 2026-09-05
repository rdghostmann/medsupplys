// FinancialOperationalMetricCards.tsx

"use client";

import React from "react";
import {
  CreditCard,
  PackageCheck,
  ShoppingBag,
  Sparkles,
  Wallet as WalletIcon,
} from "lucide-react";

interface FinancialOperationalMetricCardsProps {
  walletBalance: number;
  walletStatus?: string;

  creditLimit: number;
  creditUsed: number;
  availableCredit: number;
  totalPurchasingPower: number;

  activeProcurements: number;
  activeOrders: number;

  loading?: boolean;

  onTopUp?: () => void;
  onViewProcurementQueue?: () => void;
  onTrackOrders?: () => void;
}

const formatCurrency = (value: number) =>
  `₦${Number(value || 0).toLocaleString("en-NG")}`;

interface MetricCardSkeletonProps {
  variant:
    | "wallet"
    | "credit"
    | "purchasing-power"
    | "procurement"
    | "orders";
}

const MetricCardSkeleton: React.FC<MetricCardSkeletonProps> = ({
  variant,
}) => {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
      <div className="flex items-center justify-between mb-2">
        <div className="h-3 w-28 animate-pulse rounded bg-slate-200" />

        <div className="w-8 h-8 rounded-lg bg-slate-100 animate-pulse" />
      </div>

      <div className="h-7 w-24 animate-pulse rounded bg-slate-200" />

      <div className="flex items-center justify-between text-[11px] mt-3 pt-3 border-t border-slate-100">
        <div className="h-3 w-24 animate-pulse rounded bg-slate-100" />

        <div className="h-3 w-16 animate-pulse rounded bg-slate-100" />
      </div>
    </div>
  );
};

export const FinancialOperationalMetricCards: React.FC<
  FinancialOperationalMetricCardsProps
> = ({
  walletBalance,
  walletStatus = "Active",
  creditLimit,
  availableCredit,
  totalPurchasingPower,
  activeProcurements,
  activeOrders,
  loading = false,
  onTopUp,
  onViewProcurementQueue,
  onTrackOrders,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCardSkeleton variant="wallet" />
        <MetricCardSkeleton variant="credit" />
        <MetricCardSkeleton variant="purchasing-power" />
        <MetricCardSkeleton variant="procurement" />
        <MetricCardSkeleton variant="orders" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Wallet Balance */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-200 transition">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">
            Wallet Balance
          </span>

          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <WalletIcon className="w-4 h-4" />
          </div>
        </div>

        <div className="font-mono text-xl font-bold text-slate-900">
          {formatCurrency(walletBalance)}
        </div>

        <div className="flex items-center justify-between text-[11px] mt-3 pt-3 border-t border-slate-100">
          <span className="text-slate-400">
            Status: {walletStatus}
          </span>

          <button
            type="button"
            onClick={onTopUp}
            disabled={!onTopUp}
            className="text-blue-600 font-semibold hover:underline cursor-pointer disabled:cursor-default disabled:no-underline disabled:opacity-60"
          >
            Top Up +
          </button>
        </div>
      </div>

      {/* Total Purchasing Power */}
      <div className="hidden bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-cyan-200 transition">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">
            Purchasing Power
          </span>

          <div className="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center">
            <WalletIcon className="w-4 h-4" />
          </div>
        </div>

        <div className="font-mono text-xl font-bold text-cyan-700">
          {formatCurrency(totalPurchasingPower)}
        </div>

        <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
          Wallet + available credit
        </div>
      </div>

      {/* Available Revolving Credit */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-200 transition">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">
            Available Credit
          </span>

          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CreditCard className="w-4 h-4" />
          </div>
        </div>

        <div className="font-mono text-xl font-bold text-emerald-700">
          {formatCurrency(availableCredit)}
        </div>

        <div className="flex items-center justify-between text-[11px] mt-3 pt-3 border-t border-slate-100">
          <span className="text-slate-400">
            Limit: {formatCurrency(creditLimit)}
          </span>

          <span className="text-emerald-700 font-medium">
            Net 30 Days
          </span>
        </div>
      </div>

      {/* Active Procurements / RFQs */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-200 transition">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">
            Active Sourcing RFQs
          </span>

          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>

        <div className="font-mono text-xl font-bold text-slate-900">
          {activeProcurements}
        </div>

        <div className="flex items-center justify-between text-[11px] mt-3 pt-3 border-t border-slate-100">
          <span className="text-slate-400">
            Matching Engine Active
          </span>

          <button
            type="button"
            onClick={onViewProcurementQueue}
            disabled={!onViewProcurementQueue}
            className="text-amber-700 font-semibold hover:underline cursor-pointer disabled:cursor-default disabled:no-underline disabled:opacity-60"
          >
            View Queue →
          </button>
        </div>
      </div>

      {/* Active Orders & Logistics */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-purple-200 transition">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">
            Committed Orders
          </span>

          <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
            <ShoppingBag className="w-4 h-4" />
          </div>
        </div>

        <div className="font-mono text-xl font-bold text-slate-900">
          {activeOrders}
        </div>

        <div className="flex items-center justify-between text-[11px] mt-3 pt-3 border-t border-slate-100">
          <span className="text-slate-400">
            Under QA / In Transit
          </span>

          <button
            type="button"
            onClick={onTrackOrders}
            disabled={!onTrackOrders}
            className="text-purple-700 font-semibold hover:underline cursor-pointer disabled:cursor-default disabled:no-underline disabled:opacity-60"
          >
            Track Deliveries →
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinancialOperationalMetricCards;