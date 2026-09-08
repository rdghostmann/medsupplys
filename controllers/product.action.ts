// /controllers/product.action.ts

"use server";

import { connectToDB } from "@/lib/connectToDB";
import { Product } from "@/models/Product";
import { SupplierProduct } from "@/models/SupplierProduct";
import { User } from "@/models/User";
import { MasterProduct, ProductStatus } from "@/types";

export interface SupplierInventoryRecord {
  id: string;
  productId: string;
  supplierName: string;
  supplierType: "Importer" | "Distributor" | "Retailer";
  stock: number;
  basePrice: number;
  fulfillmentRate: number;
}

const normalizeSupplierType = (
  value?: string
): SupplierInventoryRecord["supplierType"] => {
  switch (value?.toLowerCase()) {
    case "importer":
      return "Importer";
    case "retailer":
      return "Retailer";
    default:
      return "Distributor";
  }
};

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

export async function findAllSupplierProductInventory(): Promise<
  SupplierInventoryRecord[]
> {
  try {
    await connectToDB();

    const supplierProducts = await SupplierProduct.find({
      isFlagged: false,
      status: {
        $in: ["AVAILABLE", "LOW_STOCK", "OUT_OF_STOCK", "ON_REQUEST"],
      },
    })
      .select(
        "_id productId supplierId supplierType stock basePrice fulfillmentRate"
      )
      .sort({ createdAt: -1 })
      .lean();

    const supplierIds = supplierProducts.map(
      (supplierProduct) => supplierProduct.supplierId
    );

    const suppliers = await User.find({
      _id: { $in: supplierIds },
    })
      .select("_id firstName lastName username organizationName")
      .lean();

    const supplierMap = new Map(
      suppliers.map((supplier) => [
        supplier._id.toString(),
        supplier,
      ])
    );

    return supplierProducts.map((supplierProduct) => {
      const supplier = supplierMap.get(
        supplierProduct.supplierId.toString()
      );

      return {
        id: supplierProduct._id.toString(),
        productId: supplierProduct.productId.toString(),
        supplierName:
          supplier?.organizationName ||
          supplier?.username ||
          [supplier?.firstName, supplier?.lastName]
            .filter(Boolean)
            .join(" ") ||
          "Unknown Supplier",
        supplierType: normalizeSupplierType(
          supplierProduct.supplierType
        ),
        stock: Number(supplierProduct.stock || 0),
        basePrice: Number(supplierProduct.basePrice || 0),
        fulfillmentRate: Number(
          supplierProduct.fulfillmentRate || 0
        ),
      };
    });
  } catch (error) {
    console.error(
      "findAllSupplierProductInventory error:",
      error
    );

    throw new Error(
      "Failed to fetch supplier product inventory."
    );
  }
}