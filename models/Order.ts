// /models/Order.ts
import mongoose, {
  Schema,
  model,
  models,
  type InferSchemaType,
  type HydratedDocument,
  type Types,
} from "mongoose"

/* =========================================================
   CANDIDATE SUPPLIER SUBSCHEMA
========================================================= */

const CandidateSupplierSchema = new Schema(
  {
    supplierId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "rejected",
        "unresponsive",
      ],
      default: "pending",
    },

    position: {
      type: Number,
      required: true,
    },

    notifiedAt: {
      type: Date,
    },
  },
  { _id: false }
)

/* =========================================================
   DELIVERY DETAILS SUBSCHEMA
========================================================= */

const DeliveryDetailsSchema = new Schema(
  {
    contactName: String,

    phone: String,

    address: String,

    deliveryDate: String,

    notes: String,
  },
  { _id: false }
)

/* =========================================================
   MAIN ORDER SCHEMA
========================================================= */

const OrderSchema = new Schema(
  {
    buyerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },

    supplierId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    supplierPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    commission: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    candidateSuppliers: {
      type: [CandidateSupplierSchema],
      default: [],
    },

    fulfillmentMode: {
      type: String,
      enum: ["single", "partial"],
      default: "single",
    },

    paymentStatus: {
      type: String,
      enum: [
        "pending",
        "paid",
        "failed",
        "refunded",
      ],
      default: "pending",
      index: true,
    },

    paystackReference: {
      type: String,
      trim: true,
    },

    paymentMethod: {
      type: String,
      default: "paystack",
    },

    deliveryDetails: {
      type: DeliveryDetailsSchema,
      default: {},
    },

    status: {
      type: String,
      enum: [
        "pending",
        "supplier_contacted",
        "supplier_confirmed",
        "in_transit",
        "under_verification",
        "verified",
        "delivered",
        "cancelled",
      ],
      default: "pending",
      index: true,
    },
  },
  {
    timestamps: true,
  }
)

/* =========================================================
   TYPES
========================================================= */

export type OrderDocument =
  HydratedDocument<InferSchemaType<typeof OrderSchema>>

export type OrderType =
  InferSchemaType<typeof OrderSchema>

/* =========================================================
   MODEL
========================================================= */

export const Order =
  models.Order ||
  model("Order", OrderSchema)