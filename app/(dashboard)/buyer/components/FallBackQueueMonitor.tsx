// FallBackQueueMonitor.tsx

"use client"

import React from "react"
import { motion } from "framer-motion"

import type { Order } from "@/types"
import type { CurrentBuyerProcurement } from "@/controllers/buyer.actions"
import Link from "next/link"

interface FallBackQueueMonitorProps {
  queue?: CurrentBuyerProcurement[]
  orders?: Order[]
  hasQueue?: boolean
  loading?: boolean
  onViewQueue?: () => void
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

const formatCurrency = (value: number) =>
  `₦${Number(value || 0).toLocaleString("en-NG")}`

const procurementStatusLabel = (status: string) => status.replace(/_/g, " ")

/* -------------------------------------------------------------------------- */
/* Mock Fallback Queue                                                        */
/* -------------------------------------------------------------------------- */

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
    const displayQueue = queue ?? []

    const activeProcurements = displayQueue.filter((procurement) => {
      const status = procurement.status.toUpperCase()

      return ![
        "COMPLETED",
        "REJECTED",
        "CANCELLED",
        "EXPIRED",
      ].includes(status)
    })

    void mockOrders
    void orders
    void hasQueue

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

                <h2 className="font-display text-xs **:md:text-sm font-bold uppercase tracking-wider text-slate-900">
                  Live Procurement Sourcing & Fallback Queue (
                  {activeProcurements.length}
                  )
                </h2>
              </div>

              <button
                type="button"
                onClick={onViewQueue}
                className="hidden shrink-0 cursor-pointer text-xs font-semibold text-blue-600 hover:underline"
              >
                Full Queue Details →
              </button>

              <Link
                href="/buyer/procurement-sourcing"
                className="shrink-0 cursor-pointer text-xs font-semibold text-blue-600 hover:underline"
              >
                Full Queue Details →
              </Link>
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

                      <p className="mt-1 text-[10px] md:text-xs text-slate-600">
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
                          <span className="hidden text-slate-400">
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