

// hooks/useOrderStore.ts
"use client"

import { create } from "zustand"

type Supplier = any

type Step = "idle" | "streaming" | "ready"

type OrderStore = {
  step: Step
  selectedProduct: any
  suppliers: Supplier[]
  streamedSuppliers: Supplier[]
  rankedSuppliers: Supplier[]
  comparisonSuppliers: Supplier[]
  bestSupplierId: string | null
  quantity: number
  search: string

  setSearch: (value: string) => void
  setSelectedProduct: (product: any) => void // ✅ Added setter
  setStreamingSuppliers: (supplier: Supplier) => void
  setRankedSuppliers: (suppliers: Supplier[]) => void
  setComparisonSuppliers: (suppliers: Supplier[]) => void
  setBestSupplier: (supplierId: string) => void
  startStreaming: () => void
  finishStreaming: () => void
  reset: () => void
}

export const useOrderStore = create<OrderStore>((set) => ({
  step: "idle",
  selectedProduct: null,
  suppliers: [],
  streamedSuppliers: [],
  rankedSuppliers: [],
  comparisonSuppliers: [],
  bestSupplierId: null,
  quantity: 1,
  search: "",

  setSearch: (value) => set({ search: value }),
  
  setSelectedProduct: (product) => set({ selectedProduct: product }), // ✅ Implementation

  startStreaming: () => set({ step: "streaming", streamedSuppliers: [] }),

  finishStreaming: () => set({ step: "ready" }),

  setStreamingSuppliers: (supplier) =>
    set((state) => ({
      streamedSuppliers: [...state.streamedSuppliers, supplier],
    })),

  setRankedSuppliers: (suppliers) => set({ rankedSuppliers: suppliers }),

  setComparisonSuppliers: (suppliers) => set({ comparisonSuppliers: suppliers }),

  setBestSupplier: (supplierId) => set({ bestSupplierId: supplierId }),

  reset: () =>
    set({
      step: "idle",
      streamedSuppliers: [],
      rankedSuppliers: [],
      comparisonSuppliers: [],
      bestSupplierId: null,
      selectedProduct: null, // ✅ Reset product
    }),
}))

