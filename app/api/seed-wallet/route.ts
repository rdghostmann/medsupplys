// /app/api/admin/seed-credit-account/route.ts

import { NextResponse } from "next/server"
import { connectToDB } from "@/lib/connectToDB"
import { CreditAccount } from "@/models/CreditAccount"
import { User } from "@/models/User"
import { Types } from "mongoose"

const SEEDED_BUYER = {
  buyerId: "6a9cb82d853e785e43c110b8",
  buyerName: "Lagos University Teaching Hospital (LUTH)",

  creditLimit: 10_000_000,

  availableCredit: 10_000_000,

  creditUsed: 0,

  outstandingBalance: 0,

  status: "ACTIVE" as const,

  ratingTier: "A" as const,

  terms: "Net 30 days",

  interestRatePercent: 0,
}

const buyerObjectId = new Types.ObjectId(SEEDED_BUYER.buyerId)

export async function POST() {
  try {
    await connectToDB()

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
      )
    }

    // ---------------------------------------------------------
    // 2. Verify Buyer Exists
    // ---------------------------------------------------------

    const buyer = await User.findById(buyerObjectId).select(
      "_id fullName role email"
    )

    if (!buyer) {
      return NextResponse.json(
        {
          success: false,
          message: "Buyer user was not found.",
          buyerId: SEEDED_BUYER.buyerId,
        },
        { status: 404 }
      )
    }

    // ---------------------------------------------------------
    // 3. Verify User Is a Buyer
    // ---------------------------------------------------------

    if (buyer.role !== "buyer") {
      return NextResponse.json(
        {
          success: false,
          message: "The selected user is not a buyer.",
          buyerId: SEEDED_BUYER.buyerId,
          role: buyer.role,
        },
        { status: 400 }
      )
    }

    // ---------------------------------------------------------
    // 4. Check Existing Credit Account
    // ---------------------------------------------------------

    const existingCreditAccount = await CreditAccount.findOne()
      .where("buyerId")
      .equals(buyerObjectId)
      .lean()

    if (existingCreditAccount) {
      return NextResponse.json(
        {
          success: true,
          seeded: false,
          alreadyExists: true,

          message: "Buyer credit account already exists.",

          creditAccount: {
            _id: existingCreditAccount._id?.toString(),

            buyerId: existingCreditAccount.buyerId?.toString(),

            buyerName: existingCreditAccount.buyerName,

            creditLimit: Number(existingCreditAccount.creditLimit ?? 0),

            availableCredit: Number(existingCreditAccount.availableCredit ?? 0),

            creditUsed: Number(existingCreditAccount.creditUsed ?? 0),

            outstandingBalance: Number(
              existingCreditAccount.outstandingBalance ?? 0
            ),

            status: existingCreditAccount.status,

            ratingTier: existingCreditAccount.ratingTier,

            approvedBy: existingCreditAccount.approvedBy?.toString(),

            approvedAt: existingCreditAccount.approvedAt,

            dueDate: existingCreditAccount.dueDate,

            terms: existingCreditAccount.terms,

            interestRatePercent: Number(
              existingCreditAccount.interestRatePercent ?? 0
            ),

            createdAt: existingCreditAccount.createdAt,

            updatedAt: existingCreditAccount.updatedAt,
          },
        },
        { status: 200 }
      )
    }

    // ---------------------------------------------------------
    // 5. Validate Credit Configuration
    // ---------------------------------------------------------

    const calculatedAvailableCredit =
      SEEDED_BUYER.creditLimit - SEEDED_BUYER.creditUsed

    if (calculatedAvailableCredit !== SEEDED_BUYER.availableCredit) {
      return NextResponse.json(
        {
          success: false,

          message: "Invalid credit account configuration.",

          calculation: {
            creditLimit: SEEDED_BUYER.creditLimit,

            creditUsed: SEEDED_BUYER.creditUsed,

            calculatedAvailableCredit,

            configuredAvailableCredit: SEEDED_BUYER.availableCredit,
          },
        },
        { status: 400 }
      )
    }

    // ---------------------------------------------------------
    // 6. Create Credit Account
    // ---------------------------------------------------------

    const creditAccount = await CreditAccount.create({
      buyerId: buyerObjectId,

      buyerName: SEEDED_BUYER.buyerName,

      creditLimit: Number(SEEDED_BUYER.creditLimit),

      availableCredit: Number(SEEDED_BUYER.availableCredit),

      creditUsed: Number(SEEDED_BUYER.creditUsed),

      outstandingBalance: Number(SEEDED_BUYER.outstandingBalance),

      status: SEEDED_BUYER.status,

      ratingTier: SEEDED_BUYER.ratingTier,

      terms: SEEDED_BUYER.terms,

      interestRatePercent: Number(SEEDED_BUYER.interestRatePercent),
    })

    // ---------------------------------------------------------
    // 7. Re-fetch as Plain Object
    // ---------------------------------------------------------

    const createdCreditAccount = await CreditAccount.findById(
      creditAccount._id
    ).lean()

    if (!createdCreditAccount) {
      return NextResponse.json(
        {
          success: false,

          message: "Credit account was created but could not be retrieved.",
        },
        { status: 500 }
      )
    }

    // ---------------------------------------------------------
    // 8. Serialize Response
    // ---------------------------------------------------------

    const serializedCreditAccount = {
      _id: createdCreditAccount._id?.toString(),

      buyerId: createdCreditAccount.buyerId?.toString(),

      buyerName: createdCreditAccount.buyerName,

      creditLimit: Number(createdCreditAccount.creditLimit ?? 0),

      availableCredit: Number(createdCreditAccount.availableCredit ?? 0),

      creditUsed: Number(createdCreditAccount.creditUsed ?? 0),

      outstandingBalance: Number(createdCreditAccount.outstandingBalance ?? 0),

      status: createdCreditAccount.status,

      ratingTier: createdCreditAccount.ratingTier,

      approvedBy: createdCreditAccount.approvedBy?.toString(),

      approvedAt: createdCreditAccount.approvedAt,

      dueDate: createdCreditAccount.dueDate,

      terms: createdCreditAccount.terms,

      interestRatePercent: Number(
        createdCreditAccount.interestRatePercent ?? 0
      ),

      createdAt: createdCreditAccount.createdAt,

      updatedAt: createdCreditAccount.updatedAt,
    }

    // ---------------------------------------------------------
    // 9. Return Response
    // ---------------------------------------------------------

    return NextResponse.json(
      {
        success: true,

        seeded: true,

        alreadyExists: false,

        message: "Buyer credit account seeded successfully.",

        creditAccount: serializedCreditAccount,
      },
      { status: 201 }
    )
  } catch (error: unknown) {
    console.error("SEED_CREDIT_ACCOUNT_ERROR:", error)

    // ---------------------------------------------------------
    // Handle Duplicate Credit Account
    // ---------------------------------------------------------

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === 11000
    ) {
      const existingCreditAccount = await CreditAccount.findOne()
        .where("buyerId")
        .equals(buyerObjectId)
        .lean()

      return NextResponse.json(
        {
          success: true,

          seeded: false,

          alreadyExists: true,

          message: "A credit account already exists for this buyer.",

          creditAccount: existingCreditAccount
            ? {
                _id: existingCreditAccount._id?.toString(),

                buyerId: existingCreditAccount.buyerId?.toString(),

                buyerName: existingCreditAccount.buyerName,

                creditLimit: Number(existingCreditAccount.creditLimit ?? 0),

                availableCredit: Number(
                  existingCreditAccount.availableCredit ?? 0
                ),

                creditUsed: Number(existingCreditAccount.creditUsed ?? 0),

                outstandingBalance: Number(
                  existingCreditAccount.outstandingBalance ?? 0
                ),

                status: existingCreditAccount.status,

                ratingTier: existingCreditAccount.ratingTier,

                terms: existingCreditAccount.terms,

                interestRatePercent: Number(
                  existingCreditAccount.interestRatePercent ?? 0
                ),
              }
            : null,
        },
        { status: 200 }
      )
    }

    return NextResponse.json(
      {
        success: false,

        message: "Failed to seed buyer credit account.",

        error: error instanceof Error ? error.message : "Unknown server error",
      },
      { status: 500 }
    )
  }
}
