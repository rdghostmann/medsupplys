"use client"
import React, { useState } from "react"
import { SectionHeader } from "@/components/ui/SectionHeader"

import { FAQAccordion } from "@/components/ui/FAQAccordion"

import { CTASection } from "@/components/ui/CTASection"
import {
  Building2,
  ShieldCheck,
  TrendingUp,
  Users,
  FileText,
  BadgeCheck,
  Clock,
  CheckCircle2,
  ArrowRight,
  UploadCloud,
  FileCheck2,
  Sparkles,
} from "lucide-react"
import Image from "next/image"

const BecomeSupplierPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    companyName: "",
    businessType: "Distributor",
    contactName: "",
    email: "",
    phone: "",
    address: "",
    operatingRegions: "Lagos & South-West",
    nafdacNumber: "",
    pcnNumber: "",
    hasColdChain: true,
    hasAmbient: true,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const supplierBenefits = [
    {
      title: "Direct Access to 1,000+ Healthcare Buyers",
      desc: "Connect with teaching hospitals, state healthcare boards, private surgical clinics, and dispensary chains without expensive field rep teams.",
      icon: Users,
    },
    {
      title: "Guaranteed Institutional POs & Payment Escrow",
      desc: "Eliminate bad debt. Receive legally verified institutional purchase orders with platform payment escrow protection.",
      icon: TrendingUp,
    },
    {
      title: "Automated Multi-Line Quotation Responses",
      desc: "Easily submit competitive volume discount bids on hospital tenders and ongoing routine formulary restocking RFQs.",
      icon: FileText,
    },
    {
      title: "Centralized Digital Order Management",
      desc: "Track pick, pack, batch release, and carrier dispatch with digital Certificates of Analysis (CoA) attached automatically.",
      icon: Building2,
    },
    {
      title: "Faster Sales Cycles & Lower CAC",
      desc: "Shorten institutional procurement turnaround from 45 days of bureaucracy to 48-hour digital approval and release.",
      icon: Clock,
    },
    {
      title: "Verified GDP Distinction & Credibility",
      desc: "Showcase your Good Distribution Practices (GDP) compliance badges to build trust with university medical centers.",
      icon: BadgeCheck,
    },
  ]

  const verificationStages = [
    {
      step: "01",
      title: "Application Submission",
      desc: "Submit corporate CAC registration details, operational headquarters, and authorized superintendent pharmacist information.",
    },
    {
      step: "02",
      title: "Regulatory License Check",
      desc: "Validation of your Pharmacists Council of Nigeria (PCN) operating permit and NAFDAC wholesale pharmaceutical licensure.",
    },
    {
      step: "03",
      title: "Premises & GDP Inspection",
      desc: "Verification of your warehouse storage temperature controls, backup power systems, and anti-counterfeiting tracking protocols.",
    },
    {
      step: "04",
      title: "Marketplace Onboarding",
      desc: "Product formulary mapping, batch pricing schedule setup, inventory API sync, and live listing on the MedSupply procurement portal.",
    },
  ]

  return (
    <div className="bg-white">
      {/* Hero Section - Clean White Theme */}
      <section className="relative overflow-hidden border-b border-slate-200/80 bg-linear-to-b from-blue-50/40 via-white to-white py-16 sm:py-24">
        <div className="pointer-events-none absolute top-0 right-1/4 h-96 w-96 rounded-full bg-blue-500/5 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-semibold tracking-wider text-blue-900 uppercase">
            <Building2 size={14} className="text-emerald-600" />
            Supplier Enrollment Portal
          </div>
          <h1 className="mx-auto max-w-3xl text-3xl leading-tight font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Expand Your Pharmaceutical Reach. Partner with Hospitals Across the
            Country.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            Join 250+ licensed pharmaceutical importers and distributors
            supplying genuine therapeutics directly to accredited healthcare
            organizations on MedSupply.
          </p>
        </div>
      </section>

      {/* Supplier Benefits Grid */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Wholesale Advantages"
            title="Why Leading Suppliers Partner with MedSupply"
            subtitle="Transforming how pharmaceutical wholesalers and importers distribute genuine medications to institutional buyers."
          />

          <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
            {supplierBenefits.map((b, idx) => {
              const Icon = b.icon
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200/90 bg-white p-7 shadow-2xs transition-all hover:border-blue-300 hover:shadow-md"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-700">
                    <Icon size={22} />
                  </div>
                  <h4 className="text-base font-bold text-slate-900">
                    {b.title}
                  </h4>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
                    {b.desc}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Verification Process */}
      <section className="border-t border-slate-200/80 bg-slate-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Compliance Standard"
            title="Our 4-Step Supplier Verification Process"
            subtitle="To safeguard patient outcomes, every supplier undergoes rigorous regulatory checks prior to listing inventory."
          />

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {verificationStages.map((stage, idx) => (
              <div
                key={idx}
                className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs transition-all hover:border-blue-300"
              >
                <div>
                  <span className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-r from-[#1e40af] to-[#00b87c] font-mono text-xs font-bold text-white shadow-2xs">
                    {stage.step}
                  </span>
                  <h4 className="text-base font-bold text-slate-900">
                    {stage.title}
                  </h4>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">
                    {stage.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Supplier Application Form */}
      <section
        id="application-form"
        className="border-t border-slate-200/80 bg-white py-16 sm:py-24"
      >
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold tracking-wider text-blue-800 uppercase">
              Direct Application
            </span>
            <h2 className="mt-2 text-2xl font-extrabold text-slate-900 sm:text-3xl">
              Apply to Become a Verified Supplier
            </h2>
            <p className="mt-2 text-xs text-slate-600 sm:text-sm">
              Complete the preliminary compliance form below. Our institutional
              onboarding team will review your credentials within 24 business
              hours.
            </p>
          </div>

          {submitted ? (
            <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-8 text-center sm:p-12">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-600 text-white shadow-md">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">
                Application Received Successfully!
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-600">
                Thank you for applying,{" "}
                <strong className="text-slate-900">
                  {formData.companyName}
                </strong>
                . Your provisional docket number is{" "}
                <span className="font-mono font-bold text-blue-800">
                  SUP-APP-2026-918
                </span>
                . Our compliance auditor will contact your superintendent
                pharmacist.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-6 cursor-pointer rounded-xl bg-linear-to-r from-[#1e40af] to-[#00b87c] px-6 py-2.5 text-xs font-bold text-white"
              >
                Submit Another Application
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="space-y-6 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-md sm:p-10"
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-700 uppercase">
                    Registered Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apex Pharma Distributors Ltd"
                    value={formData.companyName}
                    onChange={(e) =>
                      setFormData({ ...formData, companyName: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-700 uppercase">
                    Business Entity Type *
                  </label>
                  <select
                    value={formData.businessType}
                    onChange={(e) =>
                      setFormData({ ...formData, businessType: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:outline-hidden"
                  >
                    <option value="Manufacturer">
                      Pharmaceutical Manufacturer
                    </option>
                    <option value="Importer">
                      Licensed Pharmaceutical Importer
                    </option>
                    <option value="Distributor">
                      National Wholesaler / Distributor
                    </option>
                    <option value="Specialist Retailer">
                      Specialist Institutional Retailer
                    </option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-700 uppercase">
                    Contact Person / Lead Pharmacist *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pharm. Chinedu Okafor"
                    value={formData.contactName}
                    onChange={(e) =>
                      setFormData({ ...formData, contactName: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-700 uppercase">
                    Corporate Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="procurement@apexpharma.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-700 uppercase">
                    Direct Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+234 803 000 0000"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-700 uppercase">
                    Coverage Region *
                  </label>
                  <select
                    value={formData.operatingRegions}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        operatingRegions: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:outline-hidden"
                  >
                    <option value="Nationwide">Nationwide Coverage</option>
                    <option value="Lagos & South-West">
                      Lagos &amp; South-West
                    </option>
                    <option value="Abuja & North-Central">
                      Abuja &amp; North-Central
                    </option>
                    <option value="Port Harcourt & South-South">
                      Port Harcourt &amp; South-South
                    </option>
                    <option value="Enugu & South-East">
                      Enugu &amp; South-East
                    </option>
                    <option value="Kano & North-West">
                      Kano &amp; North-West
                    </option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-700 uppercase">
                    NAFDAC Premises License Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. NAFDAC/WHL/2024/0981"
                    value={formData.nafdacNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, nafdacNumber: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 font-mono text-xs text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-700 uppercase">
                    PCN Annual Retention Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. PCN-RET-2026-4431"
                    value={formData.pcnNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, pcnNumber: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 font-mono text-xs text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold tracking-wider text-slate-700 uppercase">
                  Warehouse Storage Capabilities
                </label>
                <div className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-2">
                  <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 p-3 hover:bg-slate-50">
                    <input
                      type="checkbox"
                      checked={formData.hasColdChain}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hasColdChain: e.target.checked,
                        })
                      }
                      className="rounded text-blue-700 focus:ring-blue-500"
                    />
                    <span className="font-semibold text-slate-800">
                      Cold Chain Storage (2°C - 8°C with Backup Generator)
                    </span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 p-3 hover:bg-slate-50">
                    <input
                      type="checkbox"
                      checked={formData.hasAmbient}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hasAmbient: e.target.checked,
                        })
                      }
                      className="rounded text-blue-700 focus:ring-blue-500"
                    />
                    <span className="font-semibold text-slate-800">
                      Climate Controlled Ambient (15°C - 25°C)
                    </span>
                  </label>
                </div>
              </div>

              {/* Upload Document Box Placeholder */}
              <div>
                <label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-700 uppercase">
                  Upload PCN &amp; NAFDAC Licenses (PDF or Image)
                </label>
                <div className="cursor-pointer rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-6 text-center transition-colors hover:border-blue-500">
                  <UploadCloud
                    size={28}
                    className="mx-auto mb-2 text-slate-400"
                  />
                  <p className="text-xs font-semibold text-slate-700">
                    Click to attach operational permits or drag and drop
                  </p>
                  <p className="mt-1 text-[11px] text-slate-400">
                    PDF, PNG, JPG up to 15MB
                  </p>
                </div>
              </div>

              <button
                type="submit"
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#1e40af] via-[#0284c7] to-[#00b87c] py-3.5 text-xs font-bold tracking-wide text-white shadow-md shadow-blue-700/20 transition-all hover:from-[#1d4ed8] hover:to-[#059669]"
              >
                <ShieldCheck size={16} />
                <span>Submit Verified Supplier Application</span>
              </button>
            </form>
          )}
        </div>
      </section>

      {/* ELIGIBILITY CHECKLIST & MANUFACTURING ASSET */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-slate-100/80 p-8 sm:p-12">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
            <div className="space-y-5 lg:col-span-7">
              <span className="text-xs font-bold tracking-wider text-blue-600 uppercase">
                Mandatory Documentation
              </span>
              <h2 className="font-display text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                Accreditation Prerequisites
              </h2>
              <p className="text-xs leading-relaxed text-slate-600 sm:text-sm">
                MediSupply upholds zero tolerance for unregulated
                pharmaceuticals. All prospective suppliers must provide
                certified true copies of the following statutory documents:
              </p>

              <div className="space-y-3 pt-2">
                {[
                  "Pharmacists Council of Nigeria (PCN) Superintendent Pharmacist Annual Retention Certificate",
                  "Registered & Validated Pharmaceutical Premise Inspection Certificate",
                  "NAFDAC Product Registration Certificates for all submitted SKUs",
                  "Good Distribution Practice (GDP) / Good Manufacturing Practice (GMP) Certification",
                  "Corporate Affairs Commission (CAC) Certificate of Incorporation & Form CAC 1.1",
                  "Calibrated Cold-Chain validation logs (if offering temperature-sensitive products)",
                ].map((req, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 text-xs text-slate-700"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    <span>{req}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-300 shadow-lg lg:col-span-5">
              <Image
                src="/pharma_manufacturing_plant_1788851214483.jpg"
                alt="Pharmaceutical Manufacturer Facility"
                referrerPolicy="no-referrer"
                width={1200}
                height={896}
                className="h-80 w-full object-cover object-center"
              />
              <div className="border-t border-slate-200 bg-white p-4 text-xs">
                <p className="font-bold text-slate-900">
                  Tier-1 Manufacturer Portal
                </p>
                <p className="mt-0.5 text-[11px] text-slate-500">
                  Direct API inventory sync & bulk order processing for
                  certified factories.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Supplier FAQs */}
      <section className="border-t border-slate-200/80 bg-slate-50 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Frequently Answered"
            title="Supplier Onboarding Inquiries"
            subtitle="Clear policies regarding listing fees, transaction escrow, fulfillment SLAs, and regulatory audits."
          />

          <FAQAccordion />
        </div>
      </section>

      {/* CTA Section */}
      <CTASection />
    </div>
  )
}

export default BecomeSupplierPage
