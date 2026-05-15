// routing.service.ts
import { Order } from "@/models/Order"

/**
 * Builds a 3-supplier fallback queue
 * and attaches it to the order
 */
export async function buildSupplierQueue({
  orderId,
  suppliers,
}: {
  orderId: string
  suppliers: any[]
}) {
  const topSuppliers = suppliers.slice(0, 3)

  const queue = topSuppliers.map((s, index) => ({
    supplierId: s._id,
    rank: index + 1,
    status: "pending", // pending | accepted | rejected | timeout
    notifiedAt: null,
  }))

  await Order.findByIdAndUpdate(orderId, {
    candidateSuppliers: queue,
    status: "supplier_contacted",
  })

  return queue
}