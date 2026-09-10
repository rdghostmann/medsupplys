"use client"

import React, { useMemo } from "react"
import { Package, ShieldCheck, Percent, Layers } from "lucide-react"

import type { MasterProduct } from "@/types"

interface CatalogStatsProps {
  products: MasterProduct[]
}

export function CatalogStats({ products }: CatalogStatsProps) {
  const stats = useMemo(() => {
    const total = products.length

    const activeCount = products.filter(
      (product) => product.status === "ACTIVE"
    ).length

    const avgCommission =
      total > 0
        ? (
            products.reduce(
              (acc, product) => acc + Number(product.commissionPercent || 0),
              0
            ) / total
          ).toFixed(1)
        : "0"

    const totalCatalogBaseValue = products.reduce(
      (acc, product) => acc + Number(product.referenceBasePrice || 0),
      0
    )

    return {
      total,
      activeCount,
      avgCommission,
      totalCatalogBaseValue,
    }
  }, [products])

  return (
    <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
      {/* Cataloged Lines */}
      <div className="flex items-center justify-between rounded-xl border border-slate-200/90 bg-white p-4 shadow-xs">
        <div className="min-w-0">
          <span className="block text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
            Cataloged Lines
          </span>

          <span className="font-display mt-1 block text-2xl font-bold text-slate-900">
            {stats.total}
          </span>

          <span className="mt-0.5 block text-[11px] text-slate-400">
            Regulated master specs
          </span>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-700">
          <Package className="h-5 w-5" />
        </div>
      </div>

      {/* Hospital Sourcing */}
      <div className="flex items-center justify-between rounded-xl border border-slate-200/90 bg-white p-4 shadow-xs">
        <div className="min-w-0">
          <span className="block text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
            Hospital Sourcing
          </span>

          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="font-display text-2xl font-bold text-emerald-700">
              {stats.activeCount}
            </span>

            <span className="text-xs font-medium text-slate-400">
              / {stats.total} Active
            </span>
          </div>

          <span className="mt-0.5 block text-[11px] font-medium text-emerald-600">
            Immediate hospital dispatch
          </span>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-700">
          <ShieldCheck className="h-5 w-5" />
        </div>
      </div>

      {/* Platform Fee */}
      <div className="flex items-center justify-between rounded-xl border border-slate-200/90 bg-white p-4 shadow-xs">
        <div className="min-w-0">
          <span className="block text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
            Avg Platform Fee
          </span>

          <span className="font-display mt-1 block text-2xl font-bold text-blue-700">
            {stats.avgCommission}%
          </span>

          <span className="mt-0.5 block text-[11px] text-slate-400">
            Commission on trade volume
          </span>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-indigo-100 bg-indigo-50 text-indigo-700">
          <Percent className="h-5 w-5" />
        </div>
      </div>

      {/* Basket */}
      <div className="flex items-center justify-between rounded-xl border border-slate-200/90 bg-white p-4 shadow-xs">
        <div className="min-w-0">
          <span className="block text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
            Catalog Basket Price
          </span>

          <span className="mt-1 block truncate font-mono text-2xl font-bold text-slate-900">
            ₦{stats.totalCatalogBaseValue.toLocaleString("en-NG")}
          </span>

          <span className="mt-0.5 block text-[11px] text-slate-400">
            Aggregated standard baseline
          </span>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-slate-700">
          <Layers className="h-5 w-5" />
        </div>
      </div>
    </div>
  )
}

export default CatalogStats
