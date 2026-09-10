import React from "react"
import * as LucideIcons from "lucide-react"

interface FeatureCardProps {
  title: string
  description: string
  iconName: string
  badge?: string
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  iconName,
  badge,
}) => {
  // Dynamically resolve icon or fallback to ShieldCheck
  const IconComponent =
    (
      LucideIcons as unknown as Record<
        string,
        React.ComponentType<{ size?: number }>
      >
    )[iconName] ||
    (LucideIcons.ShieldCheck as React.ComponentType<{ size?: number }>)

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs transition-all duration-200 hover:border-blue-500/40 hover:shadow-md sm:p-7">
      <div>
        <div className="mb-4 flex items-center justify-between gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-700 shadow-xs transition-all duration-200 group-hover:bg-linear-to-br group-hover:from-[#1e40af] group-hover:to-[#00b87c] group-hover:text-white">
            <IconComponent size={22} />
          </div>
          {badge && (
            <span className="rounded-full border border-emerald-200/80 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-emerald-800 uppercase">
              {badge}
            </span>
          )}
        </div>
        <h3 className="text-lg font-bold text-slate-900 transition-colors group-hover:text-blue-900">
          {title}
        </h3>
        <p className="mt-2.5 text-sm leading-relaxed text-slate-600">
          {description}
        </p>
      </div>
      <div className="mt-5 flex items-center border-t border-slate-100 pt-3.5 text-xs font-semibold text-blue-800 transition-transform group-hover:translate-x-0.5">
        <span>Compliant Feature Spec</span>
        <LucideIcons.ArrowRight size={13} className="ml-1.5" />
      </div>
    </div>
  )
}
