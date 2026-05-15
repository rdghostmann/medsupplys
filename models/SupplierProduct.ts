// /models/SupplierProduct.ts
import { Schema, model, models } from "mongoose";

const SupplierProductSchema = new Schema(
  {
    supplierId: { type: Schema.Types.ObjectId, ref: "User" },
    productId: { type: Schema.Types.ObjectId, ref: "Product" },

    supplierType: {
      type: String,
      enum: ["importer", "distributor", "retailer"],
    },

    salesUnit: {
      type: String,
      enum: ["unit", "pack", "carton"],
      default: "unit",
    },

    price: Number,
    stock: Number,
    minOrderQuantity: { type: Number, default: 1 },
    maxOrderQuantity: Number,

    verificationImages: [
      {
        url: String,
        label: String, // e.g. "batch", "warehouse", "packaging"
      }
    ],


    status: {
      type: String,
      enum: ["available", "low", "out", "on-request"],
      default: "available",
    },

    isFlagged: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const SupplierProduct =  models.SupplierProduct || model("SupplierProduct", SupplierProductSchema);