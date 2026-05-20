// /services/order.service.ts

import { Order } from "@/models/Order"
import { Product } from "@/models/Product"
import { calculateFinalPrice } from "./pricing-policy.service"

export async function createOrder(data: any) {
  const product = await Product.findById(data.productId)

  if (!product) {
    throw new Error("Product not found")
  }

  const pricing = product.pricing

  if (!pricing?.commissionPercent) {
    throw new Error("Invalid product pricing configuration")
  }

  const { commission, totalPrice } = calculateFinalPrice({
    supplierPrice: data.supplierPrice,
    commissionPercent: pricing.commissionPercent,
  })

  return await Order.create({
    ...data,
    commission,
    totalPrice,
  })
}

export async function buildSupplierQueue({
  orderId,
  suppliers,
}: {
  orderId: string
  suppliers: any[]
}) {
  const queue = suppliers.slice(0, 3).map((s, index) => ({
    supplierId: s._id,
    position: index + 1,
    status: "pending",
    notifiedAt: index === 0 ? new Date() : null,
  }))

  await Order.findByIdAndUpdate(orderId, {
    candidateSuppliers: queue,
    status: "supplier_contacted",
  })

  return queue
}