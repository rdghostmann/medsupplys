// SupplierRevenueCommission.tsx
"use client"

import React, { useMemo, useState } from "react"
import {
  DollarSign,
  TrendingUp,
  ShieldCheck,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Search,
  Printer,
  X,
  CreditCard,
  RefreshCw,
  Building2,
} from "lucide-react"
import { toast } from "sonner"
import type {
  CurrentSupplierUser,
  SupplierOrder,
  SupplierPayoutRecord,
} from "@/controllers/supplier.action"
/* =========================================================
   TYPES
========================================================= */

interface SupplierMetrics {
  totalGrossRevenue: number
  totalPlatformCommission: number
  netEarnings: number
  inEscrow: number
  totalPaidOut: number
  availableForPayout: number
}

/* =========================================================
   HELPERS
========================================================= */

const formatNaira = (amount: number) =>
  `₦${amount.toLocaleString("en-NG", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`

const isCompletedStatus = (status: SupplierOrder["status"]) =>
  ["DELIVERED", "COMPLETED"].includes(status)

const isEscrowStatus = (status: SupplierOrder["status"]) =>
  !["DELIVERED", "COMPLETED", "CANCELLED", "REFUNDED"].includes(status)

/* =========================================================
   COMPONENT
========================================================= */

interface SupplierRevenueCommissionProps {
  user: CurrentSupplierUser | null
  orders: SupplierOrder[]
  payouts: SupplierPayoutRecord[]
}

export const SupplierRevenueCommission: React.FC<
  SupplierRevenueCommissionProps
> = ({ user, orders: initialOrders, payouts: initialPayouts }) => {
  const [orders, setOrders] = useState<SupplierOrder[]>(initialOrders)
  const [payouts, setPayouts] = useState<SupplierPayoutRecord[]>(initialPayouts)

  const [isLoading, setIsLoading] = useState(false)

  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "ESCROW" | "SETTLED" | "PROCESSING"
  >("ALL")

  const [searchQuery, setSearchQuery] = useState("")

  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false)
  const [payoutAmount, setPayoutAmount] = useState<number>(0)
  const [payoutNotes, setPayoutNotes] = useState("")
  const [isSubmittingPayout, setIsSubmittingPayout] = useState(false)

  const [selectedVoucherOrder, setSelectedVoucherOrder] =
    useState<SupplierOrder | null>(null)

  const [selectedPayoutSlip, setSelectedPayoutSlip] =
    useState<SupplierPayoutRecord | null>(null)

  /* =========================================================
     SUPPLIER ORDERS
  ========================================================= */

  const supplierOrders = useMemo(
    () => orders.filter((order) => order.supplierId === user?.id),
    [orders, user?.id]
  )

  /* =========================================================
     FINANCIAL CALCULATIONS
  ========================================================= */

  const metrics = useMemo<SupplierMetrics>(() => {
    const totalGrossRevenue = supplierOrders.reduce(
      (sum, order) => sum + order.total,
      0
    )

    const totalPlatformCommission = supplierOrders.reduce(
      (sum, order) => sum + order.commission,
      0
    )

    const netEarnings = supplierOrders.reduce(
      (sum, order) => sum + order.subtotal,
      0
    )

    const inEscrow = supplierOrders
      .filter((order) => isEscrowStatus(order.status))
      .reduce((sum, order) => sum + order.subtotal, 0)

    const totalPaidOut = payouts
      .filter(
        (payout) =>
          payout.status === "SETTLED" && payout.supplierId === user?.id
      )
      .reduce((sum, payout) => sum + payout.netAmount, 0)

    const availableForPayout = Math.max(
      0,
      netEarnings - inEscrow - totalPaidOut
    )

    return {
      totalGrossRevenue,
      totalPlatformCommission,
      netEarnings,
      inEscrow,
      totalPaidOut,
      availableForPayout,
    }
  }, [payouts, supplierOrders, user?.id])

  const {
    totalGrossRevenue,
    totalPlatformCommission,
    netEarnings,
    inEscrow,
    totalPaidOut,
    availableForPayout,
  } = metrics

  /* =========================================================
     FILTERED ORDERS
  ========================================================= */

  const filteredOrders = useMemo(() => {
    return supplierOrders.filter((order) => {
      const isCompleted = ["DELIVERED", "COMPLETED"].includes(order.status)

      const isProcessing = [
        "SUPPLIER_CONTACTED",
        "READY_FOR_DISPATCH",
      ].includes(order.status)

      const isTransit = ["DISPATCHED", "IN_TRANSIT", "VERIFICATION"].includes(
        order.status
      )

      if (statusFilter === "SETTLED" && !isCompleted) {
        return false
      }

      if (statusFilter === "ESCROW" && isCompleted) {
        return false
      }

      if (statusFilter === "PROCESSING" && !(isProcessing || isTransit)) {
        return false
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()

        const matchNumber = order.orderNumber.toLowerCase().includes(q)

        const matchBuyer = order.buyerName.toLowerCase().includes(q)

        const matchItem = order.items.some((item) =>
          item.name.toLowerCase().includes(q)
        )

        const matchBatch = order.batchNumber?.toLowerCase().includes(q)

        return matchNumber || matchBuyer || matchItem || matchBatch
      }

      return true
    })
  }, [supplierOrders, statusFilter, searchQuery])

  /* =========================================================
     MOCK SYNC
  ========================================================= */

  const fetchRevenueData = async () => {
    setIsLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 700))

    /*
     * Mock refresh.
     *
     * In production this is where the supplier revenue,
     * escrow and payout APIs would be called.
     */
    setOrders([...initialOrders])
    setPayouts([...initialPayouts])

    setIsLoading(false)

    toast.success("Revenue ledger synchronized", {
      description: "Mock supplier revenue data has been refreshed.",
    })
  }

  /* =========================================================
     PAYOUT REQUEST
  ========================================================= */

  const handleRequestPayout = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (payoutAmount <= 0) {
      toast.error("Invalid payout amount", {
        description: "Enter a valid payout amount.",
      })
      return
    }

    if (payoutAmount < 1000) {
      toast.error("Minimum payout is ₦1,000", {
        description: "Enter an amount of at least ₦1,000.",
      })
      return
    }

    if (payoutAmount > availableForPayout) {
      toast.error("Exceeds available balance", {
        description: `Maximum available for payout is ${formatNaira(
          availableForPayout
        )}.`,
      })
      return
    }

    setIsSubmittingPayout(true)

    try {
      /*
       * Simulate settlement processing.
       */
      await new Promise((resolve) => setTimeout(resolve, 1200))

      const transferFee = 50

      const newPayout: SupplierPayoutRecord = {
        id: `pay-${Date.now()}`,
        supplierId: user?.id || "",
        reference: `NIBSS-MS-${Date.now().toString().slice(-10)}`,
        amount: payoutAmount,
        transferFee,
        netAmount: Math.max(0, payoutAmount - transferFee),
        status: "SETTLED",
        bankName: user?.settlementBankName || "Not configured",
        accountNumber: user?.settlementAccountNumber || "Not configured",
        accountName: user?.settlementAccountName || "Not configured",
        notes: payoutNotes,
        createdAt: new Date().toISOString(),
      }

      setPayouts((current) => [newPayout, ...current])

      setIsPayoutModalOpen(false)
      setPayoutAmount(0)
      setPayoutNotes("")

      toast.success("Settlement payout disbursed", {
        description: `${formatNaira(
          newPayout.netAmount
        )} has been transferred to the registered settlement account.`,
      })
    } catch (error) {
      console.error(error)

      toast.error("Payout failed", {
        description: "Unable to process the mock settlement request.",
      })
    } finally {
      setIsSubmittingPayout(false)
    }
  }

  /* =========================================================
     PRINT
  ========================================================= */

  const printDocument = () => {
    toast.info("Preparing document for printing")

    setTimeout(() => {
      window.print()
    }, 150)
  }

  /* =========================================================
     RESET FILTERS
  ========================================================= */

  const resetFilters = () => {
    setSearchQuery("")
    setStatusFilter("ALL")

    toast.success("Filters cleared")
  }

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="space-y-8 pb-12">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900">
                Supplier Revenue & Platform Commission Ledger
              </h1>

              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                Request Direct Credit Enabled
              </span>
            </div>

            <p className="mt-1 text-xs text-slate-500">
              Transparent 10% platform commission accounting, institutional
              escrow release, and commercial bank settlement.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              id="btn-sync-revenue"
              onClick={fetchRevenueData}
              disabled={isLoading}
              className="hidden items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
              // className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-60"
              title="Refresh ledger"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`}
              />

              {isLoading ? "Syncing..." : "Sync Ledger"}
            </button>

            <button
              type="button"
              onClick={() => {
                setPayoutAmount(availableForPayout)
                setIsPayoutModalOpen(true)
              }}
              disabled={availableForPayout <= 0}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
              // className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowUpRight className="h-4 w-4" />
              <span className="text-xs">Request Settlement Payout (</span>
              {formatNaira(availableForPayout)})
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================
          CORE FINANCIAL CARDS
      ===================================================== */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Available */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-emerald-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
              Available For Settlement
            </span>

            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-600">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>

          <div className="mt-3">
            <div className="font-display text-2xl font-bold tracking-tight text-slate-900">
              {formatNaira(availableForPayout)}
            </div>

            <p className="mt-1 flex items-center gap-1 text-xs font-medium text-emerald-600">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Unrestricted balance ready for withdrawal
            </p>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px]">
            <span className="text-slate-400">Available balance</span>

            <button
              type="button"
              onClick={() => {
                setPayoutAmount(availableForPayout)
                setIsPayoutModalOpen(true)
              }}
              disabled={availableForPayout <= 0}
              className="font-bold text-emerald-600 hover:text-emerald-700 disabled:opacity-40"
            >
              Transfer Now →
            </button>
          </div>
        </div>

        {/* Escrow */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-blue-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
              Held in Escrow
            </span>

            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-600">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>

          <div className="mt-3">
            <div className="font-display text-2xl font-bold tracking-tight text-slate-900">
              {formatNaira(inEscrow)}
            </div>

            <p className="mt-1 flex items-center gap-1 text-xs font-medium text-blue-600">
              <Clock className="h-3.5 w-3.5" />
              Pending delivery & QA inspection
            </p>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] text-slate-500">
            <span>Pre-funded by hospital</span>
            <span className="font-semibold text-blue-600">Auto-Releasing</span>
          </div>
        </div>

        {/* Commission */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-slate-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
              Platform Commission (10%)
            </span>

            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-amber-100 bg-amber-50 text-amber-700">
              <FileText className="h-4 w-4" />
            </div>
          </div>

          <div className="mt-3">
            <div className="font-display text-2xl font-bold tracking-tight text-slate-900">
              {formatNaira(totalPlatformCommission)}
            </div>

            <p className="mt-1 text-xs text-slate-500">
              Platform facilitation fee collected on buyer invoices
            </p>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] text-slate-400">
            <span>No hidden gateway fees</span>

            <span className="font-semibold text-amber-700">Audit-Verified</span>
          </div>
        </div>

        {/* Lifetime payouts */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-slate-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
              Lifetime Net Disbursed
            </span>

            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-purple-100 bg-purple-50 text-purple-600">
              <CreditCard className="h-4 w-4" />
            </div>
          </div>

          <div className="mt-3">
            <div className="font-display text-2xl font-bold tracking-tight text-slate-900">
              {formatNaira(totalPaidOut)}
            </div>

            <p className="mt-1 text-xs text-slate-500">
              Net funds credited to corporate bank
            </p>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] text-slate-400">
            <span>
              {payouts.filter((p) => p.status === "SETTLED").length} successful
              transfers
            </span>

            <span className="font-semibold text-purple-600">
              NIBSS Verified
            </span>
          </div>
        </div>
      </div>

      {/* =====================================================
          REVENUE SUMMARY
      ===================================================== */}

      <div className="lg:grid-col-3 hidden grid-cols-1 gap-4 md:grid-cols-2">
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-col-3 gap-4"> */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            Gross Order Value
          </div>

          <p className="mt-2 text-xl font-bold text-slate-900">
            {formatNaira(totalGrossRevenue)}
          </p>

          <p className="mt-1 text-[11px] text-slate-400">
            Total buyer invoice value
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Building2 className="h-4 w-4 text-emerald-600" />
            Supplier Net Earnings
          </div>

          <p className="mt-2 text-xl font-bold text-slate-900">
            {formatNaira(netEarnings)}
          </p>

          <p className="mt-1 text-[11px] text-slate-400">
            Base supplier receivables
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <ShieldCheck className="h-4 w-4 text-amber-600" />
            Commission Rate
          </div>

          <p className="mt-2 text-xl font-bold text-slate-900">10%</p>

          <p className="mt-1 text-[11px] text-slate-400">
            Applied at buyer invoice level
          </p>
        </div>
      </div>

      {/* =====================================================
          COMMISSION EXPLAINER
      ===================================================== */}

      <div className="rounded-2xl bg-slate-900 p-6 text-white shadow-sm">
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
          <div className="max-w-xl">
            <span className="mb-2 inline-block rounded-full border border-blue-500/30 bg-blue-500/20 px-2.5 py-0.5 text-xs font-bold text-blue-400">
              Transparent Pricing & Fee Structure
            </span>

            <h3 className="font-display text-lg font-bold">
              Zero Supplier Deductions: 100% of your Base Listed Price is yours.
            </h3>

            <p className="mt-1 text-xs leading-relaxed text-slate-300">
              MediSupply applies a standard 10% platform facilitation fee on top
              of your base price at the buyer invoice level. When an order is
              completed, you receive your full quoted unit amount.
            </p>
          </div>

          <div className="w-full shrink-0 rounded-xl border border-slate-700 bg-slate-800/90 p-4 text-xs lg:w-auto">
            <div className="mb-2 font-mono text-[11px] font-bold tracking-wider text-slate-400 uppercase">
              Hospital Invoice Formula:
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold lg:text-sm">
              <span className="text-emerald-400">Your Base Quote (100%)</span>

              <span className="text-slate-500">+</span>

              <span className="text-amber-400">Platform Take-Rate (10%)</span>

              <span className="text-slate-500">=</span>

              <span className="text-white">Hospital Price</span>
            </div>

            <div className="mt-3 flex items-center justify-between gap-4 border-t border-slate-700/80 pt-2 text-[9px] text-slate-400">
              <span>Example on ₦10,000 quote:</span>

              <span className="text-[9px] text-slate-200">
                Buyer pays ₦11,000 → You receive <strong>₦10,000</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          ORDERS LEDGER
      ===================================================== */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 bg-slate-50/50 p-5">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Committed Orders & Escrow Breakdown
            </h3>

            <p className="mt-0.5 text-xs text-slate-500">
              Detailed transaction ledger showing base supplier receivables and
              platform commission
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                placeholder="Search orders, buyer, SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white py-1.5 pr-3 pl-8 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Filters */}
            <div className="flex rounded-xl border border-slate-200 bg-slate-100 p-0.5 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setStatusFilter("ALL")}
                className={`rounded-lg px-3 py-1 transition-colors ${
                  statusFilter === "ALL"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                All ({supplierOrders.length})
              </button>

              <button
                type="button"
                onClick={() => setStatusFilter("ESCROW")}
                className={`rounded-lg px-3 py-1 transition-colors ${
                  statusFilter === "ESCROW"
                    ? "bg-white text-blue-700 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                In Escrow
              </button>

              <button
                type="button"
                onClick={() => setStatusFilter("SETTLED")}
                className={`rounded-lg px-3 py-1 transition-colors ${
                  statusFilter === "SETTLED"
                    ? "bg-white text-emerald-700 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Settled
              </button>

              <button
                type="button"
                onClick={resetFilters}
                className="rounded-lg px-2 py-1 text-slate-400 hover:text-slate-700"
                title="Reset filters"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <FileText className="mx-auto mb-2 h-10 w-10 text-slate-300" />

            <p className="text-xs font-semibold text-slate-700">
              No Orders Matching Filter
            </p>

            <p className="mt-0.5 text-[11px] text-slate-400">
              Try clearing the search or status filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-100 bg-slate-50 font-semibold text-slate-500">
                <tr>
                  <th className="px-5 py-3.5">Order # & Date</th>
                  <th className="px-5 py-3.5">Buyer Hospital</th>
                  <th className="px-5 py-3.5">Consignment Item</th>
                  <th className="px-5 py-3.5 text-right">Gross Total (₦)</th>
                  <th className="px-5 py-3.5 text-right">Platform Fee (10%)</th>
                  <th className="px-5 py-3.5 text-right">Net Receivable (₦)</th>
                  <th className="px-5 py-3.5 text-center">Settlement Status</th>
                  <th className="px-5 py-3.5 text-center">Voucher</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((order) => {
                  const isCompleted = isCompletedStatus(order.status)

                  const isDispatched =
                    order.status === "DISPATCHED" ||
                    order.status === "IN_TRANSIT"

                  return (
                    <tr
                      key={order.id}
                      className="transition-colors hover:bg-slate-50/70"
                    >
                      <td className="px-5 py-3.5 font-mono">
                        <span className="block font-bold text-slate-900">
                          {order.orderNumber}
                        </span>

                        <span className="text-[11px] text-slate-400">
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-GB"
                          )}
                        </span>
                      </td>

                      <td className="px-5 py-3.5">
                        <span className="block font-semibold text-slate-800">
                          {order.buyerName}
                        </span>

                        <span className="text-[11px] text-slate-400">
                          Method: {order.paymentMethod.replace(/_/g, " ")}
                        </span>
                      </td>

                      <td className="px-5 py-3.5">
                        <span className="block font-medium text-slate-900">
                          {order.items[0]?.name || "Medical Supplies"}
                        </span>

                        <span className="font-mono text-[11px] text-slate-500">
                          Batch: {order.batchNumber} • Qty:{" "}
                          {order.items[0]?.quantity}
                        </span>
                      </td>

                      <td className="px-5 py-3.5 text-right font-medium text-slate-900">
                        {formatNaira(order.total)}
                      </td>

                      <td className="px-5 py-3.5 text-right font-mono text-amber-700">
                        -{formatNaira(order.commission)}
                      </td>

                      <td className="font-display px-5 py-3.5 text-right font-bold text-emerald-600">
                        {formatNaira(order.subtotal)}
                      </td>

                      <td className="px-5 py-3.5 text-center">
                        {isCompleted ? (
                          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                            <CheckCircle2 className="h-3 w-3" />
                            Escrow Released
                          </span>
                        ) : isDispatched ? (
                          <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-700">
                            <Clock className="h-3 w-3" />
                            In Escrow (Transit)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-700">
                            <ShieldCheck className="h-3 w-3" />
                            In Escrow (Prep)
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-3.5 text-center">
                        <button
                          type="button"
                          onClick={() => setSelectedVoucherOrder(order)}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-600 transition-colors hover:bg-slate-100"
                        >
                          <FileText className="h-3 w-3" />
                          Slip
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* =====================================================
          PAYOUT HISTORY
      ===================================================== */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 p-5">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Commercial Bank Settlement Transfers
            </h3>

            <p className="mt-0.5 text-xs text-slate-500">
              Mock disbursement batches sent to the supplier registered NUBAN
              account
            </p>
          </div>

          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
            {payouts.length} Disbursements
          </span>
        </div>

        {payouts.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            <CreditCard className="mx-auto mb-2 h-10 w-10 text-slate-300" />

            <p className="text-xs font-semibold text-slate-700">
              No Historical Payouts Yet
            </p>

            <p className="mt-0.5 text-[11px] text-slate-400">
              Settlement disbursement slips will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-100 bg-slate-50 font-semibold text-slate-500">
                <tr>
                  <th className="px-5 py-3">Transfer Ref & Date</th>
                  <th className="px-5 py-3">Beneficiary Bank & NUBAN</th>
                  <th className="px-5 py-3 text-right">Requested</th>
                  <th className="px-5 py-3 text-right">Transfer Fee</th>
                  <th className="px-5 py-3 text-right">Net Transferred</th>
                  <th className="px-5 py-3 text-center">Disbursement Status</th>
                  <th className="px-5 py-3 text-center">Proof</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {payouts.map((payout) => (
                  <tr
                    key={payout.id}
                    className="transition-colors hover:bg-slate-50/70"
                  >
                    <td className="px-5 py-3.5">
                      <span className="block font-mono font-bold text-slate-900">
                        {payout.reference}
                      </span>

                      <span className="text-[11px] text-slate-400">
                        {new Date(payout.createdAt).toLocaleString("en-GB")}
                      </span>
                    </td>

                    <td className="px-5 py-3.5">
                      <span className="block font-bold text-slate-800">
                        {payout.bankName}
                      </span>

                      <span className="font-mono text-[11px] text-slate-500">
                        {payout.accountNumber} • {payout.accountName}
                      </span>
                    </td>

                    <td className="px-5 py-3.5 text-right font-medium text-slate-700">
                      {formatNaira(payout.amount)}
                    </td>

                    <td className="px-5 py-3.5 text-right font-mono text-slate-400">
                      {formatNaira(payout.transferFee)}
                    </td>

                    <td className="font-display px-5 py-3.5 text-right font-bold text-emerald-600">
                      {formatNaira(payout.netAmount)}
                    </td>

                    <td className="px-5 py-3.5 text-center">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                          payout.status === "SETTLED"
                            ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                            : payout.status === "PROCESSING"
                              ? "border border-blue-200 bg-blue-50 text-blue-700"
                              : "border border-red-200 bg-red-50 text-red-700"
                        }`}
                      >
                        {payout.status === "SETTLED" ? (
                          <CheckCircle2 className="h-3 w-3" />
                        ) : payout.status === "PROCESSING" ? (
                          <Clock className="h-3 w-3" />
                        ) : (
                          <AlertCircle className="h-3 w-3" />
                        )}

                        {payout.status}
                      </span>
                    </td>

                    <td className="px-5 py-3.5 text-center">
                      <button
                        type="button"
                        onClick={() => setSelectedPayoutSlip(payout)}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-600 transition-colors hover:bg-slate-100"
                      >
                        <Printer className="h-3 w-3" />
                        View Voucher
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* =====================================================
          PAYOUT MODAL
      ===================================================== */}

      {isPayoutModalOpen && (
        <div className="fixed inset-0 z-50 flex animate-in items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm duration-150 fade-in">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="flex items-center gap-2 text-base font-bold text-slate-900">
                  <ArrowUpRight className="h-5 w-5 text-emerald-600" />
                  Instant Settlement Payout
                </h3>

                <p className="mt-0.5 text-xs text-slate-500">
                  Transfer funds to the registered commercial bank account.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsPayoutModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                aria-label="Close payout modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleRequestPayout} className="mt-4 space-y-4">
              {/* Bank summary */}
              <div className="space-y-1 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs">
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Destination Bank:</span>

                  <span className="text-right font-bold text-slate-800">
                    {user?.settlementBankName || "Not configured"}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">NUBAN Account:</span>

                  <span className="font-mono font-bold text-slate-800">
                    {user?.settlementAccountNumber || "Not configured"}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Beneficiary Name:</span>

                  <span className="text-right text-slate-700">
                    {user?.settlementAccountName || "Not configured"}
                  </span>
                </div>

                <div className="flex justify-between border-t border-slate-200 pt-1">
                  <span className="text-slate-500">Available Settlement:</span>

                  <span className="font-bold text-emerald-600">
                    {formatNaira(availableForPayout)}
                  </span>
                </div>
              </div>

              {/* Amount */}
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">
                    Payout Amount (₦ NGN)
                  </label>

                  <button
                    type="button"
                    onClick={() => setPayoutAmount(availableForPayout)}
                    className="text-[11px] font-bold text-blue-600 hover:text-blue-700"
                  >
                    Max ({formatNaira(availableForPayout)})
                  </button>
                </div>

                <input
                  type="number"
                  min={1000}
                  max={availableForPayout}
                  required
                  value={payoutAmount || ""}
                  onChange={(e) => setPayoutAmount(Number(e.target.value) || 0)}
                  placeholder="e.g. 500000"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 font-mono text-base font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* Fee summary */}
              <div className="space-y-1 rounded-xl border border-emerald-100 bg-emerald-50/60 p-3 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Gross Payout:</span>

                  <span className="font-mono">{formatNaira(payoutAmount)}</span>
                </div>

                <div className="flex justify-between text-slate-500">
                  <span>Transfer Fee:</span>

                  <span className="font-mono">{formatNaira(50)}</span>
                </div>

                <div className="flex justify-between border-t border-emerald-200 pt-1 font-bold text-emerald-800">
                  <span>Net Credit to Bank:</span>

                  <span className="font-mono text-sm">
                    {formatNaira(Math.max(0, payoutAmount - 50))}
                  </span>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">
                  Internal Finance Reference Note
                </label>

                <input
                  type="text"
                  value={payoutNotes}
                  onChange={(e) => setPayoutNotes(e.target.value)}
                  placeholder="e.g. Weekly wholesale liquidation"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => setIsPayoutModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    isSubmittingPayout ||
                    payoutAmount <= 0 ||
                    payoutAmount > availableForPayout
                  }
                  className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:opacity-50"
                >
                  <ArrowUpRight className="h-4 w-4" />

                  {isSubmittingPayout
                    ? "Processing Settlement..."
                    : "Confirm Transfer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================
          ORDER VOUCHER MODAL
      ===================================================== */}

      {selectedVoucherOrder && (
        <div className="fixed inset-0 z-50 flex animate-in items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm duration-150 fade-in">
          <div className="printable-voucher w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-600">
                  <FileText className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Order Settlement Breakdown Slip
                  </h3>

                  <p className="font-mono text-xs text-slate-500">
                    #{selectedVoucherOrder.orderNumber}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedVoucherOrder(null)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100"
                aria-label="Close voucher"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
                <div>
                  <span className="block text-[11px] text-slate-400">
                    Buyer Hospital:
                  </span>

                  <span className="font-bold text-slate-800">
                    {selectedVoucherOrder.buyerName}
                  </span>
                </div>

                <div>
                  <span className="block text-[11px] text-slate-400">
                    Order Date:
                  </span>

                  <span className="font-bold text-slate-800">
                    {new Date(
                      selectedVoucherOrder.createdAt
                    ).toLocaleDateString("en-GB")}
                  </span>
                </div>

                <div>
                  <span className="block text-[11px] text-slate-400">
                    Batch Number:
                  </span>

                  <span className="font-mono font-bold text-slate-800">
                    {selectedVoucherOrder.batchNumber}
                  </span>
                </div>

                <div>
                  <span className="block text-[11px] text-slate-400">
                    Payment Channel:
                  </span>

                  <span className="font-bold text-slate-800">
                    {selectedVoucherOrder.paymentMethod.replace(/_/g, " ")}
                  </span>
                </div>
              </div>

              <div className="overflow-hidden rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 font-semibold text-slate-600">
                    <tr>
                      <th className="p-2.5">Component</th>
                      <th className="p-2.5 text-right">Rate</th>
                      <th className="p-2.5 text-right">Amount (₦)</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="p-2.5 font-medium text-slate-900">
                        {selectedVoucherOrder.items[0]?.name}

                        <span className="block text-[10px] font-normal text-slate-400">
                          Base Quote × {selectedVoucherOrder.items[0]?.quantity}{" "}
                          units
                        </span>
                      </td>

                      <td className="p-2.5 text-right font-mono text-slate-500">
                        100%
                      </td>

                      <td className="p-2.5 text-right font-mono font-bold text-emerald-600">
                        {formatNaira(selectedVoucherOrder.subtotal)}
                      </td>
                    </tr>

                    <tr>
                      <td className="p-2.5 font-medium text-slate-900">
                        MediSupply Platform Facilitation Fee
                        <span className="block text-[10px] font-normal text-slate-400">
                          Institutional matching, escrow & QA inspection
                        </span>
                      </td>

                      <td className="p-2.5 text-right font-mono text-amber-600">
                        10%
                      </td>

                      <td className="p-2.5 text-right font-mono font-bold text-amber-700">
                        {formatNaira(selectedVoucherOrder.commission)}
                      </td>
                    </tr>

                    <tr className="bg-slate-50 font-bold">
                      <td className="p-2.5 text-slate-900">
                        Total Invoice Paid by Hospital
                      </td>

                      <td className="p-2.5 text-right font-mono">110%</td>

                      <td className="p-2.5 text-right font-mono text-slate-900">
                        {formatNaira(selectedVoucherOrder.total)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 p-3">
                <div>
                  <span className="block text-[11px] text-emerald-700">
                    Net Supplier Payout Receivable:
                  </span>

                  <span className="font-display text-lg font-bold text-emerald-800">
                    {formatNaira(selectedVoucherOrder.subtotal)}
                  </span>
                </div>

                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold text-emerald-800">
                  {isCompletedStatus(selectedVoucherOrder.status)
                    ? "Escrow Released"
                    : "In Escrow"}
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={printDocument}
                  className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                >
                  <Printer className="h-3.5 w-3.5" />
                  Print Slip
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedVoucherOrder(null)}
                  className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-800"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          PAYOUT VOUCHER MODAL
      ===================================================== */}

      {selectedPayoutSlip && (
        <div className="fixed inset-0 z-50 flex animate-in items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm duration-150 fade-in">
          <div className="printable-voucher w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-600">
                  <CheckCircle2 className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    NIBSS Disbursement Voucher
                  </h3>

                  <p className="font-mono text-xs text-slate-500">
                    {selectedPayoutSlip.reference}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedPayoutSlip(null)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100"
                aria-label="Close payout voucher"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4 text-center">
                <span className="block text-[11px] text-slate-500">
                  Net Amount Transferred
                </span>

                <span className="font-display text-2xl font-bold text-emerald-700">
                  {formatNaira(selectedPayoutSlip.netAmount)}
                </span>

                <span className="mt-0.5 block text-[11px] font-medium text-emerald-600">
                  Direct Credit • Settlement Reference Validated
                </span>
              </div>

              <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Commercial Bank:</span>

                  <span className="font-bold text-slate-800">
                    {selectedPayoutSlip.bankName}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">NUBAN Account:</span>

                  <span className="font-mono font-bold text-slate-800">
                    {selectedPayoutSlip.accountNumber}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Account Name:</span>

                  <span className="text-right text-slate-700">
                    {selectedPayoutSlip.accountName}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Gross Withdrawal:</span>

                  <span className="font-mono text-slate-700">
                    {formatNaira(selectedPayoutSlip.amount)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Transfer Fee:</span>

                  <span className="font-mono text-slate-700">
                    {formatNaira(selectedPayoutSlip.transferFee)}
                  </span>
                </div>

                {selectedPayoutSlip.notes && (
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500">Reference Note:</span>

                    <span className="text-right text-slate-700">
                      {selectedPayoutSlip.notes}
                    </span>
                  </div>
                )}

                <div className="flex justify-between border-t border-slate-200 pt-2">
                  <span className="text-slate-500">Settled Timestamp:</span>

                  <span className="text-slate-700">
                    {new Date(selectedPayoutSlip.createdAt).toLocaleString(
                      "en-GB"
                    )}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={printDocument}
                  className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                >
                  <Printer className="h-3.5 w-3.5" />
                  Print Voucher
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedPayoutSlip(null)}
                  className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-800"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SupplierRevenueCommission
