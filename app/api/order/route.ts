import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/auth" // Ensure this path is correct
import { connectToDB } from "@/lib/connectToDB"
import { Order } from "@/models/Order"
import { OrderEvent } from "@/models/OrderEvent"
import { paystack } from "@/lib/paystack"

export async function POST(request: NextRequest) {
    try {

    

        const body = await request.json()
        const { 
            productId, supplierId, quantity, supplierPrice, totalPrice, 
            commission, candidateSuppliers, fulfillmentMode, deliveryDetails 
        } = body

        // 1. Initialize Paystack payment FIRST
        // If this fails, we don't pollute the DB with partial/failed orders
       const response = await paystack.transaction.initialize({
            email: session.user.email!,
            amount: Math.round(totalPrice * 100),
            currency: "NGN",
            callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/buyer/orders/${order._id}/verify`,

            metadata: {
                orderId: order._id.toString(),
                buyerId: session.user.id,
                supplierId,
            },
        })

        if (!response.status) {
            throw new Error("Paystack initialization failed")
        }

        await connectToDB()

        // 2. Create the order with the returned reference
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
            paystackReference: response.data.reference, // Store the ref here
            deliveryDetails
        })

        // 3. Log the event
        await OrderEvent.create({
            orderId: order._id,
            supplierId,
            eventType: "ORDER_CREATED",
            metadata: { deliveryDetails },
        })

        return NextResponse.json({
            success: true,
            authorizationUrl: response.data.authorization_url,
            reference: response.data.reference,
            orderId: order._id,
        })
        
    } catch (error: any) {
        console.error("PAYMENT_INIT_ERROR:", error.message || error)
        return NextResponse.json(
            {
                success: false,
                message: error.message || "Payment initialization failed",
            },
            { status: 500 }
        )
    }
}

