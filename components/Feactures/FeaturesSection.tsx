// FeaturesSection.tsx
"use client";
import { Brain, PackageIcon, SealCheckIcon, ShieldCheckIcon, Truck } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { Shield, Zap, HeartPulse, BrainCircuit } from "lucide-react";
import Image from "next/image";

interface Feature {
  id: string;
  title: string;
  description: string;
  image: string;
  icon: React.ReactNode;
  color: string;
}

const FEATURES: Feature[] = [
  {
    id: "1",
    title: "Verified Pharmceutical Suppliers",
    description: "Every supplier on MedSupply undergoes business verification, license validation, and compliance review to ensure pharmacies, hospitals, and clinics source only from trusted pharmaceutical distributors and importers.",
    image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80&w=1200",
    icon: <ShieldCheckIcon size={24} />,
    color: "bg-blue-600",
  },
  {
    id: "2",
    title: "Smart Procurement Matching",
    description: "Our intelligent procurement engine automatically matches buyers with the best suppliers based on pricing, stock availability, fulfillment speed, supplier rating, and minimum order requirements.",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1200",
    icon: <Brain size={24} />,
    color: "bg-indigo-600",
  },

  {
    id: "3",
    title: "Real-time Inventory Visibility",
    description: "Track live pharmaceutical inventory across multiple suppliers in real-time. Buyers instantly see available stock levels, pricing changes, product status, and fulfillment capacity before placing orders.",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1200",
    icon: <PackageIcon size={24} />,
    color: "bg-rose-600",
  },
  {
    id: "5",
    title: "Procurement Transparency & Compliance",
    description: "Maintain transparent procurement operations with traceable supplier activity, pricing visibility, verification records, and centralized order monitoring designed for modern healthcare compliance.",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=1200",
    icon: <SealCheckIcon size={24} />,
    color: "bg-cyan-600",
  },
  {
    id: "6",
    title: "Nationwide Delivery Coordination",
    description: "Coordinate pharmaceutical fulfillment and logistics from warehouse to healthcare facilities with structured delivery workflows, supplier dispatch tracking, and optimized order routing.",
    image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=1200",
    icon: <Truck size={24} />,
    color: "bg-orange-600",
  },
];

export function FeatureSection() {
  return (
    <section className="py-24 bg-white overflow-hidden" id="feature-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 border border-blue-200 px-4 py-1.5 rounded-full text-xs font-medium mb-5">
            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" />
            Designed for Modern Healthcare
          </motion.div>
          <h2 className="text-3xl font-sora font-semibold text-center mb-2 tracking-tight">Our Procurement Wizard</h2>
          <p className="text-slate-600 text-center mb-12 max-w-lg mx-auto">
            Powerful tools that bridge the gap between complex pharmaceutical supply chains and clinical excellence.
          </p>

          <h2 className="text-3xl font-sora font-semibold text-center mb-2 tracking-tight">
          </h2>


        </div>

        {/* Desktop View: Alternating Rows */}
        <div className="hidden md:flex flex-col gap-32">
          {FEATURES.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className={`relative flex items-center gap-16 ${index % 2 === 1 ? "flex-row-reverse" : "flex-row"
                }`}
            >

              {/* <div className={`opacity-40 top-30 absolute w-14 h-14 rounded-2xl ${feature.color} text-white flex items-center justify-center shadow-lg shadow-blue-500/20`}>
                {feature.icon}
              </div> */}

              {/* Text Side */}
              <div className="z-40 flex-1 space-y-6">
                <div className={`w-14 h-14 md:hidden rounded-2xl ${feature.color} text-white flex items-center justify-center shadow-lg shadow-blue-500/20`}>
                  {feature.icon}
                </div>
                <div className="relative flex text-4xl font-sora font-semibold text-slate-900 tracking-tight">
                  <h3 className="flex text-4xl font-sora font-semibold text-slate-900 tracking-tight">
                    {feature.title}
                  </h3>

                  <div className={`opacity-85 z-10 top-30 p-4 w-fit h-fit rounded-2xl ${feature.color} text-white flex items-center justify-center shadow-lg shadow-blue-500/20`}>
                    {feature.icon}
                  </div>
                </div>
                <p className="text-lg text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
                <button onClick={() => { }} className="inline-flex items-center gap-2 text-blue-600 font-bold hover:gap-3 transition-all">
                  Learn more about {feature.title.split(' ')[0]} <span>&rarr;</span>
                </button>
              </div>

              {/* Image Side */}
              <div className="flex-1 relative">
                <div className="absolute inset-0 bg-blue-600/5 -rotate-3 rounded-[3rem] transition-transform group-hover:rotate-0 duration-500" />
                <img
                  src={feature.image}
                  referrerPolicy="no-referrer"
                  alt={feature.title}
                  className="relative z-10 w-full aspect-[4/3] object-cover rounded-[2.5rem] shadow-2xl border-4 border-white"
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile View: Swipable Horizontal Container */}
        <div className="md:hidden">
          <div
            className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar gap-6 pb-8 -mx-4 px-4"
          >
            {FEATURES.map((feature) => (
              <div
                key={feature.id}
                className="min-w-[85%] snap-center flex flex-col bg-slate-50 rounded-3xl p-6 border border-slate-100"
              >
                <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-6">
                  <Image
                    src={feature.image}
                    referrerPolicy="no-referrer"
                    alt={feature.title}
                    className="w-full h-full object-cover"
                    width={80}
                    height={1200}
                    unoptimized
                    priority
                  />
                </div>
                <div className={`w-10 h-10 rounded-xl ${feature.color} text-white flex items-center justify-center mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed mb-6">{feature.description}</p>
                <button className="mt-auto text-blue-600 font-bold text-left">
                  Details &rarr;
                </button>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-2 mt-4">
            {FEATURES.map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all ${i === 0 ? 'w-8 bg-blue-600' : 'w-2 bg-slate-300'}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
