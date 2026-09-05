// /models/Notification.ts

import {
  Schema,
  model,
  models,
  Document,
  Model,
} from "mongoose";

export type NotificationType =
  | "ORDER"
  | "SUPPLIER"
  | "VERIFICATION"
  | "PAYMENT"
  | "WALLET"
  | "CREDIT"
  | "KYC"
  | "SYSTEM";

export interface INotification
  extends Document {
  recipientId: Schema.Types.ObjectId;

  recipientRole: string;

  title: string;

  message: string;

  type: NotificationType;

  isRead: boolean;

  readAt?: Date;

  entityType?: string;

  entityId?: Schema.Types.ObjectId;

  createdAt: Date;

  expiresAt?: Date;
}

const NotificationSchema =
  new Schema<INotification>(
    {
      recipientId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
      },

      recipientRole: {
        type: String,
        required: true,
      },

      title: {
        type: String,
        required: true,
      },

      message: {
        type: String,
        required: true,
      },

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
      },

      isRead: {
        type: Boolean,
        default: false,
        index: true,
      },

      readAt: Date,

      entityType: String,

      entityId: {
        type: Schema.Types.ObjectId,
      },

      expiresAt: Date,
    },
    {
      timestamps: {
        createdAt: true,
        updatedAt: false,
      },
      versionKey: false,
    }
  );

NotificationSchema.index({
  recipientId: 1,
  isRead: 1,
  createdAt: -1,
});

export const Notification:
  Model<INotification> =
  models.Notification ||
  model<INotification>(
    "Notification",
    NotificationSchema
  );