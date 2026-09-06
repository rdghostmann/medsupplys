// controllers/supplier.action.ts

"use server";

import { getServerSession } from "next-auth";
import { connectToDB } from "@/lib/connectToDB";
import { User } from "@/models/User";
import { Procurement } from "@/models/Procurement";
import { Order } from "@/models/Order";
import { authOptions } from "@/auth";

/* -------------------------------------------------------------------------- */
/* Current Supplier                                                           */
/* -------------------------------------------------------------------------- */

export interface CurrentSupplierUser {
  id: string;
  name: string;
  organization: string;

  supplierType:
  | "IMPORTER"
  | "DISTRIBUTOR"
  | "RETAILER";

  supplierApprovalStatus?:
  | "APPROVED"
  | "PENDING";

  pcnPremisesLicense?: string;
  nafdacGdpLicense?: string;

  settlementBankName?: string;
  settlementAccountNumber?: string;
  settlementAccountName?: string;

  email?: string;
  username?: string;

  createdAt: string;
  updatedAt: string;
}

/* -------------------------------------------------------------------------- */
/* Incoming Procurement Request DTO                                           */
/* -------------------------------------------------------------------------- */

export interface IncomingSupplierQueueItem {
  supplierId: string;
  supplierName: string;

  supplierType:
  | "IMPORTER"
  | "DISTRIBUTOR"
  | "RETAILER";

  supplierProductId: string;

  unitPrice: number;
  totalPrice: number;
  stock: number;

  rank: number;
  score: number;

  status:
  | "QUEUED"
  | "CONTACTED"
  | "ACCEPTED"
  | "DECLINED"
  | "TIMEOUT"
  | "SKIPPED";
}

export interface IncomingProcurementRequest {
  id: string;
  procurementNumber: string;

  buyerId: string;
  buyerName: string;

  productId: string;
  productName: string;

  quantity: number;
  unit: string;

  status:
  | "SUPPLIER_CONTACTED"
  | "SUPPLIER_CONFIRMED"
  | "VERIFICATION"
  | "SOURCING"
  | "MATCHING"
  | "OPEN";

  deliveryAddress: string;

  currentSupplierIndex: number;
  currentSupplierId: string;
  currentSupplierName: string;

  supplierQueue: IncomingSupplierQueueItem[];

  attemptHistory: {
    attemptNumber: number;
    supplierId: string;
    supplierName: string;

    supplierType:
    | "IMPORTER"
    | "DISTRIBUTOR"
    | "RETAILER";

    offeredPrice?: number;

    status:
    | "QUEUED"
    | "CONTACTED"
    | "ACCEPTED"
    | "DECLINED"
    | "TIMEOUT"
    | "SKIPPED";

    contactedAt?: string;
    respondedAt?: string;
  }[];

  notes?: string;

  expiresAt?: string;

  createdAt: string;
  updatedAt: string;
}

/* -------------------------------------------------------------------------- */
/* Supplier Order DTO                                                         */
/* -------------------------------------------------------------------------- */

export interface SupplierOrderItem {
  id: string;

  productId: string;
  supplierProductId: string;

  name: string;
  unit: string;

  quantity: number;

  unitPrice: number;
  subtotal: number;

  batchNumber: string;
  expiryDate: string;
}

export interface SupplierOrderTrackingUpdate {
  status: string;
  title: string;
  description: string;
  timestamp: string;
}

export interface SupplierPharmacistVerification {
  verifiedBy: string;
  verifiedByName: string;

  result:
  | "PENDING"
  | "APPROVED"
  | "REJECTED";

  batchValid: boolean;
  expiryValid: boolean;
  sealIntact: boolean;
  storageCompliant: boolean;

  notes?: string;

  verifiedAt?: string;
}

export interface SupplierOrder {
  id: string;
  orderNumber: string;

  procurementId: string;

  buyerId: string;
  buyerName: string;

  supplierId: string;
  supplierName: string;

  supplierType:
  | "IMPORTER"
  | "DISTRIBUTOR"
  | "RETAILER";

  items: SupplierOrderItem[];

  subtotal: number;
  commission: number;
  total: number;

  paymentMethod:
  | "WALLET"
  | "CREDIT"
  | "WALLET_AND_CREDIT";

  walletAmount: number;
  creditAmount: number;

  status:
  | "PENDING"
  | "PAYMENT_PENDING"
  | "PAYMENT_CONFIRMED"
  | "SUPPLIER_CONTACTED"
  | "VERIFICATION"
  | "READY_FOR_DISPATCH"
  | "DISPATCHED"
  | "IN_TRANSIT"
  | "DELIVERED"
  | "COMPLETED"
  | "CANCELLED"
  | "REFUNDED";

  deliveryAddress: string;

  batchNumber?: string;
  expiryDate?: string;

  pharmacistVerification?: SupplierPharmacistVerification;

  trackingUpdates: SupplierOrderTrackingUpdate[];

  createdAt: string;
  updatedAt: string;
}

/* -------------------------------------------------------------------------- */
/* Supplier Dashboard                                                         */
/* -------------------------------------------------------------------------- */

export interface SupplierDashboardData {
  user: CurrentSupplierUser | null;

  incomingProcurementRequests: IncomingProcurementRequest[];

  orders: SupplierOrder[];
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function normalizeSupplierType(
  value?: string
): CurrentSupplierUser["supplierType"] {
  const normalized = String(value || "").toLowerCase();

  if (normalized === "importer") {
    return "IMPORTER";
  }

  if (normalized === "distributor") {
    return "DISTRIBUTOR";
  }

  return "RETAILER";
}

function normalizeCandidateSupplierType(
  value?: string
): IncomingSupplierQueueItem["supplierType"] {
  return normalizeSupplierType(value);
}

/* -------------------------------------------------------------------------- */
/* Get Current Supplier Dashboard                                             */
/* -------------------------------------------------------------------------- */

/**
 * Returns:
 *
 * 1. The authenticated supplier
 * 2. Procurement requests currently assigned to the supplier
 * 3. Orders belonging to the authenticated supplier
 *
 * Supplier identity is ALWAYS resolved from the NextAuth session.
 *
 * Orders are restricted using:
 *
 *     Order.supplierId === authenticatedSupplier._id
 *
 * The client never provides supplierId.
 */
export async function getCurrentSupplierDashboard(): Promise<SupplierDashboardData> {
  try {
    /* ---------------------------------------------------------------------- */
    /* Authenticate                                                           */
    /* ---------------------------------------------------------------------- */

    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return {
        user: null,
        incomingProcurementRequests: [],
        orders: [],
      };
    }

    /* ---------------------------------------------------------------------- */
    /* Database                                                               */
    /* ---------------------------------------------------------------------- */

    await connectToDB();

    /* ---------------------------------------------------------------------- */
    /* Resolve authenticated supplier                                         */
    /* ---------------------------------------------------------------------- */

    const user = await User.findOne({
      email: session.user.email,
      role: "supplier",
    })
      .select(
        [
          "_id",
          "fullName",
          "username",
          "email",
          "organizationName",
          "supplierType",
          "supplierApprovalStatus",
          "pcnPremisesLicense",
          "nafdacGdpLicense",
          "settlementBankName",
          "settlementAccountNumber",
          "settlementAccountName",
          "createdAt",
          "updatedAt",
        ].join(" ")
      )
      .lean();

    if (!user) {
      return {
        user: null,
        incomingProcurementRequests: [],
        orders: [],
      };
    }

    /* ---------------------------------------------------------------------- */
    /* Normalize Supplier                                                     */
    /* ---------------------------------------------------------------------- */

    const supplierType =
      normalizeSupplierType(user.supplierType);

    const supplierApprovalStatus =
      String(
        user.supplierApprovalStatus || ""
      ).toLowerCase() === "approved"
        ? "APPROVED"
        : "PENDING";

    const currentSupplier: CurrentSupplierUser = {
      id: user._id.toString(),

      name:
        user.username ||
        "Authorized Pharmaceutical Supplier",

      organization:
        user.organizationName ||
        "Pharmaceutical Supplier",

      supplierType,

      supplierApprovalStatus,

      pcnPremisesLicense:
        user.pcnPremisesLicense ||
        "Not provided",

      nafdacGdpLicense:
        user.nafdacGdpLicense ||
        "Not provided",

      settlementBankName:
        user.settlementBankName ||
        "Not configured",

      settlementAccountNumber:
        user.settlementAccountNumber ||
        "Not configured",

      settlementAccountName:
        user.settlementAccountName ||
        "Not configured",

      email:
        user.email || undefined,

      username:
        user.username || undefined,

      createdAt:
        user.createdAt?.toISOString() || "",

      updatedAt:
        user.updatedAt?.toISOString() || "",
    };

    /* ---------------------------------------------------------------------- */
    /* Fetch Incoming Procurement Requests                                    */
    /* ---------------------------------------------------------------------- */

    const procurements = await Procurement.find()
      .where("currentSupplierId")
      .equals(user._id.toString())
      .where("status")
      .in([
        "SUPPLIER_CONTACTED",
        "SOURCING",
        "MATCHING",
        "OPEN",
      ])
      .sort({
        createdAt: -1,
      })
      .lean();

    /* ---------------------------------------------------------------------- */
    /* Normalize Procurement Requests                                          */
    /* ---------------------------------------------------------------------- */

    const incomingProcurementRequests: IncomingProcurementRequest[] =
      procurements.map((procurement) => {
        const firstItem =
          procurement.items?.[0];

        return {
          id:
            procurement._id.toString(),

          procurementNumber:
            procurement.procurementNumber,

          buyerId:
            procurement.buyerId.toString(),

          buyerName:
            procurement.buyerName,

          productId:
            firstItem?.productId?.toString() ||
            "",

          productName:
            firstItem?.productName ||
            "",

          quantity:
            Number(firstItem?.quantity || 0),

          unit:
            firstItem?.unit || "",

          status:
            procurement.status as IncomingProcurementRequest["status"],

          deliveryAddress:
            procurement.deliveryAddress,

          currentSupplierIndex:
            Number(
              procurement.currentSupplierIndex || 0
            ),

          currentSupplierId:
            procurement.currentSupplierId?.toString() ||
            "",

          currentSupplierName:
            procurement.currentSupplierName ||
            "",

          supplierQueue:
            (
              procurement.supplierCandidates ||
              []
            ).map((candidate) => ({
              supplierId:
                candidate.supplierId.toString(),

              supplierName:
                candidate.supplierName,

              supplierType:
                normalizeCandidateSupplierType(
                  candidate.supplierType
                ),

              supplierProductId:
                candidate.supplierProductId.toString(),

              unitPrice:
                Number(candidate.unitPrice || 0),

              totalPrice:
                Number(candidate.totalPrice || 0),

              stock:
                Number(candidate.stock || 0),

              rank:
                Number(candidate.rank || 0),

              score:
                Number(candidate.score || 0),

              status:
                candidate.status,
            })),

          attemptHistory:
            (
              procurement.attemptHistory ||
              []
            ).map((attempt) => ({
              attemptNumber:
                Number(
                  attempt.attemptNumber || 0
                ),

              supplierId:
                attempt.supplierId.toString(),

              supplierName:
                attempt.supplierName,

              supplierType:
                normalizeSupplierType(
                  attempt.supplierType
                ),

              offeredPrice:
                attempt.offeredPrice != null
                  ? Number(
                    attempt.offeredPrice
                  )
                  : undefined,

              status:
                attempt.status,

              contactedAt:
                attempt.contactedAt?.toISOString(),

              respondedAt:
                attempt.respondedAt?.toISOString(),
            })),

          notes:
            procurement.notes || undefined,

          expiresAt:
            procurement.expiresAt?.toISOString(),

          createdAt:
            procurement.createdAt?.toISOString() ||
            "",

          updatedAt:
            procurement.updatedAt?.toISOString() ||
            "",
        };
      });

    /* ---------------------------------------------------------------------- */
    /* Fetch Orders Belonging to Current Supplier                             */
    /* ---------------------------------------------------------------------- */

    const orders = await Order.find()
      .where("supplierId")
      .equals(user._id.toString())
      .sort({
        createdAt: -1,
      })
      .lean();

    /* ---------------------------------------------------------------------- */
    /* Normalize Supplier Orders                                               */
    /* ---------------------------------------------------------------------- */

    const supplierOrders: SupplierOrder[] =
      orders.map((order) => ({
        id:
          order._id.toString(),

        orderNumber:
          order.orderNumber,

        procurementId:
          order.procurementId.toString(),

        buyerId:
          order.buyerId.toString(),

        buyerName:
          order.buyerName,

        supplierId:
          order.supplierId.toString(),

        supplierName:
          order.supplierName,

        supplierType:
          normalizeSupplierType(
            order.supplierType
          ),

        items:
          (order.items || []).map(
            (item, index) => ({
              id:
                `${order._id.toString()}-${index}`,

              productId:
                item.productId.toString(),

              supplierProductId:
                item.supplierProductId.toString(),

              name:
                item.name,

              unit:
                item.unit,

              quantity:
                Number(item.quantity || 0),

              unitPrice:
                Number(item.unitPrice || 0),

              subtotal:
                Number(item.subtotal || 0),

              batchNumber:
                item.batchNumber,

              expiryDate:
                item.expiryDate?.toISOString() ||
                "",
            })
          ),

        subtotal:
          Number(order.subtotal || 0),

        commission:
          Number(order.commission || 0),

        total:
          Number(order.total || 0),

        paymentMethod:
          order.paymentMethod,

        walletAmount:
          Number(order.walletAmount || 0),

        creditAmount:
          Number(order.creditAmount || 0),

        status:
          order.status,

        deliveryAddress:
          order.deliveryAddress,

        batchNumber:
          order.batchNumber || undefined,

        expiryDate:
          order.expiryDate?.toISOString(),

        pharmacistVerification:
          order.pharmacistVerification
            ? {
              verifiedBy:
                order.pharmacistVerification.verifiedBy.toString(),

              verifiedByName:
                order.pharmacistVerification.verifiedByName,

              result:
                order.pharmacistVerification.result,

              batchValid:
                Boolean(
                  order.pharmacistVerification
                    .batchValid
                ),

              expiryValid:
                Boolean(
                  order.pharmacistVerification
                    .expiryValid
                ),

              sealIntact:
                Boolean(
                  order.pharmacistVerification
                    .sealIntact
                ),

              storageCompliant:
                Boolean(
                  order.pharmacistVerification
                    .storageCompliant
                ),

              notes:
                order.pharmacistVerification
                  .notes,

              verifiedAt:
                order.pharmacistVerification
                  .verifiedAt
                  ?.toISOString(),
            }
            : undefined,

        trackingUpdates:
          (order.trackingUpdates || []).map(
            (update) => ({
              status:
                update.status,

              title:
                update.title,

              description:
                update.description,

              timestamp:
                update.timestamp?.toISOString() ||
                "",
            })
          ),

        createdAt:
          order.createdAt?.toISOString() ||
          "",

        updatedAt:
          order.updatedAt?.toISOString() ||
          "",
      }));

    /* ---------------------------------------------------------------------- */
    /* Return                                                                */
    /* ---------------------------------------------------------------------- */

    return {
      user: currentSupplier,

      incomingProcurementRequests,

      orders: supplierOrders,
    };
  } catch (error) {
    console.error(
      "[getCurrentSupplierDashboard] Failed:",
      error
    );

    return {
      user: null,
      incomingProcurementRequests: [],
      orders: [],
    };
  }
}

/* -------------------------------------------------------------------------- */
/* Supplier Order Tracking DTO                                                */
/* -------------------------------------------------------------------------- */

export interface SupplierOrderTrackingData {
  id: string;
  orderNumber: string;

  procurementId: string;

  buyerId: string;
  buyerName: string;

  supplierId: string;
  supplierName: string;

  supplierType:
    | "IMPORTER"
    | "DISTRIBUTOR"
    | "RETAILER";

  items: SupplierOrderItem[];

  subtotal: number;
  commission: number;
  total: number;

  paymentMethod:
    | "WALLET"
    | "CREDIT"
    | "WALLET_AND_CREDIT";

  walletAmount: number;
  creditAmount: number;

  status:
    | "PENDING"
    | "PAYMENT_PENDING"
    | "PAYMENT_CONFIRMED"
    | "SUPPLIER_CONTACTED"
    | "VERIFICATION"
    | "READY_FOR_DISPATCH"
    | "DISPATCHED"
    | "IN_TRANSIT"
    | "DELIVERED"
    | "COMPLETED"
    | "CANCELLED"
    | "REFUNDED";

  deliveryAddress: string;

  batchNumber?: string;
  expiryDate?: string;

  pharmacistVerification?: SupplierPharmacistVerification;

  trackingUpdates: SupplierOrderTrackingUpdate[];

  createdAt: string;
  updatedAt: string;
}


/* -------------------------------------------------------------------------- */
/* Get Orders For Authenticated Supplier                                      */
/* -------------------------------------------------------------------------- */

/**
 * Returns ONLY orders belonging to the currently authenticated supplier.
 *
 * Supplier identity is derived from:
 *
 * NextAuth session
 *      ↓
 * session.user.email
 *      ↓
 * User.findOne(...)
 *      ↓
 * supplier._id
 *      ↓
 * Order.find({ supplierId: supplier._id })
 *
 * The client does NOT provide supplierId.
 */
export async function getCurrentSupplierOrders(): Promise<
  SupplierOrderTrackingData[]
> {
  try {
    /* ---------------------------------------------------------------------- */
    /* Authenticate                                                           */
    /* ---------------------------------------------------------------------- */

    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return [];
    }

    /* ---------------------------------------------------------------------- */
    /* Database                                                               */
    /* ---------------------------------------------------------------------- */

    await connectToDB();

    /* ---------------------------------------------------------------------- */
    /* Resolve Current Supplier                                               */
    /* ---------------------------------------------------------------------- */

    const supplier = await User.findOne({
      email: session.user.email,
      role: "supplier",
    })
      .select("_id")
      .lean();

    if (!supplier) {
      return [];
    }

    /* ---------------------------------------------------------------------- */
    /* Fetch ONLY This Supplier's Orders                                      */
    /* ---------------------------------------------------------------------- */

    const orders = await Order.find()
      .where("supplierId")
      .equals(supplier._id.toString())
      .sort({
        createdAt: -1,
      })
      .lean();

    /* ---------------------------------------------------------------------- */
    /* Normalize Orders                                                       */
    /* ---------------------------------------------------------------------- */

    return orders.map(
      (order): SupplierOrderTrackingData => ({
        id: order._id.toString(),

        orderNumber: order.orderNumber,

        procurementId:
          order.procurementId.toString(),

        buyerId:
          order.buyerId.toString(),

        buyerName:
          order.buyerName,

        supplierId:
          order.supplierId.toString(),

        supplierName:
          order.supplierName,

        supplierType:
          normalizeSupplierType(
            order.supplierType
          ),

        items:
          (order.items || []).map(
            (item, index) => ({
              id:
                `${order._id.toString()}-${index}`,

              productId:
                item.productId.toString(),

              supplierProductId:
                item.supplierProductId.toString(),

              name:
                item.name,

              unit:
                item.unit,

              quantity:
                Number(item.quantity || 0),

              unitPrice:
                Number(item.unitPrice || 0),

              subtotal:
                Number(item.subtotal || 0),

              batchNumber:
                item.batchNumber,

              expiryDate:
                item.expiryDate
                  ? item.expiryDate.toISOString()
                  : "",
            })
          ),

        subtotal:
          Number(order.subtotal || 0),

        commission:
          Number(order.commission || 0),

        total:
          Number(order.total || 0),

        paymentMethod:
          order.paymentMethod,

        walletAmount:
          Number(order.walletAmount || 0),

        creditAmount:
          Number(order.creditAmount || 0),

        status:
          order.status,

        deliveryAddress:
          order.deliveryAddress,

        batchNumber:
          order.batchNumber || undefined,

        expiryDate:
          order.expiryDate
            ? order.expiryDate.toISOString()
            : undefined,

        pharmacistVerification:
          order.pharmacistVerification
            ? {
                verifiedBy:
                  order.pharmacistVerification.verifiedBy.toString(),

                verifiedByName:
                  order.pharmacistVerification.verifiedByName,

                result:
                  order.pharmacistVerification.result,

                batchValid:
                  Boolean(
                    order.pharmacistVerification
                      .batchValid
                  ),

                expiryValid:
                  Boolean(
                    order.pharmacistVerification
                      .expiryValid
                  ),

                sealIntact:
                  Boolean(
                    order.pharmacistVerification
                      .sealIntact
                  ),

                storageCompliant:
                  Boolean(
                    order.pharmacistVerification
                      .storageCompliant
                  ),

                notes:
                  order.pharmacistVerification
                    .notes,

                verifiedAt:
                  order.pharmacistVerification
                    .verifiedAt
                    ?.toISOString(),
              }
            : undefined,

        trackingUpdates:
          (order.trackingUpdates || []).map(
            (update) => ({
              status:
                update.status,

              title:
                update.title,

              description:
                update.description,

              timestamp:
                update.timestamp
                  ? update.timestamp.toISOString()
                  : "",
            })
          ),

        createdAt:
          order.createdAt
            ? order.createdAt.toISOString()
            : "",

        updatedAt:
          order.updatedAt
            ? order.updatedAt.toISOString()
            : "",
      })
    );
  } catch (error) {
    console.error(
      "[getCurrentSupplierOrders] Failed:",
      error
    );

    return [];
  }
}