// import SeedBuyerProcurementButton from "./SeedBuyerProcurementButton";

import SeedBuyerProcurementButton from "./SeedBuyerProcurementButton";


export const dynamic = "force-dynamic";

export default function BuyerProcurementSeedPage() {
  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div>
          <p className="text-sm font-medium text-primary">
            MedSupply Admin
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            Buyer Procurement Seed
          </h1>

          <p className="mt-2 max-w-3xl text-sm text-slate-600">
            Seed the LUTH buyer with a wallet/credit procurement
            environment, active supplier fallback queue, credit
            facility and historical orders.
          </p>
        </div>

        {/* Seed Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">
                LUTH Procurement Dataset
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Buyer ID:{" "}
                <span className="font-mono">
                  6a9cb82d853e785e43c110b8
                </span>
              </p>
            </div>

            <SeedBuyerProcurementButton />
          </div>
        </div>
      </div>
    </main>
  );
}