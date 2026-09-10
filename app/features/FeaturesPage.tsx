// FeaturesPage.tsx
"use client"
import React, { useState } from "react"

import { SectionHeader } from "@/components/ui/SectionHeader"

import {
  Boxes,
  Building2,
  Search,
  ClipboardList,
  BarChart3,
  BadgeCheck,
  Clock,
  ShieldCheck,
  FileCheck,
  CheckCircle2,
  Lock,
  Bell,
  Layers,
  Sparkles,
  SlidersHorizontal,
} from "lucide-react"
import { FeatureCard } from "@/components/ui/FeatureCard"
import { CTASection } from "@/components/ui/CTASection"
import { useRouter } from "next/navigation"

const FEATURES = [
  {
    id: "procurement-core",
    name: "Procurement & Sourcing",
    description:
      "Core tools designed specifically for hospital and clinic procurement teams",
    features: [
      {
        title: "Master Pharmaceutical Catalogue",
        description:
          "Standardized national drug formulary with unified generic names, strengths, packaging specs, and approved NAFDAC registrations.",
        icon: "Boxes",
      },
      {
        title: "Supplier Marketplace",
        description:
          "Direct access to vetted importers and distributors with transparent inventory levels and verifiable Good Distribution Practices.",
        icon: "Building2",
      },
      {
        title: "Intelligent Supplier Matching",
        description:
          "Algorithms that match your requisition with suppliers offering the optimal balance of price, stock availability, and delivery proximity.",
        icon: "Search",
        badge: "Smart Matching",
      },
      {
        title: "Digital Purchase Orders",
        description:
          "Generate standardized enterprise purchase orders automatically, complete with institutional terms, payment conditions, and tax details.",
        icon: "ClipboardList",
      },
    ],
  },
  {
    id: "pricing-inventory",
    name: "Pricing & Batch Transparency",
    description:
      "Complete clarity on costs, batch specifics, and clinical viability",
    features: [
      {
        title: "Real-Time Price Comparison",
        description:
          "Multi-supplier line item pricing comparison to ensure your organization always secures fair, competitive market rates.",
        icon: "BarChart3",
      },
      {
        title: "Batch & Lot Traceability",
        description:
          "Inspect exact batch and lot numbers prior to placing orders, verifying remaining shelf life and factory manufacture dates.",
        icon: "BadgeCheck",
      },
      {
        title: "Expiry Date Visibility",
        description:
          "Guaranteed minimum shelf-life disclosures on every lot to prevent receiving near-expiry inventory.",
        icon: "Clock",
      },
      {
        title: "Storage & Cold-Chain Specs",
        description:
          "Rigorous indicators for controlled room temperature, refrigerated (2-8°C), and light-sensitive compounds.",
        icon: "ShieldCheck",
      },
    ],
  },
  {
    id: "operations-security",
    name: "Security, Compliance & Governance",
    description:
      "Enterprise security standards built for healthcare institutions",
    features: [
      {
        title: "Role-Based Access Control",
        description:
          "Configurable permissions for Ward Pharmacists, Chief Pharmacists, Finance Officers, and Hospital Directors.",
        icon: "Lock",
      },
      {
        title: "Immutable Audit Logs",
        description:
          "Full chronological history of every requisition, quote request, PO approval, and goods delivery for compliance audits.",
        icon: "FileCheck",
      },
      {
        title: "Automated Status Notifications",
        description:
          "Instant multi-channel alerts via email, SMS, and portal notifications for order approvals, dispatches, and delivery arrival.",
        icon: "CheckCircle2",
      },
      {
        title: "Encrypted Health Data",
        description:
          "End-to-end 256-bit encryption for all commercial transactions, proprietary supplier pricing, and institutional records.",
        icon: "ShieldCheck",
      },
    ],
  },
]
export const FeaturesPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const allFeaturesList = [
    {
      category: "Procurement",
      title: "Master Pharmaceutical Catalogue",
      description:
        "Standardized national drug formulary with unified generic names, active ingredients, dosage forms, strengths, and pack configurations.",
      icon: "Boxes",
      badge: "National Formulary",
    },
    {
      category: "Supplier Management",
      title: "Supplier Marketplace",
      description:
        "Direct access to vetted importers, national distributors, and institutional wholesalers with verified stock availability.",
      icon: "Building2",
      badge: "250+ Vendors",
    },
    {
      category: "Procurement",
      title: "Intelligent Supplier Matching",
      description:
        "Algorithmic matching of hospital requisitions based on cost optimization, proximity, historical lead-time, and cold-chain capability.",
      icon: "Search",
      badge: "Smart Engine",
    },
    {
      category: "Pricing",
      title: "Price Comparison Matrix",
      description:
        "Side-by-side unit pricing and volume discount comparisons across multiple verified vendors to eliminate broker markups.",
      icon: "BarChart3",
      badge: "Transparent",
    },
    {
      category: "Product Catalogue",
      title: "Real-Time Product Availability",
      description:
        "Live visibility into warehouse and distributor stocks to prevent ordering out-of-stock emergency formulations.",
      icon: "Layers",
    },
    {
      category: "Procurement",
      title: "Procurement Requests (RFQ)",
      description:
        "Issue formal Requests for Quotations to targeted suppliers or broadcast requisitions to the entire verified network.",
      icon: "ClipboardList",
    },
    {
      category: "Orders",
      title: "Digital Purchase Orders (PO)",
      description:
        "Generate legally binding, PDF-exportable institutional Purchase Orders complete with budget codes, tax items, and terms.",
      icon: "FileCheck",
    },
    {
      category: "Orders",
      title: "Order Status Tracking",
      description:
        "Milestone tracking through Pending, Supplier Contacted, Verification, Processing, Dispatched, Delivered, and Completed.",
      icon: "CheckCircle2",
      badge: "Live Status",
    },
    {
      category: "Compliance",
      title: "Supplier Verification & GDP",
      description:
        "4-step compliance auditing including physical warehouse inspections, Pharmacists Council permits, and NAFDAC premises validation.",
      icon: "ShieldCheck",
      badge: "Zero Counterfeit",
    },
    {
      category: "Compliance",
      title: "NAFDAC Registration Validation",
      description:
        "Direct verification of NAFDAC registration numbers against official regulatory databases to guarantee drug authenticity.",
      icon: "BadgeCheck",
    },
    {
      category: "Compliance",
      title: "Batch / Lot Traceability",
      description:
        "Every procurement order logs exact batch numbers, manufacturing dates, and associated digital Certificates of Analysis (CoA).",
      icon: "Clock",
    },
    {
      category: "Compliance",
      title: "Expiry Date Disclosures",
      description:
        "Mandatory minimum shelf-life disclosures on every lot to protect healthcare facilities from short-dated deliveries.",
      icon: "Clock",
    },
    {
      category: "Product Catalogue",
      title: "Storage & Cold Chain Protocols",
      description:
        "Rigorous indicators and continuous sensor telemetry for Cold Chain (2-8°C), ambient (15-25°C), and light-sensitive products.",
      icon: "ShieldCheck",
      badge: "Cold Chain",
    },
    {
      category: "Analytics",
      title: "Procurement Spend Analytics",
      description:
        "Executive dashboards analyzing spend by therapeutic category, supplier performance scorecards, and seasonal drug demand.",
      icon: "BarChart3",
    },
    {
      category: "Compliance",
      title: "Tamper-Proof Audit Logs",
      description:
        "Complete chronological history of every requisition, quote request, PO approval, and goods delivery for clinical audits.",
      icon: "FileCheck",
    },
    {
      category: "Notifications",
      title: "Automated Multi-Channel Alerts",
      description:
        "Instant multi-channel alerts via email, SMS, and portal notifications for order approvals, dispatches, and delivery arrival.",
      icon: "Bell",
    },
    {
      category: "Security",
      title: "Role-Based Access Control (RBAC)",
      description:
        "Granular permissions for Ward Pharmacists, Procurement Officers, Chief Pharmacists, Finance Officers, and Hospital Directors.",
      icon: "Lock",
      badge: "Enterprise RBAC",
    },
    {
      category: "Security",
      title: "Secure Authentication & Encryption",
      description:
        "256-bit TLS encryption, session tokens, audit logging, and enterprise compliance ensuring complete healthcare data security.",
      icon: "Lock",
    },
  ]

  const categories = [
    "all",
    "Procurement",
    "Supplier Management",
    "Product Catalogue",
    "Pricing",
    "Orders",
    "Analytics",
    "Compliance",
    "Security",
  ]

  const filteredFeatures =
    selectedCategory === "all"
      ? allFeaturesList
      : allFeaturesList.filter((f) => f.category === selectedCategory)

  const router = useRouter()
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-white py-16 sm:py-24">
        <div className="pointer-events-none absolute top-0 right-1/4 h-96 w-96 rounded-full bg-blue-500/5 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/4 h-96 w-96 rounded-full bg-emerald-500/5 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-semibold tracking-wider text-blue-800 uppercase">
            <Sparkles size={14} className="text-blue-600" />
            Enterprise Feature Matrix
          </div>
          <h1 className="mx-auto max-w-3xl text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Comprehensive Capabilities for Healthcare Procurement
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            Built from the ground up for hospital pharmacy directorates,
            licensed wholesale distributors, and pharmaceutical supply officers.
          </p>

          <div className="mt-8 flex justify-center gap-3">
            <button
              onClick={() => router.push("/features/console")}
              className="cursor-pointer rounded-xl bg-linear-to-r from-[#1e40af] via-[#0284c7] to-[#00b87c] px-6 py-3 text-xs font-bold text-white shadow-md shadow-blue-700/20 transition-all hover:from-[#1d4ed8] hover:to-[#059669]"
            >
              Test Live Feature Console
            </button>
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="category-scrollbar mb-12 flex w-full items-center justify-start gap-2 overflow-x-auto pb-4 sm:justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`shrink-0 cursor-pointer rounded-full px-4 py-2 text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? "bg-linear-to-r from-[#1e40af] to-[#00b87c] text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200/80"
                }`}
              >
                {cat === "all" ? "All Features" : cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredFeatures.map((feat, idx) => (
              <FeatureCard
                key={idx}
                title={feat.title}
                description={feat.description}
                iconName={feat.icon}
                badge={feat.badge}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection />
    </div>
  )
}
