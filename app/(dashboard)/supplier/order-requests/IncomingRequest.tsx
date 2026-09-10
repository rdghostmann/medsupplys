// IncomingRequest.tsx
"use client"

import React, { useMemo, useState } from "react"
import { Sparkles, CheckCircle2, AlertTriangle } from "lucide-react"
import { toast } from "sonner"
import type {
  CurrentSupplierUser,
  IncomingProcurementRequest,
} from "@/controllers/supplier.action"
import { respondToSupplierProcurement } from "@/controllers/supplier.action"
type ResponseType = "ACCEPT" | "REJECT" | "UNAVAILABLE"

interface IncomingRequestsProps {
  user: CurrentSupplierUser
  procurements: IncomingProcurementRequest[]
}

const IncomingRequests: React.FC<IncomingRequestsProps> = ({
  user,
  procurements,
}) => {
  const [responseNotes, setResponseNotes] = useState<Record<string, string>>({})

  const [isProcessing, setIsProcessing] = useState<string | null>(null)

  const [respondedProcurementIds, setRespondedProcurementIds] = useState<
    Set<string>
  >(() => new Set())

  // Filter procurements where this supplier is the CURRENT ACTIVE
  // candidate in the sourcing queue.
  const pendingRequests = useMemo(() => {
    return procurements.filter(
      (procurement) =>
        procurement.currentSupplierId === user.id &&
        !respondedProcurementIds.has(procurement.id)
    )
  }, [procurements, respondedProcurementIds, user.id])

  const handleRespond = async (
    procurementId: string,
    response: ResponseType
  ) => {
    const procurement = procurements.find((p) => p.id === procurementId)

    if (!procurement) {
      toast.error("Procurement request not found")
      return
    }

    setIsProcessing(procurementId)

    try {
      const note = responseNotes[procurementId]?.trim()
      const result = await respondToSupplierProcurement(
        procurementId,
        response === "ACCEPT" ? "ACCEPT" : "UNAVAILABLE",
        note
      )

      setRespondedProcurementIds((current) => {
        const next = new Set(current)
        next.add(procurementId)
        return next
      })

      if (response === "ACCEPT") {
        toast.success("Procurement Request Accepted", {
          description: `Committed to Order #${procurement.procurementNumber}. Ready for Pharmacist verification.`,
        })

        if (note) {
          toast.info("Fulfillment remark recorded", {
            description: note,
          })
        }
      } else {
        if (result.nextSupplierName) {
          toast.info("Stock Unavailable — Fallback Triggered", {
            description: `The sourcing engine has forwarded the request to ${result.nextSupplierName}, ranked #${result.nextSupplierRank}.`,
          })
        } else {
          toast.warning("No Additional Supplier Available", {
            description:
              "The fallback queue has been exhausted. Buyer action is required.",
          })
        }
      }

      setResponseNotes((current) => ({
        ...current,
        [procurementId]: "",
      }))
    } catch {
      toast.error("Response failed", {
        description:
          "Unable to process the procurement response. Please try again.",
      })
    } finally {
      setIsProcessing(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-xl font-bold text-slate-900">
            Incoming Procurement RFQs & Sourcing Requests
          </h1>

          <p className="mt-0.5 text-xs text-slate-500">
            Real-time procurement requests routed to you based on stock, tier
            score, and pricing
          </p>
        </div>
      </div>

      {pendingRequests.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
          <Sparkles className="mx-auto mb-3 h-12 w-12 text-slate-300" />

          <h3 className="text-sm font-bold text-slate-800">
            No Pending RFQs for Your Account
          </h3>

          <p className="mx-auto mt-1 max-w-sm text-xs text-slate-500">
            You are currently up to date. Sourcing requests will alert you
            immediately when matching your catalogue listings.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingRequests.map((proc) => {
            const isSubmitting = isProcessing === proc.id

            const activeSupplier = proc.supplierQueue[proc.currentSupplierIndex]

            return (
              <div
                key={proc.id}
                className="space-y-4 rounded-2xl border-2 border-blue-400 bg-white p-6 shadow-md shadow-blue-500/10"
              >
                <div className="flex flex-col justify-between gap-3 border-b border-slate-100 pb-4 lg:flex-row lg:items-center">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-display text-base font-bold text-slate-900">
                        {proc.productName}
                      </span>

                      <span className="rounded bg-slate-900 px-2 py-0.5 font-mono text-xs font-bold text-white">
                        #{proc.procurementNumber}
                      </span>

                      <span className="animate-pulse rounded bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800">
                        ACTION REQUIRED
                      </span>
                    </div>

                    <div className="mt-1 flex flex-col gap-1 text-xs text-slate-600 lg:flex-row lg:items-center lg:gap-3">
                      <span>
                        Buyer:{" "}
                        <strong className="text-slate-900">
                          {proc.buyerName}
                        </strong>
                      </span>

                      <span className="hidden lg:inline">•</span>

                      <span>
                        Delivery:{" "}
                        <strong className="text-slate-900">
                          {proc.deliveryAddress}
                        </strong>
                      </span>
                    </div>
                  </div>

                  <div className="text-left lg:text-right">
                    <div className="text-xs text-slate-500">
                      Requested Volume
                    </div>

                    <div className="font-mono text-lg font-bold text-slate-900">
                      {proc.quantity.toLocaleString()} {proc.unit}
                    </div>
                  </div>
                </div>

                {/* Financial Value */}
                <div className="grid grid-cols-1 gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs sm:grid-cols-3 lg:grid-cols-3">
                  <div>
                    <span className="block text-slate-500">
                      Unit Selling Price:
                    </span>

                    <span className="font-mono text-sm font-bold text-slate-900">
                      ₦{activeSupplier?.unitPrice.toLocaleString() || "0"}
                    </span>
                  </div>

                  <div>
                    <span className="block text-slate-500">
                      Gross Procurement Value:
                    </span>

                    <span className="font-mono text-sm font-bold text-blue-700">
                      ₦{activeSupplier?.totalPrice.toLocaleString() || "0"}
                    </span>
                  </div>

                  <div className="">
                    <span className="block text-slate-500">
                      Buyer Payment Status:
                    </span>

                    <span className="font-semibold text-emerald-700">
                      ✓ Funds Escrowed
                      {/* (
                      {proc.paymentMethod.replace(
                        "_",
                        " + "
                      )}
                      ) */}
                    </span>
                  </div>
                </div>

                {/* Current Queue Context */}
                <div className="hidden rounded-xl border border-blue-100 bg-blue-50/60 p-3">
                  <div className="flex flex-wrap items-center gap-2 text-[11px]">
                    <span className="font-semibold text-slate-500">
                      Current sourcing position:
                    </span>

                    <span className="font-bold text-blue-700">
                      Rank #{activeSupplier?.rank}
                    </span>

                    <span className="text-slate-400">•</span>

                    <span className="font-semibold text-slate-900">
                      {activeSupplier?.supplierName}
                    </span>

                    <span className="text-slate-400">•</span>

                    <span className="text-slate-600">
                      Stock:{" "}
                      <strong>{activeSupplier?.stock.toLocaleString()}</strong>
                    </span>
                  </div>
                </div>

                {/* Response Note input */}
                <div>
                  <label className="mb-1 block text-[11px] font-bold tracking-wider text-slate-700 uppercase">
                    Response Note / Fulfillment Dispatch Remark
                  </label>

                  <input
                    type="text"
                    placeholder="e.g. Batch BATCH-2025-01 ready for cold chain dispatch from Ikeja Warehouse"
                    value={responseNotes[proc.id] || ""}
                    onChange={(e) =>
                      setResponseNotes((current) => ({
                        ...current,
                        [proc.id]: e.target.value,
                      }))
                    }
                    disabled={isSubmitting}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500/20 focus:outline-none disabled:cursor-not-allowed disabled:bg-slate-50"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    disabled={isSubmitting}
                    onClick={() => handleRespond(proc.id, "UNAVAILABLE")}
                    className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 px-4 py-2 text-xs font-semibold text-amber-800 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Reject Order
                  </button>

                  <button
                    disabled={isSubmitting}
                    onClick={() => handleRespond(proc.id, "ACCEPT")}
                    className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-emerald-600 px-6 py-2 text-xs font-bold text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <CheckCircle2 className="h-4 w-4" />

                    <span>
                      {isSubmitting ? "Processing..." : "Accept Order"}
                    </span>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default IncomingRequests
