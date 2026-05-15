"use client";
import { BlogSection } from "@/components/BlogSection/BlogSection";
import { CtaSection } from "@/components/CallToAction/CallToAction";
import { FaqSection } from "@/components/FAQ/FAQ";
import { FeatureSection } from "@/components/Feactures/FeaturesSection";
import { Footer } from "@/components/Footer/Footer";
import Hero from "@/components/HeroSection/Hero";
import { LogoCloud } from "@/components/LogoCloud/LogoCloud";
import Navbar from "@/components/Navbar/Navbar";
import { StatsSection } from "@/components/StatsSection/StatsSection";
import TestimonialSection from "@/components/Testimonial/Testimonial";
import { ValuePropSection } from "@/components/ValuePropsSection/ValueProps";
import Link from "next/link";
import { motion } from "framer-motion"
import { Star } from "@phosphor-icons/react";
import ComplianceSection from "@/components/ComplianceBlock/ComplianceBlock";
import Testimonial from "@/components/Testimonial/Testimonial";



const RoleCard = ({ emoji, title, desc, bg, color, linkUrl }: { emoji: string, title: string, desc: string, bg: string, color: string, linkUrl: string }) => (
   <Link href={linkUrl} className="p-7 rounded-2xl border border-slate-200 text-center cursor-pointer hover:border-blue-500 hover:shadow-lg transition-all group">
      <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl mx-auto mb-4 ${bg}`}>
         {emoji}
      </div>
      <h3 className="font-sora font-semibold text-[15px] mb-2">{title}</h3>
      <p className="text-xs text-slate-600 mb-4">{desc}</p>
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-medium ${color}`}>
         Preview Dashboard →
      </span>
   </Link>
);

export default function HomePage() {
   return (
      <div className="bg-slate-50 min-h-screen text-slate-900 font-dm-sans">
         <Navbar />

         <Hero />
         <section className="hidden  pt-36 pb-20 px-6 max-w-7xl mx-auto  md:grid-cols-2 gap-16 items-center">
            <div>
               <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 border border-blue-200 px-4 py-1.5 rounded-full text-xs font-medium mb-5">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" />
                  Verification-Based B2B Platform
               </div>
               <h1 className="text-5xl font-sora font-semibold leading-tight tracking-tight mb-5">
                  The Trusted <span className="text-blue-600">Pharmaceutical</span> B2B Marketplace
               </h1>
               <p className="text-lg text-slate-600 leading-relaxed mb-8 max-w-md">
                  Connect verified pharmaceutical suppliers with licensed buyers through a secure, pharmacist-verified transaction workflow.
               </p>
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
         </section>

         <StatsSection />

         <LogoCloud />


         {/* FEATURES SECTION */}
         <ValuePropSection />


         <FeatureSection />

         {/* ROLES SECTION */}
         <section className="hidden bg-white border-y border-slate-200">
            <div className="py-20 px-6 max-w-7xl mx-auto">
               <div className="flex flex-col items-center text-center mb-2 lg:mb-5">
                  <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-xs font-medium mx-auto mb-4 border border-blue-200">
                     Users Roles
                  </div>
                  <h2 className="w-11/12 mx-auto text-2xl sm:text-3xl font-sora font-semibold text-center mb-2 tracking-tight">            Trusted by Healthcare Professionals</h2>
                  <p className="text-slate-600 text-center mb-12 max-w-lg mx-auto">Tap a role to preview the dashboard experience</p>

               </div>

               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <RoleCard emoji="🛒" title="Buyer" desc="Browse and order from verified suppliers." bg="bg-blue-50" color="bg-blue-50 text-blue-600" linkUrl="/buyer" />
                  <RoleCard emoji="🏭" title="Supplier" desc="Manage inventory and confirm orders." bg="bg-green-50" color="bg-green-50 text-green-600" linkUrl="/supplier" />
                  <RoleCard emoji="💊" title="Pharmacist" desc="Inspect and verify every order." bg="bg-amber-50" color="bg-amber-50 text-amber-800" linkUrl="/pharmacist" />
                  <RoleCard emoji="⚙️" title="Admin" desc="Manage the entire platform ecosystem." bg="bg-violet-50" color="bg-violet-50 text-violet-600" linkUrl="/admin" />
               </div>
            </div>
         </section>
         <ComplianceSection />
         {/* <Testimonial /> */}
         <TestimonialSection />
         <BlogSection />
         <FaqSection />
         <CtaSection />


         {/* FOOTER */}
         <Footer />
      </div>
   );
}
