// /app/api/admin/seed-wallet/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/connectToDB";
import { Wallet } from "@/models/Wallet";
import { User } from "@/models/User";
import { Types } from "mongoose";

const SEEDED_BUYER = {
  buyerId: "6a9cb82d853e785e43c110b8",
  buyerName: "Lagos University Teaching Hospital (LUTH)",
  availableBalance: 1_450_000,
};

export async function POST(req: NextRequest) {
  try {
    await connectToDB();

    const buyerObjectId = new Types.ObjectId(SEEDED_BUYER.buyerId);

    // ---------------------------------------------------------
    // 1. Verify that the buyer exists
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

    // ---------------------------------------------------------
    // 2. Make sure the selected user is a BUYER
    // ---------------------------------------------------------
    if (buyer.role !== "buyer") {
      return NextResponse.json(
        {
          success: false,
          message: "The selected user is not a BUYER.",
          buyerId: SEEDED_BUYER.buyerId,
          role: buyer.role,
        },
        { status: 400 }
      );
    }

    // ---------------------------------------------------------
    // 3. Check whether wallet already exists
    // ---------------------------------------------------------
    const existingWallet = await Wallet.findOne({
      buyerId: buyerObjectId,
    });

    if (existingWallet) {
      return NextResponse.json(
        {
          success: true,
          seeded: false,
          alreadyExists: true,
          message: "Buyer wallet already exists.",
          wallet: {
            _id: existingWallet._id,
            buyerId: existingWallet.buyerId,
            buyerName: existingWallet.buyerName,
            currency: existingWallet.currency,
            availableBalance: existingWallet.availableBalance,
            heldBalance: existingWallet.heldBalance,
            totalDeposited: existingWallet.totalDeposited,
            totalSpent: existingWallet.totalSpent,
            totalRefunded: existingWallet.totalRefunded,
            totalReversed: existingWallet.totalReversed,
            status: existingWallet.status,
            createdAt: existingWallet.createdAt,
            updatedAt: existingWallet.updatedAt,
          },
        },
        { status: 200 }
      );
    }

    // ---------------------------------------------------------
    // 4. Create wallet
    // ---------------------------------------------------------
    const wallet = await Wallet.create({
      buyerId: buyerObjectId,

      buyerName: SEEDED_BUYER.buyerName,

      currency: "NGN",

      availableBalance: 2000000,

      heldBalance: 0,

      totalDeposited: 5000000,

      totalSpent: 3000000,

      totalRefunded: 0,

      totalReversed: 0,

      status: "ACTIVE",
    });

    // ---------------------------------------------------------
    // 5. Return seeded wallet
    // ---------------------------------------------------------
    return NextResponse.json(
      {
        success: true,
        seeded: true,
        alreadyExists: false,
        message: "Buyer wallet seeded successfully.",

        wallet: {
          _id: wallet._id,
          buyerId: wallet.buyerId,
          buyerName: wallet.buyerName,
          currency: wallet.currency,
          availableBalance: wallet.availableBalance,
          heldBalance: wallet.heldBalance,
          totalDeposited: wallet.totalDeposited,
          totalSpent: wallet.totalSpent,
          totalRefunded: wallet.totalRefunded,
          totalReversed: wallet.totalReversed,
          status: wallet.status,
          createdAt: wallet.createdAt,
          updatedAt: wallet.updatedAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("SEED_WALLET_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to seed buyer wallet.",
        error:
          error instanceof Error
            ? error.message
            : "Unknown server error",
      },
      { status: 500 }
    );
  }
}