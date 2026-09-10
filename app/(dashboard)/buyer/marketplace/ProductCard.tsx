// ProductCard.tsx
"use client"

import React from "react"
import {
  Package2,
  Snowflake,
  Sparkles,
  ShieldCheck,
  ShoppingCart,
} from "lucide-react"

import Image from "next/image"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import type { MarketplaceProduct } from "@/types"

interface ProductCardProps {
  product: MarketplaceProduct
  onProcure: (product: MarketplaceProduct) => void
}

export default function ProductCard({ product, onProcure }: ProductCardProps) {
  const isColdChain =
    product.requiresColdChain ||
    product.storageCondition?.toLowerCase().includes("refriger") ||
    product.storageCondition?.includes("2–8") ||
    product.storageCondition?.includes("2-8")

  return (
    <Card className="group overflow-hidden rounded-2xl border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg">
      <CardContent className="p-0">
        {/* Header */}
        <div className="relative border-b border-slate-100 bg-linear-to-br from-slate-50 to-white p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-blue-50 text-2xl">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  width={48}
                  height={48}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Package2 className="h-6 w-6 text-blue-600" />
              )}
            </div>

            <div className="flex flex-wrap justify-end gap-1.5">
              <Badge
                variant="secondary"
                className="rounded-full bg-blue-50 text-[10px] font-semibold tracking-wide text-blue-700 uppercase"
              >
                {product.category}
              </Badge>

              {isColdChain && (
                <Badge
                  variant="outline"
                  className="rounded-full border-cyan-200 bg-cyan-50 text-[10px] text-cyan-700"
                >
                  <Snowflake className="mr-1 h-3 w-3" />
                  Cold Chain
                </Badge>
              )}
            </div>
          </div>

          <div className="mt-4">
            <h3 className="line-clamp-2 text-base leading-6 font-bold text-slate-900">
              {product.name}
            </h3>

            {product.brandName && (
              <p className="mt-1 hidden text-xs font-medium text-slate-500">
                Brand: {product.brandName}
              </p>
            )}

            <p className="mt-1 text-sm text-slate-500">
              {product.activeIngredient}
              {product.strength ? ` • ${product.strength}` : ""}
            </p>
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-4 p-5">
          {product.description && (
            <p className="line-clamp-2 text-sm leading-5 text-slate-600">
              {product.description}
            </p>
          )}

          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              <div>
                <p className="text-[10px] font-semibold tracking-wide text-slate-400 uppercase">
                  Dosage Form
                </p>

                <p className="mt-0.5 text-xs font-medium text-slate-700">
                  {product.dosageForm}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-semibold tracking-wide text-slate-400 uppercase">
                  Unit
                </p>

                <p className="mt-0.5 text-xs font-medium text-slate-700">
                  {product.unit}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-semibold tracking-wide text-slate-400 uppercase">
                  Packaging
                </p>

                <p className="mt-0.5 line-clamp-2 text-xs font-medium text-slate-700">
                  {product.packSize || "Standard packaging"}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-semibold tracking-wide text-slate-400 uppercase">
                  Suppliers
                </p>

                <p className="mt-0.5 text-xs font-semibold text-slate-700">
                  {product.supplierCount} verified
                </p>
              </div>
            </div>

            {product.storageCondition && (
              <div className="mt-3 border-t border-slate-200 pt-3">
                <p className="text-[10px] font-semibold tracking-wide text-slate-400 uppercase">
                  Storage
                </p>

                <p className="mt-0.5 text-xs font-medium text-slate-700">
                  {product.storageCondition}
                </p>
              </div>
            )}
          </div>

          {/* Master Catalogue Reference Price */}
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold tracking-wide text-slate-400 uppercase">
                Reference Price
              </p>

              <p className="mt-0.5 text-lg font-bold text-slate-900">
                ₦{product.referenceBasePrice.toLocaleString()}
              </p>

              <p className="text-[10px] text-slate-400">per {product.unit}</p>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-emerald-600">
              <ShieldCheck className="h-3.5 w-3.5" />
              Admin Verified
            </div>
          </div>

          {/* Procurement Action */}
          <Button
            type="button"
            onClick={() => onProcure(product)}
            className="h-11 w-full rounded-xl bg-blue-600 font-semibold shadow-sm transition-all group-hover:shadow-md hover:bg-blue-700"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Procure Now
            <Sparkles className="ml-2 h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
