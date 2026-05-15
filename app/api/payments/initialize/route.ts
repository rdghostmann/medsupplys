// Refactored Code (Production Ready)

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { connectToDB } from "@/lib/connectToDB"
import { Order } from "@/models/Order"
import { OrderEvent } from "@/models/OrderEvent"
import { paystack } from "@/lib/paystack"
import { authOptions } from "@/auth"

export async function POST(req: NextRequest) {
  try {
    await connectToDB()

    const body = await req.json()
    const {
      productId, supplierId, quantity, supplierPrice, 
      totalPrice, commission, fulfillmentMode, candidateSuppliers, deliveryDetails,
    } = body

    // 1. Generate reference FIRST
    const reference = `ORD-${Date.now()}-${Math.random().toString(36).substring(7)}`

    // 2. Initialize Paystack payment before saving to DB
    // This prevents creating orders if Paystack is down
    const paystackRes = await paystack.post("/transaction/initialize", {
      email: session.user.email,
      amount: Math.round(totalPrice * 100), // Ensure amount is in kobo/cents
      reference,
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/buyer/verify-payment`,
      metadata: { buyerId: session.user.id },
    })

    // 3. Create the order after payment initialization succeeds
    const order = await Order.create({
      buyerId: session.user.id,
      productId,
      supplierId,
      quantity,
      supplierPrice,
      totalPrice,
      commission,
      fulfillmentMode,
      candidateSuppliers,
      deliveryDetails,
      paystackReference: reference,
      paymentStatus: "pending",
      status: "pending",
    })

    await OrderEvent.create({
      orderId: order._id,
      supplierId,
      eventType: "ORDER_CREATED",
      metadata: { totalPrice }
    })

    return NextResponse.json({
      authorizationUrl: paystackRes.data.data.authorization_url,
    })
  } catch (error: any) {
    console.error("Payment Init Error:", error.response?.data || error.message)
    return NextResponse.json(
      { message: "Unable to initialize payment" },
      { status: 500 }
    )
  }
}

