"use client"
import React, { useState } from 'react';
import { SectionHeader } from '@/components/ui/SectionHeader';

import { FAQAccordion } from '@/components/ui/FAQAccordion';

import { CTASection } from '@/components/ui/CTASection';
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
  Sparkles
} from 'lucide-react';
import Image from 'next/image';

const BecomeSupplierPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    businessType: 'Distributor',
    contactName: '',
    email: '',
    phone: '',
    address: '',
    operatingRegions: 'Lagos & South-West',
    nafdacNumber: '',
    pcnNumber: '',
    hasColdChain: true,
    hasAmbient: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const supplierBenefits = [
    {
      title: 'Direct Access to 1,000+ Healthcare Buyers',
      desc: 'Connect with teaching hospitals, state healthcare boards, private surgical clinics, and dispensary chains without expensive field rep teams.',
      icon: Users
    },
    {
      title: 'Guaranteed Institutional POs & Payment Escrow',
      desc: 'Eliminate bad debt. Receive legally verified institutional purchase orders with platform payment escrow protection.',
      icon: TrendingUp
    },
    {
      title: 'Automated Multi-Line Quotation Responses',
      desc: 'Easily submit competitive volume discount bids on hospital tenders and ongoing routine formulary restocking RFQs.',
      icon: FileText
    },
    {
      title: 'Centralized Digital Order Management',
      desc: 'Track pick, pack, batch release, and carrier dispatch with digital Certificates of Analysis (CoA) attached automatically.',
      icon: Building2
    },
    {
      title: 'Faster Sales Cycles & Lower CAC',
      desc: 'Shorten institutional procurement turnaround from 45 days of bureaucracy to 48-hour digital approval and release.',
      icon: Clock
    },
    {
      title: 'Verified GDP Distinction & Credibility',
      desc: 'Showcase your Good Distribution Practices (GDP) compliance badges to build trust with university medical centers.',
      icon: BadgeCheck
    }
  ];

  const verificationStages = [
    {
      step: '01',
      title: 'Application Submission',
      desc: 'Submit corporate CAC registration details, operational headquarters, and authorized superintendent pharmacist information.'
    },
    {
      step: '02',
      title: 'Regulatory License Check',
      desc: 'Validation of your Pharmacists Council of Nigeria (PCN) operating permit and NAFDAC wholesale pharmaceutical licensure.'
    },
    {
      step: '03',
      title: 'Premises & GDP Inspection',
      desc: 'Verification of your warehouse storage temperature controls, backup power systems, and anti-counterfeiting tracking protocols.'
    },
    {
      step: '04',
      title: 'Marketplace Onboarding',
      desc: 'Product formulary mapping, batch pricing schedule setup, inventory API sync, and live listing on the MedSupply procurement portal.'
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section - Clean White Theme */}
      <section className="bg-linear-to-b from-blue-50/40 via-white to-white py-16 sm:py-24 relative overflow-hidden border-b border-slate-200/80">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-xs font-semibold uppercase tracking-wider mb-6">
            <Building2 size={14} className="text-emerald-600" />
            Supplier Enrollment Portal
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 max-w-3xl mx-auto leading-tight">
            Expand Your Pharmaceutical Reach. Partner with Hospitals Across the Country.
          </h1>
          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Join 250+ licensed pharmaceutical importers and distributors supplying genuine therapeutics directly to accredited healthcare organizations on MedSupply.
          </p>
        </div>
      </section>

      {/* Supplier Benefits Grid */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Wholesale Advantages"
            title="Why Leading Suppliers Partner with MedSupply"
            subtitle="Transforming how pharmaceutical wholesalers and importers distribute genuine medications to institutional buyers."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {supplierBenefits.map((b, idx) => {
              const Icon = b.icon;
              return (
                <div key={idx} className="bg-white p-7 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-blue-300 hover:shadow-md transition-all">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 mb-4">
                    <Icon size={22} />
                  </div>
                  <h4 className="text-base font-bold text-slate-900">
                    {b.title}
                  </h4>
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {b.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Verification Process */}
      <section className="py-16 sm:py-20 bg-slate-50 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Compliance Standard"
            title="Our 4-Step Supplier Verification Process"
            subtitle="To safeguard patient outcomes, every supplier undergoes rigorous regulatory checks prior to listing inventory."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {verificationStages.map((stage, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col justify-between hover:border-blue-300 transition-all">
                <div>
                  <span className="w-9 h-9 rounded-xl bg-linear-to-r from-[#1e40af] to-[#00b87c] text-white font-mono font-bold text-xs flex items-center justify-center mb-4 shadow-2xs">
                    {stage.step}
                  </span>
                  <h4 className="text-base font-bold text-slate-900">
                    {stage.title}
                  </h4>
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                    {stage.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Supplier Application Form */}
      <section id="application-form" className="py-16 sm:py-24 bg-white border-t border-slate-200/80">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-800 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Direct Application
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              Apply to Become a Verified Supplier
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              Complete the preliminary compliance form below. Our institutional onboarding team will review your credentials within 24 business hours.
            </p>
          </div>

          {submitted ? (
            <div className="p-8 sm:p-12 rounded-2xl bg-blue-50/60 border border-blue-200 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto mb-4 shadow-md">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">
                Application Received Successfully!
              </h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto mt-2 leading-relaxed">
                Thank you for applying, <strong className="text-slate-900">{formData.companyName}</strong>. Your provisional docket number is <span className="font-mono font-bold text-blue-800">SUP-APP-2026-918</span>. Our compliance auditor will contact your superintendent pharmacist.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-6 px-6 py-2.5 rounded-xl bg-linear-to-r from-[#1e40af] to-[#00b87c] text-white font-bold text-xs cursor-pointer"
              >
                Submit Another Application
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-10 rounded-2xl border border-slate-200/90 shadow-md space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Registered Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apex Pharma Distributors Ltd"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Business Entity Type *
                  </label>
                  <select
                    value={formData.businessType}
                    onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  >
                    <option value="Manufacturer">Pharmaceutical Manufacturer</option>
                    <option value="Importer">Licensed Pharmaceutical Importer</option>
                    <option value="Distributor">National Wholesaler / Distributor</option>
                    <option value="Specialist Retailer">Specialist Institutional Retailer</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Contact Person / Lead Pharmacist *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pharm. Chinedu Okafor"
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Corporate Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="procurement@apexpharma.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Direct Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+234 803 000 0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Coverage Region *
                  </label>
                  <select
                    value={formData.operatingRegions}
                    onChange={(e) => setFormData({ ...formData, operatingRegions: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  >
                    <option value="Nationwide">Nationwide Coverage</option>
                    <option value="Lagos & South-West">Lagos &amp; South-West</option>
                    <option value="Abuja & North-Central">Abuja &amp; North-Central</option>
                    <option value="Port Harcourt & South-South">Port Harcourt &amp; South-South</option>
                    <option value="Enugu & South-East">Enugu &amp; South-East</option>
                    <option value="Kano & North-West">Kano &amp; North-West</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    NAFDAC Premises License Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. NAFDAC/WHL/2024/0981"
                    value={formData.nafdacNumber}
                    onChange={(e) => setFormData({ ...formData, nafdacNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 font-mono focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    PCN Annual Retention Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. PCN-RET-2026-4431"
                    value={formData.pcnNumber}
                    onChange={(e) => setFormData({ ...formData, pcnNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 font-mono focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Warehouse Storage Capabilities
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
                    <input
                      type="checkbox"
                      checked={formData.hasColdChain}
                      onChange={(e) => setFormData({ ...formData, hasColdChain: e.target.checked })}
                      className="rounded text-blue-700 focus:ring-blue-500"
                    />
                    <span className="font-semibold text-slate-800">Cold Chain Storage (2°C - 8°C with Backup Generator)</span>
                  </label>
                  <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
                    <input
                      type="checkbox"
                      checked={formData.hasAmbient}
                      onChange={(e) => setFormData({ ...formData, hasAmbient: e.target.checked })}
                      className="rounded text-blue-700 focus:ring-blue-500"
                    />
                    <span className="font-semibold text-slate-800">Climate Controlled Ambient (15°C - 25°C)</span>
                  </label>
                </div>
              </div>

              {/* Upload Document Box Placeholder */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Upload PCN &amp; NAFDAC Licenses (PDF or Image)
                </label>
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-blue-500 transition-colors cursor-pointer bg-slate-50/50">
                  <UploadCloud size={28} className="mx-auto text-slate-400 mb-2" />
                  <p className="text-xs font-semibold text-slate-700">Click to attach operational permits or drag and drop</p>
                  <p className="text-[11px] text-slate-400 mt-1">PDF, PNG, JPG up to 15MB</p>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-linear-to-r from-[#1e40af] via-[#0284c7] to-[#00b87c] hover:from-[#1d4ed8] hover:to-[#059669] text-white font-bold text-xs tracking-wide shadow-md shadow-blue-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldCheck size={16} />
                <span>Submit Verified Supplier Application</span>
              </button>
            </form>
          )}
        </div>
      </section>

       {/* ELIGIBILITY CHECKLIST & MANUFACTURING ASSET */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-100/80 rounded-3xl p-8 sm:p-12 border border-slate-200">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-5">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                Mandatory Documentation
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Accreditation Prerequisites
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                MediSupply upholds zero tolerance for unregulated pharmaceuticals. All prospective suppliers must provide
                certified true copies of the following statutory documents:
              </p>

              <div className="space-y-3 pt-2">
                {[
                  'Pharmacists Council of Nigeria (PCN) Superintendent Pharmacist Annual Retention Certificate',
                  'Registered & Validated Pharmaceutical Premise Inspection Certificate',
                  'NAFDAC Product Registration Certificates for all submitted SKUs',
                  'Good Distribution Practice (GDP) / Good Manufacturing Practice (GMP) Certification',
                  'Corporate Affairs Commission (CAC) Certificate of Incorporation & Form CAC 1.1',
                  'Calibrated Cold-Chain validation logs (if offering temperature-sensitive products)',
                ].map((req, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 rounded-2xl overflow-hidden shadow-lg border border-slate-300">
              <Image
                src="/pharma_manufacturing_plant_1788851214483.jpg"
                alt="Pharmaceutical Manufacturer Facility"
                referrerPolicy="no-referrer"
                width={1200}
                height={896}
                className="w-full h-80 object-cover object-center"
              />
              <div className="p-4 bg-white text-xs border-t border-slate-200">
                <p className="font-bold text-slate-900">Tier-1 Manufacturer Portal</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Direct API inventory sync & bulk order processing for certified factories.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Supplier FAQs */}
      <section className="py-16 sm:py-20 bg-slate-50 border-t border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
  );
};


export default BecomeSupplierPage;