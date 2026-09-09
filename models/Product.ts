// /models/Product.ts

import {
  Schema,
  model,
  models,
  Document,
  Model,
} from "mongoose";

export type ProductStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "SUSPENDED"
  | "ARCHIVED";

export interface IProduct extends Document {
  /**
   * Master Catalogue Identity
   * -------------------------
   * This is the approved product definition
   * controlled by Admin.
   */
  name: string;

  genericName?: string;
  brandName?: string;

  activeIngredient: string;
  strength: string;
  dosageForm: string;

  category: string;

  unit: string;
  packSize?: string;

  /**
   * Platform reference pricing
   */
  referenceBasePrice: number;

  commissionPercent: number;

  maxMarkupPercent: number;

  /**
   * Product lifecycle
   */
  status: ProductStatus;

  /**
   * Product handling information
   */
  storageCondition?: string;

  requiresColdChain: boolean;

  controlledDrug: boolean;

  prescriptionRequired: boolean;

  description?: string;

  image?: string;

  /**
   * Audit
   */
  createdBy?: Schema.Types.ObjectId;
  updatedBy?: Schema.Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    genericName: {
      type: String,
      trim: true,
    },

    brandName: {
      type: String,
      trim: true,
    },

    activeIngredient: {
      type: String,
      required: true,
      trim: true,
    },

    strength: {
      type: String,
      required: true,
      trim: true,
    },

    dosageForm: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    unit: {
      type: String,
      required: true,
      trim: true,
    },

    packSize: {
      type: String,
      trim: true,
    },

    /**
     * Admin-controlled reference price.
     *
     * This is NOT the supplier selling price.
     */
    referenceBasePrice: {
      type: Number,
      required: true,
      min: 0,
    },

    commissionPercent: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    /**
     * Maximum supplier markup permitted
     * against the platform pricing rules.
     */
    maxMarkupPercent: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: [
        "ACTIVE",
        "INACTIVE",
        "SUSPENDED",
        "ARCHIVED",
      ],
      default: "ACTIVE",
      index: true,
    },

    storageCondition: {
      type: String,
      trim: true,
    },

    requiresColdChain: {
      type: Boolean,
      default: false,
    },

    controlledDrug: {
      type: Boolean,
      default: false,
    },

    prescriptionRequired: {
      type: Boolean,
      default: false,
    },

    description: {
      type: String,
      trim: true,
    },

    image: {
      type: String,
      trim: true,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/**
 * Master catalogue search
 */
ProductSchema.index({
  name: "text",
  genericName: "text",
  brandName: "text",
  activeIngredient: "text",
});

/**
 * Useful catalogue filters
 */
ProductSchema.index({
  category: 1,
  status: 1,
});

ProductSchema.index({
  status: 1,
  name: 1,
});

export const Product: Model<IProduct> =
  models.Product ||
  model<IProduct>("Product", ProductSchema);