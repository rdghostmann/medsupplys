"use server"

import {
  createSupplierInventoryService,
  getSupplierInventoryService,
} from "@/services/supplier-inventory.service"

import { revalidatePath } from "next/cache"

// READ (SSR / cached-safe)
export async function getSupplierInventoryAction(supplierId: string) {
  return await getSupplierInventoryService(supplierId)
}

// WRITE (DB mutation)
export async function createSupplierInventoryAction(data: any) {
  const result = await createSupplierInventoryService(data)

  // 🔥 Important: invalidate cache after mutation
  revalidatePath("/supplier/inventory")

  return result
}