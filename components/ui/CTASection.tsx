"use client"
import React from "react"
import { ArrowRight, ShieldCheck, CheckCircle2, Building2 } from "lucide-react"
import { MedSupplyLogo } from "./MedSupplyLogo"
import { useRouter } from "next/navigation"
export const CTASection: React.FC = () => {
  const router = useRouter()
  return (
    <section className="relative overflow-hidden border-t border-b border-slate-200/80 bg-linear-to-b from-white via-blue-50/30 to-emerald-50/30 px-4 py-20 text-slate-900 sm:px-6 lg:px-8">
      {/* Background subtle ambient lighting */}
      <div className="pointer-events-none absolute top-0 right-0 -mt-24 -mr-24 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 -mb-24 -ml-24 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-5xl text-center">
        {/* Official Logo Mark Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200/90 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-800 shadow-xs">
          <MedSupplyLogo variant="iconOnly" size="sm" />
          <span className="font-bold text-slate-900">
            Enterprise Healthcare Infrastructure
          </span>
          <span className="text-slate-400">&bull;</span>
          <span className="font-mono text-[11px] font-bold text-emerald-700">
            Verified B2B
          </span>
        </div>

        <h2 className="text-3xl leading-tight font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
          Ready to Modernize Your{" "}
          <span className="bg-linear-to-r from-[#1e40af] via-[#0284c7] to-[#00b87c] bg-clip-text text-transparent">
            Pharmaceutical Procurement
          </span>
          ?
        </h2>

        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
          Connect with verified suppliers, compare procurement options in
          real-time, and manage your healthcare supply chain from one
          centralized, compliance-ready platform.
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            onClick={() => {}}
            className="group flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#1e40af] via-[#0284c7] to-[#00b87c] px-8 py-3.5 text-sm font-bold text-white shadow-md shadow-blue-700/20 transition-all hover:from-[#1d4ed8] hover:to-[#059669] sm:w-auto"
          >
            <span>Start Procuring Now</span>
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </button>

          <button
            onClick={() => router.push("/become-supplier")}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-8 py-3.5 text-sm font-bold text-slate-800 shadow-xs transition-all hover:bg-slate-50 sm:w-auto"
          >
            <Building2 size={16} className="text-blue-700" />
            <span>Become a Verified Supplier</span>
          </button>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 border-t border-slate-200/80 pt-8 text-xs text-slate-600 sm:gap-10">
          <span className="flex items-center gap-2">
            <CheckCircle2 size={14} className="shrink-0 text-emerald-600" />
            100% NAFDAC &amp; PCN Verified Suppliers
          </span>
          <span className="flex items-center gap-2">
            <CheckCircle2 size={14} className="shrink-0 text-emerald-600" />
            Zero Setup Fees for Hospitals &amp; Clinics
          </span>
          <span className="flex items-center gap-2">
            <CheckCircle2 size={14} className="shrink-0 text-emerald-600" />
            Calibrated 2–8°C Cold-Chain Tracking
          </span>
        </div>
      </div>
    </section>
  )
}
