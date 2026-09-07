// /app/api/payments/flutterwave/webhook/route.ts

import {
  NextRequest,
  NextResponse,
} from "next/server";

import crypto from "crypto";

import {
  verifyWalletTopup,
} from "@/services/payment.service";

function verifyFlutterwaveSignature(
  rawBody: string,
  signature: string
) {
  const secretHash =
    process.env.FLW_SECRET_HASH;

  if (!secretHash) {
    throw new Error(
      "FLW_SECRET_HASH is not configured"
    );
  }

  const hash =
    crypto
      .createHmac(
        "sha256",
        secretHash
      )
      .update(rawBody)
      .digest("base64");

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
        "flutterwave-signature"
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
      verifyFlutterwaveSignature(
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

    const reference =
      event?.data?.reference ??
      event?.data?.tx_ref;

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
     * The service retrieves our internal
     * PaymentTransaction using tx_ref.
     *
     * It then uses the stored Flutterwave
     * transaction ID to independently verify
     * the payment.
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
      "[FLUTTERWAVE_WEBHOOK]",
      error
    );

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