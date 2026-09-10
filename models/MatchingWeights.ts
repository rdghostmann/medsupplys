import { Schema, Types, model, models, Document, Model } from "mongoose"

/**
 * Supplier Matching Algorithm Weights
 *
 * All values are percentages.
 * The five fields must always add up to 100.
 */
export interface IMatchingWeights extends Document {
  availability: number
  priceCompetitiveness: number
  supplierType: number
  fulfillmentHistory: number
  reliability: number

  isActive: boolean

  updatedBy?: Types.ObjectId

  createdAt: Date
  updatedAt: Date
}

const MatchingWeightsSchema = new Schema<IMatchingWeights>(
  {
    availability: {
      type: Number,
      required: true,
      min: 0,
      max: 50,
      default: 20,
    },

    priceCompetitiveness: {
      type: Number,
      required: true,
      min: 0,
      max: 50,
      default: 35,
    },

    supplierType: {
      type: Number,
      required: true,
      min: 0,
      max: 50,
      default: 5,
    },

    fulfillmentHistory: {
      type: Number,
      required: true,
      min: 0,
      max: 50,
      default: 15,
    },

    reliability: {
      type: Number,
      required: true,
      min: 0,
      max: 50,
      default: 25,
    },

    /**
     * Only one configuration should normally
     * be active at a time.
     */
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    /**
     * Admin who deployed/updated the configuration.
     */
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

/**
 * Validate that the total allocation is exactly 100%.
 */
MatchingWeightsSchema.pre("validate", async function () {
  const total =
    this.availability +
    this.priceCompetitiveness +
    this.supplierType +
    this.fulfillmentHistory +
    this.reliability

  if (total !== 100) {
    throw new Error(
      `Matching weights must total exactly 100%. Current total: ${total}%.`
    )
  }
})

/**
 * Helpful index for retrieving the active configuration.
 */
MatchingWeightsSchema.index({
  isActive: 1,
  updatedAt: -1,
})

export const MatchingWeights: Model<IMatchingWeights> =
  models.MatchingWeights ||
  model<IMatchingWeights>("MatchingWeights", MatchingWeightsSchema)
