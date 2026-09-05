// /models/Order.ts

import {
  Schema,
  model,
  models,
  Document,
  Model,
} from "mongoose";

export type OrderStatus =
  | "PENDING"
  | "PAYMENT_PENDING"
  | "PAYMENT_CONFIRMED"
  | "SUPPLIER_CONTACTED"
  | "VERIFICATION"
  | "READY_FOR_DISPATCH"
  | "DISPATCHED"
  | "IN_TRANSIT"
  | "DELIVERED"
  | "COMPLETED"
  | "CANCELLED"
  | "REFUNDED";

export type PaymentMethod =
  | "WALLET"
  | "CREDIT"
  | "WALLET_AND_CREDIT";

export interface IOrderItem {
  productId: Schema.Types.ObjectId;

  supplierProductId: Schema.Types.ObjectId;

  name: string;

  unit: string;

  quantity: number;

  unitPrice: number;

  subtotal: number;

  batchNumber: string;

  expiryDate: Date;
}

export interface IPharmacistVerification {
  verifiedBy: Schema.Types.ObjectId;

  verifiedByName: string;

  result: "PENDING" | "APPROVED" | "REJECTED";

  batchValid: boolean;

  expiryValid: boolean;

  sealIntact: boolean;

  storageCompliant: boolean;

  notes?: string;

  verifiedAt?: Date;
}

export interface ITrackingUpdate {
  status: string;

  title: string;

  description: string;

  timestamp: Date;
}

export interface IOrder extends Document {
  orderNumber: string;

  procurementId: Schema.Types.ObjectId;

  buyerId: Schema.Types.ObjectId;

  buyerName: string;

  supplierId: Schema.Types.ObjectId;

  supplierName: string;

  supplierType: string;

  items: IOrderItem[];

  subtotal: number;

  commission: number;

  total: number;

  paymentMethod: PaymentMethod;

  walletAmount: number;

  creditAmount: number;

  status: OrderStatus;

  deliveryAddress: string;

  batchNumber?: string;

  expiryDate?: Date;

  pharmacistVerification?: IPharmacistVerification;

  trackingUpdates: ITrackingUpdate[];

  createdAt: Date;

  updatedAt: Date;
}

const OrderItemSchema =
  new Schema<IOrderItem>(
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },

      supplierProductId: {
        type: Schema.Types.ObjectId,
        ref: "SupplierProduct",
        required: true,
      },

      name: {
        type: String,
        required: true,
      },

      unit: {
        type: String,
        required: true,
      },

      quantity: {
        type: Number,
        required: true,
        min: 1,
      },

      unitPrice: {
        type: Number,
        required: true,
        min: 0,
      },

      subtotal: {
        type: Number,
        required: true,
        min: 0,
      },

      batchNumber: {
        type: String,
        required: true,
      },

      expiryDate: {
        type: Date,
        required: true,
      },
    },
    { _id: false }
  );

const PharmacistVerificationSchema =
  new Schema<IPharmacistVerification>(
    {
      verifiedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      verifiedByName: {
        type: String,
        required: true,
      },

      result: {
        type: String,
        enum: [
          "PENDING",
          "APPROVED",
          "REJECTED",
        ],
        default: "PENDING",
      },

      batchValid: Boolean,
      expiryValid: Boolean,
      sealIntact: Boolean,
      storageCompliant: Boolean,
      notes: String,
      verifiedAt: Date,
    },
    { _id: false }
  );

const TrackingUpdateSchema =
  new Schema<ITrackingUpdate>(
    {
      status: {
        type: String,
        required: true,
      },

      title: {
        type: String,
        required: true,
      },

      description: {
        type: String,
        required: true,
      },

      timestamp: {
        type: Date,
        required: true,
      },
    },
    { _id: false }
  );

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    procurementId: {
      type: Schema.Types.ObjectId,
      ref: "Procurement",
      required: true,
      index: true,
    },

    buyerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    buyerName: {
      type: String,
      required: true,
    },

    supplierId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    supplierName: {
      type: String,
      required: true,
    },

    supplierType: {
      type: String,
      required: true,
    },

    items: {
      type: [OrderItemSchema],
      required: true,
    },

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },

    commission: {
      type: Number,
      required: true,
      min: 0,
    },

    total: {
      type: Number,
      required: true,
      min: 0,
    },

    paymentMethod: {
      type: String,
      enum: [
        "WALLET",
        "CREDIT",
        "WALLET_AND_CREDIT",
      ],
      required: true,
    },

    walletAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    creditAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    status: {
      type: String,
      enum: [
        "PENDING",
        "PAYMENT_PENDING",
        "PAYMENT_CONFIRMED",
        "SUPPLIER_CONTACTED",
        "VERIFICATION",
        "READY_FOR_DISPATCH",
        "DISPATCHED",
        "IN_TRANSIT",
        "DELIVERED",
        "COMPLETED",
        "CANCELLED",
        "REFUNDED",
      ],
      default: "PENDING",
      index: true,
    },

    deliveryAddress: {
      type: String,
      required: true,
    },

    batchNumber: String,
    expiryDate: Date,

    pharmacistVerification: {
      type: PharmacistVerificationSchema,
    },

    trackingUpdates: {
      type: [TrackingUpdateSchema],
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

OrderSchema.index({
  buyerId: 1,
  status: 1,
  createdAt: -1,
});

OrderSchema.index({
  supplierId: 1,
  status: 1,
  createdAt: -1,
});

export const Order: Model<IOrder> =
  models.Order ||
  model<IOrder>("Order", OrderSchema);