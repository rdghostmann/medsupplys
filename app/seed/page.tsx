// /app/(dashboard)/admin/seed-supplier-payouts/page.tsx

import {
  CheckCircle2,
  AlertCircle,
  Database,
  WalletCards,
  Building2,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { seedMayBakerSupplierPayouts } from "@/lib/seed/admin-seed-supplier-payouts.action";


/* ==========================================================================
   TYPES
============================================================================= */

interface SeedSupplierPayoutsPageProps {
  searchParams: Promise<{
    status?: string;
    message?: string;
    created?: string;
    skipped?: string;
    total?: string;
  }>;
}

/* ==========================================================================
   PAGE
============================================================================= */

export default async function SeedSupplierPayoutsPage({
  searchParams,
}: SeedSupplierPayoutsPageProps) {
  const params =
    await searchParams;

  const status =
    params.status;

  const message =
    params.message;

  const created =
    params.created;

  const skipped =
    params.skipped;

  const total =
    params.total;

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      {/* ================================================================== */}
      {/* HEADER                                                             */}
      {/* ================================================================== */}

      <div>
        <div className="flex items-center gap-2">
          <Database className="size-5 text-muted-foreground" />

          <h1 className="text-2xl font-semibold tracking-tight">
            Seed Supplier Payouts
          </h1>
        </div>

        <p className="mt-1 text-sm text-muted-foreground">
          Seed mock payout records for the May & Baker supplier
          directly into MongoDB.
        </p>
      </div>

      {/* ================================================================== */}
      {/* STATUS                                                             */}
      {/* ================================================================== */}

      {status === "success" && (
        <Card className="border-emerald-500/30 bg-emerald-500/5">
          <CardContent className="flex items-start gap-3 p-4">
            <CheckCircle2 className="mt-0.5 size-5 text-emerald-600" />

            <div className="space-y-1">
              <p className="font-medium text-emerald-700">
                Supplier payouts seeded successfully
              </p>

              <p className="text-sm text-muted-foreground">
                {message}
              </p>

              <div className="flex flex-wrap gap-4 pt-2 text-sm">
                <span>
                  Created:{" "}
                  <strong>
                    {created ?? "0"}
                  </strong>
                </span>

                <span>
                  Skipped:{" "}
                  <strong>
                    {skipped ?? "0"}
                  </strong>
                </span>

                <span>
                  Total supplier payouts:{" "}
                  <strong>
                    {total ?? "0"}
                  </strong>
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {status === "error" && (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="flex items-start gap-3 p-4">
            <AlertCircle className="mt-0.5 size-5 text-destructive" />

            <div>
              <p className="font-medium text-destructive">
                Supplier payout seed failed
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                {message}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ================================================================== */}
      {/* SUPPLIER CARD                                                      */}
      {/* ================================================================== */}

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building2 className="size-5" />

            <div>
              <CardTitle>
                May & Baker Nigeria Plc
              </CardTitle>

              <CardDescription>
                Supplier payout seed target
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Supplier ID
              </p>

              <p className="mt-1 break-all font-mono text-sm">
                6a9cb82e853e785e43c110b9
              </p>
            </div>

            <div className="rounded-lg border p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Supplier Type
              </p>

              <p className="mt-1 text-sm font-medium">
                Importer
              </p>
            </div>

            <div className="rounded-lg border p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Settlement Bank
              </p>

              <p className="mt-1 text-sm font-medium">
                Zenith Bank Plc
              </p>
            </div>

            <div className="rounded-lg border p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Payout Records
              </p>

              <p className="mt-1 text-sm font-medium">
                5 mock payouts
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ================================================================== */}
      {/* PAYOUT SUMMARY                                                     */}
      {/* ================================================================== */}

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <WalletCards className="size-5" />

            <div>
              <CardTitle>
                Mock Payout Settlement
              </CardTitle>

              <CardDescription>
                The following payout records will be inserted
                for this supplier.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">
                    Reference
                  </th>

                  <th className="px-4 py-3 text-right font-medium">
                    Amount
                  </th>

                  <th className="px-4 py-3 text-right font-medium">
                    Fee
                  </th>

                  <th className="px-4 py-3 text-right font-medium">
                    Net Amount
                  </th>

                  <th className="px-4 py-3 text-left font-medium">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y">
                <tr>
                  <td className="px-4 py-3 font-mono">
                    NIBSS-MS-260906-001
                  </td>

                  <td className="px-4 py-3 text-right">
                    ₦450,000
                  </td>

                  <td className="px-4 py-3 text-right">
                    ₦50
                  </td>

                  <td className="px-4 py-3 text-right font-medium">
                    ₦449,950
                  </td>

                  <td className="px-4 py-3">
                    SETTLED
                  </td>
                </tr>

                <tr>
                  <td className="px-4 py-3 font-mono">
                    NIBSS-MS-260903-002
                  </td>

                  <td className="px-4 py-3 text-right">
                    ₦375,000
                  </td>

                  <td className="px-4 py-3 text-right">
                    ₦50
                  </td>

                  <td className="px-4 py-3 text-right font-medium">
                    ₦374,950
                  </td>

                  <td className="px-4 py-3">
                    SETTLED
                  </td>
                </tr>

                <tr>
                  <td className="px-4 py-3 font-mono">
                    NIBSS-MS-260830-003
                  </td>

                  <td className="px-4 py-3 text-right">
                    ₦525,000
                  </td>

                  <td className="px-4 py-3 text-right">
                    ₦50
                  </td>

                  <td className="px-4 py-3 text-right font-medium">
                    ₦524,950
                  </td>

                  <td className="px-4 py-3">
                    SETTLED
                  </td>
                </tr>

                <tr>
                  <td className="px-4 py-3 font-mono">
                    NIBSS-MS-260825-004
                  </td>

                  <td className="px-4 py-3 text-right">
                    ₦300,000
                  </td>

                  <td className="px-4 py-3 text-right">
                    ₦50
                  </td>

                  <td className="px-4 py-3 text-right font-medium">
                    ₦299,950
                  </td>

                  <td className="px-4 py-3">
                    SETTLED
                  </td>
                </tr>

                <tr>
                  <td className="px-4 py-3 font-mono">
                    NIBSS-MS-260820-005
                  </td>

                  <td className="px-4 py-3 text-right">
                    ₦275,000
                  </td>

                  <td className="px-4 py-3 text-right">
                    ₦50
                  </td>

                  <td className="px-4 py-3 text-right font-medium">
                    ₦274,950
                  </td>

                  <td className="px-4 py-3">
                    SETTLED
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* ============================================================ */}
          {/* SEED BUTTON                                                   */}
          {/* ============================================================ */}

          <div className="mt-6 flex justify-end">
            <form
              action={ seedMayBakerSupplierPayouts }
            >
              <Button
                type="submit"
                size="lg"
              >
                <Database className="mr-2 size-4" />

                Seed 5 Supplier Payouts
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}