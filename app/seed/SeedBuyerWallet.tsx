"use client"

import React, { useState } from "react"
import {
  CreditCard,
  UserRound,
  Database,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
  ShieldCheck,
} from "lucide-react"
import { toast } from "sonner"

interface CreditAccount {
  _id: string
  buyerId: string
  buyerName: string

  creditLimit: number
  availableCredit: number
  creditUsed: number
  outstandingBalance: number

  status: "PENDING" | "ACTIVE" | "SUSPENDED" | "EXPIRED" | "CLOSED"

  ratingTier: "A" | "B" | "C" | "UNRATED"

  approvedBy?: string
  approvedAt?: string
  dueDate?: string

  terms: string
  interestRatePercent: number

  createdAt: string
  updatedAt: string
}

interface SeedResponse {
  success: boolean
  seeded?: boolean
  alreadyExists?: boolean
  message: string
  creditAccount?: CreditAccount
}

const formatCurrency = (amount: number | string | null | undefined) => {
  const value = Number(amount ?? 0)

  if (!Number.isFinite(value)) {
    return "₦0"
  }

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value)
}

const SeedBuyerCreditAccount: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)

  const [creditAccount, setCreditAccount] = useState<CreditAccount | null>(null)

  const [status, setStatus] = useState<"idle" | "success" | "exists" | "error">(
    "idle"
  )

  const seedCreditAccount = async () => {
    try {
      setIsLoading(true)
      setStatus("idle")

      const response = await fetch("/api/seed-wallet", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },
      })

      const data: SeedResponse = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to seed credit account.")
      }

      if (data.creditAccount) {
        setCreditAccount(data.creditAccount)
      }

      if (data.alreadyExists) {
        setStatus("exists")

        toast.info("Credit account already exists", {
          description: data.message,
        })

        return
      }

      setStatus("success")

      toast.success("Credit account seeded successfully", {
        description: "₦10,000,000 credit facility is now available.",
      })
    } catch (error) {
      console.error(error)

      setStatus("error")

      toast.error("Credit account seeding failed", {
        description:
          error instanceof Error
            ? error.message
            : "Unable to seed credit account.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-200 bg-slate-50 px-6 py-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100">
              <CreditCard className="h-5 w-5 text-blue-700" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Seed Buyer Credit Account
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Create the initial credit facility for the LUTH buyer.
              </p>
            </div>
          </div>

          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
            ADMIN
          </span>
        </div>
      </div>

      <div className="p-6">
        {/* Buyer + Credit Limit */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Buyer */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-2 flex items-center gap-2 text-xs font-medium tracking-wide text-slate-500 uppercase">
              <UserRound className="h-4 w-4" />
              Buyer
            </div>

            <p className="font-semibold text-slate-900">
              Lagos University Teaching Hospital (LUTH)
            </p>

            <p className="mt-1 font-mono text-xs break-all text-slate-500">
              6a9cb82d853e785e43c110b8
            </p>
          </div>

          {/* Credit Limit */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-2 flex items-center gap-2 text-xs font-medium tracking-wide text-slate-500 uppercase">
              <Database className="h-4 w-4" />
              Credit Limit
            </div>

            <p className="text-2xl font-bold text-blue-700">₦10,000,000</p>

            <p className="mt-1 text-xs text-slate-500">
              Initial approved credit facility
            </p>
          </div>
        </div>

        {/* Credit Terms */}
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 p-4">
            <p className="text-xs text-slate-500">Rating</p>

            <div className="mt-1 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />

              <span className="font-semibold text-slate-900">Tier A</span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 p-4">
            <p className="text-xs text-slate-500">Terms</p>

            <p className="mt-1 font-semibold text-slate-900">Net 30 days</p>
          </div>

          <div className="rounded-xl border border-slate-200 p-4">
            <p className="text-xs text-slate-500">Interest</p>

            <p className="mt-1 font-semibold text-slate-900">0%</p>
          </div>
        </div>

        {/* Seed Button */}
        <div className="mt-6">
          <button
            type="button"
            onClick={seedCreditAccount}
            disabled={isLoading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Seeding Credit Account...
              </>
            ) : creditAccount ? (
              <>
                <RefreshCw className="h-4 w-4" />
                Check Credit Account Again
              </>
            ) : (
              <>
                <CreditCard className="h-4 w-4" />
                Seed Credit Account
              </>
            )}
          </button>
        </div>

        {/* Status */}
        {status !== "idle" && (
          <div className="mt-5">
            {status === "success" && (
              <div className="flex gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

                <div>
                  <p className="font-semibold text-emerald-900">
                    Credit account seeded successfully
                  </p>

                  <p className="mt-1 text-sm text-emerald-700">
                    The buyer now has an active ₦10,000,000 credit facility.
                  </p>
                </div>
              </div>
            )}

            {status === "exists" && (
              <div className="flex gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />

                <div>
                  <p className="font-semibold text-blue-900">
                    Credit account already exists
                  </p>

                  <p className="mt-1 text-sm text-blue-700">
                    No duplicate credit account was created.
                  </p>
                </div>
              </div>
            )}

            {status === "error" && (
              <div className="flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

                <div>
                  <p className="font-semibold text-red-900">
                    Credit account seeding failed
                  </p>

                  <p className="mt-1 text-sm text-red-700">
                    Check the server logs for more details.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Credit Account Record */}
        {creditAccount && (
          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-4">
              <h3 className="font-semibold text-slate-900">Credit Account</h3>

              <div className="flex items-center gap-2">
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                  {creditAccount.status}
                </span>

                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                  TIER {creditAccount.ratingTier}
                </span>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              <div className="flex items-center justify-between gap-4 px-5 py-3">
                <span className="text-sm text-slate-500">
                  Credit Account ID
                </span>

                <span className="font-mono text-xs break-all text-slate-700">
                  {creditAccount._id}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4 px-5 py-3">
                <span className="text-sm text-slate-500">Buyer</span>

                <span className="text-right text-sm font-medium text-slate-900">
                  {creditAccount.buyerName}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4 px-5 py-3">
                <span className="text-sm text-slate-500">Credit Limit</span>

                <span className="text-sm font-bold text-blue-700">
                  {formatCurrency(creditAccount.creditLimit)}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4 px-5 py-3">
                <span className="text-sm text-slate-500">Available Credit</span>

                <span className="text-sm font-bold text-emerald-700">
                  {formatCurrency(creditAccount.availableCredit)}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4 px-5 py-3">
                <span className="text-sm text-slate-500">Credit Used</span>

                <span className="text-sm font-semibold text-slate-900">
                  {formatCurrency(creditAccount.creditUsed)}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4 px-5 py-3">
                <span className="text-sm text-slate-500">
                  Outstanding Balance
                </span>

                <span className="text-sm font-semibold text-slate-900">
                  {formatCurrency(creditAccount.outstandingBalance)}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4 px-5 py-3">
                <span className="text-sm text-slate-500">Payment Terms</span>

                <span className="text-sm font-medium text-slate-900">
                  {creditAccount.terms}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4 px-5 py-3">
                <span className="text-sm text-slate-500">Interest Rate</span>

                <span className="text-sm font-medium text-slate-900">
                  {creditAccount.interestRatePercent}%
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default SeedBuyerCreditAccount
