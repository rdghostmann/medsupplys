"use client"

import React, { useMemo } from "react"
import {
  Eye,
  Edit2,
  Trash2,
  ShieldCheck,
  Thermometer,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table"

import type { MasterProduct } from "@/types"
import type { SupplierInventoryRecord } from "@/controllers/product.action"

interface CatalogTableProps {
  products: MasterProduct[]
  inventory: SupplierInventoryRecord[]

  onViewProduct: (product: MasterProduct) => void
  onEditProduct: (product: MasterProduct) => void
  onToggleStatus: (product: MasterProduct) => void
  onDeleteProduct: (product: MasterProduct) => void
}

export function CatalogTable({
  products,
  inventory,
  onViewProduct,
  onEditProduct,
  onToggleStatus,
  onDeleteProduct,
}: CatalogTableProps) {
  const formatCurrency = (value: number) =>
    `₦${Number(value || 0).toLocaleString("en-NG")}`

  const columns = useMemo<ColumnDef<MasterProduct>[]>(
    () => [
      {
        id: "product",
        header: "Product & Regulatory Spec",
        accessorFn: (row) => `${row.name} ${row.activeIngredient}`,
        cell: ({ row }) => {
          const product = row.original

          return (
            <div className="flex items-start gap-2.5">
              <span className="mt-0.5 hidden shrink-0 text-xl">
                {product.emoji || "💊"}
              </span>

              <div className="min-w-0">
                <span className="block font-bold text-slate-900 transition group-hover:text-blue-700">
                  {product.name}
                </span>

                <span className="flex items-center gap-2 text-[11px] text-slate-500">
                  <span className="font-medium text-slate-700">
                    {product.activeIngredient}
                  </span>
                </span>

                {/* <div className="mt-1 flex items-center gap-2">
                  <span className="flex items-center gap-1 rounded border border-emerald-200/80 bg-emerald-50 px-1.5 py-0.2 font-mono text-[10px] font-semibold text-emerald-800">
                    <ShieldCheck className="h-3 w-3 text-emerald-600" />
                    {product.nafdacRegNumber}
                  </span>
                </div> */}
              </div>
            </div>
          )
        },
      },

      {
        id: "formulation",
        header: "Formulation & Strength",
        accessorFn: (row) => `${row.dosageForm} ${row.strength}`,
        cell: ({ row }) => {
          const product = row.original

          return (
            <div>
              <span className="block font-semibold text-slate-900">
                {product.dosageForm}
              </span>

              <span className="block font-mono text-[11px] text-blue-700">
                {product.strength}
              </span>

              <span className="mt-0.5 block text-[10px] text-slate-400">
                {product.category.replace(/_/g, " ")}
              </span>
            </div>
          )
        },
      },

      {
        id: "unit",
        header: "Hospital Dispensing Unit",
        accessorFn: (row) => `${row.packSize} ${row.unit}`,
        cell: ({ row }) => {
          const product = row.original

          return (
            <div className="max-w-[210px]">
              <span
                className="block truncate font-medium text-slate-800"
                title={product.packSize}
              >
                {product.packSize}
              </span>

              <span
                className="mt-0.5 block truncate rounded border border-blue-100 bg-blue-50 px-1.5 py-0.5 text-[11px] font-semibold text-blue-800"
                title={product.unit}
              >
                {product.unit}
              </span>
            </div>
          )
        },
      },

      {
        id: "storage",
        header: "Storage GDP",
        accessorFn: (row) => row.storageCondition,
        cell: ({ row }) => {
          const product = row.original

          return (
            <div className="max-w-[180px]">
              <div className="flex items-start gap-1 rounded-lg border border-amber-200/60 bg-amber-50/60 p-1.5 text-amber-900">
                <Thermometer className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" />

                <span
                  className="line-clamp-2 text-[10.5px] leading-tight"
                  title={product.storageCondition}
                >
                  {product.storageCondition}
                </span>
              </div>
            </div>
          )
        },
      },

      {
        id: "pricing",
        header: "Pricing & Monetization",
        accessorKey: "referenceBasePrice",
        cell: ({ row }) => {
          const product = row.original

          const fee = Math.round(
            (Number(product.referenceBasePrice) *
              Number(product.commissionPercent || 0)) /
              100
          )

          const maxHospitalPrice = Math.round(
            Number(product.referenceBasePrice) *
              (1 + Number(product.maxMarkupPercent || 0) / 100)
          )

          return (
            <div className="font-mono">
              <div className="text-xs font-bold text-slate-900">
                {formatCurrency(product.referenceBasePrice)}
              </div>

              <div className="text-[10px] font-semibold text-blue-700">
                Comm ({product.commissionPercent}%): {formatCurrency(fee)}
              </div>

              <div className="text-[10px] text-slate-400">
                Max retail: {formatCurrency(maxHospitalPrice)}
              </div>
            </div>
          )
        },
      },

      {
        id: "status",
        header: "Status",
        accessorKey: "status",
        cell: ({ row }) => {
          const product = row.original

          const statusClass =
            product.status === "ACTIVE"
              ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
              : product.status === "INACTIVE"
                ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
                : "bg-slate-200 text-slate-700 hover:bg-slate-300"

          const dotClass =
            product.status === "ACTIVE"
              ? "bg-emerald-600"
              : product.status === "INACTIVE"
                ? "bg-amber-600"
                : "bg-slate-500"

          return (
            <button
              type="button"
              onClick={() => onToggleStatus(product)}
              className={`inline-flex cursor-pointer items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold transition ${statusClass}`}
              title="Click to toggle status"
            >
              <span className={`h-1.5 w-1.5 rounded-full ${dotClass}`} />

              {product.status}
            </button>
          )
        },
      },

      {
        id: "actions",
        header: "Actions",
        enableSorting: false,
        cell: ({ row }) => {
          const product = row.original

          return (
            <div className="flex items-center justify-end gap-1 whitespace-nowrap">
              <button
                type="button"
                onClick={() => onViewProduct(product)}
                className="cursor-pointer rounded-lg p-1.5 text-slate-400 transition hover:bg-blue-50 hover:text-blue-700"
                title="View Full Specifications"
              >
                <Eye className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => onEditProduct(product)}
                className="cursor-pointer rounded-lg p-1.5 text-slate-400 transition hover:bg-blue-50 hover:text-blue-700"
                title="Edit Master Specifications"
              >
                <Edit2 className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => onDeleteProduct(product)}
                className="cursor-pointer rounded-lg p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-700"
                title="Archive / Remove"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )
        },
      },
    ],
    [inventory, onViewProduct, onEditProduct, onToggleStatus, onDeleteProduct]
  )

  const table = useReactTable({
    data: products,
    columns,

    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),

    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 10,
      },
    },
  })

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1150px] text-left text-xs">
          <thead className="border-b border-slate-200/80 bg-slate-50/90 text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={`px-3 py-3.5 ${
                      header.id === "product" ? "pl-4" : ""
                    } ${header.id === "actions" ? "pr-4 text-right" : ""}`}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody className="divide-y divide-slate-100 text-slate-700">
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="group transition-colors hover:bg-slate-50/70"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-3 py-3.5">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* TanStack Pagination */}
      <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-[11px] text-slate-500">
          Showing{" "}
          <span className="font-semibold text-slate-900">
            {table.getRowModel().rows.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-slate-900">
            {products.length}
          </span>{" "}
          registered products
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="flex cursor-pointer items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Previous
          </button>

          <span className="px-2 text-[11px] text-slate-500">
            Page{" "}
            <span className="font-semibold text-slate-900">
              {table.getState().pagination.pageIndex + 1}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-900">
              {table.getPageCount()}
            </span>
          </span>

          <button
            type="button"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="flex cursor-pointer items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default CatalogTable
