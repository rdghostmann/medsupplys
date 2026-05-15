// services/matching-engine.service.ts

import { validateSupplierPrice } from "./pricing-policy.service"

/* =========================================================
   TYPES
========================================================= */

export type Supplier = {
  _id: string

  supplierProductId: string

  name: string

  supplierType:
  | "importer"
  | "distributor"
  | "retailer"

  price: number

  stock: number

  minOrderQuantity: number

  // ✅ ADD THIS
  supplierProfile?: {
    businessName?: string
    logo?: string
  }

  rating?: number

  responseRate?: number

  fulfillmentRate?: number
}

export type RankedSupplier =
  Supplier & {
    rank: number

    score: number

    reasons: string[]

    recommendation: {
      isRecommended: boolean
      confidence: number
      badges: string[]
    }
  }

type GenerateMatchesArgs = {
  suppliers: Supplier[]

  quantity: number
}

type StreamMatchesArgs = {
  suppliers: Supplier[]

  quantity: number

  onUpdate?: (
    supplier: RankedSupplier
  ) => void
}

/* =========================================================
   PROCUREMENT AI ENGINE
========================================================= */

export function generateMatches({
  suppliers,
  quantity,
}: GenerateMatchesArgs): RankedSupplier[] {
  if (!suppliers?.length) {
    return []
  }

  const marketAveragePrice =
    suppliers.reduce(
      (sum, supplier) =>
        sum + (supplier.price || 0),
      0
    ) / suppliers.length

  const ranked = suppliers.map(
    (supplier) => {
      let score = 0

      const reasons: string[] =
        []

      const badges: string[] =
        []

      /* ====================================================
         PRICE EFFICIENCY
      ==================================================== */

      const priceScore =
        1000 /
        (supplier.price || 1)

      score += priceScore

      reasons.push(
        `Competitive pricing at ₦${supplier.price.toLocaleString()}/unit`
      )

      /* ====================================================
         PRICE VALIDATION
      ==================================================== */

      const validation =
        validateSupplierPrice({
          supplierPrice:
            supplier.price,

          benchmarkPrice:
            marketAveragePrice,
        })

      if (validation.isValid) {
        score += 25

        badges.push(
          "Market Safe"
        )

        reasons.push(
          "Price validated within market range"
        )
      } else {
        score -= 200

        badges.push(
          "Price Risk"
        )

        reasons.push(
          "Price exceeds acceptable market deviation"
        )
      }

      /* ====================================================
         STOCK SUFFICIENCY
      ==================================================== */

      if (
        supplier.stock >= quantity
      ) {
        score += 50

        badges.push("In Stock")

        reasons.push(
          "Sufficient inventory available"
        )
      } else {
        score -= 75

        badges.push(
          "Low Inventory"
        )

        reasons.push(
          "Inventory below requested quantity"
        )
      }

      /* ====================================================
         MOQ VALIDATION
      ==================================================== */

      if (
        quantity <
        supplier.minOrderQuantity
      ) {
        score -= 100

        badges.push(
          "MOQ Restriction"
        )

        reasons.push(
          "Order quantity below supplier MOQ"
        )
      }

      /* ====================================================
         SUPPLIER PRIORITY
      ==================================================== */

      switch (
      supplier.supplierType
      ) {
        case "importer":
          score += 35

          badges.push(
            "Importer Advantage"
          )

          reasons.push(
            "Importer pricing advantage"
          )

          break

        case "distributor":
          score += 20

          badges.push(
            "Balanced Distribution"
          )

          reasons.push(
            "Distributor balance efficiency"
          )

          break

        case "retailer":
          score += 10

          badges.push(
            "Fast Fulfillment"
          )

          reasons.push(
            "Retail fast delivery advantage"
          )

          break
      }

      /* ====================================================
         RELATIVE MARKET POSITION
      ==================================================== */

      const deviation =
        supplier.price -
        marketAveragePrice

      if (deviation < 0) {
        score += 15

        reasons.push(
          "Below market average"
        )
      }

      if (
        deviation >
        marketAveragePrice * 0.2
      ) {
        score -= 25

        reasons.push(
          "Above acceptable market premium"
        )
      }

      /* ====================================================
         RATING BONUS
      ==================================================== */

      if (supplier.rating) {
        score +=
          supplier.rating * 5

        reasons.push(
          `Supplier reliability rating: ${supplier.rating}/5`
        )
      }

      /* ====================================================
         FULFILLMENT BONUS
      ==================================================== */

      if (
        supplier.fulfillmentRate
      ) {
        score +=
          supplier.fulfillmentRate *
          0.2

        reasons.push(
          `Fulfillment success: ${supplier.fulfillmentRate}%`
        )
      }

      return {
        ...supplier,

        score:
          Math.round(score),

        rank: 0,

        reasons,

        recommendation: {
          isRecommended: false,

          confidence: 0,

          badges,
        },
      }
    }
  )

  const sorted = ranked.sort(
    (a, b) =>
      b.score - a.score
  )

  return sorted.map(
    (supplier, index) => {
      const topScore =
        sorted[0]?.score || 1

      const confidence =
        Math.max(
          60,
          Math.min(
            99,
            Math.round(
              (supplier.score /
                topScore) *
              100
            )
          )
        )

      return {
        ...supplier,

        rank: index + 1,

        recommendation: {
          ...supplier.recommendation,

          isRecommended:
            index === 0,

          confidence,
        },
      }
    }
  )
}

/* =========================================================
   LIVE PROCUREMENT STREAM ENGINE
========================================================= */

export async function streamMatches({
  suppliers,
  quantity,
  onUpdate,
}: StreamMatchesArgs): Promise<
  RankedSupplier[]
> {
  const streamed: RankedSupplier[] =
    []

  const ranked =
    generateMatches({
      suppliers,
      quantity,
    })

  for (const supplier of ranked) {
    streamed.push({
      ...supplier,
    })

    onUpdate?.({
      ...supplier,
    })

    await new Promise(
      (resolve) =>
        setTimeout(resolve, 120)
    )
  }

  return streamed
}