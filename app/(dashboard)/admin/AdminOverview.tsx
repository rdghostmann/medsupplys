"use client";

import React, { useMemo, useState } from "react";
import {
    CheckCircle2,
    Package,
    RotateCcw,
    Users,
    Wallet,
    CreditCard,
    TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import { UsersFourIcon } from "@phosphor-icons/react";

/* =========================================================
   Types
========================================================= */

type AdminMetrics = {
    totalRevenue: number;
    totalCommission: number;
    totalWalletVolume: number;
    totalCreditExposure: number;
};

type MockProduct = {
    id: string;
    name: string;
    category: string;
    status: "active" | "inactive";
};

type MockSupplier = {
    id: string;
    name: string;
    verificationStatus: "verified" | "pending" | "rejected";
};

/* =========================================================
   Mock Data
========================================================= */

const mockAdminMetrics: AdminMetrics = {
    totalRevenue: 18_750_000,
    totalCommission: 1_875_000,
    totalWalletVolume: 8_425_000,
    totalCreditExposure: 5_000_000,
};

const mockProducts: MockProduct[] = [
    {
        id: "prod-001",
        name: "Paracetamol 500mg",
        category: "Analgesic",
        status: "active",
    },
    {
        id: "prod-002",
        name: "Amoxicillin 500mg",
        category: "Antibiotic",
        status: "active",
    },
    {
        id: "prod-003",
        name: "Ibuprofen 400mg",
        category: "Analgesic",
        status: "active",
    },
    {
        id: "prod-004",
        name: "Artemether/Lumefantrine",
        category: "Antimalarial",
        status: "active",
    },
    {
        id: "prod-005",
        name: "Vitamin C 1000mg",
        category: "Supplement",
        status: "active",
    },
    {
        id: "prod-006",
        name: "Metformin 500mg",
        category: "Antidiabetic",
        status: "active",
    },
    {
        id: "prod-007",
        name: "Omeprazole 20mg",
        category: "Gastrointestinal",
        status: "active",
    },
    {
        id: "prod-008",
        name: "Cough Syrup",
        category: "Respiratory",
        status: "active",
    },
    {
        id: "prod-009",
        name: "ORS Sachets",
        category: "Rehydration",
        status: "active",
    },
    {
        id: "prod-010",
        name: "Amlodipine 5mg",
        category: "Cardiovascular",
        status: "active",
    },
];

const mockSuppliers: MockSupplier[] = [
    {
        id: "sup-001",
        name: "May & Baker Nigeria Plc",
        verificationStatus: "verified",
    },
    {
        id: "sup-002",
        name: "Fidson Healthcare Plc",
        verificationStatus: "verified",
    },
    {
        id: "sup-003",
        name: "Neimeth Pharmaceuticals",
        verificationStatus: "verified",
    },
    {
        id: "sup-004",
        name: "Emzor Pharmaceutical Industries",
        verificationStatus: "verified",
    },
    {
        id: "sup-005",
        name: "Swiss Pharma Nigeria Ltd",
        verificationStatus: "verified",
    },
    {
        id: "sup-006",
        name: "Juhel Nigeria Limited",
        verificationStatus: "verified",
    },
    {
        id: "sup-007",
        name: "Prime Healthcare Suppliers",
        verificationStatus: "verified",
    },
    {
        id: "sup-008",
        name: "MedLink Distribution Ltd",
        verificationStatus: "pending",
    },
    {
        id: "sup-009",
        name: "HealthBridge Pharmaceuticals",
        verificationStatus: "pending",
    },
];

/* =========================================================
   Component
========================================================= */

const AdminOverview = () => {
    const [adminMetrics, setAdminMetrics] =
        useState<AdminMetrics>(mockAdminMetrics);

    const [isResetting, setIsResetting] = useState(false);

    /* =========================================================
       Derived Mock Data
    ========================================================= */

    const activeProducts = useMemo(() => {
        return mockProducts.filter((product) => product.status === "active");
    }, []);

    const pendingSuppliersCount = useMemo(() => {
        return mockSuppliers.filter(
            (supplier) => supplier.verificationStatus === "pending"
        ).length;
    }, []);

    const verifiedSuppliersCount = useMemo(() => {
        return mockSuppliers.filter(
            (supplier) => supplier.verificationStatus === "verified"
        ).length;
    }, []);

    /* =========================================================
       Reset Seed Data
    ========================================================= */

    const handleResetSeedData = async () => {
        if (isResetting) return;

        setIsResetting(true);

        try {
            // Simulate database reset
            await new Promise((resolve) => setTimeout(resolve, 900));

            setAdminMetrics({
                ...mockAdminMetrics,
            });

            toast.info("Demo Environment Reset", {
                description:
                    "Restored 9 verified suppliers and the default master catalogue.",
            });
        } catch {
            toast.error("Reset failed", {
                description:
                    "Unable to restore the demo seed data. Please try again.",
            });
        } finally {
            setIsResetting(false);
        }
    };

    /* =========================================================
       Currency Formatter
    ========================================================= */

    const formatCurrency = (value: number) => {
        return `₦${value.toLocaleString("en-NG")}`;
    };

    return (
        <div className="space-y-6">
            {/* =====================================================
          Metrics
      ====================================================== */}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* Total GMV */}

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:shadow-sm">
                    <div className="mb-3 flex items-start justify-between gap-3">
                        <div>
                            <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Gross Transaction Value
                            </span>

                            <span className="text-[10px] font-medium text-slate-400">
                                GMV
                            </span>
                        </div>

                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            <TrendingUp className="h-4 w-4" />
                        </div>
                    </div>

                    <span className="font-mono text-xl font-bold text-slate-900">
                        {formatCurrency(adminMetrics.totalRevenue)}
                    </span>

                    <span className="mt-2 block text-[11px] font-semibold text-emerald-700">
                        ✓ Settled via Paystack & Revolving Credit
                    </span>
                </div>

                {/* Platform Commission */}

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:shadow-sm">
                    <div className="mb-3 flex items-start justify-between gap-3">
                        <div>
                            <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Platform Commission
                            </span>

                            <span className="text-[10px] font-medium text-slate-400">
                                10% Take Rate
                            </span>
                        </div>

                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                            <Wallet className="h-4 w-4" />
                        </div>
                    </div>

                    <span className="font-mono text-xl font-bold text-blue-700">
                        {formatCurrency(adminMetrics.totalCommission)}
                    </span>

                    <span className="mt-2 block text-[11px] text-slate-400">
                        Automated platform take-rate
                    </span>
                </div>

                {/* Institutional Wallet Volume */}

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:shadow-sm">
                    <div className="mb-3 flex items-start justify-between gap-3">
                        <div>
                            <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Institutional Wallet Volume
                            </span>

                            <span className="text-[10px] font-medium text-slate-400">
                                Buyer Balances
                            </span>
                        </div>

                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                            <Wallet className="h-4 w-4" />
                        </div>
                    </div>

                    <span className="font-mono text-xl font-bold text-slate-900">
                        {formatCurrency(adminMetrics.totalWalletVolume)}
                    </span>

                    <span className="mt-2 block text-[11px] text-slate-400">
                        Active buyer balances
                    </span>
                </div>

                {/* Credit Exposure */}

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:shadow-sm">
                    <div className="mb-3 flex items-start justify-between gap-3">
                        <div>
                            <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Credit Facility Exposure
                            </span>

                            <span className="text-[10px] font-medium text-slate-400">
                                Revolving Credit
                            </span>
                        </div>

                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                            <CreditCard className="h-4 w-4" />
                        </div>
                    </div>

                    <span className="font-mono text-xl font-bold text-amber-700">
                        {formatCurrency(adminMetrics.totalCreditExposure)}
                    </span>

                    <span className="mt-2 block text-[11px] text-slate-400">
                        Net 30 day institutional exposure
                    </span>
                </div>
            </div>

            {/* =====================================================
          Quick Hub Navigation
      ====================================================== */}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Product Catalog */}

                <div
                    role="button"
                    tabIndex={0}
                    // onClick={() => handleSubTabChange("products")}
                    className="group flex cursor-pointer items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:border-blue-300 hover:shadow-sm"
                >
                    <div className="flex items-center gap-3">
                        {/* <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 font-bold text-blue-600 transition group-hover:scale-105">
                            <Package className="h-5 w-5" />
                        </div> */}

                        <div>
                            <h4 className="text-sm font-bold text-slate-900">
                                Master Product Catalog
                            </h4>

                            <p className="text-xs text-slate-500">
                                {activeProducts.length} regulated NAFDAC pharmaceutical lines
                            </p>
                        </div>
                    </div>

                    <span className="text-xs font-semibold text-blue-600 transition group-hover:translate-x-0.5">
                        Manage Catalog →
                    </span>
                </div>

                {/* Supplier KYC */}

                <div
                    role="button"
                    tabIndex={0}
                    // onClick={() => handleSubTabChange("kyc")}
                    className="group flex cursor-pointer items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:border-emerald-300 hover:shadow-sm"
                >
                    <div className="flex items-center gap-3">
                        {/* <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 font-bold text-emerald-600 transition group-hover:scale-105">
                            <UsersFourIcon className="h-5 w-5" weight="duotone" />
                        </div> */}

                        <div>
                            <h4 className="text-sm font-bold text-slate-900">
                                Supplier & KYC Approval
                            </h4>

                            <p className="text-xs text-slate-500">
                                {pendingSuppliersCount > 0
                                    ? `${pendingSuppliersCount} pending verification`
                                    : "All suppliers audited"}
                            </p>
                        </div>
                    </div>

                    <span className="text-xs font-semibold text-emerald-600 transition group-hover:translate-x-0.5">
                        Review KYC →
                    </span>
                </div>
            </div>

            {/* =====================================================
          Additional Mock Summary
      ====================================================== */}

            <div className="hidden grid-cols-1 gap-4 sm:grid-cols-2">
            {/* <div className="grid grid-cols-1 gap-4 sm:grid-cols-2"> */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            <Package className="h-5 w-5" />
                        </div>
                    <div className="flex items-center gap-3">

                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Master Catalogue
                            </p>

                            <p className="mt-1 text-lg font-bold text-slate-900">
                                {activeProducts.length}
                            </p>

                            <p className="text-xs text-slate-400">
                                Active pharmaceutical products
                            </p>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                    <div className="flex items-center gap-3">
                        {/* <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                            <Users className="h-5 w-5" />
                        </div> */}

                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Supplier Network
                            </p>

                            <p className="mt-1 text-lg font-bold text-slate-900">
                                {verifiedSuppliersCount}
                            </p>

                            <p className="text-xs text-slate-400">
                                Verified suppliers • {pendingSuppliersCount} pending
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* =====================================================
          Quick System Status
      ====================================================== */}

            <div className="hidden flex-col items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs md:flex-row">
                {/* <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs md:flex-row"> */}
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 font-bold text-emerald-600">
                        <CheckCircle2 className="h-6 w-6" />
                    </div>

                    <div>
                        <h3 className="text-sm font-bold text-slate-900">
                            All Autonomous Matching & Fallback Daemons Active
                        </h3>

                        <p className="text-xs leading-relaxed text-slate-500">
                            NAFDAC GDP compliance validation, Paystack webhook listener,
                            and atomic transaction locks operational.
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleResetSeedData}
                    disabled={isResetting}
                    aria-busy={isResetting}
                    className="flex shrink-0 cursor-pointer items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <RotateCcw
                        className={`h-3.5 w-3.5 ${isResetting ? "animate-spin" : ""
                            }`}
                    />

                    {isResetting ? "Resetting..." : "Reset Seed Data"}
                </button>
            </div>
        </div>
    );
};

export default AdminOverview;