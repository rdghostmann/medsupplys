"use client"

import { Globe, Package, Star, Users } from "@phosphor-icons/react"

// import { Star, Package, Globe, Users } from "lucide-react";

interface StatItem {
  id: string
  icon: React.ReactNode
  value: string
  description: string
}

const DEFAULT_STATS: StatItem[] = [
  {
    id: "1",
    icon: <Star className="h-6 w-6" />,
    value: "5+",
    description: "Years of excellence",
  },
  {
    id: "2",
    icon: <Package className="h-6 w-6" />,
    value: "1,200+",
    description: "Verified products",
  },
  {
    id: "3",
    icon: <Globe className="h-6 w-6" />,
    value: "340+",
    description: "Licensed suppliers",
  },
  {
    id: "4",
    icon: <Users className="h-6 w-6" />,
    value: "4,800+",
    description: "Happy buyers",
  },
]

export function StatsSection() {
  return (
    <section className="bg-white py-10" id="stats-section">
      <div className="mx-auto flex max-w-7xl flex-col-reverse gap-4 px-4 sm:px-6 lg:px-8">
        {/* Top Header */}
        <div className="items-center gap-12 lg:grid lg:grid-cols-2">
          {/* <div className="grid lg:grid-cols-2 gap-12 items-end mb-20"> */}
          <div className="py-4 lg:pb-0">
            <h2 className="text-3xl leading-tight font-semibold tracking-tight text-slate-900 sm:text-4xl md:text-center lg:text-left xl:text-5xl">
              Your Trusted Pharma B2B Partner <br className="hidden md:block" />{" "}
              <span className="hidden">Since 2020</span>
            </h2>
          </div>
          <div>
            <p className="mx-auto text-lg leading-relaxed text-slate-600 md:text-center lg:text-left">
              We believe in building lasting relationships with hospitals,
              clinics, and pharmacies — offering not just product listings, but
              a fully verified, end-to-end procurement experience. From supplier
              matching to pharmacist-verified delivery, we're here every step of
              the way.
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {DEFAULT_STATS.map((stat) => (
            <div
              key={stat.id}
              className="group flex cursor-pointer gap-2 rounded-2xl border border-slate-100 bg-slate-50 p-4 transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-xl hover:shadow-blue-500/5"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm transition-colors duration-300 group-hover:bg-blue-600 group-hover:text-white">
                {stat.icon}
              </div>
              <div id={`stat-${stat.id}-content`}>
                <div className="text-xl font-bold text-slate-900">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-slate-500">
                  {stat.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
