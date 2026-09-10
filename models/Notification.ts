// /models/Notification.ts

import { Schema, model, models, Document, Model } from "mongoose"

/* =========================================================
   Types
   ========================================================= */

export type NotificationRecipientRole =
  | "buyer"
  | "supplier"
  | "pharmacist"
  | "admin"

export type NotificationType =
  | "ORDER"
  | "SUPPLIER"
  | "VERIFICATION"
  | "PAYMENT"
  | "WALLET"
  | "CREDIT"
  | "KYC"
  | "SYSTEM"

/* =========================================================
   Interface
   ========================================================= */

export interface INotification extends Document {
  recipientId: Schema.Types.ObjectId

  recipientRole: NotificationRecipientRole

  title: string

  message: string

  type: NotificationType

  isRead: boolean

  readAt?: Date

  entityType?: string

  entityId?: Schema.Types.ObjectId

  createdAt: Date

  expiresAt?: Date
}

/* =========================================================
   Schema
   ========================================================= */

const NotificationSchema = new Schema<INotification>(
  {
    /* -----------------------------------------------------
         Recipient
         ----------------------------------------------------- */

    recipientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    recipientRole: {
      type: String,
      enum: ["buyer", "supplier", "pharmacist", "admin"],
      required: true,
      index: true,
    },

    /* -----------------------------------------------------
         Notification Content
         ----------------------------------------------------- */

    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    /* -----------------------------------------------------
         Notification Type
         ----------------------------------------------------- */

    type: {
      type: String,
      enum: [
        "ORDER",
        "SUPPLIER",
        "VERIFICATION",
        "PAYMENT",
        "WALLET",
        "CREDIT",
        "KYC",
        "SYSTEM",
      ],
      required: true,
      index: true,
    },

    /* -----------------------------------------------------
         Read State
         ----------------------------------------------------- */

    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },

    readAt: {
      type: Date,
    },

    /* -----------------------------------------------------
         Related Entity
         ----------------------------------------------------- */

    entityType: {
      type: String,
      trim: true,
    },

    entityId: {
      type: Schema.Types.ObjectId,
      index: true,
    },

    /* -----------------------------------------------------
         Expiration
         ----------------------------------------------------- */

    expiresAt: {
      type: Date,
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },

    versionKey: false,
  }
)

/* =========================================================
   Indexes
   ========================================================= */

/**
 * Primary notification inbox query:
 *
 * "Give me this user's unread notifications,
 * newest first."
 */
NotificationSchema.index({
  recipientId: 1,
  isRead: 1,
  createdAt: -1,
})

/**
 * Useful for querying all notifications associated
 * with a particular procurement/order/etc.
 */
NotificationSchema.index({
  entityType: 1,
  entityId: 1,
  createdAt: -1,
})

/**
 * Useful when notification cleanup/expiration jobs
 * are introduced.
 *
 * MongoDB will automatically remove documents after
 * expiresAt when the date is reached.
 */
NotificationSchema.index(
  { expiresAt: 1 },
  {
    expireAfterSeconds: 0,
    sparse: true,
  }
)

/* =========================================================
   Model
   ========================================================= */

export const Notification: Model<INotification> =
  models.Notification ||
  model<INotification>("Notification", NotificationSchema)
