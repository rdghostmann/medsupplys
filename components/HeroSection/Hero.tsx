// Hero.tsx
"use client"
import { Star } from "@phosphor-icons/react"
import { motion } from "framer-motion"

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-16 lg:pt-48 lg:pb-32">
      {/* Background Image with Overlay */}
      <div className="from-white-95/70 absolute inset-0 bg-linear-to-t via-blue-900/10 to-transparent" />
      <div className="absolute inset-0 z-0">
        <img
          src="/bg-header.png"
          // src="https://images.unsplash.com/photo-1586773860418-d3b9a8ec817f?auto=format&fit=crop&q=80&w=2000"
          alt="Pharmacy background"
          className="block h-full w-full object-cover"
          // className="hidden md:block w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-linear-to-r from-white/90 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-linear-to-r from-white/90 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-medium text-blue-600"
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-600" />
            🔬 Verification-Based B2B Platform
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-sora mb-6 text-4xl leading-[1.1] font-semibold md:text-5xl lg:text-7xl"
          >
            {/* Professional Pharmacy Services <span className="text-blue-600">You Can Trust</span> */}
            The Trusted <span className="text-blue-600">Pharmaceutical</span>{" "}
            B2B Marketplace
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-10 max-w-lg text-lg leading-relaxed text-slate-600"
          >
            {/* Providing expert pharmaceutical care and personalized service to our community. Your health is our top priority. */}
            Connect verified pharmaceutical suppliers with licensed buyers
            through a secure, pharmacist-verified transaction workflow.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center gap-4"
          >
            <button className="hover:bg-primary-dark rounded-full bg-blue-600 px-8 py-4 font-bold text-white shadow-xl shadow-primary/30 transition-all">
              Explore Products
            </button>

            <div className="flex items-center gap-3 rounded-full border border-slate-100 bg-white/80 px-4 py-2 backdrop-blur">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <img
                    key={i}
                    src={`https://i.pravatar.cc/100?img=${i + 10}`}
                    alt="User"
                    className="h-8 w-8 rounded-full border-2 border-white object-cover"
                    referrerPolicy="no-referrer"
                  />
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-bold text-slate-900">
                    4.9/5
                  </span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={10}
                        fill="#f59e0b"
                        className="text-amber-500"
                      />
                    ))}
                  </div>
                </div>
                <p className="text-[10px] font-medium tracking-wide text-slate-500 uppercase">
                  1M Happy customers
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
