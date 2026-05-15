// supplier-response.service.ts
import { Order } from "@/models/Order"
import { emitEvent } from "./event.service"

export async function supplierResponse({
  orderId,
  supplierId,
  action,
}: {
  orderId: string
  supplierId: string
  action: "accept" | "reject"
}) {
  const order = await Order.findById(orderId)

  const supplierQueue = order.candidateSuppliers

  const target = supplierQueue.find(
    (s: any) => s.supplierId.toString() === supplierId
  )

  if (!target) throw new Error("Supplier not in queue")

  target.status = action === "accept" ? "accepted" : "rejected"

  await emitEvent({
    orderId,
    supplierId,
    eventType:
      action === "accept"
        ? "SUPPLIER_ACCEPTED"
        : "SUPPLIER_REJECTED",
  })

  // 🔥 If accepted → lock order
  if (action === "accept") {
    order.supplierId = supplierId
    order.status = "supplier_confirmed"

    await emitEvent({
      orderId,
      supplierId,
      eventType: "ORDER_ASSIGNED",
    })
  }

  await order.save()

  return order
}


export async function handleSupplierTimeout(orderId: string) {
  const order = await Order.findById(orderId)

  const nextSupplier = order.candidateSuppliers.find(
    (s: any) => s.status === "pending"
  )

  if (!nextSupplier) {
    order.status = "supplier_unresponsive"
    await order.save()

    await emitEvent({
      orderId,
      eventType: "TIMEOUT",
    })

    return null
  }

  return nextSupplier
}