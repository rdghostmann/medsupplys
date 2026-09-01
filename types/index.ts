// types/index.ts
import { z } from "zod"

export type SupplierType = "importer" | "distributor" | "retailer"
export type Role = "buyer" | "supplier" | "admin" | "pharmacist"
export type OrganizationType = "manufacturer" | "distributor" | "wholesaler" | "pharmacy"
export type UnitType = "unit" | "pack" | "carton"

export type UnitConfig = {
  type: UnitType
  unitsPerBase: number
}


export type VerificationStatus = "Verified" | "Rejected" | "Pending";

export type OrderStatus =
  | "Under Verification"
  | "In Transit to Office"
  | "Verified"
  | "Delivered"
  | "Supplier Contacted"
  | "Pending"
  | "Supplier Confirmed"
  | "Rejected";

export interface Order {
  id: string;
  product: string;
  buyer: string;
  qty: number;
  basePrice: number;
  status: OrderStatus;
  date: string;
  supplier: string;
  batchNo?: string;
  barcode?: string;
  mfgDate?: string;
  expiryDate?: string;
  condition?: string;
  notes?: string;
}

export interface PharmacistVerificationRecord {
  id: string;
  orderId: string;
  product: string;
  category?: string;
  dosage?: string;
  batchNo: string;
  result: VerificationStatus;
  pharmacist: string;
  pharmacistLicense?: string;
  date: string;
  notes?: string;
  nafdacNumber?: string;
  manufacturer?: string;
  expiryDate?: string;
  quantity?: number;
  facility?: string;
}

export type MatchResult = {
  supplierId: string
  supplierName: string
  supplierType: "importer" | "distributor" | "retailer"

  price: number
  stock: number

  score: number

  reasons: string[]
}

export type MarketItem = {
  _id: string

  product: {
    _id: string
    name: string
    category: string
    description: string
    image?: string | null
  }

  supplier: {
    _id: string
    name: string
    supplierType: "importer" | "distributor" | "retailer"
  }

  inventory: {
    pricePerUnit: number
    stock: number
    moq: number
  }

  status: "available" | "low" | "out"
}

export type ProcurementOrder = {
  supplierId: string

  productId: string

  quantity: number

  unitType:
  | "carton"
  | "pack"
  | "unit"

  totalUnits: number

  unitPrice: number

  totalCost: number

  deliveryAddress: string

  deliveryDate?: string

  notes?: string
}

export const unitTypesBySupplier = {
  importer: [
    "carton",
    "pack",
  ],

  distributor: [
    "pack",
    "unit",
  ],

  retailer: ["unit"],
}

export type SupplierDTO = {
  _id: string
  supplierProductId: string

  name: string
  email?: string

  supplierType: "importer" | "distributor" | "retailer"

  verified: boolean
  rating: number

  price: number
  stock: number

  minOrderQuantity: number
  maxOrderQuantity?: number | null

  salesUnit?: string
}


export type Supplier = {
  _id: string

  supplierId?: string

  supplierProductId: string

  name: string

  supplierType:
  | "importer"
  | "distributor"
  | "retailer"

  price: number

  stock: number

  minOrderQuantity: number

  maxOrderQuantity?: number | null

  email?: string

  verified?: boolean

  rating?: number

  responseRate?: number

  fulfillmentRate?: number

  phone?: string

  address?: string

  license?: string

  salesUnit?:
  | "carton"
  | "pack"
  | "unit"

  createdAt?: string

  supplierProfile?: {
    businessName?: string
    logo?: string
  }

  score?: number

  rank?: number

  reasons?: string[]

  recommendation?: {
    isRecommended: boolean
    confidence: number
    badges: string[]
  }
}


export type MarketplaceSupplier = Supplier & {
  supplierProductId: string
  email?: string
  verified?: boolean
  rating?: number
  logo?: string
  phone?: string
  address?: string
  license?: string
  salesUnit?: string
}


export type DeliveryDetails = {
  contactName: string;
  phone: string;
  address: string;
  deliveryDate?: string;
  notes?: string;
};


export type ProductCatalogItem = {
  _id: string
  name: string
  category: string
}

export type SupplierInventoryItem = {
  _id: string

  product: {
    _id: string
    name: string
    category: string
  }

  supplierType:
  | "importer"
  | "distributor"
  | "retailer"

  salesUnit:
  | "unit"
  | "pack"
  | "carton"

  stock: number

  minOrderQuantity: number

  reorderLevel: number

  basePrice: number

  commissionPercent: number

  commissionAmount: number

  finalPrice: number

  status:
  | "available"
  | "low"
  | "out"
  | "on-request"

  warehouseLocation?: string

  batchInfo: {
    batchNumber?: string
    nafdacNumber?: string
    expiryDate?: string
    manufacturingDate?: string
  }

  verificationImages: {
    url: string
    label: string
  }[]

  createdAt: string
}



export const inventorySchema = z.object({
  id: z.string(),
  productId: z.string(),
  name: z.string(),
  category: z.string(),
  nafdacNumber: z.string().optional(),
  batchInfo: z.object({
    batchNumber: z.string().optional(),
    expiryDate: z.date().optional(),
    manufacturingDate: z.date().optional(),
  }).optional(),
  type: z.enum(["IMPORTER", "DISTRIBUTOR"]),
  unit: z.string(),
  basePrice: z.number(),
  commission: z.number(),
  finalPrice: z.number(),
  stock: z.number(),
  moq: z.number(),
})

export type InventoryProduct = z.infer<typeof inventorySchema>

export interface NotificationPreferences {
  emailOrders: boolean;
  smsAlerts: boolean;
  coldChainExcursions: boolean;
  walletUpdates: boolean;
  weeklyDigest: boolean;
}

export interface ProfileFormData {
  name: string;
  email: string;
  phone: string;
  emergencyContact: string;
  designation: string;
  organization: string;
  address: string;
  state: string;
  lga: string;
  facilityType: string;

  // Buyer fields
  bedCapacity: number;
  receivingHours: string;
  backupPowerSpec: string;
  coldChainCapacityM3: number;
  licenseNumber: string;

  // Supplier fields
  nafdacGdpLicense: string;
  pcnPremisesLicense: string;
  taxIdentificationNumber: string;
  settlementBankName: string;
  settlementAccountNumber: string;
  settlementAccountName: string;

  // Pharmacist fields
  pharmacistLicense: string;
  annualPracticingLicenseNo: string;
  pharmacistCadre: string;

  // Admin fields
  adminClearanceTier: string;

  // Security
  twoFactorEnabled: boolean;

  // Alerts
  notificationPreferences: NotificationPreferences;
}
