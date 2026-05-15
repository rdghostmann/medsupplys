"use client";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Building2, ShieldCheck } from "lucide-react";

export function CtaSection() {
  return (
    <section className="py-24 px-4 bg-white" id="cta-section">
      <div className="max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 py-20 px-8 md:px-16 shadow-2xl">
          {/* Watermark/Background decoration */}
          <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 opacity-10 pointer-events-none">
             <Building2 size={600} className="text-white" />
          </div>
          <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 opacity-10 pointer-events-none">
             <ShieldCheck size={400} className="text-white" />
          </div>

          <div className="relative z-10 max-w-3xl">
           

            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className=" relative text-2xl md:text-4xl font-bold text-white tracking-tight mb-8 leading-[1.1]"
            >
               <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="animate animate-pulse absolute -top-9 -z-20 w-fit items-center gap-2 p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-semibold mb-8 shadow-sm"
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
              className="text-xl md:text-xl text-blue-100 mb-12 leading-relaxed max-w-2xl"
            >
             Access trusted importers, distributors, and manufacturers through a centralized procurement marketplace built for hospitals, pharmacies, and healthcare organizations.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <button className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white text-blue-700 font-bold text-lg hover:bg-blue-50 transition-all hover:scale-105 shadow-lg">
                Explore Marketplace
                <ArrowRight size={20} />
              </button>
              <button className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-transparent border-2 border-white/30 text-white font-bold text-lg hover:bg-white/10 transition-all">
                Become a Supplier
              </button>
            </motion.div>
          </div>

          {/* Floating decorative elements */}
          <motion.div 
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 5, 0]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="hidden lg:block absolute top-[20%] right-[15%] w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl"
          />
          <motion.div 
            animate={{ 
              y: [0, 20, 0],
              rotate: [0, -5, 0]
            }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="hidden lg:block absolute bottom-[20%] right-[5%] w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl"
          />
        </div>
      </div>
    </section>
  );
}
