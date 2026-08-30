import mongoose, { Document, Model, Schema, Types } from "mongoose"

export type WalletStatus = "active" | "suspended" | "frozen"

export interface IWallet extends Document {
  buyerId: Types.ObjectId
  balance: number
  currency: string
  status: WalletStatus
  createdAt: Date
  updatedAt: Date
}

const WalletSchema = new Schema<IWallet>(
  {
    buyerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    balance: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    currency: {
      type: String,
      required: true,
      default: "NGN",
      uppercase: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["active", "suspended", "frozen"],
      default: "active",
      index: true,
    },
  },
  {
    timestamps: true,
  }
)

export const Wallet: Model<IWallet> =  mongoose.models.Wallet ||  mongoose.model<IWallet>("Wallet", WalletSchema)

