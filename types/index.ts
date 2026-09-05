// types/index.ts
import { z } from "zod"

export type UserRole = "BUYER" | "SUPPLIER" | "PHARMACIST" | "ADMIN"
export type SupplierType =
    | "importer"
    | "distributor"
    | "retailer"
    | "IMPORTER"
    | "DISTRIBUTOR"
    | "RETAILER"
export type SupplierApprovalStatus = "PENDING" | "APPROVED" | "SUSPENDED" | "REJECTED"
export type InventoryStatus =
    | "AVAILABLE"
    | "LOW_STOCK"
    | "OUT_OF_STOCK"
    | "ON_REQUEST"
    | "EXPIRED"
    | "SUSPENDED"
export type ProcurementStatus =
    | "PENDING"
    | "SUPPLIER_MATCHING"
    | "SUPPLIER_ASSIGNED"
    | "SUPPLIER_CONTACTED"
    | "SUPPLIER_CONFIRMED"
    | "SUPPLIER_UNAVAILABLE"
    | "NEXT_SUPPLIER_PENDING"
    | "BUYER_ACTION_REQUIRED"
    | "PAYMENT_PENDING"
    | "PAYMENT_CONFIRMED"
    | "VERIFICATION"
    | "PROCESSING"
    | "READY_FOR_DISPATCH"
    | "DISPATCHED"
    | "IN_TRANSIT"
    | "DELIVERED"
    | "COMPLETED"
    | "CANCELLED"
    | "FAILED"
    | "REFUNDED"
export type PaymentMethod = "WALLET" | "CREDIT" | "WALLET_AND_CREDIT"
export type WalletTransactionType =
    | "TOPUP"
    | "PURCHASE"
    | "REFUND"
    | "CREDIT_PURCHASE"
    | "CREDIT_REPAYMENT"
    | "ADJUSTMENT"
export type TransactionDirection = "CREDIT" | "DEBIT"
export type TransactionStatus = "PENDING" | "SUCCESS" | "FAILED" | "REVERSED"
export type CreditStatus = "PENDING" | "APPROVED" | "ACTIVE" | "SUSPENDED" | "DEFAULTED" | "CLOSED"
export type VerificationResult = "APPROVED" | "FLAGGED" | "REJECTED"
export type ProductCategory =
    | "ANTIBIOTICS"
    | "ANTIMALARIALS"
    | "ANALGESICS"
    | "CARDIOVASCULAR"
    | "DIABETES"
    | "IV_FLUIDS"
    | "CRITICAL_CARE"
    | "VACCINES"
    | "OTHER"
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
    | "Rejected"
    | ProcurementStatus;

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
    orderNumber?: string;
    procurementId?: string;
    buyerId?: string;
    buyerName?: string;
    supplierId?: string;
    supplierName?: string;
    supplierType?: SupplierType;
    items?: OrderItem[];
    subtotal?: number;
    commission?: number;
    total?: number;
    paymentMethod?: PaymentMethod;
    walletAmount?: number;
    creditAmount?: number;
    deliveryAddress?: string;
    pharmacistVerification?: {
        verifiedBy: string;
        verifiedByName: string;
        result: VerificationResult;
        batchValid: boolean;
        expiryValid: boolean;
        sealIntact: boolean;
        storageCompliant: boolean;
        notes: string;
        verifiedAt: string;
    };
    trackingUpdates?: {
        status: ProcurementStatus;
        title: string;
        description: string;
        timestamp: string;
    }[];
    createdAt?: string;
    updatedAt?: string;
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

export interface UserNotificationPreferences {
    emailOrders: boolean;
    smsAlerts: boolean;
    coldChainExcursions: boolean;
    walletUpdates: boolean;
    weeklyDigest: boolean;
}

export interface SupplierScoreBreakdown {
    supplierId: string;
    supplierName: string;
    supplierType: SupplierType;
    basePrice: number;
    finalPrice: number;
    stock: number;
    moq: number;
    rating: number;
    fulfillmentRate: number;
    deliveryDays: number;
    availabilityScore: number;
    priceScore: number;
    supplierTypeScore: number;
    fulfillmentScore: number;
    reliabilityScore: number;
    totalScore: number;
    isEligible: boolean;
    ineligibilityReason?: string;
}

export interface SupplierAttemptHistory {
    attemptNumber: number;
    supplierId: string;
    supplierName: string;
    supplierType: SupplierType;
    offeredPrice: number;
    status: "CONTACTED" | "ACCEPTED" | "REJECTED" | "UNAVAILABLE" | "TIMED_OUT" | "PARTIAL";
    responseNote?: string;
    contactedAt: string;
    respondedAt?: string;
    reason?: string;
}

export interface ProcurementQueueItem {
    supplierId: string;
    supplierName: string;
    supplierType: SupplierType;
    unitPrice: number;
    totalPrice: number;
    stock: number;
    rank: number;
    score: number;
    status: "QUEUED" | "ACTIVE" | "ACCEPTED" | "REJECTED" | "SKIPPED";
}

export interface Procurement {
    id: string;
    procurementNumber: string;
    buyerId: string;
    buyerName: string;
    productId: string;
    productName: string;
    unit: string;
    quantity: number;
    targetMaxUnitPrice?: number;
    status: ProcurementStatus;
    paymentMethod: PaymentMethod;
    walletAmount: number;
    creditAmount: number;
    totalAmount: number;
    platformCommission: number;
    supplierQueue: ProcurementQueueItem[];
    currentSupplierIndex: number;
    currentSupplierId: string;
    currentSupplierName: string;
    attemptHistory: SupplierAttemptHistory[];
    deliveryAddress: string;
    associatedOrderId?: string;
    createdAt: string;
    updatedAt: string;
}

export interface OrderItem {
    productId: string;
    supplierProductId: string;
    name: string;
    unit: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    batchNumber?: string;
    expiryDate?: string;
}

export interface Wallet {
    id: string;
    buyerId: string;
    buyerName: string;
    balance: number;
    currency: "NGN";
    status: "ACTIVE" | "SUSPENDED" | "FROZEN";
    createdAt: string;
    updatedAt: string;
}

export interface WalletTransaction {
    id: string;
    walletId: string;
    buyerId: string;
    type: WalletTransactionType;
    amount: number;
    direction: TransactionDirection;
    balanceBefore: number;
    balanceAfter: number;
    reference: string;
    description: string;
    status: TransactionStatus;
    metadata?: Record<string, any>;
    createdAt: string;
}

export interface CreditAccount {
    id: string;
    buyerId: string;
    buyerName: string;
    creditLimit: number;
    availableCredit: number;
    creditUsed: number;
    outstandingBalance: number;
    status: CreditStatus;
    approvedBy: string;
    approvedAt: string;
    dueDate: string;
    terms: string;
    interestRatePercent: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreditTransaction {
    id: string;
    creditAccountId: string;
    buyerId: string;
    type: "CREDIT_PURCHASE" | "CREDIT_REPAYMENT" | "LIMIT_ADJUSTMENT";
    amount: number;
    direction: "CHARGE" | "REPAYMENT";
    balanceBefore: number;
    balanceAfter: number;
    reference: string;
    orderId?: string;
    description: string;
    createdAt: string;
}

export interface AuditLog {
    id: string;
    actorId: string;
    actorName: string;
    actorRole: UserRole;
    action: string;
    entity: string;
    entityId: string;
    oldValue?: string;
    newValue?: string;
    details: string;
    ipAddress: string;
    timestamp: string;
}

export interface Notification {
    id: string;
    recipientId: string;
    recipientRole: UserRole | "ALL";
    title: string;
    message: string;
    type: "ORDER" | "WALLET" | "CREDIT" | "VERIFICATION" | "SUPPLIER" | "SYSTEM";
    isRead: boolean;
    link?: string;
    createdAt: string;
}

export interface MatchingWeights {
    availabilityWeight: number;
    priceWeight: number;
    supplierTypeWeight: number;
    fulfillmentWeight: number;
    reliabilityWeight: number;
}

export interface PlatformConfig {
    defaultCommissionPercent: number;
    matchingWeights: MatchingWeights;
    minCreditApprovalLimit: number;
    maxCreditApprovalLimit: number;
    autoAdvanceSupplierTimeoutSeconds: number;
}
