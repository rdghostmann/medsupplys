// /models/OrderFulfillment.ts
import mongoose, { Schema, model, models } from "mongoose"

const FulfillmentSchema = new Schema(
  {
    orderId: { type: Schema.Types.ObjectId, ref: "Order" },
    supplierId: { type: Schema.Types.ObjectId, ref: "User" },

    batchNumber: Number,
    quantity: Number,

    status: {
      type: String,
      enum: ["pending", "in_transit", "delivered"],
      default: "pending",
    },
  },
  { timestamps: true }
)

export const OrderFulfillment = models.OrderFulfillment || model("OrderFulfillment", FulfillmentSchema)