// /api/order/route.ts

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"
import { connectToDB } from "@/lib/connectToDB"
import { Order } from "@/models/Order"
import { OrderEvent } from "@/models/OrderEvent"
import { paystack } from "@/lib/paystack"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    await connectToDB()

    const body = await request.json()
    const {
      productId, supplierId, quantity, supplierPrice, totalPrice,
      commission, candidateSuppliers, fulfillmentMode, deliveryDetails
    } = body

    // 1. Create the order in DB FIRST to get an _id
    const order = await Order.create({
      buyerId: session.user.id,
      productId,
      supplierId,
      quantity,
      supplierPrice,
      totalPrice,
      commission,
      fulfillmentMode,
      paymentStatus: "pending",
      status: "pending",
      candidateSuppliers,
      deliveryDetails
    })

    // 2. Initialize Paystack payment using axios instance
    // Note: paystack.post is used because 'paystack' is an axios instance
    const response = await paystack.post("/transaction/initialize", {
      email: session.user.email,
      amount: Math.round(totalPrice * 100),
      currency: "NGN",
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/buyer/orders/${order._id}/verify`,
      metadata: {
        orderId: order._id.toString(),
        buyerId: session.user.id,
        supplierId,
      },
    })

    const { status, data: paystackData } = response.data

    if (!status) {
      // Clean up: Delete order if payment init fails
      await Order.findByIdAndDelete(order._id)
      throw new Error("Paystack initialization failed")
    }

    // 3. Update the order with the Paystack reference
    order.paystackReference = paystackData.reference
    await order.save()

    // 4. Log the event
    await OrderEvent.create({
      orderId: order._id,
      supplierId,
      eventType: "ORDER_CREATED",
      metadata: { deliveryDetails },
    })

    return NextResponse.json({
      success: true,
      authorizationUrl: paystackData.authorization_url,
      reference: paystackData.reference,
      orderId: order._id,
    })

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Payment initialization failed"
    console.error("PAYMENT_INIT_ERROR:", error)
    
    return NextResponse.json(
      {
        success: false,
        message: message,
      },
      { status: 500 }
    )
  }
}

