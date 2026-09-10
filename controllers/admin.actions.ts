"use server"

import { getServerSession } from "next-auth"
import { Types } from "mongoose"

import { authOptions } from "@/auth"
import { connectToDB } from "@/lib/connectToDB"
import { User } from "@/models/User"
import { Order, type OrderStatus } from "@/models/Order"
import { AuditLog } from "@/models/AuditLog"

export type AdminSupplierStatus =
  | "PENDING"
  | "APPROVED"
  | "SUSPENDED"
  | "REJECTED"

export type AdminSupplierType = "IMPORTER" | "DISTRIBUTOR" | "RETAILER"

export type AdminSupplier = {
  id: string
  name: string
  organization: string
  email: string
  phone: string
  role: "SUPPLIER"
  state: string
  lga: string
  address: string
  supplierType: AdminSupplierType
  supplierApprovalStatus: AdminSupplierStatus
  licenseNumber: string
  pcnPremisesLicense: string
  nafdacGdpLicense: string
  taxIdentificationNumber: string
  isColdChainCertified: boolean
  coldChainCapacityM3: number
  backupPowerSpec: string
  settlementBankName: string
  settlementAccountNumber: string
  settlementAccountName: string
  assignedCreditLimit: number
  creditRatingTier: "A" | "B" | "C" | "UNRATED"
  kycReviewNotes: string
  kycRejectionReason?: string
  kycSuspensionReason?: string
  createdAt: string
}

async function requireAdmin() {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== "admin") {
    throw new Error("Only administrators can manage suppliers.")
  }

  return session
}

function normalizeSupplierType(value?: string): AdminSupplierType {
  switch (String(value || "").toLowerCase()) {
    case "importer":
      return "IMPORTER"
    case "retailer":
      return "RETAILER"
    default:
      return "DISTRIBUTOR"
  }
}

function normalizeSupplierStatus(value?: string): AdminSupplierStatus {
  switch (String(value || "").toLowerCase()) {
    case "approved":
      return "APPROVED"
    case "suspended":
      return "SUSPENDED"
    case "rejected":
      return "REJECTED"
    default:
      return "PENDING"
  }
}

function mapSupplier(user: {
  _id: Types.ObjectId
  firstName: string
  lastName: string
  username?: string
  email: string
  phone?: string
  state?: string
  lga?: string
  address?: string
  organizationName?: string
  supplierType?: string
  supplierApprovalStatus?: string
  licenseNumber?: string
  pcnPremisesLicense?: string
  nafdacGdpLicense?: string
  taxIdentificationNumber?: string
  isColdChainCertified?: boolean
  coldChainCapacityM3?: number
  backupPowerSpec?: string
  settlementBankName?: string
  settlementAccountNumber?: string
  settlementAccountName?: string
  assignedCreditLimit?: number
  creditRatingTier?: "A" | "B" | "C" | "UNRATED"
  kycReviewNotes?: string
  kycRejectionReason?: string
  kycSuspensionReason?: string
  createdAt: Date
}): AdminSupplier {
  return {
    id: user._id.toString(),
    name: user.username || `${user.firstName} ${user.lastName}`.trim(),
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
  }
}

export async function getAdminSuppliers(): Promise<AdminSupplier[]> {
  await requireAdmin()
  await connectToDB()

  const users = await User.find({ role: "supplier" })
    .sort({ createdAt: -1 })
    .lean()

  return users.map(mapSupplier)
}

type AdminLogisticsOrderStatus =
  | "PENDING"
  | "SUPPLIER_CONTACTED"
  | "UNDER_VERIFICATION"
  | "READY_FOR_DISPATCH"
  | "DISPATCHED"
  | "IN_TRANSIT"
  | "DELIVERED"
  | "COMPLETED"
  | "REJECTED"

function normalizeOrderStatus(status: OrderStatus): AdminLogisticsOrderStatus {
  switch (status) {
    case "VERIFICATION":
      return "UNDER_VERIFICATION"
    case "PAYMENT_PENDING":
    case "PAYMENT_CONFIRMED":
      return "PENDING"
    case "CANCELLED":
    case "REFUNDED":
      return "REJECTED"
    default:
      return status
  }
}

function normalizeOrderSupplierType(
  supplierType: string
): "importer" | "distributor" | "retailer" {
  const normalizedType = supplierType.toLowerCase()

  if (normalizedType === "importer" || normalizedType === "retailer") {
    return normalizedType
  }

  return "distributor"
}

export async function getAdminOrders() {
  await requireAdmin()
  await connectToDB()

  const orders = await Order.find().sort({ createdAt: -1 }).lean()

  return orders.map((order) => {
    const firstItem = order.items[0]
    const status = normalizeOrderStatus(order.status)

    return {
      id: order._id.toString(),
      orderNumber: order.orderNumber,
      status,
      supplierId: order.supplierId.toString(),
      supplierName: order.supplierName,
      supplierType: normalizeOrderSupplierType(order.supplierType),
      items: order.items.map((item) => ({
        id: `${order._id.toString()}-${item.productId.toString()}`,
        name: item.name,
        category: "",
        quantity: item.quantity,
        unit: item.unit,
        unitPrice: item.unitPrice,
        total: item.subtotal,
      })),
      subtotal: order.subtotal,
      deliveryFee: Math.max(order.total - order.subtotal, 0),
      total: order.total,
      batchNumber: order.batchNumber || firstItem?.batchNumber || "",
      manufacturingDate: undefined,
      expiryDate:
        order.expiryDate?.toISOString() ||
        firstItem?.expiryDate.toISOString() ||
        "",
      deliveryAddress: order.deliveryAddress,
      estimatedDeliveryDate: undefined,
      coldChainRequired: false,
      temperature: undefined,
      nafdacNumber: undefined,
      pharmacistVerification: order.pharmacistVerification
        ? {
            verifiedByName: order.pharmacistVerification.verifiedByName,
            pharmacistLicense: undefined,
            verifiedAt:
              order.pharmacistVerification.verifiedAt?.toISOString() || "",
            notes: order.pharmacistVerification.notes || "",
            result: order.pharmacistVerification.result,
          }
        : undefined,
      trackingUpdates: order.trackingUpdates.map((update) => ({
        title: update.title,
        description: update.description,
        timestamp: update.timestamp.toISOString(),
        completed: ["DELIVERED", "COMPLETED"].includes(update.status),
      })),
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
    }
  })
}

export type AdminAuditLog = {
  id: string
  actorId: string
  actorName: string
  actorRole: "ADMIN" | "BUYER" | "SUPPLIER" | "PHARMACIST"
  action: string
  entity: string
  entityId: string
  newValue: string
  details: string
  ipAddress: string
  timestamp: string
}

export async function getAdminAuditLogs(): Promise<AdminAuditLog[]> {
  await requireAdmin()
  await connectToDB()

  const logs = await AuditLog.find().sort({ createdAt: -1 }).lean()

  const actorIds = logs
    .map((log) => log.actorId)
    .filter((actorId): actorId is Types.ObjectId => Boolean(actorId))
  const actors = await User.find({ _id: { $in: actorIds } })
    .select("firstName lastName username email")
    .lean()
  const actorNames = new Map(
    actors.map((actor) => [
      actor._id.toString(),
      actor.username ||
        `${actor.firstName} ${actor.lastName}`.trim() ||
        actor.email,
    ])
  )

  return logs.map((log) => {
    const actorId = log.actorId?.toString() || "system"

    return {
      id: log._id.toString(),
      actorId,
      actorName: actorNames.get(actorId) || "MediSupply System",
      actorRole: log.actorType === "SYSTEM" ? "ADMIN" : log.actorType,
      action: log.action,
      entity: log.entityType,
      entityId: log.entityId?.toString() || "",
      newValue: log.metadata ? JSON.stringify(log.metadata) : "",
      details: log.description,
      ipAddress: "",
      timestamp: log.createdAt.toISOString(),
    }
  })
}

export async function updateSupplierStatus(
  supplierId: string,
  supplierApprovalStatus: AdminSupplierStatus,
  options?: {
    supplierType?: AdminSupplierType
    kycReviewNotes?: string
    actionReason?: string
    assignedCreditLimit?: number
    creditRatingTier?: "A" | "B" | "C" | "UNRATED"
    isColdChainCertified?: boolean
  }
): Promise<AdminSupplier> {
  await requireAdmin()
  await connectToDB()

  if (!Types.ObjectId.isValid(supplierId)) {
    throw new Error("Invalid supplier ID.")
  }

  const update: Record<string, unknown> = {
    supplierApprovalStatus: supplierApprovalStatus.toLowerCase(),
  }

  if (options?.supplierType) {
    update.supplierType = options.supplierType.toLowerCase()
  }
  if (options?.kycReviewNotes !== undefined) {
    update.kycReviewNotes = options.kycReviewNotes
  }
  if (options?.assignedCreditLimit !== undefined) {
    update.assignedCreditLimit = options.assignedCreditLimit
  }
  if (options?.creditRatingTier) {
    update.creditRatingTier = options.creditRatingTier
  }
  if (options?.isColdChainCertified !== undefined) {
    update.isColdChainCertified = options.isColdChainCertified
  }
  if (supplierApprovalStatus === "REJECTED") {
    update.kycRejectionReason =
      options?.actionReason || "Administrative rejection"
  }
  if (supplierApprovalStatus === "SUSPENDED") {
    update.kycSuspensionReason =
      options?.actionReason || "Administrative suspension"
  }
  if (supplierApprovalStatus === "APPROVED") {
    update.kycApprovedAt = new Date()
    update.kycRejectionReason = undefined
    update.kycSuspensionReason = undefined
  }

  const supplier = await User.findOneAndUpdate(
    { _id: new Types.ObjectId(supplierId), role: "supplier" },
    { $set: update },
    { new: true }
  ).lean()

  if (!supplier) {
    throw new Error("Supplier not found.")
  }

  return mapSupplier(supplier)
}
