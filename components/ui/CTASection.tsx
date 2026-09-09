import React from 'react';
import { useRouter } from '../../context/RouterContext';
import { ArrowRight, ShieldCheck, CheckCircle2, Building2 } from 'lucide-react';
import { MedSupplyLogo } from './MedSupplyLogo';

export const CTASection: React.FC = () => {
  const { navigate, openQuoteModal } = useRouter();

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-blue-50/30 to-emerald-50/30 text-slate-900 border-t border-b border-slate-200/80 overflow-hidden">
      {/* Background subtle ambient lighting */}
      <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto text-center">
        {/* Official Logo Mark Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/90 shadow-xs text-slate-800 text-xs font-semibold mb-6">
          <MedSupplyLogo variant="iconOnly" size="sm" />
          <span className="text-slate-900 font-bold">Enterprise Healthcare Infrastructure</span>
          <span className="text-slate-400">&bull;</span>
          <span className="text-emerald-700 font-mono text-[11px] font-bold">Verified B2B</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-slate-900">
          Ready to Modernize Your{' '}
          <span className="bg-gradient-to-r from-[#1e40af] via-[#0284c7] to-[#00b87c] bg-clip-text text-transparent">
            Pharmaceutical Procurement
          </span>?
        </h2>

        <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Connect with verified suppliers, compare procurement options in real-time, and manage your healthcare supply chain from one centralized, compliance-ready platform.
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

        <div className="mt-10 pt-8 border-t border-slate-200/80 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-slate-600">
          <span className="flex items-center gap-2">
            <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
            100% NAFDAC &amp; PCN Verified Suppliers
          </span>
          <span className="flex items-center gap-2">
            <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
            Zero Setup Fees for Hospitals &amp; Clinics
          </span>
          <span className="flex items-center gap-2">
            <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
            Calibrated 2–8°C Cold-Chain Tracking
          </span>
        </div>
      </div>
    </section>
  );
};
