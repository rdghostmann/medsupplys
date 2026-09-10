"use client"

import React, { useEffect, useMemo, useState } from "react"
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
} from "lucide-react"
import { toast } from "sonner"

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

type CreditStatus = "ACTIVE" | "APPROVED" | "FROZEN" | "SUSPENDED" | "PENDING"

type CreditRatingTier = "AAA" | "AA" | "A" | "B" | "C" | "UNRATED"

type CreditTransactionType =
  | "CREDIT_PURCHASE"
  | "CREDIT_TOP_UP"
  | "LIMIT_ADJUSTMENT"
  | "CREDIT_REPAYMENT"

type CreditTransactionDirection = "CHARGE" | "CREDIT"

interface CreditTransaction {
  id: string
  type: CreditTransactionType
  direction: CreditTransactionDirection
  description: string
  reference: string
  amount: number
  balanceAfter: number
  createdAt: string
}

interface CreditUser {
  id: string
  name: string
  organization?: string
  role: string
  creditRatingTier?: CreditRatingTier
}

interface CreditAccount {
  creditLimit: number
  availableCredit: number
  creditUsed: number
  outstandingBalance: number
  status: CreditStatus
  creditRatingTier?: CreditRatingTier
  terms: string
  interestRatePercent: number
  dueDate: string
}

interface CreditAccountWithUser {
  user: CreditUser
  account: CreditAccount
}

interface PlatformConfig {
  defaultCommissionPercent: number
  matchingWeights: {
    availabilityWeight: number
    priceWeight: number
    supplierTypeWeight: number
    fulfillmentWeight: number
    reliabilityWeight: number
  }
  minCreditApprovalLimit: number
  maxCreditApprovalLimit: number
  totalCreditPoolLimit: number
  defaultCreditTerms: string
  autoAdvanceSupplierTimeoutSeconds: number
}

interface Portfolio {
  totalCreditLimit: number
  totalCreditExposure: number
  totalAvailableCredit: number
  totalCreditUsed: number
  activeFacilitiesCount: number
  totalAccountsCount: number
  utilizationRate: number
  poolLimit: number
  poolHeadroom: number
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
}

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
]

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
}

/* -------------------------------------------------------------------------- */
/* COMPONENT                                                                  */
/* -------------------------------------------------------------------------- */

export const CreditFacilitiesManagement: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const [accounts, setAccounts] =
    useState<CreditAccountWithUser[]>(mockAccounts)

  const [config, setConfig] = useState<PlatformConfig>(mockConfig)

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
  })

  /* ------------------------------------------------------------------------ */
  /* FILTERS                                                                  */
  /* ------------------------------------------------------------------------ */

  const [searchTerm, setSearchTerm] = useState("")

  const [tierFilter, setTierFilter] = useState<"ALL" | CreditRatingTier>("ALL")

  const [statusFilter, setStatusFilter] = useState<"ALL" | CreditStatus>("ALL")

  /* ------------------------------------------------------------------------ */
  /* PLATFORM LIMITS                                                          */
  /* ------------------------------------------------------------------------ */

  const [minLimitInput, setMinLimitInput] = useState(
    mockConfig.minCreditApprovalLimit
  )

  const [maxLimitInput, setMaxLimitInput] = useState(
    mockConfig.maxCreditApprovalLimit
  )

  const [poolLimitInput, setPoolLimitInput] = useState(
    mockConfig.totalCreditPoolLimit
  )

  const [defaultTermsInput, setDefaultTermsInput] = useState(
    mockConfig.defaultCreditTerms
  )

  const [isSavingLimits, setIsSavingLimits] = useState(false)

  /* ------------------------------------------------------------------------ */
  /* CONFIG MODAL                                                             */
  /* ------------------------------------------------------------------------ */

  const [selectedForConfig, setSelectedForConfig] =
    useState<CreditAccountWithUser | null>(null)

  const [editTier, setEditTier] = useState<CreditRatingTier>("B")

  const [editLimit, setEditLimit] = useState(5000000)

  const [autoCalibrateLimit, setAutoCalibrateLimit] = useState(true)

  const [editStatus, setEditStatus] = useState<CreditStatus>("ACTIVE")

  const [editTerms, setEditTerms] = useState("Net 30 Days Revolving Facility")

  const [editInterest, setEditInterest] = useState(0)

  const [isSavingAccount, setIsSavingAccount] = useState(false)

  /* ------------------------------------------------------------------------ */
  /* TOP-UP MODAL                                                             */
  /* ------------------------------------------------------------------------ */

  const [selectedForTopUp, setSelectedForTopUp] =
    useState<CreditAccountWithUser | null>(null)

  const [topUpAmount, setTopUpAmount] = useState(1000000)

  const [topUpType, setTopUpType] = useState<"HEADROOM_BOOST" | "SETTLEMENT">(
    "HEADROOM_BOOST"
  )

  const [topUpNotes, setTopUpNotes] = useState("")

  const [isToppingUp, setIsToppingUp] = useState(false)

  /* ------------------------------------------------------------------------ */
  /* LEDGER MODAL                                                             */
  /* ------------------------------------------------------------------------ */

  const [selectedForLedger, setSelectedForLedger] =
    useState<CreditAccountWithUser | null>(null)

  const [userTransactions, setUserTransactions] = useState<CreditTransaction[]>(
    []
  )

  const [loadingLedger, setLoadingLedger] = useState(false)

  /* ------------------------------------------------------------------------ */
  /* HELPERS                                                                  */
  /* ------------------------------------------------------------------------ */

  const formatCurrency = (amount: number) =>
    `₦${amount.toLocaleString("en-NG")}`

  const calculatePortfolio = (data: CreditAccountWithUser[]): Portfolio => {
    const totalCreditLimit = data.reduce(
      (sum, item) => sum + (item.account.creditLimit || 0),
      0
    )

    const totalAvailableCredit = data.reduce(
      (sum, item) => sum + (item.account.availableCredit || 0),
      0
    )

    const totalCreditUsed = data.reduce(
      (sum, item) => sum + (item.account.creditUsed || 0),
      0
    )

    const activeFacilitiesCount = data.filter(
      (item) =>
        item.account.status === "ACTIVE" || item.account.status === "APPROVED"
    ).length

    const totalAccountsCount = data.length

    const utilizationRate =
      totalCreditLimit > 0
        ? Math.round((totalCreditUsed / totalCreditLimit) * 100)
        : 0

    const poolLimit = config.totalCreditPoolLimit

    const totalCreditExposure = totalCreditUsed

    const poolHeadroom = Math.max(0, poolLimit - totalCreditExposure)

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
    }
  }

  /* ------------------------------------------------------------------------ */
  /* INITIAL LOAD                                                             */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    const timer = setTimeout(() => {
      setPortfolio(calculatePortfolio(accounts))
      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  /* ------------------------------------------------------------------------ */
  /* REFRESH MOCK DATA                                                        */
  /* ------------------------------------------------------------------------ */

  const fetchData = async (silent = false) => {
    if (!silent) {
      setLoading(true)
    } else {
      setRefreshing(true)
    }

    await new Promise((resolve) => setTimeout(resolve, 500))

    setAccounts([...mockAccounts])
    setConfig({ ...mockConfig })

    setMinLimitInput(mockConfig.minCreditApprovalLimit)
    setMaxLimitInput(mockConfig.maxCreditApprovalLimit)
    setPoolLimitInput(mockConfig.totalCreditPoolLimit)
    setDefaultTermsInput(mockConfig.defaultCreditTerms)

    setPortfolio(calculatePortfolio(mockAccounts))

    setLoading(false)
    setRefreshing(false)

    toast.success("Credit facilities synchronized", {
      description: "Mock facility portfolio data has been refreshed.",
    })
  }

  /* ------------------------------------------------------------------------ */
  /* TIER RECOMMENDED LIMIT                                                   */
  /* ------------------------------------------------------------------------ */

  const getTierRecommendedLimit = (
    tier: CreditRatingTier,
    min = minLimitInput,
    max = maxLimitInput
  ) => {
    let limit = min

    switch (tier) {
      case "AAA":
        limit = max
        break

      case "AA":
        limit = Math.round(min + (max - min) * 0.85)
        break

      case "A":
        limit = Math.round(min + (max - min) * 0.6)
        break

      case "B":
        limit = Math.round(min + (max - min) * 0.35)
        break

      case "C":
        limit = Math.round(min + (max - min) * 0.15)
        break

      case "UNRATED":
      default:
        limit = min
        break
    }

    limit = Math.round(limit / 100000) * 100000

    return Math.max(min, Math.min(max, limit))
  }

  const handleTierSelection = (tier: CreditRatingTier) => {
    setEditTier(tier)

    if (autoCalibrateLimit) {
      setEditLimit(
        getTierRecommendedLimit(
          tier,
          config.minCreditApprovalLimit,
          config.maxCreditApprovalLimit
        )
      )
    }
  }

  /* ------------------------------------------------------------------------ */
  /* SAVE PLATFORM LIMITS                                                    */
  /* ------------------------------------------------------------------------ */

  const handleSavePlatformLimits = async () => {
    if (minLimitInput <= 0 || maxLimitInput <= 0) {
      toast.error("Invalid Limits", {
        description: "Minimum and Maximum limits must be greater than ₦0.",
      })
      return
    }

    if (minLimitInput > maxLimitInput) {
      toast.error("Invalid Range", {
        description:
          "Minimum Approval Limit cannot exceed Maximum Approval Limit.",
      })
      return
    }

    if (poolLimitInput <= 0) {
      toast.error("Invalid Risk Pool", {
        description: "The total credit risk pool must be greater than ₦0.",
      })
      return
    }

    setIsSavingLimits(true)

    await new Promise((resolve) => setTimeout(resolve, 700))

    const nextConfig = {
      ...config,
      minCreditApprovalLimit: minLimitInput,
      maxCreditApprovalLimit: maxLimitInput,
      totalCreditPoolLimit: poolLimitInput,
      defaultCreditTerms: defaultTermsInput,
    }

    setConfig(nextConfig)

    setPortfolio(calculatePortfolio(accounts))

    setIsSavingLimits(false)

    toast.success("Platform Credit Policy Updated", {
      description: `Approved bounds: ${formatCurrency(
        minLimitInput
      )} – ${formatCurrency(maxLimitInput)}.`,
    })
  }

  /* ------------------------------------------------------------------------ */
  /* CONFIG ACCOUNT                                                           */
  /* ------------------------------------------------------------------------ */

  const openConfigModal = (item: CreditAccountWithUser) => {
    setSelectedForConfig(item)

    const tier =
      item.account.creditRatingTier || item.user.creditRatingTier || "B"

    setEditTier(tier)
    setEditLimit(item.account.creditLimit)
    setAutoCalibrateLimit(false)
    setEditStatus(item.account.status)
    setEditTerms(item.account.terms || "Net 30 Days Revolving Facility")
    setEditInterest(item.account.interestRatePercent || 0)
  }

  const handleSaveUserAccount = async () => {
    if (!selectedForConfig) return

    if (editLimit < config.minCreditApprovalLimit) {
      toast.error("Limit Below Platform Minimum", {
        description: `Limit must be at least ${formatCurrency(
          config.minCreditApprovalLimit
        )}.`,
      })
      return
    }

    if (editLimit > config.maxCreditApprovalLimit) {
      toast.error("Limit Exceeds Platform Maximum", {
        description: `Limit cannot exceed ${formatCurrency(
          config.maxCreditApprovalLimit
        )}.`,
      })
      return
    }

    setIsSavingAccount(true)

    await new Promise((resolve) => setTimeout(resolve, 700))

    setAccounts((current) =>
      current.map((item) => {
        if (item.user.id !== selectedForConfig.user.id) {
          return item
        }

        const creditUsed = item.account.creditUsed

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
            availableCredit: Math.max(0, editLimit - creditUsed),
            status: editStatus,
            terms: editTerms,
            interestRatePercent: editInterest,
          },
        }
      })
    )

    setIsSavingAccount(false)

    const organization =
      selectedForConfig.user.organization || selectedForConfig.user.name

    setSelectedForConfig(null)

    toast.success("Credit Facility Configured", {
      description: `${organization}: Tier ${editTier}, Limit ${formatCurrency(
        editLimit
      )}.`,
    })
  }

  /* ------------------------------------------------------------------------ */
  /* TOP-UP                                                                    */
  /* ------------------------------------------------------------------------ */

  const openTopUpModal = (item: CreditAccountWithUser) => {
    setSelectedForTopUp(item)
    setTopUpAmount(1000000)
    setTopUpType("HEADROOM_BOOST")
    setTopUpNotes("")
  }

  const handleExecuteTopUp = async () => {
    if (!selectedForTopUp) return

    if (topUpAmount <= 0) {
      toast.error("Invalid Amount", {
        description: "Top-up amount must be strictly greater than ₦0.",
      })
      return
    }

    if (
      topUpType === "SETTLEMENT" &&
      topUpAmount > selectedForTopUp.account.outstandingBalance
    ) {
      toast.error("Invalid Settlement Amount", {
        description: "Settlement amount cannot exceed the outstanding balance.",
      })
      return
    }

    setIsToppingUp(true)

    await new Promise((resolve) => setTimeout(resolve, 700))

    setAccounts((current) =>
      current.map((item) => {
        if (item.user.id !== selectedForTopUp.user.id) {
          return item
        }

        const currentAvailable = item.account.availableCredit

        const currentOutstanding = item.account.outstandingBalance

        if (topUpType === "SETTLEMENT") {
          const settlementAmount = Math.min(topUpAmount, currentOutstanding)

          return {
            ...item,
            account: {
              ...item.account,
              availableCredit: currentAvailable + settlementAmount,
              creditUsed: Math.max(
                0,
                item.account.creditUsed - settlementAmount
              ),
              outstandingBalance: Math.max(
                0,
                currentOutstanding - settlementAmount
              ),
            },
          }
        }

        return {
          ...item,
          account: {
            ...item.account,
            availableCredit: currentAvailable + topUpAmount,
            creditLimit: item.account.creditLimit + topUpAmount,
          },
        }
      })
    )

    setIsToppingUp(false)

    const organization =
      selectedForTopUp.user.organization || selectedForTopUp.user.name

    setSelectedForTopUp(null)

    toast.success("Credit Account Topped Up", {
      description: `${formatCurrency(
        topUpAmount
      )} credited to ${organization}.`,
    })
  }

  /* ------------------------------------------------------------------------ */
  /* LEDGER                                                                    */
  /* ------------------------------------------------------------------------ */

  const openLedgerModal = async (item: CreditAccountWithUser) => {
    setSelectedForLedger(item)
    setLoadingLedger(true)

    await new Promise((resolve) => setTimeout(resolve, 400))

    setUserTransactions(mockTransactions[item.user.id] || [])

    setLoadingLedger(false)
  }

  /* ------------------------------------------------------------------------ */
  /* FILTERED ACCOUNTS                                                        */
  /* ------------------------------------------------------------------------ */

  const filteredAccounts = useMemo(() => {
    return accounts.filter((item) => {
      const organization = item.user.organization?.toLowerCase() || ""

      const userName = item.user.name?.toLowerCase() || ""

      const search = searchTerm.toLowerCase().trim()

      const matchesSearch =
        !search || organization.includes(search) || userName.includes(search)

      const itemTier =
        item.account.creditRatingTier || item.user.creditRatingTier || "UNRATED"

      const matchesTier = tierFilter === "ALL" || itemTier === tierFilter

      const matchesStatus =
        statusFilter === "ALL" || item.account.status === statusFilter

      return matchesSearch && matchesTier && matchesStatus
    })
  }, [accounts, searchTerm, tierFilter, statusFilter])

  /* ------------------------------------------------------------------------ */
  /* BADGES                                                                    */
  /* ------------------------------------------------------------------------ */

  const getTierBadge = (tier?: CreditRatingTier) => {
    switch (tier) {
      case "AAA":
        return (
          <span className="flex items-center gap-1 rounded-md border border-purple-200 bg-purple-50 px-2 py-0.5 font-mono text-[11px] font-bold text-purple-700">
            <Sparkles className="h-3 w-3 text-purple-600" />
            Tier AAA (Prime)
          </span>
        )

      case "AA":
        return (
          <span className="flex items-center gap-1 rounded-md border border-blue-200 bg-blue-50 px-2 py-0.5 font-mono text-[11px] font-bold text-blue-700">
            <ShieldCheck className="h-3 w-3 text-blue-600" />
            Tier AA (Major)
          </span>
        )

      case "A":
        return (
          <span className="flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 font-mono text-[11px] font-bold text-emerald-700">
            <CheckCircle2 className="h-3 w-3 text-emerald-600" />
            Tier A (Standard)
          </span>
        )

      case "B":
        return (
          <span className="rounded-md border border-indigo-200 bg-indigo-50 px-2 py-0.5 font-mono text-[11px] font-bold text-indigo-700">
            Tier B (General)
          </span>
        )

      case "C":
        return (
          <span className="rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 font-mono text-[11px] font-bold text-amber-700">
            Tier C (Restricted)
          </span>
        )

      default:
        return (
          <span className="rounded-md border border-slate-200 bg-slate-100 px-2 py-0.5 font-mono text-[11px] font-semibold text-slate-600">
            UNRATED
          </span>
        )
    }
  }

  const getStatusBadge = (status: CreditStatus) => {
    switch (status) {
      case "ACTIVE":
      case "APPROVED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10.5px] font-bold text-emerald-700">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
            ACTIVE
          </span>
        )

      case "FROZEN":
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10.5px] font-bold text-amber-700">
            <Lock className="h-2.5 w-2.5" />
            FROZEN
          </span>
        )

      case "SUSPENDED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 text-[10.5px] font-bold text-rose-700">
            <XCircle className="h-2.5 w-2.5" />
            SUSPENDED
          </span>
        )

      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-[10.5px] font-bold text-slate-700">
            <Clock className="h-2.5 w-2.5" />
            PENDING
          </span>
        )
    }
  }

  /* ------------------------------------------------------------------------ */
  /* LOADING                                                                   */
  /* ------------------------------------------------------------------------ */

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <RefreshCw className="mx-auto mb-3 h-7 w-7 animate-spin text-blue-600" />
          <p className="text-sm font-semibold text-slate-700">
            Loading credit facilities...
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Initializing mock portfolio data
          </p>
        </div>
      </div>
    )
  }

  /* ------------------------------------------------------------------------ */
  /* RENDER                                                                    */
  /* ------------------------------------------------------------------------ */

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <CreditCard className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-display text-lg font-bold text-slate-900">
                  Credit Facilities Governance & Risk Management
                </h2>

                <p className="mt-0.5 text-xs text-slate-500">
                  Configure platform regulatory limits, calibrate user Credit
                  Rating Tiers, and manage facility headroom.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => fetchData(true)}
            disabled={refreshing}
            className="flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-200 disabled:opacity-50"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`}
            />

            {refreshing ? "Refreshing..." : "Sync Facilities"}
          </button>
        </div>

        {/* PORTFOLIO */}
        <div className="mt-6 grid grid-cols-1 gap-4 border-t border-slate-100 pt-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <span className="block text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
              Total Approved Facility Lines
            </span>

            <span className="mt-1 block font-mono text-xl font-bold text-slate-900">
              {formatCurrency(portfolio.totalCreditLimit)}
            </span>

            <span className="mt-1 block text-[11px] text-slate-500">
              Across {portfolio.activeFacilitiesCount} active healthcare
              facilities
            </span>
          </div>

          <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
            <span className="block text-[11px] font-semibold tracking-wider text-emerald-800 uppercase">
              Total Available Headroom
            </span>

            <span className="mt-1 block font-mono text-xl font-bold text-emerald-900">
              {formatCurrency(portfolio.totalAvailableCredit)}
            </span>

            <span className="mt-1 block text-[11px] font-medium text-emerald-700">
              Ready for medical procurement
            </span>
          </div>

          <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
            <span className="block text-[11px] font-semibold tracking-wider text-amber-800 uppercase">
              Active Exposure
            </span>

            <span className="mt-1 block font-mono text-xl font-bold text-amber-900">
              {formatCurrency(portfolio.totalCreditExposure)}
            </span>

            <span className="mt-1 block text-[11px] font-semibold text-amber-700">
              {portfolio.utilizationRate}% Portfolio Utilization
            </span>
          </div>

          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
            <span className="block text-[11px] font-semibold tracking-wider text-blue-800 uppercase">
              Platform Risk Pool Ceiling
            </span>

            <span className="mt-1 block font-mono text-xl font-bold text-blue-900">
              {formatCurrency(config.totalCreditPoolLimit)}
            </span>

            <span className="mt-1 block text-[11px] text-blue-700">
              {formatCurrency(portfolio.poolHeadroom)} uncommitted reserve
            </span>
          </div>
        </div>
      </div>

      {/* PLATFORM POLICY */}
      <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col justify-between gap-2 border-b border-slate-100 pb-3 sm:flex-row sm:items-center">
          <div>
            <h3 className="font-display flex items-center gap-2 text-sm font-bold text-slate-900">
              <Sliders className="h-4 w-4 text-blue-600" />
              Platform Credit Approval Policy & Limits
            </h3>

            <p className="mt-0.5 text-xs text-slate-500">
              Configure global credit approval bounds and facility policy.
            </p>
          </div>

          <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700">
            Mock Policy Environment
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* MIN */}
          <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <label className="text-xs font-bold text-slate-800">
              Minimum Approval Limit
            </label>

            <div className="relative">
              <span className="absolute top-2.5 left-3 font-mono text-xs text-slate-400">
                ₦
              </span>

              <input
                type="number"
                step="100000"
                value={minLimitInput}
                onChange={(e) => setMinLimitInput(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-300 bg-white py-2 pr-3 pl-7 font-mono text-xs font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <p className="text-[10.5px] text-slate-500">
              Floor for onboarding unrated and smaller healthcare facilities.
            </p>
          </div>

          {/* MAX */}
          <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <label className="text-xs font-bold text-slate-800">
              Maximum Approval Limit
            </label>

            <div className="relative">
              <span className="absolute top-2.5 left-3 font-mono text-xs text-slate-400">
                ₦
              </span>

              <input
                type="number"
                step="500000"
                min={minLimitInput}
                value={maxLimitInput}
                onChange={(e) => setMaxLimitInput(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-300 bg-white py-2 pr-3 pl-7 font-mono text-xs font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <p className="text-[10.5px] text-slate-500">
              Maximum facility exposure available to a single account.
            </p>
          </div>

          {/* POOL */}
          <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <label className="text-xs font-bold text-slate-800">
              Total Credit Risk Pool
            </label>

            <div className="relative">
              <span className="absolute top-2.5 left-3 font-mono text-xs text-slate-400">
                ₦
              </span>

              <input
                type="number"
                step="1000000"
                value={poolLimitInput}
                onChange={(e) => setPoolLimitInput(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-300 bg-white py-2 pr-3 pl-7 font-mono text-xs font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <p className="text-[10.5px] text-slate-500">
              Maximum aggregate platform credit liability.
            </p>
          </div>

          {/* TERMS */}
          <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <label className="text-xs font-bold text-slate-800">
              Default Facility Tenor
            </label>

            <select
              value={defaultTermsInput}
              onChange={(e) => setDefaultTermsInput(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
        <div className="space-y-3 rounded-xl bg-slate-900 p-4 text-white">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-emerald-400" />

            <span className="text-xs font-bold tracking-wider uppercase">
              Dynamic Credit Rating Calibration Matrix
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
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
                className="rounded-lg border border-white/10 bg-white/5 p-2.5"
              >
                <span className="block text-[10px] font-bold text-slate-300 uppercase">
                  Tier {tier}
                </span>

                <span className="mt-0.5 block font-mono text-sm font-bold">
                  {formatCurrency(getTierRecommendedLimit(tier))}
                </span>

                <span className="mt-0.5 block text-[10px] text-slate-400">
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
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />

            {isSavingLimits ? "Saving Policy..." : "Deploy Platform Limits"}
          </button>
        </div>
      </div>

      {/* ACCOUNTS */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-6 md:flex-row md:items-center">
          <div>
            <h3 className="font-display flex items-center gap-2 text-base font-bold text-slate-900">
              <Building2 className="h-5 w-5 text-blue-600" />
              Manage User Credit Accounts & Tier Allocations
            </h3>

            <p className="mt-0.5 text-xs text-slate-500">
              Configure credit tiers, facility limits, status and available
              credit.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative">
              <Search className="absolute top-2.5 left-3 h-3.5 w-3.5 text-slate-400" />

              <input
                type="text"
                placeholder="Search hospital or user..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-48 rounded-xl border border-slate-200 bg-slate-50 py-1.5 pr-3 pl-8 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none sm:w-60"
              />
            </div>

            <select
              value={tierFilter}
              onChange={(e) =>
                setTierFilter(e.target.value as "ALL" | CreditRatingTier)
              }
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700"
            >
              <option value="ALL">All Credit Tiers</option>
              <option value="AAA">Tier AAA</option>
              <option value="AA">Tier AA</option>
              <option value="A">Tier A</option>
              <option value="B">Tier B</option>
              <option value="C">Tier C</option>
              <option value="UNRATED">Unrated</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as "ALL" | CreditStatus)
              }
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="FROZEN">Frozen</option>
              <option value="SUSPENDED">Suspended</option>
              <option value="PENDING">Pending</option>
            </select>
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 bg-slate-50 text-[10.5px] tracking-wider text-slate-500 uppercase">
              <tr>
                <th className="px-4 py-3.5">Healthcare Institution</th>
                <th className="px-4 py-3.5">Credit Tier</th>
                <th className="px-4 py-3.5">Approved Limit</th>
                <th className="px-4 py-3.5">Available Credit</th>
                <th className="px-4 py-3.5">Outstanding</th>
                <th className="px-4 py-3.5">Utilization</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredAccounts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center">
                    <CreditCard className="mx-auto mb-2 h-8 w-8 text-slate-300" />

                    <p className="text-sm font-semibold text-slate-600">
                      No credit accounts found
                    </p>
                  </td>
                </tr>
              ) : (
                filteredAccounts.map((item) => {
                  const limit = item.account.creditLimit || 0

                  const available = item.account.availableCredit || 0

                  const used = item.account.creditUsed || 0

                  const percent =
                    limit > 0
                      ? Math.min(100, Math.round((used / limit) * 100))
                      : 0

                  const tier =
                    item.account.creditRatingTier ||
                    item.user.creditRatingTier ||
                    "UNRATED"

                  return (
                    <tr
                      key={item.user.id}
                      className="transition hover:bg-slate-50/80"
                    >
                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-slate-900">
                          {item.user.organization || item.user.name}
                        </div>

                        <div className="mt-0.5 text-[11px] text-slate-500">
                          {item.user.name}
                          <span className="mx-1.5 text-slate-300">•</span>
                          {item.user.role}
                        </div>
                      </td>

                      <td className="px-4 py-3.5">{getTierBadge(tier)}</td>

                      <td className="px-4 py-3.5 font-mono font-bold">
                        {formatCurrency(limit)}
                      </td>

                      <td className="px-4 py-3.5">
                        <span className="rounded-md border border-emerald-100 bg-emerald-50 px-2 py-0.5 font-mono font-bold text-emerald-700">
                          {formatCurrency(available)}
                        </span>
                      </td>

                      <td className="px-4 py-3.5">
                        <span
                          className={`font-mono font-semibold ${
                            used > 0 ? "text-amber-700" : "text-slate-400"
                          }`}
                        >
                          {formatCurrency(used)}
                        </span>

                        <span className="block text-[10px] text-slate-400">
                          Due:{" "}
                          {new Date(item.account.dueDate).toLocaleDateString(
                            "en-NG",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </span>
                      </td>

                      <td className="w-32 px-4 py-3.5">
                        <div className="mb-1 flex justify-between font-mono text-[10px] text-slate-500">
                          <span>{percent}%</span>
                        </div>

                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
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

                      <td className="px-4 py-3.5">
                        {getStatusBadge(item.account.status)}
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openConfigModal(item)}
                            className="flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1.5 text-[11px] font-semibold text-blue-700 transition hover:bg-blue-100"
                          >
                            <Sliders className="h-3.5 w-3.5" />
                            Config
                          </button>

                          <button
                            onClick={() => openTopUpModal(item)}
                            className="flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-[11px] font-semibold text-emerald-700 transition hover:bg-emerald-100"
                          >
                            <PlusCircle className="h-3.5 w-3.5" />
                            Top-Up
                          </button>

                          <button
                            onClick={() => openLedgerModal(item)}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                            title="View Ledger"
                          >
                            <History className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-xl space-y-5 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                  <Sliders className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Configure Credit Facility
                  </h3>

                  <p className="text-xs text-slate-500">
                    {selectedForConfig.user.organization ||
                      selectedForConfig.user.name}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedForConfig(null)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* SUMMARY */}
            <div className="grid grid-cols-3 gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3.5">
              <div>
                <span className="block text-[10px] text-slate-400 uppercase">
                  Current Limit
                </span>

                <span className="font-mono font-bold text-slate-800">
                  {formatCurrency(selectedForConfig.account.creditLimit)}
                </span>
              </div>

              <div>
                <span className="block text-[10px] text-slate-400 uppercase">
                  Available
                </span>

                <span className="font-mono font-bold text-emerald-600">
                  {formatCurrency(selectedForConfig.account.availableCredit)}
                </span>
              </div>

              <div>
                <span className="block text-[10px] text-slate-400 uppercase">
                  Outstanding
                </span>

                <span className="font-mono font-bold text-amber-600">
                  {formatCurrency(selectedForConfig.account.creditUsed)}
                </span>
              </div>
            </div>

            {/* TIER */}
            <div className="space-y-2">
              <label className="text-xs font-bold">
                1. Select Credit Rating Tier
              </label>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {(["AAA", "AA", "A", "B", "C", "UNRATED"] as const).map(
                  (tier) => {
                    const selected = editTier === tier

                    const recommended = getTierRecommendedLimit(
                      tier,
                      config.minCreditApprovalLimit,
                      config.maxCreditApprovalLimit
                    )

                    return (
                      <button
                        key={tier}
                        type="button"
                        onClick={() => handleTierSelection(tier)}
                        className={`rounded-xl border p-3 text-left transition ${
                          selected
                            ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex justify-between">
                          <span className="text-xs font-bold">Tier {tier}</span>

                          {selected && (
                            <Check className="h-3.5 w-3.5 text-blue-600" />
                          )}
                        </div>

                        <span className="mt-1 block font-mono text-[11px] font-semibold text-slate-600">
                          {formatCurrency(recommended)}
                        </span>
                      </button>
                    )
                  }
                )}
              </div>
            </div>

            {/* LIMIT */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-xs font-bold">
                  2. Configured Credit Limit
                </label>

                <label className="flex items-center gap-1.5 text-[11px]">
                  <input
                    type="checkbox"
                    checked={autoCalibrateLimit}
                    onChange={(e) => {
                      setAutoCalibrateLimit(e.target.checked)

                      if (e.target.checked) {
                        setEditLimit(
                          getTierRecommendedLimit(
                            editTier,
                            config.minCreditApprovalLimit,
                            config.maxCreditApprovalLimit
                          )
                        )
                      }
                    }}
                  />
                  Auto-calibrate
                </label>
              </div>

              <div className="relative">
                <span className="absolute top-2.5 left-3 font-mono text-xs text-slate-400">
                  ₦
                </span>

                <input
                  type="number"
                  step="250000"
                  value={editLimit}
                  min={config.minCreditApprovalLimit}
                  max={config.maxCreditApprovalLimit}
                  onChange={(e) => {
                    setEditLimit(Number(e.target.value))
                    setAutoCalibrateLimit(false)
                  }}
                  className="w-full rounded-lg border border-slate-300 py-2 pr-3 pl-7 font-mono text-xs font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-between text-[11px]">
                <span className="text-slate-500">
                  Bounds: {formatCurrency(config.minCreditApprovalLimit)} –{" "}
                  {formatCurrency(config.maxCreditApprovalLimit)}
                </span>

                {editLimit >= config.minCreditApprovalLimit &&
                editLimit <= config.maxCreditApprovalLimit ? (
                  <span className="flex items-center gap-1 font-semibold text-emerald-700">
                    <CheckCircle2 className="h-3 w-3" />
                    Valid
                  </span>
                ) : (
                  <span className="flex items-center gap-1 font-semibold text-rose-600">
                    <AlertTriangle className="h-3 w-3" />
                    Invalid
                  </span>
                )}
              </div>

              <div className="flex justify-between rounded-lg border border-emerald-100 bg-emerald-50 p-2.5 text-xs">
                <span className="text-emerald-800">Projected Available:</span>

                <span className="font-mono font-bold text-emerald-900">
                  {formatCurrency(
                    Math.max(
                      0,
                      editLimit - selectedForConfig.account.creditUsed
                    )
                  )}
                </span>
              </div>
            </div>

            {/* STATUS + TERMS */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-bold">Facility Status</label>

                <select
                  value={editStatus}
                  onChange={(e) =>
                    setEditStatus(e.target.value as CreditStatus)
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="FROZEN">FROZEN</option>
                  <option value="SUSPENDED">SUSPENDED</option>
                  <option value="PENDING">PENDING</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold">Settlement Terms</label>

                <select
                  value={editTerms}
                  onChange={(e) => setEditTerms(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold"
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
            <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
              <button
                onClick={() => setSelectedForConfig(null)}
                className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-semibold hover:bg-slate-200"
              >
                Cancel
              </button>

              <button
                onClick={handleSaveUserAccount}
                disabled={isSavingAccount}
                className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />

                {isSavingAccount ? "Saving..." : "Deploy Configuration"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* TOP-UP MODAL                                                         */}
      {/* -------------------------------------------------------------------- */}

      {selectedForTopUp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                  <PlusCircle className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Top-Up Available Credit
                  </h3>

                  <p className="text-xs text-slate-500">
                    {selectedForTopUp.user.organization ||
                      selectedForTopUp.user.name}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedForTopUp(null)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
              <div>
                <span className="block text-[10px] text-slate-400 uppercase">
                  Current Available
                </span>

                <span className="font-mono text-base font-bold text-emerald-700">
                  {formatCurrency(selectedForTopUp.account.availableCredit)}
                </span>
              </div>

              <div>
                <span className="block text-[10px] text-slate-400 uppercase">
                  Outstanding
                </span>

                <span className="font-mono text-base font-bold text-amber-700">
                  {formatCurrency(selectedForTopUp.account.outstandingBalance)}
                </span>
              </div>
            </div>

            {/* TOP-UP TYPE */}
            <div className="space-y-2">
              <label className="text-xs font-bold">Top-Up Method</label>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTopUpType("HEADROOM_BOOST")}
                  className={`rounded-xl border p-3 text-left ${
                    topUpType === "HEADROOM_BOOST"
                      ? "border-emerald-600 bg-emerald-50 ring-1 ring-emerald-600"
                      : "border-slate-200"
                  }`}
                >
                  <span className="block text-xs font-bold">
                    Headroom Boost
                  </span>

                  <span className="text-[10.5px] text-slate-500">
                    Increase available procurement liquidity.
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setTopUpType("SETTLEMENT")}
                  className={`rounded-xl border p-3 text-left ${
                    topUpType === "SETTLEMENT"
                      ? "border-emerald-600 bg-emerald-50 ring-1 ring-emerald-600"
                      : "border-slate-200"
                  }`}
                >
                  <span className="block text-xs font-bold">
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
              <label className="text-xs font-bold">Top-Up Amount</label>

              <div className="relative">
                <span className="absolute top-2.5 left-3 text-slate-400">
                  ₦
                </span>

                <input
                  type="number"
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-300 py-2 pr-3 pl-7 font-mono text-xs font-bold"
                />
              </div>

              <div className="flex flex-wrap gap-1.5">
                {[500000, 1000000, 2500000, 5000000].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setTopUpAmount(value)}
                    className="rounded-lg bg-slate-100 px-2.5 py-1 font-mono text-xs hover:bg-slate-200"
                  >
                    +{formatCurrency(value)}
                  </button>
                ))}

                {selectedForTopUp.account.outstandingBalance > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setTopUpAmount(
                        selectedForTopUp.account.outstandingBalance
                      )

                      setTopUpType("SETTLEMENT")
                    }}
                    className="rounded-lg bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800 hover:bg-amber-200"
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
                onChange={(e) => setTopUpNotes(e.target.value)}
                placeholder="e.g. Emergency procurement authorization"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs"
              />
            </div>

            {/* PROJECTION */}
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3">
              <div className="flex justify-between text-xs font-semibold text-emerald-900">
                <span>Projected Available Credit:</span>

                <span className="font-mono text-sm">
                  {formatCurrency(
                    selectedForTopUp.account.availableCredit + topUpAmount
                  )}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-100 pt-2">
              <button
                onClick={() => setSelectedForTopUp(null)}
                className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-semibold hover:bg-slate-200"
              >
                Cancel
              </button>

              <button
                onClick={handleExecuteTopUp}
                disabled={isToppingUp}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                <PlusCircle className="h-4 w-4" />

                {isToppingUp ? "Applying..." : "Confirm Credit Top-Up"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* LEDGER MODAL                                                         */}
      {/* -------------------------------------------------------------------- */}

      {selectedForLedger && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl space-y-4 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                  <History className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Credit Facility Ledger
                  </h3>

                  <p className="text-xs text-slate-500">
                    {selectedForLedger.user.organization ||
                      selectedForLedger.user.name}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedForLedger(null)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {loadingLedger ? (
              <div className="py-12 text-center text-xs text-slate-400">
                <RefreshCw className="mx-auto mb-2 h-6 w-6 animate-spin" />
                Loading ledger entries...
              </div>
            ) : userTransactions.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                No transactions recorded on this credit line yet.
              </div>
            ) : (
              <div className="max-h-[60vh] divide-y divide-slate-100 overflow-y-auto">
                {userTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between gap-3 py-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-md px-1.5 py-0.5 font-mono text-[10px] font-bold ${
                            tx.direction === "CHARGE"
                              ? "bg-rose-50 text-rose-700"
                              : "bg-emerald-50 text-emerald-700"
                          }`}
                        >
                          {tx.type}
                        </span>

                        <span className="text-xs font-semibold text-slate-800">
                          {tx.description}
                        </span>
                      </div>

                      <div className="mt-0.5 text-[11px] text-slate-400">
                        Ref: {tx.reference}
                        <span className="mx-2">•</span>
                        {new Date(tx.createdAt).toLocaleString("en-NG")}
                      </div>
                    </div>

                    <div className="text-right">
                      <span
                        className={`font-mono text-xs font-bold ${
                          tx.direction === "CHARGE"
                            ? "text-rose-600"
                            : "text-emerald-600"
                        }`}
                      >
                        {tx.direction === "CHARGE" ? "-" : "+"}

                        {formatCurrency(tx.amount)}
                      </span>

                      <span className="block font-mono text-[10.5px] text-slate-400">
                        Bal: {formatCurrency(tx.balanceAfter)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end border-t border-slate-100 pt-2">
              <button
                onClick={() => setSelectedForLedger(null)}
                className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-semibold hover:bg-slate-200"
              >
                Close Ledger
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CreditFacilitiesManagement
