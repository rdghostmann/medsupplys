// SupplierInventory.tsx
"use client"

import React, { useEffect, useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import {
  Plus,
  Package,
  AlertTriangle,
  TrendingUp,
  Clipboard,
} from "lucide-react"

import { AddInventoryModal } from "./AddInventoryModal"
import EditInventoryModal from "./EditInventoryModal"
import StockInventoryTable from "./StockInventoryTable"
import InventoryFooter from "./InventoryFooter"

import { getProductCatalog } from "@/services/product-catalog.service"
import { getSupplierInventory } from "@/services/supplier-inventory.service"

import type { InventoryProduct, ProductCatalogItem } from "@/types"

type InventoryStats = {
  totalSkus: number
  totalStockElements: number
  outOfStockCount: number
  lowStockCount: number
  totalValuation: number
}

export default function SupplierInventory() {

  const { data: session, status } = useSession()


  const [products, setProducts] = useState<ProductCatalogItem[]>([])
  const [open, setOpen] = useState(false)

  const [editingProduct, setEditingProduct] =
    useState<InventoryProduct | null>(null)

  const [searchQuery, setSearchQuery] = useState("")

  const supplierId = session?.user?.id

  // ✅ FIX: strongly typed queryFn (no params)
  const {
    data: inventory = [],
    isLoading,
    refetch,
  } = useQuery<InventoryProduct[]>({
    queryKey: ["supplier-inventory", supplierId],
    enabled: !!supplierId, // IMPORTANT: prevents undefined call
    queryFn: async () => {
      const res = await getSupplierInventory(supplierId)
      return res as InventoryProduct[]
    },
  })

  // PRODUCT CATALOG
  useEffect(() => {
    getProductCatalog()
      .then((res) => setProducts(res || []))
      .catch(console.error)
  }, [])

  // EDIT HANDLER
  const handleOpenEdit = (item: InventoryProduct) => {
    setEditingProduct(item)
  }

  // ANALYTICS (SAFE TYPING FIX)
  const stats: InventoryStats = useMemo(() => {
    const safeInventory = inventory ?? []

    return safeInventory.reduce(
      (acc, item) => {
        const stock = item?.stock ?? 0
        const moq = item?.moq ?? 0
        const basePrice = item?.basePrice ?? 0

        acc.totalSkus += 1
        acc.totalStockElements += stock
        acc.totalValuation += stock * basePrice

        if (stock === 0) acc.outOfStockCount += 1
        else if (stock < moq) acc.lowStockCount += 1

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

  // FILTER
  const filteredInventory = useMemo(() => {
    if (!searchQuery.trim()) return inventory

    return inventory.filter((i) =>
      i.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [inventory, searchQuery])

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div className="flex-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            My Inventory
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Supplier workspace for pharmaceutical catalog and stock tracking.
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard label="Total SKUs" value={stats.totalSkus} icon={<Clipboard />} />
        <StatCard label="Stock Units" value={stats.totalStockElements} icon={<Package />} />
        <StatCard label="Low Stock" value={stats.lowStockCount} icon={<AlertTriangle />} />
        <StatCard label="Out of Stock" value={stats.outOfStockCount} icon={<AlertTriangle />} />
        <StatCard
          label="Valuation (₦)"
          value={`₦${stats.totalValuation.toLocaleString()}`}
          icon={<TrendingUp />}
        />
      </div>

      {/* TABLE */}
      <StockInventoryTable
        inventory={filteredInventory}
        onEdit={handleOpenEdit}
      />

      <InventoryFooter />

      {/* ADD MODAL */}
      <AddInventoryModal
        isOpen={open}
        onClose={() => setOpen(false)}
        products={products}
        existingInventory={inventory}
        onSuccess={() => refetch()}
      />

      {/* EDIT MODAL (UI retained, wired) */}
      <EditInventoryModal
        editingProduct={editingProduct}
        onClose={() => setEditingProduct(null)}
        onSaved={refetch}
      />
    </div>
  )
}

/**
 * SMALL UI COMPONENT
 */
function StatCard({
  label,
  value,
  icon,
}: {
  label: string
  value: string | number
  icon: React.ReactNode
}) {
  return (
    <div className="bg-white p-5 rounded-xl border">
      <div className="flex justify-between text-slate-500 text-xs uppercase font-bold">
        {label}
        <span>{icon}</span>
      </div>
      <div className="text-xl font-bold mt-2">{value}</div>
    </div>
  )
}