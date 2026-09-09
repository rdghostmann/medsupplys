"use client"
import React from 'react';

import { SectionHeader } from '@/components/ui/SectionHeader';

import { CTASection } from '@/components/ui/CTASection';
import * as LucideIcons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

const MOCK_SERVICES = [
  {
    id: 'sourcing',
    title: 'Pharmaceutical Sourcing',
    tagline: 'Source over 1,500+ verified pharmaceutical products directly',
    description: 'Find prescription pharmaceuticals, OTC formulations, critical care injectables, and hospital consumables from verified manufacturers, authorized importers, and licensed wholesale distributors.',
    icon: 'Search',
    benefits: [
      'Search by Brand, Active Pharmaceutical Ingredient (API), or NAFDAC Reg',
      'View real-time factory and warehouse batch availability',
      'Direct access to cold-chain biologics and controlled medicines',
      'Filter by dosage form, therapeutic category, and storage requirements'
    ],
    keyMetrics: '1,500+ Verified SKUs',
    badge: 'Core Sourcing'
  },
  {
    id: 'marketplace',
    title: 'Supplier Marketplace',
    tagline: 'Multi-tier qualified supplier network categorized by trade tier',
    description: 'Discover qualified pharmaceutical suppliers segmented into licensed Importers, national Distributors, and verified Retailers with transparent minimum order quantities (MOQ).',
    icon: 'Building2',
    benefits: [
      'Segmented supplier profiles with license numbers and warehouse locations',
      'Audited ratings, fulfillment rates, and historical lead-times',
      'Direct RFQ (Request for Quotation) transmission to multiple vendors',
      'Verified Good Distribution Practice (GDP) certification badges'
    ],
    keyMetrics: '250+ Verified Suppliers',
    badge: 'Marketplace'
  },
  {
    id: 'verification',
    title: 'Supplier Verification & Compliance',
    tagline: 'Multi-stage regulatory compliance and license verification',
    description: 'Mitigate counterfeit risk and regulatory penalties. Every supplier on MedSupply undergoes stringent regulatory validation including NAFDAC licensing and physical warehouse auditing.',
    icon: 'ShieldCheck',
    benefits: [
      'Live validation of Pharmacists Council and NAFDAC premises licenses',
      'Periodic physical cold-chain and storage inspection audits',
      'Automated expiration tracking for supplier accreditation documents',
      'Zero-tolerance anti-counterfeit traceability enforcement'
    ],
    keyMetrics: '100% Verified Vendors',
    badge: 'Compliance First'
  },
  {
    id: 'price-intelligence',
    title: 'Price Intelligence & Comparison',
    tagline: 'Compare supplier price points and terms transparently',
    description: 'Eliminate arbitrary broker markups. Compare line-item pricing across competing suppliers side-by-side with volume-based tiered discounts clearly displayed.',
    icon: 'BarChart3',
    benefits: [
      'Side-by-side unit pricing comparison across verified vendors',
      'Historical price trend indicators for therapeutic categories',
      'Volume tier discounting matrices for large institutional buyers',
      'Exportable price audit sheets for hospital finance review'
    ],
    keyMetrics: 'Up to 22% Cost Savings',
    badge: 'Transparent Pricing'
  },
  {
    id: 'procurement-mgmt',
    title: 'Procurement Management',
    tagline: 'Centralize purchase requisitions, approvals, and PO generation',
    description: 'Modernize hospital procurement with structured digital workflows. Route requisitions from ward pharmacists to finance controllers and automatically issue legal Purchase Orders.',
    icon: 'ClipboardList',
    benefits: [
      'Multi-level institutional approval matrices with spending limits',
      'Automated digital Purchase Order (PO) creation with legal terms',
      'Consolidated multi-supplier billing and reconciliation statements',
      'ERP / Hospital Information System (HIS) export compatibility'
    ],
    keyMetrics: '4x Faster Approvals',
    badge: 'Workflow Automation'
  },
  {
    id: 'order-tracking',
    title: 'Order Tracking & Delivery Logistics',
    tagline: 'Live tracking from warehouse dispatch to pharmacy receiving dock',
    description: 'Gain total visibility into your healthcare supply chain with GPS-enabled tracking, cold-chain temperature telemetry, and digital Proof-of-Delivery signing.',
    icon: 'Truck',
    benefits: [
      'End-to-end timeline tracking with live status notifications',
      'Cold-chain temperature data logger verification upon delivery',
      'Digital receiving confirmation and batch discrepancy reporting',
      'Dedicated logistics escalation team for urgent critical care orders'
    ],
    keyMetrics: '98% On-Time Delivery',
    badge: 'Full Visibility'
  },
  {
    id: 'analytics',
    title: 'Procurement Analytics',
    tagline: 'Data-driven pharmaceutical spend optimization and forecasting',
    description: 'Unlock enterprise business intelligence. Analyze category spend, supplier performance, stock run-out risks, and seasonal demand fluctuations across your facility.',
    icon: 'TrendingUp',
    benefits: [
      'Executive dashboard tracking therapeutic category expenditure',
      'Supplier on-time fulfillment and quality dispute scorecards',
      'Lead-time forecasting to prevent critical drug stock-outs',
      'Downloadable audit-ready financial and regulatory compliance reports'
    ],
    keyMetrics: '360° Spend Analytics',
    badge: 'Intelligence'
  },
  {
    id: 'compliance-support',
    title: 'Regulatory & Compliance Support',
    tagline: 'Full audit trails, batch release records, and certificates',
    description: 'Maintain compliance with health authorities. Every batch procured on MedSupply comes with digital Certificates of Analysis (CoA) and tamper-proof audit trails.',
    icon: 'FileCheck',
    benefits: [
      'Instant access to digital Certificates of Analysis (CoA) for all batches',
      'Tamper-evident audit logging for all procurement actions and approvals',
      'Automated batch recall notification broadcasting system',
      'Support for national pharmacovigilance adverse event reporting'
    ],
    keyMetrics: 'Audit-Proof System',
    badge: 'Safe & Secure'
  },
  {
    id: 'institutional-revolving-credit',
    title: 'Institutional Revolving Credit (Net 30/45 Days)',
    tagline: 'Healthcare Working Capital Solutions',
    description: 'Flexible credit lines tailored to hospital payment collection cycles. Maintain vital clinical inventory while awaiting HMO reimbursements and patient account reconciliations.',
    icon: 'FileCheck',
    benefits: [
      'Pre-approved credit limits from ₦5,000,000 to ₦50,000,000',
      'Custom settlement tenors: Net-15, Net-30, or Net-45 days',
      'Automated headroom restoration upon invoice clearance',
      'Zero compound interest with predictable flat service structures'
    ],
    keyMetrics: 'Credit Lines up to ₦50M',
    badge: 'Up to ₦50M Facility'
  },
  {
    id: 'automated-sourcing-fallback-&-stockout-prevention',
    title: 'Automated Sourcing Fallback & Stockout Prevention',
    tagline: 'Resilient Supply Chain',
    description: 'Proprietary multi-tier routing engine that monitors real-time inventory across 9 verified manufacturers. If a primary supplier experiences stock constraints, orders immediately auto-cascade.',
    icon: 'FileCheck',
    benefits: [
      'Sub-second algorithmic fallback to pre-vetted secondary suppliers',
      'Preservation of pre-negotiated institutional pricing ceilings',
      'Zero manual intervention required during emergency shortages',
      'Detailed audit log explaining routing logic and supplier swaps'
    ],
    keyMetrics: '99.9% Stockout Prevention',
    badge: 'Up to ₦50M Facility'
  }
];

const ServicesPage: React.FC = () => {

  const router = useRouter();
  const additionalServices = [
    {
      id: 'supplier-mgmt',
      title: 'Supplier Relationship Management',
      tagline: 'Streamline contracts, credit terms, and supplier KPIs',
      description: 'Centralize your institutional vendor master file. Manage supplier credit agreements, performance scorecards, on-time delivery benchmarks, and direct dispute resolutions.',
      icon: 'Users',
      benefits: [
        'Automated vendor scorecard measuring lead time and fill rates',
        'Direct digital negotiation for institutional 30/60-day credit lines',
        'Consolidated contract repository with annual renewal tracking',
        'Structured supplier escalation and RMA (Return Merchandise) portal'
      ],
      keyMetrics: 'Single Vendor Portal',
      badge: 'Vendor Ops'
    },
    {
      id: 'delivery-logistics',
      title: 'Specialized Medical Logistics',
      tagline: 'Validated cold chain and secure pharma transport',
      description: 'Dedicated healthcare transport network operating certified refrigerated vans (2-8°C), ambient temperature-controlled trucks (15-25°C), and secure lockboxes for high-value injectables.',
      icon: 'Truck',
      benefits: [
        'Calibrated data loggers with digital temperature validation certificates',
        'Tamper-evident security sealing on all carton shipments',
        'Priority emergency route dispatch for critical care and ICU medicines',
        'Direct-to-ward delivery option for large hospital campuses'
      ],
      keyMetrics: '<0.01% Temp Excursion',
      badge: 'Cold Chain'
    }
  ];

  const allServices = [...MOCK_SERVICES, ...additionalServices];

  return (
    <div className="bg-white">
      {/* Services Hero - Clean White Theme with Brand Accents */}
      <section className="bg-linear-to-b from-blue-50/40 via-white to-white py-16 sm:py-24 relative overflow-hidden border-b border-slate-200/80">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-xs font-semibold uppercase tracking-wider mb-6">
            <LucideIcons.ShieldCheck size={14} className="text-emerald-600" />
            End-to-End Pharmaceutical Supply Chain
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 max-w-3xl mx-auto">
            Powerful Procurement Services for Modern Healthcare
          </h1>
          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            MedSupply provides an enterprise-grade ecosystem connecting healthcare buyers with verified suppliers to streamline drug discovery, quotation comparison, regulatory compliance, and temperature-controlled logistics.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => { }}
              className="px-6 py-3 rounded-xl bg-linear-to-r from-[#1e40af] via-[#0284c7] to-[#00b87c] hover:from-[#1d4ed8] hover:to-[#059669] text-white font-bold text-xs shadow-md shadow-blue-700/20 transition-all cursor-pointer"
            >
              Launch Sourcing Engine
            </button>
            <button
              onClick={() => router.push('/become-supplier')}
              className="px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-bold text-xs transition-colors cursor-pointer shadow-2xs"
            >
              Become a Verified Supplier
            </button>
          </div>
        </div>
      </section>

      {/* Detailed Services Sections */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <SectionHeader
            badge="Full Suite Capabilities"
            title="Engineered for Hospitals, Clinics &amp; Suppliers"
            subtitle="Explore our 10 core procurement pillars, each calibrated to eliminate supply bottlenecks, lower drug acquisition costs, and enforce strict NAFDAC standards."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {allServices.map((service, index) => {
              const IconComponent: LucideIcon = (LucideIcons as unknown as Record<string, LucideIcon>)[service.icon] || LucideIcons.Activity;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-blue-300 hover:shadow-md transition-all p-8 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-5">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 shadow-2xs">
                        <IconComponent size={24} />
                      </div>
                      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                        {service.badge}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                      {service.title}
                    </h3>
                    <p className="mt-1 text-sm font-semibold text-blue-700">
                      {service.tagline}
                    </p>
                    <p className="mt-3.5 text-sm leading-relaxed text-slate-600">
                      {service.description}
                    </p>

                    <div className="mt-6 pt-5 border-t border-slate-100">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                        Operational Advantages
                      </h4>
                      <ul className="space-y-2.5">
                        {service.benefits.map((b: string, i: number) => (<li key={i} className="flex items-start gap-2.5 text-xs text-slate-700 leading-normal">
                          <LucideIcons.CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-600 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200/60">
                      {service.keyMetrics}
                    </span>
                    <button
                      onClick={() => {
                        if (service.id === 'sourcing' || service.id === 'price-intelligence') {
                          router.push('/contact');
                        } else {
                          router.push('/contact');
                        }
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-emerald-700 py-1.5 px-3 rounded-lg hover:bg-blue-50/60 transition-colors cursor-pointer"
                    >
                      <span>Explore Service</span>
                      <LucideIcons.ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection />
    </div>
  );
};


export default ServicesPage;