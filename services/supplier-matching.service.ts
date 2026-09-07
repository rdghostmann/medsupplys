// /services/supplier-matching.service.ts

"use server";

import { Types } from "mongoose";

import { connectToDB } from "@/lib/connectToDB";

import { Product } from "@/models/Product";
import { SupplierProduct } from "@/models/SupplierProduct";
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

export async function matchSuppliers(
  productId: string,
  quantity: number
): Promise<SupplierScoreBreakdown[]> {
  if (!productId) {
    throw new Error("Product ID is required.");
  }

  if (!Types.ObjectId.isValid(productId)) {
    throw new Error("Invalid product ID.");
  }

  const requestedQuantity = Math.floor(Number(quantity));

  if (!Number.isFinite(requestedQuantity) || requestedQuantity <= 0) {
    throw new Error(
      "Procurement quantity must be greater than zero."
    );
  }

  await connectToDB();

  // ---------------------------------------------------------------------------
  // Resolve master product
  // ---------------------------------------------------------------------------

  const product = await Product.findById(productId).lean();

  if (!product) {
    throw new Error("Product not found.");
  }

  // ---------------------------------------------------------------------------
  // Resolve supplier listings
  // ---------------------------------------------------------------------------

  const supplierProducts = await SupplierProduct.find({
    productId: new Types.ObjectId(productId),
  }).lean();

  if (!supplierProducts.length) {
    return [];
  }

  // ---------------------------------------------------------------------------
  // Resolve suppliers in ONE query
  // ---------------------------------------------------------------------------

  const supplierIds = [
    ...new Set(
      supplierProducts
        .map((item) => item.supplierId.toString())
        .filter(Boolean)
    ),
  ];

  const suppliers = await User.find({
    _id: {
      $in: supplierIds.map(
        (id) => new Types.ObjectId(id)
      ),
    },
  }).lean();

  const supplierMap = new Map(
    suppliers.map((supplier) => [
      supplier._id.toString(),
      supplier,
    ])
  );

  // ---------------------------------------------------------------------------
  // Build matching records and determine eligibility FIRST
  // ---------------------------------------------------------------------------

  const records: Array<{
    result: SupplierScoreBreakdown;
  }> = [];

  for (const listing of supplierProducts) {
    const supplierId =
      listing.supplierId?.toString();

    const supplierProductId =
      listing._id?.toString();

    if (!supplierId || !supplierProductId) {
      continue;
    }

    const supplier = supplierMap.get(supplierId);

    const supplierName =
      supplier?.organizationName ||
      [
        supplier?.firstName,
        supplier?.lastName,
      ]
        .filter(Boolean)
        .join(" ") ||
      supplier?.username ||
      "Unknown Supplier";

    const supplierType =
      String(
        listing.supplierType ??
        supplier?.supplierType ??
        "retailer"
      ).toUpperCase() as
      | "IMPORTER"
      | "DISTRIBUTOR"
      | "RETAILER";

    const stock = Math.max(
      0,
      Number(listing.stock ?? 0)
    );

    const moq = Math.max(
      1,
      Number(listing.minOrderQuantity ?? 1)
    );

    const maxOrderQuantity = Math.max(
      moq,
      Number(
        listing.maxOrderQuantity ??
        Number.MAX_SAFE_INTEGER
      )
    );

    const rating = Math.min(
      5,
      Math.max(
        0,
        Number(listing.rating ?? 0)
      )
    );

    const fulfillmentRate = Math.min(
      100,
      Math.max(
        0,
        Number(listing.fulfillmentRate ?? 0)
      )
    );

    const deliveryDays = Math.max(
      0,
      Number(
        listing.estimatedDeliveryDays ??
        7
      )
    );

    // IMPORTANT:
    // SupplierProduct.finalPrice is the authoritative buyer price.
    const basePrice = Math.max(
      0,
      Number(listing.basePrice ?? 0)
    );

    const finalPrice = Math.max(
      0,
      Number(listing.finalPrice ?? 0)
    );

    const commission = Math.max(
      0,
      Number(listing.commission ?? 0)
    );

    const commissionPercent = Math.max(
      0,
      Number(listing.commissionPercent ?? 0)
    );

    const status = String(
      listing.status ?? "SUSPENDED"
    ).toUpperCase() as
      | "AVAILABLE"
      | "LOW_STOCK"
      | "OUT_OF_STOCK"
      | "ON_REQUEST"
      | "SUSPENDED";

    const isFlagged =
      Boolean(listing.isFlagged);

    const verified =
      Boolean(
        supplier?.verified
      );

    const supplierApprovalStatus =
      supplier?.supplierApprovalStatus;

    const nafdacRegNumber =
      String(
        listing.nafdacRegNumber ?? ""
      ).trim();

    const batchNumber =
      String(
        listing.batchNumber ?? ""
      ).trim();

    const expiryDate =
      listing.expiryDate
        ? new Date(listing.expiryDate)
        : null;

    const manufacturingDate =
      listing.manufacturingDate
        ? new Date(listing.manufacturingDate)
        : null;

    const now = new Date();

    let isEligible = true;
    let ineligibilityReason:
      | string
      | undefined;

    // -------------------------------------------------------------------------
    // Eligibility validation
    // -------------------------------------------------------------------------

    if (!supplier) {
      isEligible = false;
      ineligibilityReason =
        "Supplier account not found.";
    } else if (
      String(supplier.role).toUpperCase() !==
      "SUPPLIER"
    ) {
      isEligible = false;
      ineligibilityReason =
        "Account is not a supplier.";
    } else if (
      String(supplier.status).toUpperCase() !==
      "ACTIVE"
    ) {
      isEligible = false;
      ineligibilityReason =
        "Supplier account is not active.";
    } else if (
      supplierApprovalStatus &&
      String(supplierApprovalStatus).toUpperCase() !==
      "APPROVED"
    ) {
      isEligible = false;
      ineligibilityReason =
        "Supplier has not been approved.";
    } else if (isFlagged) {
      isEligible = false;
      ineligibilityReason =
        "Supplier listing has been flagged.";
    } else if (
      status === "SUSPENDED"
    ) {
      isEligible = false;
      ineligibilityReason =
        "Supplier listing is suspended.";
    } else if (
      status === "OUT_OF_STOCK"
    ) {
      isEligible = false;
      ineligibilityReason =
        "Product is out of stock.";
    } else if (
      status === "ON_REQUEST"
    ) {
      isEligible = false;
      ineligibilityReason =
        "Product is available on request only.";
    } else if (
      requestedQuantity < moq
    ) {
      isEligible = false;
      ineligibilityReason =
        `Minimum order quantity is ${moq}.`;
    } else if (
      requestedQuantity > maxOrderQuantity
    ) {
      isEligible = false;
      ineligibilityReason =
        `Maximum order quantity is ${maxOrderQuantity}.`;
    } else if (
      stock < requestedQuantity
    ) {
      isEligible = false;
      ineligibilityReason =
        `Insufficient stock. Available stock: ${stock}.`;
    } else if (
      finalPrice <= 0
    ) {
      isEligible = false;
      ineligibilityReason =
        "Supplier price is unavailable.";
    } else if (!nafdacRegNumber) {
      isEligible = false;
      ineligibilityReason =
        "NAFDAC registration number is missing.";
    } else if (!batchNumber) {
      isEligible = false;
      ineligibilityReason =
        "Batch number is missing.";
    } else if (!expiryDate) {
      isEligible = false;
      ineligibilityReason =
        "Expiry date is missing.";
    } else if (
      Number.isNaN(expiryDate.getTime())
    ) {
      isEligible = false;
      ineligibilityReason =
        "Supplier expiry date is invalid.";
    } else if (
      expiryDate <= now
    ) {
      isEligible = false;
      ineligibilityReason =
        "Supplier product has expired.";
    } else if (
      status !== "AVAILABLE" &&
      status !== "LOW_STOCK"
    ) {
      isEligible = false;
      ineligibilityReason =
        "Supplier listing is not currently available.";
    }

    records.push({
      result: {
        supplierId,
        supplierProductId,

        supplierName,
        username:
          supplier?.username || undefined,

        supplierType,

        stock,
        moq,
        maxOrderQuantity,

        rating,
        fulfillmentRate,
        deliveryDays,

        basePrice,
        commission,
        commissionPercent,
        finalPrice,

        totalScore: 0,

        scoreBreakdown: {
          price: 0,
          stock: 0,
          rating: 0,
          fulfillment: 0,
          delivery: 0,
          supplierType: 0,
        },

        isEligible,
        ineligibilityReason,

        nafdacRegNumber,
        batchNumber,

        expiryDate:
          expiryDate?.toISOString() ?? "",

        manufacturingDate:
          manufacturingDate &&
            !Number.isNaN(
              manufacturingDate.getTime()
            )
            ? manufacturingDate.toISOString()
            : undefined,

        verified,

        supplierApprovalStatus:
          supplierApprovalStatus || undefined,

        creditRatingTier:
          supplier?.creditRatingTier ??
          undefined,

        isColdChainCertified:
          Boolean(
            supplier?.isColdChainCertified
          ),

        state:
          supplier?.state ??
          undefined,

        lga:
          supplier?.lga ??
          undefined,

        unit:
          listing.unit ??
          "",

        isFlagged,

        status,
      },
    });
  }

  // ---------------------------------------------------------------------------
  // IMPORTANT:
  // Only ELIGIBLE suppliers participate in price normalization.
  // ---------------------------------------------------------------------------

  const eligible = records
    .map((record) => record.result)
    .filter(
      (supplier) =>
        supplier.isEligible &&
        supplier.finalPrice > 0
    );

  if (!eligible.length) {
    return records.map(
      (record) => record.result
    );
  }

  const prices = eligible.map(
    (supplier) => supplier.finalPrice
  );

  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  // ---------------------------------------------------------------------------
  // Calculate ranking scores
  // ---------------------------------------------------------------------------

  for (const record of records) {
    const supplier = record.result;

    if (!supplier.isEligible) {
      supplier.totalScore = 0;
      continue;
    }

    // Lower price = better score
    const priceScore =
      minPrice === maxPrice
        ? 100
        : Math.max(
          0,
          Math.min(
            100,
            ((maxPrice - supplier.finalPrice) /
              (maxPrice - minPrice)) *
            100
          )
        );

    // More stock coverage = better
    const stockCoverage =
      supplier.stock /
      requestedQuantity;

    const stockScore =
      stockCoverage >= 3
        ? 100
        : stockCoverage >= 2
          ? 90
          : 70;

    // Rating: 0 - 5
    const ratingScore =
      (supplier.rating / 5) * 100;

    // Already represented as percentage
    const fulfillmentScore =
      Math.min(
        100,
        Math.max(
          0,
          supplier.fulfillmentRate
        )
      );

    // Lower delivery time = better
    const deliveryScore =
      supplier.deliveryDays <= 1
        ? 100
        : supplier.deliveryDays <= 2
          ? 90
          : supplier.deliveryDays <= 3
            ? 80
            : supplier.deliveryDays <= 5
              ? 70
              : supplier.deliveryDays <= 7
                ? 55
                : 30;

    const supplierTypeScore =
      supplier.supplierType === "IMPORTER"
        ? 100
        : supplier.supplierType === "DISTRIBUTOR"
          ? 60
          : 20;

    // -------------------------------------------------------------------------
    // Apply weights
    // -------------------------------------------------------------------------

    const weightedPrice =
      (priceScore / 100) *
      RANKING_WEIGHTS.price;

    const weightedStock =
      (stockScore / 100) *
      RANKING_WEIGHTS.stock;

    const weightedRating =
      (ratingScore / 100) *
      RANKING_WEIGHTS.rating;

    const weightedFulfillment =
      (fulfillmentScore / 100) *
      RANKING_WEIGHTS.fulfillment;

    const weightedDelivery =
      (deliveryScore / 100) *
      RANKING_WEIGHTS.delivery;

    const weightedSupplierType =
      (supplierTypeScore / 100) *
      RANKING_WEIGHTS.supplierType;

    supplier.scoreBreakdown = {
      price: Number(
        weightedPrice.toFixed(2)
      ),
      stock: Number(
        weightedStock.toFixed(2)
      ),
      rating: Number(
        weightedRating.toFixed(2)
      ),
      fulfillment: Number(
        weightedFulfillment.toFixed(2)
      ),
      delivery: Number(
        weightedDelivery.toFixed(2)
      ),
      supplierType: Number(
        weightedSupplierType.toFixed(2)
      ),
    };

    supplier.totalScore = Number(
      (
        weightedPrice +
        weightedStock +
        weightedRating +
        weightedFulfillment +
        weightedDelivery +
        weightedSupplierType
      ).toFixed(2)
    );
  }

  // ---------------------------------------------------------------------------
  // Final ranking
  // ---------------------------------------------------------------------------

  records.sort((a, b) => {
    const supplierA = a.result;
    const supplierB = b.result;

    // Eligible suppliers always appear before ineligible suppliers.
    if (
      supplierA.isEligible !==
      supplierB.isEligible
    ) {
      return supplierA.isEligible
        ? -1
        : 1;
    }

    // Highest score first.
    if (
      supplierA.totalScore !==
      supplierB.totalScore
    ) {
      return (
        supplierB.totalScore -
        supplierA.totalScore
      );
    }

    // Lower actual buyer price wins tie.
    if (
      supplierA.finalPrice !==
      supplierB.finalPrice
    ) {
      return (
        supplierA.finalPrice -
        supplierB.finalPrice
      );
    }

    // Higher available stock wins remaining tie.
    return (
      supplierB.stock -
      supplierA.stock
    );
  });

  return records.map(
    ({ result }) => result
  );
}