// controllers/procurement.controller.ts
"use server";

import { getServerSession } from "next-auth";

import { authOptions } from "@/auth";
import { connectToDB } from "@/lib/connectToDB";

import { Procurement } from "@/models/Procurement";
import { SupplierProduct } from "@/models/SupplierProduct";
import { Product } from "@/models/Product";
import { User } from "@/models/User";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export type ProcurementStatus =
  | "PENDING"
  | "SUPPLIER_CONTACTED"
  | "NEXT_SUPPLIER_PENDING"
  | "SUPPLIER_CONFIRMED"
  | "BUYER_ACTION_REQUIRED"
  | "ORDER_CREATED"
  | "COMPLETED"
  | "CANCELLED";

export type SupplierQueueStatus =
  | "PENDING"
  | "CONTACTED"
  | "ACCEPTED"
  | "REJECTED"
  | "UNAVAILABLE";

export type SupplierType =
  | "Importer"
  | "Distributor"
  | "Retailer";

export type ProcurementPaymentMethod =
  | "WALLET"
  | "CREDIT"
  | "WALLET_CREDIT";

export interface SupplierQueueItem {
  supplierId: string;
  supplierName: string;
  supplierType: SupplierType;
  unitPrice: number;
  stock: number;
  rank: number;
  status: SupplierQueueStatus;
}

export interface AttemptHistory {
  attemptNumber: number;
  supplierId: string;
  supplierName: string;
  supplierType: SupplierType;
  contactedAt: string;
  respondedAt?: string;
  status: SupplierQueueStatus;
  reason?: string;
}

export interface AdminProcurement {
  id: string;
  procurementNumber: string;
  productName: string;
  category: string;
  quantity: number;
  unit: string;
  totalAmount: number;
  paymentMethod: ProcurementPaymentMethod;
  status: ProcurementStatus;

  currentSupplierName: string;
  currentSupplierIndex: number;

  supplierQueue: SupplierQueueItem[];

  attemptHistory: AttemptHistory[];

  associatedOrderId?: string;

  createdAt: string;
}

/* -------------------------------------------------------------------------- */
/* Auth                                                                       */
/* -------------------------------------------------------------------------- */

async function getAdminSession() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error("Unauthorized.");
  }

  if (session.user.role !== "admin") {
    throw new Error(
      "Only administrators can access the global sourcing monitor."
    );
  }

  return session;
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function normalizeSupplierType(
  value: string | undefined
): SupplierType {
  switch (value?.toLowerCase()) {
    case "importer":
      return "Importer";

    case "distributor":
      return "Distributor";

    case "retailer":
      return "Retailer";

    default:
      return "Distributor";
  }
}

function normalizePaymentMethod(
  value: string | undefined
): ProcurementPaymentMethod {
  switch (value) {
    case "WALLET":
      return "WALLET";

    case "CREDIT":
      return "CREDIT";

    case "WALLET_AND_CREDIT":
    case "WALLET_CREDIT":
      return "WALLET_CREDIT";

    default:
      return "WALLET";
  }
}

function normalizeQueueStatus(
  value: string | undefined
): SupplierQueueStatus {
  switch (value) {
    case "CONTACTED":
      return "CONTACTED";

    case "ACCEPTED":
      return "ACCEPTED";

    case "REJECTED":
      return "REJECTED";

    case "UNAVAILABLE":
      return "UNAVAILABLE";

    default:
      return "PENDING";
  }
}

/* -------------------------------------------------------------------------- */
/* GET PROCUREMENTS                                                           */
/* -------------------------------------------------------------------------- */

export async function getProcurements(): Promise<
  AdminProcurement[]
> {
  await getAdminSession();

  await connectToDB();

  const procurements = await Procurement.find({})
    .sort({ createdAt: -1 })
    .lean();

  if (!procurements.length) {
    return [];
  }

  /*
   * Collect referenced IDs so we can resolve related
   * Product / SupplierProduct / Supplier information.
   */
  const productIds = procurements
    .map((procurement) =>
      procurement.productId?.toString()
    )
    .filter(Boolean);

  const supplierProductIds = procurements
    .map((procurement) =>
      procurement.currentSupplierProductId?.toString()
    )
    .filter(Boolean);

  const supplierIds = procurements
    .map((procurement) =>
      procurement.currentSupplierId?.toString()
    )
    .filter(Boolean);

  const [products, supplierProducts, suppliers] =
    await Promise.all([
      Product.find({
        _id: { $in: productIds },
      })
        .select("_id name category")
        .lean(),

      SupplierProduct.find({
        _id: { $in: supplierProductIds },
      })
        .select(
          "_id supplierId unit price finalPrice stock"
        )
        .lean(),

      User.find({
        _id: { $in: supplierIds },
      })
        .select("_id fullName name supplierType")
        .lean(),
    ]);

  const productMap = new Map(
    products.map((product) => [
      product._id.toString(),
      product,
    ])
  );

  const supplierProductMap = new Map(
    supplierProducts.map((supplierProduct) => [
      supplierProduct._id.toString(),
      supplierProduct,
    ])
  );

  const supplierMap = new Map(
    suppliers.map((supplier) => [
      supplier._id.toString(),
      supplier,
    ])
  );

  /* ------------------------------------------------------------------------ */
  /* Serialize                                                                */
  /* ------------------------------------------------------------------------ */

  return procurements.map((procurement) => {
    const product = procurement.productId
      ? productMap.get(
          procurement.productId.toString()
        )
      : undefined;

    const currentSupplier = procurement.currentSupplierId
      ? supplierMap.get(
          procurement.currentSupplierId.toString()
        )
      : undefined;

    const currentSupplierProduct =
      procurement.currentSupplierProductId
        ? supplierProductMap.get(
            procurement.currentSupplierProductId.toString()
          )
        : undefined;

    /*
     * Supplier candidates should come from the snapshot
     * stored on the procurement.
     *
     * Rename `supplierCandidates` below if your
     * Procurement model uses another field name.
     */
    const candidates =
      procurement.supplierCandidates ?? [];

    const supplierQueue: SupplierQueueItem[] =
      candidates.map(
        (
          candidate: {
            supplierId: unknown;
            supplierName?: string;
            supplierType?: string;
            finalPrice?: number;
            unitPrice?: number;
            stock?: number;
            rank?: number;
            status?: string;
          },
          index: number
        ) => ({
          supplierId:
            candidate.supplierId?.toString() ?? "",

          supplierName:
            candidate.supplierName ?? "Unknown Supplier",

          supplierType:
            normalizeSupplierType(
              candidate.supplierType
            ),

          unitPrice:
            Number(
              candidate.finalPrice ??
                candidate.unitPrice ??
                0
            ),

          stock: Number(candidate.stock ?? 0),

          rank: candidate.rank ?? index + 1,

          status:
            normalizeQueueStatus(
              candidate.status
            ),
        })
      );

    /*
     * Supplier attempts should come from the procurement
     * sourcing/fallback history.
     *
     * Rename `supplierAttempts` if your schema uses
     * another field name.
     */
    const attemptHistory: AttemptHistory[] = (
      procurement.supplierAttempts ?? []
    ).map(
      (
        attempt: {
          attemptNumber?: number;
          supplierId: unknown;
          supplierName?: string;
          supplierType?: string;
          contactedAt?: Date | string;
          respondedAt?: Date | string;
          status?: string;
          reason?: string;
        },
        index: number
      ) => ({
        attemptNumber:
          attempt.attemptNumber ??
          index + 1,

        supplierId:
          attempt.supplierId?.toString() ?? "",

        supplierName:
          attempt.supplierName ??
          "Unknown Supplier",

        supplierType:
          normalizeSupplierType(
            attempt.supplierType
          ),

        contactedAt: new Date(
          attempt.contactedAt ??
            procurement.createdAt
        ).toISOString(),

        respondedAt: attempt.respondedAt
          ? new Date(
              attempt.respondedAt
            ).toISOString()
          : undefined,

        status:
          normalizeQueueStatus(
            attempt.status
          ),

        reason: attempt.reason,
      })
    );

    const currentSupplierIndex =
      supplierQueue.findIndex(
        (supplier) =>
          supplier.supplierId ===
          procurement.currentSupplierId?.toString()
      );

    return {
      id: procurement._id.toString(),

      procurementNumber:
        procurement.procurementNumber,

      productName:
        product?.name ??
        "Unknown Product",

      category:
        product?.category ??
        "Uncategorized",

      quantity: Number(
        procurement.quantity ?? 0
      ),

      unit:
        currentSupplierProduct?.unit ??
        procurement.unit ??
        "units",

      totalAmount: Number(
        procurement.totalAmount ?? 0
      ),

      paymentMethod:
        normalizePaymentMethod(
          procurement.paymentMethod
        ),

      status:
        procurement.status as ProcurementStatus,

      currentSupplierName:
        currentSupplier?.username ??
        "Supplier Pending",

      currentSupplierIndex:
        currentSupplierIndex >= 0
          ? currentSupplierIndex
          : 0,

      supplierQueue,

      attemptHistory,

      associatedOrderId:
        procurement.orderId?.toString(),

      createdAt:
        new Date(
          procurement.createdAt
        ).toISOString(),
    };
  });
}