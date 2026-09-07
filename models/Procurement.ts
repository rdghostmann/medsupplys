// /models/Procurement.ts

import {
  Schema,
  Types,
  model,
  models,
  Document,
  Model,
} from "mongoose";

/* =========================================================
   Procurement Status
   ========================================================= */

export type ProcurementStatus =
  | "DRAFT"
  | "OPEN"
  | "MATCHING"
  | "SOURCING"
  | "SUPPLIER_CONTACTED"
  | "SUPPLIER_CONFIRMED"
  | "VERIFICATION"
  | "ORDER_CREATED"
  | "COMPLETED"
  | "CANCELLED"
  | "EXPIRED";

/* =========================================================
   Supplier Candidate Status
   ========================================================= */

export type SupplierCandidateStatus =
  | "QUEUED"
  | "CONTACTED"
  | "ACCEPTED"
  | "DECLINED"
  | "TIMEOUT"
  | "SKIPPED";

/* =========================================================
   Procurement Payment Method
   ========================================================= */

export type ProcurementPaymentMethod =
  | "WALLET"
  | "CREDIT"
  | "WALLET_AND_CREDIT";

/* =========================================================
   Procurement Item
   ========================================================= */

export interface IProcurementItem {
  productId: Types.ObjectId;

  productName: string;

  supplierProductId: Types.ObjectId;

  supplierId: Types.ObjectId;

  supplierName: string;

  supplierType: string;

  quantity: number;

  unit: string;

  unitPrice: number;

  totalPrice: number;

  preferredSupplierType?: string;

  requiredByDate?: Date;
}

/* =========================================================
   Supplier Candidate
   ========================================================= */

export interface ISupplierCandidate {
  supplierId: Types.ObjectId;

  supplierName: string;

  supplierType: string;

  supplierProductId: Types.ObjectId;

  unitPrice: number;

  totalPrice: number;

  stock: number;

  rank: number;

  score: number;

  status: SupplierCandidateStatus;
}

/* =========================================================
   Procurement Attempt
   ========================================================= */

export interface IProcurementAttempt {
  attemptNumber: number;

  supplierId: Types.ObjectId;

  supplierName: string;

  supplierType: string;

  supplierProductId?: Types.ObjectId;

  offeredPrice?: number;

  status: SupplierCandidateStatus;

  contactedAt?: Date;

  respondedAt?: Date;

  responseNotes?: string;
}

/* =========================================================
   Matching Weights Snapshot
   ========================================================= */

export interface IMatchingWeightsSnapshot {
  priceWeight: number;

  stockWeight: number;

  ratingWeight: number;

  fulfillmentWeight: number;

  deliveryWeight: number;

  supplierTypeWeight: number;
}

/* =========================================================
   Procurement Financial Snapshot
   ========================================================= */

export interface IProcurementFinancials {
  totalAmount: number;

  walletAmount: number;

  creditAmount: number;

  paymentMethod: ProcurementPaymentMethod;

  currency: "NGN";

  walletTransactionId?: Types.ObjectId;

  creditTransactionId?: Types.ObjectId;
}

/* =========================================================
   Procurement
   ========================================================= */

export interface IProcurement extends Document {
  procurementNumber: string;

  buyerId: Types.ObjectId;

  buyerName: string;

  items: IProcurementItem[];

  status: ProcurementStatus;

  financials: IProcurementFinancials;

  supplierCandidates: ISupplierCandidate[];

  currentSupplierIndex: number;

  currentSupplierId?: Types.ObjectId;

  currentSupplierProductId?: Types.ObjectId;

  currentSupplierName?: string;

  attemptHistory: IProcurementAttempt[];

  deliveryAddress: string;

  notes?: string;

  matchingWeightsSnapshot?: IMatchingWeightsSnapshot;

  orderId?: Types.ObjectId;

  supplierContactedAt?: Date;

  supplierConfirmedAt?: Date;

  cancelledAt?: Date;

  cancellationReason?: string;

  expiresAt?: Date;

  createdAt: Date;

  updatedAt: Date;
}

/* =========================================================
   Procurement Item Schema
   ========================================================= */

const ProcurementItemSchema =
  new Schema<IProcurementItem>(
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },

      productName: {
        type: String,
        required: true,
      },

      supplierProductId: {
        type: Schema.Types.ObjectId,
        ref: "SupplierProduct",
        required: true,
      },

      supplierId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      supplierName: {
        type: String,
        required: true,
      },

      supplierType: {
        type: String,
        required: true,
      },

      quantity: {
        type: Number,
        required: true,
        min: 1,
      },

      unit: {
        type: String,
        required: true,
      },

      unitPrice: {
        type: Number,
        required: true,
        min: 0,
      },

      totalPrice: {
        type: Number,
        required: true,
        min: 0,
      },

      preferredSupplierType: String,

      requiredByDate: Date,
    },
    {
      _id: false,
    }
  );

/* =========================================================
   Supplier Candidate Schema
   ========================================================= */

const SupplierCandidateSchema =
  new Schema<ISupplierCandidate>(
    {
      supplierId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      supplierName: {
        type: String,
        required: true,
      },

      supplierType: {
        type: String,
        required: true,
      },

      supplierProductId: {
        type: Schema.Types.ObjectId,
        ref: "SupplierProduct",
        required: true,
      },

      unitPrice: {
        type: Number,
        required: true,
        min: 0,
      },

      totalPrice: {
        type: Number,
        required: true,
        min: 0,
      },

      stock: {
        type: Number,
        required: true,
        min: 0,
      },

      rank: {
        type: Number,
        required: true,
        min: 1,
      },

      score: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
      },

      status: {
        type: String,
        enum: [
          "QUEUED",
          "CONTACTED",
          "ACCEPTED",
          "DECLINED",
          "TIMEOUT",
          "SKIPPED",
        ],
        default: "QUEUED",
      },
    },
    {
      _id: false,
    }
  );

/* =========================================================
   Procurement Attempt Schema
   ========================================================= */

const ProcurementAttemptSchema =
  new Schema<IProcurementAttempt>(
    {
      attemptNumber: {
        type: Number,
        required: true,
        min: 1,
      },

      supplierId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      supplierName: {
        type: String,
        required: true,
      },

      supplierType: {
        type: String,
        required: true,
      },

      supplierProductId: {
        type: Schema.Types.ObjectId,
        ref: "SupplierProduct",
      },

      offeredPrice: {
        type: Number,
        min: 0,
      },

      status: {
        type: String,
        enum: [
          "QUEUED",
          "CONTACTED",
          "ACCEPTED",
          "DECLINED",
          "TIMEOUT",
          "SKIPPED",
        ],
        required: true,
      },

      contactedAt: Date,

      respondedAt: Date,

      responseNotes: String,
    },
    {
      _id: false,
    }
  );

/* =========================================================
   Financial Schema
   ========================================================= */

const ProcurementFinancialsSchema =
  new Schema<IProcurementFinancials>(
    {
      totalAmount: {
        type: Number,
        required: true,
        min: 0,
      },

      walletAmount: {
        type: Number,
        required: true,
        min: 0,
        default: 0,
      },

      creditAmount: {
        type: Number,
        required: true,
        min: 0,
        default: 0,
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

      currency: {
        type: String,
        enum: ["NGN"],
        default: "NGN",
        required: true,
      },

      walletTransactionId: {
        type: Schema.Types.ObjectId,
        ref: "WalletTransaction",
      },

      creditTransactionId: {
        type: Schema.Types.ObjectId,
        ref: "CreditTransaction",
      },
    },
    {
      _id: false,
    }
  );

/* =========================================================
   Matching Snapshot Schema
   ========================================================= */

const MatchingWeightsSnapshotSchema =
  new Schema<IMatchingWeightsSnapshot>(
    {
      priceWeight: {
        type: Number,
        required: true,
      },

      stockWeight: {
        type: Number,
        required: true,
      },

      ratingWeight: {
        type: Number,
        required: true,
      },

      fulfillmentWeight: {
        type: Number,
        required: true,
      },

      deliveryWeight: {
        type: Number,
        required: true,
      },

      supplierTypeWeight: {
        type: Number,
        required: true,
      },
    },
    {
      _id: false,
    }
  );

/* =========================================================
   Procurement Schema
   ========================================================= */

const ProcurementSchema =
  new Schema<IProcurement>(
    {
      /* ================================================
         Procurement Identity
         ================================================ */

      procurementNumber: {
        type: String,
        required: true,
        unique: true,
        index: true,
      },

      /* ================================================
         Buyer
         ================================================ */

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

      /* ================================================
         Procurement Items
         ================================================ */

      items: {
        type: [ProcurementItemSchema],
        required: true,

        validate: {
          validator: (
            items: IProcurementItem[]
          ) => items.length > 0,

          message:
            "Procurement must contain at least one item",
        },
      },

      /* ================================================
         Procurement Status
         ================================================ */

      status: {
        type: String,
        enum: [
          "DRAFT",
          "OPEN",
          "MATCHING",
          "SOURCING",
          "SUPPLIER_CONTACTED",
          "SUPPLIER_CONFIRMED",
          "VERIFICATION",
          "ORDER_CREATED",
          "COMPLETED",
          "CANCELLED",
          "EXPIRED",
        ],
        default: "DRAFT",
        index: true,
      },

      /* ================================================
         Financial Snapshot
         ================================================ */

      financials: {
        type: ProcurementFinancialsSchema,
        required: true,
      },

      /* ================================================
         Ranked Supplier Pool
         ================================================ */

      supplierCandidates: {
        type: [SupplierCandidateSchema],
        default: [],
      },

      /* ================================================
         Current Supplier
         ================================================ */

      currentSupplierIndex: {
        type: Number,
        default: 0,
        min: 0,
      },

      currentSupplierId: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },

      currentSupplierProductId: {
        type: Schema.Types.ObjectId,
        ref: "SupplierProduct",
      },

      currentSupplierName: String,

      /* ================================================
         Supplier Contact / Response
         ================================================ */

      attemptHistory: {
        type: [ProcurementAttemptSchema],
        default: [],
      },

      supplierContactedAt: Date,

      supplierConfirmedAt: Date,

      /* ================================================
         Delivery
         ================================================ */

      deliveryAddress: {
        type: String,
        required: true,
        trim: true,
      },

      /* ================================================
         Notes
         ================================================ */

      notes: {
        type: String,
        trim: true,
      },

      /* ================================================
         Matching Algorithm Snapshot
         ================================================ */

      matchingWeightsSnapshot: {
        type: MatchingWeightsSnapshotSchema,
      },

      /* ================================================
         Order
         ================================================ */

      orderId: {
        type: Schema.Types.ObjectId,
        ref: "Order",
        index: true,
      },

      /* ================================================
         Cancellation
         ================================================ */

      cancelledAt: Date,

      cancellationReason: String,

      /* ================================================
         Expiration
         ================================================ */

      expiresAt: {
        type: Date,
        index: true,
      },
    },
    {
      timestamps: true,
      versionKey: false,
    }
  );

/* =========================================================
   Indexes
   ========================================================= */

ProcurementSchema.index({
  buyerId: 1,
  status: 1,
});

ProcurementSchema.index({
  status: 1,
  createdAt: -1,
});

ProcurementSchema.index({
  currentSupplierId: 1,
  status: 1,
});

ProcurementSchema.index({
  expiresAt: 1,
  status: 1,
});

ProcurementSchema.index({
  orderId: 1,
});

/* =========================================================
   Model
   ========================================================= */

export const Procurement: Model<IProcurement> =
  models.Procurement ||
  model<IProcurement>(
    "Procurement",
    ProcurementSchema
  );