// Refactored Verification Route

import { NextRequest, NextResponse } from "next/server"
import { connectToDB } from "@/lib/connectToDB"
import { Order } from "@/models/Order"
import { OrderEvent } from "@/models/OrderEvent"
import { OrderFulfillment } from "@/models/OrderFulfilment"
import { paystack } from "@/lib/paystack"

export async function GET(req: NextRequest) {
  try {
    await connectToDB()

    const { searchParams } = new URL(req.url)
    const reference = searchParams.get("reference")

    if (!reference) {
      return NextResponse.json({ message: "Reference missing" }, { status: 400 })
    }

    // 1. Verify with Paystack
    const response = await paystack.get(`/transaction/verify/${reference}`)
    const paymentData = response.data.data

    if (paymentData.status !== "success") {
      return NextResponse.json({ message: "Payment not successful" }, { status: 400 })
    }

    // 2. Atomic update to prevent duplicate processing
    const order = await Order.findOneAndUpdate(
      { paystackReference: reference, paymentStatus: "pending" },
      { paymentStatus: "paid", status: "supplier_contacted" },
      { new: true }
    )

    // If order is null, it means it's already "paid" or not found
    if (!order) {
      // Check if it exists at all to differentiate between "already processed" and "not found"
      const existing = await Order.findOne({ paystackReference: reference })
      if (!existing) return NextResponse.json({ message: "Order not found" }, { status: 404 })
      
      // If we reach here, it's already processed, just return success
      return NextResponse.json({ success: true, message: "Already processed" })
    }

    // 3. Create records only if the update above succeeded
    await Promise.all([
      OrderEvent.create({
        orderId: order._id,
        supplierId: order.supplierId,
        eventType: "SUPPLIER_NOTIFIED",
      }),
      OrderFulfillment.create({
        orderId: order._id,
        supplierId: order.supplierId,
        quantity: order.quantity,
        batchNumber: 1,
        status: "pending",
      })
    ])

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Verification error:", error.message)
    return NextResponse.json({ message: "Verification failed" }, { status: 500 })
  }
}

