"use client"
import { motion } from "framer-motion"
import { ArrowRight, Sparkles, Building2, ShieldCheck } from "lucide-react"

export function CtaSection() {
  return (
    <section className="bg-white px-4 py-24" id="cta-section">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-linear-to-br from-blue-600 via-indigo-600 to-violet-700 px-8 py-20 shadow-2xl md:px-16">
          {/* Watermark/Background decoration */}
          <div className="pointer-events-none absolute top-0 right-0 translate-x-1/4 -translate-y-1/4 opacity-10">
            <Building2 size={600} className="text-white" />
          </div>
          <div className="pointer-events-none absolute bottom-0 left-0 -translate-x-1/4 translate-y-1/4 opacity-10">
            <ShieldCheck size={400} className="text-white" />
          </div>

          <div className="relative z-10 max-w-3xl">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="relative mb-8 text-2xl leading-[1.1] font-bold tracking-tight text-white md:text-4xl"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="animate absolute -top-9 -z-20 mb-8 w-fit animate-pulse items-center gap-2 rounded-full border border-white/20 bg-white/10 p-2 text-sm font-semibold text-white shadow-sm backdrop-blur-md"
              >
                <Sparkles size={16} className="text-blue-200" />
              </motion.div>
              Connect with verified pharmaceutical suppliers nationwide
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mb-12 max-w-2xl text-xl leading-relaxed text-blue-100 md:text-xl"
            >
              Access trusted importers, distributors, and manufacturers through
              a centralized procurement marketplace built for hospitals,
              pharmacies, and healthcare organizations.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex flex-col gap-4 sm:flex-row"
            >
              <button className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-lg font-bold text-blue-700 shadow-lg transition-all hover:scale-105 hover:bg-blue-50">
                Explore Marketplace
                <ArrowRight size={20} />
              </button>
              <button className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/30 bg-transparent px-8 py-4 text-lg font-bold text-white transition-all hover:bg-white/10">
                Become a Supplier
              </button>
            </motion.div>
          </div>

          {/* Floating decorative elements */}
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, 0],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[20%] right-[15%] hidden h-16 w-16 rounded-2xl border border-white/20 bg-white/10 shadow-xl backdrop-blur-lg lg:block"
          />
          <motion.div
            animate={{
              y: [0, 20, 0],
              rotate: [0, -5, 0],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute right-[5%] bottom-[20%] hidden h-24 w-24 rounded-3xl border border-white/20 bg-white/10 shadow-xl backdrop-blur-lg lg:block"
          />
        </div>
      </div>
    </section>
  )
}
