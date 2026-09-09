"use client"
import React from 'react';

import { SectionHeader } from '@/components/ui/SectionHeader';

import { CTASection } from '@/components/ui/CTASection';
import { 
  Check, 
  X, 
  ShieldCheck, 
  Clock, 
  BarChart3, 
  Layers, 
  Truck, 
  FileSpreadsheet, 
  TrendingDown, 
  Sparkles,
  ArrowRight,
  BadgeCheck
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const WhyMedSupplyPage: React.FC = () => {

  const router = useRouter();
  const comparisonData = [
    {
      feature: 'Supplier Sourcing & Discovery',
      traditional: 'Manual supplier search, calling multiple local reps, reliance on outdated paper directories',
      medsupply: 'Centralized verified marketplace of 250+ audited importers, distributors, and licensed wholesalers',
      benefit: '90% faster discovery'
    },
    {
      feature: 'Pricing & Quotations',
      traditional: 'Opaque pricing, arbitrary broker margins, slow phone/email RFQs taking 3 to 7 days',
      medsupply: 'Instant line-item digital price comparison with volume discounts and transparent reference rates',
      benefit: 'Up to 22% drug cost savings'
    },
    {
      feature: 'Supplier Compliance & Verification',
      traditional: 'High counterfeit risk, manual checking of physical paper licenses, no ongoing audit oversight',
      medsupply: 'Automated live validation of NAFDAC premises licenses, GDP cold-chain audits, and batch CoAs',
      benefit: 'Zero-tolerance counterfeit risk'
    },
    {
      feature: 'Purchase Requisitions & Approvals',
      traditional: 'Printed paper forms circulating between ward, chief pharmacist, and hospital finance directors',
      medsupply: 'Digital role-based approval workflows with institutional budget caps and automated PO generation',
      benefit: '4x faster institutional PO approval'
    },
    {
      feature: 'Order Tracking & Delivery Telemetry',
      traditional: 'Spreadsheets, manual driver calls, zero temperature visibility during transit of biologicals',
      medsupply: 'Real-time GPS delivery milestones and calibrated IoT 2-8°C cold-chain temperature sensor logs',
      benefit: 'Total visibility & audit logs'
    },
    {
      feature: 'Batch Recalls & Expiry Management',
      traditional: 'Delayed paper notifications, near-expiry drug dumpings on unsuspecting clinics',
      medsupply: 'Guaranteed minimum shelf-life disclosures, batch traceability, and automated instant recall alerts',
      benefit: 'Full clinical pharmacovigilance'
    }
  ];

  const institutionalBenefits = [
    {
      title: 'Verified Suppliers',
      desc: 'Every vendor is strictly screened for corporate registration, Pharmacists Council permits, and Good Distribution Practices.',
      icon: BadgeCheck
    },
    {
      title: 'Transparent Pricing',
      desc: 'Eliminate subjective pricing games. View transparent tiered quotes for any quantity, from 10 packs to 10,000 units.',
      icon: BarChart3
    },
    {
      title: 'Centralized Procurement',
      desc: 'Consolidate multiple supplier orders onto a single enterprise platform with unified billing and delivery coordination.',
      icon: Layers
    },
    {
      title: 'Faster Supplier Discovery',
      desc: 'Search our national master formulary by brand, API, or strength to find every stocking supplier in seconds.',
      icon: Clock
    },
    {
      title: 'Better Procurement Decisions',
      desc: 'Compare price versus delivery lead-time and historical fulfillment ratings to choose the best partner for every need.',
      icon: Sparkles
    },
    {
      title: 'Real-Time Order Visibility',
      desc: 'Know exactly when your emergency ICU and ward replenishment supplies will arrive at your receiving bay dock.',
      icon: Truck
    },
    {
      title: 'Reduced Administrative Work',
      desc: 'Cut hospital pharmacy paperwork by over 75% with automated PO creation, invoice matching, and digital receipting.',
      icon: FileSpreadsheet
    },
    {
      title: 'Scalable Procurement Infrastructure',
      desc: 'Whether operating a 20-bed private clinic or a 1,200-bed university teaching hospital network, MedSupply scales seamlessly.',
      icon: ShieldCheck
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-white border-b border-slate-200 py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold uppercase tracking-wider mb-6">
            <ShieldCheck size={14} className="text-blue-600" />
            Competitive Advantage &amp; Impact
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 max-w-3xl mx-auto">
            Why Healthcare Organizations Choose MedSupply
          </h1>
          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Eliminating drug supply chain friction with enterprise digital architecture built specifically around the rigorous clinical and financial demands of healthcare institutions.
          </p>

          <div className="mt-8 flex justify-center gap-3">
            <button
              onClick={() => {}}
              className="px-6 py-3 rounded-xl bg-linear-to-r from-[#1e40af] via-[#0284c7] to-[#00b87c] hover:from-[#1d4ed8] hover:to-[#059669] text-white font-bold text-xs shadow-md shadow-blue-700/20 transition-all cursor-pointer"
            >
              Test Live Comparison Engine
            </button>
            <button
              onClick={() => router.push('/contact')}
              className="px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-bold text-xs transition-colors cursor-pointer shadow-2xs"
            >
              Schedule Hospital Demo
            </button>
          </div>
        </div>
      </section>

      {/* Comparison Matrix Table */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Head-to-Head Comparison"
            title="Traditional Procurement vs. MedSupply Enterprise"
            subtitle="See why forward-thinking procurement directors are replacing manual telephone calls and spreadsheets with MedSupply."
          />

          <div className="overflow-hidden rounded-2xl border border-slate-200/90 shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-100/90 text-slate-700 uppercase font-bold text-[11px] tracking-wider">
                    <th className="py-4 px-6 w-1/4">Procurement Workflow</th>
                    <th className="py-4 px-6 w-1/3 text-slate-500">Traditional Procurement</th>
                    <th className="py-4 px-6 w-1/3 bg-linear-to-r from-[#1e40af] to-[#00b87c] text-white">MedSupply Platform</th>
                    <th className="py-4 px-4 text-center">Institutional Gain</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {comparisonData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-6 font-bold text-slate-900">
                        {row.feature}
                      </td>
                      <td className="py-4 px-6 text-slate-600">
                        <div className="flex items-start gap-2">
                          <X size={16} className="text-red-500 shrink-0 mt-0.5" />
                          <span>{row.traditional}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 bg-blue-50/30 font-medium text-slate-900">
                        <div className="flex items-start gap-2">
                          <Check size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                          <span>{row.medsupply}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="inline-block px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold">
                          {row.benefit}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-16 sm:py-24 bg-slate-50/70 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Institutional ROI"
            title="Strategic Benefits for Healthcare Leaders"
            subtitle="Tailored to the priorities of Chief Pharmacists, Finance Controllers, and Hospital Managing Directors."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {institutionalBenefits.map((b, i) => {
              const Icon = b.icon;
              return (
                <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-sm transition-all">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-4 border border-blue-100">
                    <Icon size={20} />
                  </div>
                  <h4 className="text-base font-bold text-slate-900">
                    {b.title}
                  </h4>
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                    {b.desc}
                  </p>
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


export default WhyMedSupplyPage;