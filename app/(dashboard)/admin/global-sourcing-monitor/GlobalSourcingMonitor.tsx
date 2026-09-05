// BuyerProcurement.tsx
"use client"

import React, { useMemo, useState } from "react"
import {
  Sparkles,
  RefreshCw,
  Clock,
  Building2,
  ShieldCheck,
  Package,
  Layers,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { toast } from "sonner"
import {motion} from "framer-motion"

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

type ProcurementStatus =
  | "PENDING"
  | "SUPPLIER_CONTACTED"
  | "NEXT_SUPPLIER_PENDING"
  | "SUPPLIER_CONFIRMED"
  | "BUYER_ACTION_REQUIRED"
  | "ORDER_CREATED"
  | "COMPLETED"
  | "CANCELLED"

type SupplierQueueStatus =
  | "PENDING"
  | "CONTACTED"
  | "ACCEPTED"
  | "REJECTED"
  | "UNAVAILABLE"

type SupplierQueueItem = {
  supplierId: string
  supplierName: string
  supplierType: "Importer" | "Distributor" | "Retailer"
  unitPrice: number
  stock: number
  rank: number
  status: SupplierQueueStatus
}

type AttemptHistory = {
  attemptNumber: number
  supplierId: string
  supplierName: string
  supplierType: "Importer" | "Distributor" | "Retailer"
  contactedAt: string
  respondedAt?: string
  status: SupplierQueueStatus
  reason?: string
}

type Procurement = {
  id: string
  procurementNumber: string
  productName: string
  category: string
  quantity: number
  unit: string
  totalAmount: number
  paymentMethod:
    | "WALLET"
    | "CREDIT"
    | "WALLET_CREDIT"
  status: ProcurementStatus
  currentSupplierName: string
  currentSupplierIndex: number
  supplierQueue: SupplierQueueItem[]
  attemptHistory: AttemptHistory[]
  associatedOrderId?: string
  createdAt: string
}

/* -------------------------------------------------------------------------- */
/* Props                                                                      */
/* -------------------------------------------------------------------------- */

interface GlobalSourcingMonitorProps {
  onRefresh?: () => void | Promise<void>
  onOpenCatalogue?: () => void
  onOpenOrders?: (orderId: string) => void
}

/* -------------------------------------------------------------------------- */
/* Mock Data                                                                  */
/* -------------------------------------------------------------------------- */

const mockProcurements: Procurement[] = [
  {
    id: "proc-2026-000184",
    procurementNumber: "MS-2026-000184",
    productName: "Paracetamol 500mg",
    category: "Analgesics",
    quantity: 5000,
    unit: "tablets",
    totalAmount: 610000,
    paymentMethod: "WALLET_CREDIT",
    status: "SUPPLIER_CONTACTED",
    currentSupplierName: "Fidson Healthcare Plc",
    currentSupplierIndex: 0,

    supplierQueue: [
      {
        supplierId: "supplier-fidson-002",
        supplierName: "Fidson Healthcare Plc",
        supplierType: "Importer",
        unitPrice: 122,
        stock: 14200,
        rank: 1,
        status: "CONTACTED",
      },
      {
        supplierId: "supplier-emzor-003",
        supplierName: "Emzor Pharmaceutical Industries Ltd",
        supplierType: "Distributor",
        unitPrice: 128,
        stock: 9600,
        rank: 2,
        status: "PENDING",
      },
      {
        supplierId: "supplier-swiss-004",
        supplierName: "Swiss Pharma Nigeria Ltd",
        supplierType: "Distributor",
        unitPrice: 132,
        stock: 7100,
        rank: 3,
        status: "PENDING",
      },
      {
        supplierId: "supplier-juhel-005",
        supplierName: "Juhel Nigeria Limited",
        supplierType: "Retailer",
        unitPrice: 140,
        stock: 4200,
        rank: 4,
        status: "PENDING",
      },
    ],

    attemptHistory: [
      {
        attemptNumber: 1,
        supplierId: "supplier-fidson-002",
        supplierName: "Fidson Healthcare Plc",
        supplierType: "Importer",
        contactedAt: "2026-09-05T09:10:00",
        status: "CONTACTED",
        reason:
          "Preferred supplier unavailable. Automated fallback sequence initiated.",
      },
    ],

    createdAt: "2026-09-05T08:45:00",
  },

  {
    id: "proc-2026-000181",
    procurementNumber: "MS-2026-000181",
    productName: "Amoxicillin 500mg",
    category: "Antibiotics",
    quantity: 2000,
    unit: "capsules",
    totalAmount: 510000,
    paymentMethod: "WALLET",
    status: "BUYER_ACTION_REQUIRED",
    currentSupplierName: "Fidson Healthcare Plc",
    currentSupplierIndex: 0,

    supplierQueue: [
      {
        supplierId: "supplier-fidson-002",
        supplierName: "Fidson Healthcare Plc",
        supplierType: "Importer",
        unitPrice: 250,
        stock: 12500,
        rank: 1,
        status: "CONTACTED",
      },
      {
        supplierId: "supplier-emzor-003",
        supplierName: "Emzor Pharmaceutical Industries Ltd",
        supplierType: "Distributor",
        unitPrice: 258,
        stock: 8200,
        rank: 2,
        status: "PENDING",
      },
      {
        supplierId: "supplier-juhel-005",
        supplierName: "Juhel Nigeria Limited",
        supplierType: "Retailer",
        unitPrice: 275,
        stock: 3100,
        rank: 3,
        status: "PENDING",
      },
    ],

    attemptHistory: [
      {
        attemptNumber: 1,
        supplierId: "supplier-fidson-002",
        supplierName: "Fidson Healthcare Plc",
        supplierType: "Importer",
        contactedAt: "2026-09-04T14:10:00",
        respondedAt: "2026-09-04T14:24:00",
        status: "CONTACTED",
        reason:
          "Supplier documentation received and is currently undergoing verification.",
      },
    ],

    associatedOrderId: "MS-2026-000181",

    createdAt: "2026-09-04T13:50:00",
  },

  {
    id: "proc-2026-000190",
    procurementNumber: "MS-2026-000190",
    productName: "Ibuprofen 400mg",
    category: "Analgesics",
    quantity: 3500,
    unit: "tablets",
    totalAmount: 630000,
    paymentMethod: "CREDIT",
    status: "NEXT_SUPPLIER_PENDING",
    currentSupplierName: "Emzor Pharmaceutical Industries Ltd",
    currentSupplierIndex: 1,

    supplierQueue: [
      {
        supplierId: "supplier-fidson-002",
        supplierName: "Fidson Healthcare Plc",
        supplierType: "Importer",
        unitPrice: 175,
        stock: 0,
        rank: 1,
        status: "UNAVAILABLE",
      },
      {
        supplierId: "supplier-emzor-003",
        supplierName: "Emzor Pharmaceutical Industries Ltd",
        supplierType: "Distributor",
        unitPrice: 180,
        stock: 9600,
        rank: 2,
        status: "CONTACTED",
      },
      {
        supplierId: "supplier-swiss-004",
        supplierName: "Swiss Pharma Nigeria Ltd",
        supplierType: "Distributor",
        unitPrice: 185,
        stock: 7100,
        rank: 3,
        status: "PENDING",
      },
      {
        supplierId: "supplier-juhel-005",
        supplierName: "Juhel Nigeria Limited",
        supplierType: "Retailer",
        unitPrice: 195,
        stock: 4200,
        rank: 4,
        status: "PENDING",
      },
    ],

    attemptHistory: [
      {
        attemptNumber: 1,
        supplierId: "supplier-fidson-002",
        supplierName: "Fidson Healthcare Plc",
        supplierType: "Importer",
        contactedAt: "2026-09-05T08:35:00",
        respondedAt: "2026-09-05T08:42:00",
        status: "UNAVAILABLE",
        reason:
          "Required quantity unavailable in current inventory.",
      },
      {
        attemptNumber: 2,
        supplierId: "supplier-emzor-003",
        supplierName: "Emzor Pharmaceutical Industries Ltd",
        supplierType: "Distributor",
        contactedAt: "2026-09-05T08:50:00",
        status: "CONTACTED",
        reason:
          "Waiting for supplier confirmation.",
      },
    ],

    createdAt: "2026-09-05T08:20:00",
  },
]

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

const GlobalSourcingMonitor: React.FC<
  GlobalSourcingMonitorProps
> = ({
  onRefresh,
  onOpenCatalogue,
  onOpenOrders,
}) => {
  const [procurements, setProcurements] =
    useState<Procurement[]>(mockProcurements)

  const [expandedId, setExpandedId] =
    useState<string | null>(null)

  const [isRefreshing, setIsRefreshing] =
    useState(false)

  const [isAdvancing, setIsAdvancing] =
    useState<string | null>(null)

  /* ------------------------------------------------------------------------ */
  /* Derived Data                                                             */
  /* ------------------------------------------------------------------------ */

  const activeProcurements = useMemo(
    () =>
      procurements.filter(
        (proc) =>
          ![
            "COMPLETED",
            "ORDER_CREATED",
            "CANCELLED",
          ].includes(proc.status)
      ),
    [procurements]
  )

  /* ------------------------------------------------------------------------ */
  /* Helpers                                                                  */
  /* ------------------------------------------------------------------------ */

  const formatCurrency = (value: number) =>
    `₦${Number(value || 0).toLocaleString("en-NG")}`

  const formatDateTime = (value: string) =>
    new Date(value).toLocaleString("en-NG", {
      dateStyle: "medium",
      timeStyle: "short",
    })

  const toggleExpand = (id: string) => {
    setExpandedId((current) =>
      current === id ? null : id
    )
  }

  const getStatusBadge = (
    status: ProcurementStatus
  ) => {
    switch (status) {
      case "SUPPLIER_CONFIRMED":
      case "ORDER_CREATED":
      case "COMPLETED":
        return "bg-emerald-100 text-emerald-800 border-emerald-300"

      case "SUPPLIER_CONTACTED":
      case "NEXT_SUPPLIER_PENDING":
        return "bg-amber-100 text-amber-800 border-amber-300 animate-pulse"

      case "BUYER_ACTION_REQUIRED":
        return "bg-red-100 text-red-800 border-red-300"

      case "CANCELLED":
        return "bg-slate-100 text-slate-600 border-slate-300"

      default:
        return "bg-slate-100 text-slate-700 border-slate-300"
    }
  }

  const getQueueStatusClass = (
    status: SupplierQueueStatus,
    isCurrent: boolean
  ) => {
    if (isCurrent) {
      return "bg-amber-50 border-amber-400 shadow-xs ring-1 ring-amber-400/50"
    }

    switch (status) {
      case "ACCEPTED":
        return "bg-emerald-50 border-emerald-300"

      case "REJECTED":
      case "UNAVAILABLE":
        return "bg-slate-100 border-slate-200 opacity-60"

      default:
        return "bg-white border-slate-200"
    }
  }

  const getQueueStatusBadge = (
    status: SupplierQueueStatus,
    isCurrent: boolean
  ) => {
    if (isCurrent) {
      return "bg-amber-200 text-amber-900"
    }

    if (status === "ACCEPTED") {
      return "bg-emerald-200 text-emerald-900"
    }

    if (
      status === "REJECTED" ||
      status === "UNAVAILABLE"
    ) {
      return "bg-red-100 text-red-800"
    }

    return "bg-slate-200 text-slate-700"
  }

  /* ------------------------------------------------------------------------ */
  /* Refresh                                                                  */
  /* ------------------------------------------------------------------------ */

  const refreshAll = async () => {
    setIsRefreshing(true)

    try {
      /*
       * Mock refresh.
       *
       * Replace this section with the procurement API
       * when the backend endpoint is connected.
       */
      await new Promise((resolve) =>
        setTimeout(resolve, 700)
      )

      setProcurements([...mockProcurements])

      if (onRefresh) {
        await onRefresh()
      }

      toast.success("Sourcing engine refreshed", {
        description:
          "Procurement queue and supplier rankings have been refreshed.",
      })
    } catch (error) {
      toast.error("Unable to refresh sourcing engine", {
        description:
          error instanceof Error
            ? error.message
            : "Please try again.",
      })
    } finally {
      setIsRefreshing(false)
    }
  }

  /* ------------------------------------------------------------------------ */
  /* Advance Fallback                                                         */
  /* ------------------------------------------------------------------------ */

  const handleAdvanceFallback = async (
    procurementId: string
  ) => {
    const procurement = procurements.find(
      (proc) => proc.id === procurementId
    )

    if (!procurement) {
      toast.error("Procurement not found")
      return
    }

    setIsAdvancing(procurementId)

    try {
      await new Promise((resolve) =>
        setTimeout(resolve, 800)
      )

      const nextSupplierIndex =
        procurement.currentSupplierIndex + 1

      const nextSupplier =
        procurement.supplierQueue[
          nextSupplierIndex
        ]

      if (!nextSupplier) {
        toast.warning("Fallback queue exhausted", {
          description:
            "All ranked suppliers in the queue have been contacted.",
        })

        setProcurements((current) =>
          current.map((item) =>
            item.id === procurementId
              ? {
                  ...item,
                  status:
                    "BUYER_ACTION_REQUIRED",
                }
              : item
          )
        )

        return
      }

      const now = new Date().toISOString()

      setProcurements((current) =>
        current.map((item) => {
          if (item.id !== procurementId) {
            return item
          }

          const updatedQueue =
            item.supplierQueue.map(
              (supplier, index) => {
                if (
                  index ===
                  item.currentSupplierIndex
                ) {
                  return {
                    ...supplier,
                    status: "UNAVAILABLE" as const,
                  }
                }

                if (index === nextSupplierIndex) {
                  return {
                    ...supplier,
                    status: "CONTACTED" as const,
                  }
                }

                return supplier
              }
            )

          const nextAttempt: AttemptHistory = {
            attemptNumber:
              item.attemptHistory.length + 1,
            supplierId: nextSupplier.supplierId,
            supplierName:
              nextSupplier.supplierName,
            supplierType:
              nextSupplier.supplierType,
            contactedAt: now,
            status: "CONTACTED",
            reason:
              "Buyer manually initiated the automated fallback sequence.",
          }

          return {
            ...item,
            currentSupplierName:
              nextSupplier.supplierName,
            currentSupplierIndex:
              nextSupplierIndex,
            status:
              "NEXT_SUPPLIER_PENDING",
            supplierQueue: updatedQueue,
            attemptHistory: [
              ...item.attemptHistory,
              nextAttempt,
            ],
          }
        })
      )

      toast.info("Fallback activated", {
        description: `Advanced to alternate supplier: ${nextSupplier.supplierName}.`,
      })
    } catch (error) {
      toast.error("Error advancing fallback", {
        description:
          error instanceof Error
            ? error.message
            : "Unable to advance procurement fallback.",
      })
    } finally {
      setIsAdvancing(null)
    }
  }

  /* ------------------------------------------------------------------------ */
  /* Empty State                                                              */
  /* ------------------------------------------------------------------------ */

  if (procurements.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="font-display text-xl font-bold text-slate-900">
              Procurement Sourcing & Supplier Queue
              Manager
            </h1>

            <p className="mt-0.5 text-xs text-slate-500">
              Automated multi-tier fallback architecture:
              Top Ranked Importer → Tier 2 Distributor →
              Fallback Pool
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
          <Sparkles className="mx-auto mb-3 h-12 w-12 text-slate-300" />

          <h3 className="text-sm font-bold text-slate-800">
            No Active Procurements
          </h3>

          <p className="mx-auto mt-1 max-w-sm text-xs text-slate-500">
            Browse the Master Catalogue to launch an
            automated multi-factor procurement request.
          </p>

          <button
            type="button"
            onClick={onOpenCatalogue}
            className="mt-4 cursor-pointer rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-blue-700"
          >
            Browse Catalogue
          </button>
        </div>
      </div>
    )
  }

  /* ------------------------------------------------------------------------ */
  /* Main UI                                                                  */
  /* ------------------------------------------------------------------------ */

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-xl font-bold text-slate-900">
            Procurement Sourcing & Supplier Queue
            Manager
          </h1>

          <p className="mt-0.5 text-xs text-slate-500">
            Automated multi-tier fallback architecture:
            Top Ranked Importer → Tier 2 Distributor →
            Fallback Pool
          </p>
        </div>

        <button
          type="button"
          onClick={refreshAll}
          disabled={isRefreshing}
          className="flex cursor-pointer items-center gap-1.5 self-start rounded-xl bg-slate-100 px-3.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${
              isRefreshing
                ? "animate-spin"
                : ""
            }`}
          />

          <span>
            {isRefreshing
              ? "Refreshing..."
              : "Refresh Sourcing Engine"}
          </span>
        </button>
      </div>

      {/* Active Procurement Count */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-700">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />
          {activeProcurements.length} Active Procurement
          {activeProcurements.length !== 1
            ? "s"
            : ""}
        </span>

        <span className="text-[11px] text-slate-400">
          Supplier fallback monitoring enabled
        </span>
      </div>

      {/* Procurement Cards */}
      <div className="space-y-4">
        {procurements.map((proc) => {
          const isExpanded =
            expandedId === proc.id

          const currentAttempt =
            proc.attemptHistory[
              proc.attemptHistory.length - 1
            ]

          const canAdvance = ![
            "COMPLETED",
            "ORDER_CREATED",
            "CANCELLED",
          ].includes(proc.status)

          return (
            <motion.div
              key={proc.id}
              layout
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs transition"
            >
              {/* Main Card Summary */}
              <div className="flex flex-col justify-between gap-4 p-5 lg:flex-row lg:items-center">
                <div className="min-w-0 space-y-1.5">
                  {/* Product / Status */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-display text-sm font-bold text-slate-900">
                      {proc.productName}
                    </span>

                    <span className="rounded bg-slate-100 px-2 py-0.5 font-mono text-[11px] font-bold text-slate-700">
                      #{proc.procurementNumber}
                    </span>

                    <span
                      className={`rounded-full border px-2 py-0.5 text-[10.5px] font-bold ${getStatusBadge(
                        proc.status
                      )}`}
                    >
                      {proc.status.replace(
                        /_/g,
                        " "
                      )}
                    </span>
                  </div>

                  {/* Procurement Metrics */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                    <span>
                      Quantity:{" "}
                      <strong className="font-mono text-slate-900">
                        {proc.quantity.toLocaleString()}{" "}
                        {proc.unit}
                      </strong>
                    </span>

                    <span>
                      Total Value:{" "}
                      <strong className="font-mono text-blue-700">
                        {formatCurrency(
                          proc.totalAmount
                        )}
                      </strong>
                    </span>

                    <span>
                      Payment:{" "}
                      <strong className="text-slate-800">
                        {proc.paymentMethod.replace(
                          "_",
                          " + "
                        )}
                      </strong>
                    </span>
                  </div>

                  {/* Current Supplier */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-[11.5px] text-slate-500">
                    <Building2 className="h-3.5 w-3.5 text-blue-600" />

                    <span>
                      Currently Active Supplier:
                    </span>

                    <span className="font-semibold text-slate-900">
                      {proc.currentSupplierName}{" "}
                      (Rank #
                      {proc.currentSupplierIndex +
                        1}{" "}
                      in queue)
                    </span>
                  </div>

                  {/* Current Attempt */}
                  {currentAttempt && (
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                      <Clock className="h-3 w-3" />

                      <span>
                        Latest attempt:{" "}
                        {formatDateTime(
                          currentAttempt.contactedAt
                        )}
                      </span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2">
                  {canAdvance && (
                    <button
                      type="button"
                      onClick={() =>
                        handleAdvanceFallback(
                          proc.id
                        )
                      }
                      disabled={
                        isAdvancing === proc.id
                      }
                      className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-900 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <RefreshCw
                        className={`h-3.5 w-3.5 ${
                          isAdvancing === proc.id
                            ? "animate-spin"
                            : ""
                        }`}
                      />

                      <span>
                        {isAdvancing === proc.id
                          ? "Advancing..."
                          : "Simulate Next Fallback"}
                      </span>
                    </button>
                  )}

                  {proc.associatedOrderId && (
                    <button
                      type="button"
                      onClick={() =>
                        onOpenOrders?.(
                          proc.associatedOrderId!
                        )
                      }
                      className="cursor-pointer rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-700"
                    >
                      View Order & Tracking →
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      toggleExpand(proc.id)
                    }
                    className="flex cursor-pointer items-center gap-1 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
                  >
                    <span>
                      {isExpanded
                        ? "Hide Queue"
                        : "Inspect Queue"}
                    </span>

                    {isExpanded ? (
                      <ChevronUp className="h-3.5 w-3.5" />
                    ) : (
                      <ChevronDown className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Expandable Details */}
              {isExpanded && (
                <motion.div
                  initial={{
                    opacity: 0,
                    height: 0,
                  }}
                  animate={{
                    opacity: 1,
                    height: "auto",
                  }}
                  exit={{
                    opacity: 0,
                    height: 0,
                  }}
                  className="space-y-5 border-t border-slate-100 bg-slate-50/70 p-5 text-xs"
                >
                  {/* Ranked Supplier Queue */}
                  <div>
                    <h4 className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-900">
                      <Layers className="h-4 w-4 text-blue-600" />

                      <span>
                        Ranked Supplier Sourcing Queue (
                        {
                          proc.supplierQueue
                            .length
                        }{" "}
                        Candidates)
                      </span>
                    </h4>

                    <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2 xl:grid-cols-4">
                      {proc.supplierQueue.map(
                        (item, qIdx) => {
                          const isCurrent =
                            qIdx ===
                            proc.currentSupplierIndex

                          return (
                            <div
                              key={item.supplierId}
                              className={`flex flex-col justify-between rounded-xl border p-3 ${getQueueStatusClass(
                                item.status,
                                isCurrent
                              )}`}
                            >
                              <div>
                                <div className="mb-1 flex items-center justify-between gap-2">
                                  <span className="font-mono text-[11px] font-bold text-slate-500">
                                    Rank #
                                    {item.rank}
                                  </span>

                                  <span
                                    className={`rounded px-1.5 py-0.5 text-[9.5px] font-bold ${getQueueStatusBadge(
                                      item.status,
                                      isCurrent
                                    )}`}
                                  >
                                    {isCurrent
                                      ? "CURRENT ACTIVE"
                                      : item.status}
                                  </span>
                                </div>

                                <p className="truncate text-xs font-semibold text-slate-900">
                                  {item.supplierName}
                                </p>

                                <p className="text-[10px] text-slate-500">
                                  {item.supplierType}
                                </p>
                              </div>

                              <div className="mt-2 flex items-center justify-between border-t border-slate-200/60 pt-2 text-[11px]">
                                <span className="font-mono font-bold text-slate-800">
                                  {formatCurrency(
                                    item.unitPrice
                                  )}
                                  /u
                                </span>

                                <span className="text-[10px] text-slate-500">
                                  Stock:{" "}
                                  {item.stock.toLocaleString()}
                                </span>
                              </div>
                            </div>
                          )
                        }
                      )}
                    </div>
                  </div>

                  {/* Attempt History */}
                  <div>
                    <h4 className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-900">
                      <Clock className="h-4 w-4 text-slate-600" />

                      <span>
                        Sourcing Attempt & Fallback Log
                      </span>
                    </h4>

                    <div className="space-y-2">
                      {proc.attemptHistory.map(
                        (att) => (
                          <div
                            key={`${proc.id}-${att.attemptNumber}`}
                            className="flex items-start justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 text-xs"
                          >
                            <div className="flex items-start gap-2.5">
                              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 font-mono text-xs font-bold text-slate-700">
                                {att.attemptNumber}
                              </div>

                              <div>
                                <p className="font-semibold text-slate-900">
                                  Attempt #
                                  {
                                    att.attemptNumber
                                  }
                                  :{" "}
                                  {att.supplierName}{" "}
                                  (
                                  {
                                    att.supplierType
                                  }
                                  )
                                </p>

                                <p className="text-[11px] text-slate-500">
                                  Contacted at{" "}
                                  {new Date(
                                    att.contactedAt
                                  ).toLocaleTimeString(
                                    "en-NG",
                                    {
                                      hour: "2-digit",
                                      minute:
                                        "2-digit",
                                    }
                                  )}

                                  {att.respondedAt &&
                                    ` • Responded at ${new Date(
                                      att.respondedAt
                                    ).toLocaleTimeString(
                                      "en-NG",
                                      {
                                        hour: "2-digit",
                                        minute:
                                          "2-digit",
                                      }
                                    )}`}
                                </p>

                                {att.reason && (
                                  <p className="mt-1 rounded border border-amber-200/60 bg-amber-50 px-2 py-0.5 text-[11px] text-amber-700">
                                    Note:{" "}
                                    {att.reason}
                                  </p>
                                )}
                              </div>
                            </div>

                            <span
                              className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                att.status ===
                                "ACCEPTED"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : att.status ===
                                      "REJECTED" ||
                                    att.status ===
                                      "UNAVAILABLE"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {att.status}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* Procurement Logic */}
                  <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-3">
                    <div className="flex items-start gap-2.5">
                      <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />

                      <div>
                        <p className="font-semibold text-blue-900">
                          Automated sourcing logic
                        </p>

                        <p className="mt-0.5 text-[11px] leading-relaxed text-blue-700/80">
                          MedSupply ranks suppliers using
                          price, available stock, supplier
                          tier, MOQ, verification status,
                          fulfillment performance and
                          supplier response history. If the
                          current supplier cannot fulfill the
                          request, the system can progress to
                          the next ranked supplier.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Footer Context */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex items-start gap-3">
          <Package className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />

          <div>
            <p className="text-xs font-semibold text-slate-700">
              Procurement sourcing status
            </p>

            <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
              {activeProcurements.length} procurement request
              {activeProcurements.length !== 1
                ? "s are"
                : " is"}{" "}
              currently being monitored by the supplier
              sourcing engine. Supplier fallback progression
              remains controlled by the ranked queue.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GlobalSourcingMonitor