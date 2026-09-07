// /services/supplier-matching.service.ts

"use server";

import { Types } from "mongoose";

import { connectToDB } from "@/lib/connectToDB";

import { Product } from "@/models/Product";
import {SupplierProduct} from "@/models/SupplierProduct";
import { User } from "@/models/User";

/* =========================================================
   TYPES
   ========================================================= */

export type SupplierScoreBreakdown = {
  supplierId: string;
  supplierProductId: string;

  supplierName: string;
  username?: string;

  supplierType:
    | "IMPORTER"
    | "DISTRIBUTOR"
    | "RETAILER";

  stock: number;

  moq: number;
  maxOrderQuantity: number;

  rating: number;
  fulfillmentRate: number;
  deliveryDays: number;

  basePrice: number;
  commission: number;
  commissionPercent: number;
  finalPrice: number;

  totalScore: number;

  scoreBreakdown: {
    price: number;
    stock: number;
    rating: number;
    fulfillment: number;
    delivery: number;
    supplierType: number;
  };

  isEligible: boolean;

  ineligibilityReason?: string;

  nafdacRegNumber: string;

  batchNumber: string;
  expiryDate: string;

  manufacturingDate?: string;

  verified: boolean;

  supplierApprovalStatus?: string;

  creditRatingTier?: string;

  isColdChainCertified: boolean;

  state?: string;
  lga?: string;

  unit: string;

  isFlagged: boolean;

  status:
    | "AVAILABLE"
    | "LOW_STOCK"
    | "OUT_OF_STOCK"
    | "ON_REQUEST"
    | "SUSPENDED";
};

/* =========================================================
   INTERNAL TYPES
   ========================================================= */

type SupplierMatchingDocument = {
  _id: Types.ObjectId;

  productId: Types.ObjectId;
  supplierId: Types.ObjectId;

  supplierType:
    | "importer"
    | "distributor"
    | "retailer";

  nafdacRegNumber: string;

  basePrice: number;
  commission: number;
  commissionPercent: number;
  finalPrice: number;

  stock: number;

  minOrderQuantity: number;
  maxOrderQuantity: number;

  unit: string;

  batchNumber: string;

  expiryDate: Date;
  manufacturingDate?: Date;

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

    creditRatingTier?: string;

    isColdChainCertified?: boolean;
  };
};

/* =========================================================
   RANKING WEIGHTS
   ========================================================= */

const RANKING_WEIGHTS = {
  price: 35,
  stock: 20,
  rating: 15,
  fulfillment: 15,
  delivery: 10,
  supplierType: 5,
} as const;

/* =========================================================
   SUPPLIER TYPE SCORES
   ========================================================= */

const SUPPLIER_TYPE_SCORE = {
  importer: 5,
  distributor: 3,
  retailer: 1,
} as const;

/* =========================================================
   SUPPLIER NAME
   ========================================================= */

function getSupplierDisplayName(
  supplier?: SupplierMatchingDocument["supplier"]
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
   SUPPLIER TYPE NORMALIZATION
   ========================================================= */

function normalizeSupplierType(
  type:
    | "importer"
    | "distributor"
    | "retailer"
): "IMPORTER" | "DISTRIBUTOR" | "RETAILER" {
  return type.toUpperCase() as
    | "IMPORTER"
    | "DISTRIBUTOR"
    | "RETAILER";
}

/* =========================================================
   ELIGIBILITY
   ========================================================= */

function getEligibility(
  supplierProduct: SupplierMatchingDocument,
  quantity: number
) {
  const now = new Date();

  const reasons: string[] = [];

  /* -------------------------------------------------------
     Supplier account
  ------------------------------------------------------- */

  if (
    !supplierProduct.supplier
  ) {
    reasons.push(
      "Supplier account could not be verified."
    );
  }

  if (
    supplierProduct.supplier?.role !==
    "supplier"
  ) {
    reasons.push(
      "Supplier account is invalid."
    );
  }

  if (
    supplierProduct.supplier?.status !==
    "active"
  ) {
    reasons.push(
      "Supplier account is not active."
    );
  }

  /* -------------------------------------------------------
     Supplier approval
  ------------------------------------------------------- */

  if (
    supplierProduct.supplier
      ?.supplierApprovalStatus !==
    "approved"
  ) {
    reasons.push(
      "Supplier approval is not complete."
    );
  }

  /* -------------------------------------------------------
     Marketplace listing
  ------------------------------------------------------- */

  if (
    supplierProduct.status !==
    "AVAILABLE"
  ) {
    reasons.push(
      `Product listing is ${supplierProduct.status.replaceAll(
        "_",
        " "
      ).toLowerCase()}.`
    );
  }

  if (
    supplierProduct.isFlagged
  ) {
    reasons.push(
      "Supplier listing is currently flagged."
    );
  }

  /* -------------------------------------------------------
     Quantity
  ------------------------------------------------------- */

  if (
    quantity <
    supplierProduct.minOrderQuantity
  ) {
    reasons.push(
      `Minimum order quantity is ${supplierProduct.minOrderQuantity.toLocaleString()}.`
    );
  }

  if (
    quantity >
    supplierProduct.maxOrderQuantity
  ) {
    reasons.push(
      `Maximum order quantity is ${supplierProduct.maxOrderQuantity.toLocaleString()}.`
    );
  }

  /* -------------------------------------------------------
     Stock
  ------------------------------------------------------- */

  if (
    supplierProduct.stock <
    quantity
  ) {
    reasons.push(
      `Insufficient stock. Available: ${supplierProduct.stock.toLocaleString()}.`
    );
  }

  /* -------------------------------------------------------
     Expiry
  ------------------------------------------------------- */

  if (
    supplierProduct.expiryDate <=
    now
  ) {
    reasons.push(
      "Supplier batch has expired."
    );
  }

  /* -------------------------------------------------------
     Regulatory data
  ------------------------------------------------------- */

  if (
    !supplierProduct.nafdacRegNumber?.trim()
  ) {
    reasons.push(
      "NAFDAC registration information is missing."
    );
  }

  if (
    !supplierProduct.batchNumber?.trim()
  ) {
    reasons.push(
      "Batch information is missing."
    );
  }

  return {
    isEligible:
      reasons.length === 0,

    reasons,
  };
}

/* =========================================================
   PRICE SCORE
   ========================================================= */

function calculatePriceScores(
  suppliers: SupplierMatchingDocument[]
) {
  const eligiblePrices = suppliers
    .map(
      (supplier) =>
        supplier.finalPrice
    )
    .filter(
      (price) =>
        Number.isFinite(price) &&
        price > 0
    );

  if (
    eligiblePrices.length === 0
  ) {
    return new Map<string, number>();
  }

  const minPrice =
    Math.min(...eligiblePrices);

  const maxPrice =
    Math.max(...eligiblePrices);

  const range =
    maxPrice - minPrice;

  const scores =
    new Map<string, number>();

  for (const supplier of suppliers) {
    if (
      !Number.isFinite(
        supplier.finalPrice
      ) ||
      supplier.finalPrice <= 0
    ) {
      scores.set(
        supplier._id.toString(),
        0
      );

      continue;
    }

    /* -----------------------------------------------------
       If all suppliers have the same price,
       every supplier gets the full price score.
    ----------------------------------------------------- */

    if (range === 0) {
      scores.set(
        supplier._id.toString(),
        RANKING_WEIGHTS.price
      );

      continue;
    }

    const competitiveness =
      (maxPrice -
        supplier.finalPrice) /
      range;

    scores.set(
      supplier._id.toString(),
      Number(
        (
          competitiveness *
          RANKING_WEIGHTS.price
        ).toFixed(2)
      )
    );
  }

  return scores;
}

/* =========================================================
   STOCK SCORE
   ========================================================= */

function calculateStockScore(
  supplierProduct: SupplierMatchingDocument,
  quantity: number
) {
  if (
    supplierProduct.stock <= 0
  ) {
    return 0;
  }

  /*
   * Stock coverage indicates how comfortably
   * the supplier can fulfil the requested order.
   *
   * 1x requested quantity = minimum useful score
   * Higher coverage approaches maximum score.
   */

  const coverage =
    supplierProduct.stock /
    Math.max(quantity, 1);

  const normalizedCoverage =
    Math.min(
      coverage / 10,
      1
    );

  return Number(
    (
      normalizedCoverage *
      RANKING_WEIGHTS.stock
    ).toFixed(2)
  );
}

/* =========================================================
   RATING SCORE
   ========================================================= */

function calculateRatingScore(
  rating: number
) {
  const normalized =
    Math.min(
      Math.max(rating, 0),
      5
    ) / 5;

  return Number(
    (
      normalized *
      RANKING_WEIGHTS.rating
    ).toFixed(2)
  );
}

/* =========================================================
   FULFILLMENT SCORE
   ========================================================= */

function calculateFulfillmentScore(
  fulfillmentRate: number
) {
  const normalized =
    Math.min(
      Math.max(
        fulfillmentRate,
        0
      ),
      100
    ) / 100;

  return Number(
    (
      normalized *
      RANKING_WEIGHTS.fulfillment
    ).toFixed(2)
  );
}

/* =========================================================
   DELIVERY SCORE
   ========================================================= */

function calculateDeliveryScore(
  deliveryDays: number
) {
  /*
   * 0 days = full score
   * 7+ days = 0
   */

  const normalized =
    Math.max(
      0,
      1 -
        Math.min(
          Math.max(
            deliveryDays,
            0
          ),
          7
        ) / 7
    );

  return Number(
    (
      normalized *
      RANKING_WEIGHTS.delivery
    ).toFixed(2)
  );
}

/* =========================================================
   SUPPLIER TYPE SCORE
   ========================================================= */

function calculateSupplierTypeScore(
  supplierType:
    | "importer"
    | "distributor"
    | "retailer"
) {
  return (
    SUPPLIER_TYPE_SCORE[
      supplierType
    ] ?? 0
  );
}

/* =========================================================
   GET SUPPLIER MATCHES
   ========================================================= */

/**
 * Dynamic Ranked Pool
 *
 * 1. Fetch supplier listings for product.
 * 2. Resolve supplier accounts.
 * 3. Determine eligibility.
 * 4. Calculate ranking scores.
 * 5. Return ranked supplier pool.
 */
export async function evaluateSupplierMatches(
  productId: string,
  quantity: number
): Promise<SupplierScoreBreakdown[]> {
  await connectToDB();

  /* -------------------------------------------------------
     VALIDATE INPUT
  ------------------------------------------------------- */

  if (
    !Types.ObjectId.isValid(
      productId
    )
  ) {
    throw new Error(
      "Invalid product ID."
    );
  }

  if (
    !Number.isFinite(quantity) ||
    quantity <= 0
  ) {
    throw new Error(
      "Order quantity must be greater than zero."
    );
  }

  const product =
    await Product.findOne({
      _id: productId,
      status: "ACTIVE",
    })
      .select({
        _id: 1,
        name: 1,
        requiresColdChain: 1,
      })
      .lean();

  if (!product) {
    throw new Error(
      "Active marketplace product not found."
    );
  }

  /* -------------------------------------------------------
     FETCH SUPPLIER PRODUCTS + SUPPLIER
  ------------------------------------------------------- */

  const supplierProducts =
    (await SupplierProduct.aggregate([
      {
        $match: {
          productId:
            new Types.ObjectId(
              productId
            ),
        },
      },

      /* ---------------------------------------------------
         RESOLVE SUPPLIER
      --------------------------------------------------- */

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

                creditRatingTier: 1,

                isColdChainCertified: 1,
              },
            },
          ],

          as: "supplier",
        },
      },

      {
        $unwind: {
          path: "$supplier",
          preserveNullAndEmptyArrays: true,
        },
      },

      /* ---------------------------------------------------
         PROJECT MATCHING FIELDS
      --------------------------------------------------- */

      {
        $project: {
          _id: 1,

          productId: 1,
          supplierId: 1,

          supplierType: 1,

          nafdacRegNumber: 1,

          basePrice: 1,
          commission: 1,
          commissionPercent: 1,
          finalPrice: 1,

          stock: 1,

          minOrderQuantity: 1,
          maxOrderQuantity: 1,

          unit: 1,

          batchNumber: 1,

          expiryDate: 1,
          manufacturingDate: 1,

          status: 1,
          isFlagged: 1,

          rating: 1,
          fulfillmentRate: 1,
          estimatedDeliveryDays: 1,

          supplier: 1,
        },
      },
    ])) as SupplierMatchingDocument[];

  if (
    supplierProducts.length === 0
  ) {
    return [];
  }

  /* -------------------------------------------------------
     PRICE SCORES
  ------------------------------------------------------- */

  const eligibleForPrice =
    supplierProducts.filter(
      (supplier) =>
        supplier.status !==
          "SUSPENDED" &&
        !supplier.isFlagged &&
        supplier.finalPrice > 0
    );

  const priceScores =
    calculatePriceScores(
      eligibleForPrice
    );

  /* -------------------------------------------------------
     BUILD RANKED POOL
  ------------------------------------------------------- */

  const matches =
    supplierProducts.map(
      (supplierProduct) => {
        const eligibility =
          getEligibility(
            supplierProduct,
            quantity
          );

        const supplier =
          supplierProduct.supplier;

        const priceScore =
          eligibility.isEligible
            ? priceScores.get(
                supplierProduct._id.toString()
              ) ?? 0
            : 0;

        const stockScore =
          eligibility.isEligible
            ? calculateStockScore(
                supplierProduct,
                quantity
              )
            : 0;

        const ratingScore =
          eligibility.isEligible
            ? calculateRatingScore(
                supplierProduct.rating
              )
            : 0;

        const fulfillmentScore =
          eligibility.isEligible
            ? calculateFulfillmentScore(
                supplierProduct.fulfillmentRate
              )
            : 0;

        const deliveryScore =
          eligibility.isEligible
            ? calculateDeliveryScore(
                supplierProduct.estimatedDeliveryDays
              )
            : 0;

        const supplierTypeScore =
          eligibility.isEligible
            ? calculateSupplierTypeScore(
                supplierProduct.supplierType
              )
            : 0;

        const totalScore =
          Number(
            (
              priceScore +
              stockScore +
              ratingScore +
              fulfillmentScore +
              deliveryScore +
              supplierTypeScore
            ).toFixed(2)
          );

        return {
          supplierId:
            supplierProduct.supplierId.toString(),

          supplierProductId:
            supplierProduct._id.toString(),

          supplierName:
            getSupplierDisplayName(
              supplier
            ),

          username:
            supplier?.username,

          supplierType:
            normalizeSupplierType(
              supplierProduct.supplierType
            ),

          stock:
            supplierProduct.stock,

          moq:
            supplierProduct.minOrderQuantity,

          maxOrderQuantity:
            supplierProduct.maxOrderQuantity,

          rating:
            supplierProduct.rating,

          fulfillmentRate:
            supplierProduct.fulfillmentRate,

          deliveryDays:
            supplierProduct.estimatedDeliveryDays,

          basePrice:
            supplierProduct.basePrice,

          commission:
            supplierProduct.commission,

          commissionPercent:
            supplierProduct.commissionPercent,

          finalPrice:
            supplierProduct.finalPrice,

          totalScore,

          scoreBreakdown: {
            price: priceScore,
            stock: stockScore,
            rating: ratingScore,
            fulfillment:
              fulfillmentScore,
            delivery:
              deliveryScore,
            supplierType:
              supplierTypeScore,
          },

          isEligible:
            eligibility.isEligible,

          ineligibilityReason:
            eligibility.isEligible
              ? undefined
              : eligibility.reasons.join(
                  " "
                ),

          nafdacRegNumber:
            supplierProduct.nafdacRegNumber,

          batchNumber:
            supplierProduct.batchNumber,

          expiryDate:
            supplierProduct.expiryDate.toISOString(),

          manufacturingDate:
            supplierProduct.manufacturingDate?.toISOString(),

          verified:
            supplier?.verified === true,

          supplierApprovalStatus:
            supplier?.supplierApprovalStatus,

          creditRatingTier:
            supplier?.creditRatingTier,

          isColdChainCertified:
            supplier?.isColdChainCertified ===
            true,

          state:
            supplier?.state,

          lga:
            supplier?.lga,

          unit:
            supplierProduct.unit,

          isFlagged:
            supplierProduct.isFlagged,

          status:
            supplierProduct.status,
        };
      }
    );

  /* -------------------------------------------------------
     SORT
  ------------------------------------------------------- */

  matches.sort(
    (a, b) => {
      /* Eligible suppliers always come first. */

      if (
        a.isEligible !==
        b.isEligible
      ) {
        return a.isEligible
          ? -1
          : 1;
      }

      /* Higher score wins. */

      if (
        b.totalScore !==
        a.totalScore
      ) {
        return (
          b.totalScore -
          a.totalScore
        );
      }

      /* Price tie-breaker. */

      if (
        a.finalPrice !==
        b.finalPrice
      ) {
        return (
          a.finalPrice -
          b.finalPrice
        );
      }

      /* Rating tie-breaker. */

      return (
        b.rating -
        a.rating
      );
    }
  );

  /* -------------------------------------------------------
     LOGGING
  ------------------------------------------------------- */

  console.log(
    "=========================================="
  );

  console.log(
    "=== MEDSUPPLY SUPPLIER MATCHING ==="
  );

  console.log(
    "=========================================="
  );

  console.log(
    "Product:",
    product.name
  );

  console.log(
    "Product ID:",
    productId
  );

  console.log(
    "Requested quantity:",
    quantity
  );

  console.log(
    "Supplier pool:",
    matches.length
  );

  console.log(
    "Eligible suppliers:",
    matches.filter(
      (match) =>
        match.isEligible
    ).length
  );

  console.log(
    "Top supplier:",
    matches.find(
      (match) =>
        match.isEligible
    )?.supplierName ??
      "None"
  );

  return matches;
}