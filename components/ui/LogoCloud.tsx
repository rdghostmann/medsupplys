import React from "react"
import {
  Hospital,
  Building2,
  Stethoscope,
  Pill,
  Network,
  ShieldCheck,
} from "lucide-react"

export const LogoCloud: React.FC = () => {
  const partners = [
    { name: "Cedarcrest Hospitals", type: "Teaching Hospital", icon: Hospital },
    {
      name: "St. Nicholas Healthcare",
      type: "Tertiary Medical Center",
      icon: Building2,
    },
    { name: "HealthPlus Network", type: "Pharmacy Chain", icon: Pill },
    {
      name: "Lagoon Clinics & Diagnostics",
      type: "Specialist Clinic",
      icon: Stethoscope,
    },
    {
      name: "MetroCare Health System",
      type: "Healthcare Network",
      icon: Network,
    },
    {
      name: "Apex Pharma Distribution",
      type: "GDP Verified Importer",
      icon: ShieldCheck,
    },
  ]

  return (
    <div className="border-y border-slate-200/80 bg-slate-50/50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="mb-8 text-center text-xs font-bold tracking-widest text-slate-400 uppercase">
          Trusted by leading healthcare networks and verified pharmaceutical
          suppliers
        </p>

        <div className="grid grid-cols-2 items-center gap-6 md:grid-cols-3 lg:grid-cols-6">
          {partners.map((partner, index) => {
            const Icon = partner.icon
            return (
              <div
                key={index}
                className="group flex flex-col items-center justify-center rounded-xl border border-slate-200/60 bg-white p-4 text-center shadow-2xs transition-colors hover:border-blue-500/40"
              >
                <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg border border-slate-100 bg-slate-50 text-slate-600 transition-colors group-hover:bg-blue-50 group-hover:text-blue-700">
                  <Icon size={18} />
                </div>
                <span className="text-xs leading-tight font-bold text-slate-800">
                  {partner.name}
                </span>
                <span className="mt-0.5 text-[10px] font-medium text-slate-400">
                  {partner.type}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
