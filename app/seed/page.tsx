// app/(dashboard)/admin/seed-orders/page.tsx

import { seedMockOrdersAndSupplierPayouts } from "@/lib/seed/admin-seed-orders.action";


interface PageProps {
  searchParams: Promise<{
    seeded?: string;
    message?: string;
    orders?: string;
    payouts?: string;
  }>;
}

export default async function Page({
  searchParams,
}: PageProps) {
  const params =
    await searchParams;

  const seeded =
    params.seeded === "true";

  const failed =
    params.seeded === "false";

  async function seedOrdersAction() {
    "use server";

    const result =
      await seedMockOrdersAndSupplierPayouts();

    const query =
      new URLSearchParams();

    query.set(
      "seeded",
      result.success
        ? "true"
        : "false"
    );

    query.set(
      "message",
      result.message
    );

    query.set(
      "orders",
      String(
        result.ordersCreated || 0
      )
    );

    query.set(
      "payouts",
      String(
        result.payoutsCreated || 0
      )
    );

    /*
     * Re-render the Server Component
     * with the result in the URL.
     */
    const { redirect } =
      await import(
        "next/navigation"
      );

    redirect(
      `/admin/seed-orders?${query.toString()}`
    );
  }

  return (
    <div className="min-h-full bg-slate-50 p-6">
      <div className="mx-auto max-w-3xl space-y-6">

        {/* -------------------------------------------------------------- */}
        {/* Header                                                         */}
        {/* -------------------------------------------------------------- */}

        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Seed Supplier Orders
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Seed mock Orders and SupplierPayout
            records for the selected supplier.
          </p>
        </div>

        {/* -------------------------------------------------------------- */}
        {/* Supplier                                                       */}
        {/* -------------------------------------------------------------- */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Target Supplier
          </p>

          <p className="mt-2 font-mono text-sm font-bold text-slate-900">
            6a9cb82e853e785e43c110b9
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Orders and payouts will be restricted
            to this supplier.
          </p>
        </div>

        {/* -------------------------------------------------------------- */}
        {/* Seed Action                                                    */}
        {/* -------------------------------------------------------------- */}

        <form
          action={
            seedOrdersAction
          }
        >
          <button
            type="submit"
            className="w-full rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 active:scale-[0.99]"
          >
            Seed Mock Orders & Supplier Payouts
          </button>
        </form>

        {/* -------------------------------------------------------------- */}
        {/* Status                                                         */}
        {/* -------------------------------------------------------------- */}

        {seeded && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">

            <div className="flex items-start gap-3">

              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                ✓
              </div>

              <div>
                <h2 className="text-sm font-bold text-emerald-900">
                  Seed Completed
                </h2>

                <p className="mt-1 text-xs text-emerald-800">
                  {params.message}
                </p>

                <div className="mt-4 grid grid-cols-2 gap-3">

                  <div className="rounded-xl border border-emerald-200 bg-white p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Orders Created
                    </p>

                    <p className="mt-1 text-lg font-bold text-slate-900">
                      {params.orders ||
                        "0"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-emerald-200 bg-white p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Payouts Created
                    </p>

                    <p className="mt-1 text-lg font-bold text-slate-900">
                      {params.payouts ||
                        "0"}
                    </p>
                  </div>

                </div>
              </div>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------- */}
        {/* Error                                                          */}
        {/* -------------------------------------------------------------- */}

        {failed && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5">

            <div className="flex items-start gap-3">

              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-700">
                !
              </div>

              <div>
                <h2 className="text-sm font-bold text-red-900">
                  Seed Failed
                </h2>

                <p className="mt-1 text-xs text-red-800">
                  {params.message}
                </p>
              </div>

            </div>
          </div>
        )}

        {/* -------------------------------------------------------------- */}
        {/* What Will Be Seeded                                            */}
        {/* -------------------------------------------------------------- */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5">

          <h2 className="text-sm font-bold text-slate-900">
            Seed Contents
          </h2>

          <div className="mt-4 space-y-2 text-xs text-slate-600">

            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span>Mock Orders</span>
              <strong className="text-slate-900">
                7
              </strong>
            </div>

            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span>Supplier Payouts</span>
              <strong className="text-slate-900">
                3
              </strong>
            </div>

            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span>Supplier</span>
              <strong className="font-mono text-slate-900">
                6a9cb82e...
              </strong>
            </div>

            <div className="flex justify-between">
              <span>Duplicate Protection</span>
              <strong className="text-emerald-700">
                Enabled
              </strong>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}