// /models/Order.ts
import mongoose, { Schema, model, models } from "mongoose"

const OrderSchema = new Schema(
  {
    
    buyerId: { type: Schema.Types.ObjectId, ref: "User" },
    productId: { type: Schema.Types.ObjectId, ref: "Product" },

    supplierId: { type: Schema.Types.ObjectId, ref: "User" },

    quantity: Number,

    supplierPrice: Number,
    commission: Number,
    totalPrice: Number,

    candidateSuppliers: [
      {
        supplierId: { type: Schema.Types.ObjectId, ref: "User" },
        status: {
          type: String,
          enum: ["pending", "accepted", "rejected", "unresponsive"],
          default: "pending",
        },
        position: Number, // 🧠 ranking order
        notifiedAt: Date,
      },
    ],

    fulfillmentMode: {
      type: String,
      enum: ["single", "partial"],
      default: "single",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },

    paystackReference: {
      type: String,
    },

    paymentMethod: {
      type: String,
      default: "paystack",
    },

    deliveryDetails: {
      contactName: String,
      phone: String,
      address: String,
      deliveryDate: String,
      notes: String,
    },

    status: {
      type: String,
      enum: ["pending", "supplier_contacted", "supplier_confirmed", "in_transit", "under_verification", "verified", "delivered", "cancelled",
      ],
      default: "pending",
    },
  },
  { timestamps: true }
)

export const Order = models.Order || model("Order", OrderSchema)