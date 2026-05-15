// /models/Product.ts
import mongoose, { Schema, model, models } from "mongoose"

const ProductSchema = new Schema(
  {
    name: String,
    category: String,
    description: String,
    images: {
      primary: String, // main image URL
      gallery: [String], // optional
    },

    pricing: {
      proposedPrice: Number,
      commissionPercent: Number,
      maxMarkupPercent: {
        type: Number,
        default: 130, // critical rule
      },
    },
  },
  { timestamps: true }
)

export const Product = models.Product || model("Product", ProductSchema)