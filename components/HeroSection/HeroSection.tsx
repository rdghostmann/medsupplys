"use client"
import React from "react"
import { MedSupplyLogo } from "../ui/MedSupplyLogo"
import {
  ShieldCheck,
  BadgeCheck,
  Truck,
  ArrowRight,
  Package,
  Building2,
  Users,
  CheckCircle2,
  Clock,
  Lock,
  ChevronRight,
  Award,
  CreditCard,
} from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
const HeroSection = () => {
  const router = useRouter()
  return (
    <div>
      {/* HERO SECTION - WHITE THEME WITH BRAND GRADIENTS */}
      <section className="relative overflow-hidden pt-32 pb-16 lg:pt-48 lg:pb-32">
        {/* <section className="relative overflow-hidden bg-linear-to-b from-white via-blue-50/25 to-emerald-50/20 text-slate-900 pt-10 pb-20 lg:pt-16 lg:pb-28 border-b border-slate-200/80"> */}
        {/* Subtle Ambient Brand Gradient Background */}
        <div className="pointer-events-none absolute top-10 left-1/2 h-87.5 w-175 -translate-x-1/2 rounded-full bg-linear-to-r from-blue-400/10 via-sky-400/10 to-emerald-400/10 blur-3xl" />
        <div className="pointer-events-none absolute top-0 right-0 h-62.5 w-87.5 rounded-full bg-emerald-500/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            {/* Top Brand Pill with Logo */}
            <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold tracking-wider text-slate-800 uppercase shadow-xs">
              {/* <MedSupplyLogo variant="iconOnly" size="sm" /> */}
              🔬
              <span className="text-[9px] font-bold text-slate-900 md:text-sm">
                Enterprise Pharmaceutical Procurement Network
              </span>
              {/* <span className="text-slate-900 font-bold"> Verification-Based B2B Platform</span> */}
              <span className="hidden rounded-full bg-emerald-50 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-700">
                VERIFIED
              </span>
            </div>

            <h1 className="text-3xl leading-tight font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Smarter Pharmaceutical Procurement{" "}
              <span className="bg-linear-to-r from-[#1e40af] via-[#0284c7] to-[#00b87c] bg-clip-text text-transparent">
                Starts Here.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
              MedSupply connects healthcare organizations with verified
              pharmaceutical suppliers, making sourcing, quotation comparison,
              procurement, and cold-chain delivery faster, safer, and completely
              transparent.
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

            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-600">
              <span className="flex items-center gap-1.5">
                <BadgeCheck size={14} className="text-emerald-600" />
                Verified NAFDAC &amp; PCN Licensure
              </span>
              <span className="flex items-center gap-1.5">
                <Truck size={14} className="text-blue-600" />
                Good Distribution Practices (GDP)
              </span>
              <span className="flex items-center gap-1.5">
                <Lock size={14} className="text-emerald-600" />
                Direct Manufacturer &amp; Wholesaler Pricing
              </span>
            </div>
          </div>

          {/* Right Visual Image & Live Overlay Cards */}
          <div className="relative mt-12 sm:mt-16 lg:col-span-5">
            <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-slate-100 shadow-xl">
              <Image
                src="/medsupply_hero_pharmacy_1788851113035.jpg"
                alt="Verified Pharmaceutical Procurement Center"
                width={1376}
                height={768}
                // referrerPolicy="no-referrer"
                className="h-115 w-full transform object-cover object-center transition duration-700 hover:scale-102"
              />

              {/* Subtle gradient vignette */}
              <div className="absolute inset-0 bg-linear-to-t from-slate-950/70 via-transparent to-transparent"></div>

              {/* Bottom Overlay Info */}
              <div className="absolute right-4 bottom-4 left-4 text-white">
                <span className="block font-mono text-[10px] font-bold tracking-widest text-emerald-400 uppercase">
                  ● Live Procurement Hub
                </span>
                <p className="font-display text-sm font-bold text-white">
                  Central Pharmaceutical Distribution & QA Laboratory
                </p>
                <p className="text-[11px] text-slate-300">
                  Active temperature monitoring: 2.8°C | 1,240 Certified SKUs
                  Available
                </p>
              </div>
            </div>

            {/* Floating Live Telemetry Badge 1: QA Pharmacist */}
            <div className="absolute -top-4 -left-4 flex max-w-xs animate-in items-center gap-3 rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-lg backdrop-blur-md duration-500 fade-in slide-in-from-bottom-2">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-600">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs leading-none font-bold text-slate-900">
                  NAFDAC Batch Release
                </p>
                <p className="mt-0.5 text-[10px] font-semibold text-emerald-600">
                  ● 100% Laboratory CoA Verified
                </p>
              </div>
            </div>

            {/* Floating Live Telemetry Badge 2: Net 30 Credit */}
            <div className="absolute -right-4 -bottom-5 flex max-w-xs items-center gap-3 rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-lg backdrop-blur-md">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 text-blue-600">
                <CreditCard className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs leading-none font-bold text-slate-900">
                  Net-30 Working Capital
                </p>
                <p className="mt-0.5 text-[10px] font-semibold text-blue-600">
                  Up to ₦50M Facility for Hospitals
                </p>
              </div>
            </div>
          </div>

          {/* Hero Visual Dashboard Preview Container with Floating UI Badges */}
          <div className="relative mt-12 hidden sm:mt-16">
            {/* Floating UI Badge 1: Top Left */}
            <div className="absolute -top-5 -left-3 z-20 hidden items-center gap-2.5 rounded-xl border border-slate-200/90 bg-white/95 px-4 py-2.5 text-slate-900 shadow-lg backdrop-blur-md md:flex">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-600">
                <BadgeCheck size={18} />
              </div>
              <div>
                <span className="block text-xs font-bold text-slate-900">
                  Verified Supplier Tier 1
                </span>
                <span className="font-mono text-[10px] text-slate-500">
                  NAFDAC Reg: WDD-2021-04
                </span>
              </div>
            </div>

            {/* Floating UI Badge 2: Top Right */}
            <div className="absolute -top-5 -right-3 z-20 hidden items-center gap-2.5 rounded-xl border border-slate-200/90 bg-white/95 px-4 py-2.5 text-slate-900 shadow-lg backdrop-blur-md md:flex">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 text-blue-700">
                <Package size={18} />
              </div>
              <div>
                <span className="block text-xs font-bold text-slate-900">
                  1,500+ Essential Formularies
                </span>
                <span className="text-[10px] text-slate-500">
                  National Master Drug Catalog
                </span>
              </div>
            </div>

            {/* Floating UI Badge 3: Bottom Left */}
            <div className="absolute -bottom-5 -left-4 z-20 hidden items-center gap-2.5 rounded-xl border border-slate-200/90 bg-white/95 px-4 py-2.5 text-slate-900 shadow-lg backdrop-blur-md lg:flex">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-600">
                <CheckCircle2 size={18} />
              </div>
              <div>
                <span className="block text-xs font-bold text-slate-900">
                  PO Confirmed &amp; Dispatched
                </span>
                <span className="font-mono text-[10px] text-slate-500">
                  PO-2026-8941 &bull; ₦4,472,000
                </span>
              </div>
            </div>

            {/* Floating UI Badge 4: Bottom Right */}
            <div className="absolute -right-4 -bottom-5 z-20 hidden items-center gap-2.5 rounded-xl border border-slate-200/90 bg-white/95 px-4 py-2.5 text-slate-900 shadow-lg backdrop-blur-md lg:flex">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 text-blue-700">
                <Truck size={18} />
              </div>
              <div>
                <span className="block text-xs font-bold text-slate-900">
                  Cold Chain Active (2–8°C)
                </span>
                <span className="font-mono text-[10px] font-bold text-emerald-600">
                  Live Sensor: 4.2°C Steady
                </span>
              </div>
            </div>

            {/* Dashboard Preview UI Image */}
            <div>
              <Image
                src="/hero-dashboard-preview.png"
                alt="MedSupply Dashboard Preview"
                width={1493}
                height={707}
                className="h-auto w-full rounded-2xl border border-slate-200/90 shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HeroSection
