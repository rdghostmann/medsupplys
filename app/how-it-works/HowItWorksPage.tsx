"use client"
import React, { useState } from "react"

import { SectionHeader } from "@/components/ui/SectionHeader"

import { ProcurementWorkflow } from "@/components/ui/ProcurementWorkflow"
import { CTASection } from "@/components/ui/CTASection"
import {
  Search,
  Layers,
  Building2,
  FileCheck,
  Truck,
  ShieldCheck,
  BadgeCheck,
  UserCheck,
  Package,
  CheckCircle2,
  ArrowRight,
  ClipboardList,
  Sparkles,
} from "lucide-react"
import { useRouter } from "next/navigation"

export const HowItWorksPage: React.FC = () => {
  const [selectedRoleFlow, setSelectedRoleFlow] = useState<
    "buyer" | "supplier"
  >("buyer")

  const router = useRouter()

  const buyerSteps = [
    {
      step: "01",
      title: "Create Verified Account",
      desc: "Register your healthcare institution (Teaching Hospital, Private Clinic, Pharmacy Chain, or Medical Board) and upload your premises operating license.",
      icon: UserCheck,
    },
    {
      step: "02",
      title: "Search Standard Formulary",
      desc: "Search over 1,500+ pharmaceutical SKUs by generic API, brand name, dosage form, or official NAFDAC registration number.",
      icon: Search,
    },
    {
      step: "03",
      title: "Compare Competing Suppliers",
      desc: "Evaluate side-by-side quotations for unit price, volume discounts, available warehouse batches, expiry dates, and delivery lead times.",
      icon: Layers,
    },
    {
      step: "04",
      title: "Issue Digital Purchase Order (PO)",
      desc: "Route requisition through your internal institutional approval chain. Once authorized, generate and transmit a legally binding digital PO.",
      icon: FileCheck,
    },
    {
      step: "05",
      title: "Track With Cold-Chain Telemetry",
      desc: "Monitor real-time dispatch, transit milestones, and IoT cold-chain temperature logs (2-8°C) until verified receipt at your pharmacy bay.",
      icon: Truck,
    },
  ]

  const supplierSteps = [
    {
      step: "01",
      title: "Submit Supplier Application",
      desc: "Apply online as an Importer, national Distributor, or specialized Institutional Retailer with corporate business registration details.",
      icon: Building2,
    },
    {
      step: "02",
      title: "Submit Compliance Documents",
      desc: "Provide Pharmacists Council of Nigeria (PCN) operating license, NAFDAC wholesale permits, and proof of GDP warehouse standards.",
      icon: ShieldCheck,
    },
    {
      step: "03",
      title: "Physical Audit & Approval",
      desc: "MedSupply compliance officers verify warehouse storage specifications, temperature monitoring systems, and anti-counterfeit protocols.",
      icon: BadgeCheck,
    },
    {
      step: "04",
      title: "Upload Product Inventory",
      desc: "Map your inventory to the standardized master catalogue, defining batch numbers, expiry dates, tiered wholesale pricing, and MOQs.",
      icon: Package,
    },
    {
      step: "05",
      title: "Receive Structured RFQs & POs",
      desc: "Receive direct, pre-approved institutional purchase orders from hospitals and verified clinics without broker middlemen.",
      icon: ClipboardList,
    },
    {
      step: "06",
      title: "Fulfill & Receive Guaranteed Payment",
      desc: "Package goods with tamper-evident seals and digital CoAs. Dispatch via certified logistics and receive automated escrow settlement.",
      icon: CheckCircle2,
    },
  ]

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-white py-16 sm:py-24">
        <div className="pointer-events-none absolute top-0 right-1/3 h-96 w-96 rounded-full bg-blue-500/5 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-emerald-500/5 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-semibold tracking-wider text-blue-800 uppercase">
            <Sparkles size={14} className="text-blue-600" />
            End-to-End Operational Process
          </div>
          <h1 className="mx-auto max-w-3xl text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            How MedSupply Modernizes Pharmaceutical Procurement
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            A transparent, audit-ready workflow built for healthcare
            institutions sourcing from licensed pharmaceutical suppliers.
          </p>
        </div>
      </section>

      {/* Main Lifecycle Interactive Workflow */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Full Lifecycle"
            title="The Procurement Journey at a Glance"
            subtitle="Explore each stage of the transaction, from formulary discovery to final pharmacy receiving dock sign-off."
          />

          <ProcurementWorkflow />
        </div>
      </section>

      {/* Dedicated Dual Role Flows: For Buyers vs For Suppliers */}
      <section className="border-t border-slate-200/80 bg-slate-50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Role-Specific Pathways"
            title="Tailored Journeys for Buyers and Suppliers"
            subtitle="Select your organizational role to review the step-by-step onboarding and day-to-day procurement experience."
          />

          {/* Toggle Switch */}
          <div className="mb-12 flex justify-center">
            <div className="flex items-center gap-1 rounded-2xl bg-slate-200/80 p-1.5">
              <button
                onClick={() => setSelectedRoleFlow("buyer")}
                className={`cursor-pointer rounded-xl px-6 py-2.5 text-xs font-bold transition-all ${
                  selectedRoleFlow === "buyer"
                    ? "bg-linear-to-r from-[#1e40af] to-[#00b87c] text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                For Healthcare Buyers (Hospitals &amp; Clinics)
              </button>
              <button
                onClick={() => setSelectedRoleFlow("supplier")}
                className={`cursor-pointer rounded-xl px-6 py-2.5 text-xs font-bold transition-all ${
                  selectedRoleFlow === "supplier"
                    ? "bg-linear-to-r from-[#1e40af] to-[#00b87c] text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                For Verified Suppliers (Importers &amp; Distributors)
              </button>
            </div>
          </div>

          {selectedRoleFlow === "buyer" ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-5">
              {buyerSteps.map((s, idx) => {
                const Icon = s.icon
                return (
                  <div
                    key={idx}
                    className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs transition-all hover:shadow-md"
                  >
                    <div>
                      <div className="mb-4 flex items-center justify-between">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-blue-200/60 bg-blue-50 font-mono text-xs font-bold text-blue-800">
                          {s.step}
                        </span>
                        <Icon size={18} className="text-slate-400" />
                      </div>
                      <h4 className="text-base font-bold text-slate-900">
                        {s.title}
                      </h4>
                      <p className="mt-2 text-xs leading-relaxed text-slate-600">
                        {s.desc}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {supplierSteps.map((s, idx) => {
                const Icon = s.icon
                return (
                  <div
                    key={idx}
                    className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs transition-all hover:shadow-md"
                  >
                    <div>
                      <div className="mb-4 flex items-center justify-between">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-r from-[#1e40af] to-[#00b87c] font-mono text-xs font-bold text-white">
                          {s.step}
                        </span>
                        <Icon size={18} className="text-blue-700" />
                      </div>
                      <h4 className="text-base font-bold text-slate-900">
                        {s.title}
                      </h4>
                      <p className="mt-2 text-xs leading-relaxed text-slate-600">
                        {s.desc}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          <div className="mt-12 text-center">
            {selectedRoleFlow === "buyer" ? (
              <button
                onClick={() => {}}
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-linear-to-r from-[#1e40af] via-[#0284c7] to-[#00b87c] px-8 py-3.5 text-xs font-bold text-white shadow-md shadow-blue-700/20 transition-all hover:from-[#1d4ed8] hover:to-[#059669]"
              >
                <span>Start Procuring as a Buyer</span>
                <ArrowRight size={14} />
              </button>
            ) : (
              <button
                onClick={() => router.push("/become-supplier")}
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-linear-to-r from-[#1e40af] via-[#0284c7] to-[#00b87c] px-8 py-3.5 text-xs font-bold text-white shadow-md shadow-blue-700/20 transition-all hover:from-[#1d4ed8] hover:to-[#059669]"
              >
                <span>Apply as a Pharmaceutical Supplier</span>
                <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection />
    </div>
  )
}
