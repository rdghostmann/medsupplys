"use client"

import { motion } from "framer-motion"
import {
  Hospital,
  Building2,
  Stethoscope,
  Pill,
  Network,
  ShieldCheck,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface Logo {
  id: string
  name: string
  type: string
  icon?: LucideIcon
}

interface LogoCloudProps {
  title?: string
  logos?: Logo[]
  speed?: number
}

const DEFAULT_LOGOS: Logo[] = [
  {
    id: "1",
    name: "Cedarcrest Hospitals",
    type: "Teaching Hospital",
    icon: Hospital,
  },
  {
    id: "2",
    name: "St. Nicholas Healthcare",
    type: "Tertiary Medical Center",
    icon: Building2,
  },
  {
    id: "3",
    name: "HealthPlus Network",
    type: "Pharmacy Chain",
    icon: Pill,
  },
  {
    id: "4",
    name: "Lagoon Clinics & Diagnostics",
    type: "Specialist Clinic",
    icon: Stethoscope,
  },
  {
    id: "5",
    name: "MetroCare Health System",
    type: "Healthcare Network",
    icon: Network,
  },
  {
    id: "6",
    name: "Apex Pharma Distribution",
    type: "GDP Verified Importer",
    icon: ShieldCheck,
  },
]

export function LogoCloud({
  title = "Trusted by leading healthcare networks and verified pharmaceutical suppliers",
  logos = DEFAULT_LOGOS,
  speed = 40,
}: LogoCloudProps) {
  // Duplicate logos for a seamless marquee loop.
  const duplicatedLogos = [...logos, ...logos]

  return (
    <section
      id="logo-cloud"
      aria-label="Healthcare organizations and pharmaceutical suppliers"
      className="w-full overflow-hidden border-y border-slate-100 bg-white py-16"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        {title && (
          <h2 className="mb-12 text-center text-sm font-semibold tracking-widest text-slate-500 uppercase">
            {title}
          </h2>
        )}

        <div className="relative">
          {/* Left Fade */}
          <div
            className="pointer-events-none absolute top-0 left-0 z-10 h-full w-24 bg-linear-to-r from-white to-transparent"
            aria-hidden="true"
          />

          {/* Right Fade */}
          <div
            className="pointer-events-none absolute top-0 right-0 z-10 h-full w-24 bg-linear-to-l from-white to-transparent"
            aria-hidden="true"
          />

          {/* Marquee */}
          <div className="flex overflow-hidden">
            <motion.div
              className="flex shrink-0 items-center gap-12 whitespace-nowrap"
              animate={{
                x: ["0%", "-50%"],
              }}
              transition={{
                duration: speed,
                ease: "linear",
                repeat: Infinity,
                repeatType: "loop",
              }}
              whileHover={{
                animationPlayState: "paused",
              }}
            >
              {duplicatedLogos.map((logo, index) => {
                const Icon = logo.icon ?? Hospital

                return (
                  <div
                    key={`${logo.id}-${index}`}
                    className="flex shrink-0 cursor-default items-center gap-3 rounded-xl border border-transparent px-6 py-3 transition-colors select-none hover:border-slate-100 hover:bg-slate-50"
                    title={logo.type}
                  >
                    {/* Icon */}
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                      <Icon size={20} strokeWidth={1.8} aria-hidden="true" />
                    </div>

                    {/* Organization Name */}
                    <span className="text-lg font-medium whitespace-nowrap text-slate-700">
                      {logo.name}
                    </span>
                  </div>
                )
              })}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default LogoCloud
