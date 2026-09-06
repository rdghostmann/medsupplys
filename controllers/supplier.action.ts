// supplier.action.ts
"use server";

import { getServerSession } from "next-auth";
import { connectToDB } from "@/lib/connectToDB";
import { User } from "@/models/User";
import { authOptions } from "@/auth";

export interface CurrentSupplierUser {
  id: string;
  name: string;
  organization: string;
  supplierType: "IMPORTER" | "DISTRIBUTOR" | "RETAILER";
  supplierApprovalStatus: "APPROVED" | "PENDING";

  pcnPremisesLicense: string;
  nafdacGdpLicense: string;

  settlementBankName: string;
  settlementAccountNumber: string;
  settlementAccountName: string;

  email?: string;
  username?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SupplierDashboardData {
  user: CurrentSupplierUser | null;
}

/**
 * Get the currently authenticated supplier.
 *
 * The supplier is resolved from the NextAuth session and
 * never from client-provided supplier IDs.
 */
export async function getCurrentSupplierDashboard(): Promise<SupplierDashboardData> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return {
        user: null,
      };
    }

    await connectToDB();

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
      };
    }

    const supplierTypeMap: Record<
      string,
      CurrentSupplierUser["supplierType"]
    > = {
      importer: "IMPORTER",
      distributor: "DISTRIBUTOR",
      retailer: "RETAILER",
    };

    const supplierApprovalStatus = user.supplierApprovalStatus === "approved"
        ? "APPROVED"  : "PENDING";

    const currentSupplier: CurrentSupplierUser = {
      id: user._id.toString(),

      name:  user.username ||  "Authorized Pharmaceutical Supplier",

      organization: user.organizationName ||  "Pharmaceutical Supplier",

      supplierType:   supplierTypeMap[String(user.supplierType).toLowerCase()] ||
        "RETAILER",

      supplierApprovalStatus,

      pcnPremisesLicense:
        user.pcnPremisesLicense || "Not provided",

      nafdacGdpLicense:
        user.nafdacGdpLicense || "Not provided",

      settlementBankName:
        user.settlementBankName || "Not configured",

      settlementAccountNumber:
        user.settlementAccountNumber || "Not configured",

      settlementAccountName:
        user.settlementAccountName || "Not configured",

      email: user.email,
      username: user.username,

      createdAt: user.createdAt?.toISOString() || "",
      updatedAt: user.updatedAt?.toISOString() || "",
    };

    return {
      user: currentSupplier,
    };
  } catch (error) {
    console.error(
      "[getCurrentSupplierDashboard] Failed:",
      error
    );

    return {
      user: null,
    };
  }
}