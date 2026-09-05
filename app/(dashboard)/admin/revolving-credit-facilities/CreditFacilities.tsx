"use client";

import React, { useMemo } from "react";
import {
  CreditCard,
  Building2,
  CheckCircle2,
  Clock3,
  AlertCircle,
} from "lucide-react";

/* =========================================================
   Types
========================================================= */

type FacilityStatus =
  | "active"
  | "pending"
  | "suspended"
  | "expired";

type CreditFacility = {
  id: string;
  institutionName: string;
  facilityLimit: number;
  utilizedAmount: number;
  availableAmount: number;
  status: FacilityStatus;
  repaymentDays: number;
  pastDueDays: number;
  approvedAt: string;
};

/* =========================================================
   Mock Data
========================================================= */

const mockCreditFacilities: CreditFacility[] = [
  {
    id: "CF-001",
    institutionName: "Lagos University Teaching Hospital (LUTH)",
    facilityLimit: 10_000_000,
    utilizedAmount: 3_250_000,
    availableAmount: 6_750_000,
    status: "active",
    repaymentDays: 30,
    pastDueDays: 0,
    approvedAt: "2026-08-01",
  },
  {
    id: "CF-002",
    institutionName: "University of Port Harcourt Teaching Hospital",
    facilityLimit: 5_000_000,
    utilizedAmount: 1_850_000,
    availableAmount: 3_150_000,
    status: "active",
    repaymentDays: 30,
    pastDueDays: 0,
    approvedAt: "2026-08-08",
  },
  {
    id: "CF-003",
    institutionName: "Rivers State University Teaching Hospital",
    facilityLimit: 3_000_000,
    utilizedAmount: 1_200_000,
    availableAmount: 1_800_000,
    status: "active",
    repaymentDays: 30,
    pastDueDays: 0,
    approvedAt: "2026-08-15",
  },
  {
    id: "CF-004",
    institutionName: "National Hospital Abuja",
    facilityLimit: 2_000_000,
    utilizedAmount: 0,
    availableAmount: 2_000_000,
    status: "pending",
    repaymentDays: 30,
    pastDueDays: 0,
    approvedAt: "2026-09-01",
  },
];

/* =========================================================
   Component
========================================================= */

const CreditFacilities = () => {
  /* =========================================================
     Currency Formatter
  ========================================================= */

  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString("en-NG")}`;
  };

  /* =========================================================
     Portfolio Calculations
  ========================================================= */

  const portfolioStats = useMemo(() => {
    const totalPortfolioLimit = mockCreditFacilities.reduce(
      (total, facility) => total + facility.facilityLimit,
      0
    );

    const activeFacilities = mockCreditFacilities.filter(
      (facility) => facility.status === "active"
    );

    const activeApprovedLines = activeFacilities.reduce(
      (total, facility) => total + facility.facilityLimit,
      0
    );

    const totalUtilizedCredit = activeFacilities.reduce(
      (total, facility) => total + facility.utilizedAmount,
      0
    );

    const availableHeadroom = activeFacilities.reduce(
      (total, facility) => total + facility.availableAmount,
      0
    );

    const totalPastDueDays = activeFacilities.reduce(
      (total, facility) => total + facility.pastDueDays,
      0
    );

    const repaymentPerformance =
      activeFacilities.length > 0 && totalPastDueDays === 0
        ? 100
        : 95;

    return {
      totalPortfolioLimit,
      activeApprovedLines,
      totalUtilizedCredit,
      availableHeadroom,
      repaymentPerformance,
      activeFacilityCount: activeFacilities.length,
      pendingFacilityCount: mockCreditFacilities.filter(
        (facility) => facility.status === "pending"
      ).length,
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* =====================================================
          Credit Portfolio Header
      ====================================================== */}

      <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col justify-between gap-4 border-b border-slate-100 pb-4 md:flex-row md:items-center">
          <div>
            <h3 className="flex items-center gap-2 text-base font-bold text-slate-900">
              <CreditCard className="h-5 w-5 text-blue-600" />

              <span>
                Institutional Revolving Credit Facilities
              </span>
            </h3>

            <p className="mt-1 max-w-3xl text-xs leading-relaxed text-slate-500">
              Pre-approved financing facilities enabling accredited
              hospitals and clinics to procure pharmaceutical supplies
              on credit under Net 30 repayment terms.
            </p>
          </div>

          <div className="text-left md:text-right">
            <span className="block text-[11px] text-slate-400">
              Total Portfolio Limit
            </span>

            <span className="font-mono text-lg font-bold text-slate-900">
              {formatCurrency(
                portfolioStats.totalPortfolioLimit
              )}
            </span>
          </div>
        </div>

        {/* =====================================================
            Portfolio Metrics
        ====================================================== */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Active Approved Lines */}

          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <div className="flex items-center justify-between">
              <span className="block text-xs font-semibold uppercase tracking-wider text-emerald-800">
                Active Approved Lines
              </span>

              <Building2 className="h-4 w-4 text-emerald-600" />
            </div>

            <span className="mt-1 block font-mono text-xl font-bold text-emerald-900">
              {formatCurrency(
                portfolioStats.activeApprovedLines
              )}
            </span>

            <span className="mt-0.5 block text-[11px] text-emerald-700">
              {portfolioStats.activeFacilityCount} active
              institutional facilities
            </span>
          </div>

          {/* Available Headroom */}

          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
            <div className="flex items-center justify-between">
              <span className="block text-xs font-semibold uppercase tracking-wider text-blue-800">
                Available Headroom
              </span>

              <CreditCard className="h-4 w-4 text-blue-600" />
            </div>

            <span className="mt-1 block font-mono text-xl font-bold text-blue-900">
              {formatCurrency(
                portfolioStats.availableHeadroom
              )}
            </span>

            <span className="mt-0.5 block text-[11px] text-blue-700">
              Remaining active credit capacity
            </span>
          </div>

          {/* Utilized Credit */}

          <div className="rounded-xl border border-purple-200 bg-purple-50 p-4">
            <div className="flex items-center justify-between">
              <span className="block text-xs font-semibold uppercase tracking-wider text-purple-800">
                Credit Utilized
              </span>

              <Clock3 className="h-4 w-4 text-purple-600" />
            </div>

            <span className="mt-1 block font-mono text-xl font-bold text-purple-900">
              {formatCurrency(
                portfolioStats.totalUtilizedCredit
              )}
            </span>

            <span className="mt-0.5 block text-[11px] text-purple-700">
              Current outstanding exposure
            </span>
          </div>

          {/* Repayment Performance */}

          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-center justify-between">
              <span className="block text-xs font-semibold uppercase tracking-wider text-amber-800">
                Repayment Performance
              </span>

              {portfolioStats.repaymentPerformance === 100 ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-amber-600" />
              )}
            </div>

            <span className="mt-1 block font-mono text-xl font-bold text-amber-900">
              {portfolioStats.repaymentPerformance}% On-Time
            </span>

            <span className="mt-0.5 block text-[11px] text-amber-700">
              0 days past due across active facilities
            </span>
          </div>
        </div>
      </div>

      {/* =====================================================
          Facility List
      ====================================================== */}

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Credit Facility Portfolio
            </h3>

            <p className="mt-0.5 text-xs text-slate-500">
              Institutional buyers currently enrolled in the
              revolving credit programme.
            </p>
          </div>

          {portfolioStats.pendingFacilityCount > 0 && (
            <span className="rounded-full bg-amber-50 px-3 py-1 text-[11px] font-semibold text-amber-700">
              {portfolioStats.pendingFacilityCount} Pending
            </span>
          )}
        </div>

        <div className="space-y-3">
          {mockCreditFacilities.map((facility) => {
            const utilizationPercentage =
              facility.facilityLimit > 0
                ? Math.round(
                    (facility.utilizedAmount /
                      facility.facilityLimit) *
                      100
                  )
                : 0;

            return (
              <div
                key={facility.id}
                className="rounded-xl border border-slate-200 p-4 transition hover:border-blue-200 hover:bg-slate-50/50"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  {/* Institution */}

                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <Building2 className="h-5 w-5" />
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        {facility.institutionName}
                      </h4>

                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <span className="font-mono text-[10px] text-slate-400">
                          {facility.id}
                        </span>

                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${
                            facility.status === "active"
                              ? "bg-emerald-50 text-emerald-700"
                              : facility.status === "pending"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {facility.status}
                        </span>

                        <span className="text-[10px] text-slate-400">
                          Net {facility.repaymentDays} Days
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Facility Financials */}

                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:min-w-[520px]">
                    <div>
                      <span className="block text-[10px] uppercase tracking-wider text-slate-400">
                        Facility Limit
                      </span>

                      <span className="font-mono text-sm font-bold text-slate-900">
                        {formatCurrency(
                          facility.facilityLimit
                        )}
                      </span>
                    </div>

                    <div>
                      <span className="block text-[10px] uppercase tracking-wider text-slate-400">
                        Utilized
                      </span>

                      <span className="font-mono text-sm font-bold text-slate-900">
                        {formatCurrency(
                          facility.utilizedAmount
                        )}
                      </span>
                    </div>

                    <div>
                      <span className="block text-[10px] uppercase tracking-wider text-slate-400">
                        Available
                      </span>

                      <span className="font-mono text-sm font-bold text-emerald-700">
                        {formatCurrency(
                          facility.availableAmount
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Utilization Progress */}

                <div className="mt-4">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-[10px] font-medium text-slate-400">
                      Credit Utilization
                    </span>

                    <span className="font-mono text-[10px] font-semibold text-slate-500">
                      {utilizationPercentage}%
                    </span>
                  </div>

                  <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-blue-500 transition-all"
                      style={{
                        width: `${utilizationPercentage}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CreditFacilities;