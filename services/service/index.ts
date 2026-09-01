export type UserRole = 'BUYER' | 'SUPPLIER' | 'PHARMACIST' | 'ADMIN';

export type SupplierType = 'IMPORTER' | 'DISTRIBUTOR' | 'RETAILER';

export type SupplierApprovalStatus = 'PENDING' | 'APPROVED' | 'SUSPENDED' | 'REJECTED';

export type InventoryStatus = 'AVAILABLE' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'ON_REQUEST' | 'EXPIRED' | 'SUSPENDED';

export type ProcurementStatus =
  | 'PENDING'
  | 'SUPPLIER_MATCHING'
  | 'SUPPLIER_ASSIGNED'
  | 'SUPPLIER_CONTACTED'
  | 'SUPPLIER_CONFIRMED'
  | 'SUPPLIER_UNAVAILABLE'
  | 'NEXT_SUPPLIER_PENDING'
  | 'BUYER_ACTION_REQUIRED'
  | 'PAYMENT_PENDING'
  | 'PAYMENT_CONFIRMED'
  | 'VERIFICATION'
  | 'PROCESSING'
  | 'READY_FOR_DISPATCH'
  | 'DISPATCHED'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'FAILED'
  | 'REFUNDED';

export type PaymentMethod = 'WALLET' | 'CREDIT' | 'WALLET_AND_CREDIT';

export type WalletTransactionType =
  | 'TOPUP'
  | 'PURCHASE'
  | 'REFUND'
  | 'CREDIT_PURCHASE'
  | 'CREDIT_REPAYMENT'
  | 'ADJUSTMENT';

export type TransactionDirection = 'CREDIT' | 'DEBIT';

export type TransactionStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'REVERSED';

export type CreditStatus = 'PENDING' | 'APPROVED' | 'ACTIVE' | 'SUSPENDED' | 'DEFAULTED' | 'CLOSED';

export type VerificationResult = 'APPROVED' | 'FLAGGED' | 'REJECTED';

export type ProductCategory =
  | 'ANTIBIOTICS'
  | 'ANTIMALARIALS'
  | 'ANALGESICS'
  | 'CARDIOVASCULAR'
  | 'DIABETES'
  | 'IV_FLUIDS'
  | 'CRITICAL_CARE'
  | 'VACCINES'
  | 'OTHER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organization?: string;
  phone?: string;
  address?: string;
  supplierType?: SupplierType;
  supplierApprovalStatus?: SupplierApprovalStatus;
  licenseNumber?: string;
  pharmacistLicense?: string;
  avatar?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  activeIngredient: string;
  strength: string;
  dosageForm: string;
  unit: string;
  packSize: string;
  nafdacRegNumber: string;
  referenceBasePrice: number;
  commissionPercent: number; // e.g. 10
  maxMarkupPercent: number;
  status: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
  storageCondition: string;
  emoji: string;
  createdAt: string;
}

export interface SupplierProduct {
  id: string;
  productId: string;
  productName: string;
  supplierId: string;
  supplierName: string;
  supplierType: SupplierType;
  basePrice: number;
  commission: number;
  finalPrice: number;
  stock: number;
  minOrderQuantity: number;
  maxOrderQuantity: number;
  unit: string;
  batchNumber: string;
  expiryDate: string;
  manufacturingDate: string;
  status: InventoryStatus;
  isFlagged: boolean;
  flagReason?: string;
  rating: number;
  fulfillmentRate: number; // e.g. 98.5
  estimatedDeliveryDays: number;
  createdAt: string;
  updatedAt: string;
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
  status: 'CONTACTED' | 'ACCEPTED' | 'REJECTED' | 'UNAVAILABLE' | 'TIMED_OUT' | 'PARTIAL';
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
  status: 'QUEUED' | 'ACTIVE' | 'ACCEPTED' | 'REJECTED' | 'SKIPPED';
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

export interface Order {
  id: string;
  orderNumber: string;
  procurementId: string;
  buyerId: string;
  buyerName: string;
  supplierId: string;
  supplierName: string;
  supplierType: SupplierType;
  items: OrderItem[];
  subtotal: number;
  commission: number;
  total: number;
  paymentMethod: PaymentMethod;
  walletAmount: number;
  creditAmount: number;
  status: ProcurementStatus;
  deliveryAddress: string;
  batchNumber: string;
  expiryDate: string;
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
  trackingUpdates: {
    status: ProcurementStatus;
    title: string;
    description: string;
    timestamp: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface Wallet {
  id: string;
  buyerId: string;
  buyerName: string;
  balance: number;
  currency: 'NGN';
  status: 'ACTIVE' | 'SUSPENDED' | 'FROZEN';
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
  terms: string; // e.g. "Net 30 Days"
  interestRatePercent: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreditTransaction {
  id: string;
  creditAccountId: string;
  buyerId: string;
  type: 'CREDIT_PURCHASE' | 'CREDIT_REPAYMENT' | 'LIMIT_ADJUSTMENT';
  amount: number;
  direction: 'CHARGE' | 'REPAYMENT';
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
  recipientRole: UserRole | 'ALL';
  title: string;
  message: string;
  type: 'ORDER' | 'WALLET' | 'CREDIT' | 'VERIFICATION' | 'SUPPLIER' | 'SYSTEM';
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export interface MatchingWeights {
  availabilityWeight: number; // 25
  priceWeight: number;        // 35
  supplierTypeWeight: number; // 20 (Importer > Distributor > Retailer)
  fulfillmentWeight: number;  // 10
  reliabilityWeight: number;  // 10
}

export interface PlatformConfig {
  defaultCommissionPercent: number;
  matchingWeights: MatchingWeights;
  minCreditApprovalLimit: number;
  maxCreditApprovalLimit: number;
  autoAdvanceSupplierTimeoutSeconds: number;
}
