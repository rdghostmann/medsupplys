// /app/api/payments/paystack/webhook/route.ts

import {
  NextRequest,
  NextResponse,
} from "next/server";

import crypto from "crypto";

import {
  verifyWalletTopup,
} from "@/services/payment.service";

function verifyPaystackSignature(
  rawBody: string,
  signature: string
) {
  const secret =
    process.env.PAYSTACK_SECRET_KEY;

  if (!secret) {
    throw new Error(
      "PAYSTACK_SECRET_KEY is not configured"
    );
  }

  const hash =
    crypto
      .createHmac(
        "sha512",
        secret
      )
      .update(rawBody)
      .digest("hex");

  const expected =
    Buffer.from(hash);

  const received =
    Buffer.from(signature);

  if (
    expected.length !==
    received.length
  ) {
    return false;
  }

  return crypto.timingSafeEqual(
    expected,
    received
  );
}

export async function POST(
  request: NextRequest
) {
  try {
    const rawBody =
      await request.text();

    const signature =
      request.headers.get(
        "x-paystack-signature"
      );

    if (!signature) {
      return new NextResponse(
        "Missing signature",
        {
          status: 401,
        }
      );
    }

    const valid =
      verifyPaystackSignature(
        rawBody,
        signature
      );

    if (!valid) {
      return new NextResponse(
        "Invalid signature",
        {
          status: 401,
        }
      );
    }

    const event =
      JSON.parse(rawBody);

    /**
     * We only care about successful
     * wallet top-up events here.
     *
     * Other Paystack events can be handled
     * later without affecting the wallet.
     */
    if (
      event?.event !==
      "charge.success"
    ) {
      return NextResponse.json(
        {
          received: true,
        },
        {
          status: 200,
        }
      );
    }

    const reference =
      event?.data?.reference;

    if (!reference) {
      return NextResponse.json(
        {
          received: true,
        },
        {
          status: 200,
        }
      );
    }

    /**
     * verifyWalletTopup() independently
     * calls Paystack's verification API.
     *
     * We do NOT trust webhook amount/status.
     */
    await verifyWalletTopup(
      reference
    );

    return NextResponse.json(
      {
        received: true,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "[PAYSTACK_WEBHOOK]",
      error
    );

    /**
     * Returning 500 allows Paystack's retry
     * mechanism to retry delivery.
     */
    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}