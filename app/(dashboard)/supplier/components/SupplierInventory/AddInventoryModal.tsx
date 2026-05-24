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
                  Select Product from Catalog
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
                    {/* Base Price Field */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Base Price (₦)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      placeholder="e.g. 15000"
                      onChange={(e) => setBasePrice(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 border border-slate-250 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 rounded-lg text-sm transition-all font-mono font-bold"
                      required
                    />
                  </div>
                </div>

               
                {/* Stock level Quantity Field */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 500"
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 border border-slate-250 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 rounded-lg text-sm transition-all font-mono font-bold animate-none"
                    required
                  />
                </div>

              </div>
              

               {/* Batch and Expiry Expiration metadata */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Batch / Expiry Info
                </label>
                <input
                  type="text"
                  placeholder="Batch B-2024-04, Exp: Jun 2026"
               value="Batch B-2024-04, Exp: Jun 2026"
                onChange={(e) => setBatchInfo(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-250 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 rounded-lg text-sm text-slate-800 font-medium"
                  required
                />
                <p className="text-[10px] text-slate-400 mt-1.5 leading-normal">
                  Batch number and expiration details are registered onto regulatory drug logs automatically.
                </p>
              </div>

              {/* Live Pricing Preview */}
                {basePrice !== '' && Number(basePrice) > 0 && (
                <div className="bg-blue-50/80 border border-blue-100 rounded-xl p-4 text-xs font-medium text-blue-800 space-y-1.5 leading-snug">
                  <div className="flex justify-between items-center text-blue-700">
                    <span>Platform Commission Rate:</span>
                    <span className="font-bold font-mono">10%</span>
                  </div>
                  <div className="flex justify-between items-center text-blue-700">
                    <span>Calculated Commission:</span>
                    <span className="font-bold font-mono">+₦{Math.round(Number(basePrice) * 0.1).toLocaleString()}</span>
                  </div>
                  <div className="h-px bg-blue-100/50 my-1" />
                  <div className="flex justify-between items-center text-blue-900 text-sm font-bold pt-0.5">
                    <span>Final listing buyer price:</span>
                    <span className="font-mono text-blue-600">
                      ₦{Math.round(Number(basePrice) * 1.1).toLocaleString()}
                    </span>
                  </div>
                  
                  <p className="text-[10px] text-blue-500 leading-normal pt-1 text-center font-normal">
                    Platform commission: 10% — Final buyer price = Base price + ₦(Base × 10%)
                  </p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-sm cursor-pointer hover:scale-101 active:scale-99 text-center"
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