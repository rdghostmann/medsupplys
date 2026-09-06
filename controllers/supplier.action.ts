// controllers/supplier.action.ts

"use server";

import { getServerSession } from "next-auth";
import { connectToDB } from "@/lib/connectToDB";
import { User } from "@/models/User";
import { Procurement } from "@/models/Procurement";
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
/* Supplier Dashboard                                                         */
/* -------------------------------------------------------------------------- */

export interface SupplierDashboardData {
  user: CurrentSupplierUser | null;

  incomingProcurementRequests: IncomingProcurementRequest[];
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
 * Returns the authenticated supplier and their incoming
 * procurement requests.
 *
 * Supplier identity is ALWAYS resolved from the NextAuth
 * session. The client never provides supplierId.
 *
 * Incoming requests are identified by:
 *
 *     Procurement.currentSupplierId === authenticatedSupplier._id
 *
 * This ensures a supplier only receives procurement requests
 * currently assigned to them by the sourcing engine.
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
      };
    }

    /* ---------------------------------------------------------------------- */
    /* Database                                                               */
    /* ---------------------------------------------------------------------- */

    await connectToDB();

    /* ---------------------------------------------------------------------- */
    /* Resolve authenticated supplier                                          */
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
      };
    }

    const supplierType =
      normalizeSupplierType(
        user.supplierType
      );

    const supplierApprovalStatus =
      String(
        user.supplierApprovalStatus || ""
      ).toLowerCase() === "approved"
        ? "APPROVED"
        : "PENDING";

    const currentSupplier: CurrentSupplierUser = {
      id: user._id.toString(),

      name: user.username ||
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

      email: user.email || undefined,

      username: user.username || undefined,

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
    /* Normalize Procurement DTOs                                             */
    /* ---------------------------------------------------------------------- */

    const incomingProcurementRequests: IncomingProcurementRequest[] =
      procurements.map((procurement) => {
        const firstItem = procurement.items?.[0];

        return {
          id: procurement._id.toString(),

          procurementNumber:
            procurement.procurementNumber,

          buyerId:
            procurement.buyerId.toString(),

          buyerName:
            procurement.buyerName,

          productId:
            firstItem?.productId?.toString() || "",

          productName:
            firstItem?.productName || "",

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
            procurement.currentSupplierId?.toString() || "",

          currentSupplierName:
            procurement.currentSupplierName || "",

          supplierQueue:
            (procurement.supplierCandidates || []).map(
              (candidate) => ({
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
              })
            ),

          attemptHistory:
            (procurement.attemptHistory || []).map(
              (attempt) => ({
                attemptNumber:
                  Number(attempt.attemptNumber || 0),

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
              })
            ),

          notes:
            procurement.notes || undefined,

          expiresAt:
            procurement.expiresAt?.toISOString(),

          createdAt:
            procurement.createdAt?.toISOString() || "",

          updatedAt:
            procurement.updatedAt?.toISOString() || "",
        };
      });

    /* ---------------------------------------------------------------------- */
    /* Return                                                                */
    /* ---------------------------------------------------------------------- */

    return {
      user: currentSupplier,

      incomingProcurementRequests,
    };
  } catch (error) {
    console.error(
      "[getCurrentSupplierDashboard] Failed:",
      error
    );

    return {
      user: null,
      incomingProcurementRequests: [],
    };
  }
}