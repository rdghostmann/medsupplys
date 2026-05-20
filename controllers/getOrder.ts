// /controllers/getOrder.ts
"use server"

import mongoose from "mongoose"
import { connectToDB } from "@/lib/connectToDB"
import { Order } from "@/models/Order"

export async function getOrderById(orderId: string) {
  try {
    await connectToDB()

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return null
    }

    const order = await Order.findById(orderId)
      .populate("buyerId", "firstName lastName email")
      .populate("supplierId", "supplierProfile.businessName email")
      .populate("productId", "name category pricing")
      .lean()

    if (!order) return null

    // Normalize MongoDB document → safe DTO
    return {
      ...order,
      _id: order._id.toString(),
      buyerId: order.buyerId
        ? {
            ...order.buyerId,
            _id: order.buyerId._id?.toString(),
          }
        : null,
      supplierId: order.supplierId
        ? {
            ...order.supplierId,
            _id: order.supplierId._id?.toString(),
          }
        : null,
      productId: order.productId
        ? {
            ...order.productId,
            _id: order.productId._id?.toString(),
          }
        : null,
    }
  } catch (error) {
    console.error("GET_ORDER_ERROR:", error)
    return null
  }
}