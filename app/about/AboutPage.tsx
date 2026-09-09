import React from 'react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { CTASection } from '@/components/ui/CTASection';
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
  Users
} from 'lucide-react';

const AboutPage: React.FC = () => {


  const values = [
    {
      title: 'Trust',
      desc: 'Uncompromising verification of every pharmaceutical lot, premises license, and commercial transaction across the platform.',
      icon: ShieldCheck
    },
    {
      title: 'Transparency',
      desc: 'Democratizing pharmaceutical pricing with zero undisclosed markups, transparent volume discounts, and clear availability.',
      icon: Eye
    },
    {
      title: 'Innovation',
      desc: 'Automating clunky paper-based hospital requisitions with enterprise cloud workflows, smart matching, and telemetry.',
      icon: Lightbulb
    },
    {
      title: 'Reliability',
      desc: 'Maintaining 98.4%+ on-time delivery benchmarks and continuous cold-chain temperature telemetry for critical life-saving drugs.',
      icon: Award
    },
    {
      title: 'Regulatory Compliance',
      desc: 'Strict alignment with NAFDAC guidelines, Pharmacists Council regulations, and international Good Distribution Practices (GDP).',
      icon: CheckCircle2
    },
    {
      title: 'Customer Success',
      desc: 'Dedicated pharmacy support specialists partnering with hospital procurement teams to prevent deadly clinical drug stock-outs.',
      icon: HeartHandshake
    }
  ];

  const timelineSteps = [
    {
      year: '2023',
      phase: 'Idea & Architecture',
      title: 'Conceiving the Digital Bridge',
      desc: 'Founded by clinical pharmacists and health-tech supply chain architects to eliminate drug counterfeit risks and manual phone-based procurement across clinics.'
    },
    {
      year: '2024',
      phase: 'Platform Development',
      title: 'Building Enterprise Infrastructure',
      desc: 'Engineered the standardized national pharmaceutical master formulary, multi-tier RBAC approval engine, and digital PO generation module.'
    },
    {
      year: '2024 - Q4',
      phase: 'Supplier Network',
      title: 'Onboarding Tier-1 Wholesalers',
      desc: 'Vetted and onboarded the initial cohort of 100+ licensed pharmaceutical importers and GDP-certified national wholesale distributors.'
    },
    {
      year: '2025',
      phase: 'Buyer Network',
      title: 'Hospital Adoption Surge',
      desc: 'Expanded across 500+ private clinics, regional health networks, and premier teaching hospitals, reducing average PO turnaround by 60%.'
    },
    {
      year: '2026',
      phase: 'Intelligent Procurement',
      title: 'Live Telemetry & Demand Forecasting',
      desc: 'Deployed real-time IoT cold-chain sensor tracking, automated batch recall alerts, and multi-supplier price optimization algorithms.'
    },
    {
      year: 'Future',
      phase: 'Expansion',
      title: 'Pan-African Health Supply Cloud',
      desc: 'Expanding cross-border pharmaceutical procurement corridors and automated central medical store integrations across West Africa.'
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section - Clean White Theme */}
      <section className="bg-linear-to-b from-blue-50/40 via-white to-white py-16 sm:py-24 relative overflow-hidden border-b border-slate-200/80">
        <div className="absolute -top-10 -right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-xs font-semibold uppercase tracking-wider mb-6">
            <Building2 size={14} className="text-emerald-600" />
            Our Mission &amp; Foundation
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 max-w-3xl mx-auto">
            Building a More Connected Pharmaceutical Supply Chain
          </h1>
          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            MedSupply is designed to make pharmaceutical procurement simpler, more transparent, and more efficient by connecting healthcare buyers with trusted pharmaceutical suppliers through a centralized digital platform.
          </p>
        </div>
      </section>

      {/* Mission & Vision Grid */}
      <section className="py-16 sm:py-20 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            
            <div className="p-8 sm:p-10 rounded-2xl bg-blue-50/50 border border-blue-200/80 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-700 text-white flex items-center justify-center mb-5 shadow-xs">
                  <Target size={24} />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-800 block mb-2">Our Mission</span>
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Democratizing verified drug availability for every clinical facility.
                </h3>
                <p className="mt-3.5 text-sm sm:text-base text-slate-600 leading-relaxed">
                  We empower hospitals, health systems, and dispensaries to eliminate drug stock-outs, mitigate counterfeit infiltration, and slash administrative procurement delays through transparent digital marketplace connections.
                </p>
              </div>
              <div className="mt-6 pt-6 border-t border-blue-200/60 flex items-center gap-2 text-xs font-bold text-blue-950">
                <CheckCircle2 size={15} className="text-emerald-600" />
                <span>Committed to 100% Genuine, Regulated Pharmaceuticals</span>
              </div>
            </div>

            <div className="p-8 sm:p-10 rounded-2xl bg-linear-to-br from-[#1e40af] via-[#0284c7] to-[#00b87c] text-white flex flex-col justify-between shadow-lg shadow-blue-900/10">
              <div>
                <div className="w-12 h-12 rounded-xl bg-white/20 text-white border border-white/30 flex items-center justify-center mb-5 shadow-xs">
                  <Eye size={24} />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-100 block mb-2">Our Vision</span>
                <h3 className="text-2xl font-bold text-white tracking-tight">
                  The trusted digital backbone of healthcare procurement.
                </h3>
                <p className="mt-3.5 text-sm sm:text-base text-blue-50 leading-relaxed">
                  To become the pan-African standard infrastructure for healthcare procurement, where every hospital order is verifiable, pricing is competitive, and life-saving therapeutics arrive securely without friction.
                </p>
              </div>
              <div className="mt-6 pt-6 border-t border-white/20 flex items-center gap-2 text-xs font-bold text-white">
                <Sparkles size={15} />
                <span>Zero-Tolerance for Counterfeits or Excursions</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 sm:py-24 bg-slate-50/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Institutional Pillars"
            title="Our Core Values"
            subtitle="The operational philosophy guiding our team, engineering architecture, and regulatory standards every day."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {values.map((val, idx) => {
              const Icon = val.icon;
              return (
                <div key={idx} className="bg-white p-7 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-blue-300 hover:shadow-md transition-all">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 mb-4">
                    <Icon size={22} />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900">
                    {val.title}
                  </h4>
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {val.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 sm:py-24 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Growth &amp; Milestones"
            title="The MedSupply Evolution"
            subtitle="From identifying broken medical supply chains to building the most robust pharmaceutical B2B marketplace."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {timelineSteps.map((step, idx) => (
              <div key={idx} className="p-6 rounded-2xl border border-slate-200/90 bg-white hover:border-blue-400 hover:shadow-xs transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-blue-50 text-blue-900 border border-blue-200/60">
                      {step.year}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      {step.phase}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mt-2">
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

      {/* CTA Section */}
      <CTASection />
    </div>
  );
};

export default AboutPage;