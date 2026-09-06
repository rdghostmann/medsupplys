// /controllers/admin-seed-orders.action.ts
"use server";

import { connectToDB } from "@/lib/connectToDB";

import { User } from "@/models/User";
import { Product } from "@/models/Product";
import { SupplierProduct } from "@/models/SupplierProduct";
import { Order } from "@/models/Order";
import { SupplierPayout } from "@/models/SupplierPayout";

import { Types } from "mongoose";

/* -------------------------------------------------------------------------- */
/* Constants                                                                  */
/* -------------------------------------------------------------------------- */

const SUPPLIER_ID =
  "6a9cb82e853e785e43c110b9";

/**
 * This seed is specifically for:
 * May & Baker Nigeria Plc
 */
const SUPPLIER_OBJECT_ID =
  new Types.ObjectId(SUPPLIER_ID);

/* -------------------------------------------------------------------------- */
/* Mock Seed Types                                                            */
/* -------------------------------------------------------------------------- */

interface MockOrder {
  id: string;

  orderNumber: string;

  supplierId: string;

  buyerName: string;

  buyerId: string;

  items: {
    id: string;
    name: string;
    quantity: number;
    unitPrice: number;
  }[];

  batchNumber: string;

  paymentMethod:
    | "BANK_TRANSFER"
    | "CREDIT_FACILITY"
    | "WALLET";

  status:
    | "COMPLETED"
    | "DELIVERED"
    | "IN_TRANSIT"
    | "PROCESSING"
    | "VERIFICATION"
    | "READY_FOR_DISPATCH";

  total: number;

  commission: number;

  subtotal: number;

  createdAt: string;
}

interface MockPayout {
  id: string;

  supplierId: string;

  reference: string;

  amount: number;

  transferFee: number;

  netAmount: number;

  status:
    | "PENDING"
    | "PROCESSING"
    | "SETTLED"
    | "FAILED"
    | "REVERSED";

  bankName: string;

  accountNumber: string;

  accountName: string;

  notes: string;

  createdAt: string;
}

/* -------------------------------------------------------------------------- */
/* Mock Orders                                                                */
/* -------------------------------------------------------------------------- */

const MOCK_ORDERS: MockOrder[] = [
  {
    id: "ord-001",

    orderNumber:
      "MS-ORD-2026-00871",

    supplierId:
      SUPPLIER_ID,

    buyerName:
      "St. Mary's Hospital Procurement",

    buyerId:
      "buyer-001",

    items: [
      {
        id: "item-001",

        name:
          "Paracetamol 500mg Tablets",

        quantity: 5000,

        unitPrice: 120,
      },
    ],

    batchNumber:
      "PCM-2026-081",

    paymentMethod:
      "BANK_TRANSFER",

    status:
      "COMPLETED",

    total:
      660000,

    commission:
      60000,

    subtotal:
      600000,

    createdAt:
      "2026-08-28T09:30:00.000Z",
  },

  {
    id: "ord-002",

    orderNumber:
      "MS-ORD-2026-00866",

    supplierId:
      SUPPLIER_ID,

    buyerName:
      "Rivers State University Teaching Hospital",

    buyerId:
      "buyer-002",

    items: [
      {
        id: "item-002",

        name:
          "Amoxicillin 500mg Capsules",

        quantity: 2000,

        unitPrice: 250,
      },
    ],

    batchNumber:
      "AMX-2026-442",

    paymentMethod:
      "CREDIT_FACILITY",

    status:
      "DELIVERED",

    total:
      550000,

    commission:
      50000,

    subtotal:
      500000,

    createdAt:
      "2026-08-25T11:15:00.000Z",
  },

  {
    id: "ord-003",

    orderNumber:
      "MS-ORD-2026-00859",

    supplierId:
      SUPPLIER_ID,

    buyerName:
      "University of Port Harcourt Medical Centre",

    buyerId:
      "buyer-003",

    items: [
      {
        id: "item-003",

        name:
          "Artemether/Lumefantrine 20/120mg",

        quantity: 1500,

        unitPrice: 350,
      },
    ],

    batchNumber:
      "AL-2026-198",

    paymentMethod:
      "WALLET",

    status:
      "IN_TRANSIT",

    total:
      577500,

    commission:
      52500,

    subtotal:
      525000,

    createdAt:
      "2026-08-22T14:40:00.000Z",
  },

  {
    id: "ord-004",

    orderNumber:
      "MS-ORD-2026-00843",

    supplierId:
      SUPPLIER_ID,

    buyerName:
      "UPTH Central Procurement Unit",

    buyerId:
      "buyer-004",

    items: [
      {
        id: "item-004",

        name:
          "Metformin 500mg Tablets",

        quantity: 3000,

        unitPrice: 220,
      },
    ],

    batchNumber:
      "MET-2026-309",

    paymentMethod:
      "BANK_TRANSFER",

    status:
      "PROCESSING",

    total:
      726000,

    commission:
      66000,

    subtotal:
      660000,

    createdAt:
      "2026-08-20T08:20:00.000Z",
  },

  {
    id: "ord-005",

    orderNumber:
      "MS-ORD-2026-00831",

    supplierId:
      SUPPLIER_ID,

    buyerName:
      "Niger Delta Specialist Hospital",

    buyerId:
      "buyer-005",

    items: [
      {
        id: "item-005",

        name:
          "Vitamin C 1000mg Tablets",

        quantity: 4000,

        unitPrice: 90,
      },
    ],

    batchNumber:
      "VTC-2026-712",

    paymentMethod:
      "CREDIT_FACILITY",

    status:
      "VERIFICATION",

    total:
      396000,

    commission:
      36000,

    subtotal:
      360000,

    createdAt:
      "2026-08-18T15:05:00.000Z",
  },

  {
    id: "ord-006",

    orderNumber:
      "MS-ORD-2026-00818",

    supplierId:
      SUPPLIER_ID,

    buyerName:
      "Government House Medical Centre",

    buyerId:
      "buyer-006",

    items: [
      {
        id: "item-006",

        name:
          "Amlodipine 5mg Tablets",

        quantity: 2500,

        unitPrice: 200,
      },
    ],

    batchNumber:
      "AML-2026-551",

    paymentMethod:
      "BANK_TRANSFER",

    status:
      "READY_FOR_DISPATCH",

    total:
      550000,

    commission:
      50000,

    subtotal:
      500000,

    createdAt:
      "2026-08-15T10:45:00.000Z",
  },

  {
    id: "ord-007",

    orderNumber:
      "MS-ORD-2026-00794",

    supplierId:
      SUPPLIER_ID,

    buyerName:
      "St. Mary’s Catholic Hospital",

    buyerId:
      "buyer-007",

    items: [
      {
        id: "item-007",

        name:
          "Omeprazole 20mg Capsules",

        quantity: 1800,

        unitPrice: 160,
      },
    ],

    batchNumber:
      "OMP-2026-227",

    paymentMethod:
      "WALLET",

    status:
      "COMPLETED",

    total:
      316800,

    commission:
      28800,

    subtotal:
      288000,

    createdAt:
      "2026-08-10T12:10:00.000Z",
  },
];

/* -------------------------------------------------------------------------- */
/* Mock Supplier Payouts                                                      */
/* -------------------------------------------------------------------------- */

const MOCK_PAYOUTS: MockPayout[] = [
  {
    id: "pay-001",

    supplierId:
      SUPPLIER_ID,

    reference:
      "NIBSS-MS-260828-001",

    amount:
      450000,

    transferFee:
      50,

    netAmount:
      449950,

    status:
      "SETTLED",

    bankName:
      "Zenith Bank Plc",

    accountNumber:
      "1014892841",

    accountName:
      "MAY & BAKER NIGERIA PLC",

    notes:
      "Weekly wholesale settlement",

    createdAt:
      "2026-08-28T15:30:00.000Z",
  },

  {
    id: "pay-002",

    supplierId:
      SUPPLIER_ID,

    reference:
      "NIBSS-MS-260820-002",

    amount:
      350000,

    transferFee:
      50,

    netAmount:
      349950,

    status:
      "SETTLED",

    bankName:
      "Zenith Bank Plc",

    accountNumber:
      "1014892841",

    accountName:
      "MAY & BAKER NIGERIA PLC",

    notes:
      "Completed order liquidation",

    createdAt:
      "2026-08-20T13:10:00.000Z",
  },

  {
    id: "pay-003",

    supplierId:
      SUPPLIER_ID,

    reference:
      "NIBSS-MS-260812-003",

    amount:
      275000,

    transferFee:
      50,

    netAmount:
      274950,

    status:
      "SETTLED",

    bankName:
      "Zenith Bank Plc",

    accountNumber:
      "1014892841",

    accountName:
      "MAY & BAKER NIGERIA PLC",

    notes:
      "Monthly settlement",

    createdAt:
      "2026-08-12T09:45:00.000Z",
  },
];

/* -------------------------------------------------------------------------- */
/* Payment Method Normalization                                               */
/* -------------------------------------------------------------------------- */

/**
 * Current Order model supports:
 *
 * WALLET
 * CREDIT
 * WALLET_AND_CREDIT
 *
 * Therefore legacy/mock payment names are normalized
 * before being written to MongoDB.
 */
function normalizePaymentMethod(
  method: MockOrder["paymentMethod"]
): "WALLET" | "CREDIT" | "WALLET_AND_CREDIT" {
  switch (method) {
    case "CREDIT_FACILITY":
      return "CREDIT";

    /**
     * The current MedSupply architecture does not have
     * BANK_TRANSFER as an Order payment method.
     *
     * We therefore treat this mock payment as a
     * wallet-funded transaction for database compatibility.
     */
    case "BANK_TRANSFER":
      return "WALLET";

    case "WALLET":
    default:
      return "WALLET";
  }
}

/* -------------------------------------------------------------------------- */
/* Order Status Normalization                                                 */
/* -------------------------------------------------------------------------- */

function normalizeOrderStatus(
  status: MockOrder["status"]
): "COMPLETED"
  | "DELIVERED"
  | "IN_TRANSIT"
  | "PAYMENT_CONFIRMED"
  | "VERIFICATION"
  | "READY_FOR_DISPATCH" {
  switch (status) {
    /**
     * Current Order model does not have PROCESSING.
     */
    case "PROCESSING":
      return "PAYMENT_CONFIRMED";

    default:
      return status;
  }
}

/* -------------------------------------------------------------------------- */
/* Supplier Product Matching                                                  */
/* -------------------------------------------------------------------------- */

function normalizeProductName(
  value: string
) {
  return value
    .toLowerCase()
    .replace(
      /[\/\-_,]/g,
      " "
    )
    .replace(
      /\s+/g,
      " "
    )
    .trim();
}

/* -------------------------------------------------------------------------- */
/* Tracking Updates                                                           */
/* -------------------------------------------------------------------------- */

function buildTrackingUpdates(
  mockOrder: MockOrder,
  normalizedStatus: ReturnType<
    typeof normalizeOrderStatus
  >
) {
  const createdAt =
    new Date(
      mockOrder.createdAt
    );

  const updates = [
    {
      status: "PENDING",
      title: "Order Placed",
      description:
        "Order was successfully created in the MedSupply marketplace.",
      timestamp: new Date(
        createdAt.getTime()
      ),
    },
    {
      status: "PAYMENT_CONFIRMED",
      title: "Payment Confirmed",
      description:
        "Buyer payment allocation was confirmed for this order.",
      timestamp: new Date(
        createdAt.getTime() +
          5 * 60 * 1000
      ),
    },
    {
      status: "SUPPLIER_CONTACTED",
      title: "Supplier Contacted",
      description:
        "May & Baker Nigeria Plc was contacted regarding the procurement order.",
      timestamp: new Date(
        createdAt.getTime() +
          60 * 60 * 1000
      ),
    },
  ];

  if (
    normalizedStatus ===
    "VERIFICATION"
  ) {
    updates.push({
      status: "VERIFICATION",
      title:
        "Verification In Progress",
      description:
        "Product batch and expiry information is undergoing verification.",
      timestamp: new Date(
        createdAt.getTime() +
          2 * 60 * 60 * 1000
      ),
    });
  }

  if (
    normalizedStatus ===
    "READY_FOR_DISPATCH"
  ) {
    updates.push({
      status:
        "READY_FOR_DISPATCH",
      title:
        "Ready for Dispatch",
      description:
        "Order passed verification and is ready for supplier dispatch.",
      timestamp: new Date(
        createdAt.getTime() +
          3 * 60 * 60 * 1000
      ),
    });
  }

  if (
    normalizedStatus ===
    "IN_TRANSIT"
  ) {
    updates.push(
      {
        status:
          "READY_FOR_DISPATCH",
        title:
          "Ready for Dispatch",
        description:
          "Order passed verification and was prepared for dispatch.",
        timestamp: new Date(
          createdAt.getTime() +
            3 * 60 * 60 * 1000
        ),
      },
      {
        status:
          "DISPATCHED",
        title:
          "Order Dispatched",
        description:
          "May & Baker dispatched the pharmaceutical shipment.",
        timestamp: new Date(
          createdAt.getTime() +
            5 * 60 * 60 * 1000
        ),
      },
      {
        status:
          "IN_TRANSIT",
        title:
          "In Transit",
        description:
          "Shipment is currently in transit to the buyer.",
        timestamp: new Date(
          createdAt.getTime() +
            7 * 60 * 60 * 1000
        ),
      }
    );
  }

  if (
    normalizedStatus ===
    "DELIVERED"
  ) {
    updates.push(
      {
        status:
          "VERIFICATION",
        title:
          "Verification Completed",
        description:
          "Product batch and expiry information passed verification.",
        timestamp: new Date(
          createdAt.getTime() +
            2 * 60 * 60 * 1000
        ),
      },
      {
        status:
          "IN_TRANSIT",
        title:
          "Order In Transit",
        description:
          "Shipment was dispatched to the buyer.",
        timestamp: new Date(
          createdAt.getTime() +
            4 * 60 * 60 * 1000
        ),
      },
      {
        status:
          "DELIVERED",
        title:
          "Order Delivered",
        description:
          "Shipment was delivered to the buyer.",
        timestamp: new Date(
          createdAt.getTime() +
            8 * 60 * 60 * 1000
        ),
      }
    );
  }

  if (
    normalizedStatus ===
    "COMPLETED"
  ) {
    updates.push(
      {
        status:
          "VERIFICATION",
        title:
          "Verification Completed",
        description:
          "Product batch and expiry information passed verification.",
        timestamp: new Date(
          createdAt.getTime() +
            2 * 60 * 60 * 1000
        ),
      },
      {
        status:
          "DELIVERED",
        title:
          "Order Delivered",
        description:
          "Shipment was successfully received by the buyer.",
        timestamp: new Date(
          createdAt.getTime() +
            8 * 60 * 60 * 1000
        ),
      },
      {
        status:
          "COMPLETED",
        title:
          "Order Completed",
        description:
          "The pharmaceutical procurement workflow was completed.",
        timestamp: new Date(
          createdAt.getTime() +
            9 * 60 * 60 * 1000
        ),
      }
    );
  }

  if (
    normalizedStatus ===
    "PAYMENT_CONFIRMED"
  ) {
    // Already represented by the base updates.
  }

  return updates;
}

/* -------------------------------------------------------------------------- */
/* Seed Orders + Payouts                                                      */
/* -------------------------------------------------------------------------- */

export async function seedMockOrdersAndSupplierPayouts() {
  try {
    await connectToDB();

    /* ====================================================================== */
    /* 1. VALIDATE SUPPLIER ID                                                */
    /* ====================================================================== */

    if (
      !Types.ObjectId.isValid(
        SUPPLIER_ID
      )
    ) {
      return {
        success: false,
        message:
          "Invalid May & Baker supplier ObjectId.",
        supplierId:
          SUPPLIER_ID,
        ordersCreated: 0,
        payoutsCreated: 0,
      };
    }

    /* ====================================================================== */
    /* 2. VERIFY MAY & BAKER SUPPLIER                                          */
    /* ====================================================================== */

    const supplier =
      await User.findOne({
        _id: SUPPLIER_OBJECT_ID,
        role: "supplier",
      })
        .select(
          "_id username fullName organizationName supplierType settlementBankName settlementAccountNumber settlementAccountName"
        )
        .lean();

    if (!supplier) {
      return {
        success: false,

        message:
          `Supplier ${SUPPLIER_ID} was not found or is not a supplier.`,

        supplierId:
          SUPPLIER_ID,

        ordersCreated: 0,
        payoutsCreated: 0,
      };
    }

    const supplierName =
      supplier.organizationName ||
      supplier.username ||
      "May & Baker Nigeria Plc";

    const supplierType =
      String(
        supplier.supplierType ||
          "importer"
      ).toLowerCase();

    /* ====================================================================== */
    /* 3. GET ACTUAL BUYER USERS                                              */
    /* ====================================================================== */

    /**
     * buyerId values in the mock data such as
     * "buyer-001" are UI/mock identifiers and are
     * NOT valid MongoDB ObjectIds.
     *
     * We therefore resolve seven real buyer users
     * and assign one unique buyerId to each order.
     */
    const buyerUsers =
      await User.find({
        role: "buyer",
      })
        .select(
          "_id username fullName organizationName email"
        )
        .sort({
          createdAt: 1,
        })
        .limit(
          MOCK_ORDERS.length
        )
        .lean();

    if (
      buyerUsers.length <
      MOCK_ORDERS.length
    ) {
      return {
        success: false,

        message:
          `Seven buyer users are required. Found ${buyerUsers.length}. Seed at least 7 buyer users before seeding these orders.`,

        supplierId:
          SUPPLIER_ID,

        ordersCreated: 0,
        payoutsCreated: 0,
      };
    }

    /* ====================================================================== */
    /* 4. VERIFY SUPPLIER PRODUCTS                                            */
    /* ====================================================================== */

    /**
     * Every order must reference a SupplierProduct
     * belonging specifically to May & Baker.
     */
    const supplierProducts =
      await SupplierProduct.find({
        supplierId:
          SUPPLIER_OBJECT_ID,
      })
        .populate({
          path: "productId",
          model: "Product",
        })
        .lean();

    if (
      supplierProducts.length ===
      0
    ) {
      return {
        success: false,

        message:
          `No SupplierProduct records were found for May & Baker (${SUPPLIER_ID}). Seed May & Baker supplier inventory first.`,

        supplierId:
          SUPPLIER_ID,

        ordersCreated: 0,
        payoutsCreated: 0,
      };
    }

    /* ====================================================================== */
    /* 5. PRODUCT / SUPPLIER PRODUCT RESOLVER                                 */
    /* ====================================================================== */

    const findSupplierProduct =
      (
        mockProductName: string
      ) => {
        const normalizedMockName =
          normalizeProductName(
            mockProductName
          );

        return supplierProducts.find(
          (supplierProduct: any) => {
            const product =
              supplierProduct.productId;

            if (
              !product ||
              !product._id
            ) {
              return false;
            }

            const productNames = [
              product.name,
              product.genericName,
              product.brandName,
            ]
              .filter(Boolean)
              .map(
                (
                  name: string
                ) =>
                  normalizeProductName(
                    name
                  )
              );

            return productNames.some(
              (
                productName: string
              ) =>
                productName ===
                  normalizedMockName ||
                productName.includes(
                  normalizedMockName
                ) ||
                normalizedMockName.includes(
                  productName
                )
            );
          }
        );
      };

    /* ====================================================================== */
    /* 6. VERIFY ALL REQUIRED PRODUCTS BEFORE CREATING ORDERS                 */
    /* ====================================================================== */

    const missingProducts: string[] =
      [];

    for (const mockOrder of MOCK_ORDERS) {
      const mockItem =
        mockOrder.items[0];

      const supplierProduct =
        findSupplierProduct(
          mockItem.name
        );

      if (
        !supplierProduct
      ) {
        missingProducts.push(
          mockItem.name
        );
      }
    }

    if (
      missingProducts.length
    ) {
      return {
        success: false,

        message:
          `The following May & Baker SupplierProducts are missing: ${[
            ...new Set(
              missingProducts
            ),
          ].join(", ")}. Seed the supplier inventory before seeding orders.`,

        supplierId:
          SUPPLIER_ID,

        missingProducts: [
          ...new Set(
            missingProducts
          ),
        ],

        ordersCreated: 0,
        payoutsCreated: 0,
      };
    }

    /* ====================================================================== */
    /* 7. CHECK EXISTING ORDERS                                               */
    /* ====================================================================== */

    const orderNumbers =
      MOCK_ORDERS.map(
        (order) =>
          order.orderNumber
      );

    const existingOrders =
      await Order.find({
        orderNumber: {
          $in:
            orderNumbers,
        },
      })
        .select(
          "_id orderNumber supplierId"
        )
        .lean();

    const existingOrderNumbers =
      new Set(
        existingOrders.map(
          (order) =>
            order.orderNumber
        )
      );

    /* ====================================================================== */
    /* 8. CREATE ORDERS                                                        */
    /* ====================================================================== */

    const createdOrders: any[] =  [];

    const skippedOrders: string[] =  [];

    for (
      let index = 0;
      index <
      MOCK_ORDERS.length;
      index++
    ) {
      const mockOrder =
        MOCK_ORDERS[index];

      /* -------------------------------------------------------------------- */
      /* Skip existing order                                                  */
      /* -------------------------------------------------------------------- */

      if (
        existingOrderNumbers.has(
          mockOrder.orderNumber
        )
      ) {
        skippedOrders.push(
          mockOrder.orderNumber
        );

        continue;
      }

      const mockItem =
        mockOrder.items[0];

      /* -------------------------------------------------------------------- */
      /* Resolve May & Baker SupplierProduct                                  */
      /* -------------------------------------------------------------------- */

      const supplierProduct =
        findSupplierProduct(
          mockItem.name
        );

      if (
        !supplierProduct
      ) {
        continue;
      }

      const product =  supplierProduct.productId as any;

      if (
        !product?._id
      ) {
        continue;
      }

      /* -------------------------------------------------------------------- */
      /* Resolve Unique Buyer                                                 */
      /* -------------------------------------------------------------------- */

      const buyer =
        buyerUsers[index];

      const buyerName =
        buyer.organizationName ||
        buyer.username ||
        mockOrder.buyerName;

      /* -------------------------------------------------------------------- */
      /* Normalize Payment                                                    */
      /* -------------------------------------------------------------------- */

      const paymentMethod =
        normalizePaymentMethod(
          mockOrder.paymentMethod
        );

      /* -------------------------------------------------------------------- */
      /* Payment Allocation                                                   */
      /* -------------------------------------------------------------------- */

      let walletAmount = 0;
      let creditAmount = 0;

      switch (
        paymentMethod
      ) {
        case "WALLET":
          walletAmount =
            mockOrder.total;
          break;

        case "CREDIT":
          creditAmount =
            mockOrder.total;
          break;

        case "WALLET_AND_CREDIT":
          walletAmount =
            Math.round(
              mockOrder.total *
                0.7
            );

          creditAmount =
            mockOrder.total -
            walletAmount;

          break;
      }

      /* -------------------------------------------------------------------- */
      /* Normalize Status                                                     */
      /* -------------------------------------------------------------------- */

      const normalizedStatus =
        normalizeOrderStatus(
          mockOrder.status
        );

      /* -------------------------------------------------------------------- */
      /* Expiry                                                               */
      /* -------------------------------------------------------------------- */

      /**
       * The supplied mock data does not contain expiry dates.
       *
       * Until the SupplierProduct schema exposes and supplies
       * its actual expiryDate, use a valid future seed date.
       */
      const expiryDate = new Date( "2028-08-31T23:59:59.000Z");

      /* -------------------------------------------------------------------- */
      /* Procurement Reference                                                */
      /* -------------------------------------------------------------------- */

      /**
       * These are mock committed orders.
       *
       * In the real procurement workflow, this MUST be
       * the actual Procurement._id.
       */
      const procurementId =   new Types.ObjectId();

      /* -------------------------------------------------------------------- */
      /* Create Order                                                         */
      /* -------------------------------------------------------------------- */

      const order =
        await Order.create({
          orderNumber:
            mockOrder.orderNumber,

          procurementId,

          /**
           * IMPORTANT:
           * Each order receives a different real buyerId.
           */
          buyerId:
            buyer._id,

          buyerName,

          /**
           * IMPORTANT:
           * Every order belongs to the fixed May & Baker
           * supplier.
           */
          supplierId:
            SUPPLIER_OBJECT_ID,

          supplierName,

          supplierType,

          items: [
            {
              productId:
                product._id,

              supplierProductId:
                supplierProduct._id,

              name:
                mockItem.name,

              unit:
                product.unit ||
                "unit",

              quantity:
                mockItem.quantity,

              unitPrice:
                mockItem.unitPrice,

              subtotal:
                mockOrder.subtotal,

              batchNumber:
                mockOrder.batchNumber,

              expiryDate,
            },
          ],

          subtotal:
            mockOrder.subtotal,

          commission:
            mockOrder.commission,

          total:
            mockOrder.total,

          paymentMethod,

          walletAmount,

          creditAmount,

          status:
            normalizedStatus,

          deliveryAddress:
            `${buyerName}, Port Harcourt, Rivers State`,

          batchNumber:
            mockOrder.batchNumber,

          expiryDate,

          trackingUpdates:
            buildTrackingUpdates(
              mockOrder,
              normalizedStatus
            ),

          createdAt:
            new Date(
              mockOrder.createdAt
            ),
        });

      createdOrders.push(
        order
      );
    }

    /* ====================================================================== */
    /* 9. CHECK EXISTING PAYOUTS                                              */
    /* ====================================================================== */

    const payoutReferences =
      MOCK_PAYOUTS.map(
        (payout) =>
          payout.reference
      );

    const existingPayouts =
      await SupplierPayout.find({
        reference: {
          $in:
            payoutReferences,
        },
      })
        .select(
          "_id reference supplierId"
        )
        .lean();

    const existingPayoutReferences =
      new Set(
        existingPayouts.map(
          (payout) =>
            payout.reference
        )
      );

    /* ====================================================================== */
    /* 10. GET MAY & BAKER ORDERS                                             */
    /* ====================================================================== */

    const allSupplierOrders =
      await Order.find({
        supplierId:
          SUPPLIER_OBJECT_ID,
      })
        .sort({
          createdAt: -1,
        })
        .select(
          "_id orderNumber status total createdAt"
        )
        .lean();

    /* ====================================================================== */
    /* 11. CREATE PAYOUTS                                                     */
    /* ====================================================================== */

    const createdPayouts: any[] =   [];

    const skippedPayouts: string[] =  [];

    /**
     * We intentionally keep payout → order mappings
     * deterministic.
     *
     * The supplied mock payout data did not provide
     * orderIds, so these links are only seed relationships.
     */
    const payoutOrderMap: Record<
      string,
      string[]
    > = {
      "NIBSS-MS-260828-001": [
        "MS-ORD-2026-00871",
        "MS-ORD-2026-00866",
      ],

      "NIBSS-MS-260820-002": [
        "MS-ORD-2026-00794",
      ],

      "NIBSS-MS-260812-003": [],
    };

    for (
      const mockPayout of MOCK_PAYOUTS
    ) {
      /* -------------------------------------------------------------------- */
      /* Skip existing payout                                                 */
      /* -------------------------------------------------------------------- */

      if (
        existingPayoutReferences.has(
          mockPayout.reference
        )
      ) {
        skippedPayouts.push(
          mockPayout.reference
        );

        continue;
      }

      /* -------------------------------------------------------------------- */
      /* Resolve Linked Orders                                                */
      /* -------------------------------------------------------------------- */

      const linkedOrderNumbers =
        payoutOrderMap[
          mockPayout.reference
        ] || [];

      const payoutOrders =
        allSupplierOrders.filter(
          (order) =>
            linkedOrderNumbers.includes(
              order.orderNumber
            )
        );

      /* -------------------------------------------------------------------- */
      /* Create Payout                                                        */
      /* -------------------------------------------------------------------- */

      const payout =
        await SupplierPayout.create({
          supplierId:
            SUPPLIER_OBJECT_ID,

          supplierName,

          amount:
            mockPayout.amount,

          transferFee:
            mockPayout.transferFee,

          netAmount:
            mockPayout.netAmount,

          status:
            mockPayout.status,

          reference:
            mockPayout.reference,

          bankName:
            mockPayout.bankName,

          accountNumber:
            mockPayout.accountNumber,

          accountName:
            mockPayout.accountName,

          orderIds:
            payoutOrders.map(
              (order) =>
                order._id
            ),

          processedAt:
            mockPayout.status ===
            "SETTLED"
              ? new Date(
                  mockPayout.createdAt
                )
              : undefined,

          createdAt:
            new Date(
              mockPayout.createdAt
            ),
        });

      createdPayouts.push(
        payout
      );
    }

    /* ====================================================================== */
    /* 12. FINAL COUNTS                                                       */
    /* ====================================================================== */

    const totalOrders =
      await Order.countDocuments({
        supplierId:  SUPPLIER_OBJECT_ID,
      });

    const totalPayouts =
      await SupplierPayout.countDocuments({
        supplierId:  SUPPLIER_OBJECT_ID,
      });

    /* ====================================================================== */
    /* 13. RETURN                                                             */
    /* ====================================================================== */

    return {
      success: true,

      message:
        "May & Baker mock Orders and Supplier Payouts seeded successfully.",

      supplier: {
        id:
          supplier._id.toString(),

        name:
          supplierName,

        type:
          supplierType,

        role:
          "supplier",
      },

      buyers: buyerUsers
        .slice(
          0,
          MOCK_ORDERS.length
        )
        .map(
          (
            buyer,
            index
          ) => ({
            mockBuyerId:
              MOCK_ORDERS[index]
                .buyerId,

            buyerId:
              buyer._id.toString(),

            buyerName:
              buyer.organizationName ||
              buyer.username ||
              MOCK_ORDERS[index]
                .buyerName,
          })
        ),

      orders: {
        requested:
          MOCK_ORDERS.length,

        created:
          createdOrders.length,

        skipped:
          skippedOrders.length,

        skippedOrderNumbers:
          skippedOrders,

        totalSupplierOrders:
          totalOrders,

        records:
          createdOrders.map(
            (order) => ({
              id:
                order._id.toString(),

              orderNumber:
                order.orderNumber,

              buyerId:
                order.buyerId.toString(),

              buyerName:
                order.buyerName,

              supplierId:
                order.supplierId.toString(),

              supplierName:
                order.supplierName,

              total:
                order.total,

              commission:
                order.commission,

              paymentMethod:
                order.paymentMethod,

              walletAmount:
                order.walletAmount,

              creditAmount:
                order.creditAmount,

              status:
                order.status,
            })
          ),
      },

      payouts: {
        requested:
          MOCK_PAYOUTS.length,

        created:
          createdPayouts.length,

        skipped:
          skippedPayouts.length,

        skippedReferences:
          skippedPayouts,

        totalSupplierPayouts:
          totalPayouts,

        records:
          createdPayouts.map(
            (payout) => ({
              id:
                payout._id.toString(),

              reference:
                payout.reference,

              supplierId:
                payout.supplierId.toString(),

              supplierName:
                payout.supplierName,

              amount:
                payout.amount,

              transferFee:
                payout.transferFee,

              netAmount:
                payout.netAmount,

              status:
                payout.status,

              orderIds:
                payout.orderIds.map(
                  (
                    id: Types.ObjectId
                  ) =>
                    id.toString()
                ),
            })
          ),
      },
    };
  } catch (error) {
    console.error(
      "[seedMockOrdersAndSupplierPayouts]",
      error
    );

    return {
      success: false,

      message:
        error instanceof Error
          ? error.message
          : "Failed to seed mock Orders and Supplier Payouts.",

      supplierId:
        SUPPLIER_ID,

      ordersCreated: 0,

      payoutsCreated: 0,
    };
  }
}