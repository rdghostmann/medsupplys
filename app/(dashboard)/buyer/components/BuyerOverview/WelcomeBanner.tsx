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
  return (
    <div
      id={id}
      className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
     

      {/* Welcome Banner */}
      <div className="bg-linear-to-r from-blue-900 via-blue-800 to-indigo-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 flex items-center pr-8 pointer-events-none">
          <ShieldCheckIcon className="w-64 h-64" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-sky-200 text-xs font-semibold mb-3 border border-white/10">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Buyer Procurement Workspace
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight">
              Welcome back, {fullName}
          </h1>
          <p className="text-blue-100/80 text-xs mt-1.5 leading-relaxed">
            Automated multi-factor pharmaceutical matching, atomic Paystack escrow settlement, and licensed NAFDAC pharmacist verification.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-5">
            <button
              onClick={() => {}}
              className="px-4 py-2 bg-white hover:bg-slate-100 text-blue-900 rounded-xl font-bold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
            >
              <Package2Icon className="w-4 h-4 text-blue-600" />
              <span>Browse Regulated Catalogue</span>
            </button>

            <button
              // onClick={() => setIsPaystackModalOpen(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-600/20 transition flex items-center gap-1.5 cursor-pointer"
            >
              <WalletIcon className="w-4 h-4" />
              <span>Fund Institutional Wallet</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WelcomeBanner