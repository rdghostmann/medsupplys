"use server";

import { redirect } from "next/navigation";
import { Types } from "mongoose";

import { connectToDB } from "@/lib/connectToDB";
import { User } from "@/models/User";
import {
  SupplierPayout,
  SupplierPayoutStatus,
} from "@/models/SupplierPayout";

/* ==========================================================================
   CONSTANTS
============================================================================= */

const SUPPLIER_OBJECT_ID = new Types.ObjectId(
  "6a9cb82e853e785e43c110b9"
);

const SEED_PAGE =
  "/seed";

/* ==========================================================================
   TYPES
============================================================================= */

interface MockPayout {
  reference: string;
  amount: number;
  transferFee: number;
  netAmount: number;
  status: SupplierPayoutStatus;
  createdAt: string;
}

/* ==========================================================================
   MOCK PAYOUTS
============================================================================= */

const MOCK_PAYOUTS: MockPayout[] = [
  {
    reference: "NIBSS-MS-260906-001",
    amount: 450_000,
    transferFee: 50,
    netAmount: 449_950,
    status: "SETTLED",
    createdAt: "2026-09-06T10:00:00.000Z",
  },

  {
    reference: "NIBSS-MS-260903-002",
    amount: 375_000,
    transferFee: 50,
    netAmount: 374_950,
    status: "SETTLED",
    createdAt: "2026-09-03T14:30:00.000Z",
  },

  {
    reference: "NIBSS-MS-260830-003",
    amount: 525_000,
    transferFee: 50,
    netAmount: 524_950,
    status: "SETTLED",
    createdAt: "2026-08-30T11:15:00.000Z",
  },

  {
    reference: "NIBSS-MS-260825-004",
    amount: 300_000,
    transferFee: 50,
    netAmount: 299_950,
    status: "SETTLED",
    createdAt: "2026-08-25T09:45:00.000Z",
  },

  {
    reference: "NIBSS-MS-260820-005",
    amount: 275_000,
    transferFee: 50,
    netAmount: 274_950,
    status: "SETTLED",
    createdAt: "2026-08-20T13:10:00.000Z",
  },
];

/* ==========================================================================
   SERVER ACTION
============================================================================= */

export async function seedMayBakerSupplierPayouts(
  _formData: FormData
): Promise<void> {
  let redirectUrl = SEED_PAGE;

  try {
    await connectToDB();

    /* ----------------------------------------------------------------------
       FIND SUPPLIER
    ---------------------------------------------------------------------- */

    const supplier =
      await User.findOne({
        _id: SUPPLIER_OBJECT_ID,
        role: "supplier",
      })
        .select(
          "_id organizationName username supplierType settlementBankName settlementAccountNumber settlementAccountName"
        )
        .lean();

    if (!supplier) {
      redirectUrl =
        `${SEED_PAGE}?status=error` +
        "&message=" +
        encodeURIComponent(
          "May & Baker Nigeria Plc supplier was not found."
        );
    } else {
      /* --------------------------------------------------------------------
         SUPPLIER INFORMATION
      -------------------------------------------------------------------- */

      const supplierName =
        supplier.organizationName ||
        supplier.username ||
        "May & Baker Nigeria Plc";

      const bankName =
        supplier.settlementBankName ||
        "Zenith Bank Plc";

      const accountNumber =
        supplier.settlementAccountNumber ||
        "1014892841";

      const accountName =
        supplier.settlementAccountName ||
        "MAY & BAKER NIGERIA PLC / MEDISUPPLY ESCROW";

      /* --------------------------------------------------------------------
         COUNTERS
      -------------------------------------------------------------------- */

      let created = 0;
      let skipped = 0;

      /* --------------------------------------------------------------------
         SEED PAYOUTS
      -------------------------------------------------------------------- */

      for (const mockPayout of MOCK_PAYOUTS) {
        const existingPayout =
          await SupplierPayout.findOne({
            reference:
              mockPayout.reference,
          }).lean();

        if (existingPayout) {
          skipped++;
          continue;
        }

        const payoutCreatedAt =
          new Date(
            mockPayout.createdAt
          );

        await SupplierPayout.create({
          supplierId:
            SUPPLIER_OBJECT_ID,

          supplierName,

          amount:
            mockPayout.amount,

          transferFee:
            mockPayout.transferFee,

          netAmount:
            mockPayout.netAmount,

          status:
            mockPayout.status,

          reference:
            mockPayout.reference,

          bankName,

          accountNumber,

          accountName,

          orderIds: [],

          processedAt:
            mockPayout.status ===
            "SETTLED"
              ? payoutCreatedAt
              : undefined,

          createdAt:
            payoutCreatedAt,

          updatedAt:
            payoutCreatedAt,
        });

        created++;
      }

      /* --------------------------------------------------------------------
         TOTAL
      -------------------------------------------------------------------- */

      const total =
        await SupplierPayout.countDocuments({
          supplierId:
            SUPPLIER_OBJECT_ID,
        });

      /* --------------------------------------------------------------------
         SUCCESS REDIRECT
      -------------------------------------------------------------------- */

      redirectUrl =
        `${SEED_PAGE}?status=success` +
        `&created=${created}` +
        `&skipped=${skipped}` +
        `&total=${total}` +
        "&message=" +
        encodeURIComponent(
          `Supplier payouts seeded successfully for ${supplierName}.`
        );
    }
  } catch (error) {
    console.error(
      "SEED SUPPLIER PAYOUTS ERROR:",
      error
    );

    redirectUrl =
      `${SEED_PAGE}?status=error` +
      "&message=" +
      encodeURIComponent(
        error instanceof Error
          ? error.message
          : "Failed to seed supplier payouts."
      );
  }

  redirect(redirectUrl);
}