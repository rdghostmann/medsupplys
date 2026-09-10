"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { ExternalLink, ShieldCheck } from "lucide-react"
import { SectionHeader } from "../ui/SectionHeader"

interface ComplianceBadge {
  id: string
  name: string
  fullName: string
  image: string
  description: string
}

const COMPLIANCE_BADGES: ComplianceBadge[] = [
  {
    id: "nafdac",
    name: "NAFDAC",
    fullName: "National Agency Food & Drug Commission",
    image: "/nafdac-logo.png",
    description:
      "Fully compliant with Nigerian pharmaceutical registration and safety protocols.",
  },
  {
    id: "pcn",
    name: "PCN",
    fullName: "Pharmacists Council of Nigeria",
    image: "/pcn-logo.png",
    description:
      "Operated by licensed pharmacists following strict professional ethics and standards.",
  },
  {
    id: "hipaa",
    name: "HIPAA",
    fullName: "Health Data Privacy Standard",
    image: "/hipaa-logo.png",
    description:
      "International standard for protecting sensitive patient health information.",
  },
  {
    id: "iso",
    name: "ISO 9001",
    fullName: "Quality Management Systems",
    image: "/iso-logo.png",
    description:
      "Certified logistics and supply chain processes ensuring consistent quality.",
  },
]

export default function ComplianceSection() {
  return (
    <section className="bg-white py-10" id="compliance-section">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        {/* =========================================================
            HEADER
        ========================================================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          className="mb-16"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-semibold tracking-wider text-blue-900 uppercase">
            <ShieldCheck size={14} className="text-emerald-600" />
            <span>Compliance & Safety</span>
          </div>
          <SectionHeader
            badge=""
            title="Meeting the Highest Pharmaceutical & Data Security Standards"
            subtitle="Ensuring patient safety and supply chain integrity through rigorous compliance with regulatory standards."
          />

          {/* <p className="text-slate-600 max-w-2xl mx-auto">
            Meeting the highest pharmaceutical and data security
            requirements to ensure patient safety and supply chain
            integrity.
          </p> */}
        </motion.div>

        {/* =========================================================
            COMPLIANCE BADGES
        ========================================================= */}

        <div className="mb-16 grid grid-cols-1 items-center justify-items-center gap-12 sm:grid-cols-4 lg:grid-cols-4">
          {COMPLIANCE_BADGES.map((badge, index) => (
            <motion.div
              key={badge.id}
              initial={{
                opacity: 0,
                scale: 0.9,
              }}
              whileInView={{
                opacity: 1,
                scale: 1,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                delay: index * 0.1,
              }}
              className="group flex flex-col items-center"
            >
              {/* =====================================================
                  BADGE IMAGE
              ===================================================== */}

              <div className="relative mb-6 flex h-30 w-30 items-center justify-center overflow-hidden rounded-full bg-white p-2 transition-all duration-300 group-hover:bg-white group-hover:shadow-xl group-hover:shadow-white">
                <Image
                  src={badge.image}
                  alt={`${badge.name} compliance logo`}
                  width={90}
                  height={90}
                  className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-110"
                  unoptimized
                />

                {/* Decorative lines */}
                <div className="absolute top-2 h-px w-12 bg-slate-100" />
                <div className="absolute bottom-2 h-px w-12 bg-slate-100" />
              </div>

              {/* =====================================================
                  BADGE INFORMATION
              ===================================================== */}

              <div className="space-y-2">
                <h3 className="font-bold text-slate-900 transition-colors group-hover:text-blue-600">
                  {badge.fullName}
                </h3>

                <p className="px-4 text-xs leading-relaxed text-slate-500">
                  {badge.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* =========================================================
            COMPLIANCE PORTAL
        ========================================================= */}

        <motion.button
          initial={{
            opacity: 0,
          }}
          whileInView={{
            opacity: 1,
          }}
          viewport={{
            once: true,
          }}
          className="hidden items-center gap-2 rounded-xl bg-slate-800 px-8 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-slate-900 active:scale-95"
        >
          Compliance Portal
          <ExternalLink size={16} />
        </motion.button>
      </div>
    </section>
  )
}
