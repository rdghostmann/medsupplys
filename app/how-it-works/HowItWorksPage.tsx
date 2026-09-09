"use client"
import React, { useState } from 'react';

import { SectionHeader } from '@/components/ui/SectionHeader';

import { ProcurementWorkflow } from '@/components/ui/ProcurementWorkflow';
import { CTASection } from '@/components/ui/CTASection';
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
  Sparkles
} from 'lucide-react';
import {useRouter} from 'next/navigation';

export const HowItWorksPage: React.FC = () => {

  const [selectedRoleFlow, setSelectedRoleFlow] = useState<'buyer' | 'supplier'>('buyer');

  const router = useRouter();
  
  const buyerSteps = [
    {
      step: '01',
      title: 'Create Verified Account',
      desc: 'Register your healthcare institution (Teaching Hospital, Private Clinic, Pharmacy Chain, or Medical Board) and upload your premises operating license.',
      icon: UserCheck
    },
    {
      step: '02',
      title: 'Search Standard Formulary',
      desc: 'Search over 1,500+ pharmaceutical SKUs by generic API, brand name, dosage form, or official NAFDAC registration number.',
      icon: Search
    },
    {
      step: '03',
      title: 'Compare Competing Suppliers',
      desc: 'Evaluate side-by-side quotations for unit price, volume discounts, available warehouse batches, expiry dates, and delivery lead times.',
      icon: Layers
    },
    {
      step: '04',
      title: 'Issue Digital Purchase Order (PO)',
      desc: 'Route requisition through your internal institutional approval chain. Once authorized, generate and transmit a legally binding digital PO.',
      icon: FileCheck
    },
    {
      step: '05',
      title: 'Track With Cold-Chain Telemetry',
      desc: 'Monitor real-time dispatch, transit milestones, and IoT cold-chain temperature logs (2-8°C) until verified receipt at your pharmacy bay.',
      icon: Truck
    }
  ];

  const supplierSteps = [
    {
      step: '01',
      title: 'Submit Supplier Application',
      desc: 'Apply online as an Importer, national Distributor, or specialized Institutional Retailer with corporate business registration details.',
      icon: Building2
    },
    {
      step: '02',
      title: 'Submit Compliance Documents',
      desc: 'Provide Pharmacists Council of Nigeria (PCN) operating license, NAFDAC wholesale permits, and proof of GDP warehouse standards.',
      icon: ShieldCheck
    },
    {
      step: '03',
      title: 'Physical Audit & Approval',
      desc: 'MedSupply compliance officers verify warehouse storage specifications, temperature monitoring systems, and anti-counterfeit protocols.',
      icon: BadgeCheck
    },
    {
      step: '04',
      title: 'Upload Product Inventory',
      desc: 'Map your inventory to the standardized master catalogue, defining batch numbers, expiry dates, tiered wholesale pricing, and MOQs.',
      icon: Package
    },
    {
      step: '05',
      title: 'Receive Structured RFQs & POs',
      desc: 'Receive direct, pre-approved institutional purchase orders from hospitals and verified clinics without broker middlemen.',
      icon: ClipboardList
    },
    {
      step: '06',
      title: 'Fulfill & Receive Guaranteed Payment',
      desc: 'Package goods with tamper-evident seals and digital CoAs. Dispatch via certified logistics and receive automated escrow settlement.',
      icon: CheckCircle2
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-white border-b border-slate-200 py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute top-0 right-1/3 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold uppercase tracking-wider mb-6">
            <Sparkles size={14} className="text-blue-600" />
            End-to-End Operational Process
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 max-w-3xl mx-auto">
            How MedSupply Modernizes Pharmaceutical Procurement
          </h1>
          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            A transparent, audit-ready workflow built for healthcare institutions sourcing from licensed pharmaceutical suppliers.
          </p>
        </div>
      </section>

      {/* Main Lifecycle Interactive Workflow */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Full Lifecycle"
            title="The Procurement Journey at a Glance"
            subtitle="Explore each stage of the transaction, from formulary discovery to final pharmacy receiving dock sign-off."
          />

          <ProcurementWorkflow />
        </div>
      </section>

      {/* Dedicated Dual Role Flows: For Buyers vs For Suppliers */}
      <section className="py-16 sm:py-24 bg-slate-50 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Role-Specific Pathways"
            title="Tailored Journeys for Buyers and Suppliers"
            subtitle="Select your organizational role to review the step-by-step onboarding and day-to-day procurement experience."
          />

          {/* Toggle Switch */}
          <div className="flex justify-center mb-12">
            <div className="bg-slate-200/80 p-1.5 rounded-2xl flex items-center gap-1">
              <button
                onClick={() => setSelectedRoleFlow('buyer')}
                className={`px-6 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                  selectedRoleFlow === 'buyer'
                    ? 'bg-linear-to-r from-[#1e40af] to-[#00b87c] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                For Healthcare Buyers (Hospitals &amp; Clinics)
              </button>
              <button
                onClick={() => setSelectedRoleFlow('supplier')}
                className={`px-6 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                  selectedRoleFlow === 'supplier'
                    ? 'bg-linear-to-r from-[#1e40af] to-[#00b87c] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                For Verified Suppliers (Importers &amp; Distributors)
              </button>
            </div>
          </div>

          {selectedRoleFlow === 'buyer' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {buyerSteps.map((s, idx) => {
                const Icon = s.icon;
                return (
                  <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-800 font-mono font-bold text-xs flex items-center justify-center border border-blue-200/60">
                          {s.step}
                        </span>
                        <Icon size={18} className="text-slate-400" />
                      </div>
                      <h4 className="text-base font-bold text-slate-900">
                        {s.title}
                      </h4>
                      <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                        {s.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {supplierSteps.map((s, idx) => {
                const Icon = s.icon;
                return (
                  <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="w-8 h-8 rounded-lg bg-linear-to-r from-[#1e40af] to-[#00b87c] text-white font-mono font-bold text-xs flex items-center justify-center">
                          {s.step}
                        </span>
                        <Icon size={18} className="text-blue-700" />
                      </div>
                      <h4 className="text-base font-bold text-slate-900">
                        {s.title}
                      </h4>
                      <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                        {s.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-12 text-center">
            {selectedRoleFlow === 'buyer' ? (
              <button
                onClick={() => {}}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-linear-to-r from-[#1e40af] via-[#0284c7] to-[#00b87c] hover:from-[#1d4ed8] hover:to-[#059669] text-white font-bold text-xs shadow-md shadow-blue-700/20 transition-all cursor-pointer"
              >
                <span>Start Procuring as a Buyer</span>
                <ArrowRight size={14} />
              </button>
            ) : (
              <button
                onClick={() => router.push('/become-a-supplier')}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-linear-to-r from-[#1e40af] via-[#0284c7] to-[#00b87c] hover:from-[#1d4ed8] hover:to-[#059669] text-white font-bold text-xs shadow-md shadow-blue-700/20 transition-all cursor-pointer"
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
  );
};
