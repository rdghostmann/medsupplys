// AddInventoryModal.tsx
"use client"

import React, { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

import type { InventoryProduct } from "@/types"

import { useSession } from "next-auth/react"
import { createSupplierInventory } from "@/services/supplier-inventory.service"

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

  const { data: session } = useSession()

  const [productId, setProductId] = useState("")
  const [basePrice, setBasePrice] = useState<number>(0)
  const [stock, setStock] = useState<number>(0)
  const [nafdacNumber, setNafdacNumber] = useState("")

  const [batchNumber, setBatchNumber] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [manufacturingDate, setManufacturingDate] = useState("")

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
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedProduct) return

    const supplierId = session?.user?.id

    if (!supplierId) {
      console.error("Supplier session not found")
      return
    }

    try {
      const response = await createSupplierInventory({
        supplierId,
        productId: selectedProduct._id,
        supplierType: selectedProduct.type === "IMPORTER"
            ? "importer"
            : "distributor",

        salesUnit: selectedProduct.unit === "pack" ||
            selectedProduct.unit === "carton"
            ? selectedProduct.unit
            : "unit",
        basePrice,
        stock,
        nafdacNumber,
        minOrderQuantity: selectedProduct.moq ?? 1,
        batchInfo: {
          batchNumber,
          expiryDate: expiryDate
            ? new Date(expiryDate)
            : undefined,
          manufacturingDate: manufacturingDate
            ? new Date(manufacturingDate)
            : undefined,
        },
      })

      if (!response.success) {
        console.error(response.message)
        return
      }

      onSuccess()

      // RESET FORM
      setProductId("")
      setBasePrice(0)
      setStock(0)

      setNafdacNumber("")

      setBatchNumber("")
      setExpiryDate("")
      setManufacturingDate("")

      onClose()
    } catch (error) {
      console.error("Failed to create inventory:", error)
    }
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

              {/* PRICE + STOCK */}
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
                      onChange={(e) => setBasePrice(Number(e.target.value))}
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


              <div className="grid grid-cols-2 gap-4">
                {/* NAFDAC */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    NAFDAC No.
                  </label>
                  <input
                    type="text"
                    placeholder="NAFDAC Number"
                    value={nafdacNumber}
                    onChange={(e) => setNafdacNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-250 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 rounded-lg text-sm transition-all font-mono font-bold animate-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Batch Number
                  </label>
                  <input
                    type="text"
                    placeholder="Batch Number"
                    value={batchNumber}
                    onChange={(e) => setBatchNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-250 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 rounded-lg text-sm transition-all font-mono font-bold animate-none"
                    required
                  />
                </div>

              </div>


              {/* BATCH INFO */}
              <div className="grid grid-cols-2 gap-3">

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Manufacturing Date
                  </label>
                  <input
                    type="date"
                    value={manufacturingDate}
                    onChange={(e) => setManufacturingDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-250 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 rounded-lg text-sm transition-all font-mono font-bold animate-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-250 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 rounded-lg text-sm transition-all font-mono font-bold animate-none"
                    required
                  />
                </div>
              </div>

              {/* PREVIEW */}
              {basePrice > 0 && (
                <div className="bg-blue-50 border rounded-xl p-4 text-xs space-y-2">
                  <div className="flex justify-between items-center text-blue-700">
                    <span>Commission Rate:</span>
                    <span className="font-bold font-mono">₦{commission.toLocaleString()}</span>
                  </div>

                  <div className="h-px bg-blue-100/50 my-1" />

                  <div className="flex justify-between font-bold text-blue-700">
                    <span>Final Price</span>
                    <span>₦{finalPrice.toLocaleString()}</span>
                  </div>
                </div>
              )}

              {/* SUBMIT */}
              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 text-white rounded-lg"
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