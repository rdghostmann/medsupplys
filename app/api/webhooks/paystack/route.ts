// /api/webhooks/paystack/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/connectToDB";
import { Order } from "@/models/Order";
import { OrderEvent } from "@/models/OrderEvent";
import { OrderFulfillment } from "@/models/OrderFulfilment";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("x-paystack-signature");

  // Validate signature
  const hash = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!)
    .update(body)
    .digest("hex");

  if (hash !== signature) {
    return NextResponse.json({ message: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(body);

  if (event.event === "charge.success") {
    const { reference } = event.data;

    await connectToDB();

    const order = await Order.findOneAndUpdate(
      { paystackReference: reference, paymentStatus: "pending" },
      { paymentStatus: "paid", status: "supplier_contacted" },
      { new: true }
    );

     if (order) {
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
          status: "pending",
        })
      ]);
    }
  }

  return NextResponse.json({ received: true });
}