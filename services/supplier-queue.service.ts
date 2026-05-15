// supplier-queue.service.ts
import { Order } from "@/models/Order"
import { emitEvent } from "./event.service"

export async function processSupplierResponse({
  orderId,
  supplierId,
  action,
}: any) {
  const order = await Order.findById(orderId)

  const supplier = order.candidateSuppliers.find(
    (s: any) => s.supplierId.toString() === supplierId
  )

  if (!supplier) throw new Error("Not in queue")

  supplier.status = action === "accept" ? "accepted" : "rejected"

  await emitEvent({
    orderId,
    supplierId,
    eventType:
      action === "accept"
        ? "SUPPLIER_ACCEPTED"
        : "SUPPLIER_REJECTED",
  })

  // 🧠 IF ACCEPTED → LOCK ORDER
  if (action === "accept") {
    order.supplierId = supplierId
    order.status = "supplier_confirmed"

    await emitEvent({
      orderId,
      supplierId,
      eventType: "ORDER_ASSIGNED",
    })

    await order.save()
    return order
  }

  // 🧠 IF REJECTED → MOVE TO NEXT SUPPLIER
  const nextSupplier = order.candidateSuppliers.find(
    (s: any) => s.status === "pending"
  )

  if (nextSupplier) {
    await emitEvent({
      orderId,
      supplierId: nextSupplier.supplierId,
      eventType: "SUPPLIER_PINGED",
    })
  } else {
    order.status = "supplier_unresponsive"
  }

  await order.save()

  return order
}

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

  const queue = order.candidateSuppliers

  const current = queue.find(
    (s: any) => s.supplierId.toString() === supplierId
  )

  if (!current) throw new Error("Supplier not in queue")

  current.status = action === "accept" ? "accepted" : "rejected"

  // ✅ ACCEPT FLOW
  if (action === "accept") {
    order.supplierId = supplierId
    order.status = "supplier_confirmed"

    await order.save()
    return order
  }

  // ❌ REJECT FLOW → move to next
  const next = queue.find((s: any) => s.status === "pending")

  if (next) {
    next.notifiedAt = new Date()

    await emitEvent({
      orderId,
      supplierId: next.supplierId,
      eventType: "SUPPLIER_PINGED",
    })
  } else {
    order.status = "supplier_unresponsive"
  }

  await order.save()
  return order
}