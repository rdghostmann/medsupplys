// tierPricing.ts
export function getTierPricing(basePrice: number, type: string) {
  switch (type) {
    case "importer":
      return {
        price: basePrice * 0.75,
        stock: 200 + Math.floor(Math.random() * 200),
        minOrderQuantity: 50,
      }

    case "distributor":
      return {
        price: basePrice * 0.9,
        stock: 80 + Math.floor(Math.random() * 120),
        minOrderQuantity: 20,
      }

    case "retailer":
      return {
        price: basePrice * 1.15,
        stock: 10 + Math.floor(Math.random() * 50),
        minOrderQuantity: 1,
      }

    default:
      return {
        price: basePrice,
        stock: 50,
        minOrderQuantity: 1,
      }
  }
}

export function calcOrderTotal(
  units: number,
  unitPrice: number
) {
  if (!units || !unitPrice) return 0

  return units * unitPrice
}