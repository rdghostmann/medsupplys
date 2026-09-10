// WelcomeBanner.tsx
"use client"

import React from "react"
import {
  ArrowUpRight,
  Building2,
  CreditCard,
  Package2Icon,
  Wallet,
} from "lucide-react"
import { Package, Package2, ShieldCheck } from "@hugeicons/core-free-icons"
import { WalletIcon } from "@phosphor-icons/react"
import { ShieldCheckIcon } from "@phosphor-icons/react/dist/ssr"
import { useRouter } from "next/navigation"

interface WelcomeBannerProps {
  id?: string
  fullName: string
  organization?: string
  walletBalance: number
  creditAvailable: number
  loading?: boolean
}

const formatCurrency = (value: number) =>
  `₦${Number(value || 0).toLocaleString("en-NG")}`

export const WelcomeBanner: React.FC<WelcomeBannerProps> = ({
  id,
  fullName,
  organization,
  walletBalance,
  creditAvailable,
  loading = false,
}) => {
  const router = useRouter()

  return (
    <div
      id={id}
      className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-blue-900 via-blue-800 to-indigo-900 p-6 text-white shadow-lg">
        <div className="pointer-events-none absolute top-0 right-0 bottom-0 flex items-center pr-8 opacity-10">
          <ShieldCheckIcon className="h-64 w-64" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold text-sky-200 backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-emerald-400"></span> Buyer
            Procurement Workspace
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight">
            Welcome back, {fullName}
          </h1>
          <p className="mt-1.5 text-xs leading-relaxed text-blue-100/80">
            Automated multi-factor pharmaceutical matching, atomic Paystack
            escrow settlement, and licensed NAFDAC pharmacist verification.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                router.push("/buyer/marketplace")
              }}
              className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-xs font-bold text-blue-900 shadow-md transition hover:bg-slate-100"
            >
              <Package2Icon className="h-4 w-4 text-blue-600" />
              <span>Browse Regulated Catalogue</span>
            </button>

            <button
              onClick={() => {
                router.push("/buyer/buyerwallet")
              }}
              className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-700"
            >
              <WalletIcon className="h-4 w-4" />
              <span>Fund Institutional Wallet</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WelcomeBanner
