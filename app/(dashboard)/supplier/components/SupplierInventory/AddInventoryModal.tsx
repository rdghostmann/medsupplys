// AddInventoryModal.tsx
"use client"

import React, { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

import type { InventoryProduct } from "@/types"

type Product = {
  _id: string
  name: string
  category: string
  unit?: string
  moq?: number
  type?: "IMPORTER" | "DISTRIBUTOR"
  pricing?: {
    proposedPrice?: number
    commissionPercent?: number
  }
}

interface Props {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  existingInventory: InventoryProduct[]
  products: Product[]
}

export const AddInventoryModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSuccess,
  existingInventory,
  products,
}) => {
  const [productId, setProductId] = useState("")
  const [basePrice, setBasePrice] = useState<number>(0)
  const [stock, setStock] = useState<number>(0)
  const [batchInfo, setBatchInfo] = useState("")

  /* =========================
     AVAILABLE PRODUCTS
  ========================= */
  const availableProducts = useMemo(() => {
    const used = new Set(existingInventory.map(i => i.productId))
    return products.filter(p => !used.has(p._id))
  }, [products, existingInventory])

  /* =========================
     SELECTED PRODUCT
  ========================= */
  const selectedProduct = useMemo(
    () => availableProducts.find(p => p._id === productId),
    [productId, availableProducts]
  )

  const commissionPercent =
    selectedProduct?.pricing?.commissionPercent ?? 10

  const commission = Math.round(basePrice * (commissionPercent / 100))
  const finalPrice = basePrice + commission

  /* =========================
     SUBMIT
  ========================= */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProduct) return

    const payload: InventoryProduct = {
      id: crypto.randomUUID(),
      productId: selectedProduct._id,
      name: selectedProduct.name,
      category: selectedProduct.category,
      basePrice,
      stock,
      commission,
      finalPrice,
      batchInfo,
      moq: selectedProduct.moq ?? 0,
      unit: selectedProduct.unit ?? "unit",
      type: selectedProduct.type ?? "DISTRIBUTOR",
    }

    // IMPORTANT: delegate persistence to parent
    onSuccess()

    // reset optional (keeps UX clean)
    setProductId("")
    setBasePrice(0)
    setStock(0)
    setBatchInfo("")

    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

          {/* BACKDROP */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* MODAL */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden z-10"
          >

            {/* HEADER */}
            <div className="flex items-center justify-between px-6 py-5 border-b">
              <h2 className="font-semibold text-lg">
                Add Inventory Item
              </h2>
              <button onClick={onClose}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">

              {/* PRODUCT SELECT */}
              <div>
                <label className="text-xs font-semibold uppercase text-slate-500">
                  Select Product from Catalog
                </label>

                <select
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  className="w-full mt-2 border rounded-lg p-2 text-sm"
                >
                  <option value="">Select product</option>
                  {availableProducts.map(p => (
                    <option key={p._id} value={p._id}>
                      {p.name} ({p.category})
                    </option>
                  ))}
                </select>
              </div>

              {/* PRICE + STOCK */}
              <div className="grid grid-cols-2 gap-4">

                {/* BASE PRICE */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-2">
                    Base Price (₦)
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={basePrice}
                    onChange={(e) => setBasePrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 border rounded-lg text-sm font-mono font-bold"
                    required
                  />
                </div>

                {/* STOCK */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-2">
                    Stock Quantity
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 border rounded-lg text-sm font-mono font-bold"
                    required
                  />
                </div>
              </div>

              {/* BATCH INFO */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-2">
                  Batch / Expiry Info
                </label>

                <input
                  type="text"
                  value={batchInfo}
                  onChange={(e) => setBatchInfo(e.target.value)}
                  className="w-full px-3.5 py-2.5 border rounded-lg text-sm font-medium"
                  required
                />
              </div>

              {/* LIVE PREVIEW */}
              {basePrice > 0 && (
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-xs space-y-2">

                  <div className="flex justify-between">
                    <span>Commission ({commissionPercent}%)</span>
                    <span className="font-mono">
                      ₦{commission.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between font-bold text-blue-700">
                    <span>Final Price</span>
                    <span className="font-mono">
                      ₦{finalPrice.toLocaleString()}
                    </span>
                  </div>

                </div>
              )}

              {/* SUBMIT */}
              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg"
              >
                Add Inventory
              </button>

            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}