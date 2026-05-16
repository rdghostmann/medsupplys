// /api/payments/initialize/route.ts

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { connectToDB } from "@/lib/connectToDB"
import { Order } from "@/models/Order"
import { OrderEvent } from "@/models/OrderEvent"
import { paystack } from "@/lib/paystack"
import { authOptions } from "@/auth"

// Define a type for the error response structure
interface PaystackError {
  response?: {
    data?: {
      message?: string
    }
  }
  message?: string
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    await connectToDB()
    const body = await req.json()
    const {
      productId, supplierId, quantity, supplierPrice,
      totalPrice, commission, fulfillmentMode, candidateSuppliers, deliveryDetails
    } = body

    const reference = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000000)}`

    // Create Order
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

    
    // Initialize Paystack
    const paystackRes = await paystack.post("/transaction/initialize", {
      email: session.user.email,
      amount: Math.round(totalPrice * 100),
      reference,
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/buyer/orders/${order._id}/verify?reference=${reference}`,
      // callback_url: `${process.env.NEXT_LOCAL_APP_URL}/buyer/orders/${order._id}/verify?reference=${reference}`,
      metadata: {
        buyerId: session.user.id,
        productId,
        supplierId,
        orderId: order._id.toString(),

      },
    })


    return NextResponse.json({
      authorizationUrl: paystackRes.data.data.authorization_url
    })
  } catch (error: unknown) {
    // Type-safe error handling
    const err = error as PaystackError;
    const errorMessage = err.response?.data?.message || err.message || "Payment initialization failed";

    console.error("Payment Init Error:", errorMessage);

    return NextResponse.json(
      { message: errorMessage },
      { status: 500 }
    )
  }
}

