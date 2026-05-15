// app/(dashboard)/buyer/marketplace/components/ProductCatalogue.tsx
"use client"

import {
  useMemo,
  useState,
} from "react"

import {
  Package2,
  Search,
  SlidersHorizontal,
} from "lucide-react"

import { Input } from "@/components/ui/input"

import {
  Card,
  CardContent,
} from "@/components/ui/card"

import { Badge } from "@/components/ui/badge"

import { Button } from "@/components/ui/button"

import { ProductCard } from "./ProductCard"

export type MarketplaceProduct = {
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
  products: MarketplaceProduct[]
}

export function ProductCatalogue({
  products,
}: Props) {
  const [search, setSearch] =
    useState("")

  const [category, setCategory] =   useState("all")

  /* =====================================================
     CATEGORY LIST
  ===================================================== */

  const categories = useMemo(() => {
    const unique = new Set(
      products.map(
        (item) =>
          item.product.category
      )
    )

    return ["all", ...unique]
  }, [products])

  /* =====================================================
     FILTERED PRODUCTS
  ===================================================== */

  const filteredProducts =
    useMemo(() => {
      return products.filter(
        (item) => {
          const product =
            item.product

          const matchesSearch =
            product.name
              ?.toLowerCase()
              .includes(
                search.toLowerCase()
              ) ||
            product.description
              ?.toLowerCase()
              .includes(
                search.toLowerCase()
              )

          const matchesCategory =
            category === "all" ||
            product.category ===
              category

          return (
            matchesSearch &&
            matchesCategory
          )
        }
      )
    }, [
      products,
      search,
      category,
    ])

  return (
    <div
      className="
        space-y-5
        px-4
        pb-10
        lg:px-6
      "
    >
      {/* =================================================
          HEADER
      ================================================= */}

      <Card
        className="
          overflow-hidden
          rounded-3xl
          border-slate-200
          shadow-sm
        "
      >
        <CardContent className="space-y-5 p-4 sm:p-5">
          {/* TOP */}

          <div
            className="
              flex
              flex-col
              gap-4
              lg:flex-row
              lg:items-center
              lg:justify-between
            "
          >
            <div className="space-y-1">
              <h1
                className="
                  text-2xl
                  font-black
                  tracking-tight
                  text-blue-600
                "
              >
                Product Catalog
              </h1>

              <p
                className="
                  text-sm
                  text-muted-foreground
                "
              >
                Browse verified healthcare
                products from trusted
                suppliers.
              </p>
            </div>

            <Badge
              variant="outline"
              className="
                w-fit
                rounded-full
                border-blue-200
                bg-blue-50
                px-3
                py-1
                text-xs
                font-semibold
                text-blue-700
              "
            >
              <Package2
                size={13}
                className="mr-1"
              />

              {
                filteredProducts.length
              }{" "}
              Products
            </Badge>
          </div>

          {/* =================================================
              FILTER BAR
          ================================================= */}

          <div className="space-y-3">
            {/* SEARCH */}

            <div className="relative">
              <Search
                size={16}
                className="
                  absolute
                  left-3
                  top-1/2
                  -translate-y-1/2
                  text-slate-400
                "
              />

              <Input
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                placeholder="Search products..."
                className="
                  h-11
                  rounded-2xl
                  border-slate-200
                  bg-slate-50
                  pl-10
                  shadow-none
                  focus-visible:ring-1
                  focus-visible:ring-blue-500
                "
              />
            </div>

            {/* CATEGORY FILTERS */}

            <div
              className="
                flex
                gap-2
                overflow-x-auto
                pb-1
                scrollbar-none
              "
            >
              <Button
                size="sm"
                variant={
                  category === "all"
                    ? "default"
                    : "outline"
                }
                
                onClick={() =>
                  setCategory("all")
                }
                className="
                  h-9
                  shrink-0
                  rounded-xl
                  px-4
                  text-xs
                  opacity-80
                "
              >
                <SlidersHorizontal
                  size={13}
                  className="mr-1"
                />

                All
              </Button>

              {categories
                .filter(
                  (cat) =>
                    cat !== "all"
                )
                .map((cat) => (
                  <Button
                    key={cat}
                    size="sm"
                    variant={
                      category === cat
                        ? "default"
                        : "outline"
                    }
                    onClick={() =>
                      setCategory(cat)
                    }
                    className="
                      h-9
                      shrink-0
                      rounded-xl
                      px-4
                      text-xs
                      capitalize
                      opacity-80
                    "
                  >
                    {cat}
                  </Button>
                ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* =================================================
          PRODUCT GRID
      ================================================= */}

      {filteredProducts.length >
      0 ? (
        <div
          className="
            grid
            grid-cols-1
            gap-4
            sm:grid-cols-2
            xl:grid-cols-3
            2xl:grid-cols-4
          "
        >
          {filteredProducts.map(
            (item) => (
              <ProductCard
                key={item._id}
                product={item}
              />
            )
          )}
        </div>
      ) : (
        <div
          className="
            rounded-3xl
            border
            border-dashed
            border-slate-200
            bg-white
            px-6
            py-16
            text-center
          "
        >
          <div className="mb-4 text-5xl">
            📦
          </div>

          <h3
            className="
              text-base
              font-semibold
              text-slate-900
            "
          >
            No products found
          </h3>

          <p
            className="
              mt-1
              text-sm
              text-slate-500
            "
          >
            Try adjusting your search
            or filters
          </p>
        </div>
      )}
    </div>
  )
}