import React from "react"
import { LucideIcon } from "lucide-react"

interface StatCardProps {
  value: string
  label: string
  subtext?: string
  icon?: LucideIcon
  trend?: string
  highlight?: boolean
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
    <div
      className={`relative rounded-2xl border p-6 transition-all duration-200 sm:p-7 ${
        highlight
          ? "border-blue-400/40 bg-linear-to-br from-[#1e40af] via-[#0284c7] to-[#00b87c] text-white shadow-lg shadow-blue-900/15"
          : "border-slate-200/80 bg-white shadow-xs hover:border-blue-300 hover:shadow-md"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p
            className={`text-xs font-semibold tracking-wider uppercase ${
              highlight ? "text-blue-100" : "text-slate-500"
            }`}
          >
            {label}
          </p>
          <p
            className={`mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl ${
              highlight ? "text-white" : "text-slate-900"
            }`}
          >
            {value}
          </p>
        </div>
        {Icon && (
          <div
            className={`shrink-0 rounded-xl p-3 ${
              highlight
                ? "bg-white/20 text-white"
                : "border border-blue-100 bg-blue-50 text-blue-700"
            }`}
          >
            <Icon size={22} />
          </div>
        )}
      </div>

      {(subtext || trend) && (
        <div
          className={`mt-4 border-t pt-3.5 ${highlight ? "border-white/20" : "border-slate-100"} flex items-center justify-between text-xs`}
        >
          {subtext && (
            <span className={highlight ? "text-blue-100" : "text-slate-500"}>
              {subtext}
            </span>
          )}
          {trend && (
            <span
              className={`rounded-full px-2 py-0.5 font-semibold ${
                highlight
                  ? "bg-white/20 text-white"
                  : "border border-emerald-200/60 bg-emerald-50 text-emerald-700"
              }`}
            >
              {trend}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
