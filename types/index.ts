// types/index.ts
export type SupplierType = "importer" | "distributor" | "retailer"
export type Role = "buyer" | "supplier" | "admin"
export type OrganizationType = "manufacturer" | "distributor" | "wholesaler" | "pharmacy"
export type UnitType = "unit" | "pack" | "carton"

export type UnitConfig = {
  type: UnitType
  unitsPerBase: number
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
