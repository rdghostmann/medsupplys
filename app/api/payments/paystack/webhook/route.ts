import { NextRequest, NextResponse } from "next/server"

import crypto from "crypto"

import { verifyWalletTopup } from "@/services/payment.service"

function verifyPaystackSignature(rawBody: string, signature: string) {
  const secret = process.env.PAYSTACK_SECRET_KEY

  if (!secret) {
    throw new Error("PAYSTACK_SECRET_KEY is not configured")
  }

  const expected = crypto
    .createHmac("sha512", secret)
    .update(rawBody)
    .digest("hex")

  const expectedBuffer = Buffer.from(expected)

  const receivedBuffer = Buffer.from(signature)

  if (expectedBuffer.length !== receivedBuffer.length) {
    return false
  }

  return crypto.timingSafeEqual(expectedBuffer, receivedBuffer)
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text()

    const signature = request.headers.get("x-paystack-signature")

    if (!signature) {
      return new NextResponse("Missing signature", {
        status: 401,
      })
    }

    const valid = verifyPaystackSignature(rawBody, signature)

    if (!valid) {
      return new NextResponse("Invalid signature", {
        status: 401,
      })
    }

    const event = JSON.parse(rawBody)

    /*
     * We only care about successful
     * wallet funding events.
     *
     * verifyWalletTopup() independently
     * verifies the transaction with Paystack,
     * so the webhook payload itself is
     * never trusted for wallet crediting.
     */
    if (event?.event !== "charge.success") {
      return NextResponse.json(
        {
          received: true,
        },
        {
          status: 200,
        }
      )
    }

    const reference = event?.data?.reference

    if (!reference) {
      return NextResponse.json(
        {
          received: true,
        },
        {
          status: 200,
        }
      )
    }

    await verifyWalletTopup(reference)

    return NextResponse.json(
      {
        received: true,
      },
      {
        status: 200,
      }
    )
  } catch (error) {
    console.error("[PAYSTACK_WEBHOOK]", error)

    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 500,
      }
    )
  }
}
