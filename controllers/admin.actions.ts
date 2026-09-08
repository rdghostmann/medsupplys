"use server";

import { getServerSession } from "next-auth";
import { Types } from "mongoose";

import { authOptions } from "@/auth";
import { connectToDB } from "@/lib/connectToDB";
import { User } from "@/models/User";

export type AdminSupplierStatus =
  | "PENDING"
  | "APPROVED"
  | "SUSPENDED"
  | "REJECTED";

export type AdminSupplierType =
  | "IMPORTER"
  | "DISTRIBUTOR"
  | "RETAILER";

export type AdminSupplier = {
  id: string;
  name: string;
  organization: string;
  email: string;
  phone: string;
  role: "SUPPLIER";
  state: string;
  lga: string;
  address: string;
  supplierType: AdminSupplierType;
  supplierApprovalStatus: AdminSupplierStatus;
  licenseNumber: string;
  pcnPremisesLicense: string;
  nafdacGdpLicense: string;
  taxIdentificationNumber: string;
  isColdChainCertified: boolean;
  coldChainCapacityM3: number;
  backupPowerSpec: string;
  settlementBankName: string;
  settlementAccountNumber: string;
  settlementAccountName: string;
  assignedCreditLimit: number;
  creditRatingTier: "A" | "B" | "C" | "UNRATED";
  kycReviewNotes: string;
  kycRejectionReason?: string;
  kycSuspensionReason?: string;
  createdAt: string;
};

async function requireAdmin() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "admin") {
    throw new Error("Only administrators can manage suppliers.");
  }

  return session;
}

function normalizeSupplierType(value?: string): AdminSupplierType {
  switch (String(value || "").toLowerCase()) {
    case "importer":
      return "IMPORTER";
    case "retailer":
      return "RETAILER";
    default:
      return "DISTRIBUTOR";
  }
}

function normalizeSupplierStatus(value?: string): AdminSupplierStatus {
  switch (String(value || "").toLowerCase()) {
    case "approved":
      return "APPROVED";
    case "suspended":
      return "SUSPENDED";
    case "rejected":
      return "REJECTED";
    default:
      return "PENDING";
  }
}

function mapSupplier(user: {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  username?: string;
  email: string;
  phone?: string;
  state?: string;
  lga?: string;
  address?: string;
  organizationName?: string;
  supplierType?: string;
  supplierApprovalStatus?: string;
  licenseNumber?: string;
  pcnPremisesLicense?: string;
  nafdacGdpLicense?: string;
  taxIdentificationNumber?: string;
  isColdChainCertified?: boolean;
  coldChainCapacityM3?: number;
  backupPowerSpec?: string;
  settlementBankName?: string;
  settlementAccountNumber?: string;
  settlementAccountName?: string;
  assignedCreditLimit?: number;
  creditRatingTier?: "A" | "B" | "C" | "UNRATED";
  kycReviewNotes?: string;
  kycRejectionReason?: string;
  kycSuspensionReason?: string;
  createdAt: Date;
}): AdminSupplier {
  return {
    id: user._id.toString(),
    name:
      user.username ||
      `${user.firstName} ${user.lastName}`.trim(),
    organization: user.organizationName || "Pharmaceutical Supplier",
    email: user.email,
    phone: user.phone || "",
    role: "SUPPLIER",
    state: user.state || "",
    lga: user.lga || "",
    address: user.address || "",
    supplierType: normalizeSupplierType(user.supplierType),
    supplierApprovalStatus: normalizeSupplierStatus(
      user.supplierApprovalStatus
    ),
    licenseNumber: user.licenseNumber || "",
    pcnPremisesLicense: user.pcnPremisesLicense || "",
    nafdacGdpLicense: user.nafdacGdpLicense || "",
    taxIdentificationNumber: user.taxIdentificationNumber || "",
    isColdChainCertified: Boolean(user.isColdChainCertified),
    coldChainCapacityM3: Number(user.coldChainCapacityM3 || 0),
    backupPowerSpec: user.backupPowerSpec || "",
    settlementBankName: user.settlementBankName || "",
    settlementAccountNumber: user.settlementAccountNumber || "",
    settlementAccountName: user.settlementAccountName || "",
    assignedCreditLimit: Number(user.assignedCreditLimit || 0),
    creditRatingTier: user.creditRatingTier || "UNRATED",
    kycReviewNotes: user.kycReviewNotes || "",
    kycRejectionReason: user.kycRejectionReason,
    kycSuspensionReason: user.kycSuspensionReason,
    createdAt: user.createdAt.toISOString(),
  };
}

export async function getAdminSuppliers(): Promise<AdminSupplier[]> {
  await requireAdmin();
  await connectToDB();

  const users = await User.find({ role: "supplier" })
    .sort({ createdAt: -1 })
    .lean();

  return users.map(mapSupplier);
}

export async function updateSupplierStatus(
  supplierId: string,
  supplierApprovalStatus: AdminSupplierStatus,
  options?: {
    supplierType?: AdminSupplierType;
    kycReviewNotes?: string;
    actionReason?: string;
    assignedCreditLimit?: number;
    creditRatingTier?: "A" | "B" | "C" | "UNRATED";
    isColdChainCertified?: boolean;
  }
): Promise<AdminSupplier> {
  await requireAdmin();
  await connectToDB();

  if (!Types.ObjectId.isValid(supplierId)) {
    throw new Error("Invalid supplier ID.");
  }

  const update: Record<string, unknown> = {
    supplierApprovalStatus: supplierApprovalStatus.toLowerCase(),
  };

  if (options?.supplierType) {
    update.supplierType = options.supplierType.toLowerCase();
  }
  if (options?.kycReviewNotes !== undefined) {
    update.kycReviewNotes = options.kycReviewNotes;
  }
  if (options?.assignedCreditLimit !== undefined) {
    update.assignedCreditLimit = options.assignedCreditLimit;
  }
  if (options?.creditRatingTier) {
    update.creditRatingTier = options.creditRatingTier;
  }
  if (options?.isColdChainCertified !== undefined) {
    update.isColdChainCertified = options.isColdChainCertified;
  }
  if (supplierApprovalStatus === "REJECTED") {
    update.kycRejectionReason = options?.actionReason || "Administrative rejection";
  }
  if (supplierApprovalStatus === "SUSPENDED") {
    update.kycSuspensionReason = options?.actionReason || "Administrative suspension";
  }
  if (supplierApprovalStatus === "APPROVED") {
    update.kycApprovedAt = new Date();
    update.kycRejectionReason = undefined;
    update.kycSuspensionReason = undefined;
  }

  const supplier = await User.findOneAndUpdate(
    { _id: new Types.ObjectId(supplierId), role: "supplier" },
    { $set: update },
    { new: true }
  ).lean();

  if (!supplier) {
    throw new Error("Supplier not found.");
  }

  return mapSupplier(supplier);
}