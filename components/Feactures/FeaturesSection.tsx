// FeaturesSection.tsx
"use client"
import {
  Brain,
  PackageIcon,
  SealCheckIcon,
  ShieldCheckIcon,
  Truck,
} from "@phosphor-icons/react"
import { motion } from "framer-motion"
import { Shield, Zap, HeartPulse, BrainCircuit } from "lucide-react"
import Image from "next/image"

interface Feature {
  id: string
  title: string
  description: string
  image: string
  icon: React.ReactNode
  color: string
}

const FEATURES: Feature[] = [
  {
    id: "1",
    title: "Verified Pharmceutical Suppliers",
    description:
      "Every supplier on MedSupply undergoes business verification, license validation, and compliance review to ensure pharmacies, hospitals, and clinics source only from trusted pharmaceutical distributors and importers.",
    image:
      "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80&w=1200",
    icon: <ShieldCheckIcon size={24} />,
    color: "bg-blue-600",
  },
  {
    id: "2",
    title: "Smart Procurement Matching",
    description:
      "Our intelligent procurement engine automatically matches buyers with the best suppliers based on pricing, stock availability, fulfillment speed, supplier rating, and minimum order requirements.",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1200",
    icon: <Brain size={24} />,
    color: "bg-indigo-600",
  },

  {
    id: "3",
    title: "Real-time Inventory Visibility",
    description:
      "Track live pharmaceutical inventory across multiple suppliers in real-time. Buyers instantly see available stock levels, pricing changes, product status, and fulfillment capacity before placing orders.",
    image:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1200",
    icon: <PackageIcon size={24} />,
    color: "bg-rose-600",
  },
  {
    id: "5",
    title: "Procurement Transparency & Compliance",
    description:
      "Maintain transparent procurement operations with traceable supplier activity, pricing visibility, verification records, and centralized order monitoring designed for modern healthcare compliance.",
    image:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=1200",
    icon: <SealCheckIcon size={24} />,
    color: "bg-cyan-600",
  },
  {
    id: "6",
    title: "Nationwide Delivery Coordination",
    description:
      "Coordinate pharmaceutical fulfillment and logistics from warehouse to healthcare facilities with structured delivery workflows, supplier dispatch tracking, and optimized order routing.",
    image:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=1200",
    icon: <Truck size={24} />,
    color: "bg-orange-600",
  },
]

export function FeatureSection() {
  return (
    <section className="overflow-hidden bg-white py-24" id="feature-section">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-medium text-blue-600"
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-600" />
            Designed for Modern Healthcare
          </motion.div>
          <h2 className="font-sora mb-2 text-center text-3xl font-semibold tracking-tight">
            Our Procurement Wizard
          </h2>
          <p className="mx-auto mb-12 max-w-lg text-center text-slate-600">
            Powerful tools that bridge the gap between complex pharmaceutical
            supply chains and clinical excellence.
          </p>

          <h2 className="font-sora mb-2 text-center text-3xl font-semibold tracking-tight"></h2>
        </div>

        {/* Desktop View: Alternating Rows */}
        <div className="hidden flex-col gap-32 md:flex">
          {FEATURES.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className={`relative flex items-center gap-16 ${
                index % 2 === 1 ? "flex-row-reverse" : "flex-row"
              }`}
            >
              {/* <div className={`opacity-40 top-30 absolute w-14 h-14 rounded-2xl ${feature.color} text-white flex items-center justify-center shadow-lg shadow-blue-500/20`}>
                {feature.icon}
              </div> */}

              {/* Text Side */}
              <div className="z-40 flex-1 space-y-6">
                <div
                  className={`h-14 w-14 rounded-2xl md:hidden ${feature.color} flex items-center justify-center text-white shadow-lg shadow-blue-500/20`}
                >
                  {feature.icon}
                </div>
                <div className="font-sora relative flex text-4xl font-semibold tracking-tight text-slate-900">
                  <h3 className="font-sora flex text-4xl font-semibold tracking-tight text-slate-900">
                    {feature.title}
                  </h3>

                  <div
                    className={`top-30 z-10 h-fit w-fit rounded-2xl p-4 opacity-85 ${feature.color} flex items-center justify-center text-white shadow-lg shadow-blue-500/20`}
                  >
                    {feature.icon}
                  </div>
                </div>
                <p className="text-lg leading-relaxed text-slate-600">
                  {feature.description}
                </p>
                <button
                  onClick={() => {}}
                  className="inline-flex items-center gap-2 font-bold text-blue-600 transition-all hover:gap-3"
                >
                  Learn more about {feature.title.split(" ")[0]}{" "}
                  <span>&rarr;</span>
                </button>
              </div>

              {/* Image Side */}
              <div className="relative flex-1">
                <div className="absolute inset-0 -rotate-3 rounded-[3rem] bg-blue-600/5 transition-transform duration-500 group-hover:rotate-0" />
                <img
                  src={feature.image}
                  referrerPolicy="no-referrer"
                  alt={feature.title}
                  className="relative z-10 aspect-[4/3] w-full rounded-[2.5rem] border-4 border-white object-cover shadow-2xl"
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile View: Swipable Horizontal Container */}
        <div className="md:hidden">
          <div className="-mx-4 no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto px-4 pb-8">
            {FEATURES.map((feature) => (
              <div
                key={feature.id}
                className="flex min-w-[85%] snap-center flex-col rounded-3xl border border-slate-100 bg-slate-50 p-6"
              >
                <div className="mb-6 aspect-[4/3] overflow-hidden rounded-2xl">
                  <Image
                    src={feature.image}
                    referrerPolicy="no-referrer"
                    alt={feature.title}
                    className="h-full w-full object-cover"
                    width={80}
                    height={1200}
                    unoptimized
                    priority
                  />
                </div>
                <div
                  className={`h-10 w-10 rounded-xl ${feature.color} mb-4 flex items-center justify-center text-white`}
                >
                  {feature.icon}
                </div>
                <h3 className="mb-3 text-2xl font-bold text-slate-900">
                  {feature.title}
                </h3>
                <p className="mb-6 leading-relaxed text-slate-600">
                  {feature.description}
                </p>
                <button className="mt-auto text-left font-bold text-blue-600">
                  Details &rarr;
                </button>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-center gap-2">
            {FEATURES.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${i === 0 ? "w-8 bg-blue-600" : "w-2 bg-slate-300"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
