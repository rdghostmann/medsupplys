"use client"

import React, { useMemo, useState } from "react"
import {
  Sparkles,
  TrendingUp,
  Package,
  Clock,
  Truck,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  ShieldCheck,
  DollarSign,
  ChevronRight,
  ThermometerSnowflake,
  Plus,
  RefreshCw,
} from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import type {
  CurrentSupplierUser,
  IncomingProcurementRequest,
  SupplierOrder,
} from "@/controllers/supplier.action"

/* =========================================================
   TYPES
========================================================= */

type InventoryItem = {
  id: string
  supplierId: string
  productId: string
  productName: string
  batchNumber: string
  stock: number
  basePrice: number
  expiryDate: string
}

type SupplierMetrics = {
  totalGrossRevenue: number
  totalPlatformCommission: number
  availableForPayout: number
  inEscrow: number
  fulfillmentRate: number
}

/* =========================================================
   MOCK INVENTORY
========================================================= */

const MOCK_INVENTORY: InventoryItem[] = [
  {
    id: "inv-001",
    supplierId: "usr-supplier-1",
    productId: "prod-001",
    productName: "Paracetamol 500mg Tablets",
    batchNumber: "MB-PAR-2408",
    stock: 1250,
    basePrice: 1000,
    expiryDate: "2027-08-31",
  },
  {
    id: "inv-002",
    supplierId: "usr-supplier-1",
    productId: "prod-002",
    productName: "Amoxicillin 500mg Capsules",
    batchNumber: "MB-AMX-2407",
    stock: 620,
    basePrice: 2150,
    expiryDate: "2027-07-30",
  },
  {
    id: "inv-003",
    supplierId: "usr-supplier-1",
    productId: "prod-003",
    productName: "Artemether/Lumefantrine 20/120mg",
    batchNumber: "MB-AL-2406",
    stock: 78,
    basePrice: 3100,
    expiryDate: "2027-06-30",
  },
  {
    id: "inv-004",
    supplierId: "usr-supplier-1",
    productId: "prod-004",
    productName: "Vitamin C 1000mg Tablets",
    batchNumber: "MB-VIT-2409",
    stock: 45,
    basePrice: 850,
    expiryDate: "2028-01-31",
  },
  {
    id: "inv-005",
    supplierId: "usr-supplier-1",
    productId: "prod-005",
    productName: "Metformin 500mg Tablets",
    batchNumber: "MB-MET-2405",
    stock: 310,
    basePrice: 1800,
    expiryDate: "2027-05-31",
  },
  {
    id: "inv-006",
    supplierId: "usr-supplier-1",
    productId: "prod-006",
    productName: "Omeprazole 20mg Capsules",
    batchNumber: "MB-OME-2404",
    stock: 92,
    basePrice: 1450,
    expiryDate: "2027-04-30",
  },
  {
    id: "inv-007",
    supplierId: "usr-supplier-1",
    productId: "prod-007",
    productName: "ORS Sachets",
    batchNumber: "MB-ORS-2409",
    stock: 850,
    basePrice: 420,
    expiryDate: "2028-02-28",
  },
]

/* =========================================================
   MOCK METRICS
========================================================= */

const MOCK_METRICS: SupplierMetrics = {
  totalGrossRevenue: 1430000,
  totalPlatformCommission: 122000,
  availableForPayout: 691000,
  inEscrow: 1037000,
  fulfillmentRate: 99.2,
}

/* =========================================================
   SUPPLIER DASHBOARD
========================================================= */

interface SupplierDashboardPageProps {
  user: CurrentSupplierUser | null
  incomingProcurementRequests?: IncomingProcurementRequest[]
  orders?: SupplierOrder[]
}

const SupplierDashboardPage: React.FC<SupplierDashboardPageProps> = ({
  user,
  incomingProcurementRequests = [],
  orders = [],
}) => {
  const [procurements, setProcurements] = useState<
    IncomingProcurementRequest[]
  >(incomingProcurementRequests)
  const [inventory] = useState<InventoryItem[]>(MOCK_INVENTORY)
  const [metrics] = useState<SupplierMetrics>(MOCK_METRICS)

  const [responseNotes, setResponseNotes] = useState<Record<string, string>>({})

  const [isProcessingRFQ, setIsProcessingRFQ] = useState<string | null>(null)

  const [isSyncing, setIsSyncing] = useState(false)

  // Dispatch Modal State
  const [dispatchOrder, setDispatchOrder] = useState<SupplierOrder | null>(null)

  const [courierName, setCourierName] = useState("MediSupply Cold Logistics")

  const [trackingNumber, setTrackingNumber] = useState("")

  const [coldChainTemp, setColdChainTemp] = useState("4.2°C (Calibrated Log)")

  const [isSubmittingDispatch, setIsSubmittingDispatch] = useState(false)

  const router = useRouter()

  // Demo navigation state
  const [, setActiveTab] = useState("dashboard")

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)

  /* =========================================================
       DERIVED DATA
    ========================================================= */

  const myInventory = useMemo(
    () => inventory.filter((item) => item.supplierId === user?.id),
    [inventory, user?.id]
  )

  const lowStockItems = useMemo(
    () => myInventory.filter((item) => item.stock < 100),
    [myInventory]
  )

  const pendingRequests = useMemo(
    () =>
      procurements.filter(
        (p) =>
          p.currentSupplierId === user?.id && p.status === "SUPPLIER_CONTACTED"
      ),
    [procurements, user?.id]
  )

  const supplierOrders = useMemo(
    () => orders.filter((order) => order.supplierId === user?.id),
    [orders, user?.id]
  )

  const activeCommittedOrders = useMemo(
    () =>
      supplierOrders.filter(
        (order) =>
          !["DELIVERED", "COMPLETED", "CANCELLED", "REFUNDED"].includes(
            order.status
          )
      ),
    [supplierOrders]
  )

  const availablePayout = metrics.availableForPayout
  const inEscrow = metrics.inEscrow

  /* =========================================================
       MOCK SYNC
    ========================================================= */

  const handleSync = () => {
    setIsSyncing(true)

    setTimeout(() => {
      setIsSyncing(false)

      toast.success("Dashboard Synchronized", {
        description:
          "Supplier inventory, RFQs, orders and settlement data have been refreshed.",
      })
    }, 900)
  }

  /* =========================================================
       MOCK RFQ RESPONSE
    ========================================================= */

  const handleRespondRFQ = async (
    procurementId: string,
    response: "ACCEPT" | "REJECT" | "UNAVAILABLE"
  ) => {
    if (!user) {
      toast.error("Supplier Account Not Found")
      return
    }

    setIsProcessingRFQ(procurementId)

    const request = procurements.find((item) => item.id === procurementId)

    if (!request) {
      toast.error("Request Not Found", {
        description: "The procurement request could not be located.",
      })

      setIsProcessingRFQ(null)
      return
    }

    setTimeout(() => {
      if (response === "ACCEPT") {
        const orderNumber = `MS-ORD-${Date.now().toString().slice(-4)}`

        setProcurements((prev) =>
          prev.filter((item) => item.id !== procurementId)
        )

        toast.success("Procurement Request Accepted", {
          description: `Order #${orderNumber} committed. Funds locked in escrow.`,
        })
      } else {
        setProcurements((prev) =>
          prev.filter((item) => item.id !== procurementId)
        )

        toast.info(
          `Procurement Request ${
            response === "REJECT" ? "Declined" : "Marked Unavailable"
          }`,
          {
            description:
              "Automated fallback routing has been initiated to the next ranked supplier.",
          }
        )
      }

      setResponseNotes((prev) => {
        const next = { ...prev }
        delete next[procurementId]
        return next
      })

      setIsProcessingRFQ(null)
    }, 700)
  }

  /* =========================================================
       MOCK DISPATCH
    ========================================================= */

  const handleConfirmDispatch = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!dispatchOrder) return

    setIsSubmittingDispatch(true)

    const orderBeingDispatched = dispatchOrder

    setTimeout(() => {
      setDispatchOrder(null)
      setIsSubmittingDispatch(false)

      toast.success("Shipment Dispatched", {
        description: `Order #${orderBeingDispatched.orderNumber} is now in transit with GPS and cold-chain logging enabled.`,
      })

      setTrackingNumber("")
    }, 900)
  }

  /* =========================================================
       DEMO TAB NAVIGATION
    ========================================================= */

  const navigateTo = (tab: string) => {
    setActiveTab(tab)

    toast.info(`${tab.charAt(0).toUpperCase() + tab.slice(1)} Module`, {
      description: "Navigation action simulated using mock data.",
    })
  }

  if (!user) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <ShieldCheck className="mx-auto mb-4 h-10 w-10 text-slate-300" />

          <h2 className="text-base font-bold text-slate-900">
            Supplier Account Not Found
          </h2>

          <p className="mt-2 text-xs leading-relaxed text-slate-500">
            We could not resolve an authenticated supplier account for this
            dashboard.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Header Profile & Status Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-4">
          <div className="flex items-start gap-4">
            <div>
              <div className="gap-2">
                {/* <div className="flex flex-wrap items-center gap-2"> */}
                <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900">
                  {user?.organization ||
                    user?.name ||
                    "Authorized Pharmaceutical Supplier"}
                </h1>

                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-700 md:text-xs">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {user?.supplierApprovalStatus === "APPROVED"
                    ? "KYC Verified & Licensed"
                    : "KYC Pending Review"}
                </span>
                <div className="">
                  <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-[10px] font-semibold text-blue-700 md:text-xs">
                    Tier: {user?.supplierType} (100% Matching Priority)
                  </span>
                </div>
              </div>

              <p className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                <span>
                  PCN Premise:{" "}
                  <strong className="text-slate-700">
                    {user?.pcnPremisesLicense}
                  </strong>
                </span>

                <span>•</span>

                <span>
                  NAFDAC GDP:{" "}
                  <strong className="text-slate-700">
                    {user?.nafdacGdpLicense}
                  </strong>
                </span>

                <span>•</span>

                <span>
                  Settlement Bank:{" "}
                  <strong className="text-slate-700">
                    {user?.settlementBankName} ({user?.settlementAccountNumber})
                  </strong>
                </span>
              </p>
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-2.5">
            <button
              id="supplier-btn-refresh-dashboard"
              onClick={handleSync}
              className="hidden items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50"
              // className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              title="Refresh Real-Time Data"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${isSyncing ? "animate-spin" : ""}`}
              />
              Sync
            </button>

            <button
              id="supplier-btn-nav-revenue"
              onClick={() => navigateTo("ledger")}
              className="hidden items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-slate-800"
              // className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors shadow-sm"
            >
              <DollarSign className="h-4 w-4 text-emerald-400" />
              Settlement & Payouts
            </button>

            <button
              id="supplier-btn-add-inventory"
              onClick={() => navigateTo("inventory")}
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              Add Stock SKU
            </button>
          </div>
        </div>
      </div>

      {/* 2. Key Operational & Financial Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1 */}
        <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-emerald-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
              Available For Payout
            </span>

            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-600 transition-transform group-hover:scale-105">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>

          <div className="mt-3">
            <div className="font-display text-2xl font-bold tracking-tight text-slate-900">
              ₦{availablePayout.toLocaleString()}
            </div>

            <p className="mt-1 flex items-center gap-1 text-xs font-medium text-emerald-600">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Delivered QA-approved orders
            </p>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
            <span className="text-[11px] text-slate-400">
              Direct NIBSS NUBAN
            </span>

            <button
              onClick={() => navigateTo("ledger")}
              className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 hover:text-emerald-700"
            >
              Withdraw Funds
              <ArrowUpRight className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Card 2 */}
        <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-blue-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
              Funds in MediSupply Escrow
            </span>

            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-600 transition-transform group-hover:scale-105">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>

          <div className="mt-3">
            <div className="font-display text-2xl font-bold tracking-tight text-slate-900">
              ₦{inEscrow.toLocaleString()}
            </div>

            <p className="mt-1 text-xs font-medium text-blue-600">
              {activeCommittedOrders.length} active committed order(s)
            </p>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
            <span className="text-[11px] text-slate-400">
              Releases on hospital QA
            </span>

            <span className="text-[11px] font-semibold text-blue-600">
              Locked & Insured
            </span>
          </div>
        </div>

        {/* Card 3 */}
        <div
          className={`group rounded-2xl border p-5 shadow-sm transition-all ${
            pendingRequests.length > 0
              ? "border-amber-200 bg-amber-50/50"
              : "border-slate-200 bg-white"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
              Pending RFQs / Quotes
            </span>

            <div
              className={`flex h-9 w-9 items-center justify-center rounded-xl transition-transform group-hover:scale-105 ${
                pendingRequests.length > 0
                  ? "bg-amber-100 text-amber-700"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              <Sparkles className="h-4 w-4" />
            </div>
          </div>

          <div className="mt-3">
            <div className="font-display text-2xl font-bold tracking-tight text-slate-900">
              {pendingRequests.length}
            </div>

            <p
              className={`mt-1 text-xs font-medium ${
                pendingRequests.length > 0
                  ? "font-semibold text-amber-700"
                  : "text-slate-500"
              }`}
            >
              {pendingRequests.length > 0
                ? "Immediate action required"
                : "All live RFQs addressed"}
            </p>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
            <span className="text-[11px] text-slate-400">
              Ranked by Matching Engine
            </span>

            <button
              onClick={() => navigateTo("requests")}
              className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700"
            >
              Review RFQs
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Card 4 */}
        <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-slate-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
              Fulfillment & Catalog
            </span>

            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-purple-100 bg-purple-50 text-purple-600 transition-transform group-hover:scale-105">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>

          <div className="mt-3">
            <div className="font-display text-2xl font-bold tracking-tight text-slate-900">
              {metrics.fulfillmentRate}%
            </div>

            <p className="mt-1 text-xs text-slate-500">
              {myInventory.length} listed SKUs ({lowStockItems.length} low
              stock)
            </p>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
            <span className="text-[11px] font-medium text-emerald-600">
              Grade A Credited
            </span>

            <button
              onClick={() => navigateTo("inventory")}
              className="flex items-center gap-1 text-[11px] font-semibold text-slate-700 hover:text-slate-900"
            >
              Manage Stock
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Real-Time RFQ Alert Banner */}
      {pendingRequests.length > 0 && (
        <div className="flex flex-col items-center justify-between gap-4 rounded-2xl bg-linear-to-r from-amber-500 to-amber-600 p-4 text-white shadow-md sm:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <Sparkles className="h-5 w-5 text-amber-100" />
            </div>

            <div>
              <h4 className="text-sm font-bold">
                You have {pendingRequests.length} incoming institutional
                procurement request(s) awaiting your commitment!
              </h4>

              <p className="mt-0.5 text-xs text-amber-100">
                Respond promptly to maintain your 99%+ algorithmic fulfillment
                priority rank.
              </p>
            </div>
          </div>

          <button
            onClick={() => router.push("/supplier/order-requests")}
            className="shrink-0 rounded-xl bg-white px-4 py-2 text-xs font-bold text-amber-900 shadow-sm transition-colors hover:bg-amber-50"
          >
            Review & Accept Orders
          </button>
        </div>
      )}

      {/* 4. Two-Column Core Layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* LEFT COLUMN */}
        <div className="space-y-8 lg:col-span-2">
          {/* Incoming RFQs */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col border-b border-slate-100 bg-slate-50/50 p-5">
              <div className="mb-3 flex items-center justify-between gap-2">
                <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
                  <Sparkles className="h-4 w-4 text-amber-600" />
                  <span className="">Incoming Procurement RFQs</span>
                </h3>

                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">
                  {pendingRequests.length}
                </span>
              </div>

              {/* <Link
                href="/supplier/order-requests"
                // onClick={() => router.push('/supplier/order-requests')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                View Full Queue
                <ChevronRight className="w-3 h-3" />
              </Link> */}
              <button
                onClick={() => router.push("/supplier/order-requests")}
                className="flex items-center gap-1 self-end text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                View Full Queue
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>

            {pendingRequests.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                <CheckCircle2 className="mx-auto mb-2 h-10 w-10 text-emerald-400" />

                <p className="text-xs font-semibold text-slate-700">
                  No Pending Requests
                </p>

                <p className="mt-0.5 text-[11px] text-slate-400">
                  You are fully caught up. New procurement matchings will appear
                  here instantly.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {pendingRequests.slice(0, 3).map((req) => (
                  <div
                    key={req.id}
                    className="cursor-progress p-5 transition-colors hover:bg-slate-50/80"
                  >
                    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="rounded bg-blue-50 px-2 py-0.5 font-mono text-xs font-bold text-blue-600">
                            {req.procurementNumber}
                          </span>

                          <span className="text-xs font-semibold text-slate-900">
                            {req.productName}
                          </span>
                        </div>

                        <p className="mt-1 text-xs text-slate-500">
                          Buyer:{" "}
                          <strong className="text-slate-700">
                            {req.buyerName}
                          </strong>{" "}
                        </p>
                        <p className="my-1 text-xs text-slate-500">
                          Qty:{" "}
                          <strong className="text-slate-700">
                            {req.quantity} {req.unit}
                          </strong>
                        </p>

                        <p className="text-xs text-slate-500">
                          Destination:{" "}
                          <strong className="text-slate-700">
                            {req.deliveryAddress}
                          </strong>
                        </p>
                      </div>

                      <div className="shrink-0 text-right">
                        <div className="font-display text-base font-bold text-slate-900">
                          ₦{req.totalAmount.toLocaleString()}
                        </div>

                        <div className="text-[11px] font-medium text-emerald-600">
                          Escrow Pre-Funded
                          <span className="hidden">
                            {" "}
                            ({req.paymentMethod.replace(/_/g, " ")})
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 hidden gap-3 border-t border-slate-100 pt-3">
                      {/* <div className="hidden mt-3 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3"> */}
                      <input
                        type="text"
                        placeholder="Optional batch or fulfillment note..."
                        value={responseNotes[req.id] || ""}
                        onChange={(e) =>
                          setResponseNotes((prev) => ({
                            ...prev,
                            [req.id]: e.target.value,
                          }))
                        }
                        className="flex-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      />

                      <div className="flex shrink-0 items-center gap-2">
                        <button
                          disabled={isProcessingRFQ === req.id}
                          onClick={() => handleRespondRFQ(req.id, "REJECT")}
                          className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-50 disabled:opacity-50"
                        >
                          Decline
                        </button>

                        <button
                          disabled={isProcessingRFQ === req.id}
                          onClick={() => handleRespondRFQ(req.id, "ACCEPT")}
                          className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:opacity-50"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />

                          {isProcessingRFQ === req.id
                            ? "Processing..."
                            : "Accept & Commit"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active Orders */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 p-5">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-blue-600" />

                <h3 className="text-sm font-bold text-slate-900">
                  Committed Orders & Dispatch Pipeline
                </h3>

                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-800">
                  {activeCommittedOrders.length} In Progress
                </span>
              </div>

              <button
                onClick={() => navigateTo("orders")}
                className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                All Orders
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>

            {activeCommittedOrders.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                <Package className="mx-auto mb-2 h-10 w-10 text-slate-300" />

                <p className="text-xs font-semibold text-slate-700">
                  No Orders in Active Transit
                </p>

                <p className="mt-0.5 text-[11px] text-slate-400">
                  Committed orders awaiting dispatch or verification will
                  display here.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {activeCommittedOrders.map((order) => {
                  const canDispatch =
                    order.status === "READY_FOR_DISPATCH" && "PROCESSING"

                  return (
                    <div
                      key={order.id}
                      className="p-5 transition-colors hover:bg-slate-50/80"
                    >
                      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="rounded bg-slate-100 px-2 py-0.5 font-mono text-xs font-bold text-slate-800">
                              {order.orderNumber}
                            </span>

                            <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-[11px] font-semibold text-blue-700">
                              {order.status.replace(/_/g, " ")}
                            </span>
                          </div>

                          <h4 className="mt-1 text-sm font-bold text-slate-900">
                            {order.items[0]?.name ||
                              "Pharmaceutical Consignment"}
                          </h4>

                          <p className="text-xs text-slate-500">
                            Hospital:{" "}
                            <strong className="text-slate-700">
                              {order.buyerName}
                            </strong>{" "}
                            • Batch:{" "}
                            <span className="font-mono text-slate-700">
                              {order.batchNumber}
                            </span>
                          </p>
                        </div>

                        <div className="shrink-0 text-right">
                          <div className="font-display text-base font-bold text-slate-900">
                            ₦{order.subtotal.toLocaleString()}{" "}
                            <span className="text-[10px] font-normal text-slate-400">
                              Net
                            </span>
                          </div>

                          <div className="text-[11px] text-slate-500">
                            Gross: ₦{order.total.toLocaleString()} (10% Comm: ₦
                            {order.commission.toLocaleString()})
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Clock className="h-3.5 w-3.5 text-slate-400" />

                          <span>
                            Destination:{" "}
                            {order.deliveryAddress.length > 45
                              ? `${order.deliveryAddress.slice(0, 45)}...`
                              : order.deliveryAddress}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {canDispatch && (
                            <button
                              id={`btn-dispatch-${order.id}`}
                              onClick={() => {
                                setDispatchOrder(order)
                                setTrackingNumber(
                                  `WB-${Date.now().toString().slice(-6)}`
                                )
                              }}
                              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
                            >
                              <Truck className="h-3.5 w-3.5" />
                              Dispatch Shipment
                            </button>
                          )}

                          <button
                            onClick={() => {
                              setSelectedOrderId(order.id)
                              navigateTo("orders")
                            }}
                            className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
                              selectedOrderId === order.id
                                ? "border-blue-200 bg-blue-50 text-blue-700"
                                : "border-slate-200 text-slate-700 hover:bg-slate-50"
                            }`}
                          >
                            Track
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-8">
          {/* Settlement Account */}
          <div className="rounded-2xl bg-linear-to-br from-slate-900 to-slate-800 p-5 text-white shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                NIBSS Settlement Account
              </span>

              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                Direct Credit Active
              </span>
            </div>

            <div className="mt-4">
              <p className="text-xs text-slate-400">Commercial Bank</p>

              <h4 className="text-base font-bold text-white">
                {user?.settlementBankName}
              </h4>

              <p className="mt-1 font-mono text-sm tracking-wider text-slate-200">
                {user?.settlementAccountNumber}
              </p>

              <p className="mt-0.5 text-xs text-slate-400">
                {user?.settlementAccountName}
              </p>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-slate-700/60 pt-4 text-xs">
              <div>
                <span className="block text-[11px] text-slate-400">
                  Ready to Disburse:
                </span>

                <span className="text-sm font-bold text-emerald-400">
                  ₦{availablePayout.toLocaleString()}
                </span>
              </div>

              <button
                onClick={() => router.push("/supplier/earnings  ")}
                className="rounded-xl bg-emerald-500 px-3 py-1.5 text-xs font-bold text-slate-950 transition-colors hover:bg-emerald-400"
              >
                Instant Payout
              </button>
            </div>
          </div>

          {/* Low Stock */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />

                <h3 className="text-sm font-bold text-slate-900">
                  Stock Reorder Alerts
                </h3>
              </div>

              <span className="text-xs font-bold text-slate-500">
                {lowStockItems.length} Low Stock
              </span>
            </div>

            {lowStockItems.length === 0 ? (
              <div className="py-6 text-center">
                <CheckCircle2 className="mx-auto mb-2 h-8 w-8 text-emerald-400" />

                <p className="text-xs font-semibold text-slate-700">
                  Healthy Stock Reserves
                </p>

                <p className="text-[11px] text-slate-400">
                  All listed catalog items have &gt;100 units in warehouse.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {lowStockItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-xl border border-amber-100 bg-amber-50/40 p-3"
                  >
                    <div>
                      <h5 className="text-xs font-bold text-slate-900">
                        {item.productName}
                      </h5>

                      <p className="text-[11px] text-slate-500">
                        Batch:{" "}
                        <span className="font-mono">{item.batchNumber}</span> •
                        Base:{" "}
                        <strong>₦{item.basePrice.toLocaleString()}</strong>
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="inline-block rounded bg-amber-200 px-2 py-0.5 text-[11px] font-bold text-amber-900">
                        {item.stock} left
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => router.push("/supplier/inventory")}
              className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              <Package className="h-3.5 w-3.5" />
              Manage All Inventory ({myInventory.length} SKUs)
            </button>
          </div>

          {/* Compliance */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <h4 className="flex items-center gap-2 text-xs font-bold text-slate-900">
              <ThermometerSnowflake className="h-4 w-4 text-blue-600" />
              Cold-Chain & GDP Standard
            </h4>

            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              MediSupply escrow payments release automatically upon delivery
              confirmation and licensed pharmacist QA stamp. Ensure all
              temperature-sensitive batches include digital data loggers
              calibrating between <strong>2°C and 8°C</strong>.
            </p>

            <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-3 text-[11px] text-slate-500">
              <span>Standard Commission: 10%</span>

              <span className="font-semibold text-slate-700">
                Zero Hidden Deductions
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Dispatch Shipment Modal */}
      {dispatchOrder && (
        <div className="fixed inset-0 z-50 flex animate-in items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm duration-150 fade-in">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="flex items-center gap-2 text-base font-bold text-slate-900">
                  <Truck className="h-5 w-5 text-blue-600" />
                  Dispatch Consignment #{dispatchOrder.orderNumber}
                </h3>

                <p className="mt-0.5 text-xs text-slate-500">
                  Generate courier waybill and log storage conditions for
                  Pharmacist inspection
                </p>
              </div>

              <button
                type="button"
                onClick={() => setDispatchOrder(null)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                aria-label="Close dispatch modal"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmDispatch} className="mt-4 space-y-4">
              <div className="space-y-1 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs">
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Item:</span>

                  <span className="text-right font-semibold text-slate-800">
                    {dispatchOrder.items[0]?.name}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Batch & Expiry:</span>

                  <span className="text-right font-mono text-slate-800">
                    {dispatchOrder.batchNumber} (Exp: {dispatchOrder.expiryDate}
                    )
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Delivery Address:</span>

                  <span className="text-right text-slate-800">
                    {dispatchOrder.deliveryAddress}
                  </span>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">
                  Dedicated Medical Logistics Courier
                </label>

                <select
                  value={courierName}
                  onChange={(e) => setCourierName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="MediSupply Cold Logistics">
                    MediSupply Cold-Chain Logistics Fleet
                  </option>

                  <option value="Red Star Express Healthcare Direct">
                    Red Star Express Healthcare Direct
                  </option>

                  <option value="GIG Logistics Pharma Cargo">
                    GIG Logistics Pharma Cargo
                  </option>

                  <option value="DHL Medical Express">
                    DHL Medical Express Cold-Chain
                  </option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">
                  Waybill / Consignment Tracking Number
                </label>

                <input
                  type="text"
                  required
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 font-mono text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="e.g. WB-884920"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">
                  Cold-Chain Transit Temperature Reading
                </label>

                <input
                  type="text"
                  value={coldChainTemp}
                  onChange={(e) => setColdChainTemp(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="e.g. 4.2°C (Continuous Data Logger Verified)"
                />
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => setDispatchOrder(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmittingDispatch}
                  className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-50"
                >
                  <Truck className="h-4 w-4" />

                  {isSubmittingDispatch
                    ? "Confirming Dispatch..."
                    : "Confirm & Handover"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default SupplierDashboardPage
