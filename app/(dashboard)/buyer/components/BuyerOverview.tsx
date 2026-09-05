// BuyerOverview.tsx
"use client"

import React, { useMemo } from "react"
import WelcomeBanner from "./BuyerOverview/WelcomeBanner"
import FinancialOperationalMetricCards from "./BuyerOverview/FinancialOperationalMetricCards"
import FallBackQueueMonitor from "./FallBackQueueMonitor"

import type {
  Order,
  OrderStatus,
  Supplier,
  ProcurementOrder,
} from "@/types"
import { ProductCatalogue } from "./ProductCatalogue"



export interface BuyerOverviewProps {
  user?: {
    id?: string
    name?: string
    firstName?: string
    lastName?: string
    organization?: string
    email?: string
  }

  wallet?: {
    balance: number
    currency?: string
    creditLimit?: number
    creditUsed?: number
  }

  orders?: Order[]

  fallbackQueue?: Supplier[]

  recentProcurements?: ProcurementOrder[]

  loading?: boolean
}

const DEFAULT_WALLET = {
  balance: 0,
  currency: "NGN",
  creditLimit: 0,
  creditUsed: 0,
}

const DEFAULT_ORDERS: Order[] = []

const DEFAULT_QUEUE: Supplier[] = []

export const BuyerOverview: React.FC<BuyerOverviewProps> = ({
  user,
  wallet = DEFAULT_WALLET,
  orders = DEFAULT_ORDERS,
  fallbackQueue = DEFAULT_QUEUE,
  recentProcurements = [],
  loading = false,
}) => {
  /**
   * Resolve display name safely.
   */
  const displayName = useMemo(() => {
    if (user?.firstName?.trim()) {
      return [user.firstName.trim(), user.lastName?.trim()]
        .filter(Boolean)
        .join(" ")
    }

    if (user?.name?.trim()) {
      return user.name.trim().split(" ")[0]
    }

    return "Buyer"
  }, [user])

  /**
   * Calculate operational order metrics.
   *
   * These are derived from the existing OrderStatus type rather
   * than introducing another dashboard-specific status system.
   */
  const orderMetrics = useMemo(() => {
    const pendingStatuses: OrderStatus[] = [
      "Pending",
      "Supplier Contacted",
      "Under Verification",
      "Supplier Confirmed",
    ]

    const activeStatuses: OrderStatus[] = [
      "Supplier Contacted",
      "Supplier Confirmed",
      "Under Verification",
      "In Transit to Office",
      "Verified",
    ]

    const pending = orders.filter((order) =>
      pendingStatuses.includes(order.status)
    ).length

    const active = orders.filter((order) =>
      activeStatuses.includes(order.status)
    ).length

    const delivered = orders.filter(
      (order) => order.status === "Delivered"
    ).length

    const rejected = orders.filter(
      (order) => order.status === "Rejected"
    ).length

    return {
      total: orders.length,
      pending,
      active,
      delivered,
      rejected,
    }
  }, [orders])

  /**
   * Wallet / credit calculations.
   */
  const financialMetrics = useMemo(() => {
    const balance = Number(wallet.balance || 0)
    const creditLimit = Number(wallet.creditLimit || 0)
    const creditUsed = Number(wallet.creditUsed || 0)

    const availableCredit = Math.max(creditLimit - creditUsed, 0)

    return {
      balance,
      creditLimit,
      creditUsed,
      availableCredit,
      totalPurchasingPower: balance + availableCredit,
    }
  }, [wallet])

  /**
   * Determine whether there is currently an active fallback queue.
   */
  const hasFallbackQueue = fallbackQueue.length > 0

  return (
    <section
      aria-labelledby="buyer-overview-title"
      className="space-y-6"
    >
      {/* =========================================================
          WELCOME / HEADER
      ========================================================= */}
      <WelcomeBanner
        id="buyer-overview-title"
        fullName={displayName}
        organization={user?.organization}
        walletBalance={financialMetrics.balance}
        creditAvailable={financialMetrics.availableCredit}
        loading={loading}
      />

      {/* =========================================================
          FINANCIAL + OPERATIONAL METRICS
      ========================================================= */}
      <FinancialOperationalMetricCards
        walletBalance={financialMetrics.balance}
        creditLimit={financialMetrics.creditLimit}
        creditUsed={financialMetrics.creditUsed}
        availableCredit={financialMetrics.availableCredit}
        totalPurchasingPower={financialMetrics.totalPurchasingPower}
        totalOrders={orderMetrics.total}
        pendingOrders={orderMetrics.pending}
        activeOrders={orderMetrics.active}
        deliveredOrders={orderMetrics.delivered}
        rejectedOrders={orderMetrics.rejected}
        loading={loading}
      />

      {/* =========================================================
          SUPPLIER FALLBACK QUEUE
      ========================================================= */}
      <FallBackQueueMonitor
        queue={fallbackQueue}
        orders={orders}
        hasQueue={hasFallbackQueue}
        loading={loading}
      />

      {/* =========================================================
          OPTIONAL PROCUREMENT CONTEXT
          This data is intentionally passed through without
          rendering another dashboard module yet.
          
          It allows future procurement analytics to be introduced
          without changing BuyerOverview's API.
      ========================================================= */}
      {/* {recentProcurements.length > 0 && (
        <div className="sr-only" aria-hidden="true">
          {recentProcurements.length} procurement records available.
        </div>
      )} */}

       

    </section>
  )
}

export default BuyerOverview