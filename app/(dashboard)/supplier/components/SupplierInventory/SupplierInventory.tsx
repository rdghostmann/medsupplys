// SupplierInventory.tsx
"use client"

import React, { useEffect, useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus } from "lucide-react"

import { AddInventoryModal } from "./AddInventoryModal"
import { getProductCatalog } from "@/services/product-catalog.service"

export const SupplierInventory = () => {
  const [inventory, setInventory] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [open, setOpen] = useState(false)

  // Load product catalog (server action)
  useEffect(() => {
    const load = async () => {
      const data = await getProductCatalog()
      setProducts(data)
    }

    load()
  }, [])

  const handleAdd = (item: any) => {
    setInventory(prev => [item, ...prev])
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Supplier Inventory</h1>

        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* Inventory Grid */}
      <div className="grid gap-3">
        {inventory.map(item => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 border rounded-lg bg-white"
          >
            <div className="font-semibold">{item.name}</div>
            <div className="text-sm text-slate-500">
              ₦{item.finalPrice.toLocaleString()}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      <AddInventoryModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onAdd={handleAdd}
        existingInventory={inventory}
        products={products}
      />
    </div>
  )
}