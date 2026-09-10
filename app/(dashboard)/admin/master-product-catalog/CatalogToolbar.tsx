"use client"

import React from "react"
import { Search, X, LayoutList, LayoutGrid } from "lucide-react"

import { CATEGORIES } from "@/lib/categories"
import type { MasterProduct, ProductStatus } from "@/types"

export type CatalogViewMode = "table" | "cards"

export type CatalogSort = "name" | "price-asc" | "price-desc" | "commission"

interface CatalogToolbarProps {
  products: MasterProduct[]
  searchQuery: string
  selectedCategory: string
  selectedStatus: "ALL" | ProductStatus
  sortBy: CatalogSort
  viewMode: CatalogViewMode

  onSearchChange: (value: string) => void
  onCategoryChange: (value: string) => void
  onStatusChange: (value: "ALL" | ProductStatus) => void
  onSortChange: (value: CatalogSort) => void
  onViewModeChange: (value: CatalogViewMode) => void
}

export function CatalogToolbar({
  products,
  searchQuery,
  selectedCategory,
  selectedStatus,
  sortBy,
  viewMode,
  onSearchChange,
  onCategoryChange,
  onStatusChange,
  onSortChange,
  onViewModeChange,
}: CatalogToolbarProps) {
  const statusOptions: Array<"ALL" | ProductStatus> = [
    "ALL",
    "ACTIVE",
    "INACTIVE",
    "ARCHIVED",
  ]

  return (
    <div className="space-y-3.5 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs">
      {/* Main Controls */}
      <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
        {/* Search */}
        <div className="relative w-full sm:w-96">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by Trade Name, API, NAFDAC # or Unit..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pr-9 pl-9 text-xs text-slate-900 transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none"
          />

          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute top-1/2 right-3 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              title="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Controls */}
        <div className="flex w-full flex-wrap items-center justify-between gap-2.5 sm:w-auto sm:justify-end">
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 focus:border-blue-500 focus:outline-none"
          >
            {CATEGORIES.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as CatalogSort)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 focus:border-blue-500 focus:outline-none"
          >
            <option value="name">Sort by Name (A-Z)</option>

            <option value="price-asc">Price: Low to High</option>

            <option value="price-desc">Price: High to Low</option>

            <option value="commission">Commission %</option>
          </select>

          {/* View Toggle */}
          <div className="flex items-center rounded-lg border border-slate-200 bg-slate-100 p-0.5">
            <button
              type="button"
              onClick={() => onViewModeChange("table")}
              className={`rounded-md p-1.5 transition ${
                viewMode === "table"
                  ? "bg-white font-semibold text-blue-700 shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
              title="Table view"
            >
              <LayoutList className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => onViewModeChange("cards")}
              className={`rounded-md p-1.5 transition ${
                viewMode === "cards"
                  ? "bg-white font-semibold text-blue-700 shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
              title="Card grid view"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Status Chips */}
      <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-2">
        <span className="mr-1 text-[11px] font-semibold text-slate-400">
          Status Filter:
        </span>

        {statusOptions.map((status) => {
          const count =
            status === "ALL"
              ? products.length
              : products.filter((product) => product.status === status).length

          const selected = selectedStatus === status

          return (
            <button
              key={status}
              type="button"
              onClick={() => onStatusChange(status)}
              className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-medium transition ${
                selected
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <span>{status === "ALL" ? "All Lines" : status}</span>

              <span
                className={`py-0.2 rounded-full px-1.5 font-mono text-[10px] ${
                  selected
                    ? "bg-blue-700 text-white"
                    : "bg-slate-200 text-slate-700"
                }`}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default CatalogToolbar
