// /services/fulfillment.service.ts

export function splitFulfillment({
  requestedQty,
  availableQty,
}: {
  requestedQty: number
  availableQty: number
}) {
  if (availableQty >= requestedQty) {
    return [
      {
        batchNumber: 1,
        quantity: requestedQty,
        status: "complete",
      },
    ]
  }

  return [
    {
      batchNumber: 1,
      quantity: availableQty,
      status: "delivered",
    },
    {
      batchNumber: 2,
      quantity: requestedQty - availableQty,
      status: "pending",
    },
  ]
}