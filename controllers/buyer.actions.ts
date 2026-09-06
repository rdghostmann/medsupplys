"use server";

import { getServerSession } from "next-auth";

import { connectToDB } from "@/lib/connectToDB";
import { User } from "@/models/User";
import { Wallet } from "@/models/Wallet";
import { CreditAccount } from "@/models/CreditAccount";
import { Order } from "@/models/Order";
import { authOptions } from "@/auth";

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

export interface BuyerDashboardData {
  user: CurrentBuyerUser | null;
  wallet: CurrentBuyerWallet | null;
  creditAccount: CurrentBuyerCreditAccount | null;
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
      nonCompletedOrderCount: 0,
      totalOrderCount: 0,
    };
  }

  if (!user.username) {
    return {
      user: null,
      wallet: null,
      creditAccount: null,
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

  const totalOrderCount = await Order.countDocuments()
    .where("buyerId")
    .equals(user._id.toString());

  const nonCompletedOrderCount =
    await Order.countDocuments()
      .where("buyerId")
      .equals(user._id.toString())
      .where("status")
      .ne("COMPLETED");

  /**
   * ----------------------------------------------------------
   * 8. RETURN SERIALIZABLE DATA
   * ----------------------------------------------------------
   */

  return {
    user: currentUser,
    wallet: currentWallet,
    creditAccount: currentCreditAccount,
    nonCompletedOrderCount,
    totalOrderCount,
  };
}