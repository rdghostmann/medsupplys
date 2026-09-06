import React from "react";

import CreditTransactionSeedButton from "./CreditTransactionSeedButton";

const Page = async () => {
  return (
    <main className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
          MedSupply Development
        </p>

        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
          Seed Credit Transaction Data
        </h1>

        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Initialize a buyer credit transaction for the
          MedSupply revolving institutional credit facility.
        </p>
      </div>

      {/* Seed Card */}
      <div className="max-w-5xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          {/* Information */}
          <div className="max-w-2xl">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                <span className="text-lg font-bold text-emerald-600">
                  ₦
                </span>
              </div>

              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Credit Procurement Transaction
                </h2>

                <p className="text-xs text-slate-500">
                  LUTH Institutional Credit Facility
                </p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Buyer
                </p>

                <p className="mt-1 text-xs font-semibold text-slate-800">
                  Lagos University Teaching Hospital
                  (LUTH)
                </p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Transaction
                </p>

                <p className="mt-1 font-mono text-xs font-bold text-slate-800">
                  CRD_ORD-8820
                </p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Type
                </p>

                <p className="mt-1 text-xs font-semibold text-amber-700">
                  CREDIT PURCHASE
                </p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Amount
                </p>

                <p className="mt-1 font-mono text-sm font-bold text-slate-900">
                  ₦1,200,000
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-3">
              <p className="text-[11px] leading-relaxed text-blue-800">
                This seed creates an initial{" "}
                <strong>CREDIT_PURCHASE</strong> ledger
                entry and associates it with the buyer
                CreditAccount. If order{" "}
                <span className="font-mono font-semibold">
                  ORD-8820
                </span>{" "}
                exists, the transaction will also be linked
                to that order.
              </p>
            </div>
          </div>

          {/* Action */}
          <div className="shrink-0 lg:min-w-[220px]">
            <CreditTransactionSeedButton />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Page;