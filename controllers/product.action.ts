// /controllers/product.action.ts

"use server";

import { connectToDB } from "@/lib/connectToDB";
import { Product } from "@/models/Product";
import { MasterProduct, ProductStatus } from "@/types";


export async function findAllMasterProducts(): Promise<MasterProduct[]> {
  try {
    await connectToDB();

    const products = await Product.find({})
      .sort({ createdAt: -1 })
      .lean();

    return products.map((product) => ({
      id: String(product._id),

      name: product.name ?? "",

      category: product.category ?? "",

      description: product.description ?? "",

      activeIngredient: product.activeIngredient ?? "",

      strength: product.strength ?? "",

      dosageForm: product.dosageForm ?? "",

      unit: product.unit ?? "",

      packSize: product.packSize ?? "",

      nafdacRegNumber: product.nafdacRegNumber ?? "",

      referenceBasePrice: Number(
        product.referenceBasePrice ?? 0
      ),

      commissionPercent: Number(
        product.commissionPercent ?? 0
      ),

      maxMarkupPercent: Number(
        product.maxMarkupPercent ?? 0
      ),

      status: (product.status ?? "ACTIVE") as ProductStatus,

      storageCondition: product.storageCondition ?? "",

      image: product.image ?? undefined,
    }));
  } catch (error) {
    console.error(
      "findAllMasterProducts error:",
      error
    );

    throw new Error(
      "Failed to fetch master product catalogue."
    );
  }
}