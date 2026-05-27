// EditInventoryModal.tsx
"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

import type { InventoryProduct } from "@/types"

interface Props {
  editingProduct: InventoryProduct | null
  onClose: () => void
  onSaved: () => void
}

// =========================================================
// STATE FACTORY (NO EFFECTS REQUIRED)
// =========================================================
const createInitialForm = (product: InventoryProduct | null) => {
  if (!product) {
    return {
      basePrice: 0,
      stock: 0,
      batchNumber: "",
      expiryDate: "",
      manufacturingDate: "",
    }
  }

  return {
    basePrice: product.basePrice ?? 0,
    stock: product.stock ?? 0,
    batchNumber: product.batchInfo?.batchNumber ?? "",
    expiryDate: product.batchInfo?.expiryDate
      ? new Date(product.batchInfo.expiryDate).toISOString().split("T")[0]
      : "",
    manufacturingDate: product.batchInfo?.manufacturingDate
      ? new Date(product.batchInfo.manufacturingDate)
        .toISOString()
        .split("T")[0]
      : "",
  }
}

export default function EditInventoryModal({
  editingProduct,
  onClose,
  onSaved,
}: Props) {
  // =========================================================
  // FORM STATE (INITIALIZED FROM PROP ON MOUNT ONLY)
  // =========================================================
  const [form, setForm] = useState(() =>
    createInitialForm(editingProduct)
  )

  // =========================================================
  // DERIVED PRICING
  // =========================================================
  const commissionPercent = 10
  const commission = Math.round(form.basePrice * (commissionPercent / 100))
  const finalPrice = form.basePrice + commission

  // =========================================================
  // SUBMIT HANDLER
  // =========================================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProduct) return

    try {
      await fetch(`/api/inventory/${editingProduct.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          basePrice: form.basePrice,
          stock: form.stock,
          batchInfo: {
            batchNumber: form.batchNumber,
            expiryDate: form.expiryDate
              ? new Date(form.expiryDate)
              : undefined,
            manufacturingDate: form.manufacturingDate
              ? new Date(form.manufacturingDate)
              : undefined,
          },
          commission,
          finalPrice,
        }),
      })

      onSaved()
      onClose()
    } catch (err) {
      console.error("Update failed:", err)
    }
  }

  return (
    <AnimatePresence>
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* BACKDROP */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
          />

          {/* MODAL */}
          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 16 }}
            transition={{ type: "spring", duration: 0.35, bounce: 0.15 }}
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10"
          >
            {/* HEADER */}
            <div className="flex items-center justify-between px-6 py-5 border-b">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Edit Product
                </h3>
                <p className="text-xs text-slate-400">
                  Updating {editingProduct.name}
                </p>
              </div>

              <button onClick={onClose}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">

              {/* LOCKED INFO */}
              <div className="bg-slate-50 border rounded-xl p-3 text-xs text-slate-600">
                <div className="font-bold text-slate-700 mb-2">
                  Locked Parameters
                </div>

                <div>
                  MOQ: {editingProduct.moq} {editingProduct.unit}s
                </div>
                <div>Commission: 10% fixed</div>
              </div>

              {/* INPUTS */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-600">
                    Base Price
                  </label>
                  <input
                    type="number"
                    value={form.basePrice}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        basePrice: Number(e.target.value),
                      }))
                    }
                    className="w-full mt-2 px-3 py-2 border rounded-lg font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600">
                    Stock
                  </label>
                  <input
                    type="number"
                    value={form.stock}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        stock: Number(e.target.value),
                      }))
                    }
                    className="w-full mt-2 px-3 py-2 border rounded-lg font-mono"
                  />
                </div>
              </div>

              {/* BATCH */}
              <div className="grid gap-3">
                <input
                  type="text"
                  placeholder="Batch Number"
                  value={form.batchNumber}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      batchNumber: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                />

                <input
                  type="date"
                  value={form.expiryDate}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      expiryDate: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                />

                <input
                  type="date"
                  value={form.manufacturingDate}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      manufacturingDate: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              {/* PRICE PREVIEW */}
              <div className="bg-blue-50 border rounded-xl p-4 text-xs">
                <div className="flex justify-between">
                  <span>Base</span>
                  <span>₦{form.basePrice.toLocaleString()}</span>
                </div>

                <div className="flex justify-between">
                  <span>Commission (10%)</span>
                  <span>₦{commission.toLocaleString()}</span>
                </div>

                <div className="border-t my-2" />

                <div className="flex justify-between font-bold text-blue-700">
                  <span>Final</span>
                  <span>₦{finalPrice.toLocaleString()}</span>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2 bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 py-2 bg-blue-600 text-white rounded-lg"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}