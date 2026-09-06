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
   BUYER
========================================================= */

const BUYER_ID = new Types.ObjectId(
  "6a9cb82d853e785e43c110b8"
);

const BUYER_NAME =
  "Lagos University Teaching Hospital (LUTH)";

/* =========================================================
   PRODUCT
========================================================= */

const PARACETAMOL_PRODUCT_ID = new Types.ObjectId(
  "6a9cb838853e785e43c110c7"
);

/* =========================================================
   SUPPLIER PRODUCTS
========================================================= */

const MAY_BAKER_PARACETAMOL_ID =
  new Types.ObjectId(
    "6a9cb840853e785e43c110d1"
  );

const NEIMETH_PARACETAMOL_ID =
  new Types.ObjectId(
    "6a9cb842853e785e43c110d3"
  );

const JUHEL_PARACETAMOL_ID =
  new Types.ObjectId(
    "6a9cb845853e785e43c110d6"
  );

/* =========================================================
   SUPPLIERS
========================================================= */

const MAY_BAKER_ID = new Types.ObjectId(
  "6a9cb82e853e785e43c110b9"
);

const NEIMETH_ID = new Types.ObjectId(
  "6a9cb82f853e785e43c110bb"
);

const JUHEL_ID = new Types.ObjectId(
  "6a9cb831853e785e43c110be"
);

/* =========================================================
   ADMIN
========================================================= */

/**
 * Resolve this dynamically rather than hardcoding an ObjectId.
 */
async function getAdminId() {
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

  return admin._id;
}

/* =========================================================
   MAIN SEED
========================================================= */

export async function seedBuyerProcurementCreditOrders() {
  await connectToDB();

  /* =======================================================
     1. VERIFY BUYER
  ======================================================= */

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

  /* =======================================================
     2. VERIFY MASTER PRODUCT
  ======================================================= */

  const product = await Product.findById(
    PARACETAMOL_PRODUCT_ID
  )
    .select("_id name unit")
    .lean();

  if (!product) {
    throw new Error(
      `Product ${PARACETAMOL_PRODUCT_ID.toString()} was not found.`
    );
  }

  /* =======================================================
     3. VERIFY SUPPLIER PRODUCTS
  ======================================================= */

  const supplierProducts =
    await SupplierProduct.find({
      _id: {
        $in: [
          MAY_BAKER_PARACETAMOL_ID,
          NEIMETH_PARACETAMOL_ID,
          JUHEL_PARACETAMOL_ID,
        ],
      },
    }).lean();

  if (supplierProducts.length !== 3) {
    throw new Error(
      "Required Paracetamol SupplierProducts were not found."
    );
  }

  /* =======================================================
     4. VERIFY SUPPLIERS
  ======================================================= */

  const suppliers = await User.find({
    _id: {
      $in: [
        MAY_BAKER_ID,
        NEIMETH_ID,
        JUHEL_ID,
      ],
    },
  })
    .select(
      "_id username organizationName role supplierType"
    )
    .lean();

  if (suppliers.length !== 3) {
    throw new Error(
      "One or more required suppliers were not found."
    );
  }

  /* =======================================================
     5. GET ADMIN
  ======================================================= */

  const adminId = await getAdminId();

  /* =======================================================
     6. SEED CREDIT ACCOUNT
  ======================================================= */

  const creditLimit = 15_000_000;

  /**
   * Existing credit exposure:
   *
   * Order 2 = ₦1,851,300
   * Order 3 = ₦927,800
   *
   * Total = ₦2,779,100
   *
   * We leave an additional small exposure/reserve
   * represented by the account at ₦2,850,000.
   */

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

          approvedBy: adminId,

          approvedAt: new Date(
            "2025-01-10T09:00:00.000Z"
          ),

          dueDate: new Date(
            "2025-02-28T23:59:59.000Z"
          ),

          terms:
            "30-day institutional procurement credit facility",

          interestRatePercent: 0,

          createdAt: new Date(
            "2025-01-10T08:45:00.000Z"
          ),

          updatedAt: new Date(
            "2025-01-15T10:00:00.000Z"
          ),
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
      "Failed to create credit account."
    );
  }

  /* =======================================================
     7. SEED ACTIVE PROCUREMENT
     Supplier Fallback Queue
  ======================================================= */

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
            productId: PARACETAMOL_PRODUCT_ID,

            productName:
              "Paracetamol 500mg Tablets",

            quantity: 1000,

            unit:
              "Packs of 100 Tablets (10x10 Blister)",

            preferredSupplierType: "importer",

            requiredByDate: new Date(
              "2025-01-18T23:59:59.000Z"
            ),
          },
        ],

        status: "SUPPLIER_CONTACTED",

        supplierCandidates: [
          {
            supplierId: MAY_BAKER_ID,

            supplierName:
              "May & Baker Nigeria Plc",

            supplierType: "importer",

            supplierProductId:
              MAY_BAKER_PARACETAMOL_ID,

            unitPrice: 1045,

            totalPrice: 1_045_000,

            stock: 12_000,

            rank: 1,

            score: 96.5,

            status: "CONTACTED",
          },

          {
            supplierId: new Types.ObjectId(
              "6a9cb82d853e785e43c110ba"
            ),

            supplierName:
              "Fidson Healthcare Plc",

            supplierType: "importer",

            supplierProductId:
              new Types.ObjectId(
                "6a9cb841853e785e43c110d2"
              ),

            unitPrice: 1078,

            totalPrice: 1_078_000,

            stock: 8_500,

            rank: 2,

            score: 93.2,

            status: "QUEUED",
          },

          {
            supplierId: NEIMETH_ID,

            supplierName:
              "Neimeth Pharmaceuticals",

            supplierType: "importer",

            supplierProductId:
              NEIMETH_PARACETAMOL_ID,

            unitPrice: 1122,

            totalPrice: 1_122_000,

            stock: 6_000,

            rank: 3,

            score: 89,

            status: "QUEUED",
          },

          {
            supplierId: new Types.ObjectId(
              "6a9cb830853e785e43c110bd"
            ),

            supplierName:
              "Emzor Pharmaceuticals",

            supplierType: "distributor",

            supplierProductId:
              new Types.ObjectId(
                "6a9cb844853e785e43c110d5"
              ),

            unitPrice: 1210,

            totalPrice: 1_210_000,

            stock: 15_000,

            rank: 4,

            score: 87.5,

            status: "QUEUED",
          },
        ],

        currentSupplierIndex: 0,

        currentSupplierId: MAY_BAKER_ID,

        currentSupplierName:
          "May & Baker Nigeria Plc",

        attemptHistory: [
          {
            attemptNumber: 1,

            supplierId: MAY_BAKER_ID,

            supplierName:
              "May & Baker Nigeria Plc",

            supplierType: "importer",

            /**
             * This is the SupplierProduct base price.
             */
            offeredPrice: 950,

            status: "CONTACTED",

            contactedAt: new Date(
              "2025-01-15T08:30:00.000Z"
            ),
          },
        ],

        deliveryAddress:
          "LUTH Inpatient Dispensing Pharmacy, Surulere, Lagos",

        notes:
          "Active procurement with dynamic supplier fallback. May & Baker is currently being contacted. If unavailable or timed out, the matching engine should proceed to the next ranked supplier.",

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

        createdAt: new Date(
          "2025-01-15T08:25:00.000Z"
        ),

        updatedAt: new Date(
          "2025-01-15T08:30:00.000Z"
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
      "Failed to create procurement."
    );
  }

  /* =======================================================
     8. SEED ORDER 1
     Wallet Purchase
  ======================================================= */

  const order1 = await Order.findOneAndUpdate(
    {
      orderNumber: "ORD-LUTH-250001",
    },
    {
      $set: {
        orderNumber: "ORD-LUTH-250001",

        procurementId: procurement._id,

        buyerId: BUYER_ID,

        buyerName: BUYER_NAME,

        supplierId: MAY_BAKER_ID,

        supplierName:
          "May & Baker Nigeria Plc",

        supplierType: "importer",

        items: [
          {
            productId:
              PARACETAMOL_PRODUCT_ID,

            supplierProductId:
              MAY_BAKER_PARACETAMOL_ID,

            name:
              "Paracetamol 500mg Tablets",

            unit:
              "Packs of 100 Tablets (10x10 Blister)",

            quantity: 500,

            unitPrice: 1045,

            subtotal: 522_500,

            batchNumber:
              "MB-PCM-2401",

            expiryDate: new Date(
              "2027-08-30T23:59:59.000Z"
            ),
          },
        ],

        subtotal: 522_500,

        commission: 52_250,

        total: 574_750,

        paymentMethod: "WALLET",

        walletAmount: 574_750,

        creditAmount: 0,

        status: "COMPLETED",

        deliveryAddress:
          "LUTH Inpatient Dispensing Pharmacy, Surulere, Lagos",

        batchNumber:
          "MB-PCM-2401",

        expiryDate: new Date(
          "2027-08-30T23:59:59.000Z"
        ),

        trackingUpdates: [
          {
            status: "PENDING",

            title: "Order Placed",

            description:
              "LUTH procurement order submitted successfully.",

            timestamp: new Date(
              "2025-01-12T09:00:00.000Z"
            ),
          },

          {
            status: "PAYMENT_CONFIRMED",

            title: "Payment Confirmed",

            description:
              "Payment was deducted from the buyer wallet.",

            timestamp: new Date(
              "2025-01-12T09:05:00.000Z"
            ),
          },

          {
            status: "SUPPLIER_CONTACTED",

            title: "Supplier Contacted",

            description:
              "May & Baker confirmed availability.",

            timestamp: new Date(
              "2025-01-12T10:00:00.000Z"
            ),
          },

          {
            status: "VERIFICATION",

            title: "Verification Completed",

            description:
              "Batch and expiry information verified.",

            timestamp: new Date(
              "2025-01-13T11:30:00.000Z"
            ),
          },

          {
            status: "DELIVERED",

            title: "Order Delivered",

            description:
              "Order received by LUTH.",

            timestamp: new Date(
              "2025-01-14T15:00:00.000Z"
            ),
          },

          {
            status: "COMPLETED",

            title: "Order Completed",

            description:
              "Procurement workflow completed.",

            timestamp: new Date(
              "2025-01-14T16:00:00.000Z"
            ),
          },
        ],

        createdAt: new Date(
          "2025-01-12T09:00:00.000Z"
        ),

        updatedAt: new Date(
          "2025-01-14T16:00:00.000Z"
        ),
      },
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    }
  );

  /* =======================================================
     9. SEED ORDER 2
     Credit Purchase
  ======================================================= */

  const order2 = await Order.findOneAndUpdate(
    {
      orderNumber: "ORD-LUTH-250002",
    },
    {
      $set: {
        orderNumber: "ORD-LUTH-250002",

        procurementId:
          new Types.ObjectId(
            "6a9cb850853e785e43c11102"
          ),

        buyerId: BUYER_ID,

        buyerName: BUYER_NAME,

        supplierId: NEIMETH_ID,

        supplierName:
          "Neimeth Pharmaceuticals",

        supplierType: "importer",

        items: [
          {
            productId:
              PARACETAMOL_PRODUCT_ID,

            supplierProductId:
              NEIMETH_PARACETAMOL_ID,

            name:
              "Paracetamol 500mg Tablets",

            unit:
              "Packs of 100 Tablets (10x10 Blister)",

            quantity: 1500,

            unitPrice: 1122,

            subtotal: 1_683_000,

            batchNumber:
              "NM-PCM-2404",

            expiryDate: new Date(
              "2027-01-20T23:59:59.000Z"
            ),
          },
        ],

        subtotal: 1_683_000,

        commission: 168_300,

        total: 1_851_300,

        paymentMethod: "CREDIT",

        walletAmount: 0,

        creditAmount: 1_851_300,

        status: "DELIVERED",

        deliveryAddress:
          "LUTH Inpatient Dispensing Pharmacy, Surulere, Lagos",

        batchNumber:
          "NM-PCM-2404",

        expiryDate: new Date(
          "2027-01-20T23:59:59.000Z"
        ),

        trackingUpdates: [
          {
            status: "PENDING",

            title: "Credit Order Placed",

            description:
              "LUTH submitted an order using its approved credit facility.",

            timestamp: new Date(
              "2025-01-15T09:00:00.000Z"
            ),
          },

          {
            status: "PAYMENT_CONFIRMED",

            title: "Credit Approved",

            description:
              "Order approved against the buyer credit facility.",

            timestamp: new Date(
              "2025-01-15T09:10:00.000Z"
            ),
          },

          {
            status: "SUPPLIER_CONTACTED",

            title: "Supplier Confirmed",

            description:
              "Neimeth confirmed stock availability.",

            timestamp: new Date(
              "2025-01-15T10:00:00.000Z"
            ),
          },

          {
            status: "VERIFICATION",

            title: "Verification Completed",

            description:
              "Batch and expiry information verified.",

            timestamp: new Date(
              "2025-01-16T12:00:00.000Z"
            ),
          },

          {
            status: "IN_TRANSIT",

            title: "Order In Transit",

            description:
              "Shipment dispatched to LUTH.",

            timestamp: new Date(
              "2025-01-17T08:00:00.000Z"
            ),
          },

          {
            status: "DELIVERED",

            title: "Order Delivered",

            description:
              "Shipment received by LUTH.",

            timestamp: new Date(
              "2025-01-18T14:00:00.000Z"
            ),
          },
        ],

        createdAt: new Date(
          "2025-01-15T09:00:00.000Z"
        ),

        updatedAt: new Date(
          "2025-01-18T14:00:00.000Z"
        ),
      },
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    }
  );

  /* =======================================================
     10. SEED ORDER 3
     Wallet + Credit
  ======================================================= */

  const order3 = await Order.findOneAndUpdate(
    {
      orderNumber: "ORD-LUTH-250003",
    },
    {
      $set: {
        orderNumber: "ORD-LUTH-250003",

        procurementId:
          new Types.ObjectId(
            "6a9cb850853e785e43c11103"
          ),

        buyerId: BUYER_ID,

        buyerName: BUYER_NAME,

        supplierId: JUHEL_ID,

        supplierName:
          "Juhel Nigeria Limited",

        supplierType: "distributor",

        items: [
          {
            productId:
              PARACETAMOL_PRODUCT_ID,

            supplierProductId:
              JUHEL_PARACETAMOL_ID,

            name:
              "Paracetamol 500mg Tablets",

            unit:
              "Packs of 100 Tablets (10x10 Blister)",

            quantity: 1000,

            unitPrice: 1298,

            subtotal: 1_298_000,

            batchNumber:
              "JH-PCM-2407",

            expiryDate: new Date(
              "2026-12-05T23:59:59.000Z"
            ),
          },
        ],

        subtotal: 1_298_000,

        commission: 129_800,

        total: 1_427_800,

        paymentMethod:
          "WALLET_AND_CREDIT",

        walletAmount: 500_000,

        creditAmount: 927_800,

        status: "IN_TRANSIT",

        deliveryAddress:
          "LUTH Inpatient Dispensing Pharmacy, Surulere, Lagos",

        batchNumber:
          "JH-PCM-2407",

        expiryDate: new Date(
          "2026-12-05T23:59:59.000Z"
        ),

        trackingUpdates: [
          {
            status: "PENDING",

            title: "Order Placed",

            description:
              "LUTH submitted a mixed wallet and credit procurement request.",

            timestamp: new Date(
              "2025-01-20T08:30:00.000Z"
            ),
          },

          {
            status: "PAYMENT_CONFIRMED",

            title: "Payment Confirmed",

            description:
              "₦500,000 allocated from wallet and ₦927,800 approved against credit.",

            timestamp: new Date(
              "2025-01-20T09:00:00.000Z"
            ),
          },

          {
            status: "SUPPLIER_CONTACTED",

            title: "Supplier Contacted",

            description:
              "Juhel confirmed and prepared the shipment.",

            timestamp: new Date(
              "2025-01-20T10:30:00.000Z"
            ),
          },

          {
            status: "VERIFICATION",

            title: "Verification Completed",

            description:
              "Product batch and expiry information passed verification.",

            timestamp: new Date(
              "2025-01-21T11:00:00.000Z"
            ),
          },

          {
            status: "READY_FOR_DISPATCH",

            title: "Ready for Dispatch",

            description:
              "Order passed verification and is ready for dispatch.",

            timestamp: new Date(
              "2025-01-21T14:00:00.000Z"
            ),
          },

          {
            status: "DISPATCHED",

            title: "Order Dispatched",

            description:
              "Juhel dispatched the shipment.",

            timestamp: new Date(
              "2025-01-22T08:00:00.000Z"
            ),
          },

          {
            status: "IN_TRANSIT",

            title: "In Transit",

            description:
              "Shipment is currently in transit to LUTH.",

            timestamp: new Date(
              "2025-01-22T12:00:00.000Z"
            ),
          },
        ],

        createdAt: new Date(
          "2025-01-20T08:30:00.000Z"
        ),

        updatedAt: new Date(
          "2025-01-22T12:00:00.000Z"
        ),
      },
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    }
  );

  /* =======================================================
     RETURN SEED SUMMARY
  ======================================================= */

  return {
    success: true,

    buyer: {
      id: buyer._id.toString(),
      username: buyer.username,
      name: BUYER_NAME,
      role: buyer.role,
    },

    creditAccount: {
      id: creditAccount._id.toString(),
      buyerId:
        creditAccount.buyerId.toString(),
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

      buyerId:
        procurement.buyerId.toString(),

      status:
        procurement.status,

      currentSupplierId:
        procurement.currentSupplierId?.toString(),

      currentSupplierName:
        procurement.currentSupplierName,

      supplierCandidates:
        procurement.supplierCandidates.map(
          (candidate) => ({
            supplierId:
              candidate.supplierId.toString(),

            supplierProductId:
              candidate.supplierProductId.toString(),

            supplierName:
              candidate.supplierName,

            rank: candidate.rank,

            score: candidate.score,

            status: candidate.status,
          })
        ),
    },

    orders: [
      order1,
      order2,
      order3,
    ].map((order) => ({
      id: order!._id.toString(),

      orderNumber:
        order!.orderNumber,

      procurementId:
        order!.procurementId.toString(),

      buyerId:
        order!.buyerId.toString(),

      supplierId:
        order!.supplierId.toString(),

      supplierName:
        order!.supplierName,

      total:
        order!.total,

      paymentMethod:
        order!.paymentMethod,

      walletAmount:
        order!.walletAmount,

      creditAmount:
        order!.creditAmount,

      status:
        order!.status,
    })),
  };
}