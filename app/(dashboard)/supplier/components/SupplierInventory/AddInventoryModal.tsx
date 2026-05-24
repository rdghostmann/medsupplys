// Codebase AddInventoryModal.tsx
"use client"

import React, { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, CheckCircle2, Package } from "lucide-react"

type Product = {
  _id: string
  name: string
  category: string
  pricing?: {
    proposedPrice?: number
    commissionPercent?: number
  }
}

interface InventoryProduct {
  id: string
  productId: string
  name: string
  category: string
  basePrice: number
  stock: number
  commission: number
  finalPrice: number
  batchInfo: string
}

interface Props {
  isOpen: boolean
  onClose: () => void
  onAdd: (item: InventoryProduct) => void
  existingInventory: InventoryProduct[]
  products: Product[]
}

export const AddInventoryModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onAdd,
  existingInventory,
  products,
}) => {
  const [productId, setProductId] = useState("")
  const [basePrice, setBasePrice] = useState<number>(0)
  const [stock, setStock] = useState<number>(0)
  const [batchInfo, setBatchInfo] = useState("")

  const availableProducts = useMemo(() => {
    const used = new Set(existingInventory.map(i => i.productId))
    return products.filter(p => !used.has(p._id))
  }, [products, existingInventory])

  useEffect(() => {
    if (!isOpen) return

    const first = availableProducts[0]
    if (!first) return

    setProductId(first._id)
    setBasePrice(first.pricing?.proposedPrice || 0)
    setStock(100)

    const year = new Date().getFullYear()
    setBatchInfo(`Batch-${year}-${Math.floor(Math.random() * 9999)}`)
  }, [isOpen, availableProducts])

  const selectedProduct = useMemo(
    () => availableProducts.find(p => p._id === productId),
    [productId, availableProducts]
  )

  const commissionPercent =
    selectedProduct?.pricing?.commissionPercent || 10

  const commission = Math.round(basePrice * (commissionPercent / 100))
  const finalPrice = basePrice + commission

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProduct) return

    onAdd({
      id: crypto.randomUUID(),
      productId: selectedProduct._id,
      name: selectedProduct.name,
      category: selectedProduct.category,
      basePrice,
      stock,
      commission,
      finalPrice,
      batchInfo,
    })

    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b">
              <h2 className="font-semibold text-lg">Add Inventory Item</h2>
              <button onClick={onClose}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Product Select */}
              <div>
                <label className="text-xs font-semibold uppercase text-slate-500">
                  Select Product
                </label>

                <select
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  className="w-full mt-2 border rounded-lg p-2 text-sm"
                >
                  {availableProducts.map(p => (
                    <option key={p._id} value={p._id}>
                      {p.name} ({p.category})
                    </option>
                  ))}
                </select>
              </div>

              {/* Price + Stock */}
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  value={basePrice}
                  onChange={(e) => setBasePrice(Number(e.target.value))}
                  className="border p-2 rounded-lg text-sm"
                  placeholder="Base Price"
                />

                <input
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(Number(e.target.value))}
                  className="border p-2 rounded-lg text-sm"
                  placeholder="Stock"
                />
              </div>

              {/* Batch */}
              <input
                value={batchInfo}
                onChange={(e) => setBatchInfo(e.target.value)}
                className="w-full border p-2 rounded-lg text-sm"
                placeholder="Batch Info"
              />

              {/* Live Pricing Preview */}
              <div className="bg-slate-50 p-4 rounded-xl text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Commission ({commissionPercent}%)</span>
                  <span>₦{commission.toLocaleString()}</span>
                </div>

                <div className="flex justify-between font-bold text-blue-600">
                  <span>Final Price</span>
                  <span>₦{finalPrice.toLocaleString()}</span>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
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