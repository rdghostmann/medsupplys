// /services/supplier-inventory.service.ts
"use server"

import mongoose from "mongoose"
import { connectToDB } from "@/lib/connectToDB"
import { Product } from "@/models/Product"
import { SupplierInventory } from "@/models/SupplierInventory"

type CreateSupplierInventoryDTO = {
  supplierId: string
  productId: string
  supplierType: "importer" | "distributor" | "retailer"
  salesUnit?: "unit" | "pack" | "carton"
  basePrice: number
  stock: number
  reorderLevel?: number
  minOrderQuantity?: number
  maxOrderQuantity?: number
  warehouseLocation?: string
  batchInfo?: {
    batchNumber?: string
    expiryDate?: Date
    manufacturingDate?: Date
  }
}

export async function createSupplierInventory(data: CreateSupplierInventoryDTO) {
  try {
    await connectToDB()

    const {
      supplierId,
      productId,
      basePrice,
      stock,
      reorderLevel = 10,
      supplierType,
      salesUnit = "unit",
    } = data

    // -----------------------------
    // 1. Validation layer
    // -----------------------------
    if (!supplierId || !productId) {
      return { success: false, message: "Invalid supplier or product reference" }
    }

    if (basePrice <= 0) {
      return { success: false, message: "Base price must be greater than 0" }
    }

    if (stock < 0) {
      return { success: false, message: "Stock cannot be negative" }
    }

    // -----------------------------
    // 2. Ensure product exists
    // -----------------------------
    const product = await Product.findById(productId)

    if (!product) {
      return { success: false, message: "Product not found in catalog" }
    }

    // -----------------------------
    // 3. Prevent duplicate inventory entry
    // -----------------------------
    const existing = await SupplierInventory.findOne({
      supplierId,
      productId,
    })

    if (existing) {
      return {
        success: false,
        message: "Product already exists in supplier inventory",
      }
    }

    // -----------------------------
    // 4. Pricing engine
    // -----------------------------
    const commissionPercent = product.pricing?.commissionPercent ?? 10

    const commissionAmount = Math.round(
      basePrice * (commissionPercent / 100)
    )

    const finalPrice = basePrice + commissionAmount

    // -----------------------------
    // 5. Status engine (clean deterministic logic)
    // -----------------------------
    const status =
      stock === 0
        ? "out"
        : stock < reorderLevel
        ? "low"
        : "available"

    // -----------------------------
    // 6. Create inventory record
    // -----------------------------
    const inventory = await SupplierInventory.create({
      supplierId,
      productId,
      supplierType,
      salesUnit,
      basePrice,
      commissionPercent,
      commissionAmount,
      finalPrice,
      stock,
      reorderLevel,
      status,
      ...data.batchInfo && { batchInfo: data.batchInfo },
    })

    return {
      success: true,
      inventory: JSON.parse(JSON.stringify(inventory)),
    }
  } catch (error) {
    console.error("createSupplierInventory error:", error)

    return {
      success: false,
      message: "Failed to create supplier inventory",
    }
  }
}

export async function getSupplierInventory(supplierId?: string) {
  
  try {
    await connectToDB()

    if (!supplierId) {
      throw new Error("supplierId is required")
    }

    if (!mongoose.Types.ObjectId.isValid(supplierId)) {
      return []
    }

    const inventory = await SupplierInventory.find({
      supplierId,
      isActive: true,
    })
      .populate({
        path: "productId",
        select: "name category description images pricing",
      })
      .sort({ createdAt: -1 })
      .lean()

    return JSON.parse(JSON.stringify(inventory))
  } catch (error) {
    console.error("getSupplierInventory error:", error)
    return []
  }
}

