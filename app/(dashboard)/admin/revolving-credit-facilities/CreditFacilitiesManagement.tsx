"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  CreditCard,
  Building2,
  Sliders,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  PlusCircle,
  History,
  Save,
  RefreshCw,
  Sparkles,
  Lock,
  X,
  Check,
} from "lucide-react";
import { toast } from "sonner";

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

type CreditStatus =
  | "ACTIVE"
  | "APPROVED"
  | "FROZEN"
  | "SUSPENDED"
  | "PENDING";

type CreditRatingTier =
  | "AAA"
  | "AA"
  | "A"
  | "B"
  | "C"
  | "UNRATED";

type CreditTransactionType =
  | "CREDIT_PURCHASE"
  | "CREDIT_TOP_UP"
  | "LIMIT_ADJUSTMENT"
  | "CREDIT_REPAYMENT";

type CreditTransactionDirection = "CHARGE" | "CREDIT";

interface CreditTransaction {
  id: string;
  type: CreditTransactionType;
  direction: CreditTransactionDirection;
  description: string;
  reference: string;
  amount: number;
  balanceAfter: number;
  createdAt: string;
}

interface CreditUser {
  id: string;
  name: string;
  organization?: string;
  role: string;
  creditRatingTier?: CreditRatingTier;
}

interface CreditAccount {
  creditLimit: number;
  availableCredit: number;
  creditUsed: number;
  outstandingBalance: number;
  status: CreditStatus;
  creditRatingTier?: CreditRatingTier;
  terms: string;
  interestRatePercent: number;
  dueDate: string;
}

interface CreditAccountWithUser {
  user: CreditUser;
  account: CreditAccount;
}

interface PlatformConfig {
  defaultCommissionPercent: number;
  matchingWeights: {
    availabilityWeight: number;
    priceWeight: number;
    supplierTypeWeight: number;
    fulfillmentWeight: number;
    reliabilityWeight: number;
  };
  minCreditApprovalLimit: number;
  maxCreditApprovalLimit: number;
  totalCreditPoolLimit: number;
  defaultCreditTerms: string;
  autoAdvanceSupplierTimeoutSeconds: number;
}

interface Portfolio {
  totalCreditLimit: number;
  totalCreditExposure: number;
  totalAvailableCredit: number;
  totalCreditUsed: number;
  activeFacilitiesCount: number;
  totalAccountsCount: number;
  utilizationRate: number;
  poolLimit: number;
  poolHeadroom: number;
}

/* -------------------------------------------------------------------------- */
/* MOCK DATA                                                                  */
/* -------------------------------------------------------------------------- */

const mockConfig: PlatformConfig = {
  defaultCommissionPercent: 10,
  matchingWeights: {
    availabilityWeight: 25,
    priceWeight: 35,
    supplierTypeWeight: 20,
    fulfillmentWeight: 10,
    reliabilityWeight: 10,
  },
  minCreditApprovalLimit: 500000,
  maxCreditApprovalLimit: 20000000,
  totalCreditPoolLimit: 50000000,
  defaultCreditTerms: "Net 30 Days Revolving Healthcare Facility",
  autoAdvanceSupplierTimeoutSeconds: 300,
};

const mockAccounts: CreditAccountWithUser[] = [
  {
    user: {
      id: "usr_001",
      name: "Dr. Michael Okoro",
      organization: "Lagos University Teaching Hospital",
      role: "BUYER",
      creditRatingTier: "AAA",
    },
    account: {
      creditLimit: 20000000,
      availableCredit: 14500000,
      creditUsed: 5500000,
      outstandingBalance: 5500000,
      status: "ACTIVE",
      creditRatingTier: "AAA",
      terms: "Net 45 Days Institutional Prime",
      interestRatePercent: 0,
      dueDate: "2026-10-15",
    },
  },
  {
    user: {
      id: "usr_002",
      name: "Pharm. Chidinma Eze",
      organization: "PrimeCare Specialist Hospital",
      role: "BUYER",
      creditRatingTier: "AA",
    },
    account: {
      creditLimit: 17000000,
      availableCredit: 11200000,
      creditUsed: 5800000,
      outstandingBalance: 5800000,
      status: "ACTIVE",
      creditRatingTier: "AA",
      terms: "Net 30 Days Revolving Facility",
      interestRatePercent: 0,
      dueDate: "2026-10-08",
    },
  },
  {
    user: {
      id: "usr_003",
      name: "Dr. Sarah Williams",
      organization: "Rivers State General Hospital",
      role: "BUYER",
      creditRatingTier: "A",
    },
    account: {
      creditLimit: 12000000,
      availableCredit: 8900000,
      creditUsed: 3100000,
      outstandingBalance: 3100000,
      status: "ACTIVE",
      creditRatingTier: "A",
      terms: "Net 30 Days Revolving Facility",
      interestRatePercent: 0,
      dueDate: "2026-10-01",
    },
  },
  {
    user: {
      id: "usr_004",
      name: "Dr. Emmanuel Johnson",
      organization: "MediPlus Medical Centre",
      role: "BUYER",
      creditRatingTier: "B",
    },
    account: {
      creditLimit: 7500000,
      availableCredit: 5200000,
      creditUsed: 2300000,
      outstandingBalance: 2300000,
      status: "ACTIVE",
      creditRatingTier: "B",
      terms: "Net 30 Days Revolving Facility",
      interestRatePercent: 0,
      dueDate: "2026-09-28",
    },
  },
  {
    user: {
      id: "usr_005",
      name: "Pharm. Blessing James",
      organization: "HealthFirst Community Pharmacy",
      role: "BUYER",
      creditRatingTier: "C",
    },
    account: {
      creditLimit: 3500000,
      availableCredit: 3500000,
      creditUsed: 0,
      outstandingBalance: 0,
      status: "ACTIVE",
      creditRatingTier: "C",
      terms: "Net 15 Days Community Line",
      interestRatePercent: 0,
      dueDate: "2026-09-23",
    },
  },
  {
    user: {
      id: "usr_006",
      name: "Dr. David Peters",
      organization: "Federal Medical Centre Owerri",
      role: "BUYER",
      creditRatingTier: "AA",
    },
    account: {
      creditLimit: 15000000,
      availableCredit: 6700000,
      creditUsed: 8300000,
      outstandingBalance: 8300000,
      status: "FROZEN",
      creditRatingTier: "AA",
      terms: "Net 45 Days Institutional Prime",
      interestRatePercent: 0,
      dueDate: "2026-09-20",
    },
  },
  {
    user: {
      id: "usr_007",
      name: "Dr. John Williams",
      organization: "CityMed Healthcare Centre",
      role: "BUYER",
      creditRatingTier: "UNRATED",
    },
    account: {
      creditLimit: 500000,
      availableCredit: 500000,
      creditUsed: 0,
      outstandingBalance: 0,
      status: "PENDING",
      creditRatingTier: "UNRATED",
      terms: "Net 30 Days Revolving Facility",
      interestRatePercent: 0,
      dueDate: "2026-09-30",
    },
  },
  {
    user: {
      id: "usr_008",
      name: "Pharm. Ada Nwosu",
      organization: "WellLife Pharmacy",
      role: "BUYER",
      creditRatingTier: "C",
    },
    account: {
      creditLimit: 3000000,
      availableCredit: 800000,
      creditUsed: 2200000,
      outstandingBalance: 2200000,
      status: "SUSPENDED",
      creditRatingTier: "C",
      terms: "Net 15 Days Community Line",
      interestRatePercent: 0,
      dueDate: "2026-09-15",
    },
  },
];

const mockTransactions: Record<string, CreditTransaction[]> = {
  usr_001: [
    {
      id: "tx_001",
      type: "CREDIT_PURCHASE",
      direction: "CHARGE",
      description: "Pharmaceutical procurement order",
      reference: "ORD-MED-10001",
      amount: 3500000,
      balanceAfter: 5500000,
      createdAt: "2026-09-05T10:30:00",
    },
    {
      id: "tx_002",
      type: "CREDIT_TOP_UP",
      direction: "CREDIT",
      description: "Approved facility headroom boost",
      reference: "TOPUP-ADM-10001",
      amount: 5000000,
      balanceAfter: 2000000,
      createdAt: "2026-08-28T14:20:00",
    },
    {
      id: "tx_003",
      type: "CREDIT_REPAYMENT",
      direction: "CREDIT",
      description: "Outstanding facility repayment",
      reference: "REP-10001",
      amount: 2500000,
      balanceAfter: 2000000,
      createdAt: "2026-08-20T09:15:00",
    },
  ],
  usr_002: [
    {
      id: "tx_004",
      type: "CREDIT_PURCHASE",
      direction: "CHARGE",
      description: "Medical supplies procurement",
      reference: "ORD-MED-10002",
      amount: 5800000,
      balanceAfter: 5800000,
      createdAt: "2026-09-04T12:45:00",
    },
  ],
  usr_003: [
    {
      id: "tx_005",
      type: "CREDIT_PURCHASE",
      direction: "CHARGE",
      description: "Hospital pharmaceutical order",
      reference: "ORD-MED-10003",
      amount: 3100000,
      balanceAfter: 3100000,
      createdAt: "2026-09-03T11:10:00",
    },
  ],
};

/* -------------------------------------------------------------------------- */
/* COMPONENT                                                                  */
/* -------------------------------------------------------------------------- */

export const CreditFacilitiesManagement: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [accounts, setAccounts] =
    useState<CreditAccountWithUser[]>(mockAccounts);

  const [config, setConfig] = useState<PlatformConfig>(mockConfig);

  const [portfolio, setPortfolio] = useState<Portfolio>({
    totalCreditLimit: 0,
    totalCreditExposure: 0,
    totalAvailableCredit: 0,
    totalCreditUsed: 0,
    activeFacilitiesCount: 0,
    totalAccountsCount: 0,
    utilizationRate: 0,
    poolLimit: mockConfig.totalCreditPoolLimit,
    poolHeadroom: mockConfig.totalCreditPoolLimit,
  });

  /* ------------------------------------------------------------------------ */
  /* FILTERS                                                                  */
  /* ------------------------------------------------------------------------ */

  const [searchTerm, setSearchTerm] = useState("");

  const [tierFilter, setTierFilter] = useState<
    "ALL" | CreditRatingTier
  >("ALL");

  const [statusFilter, setStatusFilter] =
    useState<"ALL" | CreditStatus>("ALL");

  /* ------------------------------------------------------------------------ */
  /* PLATFORM LIMITS                                                          */
  /* ------------------------------------------------------------------------ */

  const [minLimitInput, setMinLimitInput] = useState(
    mockConfig.minCreditApprovalLimit
  );

  const [maxLimitInput, setMaxLimitInput] = useState(
    mockConfig.maxCreditApprovalLimit
  );

  const [poolLimitInput, setPoolLimitInput] = useState(
    mockConfig.totalCreditPoolLimit
  );

  const [defaultTermsInput, setDefaultTermsInput] = useState(
    mockConfig.defaultCreditTerms
  );

  const [isSavingLimits, setIsSavingLimits] = useState(false);

  /* ------------------------------------------------------------------------ */
  /* CONFIG MODAL                                                             */
  /* ------------------------------------------------------------------------ */

  const [selectedForConfig, setSelectedForConfig] =
    useState<CreditAccountWithUser | null>(null);

  const [editTier, setEditTier] =
    useState<CreditRatingTier>("B");

  const [editLimit, setEditLimit] = useState(5000000);

  const [autoCalibrateLimit, setAutoCalibrateLimit] =
    useState(true);

  const [editStatus, setEditStatus] =
    useState<CreditStatus>("ACTIVE");

  const [editTerms, setEditTerms] = useState(
    "Net 30 Days Revolving Facility"
  );

  const [editInterest, setEditInterest] = useState(0);

  const [isSavingAccount, setIsSavingAccount] =
    useState(false);

  /* ------------------------------------------------------------------------ */
  /* TOP-UP MODAL                                                             */
  /* ------------------------------------------------------------------------ */

  const [selectedForTopUp, setSelectedForTopUp] =
    useState<CreditAccountWithUser | null>(null);

  const [topUpAmount, setTopUpAmount] = useState(1000000);

  const [topUpType, setTopUpType] = useState<
    "HEADROOM_BOOST" | "SETTLEMENT"
  >("HEADROOM_BOOST");

  const [topUpNotes, setTopUpNotes] = useState("");

  const [isToppingUp, setIsToppingUp] = useState(false);

  /* ------------------------------------------------------------------------ */
  /* LEDGER MODAL                                                             */
  /* ------------------------------------------------------------------------ */

  const [selectedForLedger, setSelectedForLedger] =
    useState<CreditAccountWithUser | null>(null);

  const [userTransactions, setUserTransactions] =
    useState<CreditTransaction[]>([]);

  const [loadingLedger, setLoadingLedger] = useState(false);

  /* ------------------------------------------------------------------------ */
  /* HELPERS                                                                  */
  /* ------------------------------------------------------------------------ */

  const formatCurrency = (amount: number) =>
    `₦${amount.toLocaleString("en-NG")}`;

  const calculatePortfolio = (
    data: CreditAccountWithUser[]
  ): Portfolio => {
    const totalCreditLimit = data.reduce(
      (sum, item) => sum + (item.account.creditLimit || 0),
      0
    );

    const totalAvailableCredit = data.reduce(
      (sum, item) => sum + (item.account.availableCredit || 0),
      0
    );

    const totalCreditUsed = data.reduce(
      (sum, item) => sum + (item.account.creditUsed || 0),
      0
    );

    const activeFacilitiesCount = data.filter(
      (item) =>
        item.account.status === "ACTIVE" ||
        item.account.status === "APPROVED"
    ).length;

    const totalAccountsCount = data.length;

    const utilizationRate =
      totalCreditLimit > 0
        ? Math.round((totalCreditUsed / totalCreditLimit) * 100)
        : 0;

    const poolLimit = config.totalCreditPoolLimit;

    const totalCreditExposure = totalCreditUsed;

    const poolHeadroom = Math.max(
      0,
      poolLimit - totalCreditExposure
    );

    return {
      totalCreditLimit,
      totalCreditExposure,
      totalAvailableCredit,
      totalCreditUsed,
      activeFacilitiesCount,
      totalAccountsCount,
      utilizationRate,
      poolLimit,
      poolHeadroom,
    };
  };

  /* ------------------------------------------------------------------------ */
  /* INITIAL LOAD                                                             */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    const timer = setTimeout(() => {
      setPortfolio(calculatePortfolio(accounts));
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  /* ------------------------------------------------------------------------ */
  /* REFRESH MOCK DATA                                                        */
  /* ------------------------------------------------------------------------ */

  const fetchData = async (silent = false) => {
    if (!silent) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }

    await new Promise((resolve) =>
      setTimeout(resolve, 500)
    );

    setAccounts([...mockAccounts]);
    setConfig({ ...mockConfig });

    setMinLimitInput(mockConfig.minCreditApprovalLimit);
    setMaxLimitInput(mockConfig.maxCreditApprovalLimit);
    setPoolLimitInput(mockConfig.totalCreditPoolLimit);
    setDefaultTermsInput(mockConfig.defaultCreditTerms);

    setPortfolio(calculatePortfolio(mockAccounts));

    setLoading(false);
    setRefreshing(false);

    toast.success("Credit facilities synchronized", {
      description:
        "Mock facility portfolio data has been refreshed.",
    });
  };

  /* ------------------------------------------------------------------------ */
  /* TIER RECOMMENDED LIMIT                                                   */
  /* ------------------------------------------------------------------------ */

  const getTierRecommendedLimit = (
    tier: CreditRatingTier,
    min = minLimitInput,
    max = maxLimitInput
  ) => {
    let limit = min;

    switch (tier) {
      case "AAA":
        limit = max;
        break;

      case "AA":
        limit = Math.round(min + (max - min) * 0.85);
        break;

      case "A":
        limit = Math.round(min + (max - min) * 0.6);
        break;

      case "B":
        limit = Math.round(min + (max - min) * 0.35);
        break;

      case "C":
        limit = Math.round(min + (max - min) * 0.15);
        break;

      case "UNRATED":
      default:
        limit = min;
        break;
    }

    limit = Math.round(limit / 100000) * 100000;

    return Math.max(min, Math.min(max, limit));
  };

  const handleTierSelection = (
    tier: CreditRatingTier
  ) => {
    setEditTier(tier);

    if (autoCalibrateLimit) {
      setEditLimit(
        getTierRecommendedLimit(
          tier,
          config.minCreditApprovalLimit,
          config.maxCreditApprovalLimit
        )
      );
    }
  };

  /* ------------------------------------------------------------------------ */
  /* SAVE PLATFORM LIMITS                                                    */
  /* ------------------------------------------------------------------------ */

  const handleSavePlatformLimits = async () => {
    if (minLimitInput <= 0 || maxLimitInput <= 0) {
      toast.error("Invalid Limits", {
        description:
          "Minimum and Maximum limits must be greater than ₦0.",
      });
      return;
    }

    if (minLimitInput > maxLimitInput) {
      toast.error("Invalid Range", {
        description:
          "Minimum Approval Limit cannot exceed Maximum Approval Limit.",
      });
      return;
    }

    if (poolLimitInput <= 0) {
      toast.error("Invalid Risk Pool", {
        description:
          "The total credit risk pool must be greater than ₦0.",
      });
      return;
    }

    setIsSavingLimits(true);

    await new Promise((resolve) =>
      setTimeout(resolve, 700)
    );

    const nextConfig = {
      ...config,
      minCreditApprovalLimit: minLimitInput,
      maxCreditApprovalLimit: maxLimitInput,
      totalCreditPoolLimit: poolLimitInput,
      defaultCreditTerms: defaultTermsInput,
    };

    setConfig(nextConfig);

    setPortfolio(
      calculatePortfolio(accounts)
    );

    setIsSavingLimits(false);

    toast.success("Platform Credit Policy Updated", {
      description: `Approved bounds: ${formatCurrency(
        minLimitInput
      )} – ${formatCurrency(maxLimitInput)}.`,
    });
  };

  /* ------------------------------------------------------------------------ */
  /* CONFIG ACCOUNT                                                           */
  /* ------------------------------------------------------------------------ */

  const openConfigModal = (
    item: CreditAccountWithUser
  ) => {
    setSelectedForConfig(item);

    const tier =
      item.account.creditRatingTier ||
      item.user.creditRatingTier ||
      "B";

    setEditTier(tier);
    setEditLimit(item.account.creditLimit);
    setAutoCalibrateLimit(false);
    setEditStatus(item.account.status);
    setEditTerms(
      item.account.terms ||
        "Net 30 Days Revolving Facility"
    );
    setEditInterest(
      item.account.interestRatePercent || 0
    );
  };

  const handleSaveUserAccount = async () => {
    if (!selectedForConfig) return;

    if (
      editLimit < config.minCreditApprovalLimit
    ) {
      toast.error("Limit Below Platform Minimum", {
        description: `Limit must be at least ${formatCurrency(
          config.minCreditApprovalLimit
        )}.`,
      });
      return;
    }

    if (
      editLimit > config.maxCreditApprovalLimit
    ) {
      toast.error("Limit Exceeds Platform Maximum", {
        description: `Limit cannot exceed ${formatCurrency(
          config.maxCreditApprovalLimit
        )}.`,
      });
      return;
    }

    setIsSavingAccount(true);

    await new Promise((resolve) =>
      setTimeout(resolve, 700)
    );

    setAccounts((current) =>
      current.map((item) => {
        if (
          item.user.id !==
          selectedForConfig.user.id
        ) {
          return item;
        }

        const creditUsed =
          item.account.creditUsed;

        return {
          ...item,
          user: {
            ...item.user,
            creditRatingTier: editTier,
          },
          account: {
            ...item.account,
            creditRatingTier: editTier,
            creditLimit: editLimit,
            availableCredit: Math.max(
              0,
              editLimit - creditUsed
            ),
            status: editStatus,
            terms: editTerms,
            interestRatePercent: editInterest,
          },
        };
      })
    );

    setIsSavingAccount(false);

    const organization =
      selectedForConfig.user.organization ||
      selectedForConfig.user.name;

    setSelectedForConfig(null);

    toast.success("Credit Facility Configured", {
      description: `${organization}: Tier ${editTier}, Limit ${formatCurrency(
        editLimit
      )}.`,
    });
  };

  /* ------------------------------------------------------------------------ */
  /* TOP-UP                                                                    */
  /* ------------------------------------------------------------------------ */

  const openTopUpModal = (
    item: CreditAccountWithUser
  ) => {
    setSelectedForTopUp(item);
    setTopUpAmount(1000000);
    setTopUpType("HEADROOM_BOOST");
    setTopUpNotes("");
  };

  const handleExecuteTopUp = async () => {
    if (!selectedForTopUp) return;

    if (topUpAmount <= 0) {
      toast.error("Invalid Amount", {
        description:
          "Top-up amount must be strictly greater than ₦0.",
      });
      return;
    }

    if (
      topUpType === "SETTLEMENT" &&
      topUpAmount >
        selectedForTopUp.account.outstandingBalance
    ) {
      toast.error("Invalid Settlement Amount", {
        description:
          "Settlement amount cannot exceed the outstanding balance.",
      });
      return;
    }

    setIsToppingUp(true);

    await new Promise((resolve) =>
      setTimeout(resolve, 700)
    );

    setAccounts((current) =>
      current.map((item) => {
        if (
          item.user.id !==
          selectedForTopUp.user.id
        ) {
          return item;
        }

        const currentAvailable =
          item.account.availableCredit;

        const currentOutstanding =
          item.account.outstandingBalance;

        if (topUpType === "SETTLEMENT") {
          const settlementAmount = Math.min(
            topUpAmount,
            currentOutstanding
          );

          return {
            ...item,
            account: {
              ...item.account,
              availableCredit:
                currentAvailable +
                settlementAmount,
              creditUsed: Math.max(
                0,
                item.account.creditUsed -
                  settlementAmount
              ),
              outstandingBalance: Math.max(
                0,
                currentOutstanding -
                  settlementAmount
              ),
            },
          };
        }

        return {
          ...item,
          account: {
            ...item.account,
            availableCredit:
              currentAvailable + topUpAmount,
            creditLimit:
              item.account.creditLimit +
              topUpAmount,
          },
        };
      })
    );

    setIsToppingUp(false);

    const organization =
      selectedForTopUp.user.organization ||
      selectedForTopUp.user.name;

    setSelectedForTopUp(null);

    toast.success("Credit Account Topped Up", {
      description: `${formatCurrency(
        topUpAmount
      )} credited to ${organization}.`,
    });
  };

  /* ------------------------------------------------------------------------ */
  /* LEDGER                                                                    */
  /* ------------------------------------------------------------------------ */

  const openLedgerModal = async (
    item: CreditAccountWithUser
  ) => {
    setSelectedForLedger(item);
    setLoadingLedger(true);

    await new Promise((resolve) =>
      setTimeout(resolve, 400)
    );

    setUserTransactions(
      mockTransactions[item.user.id] || []
    );

    setLoadingLedger(false);
  };

  /* ------------------------------------------------------------------------ */
  /* FILTERED ACCOUNTS                                                        */
  /* ------------------------------------------------------------------------ */

  const filteredAccounts = useMemo(() => {
    return accounts.filter((item) => {
      const organization =
        item.user.organization?.toLowerCase() || "";

      const userName =
        item.user.name?.toLowerCase() || "";

      const search =
        searchTerm.toLowerCase().trim();

      const matchesSearch =
        !search ||
        organization.includes(search) ||
        userName.includes(search);

      const itemTier =
        item.account.creditRatingTier ||
        item.user.creditRatingTier ||
        "UNRATED";

      const matchesTier =
        tierFilter === "ALL" ||
        itemTier === tierFilter;

      const matchesStatus =
        statusFilter === "ALL" ||
        item.account.status === statusFilter;

      return (
        matchesSearch &&
        matchesTier &&
        matchesStatus
      );
    });
  }, [
    accounts,
    searchTerm,
    tierFilter,
    statusFilter,
  ]);

  /* ------------------------------------------------------------------------ */
  /* BADGES                                                                    */
  /* ------------------------------------------------------------------------ */

  const getTierBadge = (
    tier?: CreditRatingTier
  ) => {
    switch (tier) {
      case "AAA":
        return (
          <span className="px-2 py-0.5 rounded-md font-mono text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-purple-600" />
            Tier AAA (Prime)
          </span>
        );

      case "AA":
        return (
          <span className="px-2 py-0.5 rounded-md font-mono text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-blue-600" />
            Tier AA (Major)
          </span>
        );

      case "A":
        return (
          <span className="px-2 py-0.5 rounded-md font-mono text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Tier A (Standard)
          </span>
        );

      case "B":
        return (
          <span className="px-2 py-0.5 rounded-md font-mono text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            Tier B (General)
          </span>
        );

      case "C":
        return (
          <span className="px-2 py-0.5 rounded-md font-mono text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            Tier C (Restricted)
          </span>
        );

      default:
        return (
          <span className="px-2 py-0.5 rounded-md font-mono text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
            UNRATED
          </span>
        );
    }
  };

  const getStatusBadge = (
    status: CreditStatus
  ) => {
    switch (status) {
      case "ACTIVE":
      case "APPROVED":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            ACTIVE
          </span>
        );

      case "FROZEN":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Lock className="w-2.5 h-2.5" />
            FROZEN
          </span>
        );

      case "SUSPENDED":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-2.5 h-2.5" />
            SUSPENDED
          </span>
        );

      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
            <Clock className="w-2.5 h-2.5" />
            PENDING
          </span>
        );
    }
  };

  /* ------------------------------------------------------------------------ */
  /* LOADING                                                                   */
  /* ------------------------------------------------------------------------ */

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-7 h-7 animate-spin mx-auto mb-3 text-blue-600" />
          <p className="text-sm font-semibold text-slate-700">
            Loading credit facilities...
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Initializing mock portfolio data
          </p>
        </div>
      </div>
    );
  }

  /* ------------------------------------------------------------------------ */
  /* RENDER                                                                    */
  /* ------------------------------------------------------------------------ */

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                <CreditCard className="w-5 h-5" />
              </div>

              <div>
                <h2 className="font-display font-bold text-slate-900 text-lg">
                  Credit Facilities Governance & Risk Management
                </h2>

                <p className="text-xs text-slate-500 mt-0.5">
                  Configure platform regulatory limits,
                  calibrate user Credit Rating Tiers,
                  and manage facility headroom.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => fetchData(true)}
            disabled={refreshing}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 disabled:opacity-50"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${
                refreshing ? "animate-spin" : ""
              }`}
            />

            {refreshing
              ? "Refreshing..."
              : "Sync Facilities"}
          </button>
        </div>

        {/* PORTFOLIO */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-5 border-t border-slate-100">

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Total Approved Facility Lines
            </span>

            <span className="font-mono text-xl font-bold text-slate-900 mt-1 block">
              {formatCurrency(
                portfolio.totalCreditLimit
              )}
            </span>

            <span className="text-[11px] text-slate-500 mt-1 block">
              Across {portfolio.activeFacilitiesCount} active healthcare facilities
            </span>
          </div>

          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
            <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider block">
              Total Available Headroom
            </span>

            <span className="font-mono text-xl font-bold text-emerald-900 mt-1 block">
              {formatCurrency(
                portfolio.totalAvailableCredit
              )}
            </span>

            <span className="text-[11px] text-emerald-700 mt-1 block font-medium">
              Ready for medical procurement
            </span>
          </div>

          <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
            <span className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider block">
              Active Exposure
            </span>

            <span className="font-mono text-xl font-bold text-amber-900 mt-1 block">
              {formatCurrency(
                portfolio.totalCreditExposure
              )}
            </span>

            <span className="text-[11px] text-amber-700 mt-1 block font-semibold">
              {portfolio.utilizationRate}% Portfolio Utilization
            </span>
          </div>

          <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
            <span className="text-[11px] font-semibold text-blue-800 uppercase tracking-wider block">
              Platform Risk Pool Ceiling
            </span>

            <span className="font-mono text-xl font-bold text-blue-900 mt-1 block">
              {formatCurrency(
                config.totalCreditPoolLimit
              )}
            </span>

            <span className="text-[11px] text-blue-700 mt-1 block">
              {formatCurrency(
                portfolio.poolHeadroom
              )} uncommitted reserve
            </span>
          </div>
        </div>
      </div>

      {/* PLATFORM POLICY */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-display font-bold text-slate-900 text-sm flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-600" />
              Platform Credit Approval Policy & Limits
            </h3>

            <p className="text-xs text-slate-500 mt-0.5">
              Configure global credit approval bounds and facility policy.
            </p>
          </div>

          <span className="text-[11px] px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-semibold border border-blue-200">
            Mock Policy Environment
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

          {/* MIN */}
          <div className="space-y-2 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <label className="text-xs font-bold text-slate-800">
              Minimum Approval Limit
            </label>

            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-400 font-mono text-xs">
                ₦
              </span>

              <input
                type="number"
                step="100000"
                value={minLimitInput}
                onChange={(e) =>
                  setMinLimitInput(
                    Number(e.target.value)
                  )
                }
                className="w-full pl-7 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <p className="text-[10.5px] text-slate-500">
              Floor for onboarding unrated and smaller healthcare facilities.
            </p>
          </div>

          {/* MAX */}
          <div className="space-y-2 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <label className="text-xs font-bold text-slate-800">
              Maximum Approval Limit
            </label>

            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-400 font-mono text-xs">
                ₦
              </span>

              <input
                type="number"
                step="500000"
                min={minLimitInput}
                value={maxLimitInput}
                onChange={(e) =>
                  setMaxLimitInput(
                    Number(e.target.value)
                  )
                }
                className="w-full pl-7 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <p className="text-[10.5px] text-slate-500">
              Maximum facility exposure available to a single account.
            </p>
          </div>

          {/* POOL */}
          <div className="space-y-2 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <label className="text-xs font-bold text-slate-800">
              Total Credit Risk Pool
            </label>

            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-400 font-mono text-xs">
                ₦
              </span>

              <input
                type="number"
                step="1000000"
                value={poolLimitInput}
                onChange={(e) =>
                  setPoolLimitInput(
                    Number(e.target.value)
                  )
                }
                className="w-full pl-7 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <p className="text-[10.5px] text-slate-500">
              Maximum aggregate platform credit liability.
            </p>
          </div>

          {/* TERMS */}
          <div className="space-y-2 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <label className="text-xs font-bold text-slate-800">
              Default Facility Tenor
            </label>

            <select
              value={defaultTermsInput}
              onChange={(e) =>
                setDefaultTermsInput(
                  e.target.value
                )
              }
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Net 15 Days Revolving Facility">
                Net 15 Days
              </option>

              <option value="Net 30 Days Revolving Healthcare Facility">
                Net 30 Days
              </option>

              <option value="Net 45 Days Institutional Prime Facility">
                Net 45 Days
              </option>

              <option value="Net 60 Days Federal Medical Centre Line">
                Net 60 Days
              </option>
            </select>

            <p className="text-[10.5px] text-slate-500">
              Standard repayment cycle for newly approved facilities.
            </p>
          </div>
        </div>

        {/* TIER MATRIX */}
        <div className="p-4 bg-slate-900 text-white rounded-xl space-y-3">

          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />

            <span className="text-xs font-bold uppercase tracking-wider">
              Dynamic Credit Rating Calibration Matrix
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {(
              [
                ["AAA", "Prime Federal Teaching"],
                ["AA", "Major Specialist"],
                ["A", "State General"],
                ["B", "Private Medical"],
                ["C", "Community Pharmacy"],
                ["UNRATED", "Probationary"],
              ] as const
            ).map(([tier, description]) => (
              <div
                key={tier}
                className="p-2.5 rounded-lg bg-white/5 border border-white/10"
              >
                <span className="text-[10px] text-slate-300 font-bold block uppercase">
                  Tier {tier}
                </span>

                <span className="font-mono font-bold text-sm block mt-0.5">
                  {formatCurrency(
                    getTierRecommendedLimit(
                      tier
                    )
                  )}
                </span>

                <span className="text-[10px] text-slate-400 block mt-0.5">
                  {description}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <button
            onClick={handleSavePlatformLimits}
            disabled={isSavingLimits}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 transition flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />

            {isSavingLimits
              ? "Saving Policy..."
              : "Deploy Platform Limits"}
          </button>
        </div>
      </div>

      {/* ACCOUNTS */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">

        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">

          <div>
            <h3 className="font-display font-bold text-slate-900 text-base flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              Manage User Credit Accounts & Tier Allocations
            </h3>

            <p className="text-xs text-slate-500 mt-0.5">
              Configure credit tiers, facility limits, status and available credit.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />

              <input
                type="text"
                placeholder="Search hospital or user..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
                className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 w-48 sm:w-60"
              />
            </div>

            <select
              value={tierFilter}
              onChange={(e) =>
                setTierFilter(
                  e.target.value as
                    | "ALL"
                    | CreditRatingTier
                )
              }
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
            >
              <option value="ALL">
                All Credit Tiers
              </option>
              <option value="AAA">
                Tier AAA
              </option>
              <option value="AA">
                Tier AA
              </option>
              <option value="A">
                Tier A
              </option>
              <option value="B">
                Tier B
              </option>
              <option value="C">
                Tier C
              </option>
              <option value="UNRATED">
                Unrated
              </option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value as
                    | "ALL"
                    | CreditStatus
                )
              }
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
            >
              <option value="ALL">
                All Statuses
              </option>
              <option value="ACTIVE">
                Active
              </option>
              <option value="FROZEN">
                Frozen
              </option>
              <option value="SUSPENDED">
                Suspended
              </option>
              <option value="PENDING">
                Pending
              </option>
            </select>
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">

            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10.5px] border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-4">
                  Healthcare Institution
                </th>
                <th className="py-3.5 px-4">
                  Credit Tier
                </th>
                <th className="py-3.5 px-4">
                  Approved Limit
                </th>
                <th className="py-3.5 px-4">
                  Available Credit
                </th>
                <th className="py-3.5 px-4">
                  Outstanding
                </th>
                <th className="py-3.5 px-4">
                  Utilization
                </th>
                <th className="py-3.5 px-4">
                  Status
                </th>
                <th className="py-3.5 px-4 text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">

              {filteredAccounts.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="py-10 text-center"
                  >
                    <CreditCard className="w-8 h-8 mx-auto mb-2 text-slate-300" />

                    <p className="text-sm font-semibold text-slate-600">
                      No credit accounts found
                    </p>
                  </td>
                </tr>
              ) : (
                filteredAccounts.map((item) => {

                  const limit =
                    item.account.creditLimit || 0;

                  const available =
                    item.account.availableCredit ||
                    0;

                  const used =
                    item.account.creditUsed || 0;

                  const percent =
                    limit > 0
                      ? Math.min(
                          100,
                          Math.round(
                            (used / limit) * 100
                          )
                        )
                      : 0;

                  const tier =
                    item.account
                      .creditRatingTier ||
                    item.user.creditRatingTier ||
                    "UNRATED";

                  return (
                    <tr
                      key={item.user.id}
                      className="hover:bg-slate-50/80 transition"
                    >

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900">
                          {item.user.organization ||
                            item.user.name}
                        </div>

                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {item.user.name}
                          <span className="mx-1.5 text-slate-300">
                            •
                          </span>
                          {item.user.role}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        {getTierBadge(tier)}
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold">
                        {formatCurrency(limit)}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                          {formatCurrency(available)}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`font-mono font-semibold ${
                            used > 0
                              ? "text-amber-700"
                              : "text-slate-400"
                          }`}
                        >
                          {formatCurrency(used)}
                        </span>

                        <span className="text-[10px] text-slate-400 block">
                          Due:{" "}
                          {new Date(
                            item.account.dueDate
                          ).toLocaleDateString(
                            "en-NG",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 w-32">
                        <div className="flex justify-between text-[10px] font-mono text-slate-500 mb-1">
                          <span>
                            {percent}%
                          </span>
                        </div>

                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              percent > 80
                                ? "bg-rose-500"
                                : percent > 50
                                ? "bg-amber-500"
                                : "bg-emerald-500"
                            }`}
                            style={{
                              width: `${percent}%`,
                            }}
                          />
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        {getStatusBadge(
                          item.account.status
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex justify-end items-center gap-1.5">

                          <button
                            onClick={() =>
                              openConfigModal(item)
                            }
                            className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-[11px] font-semibold transition flex items-center gap-1"
                          >
                            <Sliders className="w-3.5 h-3.5" />
                            Config
                          </button>

                          <button
                            onClick={() =>
                              openTopUpModal(item)
                            }
                            className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-[11px] font-semibold transition flex items-center gap-1"
                          >
                            <PlusCircle className="w-3.5 h-3.5" />
                            Top-Up
                          </button>

                          <button
                            onClick={() =>
                              openLedgerModal(item)
                            }
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
                            title="View Ledger"
                          >
                            <History className="w-4 h-4" />
                          </button>

                        </div>
                      </td>

                    </tr>
                  );
                })
              )}

            </tbody>
          </table>
        </div>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* CONFIG MODAL                                                         */}
      {/* -------------------------------------------------------------------- */}

      {selectedForConfig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">

          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto space-y-5">

            <div className="flex items-center justify-between pb-3 border-b border-slate-100">

              <div className="flex items-center gap-2.5">

                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                  <Sliders className="w-5 h-5" />
                </div>

                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    Configure Credit Facility
                  </h3>

                  <p className="text-xs text-slate-500">
                    {selectedForConfig.user.organization ||
                      selectedForConfig.user.name}
                  </p>
                </div>

              </div>

              <button
                onClick={() =>
                  setSelectedForConfig(null)
                }
                className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>

            </div>

            {/* SUMMARY */}
            <div className="grid grid-cols-3 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100">

              <div>
                <span className="text-[10px] text-slate-400 uppercase block">
                  Current Limit
                </span>

                <span className="font-mono font-bold text-slate-800">
                  {formatCurrency(
                    selectedForConfig.account
                      .creditLimit
                  )}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase block">
                  Available
                </span>

                <span className="font-mono font-bold text-emerald-600">
                  {formatCurrency(
                    selectedForConfig.account
                      .availableCredit
                  )}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase block">
                  Outstanding
                </span>

                <span className="font-mono font-bold text-amber-600">
                  {formatCurrency(
                    selectedForConfig.account
                      .creditUsed
                  )}
                </span>
              </div>

            </div>

            {/* TIER */}
            <div className="space-y-2">

              <label className="text-xs font-bold">
                1. Select Credit Rating Tier
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">

                {(
                  [
                    "AAA",
                    "AA",
                    "A",
                    "B",
                    "C",
                    "UNRATED",
                  ] as const
                ).map((tier) => {

                  const selected =
                    editTier === tier;

                  const recommended =
                    getTierRecommendedLimit(
                      tier,
                      config.minCreditApprovalLimit,
                      config.maxCreditApprovalLimit
                    );

                  return (
                    <button
                      key={tier}
                      type="button"
                      onClick={() =>
                        handleTierSelection(
                          tier
                        )
                      }
                      className={`p-3 rounded-xl border text-left transition ${
                        selected
                          ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex justify-between">
                        <span className="font-bold text-xs">
                          Tier {tier}
                        </span>

                        {selected && (
                          <Check className="w-3.5 h-3.5 text-blue-600" />
                        )}
                      </div>

                      <span className="font-mono text-[11px] font-semibold text-slate-600 block mt-1">
                        {formatCurrency(
                          recommended
                        )}
                      </span>
                    </button>
                  );
                })}

              </div>
            </div>

            {/* LIMIT */}
            <div className="space-y-2">

              <div className="flex justify-between">
                <label className="text-xs font-bold">
                  2. Configured Credit Limit
                </label>

                <label className="text-[11px] flex items-center gap-1.5">
                  <input
                    type="checkbox"
                    checked={
                      autoCalibrateLimit
                    }
                    onChange={(e) => {
                      setAutoCalibrateLimit(
                        e.target.checked
                      );

                      if (e.target.checked) {
                        setEditLimit(
                          getTierRecommendedLimit(
                            editTier,
                            config.minCreditApprovalLimit,
                            config.maxCreditApprovalLimit
                          )
                        );
                      }
                    }}
                  />

                  Auto-calibrate
                </label>
              </div>

              <div className="relative">

                <span className="absolute left-3 top-2.5 text-slate-400 font-mono text-xs">
                  ₦
                </span>

                <input
                  type="number"
                  step="250000"
                  value={editLimit}
                  min={
                    config.minCreditApprovalLimit
                  }
                  max={
                    config.maxCreditApprovalLimit
                  }
                  onChange={(e) => {
                    setEditLimit(
                      Number(e.target.value)
                    );
                    setAutoCalibrateLimit(false);
                  }}
                  className="w-full pl-7 pr-3 py-2 border border-slate-300 rounded-lg text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>

              <div className="flex justify-between text-[11px]">

                <span className="text-slate-500">
                  Bounds:{" "}
                  {formatCurrency(
                    config.minCreditApprovalLimit
                  )}{" "}
                  –{" "}
                  {formatCurrency(
                    config.maxCreditApprovalLimit
                  )}
                </span>

                {editLimit >=
                  config.minCreditApprovalLimit &&
                editLimit <=
                  config.maxCreditApprovalLimit ? (
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Valid
                  </span>
                ) : (
                  <span className="text-rose-600 font-semibold flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Invalid
                  </span>
                )}

              </div>

              <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-100 flex justify-between text-xs">
                <span className="text-emerald-800">
                  Projected Available:
                </span>

                <span className="font-mono font-bold text-emerald-900">
                  {formatCurrency(
                    Math.max(
                      0,
                      editLimit -
                        selectedForConfig
                          .account
                          .creditUsed
                    )
                  )}
                </span>
              </div>

            </div>

            {/* STATUS + TERMS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

              <div className="space-y-1">
                <label className="text-xs font-bold">
                  Facility Status
                </label>

                <select
                  value={editStatus}
                  onChange={(e) =>
                    setEditStatus(
                      e.target.value as CreditStatus
                    )
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold"
                >
                  <option value="ACTIVE">
                    ACTIVE
                  </option>
                  <option value="FROZEN">
                    FROZEN
                  </option>
                  <option value="SUSPENDED">
                    SUSPENDED
                  </option>
                  <option value="PENDING">
                    PENDING
                  </option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold">
                  Settlement Terms
                </label>

                <select
                  value={editTerms}
                  onChange={(e) =>
                    setEditTerms(
                      e.target.value
                    )
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold"
                >
                  <option value="Net 15 Days Community Line">
                    Net 15 Days
                  </option>
                  <option value="Net 30 Days Revolving Facility">
                    Net 30 Days
                  </option>
                  <option value="Net 45 Days Institutional Prime">
                    Net 45 Days
                  </option>
                  <option value="Net 60 Days Federal Extended">
                    Net 60 Days
                  </option>
                </select>
              </div>

            </div>

            {/* ACTIONS */}
            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">

              <button
                onClick={() =>
                  setSelectedForConfig(null)
                }
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>

              <button
                onClick={
                  handleSaveUserAccount
                }
                disabled={isSavingAccount}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />

                {isSavingAccount
                  ? "Saving..."
                  : "Deploy Configuration"}
              </button>

            </div>

          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* TOP-UP MODAL                                                         */}
      {/* -------------------------------------------------------------------- */}

      {selectedForTopUp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">

          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5">

            <div className="flex items-center justify-between pb-3 border-b border-slate-100">

              <div className="flex items-center gap-2.5">

                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <PlusCircle className="w-5 h-5" />
                </div>

                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    Top-Up Available Credit
                  </h3>

                  <p className="text-xs text-slate-500">
                    {selectedForTopUp.user.organization ||
                      selectedForTopUp.user.name}
                  </p>
                </div>

              </div>

              <button
                onClick={() =>
                  setSelectedForTopUp(null)
                }
                className="w-8 h-8 rounded-lg text-slate-400 hover:bg-slate-100 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>

            </div>

            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">

              <div>
                <span className="text-[10px] uppercase text-slate-400 block">
                  Current Available
                </span>

                <span className="font-mono font-bold text-emerald-700 text-base">
                  {formatCurrency(
                    selectedForTopUp.account
                      .availableCredit
                  )}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase text-slate-400 block">
                  Outstanding
                </span>

                <span className="font-mono font-bold text-amber-700 text-base">
                  {formatCurrency(
                    selectedForTopUp.account
                      .outstandingBalance
                  )}
                </span>
              </div>

            </div>

            {/* TOP-UP TYPE */}
            <div className="space-y-2">

              <label className="text-xs font-bold">
                Top-Up Method
              </label>

              <div className="grid grid-cols-2 gap-2">

                <button
                  type="button"
                  onClick={() =>
                    setTopUpType(
                      "HEADROOM_BOOST"
                    )
                  }
                  className={`p-3 rounded-xl border text-left ${
                    topUpType ===
                    "HEADROOM_BOOST"
                      ? "border-emerald-600 bg-emerald-50 ring-1 ring-emerald-600"
                      : "border-slate-200"
                  }`}
                >
                  <span className="text-xs font-bold block">
                    Headroom Boost
                  </span>

                  <span className="text-[10.5px] text-slate-500">
                    Increase available procurement liquidity.
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setTopUpType(
                      "SETTLEMENT"
                    )
                  }
                  className={`p-3 rounded-xl border text-left ${
                    topUpType ===
                    "SETTLEMENT"
                      ? "border-emerald-600 bg-emerald-50 ring-1 ring-emerald-600"
                      : "border-slate-200"
                  }`}
                >
                  <span className="text-xs font-bold block">
                    Settlement Clearance
                  </span>

                  <span className="text-[10.5px] text-slate-500">
                    Reduce outstanding facility balance.
                  </span>
                </button>

              </div>
            </div>

            {/* AMOUNT */}
            <div className="space-y-2">

              <label className="text-xs font-bold">
                Top-Up Amount
              </label>

              <div className="relative">

                <span className="absolute left-3 top-2.5 text-slate-400">
                  ₦
                </span>

                <input
                  type="number"
                  value={topUpAmount}
                  onChange={(e) =>
                    setTopUpAmount(
                      Number(e.target.value)
                    )
                  }
                  className="w-full pl-7 pr-3 py-2 border border-slate-300 rounded-lg text-xs font-mono font-bold"
                />

              </div>

              <div className="flex gap-1.5 flex-wrap">

                {[500000, 1000000, 2500000, 5000000].map(
                  (value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() =>
                        setTopUpAmount(value)
                      }
                      className="px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-100 hover:bg-slate-200"
                    >
                      +{formatCurrency(value)}
                    </button>
                  )
                )}

                {selectedForTopUp.account
                  .outstandingBalance > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setTopUpAmount(
                        selectedForTopUp
                          .account
                          .outstandingBalance
                      );

                      setTopUpType(
                        "SETTLEMENT"
                      );
                    }}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-100 text-amber-800 hover:bg-amber-200"
                  >
                    Clear Balance
                  </button>
                )}

              </div>
            </div>

            {/* NOTES */}
            <div className="space-y-1">

              <label className="text-xs font-bold">
                Internal Reason / Reference
              </label>

              <input
                type="text"
                value={topUpNotes}
                onChange={(e) =>
                  setTopUpNotes(
                    e.target.value
                  )
                }
                placeholder="e.g. Emergency procurement authorization"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />

            </div>

            {/* PROJECTION */}
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">

              <div className="flex justify-between font-semibold text-emerald-900 text-xs">

                <span>
                  Projected Available Credit:
                </span>

                <span className="font-mono text-sm">
                  {formatCurrency(
                    selectedForTopUp.account
                      .availableCredit +
                      topUpAmount
                  )}
                </span>

              </div>

            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">

              <button
                onClick={() =>
                  setSelectedForTopUp(null)
                }
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>

              <button
                onClick={
                  handleExecuteTopUp
                }
                disabled={isToppingUp}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 disabled:opacity-50"
              >
                <PlusCircle className="w-4 h-4" />

                {isToppingUp
                  ? "Applying..."
                  : "Confirm Credit Top-Up"}
              </button>

            </div>

          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* LEDGER MODAL                                                         */}
      {/* -------------------------------------------------------------------- */}

      {selectedForLedger && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">

          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-4">

            <div className="flex items-center justify-between pb-3 border-b border-slate-100">

              <div className="flex items-center gap-2.5">

                <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                  <History className="w-5 h-5" />
                </div>

                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    Credit Facility Ledger
                  </h3>

                  <p className="text-xs text-slate-500">
                    {selectedForLedger.user.organization ||
                      selectedForLedger.user.name}
                  </p>
                </div>

              </div>

              <button
                onClick={() =>
                  setSelectedForLedger(null)
                }
                className="w-8 h-8 rounded-lg text-slate-400 hover:bg-slate-100 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>

            </div>

            {loadingLedger ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                Loading ledger entries...
              </div>
            ) : userTransactions.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                No transactions recorded on this credit line yet.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 max-h-[60vh] overflow-y-auto">

                {userTransactions.map(
                  (tx) => (
                    <div
                      key={tx.id}
                      className="py-3 flex items-center justify-between gap-3"
                    >

                      <div>

                        <div className="flex items-center gap-2">

                          <span
                            className={`px-1.5 py-0.5 rounded-md font-mono text-[10px] font-bold ${
                              tx.direction ===
                              "CHARGE"
                                ? "bg-rose-50 text-rose-700"
                                : "bg-emerald-50 text-emerald-700"
                            }`}
                          >
                            {tx.type}
                          </span>

                          <span className="font-semibold text-slate-800 text-xs">
                            {tx.description}
                          </span>

                        </div>

                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Ref:{" "}
                          {tx.reference}
                          <span className="mx-2">
                            •
                          </span>
                          {new Date(
                            tx.createdAt
                          ).toLocaleString(
                            "en-NG"
                          )}
                        </div>

                      </div>

                      <div className="text-right">

                        <span
                          className={`font-mono font-bold text-xs ${
                            tx.direction ===
                            "CHARGE"
                              ? "text-rose-600"
                              : "text-emerald-600"
                          }`}
                        >
                          {tx.direction ===
                          "CHARGE"
                            ? "-"
                            : "+"}

                          {formatCurrency(
                            tx.amount
                          )}
                        </span>

                        <span className="text-[10.5px] text-slate-400 block font-mono">
                          Bal:{" "}
                          {formatCurrency(
                            tx.balanceAfter
                          )}
                        </span>

                      </div>

                    </div>
                  )
                )}

              </div>
            )}

            <div className="pt-2 border-t border-slate-100 flex justify-end">

              <button
                onClick={() =>
                  setSelectedForLedger(null)
                }
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-semibold"
              >
                Close Ledger
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default CreditFacilitiesManagement;