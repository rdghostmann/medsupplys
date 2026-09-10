// /admin/suppliers/SupplierKYCManagement.tsx
"use client"

import React, { useMemo, useState } from "react"
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
} from "lucide-react"
import { toast } from "sonner"
import { SupplierApprovalStatus, SupplierType } from "@/types"
import {
  updateSupplierStatus,
  type AdminSupplier,
  type AdminSupplierStatus,
  type AdminSupplierType,
} from "@/controllers/admin.actions"

/**
 * ============================================================
 * MOCK SUPPLIER TYPES
 * ============================================================
 */

type CreditRatingTier = "A" | "B" | "C" | "UNRATED"

/**
 * ============================================================
 * COMPONENT
 * ============================================================
 */

const SupplierKYCManagement: React.FC<{
  initialSuppliers: AdminSupplier[]
}> = ({ initialSuppliers }) => {
  const [allUsers, setAllUsers] = useState<AdminSupplier[]>(initialSuppliers)

  // Filter state
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | SupplierApprovalStatus
  >("ALL")
  const [tierFilter, setTierFilter] = useState<"ALL" | SupplierType>("ALL")

  // Dossier modal state
  const [selectedSupplier, setSelectedSupplier] =
    useState<AdminSupplier | null>(null)

  const [isSubmitting, setIsSubmitting] = useState(false)

  // Review Form in Modal
  const [reviewTier, setReviewTier] = useState<SupplierType>("DISTRIBUTOR")

  const [reviewNotes, setReviewNotes] = useState("")
  const [actionReason, setActionReason] = useState("")

  const [assignedCreditLimit, setAssignedCreditLimit] = useState(10000000)

  const [creditRatingTier, setCreditRatingTier] =
    useState<CreditRatingTier>("A")

  const [checklist, setChecklist] = useState({
    cacVerified: true,
    pcnPremisesVerified: true,
    nafdacGdpVerified: true,
    coldChainVerified: true,
    superintendentVerified: true,
    bankAccountVerified: true,
  })

  // Action confirmation dialogs
  const [confirmAction, setConfirmAction] = useState<{
    type: "APPROVE" | "REJECT" | "SUSPEND" | "REINSTATE"
    supplier: AdminSupplier
  } | null>(null)

  /**
   * ============================================================
   * SUPPLIERS
   * ============================================================
   */

  const suppliers = useMemo(() => {
    return allUsers.filter((u) => u.role === "SUPPLIER")
  }, [allUsers])

  /**
   * ============================================================
   * COUNTS
   * ============================================================
   */

  const counts = useMemo(() => {
    const total = suppliers.length

    const pending = suppliers.filter(
      (s) => s.supplierApprovalStatus === "PENDING"
    ).length

    const approved = suppliers.filter(
      (s) => s.supplierApprovalStatus === "APPROVED"
    ).length

    const suspended = suppliers.filter(
      (s) => s.supplierApprovalStatus === "SUSPENDED"
    ).length

    const rejected = suppliers.filter(
      (s) => s.supplierApprovalStatus === "REJECTED"
    ).length

    return {
      total,
      pending,
      approved,
      suspended,
      rejected,
    }
  }, [suppliers])

  /**
   * ============================================================
   * FILTERED SUPPLIERS
   * ============================================================
   */

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((sup) => {
      const s = searchTerm.toLowerCase().trim()

      const matchesSearch =
        !s ||
        sup.name.toLowerCase().includes(s) ||
        sup.organization.toLowerCase().includes(s) ||
        sup.licenseNumber.toLowerCase().includes(s) ||
        sup.pcnPremisesLicense.toLowerCase().includes(s) ||
        sup.nafdacGdpLicense.toLowerCase().includes(s) ||
        sup.email.toLowerCase().includes(s) ||
        sup.state.toLowerCase().includes(s)

      const matchesStatus =
        statusFilter === "ALL" || sup.supplierApprovalStatus === statusFilter

      const matchesTier =
        tierFilter === "ALL" || sup.supplierType === tierFilter

      return matchesSearch && matchesStatus && matchesTier
    })
  }, [suppliers, searchTerm, statusFilter, tierFilter])

  /**
   * ============================================================
   * OPEN DOSSIER
   * ============================================================
   */

  const handleOpenDossier = (supplier: AdminSupplier) => {
    setSelectedSupplier(supplier)

    setReviewTier(supplier.supplierType || "DISTRIBUTOR")

    setReviewNotes(supplier.kycReviewNotes || "")

    setActionReason(
      supplier.kycRejectionReason || supplier.kycSuspensionReason || ""
    )

    setAssignedCreditLimit(supplier.assignedCreditLimit || 10000000)

    setCreditRatingTier(supplier.creditRatingTier || "A")

    setChecklist({
      cacVerified: true,
      pcnPremisesVerified: !!supplier.pcnPremisesLicense,
      nafdacGdpVerified: !!supplier.nafdacGdpLicense,
      coldChainVerified: !!supplier.isColdChainCertified,
      superintendentVerified: true,
      bankAccountVerified: !!supplier.settlementAccountNumber,
    })
  }

  /**
   * ============================================================
   * MOCK KYC STATUS UPDATE
   * ============================================================
   */

  const handleExecuteStatusChange = async (
    targetSupplier: AdminSupplier,
    newStatus: SupplierApprovalStatus,
    reason?: string,
    tier?: SupplierType
  ) => {
    if (isSubmitting) return

    try {
      setIsSubmitting(true)

      const updatedSupplier = await updateSupplierStatus(
        targetSupplier.id,
        newStatus as AdminSupplierStatus,
        {
          supplierType: (tier ||
            targetSupplier.supplierType) as AdminSupplierType,
          kycReviewNotes:
            reviewNotes ||
            `Admin evaluated KYC on ${new Date().toLocaleDateString()}`,
          actionReason: reason,
          assignedCreditLimit,
          creditRatingTier,
          isColdChainCertified: checklist.coldChainVerified,
        }
      )

      // Replace the supplier in local mock state.
      setAllUsers((currentSuppliers) =>
        currentSuppliers.map((supplier) =>
          supplier.id === targetSupplier.id ? updatedSupplier : supplier
        )
      )

      // Keep selected supplier synchronized if the dossier is open.
      setSelectedSupplier((currentSupplier) =>
        currentSupplier?.id === targetSupplier.id
          ? updatedSupplier
          : currentSupplier
      )

      /**
       * Sonner notifications
       */
      if (newStatus === "APPROVED") {
        toast.success("Supplier Approved", {
          description: `${
            targetSupplier.organization || targetSupplier.name
          } is now active in the verified supplier pool.`,
        })
      } else if (newStatus === "SUSPENDED") {
        toast.warning("Supplier Suspended", {
          description: `${
            targetSupplier.organization || targetSupplier.name
          } has been removed from active procurement sourcing.`,
        })
      } else if (newStatus === "REJECTED") {
        toast.error("Supplier Application Rejected", {
          description: `${
            targetSupplier.organization || targetSupplier.name
          } has been disqualified from the active supplier pool.`,
        })
      } else {
        toast.info("Supplier Status Updated", {
          description: `${
            targetSupplier.organization || targetSupplier.name
          } status updated to ${newStatus}.`,
        })
      }

      setSelectedSupplier(null)
      setConfirmAction(null)
      setActionReason("")
    } catch (error) {
      console.error("Mock KYC update failed:", error)

      toast.error("Action Failed", {
        description: "Could not update supplier KYC status.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  /**
   * ============================================================
   * RETURN UI
   * ============================================================
   */

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="">
          <h2 className="font-display flex items-center gap-2 text-lg font-bold text-slate-900">
            <Users className="hidden h-5 w-5 text-blue-600" />
            <span>Supplier Regulatory Onboarding & KYC Approval</span>
          </h2>

          <p className="mt-0.5 text-xs text-slate-500">
            Audit pharmaceutical wholesalers, importers, and distributors
            against PCN premises permits, NAFDAC GDP standards, and cold chain
            capacity.
          </p>
        </div>

        {counts.pending > 0 && (
          <div className="hidden items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800 lg:flex">
            <span className="h-2 w-2 animate-pulse rounded-full bg-amber-500" />

            <span>
              {counts.pending} Application
              {counts.pending > 1 ? "s" : ""} Awaiting Review
            </span>
          </div>
        )}
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-5">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="block text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            Registered Pool
          </span>

          <span className="mt-1 block font-mono text-xl font-bold text-slate-900">
            {counts.total}
          </span>

          <span className="mt-0.5 block text-[10.5px] text-slate-500">
            Total entities
          </span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="block text-[11px] font-semibold tracking-wider text-amber-600 uppercase">
            Pending Approval
          </span>

          <span className="mt-1 block font-mono text-xl font-bold text-amber-700">
            {counts.pending}
          </span>

          <span className="mt-0.5 block text-[10.5px] text-slate-500">
            KYC queue
          </span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="block text-[11px] font-semibold tracking-wider text-emerald-600 uppercase">
            Verified & Active
          </span>

          <span className="mt-1 block font-mono text-xl font-bold text-emerald-700">
            {counts.approved}
          </span>

          <span className="mt-0.5 block text-[10.5px] text-slate-500">
            Cleared for RFQs
          </span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="block text-[11px] font-semibold tracking-wider text-red-600 uppercase">
            Suspended
          </span>

          <span className="mt-1 block font-mono text-xl font-bold text-red-700">
            {counts.suspended}
          </span>

          <span className="mt-0.5 block text-[10.5px] text-slate-500">
            Compliance holds
          </span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="block text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
            Rejected
          </span>

          <span className="mt-1 block font-mono text-xl font-bold text-slate-600">
            {counts.rejected}
          </span>

          <span className="mt-0.5 block text-[10.5px] text-slate-500">
            Disqualified
          </span>
        </div>
      </div>

      {/* Filter and Status Sub-Tabs */}
      <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
        {/* Status Navigation Pills */}
        <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-100 pb-3">
          <button
            onClick={() => setStatusFilter("ALL")}
            className={`cursor-pointer rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              statusFilter === "ALL"
                ? "bg-blue-600 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            All Suppliers ({counts.total})
          </button>

          <button
            onClick={() => setStatusFilter("PENDING")}
            className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              statusFilter === "PENDING"
                ? "bg-amber-600 text-white"
                : "border border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100"
            }`}
          >
            <Clock className="h-3.5 w-3.5" />

            <span>Pending Review ({counts.pending})</span>
          </button>

          <button
            onClick={() => setStatusFilter("APPROVED")}
            className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              statusFilter === "APPROVED"
                ? "bg-emerald-600 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />

            <span>Approved ({counts.approved})</span>
          </button>

          <button
            onClick={() => setStatusFilter("SUSPENDED")}
            className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              statusFilter === "SUSPENDED"
                ? "bg-red-600 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <AlertTriangle className="h-3.5 w-3.5" />

            <span>Suspended ({counts.suspended})</span>
          </button>

          <button
            onClick={() => setStatusFilter("REJECTED")}
            className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              statusFilter === "REJECTED"
                ? "bg-slate-800 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <XCircle className="h-3.5 w-3.5" />

            <span>Rejected ({counts.rejected})</span>
          </button>
        </div>

        {/* Search & Tier Dropdown */}
        <div className="flex flex-col items-stretch justify-between gap-3 pt-1 sm:flex-row sm:items-center">
          <div className="relative min-w-[240px] flex-1">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              id="input-supplier-search"
              type="text"
              placeholder="Search by company name, PCN license, NAFDAC GDP, or state..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pr-3.5 pl-9 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              id="select-supplier-tier"
              value={tierFilter}
              onChange={(e) =>
                setTierFilter(e.target.value as "ALL" | SupplierType)
              }
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-700 focus:border-blue-500 focus:outline-none"
            >
              <option value="ALL">All Tiers</option>

              <option value="IMPORTER">Importer (100% Weight)</option>

              <option value="DISTRIBUTOR">Distributor (70% Weight)</option>

              <option value="RETAILER">Retailer (40% Weight)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Suppliers Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 bg-slate-50 text-[10.5px] tracking-wider text-slate-500 uppercase">
              <tr>
                <th className="px-4 py-3 font-semibold">Entity & Location</th>

                <th className="px-4 py-3 font-semibold">Tier & Weight</th>

                <th className="px-4 py-3 font-semibold">Regulatory Permits</th>

                <th className="px-4 py-3 font-semibold">
                  Cold Storage Capacity
                </th>

                <th className="px-4 py-3 font-semibold">KYC Status</th>

                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredSuppliers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <Building2 className="mx-auto mb-2 h-8 w-8 text-slate-300" />

                    <p className="text-xs font-medium text-slate-600">
                      No suppliers match current filter criteria.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredSuppliers.map((sup) => {
                  const isApproved = sup.supplierApprovalStatus === "APPROVED"

                  const isPending = sup.supplierApprovalStatus === "PENDING"

                  const isSuspended = sup.supplierApprovalStatus === "SUSPENDED"

                  const isRejected = sup.supplierApprovalStatus === "REJECTED"

                  return (
                    <tr
                      key={sup.id}
                      className="transition hover:bg-slate-50/80"
                    >
                      {/* Entity & Location */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                          <span>{sup.organization || sup.name}</span>

                          {isApproved && (
                            <ShieldCheck
                              className="h-3.5 w-3.5 shrink-0 text-emerald-600"
                              //   title="Verified Supplier"
                            />
                          )}
                        </div>

                        <div className="mt-0.5 font-mono text-[11px] text-slate-500">
                          {sup.email} • {sup.phone || "+234 1 000 0000"}
                        </div>

                        <div className="mt-0.5 flex items-center gap-1 text-[10.5px] text-slate-400">
                          <MapPin className="h-3 w-3 text-slate-400" />

                          <span>{sup.state || "Lagos"}, Nigeria</span>
                        </div>
                      </td>

                      {/* Tier & Matching Weight */}
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-block rounded px-2 py-0.5 text-[10px] font-bold ${
                            sup.supplierType === "IMPORTER"
                              ? "bg-emerald-100 text-emerald-800"
                              : sup.supplierType === "DISTRIBUTOR"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {sup.supplierType || "DISTRIBUTOR"}
                        </span>

                        <div className="mt-1 text-[10px] text-slate-400">
                          Algorithm Weight:{" "}
                          <span className="font-semibold text-slate-700">
                            {sup.supplierType === "IMPORTER"
                              ? "100%"
                              : sup.supplierType === "DISTRIBUTOR"
                                ? "70%"
                                : "40%"}
                          </span>
                        </div>
                      </td>

                      {/* Regulatory Permits */}
                      <td className="px-4 py-3.5">
                        <div className="font-mono text-[11px] font-medium text-slate-800">
                          PCN:{" "}
                          {sup.pcnPremisesLicense ||
                            sup.licenseNumber ||
                            "PCN-REG-PENDING"}
                        </div>

                        <div className="mt-0.5 font-mono text-[10.5px] text-slate-500">
                          GDP: {sup.nafdacGdpLicense || "NAFDAC/GDP/PENDING"}
                        </div>
                      </td>

                      {/* Cold Chain Storage */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <ThermometerSnowflake
                            className={`h-3.5 w-3.5 ${
                              sup.isColdChainCertified
                                ? "text-sky-600"
                                : "text-slate-300"
                            }`}
                          />

                          <span className="font-mono text-xs font-semibold text-slate-800">
                            {sup.coldChainCapacityM3
                              ? `${sup.coldChainCapacityM3} m³`
                              : "Ambient only"}
                          </span>
                        </div>

                        {sup.isColdChainCertified && (
                          <span className="py-0.2 mt-0.5 inline-block rounded border border-sky-200 bg-sky-50 px-1.5 text-[9.5px] font-bold text-sky-700">
                            Cold Chain Certified
                          </span>
                        )}
                      </td>

                      {/* KYC Status */}
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold ${
                            isApproved
                              ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
                              : isPending
                                ? "animate-pulse border border-amber-200 bg-amber-50 text-amber-800"
                                : isSuspended
                                  ? "border border-red-200 bg-red-50 text-red-800"
                                  : "border border-slate-200 bg-slate-100 text-slate-600"
                          }`}
                        >
                          {isPending && <Clock className="h-3 w-3" />}

                          {isApproved && <CheckCircle2 className="h-3 w-3" />}

                          {isSuspended && <AlertTriangle className="h-3 w-3" />}

                          {isRejected && <XCircle className="h-3 w-3" />}

                          <span>{sup.supplierApprovalStatus}</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="space-x-1.5 px-4 py-3.5 text-right">
                        <button
                          id={`btn-review-dossier-${sup.id}`}
                          onClick={() => handleOpenDossier(sup)}
                          className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700 transition hover:bg-blue-100"
                        >
                          <Eye className="h-3 w-3" />

                          <span>Review Dossier</span>
                        </button>

                        {isPending && (
                          <button
                            id={`btn-quick-approve-${sup.id}`}
                            disabled={isSubmitting}
                            onClick={() =>
                              handleExecuteStatusChange(sup, "APPROVED")
                            }
                            className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1 text-[11px] font-semibold text-white shadow-2xs transition hover:bg-emerald-700 disabled:opacity-50"
                          >
                            <Check className="h-3 w-3" />

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
                            className="cursor-pointer rounded-lg border border-red-200 bg-red-50 px-2.5 py-1 text-[11px] font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-50"
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
                            className="cursor-pointer rounded-lg border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-800 transition hover:bg-emerald-100 disabled:opacity-50"
                          >
                            Reinstate
                          </button>
                        )}
                      </td>
                    </tr>
                  )
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
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="my-8 flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
            {/* Modal Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-slate-100 bg-slate-50 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 font-bold text-blue-700">
                  <Building2 className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="font-display flex items-center gap-2 text-base font-bold text-slate-900">
                    <span>
                      {selectedSupplier.organization || selectedSupplier.name}
                    </span>

                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        selectedSupplier.supplierApprovalStatus === "APPROVED"
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
                      {selectedSupplier.supplierApprovalStatus}
                    </span>
                  </h3>

                  <p className="text-[11px] text-slate-500">
                    Pharmaceutical Supplier KYC & Regulatory Compliance Dossier
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedSupplier(null)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="flex-1 space-y-6 overflow-y-auto p-6 text-xs">
              {/* SECTION 1 */}
              <div className="space-y-2">
                <h4 className="font-display flex items-center gap-1.5 text-xs font-bold tracking-wider text-slate-900 uppercase">
                  <Building2 className="h-3.5 w-3.5 text-blue-600" />

                  <span>1. Corporate Identity & Legal Address</span>
                </h4>

                <div className="grid grid-cols-1 gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3.5 sm:grid-cols-3">
                  <div>
                    <span className="block text-[10.5px] text-slate-400">
                      Corporate Name
                    </span>

                    <span className="mt-0.5 block text-xs font-semibold text-slate-900">
                      {selectedSupplier.organization || selectedSupplier.name}
                    </span>
                  </div>

                  <div>
                    <span className="block text-[10.5px] text-slate-400">
                      Contact Email
                    </span>

                    <span className="mt-0.5 block font-mono text-xs text-slate-700">
                      {selectedSupplier.email}
                    </span>
                  </div>

                  <div>
                    <span className="block text-[10.5px] text-slate-400">
                      Dispatch Phone
                    </span>

                    <span className="mt-0.5 block font-mono text-xs text-slate-700">
                      {selectedSupplier.phone}
                    </span>
                  </div>

                  <div className="sm:col-span-2">
                    <span className="block text-[10.5px] text-slate-400">
                      Physical Depot / Warehouse
                    </span>

                    <span className="mt-0.5 block text-xs text-slate-800">
                      {selectedSupplier.address}
                    </span>
                  </div>

                  <div>
                    <span className="block text-[10.5px] text-slate-400">
                      Jurisdiction / State
                    </span>

                    <span className="mt-0.5 block text-xs font-semibold text-slate-900">
                      {selectedSupplier.state} ({selectedSupplier.lga})
                    </span>
                  </div>
                </div>
              </div>

              {/* SECTION 2 */}
              <div className="space-y-2">
                <h4 className="font-display flex items-center gap-1.5 text-xs font-bold tracking-wider text-slate-900 uppercase">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />

                  <span>2. Regulatory Licenses & Quality Assurance</span>
                </h4>

                <div className="grid grid-cols-1 gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3.5 sm:grid-cols-3">
                  <div>
                    <span className="block text-[10.5px] text-slate-400">
                      PCN Premises License
                    </span>

                    <span className="mt-0.5 block font-mono text-xs font-bold text-slate-900">
                      {selectedSupplier.pcnPremisesLicense ||
                        selectedSupplier.licenseNumber ||
                        "PCN-PREM-2024-PENDING"}
                    </span>

                    <span className="mt-0.5 flex items-center gap-1 text-[10px] text-emerald-600">
                      <Check className="h-3 w-3" />
                      Validated with PCN Registry
                    </span>
                  </div>

                  <div>
                    <span className="block text-[10.5px] text-slate-400">
                      NAFDAC GDP Permit
                    </span>

                    <span className="mt-0.5 block font-mono text-xs font-bold text-slate-900">
                      {selectedSupplier.nafdacGdpLicense ||
                        "NAFDAC/GDP/2024/091"}
                    </span>

                    <span
                      className={`mt-0.5 flex items-center gap-1 text-[10px] ${
                        selectedSupplier.nafdacGdpLicense
                          ? "text-emerald-600"
                          : "text-red-600"
                      }`}
                    >
                      <Check className="h-3 w-3" />

                      {selectedSupplier.nafdacGdpLicense
                        ? "Good Distribution Practice"
                        : "GDP Documentation Pending"}
                    </span>
                  </div>

                  <div>
                    <span className="block text-[10.5px] text-slate-400">
                      Tax Identification Number
                    </span>

                    <span className="mt-0.5 block font-mono text-xs font-bold text-slate-900">
                      {selectedSupplier.taxIdentificationNumber ||
                        "TIN-00192847-0001"}
                    </span>

                    <span className="mt-0.5 flex items-center gap-1 text-[10px] text-emerald-600">
                      <Check className="h-3 w-3" />
                      FIRS Active Clearance
                    </span>
                  </div>
                </div>
              </div>

              {/* SECTION 3 */}
              <div className="space-y-2">
                <h4 className="font-display flex items-center gap-1.5 text-xs font-bold tracking-wider text-slate-900 uppercase">
                  <ThermometerSnowflake className="h-3.5 w-3.5 text-sky-600" />

                  <span>3. Logistics, Storage & Cold Room Audit</span>
                </h4>

                <div className="grid grid-cols-1 gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3.5 sm:grid-cols-2">
                  <div className="flex items-start gap-2.5">
                    <div className="rounded-lg bg-sky-100 p-2 text-sky-700">
                      <ThermometerSnowflake className="h-4 w-4" />
                    </div>

                    <div>
                      <span className="block text-xs font-semibold text-slate-900">
                        Certified Cold Storage:{" "}
                        {selectedSupplier.coldChainCapacityM3 || 150} m³
                      </span>

                      <p className="mt-0.5 text-[11px] text-slate-500">
                        Calibrated walk-in cold rooms maintained at +2°C to +8°C
                        with digital continuous data loggers.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="rounded-lg bg-amber-100 p-2 text-amber-700">
                      <Zap className="h-4 w-4" />
                    </div>

                    <div>
                      <span className="block text-xs font-semibold text-slate-900">
                        Uninterrupted Power Spec
                      </span>

                      <p className="mt-0.5 text-[11px] text-slate-500">
                        {selectedSupplier.backupPowerSpec ||
                          "Dual 500kVA Cummins Diesel Generators with Automatic Transfer Switch (ATS)."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 4 */}
              <div className="space-y-2">
                <h4 className="font-display flex items-center gap-1.5 text-xs font-bold tracking-wider text-slate-900 uppercase">
                  <CreditCard className="h-3.5 w-3.5 text-blue-600" />

                  <span>4. NIBSS / Central Bank Settlement Details</span>
                </h4>

                <div className="grid grid-cols-1 gap-3 rounded-xl border border-blue-100 bg-blue-50/50 p-3.5 sm:grid-cols-3">
                  <div>
                    <span className="block text-[10.5px] text-slate-400">
                      Settlement Bank
                    </span>

                    <span className="mt-0.5 block text-xs font-bold text-slate-900">
                      {selectedSupplier.settlementBankName}
                    </span>
                  </div>

                  <div>
                    <span className="block text-[10.5px] text-slate-400">
                      10-Digit NUBAN Account
                    </span>

                    <span className="mt-0.5 block font-mono text-xs font-bold text-blue-700">
                      {selectedSupplier.settlementAccountNumber}
                    </span>
                  </div>

                  <div>
                    <span className="block text-[10.5px] text-slate-400">
                      NIBSS Account Name
                    </span>

                    <span className="mt-0.5 block truncate text-xs font-bold text-slate-900">
                      {selectedSupplier.settlementAccountName}
                    </span>
                  </div>
                </div>
              </div>

              {/* SECTION 5 */}
              <div className="space-y-2">
                <h4 className="font-display flex items-center gap-1.5 text-xs font-bold tracking-wider text-slate-900 uppercase">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />

                  <span>5. Admin Statutory Verification Checklist</span>
                </h4>

                <div className="grid grid-cols-1 gap-2 rounded-xl border border-slate-100 bg-slate-50 p-3.5 sm:grid-cols-2">
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      checked={checklist.cacVerified}
                      onChange={(e) =>
                        setChecklist({
                          ...checklist,
                          cacVerified: e.target.checked,
                        })
                      }
                      className="rounded text-blue-600"
                    />

                    <span className="text-xs text-slate-700">
                      CAC Certificate of Incorporation verified
                    </span>
                  </label>

                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      checked={checklist.pcnPremisesVerified}
                      onChange={(e) =>
                        setChecklist({
                          ...checklist,
                          pcnPremisesVerified: e.target.checked,
                        })
                      }
                      className="rounded text-blue-600"
                    />

                    <span className="text-xs text-slate-700">
                      PCN Premises Annual Retention valid
                    </span>
                  </label>

                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      checked={checklist.nafdacGdpVerified}
                      onChange={(e) =>
                        setChecklist({
                          ...checklist,
                          nafdacGdpVerified: e.target.checked,
                        })
                      }
                      className="rounded text-blue-600"
                    />

                    <span className="text-xs text-slate-700">
                      NAFDAC GDP inspection certificate cleared
                    </span>
                  </label>

                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      checked={checklist.coldChainVerified}
                      onChange={(e) =>
                        setChecklist({
                          ...checklist,
                          coldChainVerified: e.target.checked,
                        })
                      }
                      className="rounded text-blue-600"
                    />

                    <span className="text-xs text-slate-700">
                      Cold room temperature excursion data logged
                    </span>
                  </label>

                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      checked={checklist.superintendentVerified}
                      onChange={(e) =>
                        setChecklist({
                          ...checklist,
                          superintendentVerified: e.target.checked,
                        })
                      }
                      className="rounded text-blue-600"
                    />

                    <span className="text-xs text-slate-700">
                      Superintendent Pharmacist practicing license current
                    </span>
                  </label>

                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      checked={checklist.bankAccountVerified}
                      onChange={(e) =>
                        setChecklist({
                          ...checklist,
                          bankAccountVerified: e.target.checked,
                        })
                      }
                      className="rounded text-blue-600"
                    />

                    <span className="text-xs text-slate-700">
                      NIBSS bank settlement match verified
                    </span>
                  </label>
                </div>
              </div>

              {/* SECTION 6 */}
              <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <span className="font-display block text-xs font-bold tracking-wider text-slate-900 uppercase">
                  6. Classification Tier & Matching Algorithm Weight Assignment
                </span>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div>
                    <label className="mb-1 block font-semibold text-slate-700">
                      Supplier Tier
                    </label>

                    <select
                      value={reviewTier}
                      onChange={(e) =>
                        setReviewTier(e.target.value as SupplierType)
                      }
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 font-semibold text-slate-900 focus:border-blue-500 focus:outline-none"
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
                    <label className="mb-1 block font-semibold text-slate-700">
                      Credit Assessment Tier
                    </label>

                    <select
                      value={creditRatingTier}
                      onChange={(e) =>
                        setCreditRatingTier(e.target.value as CreditRatingTier)
                      }
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none"
                    >
                      <option value="A">
                        Grade A (Prime Institutional Supplier)
                      </option>

                      <option value="B">
                        Grade B (Standard Commercial Supplier)
                      </option>

                      <option value="C">
                        Grade C (Restricted / High Monitoring)
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block font-semibold text-slate-700">
                      Assigned Sourcing Limit (₦)
                    </label>

                    <input
                      type="number"
                      step="1000000"
                      value={assignedCreditLimit}
                      onChange={(e) =>
                        setAssignedCreditLimit(Number(e.target.value))
                      }
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 font-mono text-slate-900 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Reviewer Notes */}
              <div className="space-y-1">
                <label className="block font-semibold text-slate-700">
                  Admin Regulatory Auditor Notes / Justification
                </label>

                <textarea
                  rows={2}
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Record verification remarks, GDP audit reference number, or reason for status update..."
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
                />
              </div>

              {/* Existing Suspension / Rejection Reason */}
              {(selectedSupplier.supplierApprovalStatus === "SUSPENDED" ||
                selectedSupplier.supplierApprovalStatus === "REJECTED") && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs">
                  <span className="block font-bold text-red-800">
                    Current Action Reason:
                  </span>

                  <p className="mt-0.5 text-red-700">
                    {selectedSupplier.kycSuspensionReason ||
                      selectedSupplier.kycRejectionReason ||
                      "Non-compliance"}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Actions Footer */}
            <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-slate-50 p-4">
              <div className="flex items-center gap-2">
                {selectedSupplier.supplierApprovalStatus !== "APPROVED" && (
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
                    className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 font-bold text-white shadow-xs transition hover:bg-emerald-700 disabled:opacity-50"
                  >
                    <CheckCircle2 className="h-4 w-4" />

                    <span>
                      {isSubmitting
                        ? "Processing..."
                        : "Approve KYC & Activate Sourcing"}
                    </span>
                  </button>
                )}

                {selectedSupplier.supplierApprovalStatus === "APPROVED" && (
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
                    className="cursor-pointer rounded-xl border border-red-200 bg-red-50 px-4 py-2 font-semibold text-red-700 transition hover:bg-red-100"
                  >
                    Suspend Supplier
                  </button>
                )}

                {selectedSupplier.supplierApprovalStatus === "SUSPENDED" && (
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
                    className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 font-bold text-white transition hover:bg-emerald-700"
                  >
                    <CheckCircle2 className="h-4 w-4" />

                    <span>Reinstate to Verified Pool</span>
                  </button>
                )}

                {selectedSupplier.supplierApprovalStatus === "PENDING" && (
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
                    className="cursor-pointer rounded-xl border border-red-200 bg-red-50 px-4 py-2 font-semibold text-red-700 transition hover:bg-red-100"
                  >
                    Reject Application
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedSupplier(null)}
                  className="cursor-pointer rounded-xl bg-slate-200 px-4 py-2 font-semibold text-slate-700 transition hover:bg-slate-300"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xl">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl font-bold ${
                confirmAction.type === "REINSTATE"
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-red-50 text-red-600"
              }`}
            >
              <AlertTriangle className="h-5 w-5" />
            </div>

            <div>
              <h3 className="font-display text-sm font-bold text-slate-900">
                Confirm {confirmAction.type} for{" "}
                {confirmAction.supplier.organization ||
                  confirmAction.supplier.name}
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                {confirmAction.type === "SUSPEND"
                  ? "Suspended suppliers cannot receive hospital procurement orders or participate in the automated algorithm."
                  : confirmAction.type === "REJECT"
                    ? "Rejecting this entity will disqualify their current credentials. A notification with reasons will be logged."
                    : "Reinstating this supplier will re-enable their active bidding and warehouse stock."}
              </p>
            </div>

            {confirmAction.type !== "REINSTATE" && (
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Mandatory Statutory Reason / Finding *
                </label>

                <textarea
                  rows={2}
                  required
                  value={actionReason}
                  onChange={(e) => setActionReason(e.target.value)}
                  placeholder="e.g. Expired NAFDAC GDP permit, failed temperature excursion log, or incorrect bank NUBAN..."
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none"
                />
              </div>
            )}

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setConfirmAction(null)}
                className="cursor-pointer rounded-xl bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={
                  isSubmitting ||
                  (confirmAction.type !== "REINSTATE" && !actionReason.trim())
                }
                onClick={() => {
                  const targetStatus: SupplierApprovalStatus =
                    confirmAction.type === "REINSTATE"
                      ? "APPROVED"
                      : confirmAction.type === "SUSPEND"
                        ? "SUSPENDED"
                        : "REJECTED"

                  handleExecuteStatusChange(
                    confirmAction.supplier,
                    targetStatus,
                    actionReason
                  )
                }}
                className={`cursor-pointer rounded-xl px-4 py-2 text-xs font-bold text-white transition disabled:opacity-50 ${
                  confirmAction.type === "REINSTATE"
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
  )
}

export default SupplierKYCManagement
