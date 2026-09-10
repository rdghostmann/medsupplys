// /app/api/payments/flutterwave/verify/route.ts

import { NextRequest, NextResponse } from "next/server"

import { verifyWalletTopup } from "@/services/payment.service"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/auth"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      )
    }

    const body = await request.json()

    const reference = String(body?.reference ?? "").trim()

    if (!reference) {
      return NextResponse.json(
        {
          success: false,
          message: "Payment reference is required",
        },
        {
          status: 400,
        }
      )
    }

    const result = await verifyWalletTopup(reference, session.user.id)

    return NextResponse.json(result, {
      status: 200,
    })
  } catch (error) {
    console.error("[FLUTTERWAVE_VERIFY]", error)

    return NextResponse.json(
      {
        success: false,

        message:
          error instanceof Error ? error.message : "Unable to verify payment",
      },
      {
        status: 500,
      }
    )
  }
}
