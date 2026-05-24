// SupplierInventory.tsx
"use client"

import React, { useEffect, useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AddInventoryModal } from "./AddInventoryModal"
import { getProductCatalog } from "@/services/product-catalog.service"
import { Plus, Search, X, Edit3, Package, AlertTriangle, Info } from "lucide-react"
import { InventoryProduct } from "@/types"

type InventoryStats = {
  totalSkus: number
  totalStockElements: number
  outOfStockCount: number
  lowStockCount: number
  totalValuation: number
}

export default function SupplierInventory () {
  const [inventory, setInventory] = useState<InventoryProduct[]>([])
  const [products, setProducts] = useState<InventoryProduct[]>([])

  const [open, setOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<InventoryProduct | null>(null)

  const [editBasePrice, setEditBasePrice] = useState(0)
  const [editStockQuantity, setEditStockQuantity] = useState(0)
  const [editBatchInfo, setEditBatchInfo] = useState("")

  const [searchQuery, setSearchQuery] = useState("")
  // const [selectedCategory, setSelectedCategory] = useState("All")

  useEffect(() => {
    getProductCatalog().then(setProducts)
  }, [])

  const handleAdd = (item: InventoryProduct) => {
    setInventory(prev => [item, ...prev])
  }

  const handleOpenEdit = (item: InventoryProduct) => {
    setEditingProduct(item)
    setEditBasePrice(item.basePrice)
    setEditStockQuantity(item.stock)
    setEditBatchInfo(item.batchInfo)
  }

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProduct) return

    setInventory(prev =>
      prev.map(p =>
        p.id === editingProduct.id
          ? {
              ...p,
              basePrice: editBasePrice,
              stock: editStockQuantity,
              batchInfo: editBatchInfo,
              commission: Math.round(editBasePrice * 0.1),
              finalPrice: Math.round(editBasePrice * 1.1),
            }
          : p
      )
    )

    setEditingProduct(null)
  }

  const stats: InventoryStats = useMemo(() => {
    return inventory.reduce(
      (acc, item) => {
        acc.totalSkus += 1
        acc.totalStockElements += item.stock
        acc.totalValuation += item.stock * item.basePrice

        if (item.stock === 0) acc.outOfStockCount++
        else if (item.stock < item.moq) acc.lowStockCount++

        return acc
      },
      {
        totalSkus: 0,
        totalStockElements: 0,
        outOfStockCount: 0,
        lowStockCount: 0,
        totalValuation: 0,
      }
    )
  }, [inventory])

  const filtered = useMemo(() => {
    return inventory.filter(i =>
      i.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [inventory, searchQuery])

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Inventory</h1>

        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-4 gap-4">
        <Stat label="SKUs" value={stats.totalSkus} />
        <Stat label="Stock" value={stats.totalStockElements} />
        <Stat label="Low Stock" value={stats.lowStockCount} />
        <Stat label="Out" value={stats.outOfStockCount} />
      </div>

      {/* SEARCH */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4" />
        <input
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="pl-10 border p-2 rounded-lg w-full"
          placeholder="Search inventory"
        />
      </div>

      {/* LIST */}
      <div className="space-y-2">
        {filtered.map(item => (
          <div key={item.id} className="p-4 border rounded-lg flex justify-between">
            <div>
              <p className="font-semibold">{item.name}</p>
              <p className="text-sm text-gray-500">₦{item.finalPrice}</p>
            </div>

            <button onClick={() => handleOpenEdit(item)}>
              <Edit3 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* ADD MODAL */}
      <AddInventoryModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onAdd={handleAdd}
        existingInventory={inventory}
        products={products}
      />

      {/* EDIT MODAL */}
      <AnimatePresence>
        {editingProduct && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
            <form
              onSubmit={handleSaveEdit}
              className="bg-white p-6 rounded-xl w-full max-w-md space-y-4"
            >
              <h2 className="font-bold">Edit Product</h2>

              <input
                value={editBasePrice}
                onChange={e => setEditBasePrice(Number(e.target.value))}
                className="border p-2 w-full rounded"
              />

              <input
                value={editStockQuantity}
                onChange={e => setEditStockQuantity(Number(e.target.value))}
                className="border p-2 w-full rounded"
              />

              <input
                value={editBatchInfo}
                onChange={e => setEditBatchInfo(e.target.value)}
                className="border p-2 w-full rounded"
              />

              <button className="w-full bg-blue-600 text-white py-2 rounded">
                Save
              </button>
            </form>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}

const Stat = ({ label, value }: { label: string; value: number }) => (
  <div className="p-4 border rounded-lg">
    <p className="text-xs text-gray-500">{label}</p>
    <p className="text-xl font-bold">{value}</p>
  </div>
)