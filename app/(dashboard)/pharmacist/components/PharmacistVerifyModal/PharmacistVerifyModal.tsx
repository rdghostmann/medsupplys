"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  X,
  ShieldCheck,
  QrCode,
  CheckCircle2,
  XCircle,
  FileCheck,
  Building2,
  Truck,
  Sparkles,
  Calendar,
  Layers,
  Check,
} from "lucide-react"
import { Order } from "@/types"
// import type { Order, PharmacistVerificationRecord, VerificationStatus } from "../types";

export interface PharmacistVerifyModalProps {
  order: Order | null
  isOpen: boolean
  onClose: () => void
  onVerify: (
    orderId: string,
    result: "Verified" | "Rejected",
    verificationData: {
      batchNo: string
      mfgDate: string
      expiryDate: string
      condition: string
      notes: string
      barcode: string
    }
  ) => void
}

const CHECKLIST_ITEMS = [
  "Package seal intact",
  "Batch number matches documentation",
  "Expiry date valid (> 6 months remaining)",
  "Storage requirements met on delivery",
  "Quantity matches order exactly",
  "NAFDAC approval label visible",
  "No signs of tampering or counterfeiting",
  "Temperature-sensitive items within range",
]

export function OrderStatusBadge({ status }: { status: string }) {
  switch (status) {
    case "Under Verification":
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-amber-200/80 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />
          Under Verification
        </span>
      )
    case "In Transit to Office":
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-blue-200/80 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
          In Transit to Office
        </span>
      )
    case "Verified":
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200/80 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Verified
        </span>
      )
    case "Delivered":
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-indigo-200/80 bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
          Delivered
        </span>
      )
    case "Supplier Contacted":
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-purple-200/80 bg-purple-50 px-2.5 py-1 text-xs font-semibold text-purple-700">
          <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
          Supplier Contacted
        </span>
      )
    case "Supplier Confirmed":
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-cyan-200/80 bg-cyan-50 px-2.5 py-1 text-xs font-semibold text-cyan-700">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
          Supplier Confirmed
        </span>
      )
    case "Rejected":
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-rose-200/80 bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
          Rejected
        </span>
      )
    default:
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
          <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
          {status}
        </span>
      )
  }
}

export function PharmacistVerifyModal({
  order,
  isOpen,
  onClose,
  onVerify,
}: PharmacistVerifyModalProps) {
  // Form states
  const orderNumber =
    order?.id?.replace(/\D/g, "").slice(-4).padStart(4, "0") || "0000"
  const defaultBarcode =
    order?.barcode ||
    `NG-${order?.product.slice(0, 3).toUpperCase() || "MED"}-2024-${orderNumber}`
  const [barcodeInput, setBarcodeInput] = useState(defaultBarcode)
  const [barcodeResult, setBarcodeResult] = useState<{
    status: "matched" | "unmatched" | "idle"
    message: string
    nafdacNumber?: string
  }>({
    status: "matched",
    message: "Verified in NAFDAC Central Database • Active Registration",
    nafdacNumber: "04-8921",
  })

  const defaultBatch = order?.batchNo || `BATCH-NG-2024-${orderNumber}`
  const [batchNo, setBatchNo] = useState(defaultBatch)
  const [mfgDate, setMfgDate] = useState("2024-01-01")
  const [expiryDate, setExpiryDate] = useState("2026-01-01")
  const [physicalCondition, setPhysicalCondition] = useState(
    "✅ Excellent — All seals intact"
  )
  const [notes, setNotes] = useState(
    "Visually inspected. All seals intact. Batch number confirmed. NAFDAC approval visible."
  )

  // Checklists state
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({
    0: true,
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
    6: true,
    7: true,
  })

  if (!isOpen || !order) return null

  const toggleChecklist = (index: number) => {
    setCheckedItems((prev) => ({ ...prev, [index]: !prev[index] }))
  }

  const handleBarcodeLookup = () => {
    if (!barcodeInput.trim()) return
    if (
      barcodeInput.toLowerCase().includes("exp") ||
      barcodeInput.toLowerCase().includes("fake")
    ) {
      setBarcodeResult({
        status: "unmatched",
        message:
          "Warning: Barcode not found in verified registry or flagged as suspicious",
      })
    } else {
      setBarcodeResult({
        status: "matched",
        message: `Validated against NAFDAC Ledger: ${order.product} (Authorized Batch)`,
        nafdacNumber: "04-9842",
      })
    }
  }

  const totalValue = Math.round(order.basePrice * order.qty * 1.1)

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/60 p-3 backdrop-blur-xs sm:p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.2 }}
          className="my-auto flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-2xl"
        >
          {/* Header */}
          <div className="flex shrink-0 items-center justify-between border-b border-slate-100 bg-slate-50/70 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-bold text-white shadow-md shadow-blue-500/20">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-extrabold text-slate-900 sm:text-lg">
                    Pharmacist Product Verification
                  </h3>
                  <span className="rounded-md bg-blue-100 px-2 py-0.5 font-mono text-xs font-bold text-blue-700">
                    {order.id}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Inspect incoming consignment before authorizing release to
                  clinical inventory
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200/70 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-200"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Modal Body: 2-column Grid layout */}
          <div className="grid grid-cols-1 gap-6 overflow-y-auto p-6 lg:grid-cols-2">
            {/* Left Column: Product Scan & Verification Form */}
            <div className="space-y-5">
              {/* Product Scan Card */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
                  <QrCode className="h-4 w-4 text-blue-600" />
                  <h4 className="text-sm font-bold text-slate-900">
                    Product Scan
                  </h4>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="mb-1.5 block font-bold text-slate-700">
                      Barcode / Scan Code
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter or scan barcode"
                        value={barcodeInput}
                        onChange={(e) => setBarcodeInput(e.target.value)}
                        className="flex-1 rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 font-mono text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-hidden"
                      />
                      <button
                        type="button"
                        onClick={handleBarcodeLookup}
                        className="rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs shadow-blue-500/20 transition-colors hover:bg-blue-700 active:scale-98"
                      >
                        Lookup
                      </button>
                    </div>
                  </div>

                  {barcodeResult.status === "matched" && (
                    <div className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-emerald-800">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                      <div>
                        <p className="font-bold">{barcodeResult.message}</p>
                        <p className="mt-0.5 font-mono text-[11px] text-emerald-700">
                          NAFDAC No: {barcodeResult.nafdacNumber || "04-8921"} •
                          Match Confidence: 100%
                        </p>
                      </div>
                    </div>
                  )}

                  {barcodeResult.status === "unmatched" && (
                    <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-rose-800">
                      <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
                      <div>
                        <p className="font-bold">{barcodeResult.message}</p>
                        <p className="mt-0.5 text-[11px] text-rose-700">
                          Recommend quarantine and physical re-inspection.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Verification Form Card */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
                  <FileCheck className="h-4 w-4 text-blue-600" />
                  <h4 className="text-sm font-bold text-slate-900">
                    Verification Form
                  </h4>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="mb-1 block font-bold text-slate-700">
                      Batch Number
                    </label>
                    <input
                      type="text"
                      value={batchNo}
                      onChange={(e) => setBatchNo(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 font-mono text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-hidden"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1 block font-bold text-slate-700">
                        Manufacturing Date
                      </label>
                      <input
                        type="date"
                        value={mfgDate}
                        onChange={(e) => setMfgDate(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block font-bold text-slate-700">
                        Expiry Date
                      </label>
                      <input
                        type="date"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block font-bold text-slate-700">
                      Physical Condition
                    </label>
                    <select
                      value={physicalCondition}
                      onChange={(e) => setPhysicalCondition(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-xs font-medium text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-hidden"
                    >
                      <option value="✅ Excellent — All seals intact">
                        ✅ Excellent — All seals intact
                      </option>
                      <option value="⚠️ Acceptable — Minor packaging issue">
                        ⚠️ Acceptable — Minor packaging issue
                      </option>
                      <option value="❌ Poor — Damaged or tampered">
                        ❌ Poor — Damaged or tampered
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block font-bold text-slate-700">
                      Pharmacist Notes
                    </label>
                    <textarea
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full resize-none rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs leading-relaxed text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-hidden"
                    />
                  </div>

                  {/* Verification Actions */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        onVerify(order.id, "Rejected", {
                          batchNo,
                          mfgDate,
                          expiryDate,
                          condition: physicalCondition,
                          notes,
                          barcode: barcodeInput,
                        })
                        onClose()
                      }}
                      className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 py-3 text-xs font-bold text-rose-700 transition-all hover:bg-rose-100 hover:text-rose-800 active:scale-98"
                    >
                      ❌ Reject Product
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onVerify(order.id, "Verified", {
                          batchNo,
                          mfgDate,
                          expiryDate,
                          condition: physicalCondition,
                          notes,
                          barcode: barcodeInput,
                        })
                        onClose()
                      }}
                      className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white shadow-md shadow-emerald-600/20 transition-all hover:bg-emerald-700 active:scale-98"
                    >
                      ✅ Verify & Release
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Order Information & Verification Checklist */}
            <div className="space-y-5">
              {/* Order Information Card */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Layers className="h-4 w-4 text-blue-600" />
                  <h4 className="text-sm font-bold text-slate-900">
                    Order Information
                  </h4>
                </div>

                <div className="divide-y divide-slate-100 text-xs">
                  <div className="flex items-center justify-between py-2.5">
                    <span className="font-medium text-slate-500">Order ID</span>
                    <span className="font-mono font-bold text-slate-900">
                      {order.id}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2.5">
                    <span className="font-medium text-slate-500">Product</span>
                    <span className="font-bold text-slate-900">
                      {order.product}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2.5">
                    <span className="font-medium text-slate-500">Buyer</span>
                    <span className="font-medium text-slate-800">
                      {order.buyer}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2.5">
                    <span className="font-medium text-slate-500">Quantity</span>
                    <span className="font-semibold text-slate-900">
                      {order.qty.toLocaleString()} units
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2.5">
                    <span className="font-medium text-slate-500">
                      Total Value
                    </span>
                    <span className="text-sm font-bold text-blue-600">
                      ₦{totalValue.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2.5">
                    <span className="font-medium text-slate-500">Supplier</span>
                    <span className="font-medium text-slate-800">
                      {order.supplier}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2.5">
                    <span className="font-medium text-slate-500">Status</span>
                    <OrderStatusBadge status={order.status} />
                  </div>
                </div>
              </div>

              {/* Verification Checklist Card */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    <h4 className="text-sm font-bold text-slate-900">
                      Verification Checklist
                    </h4>
                  </div>
                  <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-600">
                    {Object.values(checkedItems).filter(Boolean).length} /{" "}
                    {CHECKLIST_ITEMS.length} Passed
                  </span>
                </div>

                <div className="space-y-1">
                  {CHECKLIST_ITEMS.map((item, idx) => {
                    const isChecked = !!checkedItems[idx]
                    return (
                      <label
                        key={item}
                        className="flex cursor-pointer items-center gap-3 rounded-xl border-b border-slate-100/70 px-2.5 py-2 text-xs text-slate-700 transition-colors select-none last:border-0 hover:bg-slate-50"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleChecklist(idx)}
                          className="h-4 w-4 shrink-0 cursor-pointer rounded text-emerald-600 accent-emerald-600"
                        />
                        <span
                          className={
                            isChecked
                              ? "font-medium text-slate-800"
                              : "text-slate-400 line-through"
                          }
                        >
                          {item}
                        </span>
                      </label>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex shrink-0 items-center justify-between border-t border-slate-100 bg-slate-50 px-6 py-4 text-xs">
            <span className="text-slate-400">
              Pharmacists Council of Nigeria (PCN) Certified Verification
              Gateway
            </span>
            <button
              onClick={onClose}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-700 transition-colors hover:bg-slate-100"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
export default PharmacistVerifyModal
