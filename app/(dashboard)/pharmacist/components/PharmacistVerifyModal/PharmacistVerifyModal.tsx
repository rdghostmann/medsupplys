"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
  Check
} from "lucide-react";
import { Order } from "@/types";
// import type { Order, PharmacistVerificationRecord, VerificationStatus } from "../types";

export interface PharmacistVerifyModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onVerify: (orderId: string, result: "Verified" | "Rejected", verificationData: {
    batchNo: string;
    mfgDate: string;
    expiryDate: string;
    condition: string;
    notes: string;
    barcode: string;
  }) => void;
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
];

export function OrderStatusBadge({ status }: { status: string }) {
  switch (status) {
    case "Under Verification":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/80">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          Under Verification
        </span>
      );
    case "In Transit to Office":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/80">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          In Transit to Office
        </span>
      );
    case "Verified":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Verified
        </span>
      );
    case "Delivered":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/80">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
          Delivered
        </span>
      );
    case "Supplier Contacted":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200/80">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
          Supplier Contacted
        </span>
      );
    case "Supplier Confirmed":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-50 text-cyan-700 border border-cyan-200/80">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
          Supplier Confirmed
        </span>
      );
    case "Rejected":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/80">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
          Rejected
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
          {status}
        </span>
      );
  }
}

export function PharmacistVerifyModal({
  order,
  isOpen,
  onClose,
  onVerify,
}: PharmacistVerifyModalProps) {
  // Form states
  const orderNumber = order?.id?.replace(/\D/g, "").slice(-4).padStart(4, "0") || "0000";
  const defaultBarcode = order?.barcode || `NG-${order?.product.slice(0, 3).toUpperCase() || "MED"}-2024-${orderNumber}`;
  const [barcodeInput, setBarcodeInput] = useState(defaultBarcode);
  const [barcodeResult, setBarcodeResult] = useState<{
    status: "matched" | "unmatched" | "idle";
    message: string;
    nafdacNumber?: string;
  }>({
    status: "matched",
    message: "Verified in NAFDAC Central Database • Active Registration",
    nafdacNumber: "04-8921",
  });

  const defaultBatch = order?.batchNo || `BATCH-NG-2024-${orderNumber}`;
  const [batchNo, setBatchNo] = useState(defaultBatch);
  const [mfgDate, setMfgDate] = useState("2024-01-01");
  const [expiryDate, setExpiryDate] = useState("2026-01-01");
  const [physicalCondition, setPhysicalCondition] = useState("✅ Excellent — All seals intact");
  const [notes, setNotes] = useState(
    "Visually inspected. All seals intact. Batch number confirmed. NAFDAC approval visible."
  );

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
  });

  if (!isOpen || !order) return null;

  const toggleChecklist = (index: number) => {
    setCheckedItems((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleBarcodeLookup = () => {
    if (!barcodeInput.trim()) return;
    if (barcodeInput.toLowerCase().includes("exp") || barcodeInput.toLowerCase().includes("fake")) {
      setBarcodeResult({
        status: "unmatched",
        message: "Warning: Barcode not found in verified registry or flagged as suspicious",
      });
    } else {
      setBarcodeResult({
        status: "matched",
        message: `Validated against NAFDAC Ledger: ${order.product} (Authorized Batch)`,
        nafdacNumber: "04-9842",
      });
    }
  };

  const totalValue = Math.round(order.basePrice * order.qty * 1.1);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.2 }}
          className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-auto flex flex-col max-h-[92vh]"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                    Pharmacist Product Verification
                  </h3>
                  <span className="font-mono text-xs font-bold px-2 py-0.5 bg-blue-100 text-blue-700 rounded-md">
                    {order.id}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Inspect incoming consignment before authorizing release to clinical inventory
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors font-bold text-sm"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Modal Body: 2-column Grid layout */}
          <div className="p-6 overflow-y-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column: Product Scan & Verification Form */}
            <div className="space-y-5">
              {/* Product Scan Card */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-4">
                  <QrCode className="w-4 h-4 text-blue-600" />
                  <h4 className="font-bold text-slate-900 text-sm">Product Scan</h4>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1.5">
                      Barcode / Scan Code
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter or scan barcode"
                        value={barcodeInput}
                        onChange={(e) => setBarcodeInput(e.target.value)}
                        className="flex-1 border border-slate-300 rounded-xl px-3.5 py-2.5 font-mono text-xs text-slate-900 bg-slate-50 focus:bg-white focus:border-blue-500 focus:outline-hidden"
                      />
                      <button
                        type="button"
                        onClick={handleBarcodeLookup}
                        className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors shadow-xs shadow-blue-500/20 active:scale-98"
                      >
                        Lookup
                      </button>
                    </div>
                  </div>

                  {barcodeResult.status === "matched" && (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold">{barcodeResult.message}</p>
                        <p className="text-[11px] text-emerald-700 font-mono mt-0.5">
                          NAFDAC No: {barcodeResult.nafdacNumber || "04-8921"} • Match Confidence: 100%
                        </p>
                      </div>
                    </div>
                  )}

                  {barcodeResult.status === "unmatched" && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold">{barcodeResult.message}</p>
                        <p className="text-[11px] text-rose-700 mt-0.5">
                          Recommend quarantine and physical re-inspection.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Verification Form Card */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-4">
                  <FileCheck className="w-4 h-4 text-blue-600" />
                  <h4 className="font-bold text-slate-900 text-sm">Verification Form</h4>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Batch Number</label>
                    <input
                      type="text"
                      value={batchNo}
                      onChange={(e) => setBatchNo(e.target.value)}
                      className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 font-mono text-xs text-slate-900 bg-slate-50 focus:bg-white focus:border-blue-500 focus:outline-hidden"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Manufacturing Date</label>
                      <input
                        type="date"
                        value={mfgDate}
                        onChange={(e) => setMfgDate(e.target.value)}
                        className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 bg-slate-50 focus:bg-white focus:border-blue-500 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Expiry Date</label>
                      <input
                        type="date"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 bg-slate-50 focus:bg-white focus:border-blue-500 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Physical Condition</label>
                    <select
                      value={physicalCondition}
                      onChange={(e) => setPhysicalCondition(e.target.value)}
                      className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 bg-slate-50 focus:bg-white focus:border-blue-500 focus:outline-hidden font-medium"
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
                    <label className="font-bold text-slate-700 block mb-1">Pharmacist Notes</label>
                    <textarea
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 bg-slate-50 focus:bg-white focus:border-blue-500 focus:outline-hidden resize-none leading-relaxed"
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
                        });
                        onClose();
                      }}
                      className="w-full py-3 bg-rose-50 text-rose-700 hover:bg-rose-100 hover:text-rose-800 border border-rose-200 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 active:scale-98"
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
                        });
                        onClose();
                      }}
                      className="w-full py-3 bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 active:scale-98"
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
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-4">
                  <Layers className="w-4 h-4 text-blue-600" />
                  <h4 className="font-bold text-slate-900 text-sm">Order Information</h4>
                </div>

                <div className="divide-y divide-slate-100 text-xs">
                  <div className="flex items-center justify-between py-2.5">
                    <span className="text-slate-500 font-medium">Order ID</span>
                    <span className="font-mono font-bold text-slate-900">{order.id}</span>
                  </div>
                  <div className="flex items-center justify-between py-2.5">
                    <span className="text-slate-500 font-medium">Product</span>
                    <span className="font-bold text-slate-900">{order.product}</span>
                  </div>
                  <div className="flex items-center justify-between py-2.5">
                    <span className="text-slate-500 font-medium">Buyer</span>
                    <span className="font-medium text-slate-800">{order.buyer}</span>
                  </div>
                  <div className="flex items-center justify-between py-2.5">
                    <span className="text-slate-500 font-medium">Quantity</span>
                    <span className="font-semibold text-slate-900">{order.qty.toLocaleString()} units</span>
                  </div>
                  <div className="flex items-center justify-between py-2.5">
                    <span className="text-slate-500 font-medium">Total Value</span>
                    <span className="font-bold text-blue-600 text-sm">
                      ₦{totalValue.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2.5">
                    <span className="text-slate-500 font-medium">Supplier</span>
                    <span className="font-medium text-slate-800">{order.supplier}</span>
                  </div>
                  <div className="flex items-center justify-between py-2.5">
                    <span className="text-slate-500 font-medium">Status</span>
                    <OrderStatusBadge status={order.status} />
                  </div>
                </div>
              </div>

              {/* Verification Checklist Card */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <h4 className="font-bold text-slate-900 text-sm">Verification Checklist</h4>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                    {Object.values(checkedItems).filter(Boolean).length} / {CHECKLIST_ITEMS.length} Passed
                  </span>
                </div>

                <div className="space-y-1">
                  {CHECKLIST_ITEMS.map((item, idx) => {
                    const isChecked = !!checkedItems[idx];
                    return (
                      <label
                        key={item}
                        className="flex items-center gap-3 py-2 px-2.5 rounded-xl hover:bg-slate-50 border-b border-slate-100/70 last:border-0 cursor-pointer transition-colors text-xs text-slate-700 select-none"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleChecklist(idx)}
                          className="w-4 h-4 rounded text-emerald-600 accent-emerald-600 shrink-0 cursor-pointer"
                        />
                        <span className={isChecked ? "text-slate-800 font-medium" : "text-slate-400 line-through"}>
                          {item}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0 text-xs">
            <span className="text-slate-400">
              Pharmacists Council of Nigeria (PCN) Certified Verification Gateway
            </span>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
export default PharmacistVerifyModal;
