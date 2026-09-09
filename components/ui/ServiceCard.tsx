"use client";

import React from "react";
import * as LucideIcons from "lucide-react";
import { useRouter } from "next/navigation";
import type { LucideIcon } from "lucide-react";

interface Service {
  id: string;
  title: string;
  tagline: string;
  description: string;
  icon: keyof typeof LucideIcons;
  benefits: string[];
  keyMetrics: string;
  badge: string;
}

const services: Service[] = [
  {
    id: "sourcing",
    title: "Pharmaceutical Sourcing",
    tagline: "Source over 1,500+ verified pharmaceutical products directly",
    description:
      "Find prescription pharmaceuticals, OTC formulations, critical care injectables, and hospital consumables from verified manufacturers, authorized importers, and licensed wholesale distributors.",
    icon: "Search",
    benefits: [
      "Search by Brand, Active Pharmaceutical Ingredient (API), or NAFDAC Reg",
      "View real-time factory and warehouse batch availability",
      "Direct access to cold-chain biologics and controlled medicines",
      "Filter by dosage form, therapeutic category, and storage requirements",
    ],
    keyMetrics: "1,500+ Verified SKUs",
    badge: "Core Sourcing",
  },
  {
    id: "marketplace",
    title: "Supplier Marketplace",
    tagline: "Multi-tier qualified supplier network categorized by trade tier",
    description:
      "Discover qualified pharmaceutical suppliers segmented into licensed Importers, national Distributors, and verified Retailers with transparent minimum order quantities (MOQ).",
    icon: "Building2",
    benefits: [
      "Segmented supplier profiles with license numbers and warehouse locations",
      "Audited ratings, fulfillment rates, and historical lead-times",
      "Direct RFQ (Request for Quotation) transmission to multiple vendors",
      "Verified Good Distribution Practice (GDP) certification badges",
    ],
    keyMetrics: "250+ Verified Suppliers",
    badge: "Marketplace",
  },
  {
    id: "verification",
    title: "Supplier Verification & Compliance",
    tagline: "Multi-stage regulatory compliance and license verification",
    description:
      "Mitigate counterfeit risk and regulatory penalties. Every supplier on MedSupply undergoes stringent regulatory validation including NAFDAC licensing and physical warehouse auditing.",
    icon: "ShieldCheck",
    benefits: [
      "Live validation of Pharmacists Council and NAFDAC premises licenses",
      "Periodic physical cold-chain and storage inspection audits",
      "Automated expiration tracking for supplier accreditation documents",
      "Zero-tolerance anti-counterfeit traceability enforcement",
    ],
    keyMetrics: "100% Verified Vendors",
    badge: "Compliance First",
  },
  {
    id: "price-intelligence",
    title: "Price Intelligence & Comparison",
    tagline: "Compare supplier price points and terms transparently",
    description:
      "Eliminate arbitrary broker markups. Compare line-item pricing across competing suppliers side-by-side with volume-based tiered discounts clearly displayed.",
    icon: "BarChart3",
    benefits: [
      "Side-by-side unit pricing comparison across verified vendors",
      "Historical price trend indicators for therapeutic categories",
      "Volume tier discounting matrices for large institutional buyers",
      "Exportable price audit sheets for hospital finance review",
    ],
    keyMetrics: "Up to 22% Cost Savings",
    badge: "Transparent Pricing",
  },
  {
    id: "procurement-mgmt",
    title: "Procurement Management",
    tagline: "Centralize purchase requisitions, approvals, and PO generation",
    description:
      "Modernize hospital procurement with structured digital workflows. Route requisitions from ward pharmacists to finance controllers and automatically issue legal Purchase Orders.",
    icon: "ClipboardList",
    benefits: [
      "Multi-level institutional approval matrices with spending limits",
      "Automated digital Purchase Order (PO) creation with legal terms",
      "Consolidated multi-supplier billing and reconciliation statements",
      "ERP / Hospital Information System (HIS) export compatibility",
    ],
    keyMetrics: "4x Faster Approvals",
    badge: "Workflow Automation",
  },
  {
    id: "order-tracking",
    title: "Order Tracking & Delivery Logistics",
    tagline: "Live tracking from warehouse dispatch to pharmacy receiving dock",
    description:
      "Gain total visibility into your healthcare supply chain with GPS-enabled tracking, cold-chain temperature telemetry, and digital Proof-of-Delivery signing.",
    icon: "Truck",
    benefits: [
      "End-to-end timeline tracking with live status notifications",
      "Cold-chain temperature data logger verification upon delivery",
      "Digital receiving confirmation and batch discrepancy reporting",
      "Dedicated logistics escalation team for urgent critical care orders",
    ],
    keyMetrics: "98% On-Time Delivery",
    badge: "Full Visibility",
  },
  {
    id: "analytics",
    title: "Procurement Analytics",
    tagline: "Data-driven pharmaceutical spend optimization and forecasting",
    description:
      "Unlock enterprise business intelligence. Analyze category spend, supplier performance, stock run-out risks, and seasonal demand fluctuations across your facility.",
    icon: "TrendingUp",
    benefits: [
      "Executive dashboard tracking therapeutic category expenditure",
      "Supplier on-time fulfillment and quality dispute scorecards",
      "Lead-time forecasting to prevent critical drug stock-outs",
      "Downloadable audit-ready financial and regulatory compliance reports",
    ],
    keyMetrics: "360° Spend Analytics",
    badge: "Intelligence",
  },
  {
    id: "compliance-support",
    title: "Regulatory & Compliance Support",
    tagline: "Full audit trails, batch release records, and certificates",
    description:
      "Maintain compliance with health authorities. Every batch procured on MedSupply comes with digital Certificates of Analysis (CoA) and tamper-proof audit trails.",
    icon: "FileCheck",
    benefits: [
      "Instant access to digital Certificates of Analysis (CoA) for all batches",
      "Tamper-evident audit logging for all procurement actions and approvals",
      "Automated batch recall notification broadcasting system",
      "Support for national pharmacovigilance adverse event reporting",
    ],
    keyMetrics: "Audit-Proof System",
    badge: "Safe & Secure",
  },
];

interface ServiceCardProps {
  service: Service;
}

const ServiceCard = ({ service }: ServiceCardProps) => {
  const router = useRouter();

  const IconComponent =
    (LucideIcons[service.icon] as LucideIcon | undefined) ??
    LucideIcons.Activity;

  const handleRequestInfo = () => {
    if (
      service.id === "sourcing" ||
      service.id === "price-intelligence"
    ) {
      router.push("/contact");
      return;
    }

    router.push("/contact");
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-lg hover:border-blue-300 transition-all duration-200 p-6 sm:p-8 flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-5">
          <div className="w-13 h-13 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 shadow-2xs">
            <IconComponent size={24} strokeWidth={2} />
          </div>

          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200/80">
            {service.badge}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-slate-900 tracking-tight">
          {service.title}
        </h3>

        {/* Tagline */}
        <p className="mt-1 text-sm font-semibold text-blue-700">
          {service.tagline}
        </p>

        {/* Description */}
        <p className="mt-3.5 text-sm leading-relaxed text-slate-600">
          {service.description}
        </p>

        {/* Benefits */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            Core Enterprise Capabilities
          </p>

          <ul className="space-y-2.5">
            {service.benefits.map((benefit, index) => (
              <li
                key={`${service.id}-benefit-${index}`}
                className="flex items-start gap-2.5 text-xs text-slate-700 leading-normal"
              >
                <LucideIcons.CheckCircle2
                  size={15}
                  className="text-emerald-600 shrink-0 mt-0.5"
                />

                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-7 pt-4 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200/60">
          {service.keyMetrics}
        </span>

        <button
          type="button"
          onClick={handleRequestInfo}
          className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 hover:text-emerald-700 transition-colors py-1 px-2 rounded-md hover:bg-blue-50/60 cursor-pointer"
        >
          <span>Request Info</span>
          <LucideIcons.ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
};

export default function Services() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {services.map((service) => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </section>
  );
}

