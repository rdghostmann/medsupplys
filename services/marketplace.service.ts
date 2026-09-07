// /services/marketplace.service.ts

"use server";

import { unstable_cache } from "next/cache";
import { Types } from "mongoose";

import { connectToDB } from "@/lib/connectToDB";

import { Product } from "@/models/Product";
import { SupplierProduct } from "@/models/SupplierProduct";
import { User } from "@/models/User";

/* =========================================================
   MARKETPLACE TYPES
   ========================================================= */

export type MarketplaceSupplierSummary = {
  supplierId: string;
  supplierProductId: string;

  supplierName: string;
  supplierType:
    | "importer"
    | "distributor"
    | "retailer";

  state?: string;
  lga?: string;

  verified: boolean;
  supplierApprovalStatus?: string;

  rating: number;
  fulfillmentRate: number;
  estimatedDeliveryDays: number;

  stock: number;
  minOrderQuantity: number;
  maxOrderQuantity: number;

  finalPrice: number;
  status:
    | "AVAILABLE"
    | "LOW_STOCK"
    | "OUT_OF_STOCK"
    | "ON_REQUEST"
    | "SUSPENDED";

  isFlagged: boolean;
};

export type MarketplaceProduct = {
  productId: string;

  name: string;
  genericName?: string;
  brandName?: string;

  activeIngredient: string;
  strength: string;
  dosageForm: string;

  category: string;

  unit: string;
  packSize?: string;

  referenceBasePrice: number;
  commissionPercent: number;
  maxMarkupPercent: number;

  storageCondition?: string;

  requiresColdChain: boolean;
  controlledDrug: boolean;
  prescriptionRequired: boolean;

  description?: string;
  image?: string;

  supplierCount: number;

  suppliers: MarketplaceSupplierSummary[];
};

/* =========================================================
   INTERNAL AGGREGATION TYPES
   ========================================================= */

type AggregatedMarketplaceProduct = {
  _id: Types.ObjectId;

  name: string;
  genericName?: string;
  brandName?: string;

  activeIngredient: string;
  strength: string;
  dosageForm: string;

  category: string;

  unit: string;
  packSize?: string;

  referenceBasePrice: number;
  commissionPercent: number;
  maxMarkupPercent: number;

  storageCondition?: string;

  requiresColdChain: boolean;
  controlledDrug: boolean;
  prescriptionRequired: boolean;

  description?: string;
  image?: string;

  supplierProducts: AggregatedSupplierProduct[];
};

type AggregatedSupplierProduct = {
  _id: Types.ObjectId;

  productId: Types.ObjectId;
  supplierId: Types.ObjectId;

  supplierType:
    | "importer"
    | "distributor"
    | "retailer";

  basePrice: number;
  commission: number;
  commissionPercent: number;
  finalPrice: number;

  stock: number;
  minOrderQuantity: number;
  maxOrderQuantity: number;

  unit: string;

  status:
    | "AVAILABLE"
    | "LOW_STOCK"
    | "OUT_OF_STOCK"
    | "ON_REQUEST"
    | "SUSPENDED";

  isFlagged: boolean;

  rating: number;
  fulfillmentRate: number;
  estimatedDeliveryDays: number;

  supplier?: {
    _id: Types.ObjectId;

    firstName?: string;
    lastName?: string;
    username?: string;

    organizationName?: string;

    role?: string;
    status?: string;

    state?: string;
    lga?: string;

    supplierType?:
      | "importer"
      | "distributor"
      | "retailer";

    supplierApprovalStatus?: string;

    verified?: boolean;
  };
};

/* =========================================================
   SUPPLIER NAME
   ========================================================= */

function getSupplierDisplayName(
  supplier?: AggregatedSupplierProduct["supplier"]
) {
  if (!supplier) {
    return "Unknown Supplier";
  }

  if (supplier.organizationName?.trim()) {
    return supplier.organizationName.trim();
  }

  const fullName = [
    supplier.firstName,
    supplier.lastName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  return (
    fullName ||
    supplier.username ||
    "Unknown Supplier"
  );
}

/* =========================================================
   MARKETPLACE PRODUCT NORMALIZATION
   ========================================================= */

function normalizeMarketplaceProduct(
  product: AggregatedMarketplaceProduct
): MarketplaceProduct {
  const suppliers: MarketplaceSupplierSummary[] =
    product.supplierProducts
      .filter(
        (supplierProduct) =>
          supplierProduct.supplier &&
          supplierProduct.supplier.role === "supplier"
      )
      .map((supplierProduct) => {
        const supplier =
          supplierProduct.supplier!;

        return {
          supplierId:
            supplierProduct.supplierId.toString(),

          supplierProductId:
            supplierProduct._id.toString(),

          supplierName:
            getSupplierDisplayName(supplier),

          supplierType:
            supplierProduct.supplierType,

          state: supplier.state,
          lga: supplier.lga,

          verified:
            supplier.verified === true,

          supplierApprovalStatus:
            supplier.supplierApprovalStatus,

          rating:
            supplierProduct.rating,

          fulfillmentRate:
            supplierProduct.fulfillmentRate,

          estimatedDeliveryDays:
            supplierProduct.estimatedDeliveryDays,

          stock:
            supplierProduct.stock,

          minOrderQuantity:
            supplierProduct.minOrderQuantity,

          maxOrderQuantity:
            supplierProduct.maxOrderQuantity,

          finalPrice:
            supplierProduct.finalPrice,

          status:
            supplierProduct.status,

          isFlagged:
            supplierProduct.isFlagged,
        };
      });

  return {
    productId:
      product._id.toString(),

    name:
      product.name,

    genericName:
      product.genericName,

    brandName:
      product.brandName,

    activeIngredient:
      product.activeIngredient,

    strength:
      product.strength,

    dosageForm:
      product.dosageForm,

    category:
      product.category,

    unit:
      product.unit,

    packSize:
      product.packSize,

    referenceBasePrice:
      product.referenceBasePrice,

    commissionPercent:
      product.commissionPercent,

    maxMarkupPercent:
      product.maxMarkupPercent,

    storageCondition:
      product.storageCondition,

    requiresColdChain:
      product.requiresColdChain,

    controlledDrug:
      product.controlledDrug,

    prescriptionRequired:
      product.prescriptionRequired,

    description:
      product.description,

    image:
      product.image,

    supplierCount:
      suppliers.length,

    suppliers,
  };
}

/* =========================================================
   DATABASE QUERY + NORMALIZATION
   ========================================================= */

/**
 * This function performs the expensive MongoDB aggregation
 * and normalization.
 *
 * IMPORTANT:
 * It is wrapped by unstable_cache below.
 */
async function fetchMarketplaceProducts(): Promise<
  MarketplaceProduct[]
> {
  console.log(
    "[MARKETPLACE CACHE MISS] Fetching marketplace data from MongoDB..."
  );

  await connectToDB();

  const products =
    (await Product.aggregate([
      /* -----------------------------------------------------
         1. ONLY ACTIVE MASTER PRODUCTS
      ----------------------------------------------------- */

      {
        $match: {
          status: "ACTIVE",
        },
      },

      /* -----------------------------------------------------
         2. GET SUPPLIER LISTINGS
      ----------------------------------------------------- */

      {
        $lookup: {
          from: SupplierProduct.collection.name,

          let: {
            productId: "$_id",
          },

          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: [
                    "$productId",
                    "$$productId",
                  ],
                },
              },
            },

            /* ------------------------------------------------
               3. RESOLVE SUPPLIER USER
            ------------------------------------------------ */

            {
              $lookup: {
                from: User.collection.name,

                let: {
                  supplierId:
                    "$supplierId",
                },

                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          {
                            $eq: [
                              "$_id",
                              "$$supplierId",
                            ],
                          },
                          {
                            $eq: [
                              "$role",
                              "supplier",
                            ],
                          },
                        ],
                      },
                    },
                  },

                  /* ------------------------------------------
                     MARKETPLACE-SAFE USER FIELDS
                  ------------------------------------------ */

                  {
                    $project: {
                      _id: 1,

                      firstName: 1,
                      lastName: 1,
                      username: 1,

                      organizationName: 1,

                      role: 1,
                      status: 1,

                      state: 1,
                      lga: 1,

                      supplierType: 1,

                      supplierApprovalStatus: 1,

                      verified: 1,
                    },
                  },
                ],

                as: "supplier",
              },
            },

            {
              $unwind: {
                path: "$supplier",
                preserveNullAndEmptyArrays: false,
              },
            },

            /* ------------------------------------------------
               4. RETURN SUPPLIER PRODUCT FIELDS
            ------------------------------------------------ */

            {
              $project: {
                _id: 1,

                productId: 1,
                supplierId: 1,

                supplierType: 1,

                basePrice: 1,
                commission: 1,
                commissionPercent: 1,
                finalPrice: 1,

                stock: 1,

                minOrderQuantity: 1,
                maxOrderQuantity: 1,

                unit: 1,

                status: 1,
                isFlagged: 1,

                rating: 1,
                fulfillmentRate: 1,
                estimatedDeliveryDays: 1,

                supplier: 1,
              },
            },
          ],

          as: "supplierProducts",
        },
      },

      /* -----------------------------------------------------
         5. MASTER PRODUCT PROJECTION
      ----------------------------------------------------- */

      {
        $project: {
          _id: 1,

          name: 1,
          genericName: 1,
          brandName: 1,

          activeIngredient: 1,
          strength: 1,
          dosageForm: 1,

          category: 1,

          unit: 1,
          packSize: 1,

          referenceBasePrice: 1,
          commissionPercent: 1,
          maxMarkupPercent: 1,

          storageCondition: 1,

          requiresColdChain: 1,
          controlledDrug: 1,
          prescriptionRequired: 1,

          description: 1,
          image: 1,

          supplierProducts: 1,
        },
      },

      /* -----------------------------------------------------
         6. CATALOGUE SORT
      ----------------------------------------------------- */

      {
        $sort: {
          name: 1,
        },
      },
    ])) as AggregatedMarketplaceProduct[];

  /* -------------------------------------------------------
     7. NORMALIZE
  ------------------------------------------------------- */

  const normalizedProducts =
    products.map(
      normalizeMarketplaceProduct
    );

  console.log(
    "[MARKETPLACE CACHE MISS] Marketplace data generated:",
    {
      masterProducts:
        normalizedProducts.length,

      supplierListings:
        normalizedProducts.reduce(
          (total, product) =>
            total + product.supplierCount,
          0
        ),
    }
  );

  return normalizedProducts;
}

/* =========================================================
   CACHED MARKETPLACE DATA
   ========================================================= */

/**
 * Marketplace cache
 *
 * Revalidates every 120 seconds (2 minutes).
 *
 * Cache key:
 *   marketplace-products-v1
 *
 * Cache tag:
 *   marketplace-products
 */
const getCachedMarketplaceProducts =
  unstable_cache(
    async () => {
      return fetchMarketplaceProducts();
    },
    ["marketplace-products-v1"],
    {
      revalidate: 120,
      tags: ["marketplace-products"],
    }
  );

/* =========================================================
   PUBLIC MARKETPLACE SERVICE
   ========================================================= */

/**
 * Returns Admin-approved Master Catalogue products
 * with safe supplier summaries.
 *
 * CACHE:
 * - Cached for 2 minutes.
 * - Prevents unnecessary MongoDB aggregation.
 * - Prevents repeated supplier/user lookups.
 * - Prevents repeated normalization work.
 */
export async function getMarketplaceProducts(): Promise<
  MarketplaceProduct[]
> {
  const products =
    await getCachedMarketplaceProducts();

  console.log(
    `[MARKETPLACE] Returning ${products.length} cached products`
  );

  return products;
}