import mongoose, { Document, Model, Schema } from "mongoose"

export interface IProductCategory extends Document {
  name: string
  slug: string
  code: string
  description?: string

  isActive: boolean
  sortOrder: number

  createdAt: Date
  updatedAt: Date
}

const ProductCategorySchema = new Schema<IProductCategory>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      index: true,
    },

    /**
     * Stable internal category identifier.
     *
     * Example:
     * ANTIBIOTICS
     * ANTIMICROBIALS
     * IV_FLUIDS
     */
    code: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      unique: true,
      index: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    /**
     * Allows an administrator to hide a category
     * without deleting it.
     */
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    /**
     * Controls category display order.
     */
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
)

const ProductCategory: Model<IProductCategory> =
  mongoose.models.ProductCategory ||
  mongoose.model<IProductCategory>("ProductCategory", ProductCategorySchema)

export default ProductCategory
