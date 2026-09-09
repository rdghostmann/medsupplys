import React from 'react';
import * as LucideIcons from 'lucide-react';
import { ServiceDetail } from '../../types';
import { useRouter } from '../../context/RouterContext';

interface ServiceCardProps {
  service: ServiceDetail;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const { navigate, openQuoteModal } = useRouter();
  const IconComponent = (LucideIcons as Record<string, any>)[service.icon] || LucideIcons.Activity;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-lg hover:border-blue-300 transition-all duration-200 p-6 sm:p-8 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-3 mb-5">
          <div className="w-13 h-13 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 shadow-2xs">
            <IconComponent size={24} />
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200/80">
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
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            Core Enterprise Capabilities
          </p>
          <ul className="space-y-2.5">
            {service.benefits.map((benefit, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 leading-normal">
                <LucideIcons.CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-7 pt-4 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200/60">
          {service.keyMetrics}
        </span>
        <button
          onClick={() => {
            if (service.id === 'sourcing' || service.id === 'price-intelligence') {
              openQuoteModal();
            } else {
              navigate('/contact');
            }
          }}
          className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 hover:text-emerald-700 transition-colors py-1 px-2 rounded-md hover:bg-blue-50/60 cursor-pointer"
        >
          <span>Request Info</span>
          <LucideIcons.ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
};
