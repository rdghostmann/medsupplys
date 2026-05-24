// product-catalog.service.ts 
"use server"

import { connectToDB } from "@/lib/connectToDB"
import { Product } from "@/models/Product"

/**
 * Fetch all products from central catalog
 * Used for supplier inventory selection
 */
export async function getProductCatalog() {
  await connectToDB()

  const products = await Product.find({})
    .sort({ name: 1 })
    .lean()

  return JSON.parse(JSON.stringify(products))
}