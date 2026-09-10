"use client"

import React, { useMemo, useState } from "react"
import {
  Eye,
  Edit2,
  Trash2,
  ShieldCheck,
  Thermometer,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

import type { MasterProduct } from "@/types"

interface CatalogGridProps {
  products: MasterProduct[]

  onViewProduct: (product: MasterProduct) => void
  onEditProduct: (product: MasterProduct) => void
  onToggleStatus: (product: MasterProduct) => void
  onDeleteProduct: (product: MasterProduct) => void
}

export function CatalogGrid({
  products,
  onViewProduct,
  onEditProduct,
  onToggleStatus,
  onDeleteProduct,
}: CatalogGridProps) {
  const [page, setPage] = useState(1)
  const [pageSize] = useState(9)

  const totalPages = Math.max(1, Math.ceil(products.length / pageSize))

  const safePage = Math.min(page, totalPages)

  const paginatedProducts = useMemo(() => {
    const start = (safePage - 1) * pageSize

    return products.slice(start, start + pageSize)
  }, [products, safePage, pageSize])

  const startIndex = products.length === 0 ? 0 : (safePage - 1) * pageSize + 1

  const endIndex = Math.min(safePage * pageSize, products.length)

  const formatCurrency = (value: number) =>
    `₦${Number(value || 0).toLocaleString("en-NG")}`

  return (
    <div className="space-y-3">
      {/* Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {paginatedProducts.map((product) => {
          const fee = Math.round(
            (Number(product.referenceBasePrice) *
              Number(product.commissionPercent || 0)) /
              100
          )

          const maxHospitalPrice = Math.round(
            Number(product.referenceBasePrice) *
              (1 + Number(product.maxMarkupPercent || 0) / 100)
          )

          const statusClass =
            product.status === "ACTIVE"
              ? "bg-emerald-100 text-emerald-800"
              : product.status === "INACTIVE"
                ? "bg-amber-100 text-amber-800"
                : "bg-slate-200 text-slate-700"

          return (
            <div
              key={product.id}
              className="group flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs transition-all hover:border-blue-300 hover:shadow-sm"
            >
              <div>
                {/* Card Header */}
                <div className="mb-2 flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-xl">
                      {product.emoji || "💊"}
                    </div>

                    <div className="min-w-0">
                      <span className="block truncate text-xs font-bold text-slate-900 transition group-hover:text-blue-700">
                        {product.name}
                      </span>

                      <span className="block truncate text-[11px] text-slate-500">
                        {product.activeIngredient}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onToggleStatus(product)}
                    className={`shrink-0 cursor-pointer rounded-full px-2 py-0.5 text-[10px] font-bold transition hover:opacity-80 ${statusClass}`}
                  >
                    {product.status}
                  </button>
                </div>

                {/* NAFDAC */}
                <div className="my-2.5 flex flex-wrap items-center gap-2">
                  <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
                    {product.strength}
                  </span>
                </div>

                {/* Specification */}
                <div className="space-y-1.5 border-t border-slate-100 py-2">
                  <div className="flex justify-between gap-3 text-[11px]">
                    <span className="text-slate-500">Form:</span>

                    <span className="text-right font-medium text-slate-800">
                      {product.dosageForm}
                    </span>
                  </div>

                  <div className="flex justify-between gap-3 text-[11px]">
                    <span className="text-slate-500">Pack:</span>

                    <span className="text-right font-medium text-slate-800">
                      {product.packSize}
                    </span>
                  </div>

                  <div className="rounded-lg border border-blue-100 bg-blue-50/70 p-1.5 text-[10.5px] text-blue-900">
                    <span className="block font-semibold">
                      Hospital Sourcing Unit:
                    </span>

                    <span className="block truncate font-medium">
                      {product.unit}
                    </span>
                  </div>
                </div>

                {/* Storage */}
                <div className="mt-2 flex items-start gap-1.5 rounded-lg border border-amber-200/60 bg-amber-50/60 p-2">
                  <Thermometer className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" />

                  <span
                    className="line-clamp-2 text-[10px] leading-tight text-amber-900"
                    title={product.storageCondition}
                  >
                    {product.storageCondition}
                  </span>
                </div>

                {/* Pricing */}
                <div className="mt-2.5 flex items-center justify-between rounded-xl border border-slate-200/80 bg-slate-50 p-2.5">
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase">
                      Base Price
                    </span>

                    <span className="font-mono text-xs font-bold text-slate-900">
                      {formatCurrency(product.referenceBasePrice)}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="block text-[10px] font-bold text-blue-600 uppercase">
                      Platform ({product.commissionPercent}
                      %)
                    </span>

                    <span className="font-mono text-xs font-bold text-blue-700">
                      +{formatCurrency(fee)}
                    </span>
                  </div>
                </div>

                <div className="mt-1 text-right text-[10px] text-slate-400">
                  Max retail: {formatCurrency(maxHospitalPrice)}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => onViewProduct(product)}
                  className="flex cursor-pointer items-center gap-1 text-xs font-semibold text-blue-600 transition hover:text-blue-800"
                >
                  <Eye className="h-3.5 w-3.5" />
                  Full Specs
                </button>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onEditProduct(product)}
                    className="cursor-pointer rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-blue-600"
                    title="Edit"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteProduct(product)}
                    className="cursor-pointer rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-rose-600"
                    title="Archive / Remove"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Grid Pagination */}
      {products.length > 0 && (
        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-[11px] text-slate-500">
            Showing{" "}
            <span className="font-semibold text-slate-900">{startIndex}</span>
            {" – "}
            <span className="font-semibold text-slate-900">
              {endIndex}
            </span> of{" "}
            <span className="font-semibold text-slate-900">
              {products.length}
            </span>{" "}
            registered products
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={safePage === 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              className="flex cursor-pointer items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Previous
            </button>

            <span className="px-2 text-[11px] text-slate-500">
              Page{" "}
              <span className="font-semibold text-slate-900">{safePage}</span>{" "}
              of{" "}
              <span className="font-semibold text-slate-900">{totalPages}</span>
            </span>

            <button
              type="button"
              disabled={safePage >= totalPages}
              onClick={() =>
                setPage((current) => Math.min(totalPages, current + 1))
              }
              className="flex cursor-pointer items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default CatalogGrid
