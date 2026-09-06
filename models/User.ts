// /models/User.ts

import {
  Schema,
  model,
  models,
  Document,
  Model,
} from "mongoose";

/* =========================================================
   ENUM TYPES
========================================================= */

export type UserRole =
  | "buyer"
  | "supplier"
  | "admin"
  | "pharmacist";

export type SupplierType =
  | "importer"
  | "distributor"
  | "retailer";

export type OrganizationType =
  | "manufacturer"
  | "distributor"
  | "wholesaler"
  | "pharmacy";

export type SupplierStatus =
  | "pending"
  | "approved"
  | "rejected";

export type UserStatus =
  | "active"
  | "suspended"
  | "pending";

export type SupplierApprovalStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "suspended";

export type CreditRatingTier =
  | "A"
  | "B"
  | "C"
  | "UNRATED";

/* =========================================================
   NOTIFICATION PREFERENCES
========================================================= */

export interface IUserNotificationPreferences {
  email?: boolean;
  sms?: boolean;
  orderUpdates?: boolean;
  paymentAlerts?: boolean;
  inventoryAlerts?: boolean;
  kycUpdates?: boolean;
  promotional?: boolean;
}

/* =========================================================
   SUPPLIER PROFILE
========================================================= */

export interface ISupplierProfile {
  businessName?: string;

  supplierType?: SupplierType;

  organizationType?: OrganizationType;

  roleInOrganization?: string;

  phone?: string;

  address?: string;

  country?: string;

  state?: string;

  city?: string;

  postalCode?: string;

  licenseNumber?: string;

  licenseDocument?: string;

  logo?: string;

  status?: SupplierStatus;
}

/* =========================================================
   USER DOCUMENT
========================================================= */

export interface IUser extends Document {
  /* -------------------------------------------------------
     Identity
  ------------------------------------------------------- */

  firstName: string;

  lastName: string;

  username?: string;

  email: string;

  phone?: string;

  password: string;

  role: UserRole;

  status: UserStatus;

  avatar?: string;

  /* -------------------------------------------------------
     Organization
  ------------------------------------------------------- */

  organizationName?: string;

  organizationType?: OrganizationType;

  roleInOrganization?: string;

  designation?: string;

  /* -------------------------------------------------------
     General Location
  ------------------------------------------------------- */

  country?: string;

  state?: string;

  lga?: string;

  address?: string;

  /* -------------------------------------------------------
     Account / Legal Consent
  ------------------------------------------------------- */

  termsAccepted: boolean;

  privacyAccepted: boolean;

  verified: boolean;

  /* -------------------------------------------------------
     Supplier
  ------------------------------------------------------- */

  supplierType?: SupplierType;

  supplierApprovalStatus?: SupplierApprovalStatus;

  supplierProfile?: ISupplierProfile;

  licenseNumber?: string;

  /* -------------------------------------------------------
     Facility / Buyer Profile
  ------------------------------------------------------- */

  facilityType?: string;

  bedCapacity?: number;

  emergencyContact?: string;

  pcnPremisesLicense?: string;

  nafdacGdpLicense?: string;

  coldChainCapacityM3?: number;

  backupPowerSpec?: string;

  receivingHours?: string;

  /* -------------------------------------------------------
     Settlement & Financial
  ------------------------------------------------------- */

  settlementBankName?: string;

  settlementAccountNumber?: string;

  settlementAccountName?: string;

  settlementSortCode?: string;

  taxIdentificationNumber?: string;

  /* -------------------------------------------------------
     Pharmacist / QA
  ------------------------------------------------------- */

  pharmacistLicense?: string;

  pharmacistCadre?: string;

  annualPracticingLicenseNo?: string;

  qaStampVerified?: boolean;

  /* -------------------------------------------------------
     Admin & Security
  ------------------------------------------------------- */

  adminClearanceTier?: string;

  twoFactorEnabled?: boolean;

  notificationPreferences?: IUserNotificationPreferences;

  /* -------------------------------------------------------
     Supplier KYC
  ------------------------------------------------------- */

  kycSubmittedAt?: Date;

  kycApprovedAt?: Date;

  kycReviewNotes?: string;

  kycRejectionReason?: string;

  kycSuspensionReason?: string;

  /* -------------------------------------------------------
     Credit Facility
  ------------------------------------------------------- */

  creditRatingTier?: CreditRatingTier;

  assignedCreditLimit?: number;

  /* -------------------------------------------------------
     Compliance / Cold Chain
  ------------------------------------------------------- */

  isColdChainCertified?: boolean;

  gdpAuditDate?: Date;

  pcnInspectionDate?: Date;

  /* -------------------------------------------------------
     System
  ------------------------------------------------------- */

  createdAt: Date;

  updatedAt: Date;
}

/* =========================================================
   NOTIFICATION PREFERENCES SCHEMA
========================================================= */

const NotificationPreferencesSchema =
  new Schema<IUserNotificationPreferences>(
    {
      email: {
        type: Boolean,
        default: true,
      },

      sms: {
        type: Boolean,
        default: true,
      },

      orderUpdates: {
        type: Boolean,
        default: true,
      },

      paymentAlerts: {
        type: Boolean,
        default: true,
      },

      inventoryAlerts: {
        type: Boolean,
        default: true,
      },

      kycUpdates: {
        type: Boolean,
        default: true,
      },

      promotional: {
        type: Boolean,
        default: false,
      },
    },
    {
      _id: false,
    }
  );

/* =========================================================
   SUPPLIER PROFILE SCHEMA
========================================================= */

const SupplierProfileSchema =
  new Schema<ISupplierProfile>(
    {
      businessName: {
        type: String,
        trim: true,
      },

      supplierType: {
        type: String,
        enum: [
          "importer",
          "distributor",
          "retailer",
        ],
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
        enum: [
          "pending",
          "approved",
          "rejected",
        ],
        default: "pending",
      },
    },
    {
      _id: false,
    }
  );

/* =========================================================
   USER SCHEMA
========================================================= */

const UserSchema = new Schema<IUser>(
  {
    /* -------------------------------------------------------
       Identity
    ------------------------------------------------------- */

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

    username: {
      type: String,
      unique: true,
      trim: true,
      index: true,
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
      enum: [
        "buyer",
        "supplier",
        "admin",
        "pharmacist",
      ],
      required: true,
      default: "buyer",
      index: true,
    },

    status: {
      type: String,
      enum: ["active", "suspended", "pending"],
      default: "active",
      index: true,
    },

    avatar: {
      type: String,
      trim: true,
    },

    /* -------------------------------------------------------
       Organization
    ------------------------------------------------------- */

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

    designation: {
      type: String,
      trim: true,
    },

    /* -------------------------------------------------------
       Location
    ------------------------------------------------------- */

    country: {
      type: String,
      trim: true,
    },

    state: {
      type: String,
      trim: true,
    },

    lga: {
      type: String,
      trim: true,
    },

    address: {
      type: String,
      trim: true,
    },

    /* -------------------------------------------------------
       Account / Consent
    ------------------------------------------------------- */

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

    /* -------------------------------------------------------
       Supplier
    ------------------------------------------------------- */

    supplierType: {
      type: String,
      enum: [
        "importer",
        "distributor",
        "retailer",
      ],
      index: true,
    },

    supplierApprovalStatus: {
      type: String,
      enum: [
        "pending",
        "approved",
        "rejected",
        "suspended",
      ],
      default: "pending",
      index: true,
    },

    licenseNumber: {
      type: String,
      trim: true,
    },

    supplierProfile: {
      type: SupplierProfileSchema,
      default: undefined,
    },

    /* -------------------------------------------------------
       Facility / Buyer
    ------------------------------------------------------- */

    facilityType: {
      type: String,
      trim: true,
    },

    bedCapacity: {
      type: Number,
      min: 0,
    },

    emergencyContact: {
      type: String,
      trim: true,
    },

    pcnPremisesLicense: {
      type: String,
      trim: true,
    },

    nafdacGdpLicense: {
      type: String,
      trim: true,
    },

    coldChainCapacityM3: {
      type: Number,
      min: 0,
    },

    backupPowerSpec: {
      type: String,
      trim: true,
    },

    receivingHours: {
      type: String,
      trim: true,
    },

    /* -------------------------------------------------------
       Settlement & Financial
    ------------------------------------------------------- */

    settlementBankName: {
      type: String,
      trim: true,
    },

    settlementAccountNumber: {
      type: String,
      trim: true,
    },

    settlementAccountName: {
      type: String,
      trim: true,
    },

    settlementSortCode: {
      type: String,
      trim: true,
    },

    taxIdentificationNumber: {
      type: String,
      trim: true,
    },

    /* -------------------------------------------------------
       Pharmacist / QA
    ------------------------------------------------------- */

    pharmacistLicense: {
      type: String,
      trim: true,
    },

    pharmacistCadre: {
      type: String,
      trim: true,
    },

    annualPracticingLicenseNo: {
      type: String,
      trim: true,
    },

    qaStampVerified: {
      type: Boolean,
      default: false,
    },

    /* -------------------------------------------------------
       Admin & Security
    ------------------------------------------------------- */

    adminClearanceTier: {
      type: String,
      trim: true,
    },

    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },

    notificationPreferences: {
      type: NotificationPreferencesSchema,
      default: () => ({}),
    },

    /* -------------------------------------------------------
       KYC Verification
    ------------------------------------------------------- */

    kycSubmittedAt: {
      type: Date,
    },

    kycApprovedAt: {
      type: Date,
    },

    kycReviewNotes: {
      type: String,
      trim: true,
    },

    kycRejectionReason: {
      type: String,
      trim: true,
    },

    kycSuspensionReason: {
      type: String,
      trim: true,
    },

    /* -------------------------------------------------------
       Credit Facility
    ------------------------------------------------------- */

    creditRatingTier: {
      type: String,
      enum: [
        "A",
        "B",
        "C",
        "UNRATED",
      ],
      default: "UNRATED",
    },

    assignedCreditLimit: {
      type: Number,
      min: 0,
      default: 0,
    },

    /* -------------------------------------------------------
       Compliance / Cold Chain
    ------------------------------------------------------- */

    isColdChainCertified: {
      type: Boolean,
      default: false,
    },

    gdpAuditDate: {
      type: Date,
    },

    pcnInspectionDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/* =========================================================
   INDEXES
========================================================= */

UserSchema.index({
  role: 1,
  supplierApprovalStatus: 1,
});

UserSchema.index({
  supplierType: 1,
  supplierApprovalStatus: 1,
});

UserSchema.index({
  organizationName: 1,
});

UserSchema.index({
  "supplierProfile.businessName": 1,
});

/* =========================================================
   MODEL
========================================================= */

export const User: Model<IUser> =
  models?.User ||
  model<IUser>("User", UserSchema);