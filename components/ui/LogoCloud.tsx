import React from 'react';
import { Hospital, Building2, Stethoscope, Pill, Network, ShieldCheck } from 'lucide-react';

export const LogoCloud: React.FC = () => {
  const partners = [
    { name: 'Cedarcrest Hospitals', type: 'Teaching Hospital', icon: Hospital },
    { name: 'St. Nicholas Healthcare', type: 'Tertiary Medical Center', icon: Building2 },
    { name: 'HealthPlus Network', type: 'Pharmacy Chain', icon: Pill },
    { name: 'Lagoon Clinics & Diagnostics', type: 'Specialist Clinic', icon: Stethoscope },
    { name: 'MetroCare Health System', type: 'Healthcare Network', icon: Network },
    { name: 'Apex Pharma Distribution', type: 'GDP Verified Importer', icon: ShieldCheck },
  ];

  return (
    <div className="py-12 border-y border-slate-200/80 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-bold uppercase tracking-widest text-slate-400 mb-8">
          Trusted by leading healthcare networks and verified pharmaceutical suppliers
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 items-center">
          {partners.map((partner, index) => {
            const Icon = partner.icon;
            return (
              <div 
                key={index}
                className="flex flex-col items-center justify-center p-4 rounded-xl bg-white border border-slate-200/60 shadow-2xs hover:border-blue-500/40 transition-colors group text-center"
              >
                <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600 group-hover:text-blue-700 group-hover:bg-blue-50 transition-colors mb-2">
                  <Icon size={18} />
                </div>
                <span className="text-xs font-bold text-slate-800 leading-tight">
                  {partner.name}
                </span>
                <span className="text-[10px] text-slate-400 font-medium mt-0.5">
                  {partner.type}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
