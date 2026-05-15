// Hero.tsx
"use client"
import { Star } from '@phosphor-icons/react';
import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <section className="relative pt-32 pb-16 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0  bg-linear-to-t  from-white-95/70 via-blue-900/10 to-transparent" />
      <div className="absolute inset-0 z-0">
        <img
          src="/bg-header.png"
          // src="https://images.unsplash.com/photo-1586773860418-d3b9a8ec817f?auto=format&fit=crop&q=80&w=2000"
          alt="Pharmacy background"
          className="block w-full h-full object-cover"
          // className="hidden md:block w-full h-full object-cover"
          referrerPolicy="no-referrer"

        />
        <div className="absolute inset-0 bg-linear-to-r from-white/90 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-linear-to-r from-white/90 via-transparent to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 border border-blue-200 px-4 py-1.5 rounded-full text-xs font-medium mb-5">
            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" />
          🔬 Verification-Based B2B Platform
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-7xl font-sora font-semibold leading-[1.1] mb-6"
          >
            {/* Professional Pharmacy Services <span className="text-blue-600">You Can Trust</span> */}
            The Trusted <span className="text-blue-600">Pharmaceutical</span> B2B Marketplace

          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-slate-600 mb-10 max-w-lg leading-relaxed"
          >
            {/* Providing expert pharmaceutical care and personalized service to our community. Your health is our top priority. */}
            Connect verified pharmaceutical suppliers with licensed buyers through a secure, pharmacist-verified transaction workflow.

          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center gap-4"
          >
            <button className="px-8 py-4 bg-blue-600 text-white font-bold rounded-full hover:bg-primary-dark transition-all shadow-xl shadow-primary/30">
              Explore Products
            </button>

            <div className="flex items-center gap-3 bg-white/80 backdrop-blur px-4 py-2 rounded-full border border-slate-100">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <img
                    key={i}
                    src={`https://i.pravatar.cc/100?img=${i + 10}`}
                    alt="User"
                    className="w-8 h-8 rounded-full border-2 border-white object-cover"
                    referrerPolicy="no-referrer"
                  />
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-bold text-slate-900">4.9/5</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={10} fill="#f59e0b" className="text-amber-500" />
                    ))}
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 font-medium tracking-wide uppercase">1M Happy customers</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
