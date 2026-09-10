"use client"
import { motion } from "framer-motion"

interface FeatureCardProps {
  icon: string
  title: string
  desc: string
  bg: string
}

const FeatureCard = ({ icon, title, desc, bg }: FeatureCardProps) => (
  <div className="min-w-70 snap-center rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition-shadow hover:shadow-md md:h-54.5 md:min-w-0 md:snap-align-none">
    <div
      className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl text-xl ${bg}`}
    >
      {icon}
    </div>
    <h3 className="mb-2 text-base font-semibold tracking-tight text-slate-900">
      {title}
    </h3>
    <p className="text-sm leading-relaxed text-slate-600">{desc}</p>
  </div>
)

const VALUE_PROPS = [
  {
    icon: "🔐",
    title: "Pharmacist Verification",
    desc: "Products is physically verified by licensed pharmacists before delivery.",
    bg: "bg-blue-50",
  },
  {
    icon: "🤝",
    title: "Multi-Supplier Bidding",
    desc: "Orders are sent to multiple verified suppliers simultaneously.",
    bg: "bg-green-50",
  },
  {
    icon: "💳",
    title: "Escrow Payments",
    desc: "Payment is held until verification is complete.",
    bg: "bg-amber-50",
  },
  {
    icon: "📊",
    title: "Real-Time Tracking",
    desc: "Buyers track every step of their order from placement to delivery.",
    bg: "bg-violet-50",
  },
  {
    icon: "🏥",
    title: "Curated Catalog",
    desc: "Admin-controlled product catalog ensures only legitimate items.",
    bg: "bg-sky-50",
  },
  {
    icon: "🛡️",
    title: "KYC & Licensing",
    desc: "Suppliers undergo full verification including licenses.",
    bg: "bg-red-50",
  },
]

export function ValuePropSection() {
  return (
    <section
      className="mx-auto max-w-7xl overflow-hidden px-6 py-10"
      id="value-prop-section"
    >
      <div className="mb-2 flex flex-col items-center text-center lg:mb-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-medium text-blue-600"
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-600" />
          Why MedSupply
        </motion.div>
        <h2 className="font-sora mx-auto mb-2 w-11/12 text-center text-2xl font-semibold tracking-tight sm:text-3xl">
          Built for Pharmaceutical B2B
        </h2>
        <p className="mx-auto mb-12 max-w-lg text-center text-slate-600">
          A complete verification-first workflow that protects buyers,
          suppliers, and patients.
        </p>
      </div>

      {/* Desktop Grid / Mobile Marquee */}
      <div className="relative">
        {/* Desktop Grid */}
        <div className="hidden gap-5 md:grid md:grid-cols-3">
          {VALUE_PROPS.map((prop, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <FeatureCard {...prop} />
            </motion.div>
          ))}
        </div>

        {/* Mobile Auto-swipe Marquee */}
        <div className="group flex overflow-hidden py-4 md:hidden">
          <motion.div
            className="flex gap-4"
            animate={{
              x: ["0%", "-50%"],
            }}
            transition={{
              duration: 25,
              ease: "linear",
              repeat: Infinity,
            }}
          >
            {[...VALUE_PROPS, ...VALUE_PROPS].map((prop, index) => (
              <div key={index} className="w-70 shrink-0">
                <FeatureCard {...prop} />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Indicators (Desktop only since mobile is auto) */}
        <div className="mt-8 hidden justify-center gap-1.5 md:flex">
          {[1, 2, 3].map((_, i) => (
            <div
              key={i}
              className={`h-1.5 w-1.5 rounded-full ${i === 0 ? "bg-blue-600" : "bg-slate-300"}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
