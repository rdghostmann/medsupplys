// FinancialOperationalMetricCards.tsx

"use client"

import React from "react"
import {
  CreditCard,
  ShoppingBag,
  Sparkles,
  Wallet as WalletIcon,
} from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface FinancialOperationalMetricCardsProps {
  walletBalance: number
  walletStatus?: string

  creditLimit: number
  creditUsed: number
  availableCredit: number
  totalPurchasingPower: number

  totalOrders: number
  pendingOrders: number
  activeOrders: number
  deliveredOrders: number
  rejectedOrders: number

  loading?: boolean

  onTopUp?: () => void
  onViewProcurementQueue?: () => void
  onTrackOrders?: () => void
}

const formatCurrency = (value: number) =>
  `₦${Number(value || 0).toLocaleString("en-NG")}`

interface MetricCardSkeletonProps {
  variant: "wallet" | "credit" | "purchasing-power" | "procurement" | "orders"
}

const MetricCardSkeleton: React.FC<MetricCardSkeletonProps> = ({ variant }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
      <div className="mb-2 flex items-center justify-between">
        <div className="h-3 w-28 animate-pulse rounded bg-slate-200" />

        <div className="h-8 w-8 animate-pulse rounded-lg bg-slate-100" />
      </div>

      <div className="h-7 w-24 animate-pulse rounded bg-slate-200" />

      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px]">
        <div className="h-3 w-24 animate-pulse rounded bg-slate-100" />

        <div className="h-3 w-16 animate-pulse rounded bg-slate-100" />
      </div>
    </div>
  )
}

export const FinancialOperationalMetricCards: React.FC<
  FinancialOperationalMetricCardsProps
> = ({
  walletBalance,
  walletStatus = "Active",
  creditLimit,
  availableCredit,
  totalPurchasingPower,
  totalOrders,
  pendingOrders,
  activeOrders,
  deliveredOrders,
  rejectedOrders,
  loading = false,
  onTopUp,
  onViewProcurementQueue,
  onTrackOrders,
}) => {
  const router = useRouter()

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <MetricCardSkeleton variant="wallet" />
        <MetricCardSkeleton variant="credit" />
        <MetricCardSkeleton variant="purchasing-power" />
        <MetricCardSkeleton variant="procurement" />
        <MetricCardSkeleton variant="orders" />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Wallet Balance */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:border-blue-200">
        <div className="mb-2 flex items-center justify-between text-slate-500">
          <span className="text-xs font-semibold tracking-wider uppercase">
            Wallet Balance
          </span>

          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <WalletIcon className="h-4 w-4" />
          </div>
        </div>

        <div className="font-mono text-xl font-bold text-slate-900">
          {formatCurrency(walletBalance)}
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px]">
          <span className="text-slate-400">Status: {walletStatus}</span>

          {/* <Link
              href="/buyer/buyerwallet"
              className="rounded-[1.5px] p-0.5  cursor-pointer text-blue-600/80 font-semibold hover:underline disabled:cursor-default disabled:no-underline disabled:opacity-60"
            >
              Top Up +
            </Link> */}
          <button
            type="button"
            onClick={() => {
              router.push("/buyer/buyerwallet")
            }}
            className="cursor-pointer rounded-[1.5px] p-0.5 font-semibold text-blue-600/80 hover:underline disabled:cursor-default disabled:no-underline disabled:opacity-60"
          >
            Top Up +
          </button>
        </div>
      </div>

      {/* Total Purchasing Power */}
      <div className="hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:border-cyan-200">
        <div className="mb-2 flex items-center justify-between text-slate-500">
          <span className="text-xs font-semibold tracking-wider uppercase">
            Purchasing Power
          </span>

          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600">
            <WalletIcon className="h-4 w-4" />
          </div>
        </div>

        <div className="font-mono text-xl font-bold text-cyan-700">
          {formatCurrency(totalPurchasingPower)}
        </div>

        <div className="mt-3 border-t border-slate-100 pt-3 text-[11px] text-slate-400">
          Wallet + available credit
        </div>
      </div>

      {/* Available Revolving Credit */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:border-emerald-200">
        <div className="mb-2 flex items-center justify-between text-slate-500">
          <span className="text-xs font-semibold tracking-wider uppercase">
            Available Credit
          </span>

          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <CreditCard className="h-4 w-4" />
          </div>
        </div>

        <div className="font-mono text-xl font-bold text-emerald-700">
          {formatCurrency(availableCredit)}
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px]">
          <span className="text-slate-400">
            Limit: {formatCurrency(creditLimit)}
          </span>

          <span className="font-medium text-emerald-700">Net 30 Days</span>
        </div>
      </div>

      {/* Active Procurements / RFQs */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:border-amber-200">
        <div className="mb-2 flex items-center justify-between text-slate-500">
          <span className="text-xs font-semibold tracking-wider uppercase">
            Active Sourcing RFQs
          </span>

          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
            <Sparkles className="h-4 w-4" />
          </div>
        </div>

        <div className="font-mono text-xl font-bold text-slate-900">
          {pendingOrders}
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px]">
          <span className="hidden text-slate-400">Matching Engine Active</span>

          <button
            type="button"
            onClick={() => {
              router.push("/buyer/procurement-sourcing")
            }}
            className="cursor-pointer font-semibold text-amber-700 hover:underline disabled:cursor-default disabled:no-underline disabled:opacity-60"
          >
            View Queue →
          </button>
        </div>
      </div>

      {/* Active Orders & Logistics */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:border-purple-200">
        <div className="mb-2 flex items-center justify-between text-slate-500">
          <span className="text-xs font-semibold tracking-wider uppercase">
            Committed Orders
          </span>

          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
            <ShoppingBag className="h-4 w-4" />
          </div>
        </div>

        <div className="font-mono text-xl font-bold text-slate-900">
          {activeOrders}
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px]">
          <span className="hidden text-slate-400">
            {deliveredOrders} delivered / {rejectedOrders} rejected
          </span>

          <span className="hidden text-slate-400">
            {activeOrders} active of {totalOrders}
          </span>

          <button
            type="button"
            onClick={() => {
              router.push("/buyer/orders")
            }}
            className="cursor-pointer font-semibold text-purple-700 hover:underline disabled:cursor-default disabled:no-underline disabled:opacity-60"
          >
            Track Deliveries →
          </button>
        </div>
      </div>
    </div>
  )
}

export default FinancialOperationalMetricCards
