// /models/AuditLog.ts

import {
  Schema,
  Types,
  model,
  models,
  Document,
  Model,
} from "mongoose";

export type AuditAction =
  | "PROCUREMENT_CREATED"
  | "PROCUREMENT_UPDATED"
  | "PROCUREMENT_CANCELLED"
  | "PAYMENT_RESERVED"
  | "PAYMENT_CHARGED"
  | "PAYMENT_RELEASED"
  | "SUPPLIER_CONTACTED"
  | "ORDER_CREATED";

export type AuditActorType =
  | "BUYER"
  | "SUPPLIER"
  | "ADMIN"
  | "SYSTEM";

export interface IAuditLog extends Document {
  actorId?: Types.ObjectId;

  actorType: AuditActorType;

  action: AuditAction;

  entityType: string;

  entityId: Types.ObjectId;

  description: string;

  metadata?: Record<string, unknown>;

  createdAt: Date;
}

const AuditLogSchema =
  new Schema<IAuditLog>(
    {
      actorId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        index: true,
      },

      actorType: {
        type: String,
        enum: [
          "BUYER",
          "SUPPLIER",
          "ADMIN",
          "SYSTEM",
        ],
        required: true,
      },

      action: {
        type: String,
        enum: [
          "PROCUREMENT_CREATED",
          "PROCUREMENT_UPDATED",
          "PROCUREMENT_CANCELLED",
          "PAYMENT_RESERVED",
          "PAYMENT_CHARGED",
          "PAYMENT_RELEASED",
          "SUPPLIER_CONTACTED",
          "ORDER_CREATED",
          "WALLET_TOP_SUCCESS",
          "PHARMACEUTICAL_BATCH_VERIFIED",
          "CREDIT_ACCOUNT_APPROVED",
        ],
        required: true,
      },

      entityType: {
        type: String,
        required: true,
      },

      entityId: {
        type: Schema.Types.ObjectId,
        required: true,
        index: true,
      },

      description: {
        type: String,
        required: true,
      },

      metadata: {
        type: Schema.Types.Mixed,
      },
    },
    {
      timestamps: {
        createdAt: true,
        updatedAt: false,
      },
      versionKey: false,
    }
  );

AuditLogSchema.index({
  entityType: 1,
  entityId: 1,
  createdAt: -1,
});

AuditLogSchema.index({
  actorId: 1,
  createdAt: -1,
});

export const AuditLog: Model<IAuditLog> =
  models.AuditLog ||
  model<IAuditLog>(
    "AuditLog",
    AuditLogSchema
  );