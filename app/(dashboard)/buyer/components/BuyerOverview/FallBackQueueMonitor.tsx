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

/* -------------------------------------------------------------------------- */
/* Mock Fallback Queue                                                        */
/* -------------------------------------------------------------------------- */

/**
 * Mock supplier fallback queue.
 *
 * Scenario:
 * The originally preferred supplier could not fulfill
 * the procurement request. MedSupply's matching engine
 * therefore ranked the next available suppliers.
 */
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
/* Mock Active Orders                                                         */
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
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

export const FallBackQueueMonitor: React.FC<
  FallBackQueueMonitorProps
> = ({
  queue,
  orders,
  hasQueue,
  loading = false,
}) => {
    /* ------------------------------------------------------------------------ */
    /* Development fallback data                                                */
    /* ------------------------------------------------------------------------ */

    const displayQueue =
      queue && queue.length > 0
        ? queue
        : mockQueue

    const displayOrders =
      orders && orders.length > 0
        ? orders
        : mockOrders

    /**
     * When hasQueue is supplied by the API, respect it.
     * Otherwise derive queue state from the active queue.
     */
    const queueIsActive =
      hasQueue ?? displayQueue.length > 0

    /* ------------------------------------------------------------------------ */
    /* Active Orders                                                             */
    /* ------------------------------------------------------------------------ */

    const activeOrders = displayOrders.filter(
      (order) =>
        order.status !== "Delivered" &&
        order.status !== "Rejected"
    )

    /* ------------------------------------------------------------------------ */
    /* Loading                                                                   */
    /* ------------------------------------------------------------------------ */

    if (loading) {
      return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="h-5 w-52 animate-pulse rounded bg-slate-200" />

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

    /* ------------------------------------------------------------------------ */
    /* UI                                                                        */
    /* ------------------------------------------------------------------------ */

    return (
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Header */}
        <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
                <Truck className="h-4 w-4" />
              </div>

              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Live Procurement Sourcing & Fallback Queue
                </h2>

                <p className="mt-0.5 text-xs text-slate-400">
                  Monitor supplier progression when the preferred
                  supplier cannot fulfill an order.
                </p>
              </div>
            </div>
          </div>

          <div>
            {queueIsActive ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-700">
                <Clock3 className="h-3 w-3" />
                Fallback Active
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                <CheckCircle2 className="h-3 w-3" />
                Queue Clear
              </span>
            )}
          </div>
        </div>

        {/* Queue */}
        <div className="p-5">
          {!queueIsActive ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-5 py-10 text-center">
              <div className="rounded-full bg-white p-3 shadow-sm">
                <ShieldCheck className="h-6 w-6 text-emerald-500" />
              </div>

              <h3 className="mt-3 text-sm font-semibold text-slate-700">
                No supplier fallback required
              </h3>

              <p className="mt-1 max-w-md text-xs leading-relaxed text-slate-400">
                Your active procurement requests are either
                successfully assigned or currently progressing through
                the normal supplier workflow.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence initial={false}>
                {displayQueue.map((supplier, index) => {
                  const rank =
                    supplier.rank ?? index + 1

                  return (
                    <motion.div
                      key={`${supplier.supplierProductId}-${supplier._id}`}
                      initial={{
                        opacity: 0,
                        y: 8,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      exit={{
                        opacity: 0,
                        y: -8,
                      }}
                      transition={{
                        duration: 0.2,
                        delay: index * 0.04,
                      }}
                      className="group relative rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-blue-200 hover:shadow-sm"
                    >
                      <div className="flex flex-col gap-4 md:flex-row md:items-center">
                        {/* Rank */}
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 font-mono text-xs font-bold text-slate-600">
                            #{rank}
                          </div>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="truncate text-sm font-bold text-slate-900">
                                {supplier.name}
                              </h3>

                              {supplier.verified && (
                                <ShieldCheck className="h-3.5 w-3.5 text-blue-500" />
                              )}
                            </div>

                            <div className="mt-1 flex flex-wrap items-center gap-2">
                              <span
                                className={`rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${supplierTypeClass(
                                  supplier.supplierType
                                )}`}
                              >
                                {supplierTypeLabel(
                                  supplier.supplierType
                                )}
                              </span>

                              {supplier.rating !== undefined && (
                                <span className="text-[10px] text-slate-400">
                                  Rating{" "}
                                  {supplier.rating.toFixed(1)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Supplier Metrics */}
                        <div className="grid grid-cols-3 gap-3 md:ml-auto md:min-w-[320px]">
                          <div>
                            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                              Price
                            </p>

                            <p className="mt-1 font-mono text-xs font-bold text-slate-800">
                              {formatCurrency(
                                supplier.price
                              )}
                            </p>
                          </div>

                          <div>
                            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                              Stock
                            </p>

                            <p className="mt-1 font-mono text-xs font-bold text-slate-800">
                              {supplier.stock.toLocaleString()}
                            </p>
                          </div>

                          <div>
                            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                              MOQ
                            </p>

                            <p className="mt-1 font-mono text-xs font-bold text-slate-800">
                              {supplier.minOrderQuantity.toLocaleString()}
                            </p>
                          </div>
                        </div>

                        {/* Queue Position */}
                        <div className="flex shrink-0 items-center">
                          <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[10px] font-semibold text-slate-600">
                            <Store className="h-3.5 w-3.5" />
                            Queue Position {rank}
                          </div>
                        </div>
                      </div>

                      {/* Recommendation Reasons */}
                      {supplier.reasons &&
                        supplier.reasons.length > 0 && (
                          <div className="mt-4 border-t border-slate-100 pt-3">
                            <div className="flex flex-wrap gap-1.5">
                              {supplier.reasons
                                .slice(0, 4)
                                .map(
                                  (
                                    reason,
                                    reasonIndex
                                  ) => (
                                    <span
                                      key={`${reason}-${reasonIndex}`}
                                      className="inline-flex items-center gap-1 rounded-md bg-slate-50 px-2 py-1 text-[9px] font-medium text-slate-500"
                                    >
                                      <CheckCircle2 className="h-3 w-3 text-emerald-500" />

                                      {reason}
                                    </span>
                                  )
                                )}
                            </div>
                          </div>
                        )}

                      {/* Connector */}
                      {index <
                        displayQueue.length - 1 && (
                          <div className="absolute -bottom-4 left-8 z-10 hidden md:block">
                            <ArrowRight className="h-4 w-4 rotate-90 text-slate-300" />
                          </div>
                        )}
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Active Procurement Context */}
        {activeOrders.length > 0 && (
          <div className="border-t border-slate-200 bg-slate-50/70 px-5 py-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />

              <div>
                <p className="text-xs font-semibold text-slate-700">
                  Fallback workflow
                </p>

                <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
                  If the current supplier cannot fulfill the procurement
                  request, MedSupply can progress the order to the next
                  ranked supplier based on availability, price, supplier
                  type, fulfillment capability, and matching score.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

export default FallBackQueueMonitor