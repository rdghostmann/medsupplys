import React from "react"
import { SectionHeader } from "@/components/ui/SectionHeader"
import { CTASection } from "@/components/ui/CTASection"
import {
  ShieldCheck,
  Target,
  Eye,
  Lightbulb,
  HeartHandshake,
  Award,
  ArrowRight,
  CheckCircle2,
  Building2,
  Sparkles,
  Users,
} from "lucide-react"
import Image from "next/image"

const AboutPage: React.FC = () => {
  const values = [
    {
      title: "Trust",
      desc: "Uncompromising verification of every pharmaceutical lot, premises license, and commercial transaction across the platform.",
      icon: ShieldCheck,
    },
    {
      title: "Transparency",
      desc: "Democratizing pharmaceutical pricing with zero undisclosed markups, transparent volume discounts, and clear availability.",
      icon: Eye,
    },
    {
      title: "Innovation",
      desc: "Automating clunky paper-based hospital requisitions with enterprise cloud workflows, smart matching, and telemetry.",
      icon: Lightbulb,
    },
    {
      title: "Reliability",
      desc: "Maintaining 98.4%+ on-time delivery benchmarks and continuous cold-chain temperature telemetry for critical life-saving drugs.",
      icon: Award,
    },
    {
      title: "Regulatory Compliance",
      desc: "Strict alignment with NAFDAC guidelines, Pharmacists Council regulations, and international Good Distribution Practices (GDP).",
      icon: CheckCircle2,
    },
    {
      title: "Customer Success",
      desc: "Dedicated pharmacy support specialists partnering with hospital procurement teams to prevent deadly clinical drug stock-outs.",
      icon: HeartHandshake,
    },
  ]

  const timelineSteps = [
    {
      year: "2023",
      phase: "Idea & Architecture",
      title: "Conceiving the Digital Bridge",
      desc: "Founded by clinical pharmacists and health-tech supply chain architects to eliminate drug counterfeit risks and manual phone-based procurement across clinics.",
    },
    {
      year: "2024",
      phase: "Platform Development",
      title: "Building Enterprise Infrastructure",
      desc: "Engineered the standardized national pharmaceutical master formulary, multi-tier RBAC approval engine, and digital PO generation module.",
    },
    {
      year: "2024 - Q4",
      phase: "Supplier Network",
      title: "Onboarding Tier-1 Wholesalers",
      desc: "Vetted and onboarded the initial cohort of 100+ licensed pharmaceutical importers and GDP-certified national wholesale distributors.",
    },
    {
      year: "2025",
      phase: "Buyer Network",
      title: "Hospital Adoption Surge",
      desc: "Expanded across 500+ private clinics, regional health networks, and premier teaching hospitals, reducing average PO turnaround by 60%.",
    },
    {
      year: "2026",
      phase: "Intelligent Procurement",
      title: "Live Telemetry & Demand Forecasting",
      desc: "Deployed real-time IoT cold-chain sensor tracking, automated batch recall alerts, and multi-supplier price optimization algorithms.",
    },
    {
      year: "Future",
      phase: "Expansion",
      title: "Pan-African Health Supply Cloud",
      desc: "Expanding cross-border pharmaceutical procurement corridors and automated central medical store integrations across West Africa.",
    },
  ]

  const leadership = [
    {
      name: "Pharm. (Dr.) Ngozi Okonjo-Briggs, FPSN",
      role: "Chief Executive Officer & Founder",
      bio: "Former Director of Pharmaceutical Services with over 22 years of clinical governance experience across West Africa.",
    },
    {
      name: "Dr. Babatunde Sanusi, FWACP, MBBS",
      role: "Chief Medical & Compliance Officer",
      bio: "Fellow of the West African College of Physicians; leading clinical pharmacology advisory councils for tertiary hospitals.",
    },
    {
      name: "Engr. Chukwuma Eze, MSc",
      role: "VP of Supply Chain Engineering",
      bio: "Former regional operations director at global healthcare logistics networks; specialist in cold-chain IoT telemetry.",
    },
    {
      name: "Amina Bello, FCA",
      role: "Head of Healthcare Credit & Risk",
      bio: "Ex-commercial banking executive managing syndicated healthcare liquidity facilities and revolving hospital credit portfolios.",
    },
  ]

  return (
    <div className="bg-white">
      {/* Hero Section - Clean White Theme */}
      <section className="relative overflow-hidden border-b border-slate-200/80 bg-linear-to-b from-blue-50/40 via-white to-white py-16 sm:py-24">
        <div className="pointer-events-none absolute -top-10 -right-10 h-96 w-96 rounded-full bg-blue-500/5 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-semibold tracking-wider text-blue-900 uppercase">
            <Building2 size={14} className="text-emerald-600" />
            Our Mission &amp; Foundation
          </div>
          <h1 className="mx-auto max-w-3xl text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Building a More Connected Pharmaceutical Supply Chain
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            MedSupply is designed to make pharmaceutical procurement simpler,
            more transparent, and more efficient by connecting healthcare buyers
            with trusted pharmaceutical suppliers through a centralized digital
            platform.
          </p>
        </div>
      </section>

      {/* Mission & Vision Grid */}
      <section className="border-b border-slate-100 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-2">
            <div className="flex flex-col justify-between rounded-2xl border border-blue-200/80 bg-blue-50/50 p-8 sm:p-10">
              <div>
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-700 text-white shadow-xs">
                  <Target size={24} />
                </div>
                <span className="mb-2 block text-xs font-bold tracking-wider text-blue-800 uppercase">
                  Our Mission
                </span>
                <h3 className="text-2xl font-bold tracking-tight text-slate-900">
                  Democratizing verified drug availability for every clinical
                  facility.
                </h3>
                <p className="mt-3.5 text-sm leading-relaxed text-slate-600 sm:text-base">
                  We empower hospitals, health systems, and dispensaries to
                  eliminate drug stock-outs, mitigate counterfeit infiltration,
                  and slash administrative procurement delays through
                  transparent digital marketplace connections.
                </p>
              </div>
              <div className="mt-6 flex items-center gap-2 border-t border-blue-200/60 pt-6 text-xs font-bold text-blue-950">
                <CheckCircle2 size={15} className="text-emerald-600" />
                <span>
                  Committed to 100% Genuine, Regulated Pharmaceuticals
                </span>
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-2xl bg-linear-to-br from-[#1e40af] via-[#0284c7] to-[#00b87c] p-8 text-white shadow-lg shadow-blue-900/10 sm:p-10">
              <div>
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-white/30 bg-white/20 text-white shadow-xs">
                  <Eye size={24} />
                </div>
                <span className="mb-2 block text-xs font-bold tracking-wider text-blue-100 uppercase">
                  Our Vision
                </span>
                <h3 className="text-2xl font-bold tracking-tight text-white">
                  The trusted digital backbone of healthcare procurement.
                </h3>
                <p className="mt-3.5 text-sm leading-relaxed text-blue-50 sm:text-base">
                  To become the pan-African standard infrastructure for
                  healthcare procurement, where every hospital order is
                  verifiable, pricing is competitive, and life-saving
                  therapeutics arrive securely without friction.
                </p>
              </div>
              <div className="mt-6 flex items-center gap-2 border-t border-white/20 pt-6 text-xs font-bold text-white">
                <Sparkles size={15} />
                <span>Zero-Tolerance for Counterfeits or Excursions</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-slate-50/70 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Institutional Pillars"
            title="Our Core Values"
            subtitle="The operational philosophy guiding our team, engineering architecture, and regulatory standards every day."
          />

          <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
            {values.map((val, idx) => {
              const Icon = val.icon
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200/90 bg-white p-7 shadow-2xs transition-all hover:border-blue-300 hover:shadow-md"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-700">
                    <Icon size={22} />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900">
                    {val.title}
                  </h4>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
                    {val.desc}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* THE STORY OF MEDISUPPLY */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-slate-100/80 p-8 sm:p-12">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
            <div className="space-y-4 lg:col-span-7">
              <span className="text-xs font-bold tracking-wider text-blue-600 uppercase">
                Our Origin
              </span>
              <h2 className="font-display text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                Solving the Open-Market Dilemma
              </h2>
              <p className="text-xs leading-relaxed text-slate-600 sm:text-sm">
                In Nigeria, over 60% of pharmaceutical transactions historically
                passed through unregulated open markets such as Idumota in Lagos
                and Head Bridge in Onitsha. For hospitals, this created an
                impossible dilemma: risk substandard, expired, or counterfeit
                drugs, or face devastating stockouts when formal channels
                stalled.
              </p>
              <p className="text-xs leading-relaxed text-slate-600 sm:text-sm">
                MediSupply was founded by seasoned clinical pharmacists,
                healthcare financiers, and supply chain engineers to construct
                an impermeable closed-loop rail. By validating every supplier
                with PCN premises inspections and direct NAFDAC registration
                checks, we provide hospitals with factory-direct authenticity
                and guaranteed supply continuity.
              </p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-300 shadow-lg lg:col-span-5">
              <Image
                src="/medsupply_hero_pharmacy_1788851113035.jpg"
                alt="Pharmacist inspects verified inventory"
                width={1376}
                height={768}
                referrerPolicy="no-referrer"
                className="h-72 w-full object-cover object-center"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="border-t border-slate-200/80 bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Growth &amp; Milestones"
            title="The MedSupply Evolution"
            subtitle="From identifying broken medical supply chains to building the most robust pharmaceutical B2B marketplace."
          />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {timelineSteps.map((step, idx) => (
              <div
                key={idx}
                className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-6 transition-all hover:border-blue-400 hover:shadow-xs"
              >
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <span className="rounded border border-blue-200/60 bg-blue-50 px-2.5 py-1 font-mono text-xs font-bold text-blue-900">
                      {step.year}
                    </span>
                    <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                      {step.phase}
                    </span>
                  </div>
                  <h4 className="mt-2 text-base font-bold text-slate-900">
                    {step.title}
                  </h4>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LEADERSHIP & ADVISORY */}
      <section className="mx-auto mt-8 hidden max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl space-y-2 text-center">
          <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-bold tracking-widest text-blue-600 uppercase">
            Governance & Leadership
          </span>
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Led by Clinical & Financial Veterans
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {leadership.map((leader, idx) => (
            <div
              key={idx}
              className="space-y-3 rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-2xs transition hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-slate-600">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-display text-sm leading-snug font-bold text-slate-900">
                  {leader.name}
                </h3>
                <p className="mt-0.5 text-[11px] font-semibold text-blue-600">
                  {leader.role}
                </p>
              </div>
              <p className="border-t border-slate-100 pt-2 text-xs leading-relaxed text-slate-500">
                {leader.bio}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <CTASection />
    </div>
  )
}

export default AboutPage
