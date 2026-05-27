// useInventoryStore.ts
import { create } from "zustand"
import type { InventoryProduct } from "@/types"

type InventoryUIState = {
  editingProduct: InventoryProduct | null
  isEditOpen: boolean

  openEdit: (product: InventoryProduct) => void
  closeEdit: () => void
}

export const useInventoryUIStore = create<InventoryUIState>((set) => ({
  editingProduct: null,
  isEditOpen: false,

  openEdit: (product) =>
    set({
      editingProduct: product,
      isEditOpen: true,
    }),

  closeEdit: () =>
    set({
      editingProduct: null,
      isEditOpen: false,
    }),
}))