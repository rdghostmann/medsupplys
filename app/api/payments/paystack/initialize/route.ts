// /app/api/payments/paystack/initialize/route.ts

import { NextRequest, NextResponse } from "next/server"

import { initializeWalletTopup } from "@/services/payment.service"

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

    const amount = Number(body?.amount)

    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "A valid amount is required",
        },
        {
          status: 400,
        }
      )
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL

    if (!appUrl) {
      console.error("[PAYSTACK_INITIALIZE] NEXT_PUBLIC_APP_URL is missing")

      return NextResponse.json(
        {
          success: false,
          message: "Payment callback URL is not configured",
        },
        {
          status: 500,
        }
      )
    }

    const callbackUrl = `${appUrl}/buyer/buyerwallet/topup/callback?provider=paystack`

    const result = await initializeWalletTopup({
      buyerId: session.user.id,

      provider: "PAYSTACK",

      amount,

      callbackUrl,
    })

    return NextResponse.json(result, {
      status: 200,
    })
  } catch (error) {
    console.error("[PAYSTACK_INITIALIZE]", error)

    return NextResponse.json(
      {
        success: false,

        message:
          error instanceof Error
            ? error.message
            : "Unable to initialize payment",
      },
      {
        status: 500,
      }
    )
  }
}
