// app/(dashboard)/admin/settings/seed-users/SeedUser.tsx

import {
  AlertCircle,
  CheckCircle2,
  Database,
  Package,
  RefreshCcw,
  ShieldCheck,
  Users,
  WalletCards,
} from "lucide-react";

import { redirect } from "next/navigation";

import {
  seedUsers,
  SEED_USER_PASSWORD,
} from "@/lib/seed/users.seed";

async function handleSeedDatabase() {
  "use server";

  let result: Awaited<ReturnType<typeof seedUsers>>;

  try {
    result = await seedUsers();
  } catch (error) {
    console.error(
      "DATABASE SEED ERROR:",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "Unknown database seed error";

    redirect(
      `/seed-user?seed=error&message=${encodeURIComponent(message)}`
    );
  }

  const hasFailures =
    result.userResults.failed.length > 0 ||
    result.productResults.failed.length > 0 ||
    result.supplierProductResults.failed.length > 0 ||
    result.walletTransactions.failed.length > 0;

  const params = new URLSearchParams({
    seed: hasFailures ? "partial" : "success",
    users: String(result.summary.totalUsers),
    usersCreated: String(result.userResults.created.length),
    usersUpdated: String(result.userResults.updated.length),
    userFailures: String(result.userResults.failed.length),
    products: String(result.summary.totalProducts),
    productsCreated: String(result.productResults.created.length),
    productsUpdated: String(result.productResults.updated.length),
    productFailures: String(result.productResults.failed.length),
    supplierProducts: String(result.summary.totalSupplierProducts),
    supplierProductsCreated: String(result.supplierProductResults.created.length),
    supplierProductsUpdated: String(result.supplierProductResults.updated.length),
    supplierProductFailures: String(result.supplierProductResults.failed.length),
    buyerId: result.buyer._id,
    walletId: result.wallet._id,
    walletBalance: String(result.wallet.balance),
  });

  redirect(`/seed-user?${params.toString()}`);
}

type SeedUserProps = {
  searchParams: Promise<{
    seed?: string;

    users?: string;
    usersCreated?: string;
    usersUpdated?: string;
    userFailures?: string;

    products?: string;
    productsCreated?: string;
    productsUpdated?: string;
    productFailures?: string;

    supplierProducts?: string;
    supplierProductsCreated?: string;
    supplierProductsUpdated?: string;
    supplierProductFailures?: string;

    buyerId?: string;
    walletId?: string;
    walletBalance?: string;

    message?: string;
  }>;
};

export default async function SeedUser({
  searchParams,
}: SeedUserProps) {
  const params = await searchParams;

  const seed = params.seed;

  const isSuccess = seed === "success";
  const isPartial = seed === "partial";
  const isError = seed === "error";

  return (
    <div className="space-y-6">
      {/* ======================================================
          HEADER
      ======================================================= */}
      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <Database className="size-6 text-primary" />
          </div>

          <div>
            <h2 className="text-lg font-semibold">
              MedSupply Database Seeder
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Initialize the development database
              with users, the Admin master product
              catalogue, supplier inventory, and
              the Buyer wallet.
            </p>
          </div>
        </div>
      </div>

      {/* ======================================================
          SUCCESS
      ======================================================= */}
      {isSuccess && (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6">
          <div className="flex items-start gap-4">
            <CheckCircle2 className="mt-0.5 size-6 text-emerald-600" />

            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-emerald-700 dark:text-emerald-400">
                Database seeded successfully
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                Users, master products, supplier
                inventory and Buyer wallet data
                have been initialized.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================
          PARTIAL
      ======================================================= */}
      {isPartial && (
        <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/5 p-6">
          <div className="flex items-start gap-4">
            <AlertCircle className="mt-0.5 size-6 text-yellow-600" />

            <div>
              <h3 className="font-semibold text-yellow-700 dark:text-yellow-400">
                Database seeded with some failures
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                Some records were created or updated,
                but one or more records failed.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================
          ERROR
      ======================================================= */}
      {isError && (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6">
          <div className="flex items-start gap-4">
            <AlertCircle className="mt-0.5 size-6 text-destructive" />

            <div>
              <h3 className="font-semibold text-destructive">
                Database seeding failed
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                {params.message ||
                  "An unexpected error occurred while seeding the database."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================
          RESULT SUMMARY
      ======================================================= */}
      {(isSuccess || isPartial) && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <SummaryCard
              icon={
                <Users className="size-5" />
              }
              label="Users"
              value={params.users || "0"}
              detail={`${params.usersCreated || 0} created · ${params.usersUpdated || 0} updated`}
            />

            <SummaryCard
              icon={
                <Package className="size-5" />
              }
              label="Master Products"
              value={params.products || "0"}
              detail={`${params.productsCreated || 0} created · ${params.productsUpdated || 0} updated`}
            />

            <SummaryCard
              icon={
                <ShieldCheck className="size-5" />
              }
              label="Supplier Products"
              value={
                params.supplierProducts ||
                "0"
              }
              detail={`${params.supplierProductsCreated || 0} created · ${params.supplierProductsUpdated || 0} updated`}
            />

            <SummaryCard
              icon={
                <WalletCards className="size-5" />
              }
              label="Buyer Wallet"
              value={`₦${Number(
                params.walletBalance || 0
              ).toLocaleString()}`}
              detail="LUTH Procurement"
            />
          </div>

          {/* ==================================================
              BUYER IDS
          =================================================== */}
          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <div className="mb-5">
              <h3 className="font-semibold">
                Seeded Buyer References
              </h3>

              <p className="text-sm text-muted-foreground">
                MongoDB ObjectIds generated for
                the Buyer and Wallet.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <ReferenceCard
                label="Buyer MongoDB _id"
                value={
                  params.buyerId ||
                  "Not available"
                }
              />

              <ReferenceCard
                label="Wallet MongoDB _id"
                value={
                  params.walletId ||
                  "Not available"
                }
              />
            </div>
          </div>
        </>
      )}

      {/* ======================================================
          SEED ACTION
      ======================================================= */}
      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="font-semibold">
              Initialize Development Data
            </h3>

            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              This operation is idempotent. Existing
              seeded records are updated rather than
              duplicated.
            </p>
          </div>

          <form action={handleSeedDatabase}>
            <button
              type="submit"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
            >
              <RefreshCcw className="size-4" />
              Seed Database
            </button>
          </form>
        </div>
      </div>

      {/* ======================================================
          DEVELOPMENT PASSWORD
      ======================================================= */}
      <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/5 p-6">
        <h3 className="font-semibold text-yellow-700 dark:text-yellow-400">
          Development Login Credentials
        </h3>

        <p className="mt-1 text-sm text-muted-foreground">
          All seeded users use the development
          password below.
        </p>

        <div className="mt-4 rounded-lg border bg-background px-4 py-3 font-mono text-sm">
          {SEED_USER_PASSWORD}
        </div>

        <p className="mt-3 text-xs text-muted-foreground">
          Do not use the default development password
          in production. Set SEED_USER_PASSWORD in
          your environment configuration.
        </p>
      </div>
    </div>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  detail,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {label}
        </span>

        <div className="text-primary">
          {icon}
        </div>
      </div>

      <div className="mt-3 text-2xl font-bold">
        {value}
      </div>

      <p className="mt-1 text-xs text-muted-foreground">
        {detail}
      </p>
    </div>
  );
}

function ReferenceCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border bg-muted/30 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>

      <p className="mt-2 break-all font-mono text-xs">
        {value}
      </p>
    </div>
  );
}