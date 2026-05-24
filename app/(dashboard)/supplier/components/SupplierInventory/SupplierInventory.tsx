// SupplierInventory.tsx
"use client"

import React, { useEffect, useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AddInventoryModal } from "./AddInventoryModal"
import { getProductCatalog } from "@/services/product-catalog.service"
import {
  Plus,
  Search,
  Edit3,
  X,
  Package,
  AlertTriangle,
  TrendingUp,
  Check,
  Info,
  TrendingDown,
  DollarSign,
  Filter,
  Clipboard,
  RotateCcw,
  CheckCircle2,
  Lock,
  ArrowUpDown
} from 'lucide-react'; import { InventoryProduct } from "@/types"

type InventoryStats = {
  totalSkus: number
  totalStockElements: number
  outOfStockCount: number
  lowStockCount: number
  totalValuation: number
}

export default function SupplierInventory() {
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

      {/* Main Title Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div className="flex-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            My Inventory
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Supplier workspace to catalog pharmaceuticals, pricing, and monitor stock volumes instantly.
          </p>
        </div>

        <div className="flex items-center gap-3">

          <button
            id="btn-add-product"
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-sm active:scale-98"
          >
            <Plus className="w-5 h-5" />
            Add Product
          </button>
        </div>
      </div>

      {/* STATS */}

      {/* Dynamic Real-time Analytics Dashboard Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {/* SKUs */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase font-bold tracking-wider">Total SKUs</span>
            <span className="p-1.5 bg-slate-50 text-slate-600 rounded-md">
              <Clipboard className="w-4 h-4" />
            </span>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-slate-800">{stats.totalSkus}</div>
            <p className="text-xs text-slate-400 mt-0.5">Active Catalog listings</p>
          </div>
        </div>

        {/* Registered Stock */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase font-bold tracking-wider">Stock Units</span>
            <span className="p-1.5 bg-blue-50 text-blue-600 rounded-md">
              <Package className="w-4 h-4" />
            </span>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-slate-800">{stats.totalStockElements.toLocaleString()}</div>
            <p className="text-xs text-slate-400 mt-0.5">Total count stored</p>
          </div>
        </div>

        {/* Low Stock count */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase font-bold tracking-wider">Low Stock</span>
            <span className={`p-1.5 rounded-md ${stats.lowStockCount > 0 ? 'bg-amber-50 text-amber-600' : 'bg-slate-50 text-slate-400'}`}>
              <AlertTriangle className="w-4 h-4" />
            </span>
          </div>
          <div>
            <div className={`text-2xl font-bold font-mono ${stats.lowStockCount > 0 ? 'text-amber-600' : 'text-slate-800'}`}>
              {stats.lowStockCount}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Stock below product MOQ</p>
          </div>
        </div>

        {/* Out of Stock count */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase font-bold tracking-wider">Out of Stock</span>
            <span className={`p-1.5 rounded-md ${stats.outOfStockCount > 0 ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-400'}`}>
              <AlertTriangle className="w-4 h-4" />
            </span>
          </div>
          <div>
            <div className={`text-2xl font-bold font-mono ${stats.outOfStockCount > 0 ? 'text-red-600' : 'text-slate-800'}`}>
              {stats.outOfStockCount}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Requires immediate fill</p>
          </div>
        </div>

        {/* Inventory Valuation */}
        <div className="col-span-2 lg:col-span-1 bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase font-bold tracking-wider">Valuation (₦)</span>
            <span className="p-1.5 bg-emerald-50 text-emerald-600 rounded-md">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div>
            <div className="text-xl font-bold font-mono text-emerald-700 truncate">
              ₦{stats.totalValuation.toLocaleString()}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Weighted base inventory value</p>
          </div>
        </div>
      </div>

      {/* SEARCH */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs mb-6 grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
        {/* Search */}
        <div className="relative md:col-span-2">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search products by brand name or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
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

      {/* FOOTER INFORMATIONAL BLOCK OF COMPLIANCE */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex items-start gap-4">
        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg mt-0.5 shrink-0">
          <Info className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-900">Supplier Authority & Safety Guidelines</h4>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            As a registered supplier, your pricing inputs directly affect final hospital and pharmacy disbursements. Only <strong>Base price</strong> and <b>Stock Quantities</b> can be modified. Minimun Order Quantity (MOQ) limits and Platform Commission margins (set at 10%) are regulated by the administrative platform to ensure unified health access parameters.
          </p>
        </div>
      </div>

      {/* ADD MODAL */}
      <AddInventoryModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onAdd={handleAdd}
        existingInventory={inventory}
        products={products}
      />

  
      {/* ==================================== MODAL: EDIT PRODUCT (STOCK & BASE PRICE ONLY) ==================================== */}
      <AnimatePresence>
        {editingProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop Blur overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingProduct(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            />

            {/* Modal Body Container */}
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 16 }}
              transition={{ type: 'spring', duration: 0.35, bounce: 0.15 }}
              className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-150">
                <div className="flex items-center gap-2.5">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Edit Product</h3>
                    <p className="text-xs text-slate-400 font-medium">Updating {editingProduct.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => setEditingProduct(null)}
                  className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleEditProductSubmit} className="p-6 space-y-5">

                {/* Visual disclaimer of fields that cannot be modified */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-500 space-y-1.5 leading-snug">
                  <div className="flex items-center gap-1.5 font-bold text-slate-700">
                    <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    Locked Parameters (Fixed Platform Rules)
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1 font-medium">
                    <div className="bg-white p-2 border border-slate-150 rounded-lg">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wide block">Platform Commission</span>
                      <span className="font-mono text-slate-700 font-bold block mt-0.5">10% fixed margin</span>
                    </div>
                    <div className="bg-white p-2 border border-slate-150 rounded-lg">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wide block">Minimum Order Qty</span>
                      <span className="font-mono text-slate-700 font-bold block mt-0.5">MOQ: {editingProduct.moq} {editingProduct.unit}s</span>
                    </div>
                  </div>
                </div>

                {/* Base Price and Stock Level modification */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Base Price (Editable) */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                      Base Price (₦)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={editBasePrice}
                      onChange={(e) => setEditBasePrice(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 border border-slate-250 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 rounded-lg text-sm transition-all font-mono font-bold text-slate-800"
                      required
                    />
                  </div>

                  {/* Stock Quantity (Editable) */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                      Stock Level
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={editStockQuantity}
                      onChange={(e) => setEditStockQuantity(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 border border-slate-250 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 rounded-lg text-sm transition-all font-mono font-bold text-slate-800"
                      required
                    />
                  </div>
                </div>

                {/* Expiry Details (Editable) */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                    Batch / Expiry Info
                  </label>
                  <input
                    type="text"
                    value={editBatchInfo}
                    onChange={(e) => setEditBatchInfo(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-250 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 rounded-lg text-sm text-slate-800 font-medium"
                    required
                  />
                </div>

                {/* Live pricing calculations preview */}
                <div className="bg-blue-50/80 border border-blue-100 rounded-xl p-4 text-xs font-medium text-blue-800 space-y-1.5 leading-snug">
                  <div className="flex justify-between items-center text-blue-700">
                    <span>New Base Price:</span>
                    <span className="font-bold font-mono">₦{editBasePrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-blue-700">
                    <span>10% Platform Margin:</span>
                    <span className="font-bold font-mono">+₦{Math.round(editBasePrice * 0.1).toLocaleString()}</span>
                  </div>
                  <div className="h-px bg-blue-100/50 my-1" />
                  <div className="flex justify-between items-center text-blue-900 text-sm font-bold pt-0.5">
                    <span>New listing final price:</span>
                    <span className="font-mono text-blue-600">
                      ₦{Math.round(editBasePrice * 1.1).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Bottom submission action button */}
                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold rounded-lg transition-colors text-sm text-center cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-sm cursor-pointer hover:scale-101 active:scale-99 text-center"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
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