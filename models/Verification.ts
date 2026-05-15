// /models/Verification.ts
import mongoose, { Schema, model, models } from "mongoose"

const VerificationSchema = new Schema(
  {
    orderId: { type: Schema.Types.ObjectId, ref: "Order" },
    pharmacistId: { type: Schema.Types.ObjectId, ref: "User" },

    batchNumber: String,
    expiryDate: Date,
    barcode: String,

    status: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
)

export const Verification =
  models.Verification || model("Verification", VerificationSchema)