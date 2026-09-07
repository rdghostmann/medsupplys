// /app/api/admin/seed-wallet/route.ts

import { NextResponse } from "next/server";
import { Types } from "mongoose";
import { connectToDB } from "@/lib/connectToDB";
import { Wallet, type IWallet } from "@/models/Wallet";
import { User } from "@/models/User";

const SEEDED_BUYER = {
  buyerId: "6a9cb82d853e785e43c110b8",
  buyerName: "Lagos University Teaching Hospital (LUTH)",

  currency: "NGN" as const,

  availableBalance: 2_000_000,
  heldBalance: 0,

  totalDeposited: 5_000_000,
  totalSpent: 3_000_000,

  totalRefunded: 0,
  totalReversed: 0,

  status: "ACTIVE" as const,
};

type WalletForSerialization = Pick<
  IWallet,
  | "_id"
  | "buyerId"
  | "buyerName"
  | "currency"
  | "availableBalance"
  | "heldBalance"
  | "totalDeposited"
  | "totalSpent"
  | "totalRefunded"
  | "totalReversed"
  | "status"
  | "createdAt"
  | "updatedAt"
>;

function serializeWallet(
  wallet: WalletForSerialization
) {
  return {
    _id: wallet._id?.toString(),

    buyerId: wallet.buyerId?.toString(),

    buyerName: String(wallet.buyerName ?? ""),

    currency: String(wallet.currency ?? "NGN"),

    availableBalance: Number(wallet.availableBalance ?? 0),

    heldBalance: Number(wallet.heldBalance ?? 0),

    totalDeposited: Number(wallet.totalDeposited ?? 0),

    totalSpent: Number(wallet.totalSpent ?? 0),

    totalRefunded: Number(wallet.totalRefunded ?? 0),

    totalReversed: Number(wallet.totalReversed ?? 0),

    status: wallet.status,

    createdAt: wallet.createdAt
      ? new Date(wallet.createdAt).toISOString()
      : null,

    updatedAt: wallet.updatedAt
      ? new Date(wallet.updatedAt).toISOString()
      : null,
  };
}

export async function POST() {
  try {
    await connectToDB();

    // ---------------------------------------------------------
    // 1. Validate Buyer ID
    // ---------------------------------------------------------

    if (!Types.ObjectId.isValid(SEEDED_BUYER.buyerId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid buyer ID.",
          buyerId: SEEDED_BUYER.buyerId,
        },
        { status: 400 }
      );
    }

    const buyerObjectId = new Types.ObjectId(
      SEEDED_BUYER.buyerId
    );

    // ---------------------------------------------------------
    // 2. Verify Buyer
    // ---------------------------------------------------------

    const buyer = await User.findById(buyerObjectId).select(
      "_id fullName role email"
    );

    if (!buyer) {
      return NextResponse.json(
        {
          success: false,
          message: "Buyer user was not found.",
          buyerId: SEEDED_BUYER.buyerId,
        },
        { status: 404 }
      );
    }

    // Your User model uses lowercase roles.
    if (buyer.role !== "buyer") {
      return NextResponse.json(
        {
          success: false,
          message: "The selected user is not a buyer.",
          buyerId: SEEDED_BUYER.buyerId,
          role: buyer.role,
        },
        { status: 400 }
      );
    }

    // ---------------------------------------------------------
    // 3. Check Existing Wallet
    // ---------------------------------------------------------

    const existingWallet = await Wallet.findOne({
      buyerId: buyerObjectId,
    }).lean();

    if (existingWallet) {
      const serializedWallet =
        serializeWallet(existingWallet);

      return NextResponse.json({
        success: true,
        seeded: false,
        alreadyExists: true,
        message: "Buyer wallet already exists.",
        wallet: serializedWallet,
      });
    }

    // ---------------------------------------------------------
    // 4. Validate Wallet Arithmetic
    // ---------------------------------------------------------

    const calculatedAvailableBalance =
      SEEDED_BUYER.totalDeposited -
      SEEDED_BUYER.totalSpent +
      SEEDED_BUYER.totalRefunded +
      SEEDED_BUYER.totalReversed -
      SEEDED_BUYER.heldBalance;

    if (
      calculatedAvailableBalance !==
      SEEDED_BUYER.availableBalance
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid wallet seed configuration.",

          calculation: {
            totalDeposited:
              SEEDED_BUYER.totalDeposited,

            totalSpent:
              SEEDED_BUYER.totalSpent,

            totalRefunded:
              SEEDED_BUYER.totalRefunded,

            totalReversed:
              SEEDED_BUYER.totalReversed,

            heldBalance:
              SEEDED_BUYER.heldBalance,

            calculatedAvailableBalance,
            configuredAvailableBalance:
              SEEDED_BUYER.availableBalance,
          },
        },
        { status: 400 }
      );
    }

    // ---------------------------------------------------------
    // 5. Create Wallet
    // ---------------------------------------------------------

    const wallet = await Wallet.create({
      buyerId: buyerObjectId,

      buyerName: SEEDED_BUYER.buyerName,

      currency: SEEDED_BUYER.currency,

      availableBalance:
        Number(SEEDED_BUYER.availableBalance),

      heldBalance:
        Number(SEEDED_BUYER.heldBalance),

      totalDeposited:
        Number(SEEDED_BUYER.totalDeposited),

      totalSpent:
        Number(SEEDED_BUYER.totalSpent),

      totalRefunded:
        Number(SEEDED_BUYER.totalRefunded),

      totalReversed:
        Number(SEEDED_BUYER.totalReversed),

      status: SEEDED_BUYER.status,
    });

    // ---------------------------------------------------------
    // 6. Re-fetch as Plain Object
    // ---------------------------------------------------------

    const createdWallet = await Wallet.findById(
      wallet._id
    ).lean();

    if (!createdWallet) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Wallet was created but could not be retrieved.",
        },
        { status: 500 }
      );
    }

    const serializedWallet =
      serializeWallet(createdWallet);

    // ---------------------------------------------------------
    // 7. Final Response
    // ---------------------------------------------------------

    return NextResponse.json(
      {
        success: true,

        seeded: true,

        alreadyExists: false,

        message:
          "Buyer wallet seeded successfully.",

        wallet: serializedWallet,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error(
      "SEED_WALLET_ERROR:",
      error
    );

    // Duplicate buyer wallet
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === 11000
    ) {
      const existingWallet = await Wallet.findOne({
        buyerId: new Types.ObjectId(
          SEEDED_BUYER.buyerId
        ),
      }).lean();

      return NextResponse.json(
        {
          success: true,

          seeded: false,

          alreadyExists: true,

          message:
            "A wallet already exists for this buyer.",

          wallet: existingWallet
            ? serializeWallet(existingWallet)
            : null,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: false,

        message:
          "Failed to seed buyer wallet.",

        error:
          error instanceof Error
            ? error.message
            : "Unknown server error",
      },
      { status: 500 }
    );
  }
}