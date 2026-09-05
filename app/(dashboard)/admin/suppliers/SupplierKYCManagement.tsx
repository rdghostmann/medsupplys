"use client";

import React, { useMemo, useState } from "react";
import {
    Users,
    ShieldCheck,
    Clock,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    Building2,
    Search,
    Eye,
    Check,
    X,
    ThermometerSnowflake,
    CreditCard,
    MapPin,
    Zap,
} from "lucide-react";
import { toast } from "sonner";
import { SupplierApprovalStatus, SupplierType } from "@/types";

/**
 * ============================================================
 * MOCK SUPPLIER TYPES
 * ============================================================
 */

type CreditRatingTier = "A" | "B" | "C" | "UNRATED";

type MockSupplier = {
    id: string;
    name: string;
    organization: string;
    email: string;
    phone: string;
    role: "SUPPLIER";

    state: string;
    lga: string;
    address: string;

    supplierType: SupplierType;
    supplierApprovalStatus: SupplierApprovalStatus;

    licenseNumber: string;
    pcnPremisesLicense: string;
    nafdacGdpLicense: string;
    taxIdentificationNumber: string;

    isColdChainCertified: boolean;
    coldChainCapacityM3: number;
    backupPowerSpec: string;

    settlementBankName: string;
    settlementAccountNumber: string;
    settlementAccountName: string;

    assignedCreditLimit: number;
    creditRatingTier: CreditRatingTier;

    kycReviewNotes: string;
    kycRejectionReason?: string;
    kycSuspensionReason?: string;

    createdAt: string;
};

/**
 * ============================================================
 * MOCK SUPPLIER DATA
 * ============================================================
 */

const initialMockSuppliers: MockSupplier[] = [
    {
        id: "sup-001",
        name: "Fidson Healthcare",
        organization: "Fidson Healthcare Plc",
        email: "compliance@fidson.com",
        phone: "+234 1 271 7700",
        role: "SUPPLIER",

        state: "Lagos",
        lga: "Ikeja",
        address: "268 Ikorodu Road, Obanikoro, Lagos, Nigeria",

        supplierType: "IMPORTER",
        supplierApprovalStatus: "PENDING",

        licenseNumber: "PCN-REG-001284",
        pcnPremisesLicense: "PCN-PREM-2026-00184",
        nafdacGdpLicense: "NAFDAC/GDP/2026/0142",
        taxIdentificationNumber: "TIN-00192847-0001",

        isColdChainCertified: true,
        coldChainCapacityM3: 220,
        backupPowerSpec:
            "Dual 500kVA Cummins Diesel Generators with Automatic Transfer Switch (ATS).",

        settlementBankName: "Zenith Bank Plc",
        settlementAccountNumber: "1014892841",
        settlementAccountName: "Fidson Healthcare Plc",

        assignedCreditLimit: 25000000,
        creditRatingTier: "A",

        kycReviewNotes:
            "Complete regulatory submission received. Awaiting final administrative approval.",
        createdAt: "2026-08-12T09:30:00.000Z",
    },

    {
        id: "sup-002",
        name: "May & Baker Nigeria",
        organization: "May & Baker Nigeria Plc",
        email: "regulatory@may-baker.com",
        phone: "+234 1 279 1000",
        role: "SUPPLIER",

        state: "Lagos",
        lga: "Ikeja",
        address: "3, Sapara Street, Industrial Estate, Ikeja, Lagos",

        supplierType: "IMPORTER",
        supplierApprovalStatus: "APPROVED",

        licenseNumber: "PCN-REG-000921",
        pcnPremisesLicense: "PCN-PREM-2026-00421",
        nafdacGdpLicense: "NAFDAC/GDP/2026/0078",
        taxIdentificationNumber: "TIN-00982177-0002",

        isColdChainCertified: true,
        coldChainCapacityM3: 310,
        backupPowerSpec:
            "Dual 750kVA generators with automatic transfer and monitored backup systems.",

        settlementBankName: "Access Bank Plc",
        settlementAccountNumber: "1023847291",
        settlementAccountName: "May & Baker Nigeria Plc",

        assignedCreditLimit: 30000000,
        creditRatingTier: "A",

        kycReviewNotes:
            "Regulatory documentation verified. Supplier cleared for institutional procurement.",
        createdAt: "2026-07-18T10:00:00.000Z",
    },

    {
        id: "sup-003",
        name: "Emzor Pharmaceutical Industries",
        organization: "Emzor Pharmaceutical Industries Ltd",
        email: "compliance@emzor.com",
        phone: "+234 1 773 0714",
        role: "SUPPLIER",

        state: "Lagos",
        lga: "Isolo",
        address: "1A, Henry Carr Street, Ikeja, Lagos, Nigeria",

        supplierType: "DISTRIBUTOR",
        supplierApprovalStatus: "APPROVED",

        licenseNumber: "PCN-REG-002741",
        pcnPremisesLicense: "PCN-PREM-2026-00611",
        nafdacGdpLicense: "NAFDAC/GDP/2026/0219",
        taxIdentificationNumber: "TIN-00281174-0003",

        isColdChainCertified: true,
        coldChainCapacityM3: 145,
        backupPowerSpec:
            "500kVA Cummins generator with ATS and dedicated cold-room backup system.",

        settlementBankName: "GTBank Plc",
        settlementAccountNumber: "0129847321",
        settlementAccountName: "Emzor Pharmaceutical Industries Ltd",

        assignedCreditLimit: 15000000,
        creditRatingTier: "A",

        kycReviewNotes:
            "Distributor documentation and warehouse compliance successfully verified.",
        createdAt: "2026-07-24T11:20:00.000Z",
    },

    {
        id: "sup-004",
        name: "Swiss Pharma Nigeria",
        organization: "Swiss Pharma Nigeria Ltd",
        email: "operations@swipha.com",
        phone: "+234 1 774 6900",
        role: "SUPPLIER",

        state: "Lagos",
        lga: "Lagos Island",
        address: "23 Industrial Avenue, Lagos, Nigeria",

        supplierType: "DISTRIBUTOR",
        supplierApprovalStatus: "PENDING",

        licenseNumber: "PCN-REG-003812",
        pcnPremisesLicense: "PCN-PREM-2026-00783",
        nafdacGdpLicense: "NAFDAC/GDP/2026/0304",
        taxIdentificationNumber: "TIN-00372181-0004",

        isColdChainCertified: true,
        coldChainCapacityM3: 120,
        backupPowerSpec:
            "Dual 350kVA generators with automatic transfer switch and cold-room UPS.",

        settlementBankName: "First Bank Nigeria",
        settlementAccountNumber: "2018374920",
        settlementAccountName: "Swiss Pharma Nigeria Ltd",

        assignedCreditLimit: 12000000,
        creditRatingTier: "B",

        kycReviewNotes:
            "Application submitted and awaiting final statutory verification.",
        createdAt: "2026-08-20T13:45:00.000Z",
    },

    {
        id: "sup-005",
        name: "Juhel Nigeria Limited",
        organization: "Juhel Nigeria Limited",
        email: "admin@juhel.com",
        phone: "+234 803 000 1100",
        role: "SUPPLIER",

        state: "Anambra",
        lga: "Awka",
        address: "6 Industrial Layout, Awka, Anambra State, Nigeria",

        supplierType: "RETAILER",
        supplierApprovalStatus: "SUSPENDED",

        licenseNumber: "PCN-REG-004182",
        pcnPremisesLicense: "PCN-PREM-2025-01922",
        nafdacGdpLicense: "NAFDAC/GDP/2025/1188",
        taxIdentificationNumber: "TIN-00491281-0005",

        isColdChainCertified: false,
        coldChainCapacityM3: 0,
        backupPowerSpec: "200kVA standby generator with manual transfer system.",

        settlementBankName: "UBA Plc",
        settlementAccountNumber: "1028374612",
        settlementAccountName: "Juhel Nigeria Limited",

        assignedCreditLimit: 5000000,
        creditRatingTier: "C",

        kycReviewNotes:
            "Supplier placed under compliance review pending documentation update.",
        kycSuspensionReason:
            "Expired cold-chain certification and pending regulatory documentation renewal.",

        createdAt: "2026-06-14T08:20:00.000Z",
    },

    {
        id: "sup-006",
        name: "Neimeth Pharmaceuticals",
        organization: "Neimeth International Pharmaceuticals Plc",
        email: "regulatory@neimethplc.com",
        phone: "+234 1 269 4880",
        role: "SUPPLIER",

        state: "Lagos",
        lga: "Ikeja",
        address: "16B, Acme Road, Ogba Industrial Estate, Lagos",

        supplierType: "IMPORTER",
        supplierApprovalStatus: "REJECTED",

        licenseNumber: "PCN-REG-005291",
        pcnPremisesLicense: "PCN-PREM-2024-01421",
        nafdacGdpLicense: "",
        taxIdentificationNumber: "TIN-00581271-0006",

        isColdChainCertified: false,
        coldChainCapacityM3: 0,
        backupPowerSpec: "350kVA standby generator.",

        settlementBankName: "Sterling Bank Plc",
        settlementAccountNumber: "2019472810",
        settlementAccountName: "Neimeth International Pharmaceuticals Plc",

        assignedCreditLimit: 0,
        creditRatingTier: "UNRATED",

        kycReviewNotes:
            "Application failed mandatory GDP documentation review.",
        kycRejectionReason:
            "Required NAFDAC GDP permit documentation was not validated.",

        createdAt: "2026-05-21T15:10:00.000Z",
    },

    {
        id: "sup-007",
        name: "Pharmex Limited",
        organization: "Pharmex Limited",
        email: "compliance@pharmex.com",
        phone: "+234 802 334 1122",
        role: "SUPPLIER",

        state: "Rivers",
        lga: "Port Harcourt",
        address: "42 Aba Road, Port Harcourt, Rivers State, Nigeria",

        supplierType: "DISTRIBUTOR",
        supplierApprovalStatus: "PENDING",

        licenseNumber: "PCN-REG-006721",
        pcnPremisesLicense: "PCN-PREM-2026-00891",
        nafdacGdpLicense: "NAFDAC/GDP/2026/0398",
        taxIdentificationNumber: "TIN-00628192-0007",

        isColdChainCertified: true,
        coldChainCapacityM3: 85,
        backupPowerSpec:
            "250kVA generator with automatic transfer and monitored cold storage.",

        settlementBankName: "Access Bank Plc",
        settlementAccountNumber: "0138472910",
        settlementAccountName: "Pharmex Limited",

        assignedCreditLimit: 8000000,
        creditRatingTier: "B",

        kycReviewNotes:
            "Supplier application currently undergoing regulatory verification.",
        createdAt: "2026-08-28T10:15:00.000Z",
    },

    {
        id: "sup-008",
        name: "MedPlus Wholesale",
        organization: "MedPlus Wholesale Nigeria Ltd",
        email: "admin@medpluswholesale.com",
        phone: "+234 809 111 2233",
        role: "SUPPLIER",

        state: "Abuja",
        lga: "Garki",
        address: "18 Procurement District, Garki, Abuja, Nigeria",

        supplierType: "RETAILER",
        supplierApprovalStatus: "APPROVED",

        licenseNumber: "PCN-REG-007431",
        pcnPremisesLicense: "PCN-PREM-2026-01022",
        nafdacGdpLicense: "NAFDAC/GDP/2026/0471",
        taxIdentificationNumber: "TIN-00718271-0008",

        isColdChainCertified: false,
        coldChainCapacityM3: 0,
        backupPowerSpec: "150kVA standby generator.",

        settlementBankName: "Zenith Bank Plc",
        settlementAccountNumber: "1018273649",
        settlementAccountName: "MedPlus Wholesale Nigeria Ltd",

        assignedCreditLimit: 6000000,
        creditRatingTier: "B",

        kycReviewNotes:
            "Retail supplier verified and cleared for eligible procurement categories.",
        createdAt: "2026-07-30T09:40:00.000Z",
    },
];

/**
 * ============================================================
 * COMPONENT
 * ============================================================
 */

const SupplierKYCManagement: React.FC = () => {
    // Mock suppliers are now the local source of truth.
    const [allUsers, setAllUsers] =
        useState<MockSupplier[]>(initialMockSuppliers);

    // Filter state
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<
        "ALL" | SupplierApprovalStatus
    >("ALL");
    const [tierFilter, setTierFilter] = useState<"ALL" | SupplierType>("ALL");

    // Dossier modal state
    const [selectedSupplier, setSelectedSupplier] =
        useState<MockSupplier | null>(null);

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Review Form in Modal
    const [reviewTier, setReviewTier] =
        useState<SupplierType>("DISTRIBUTOR");

    const [reviewNotes, setReviewNotes] = useState("");
    const [actionReason, setActionReason] = useState("");

    const [assignedCreditLimit, setAssignedCreditLimit] =
        useState(10000000);

    const [creditRatingTier, setCreditRatingTier] =
        useState<CreditRatingTier>("A");

    const [checklist, setChecklist] = useState({
        cacVerified: true,
        pcnPremisesVerified: true,
        nafdacGdpVerified: true,
        coldChainVerified: true,
        superintendentVerified: true,
        bankAccountVerified: true,
    });

    // Action confirmation dialogs
    const [confirmAction, setConfirmAction] = useState<{
        type: "APPROVE" | "REJECT" | "SUSPEND" | "REINSTATE";
        supplier: MockSupplier;
    } | null>(null);

    /**
     * ============================================================
     * SUPPLIERS
     * ============================================================
     */

    const suppliers = useMemo(() => {
        return allUsers.filter((u) => u.role === "SUPPLIER");
    }, [allUsers]);

    /**
     * ============================================================
     * COUNTS
     * ============================================================
     */

    const counts = useMemo(() => {
        const total = suppliers.length;

        const pending = suppliers.filter(
            (s) => s.supplierApprovalStatus === "PENDING"
        ).length;

        const approved = suppliers.filter(
            (s) => s.supplierApprovalStatus === "APPROVED"
        ).length;

        const suspended = suppliers.filter(
            (s) => s.supplierApprovalStatus === "SUSPENDED"
        ).length;

        const rejected = suppliers.filter(
            (s) => s.supplierApprovalStatus === "REJECTED"
        ).length;

        return {
            total,
            pending,
            approved,
            suspended,
            rejected,
        };
    }, [suppliers]);

    /**
     * ============================================================
     * FILTERED SUPPLIERS
     * ============================================================
     */

    const filteredSuppliers = useMemo(() => {
        return suppliers.filter((sup) => {
            const s = searchTerm.toLowerCase().trim();

            const matchesSearch =
                !s ||
                sup.name.toLowerCase().includes(s) ||
                sup.organization.toLowerCase().includes(s) ||
                sup.licenseNumber.toLowerCase().includes(s) ||
                sup.pcnPremisesLicense.toLowerCase().includes(s) ||
                sup.nafdacGdpLicense.toLowerCase().includes(s) ||
                sup.email.toLowerCase().includes(s) ||
                sup.state.toLowerCase().includes(s);

            const matchesStatus =
                statusFilter === "ALL" ||
                sup.supplierApprovalStatus === statusFilter;

            const matchesTier =
                tierFilter === "ALL" || sup.supplierType === tierFilter;

            return matchesSearch && matchesStatus && matchesTier;
        });
    }, [suppliers, searchTerm, statusFilter, tierFilter]);

    /**
     * ============================================================
     * OPEN DOSSIER
     * ============================================================
     */

    const handleOpenDossier = (supplier: MockSupplier) => {
        setSelectedSupplier(supplier);

        setReviewTier(supplier.supplierType || "DISTRIBUTOR");

        setReviewNotes(supplier.kycReviewNotes || "");

        setActionReason(
            supplier.kycRejectionReason ||
            supplier.kycSuspensionReason ||
            ""
        );

        setAssignedCreditLimit(
            supplier.assignedCreditLimit || 10000000
        );

        setCreditRatingTier(
            supplier.creditRatingTier || "A"
        );

        setChecklist({
            cacVerified: true,
            pcnPremisesVerified: !!supplier.pcnPremisesLicense,
            nafdacGdpVerified: !!supplier.nafdacGdpLicense,
            coldChainVerified: !!supplier.isColdChainCertified,
            superintendentVerified: true,
            bankAccountVerified: !!supplier.settlementAccountNumber,
        });
    };

    /**
     * ============================================================
     * MOCK KYC STATUS UPDATE
     * ============================================================
     */

    const handleExecuteStatusChange = async (
        targetSupplier: MockSupplier,
        newStatus: SupplierApprovalStatus,
        reason?: string,
        tier?: SupplierType
    ) => {
        if (isSubmitting) return;

        try {
            setIsSubmitting(true);

            // Simulate backend processing.
            await new Promise((resolve) =>
                setTimeout(resolve, 900)
            );

            const updatedSupplier: MockSupplier = {
                ...targetSupplier,

                supplierApprovalStatus: newStatus,

                supplierType:
                    tier ||
                    targetSupplier.supplierType ||
                    "DISTRIBUTOR",

                kycReviewNotes:
                    reviewNotes ||
                    `Admin evaluated KYC on ${new Date().toLocaleDateString()}`,

                kycRejectionReason:
                    newStatus === "REJECTED"
                        ? reason ||
                        "Non-compliance with NAFDAC/PCN standards"
                        : undefined,

                kycSuspensionReason:
                    newStatus === "SUSPENDED"
                        ? reason || "Administrative suspension"
                        : undefined,

                assignedCreditLimit,

                creditRatingTier,

                isColdChainCertified:
                    checklist.coldChainVerified,
            };

            // Replace the supplier in local mock state.
            setAllUsers((currentSuppliers) =>
                currentSuppliers.map((supplier) =>
                    supplier.id === targetSupplier.id
                        ? updatedSupplier
                        : supplier
                )
            );

            // Keep selected supplier synchronized if the dossier is open.
            setSelectedSupplier((currentSupplier) =>
                currentSupplier?.id === targetSupplier.id
                    ? updatedSupplier
                    : currentSupplier
            );

            /**
             * Sonner notifications
             */
            if (newStatus === "APPROVED") {
                toast.success("Supplier Approved", {
                    description: `${targetSupplier.organization || targetSupplier.name
                        } is now active in the verified supplier pool.`,
                });
            } else if (newStatus === "SUSPENDED") {
                toast.warning("Supplier Suspended", {
                    description: `${targetSupplier.organization || targetSupplier.name
                        } has been removed from active procurement sourcing.`,
                });
            } else if (newStatus === "REJECTED") {
                toast.error("Supplier Application Rejected", {
                    description: `${targetSupplier.organization || targetSupplier.name
                        } has been disqualified from the active supplier pool.`,
                });
            } else {
                toast.info("Supplier Status Updated", {
                    description: `${targetSupplier.organization || targetSupplier.name
                        } status updated to ${newStatus}.`,
                });
            }

            setSelectedSupplier(null);
            setConfirmAction(null);
            setActionReason("");
        } catch (error) {
            console.error("Mock KYC update failed:", error);

            toast.error("Action Failed", {
                description:
                    "Could not update supplier KYC status.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    /**
     * ============================================================
     * RETURN UI
     * ============================================================
     */

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="">
                    <h2 className="font-display font-bold text-slate-900 text-lg flex items-center gap-2">
                        <Users className="hidden w-5 h-5 text-blue-600" />
                        <span>
                            Supplier Regulatory Onboarding & KYC Approval
                        </span>
                    </h2>

                    <p className="text-xs text-slate-500 mt-0.5">
                        Audit pharmaceutical wholesalers, importers, and distributors
                        against PCN premises permits, NAFDAC GDP standards, and cold
                        chain capacity.
                    </p>
                </div>

                {counts.pending > 0 && (
                    <div className="hidden lg:flex px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-xl text-xs font-semibold text-amber-800 items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />

                        <span>
                            {counts.pending} Application
                            {counts.pending > 1 ? "s" : ""} Awaiting Review
                        </span>
                    </div>
                )}
            </div>

            {/* KPI Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                        Registered Pool
                    </span>

                    <span className="text-xl font-bold font-mono text-slate-900 mt-1 block">
                        {counts.total}
                    </span>

                    <span className="text-[10.5px] text-slate-500 mt-0.5 block">
                        Total entities
                    </span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                    <span className="text-[11px] font-semibold text-amber-600 uppercase tracking-wider block">
                        Pending Approval
                    </span>

                    <span className="text-xl font-bold font-mono text-amber-700 mt-1 block">
                        {counts.pending}
                    </span>

                    <span className="text-[10.5px] text-slate-500 mt-0.5 block">
                        KYC queue
                    </span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                    <span className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider block">
                        Verified & Active
                    </span>

                    <span className="text-xl font-bold font-mono text-emerald-700 mt-1 block">
                        {counts.approved}
                    </span>

                    <span className="text-[10.5px] text-slate-500 mt-0.5 block">
                        Cleared for RFQs
                    </span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                    <span className="text-[11px] font-semibold text-red-600 uppercase tracking-wider block">
                        Suspended
                    </span>

                    <span className="text-xl font-bold font-mono text-red-700 mt-1 block">
                        {counts.suspended}
                    </span>

                    <span className="text-[10.5px] text-slate-500 mt-0.5 block">
                        Compliance holds
                    </span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                        Rejected
                    </span>

                    <span className="text-xl font-bold font-mono text-slate-600 mt-1 block">
                        {counts.rejected}
                    </span>

                    <span className="text-[10.5px] text-slate-500 mt-0.5 block">
                        Disqualified
                    </span>
                </div>
            </div>

            {/* Filter and Status Sub-Tabs */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
                {/* Status Navigation Pills */}
                <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-100 pb-3">
                    <button
                        onClick={() => setStatusFilter("ALL")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${statusFilter === "ALL"
                                ? "bg-blue-600 text-white"
                                : "text-slate-600 hover:bg-slate-100"
                            }`}
                    >
                        All Suppliers ({counts.total})
                    </button>

                    <button
                        onClick={() => setStatusFilter("PENDING")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${statusFilter === "PENDING"
                                ? "bg-amber-600 text-white"
                                : "text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200"
                            }`}
                    >
                        <Clock className="w-3.5 h-3.5" />

                        <span>
                            Pending Review ({counts.pending})
                        </span>
                    </button>

                    <button
                        onClick={() => setStatusFilter("APPROVED")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${statusFilter === "APPROVED"
                                ? "bg-emerald-600 text-white"
                                : "text-slate-600 hover:bg-slate-100"
                            }`}
                    >
                        <CheckCircle2 className="w-3.5 h-3.5" />

                        <span>
                            Approved ({counts.approved})
                        </span>
                    </button>

                    <button
                        onClick={() => setStatusFilter("SUSPENDED")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${statusFilter === "SUSPENDED"
                                ? "bg-red-600 text-white"
                                : "text-slate-600 hover:bg-slate-100"
                            }`}
                    >
                        <AlertTriangle className="w-3.5 h-3.5" />

                        <span>
                            Suspended ({counts.suspended})
                        </span>
                    </button>

                    <button
                        onClick={() => setStatusFilter("REJECTED")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${statusFilter === "REJECTED"
                                ? "bg-slate-800 text-white"
                                : "text-slate-600 hover:bg-slate-100"
                            }`}
                    >
                        <XCircle className="w-3.5 h-3.5" />

                        <span>
                            Rejected ({counts.rejected})
                        </span>
                    </button>
                </div>

                {/* Search & Tier Dropdown */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
                    <div className="relative flex-1 min-w-[240px]">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

                        <input
                            id="input-supplier-search"
                            type="text"
                            placeholder="Search by company name, PCN license, NAFDAC GDP, or state..."
                            value={searchTerm}
                            onChange={(e) =>
                                setSearchTerm(e.target.value)
                            }
                            className="w-full pl-9 pr-3.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <select
                            id="select-supplier-tier"
                            value={tierFilter}
                            onChange={(e) =>
                                setTierFilter(
                                    e.target.value as
                                    | "ALL"
                                    | SupplierType
                                )
                            }
                            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-blue-500"
                        >
                            <option value="ALL">All Tiers</option>

                            <option value="IMPORTER">
                                Importer (100% Weight)
                            </option>

                            <option value="DISTRIBUTOR">
                                Distributor (70% Weight)
                            </option>

                            <option value="RETAILER">
                                Retailer (40% Weight)
                            </option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Suppliers Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10.5px] border-b border-slate-100">
                            <tr>
                                <th className="py-3 px-4 font-semibold">
                                    Entity & Location
                                </th>

                                <th className="py-3 px-4 font-semibold">
                                    Tier & Weight
                                </th>

                                <th className="py-3 px-4 font-semibold">
                                    Regulatory Permits
                                </th>

                                <th className="py-3 px-4 font-semibold">
                                    Cold Storage Capacity
                                </th>

                                <th className="py-3 px-4 font-semibold">
                                    KYC Status
                                </th>

                                <th className="py-3 px-4 font-semibold text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">
                            {filteredSuppliers.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="py-12 text-center text-slate-400"
                                    >
                                        <Building2 className="w-8 h-8 mx-auto mb-2 text-slate-300" />

                                        <p className="font-medium text-xs text-slate-600">
                                            No suppliers match current filter criteria.
                                        </p>
                                    </td>
                                </tr>
                            ) : (
                                filteredSuppliers.map((sup) => {
                                    const isApproved =
                                        sup.supplierApprovalStatus ===
                                        "APPROVED";

                                    const isPending =
                                        sup.supplierApprovalStatus ===
                                        "PENDING";

                                    const isSuspended =
                                        sup.supplierApprovalStatus ===
                                        "SUSPENDED";

                                    const isRejected =
                                        sup.supplierApprovalStatus ===
                                        "REJECTED";

                                    return (
                                        <tr
                                            key={sup.id}
                                            className="hover:bg-slate-50/80 transition"
                                        >
                                            {/* Entity & Location */}
                                            <td className="py-3.5 px-4">
                                                <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                                                    <span>
                                                        {sup.organization ||
                                                            sup.name}
                                                    </span>

                                                    {isApproved && (
                                                        <ShieldCheck
                                                            className="w-3.5 h-3.5 text-emerald-600 shrink-0"
                                                        //   title="Verified Supplier"
                                                        />
                                                    )}
                                                </div>

                                                <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                                                    {sup.email} •{" "}
                                                    {sup.phone ||
                                                        "+234 1 000 0000"}
                                                </div>

                                                <div className="text-[10.5px] text-slate-400 flex items-center gap-1 mt-0.5">
                                                    <MapPin className="w-3 h-3 text-slate-400" />

                                                    <span>
                                                        {sup.state || "Lagos"},
                                                        Nigeria
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Tier & Matching Weight */}
                                            <td className="py-3.5 px-4">
                                                <span
                                                    className={`text-[10px] font-bold px-2 py-0.5 rounded inline-block ${sup.supplierType ===
                                                            "IMPORTER"
                                                            ? "bg-emerald-100 text-emerald-800"
                                                            : sup.supplierType ===
                                                                "DISTRIBUTOR"
                                                                ? "bg-blue-100 text-blue-800"
                                                                : "bg-slate-100 text-slate-700"
                                                        }`}
                                                >
                                                    {sup.supplierType ||
                                                        "DISTRIBUTOR"}
                                                </span>

                                                <div className="text-[10px] text-slate-400 mt-1">
                                                    Algorithm Weight:{" "}
                                                    <span className="font-semibold text-slate-700">
                                                        {sup.supplierType ===
                                                            "IMPORTER"
                                                            ? "100%"
                                                            : sup.supplierType ===
                                                                "DISTRIBUTOR"
                                                                ? "70%"
                                                                : "40%"}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Regulatory Permits */}
                                            <td className="py-3.5 px-4">
                                                <div className="text-[11px] font-mono text-slate-800 font-medium">
                                                    PCN:{" "}
                                                    {sup.pcnPremisesLicense ||
                                                        sup.licenseNumber ||
                                                        "PCN-REG-PENDING"}
                                                </div>

                                                <div className="text-[10.5px] font-mono text-slate-500 mt-0.5">
                                                    GDP:{" "}
                                                    {sup.nafdacGdpLicense ||
                                                        "NAFDAC/GDP/PENDING"}
                                                </div>
                                            </td>

                                            {/* Cold Chain Storage */}
                                            <td className="py-3.5 px-4">
                                                <div className="flex items-center gap-1.5">
                                                    <ThermometerSnowflake
                                                        className={`w-3.5 h-3.5 ${sup.isColdChainCertified
                                                                ? "text-sky-600"
                                                                : "text-slate-300"
                                                            }`}
                                                    />

                                                    <span className="font-mono font-semibold text-slate-800 text-xs">
                                                        {sup.coldChainCapacityM3
                                                            ? `${sup.coldChainCapacityM3} m³`
                                                            : "Ambient only"}
                                                    </span>
                                                </div>

                                                {sup.isColdChainCertified && (
                                                    <span className="text-[9.5px] font-bold text-sky-700 bg-sky-50 px-1.5 py-0.2 rounded border border-sky-200 mt-0.5 inline-block">
                                                        Cold Chain Certified
                                                    </span>
                                                )}
                                            </td>

                                            {/* KYC Status */}
                                            <td className="py-3.5 px-4">
                                                <span
                                                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1 ${isApproved
                                                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                                            : isPending
                                                                ? "bg-amber-50 text-amber-800 border border-amber-200 animate-pulse"
                                                                : isSuspended
                                                                    ? "bg-red-50 text-red-800 border border-red-200"
                                                                    : "bg-slate-100 text-slate-600 border border-slate-200"
                                                        }`}
                                                >
                                                    {isPending && (
                                                        <Clock className="w-3 h-3" />
                                                    )}

                                                    {isApproved && (
                                                        <CheckCircle2 className="w-3 h-3" />
                                                    )}

                                                    {isSuspended && (
                                                        <AlertTriangle className="w-3 h-3" />
                                                    )}

                                                    {isRejected && (
                                                        <XCircle className="w-3 h-3" />
                                                    )}

                                                    <span>
                                                        {sup.supplierApprovalStatus}
                                                    </span>
                                                </span>
                                            </td>

                                            {/* Actions */}
                                            <td className="py-3.5 px-4 text-right space-x-1.5">
                                                <button
                                                    id={`btn-review-dossier-${sup.id}`}
                                                    onClick={() =>
                                                        handleOpenDossier(sup)
                                                    }
                                                    className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-[11px] font-semibold transition cursor-pointer inline-flex items-center gap-1"
                                                >
                                                    <Eye className="w-3 h-3" />

                                                    <span>
                                                        Review Dossier
                                                    </span>
                                                </button>

                                                {isPending && (
                                                    <button
                                                        id={`btn-quick-approve-${sup.id}`}
                                                        disabled={isSubmitting}
                                                        onClick={() =>
                                                            handleExecuteStatusChange(
                                                                sup,
                                                                "APPROVED"
                                                            )
                                                        }
                                                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-semibold transition cursor-pointer inline-flex items-center gap-1 shadow-2xs disabled:opacity-50"
                                                    >
                                                        <Check className="w-3 h-3" />

                                                        <span>Approve</span>
                                                    </button>
                                                )}

                                                {isApproved && (
                                                    <button
                                                        id={`btn-suspend-sup-${sup.id}`}
                                                        disabled={isSubmitting}
                                                        onClick={() =>
                                                            setConfirmAction({
                                                                type: "SUSPEND",
                                                                supplier: sup,
                                                            })
                                                        }
                                                        className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg text-[11px] font-semibold transition cursor-pointer disabled:opacity-50"
                                                    >
                                                        Suspend
                                                    </button>
                                                )}

                                                {isSuspended && (
                                                    <button
                                                        id={`btn-reinstate-sup-${sup.id}`}
                                                        disabled={isSubmitting}
                                                        onClick={() =>
                                                            setConfirmAction({
                                                                type: "REINSTATE",
                                                                supplier: sup,
                                                            })
                                                        }
                                                        className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-[11px] font-semibold transition cursor-pointer disabled:opacity-50"
                                                    >
                                                        Reinstate
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ======================================================
          SUPPLIER KYC REVIEW DOSSIER MODAL
          ====================================================== */}
            {selectedSupplier && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
                    <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-xl overflow-hidden my-8 max-h-[92vh] flex flex-col">
                        {/* Modal Header */}
                        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                                    <Building2 className="w-5 h-5" />
                                </div>

                                <div>
                                    <h3 className="font-display font-bold text-slate-900 text-base flex items-center gap-2">
                                        <span>
                                            {selectedSupplier.organization ||
                                                selectedSupplier.name}
                                        </span>

                                        <span
                                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${selectedSupplier.supplierApprovalStatus ===
                                                    "APPROVED"
                                                    ? "bg-emerald-100 text-emerald-800"
                                                    : selectedSupplier.supplierApprovalStatus ===
                                                        "PENDING"
                                                        ? "bg-amber-100 text-amber-800"
                                                        : selectedSupplier.supplierApprovalStatus ===
                                                            "SUSPENDED"
                                                            ? "bg-red-100 text-red-800"
                                                            : "bg-slate-200 text-slate-700"
                                                }`}
                                        >
                                            {
                                                selectedSupplier.supplierApprovalStatus
                                            }
                                        </span>
                                    </h3>

                                    <p className="text-[11px] text-slate-500">
                                        Pharmaceutical Supplier KYC &
                                        Regulatory Compliance Dossier
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() =>
                                    setSelectedSupplier(null)
                                }
                                className="text-slate-400 hover:text-slate-600 p-1"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Scrollable Body */}
                        <div className="p-6 overflow-y-auto space-y-6 text-xs flex-1">
                            {/* SECTION 1 */}
                            <div className="space-y-2">
                                <h4 className="font-display font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                                    <Building2 className="w-3.5 h-3.5 text-blue-600" />

                                    <span>
                                        1. Corporate Identity & Legal Address
                                    </span>
                                </h4>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                                    <div>
                                        <span className="text-[10.5px] text-slate-400 block">
                                            Corporate Name
                                        </span>

                                        <span className="font-semibold text-slate-900 text-xs mt-0.5 block">
                                            {selectedSupplier.organization ||
                                                selectedSupplier.name}
                                        </span>
                                    </div>

                                    <div>
                                        <span className="text-[10.5px] text-slate-400 block">
                                            Contact Email
                                        </span>

                                        <span className="font-mono text-slate-700 text-xs mt-0.5 block">
                                            {selectedSupplier.email}
                                        </span>
                                    </div>

                                    <div>
                                        <span className="text-[10.5px] text-slate-400 block">
                                            Dispatch Phone
                                        </span>

                                        <span className="font-mono text-slate-700 text-xs mt-0.5 block">
                                            {selectedSupplier.phone}
                                        </span>
                                    </div>

                                    <div className="sm:col-span-2">
                                        <span className="text-[10.5px] text-slate-400 block">
                                            Physical Depot / Warehouse
                                        </span>

                                        <span className="text-slate-800 text-xs mt-0.5 block">
                                            {selectedSupplier.address}
                                        </span>
                                    </div>

                                    <div>
                                        <span className="text-[10.5px] text-slate-400 block">
                                            Jurisdiction / State
                                        </span>

                                        <span className="font-semibold text-slate-900 text-xs mt-0.5 block">
                                            {selectedSupplier.state} (
                                            {selectedSupplier.lga})
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* SECTION 2 */}
                            <div className="space-y-2">
                                <h4 className="font-display font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />

                                    <span>
                                        2. Regulatory Licenses & Quality Assurance
                                    </span>
                                </h4>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                                    <div>
                                        <span className="text-[10.5px] text-slate-400 block">
                                            PCN Premises License
                                        </span>

                                        <span className="font-mono font-bold text-slate-900 text-xs mt-0.5 block">
                                            {selectedSupplier.pcnPremisesLicense ||
                                                selectedSupplier.licenseNumber ||
                                                "PCN-PREM-2024-PENDING"}
                                        </span>

                                        <span className="text-[10px] text-emerald-600 flex items-center gap-1 mt-0.5">
                                            <Check className="w-3 h-3" />
                                            Validated with PCN Registry
                                        </span>
                                    </div>

                                    <div>
                                        <span className="text-[10.5px] text-slate-400 block">
                                            NAFDAC GDP Permit
                                        </span>

                                        <span className="font-mono font-bold text-slate-900 text-xs mt-0.5 block">
                                            {selectedSupplier.nafdacGdpLicense ||
                                                "NAFDAC/GDP/2024/091"}
                                        </span>

                                        <span
                                            className={`text-[10px] flex items-center gap-1 mt-0.5 ${selectedSupplier.nafdacGdpLicense
                                                    ? "text-emerald-600"
                                                    : "text-red-600"
                                                }`}
                                        >
                                            <Check className="w-3 h-3" />

                                            {selectedSupplier.nafdacGdpLicense
                                                ? "Good Distribution Practice"
                                                : "GDP Documentation Pending"}
                                        </span>
                                    </div>

                                    <div>
                                        <span className="text-[10.5px] text-slate-400 block">
                                            Tax Identification Number
                                        </span>

                                        <span className="font-mono font-bold text-slate-900 text-xs mt-0.5 block">
                                            {selectedSupplier.taxIdentificationNumber ||
                                                "TIN-00192847-0001"}
                                        </span>

                                        <span className="text-[10px] text-emerald-600 flex items-center gap-1 mt-0.5">
                                            <Check className="w-3 h-3" />
                                            FIRS Active Clearance
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* SECTION 3 */}
                            <div className="space-y-2">
                                <h4 className="font-display font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                                    <ThermometerSnowflake className="w-3.5 h-3.5 text-sky-600" />

                                    <span>
                                        3. Logistics, Storage & Cold Room Audit
                                    </span>
                                </h4>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                                    <div className="flex items-start gap-2.5">
                                        <div className="p-2 rounded-lg bg-sky-100 text-sky-700">
                                            <ThermometerSnowflake className="w-4 h-4" />
                                        </div>

                                        <div>
                                            <span className="font-semibold text-slate-900 block text-xs">
                                                Certified Cold Storage:{" "}
                                                {selectedSupplier.coldChainCapacityM3 ||
                                                    150}{" "}
                                                m³
                                            </span>

                                            <p className="text-[11px] text-slate-500 mt-0.5">
                                                Calibrated walk-in cold rooms
                                                maintained at +2°C to +8°C with
                                                digital continuous data loggers.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-2.5">
                                        <div className="p-2 rounded-lg bg-amber-100 text-amber-700">
                                            <Zap className="w-4 h-4" />
                                        </div>

                                        <div>
                                            <span className="font-semibold text-slate-900 block text-xs">
                                                Uninterrupted Power Spec
                                            </span>

                                            <p className="text-[11px] text-slate-500 mt-0.5">
                                                {selectedSupplier.backupPowerSpec ||
                                                    "Dual 500kVA Cummins Diesel Generators with Automatic Transfer Switch (ATS)."}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* SECTION 4 */}
                            <div className="space-y-2">
                                <h4 className="font-display font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                                    <CreditCard className="w-3.5 h-3.5 text-blue-600" />

                                    <span>
                                        4. NIBSS / Central Bank Settlement Details
                                    </span>
                                </h4>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-blue-50/50 p-3.5 rounded-xl border border-blue-100">
                                    <div>
                                        <span className="text-[10.5px] text-slate-400 block">
                                            Settlement Bank
                                        </span>

                                        <span className="font-bold text-slate-900 text-xs mt-0.5 block">
                                            {selectedSupplier.settlementBankName}
                                        </span>
                                    </div>

                                    <div>
                                        <span className="text-[10.5px] text-slate-400 block">
                                            10-Digit NUBAN Account
                                        </span>

                                        <span className="font-mono font-bold text-blue-700 text-xs mt-0.5 block">
                                            {selectedSupplier.settlementAccountNumber}
                                        </span>
                                    </div>

                                    <div>
                                        <span className="text-[10.5px] text-slate-400 block">
                                            NIBSS Account Name
                                        </span>

                                        <span className="font-bold text-slate-900 text-xs mt-0.5 block truncate">
                                            {selectedSupplier.settlementAccountName}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* SECTION 5 */}
                            <div className="space-y-2">
                                <h4 className="font-display font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />

                                    <span>
                                        5. Admin Statutory Verification Checklist
                                    </span>
                                </h4>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={checklist.cacVerified}
                                            onChange={(e) =>
                                                setChecklist({
                                                    ...checklist,
                                                    cacVerified:
                                                        e.target.checked,
                                                })
                                            }
                                            className="rounded text-blue-600"
                                        />

                                        <span className="text-slate-700 text-xs">
                                            CAC Certificate of Incorporation
                                            verified
                                        </span>
                                    </label>

                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={
                                                checklist.pcnPremisesVerified
                                            }
                                            onChange={(e) =>
                                                setChecklist({
                                                    ...checklist,
                                                    pcnPremisesVerified:
                                                        e.target.checked,
                                                })
                                            }
                                            className="rounded text-blue-600"
                                        />

                                        <span className="text-slate-700 text-xs">
                                            PCN Premises Annual Retention valid
                                        </span>
                                    </label>

                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={
                                                checklist.nafdacGdpVerified
                                            }
                                            onChange={(e) =>
                                                setChecklist({
                                                    ...checklist,
                                                    nafdacGdpVerified:
                                                        e.target.checked,
                                                })
                                            }
                                            className="rounded text-blue-600"
                                        />

                                        <span className="text-slate-700 text-xs">
                                            NAFDAC GDP inspection certificate
                                            cleared
                                        </span>
                                    </label>

                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={
                                                checklist.coldChainVerified
                                            }
                                            onChange={(e) =>
                                                setChecklist({
                                                    ...checklist,
                                                    coldChainVerified:
                                                        e.target.checked,
                                                })
                                            }
                                            className="rounded text-blue-600"
                                        />

                                        <span className="text-slate-700 text-xs">
                                            Cold room temperature excursion data
                                            logged
                                        </span>
                                    </label>

                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={
                                                checklist.superintendentVerified
                                            }
                                            onChange={(e) =>
                                                setChecklist({
                                                    ...checklist,
                                                    superintendentVerified:
                                                        e.target.checked,
                                                })
                                            }
                                            className="rounded text-blue-600"
                                        />

                                        <span className="text-slate-700 text-xs">
                                            Superintendent Pharmacist practicing
                                            license current
                                        </span>
                                    </label>

                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={
                                                checklist.bankAccountVerified
                                            }
                                            onChange={(e) =>
                                                setChecklist({
                                                    ...checklist,
                                                    bankAccountVerified:
                                                        e.target.checked,
                                                })
                                            }
                                            className="rounded text-blue-600"
                                        />

                                        <span className="text-slate-700 text-xs">
                                            NIBSS bank settlement match verified
                                        </span>
                                    </label>
                                </div>
                            </div>

                            {/* SECTION 6 */}
                            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                                <span className="font-display font-bold text-slate-900 block text-xs uppercase tracking-wider">
                                    6. Classification Tier & Matching Algorithm
                                    Weight Assignment
                                </span>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div>
                                        <label className="font-semibold text-slate-700 block mb-1">
                                            Supplier Tier
                                        </label>

                                        <select
                                            value={reviewTier}
                                            onChange={(e) =>
                                                setReviewTier(
                                                    e.target.value as SupplierType
                                                )
                                            }
                                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500 font-semibold"
                                        >
                                            <option value="IMPORTER">
                                                IMPORTER (100% Matching Weight)
                                            </option>

                                            <option value="DISTRIBUTOR">
                                                DISTRIBUTOR (70% Matching Weight)
                                            </option>

                                            <option value="RETAILER">
                                                RETAILER (40% Matching Weight)
                                            </option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="font-semibold text-slate-700 block mb-1">
                                            Credit Assessment Tier
                                        </label>

                                        <select
                                            value={creditRatingTier}
                                            onChange={(e) =>
                                                setCreditRatingTier(
                                                    e.target
                                                        .value as CreditRatingTier
                                                )
                                            }
                                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500"
                                        >
                                            <option value="A">
                                                Grade A (Prime Institutional
                                                Supplier)
                                            </option>

                                            <option value="B">
                                                Grade B (Standard Commercial
                                                Supplier)
                                            </option>

                                            <option value="C">
                                                Grade C (Restricted / High
                                                Monitoring)
                                            </option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="font-semibold text-slate-700 block mb-1">
                                            Assigned Sourcing Limit (₦)
                                        </label>

                                        <input
                                            type="number"
                                            step="1000000"
                                            value={assignedCreditLimit}
                                            onChange={(e) =>
                                                setAssignedCreditLimit(
                                                    Number(e.target.value)
                                                )
                                            }
                                            className="w-full px-3 py-2 font-mono bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Reviewer Notes */}
                            <div className="space-y-1">
                                <label className="font-semibold text-slate-700 block">
                                    Admin Regulatory Auditor Notes /
                                    Justification
                                </label>

                                <textarea
                                    rows={2}
                                    value={reviewNotes}
                                    onChange={(e) =>
                                        setReviewNotes(e.target.value)
                                    }
                                    placeholder="Record verification remarks, GDP audit reference number, or reason for status update..."
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white text-xs"
                                />
                            </div>

                            {/* Existing Suspension / Rejection Reason */}
                            {(selectedSupplier.supplierApprovalStatus ===
                                "SUSPENDED" ||
                                selectedSupplier.supplierApprovalStatus ===
                                "REJECTED") && (
                                    <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-xs">
                                        <span className="font-bold text-red-800 block">
                                            Current Action Reason:
                                        </span>

                                        <p className="text-red-700 mt-0.5">
                                            {selectedSupplier.kycSuspensionReason ||
                                                selectedSupplier.kycRejectionReason ||
                                                "Non-compliance"}
                                        </p>
                                    </div>
                                )}
                        </div>

                        {/* Modal Actions Footer */}
                        <div className="p-4 border-t border-slate-100 bg-slate-50 flex flex-wrap items-center justify-between gap-3 shrink-0">
                            <div className="flex items-center gap-2">
                                {selectedSupplier.supplierApprovalStatus !==
                                    "APPROVED" && (
                                        <button
                                            id="btn-modal-approve-kyc"
                                            type="button"
                                            disabled={isSubmitting}
                                            onClick={() =>
                                                handleExecuteStatusChange(
                                                    selectedSupplier,
                                                    "APPROVED",
                                                    undefined,
                                                    reviewTier
                                                )
                                            }
                                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-xs"
                                        >
                                            <CheckCircle2 className="w-4 h-4" />

                                            <span>
                                                {isSubmitting
                                                    ? "Processing..."
                                                    : "Approve KYC & Activate Sourcing"}
                                            </span>
                                        </button>
                                    )}

                                {selectedSupplier.supplierApprovalStatus ===
                                    "APPROVED" && (
                                        <button
                                            id="btn-modal-suspend"
                                            type="button"
                                            disabled={isSubmitting}
                                            onClick={() =>
                                                setConfirmAction({
                                                    type: "SUSPEND",
                                                    supplier: selectedSupplier,
                                                })
                                            }
                                            className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl font-semibold transition cursor-pointer"
                                        >
                                            Suspend Supplier
                                        </button>
                                    )}

                                {selectedSupplier.supplierApprovalStatus ===
                                    "SUSPENDED" && (
                                        <button
                                            id="btn-modal-reinstate"
                                            type="button"
                                            disabled={isSubmitting}
                                            onClick={() =>
                                                handleExecuteStatusChange(
                                                    selectedSupplier,
                                                    "APPROVED",
                                                    undefined,
                                                    reviewTier
                                                )
                                            }
                                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer"
                                        >
                                            <CheckCircle2 className="w-4 h-4" />

                                            <span>
                                                Reinstate to Verified Pool
                                            </span>
                                        </button>
                                    )}

                                {selectedSupplier.supplierApprovalStatus ===
                                    "PENDING" && (
                                        <button
                                            id="btn-modal-reject"
                                            type="button"
                                            disabled={isSubmitting}
                                            onClick={() =>
                                                setConfirmAction({
                                                    type: "REJECT",
                                                    supplier: selectedSupplier,
                                                })
                                            }
                                            className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl font-semibold transition cursor-pointer"
                                        >
                                            Reject Application
                                        </button>
                                    )}
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setSelectedSupplier(null)
                                    }
                                    className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-semibold transition cursor-pointer"
                                >
                                    Close Dossier
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ======================================================
          CONFIRM SUSPEND / REJECT / REINSTATE DIALOG
          ====================================================== */}
            {confirmAction && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
                    <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-xl p-5 space-y-4">
                        <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${confirmAction.type === "REINSTATE"
                                    ? "bg-emerald-50 text-emerald-600"
                                    : "bg-red-50 text-red-600"
                                }`}
                        >
                            <AlertTriangle className="w-5 h-5" />
                        </div>

                        <div>
                            <h3 className="font-display font-bold text-slate-900 text-sm">
                                Confirm {confirmAction.type} for{" "}
                                {confirmAction.supplier.organization ||
                                    confirmAction.supplier.name}
                            </h3>

                            <p className="text-xs text-slate-500 mt-1">
                                {confirmAction.type === "SUSPEND"
                                    ? "Suspended suppliers cannot receive hospital procurement orders or participate in the automated algorithm."
                                    : confirmAction.type === "REJECT"
                                        ? "Rejecting this entity will disqualify their current credentials. A notification with reasons will be logged."
                                        : "Reinstating this supplier will re-enable their active bidding and warehouse stock."}
                            </p>
                        </div>

                        {confirmAction.type !== "REINSTATE" && (
                            <div className="space-y-1">
                                <label className="font-semibold text-slate-700 text-xs block">
                                    Mandatory Statutory Reason / Finding *
                                </label>

                                <textarea
                                    rows={2}
                                    required
                                    value={actionReason}
                                    onChange={(e) =>
                                        setActionReason(e.target.value)
                                    }
                                    placeholder="e.g. Expired NAFDAC GDP permit, failed temperature excursion log, or incorrect bank NUBAN..."
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs focus:outline-none focus:border-blue-500"
                                />
                            </div>
                        )}

                        <div className="flex items-center justify-end gap-2.5 pt-2">
                            <button
                                type="button"
                                onClick={() =>
                                    setConfirmAction(null)
                                }
                                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                disabled={
                                    isSubmitting ||
                                    (confirmAction.type !==
                                        "REINSTATE" &&
                                        !actionReason.trim())
                                }
                                onClick={() => {
                                    const targetStatus: SupplierApprovalStatus =
                                        confirmAction.type ===
                                            "REINSTATE"
                                            ? "APPROVED"
                                            : confirmAction.type ===
                                                "SUSPEND"
                                                ? "SUSPENDED"
                                                : "REJECTED";

                                    handleExecuteStatusChange(
                                        confirmAction.supplier,
                                        targetStatus,
                                        actionReason
                                    );
                                }}
                                className={`px-4 py-2 rounded-xl text-xs font-bold text-white transition cursor-pointer disabled:opacity-50 ${confirmAction.type === "REINSTATE"
                                        ? "bg-emerald-600 hover:bg-emerald-700"
                                        : "bg-red-600 hover:bg-red-700"
                                    }`}
                            >
                                <span>
                                    {isSubmitting
                                        ? "Processing..."
                                        : `Confirm ${confirmAction.type}`}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SupplierKYCManagement;