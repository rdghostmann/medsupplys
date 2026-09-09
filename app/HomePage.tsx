"use client";

import { FaqSection } from "@/components/FAQ/FAQ";
import { LogoCloud } from "@/components/LogoCloud/LogoCloud";
import Navbar from "@/components/Navbar/Navbar";
import TestimonialSection from "@/components/Testimonial/Testimonial";

import ComplianceSection from "@/components/ComplianceBlock/ComplianceBlock";
import Image from "next/image";
import { StatCard } from "@/components/ui/StatCard";
import {
   ShieldCheck,
   ArrowRight,
   Package,
   Building2,
   Users,
   CheckCircle2,
   Clock,
   ChevronRight,
} from 'lucide-react';
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useRouter } from "next/navigation";
import Services from "@/components/ui/ServiceCard";
import { ProcurementWorkflow } from "@/components/ui/ProcurementWorkflow";
import { CTASection } from "@/components/ui/CTASection";
import Footer from "@/components/Footer/Footer";
import HeroSection from "@/components/HeroSection/HeroSection";
import { StarAndCrescentIcon } from "@phosphor-icons/react";


export default function HomePage() {
   const router = useRouter();
   return (
      <div className="bg-slate-50 min-h-screen text-slate-900 font-dm-sans">

         <Navbar />

         {/* <Hero /> */}

         <HeroSection />

         <LogoCloud />

         {/* STATS SECTION */}
         <section className="py-16 sm:py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <SectionHeader
                  badge="Platform Metrics"
                  title="Enterprise Healthcare Procurement Scale"
                  subtitle="Powering verified drug supplies across tertiary teaching hospitals, private clinic groups, and state healthcare networks."
               />

               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
                  <StatCard
                     label="Verified Products"
                     value="1,500+"
                     subtext="National drug formulary"
                     icon={Package}
                     highlight={true}
                  />
                  <StatCard
                     label="Verified Suppliers"
                     value="250+"
                     subtext="Importers &amp; Distributors"
                     icon={Building2}
                     trend="+18% MoM"
                  />
                  <StatCard
                     label="Healthcare Buyers"
                     value="1,000+"
                     subtext="Hospitals &amp; Clinics"
                     icon={Users}
                  />
                  <StatCard
                     label="Order Fulfillment"
                     value="98.4%"
                     subtext="On-time delivery rate"
                     icon={CheckCircle2}
                     trend="99.7% Cold"
                  />
                  <StatCard
                     label="Procurement Access"
                     value="24/7"
                     subtext="Real-time ordering portal"
                     icon={Clock}
                  />
                  <StatCard
                     label="Years of Service"
                     value="5+"
                     subtext="Trusted by healthcare providers"
                     icon={StarAndCrescentIcon}
                  />
               </div>
            </div>
         </section>

         {/* SERVICES SECTION */}
         <section className="py-16 sm:py-24 bg-slate-50/60 border-t border-slate-200/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <SectionHeader
                  badge="Core Solutions"
                  title="Everything You Need to Procure Smarter"
                  subtitle="A comprehensive pharmaceutical supply chain infrastructure engineered for transparency, regulatory compliance, and cost containment."
               />

               <div className="">
                  <Services />
               </div>

               <div className="mt-12 text-center">
                  <button
                     onClick={() => router.push('/services')}
                     className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-linear-to-r from-[#1e40af] to-[#00b87c] hover:from-[#1d4ed8] hover:to-[#059669] text-white font-bold text-xs shadow-md shadow-blue-700/15 transition-all cursor-pointer"
                  >
                     <span>Explore All 10 Enterprise Procurement Services</span>
                     <ChevronRight size={14} />
                  </button>
               </div>
            </div>
         </section>

         {/* HOW IT WORKS SECTION */}
         <section className="py-16 sm:py-24 bg-white border-t border-slate-200/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <SectionHeader
                  badge="Procurement Lifecycle"
                  title="How Pharmaceutical Procurement Works"
                  subtitle="From formulary drug search to multi-quote comparison, digital PO transmission, and verified cold-chain handover."
               />

               <ProcurementWorkflow />
            </div>
         </section>


         {/* WHY MEDSUPPLY SECTION - REFACTORED TO WHITE / LIGHT SOPHISTICATED THEME */}
         <section className="py-16 sm:py-24 bg-linear-to-b from-white to-slate-50/80 border-t border-slate-200/80 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
               <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                  <div className="lg:col-span-7">
                     <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-xs font-semibold uppercase tracking-wider mb-5">
                        <ShieldCheck size={14} className="text-emerald-600" />
                        Institutional Superiority
                     </div>

                     <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                        Built Around the Way Healthcare Procurement Actually Works
                     </h2>

                     <p className="mt-4 text-base text-slate-600 leading-relaxed">
                        Traditional hospital drug procurement is crippled by opaque pricing, fragmented telephone quotes, unverified suppliers, and paper tracking. MedSupply eliminates these vulnerabilities with an automated, compliance-first B2B enterprise platform.
                     </p>

                     <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                           { title: 'Verified Supplier Network', desc: '100% NAFDAC & PCN audited premises with certified GDP cold-chain controls.' },
                           { title: 'Transparent Line-Item Pricing', desc: 'Real-time multi-supplier quote comparison without broker markups or hidden fees.' },
                           { title: 'Faster Procurement Turnaround', desc: 'Cut requisition-to-delivery lead times from weeks to under 48 hours.' },
                           { title: 'Centralized Order Management', desc: 'Institutional purchase approvals, delivery tracking, and VAT invoices in one hub.' },
                           { title: 'Pharmaceutical Compliance', desc: 'Digital Certificates of Analysis (CoA) and batch traceability attached to every PO.' },
                           { title: 'Real-Time Telemetry Visibility', desc: 'GPS vehicle tracking and calibrated cold-chain temperature sensor oversight.' },
                        ].map((item, i) => (
                           <div key={i} className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-blue-400 hover:shadow-md transition-all flex items-start gap-3">
                              <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                              <div>
                                 <h4 className="font-bold text-xs text-slate-900">{item.title}</h4>
                                 <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{item.desc}</p>
                              </div>
                           </div>
                        ))}
                     </div>

                     <div className="mt-8 flex items-center gap-4">
                        <button
                           onClick={() => router.push('/why-medsupply')}
                           className="px-6 py-3 rounded-xl bg-linear-to-r from-[#1e40af] to-[#00b87c] hover:from-[#1d4ed8] hover:to-[#059669] text-white font-bold text-xs shadow-md shadow-blue-700/15 transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                           <span>Read Full Comparison Analysis</span>
                           <ArrowRight size={14} />
                        </button>
                     </div>
                  </div>

                  <div className="lg:col-span-5 relative">
                     <div className="relative rounded-2xl overflow-hidden border border-slate-200/90 shadow-xl bg-white p-2">
                        <Image
                           src="/professional-healthcare-procurement-team-reviewing-pharmaceutical-supplies.png"
                           alt="Professional healthcare procurement team reviewing pharmaceutical supplies"
                           width={1000}
                           height={667}
                           className="w-full h-115 object-cover rounded-xl"
                        />
                        <div className="absolute inset-2 rounded-xl bg-linear-to-t from-slate-950/85 via-slate-950/20 to-transparent pointer-events-none" />
                        <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200 text-xs shadow-xl">
                           <div className="flex items-center gap-2 mb-1">
                              <Image
                                 src="/logo.png"
                                 alt="MedSupply Logo"
                                 width={20}
                                 height={20}
                              />
                              <span className="font-bold text-slate-900 block">Hospital Procurement Committee Review</span>
                           </div>
                           <q className="text-slate-600 mt-1 text-[11px] leading-relaxed">
                              MedSupplys multi-supplier price audit logs simplified our quarterly clinical board review by providing transparent, tamper-proof cost comparisons.
                           </q>
                        </div>
                     </div>
                  </div>

               </div>
            </div>
         </section>



         <ComplianceSection />
         {/* <Testimonial /> */}
         <TestimonialSection />
         {/* <BlogSection /> */}
         <FaqSection />

         {/* CALL TO ACTION */}
         <CTASection />
         {/* FOOTER */}
         <Footer />
      </div>
   );
}
