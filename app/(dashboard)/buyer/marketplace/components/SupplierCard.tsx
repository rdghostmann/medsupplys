// SupplierCard.tsx

"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

import {
  Buildings,
  MagnifyingGlass,
  ShoppingBag,
} from "@phosphor-icons/react"
import { Supplier } from "@/types"


type Props = {
  s: Supplier
  idx: number
  onOrder: (supplier: Supplier) => void
  onCompare: () => void
}

export default function SupplierCard({
  s,
  idx,
  onOrder,
  onCompare,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.04 }}
      className="relative flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
    >
      {/* Top */}
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <Buildings size={22} weight="bold" />
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900">
              {s.name}
            </h3>

            <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
              {s.supplierType}
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-baseline gap-2">
          <p className="text-2xl font-black tracking-tight text-slate-900">
            ₦{s.price.toLocaleString()}
          </p>

          <span className="text-[11px] text-slate-400">
            per {s.salesUnit || "unit"}
          </span>
        </div>

        {s.recommendation?.isRecommended && (
          <div className="mt-3 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            Recommended • {s.recommendation.confidence}%
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-6 grid gap-2">
        <Button
          onClick={() => onOrder(s)}
          className="h-12 w-full rounded-2xl font-bold"
        >
          <ShoppingBag
            size={20}
            className="mr-2"
          />
          Order Now
        </Button>

        <Button
          variant="outline"
          onClick={onCompare}
          className="h-11 w-full rounded-2xl font-semibold"
        >
          <MagnifyingGlass
            size={20}
            className="mr-2"
          />
          Compare Supplier
        </Button>

        <span className="mt-2 text-center text-xs text-slate-500">
          MOQ: {s.minOrderQuantity} •{" "}
          {s.stock.toLocaleString()} in stock
        </span>
      </div>
    </motion.div>
  )
}