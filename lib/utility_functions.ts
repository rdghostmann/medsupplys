// lib/utility_functions.ts
export function getLowestPrice(suppliers: any[]) {
  if (!suppliers?.length) return 0
  return Math.min(...suppliers.map((s) => s.price || 0))
}

export function getStockStatus(suppliers: any[]) {
  const totalStock = suppliers.reduce(
    (acc, s) => acc + (s.stock || 0),
    0
  )

  if (totalStock === 0) return "out"
  if (totalStock < 50) return "low"
  return "available"
}

export const ORDER_TRANSITIONS = {
  Pending: ["Supplier Contacted", "Cancelled"],
  "Supplier Contacted": ["Supplier Confirmed", "Cancelled"],
  "Supplier Confirmed": ["In Transit", "Cancelled"],
  "In Transit": ["Under Verification"],
  "Under Verification": ["Delivered", "Cancelled"],
  Delivered: [],
  Cancelled: [],
}

// export function canTransition(from: string, to: string) {
//   return ORDER_TRANSITIONS[from]?.includes(to)
// }