// app/(dashboard)/buyer/marketplace/components/ProductCard.tsx
"use client"

import Image from "next/image"

import { motion } from "framer-motion"

import { useRouter } from "next/navigation"

import {
  ChevronRight,
  Package2,
  Warehouse,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card"

import { Badge } from "@/components/ui/badge"

import { Button } from "@/components/ui/button"
import { useState } from "react"

type MarketplaceProduct = {
  _id: string

  product: {
    _id: string
    name: string
    category: string
    description: string
    image: string
  }

  suppliers: any[]
}

type Props = {
  product: MarketplaceProduct
}

export function ProductCard({
  product: mp,
}: Props) {
  const router = useRouter()

  const product = mp.product

  const suppliers =
    mp.suppliers || []

  const supplierCount =
    suppliers.length

  const totalStock =
    suppliers.reduce(
      (
        acc: number,
        supplier: any
      ) =>
        acc +
        (supplier.stock || 0),
      0
    )

  const lowestPrice =
    suppliers.length > 0
      ? Math.min(
          ...suppliers.map(
            (s: any) =>
              Number(
                s.price || 0
              )
          )
        )
      : 0

  const finalPrice =
    lowestPrice +
    lowestPrice * 0.1

  /* =====================================================
     STOCK STATUS
  ===================================================== */

  const stockStatus =
    totalStock <= 0
      ? "out"
      : totalStock < 50
        ? "low"
        : "available"

  const stockConfig = {
    available: {
      label: "Available",

      badge:
        "border-green-200 bg-green-50 text-green-700",

      gradient:
        "from-blue-50 to-indigo-100",

      button:
        "bg-blue-600 hover:bg-blue-700",
    },

    low: {
      label: "Low Stock",

      badge:
        "border-amber-200 bg-amber-50 text-amber-700",

      gradient:
        "from-amber-50 to-orange-100",

      button:
        "bg-amber-600 hover:bg-amber-700",
    },

    out: {
      label: "Out of Stock",

      badge:
        "border-red-200 bg-red-50 text-red-700",

      gradient:
        "from-red-50 to-red-100",

      button:
        "cursor-not-allowed bg-slate-300 hover:bg-slate-300",
    },
  }

  const [loading, setLoading] = useState(false)


  const stock =
    stockConfig[
      stockStatus as keyof typeof stockConfig
    ]

 const findSuppliers = async () => {
  if (stockStatus === "out") return

  try {
    setLoading(true)

    await router.push(
      `/buyer/marketplace/suppliers/${product._id}`
    )
  } finally {
    setLoading(false)
  }
}

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 8,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      whileHover={{
        y: -4,
      }}
      transition={{
        duration: 0.22,
      }}
      className="h-full"
    >
      <Card
        className="
          group
          flex
          h-full
          flex-col
          overflow-hidden
          border
          border-slate-200
          bg-white
          shadow-sm
          transition-all
          duration-300
          hover:border-blue-200
          hover:shadow-xl
        "
      >
        {/* =================================================
            IMAGE
        ================================================= */}

        <div
          className={`
            relative
            overflow-hidden
            py-2
            border-b
            border-slate-100
            bg-linear-to-br
            ${stock.gradient}
          `}
        >
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="
                object-cover
                transition-transform
                duration-500
                group-hover:scale-105
              "
            />
          ) : (
            <div
              className="
                flex
                h-full
                items-center
                text-5xl
              "
            >
              📦
            </div>
          )}

          {/* STOCK */}

          <div className="absolute right-3 top-3">
            <Badge
              variant="outline"
              className={`
                rounded-full
                border
                px-2.5
                py-1
                text-[10px]
                font-semibold
                shadow-sm
                ${stock.badge}
              `}
            >
              {stock.label}
            </Badge>
          </div>
        </div>

        {/* =================================================
            CONTENT
        ================================================= */}

        <CardContent
          className="
            flex
            flex-1
            flex-col
            space-y-4
            p-4
          "
        >
          {/* TITLE */}

          <div>
            <div
              className="
                mb-2
                flex
                items-start
                justify-between
                gap-3
              "
            >
              <div>
                <h3
                  className="
                    line-clamp-1
                    text-lg
                    font-bold
                    text-slate-900
                  "
                >
                  {product.name}
                </h3>

                <p
                  className="
                    mt-1
                    text-[11px]
                    uppercase
                    tracking-wide
                    text-slate-400
                  "
                >
                  {product.category}
                </p>
              </div>
            </div>

            <p
              className="
                line-clamp-2
                text-sm
                leading-relaxed
                text-slate-600
              "
            >
              {
                product.description
              }
            </p>
          </div>

          {/* META */}

          <div
            className="
              flex
              flex-col
              gap-2
              rounded-2xl
              bg-slate-50
              p-3
              text-sm
              text-slate-600
            "
          >
            <div className="flex items-center gap-2">
              <Warehouse size={14} />

              <span>
                {supplierCount} Supplier
                {supplierCount > 1
                  ? "s"
                  : ""}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Package2 size={14} />

              <span>
                {totalStock.toLocaleString()}{" "}
                Units Available
              </span>
            </div>
          </div>

          {/* PRICE */}

          <div className="mt-auto">
            <div
              className="
                flex
                items-end
                justify-between
                gap-3
              "
            >
              <div>
                <div
                  className="
                    text-2xl
                    font-black
                    tracking-tight
                    text-blue-600
                  "
                >
                  ₦
                  {finalPrice.toLocaleString()}

                  <span
                    className="
                      ml-1
                      text-[11px]
                      font-medium
                      text-slate-400
                    "
                  >
                    /unit
                  </span>
                </div>

                <p
                  className="
                    mt-1
                    text-[11px]
                    text-slate-400
                  "
                >
                  Includes 10% platform fee
                </p>
              </div>
            </div>
          </div>
        </CardContent>

        {/* =================================================
            FOOTER
        ================================================= */}

        <CardFooter
          className="
            border-t
            border-slate-100
            p-4
          "
        >
          <Button
            onClick={findSuppliers}
            disabled={loading}
            // disabled={loading || stockStatus === "out"}
            className={`
              h-11
              w-full
              rounded-2xl
              text-sm
              font-semibold
              transition-all
              ${stock.button}
            `}
          >
            {loading ? "Loading..." : "Find Suppliers"}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}