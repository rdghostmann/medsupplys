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

export async function getSupplierInventory(
  supplierId: string
) {
  try {
    await connectToDB()

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
      }).sort({ createdAt: -1 }).lean()

    return JSON.parse(JSON.stringify(inventory))
  } catch (error) {
    console.error("getSupplierInventory error:", error)
    return []
  }
}


===================================================================

// import { connectToDB } from "@/lib/connectToDB"
// import { SupplierInventory } from "@/models/SupplierInventory"

export async function getSupplierInventoryService(supplierId: string) {
  await connectToDB()

  const inventory = await SupplierInventory.find({ supplierId })
    .populate("productId")
    .sort({ createdAt: -1 })
    .lean()

  return JSON.parse(JSON.stringify(inventory))
}


import { connectToDB } from "@/lib/connectToDB"
import { SupplierInventory } from "@/models/SupplierInventory"
import { Product } from "@/models/Product"

export async function createSupplierInventoryService(data: any) {
  try {
    await connectToDB()

    const product = await Product.findById(data.productId)

    if (!product) {
      return {
        success: false,
        message: "Product not found",
      }
    }

    const commissionPercent = product.pricing?.commissionPercent ?? 10

    const commissionAmount = data.basePrice * (commissionPercent / 100)
    const finalPrice = data.basePrice + commissionAmount

    const status =
      data.stock <= 0
        ? "out"
        : data.stock <= data.reorderLevel
        ? "low"
        : "available"

    const inventory = await SupplierInventory.create({
      supplierId: data.supplierId,
      productId: data.productId,
      supplierType: data.supplierType,
      salesUnit: data.salesUnit ?? "unit",

      basePrice: data.basePrice,
      commissionPercent,
      commissionAmount,
      finalPrice,

      stock: data.stock ?? 0,
      reorderLevel: data.reorderLevel ?? 10,
      minOrderQuantity: data.minOrderQuantity ?? 1,
      maxOrderQuantity: data.maxOrderQuantity,

      batchInfo: data.batchInfo,
      warehouseLocation: data.warehouseLocation,

      status,
      isActive: true,
      isFlagged: false,
    })

    return {
      success: true,
      inventory: JSON.parse(JSON.stringify(inventory)),
    }
  } catch (error) {
    console.error("Inventory Create Error:", error)

    return {
      success: false,
      message: "Failed to create inventory",
    }
  }
}