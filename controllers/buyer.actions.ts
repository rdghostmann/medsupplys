"use server";

import { getServerSession } from "next-auth";

import { connectToDB } from "@/lib/connectToDB";
import { User } from "@/models/User";
import { Wallet } from "@/models/Wallet";
import { CreditAccount } from "@/models/CreditAccount";
import { Order } from "@/models/Order";
import { Procurement } from "@/models/Procurement";
import { authOptions } from "@/auth";
import type { Order as BuyerOrder } from "@/types";

// IMPORTANT:
// Change this import path if your NextAuth configuration
// is located somewhere else.
// import { authOptions } from "@/lib/auth";

/* ============================================================
   TYPES
============================================================ */

export interface CurrentBuyerUser {
  id: string;
  username: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  organization?: string;
  phone?: string;
  address?: string;
  role: string;
  status: string;
}

export interface CurrentBuyerWallet {
  id: string;
  buyerId: string;
  buyerName: string;
  balance: number;
  currency: "NGN";
  status: "ACTIVE" | "FROZEN" | "SUSPENDED" | "CLOSED";
  createdAt: string;
  updatedAt: string;
}

export interface CurrentBuyerCreditAccount {
  id: string;
  buyerId: string;
  buyerName: string;
  creditLimit: number;
  availableCredit: number;
  creditUsed: number;
  outstandingBalance: number;
  status: string;
  ratingTier: string;
  approvedAt?: string;
  dueDate?: string;
  terms: string;
  interestRatePercent: number;
  createdAt: string;
  updatedAt: string;
}

export interface CurrentBuyerProcurement {
  id: string;
  procurementNumber: string;
  productName: string;
  quantity: number;
  unit: string;
  totalAmount: number;
  status: string;
  currentSupplierName: string;
  currentSupplierIndex: number;
  attemptHistory: {
    supplierName: string;
    supplierIndex: number;
    status: string;
    attemptedAt?: string;
  }[];
}

export interface BuyerDashboardData {
  user: CurrentBuyerUser | null;
  wallet: CurrentBuyerWallet | null;
  creditAccount: CurrentBuyerCreditAccount | null;
  orders: BuyerOrder[];
  fallbackQueue: CurrentBuyerProcurement[];
  nonCompletedOrderCount: number;
  totalOrderCount: number;
}

/* ============================================================
   GET CURRENT BUYER DASHBOARD DATA
============================================================ */

export async function getCurrentBuyerDashboard(): Promise<BuyerDashboardData> {
  /**
   * ----------------------------------------------------------
   * 1. GET CURRENT NEXTAUTH SESSION
   * ----------------------------------------------------------
   */

  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return {
      user: null,
      wallet: null,
      creditAccount: null,
      orders: [],
      fallbackQueue: [],
      nonCompletedOrderCount: 0,
      totalOrderCount: 0,
    };
  }

  /**
   * ----------------------------------------------------------
   * 2. CONNECT TO DATABASE
   * ----------------------------------------------------------
   */

  await connectToDB();

  /**
   * ----------------------------------------------------------
   * 3. GET CURRENT USER
   * ----------------------------------------------------------
   *
   * We resolve the actual MongoDB User document instead of
   * trusting all session fields.
   */

  const user = await User.findOne({
    email: session.user.email,
  })
    .select(
      [
        "_id",
        "username",
        "firstName",
        "lastName",
        "email",
        "organizationName",
        "phone",
        "address",
        "role",
        "status",
      ].join(" ")
    )
    .lean();

  if (!user) {
    return {
      user: null,
      wallet: null,
      creditAccount: null,
      orders: [],
      fallbackQueue: [],
      nonCompletedOrderCount: 0,
      totalOrderCount: 0,
    };
  }

  /**
   * ----------------------------------------------------------
   * 4. VERIFY BUYER ROLE
   * ----------------------------------------------------------
   */

  if (user.role !== "buyer") {
    return {
      user: null,
      wallet: null,
      creditAccount: null,
      orders: [],
      fallbackQueue: [],
      nonCompletedOrderCount: 0,
      totalOrderCount: 0,
    };
  }

  if (!user.username) {
    return {
      user: null,
      wallet: null,
      creditAccount: null,
      orders: [],
      fallbackQueue: [],
      nonCompletedOrderCount: 0,
      totalOrderCount: 0,
    };
  }

  /**
   * ----------------------------------------------------------
   * 5. NORMALIZE USER FOR CLIENT COMPONENT
   * ----------------------------------------------------------
   */

  const firstName = user.firstName || "";
  const lastName = user.lastName || "";

  const name =
    `${firstName} ${lastName}`.trim() ||
    session.user.name ||
    user.username ||
    "Buyer";

  const currentUser: CurrentBuyerUser = {
    id: user._id.toString(),

    username: user.username,

    name,

    firstName,

    lastName,

    email: user.email,

    organization:  user.organizationName,

    phone: user.phone,

    address: user.address,

    role: user.role,

    status: user.status,
  };

  /**
   * ----------------------------------------------------------
   * 6. GET BUYER WALLET
   * ----------------------------------------------------------
   *
   * Wallet.buyerId is a MongoDB ObjectId that references User.
   *
   * Therefore:
   *
   * User._id
   *    ↓
   * Wallet.buyerId
   */

  const wallet = await Wallet.findOne({
    buyerId: user._id,
  })
    .select(
      [
        "_id",
        "buyerId",
        "buyerName",
        "balance",
        "currency",
        "status",
        "createdAt",
        "updatedAt",
      ].join(" ")
    )
    .lean();

  /**
   * ----------------------------------------------------------
   * 7. NORMALIZE WALLET FOR CLIENT COMPONENT
   * ----------------------------------------------------------
   *
   * Dates are converted to strings because the result will be
   * passed from a Server Component to a Client Component.
   */

  const currentWallet: CurrentBuyerWallet | null =
    wallet
      ? {
          id: wallet._id.toString(),

          buyerId:
            wallet.buyerId.toString(),

          buyerName:
            wallet.buyerName,

          balance:
            Number(wallet.balance || 0),

          currency:
            wallet.currency,

          status:
            wallet.status,

          createdAt:
            wallet.createdAt.toISOString(),

          updatedAt:
            wallet.updatedAt.toISOString(),
        }
      : null;

  const creditAccount = await CreditAccount.findOne()
    .where("buyerId")
    .equals(user._id.toString())
    .select(
      [
        "_id",
        "buyerId",
        "buyerName",
        "creditLimit",
        "availableCredit",
        "creditUsed",
        "outstandingBalance",
        "status",
        "ratingTier",
        "approvedAt",
        "dueDate",
        "terms",
        "interestRatePercent",
        "createdAt",
        "updatedAt",
      ].join(" ")
    )
    .lean();

  const currentCreditAccount: CurrentBuyerCreditAccount | null =
    creditAccount
      ? {
          id: creditAccount._id.toString(),
          buyerId: creditAccount.buyerId.toString(),
          buyerName: creditAccount.buyerName,
          creditLimit: Number(creditAccount.creditLimit || 0),
          availableCredit: Number(creditAccount.availableCredit || 0),
          creditUsed: Number(creditAccount.creditUsed || 0),
          outstandingBalance: Number(
            creditAccount.outstandingBalance || 0
          ),
          status: creditAccount.status,
          ratingTier: creditAccount.ratingTier,
          approvedAt: creditAccount.approvedAt?.toISOString(),
          dueDate: creditAccount.dueDate?.toISOString(),
          terms: creditAccount.terms,
          interestRatePercent: Number(
            creditAccount.interestRatePercent || 0
          ),
          createdAt: creditAccount.createdAt.toISOString(),
          updatedAt: creditAccount.updatedAt.toISOString(),
        }
      : null;

  const buyerOrders = await Order.find()
    .where("buyerId")
    .equals(user._id.toString())
    .sort({ createdAt: -1 })
    .lean();

  const totalOrderCount = buyerOrders.length;

  const nonCompletedOrderCount = buyerOrders.filter(
    (order) => order.status !== "COMPLETED"
  ).length;

  const orders: BuyerOrder[] = buyerOrders.map((order) => {
    const firstItem = order.items[0];

    return {
      id: order._id.toString(),
      product: firstItem?.name || "",
      buyer: order.buyerName,
      qty: firstItem?.quantity || 0,
      basePrice: firstItem?.unitPrice || 0,
      status: order.status,
      date: order.createdAt.toISOString(),
      supplier: order.supplierName,
      orderNumber: order.orderNumber,
      procurementId: order.procurementId.toString(),
      buyerId: order.buyerId.toString(),
      buyerName: order.buyerName,
      supplierId: order.supplierId.toString(),
      supplierName: order.supplierName,
      supplierType: order.supplierType as BuyerOrder["supplierType"],
      items: order.items.map((item) => ({
        productId: item.productId.toString(),
        supplierProductId: item.supplierProductId.toString(),
        name: item.name,
        unit: item.unit,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subtotal: item.subtotal,
        batchNumber: item.batchNumber,
        expiryDate: item.expiryDate.toISOString(),
      })),
      subtotal: order.subtotal,
      commission: order.commission,
      total: order.total,
      paymentMethod: order.paymentMethod,
      walletAmount: order.walletAmount,
      creditAmount: order.creditAmount,
      deliveryAddress: order.deliveryAddress,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
    };
  });

  const buyerProcurements = await Procurement.find()
    .where("buyerId")
    .equals(user._id.toString())
    .sort({ createdAt: -1 })
    .lean();

  const fallbackQueue: CurrentBuyerProcurement[] = buyerProcurements
    .filter((procurement) => {
      const status = procurement.status.toUpperCase();

      return ![
        "COMPLETED",
        "REJECTED",
        "CANCELLED",
        "EXPIRED",
      ].includes(status);
    })
    .map(
      (procurement) => ({
      id: procurement._id.toString(),
      procurementNumber: procurement.procurementNumber,
      productName: procurement.items[0]?.productName || "",
      quantity: procurement.items[0]?.quantity || 0,
      unit: procurement.items[0]?.unit || "",
      totalAmount: procurement.supplierCandidates.reduce(
        (total, candidate) =>
          Math.max(total, candidate.totalPrice),
        0
      ),
      status: procurement.status,
      currentSupplierName:
        procurement.currentSupplierName || "Supplier pending",
      currentSupplierIndex: procurement.currentSupplierIndex,
      attemptHistory: procurement.attemptHistory.map((attempt) => ({
        supplierName: attempt.supplierName,
        supplierIndex: attempt.attemptNumber - 1,
        status: attempt.status,
        attemptedAt: attempt.contactedAt?.toISOString(),
      })),
      })
    );

  /**
   * ----------------------------------------------------------
   * 8. RETURN SERIALIZABLE DATA
   * ----------------------------------------------------------
   */

  return {
    user: currentUser,
    wallet: currentWallet,
    creditAccount: currentCreditAccount,
    orders,
    fallbackQueue,
    nonCompletedOrderCount,
    totalOrderCount,
  };
}