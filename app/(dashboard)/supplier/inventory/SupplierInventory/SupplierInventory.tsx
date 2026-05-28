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
  const { data: session } = useSession()

  const supplierId = session?.user?.id

  const [products, setProducts] = useState<ProductCatalogItem[]>([])
  const [open, setOpen] = useState(false)

  const [editingProduct, setEditingProduct] =
    useState<InventoryProduct | null>(null)

  /* =========================================================
     INVENTORY QUERY
  ========================================================= */

  const {
    data: inventory = [],
    isLoading,
    refetch,
  } = useQuery<InventoryProduct[]>({
    queryKey: ["supplier-inventory", supplierId],
    enabled: !!supplierId,

    queryFn: async () => {
      const res = await getSupplierInventory(supplierId)

      return res ?? []
    },
  })

  /* =========================================================
     PRODUCT CATALOG
  ========================================================= */

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await getProductCatalog()
        setProducts(res ?? [])
      } catch (error) {
        console.error(error)
      }
    }

    loadProducts()
  }, [])

  /* =========================================================
     EDIT HANDLER
  ========================================================= */

  const handleOpenEdit = (item: InventoryProduct) => {
    setEditingProduct(item)
  }

  /* =========================================================
     ANALYTICS
  ========================================================= */

  const stats: InventoryStats = useMemo(() => {
    return inventory.reduce(
      (acc, item) => {
        const stock = item.stock ?? 0
        const moq = item.moq ?? 0
        const basePrice = item.basePrice ?? 0

        acc.totalSkus += 1
        acc.totalStockElements += stock
        acc.totalValuation += stock * basePrice

        if (stock === 0) {
          acc.outOfStockCount += 1
        } else if (stock < moq) {
          acc.lowStockCount += 1
        }

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

  return (
    <div className="space-y-6">

      {/* =========================================================
          HEADER
      ========================================================= */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            My Inventory
          </h1>

          <p className="text-sm text-slate-500">
            Supplier workspace for pharmaceutical catalog and stock management.
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="self-end w-fit inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-2 py-2 text-xs md:text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </button>
      </div>

      {/* =========================================================
          STATS
      ========================================================= */}

      <div className="hidden grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {/* <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5"> */}

        <StatCard
          label="Total SKUs"
          value={stats.totalSkus}
          icon={<Clipboard className="h-5 w-5" />}
        />

        <StatCard
          label="Stock Units"
          value={stats.totalStockElements.toLocaleString()}
          icon={<Package className="h-5 w-5" />}
        />

        <StatCard
          label="Low Stock"
          value={stats.lowStockCount}
          icon={<AlertTriangle className="h-5 w-5" />}
        />

        <StatCard
          label="Out of Stock"
          value={stats.outOfStockCount}
          icon={<AlertTriangle className="h-5 w-5" />}
        />

        <StatCard
          label="Inventory Value"
          value={`₦${stats.totalValuation.toLocaleString()}`}
          icon={<TrendingUp className="h-5 w-5" />}
        />
      </div>

      {/* =========================================================
          TABLE
      ========================================================= */}

      <StockInventoryTable
        inventory={inventory}
        onEdit={handleOpenEdit}
        isLoading={isLoading}
      />

      <InventoryFooter />

      {/* =========================================================
          ADD MODAL
      ========================================================= */}

      <AddInventoryModal
        isOpen={open}
        onClose={() => setOpen(false)}
        products={products}
        existingInventory={inventory}
        onSuccess={refetch}
      />

      {/* =========================================================
          EDIT MODAL
      ========================================================= */}

      <EditInventoryModal
        key={editingProduct?.id ?? "new"}
        editingProduct={editingProduct}
        onClose={() => setEditingProduct(null)}
        onSaved={refetch}
      />
    </div>
  )
}

/* =========================================================
   STAT CARD
========================================================= */

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
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
          {label}
        </span>

        <span className="text-slate-400">
          {icon}
        </span>
      </div>

      <div className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900">
        {value}
      </div>
    </div>
  )
}