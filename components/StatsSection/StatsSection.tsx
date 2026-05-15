"use client"

import { Globe, Package, Star, Users } from "@phosphor-icons/react";

// import { Star, Package, Globe, Users } from "lucide-react";

interface StatItem {
  id: string;
  icon: React.ReactNode;
  value: string;
  description: string;
}

const DEFAULT_STATS: StatItem[] = [
  {
    id: "1",
    icon: <Star className="w-6 h-6" />,
    value: "5+",
    description: "Years of excellence",
  },
  {
    id: "2",
    icon: <Package className="w-6 h-6" />,
    value: "1,200+",
    description: "Verified products",
  },
  {
    id: "3",
    icon: <Globe className="w-6 h-6" />,
    value: "340+",
    description: "Licensed suppliers",
  },
  {
    id: "4",
    icon: <Users className="w-6 h-6" />,
    value: "4,800+",
    description: "Happy buyers",
  },
];

export function StatsSection() {
  return (
    <section className="py-10 bg-white" id="stats-section">
      <div className="max-w-7xl flex flex-col-reverse gap-4 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header */}
        <div className="lg:grid lg:grid-cols-2 gap-12 items-center ">
        {/* <div className="grid lg:grid-cols-2 gap-12 items-end mb-20"> */}
          <div className="py-4 lg:pb-0">
            <h2 className="text-3xl md:text-center lg:text-left sm:text-4xl xl:text-5xl font-semibold tracking-tight text-slate-900 leading-tight">
              Your Trusted Pharma B2B Partner <br className="hidden md:block" /> <span className="hidden">Since 2020</span>
            </h2>
          </div>
          <div>
            <p className="text-lg md:text-center lg:text-left mx-auto text-slate-600 leading-relaxed">
              We believe in building lasting relationships with hospitals, clinics, and pharmacies — 
              offering not just product listings, but a fully verified, end-to-end procurement experience. 
              From supplier matching to pharmacist-verified delivery, we're here every step of the way.
            </p>
          </div>
        </div>

       {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {DEFAULT_STATS.map((stat) => (
            <div 
              key={stat.id} 
              className="cursor-pointer flex gap-2 group p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-white shadow-sm text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                {stat.icon}
              </div>
              <div id={`stat-${stat.id}-content`}>
                <div className="text-xl font-bold text-slate-900 ">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-500 font-medium">
                  {stat.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
