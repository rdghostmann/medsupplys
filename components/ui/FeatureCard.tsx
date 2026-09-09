import React from 'react';
import * as LucideIcons from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  iconName: string;
  badge?: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  iconName,
  badge
}) => {
  // Dynamically resolve icon or fallback to ShieldCheck
  const IconComponent = (LucideIcons as Record<string, any>)[iconName] || LucideIcons.ShieldCheck;

  return (
    <div className="group relative bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/80 shadow-xs hover:border-blue-500/40 hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 group-hover:bg-gradient-to-br group-hover:from-[#1e40af] group-hover:to-[#00b87c] group-hover:text-white transition-all duration-200 shadow-xs">
            <IconComponent size={22} />
          </div>
          {badge && (
            <span className="text-[11px] font-semibold tracking-wide uppercase px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80">
              {badge}
            </span>
          )}
        </div>
        <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-900 transition-colors">
          {title}
        </h3>
        <p className="mt-2.5 text-sm leading-relaxed text-slate-600">
          {description}
        </p>
      </div>
      <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center text-xs font-semibold text-blue-800 group-hover:translate-x-0.5 transition-transform">
        <span>Compliant Feature Spec</span>
        <LucideIcons.ArrowRight size={13} className="ml-1.5" />
      </div>
    </div>
  );
};
