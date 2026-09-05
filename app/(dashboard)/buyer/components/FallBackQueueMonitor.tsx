// FallBackQueueMonitor.tsx

"use client"

import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  ShieldCheck,
  Store,
  Truck,
  AlertTriangle,
} from "lucide-react"

import type {
  Order,
  Supplier,
} from "@/types"

interface FallBackQueueMonitorProps {
  queue?: Supplier[]
  orders?: Order[]
  hasQueue?: boolean
  loading?: boolean
  onViewQueue?: () => void
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

const supplierTypeLabel = (
  type: Supplier["supplierType"]
) => {
  switch (type) {
    case "importer":
      return "Importer"

    case "distributor":
      return "Distributor"

    case "retailer":
      return "Retailer"

    default:
      return type
  }
}

const supplierTypeClass = (
  type: Supplier["supplierType"]
) => {
  switch (type) {
    case "importer":
      return "border-blue-200 bg-blue-50 text-blue-700"

    case "distributor":
      return "border-emerald-200 bg-emerald-50 text-emerald-700"

    case "retailer":
      return "border-violet-200 bg-violet-50 text-violet-700"

    default:
      return "border-slate-200 bg-slate-50 text-slate-600"
  }
}

const formatCurrency = (value: number) =>
  `₦${Number(value || 0).toLocaleString("en-NG")}`

const procurementStatusLabel = (status: string) =>
  status.replace(/_/g, " ")

/* -------------------------------------------------------------------------- */
/* Mock Fallback Queue                                                        */
/* -------------------------------------------------------------------------- */

const mockQueue: Supplier[] = [
  {
    _id: "supplier-product-fidson-002",
    supplierId: "supplier-fidson-002",
    supplierProductId: "sp-fidson-para-002",
    name: "Fidson Healthcare Plc",
    supplierType: "importer",
    price: 122,
    stock: 14200,
    minOrderQuantity: 1000,
    maxOrderQuantity: 12000,
    email: "sales@fidson.com",
    verified: true,
    rating: 4.7,
    responseRate: 94,
    fulfillmentRate: 96,
    phone: "+234 1 271 8980",
    address: "Ikeja, Lagos, Nigeria",
    license: "NAFDAC-GDP-00341",
    salesUnit: "carton",
    score: 91,
    rank: 1,
    reasons: [
      "Strong stock availability",
      "Verified importer",
      "Excellent fulfillment history",
      "Fast supplier response",
    ],
    recommendation: {
      isRecommended: true,
      confidence: 91,
      badges: [
        "Next Best Match",
        "Reliable",
        "Fast Response",
      ],
    },
    supplierProfile: {
      businessName: "Fidson Healthcare Plc",
    },
  },

  {
    _id: "supplier-product-emzor-003",
    supplierId: "supplier-emzor-003",
    supplierProductId: "sp-emzor-para-003",
    name: "Emzor Pharmaceutical Industries Ltd",
    supplierType: "distributor",
    price: 128,
    stock: 9600,
    minOrderQuantity: 500,
    maxOrderQuantity: 8000,
    email: "orders@emzorpharma.com",
    verified: true,
    rating: 4.6,
    responseRate: 92,
    fulfillmentRate: 95,
    phone: "+234 1 774 1550",
    address: "Lagos, Nigeria",
    license: "NAFDAC-GDP-00512",
    salesUnit: "pack",
    score: 87,
    rank: 2,
    reasons: [
      "Good product availability",
      "Lower minimum order quantity",
      "Verified distributor",
      "95% fulfillment rate",
    ],
    recommendation: {
      isRecommended: false,
      confidence: 87,
      badges: [
        "Low MOQ",
        "Verified",
      ],
    },
    supplierProfile: {
      businessName:
        "Emzor Pharmaceutical Industries Ltd",
    },
  },

  {
    _id: "supplier-product-swiss-004",
    supplierId: "supplier-swiss-004",
    supplierProductId: "sp-swiss-para-004",
    name: "Swiss Pharma Nigeria Ltd",
    supplierType: "distributor",
    price: 132,
    stock: 7100,
    minOrderQuantity: 250,
    maxOrderQuantity: 5000,
    email: "procurement@swipha.com",
    verified: true,
    rating: 4.5,
    responseRate: 89,
    fulfillmentRate: 93,
    phone: "+234 1 271 9000",
    address: "Lagos, Nigeria",
    license: "NAFDAC-GDP-00764",
    salesUnit: "pack",
    score: 82,
    rank: 3,
    reasons: [
      "Good fulfillment history",
      "Low minimum order quantity",
      "Verified distributor",
      "Consistent supplier response",
    ],
    recommendation: {
      isRecommended: false,
      confidence: 82,
      badges: [
        "Low MOQ",
        "Reliable",
      ],
    },
    supplierProfile: {
      businessName: "Swiss Pharma Nigeria Ltd",
    },
  },

  {
    _id: "supplier-product-juhel-005",
    supplierId: "supplier-juhel-005",
    supplierProductId: "sp-juhel-para-005",
    name: "Juhel Nigeria Limited",
    supplierType: "retailer",
    price: 140,
    stock: 4200,
    minOrderQuantity: 100,
    maxOrderQuantity: 3000,
    email: "sales@juhel.com",
    verified: true,
    rating: 4.3,
    responseRate: 86,
    fulfillmentRate: 90,
    phone: "+234 803 000 0000",
    address: "Onitsha, Anambra, Nigeria",
    license: "NAFDAC-GDP-00891",
    salesUnit: "unit",
    score: 76,
    rank: 4,
    reasons: [
      "Available fallback inventory",
      "Very low minimum order quantity",
      "Verified supplier",
      "Suitable emergency fallback",
    ],
    recommendation: {
      isRecommended: false,
      confidence: 76,
      badges: [
        "Emergency Fallback",
        "Low MOQ",
      ],
    },
    supplierProfile: {
      businessName: "Juhel Nigeria Limited",
    },
  },
]

/* -------------------------------------------------------------------------- */
/* Mock Orders                                                                */
/* -------------------------------------------------------------------------- */

const mockOrders: Order[] = [
  {
    id: "MS-2026-000184",
    product: "Paracetamol 500mg",
    buyer: "St. Mary's Hospital Procurement",
    qty: 5000,
    basePrice: 122,
    status: "Supplier Contacted",
    date: "2026-09-05",
    supplier: "Fidson Healthcare Plc",
    batchNo: "FID-PARA-2608-C12",
    barcode: "8901234567890",
    mfgDate: "2026-08-01",
    expiryDate: "2029-07-31",
    condition: "Ambient",
    notes:
      "Preferred supplier unavailable. Procurement request moved into supplier fallback queue.",
  },

  {
    id: "MS-2026-000181",
    product: "Amoxicillin 500mg",
    buyer: "St. Mary's Hospital Procurement",
    qty: 2000,
    basePrice: 250,
    status: "Under Verification",
    date: "2026-09-04",
    supplier: "Fidson Healthcare Plc",
    batchNo: "FID-AMX-2606-C08",
    barcode: "8901234567123",
    mfgDate: "2026-06-15",
    expiryDate: "2029-06-14",
    condition: "Ambient",
    notes:
      "Product documentation currently undergoing pharmacist verification.",
  },

  {
    id: "MS-2026-000190",
    product: "Ibuprofen 400mg",
    buyer: "St. Mary's Hospital Procurement",
    qty: 3500,
    basePrice: 180,
    status: "Pending",
    date: "2026-09-05",
    supplier: "Emzor Pharmaceutical Industries Ltd",
    batchNo: "EMZ-IBU-2608-A11",
    barcode: "8901234567456",
    mfgDate: "2026-08-01",
    expiryDate: "2029-07-31",
    condition: "Ambient",
    notes:
      "Pending supplier confirmation and availability validation.",
  },
]

/* -------------------------------------------------------------------------- */
/* Mock Active Procurements                                                   */
/* -------------------------------------------------------------------------- */

type MockProcurement = {
  id: string
  procurementNumber: string
  productName: string
  quantity: number
  unit: string
  totalAmount: number
  status: string
  currentSupplierName: string
  currentSupplierIndex: number
  attemptHistory: {
    supplierName: string
    supplierIndex: number
    status: string
    attemptedAt: string
  }[]
}

const mockActiveProcurements: MockProcurement[] = [
  {
    id: "proc-2026-000184",
    procurementNumber: "MS-2026-000184",
    productName: "Paracetamol 500mg",
    quantity: 5000,
    unit: "tablets",
    totalAmount: 610000,
    status: "SUPPLIER_CONTACTED",
    currentSupplierName: "Fidson Healthcare Plc",
    currentSupplierIndex: 0,
    attemptHistory: [
      {
        supplierName: "Fidson Healthcare Plc",
        supplierIndex: 0,
        status: "SUPPLIER_CONTACTED",
        attemptedAt: "2026-09-05T09:10:00",
      },
    ],
  },

  {
    id: "proc-2026-000190",
    procurementNumber: "MS-2026-000190",
    productName: "Ibuprofen 400mg",
    quantity: 3500,
    unit: "tablets",
    totalAmount: 630000,
    status: "PENDING",
    currentSupplierName: "Emzor Pharmaceutical Industries Ltd",
    currentSupplierIndex: 1,
    attemptHistory: [
      {
        supplierName: "Fidson Healthcare Plc",
        supplierIndex: 0,
        status: "UNAVAILABLE",
        attemptedAt: "2026-09-05T08:45:00",
      },
      {
        supplierName: "Emzor Pharmaceutical Industries Ltd",
        supplierIndex: 1,
        status: "PENDING",
        attemptedAt: "2026-09-05T09:00:00",
      },
    ],
  },
]

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

export const FallBackQueueMonitor: React.FC<
  FallBackQueueMonitorProps
> = ({
  queue,
  orders,
  hasQueue,
  loading = false,
  onViewQueue,
}) => {
  const displayQueue =
    queue && queue.length > 0
      ? queue
      : mockQueue

  const displayOrders =
    orders && orders.length > 0
      ? orders
      : mockOrders

  const activeOrders = displayOrders.filter(
    (order) =>
      order.status !== "Delivered" &&
      order.status !== "Rejected"
  )

  /**
   * The active procurement sourcing cards are intentionally
   * backed by mock data until the procurement API is connected.
   */
  const activeProcurements =
    mockActiveProcurements

  const queueIsActive =
    hasQueue ?? displayQueue.length > 0

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="h-5 w-64 animate-pulse rounded bg-slate-200" />

        <div className="mt-5 space-y-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-20 animate-pulse rounded-xl bg-slate-100"
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* ------------------------------------------------------------------ */}
      {/* Live Procurement Sourcing & Fallback Queue                          */}
      {/* ------------------------------------------------------------------ */}

      {activeProcurements.length > 0 && (
        <div className="rounded-2xl border border-amber-200 bg-white p-5 shadow-xs">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-amber-500" />

              <h2 className="font-display text-sm font-bold uppercase tracking-wider text-slate-900">
                Live Procurement Sourcing & Fallback Queue (
                {activeProcurements.length}
                )
              </h2>
            </div>

            <button
              type="button"
              onClick={onViewQueue}
              className="shrink-0 cursor-pointer text-xs font-semibold text-blue-600 hover:underline"
            >
              Full Queue Details →
            </button>
          </div>

          <div className="space-y-3">
            {activeProcurements.map((proc) => {
              const currentAttempt =
                proc.attemptHistory[
                  proc.attemptHistory.length - 1
                ]

              return (
                <motion.div
                  key={proc.id}
                  initial={{
                    opacity: 0,
                    y: 6,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  className="flex flex-col items-start justify-between gap-4 rounded-xl border border-amber-200/80 bg-amber-50/50 p-4 md:flex-row md:items-center"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">
                        {proc.productName}
                      </span>

                      <span className="rounded bg-slate-900 px-2 py-0.5 font-mono text-[10px] text-white">
                        #{proc.procurementNumber}
                      </span>

                      <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                        {procurementStatusLabel(
                          proc.status
                        )}
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-slate-600">
                      Quantity:{" "}
                      <span className="font-mono font-bold">
                        {proc.quantity.toLocaleString()}{" "}
                        {proc.unit}
                      </span>{" "}
                      • Total:{" "}
                      <span className="font-mono font-bold">
                        {formatCurrency(
                          proc.totalAmount
                        )}
                      </span>
                    </p>

                    <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                      <span>
                        Currently Contacting:
                      </span>

                      <span className="font-semibold text-slate-900">
                        {proc.currentSupplierName}{" "}
                        (Rank #
                        {proc.currentSupplierIndex + 1})
                      </span>

                      {currentAttempt && (
                        <span className="text-slate-400">
                          •{" "}
                          {proc.attemptHistory.length}{" "}
                          supplier attempt
                          {proc.attemptHistory.length !==
                          1
                            ? "s"
                            : ""}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={onViewQueue}
                      className="cursor-pointer rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                    >
                      Track Fallback Queue
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      )}

  
    </div>
  )
}

export default FallBackQueueMonitor