// SupplierProductCard.tsx
"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import {
  ShoppingBag,
  Search,
  Plus,
  Minus,
  Building2,
  CheckCircle2,
} from "lucide-react"

/* ================= TYPES ================= */

type SupplierProductCardProps = {
  item: any
  onOrder: (item: any, qty: number) => void
  onCompare: () => void
  isBest?: boolean
}

type StockType = "available" | "low" | "out"

/* ================= CONFIG ================= */

const stockConfig: Record<
  StockType,
  { label: string; className: string }
> = {
  available: {
    label: "Available",
    className: "bg-green-100 text-green-700",
  },
  low: {
    label: "Low Stock",
    className: "bg-amber-100 text-amber-700",
  },
  out: {
    label: "Out of Stock",
    className: "bg-red-100 text-red-700",
  },
}

/* ================= COMPONENT ================= */

export default function SupplierProductCard({
  item,
  onOrder,
  onCompare,
  isBest,
}: SupplierProductCardProps) {
  const [qty, setQty] = useState(10)

  /* ================= NORMALIZATION ================= */

  const product = item?.product || {}
  const supplier = item?.supplier || {}
  const inventory = item?.inventory || {}

  const price = Number(inventory.pricePerUnit ?? 0)
  const stock = inventory.stock ?? 0
  const moq = inventory.moq ?? 1

  /* ================= STOCK STATUS ================= */

  const getStockStatus = (): StockType => {
    if (stock === 0) return "out"
    if (stock < 50) return "low"
    return "available"
  }

  const status = getStockStatus()
  const config = stockConfig[status]

  const isOut = status === "out"

  /* ================= HANDLERS ================= */

  const handleOrder = () => {
    onOrder(item, qty)
  }

  const handleCompare = () => {
    onCompare()
  }

  /* ================= UI ================= */

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden 
                 hover:shadow-xl hover:border-primary/20 transition-all 
                 group flex flex-col h-full"
    >
      {/* ================= IMAGE ================= */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-50">
        <Image
          src={product?.image || "/placeholder.png"}
          alt={product?.name || "product"}
          fill
          className="invisible object-cover group-hover:scale-110 transition-transform duration-700"
        />

        {/* STOCK BADGE */}
        {isBest && (
          <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm backdrop-blur bg-green-600 text-white flex items-center gap-1">
            <CheckCircle2 size={12} />
            Recommended Supplier
          </div>
        )}

        {/* CATEGORY */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-bold text-slate-500 uppercase tracking-widest border border-white/20">
          {product?.category}
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="p-5 flex-1 flex flex-col">
        {/* SUPPLIER */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <Building2 size={16} />
          </div>

          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase leading-none">
              {supplier?.supplierType}
            </p>
            <h4 className="text-sm font-bold text-slate-700 truncate">
              {supplier?.name}
            </h4>
          </div>
        </div>

        {/* PRODUCT */}
        <h3 className="text-lg font-bold text-slate-900 leading-tight mb-1">
          {product?.name}
        </h3>

        {/* PRICE */}
        <div className="flex items-baseline gap-1 mb-4">
          <span className="text-2xl font-black text-slate-900">
            ₦{price.toLocaleString()}
          </span>
          <span className="text-xs text-slate-400">/ unit</span>
        </div>

        {/* ================= ACTION AREA ================= */}
        <div className="mt-auto space-y-3">
          {/* QTY */}
          <div className="flex items-center justify-between bg-slate-50 rounded-2xl p-2 border border-slate-100">
            <div className="flex flex-col px-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                Qty
              </span>
              <span className="text-[10px] font-bold text-primary">
                Units
              </span>
            </div>

            <div className="flex items-center gap-4 bg-white rounded-xl px-3 py-1 shadow-sm border border-slate-100">
              <button
                onClick={() => setQty((q) => Math.max(moq, q - 1))}
                className="p-1 hover:bg-slate-50 rounded-md text-slate-400 hover:text-primary"
              >
                <Minus size={14} />
              </button>

              <span className="font-mono font-bold text-slate-700 min-w-[2ch] text-center">
                {qty}
              </span>

              <button
                onClick={() => setQty((q) => q + 1)}
                className="p-1 hover:bg-slate-50 rounded-md text-slate-400 hover:text-primary"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="grid gap-2">
            <button
              disabled={isOut}
              onClick={handleOrder}
              className="w-full py-3.5 bg-primary hover:bg-primary/90 disabled:bg-slate-200 
                         text-white rounded-2xl font-bold flex items-center justify-center gap-2 
                         transition-all active:scale-[0.98] shadow-lg shadow-primary/20"
            >
              <ShoppingBag size={18} />
              Order Now
            </button>

            <button
              onClick={handleCompare}
              className="w-full py-3 text-slate-500 hover:text-primary hover:bg-primary/5 
                         rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all"
            >
              <Search size={18} />
              Compare Suppliers
            </button>
          </div>

          {/* FOOTER META */}
          <p className="text-[10px] text-center text-slate-400 font-medium">
            MOQ: {moq} units • {stock} in stock
          </p>
        </div>
      </div>
      
    </motion.div>
  )
}