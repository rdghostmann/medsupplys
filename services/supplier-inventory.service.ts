// /services/supplier-inventory.service.ts
"use server"

import mongoose from "mongoose"
import { Product } from "@/models/Product"
import { SupplierInventory } from "@/models/SupplierInventory"

import { connectToDB } from "@/lib/connectToDB"

type CreateSupplierInventoryPayload = {
  supplierId: string
  productId: string

  supplierProductId?: string

  supplierType:
  | "importer"
  | "distributor"
  | "retailer"

  salesUnit?: "unit" | "pack" | "carton"

  basePrice: number

  stock: number

  minOrderQuantity?: number
  maxOrderQuantity?: number

  reorderLevel?: number

  warehouseLocation?: string

  batchInfo?: {
    batchNumber?: string
    expiryDate?: Date | string
    manufacturingDate?: Date | string
  }

  verificationImages?: {
    url: string
    label: string
  }[]
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

export async function createSupplierInventory(
  data: CreateSupplierInventoryPayload
) {
  try {
    await connectToDB()

    // ---------------------------------------
    // VALIDATE OBJECT IDS
    // ---------------------------------------

    if (!mongoose.Types.ObjectId.isValid(data.supplierId)) {
      return {
        success: false,
        message: "Invalid supplier ID",
      }
    }

    if (!mongoose.Types.ObjectId.isValid(data.productId)
    ) {
      return {
        success: false,
        message: "Invalid product ID",
      }
    }

    // ---------------------------------------
    // CHECK PRODUCT EXISTS
    // ---------------------------------------

    const product = await Product.findById(
      data.productId
    ).lean()

    if (!product) {
      return {
        success: false,
        message: "Product not found",
      }
    }

    // ---------------------------------------
    // PREVENT DUPLICATE INVENTORY
    // ---------------------------------------

    const existingInventory =
      await SupplierInventory.findOne({
        supplierId: data.supplierId,
        productId: data.productId,
        isActive: true,
      })

    if (existingInventory) {
      return {
        success: false,
        message: "Product already exists in supplier inventory",
      }
    }

    // ---------------------------------------
    // SANITIZE NUMBERS
    // ---------------------------------------

    const basePrice = Number(data.basePrice || 0)
    const stock = Number(data.stock || 0)
    const reorderLevel = Number(data.reorderLevel || 10)

    const minOrderQuantity = Number(data.minOrderQuantity || 1)

    const maxOrderQuantity = data.maxOrderQuantity ? Number(data.maxOrderQuantity) : undefined

    if (basePrice <= 0) {
      return {
        success: false,
        message:  "Base price must be greater than zero",
      }
    }

    if (stock < 0) {
      return {
        success: false,
        message: "Stock cannot be a negative value",
      }
    }

    // ---------------------------------------
    // COMMISSION LOGIC
    // ---------------------------------------

    const commissionPercent = product?.pricing?.commissionPercent || 10
    const commissionAmount = (basePrice * commissionPercent) / 100
    const finalPrice = basePrice + commissionAmount

    // ---------------------------------------
    // STATUS LOGIC
    // ---------------------------------------

    let status:
      | "available"
      | "low"
      | "out"
      | "on-request" = "available"

    if (stock <= 0) {
      status = "out"
    } else if (stock <= reorderLevel) {
      status = "low"
    }

    // ---------------------------------------
    // CREATE INVENTORY
    // ---------------------------------------

    const inventory =
      await SupplierInventory.create({
        supplierId: data.supplierId,
        productId: data.productId,
        supplierProductId: data.supplierProductId || undefined,
        supplierType: data.supplierType,
        salesUnit: data.salesUnit || "unit",
        basePrice,
        commissionPercent,
        commissionAmount,
        finalPrice,
        stock,
        minOrderQuantity,
        maxOrderQuantity,
        reorderLevel,
        warehouseLocation: data.warehouseLocation || "",
        batchInfo: {
          batchNumber: data.batchInfo?.batchNumber || "",
          expiryDate: data.batchInfo?.expiryDate
            ? new Date(data.batchInfo.expiryDate)
            : undefined,
          manufacturingDate: data.batchInfo?.manufacturingDate
            ? new Date(data.batchInfo.manufacturingDate)
            : undefined,
        },
        verificationImages: data.verificationImages || [],
        status,
        isActive: true,
      })

    return {
      success: true,
      message: "Product successfully added to inventory",
      inventory: JSON.parse(JSON.stringify(inventory)),
    }
  } catch (error) {
    console.error("createSupplierInventory error:", error)

    return {
      success: false,
      message: error instanceof Error ? error.message
        : "Failed to create supplier inventory",
    }
  }
}