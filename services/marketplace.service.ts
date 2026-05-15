// services/marketplace.service.ts
"use server"

import { unstable_cache } from "next/cache"

import { connectToDB } from "@/lib/connectToDB"

import "@/models/User"
import "@/models/Product"
import "@/models/SupplierProduct"

import { SupplierProduct } from "@/models/SupplierProduct"

import {
  generateMatches,
  streamMatches,
} from "@/services/matching-engine.service"
import { Supplier } from "@/types"

/* =========================================================
   TYPES
========================================================= */

export type MarketplaceProduct = {
  _id: string

  product: {
    _id: string
    name: string
    category: string
    description: string
    image: string
  }

  suppliers: Supplier[]

  metrics: {
    supplierCount: number
    totalStock: number
    lowestPrice: number
    highestPrice: number
    averagePrice: number
  }
}

/* =========================================================
   HELPERS
========================================================= */

function computeMetrics(
  suppliers: Supplier[]
) {
  if (!suppliers.length) {
    return {
      supplierCount: 0,
      totalStock: 0,
      lowestPrice: 0,
      highestPrice: 0,
      averagePrice: 0,
    }
  }

  const prices = suppliers.map(
    (s) => s.price || 0
  )

  return {
    supplierCount: suppliers.length,

    totalStock: suppliers.reduce(
      (acc, s) => acc + (s.stock || 0),
      0
    ),

    lowestPrice: Math.min(...prices),

    highestPrice: Math.max(...prices),

    averagePrice:
      prices.reduce((a, b) => a + b, 0) /
      prices.length,
  }
}

/* =========================================================
   PROCUREMENT TYPES
========================================================= */

export type ProcurementMatch =
  Supplier & {
    score: number

    rank: number

    reasons: string[]

    recommendation: {
      isRecommended: boolean
      confidence: number
      badges: string[]
    }
  }

/* =========================================================
   MARKETPLACE FETCH
========================================================= */

async function _getMarketplaceProducts(): Promise<
  MarketplaceProduct[]
> {
  await connectToDB()

  const supplierProducts =
    await SupplierProduct.find()
      .populate(
        "supplierId",
        "name supplierType supplierProfile"
      )
      .populate("productId")
      .lean()

  const grouped: Record<
    string,
    MarketplaceProduct
  > = {}

  supplierProducts.forEach((sp: any) => {
    const productId =
      sp.productId?._id?.toString()

    if (!productId) return

    if (!grouped[productId]) {
      grouped[productId] = {
        _id: productId,

        product: {
          _id: productId,

          name: sp.productId?.name,

          category:
            sp.productId?.category,

          description:
            sp.productId?.description,

          image:
            sp.productId?.images
              ?.primary || "",
        },

        suppliers: [],

        metrics: computeMetrics([]),
      }
    }

    grouped[productId].suppliers.push({
      _id:
        sp.supplierId?._id?.toString(),

      supplierProductId:
        sp._id.toString(),

      name:
        sp.supplierId?.supplierProfile
          ?.businessName ||
        sp.supplierId?.name ||
        "Unknown Supplier",

      supplierType:
        sp.supplierType ||
        sp.supplierId
          ?.supplierType ||
        "retailer",

      price: Number(sp.price ?? 0),

      stock: Number(sp.stock ?? 0),

      minOrderQuantity: Number(
        sp.minOrderQuantity ?? 1
      ),

      supplierProfile: {
        businessName:
          sp.supplierId
            ?.supplierProfile
            ?.businessName,

        logo:
          sp.supplierId
            ?.supplierProfile?.logo,
      },
    })
  })

  return Object.values(grouped).map(
    (item) => ({
      ...item,

      metrics: computeMetrics(
        item.suppliers
      ),
    })
  )
}

/* =========================================================
   CACHED FETCH
========================================================= */

export const getMarketplaceProducts =
  unstable_cache(
    async () => {
      return await _getMarketplaceProducts()
    },
    ["marketplace-products"],
    {
      tags: ["marketplace-products"],

      revalidate: 60,
    }
  )

/* =========================================================
   PROCUREMENT INTELLIGENCE ENGINE
========================================================= */

export async function getProcurementIntelligence({
  suppliers,
  quantity,
}: {
  suppliers: Supplier[]
  quantity: number
}) {
  const ranked = generateMatches({
    suppliers,
    quantity,
  })

  const enriched: ProcurementMatch[] = ranked.map(
    (supplier: any, index: number) => ({
      ...supplier,

      rank: index + 1,

      recommendation: {
        isRecommended: index === 0,

        confidence:
          supplier.score >= 100
            ? 98
            : supplier.score >= 80
              ? 92
              : 80,

        badges: [
          index === 0
            ? "✨ Best Match"
            : "",

          supplier.stock >= quantity
            ? "In Stock"
            : "",

          supplier.supplierType === "importer"
            ? "Importer Pricing"
            : "",

          supplier.price < 5000
            ? "Cost Efficient"
            : "",
        ].filter(Boolean),
      },
    })
  )

  return {
    recommendedSupplier:
      enriched[0] ?? null,

    comparisonSuppliers:
      enriched.slice(0, 5),

    rankedSuppliers: enriched,
  }
}

/* ======================================================
   STREAMING PROCUREMENT ENGINE
========================================================= */

export async function streamProcurementIntelligence({
  suppliers,
  quantity,
}: {
  suppliers: Supplier[]
  quantity: number
}) {
  const streamedResults: ProcurementMatch[] = []

  await streamMatches({
    suppliers,
    quantity,

    onUpdate: (supplier) => {
      const normalizedSupplier: ProcurementMatch = {
        _id: supplier._id,

        supplierProductId:
          supplier.supplierProductId,

        name: supplier.name,

        supplierType:
          supplier.supplierType,

        price: supplier.price,

        stock: supplier.stock,

        minOrderQuantity:
          supplier.minOrderQuantity,

        supplierProfile:
          supplier.supplierProfile,

        score: supplier.score ?? 0,

        reasons:
          supplier.reasons ?? [],

        rank:
          streamedResults.length + 1,

        recommendation: {
          isRecommended:
            streamedResults.length === 0,

          confidence: 90,

          badges: ["AI Ranked"],
        },
      }

      streamedResults.push(
        normalizedSupplier
      )
    },
  })

  const ranked = streamedResults.sort(
    (a, b) => b.score - a.score
  )

  return {
    recommendedSupplier:
      ranked[0] ?? null,

    comparisonSuppliers:
      ranked.slice(0, 5),

    rankedSuppliers: ranked,
  }
}

/* =========================================================
   SUPPLIER CHECKOUT SNAPSHOT
========================================================= */

export async function createSupplierCheckoutSnapshot({
  product,
  supplier,
  quantity,
}: {
  product: any
  supplier: ProcurementMatch
  quantity: number
}) {
  return {
    createdAt: new Date(),

    procurementSnapshot: {
      score: supplier.score,

      rank: supplier.rank,

      reasons: supplier.reasons,

      confidence:
        supplier.recommendation.confidence,
    },

    supplierSnapshot: {
      supplierId: supplier._id,

      name: supplier.name,

      supplierType:
        supplier.supplierType,

      unitPrice: supplier.price,

      stock: supplier.stock,
    },

    productSnapshot: {
      productId: product._id,

      name: product.name,

      category: product.category,

      image: product.image,
    },

    orderSnapshot: {
      quantity,

      subtotal:
        supplier.price * quantity,
    },
  }
}




