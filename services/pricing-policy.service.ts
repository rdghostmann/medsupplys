// /services/pricing-policy.service.ts

export function validateSupplierSubmission({
  supplierPrice,
  proposedPrice,
  maxMarkupPercent = 130,
}: {
  supplierPrice: number
  proposedPrice: number
  maxMarkupPercent?: number
}) {
  const maxAllowed = proposedPrice * (maxMarkupPercent / 100)

  const isValid = supplierPrice <= maxAllowed

  return {
    isValid,
    maxAllowed,
    difference: supplierPrice - maxAllowed,
  }
}

export function validateSupplierPrice({
  supplierPrice,
  benchmarkPrice,
  maxMarkupPercent = 30, // ⚠️ realistic margin
}: {
  supplierPrice: number
  benchmarkPrice: number
  maxMarkupPercent?: number
}) {
  const maxAllowed = benchmarkPrice * (1 + maxMarkupPercent / 100)

  const isValid = supplierPrice <= maxAllowed

  return {
    isValid,
    maxAllowed,
    deviation: supplierPrice - benchmarkPrice,
  }
}


export function calculateFinalPrice({
  supplierPrice,
  commissionPercent,
}: {
  supplierPrice: number
  commissionPercent: number
}) {
  const commission = supplierPrice * (commissionPercent / 100)

  return {
    basePrice: supplierPrice,
    commission,
    totalPrice: supplierPrice + commission,
  }
}