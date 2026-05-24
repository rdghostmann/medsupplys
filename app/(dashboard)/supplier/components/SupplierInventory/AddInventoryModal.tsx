// /dashboard/supplier/inventory/AddInventoryModal.tsx
"use client"

import { useEffect, useState, useTransition } from "react"
import { X } from "lucide-react"

import {
  createSupplierInventory,
} from "@/services/supplier-inventory.service"

type ProductType = {
  _id: string

  name: string

  category: string

  pricing?: {
    proposedPrice?: number
    commissionPercent?: number
  }

  images?: {
    primary?: string
  }
}

type Props = {
  open: boolean

  onClose: () => void

  onCreated: () => void

  supplierId: string
}

export function AddInventoryModal({
  open,
  onClose,
  onCreated,
  supplierId,
}: Props) {
  const [products, setProducts] = useState<
    ProductType[]
  >([])

  const [selectedProduct, setSelectedProduct] =
    useState("")

  const [supplierType, setSupplierType] =
    useState("distributor")

  const [salesUnit, setSalesUnit] =
    useState("pack")

  const [basePrice, setBasePrice] =
    useState("")

  const [stock, setStock] = useState("")

  const [reorderLevel, setReorderLevel] =
    useState("10")

  const [batchNumber, setBatchNumber] =
    useState("")

  const [expiryDate, setExpiryDate] =
    useState("")

  const [warehouseLocation, setWarehouseLocation] =
    useState("")

  const [isPending, startTransition] =
    useTransition()

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch(
        "/api/products"
      )

      const data = await response.json()

      setProducts(data.products || [])
    }

    if (open) {
      fetchProducts()
    }
  }, [open])

  const selectedProductData = products.find(
    (item) => item._id === selectedProduct
  )

  const commissionPercent =
    selectedProductData?.pricing
      ?.commissionPercent || 10

  const calculatedFinalPrice =
    Number(basePrice || 0) +
    Number(basePrice || 0) *
      (commissionPercent / 100)

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault()

    startTransition(async () => {
      const response =
        await createSupplierInventory({
          supplierId,
          productId: selectedProduct,
          supplierType,
          salesUnit,
          basePrice: Number(basePrice),
          stock: Number(stock),
          reorderLevel:
            Number(reorderLevel),
          batchInfo: {
            batchNumber,
            expiryDate,
          },
          warehouseLocation,
        })

      if (response.success) {
        onCreated()
        onClose()
      }
    })
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl">

        {/* HEADER */}
        <div className="flex items-center justify-between border-b px-6 py-5">
          <div>
            <h2 className="text-xl font-bold">
              Add Product Inventory
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Select a product from the
              MedSupply catalog and configure
              your stock listing.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 transition hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-6"
        >

          {/* PRODUCT SELECT */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Product Catalog
            </label>

            <select
              value={selectedProduct}
              onChange={(e) =>
                setSelectedProduct(
                  e.target.value
                )
              }
              required
              className="h-12 w-full rounded-2xl border px-4 text-sm outline-none focus:border-blue-500"
            >
              <option value="">
                Select product
              </option>

              {products.map((product) => (
                <option
                  key={product._id}
                  value={product._id}
                >
                  {product.name} •{" "}
                  {product.category}
                </option>
              ))}
            </select>
          </div>

          {/* PRODUCT PREVIEW */}
          {selectedProductData && (
            <div className="flex items-center gap-4 rounded-2xl border bg-slate-50 p-4">
              <div className="h-20 w-20 overflow-hidden rounded-2xl border bg-white">
                <img
                  src={
                    selectedProductData.images
                      ?.primary ||
                    "/placeholder.png"
                  }
                  alt={
                    selectedProductData.name
                  }
                  className="h-full w-full object-cover"
                />
              </div>

              <div>
                <h3 className="font-semibold">
                  {
                    selectedProductData.name
                  }
                </h3>

                <p className="text-sm text-muted-foreground">
                  {
                    selectedProductData.category
                  }
                </p>

                <p className="mt-2 text-xs text-blue-600">
                  Platform Commission:{" "}
                  {commissionPercent}%
                </p>
              </div>
            </div>
          )}

          {/* GRID */}
          <div className="grid gap-5 md:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm font-medium">
                Supplier Type
              </label>

              <select
                value={supplierType}
                onChange={(e) =>
                  setSupplierType(
                    e.target.value
                  )
                }
                className="h-12 w-full rounded-2xl border px-4 text-sm"
              >
                <option value="importer">
                  Importer
                </option>

                <option value="distributor">
                  Distributor
                </option>

                <option value="retailer">
                  Retailer
                </option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Sales Unit
              </label>

              <select
                value={salesUnit}
                onChange={(e) =>
                  setSalesUnit(
                    e.target.value
                  )
                }
                className="h-12 w-full rounded-2xl border px-4 text-sm"
              >
                <option value="unit">
                  Unit
                </option>

                <option value="pack">
                  Pack
                </option>

                <option value="carton">
                  Carton
                </option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Base Price (₦)
              </label>

              <input
                type="number"
                required
                value={basePrice}
                onChange={(e) =>
                  setBasePrice(
                    e.target.value
                  )
                }
                className="h-12 w-full rounded-2xl border px-4 text-sm"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Stock Quantity
              </label>

              <input
                type="number"
                required
                value={stock}
                onChange={(e) =>
                  setStock(e.target.value)
                }
                className="h-12 w-full rounded-2xl border px-4 text-sm"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Reorder Level
              </label>

              <input
                type="number"
                value={reorderLevel}
                onChange={(e) =>
                  setReorderLevel(
                    e.target.value
                  )
                }
                className="h-12 w-full rounded-2xl border px-4 text-sm"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Batch Number
              </label>

              <input
                type="text"
                value={batchNumber}
                onChange={(e) =>
                  setBatchNumber(
                    e.target.value
                  )
                }
                className="h-12 w-full rounded-2xl border px-4 text-sm"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Expiry Date
              </label>

              <input
                type="date"
                value={expiryDate}
                onChange={(e) =>
                  setExpiryDate(
                    e.target.value
                  )
                }
                className="h-12 w-full rounded-2xl border px-4 text-sm"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Warehouse Location
              </label>

              <input
                type="text"
                value={warehouseLocation}
                onChange={(e) =>
                  setWarehouseLocation(
                    e.target.value
                  )
                }
                className="h-12 w-full rounded-2xl border px-4 text-sm"
              />
            </div>
          </div>

          {/* PRICE SUMMARY */}
          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-700">
                Commission
              </span>

              <span className="font-semibold text-blue-900">
                {commissionPercent}%
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm text-blue-700">
                Final Buyer Price
              </span>

              <span className="text-2xl font-bold text-blue-600">
                ₦
                {calculatedFinalPrice.toLocaleString()}
              </span>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border px-5 py-3 text-sm font-medium transition hover:bg-slate-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isPending}
              className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
            >
              {isPending
                ? "Creating..."
                : "Add Inventory"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}