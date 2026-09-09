import React, { useState } from 'react';
import { 
  Search, 
  Layers, 
  CheckCircle2, 
  FileCheck, 
  Truck, 
  ShieldCheck, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const ProcurementWorkflow: React.FC = () => {
  const [activeStep, setActiveStep] = useState(1);


  const steps = [
    {
      number: 1,
      title: 'Search Products',
      subtitle: 'Browse 1,500+ Verified SKUs',
      description: 'Search national formulary medicines by generic name, active pharmaceutical ingredient (API), therapeutic category, or NAFDAC registration number.',
      icon: Search,
      highlight: 'Standardized national drug catalogue with verified batch numbers'
    },
    {
      number: 2,
      title: 'Compare Suppliers',
      subtitle: 'Side-by-Side Market Intelligence',
      description: 'Evaluate transparent supplier quotations side-by-side: unit price, tiered volume discounts, current stock, remaining shelf life, and lead time.',
      icon: Layers,
      highlight: 'No hidden distributor markups or unverified broker intermediaries'
    },
    {
      number: 3,
      title: 'Select Supplier',
      subtitle: 'Choose Importer, Distributor, or Retailer',
      description: 'Select the optimal vendor based on your hospital budget, order volume, clinical urgency, or cold-chain delivery requirements.',
      icon: CheckCircle2,
      highlight: 'Verified Good Distribution Practice (GDP) ratings & fulfillment metrics'
    },
    {
      number: 4,
      title: 'Place Order',
      subtitle: 'Digital Purchase Order (PO)',
      description: 'Generate legally binding digital purchase orders with institutional approval routing, budget code allocation, and escrow protection.',
      icon: FileCheck,
      highlight: 'Automated finance sign-offs and purchase requisition compliance'
    },
    {
      number: 5,
      title: 'Verification & Fulfillment',
      subtitle: 'Batch Release & CoA Inspection',
      description: 'The supplier validates batch numbers, prepares tamper-evident packaging, logs temperature data for biologicals, and readies dispatch.',
      icon: ShieldCheck,
      highlight: 'Certificate of Analysis (CoA) attached to digital invoice'
    },
    {
      number: 6,
      title: 'Track Delivery',
      subtitle: 'Real-Time Logistics Telemetry',
      description: 'Monitor the shipment in real-time from warehouse dock to hospital pharmacy receiving bay with digital proof-of-delivery signing.',
      icon: Truck,
      highlight: 'Continuous 2-8°C cold-chain temperature telemetry logs'
    }
  ];

  return (
    <div className="space-y-10">
      {/* Step Numbers Bar */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {steps.map((step) => {
          const Icon = step.icon;
          const isActive = activeStep === step.number;
          return (
            <button
              key={step.number}
              onClick={() => setActiveStep(step.number)}
              className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden group cursor-pointer ${
                isActive
                  ? 'bg-linear-to-r from-[#1e40af] to-[#00b87c] text-white border-transparent shadow-md ring-2 ring-blue-500/30'
                  : 'bg-white border-slate-200/90 text-slate-700 hover:border-blue-300 hover:shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  0{step.number}
                </span>
                <Icon size={16} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-700'} />
              </div>
              <p className={`font-bold text-xs sm:text-sm tracking-tight ${isActive ? 'text-white' : 'text-slate-900'}`}>
                {step.title}
              </p>
              <p className={`text-[11px] truncate mt-0.5 ${isActive ? 'text-blue-100' : 'text-slate-400'}`}>
                {step.subtitle}
              </p>
            </button>
          );
        })}
      </div>

      {/* Active Step Detailed View */}
      {(() => {
        const current = steps.find(s => s.number === activeStep) || steps[0];
        const Icon = current.icon;
        return (
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-lg p-6 sm:p-8 lg:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-xs font-semibold uppercase tracking-wider mb-4">
                  <Sparkles size={13} className="text-emerald-600" />
                  Stage 0{current.number} of 06 — Workflow Engine
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {current.title}
                </h3>
                <p className="mt-2 text-sm font-semibold text-blue-700">
                  {current.subtitle}
                </p>
                <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed">
                  {current.description}
                </p>

                <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-700 font-medium">
                    <strong className="text-slate-900 font-bold">Enterprise Guarantee: </strong>
                    {current.highlight}
                  </p>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => {}}
                    className="px-5 py-2.5 rounded-xl bg-linear-to-r from-[#1e40af] to-[#00b87c] hover:from-[#1d4ed8] hover:to-[#059669] text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Test This Step in Live Preview</span>
                    <ArrowRight size={13} />
                  </button>

                  <button
                    onClick={() => setActiveStep(prev => (prev < 6 ? prev + 1 : 1))}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
                  >
                    Next Workflow Step ({activeStep < 6 ? `0${activeStep + 1}` : '01'})
                  </button>
                </div>
              </div>

              {/* Visual Workflow Graphic - Clean White/Light Tech Card */}
              <div className="lg:col-span-5 bg-linear-to-br from-slate-50 to-blue-50/50 rounded-2xl p-6 text-slate-900 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-lg bg-blue-100/70 text-blue-700 flex items-center justify-center border border-blue-200">
                      <Icon size={18} />
                    </div>
                    <div>
                      <span className="text-xs font-mono font-bold text-blue-700">STAGE 0{current.number}</span>
                      <p className="text-xs font-bold text-slate-900">{current.title}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300 text-emerald-700 font-bold">
                    STATUS: ACTIVE
                  </span>
                </div>

                <div className="space-y-3 font-mono text-[11px]">
                  <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-2xs">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">API Transaction State</span>
                    <span className="text-blue-700 font-semibold">Verified &amp; Signed via Hospital Smart Ledger</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-2xs">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Regulatory Checkpoint</span>
                    <span className="text-emerald-700 font-semibold">NAFDAC Reg OK &bull; Batch Validated &bull; GDP Compliant</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-2xs">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Institutional Security</span>
                    <span className="text-slate-700">256-Bit TLS &bull; Multi-tier Approval Authorized</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
