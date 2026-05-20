// app/(dashboard)/buyer/orders/[orderId]/page.tsx

import { getOrderById } from "@/controllers/getOrder"
import { connectToDB } from "@/lib/connectToDB"

type Props = {
  params: {
    orderId: string
  }
}

export default async function OrderPage({
  params,
}: Props) {
  const { orderId } = params

  await connectToDB()

  const order = await getOrderById(orderId)

  if (!order) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold">
          Order not found
        </h1>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">
        Order Details
      </h1>

      <div className="rounded-xl border p-4">
        <p>
          <span className="font-semibold">Order ID:</span>{" "}
          {order._id.toString()}
        </p>

        <p>
          <span className="font-semibold">Status:</span>{" "}
          {order.status}
        </p>

        <p>
          <span className="font-semibold">Payment:</span>{" "}
          {order.paymentStatus}
        </p>

        <p>
          <span className="font-semibold">Total:</span>{" "}
          ₦{order.totalPrice?.toLocaleString()}
        </p>
      </div>
    </div>
  )
}