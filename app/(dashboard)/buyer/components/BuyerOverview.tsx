// BuyerOverview.tsx
"use client";

import React, { useMemo } from "react";

import FallBackQueueMonitor from "./FallBackQueueMonitor";
import FinancialOperationalMetricCards from "./FinancialOperationalMetricCards";
import WelcomeBanner from "./WelcomeBanner";

import type {
  Order,
  OrderStatus,
  Supplier,
  ProcurementOrder,
} from "@/types";
import {
  CurrentBuyerCreditAccount,
  CurrentBuyerUser,
  CurrentBuyerWallet,
} from "@/controllers/buyer.actions";



/* ============================================================
   PROPS
============================================================ */

export interface BuyerOverviewProps {
  user?: CurrentBuyerUser;

  wallet?: CurrentBuyerWallet;

  creditAccount?: CurrentBuyerCreditAccount;

  nonCompletedOrderCount?: number;

  totalOrderCount?: number;

  orders?: Order[];

  fallbackQueue?: Supplier[];

  recentProcurements?: ProcurementOrder[];

  loading?: boolean;
}

/* ============================================================
   DEFAULTS
============================================================ */


const DEFAULT_ORDERS: Order[] = [];

const DEFAULT_QUEUE: Supplier[] = [];

/* ============================================================
   COMPONENT
============================================================ */

export const BuyerOverview: React.FC<
  BuyerOverviewProps
> = ({
  user,

  wallet,

  creditAccount,

  nonCompletedOrderCount = 0,

  totalOrderCount = 0,

  orders = DEFAULT_ORDERS,

  fallbackQueue = DEFAULT_QUEUE,

  recentProcurements = [],

  loading = false,
}) => {
  /* ==========================================================
     DISPLAY NAME
  ========================================================== */

  const displayName = useMemo(() => {
    if (user?.firstName?.trim()) {
      return [
        user.firstName.trim(),
        user.lastName?.trim(),
      ]
        .filter(Boolean)
        .join(" ");
    }

    if (user?.name?.trim()) {
      return user.name.trim();
    }

    return "Buyer";
  }, [user]);

  /* ==========================================================
     ORDER METRICS
  ========================================================== */

  const orderMetrics = useMemo(() => {
    const pendingStatuses: OrderStatus[] = [
      "Pending",
      "Supplier Contacted",
      "Under Verification",
      "Supplier Confirmed",
    ];

    const activeStatuses: OrderStatus[] = [
      "Supplier Contacted",
      "Supplier Confirmed",
      "Under Verification",
      "In Transit to Office",
      "Verified",
    ];

    const pending = orders.filter((order) =>
      pendingStatuses.includes(order.status)
    ).length;

    const active = orders.filter((order) =>
      activeStatuses.includes(order.status)
    ).length;

    const delivered = orders.filter(
      (order) =>
        order.status === "Delivered"
    ).length;

    const rejected = orders.filter(
      (order) =>
        order.status === "Rejected"
    ).length;

    return {
      total: orders.length,
      pending,
      active,
      delivered,
      rejected,
    };
  }, [orders]);

  /* ==========================================================
     FINANCIAL METRICS
  ========================================================== */

  const financialMetrics = useMemo(() => {
    const balance = Number(
      wallet?.balance || 0
    );

    const creditLimit = Number(
      creditAccount?.creditLimit || 0
    );

    const creditUsed = Number(
      creditAccount?.creditUsed || 0
    );

    const availableCredit = Number(
      creditAccount?.availableCredit ??
        Math.max(creditLimit - creditUsed, 0)
    );

    return {
      balance,

      creditLimit,

      creditUsed,

      availableCredit,

      totalPurchasingPower:
        balance + availableCredit,
    };
  }, [wallet, creditAccount]);

  /* ==========================================================
     FALLBACK QUEUE
  ========================================================== */

  const hasFallbackQueue =   fallbackQueue.length > 0;

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <section
      aria-labelledby="buyer-overview-title"
      className="space-y-6"
    >
      {/* ========================================================
          WELCOME BANNER
      ======================================================== */}

      <WelcomeBanner
        id="buyer-overview-title"
        fullName={displayName}
        organization={
          user?.organization
        }
        walletBalance={
          financialMetrics.balance
        }
        creditAvailable={
          financialMetrics.availableCredit
        }
        loading={loading}
      />

      {/* ========================================================
          FINANCIAL + OPERATIONAL METRICS
      ======================================================== */}

      <FinancialOperationalMetricCards
        walletBalance={
          financialMetrics.balance
        }
        creditLimit={
          financialMetrics.creditLimit
        }
        creditUsed={
          financialMetrics.creditUsed
        }
        availableCredit={
          financialMetrics.availableCredit
        }
        totalPurchasingPower={
          financialMetrics.totalPurchasingPower
        }
        totalOrders={
          orderMetrics.total
        }
        pendingOrders={
          nonCompletedOrderCount
        }
        activeOrders={
          totalOrderCount
        }
        deliveredOrders={
          orderMetrics.delivered
        }
        rejectedOrders={
          orderMetrics.rejected
        }
        loading={loading}
      />

      {/* ========================================================
          SUPPLIER FALLBACK QUEUE
      ======================================================== */}

      <FallBackQueueMonitor
        queue={fallbackQueue}
        orders={orders}
        hasQueue={hasFallbackQueue}
        loading={loading}
      />

      {/* ========================================================
          FUTURE PROCUREMENT ANALYTICS
      ======================================================== */}

      {/* 
      {recentProcurements.length > 0 && (
        <div
          className="sr-only"
          aria-hidden="true"
        >
          {recentProcurements.length} procurement
          records available.
        </div>
      )}
      */}
    </section>
  );
};

export default BuyerOverview;