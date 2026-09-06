// lib/seed/supplier-products.seed.ts

import { connectToDB } from "@/lib/connectToDB";
import { Types } from "mongoose";

import { Product } from "@/models/Product";
import {
  SupplierProduct,
  type SupplierProductStatus,
  type SupplierType,
} from "@/models/SupplierProduct";
import { User } from "@/models/User";

type SupplierInventorySeed = {
  productId: string;
  supplierId: string;
  basePrice: number;
  stock: number;
  minOrderQuantity: number;
  maxOrderQuantity: number;
  batchNumber: string;
  expiryDate: string;
  manufacturingDate: string;
  rating: number;
  fulfillmentRate: number;
  deliveryDays: number;
};

/**
 * These IDs are application-level seed identifiers.
 *
 * They are NOT MongoDB ObjectIds.
 */
const supplierUsernameMap: Record<
  string,
  string
> = {
  "sup-may-baker": "may-baker",
  "sup-fidson": "fidson-healthcare",
  "sup-neimeth": "neimeth-pharmaceuticals",
  "sup-emzor": "emzor-pharmaceuticals",
  "sup-swipha": "swipha",
  "sup-juhel": "juhel-nigeria",
  "sup-healthplus": "healthplus-b2b",
  "sup-medplus": "medplus-pharmacy",
  "sup-mopheth": "mopheth-pharmacy",
};

export const supplierProducts: SupplierInventorySeed[] =
  [
    // ============================================================
    // PARACETAMOL
    // ============================================================

    {
      productId: "prod-paracetamol-500",
      supplierId: "sup-may-baker",
      basePrice: 950,
      stock: 12000,
      minOrderQuantity: 50,
      maxOrderQuantity: 10000,
      batchNumber: "MB-PCM-2401",
      expiryDate: "2027-08-30",
      manufacturingDate: "2024-08-01",
      rating: 4.9,
      fulfillmentRate: 99.4,
      deliveryDays: 1,
    },

    {
      productId: "prod-paracetamol-500",
      supplierId: "sup-fidson",
      basePrice: 980,
      stock: 8500,
      minOrderQuantity: 40,
      maxOrderQuantity: 8000,
      batchNumber: "FD-PCM-2409",
      expiryDate: "2027-05-15",
      manufacturingDate: "2024-07-10",
      rating: 4.8,
      fulfillmentRate: 98.8,
      deliveryDays: 2,
    },

    {
      productId: "prod-paracetamol-500",
      supplierId: "sup-neimeth",
      basePrice: 1020,
      stock: 6000,
      minOrderQuantity: 20,
      maxOrderQuantity: 5000,
      batchNumber: "NM-PCM-2404",
      expiryDate: "2027-01-20",
      manufacturingDate: "2024-06-15",
      rating: 4.7,
      fulfillmentRate: 97.5,
      deliveryDays: 2,
    },

    {
      productId: "prod-paracetamol-500",
      supplierId: "sup-emzor",
      basePrice: 1100,
      stock: 15000,
      minOrderQuantity: 10,
      maxOrderQuantity: 12000,
      batchNumber: "EM-PCM-2412",
      expiryDate: "2027-11-10",
      manufacturingDate: "2024-09-01",
      rating: 4.9,
      fulfillmentRate: 99.1,
      deliveryDays: 1,
    },

    {
      productId: "prod-paracetamol-500",
      supplierId: "sup-swipha",
      basePrice: 1140,
      stock: 4500,
      minOrderQuantity: 10,
      maxOrderQuantity: 4000,
      batchNumber: "SW-PCM-2402",
      expiryDate: "2027-04-18",
      manufacturingDate: "2024-05-20",
      rating: 4.6,
      fulfillmentRate: 96.9,
      deliveryDays: 2,
    },

    {
      productId: "prod-paracetamol-500",
      supplierId: "sup-juhel",
      basePrice: 1180,
      stock: 7000,
      minOrderQuantity: 10,
      maxOrderQuantity: 6000,
      batchNumber: "JH-PCM-2407",
      expiryDate: "2026-12-05",
      manufacturingDate: "2024-04-10",
      rating: 4.5,
      fulfillmentRate: 95.0,
      deliveryDays: 3,
    },

    {
      productId: "prod-paracetamol-500",
      supplierId: "sup-healthplus",
      basePrice: 1280,
      stock: 1200,
      minOrderQuantity: 2,
      maxOrderQuantity: 1000,
      batchNumber: "HP-PCM-2410",
      expiryDate: "2027-09-12",
      manufacturingDate: "2024-09-05",
      rating: 4.4,
      fulfillmentRate: 94.2,
      deliveryDays: 1,
    },

    // ============================================================
    // AMOXICILLIN
    // ============================================================

    {
      productId: "prod-amoxicillin-500",
      supplierId: "sup-may-baker",
      basePrice: 2700,
      stock: 5000,
      minOrderQuantity: 20,
      maxOrderQuantity: 4000,
      batchNumber: "MB-AMX-2403",
      expiryDate: "2027-06-30",
      manufacturingDate: "2024-07-01",
      rating: 4.9,
      fulfillmentRate: 99.3,
      deliveryDays: 1,
    },

    {
      productId: "prod-amoxicillin-500",
      supplierId: "sup-emzor",
      basePrice: 2850,
      stock: 8000,
      minOrderQuantity: 10,
      maxOrderQuantity: 7000,
      batchNumber: "EM-AMX-2408",
      expiryDate: "2027-10-15",
      manufacturingDate: "2024-08-10",
      rating: 4.9,
      fulfillmentRate: 99.0,
      deliveryDays: 1,
    },

    {
      productId: "prod-amoxicillin-500",
      supplierId: "sup-fidson",
      basePrice: 2890,
      stock: 4200,
      minOrderQuantity: 15,
      maxOrderQuantity: 3500,
      batchNumber: "FD-AMX-2405",
      expiryDate: "2027-03-20",
      manufacturingDate: "2024-06-01",
      rating: 4.8,
      fulfillmentRate: 98.5,
      deliveryDays: 2,
    },

    // ============================================================
    // ARTEMETHER / LUMEFANTRINE
    // ============================================================

    {
      productId:
        "prod-artemether-lumefantrine",
      supplierId: "sup-may-baker",
      basePrice: 13800,
      stock: 2500,
      minOrderQuantity: 5,
      maxOrderQuantity: 2000,
      batchNumber: "MB-ACT-2408",
      expiryDate: "2027-09-30",
      manufacturingDate: "2024-08-15",
      rating: 4.9,
      fulfillmentRate: 99.5,
      deliveryDays: 1,
    },

    {
      productId:
        "prod-artemether-lumefantrine",
      supplierId: "sup-swipha",
      basePrice: 14200,
      stock: 1800,
      minOrderQuantity: 5,
      maxOrderQuantity: 1500,
      batchNumber: "SW-ACT-2404",
      expiryDate: "2027-02-14",
      manufacturingDate: "2024-05-10",
      rating: 4.7,
      fulfillmentRate: 97.8,
      deliveryDays: 2,
    },

    {
      productId:
        "prod-artemether-lumefantrine",
      supplierId: "sup-healthplus",
      basePrice: 15100,
      stock: 600,
      minOrderQuantity: 1,
      maxOrderQuantity: 500,
      batchNumber: "HP-ACT-2411",
      expiryDate: "2027-11-20",
      manufacturingDate: "2024-09-01",
      rating: 4.5,
      fulfillmentRate: 95.5,
      deliveryDays: 1,
    },

    // ============================================================
    // IBUPROFEN
    // ============================================================

    {
      productId: "prod-ibuprofen-400",
      supplierId: "sup-neimeth",
      basePrice: 1750,
      stock: 4500,
      minOrderQuantity: 20,
      maxOrderQuantity: 4000,
      batchNumber: "NM-IBU-2401",
      expiryDate: "2027-07-15",
      manufacturingDate: "2024-07-01",
      rating: 4.8,
      fulfillmentRate: 98.2,
      deliveryDays: 2,
    },

    {
      productId: "prod-ibuprofen-400",
      supplierId: "sup-emzor",
      basePrice: 1820,
      stock: 9000,
      minOrderQuantity: 10,
      maxOrderQuantity: 8000,
      batchNumber: "EM-IBU-2405",
      expiryDate: "2027-12-01",
      manufacturingDate: "2024-08-20",
      rating: 4.9,
      fulfillmentRate: 99.0,
      deliveryDays: 1,
    },

    // ============================================================
    // VITAMIN C
    // ============================================================

    {
      productId: "prod-vitamin-c-1000",
      supplierId: "sup-fidson",
      basePrice: 8100,
      stock: 2200,
      minOrderQuantity: 5,
      maxOrderQuantity: 1800,
      batchNumber: "FD-VTC-2406",
      expiryDate: "2027-04-10",
      manufacturingDate: "2024-06-01",
      rating: 4.8,
      fulfillmentRate: 98.6,
      deliveryDays: 2,
    },

    {
      productId: "prod-vitamin-c-1000",
      supplierId: "sup-medplus",
      basePrice: 8900,
      stock: 850,
      minOrderQuantity: 1,
      maxOrderQuantity: 500,
      batchNumber: "MP-VTC-2410",
      expiryDate: "2027-08-15",
      manufacturingDate: "2024-08-01",
      rating: 4.5,
      fulfillmentRate: 95.0,
      deliveryDays: 1,
    },

    // ============================================================
    // METFORMIN
    // ============================================================

    {
      productId: "prod-metformin-500",
      supplierId: "sup-may-baker",
      basePrice: 2100,
      stock: 6500,
      minOrderQuantity: 15,
      maxOrderQuantity: 5000,
      batchNumber: "MB-MET-2404",
      expiryDate: "2027-05-20",
      manufacturingDate: "2024-06-10",
      rating: 4.9,
      fulfillmentRate: 99.4,
      deliveryDays: 1,
    },

    {
      productId: "prod-metformin-500",
      supplierId: "sup-swipha",
      basePrice: 2280,
      stock: 3500,
      minOrderQuantity: 10,
      maxOrderQuantity: 3000,
      batchNumber: "SW-MET-2407",
      expiryDate: "2027-01-30",
      manufacturingDate: "2024-05-15",
      rating: 4.7,
      fulfillmentRate: 97.1,
      deliveryDays: 2,
    },

    // ============================================================
    // OMEPRAZOLE
    // ============================================================

    {
      productId: "prod-omeprazole-20",
      supplierId: "sup-neimeth",
      basePrice: 3050,
      stock: 4000,
      minOrderQuantity: 10,
      maxOrderQuantity: 3500,
      batchNumber: "NM-OMP-2402",
      expiryDate: "2027-08-10",
      manufacturingDate: "2024-07-20",
      rating: 4.7,
      fulfillmentRate: 98.0,
      deliveryDays: 2,
    },

    {
      productId: "prod-omeprazole-20",
      supplierId: "sup-juhel",
      basePrice: 3300,
      stock: 2800,
      minOrderQuantity: 5,
      maxOrderQuantity: 2500,
      batchNumber: "JH-OMP-2405",
      expiryDate: "2027-03-15",
      manufacturingDate: "2024-06-05",
      rating: 4.5,
      fulfillmentRate: 96.0,
      deliveryDays: 3,
    },

    // ============================================================
    // COUGH SYRUP
    // ============================================================

    {
      productId: "prod-cough-syrup",
      supplierId: "sup-emzor",
      basePrice: 23200,
      stock: 950,
      minOrderQuantity: 2,
      maxOrderQuantity: 800,
      batchNumber: "EM-CSY-2409",
      expiryDate: "2026-11-20",
      manufacturingDate: "2024-08-10",
      rating: 4.9,
      fulfillmentRate: 99.2,
      deliveryDays: 1,
    },

    // ============================================================
    // ORS
    // ============================================================

    {
      productId: "prod-ors-sachets",
      supplierId: "sup-may-baker",
      basePrice: 6100,
      stock: 4000,
      minOrderQuantity: 10,
      maxOrderQuantity: 3500,
      batchNumber: "MB-ORS-2405",
      expiryDate: "2027-09-10",
      manufacturingDate: "2024-07-15",
      rating: 4.9,
      fulfillmentRate: 99.5,
      deliveryDays: 1,
    },

    // ============================================================
    // AMLODIPINE
    // ============================================================

    {
      productId: "prod-amlodipine-5",
      supplierId: "sup-fidson",
      basePrice: 2400,
      stock: 5200,
      minOrderQuantity: 10,
      maxOrderQuantity: 4500,
      batchNumber: "FD-AML-2407",
      expiryDate: "2027-06-25",
      manufacturingDate: "2024-06-20",
      rating: 4.8,
      fulfillmentRate: 98.7,
      deliveryDays: 2,
    },
  ];

export async function seedSupplierProducts() {
  await connectToDB();

  const results = {
    created: [] as string[],
    updated: [] as string[],
    failed: [] as {
      productId: string;
      supplierId: string;
      error: string;
    }[],
  };

  /**
   * Resolve all Product IDs.
   */
  const productIds = new Map<
    string,
    {
      _id: Types.ObjectId;
      unit: string;
      commissionPercent: number;
    }
  >();

  const productSeedIds = [
    ...new Set(
      supplierProducts.map(
        (item) => item.productId
      )
    ),
  ];

  const allProducts =
    await Product.find({
      name: {
        $exists: true,
      },
    }).select(
      "_id name category referenceBasePrice commissionPercent maxMarkupPercent"
    );

  /**
   * Match the seed product IDs to Product names.
   */
  const productNameMap: Record<
    string,
    string
  > = {
    "prod-paracetamol-500":
      "Paracetamol 500mg Tablets",

    "prod-amoxicillin-500":
      "Amoxicillin 500mg Capsules",

    "prod-ibuprofen-400":
      "Ibuprofen 400mg Film-Coated Tablets",

    "prod-artemether-lumefantrine":
      "Artemether 80mg + Lumefantrine 480mg (ACT Forte)",

    "prod-vitamin-c-1000":
      "Vitamin C 1000mg Effervescent Tablets",

    "prod-metformin-500":
      "Metformin Hydrochloride 500mg Tablets",

    "prod-omeprazole-20":
      "Omeprazole 20mg Delayed-Release Capsules",

    "prod-cough-syrup":
      "Expectorant Cough Syrup with Menthol (100ml)",

    "prod-ors-sachets":
      "Oral Rehydration Salts (ORS) WHO Formula",

    "prod-amlodipine-5":
      "Amlodipine Besylate 5mg Tablets",
  };

  for (const seedId of productSeedIds) {
    const product = allProducts.find(
      (item) =>
        item.name === productNameMap[seedId]
    );

    if (product) {
      productIds.set(seedId, {
        _id: product._id,
        unit: product.unit,
        commissionPercent: product.commissionPercent,
      });
    }
  }

  /**
   * Resolve all supplier IDs.
   */
  const usernames = Object.values(
    supplierUsernameMap
  );

  const suppliers =
    await User.find({
      username: {
        $in: usernames,
      },
      role: "supplier",
    }).select(
      "_id username supplierType supplierApprovalStatus status"
    );

  const supplierIds = new Map<
    string,
    {
      _id: Types.ObjectId;
      supplierType: SupplierType;
    }
  >();

  for (const [
    seedId,
    username,
  ] of Object.entries(
    supplierUsernameMap
  )) {
    const supplier = suppliers.find(
      (item) =>
        item.username === username
    );

    if (
      supplier?.supplierType &&
      supplier.status === "active" &&
      supplier.supplierApprovalStatus === "approved"
    ) {
      supplierIds.set(seedId, {
        _id: supplier._id,
        supplierType: supplier.supplierType,
      });
    }
  }

  /**
   * Seed inventory.
   */
  for (const item of supplierProducts) {
    try {
      const product =
        productIds.get(item.productId);

      const supplier =
        supplierIds.get(item.supplierId);

      if (!product) {
        throw new Error(
          `Product not found for seed ID: ${item.productId}`
        );
      }

      if (!supplier) {
        throw new Error(
          `Supplier not found for seed ID: ${item.supplierId}`
        );
      }

      /**
       * SupplierProducts must use the supplier's
       * actual MongoDB ObjectId.
       */
      const supplierType =
        supplier.supplierType;

      if (!supplierType) {
        throw new Error(
          `Supplier type missing for ${item.supplierId}`
        );
      }

      /**
       * Commission is controlled by the
       * Master Product.
       */
      const commissionPercent =
        product.commissionPercent;

      const commission =
        Math.round(
          item.basePrice *
            (commissionPercent / 100)
        );

      const finalPrice =
        item.basePrice + commission;

      const status: SupplierProductStatus =
        item.stock <= 0
          ? "OUT_OF_STOCK"
          : item.stock <= item.minOrderQuantity * 10
            ? "LOW_STOCK"
            : "AVAILABLE";

      const supplierProductDocument = {
        productId: product._id,
        supplierId: supplier._id,

        supplierType,

        /**
         * NAFDAC belongs to the supplier's
         * product offering.
         *
         * Replace this mapping with actual supplier
         * product registration numbers when those
         * are available.
         */
        nafdacRegNumber:
          "SEED-NAFDAC-PENDING",

        basePrice: item.basePrice,

        commission,
        commissionPercent,

        finalPrice,

        stock: item.stock,

        minOrderQuantity:
          item.minOrderQuantity,

        maxOrderQuantity:
          item.maxOrderQuantity,

        unit: product.unit,

        batchNumber:
          item.batchNumber,

        expiryDate: new Date(
          item.expiryDate
        ),

        manufacturingDate:
          new Date(
            item.manufacturingDate
          ),

        rating: item.rating,

        fulfillmentRate:
          item.fulfillmentRate,

        estimatedDeliveryDays:
          item.deliveryDays,

        status,

        isFlagged: false,

        lastStockUpdatedAt:
          new Date(),
      };

      const existing =
        await SupplierProduct.findOne({
          productId: product._id,
          supplierId: supplier._id,
        });

      if (existing) {
        await SupplierProduct.updateOne(
          { _id: existing._id },
          {
            $set:
              supplierProductDocument,
          }
        );

        results.updated.push(
          `${item.productId}:${item.supplierId}`
        );
      } else {
        await SupplierProduct.create(
          supplierProductDocument
        );

        results.created.push(
          `${item.productId}:${item.supplierId}`
        );
      }
    } catch (error) {
      results.failed.push({
        productId: item.productId,
        supplierId: item.supplierId,
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      });
    }
  }

  return {
    success: results.failed.length === 0,
    totalSupplierProducts:
      supplierProducts.length,
    results,
  };
}