import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  value: string;
  label: string;
  subtext?: string;
  icon?: LucideIcon;
  trend?: string;
  highlight?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  value,
  label,
  subtext,
  icon: Icon,
  trend,
  highlight = false,
}) => {
  return (
    <div className={`relative p-6 sm:p-7 rounded-2xl border transition-all duration-200 ${
      highlight 
        ? 'bg-linear-to-br from-[#1e40af] via-[#0284c7] to-[#00b87c] text-white border-blue-400/40 shadow-lg shadow-blue-900/15' 
        : 'bg-white border-slate-200/80 shadow-xs hover:border-blue-300 hover:shadow-md'
    }`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className={`text-xs font-semibold uppercase tracking-wider ${
            highlight ? 'text-blue-100' : 'text-slate-500'
          }`}>
            {label}
          </p>
          <p className={`mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight ${
            highlight ? 'text-white' : 'text-slate-900'
          }`}>
            {value}
          </p>
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl shrink-0 ${
            highlight ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-700 border border-blue-100'
          }`}>
            <Icon size={22} />
          </div>
        )}
      </div>
      
      {(subtext || trend) && (
        <div className={`mt-4 pt-3.5 border-t ${highlight ? 'border-white/20' : 'border-slate-100'} flex items-center justify-between text-xs`}>
          {subtext && (
            <span className={highlight ? 'text-blue-100' : 'text-slate-500'}>
              {subtext}
            </span>
          )}
          {trend && (
            <span className={`font-semibold px-2 py-0.5 rounded-full ${
              highlight 
                ? 'bg-white/20 text-white' 
                : 'text-emerald-700 bg-emerald-50 border border-emerald-200/60'
            }`}>
              {trend}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
