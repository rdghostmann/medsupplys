"use server";

import {
  RootFilterQuery,
  Types,
} from "mongoose";

import { connectToDB } from "@/lib/connectToDB";
import { User } from "@/models/User";
import { Product } from "@/models/Product";
import { SupplierProduct } from "@/models/SupplierProduct";
import { Procurement } from "@/models/Procurement";
import {
  CreditAccount,
  ICreditAccount,
} from "@/models/CreditAccount";
import { Order } from "@/models/Order";

/* =========================================================
   TYPES
========================================================= */

export interface SeedStatus {
  success: boolean;
  message: string;
  error?: string;

  buyer?: {
    id: string;
    username: string;
    name: string;
    role: string;
  };

  creditAccount?: {
    id: string;
    creditLimit: number;
    creditUsed: number;
    availableCredit: number;
    outstandingBalance: number;
    status: string;
    ratingTier: string;
  };

  procurement?: {
    id: string;
    procurementNumber: string;
    status: string;
    currentSupplierName?: string;
    candidates: number;
  };

  orders?: {
    id: string;
    orderNumber: string;
    supplierName: string;
    total: number;
    paymentMethod: string;
    status: string;
  }[];

  steps?: {
    name: string;
    status: "success" | "failed";
    message: string;
  }[];
}

/* =========================================================
   CONSTANTS
========================================================= */

const BUYER_ID = new Types.ObjectId(
  "6a9cb82d853e785e43c110b8"
);

const BUYER_NAME =
  "Lagos University Teaching Hospital (LUTH)";

const PARACETAMOL_PRODUCT_ID = new Types.ObjectId(
  "6a9cb838853e785e43c110c7"
);

/* =========================================================
   MAIN SERVER ACTION
========================================================= */

export async function seedBuyerProcurementCreditOrders(): Promise<SeedStatus> {
  const steps: SeedStatus["steps"] = [];

  try {
    await connectToDB();

    steps.push({
      name: "Database Connection",
      status: "success",
      message: "Connected to MongoDB successfully.",
    });

    /* =====================================================
       1. BUYER
    ===================================================== */

    const buyer = await User.findById(BUYER_ID)
      .select(
        "_id username firstName lastName organizationName role status"
      )
      .lean();

    if (!buyer) {
      throw new Error(
        `Buyer ${BUYER_ID.toString()} was not found.`
      );
    }

    if (buyer.role !== "buyer") {
      throw new Error(
        `User ${BUYER_ID.toString()} is not a buyer.`
      );
    }

    if (!buyer.username) {
      throw new Error(
        `Buyer ${BUYER_ID.toString()} does not have a username.`
      );
    }

    steps.push({
      name: "Buyer Verification",
      status: "success",
      message: `Buyer verified: ${BUYER_NAME}`,
    });

    /* =====================================================
       2. MASTER PRODUCT
    ===================================================== */

    const product = await Product.findById(
      PARACETAMOL_PRODUCT_ID
    )
      .select("_id name unit")
      .lean();

    if (!product) {
      throw new Error(
        `Paracetamol master Product ${PARACETAMOL_PRODUCT_ID.toString()} was not found.`
      );
    }

    steps.push({
      name: "Master Product",
      status: "success",
      message: `Verified ${product.name}.`,
    });

    /* =====================================================
       3. RESOLVE SUPPLIERS DYNAMICALLY
    ===================================================== */

    const supplierUsernames = [
      "may-baker",
      "fidson-healthcare",
      "neimeth-pharmaceuticals",
      "emzor-pharmaceuticals",
      "juhel-nigeria",
    ];

    const suppliers = await User.find({
      username: {
        $in: supplierUsernames,
      },
      role: "supplier",
    })
      .select(
        "_id username organizationName role supplierType status"
      )
      .lean();

    if (suppliers.length !== supplierUsernames.length) {
      const found = new Set(
        suppliers.map((supplier) => supplier.username)
      );

      const missing = supplierUsernames.filter(
        (username) => !found.has(username)
      );

      throw new Error(
        `Missing suppliers: ${missing.join(", ")}`
      );
    }

    const supplierMap = new Map(
      suppliers.map((supplier) => [
        supplier.username,
        supplier,
      ])
    );

    const mayBaker = supplierMap.get("may-baker")!;
    const fidson = supplierMap.get("fidson-healthcare")!;
    const neimeth = supplierMap.get(
      "neimeth-pharmaceuticals"
    )!;
    const emzor = supplierMap.get(
      "emzor-pharmaceuticals"
    )!;
    const juhel = supplierMap.get("juhel-nigeria")!;

    steps.push({
      name: "Supplier Verification",
      status: "success",
      message: `Verified ${suppliers.length} supplier accounts.`,
    });

    /* =====================================================
       4. RESOLVE SUPPLIER PRODUCTS
    ===================================================== */

    const supplierProducts =
      await SupplierProduct.find({
        productId: PARACETAMOL_PRODUCT_ID,
        supplierId: {
          $in: suppliers.map(
            (supplier) => supplier._id
          ),
        },
      }).lean();

    const getSupplierProduct = (
      supplierId: Types.ObjectId
    ) => {
      const supplierProduct =
        supplierProducts.find(
          (item) =>
            item.supplierId.toString() ===
            supplierId.toString()
        );

      if (!supplierProduct) {
        throw new Error(
          `Paracetamol SupplierProduct was not found for supplier ${supplierId.toString()}.`
        );
      }

      return supplierProduct;
    };

    const mayBakerProduct =
      getSupplierProduct(mayBaker._id);

    const fidsonProduct =
      getSupplierProduct(fidson._id);

    const neimethProduct =
      getSupplierProduct(neimeth._id);

    const emzorProduct =
      getSupplierProduct(emzor._id);

    const juhelProduct =
      getSupplierProduct(juhel._id);

    steps.push({
      name: "Supplier Product Verification",
      status: "success",
      message: `Verified ${supplierProducts.length} Paracetamol supplier offerings.`,
    });

    /* =====================================================
       5. ADMIN
    ===================================================== */

    const admin = await User.findOne({
      username: "admin",
      role: "admin",
    })
      .select("_id")
      .lean();

    if (!admin) {
      throw new Error(
        "Admin user 'admin' was not found."
      );
    }

    steps.push({
      name: "Admin Verification",
      status: "success",
      message: "Admin account resolved successfully.",
    });

    /* =====================================================
       6. CREDIT ACCOUNT
    ===================================================== */

    const creditLimit = 15_000_000;

    const creditUsed = 2_850_000;

    const availableCredit =
      creditLimit - creditUsed;

    const creditAccount = (await CreditAccount.findOneAndUpdate(
        {
          buyerId: BUYER_ID,
        } as RootFilterQuery<ICreditAccount>,
        {
          $set: {
            buyerId: BUYER_ID,

            buyerName: BUYER_NAME,

            creditLimit,

            availableCredit,

            creditUsed,

            outstandingBalance: creditUsed,

            status: "ACTIVE",

            ratingTier: "A",

            approvedBy: admin._id,

            approvedAt: new Date(
              "2025-01-10T09:00:00.000Z"
            ),

            dueDate: new Date(
              "2025-02-28T23:59:59.000Z"
            ),

            terms:
              "30-day institutional procurement credit facility",

            interestRatePercent: 0,
          },
        },
        {
          upsert: true,
          new: true,
          includeResultMetadata: false,
          setDefaultsOnInsert: true,
        }
      )) as unknown as ICreditAccount | null;

    if (!creditAccount) {
      throw new Error(
        "Failed to create CreditAccount."
      );
    }

    steps.push({
      name: "Credit Account",
      status: "success",
      message:
        "₦15,000,000 institutional credit facility seeded.",
    });

    /* =====================================================
       7. ACTIVE PROCUREMENT
    ===================================================== */

    const quantity = 1000;

    type SupplierProductPrice = {
      finalPrice?: number;
      basePrice?: number;
    };

    const getFinalPrice = (
      supplierProduct: SupplierProductPrice
    ) =>
      Number(
        supplierProduct.finalPrice ??
          supplierProduct.basePrice ??
          0
      );

    const getBasePrice = (
      supplierProduct: SupplierProductPrice
    ) =>
      Number(
        supplierProduct.basePrice ?? 0
      );

    const procurement = await Procurement.findOneAndUpdate(
      {
        procurementNumber: "PRC-2025-8822",
      },
      {
        $set: {
          procurementNumber: "PRC-2025-8822",

          buyerId: BUYER_ID,

          buyerName: BUYER_NAME,

          items: [
            {
              productId:
                PARACETAMOL_PRODUCT_ID,

              productName:
                product.name,

              quantity,

              unit:
                product.unit,

              preferredSupplierType:
                "importer",

              requiredByDate: new Date(
                "2025-01-18T23:59:59.000Z"
              ),
            },
          ],

          status:
            "SUPPLIER_CONTACTED",

          supplierCandidates: [
            {
              supplierId: mayBaker._id,

              supplierName:
                mayBaker.organizationName ??
                "May & Baker Nigeria Plc",

              supplierType:
                mayBaker.supplierType ??
                "importer",

              supplierProductId:
                mayBakerProduct._id,

              unitPrice:
                getFinalPrice(
                  mayBakerProduct
                ),

              totalPrice:
                quantity *
                getFinalPrice(
                  mayBakerProduct
                ),

              stock:
                mayBakerProduct.stock,

              rank: 1,

              score: 96.5,

              status:
                "CONTACTED",
            },

            {
              supplierId:
                fidson._id,

              supplierName:
                fidson.organizationName ??
                "Fidson Healthcare Plc",

              supplierType:
                fidson.supplierType ??
                "importer",

              supplierProductId:
                fidsonProduct._id,

              unitPrice:
                getFinalPrice(
                  fidsonProduct
                ),

              totalPrice:
                quantity *
                getFinalPrice(
                  fidsonProduct
                ),

              stock:
                fidsonProduct.stock,

              rank: 2,

              score: 93.2,

              status:
                "QUEUED",
            },

            {
              supplierId:
                neimeth._id,

              supplierName:
                neimeth.organizationName ??
                "Neimeth International Pharmaceuticals Plc",

              supplierType:
                neimeth.supplierType ??
                "importer",

              supplierProductId:
                neimethProduct._id,

              unitPrice:
                getFinalPrice(
                  neimethProduct
                ),

              totalPrice:
                quantity *
                getFinalPrice(
                  neimethProduct
                ),

              stock:
                neimethProduct.stock,

              rank: 3,

              score: 89,

              status:
                "QUEUED",
            },

            {
              supplierId:
                emzor._id,

              supplierName:
                emzor.organizationName ??
                "Emzor Pharmaceutical Industries Ltd",

              supplierType:
                emzor.supplierType ??
                "distributor",

              supplierProductId:
                emzorProduct._id,

              unitPrice:
                getFinalPrice(
                  emzorProduct
                ),

              totalPrice:
                quantity *
                getFinalPrice(
                  emzorProduct
                ),

              stock:
                emzorProduct.stock,

              rank: 4,

              score: 87.5,

              status:
                "QUEUED",
            },
          ],

          currentSupplierIndex: 0,

          currentSupplierId:
            mayBaker._id,

          currentSupplierName:
            mayBaker.organizationName ??
            "May & Baker Nigeria Plc",

          attemptHistory: [
            {
              attemptNumber: 1,

              supplierId:
                mayBaker._id,

              supplierName:
                mayBaker.organizationName ??
                "May & Baker Nigeria Plc",

              supplierType:
                mayBaker.supplierType ??
                "importer",

              offeredPrice:
                getBasePrice(
                  mayBakerProduct
                ),

              status:
                "CONTACTED",

              contactedAt: new Date(
                "2025-01-15T08:30:00.000Z"
              ),
            },
          ],

          deliveryAddress:
            "LUTH Inpatient Dispensing Pharmacy, Surulere, Lagos",

          notes:
            "Active procurement with dynamic supplier fallback. May & Baker is currently being contacted. If unavailable or timed out, the matching engine proceeds to the next ranked supplier.",

          matchingWeightsSnapshot: {
            availabilityWeight: 30,
            priceWeight: 30,
            supplierTypeWeight: 15,
            fulfillmentWeight: 15,
            reliabilityWeight: 10,
          },

          expiresAt: new Date(
            "2025-01-16T08:30:00.000Z"
          ),
        },
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );

    if (!procurement) {
      throw new Error(
        "Failed to create Procurement."
      );
    }

    steps.push({
      name: "Active Procurement",
      status: "success",
      message:
        "PRC-2025-8822 seeded with dynamic supplier fallback.",
    });

    /* =====================================================
       8. ORDER 1
    ===================================================== */

    const order1Quantity = 500;

    const order1UnitPrice =
      getFinalPrice(mayBakerProduct);

    const order1Subtotal =
      order1Quantity *
      order1UnitPrice;

    const order1Commission =
      order1Quantity *
      Math.max(
        0,
        order1UnitPrice -
          getBasePrice(mayBakerProduct)
      );

    const order1 =
      await Order.findOneAndUpdate(
        {
          orderNumber:
            "ORD-LUTH-250001",
        },
        {
          $set: {
            orderNumber:
              "ORD-LUTH-250001",

            procurementId:
              procurement._id,

            buyerId:
              BUYER_ID,

            buyerName:
              BUYER_NAME,

            supplierId:
              mayBaker._id,

            supplierName:
              mayBaker.organizationName ??
              "May & Baker Nigeria Plc",

            supplierType:
              mayBaker.supplierType ??
              "importer",

            items: [
              {
                productId:
                  PARACETAMOL_PRODUCT_ID,

                supplierProductId:
                  mayBakerProduct._id,

                name:
                  product.name,

                unit:
                  product.unit,

                quantity:
                  order1Quantity,

                unitPrice:
                  order1UnitPrice,

                subtotal:
                  order1Subtotal,

                batchNumber:
                  mayBakerProduct.batchNumber ??
                  "MB-PCM-2401",

                expiryDate:
                  mayBakerProduct.expiryDate ??
                  new Date(
                    "2027-08-30T23:59:59.000Z"
                  ),
              },
            ],

            subtotal:
              order1Subtotal,

            commission:
              order1Commission,

            total:
              order1Subtotal,

            paymentMethod:
              "WALLET_AND_CREDIT",

            walletAmount:
              500_000,

            creditAmount:
              Math.max(
                0,
                order1Subtotal -
                  500_000
              ),

            status:
              "COMPLETED",

            deliveryAddress:
              "LUTH Inpatient Dispensing Pharmacy, Surulere, Lagos",

            batchNumber:
              mayBakerProduct.batchNumber ??
              "MB-PCM-2401",

            expiryDate:
              mayBakerProduct.expiryDate ??
              new Date(
                "2027-08-30T23:59:59.000Z"
              ),

            trackingUpdates: [
              {
                status:
                  "PENDING",
                title:
                  "Order Placed",
                description:
                  "LUTH procurement order submitted successfully.",
                timestamp:
                  new Date(
                    "2025-01-12T09:00:00.000Z"
                  ),
              },
              {
                status:
                  "PAYMENT_CONFIRMED",
                title:
                  "Payment Confirmed",
                description:
                  "Wallet and approved credit facility were allocated to the order.",
                timestamp:
                  new Date(
                    "2025-01-12T09:05:00.000Z"
                  ),
              },
              {
                status:
                  "SUPPLIER_CONTACTED",
                title:
                  "Supplier Contacted",
                description:
                  "May & Baker confirmed availability.",
                timestamp:
                  new Date(
                    "2025-01-12T10:00:00.000Z"
                  ),
              },
              {
                status:
                  "VERIFICATION",
                title:
                  "Verification Completed",
                description:
                  "Batch and expiry information verified.",
                timestamp:
                  new Date(
                    "2025-01-13T11:30:00.000Z"
                  ),
              },
              {
                status:
                  "DELIVERED",
                title:
                  "Order Delivered",
                description:
                  "Order received by LUTH.",
                timestamp:
                  new Date(
                    "2025-01-14T15:00:00.000Z"
                  ),
              },
              {
                status:
                  "COMPLETED",
                title:
                  "Order Completed",
                description:
                  "Procurement workflow completed.",
                timestamp:
                  new Date(
                    "2025-01-14T16:00:00.000Z"
                  ),
              },
            ],
          },
        },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        }
      );

    if (!order1) {
      throw new Error(
        "Failed to create Order 1."
      );
    }

    /* =====================================================
       9. ORDER 2
    ===================================================== */

    const order2Quantity = 1500;

    const order2UnitPrice =
      getFinalPrice(neimethProduct);

    const order2Subtotal =
      order2Quantity *
      order2UnitPrice;

    const order2Commission =
      order2Quantity *
      Math.max(
        0,
        order2UnitPrice -
          getBasePrice(neimethProduct)
      );

    /*
     * Create a dedicated procurement for Order 2.
     */
    const procurement2 =
      await Procurement.findOneAndUpdate(
        {
          procurementNumber:
            "PRC-2025-8823",
        },
        {
          $set: {
            procurementNumber:
              "PRC-2025-8823",

            buyerId:
              BUYER_ID,

            buyerName:
              BUYER_NAME,

            items: [
              {
                productId:
                  PARACETAMOL_PRODUCT_ID,

                productName:
                  product.name,

                quantity:
                  order2Quantity,

                unit:
                  product.unit,
              },
            ],

            status:
              "COMPLETED",

            supplierCandidates: [
              {
                supplierId:
                  neimeth._id,

                supplierName:
                  neimeth.organizationName ??
                  "Neimeth International Pharmaceuticals Plc",

                supplierType:
                  neimeth.supplierType ??
                  "importer",

                supplierProductId:
                  neimethProduct._id,

                unitPrice:
                  order2UnitPrice,

                totalPrice:
                  order2Subtotal,

                stock:
                  neimethProduct.stock,

                rank: 1,

                score: 89,

                status:
                  "ACCEPTED",
              },
            ],

            currentSupplierIndex:
              0,

            currentSupplierId:
              neimeth._id,

            currentSupplierName:
              neimeth.organizationName ??
              "Neimeth International Pharmaceuticals Plc",

            attemptHistory: [
              {
                attemptNumber: 1,
                supplierId:
                  neimeth._id,
                supplierName:
                  neimeth.organizationName ??
                  "Neimeth International Pharmaceuticals Plc",
                supplierType:
                  neimeth.supplierType ??
                  "importer",
                offeredPrice:
                  getBasePrice(
                    neimethProduct
                  ),
                status:
                  "ACCEPTED",
                contactedAt:
                  new Date(
                    "2025-01-15T09:00:00.000Z"
                  ),
                respondedAt:
                  new Date(
                    "2025-01-15T10:00:00.000Z"
                  ),
              },
            ],

            deliveryAddress:
              "LUTH Inpatient Dispensing Pharmacy, Surulere, Lagos",
          },
        },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        }
      );

    /* =====================================================
       10. ORDER 2
    ===================================================== */

    const order2 =
      await Order.findOneAndUpdate(
        {
          orderNumber:
            "ORD-LUTH-250002",
        },
        {
          $set: {
            orderNumber:
              "ORD-LUTH-250002",

            procurementId:
              procurement2._id,

            buyerId:
              BUYER_ID,

            buyerName:
              BUYER_NAME,

            supplierId:
              neimeth._id,

            supplierName:
              neimeth.organizationName ??
              "Neimeth International Pharmaceuticals Plc",

            supplierType:
              neimeth.supplierType ??
              "importer",

            items: [
              {
                productId:
                  PARACETAMOL_PRODUCT_ID,

                supplierProductId:
                  neimethProduct._id,

                name:
                  product.name,

                unit:
                  product.unit,

                quantity:
                  order2Quantity,

                unitPrice:
                  order2UnitPrice,

                subtotal:
                  order2Subtotal,

                batchNumber:
                  neimethProduct.batchNumber ??
                  "NM-PCM-2404",

                expiryDate:
                  neimethProduct.expiryDate ??
                  new Date(
                    "2027-01-20T23:59:59.000Z"
                  ),
              },
            ],

            subtotal:
              order2Subtotal,

            commission:
              order2Commission,

            total:
              order2Subtotal,

            paymentMethod:
              "CREDIT",

            walletAmount:
              0,

            creditAmount:
              order2Subtotal,

            status:
              "DELIVERED",

            deliveryAddress:
              "LUTH Inpatient Dispensing Pharmacy, Surulere, Lagos",

            batchNumber:
              neimethProduct.batchNumber ??
              "NM-PCM-2404",

            expiryDate:
              neimethProduct.expiryDate ??
              new Date(
                "2027-01-20T23:59:59.000Z"
              ),

            trackingUpdates: [
              {
                status:
                  "PENDING",
                title:
                  "Credit Order Placed",
                description:
                  "LUTH submitted an order using its approved credit facility.",
                timestamp:
                  new Date(
                    "2025-01-15T09:00:00.000Z"
                  ),
              },
              {
                status:
                  "PAYMENT_CONFIRMED",
                title:
                  "Credit Approved",
                description:
                  "Order approved against the buyer credit facility.",
                timestamp:
                  new Date(
                    "2025-01-15T09:10:00.000Z"
                  ),
              },
              {
                status:
                  "SUPPLIER_CONTACTED",
                title:
                  "Supplier Confirmed",
                description:
                  "Neimeth confirmed stock availability.",
                timestamp:
                  new Date(
                    "2025-01-15T10:00:00.000Z"
                  ),
              },
              {
                status:
                  "VERIFICATION",
                title:
                  "Verification Completed",
                description:
                  "Batch and expiry information verified.",
                timestamp:
                  new Date(
                    "2025-01-16T12:00:00.000Z"
                  ),
              },
              {
                status:
                  "DELIVERED",
                title:
                  "Order Delivered",
                description:
                  "Shipment received by LUTH.",
                timestamp:
                  new Date(
                    "2025-01-18T14:00:00.000Z"
                  ),
              },
            ],
          },
        },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        }
      );

    /* =====================================================
       11. ORDER 3
    ===================================================== */

    const order3Quantity = 1000;

    const order3UnitPrice =
      getFinalPrice(juhelProduct);

    const order3Subtotal =
      order3Quantity *
      order3UnitPrice;

    const order3Commission =
      order3Quantity *
      Math.max(
        0,
        order3UnitPrice -
          getBasePrice(juhelProduct)
      );

    const procurement3 =
      await Procurement.findOneAndUpdate(
        {
          procurementNumber:
            "PRC-2025-8824",
        },
        {
          $set: {
            procurementNumber:
              "PRC-2025-8824",

            buyerId:
              BUYER_ID,

            buyerName:
              BUYER_NAME,

            items: [
              {
                productId:
                  PARACETAMOL_PRODUCT_ID,

                productName:
                  product.name,

                quantity:
                  order3Quantity,

                unit:
                  product.unit,
              },
            ],

            status:
              "ORDER_CREATED",

            supplierCandidates: [
              {
                supplierId:
                  juhel._id,

                supplierName:
                  juhel.organizationName ??
                  "Juhel Nigeria Limited",

                supplierType:
                  juhel.supplierType ??
                  "distributor",

                supplierProductId:
                  juhelProduct._id,

                unitPrice:
                  order3UnitPrice,

                totalPrice:
                  order3Subtotal,

                stock:
                  juhelProduct.stock,

                rank: 1,

                score: 86,

                status:
                  "ACCEPTED",
              },
            ],

            currentSupplierIndex:
              0,

            currentSupplierId:
              juhel._id,

            currentSupplierName:
              juhel.organizationName ??
              "Juhel Nigeria Limited",

            attemptHistory: [
              {
                attemptNumber: 1,
                supplierId:
                  juhel._id,
                supplierName:
                  juhel.organizationName ??
                  "Juhel Nigeria Limited",
                supplierType:
                  juhel.supplierType ??
                  "distributor",
                offeredPrice:
                  getBasePrice(
                    juhelProduct
                  ),
                status:
                  "ACCEPTED",
                contactedAt:
                  new Date(
                    "2025-01-20T10:30:00.000Z"
                  ),
                respondedAt:
                  new Date(
                    "2025-01-20T11:00:00.000Z"
                  ),
              },
            ],

            deliveryAddress:
              "LUTH Inpatient Dispensing Pharmacy, Surulere, Lagos",
          },
        },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        }
      );

    /* =====================================================
       12. ORDER 3
    ===================================================== */

    const order3 =
      await Order.findOneAndUpdate(
        {
          orderNumber:
            "ORD-LUTH-250003",
        },
        {
          $set: {
            orderNumber:
              "ORD-LUTH-250003",

            procurementId:
              procurement3._id,

            buyerId:
              BUYER_ID,

            buyerName:
              BUYER_NAME,

            supplierId:
              juhel._id,

            supplierName:
              juhel.organizationName ??
              "Juhel Nigeria Limited",

            supplierType:
              juhel.supplierType ??
              "distributor",

            items: [
              {
                productId:
                  PARACETAMOL_PRODUCT_ID,

                supplierProductId:
                  juhelProduct._id,

                name:
                  product.name,

                unit:
                  product.unit,

                quantity:
                  order3Quantity,

                unitPrice:
                  order3UnitPrice,

                subtotal:
                  order3Subtotal,

                batchNumber:
                  juhelProduct.batchNumber ??
                  "JH-PCM-2407",

                expiryDate:
                  juhelProduct.expiryDate ??
                  new Date(
                    "2026-12-05T23:59:59.000Z"
                  ),
              },
            ],

            subtotal:
              order3Subtotal,

            commission:
              order3Commission,

            total:
              order3Subtotal,

            paymentMethod:
              "WALLET_AND_CREDIT",

            walletAmount:
              500_000,

            creditAmount:
              Math.max(
                0,
                order3Subtotal -
                  500_000
              ),

            status:
              "IN_TRANSIT",

            deliveryAddress:
              "LUTH Inpatient Dispensing Pharmacy, Surulere, Lagos",

            batchNumber:
              juhelProduct.batchNumber ??
              "JH-PCM-2407",

            expiryDate:
              juhelProduct.expiryDate ??
              new Date(
                "2026-12-05T23:59:59.000Z"
              ),

            trackingUpdates: [
              {
                status:
                  "PENDING",
                title:
                  "Order Placed",
                description:
                  "LUTH submitted a mixed wallet and credit procurement request.",
                timestamp:
                  new Date(
                    "2025-01-20T08:30:00.000Z"
                  ),
              },
              {
                status:
                  "PAYMENT_CONFIRMED",
                title:
                  "Payment Confirmed",
                description:
                  "₦500,000 allocated from wallet and the remaining amount approved against credit.",
                timestamp:
                  new Date(
                    "2025-01-20T09:00:00.000Z"
                  ),
              },
              {
                status:
                  "SUPPLIER_CONTACTED",
                title:
                  "Supplier Contacted",
                description:
                  "Juhel confirmed and prepared the shipment.",
                timestamp:
                  new Date(
                    "2025-01-20T10:30:00.000Z"
                  ),
              },
              {
                status:
                  "VERIFICATION",
                title:
                  "Verification Completed",
                description:
                  "Product batch and expiry information passed verification.",
                timestamp:
                  new Date(
                    "2025-01-21T11:00:00.000Z"
                  ),
              },
              {
                status:
                  "READY_FOR_DISPATCH",
                title:
                  "Ready for Dispatch",
                description:
                  "Order passed verification and is ready for dispatch.",
                timestamp:
                  new Date(
                    "2025-01-21T14:00:00.000Z"
                  ),
              },
              {
                status:
                  "DISPATCHED",
                title:
                  "Order Dispatched",
                description:
                  "Juhel dispatched the shipment.",
                timestamp:
                  new Date(
                    "2025-01-22T08:00:00.000Z"
                  ),
              },
              {
                status:
                  "IN_TRANSIT",
                title:
                  "In Transit",
                description:
                  "Shipment is currently in transit to LUTH.",
                timestamp:
                  new Date(
                    "2025-01-22T12:00:00.000Z"
                  ),
              },
            ],
          },
        },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        }
      );

    /* =====================================================
       SUCCESS
    ===================================================== */

    steps.push({
      name: "Orders",
      status: "success",
      message: "Three buyer orders seeded successfully.",
    });

    return {
      success: true,

      message:
        "Buyer procurement, credit account, active supplier fallback and orders seeded successfully.",

      buyer: {
        id: buyer._id.toString(),
        username: buyer.username,
        name: BUYER_NAME,
        role: buyer.role,
      },

      creditAccount: {
        id: creditAccount._id.toString(),
        creditLimit:
          creditAccount.creditLimit,
        creditUsed:
          creditAccount.creditUsed,
        availableCredit:
          creditAccount.availableCredit,
        outstandingBalance:
          creditAccount.outstandingBalance,
        status:
          creditAccount.status,
        ratingTier:
          creditAccount.ratingTier,
      },

      procurement: {
        id: procurement._id.toString(),
        procurementNumber:
          procurement.procurementNumber,
        status:
          procurement.status,
        currentSupplierName:
          procurement.currentSupplierName,
        candidates:
          procurement.supplierCandidates
            .length,
      },

      orders: [
        order1,
        order2,
        order3,
      ].map((order) => ({
        id: order._id.toString(),
        orderNumber:
          order.orderNumber,
        supplierName:
          order.supplierName,
        total:
          order.total,
        paymentMethod:
          order.paymentMethod,
        status:
          order.status,
      })),

      steps,
    };
  } catch (error) {
    console.error(
      "SEED BUYER PROCUREMENT ERROR:",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "Unknown seeding error.";

    steps.push({
      name: "Seed Process",
      status: "failed",
      message,
    });

    return {
      success: false,
      message:
        "Seeding failed.",
      error: message,
      steps,
    };
  }
}