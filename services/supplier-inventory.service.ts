// /services/supplier-inventory.service.ts
"use server"

import mongoose from "mongoose"
import { connectToDB } from "@/lib/connectToDB"
import { Product } from "@/models/Product"
import { SupplierInventory } from "@/models/SupplierInventory"
import { InventoryProduct } from "@/types"

type CreateSupplierInventoryDTO = {
  supplierId: string
  productId: string
  supplierType: "importer" | "distributor" | "retailer"
  salesUnit?: "unit" | "pack" | "carton"
  basePrice: number
  stock: number
  nafdacNumber: string
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

type SupplierInventoryLean = {
  _id: mongoose.Types.ObjectId

  supplierType: "importer" | "distributor" | "retailer"

  salesUnit?: "unit" | "pack" | "carton"

  basePrice?: number
  commissionAmount?: number
  finalPrice?: number

  stock?: number
  minOrderQuantity?: number

  nafdacNumber?: string

  batchInfo?: {
    batchNumber?: string
    expiryDate?: Date
    manufacturingDate?: Date
  }

  productId?: {
    _id?: mongoose.Types.ObjectId
    name?: string
    category?: string
    unit?: string
    moq?: number
    type?: "IMPORTER" | "DISTRIBUTOR"
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
      nafdacNumber: data.nafdacNumber,
      batchInfo: data.batchInfo,
      minOrderQuantity: data.minOrderQuantity,
      maxOrderQuantity: data.maxOrderQuantity,
      warehouseLocation: data.warehouseLocation,
      status,
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
  supplierId?: string
): Promise<InventoryProduct[]> {
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
        select: "name category pricing unit moq type",
      })
      .sort({ createdAt: -1 })
      .lean<SupplierInventoryLean[]>()

    return inventory.map((item) => ({
      id: item._id.toString(),

      productId: item.productId?._id?.toString() ?? "",

      name: item.productId?.name ?? "Unknown Product",

      category: item.productId?.category ?? "General",

      nafdacNumber: item.nafdacNumber ?? "",

      batchInfo: {
        batchNumber:
          item.batchInfo?.batchNumber ?? undefined,

        expiryDate: item.batchInfo?.expiryDate
          ? new Date(item.batchInfo.expiryDate)
          : undefined,

        manufacturingDate:
          item.batchInfo?.manufacturingDate
            ? new Date(item.batchInfo.manufacturingDate)
            : undefined,
      },

      type:
        item.supplierType === "importer"
          ? "IMPORTER"
          : "DISTRIBUTOR",

      unit: item.salesUnit ?? "unit",

      basePrice: item.basePrice ?? 0,

      commission: item.commissionAmount ?? 0,

      finalPrice: item.finalPrice ?? 0,

      stock: item.stock ?? 0,

      moq: item.minOrderQuantity ?? 1,
    }))
  } catch (error) {
    console.error("getSupplierInventory error:", error)

    return []
  }
}

export async function updateInventoryItem({
  id,
  basePrice,
  stock,
  batchInfo,
}: {
  id: string
  basePrice: number
  stock: number
  batchInfo: {
    batchNumber?: string
    expiryDate?: Date
    manufacturingDate?: Date
  }
}) {
  await connectToDB()

  const commission = Math.round(basePrice * 0.1)
  const finalPrice = basePrice + commission

  await SupplierInventory.findByIdAndUpdate(id, {
    basePrice,
    stock,
    batchInfo,
    commission,
    finalPrice,
  })

  return { success: true }
}

