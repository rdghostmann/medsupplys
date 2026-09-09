import React from 'react';

import { 
  MOCK_PRODUCTS, 
  MOCK_SERVICES, 
  MOCK_TESTIMONIALS,
} from '../data/mockData';
import { SectionHeader } from '../components/ui/SectionHeader';
import { StatCard } from '../components/ui/StatCard';
import { ServiceCard } from '../components/ui/ServiceCard';
import { ProductCard } from '../components/ui/ProductCard';
import { TestimonialCard } from '../components/ui/TestimonialCard';
import { LogoCloud } from '../components/ui/LogoCloud';
import { DashboardPreview } from '../components/ui/DashboardPreview';
import { ProcurementWorkflow } from '../components/ui/ProcurementWorkflow';
import { CTASection } from '../components/ui/CTASection';
import { MedSupplyLogo } from '../components/ui/MedSupplyLogo';
import { 
  ShieldCheck, 
  BadgeCheck, 
  Truck, 
  ArrowRight, 
  Package, 
  Building2, 
  Users, 
  CheckCircle2, 
  Clock, 
  Lock, 
  ChevronRight,
  Award
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { navigate, openQuoteModal } = useRouter();

  return (
    <div className="space-y-0 bg-white">
      {/* HERO SECTION - WHITE THEME WITH BRAND GRADIENTS */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-blue-50/25 to-emerald-50/20 text-slate-900 pt-10 pb-20 lg:pt-16 lg:pb-28 border-b border-slate-200/80">
        {/* Subtle Ambient Brand Gradient Background */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-blue-400/10 via-sky-400/10 to-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-0 w-[350px] h-[250px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            {/* Top Brand Pill with Logo */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-xs text-slate-800 text-xs font-semibold uppercase tracking-wider mb-6">
              <MedSupplyLogo variant="iconOnly" size="sm" />
              <span className="text-slate-900 font-bold">Enterprise Pharmaceutical Procurement Network</span>
              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold">VERIFIED</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-slate-900">
              Smarter Pharmaceutical Procurement{' '}
              <span className="bg-gradient-to-r from-[#1e40af] via-[#0284c7] to-[#00b87c] bg-clip-text text-transparent">
                Starts Here.
              </span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              MedSupply connects healthcare organizations with verified pharmaceutical suppliers, making sourcing, quotation comparison, procurement, and cold-chain delivery faster, safer, and completely transparent.
            </p>

            <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => openQuoteModal()}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#1e40af] via-[#0284c7] to-[#00b87c] hover:from-[#1d4ed8] hover:to-[#059669] text-white font-bold text-sm transition-all shadow-md shadow-blue-700/20 flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Start Procuring Now</span>
                <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() => navigate('/become-a-supplier')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-sm transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Building2 size={16} className="text-blue-700" />
                <span>Become a Verified Supplier</span>
              </button>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-600">
              <span className="flex items-center gap-1.5">
                <BadgeCheck size={14} className="text-emerald-600" />
                Verified NAFDAC &amp; PCN Licensure
              </span>
              <span className="flex items-center gap-1.5">
                <Truck size={14} className="text-blue-600" />
                Good Distribution Practices (GDP)
              </span>
              <span className="flex items-center gap-1.5">
                <Lock size={14} className="text-emerald-600" />
                Direct Manufacturer &amp; Wholesaler Pricing
              </span>
            </div>
          </div>

          {/* Hero Visual Dashboard Preview Container with Floating UI Badges */}
          <div className="mt-12 sm:mt-16 relative">
            
            {/* Floating UI Badge 1: Top Left */}
            <div className="hidden md:flex absolute -top-5 -left-3 z-20 items-center gap-2.5 bg-white/95 backdrop-blur-md text-slate-900 px-4 py-2.5 rounded-xl border border-slate-200/90 shadow-lg">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
                <BadgeCheck size={18} />
              </div>
              <div>
                <span className="text-xs font-bold block text-slate-900">Verified Supplier Tier 1</span>
                <span className="text-[10px] text-slate-500 font-mono">NAFDAC Reg: WDD-2021-04</span>
              </div>
            </div>

            {/* Floating UI Badge 2: Top Right */}
            <div className="hidden md:flex absolute -top-5 -right-3 z-20 items-center gap-2.5 bg-white/95 backdrop-blur-md text-slate-900 px-4 py-2.5 rounded-xl border border-slate-200/90 shadow-lg">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-200">
                <Package size={18} />
              </div>
              <div>
                <span className="text-xs font-bold block text-slate-900">1,500+ Essential Formularies</span>
                <span className="text-[10px] text-slate-500">National Master Drug Catalog</span>
              </div>
            </div>

            {/* Floating UI Badge 3: Bottom Left */}
            <div className="hidden lg:flex absolute -bottom-5 -left-4 z-20 items-center gap-2.5 bg-white/95 backdrop-blur-md text-slate-900 px-4 py-2.5 rounded-xl border border-slate-200/90 shadow-lg">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
                <CheckCircle2 size={18} />
              </div>
              <div>
                <span className="text-xs font-bold block text-slate-900">PO Confirmed &amp; Dispatched</span>
                <span className="text-[10px] text-slate-500 font-mono">PO-2026-8941 &bull; ₦4,472,000</span>
              </div>
            </div>

            {/* Floating UI Badge 4: Bottom Right */}
            <div className="hidden lg:flex absolute -bottom-5 -right-4 z-20 items-center gap-2.5 bg-white/95 backdrop-blur-md text-slate-900 px-4 py-2.5 rounded-xl border border-slate-200/90 shadow-lg">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-200">
                <Truck size={18} />
              </div>
              <div>
                <span className="text-xs font-bold block text-slate-900">Cold Chain Active (2–8°C)</span>
                <span className="text-[10px] text-emerald-600 font-mono font-bold">Live Sensor: 4.2°C Steady</span>
              </div>
            </div>

            {/* Main Interactive Live Dashboard Preview Component */}
            <DashboardPreview />
          </div>
        </div>
      </section>

      {/* TRUST STATEMENT & LOGO CLOUD */}
      <LogoCloud />

      {/* STATS SECTION */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Platform Metrics"
            title="Enterprise Healthcare Procurement Scale"
            subtitle="Powering verified drug supplies across tertiary teaching hospitals, private clinic groups, and state healthcare networks."
          />

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
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
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section className="py-16 sm:py-24 bg-slate-50/60 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Core Solutions"
            title="Everything You Need to Procure Smarter"
            subtitle="A comprehensive pharmaceutical supply chain infrastructure engineered for transparency, regulatory compliance, and cost containment."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {MOCK_SERVICES.slice(0, 6).map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => navigate('/services')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#1e40af] to-[#00b87c] hover:from-[#1d4ed8] hover:to-[#059669] text-white font-bold text-xs shadow-md shadow-blue-700/15 transition-all cursor-pointer"
            >
              <span>Explore All 10 Enterprise Procurement Services</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="py-16 sm:py-24 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Procurement Lifecycle"
            title="How Pharmaceutical Procurement Works"
            subtitle="From formulary drug search to multi-quote comparison, digital PO transmission, and verified cold-chain handover."
          />

          <ProcurementWorkflow />
        </div>
      </section>

      {/* WHY MEDSUPPLY SECTION - REFACTORED TO WHITE / LIGHT SOPHISTICATED THEME */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-white to-slate-50/80 border-t border-slate-200/80 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-xs font-semibold uppercase tracking-wider mb-5">
                <ShieldCheck size={14} className="text-emerald-600" />
                Institutional Superiority
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Built Around the Way Healthcare Procurement Actually Works
              </h2>

              <p className="mt-4 text-base text-slate-600 leading-relaxed">
                Traditional hospital drug procurement is crippled by opaque pricing, fragmented telephone quotes, unverified suppliers, and paper tracking. MedSupply eliminates these vulnerabilities with an automated, compliance-first B2B enterprise platform.
              </p>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { title: 'Verified Supplier Network', desc: '100% NAFDAC & PCN audited premises with certified GDP cold-chain controls.' },
                  { title: 'Transparent Line-Item Pricing', desc: 'Real-time multi-supplier quote comparison without broker markups or hidden fees.' },
                  { title: 'Faster Procurement Turnaround', desc: 'Cut requisition-to-delivery lead times from weeks to under 48 hours.' },
                  { title: 'Centralized Order Management', desc: 'Institutional purchase approvals, delivery tracking, and VAT invoices in one hub.' },
                  { title: 'Pharmaceutical Compliance', desc: 'Digital Certificates of Analysis (CoA) and batch traceability attached to every PO.' },
                  { title: 'Real-Time Telemetry Visibility', desc: 'GPS vehicle tracking and calibrated cold-chain temperature sensor oversight.' },
                ].map((item, i) => (
                  <div key={i} className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-blue-400 hover:shadow-md transition-all flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">{item.title}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex items-center gap-4">
                <button
                  onClick={() => navigate('/why-medsupply')}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#1e40af] to-[#00b87c] hover:from-[#1d4ed8] hover:to-[#059669] text-white font-bold text-xs shadow-md shadow-blue-700/15 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Read Full Comparison Analysis</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200/90 shadow-xl bg-white p-2">
                <img
                  src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1000&q=80"
                  alt="Professional healthcare procurement team reviewing pharmaceutical supplies"
                  className="w-full h-[460px] object-cover rounded-xl"
                />
                <div className="absolute inset-2 rounded-xl bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent pointer-events-none" />
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200 text-xs shadow-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <MedSupplyLogo variant="iconOnly" size="sm" />
                    <span className="font-bold text-slate-900 block">Hospital Procurement Committee Review</span>
                  </div>
                  <p className="text-slate-600 mt-1 text-[11px] leading-relaxed">
                    "MedSupply's multi-supplier price audit logs simplified our quarterly clinical board review by providing transparent, tamper-proof cost comparisons."
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* PRODUCT PROCUREMENT PREVIEW */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Live Formulary"
            title="High-Demand Essential Pharmaceutical SKUs"
            subtitle="Browse live catalog reference pricing, supplier counts, and storage specifications. Click to launch the interactive price comparison engine."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {MOCK_PRODUCTS.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-10 text-center">
            <button
              onClick={() => openQuoteModal()}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-[#1e40af] to-[#00b87c] hover:from-[#1d4ed8] hover:to-[#059669] text-white text-xs font-bold shadow-md shadow-blue-700/15 transition-all cursor-pointer"
            >
              <span>Launch Live Quote Matrix for All 1,500+ SKUs</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-16 sm:py-24 bg-slate-50/70 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Healthcare Trust"
            title="Trusted by Directors of Pharmacy &amp; Supply Officers"
            subtitle="Hear directly from procurement leaders managing hospital formularies, clinic networks, and wholesale distributions."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {MOCK_TESTIMONIALS.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <CTASection />
    </div>
  );
};
