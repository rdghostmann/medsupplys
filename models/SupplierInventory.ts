// /models/SupplierInventory.ts

import { Schema, model, models } from "mongoose"

const SupplierInventorySchema = new Schema(
  {
    supplierId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },

    supplierProductId: {
      type: Schema.Types.ObjectId,
      ref: "SupplierProduct",
    },

    supplierType: {
      type: String,
      enum: ["importer", "distributor", "retailer"],
      required: true,
    },

    salesUnit: {
      type: String,
      enum: ["unit", "pack", "carton"],
      default: "unit",
    },

    basePrice: {
      type: Number,
      required: true,
      min: 0,
    },

    commissionPercent: {
      type: Number,
      default: 10,
    },

    commissionAmount: {
      type: Number,
      required: true,
    },

    finalPrice: {
      type: Number,
      required: true,
    },

    stock: {
      type: Number,
      default: 0,
      min: 0,
    },

    minOrderQuantity: {
      type: Number,
      default: 1,
    },

    maxOrderQuantity: {
      type: Number,
    },

    reorderLevel: {
      type: Number,
      default: 10,
    },

    batchInfo: {
      batchNumber: String,
      expiryDate: Date,
      manufacturingDate: Date,
    },

    warehouseLocation: {
      type: String,
    },

    verificationImages: [
      {
        url: String,
        label: String,
      },
    ],

    status: {
      type: String,
      enum: ["available", "low", "out", "on-request"],
      default: "available",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isFlagged: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

SupplierInventorySchema.index({
  supplierId: 1,
  productId: 1,
})

export const SupplierInventory =  models.SupplierInventory ||  model("SupplierInventory", SupplierInventorySchema)