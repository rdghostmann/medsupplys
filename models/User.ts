// /models/User.ts

import { Schema, model, models, Document, Model } from "mongoose"

export type UserRole = "buyer" | "supplier" | "admin"

export type SupplierType =
  | "importer"
  | "distributor"
  | "retailer"

export type OrganizationType =
  | "manufacturer"
  | "distributor"
  | "wholesaler"
  | "pharmacy"

export type SupplierStatus =
  | "pending"
  | "approved"
  | "rejected"

export interface ISupplierProfile {
  businessName?: string

  supplierType?: SupplierType

  organizationType?: OrganizationType

  roleInOrganization?: string

  phone?: string

  address?: string

  country?: string

  state?: string

  city?: string

  postalCode?: string

  licenseNumber?: string

  licenseDocument?: string

  logo?: string

  status?: SupplierStatus
}

export interface IUser extends Document {
  firstName: string

  lastName: string

  email: string

  phone?: string

  password: string

  role: UserRole

  organizationName?: string

  organizationType?: OrganizationType

  roleInOrganization?: string

  country?: string

  termsAccepted: boolean

  privacyAccepted: boolean

  verified: boolean

  supplierProfile?: ISupplierProfile

  createdAt: Date

  updatedAt: Date
}

const SupplierProfileSchema = new Schema<ISupplierProfile>(
  {
    businessName: {
      type: String,
      trim: true,
    },

    supplierType: {
      type: String,
      enum: ["importer", "distributor", "retailer"],
    },

    organizationType: {
      type: String,
      enum: [
        "manufacturer",
        "distributor",
        "wholesaler",
        "pharmacy",
      ],
    },

    roleInOrganization: {
      type: String,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    address: {
      type: String,
      trim: true,
    },

    country: {
      type: String,
      trim: true,
    },

    state: {
      type: String,
      trim: true,
    },

    city: {
      type: String,
      trim: true,
    },

    postalCode: {
      type: String,
      trim: true,
    },

    licenseNumber: {
      type: String,
      trim: true,
    },

    licenseDocument: {
      type: String,
      trim: true,
    },

    logo: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  {
    _id: false,
  }
)

const UserSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
      minlength: 6,
    },

    role: {
      type: String,
      enum: ["buyer", "supplier", "admin"],
      required: true,
      default: "buyer",
    },

    organizationName: {
      type: String,
      trim: true,
    },

    organizationType: {
      type: String,
      enum: [
        "manufacturer",
        "distributor",
        "wholesaler",
        "pharmacy",
      ],
    },

    roleInOrganization: {
      type: String,
      trim: true,
    },

    country: {
      type: String,
      trim: true,
    },

    termsAccepted: {
      type: Boolean,
      default: false,
      required: true,
    },

    privacyAccepted: {
      type: Boolean,
      default: false,
      required: true,
    },

    verified: {
      type: Boolean,
      default: false,
    },

    supplierProfile: {
      type: SupplierProfileSchema,
      default: undefined,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

export const User: Model<IUser> = models?.User || model<IUser>("User", UserSchema)