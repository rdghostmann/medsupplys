// /models/SupplierProduct.ts

import {
  Schema,
  Types,
  model,
  models,
  Document,
  Model,
} from "mongoose";

export type SupplierProductStatus =
  | "AVAILABLE"
  | "LOW_STOCK"
  | "OUT_OF_STOCK"
  | "ON_REQUEST"
  | "SUSPENDED";

export type SupplierType =
  | "importer"
  | "distributor"
  | "retailer";

export interface ISupplierProduct extends Document {
  /**
   * References the Admin-approved Master Catalogue Product.
   */
  productId: Types.ObjectId;

  /**
   * Supplier who owns this listing.
   */
  supplierId: Types.ObjectId;

  supplierType: SupplierType;

  /**
   * Supplier-specific regulatory information.
   *
   * This is intentionally NOT stored on Product
   * because different suppliers/brands/batches may
   * have different NAFDAC registration numbers.
   */
  nafdacRegNumber: string;

  /**
   * Supplier pricing
   */
  basePrice: number;

  commission: number;

  commissionPercent: number;

  finalPrice: number;

  /**
   * Inventory
   */
  stock: number;

  minOrderQuantity: number;

  maxOrderQuantity: number;

  unit: string;

  /**
   * Batch / regulatory tracking
   */
  batchNumber: string;

  expiryDate: Date;

  manufacturingDate?: Date;

  /**
   * Supplier verification evidence
   */
  verificationImages?: {
    url: string;
    label?: string;
  }[];

  /**
   * Marketplace status
   */
  status: SupplierProductStatus;

  isFlagged: boolean;

  /**
   * Marketplace ranking metrics
   */
  rating: number;

  fulfillmentRate: number;

  estimatedDeliveryDays: number;

  lastStockUpdatedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const SupplierProductSchema =
  new Schema<ISupplierProduct>(
    {
      /**
       * Master Catalogue Product
       *
       * Supplier MUST select an existing approved
       * Product instead of creating a new product.
       */
      productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
        index: true,
      },

      /**
       * Supplier account
       */
      supplierId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
      },

      supplierType: {
        type: String,
        enum: [
          "importer",
          "distributor",
          "retailer",
        ],
        required: true,
      },

      /**
       * Supplier-specific NAFDAC registration number.
       *
       * Example:
       * A supplier may select:
       *
       *   Product:
       *   Amoxicillin 500mg Capsule
       *
       * Then enter their own:
       *
       *   NAFDAC No: A4-1234
       */
      nafdacRegNumber: {
        type: String,
        required: true,
        trim: true,
      },

      /**
       * Supplier's base selling price
       */
      basePrice: {
        type: Number,
        required: true,
        min: 0,
      },

      /**
       * Commission amount calculated by the platform
       */
      commission: {
        type: Number,
        required: true,
        min: 0,
      },

      /**
       * Commission percentage inherited from
       * the Master Product.
       */
      commissionPercent: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
      },

      /**
       * Final marketplace selling price
       */
      finalPrice: {
        type: Number,
        required: true,
        min: 0,
      },

      /**
       * Current supplier inventory
       */
      stock: {
        type: Number,
        required: true,
        min: 0,
      },

      minOrderQuantity: {
        type: Number,
        required: true,
        min: 1,
      },

      maxOrderQuantity: {
        type: Number,
        required: true,
        min: 1,
      },

      /**
       * Commercial unit used by this supplier.
       *
       * The Master Product still defines the standard
       * product unit. This field represents the supplier's
       * actual selling unit where required.
       */
      unit: {
        type: String,
        required: true,
        trim: true,
      },

      /**
       * Batch traceability
       */
      batchNumber: {
        type: String,
        required: true,
        trim: true,
      },

      expiryDate: {
        type: Date,
        required: true,
      },

      manufacturingDate: {
        type: Date,
      },

      /**
       * Verification evidence
       */
      verificationImages: [
        {
          url: {
            type: String,
            required: true,
            trim: true,
          },

          label: {
            type: String,
            trim: true,
          },
        },
      ],

      /**
       * Marketplace inventory status
       */
      status: {
        type: String,
        enum: [
          "AVAILABLE",
          "LOW_STOCK",
          "OUT_OF_STOCK",
          "ON_REQUEST",
          "SUSPENDED",
        ],
        default: "AVAILABLE",
        index: true,
      },

      isFlagged: {
        type: Boolean,
        default: false,
        index: true,
      },

      /**
       * Supplier performance metrics
       */
      rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
      },

      fulfillmentRate: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },

      estimatedDeliveryDays: {
        type: Number,
        min: 0,
        default: 0,
      },

      lastStockUpdatedAt: {
        type: Date,
      },
    },
    {
      timestamps: true,
      versionKey: false,
    }
  );

/**
 * One supplier can only have one active listing
 * for a Master Product.
 */
SupplierProductSchema.index(
  {
    productId: 1,
    supplierId: 1,
  },
  {
    unique: true,
  }
);

/**
 * Dynamic Ranked Pool / Supplier Matching Engine
 *
 * Supports filtering and ranking by:
 * - product
 * - availability
 * - price
 */
SupplierProductSchema.index({
  productId: 1,
  status: 1,
  basePrice: 1,
});

/**
 * Supplier dashboard queries
 */
SupplierProductSchema.index({
  supplierId: 1,
  status: 1,
});

/**
 * Regulatory lookup
 */
SupplierProductSchema.index({
  nafdacRegNumber: 1,
});

/**
 * Expiry monitoring
 */
SupplierProductSchema.index({
  expiryDate: 1,
  status: 1,
});

export const SupplierProduct: Model<ISupplierProduct> =
  models.SupplierProduct ||
  model<ISupplierProduct>(
    "SupplierProduct",
    SupplierProductSchema
  );