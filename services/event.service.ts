import { OrderEvent } from "@/models/OrderEvent"

export async function emitEvent({
  orderId,
  supplierId,
  eventType,
  metadata,
}: any) {
  return await OrderEvent.create({
    orderId,
    supplierId,
    eventType,
    metadata,
  })
}