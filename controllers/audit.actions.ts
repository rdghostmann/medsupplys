// /controllers/audit.action.ts

"use server"

import { getServerSession } from "next-auth"
import { Types } from "mongoose"

import { authOptions } from "@/auth"
import { connectToDB } from "@/lib/connectToDB"
import { AuditLog } from "@/models/AuditLog"

export type SupplierAuditLog = {
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

export async function getCurrentSupplierAuditLogs(): Promise<
  SupplierAuditLog[]
> {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return []
  }

  await connectToDB()

  const supplierId = session.user.id

  if (!Types.ObjectId.isValid(supplierId)) {
    return []
  }

  const logs = await AuditLog.find({
    actorId: new Types.ObjectId(supplierId),
  })
    .sort({ createdAt: -1 })
    .lean()

  const actorName =
    [session.user.firstName, session.user.lastName].filter(Boolean).join(" ") ||
    session.user.name ||
    session.user.email ||
    "Current user"

  return logs.map((log) => ({
    id: log._id.toString(),

    actorId: log.actorId?.toString() ?? supplierId,

    actorName,

    actorRole: log.actorType === "SYSTEM" ? "ADMIN" : log.actorType,

    action: log.action,

    entity: log.entityType,

    entityId: log.entityId?.toString() ?? "",

    newValue: log.metadata ? JSON.stringify(log.metadata) : "",

    details: log.description,

    ipAddress: "",

    timestamp: log.createdAt.toISOString(),
  }))
}
