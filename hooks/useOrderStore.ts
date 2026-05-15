// Thank you for sharing the complete flow! I have identified the root causes of
// the bugs you are experiencing.

// 🐛 The Bugs Identified:

// 1.  The ID Mismatch Bug (Supplier Not Found): In
//     buyer/procurement-wizard/[productId]/page.tsx, you passed
//     selectedSupplier?._id (which is the User ID) to the Wizard. However, inside
//     ProcurementWizard.tsx, it searches for supplier.supplierProductId ===
//     initialSupplierId. Because these IDs don't match, the Wizard fails to find
//     the supplier and defaults to the "Supplier Not Found" error state.
// 2.  React Anti-Pattern in SupplierPool: In SupplierPool.tsx, you were updating
//     the Zustand store (setRankedSuppliers and setComparisonSuppliers) inside a
//     useMemo block during the render phase. This is an anti-pattern that breaks
//     state updates. It needs to be moved to a useEffect.
// 3.  Missing Zustand Store Population: The [Order Now] button simply navigated
//     the user but never actually prepared/saved the selectedProduct or
//     bestSupplierId into the Zustand store as required for your fallback "Compare
//     Suppliers" logic.

// Here is the production-ready fixed code snippet for the affected files:

// 1. Fix the Zustand Store (hooks/useOrderStore.ts)

// We need to add the ability to set the selectedProduct to prepare the data for
// the Wizard.

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

