// /models/AuditLog.ts

import {
  Schema,
  model,
  models,
  Document,
  Model,
} from "mongoose";

export interface IAuditLog
  extends Document {
  actorId?: Schema.Types.ObjectId;

  actorName?: string;

  actorRole?: string;

  action: string;

  entity: string;

  entityId?: Schema.Types.ObjectId;

  previousValue?: unknown;

  newValue?: unknown;

  details?: string;

  ipAddress?: string;

  userAgent?: string;

  requestId?: string;

  timestamp: Date;
}

const AuditLogSchema =
  new Schema<IAuditLog>(
    {
      actorId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        index: true,
      },

      actorName: String,

      actorRole: String,

      action: {
        type: String,
        required: true,
        index: true,
      },

      entity: {
        type: String,
        required: true,
        index: true,
      },

      entityId: {
        type: Schema.Types.ObjectId,
        index: true,
      },

      previousValue: {
        type: Schema.Types.Mixed,
      },

      newValue: {
        type: Schema.Types.Mixed,
      },

      details: String,

      ipAddress: String,

      userAgent: String,

      requestId: {
        type: String,
        index: true,
      },

      timestamp: {
        type: Date,
        default: Date.now,
        index: true,
      },
    },
    {
      versionKey: false,
    }
  );

AuditLogSchema.index({
  entity: 1,
  entityId: 1,
  timestamp: -1,
});

AuditLogSchema.index({
  actorId: 1,
  timestamp: -1,
});

export const AuditLog: Model<IAuditLog> =
  models.AuditLog ||
  model<IAuditLog>(
    "AuditLog",
    AuditLogSchema
  );