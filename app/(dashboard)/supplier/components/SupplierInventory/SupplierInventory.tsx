// /dashboard/supplier/inventory/SupplierInventory.tsx
"use client"

import { useEffect, useMemo, useState, useTransition } from "react"
import {
  AlertTriangle,
  Package,
  Plus,
  Search,
  TrendingUp,
} from "lucide-react"

import { getSupplierInventory } from "@/services/supplier-inventory.service"

import { AddInventoryModal } from "./AddInventoryModal"

type InventoryItem = {
  _id: string

  supplierType: "importer" | "distributor" | "retailer"

  salesUnit: "unit" | "pack" | "carton"

  basePrice: number

  commissionPercent: number

  commissionAmount: number

  finalPrice: number

  stock: number

  reorderLevel: number

  status: "available" | "low" | "out" | "on-request"

  batchInfo?: {
    batchNumber?: string
    expiryDate?: string
  }

  productId: {
    _id: string
    name: string
    category: string

    images?: {
      primary?: string
    }
  }

  createdAt: string
}

type Props = {
  supplierId: string
}

export function SupplierInventory({
  supplierId,
}: Props) {
  const [inventory, setInventory] = useState<
    InventoryItem[]
  >([])

  const [search, setSearch] = useState("")

  const [isPending, startTransition] =
    useTransition()

  const [isAddModalOpen, setIsAddModalOpen] =
    useState(false)

  const fetchInventory = async () => {
    startTransition(async () => {
      const data =
        await getSupplierInventory(supplierId)

      setInventory(data)
    })
  }

  useEffect(() => {
    fetchInventory()
  }, [])

  const filteredInventory = useMemo(() => {
    return inventory.filter((item) => {
      const query = search.toLowerCase()

      return (
        item.productId?.name
          ?.toLowerCase()
          .includes(query) ||
        item.productId?.category
          ?.toLowerCase()
          .includes(query)
      )
    })
  }, [inventory, search])

  const stats = useMemo(() => {
    const totalProducts = inventory.length

    const totalStock = inventory.reduce(
      (acc, item) => acc + item.stock,
      0
    )

    const lowStock = inventory.filter(
      (item) => item.status === "low"
    ).length

    const totalValue = inventory.reduce(
      (acc, item) =>
        acc + item.stock * item.basePrice,
      0
    )

    return {
      totalProducts,
      totalStock,
      lowStock,
      totalValue,
    }
  }, [inventory])

  return (
    <>
      <div className="space-y-6">

        {/* HEADER */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Supplier Inventory
            </h1>

            <p className="text-sm text-muted-foreground mt-1">
              Manage product listings, stock levels,
              pricing, and fulfillment readiness.
            </p>
          </div>

          <button
            onClick={() =>
              setIsAddModalOpen(true)
            }
            className="w-fit inline-flex items-center gap-2 rounded-md bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </button>
        </div>

        {/* STATS */}
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          <div className="rounded-2xl border bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase text-muted-foreground">
                Products
              </p>

              <Package className="h-4 w-4 text-slate-500" />
            </div>

            <h2 className="mt-4 text-3xl font-bold">
              {stats.totalProducts}
            </h2>
          </div>

          <div className="rounded-2xl border bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase text-muted-foreground">
                Stock Units
              </p>

              <TrendingUp className="h-4 w-4 text-emerald-500" />
            </div>

            <h2 className="mt-4 text-3xl font-bold">
              {stats.totalStock.toLocaleString()}
            </h2>
          </div>

          <div className="rounded-2xl border bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase text-muted-foreground">
                Low Stock
              </p>

              <AlertTriangle className="h-4 w-4 text-amber-500" />
            </div>

            <h2 className="mt-4 text-3xl font-bold">
              {stats.lowStock}
            </h2>
          </div>

          <div className="rounded-2xl border bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase text-muted-foreground">
                Inventory Value
              </p>

              <TrendingUp className="h-4 w-4 text-blue-500" />
            </div>

            <h2 className="mt-4 text-2xl font-bold">
              ₦{stats.totalValue.toLocaleString()}
            </h2>
          </div>
        </div>

        {/* SEARCH */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <input
            type="text"
            placeholder="Search inventory..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="h-12 w-full rounded-2xl border bg-white pl-11 pr-4 text-sm outline-none ring-0 transition focus:border-blue-500"
          />
        </div>

        {/* TABLE */}
        <div className="overflow-hidden rounded-2xl border bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="border-b bg-slate-50">
                <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-6 py-4">
                    Product
                  </th>

                  <th className="px-6 py-4">
                    Supplier Type
                  </th>

                  <th className="px-6 py-4">
                    Price
                  </th>

                  <th className="px-6 py-4">
                    Stock
                  </th>

                  <th className="px-6 py-4">
                    Status
                  </th>

                  <th className="px-6 py-4">
                    Batch
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredInventory.map((item) => (
                  <tr
                    key={item._id}
                    className="border-b transition hover:bg-slate-50"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 overflow-hidden rounded-xl border bg-slate-100">
                          <img
                            src={
                              item.productId?.images
                                ?.primary ||
                              "/placeholder.png"
                            }
                            alt={
                              item.productId?.name
                            }
                            className="h-full w-full object-cover"
                          />
                        </div>

                        <div>
                          <h3 className="font-semibold">
                            {item.productId?.name}
                          </h3>

                          <p className="text-xs text-muted-foreground">
                            {
                              item.productId
                                ?.category
                            }
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5 capitalize">
                      {item.supplierType}
                    </td>

                    <td className="px-6 py-5">
                      <div>
                        <p className="font-semibold">
                          ₦
                          {item.finalPrice.toLocaleString()}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          Base ₦
                          {item.basePrice.toLocaleString()}
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <div>
                        <p className="font-semibold">
                          {item.stock}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          Reorder @{" "}
                          {item.reorderLevel}
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium capitalize
                        ${
                          item.status ===
                          "available"
                            ? "bg-emerald-100 text-emerald-700"
                            : item.status ===
                              "low"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-red-100 text-red-700"
                        }
                        `}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <div>
                        <p className="text-sm font-medium">
                          {
                            item.batchInfo
                              ?.batchNumber
                          }
                        </p>

                        <p className="text-xs text-muted-foreground">
                          Exp:{" "}
                          {item.batchInfo
                            ?.expiryDate
                            ? new Date(
                                item.batchInfo.expiryDate
                              ).toLocaleDateString()
                            : "--"}
                        </p>
                      </div>
                    </td>
                  </tr>
                ))}

                {!isPending &&
                  filteredInventory.length ===
                    0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-20 text-center"
                      >
                        <Package className="mx-auto mb-4 h-12 w-12 text-slate-300" />

                        <h3 className="font-semibold">
                          No inventory found
                        </h3>

                        <p className="mt-1 text-sm text-muted-foreground">
                          Add products from the
                          MedSupply catalog.
                        </p>
                      </td>
                    </tr>
                  )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AddInventoryModal
        supplierId={supplierId}
        open={isAddModalOpen}
        onClose={() =>
          setIsAddModalOpen(false)
        }
        onCreated={fetchInventory}
      />
    </>
  )
}