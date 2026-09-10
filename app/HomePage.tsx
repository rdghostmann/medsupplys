"use client"

import { FaqSection } from "@/components/FAQ/FAQ"
import { LogoCloud } from "@/components/LogoCloud/LogoCloud"
import Navbar from "@/components/Navbar/Navbar"
import TestimonialSection from "@/components/Testimonial/Testimonial"

import ComplianceSection from "@/components/ComplianceBlock/ComplianceBlock"
import Image from "next/image"
import { StatCard } from "@/components/ui/StatCard"
import {
  ShieldCheck,
  ArrowRight,
  Package,
  Building2,
  Users,
  CheckCircle2,
  Clock,
  ChevronRight,
} from "lucide-react"
import { SectionHeader } from "@/components/ui/SectionHeader"
import { useRouter } from "next/navigation"
import Services from "@/components/ui/ServiceCard"
import { ProcurementWorkflow } from "@/components/ui/ProcurementWorkflow"
import { CTASection } from "@/components/ui/CTASection"
import Footer from "@/components/Footer/Footer"
import HeroSection from "@/components/HeroSection/HeroSection"
import { StarAndCrescentIcon } from "@phosphor-icons/react"

export default function HomePage() {
  const router = useRouter()
  return (
    <div className="font-dm-sans min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      {/* <Hero /> */}

      <HeroSection />

      <LogoCloud />

      {/* STATS SECTION */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Platform Metrics"
            title="Enterprise Healthcare Procurement Scale"
            subtitle="Powering verified drug supplies across tertiary teaching hospitals, private clinic groups, and state healthcare networks."
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            <StatCard
              label="Verified Products"
              value="1,500+"
              subtext="National drug formulary"
              icon={Package}
              highlight={true}
            />
            <StatCard
              label="Verified Suppliers"
              value="250+"
              subtext="Importers &amp; Distributors"
              icon={Building2}
              trend="+18% MoM"
            />
            <StatCard
              label="Healthcare Buyers"
              value="1,000+"
              subtext="Hospitals &amp; Clinics"
              icon={Users}
            />
            <StatCard
              label="Order Fulfillment"
              value="98.4%"
              subtext="On-time delivery rate"
              icon={CheckCircle2}
              trend="99.7% Cold"
            />
            <StatCard
              label="Procurement Access"
              value="24/7"
              subtext="Real-time ordering portal"
              icon={Clock}
            />
            <StatCard
              label="Years of Service"
              value="5+"
              subtext="Trusted by healthcare providers"
              icon={StarAndCrescentIcon}
            />
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section className="border-t border-slate-200/80 bg-slate-50/60 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Core Solutions"
            title="Everything You Need to Procure Smarter"
            subtitle="A comprehensive pharmaceutical supply chain infrastructure engineered for transparency, regulatory compliance, and cost containment."
          />

          <div className="">
            <Services />
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => router.push("/services")}
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-linear-to-r from-[#1e40af] to-[#00b87c] px-6 py-3 text-xs font-bold text-white shadow-md shadow-blue-700/15 transition-all hover:from-[#1d4ed8] hover:to-[#059669]"
            >
              <span>Explore All 10 Enterprise Procurement Services</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="border-t border-slate-200/80 bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Procurement Lifecycle"
            title="How Pharmaceutical Procurement Works"
            subtitle="From formulary drug search to multi-quote comparison, digital PO transmission, and verified cold-chain handover."
          />

          <ProcurementWorkflow />
        </div>
      </section>

      {/* WHY MEDSUPPLY SECTION - REFACTORED TO WHITE / LIGHT SOPHISTICATED THEME */}
      <section className="relative overflow-hidden border-t border-slate-200/80 bg-linear-to-b from-white to-slate-50/80 py-16 sm:py-24">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-semibold tracking-wider text-blue-900 uppercase">
                <ShieldCheck size={14} className="text-emerald-600" />
                Institutional Superiority
              </div>

              <h2 className="text-3xl leading-tight font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                Built Around the Way Healthcare Procurement Actually Works
              </h2>

              <p className="mt-4 text-base leading-relaxed text-slate-600">
                Traditional hospital drug procurement is crippled by opaque
                pricing, fragmented telephone quotes, unverified suppliers, and
                paper tracking. MedSupply eliminates these vulnerabilities with
                an automated, compliance-first B2B enterprise platform.
              </p>

              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  {
                    title: "Verified Supplier Network",
                    desc: "100% NAFDAC & PCN audited premises with certified GDP cold-chain controls.",
                  },
                  {
                    title: "Transparent Line-Item Pricing",
                    desc: "Real-time multi-supplier quote comparison without broker markups or hidden fees.",
                  },
                  {
                    title: "Faster Procurement Turnaround",
                    desc: "Cut requisition-to-delivery lead times from weeks to under 48 hours.",
                  },
                  {
                    title: "Centralized Order Management",
                    desc: "Institutional purchase approvals, delivery tracking, and VAT invoices in one hub.",
                  },
                  {
                    title: "Pharmaceutical Compliance",
                    desc: "Digital Certificates of Analysis (CoA) and batch traceability attached to every PO.",
                  },
                  {
                    title: "Real-Time Telemetry Visibility",
                    desc: "GPS vehicle tracking and calibrated cold-chain temperature sensor oversight.",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-xs transition-all hover:border-blue-400 hover:shadow-md"
                  >
                    <CheckCircle2
                      size={18}
                      className="mt-0.5 shrink-0 text-emerald-600"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">
                        {item.title}
                      </h4>
                      <p className="mt-0.5 text-[11px] leading-snug text-slate-500">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex items-center gap-4">
                <button
                  onClick={() => router.push("/why-medsupply")}
                  className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-linear-to-r from-[#1e40af] to-[#00b87c] px-6 py-3 text-xs font-bold text-white shadow-md shadow-blue-700/15 transition-all hover:from-[#1d4ed8] hover:to-[#059669]"
                >
                  <span>Read Full Comparison Analysis</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>

            <div className="relative lg:col-span-5">
              <div className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-2 shadow-xl">
                <Image
                  src="/professional-healthcare-procurement-team-reviewing-pharmaceutical-supplies.png"
                  alt="Professional healthcare procurement team reviewing pharmaceutical supplies"
                  width={1000}
                  height={667}
                  className="h-115 w-full rounded-xl object-cover"
                />
                <div className="pointer-events-none absolute inset-2 rounded-xl bg-linear-to-t from-slate-950/85 via-slate-950/20 to-transparent" />
                <div className="absolute right-6 bottom-6 left-6 rounded-xl border border-slate-200 bg-white/95 p-4 text-xs shadow-xl backdrop-blur-md">
                  <div className="mb-1 flex items-center gap-2">
                    <Image
                      src="/logo.png"
                      alt="MedSupply Logo"
                      width={20}
                      height={20}
                    />
                    <span className="block font-bold text-slate-900">
                      Hospital Procurement Committee Review
                    </span>
                  </div>
                  <q className="mt-1 text-[11px] leading-relaxed text-slate-600">
                    MedSupplys multi-supplier price audit logs simplified our
                    quarterly clinical board review by providing transparent,
                    tamper-proof cost comparisons.
                  </q>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ComplianceSection />
      {/* <Testimonial /> */}
      <TestimonialSection />
      {/* <BlogSection /> */}
      <FaqSection />

      {/* CALL TO ACTION */}
      <CTASection />
      {/* FOOTER */}
      <Footer />
    </div>
  )
}
