"use client"
import React from 'react'
import { MedSupplyLogo } from '../ui/MedSupplyLogo'
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
  CreditCard
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
const HeroSection = () => {
  const router = useRouter();
  return (
    <div>
      {/* HERO SECTION - WHITE THEME WITH BRAND GRADIENTS */}
      <section className="relative pt-32 pb-16 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* <section className="relative overflow-hidden bg-linear-to-b from-white via-blue-50/25 to-emerald-50/20 text-slate-900 pt-10 pb-20 lg:pt-16 lg:pb-28 border-b border-slate-200/80"> */}
        {/* Subtle Ambient Brand Gradient Background */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-175 h-87.5 bg-linear-to-r from-blue-400/10 via-sky-400/10 to-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-0 w-87.5 h-62.5 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            {/* Top Brand Pill with Logo */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-xs text-slate-800 text-xs font-semibold uppercase tracking-wider mb-6">
              {/* <MedSupplyLogo variant="iconOnly" size="sm" /> */}
              🔬
              <span className="text-[9px] md:text-sm text-slate-900 font-bold">Enterprise Pharmaceutical Procurement Network</span>
              {/* <span className="text-slate-900 font-bold"> Verification-Based B2B Platform</span> */}
              <span className="hidden text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold">VERIFIED</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-slate-900">
              Smarter Pharmaceutical Procurement{' '}
              <span className="bg-linear-to-r from-[#1e40af] via-[#0284c7] to-[#00b87c] bg-clip-text text-transparent">
                Starts Here.
              </span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              MedSupply connects healthcare organizations with verified pharmaceutical suppliers, making sourcing, quotation comparison, procurement, and cold-chain delivery faster, safer, and completely transparent.
            </p>

            <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => { }}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-linear-to-r from-[#1e40af] via-[#0284c7] to-[#00b87c] hover:from-[#1d4ed8] hover:to-[#059669] text-white font-bold text-sm transition-all shadow-md shadow-blue-700/20 flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Start Procuring Now</span>
                <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() => router.push('/become-supplier')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-sm transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
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
          <div className="lg:col-span-5 mt-12 sm:mt-16 relative">
            <div className="relative rounded-3xl overflow-hidden border border-slate-200/90 shadow-xl bg-slate-100">
              <Image
                src="/medsupply_hero_pharmacy_1788851113035.jpg"
                alt="Verified Pharmaceutical Procurement Center"
                width={1376}
                height={768}
                // referrerPolicy="no-referrer"
                className="w-full h-115 object-cover object-center transform hover:scale-102 transition duration-700"
              />

              {/* Subtle gradient vignette */}
              <div className="absolute inset-0 bg-linear-to-t from-slate-950/70 via-transparent to-transparent"></div>

              {/* Bottom Overlay Info */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 block font-bold">
                  ● Live Procurement Hub
                </span>
                <p className="font-display font-bold text-sm text-white">
                  Central Pharmaceutical Distribution & QA Laboratory
                </p>
                <p className="text-[11px] text-slate-300">
                  Active temperature monitoring: 2.8°C | 1,240 Certified SKUs Available
                </p>
              </div>
            </div>

            {/* Floating Live Telemetry Badge 1: QA Pharmacist */}
            <div className="absolute -top-4 -left-4 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 p-3 shadow-lg flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-xs">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 leading-none">NAFDAC Batch Release</p>
                <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">
                  ● 100% Laboratory CoA Verified
                </p>
              </div>
            </div>

            {/* Floating Live Telemetry Badge 2: Net 30 Credit */}
            <div className="absolute -bottom-5 -right-4 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 p-3 shadow-lg flex items-center gap-3 max-w-xs">
              <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 leading-none">Net-30 Working Capital</p>
                <p className="text-[10px] text-blue-600 font-semibold mt-0.5">
                  Up to ₦50M Facility for Hospitals
                </p>
              </div>
            </div>
          </div>

          {/* Hero Visual Dashboard Preview Container with Floating UI Badges */}
          <div className="hidden mt-12 sm:mt-16 relative">

            {/* Floating UI Badge 1: Top Left */}
            <div className="hidden md:flex absolute -top-5 -left-3 z-20 items-center gap-2.5 bg-white/95 backdrop-blur-md text-slate-900 px-4 py-2.5 rounded-xl border border-slate-200/90 shadow-lg">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
                <BadgeCheck size={18} />
              </div>
              <div>
                <span className="text-xs font-bold block text-slate-900">Verified Supplier Tier 1</span>
                <span className="text-[10px] text-slate-500 font-mono">NAFDAC Reg: WDD-2021-04</span>
              </div>
            </div>

            {/* Floating UI Badge 2: Top Right */}
            <div className="hidden md:flex absolute -top-5 -right-3 z-20 items-center gap-2.5 bg-white/95 backdrop-blur-md text-slate-900 px-4 py-2.5 rounded-xl border border-slate-200/90 shadow-lg">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-200">
                <Package size={18} />
              </div>
              <div>
                <span className="text-xs font-bold block text-slate-900">1,500+ Essential Formularies</span>
                <span className="text-[10px] text-slate-500">National Master Drug Catalog</span>
              </div>
            </div>

            {/* Floating UI Badge 3: Bottom Left */}
            <div className="hidden lg:flex absolute -bottom-5 -left-4 z-20 items-center gap-2.5 bg-white/95 backdrop-blur-md text-slate-900 px-4 py-2.5 rounded-xl border border-slate-200/90 shadow-lg">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
                <CheckCircle2 size={18} />
              </div>
              <div>
                <span className="text-xs font-bold block text-slate-900">PO Confirmed &amp; Dispatched</span>
                <span className="text-[10px] text-slate-500 font-mono">PO-2026-8941 &bull; ₦4,472,000</span>
              </div>
            </div>

            {/* Floating UI Badge 4: Bottom Right */}
            <div className="hidden lg:flex absolute -bottom-5 -right-4 z-20 items-center gap-2.5 bg-white/95 backdrop-blur-md text-slate-900 px-4 py-2.5 rounded-xl border border-slate-200/90 shadow-lg">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-200">
                <Truck size={18} />
              </div>
              <div>
                <span className="text-xs font-bold block text-slate-900">Cold Chain Active (2–8°C)</span>
                <span className="text-[10px] text-emerald-600 font-mono font-bold">Live Sensor: 4.2°C Steady</span>
              </div>
            </div>

            {/* Dashboard Preview UI Image */}
            <div>
              <Image
                src="/hero-dashboard-preview.png"
                alt="MedSupply Dashboard Preview"
                width={1493}
                height={707}
                className="w-full h-auto rounded-2xl border border-slate-200/90 shadow-lg"
              />
            </div>

          </div>
        </div>
      </section>

    </div>
  )
}

export default HeroSection
