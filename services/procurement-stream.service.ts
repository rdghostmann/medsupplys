"use client"

import { useOrderStore } from "@/hooks/useOrderStore"
import { streamMatches } from "./matching-engine.service"


export async function startSupplierStream({
  suppliers,
  quantity,
}: {
  suppliers: any[]
  quantity: number
}) {
  const store =
    useOrderStore.getState()

  store.startStreaming()

  const results: any[] = []

  await streamMatches({
    suppliers,
    quantity,

    onUpdate: (supplier) => {
      results.push(supplier)

      const ranked = [...results].sort(
        (a, b) =>
          b.score - a.score
      )

      const best =
        ranked[0]?._id || null

      store.setStreamingSuppliers(
        supplier
      )

      store.setRankedSuppliers(
        ranked
      )

      store.setComparisonSuppliers(
        ranked.slice(0, 5)
      )

      if (best) {
        store.setBestSupplier(best)
      }
    },
  })

  store.finishStreaming()
}