"use client"
import { motion } from "framer-motion";
import { Star, MessageSquare, Quote } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
  initials: string;
  featured?: boolean;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    initials: "EO",
    name: "Emeka Okonkwo",
    role: "Procurement Lead · Lagos General Hospital",
    quote: "MedSupply completely transformed how we source medications. The pharmacist verification step gives us full confidence that every batch we receive is genuine and within expiry.",
    rating: 5,
  },
  {
    id: "2",
    initials: "CN",
    name: "Chidi Nwosu",
    role: "Head of Pharmacy · Eko Hospitals Group",
    quote: "The AI supplier matching engine is a game-changer. It ranks suppliers by price, stock availability, and type — we always get the best deal without spending hours comparing quotes manually.",
    rating: 5,
    featured: true,
  },
  {
    id: "3",
    initials: "NG",
    name: "Ngozi Eze",
    role: "Director · PharmaCorp Nigeria Ltd.",
    quote: "As an importer, MedSupply gives us direct access to verified buyers. The escrow model means we get paid on time, every time — right after the pharmacist confirms our products are legit.",
    rating: 5,
  },
  {
    id: "4",
    initials: "FA",
    name: "Femi Adeyemi",
    role: "Pharmacy Manager · Reddington Hospital",
    quote: "The split fulfillment feature saved our supply chain when one supplier had partial stock. The platform automatically sourced the remainder from a secondary supplier — completely seamless.",
    rating: 4,
  },
  {
    id: "5",
    initials: "AO",
    name: "Adaeze Obi, PharmD",
    role: "Lead Pharmacist · MedSupply Verification Office",
    quote: "Verifying batches used to take our team all day. With the barcode scan workflow on MedSupply, I can process an entire shipment in under 30 minutes. The queue management is excellent.",
    rating: 5,
  },
  {
    id: "6",
    initials: "KA",
    name: "Kunle Abiola",
    role: "Owner · MedCo Supplies Ltd.",
    quote: "Getting approved as a supplier was fast and professional. The onboarding team walked us through everything. Within a week we had our first confirmed order and payment released.",
    rating: 5,
  },
];

export default function TestimonialSection() {
  // Triple the list for smooth infinite scroll
  const scrollItems = [...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <section className="py-24 bg-white overflow-hidden" id="testimonials-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold mb-6 shadow-sm hover:scale-105 transition-transform cursor-default">
            <MessageSquare size={16} />
            <span>What Our Users Say</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-6">
            Trusted by Healthcare Professionals
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            From hospital procurement teams to licensed distributors — real stories from the MedSupply community.
          </p>
        </div>
      </div>

      {/* Interactive Auto-scrolling Carousel */}
      <div className="relative group">
        {/* Fade Edges overlay */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-linear-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-linear-to-l from-white to-transparent z-10 pointer-events-none" />

        <div className="flex overflow-hidden">
          <motion.div
            className="flex gap-6 py-8 px-4"
            animate={{
              x: ["0%", "-33.33%"],
            }}
            transition={{
              duration: 40,
              ease: "linear",
              repeat: Infinity,
            }}
            whileHover={{ animationPlayState: "paused" }}
          >
            {scrollItems.map((testimonial, idx) => (
              <div
                key={`${testimonial.id}-${idx}`}
                className={`
                  w-[85vw] sm:w-[45vw] lg:w-[30vw] shrink-0 
                  relative p-8 rounded-3xl border-2 transition-all duration-500
                  ${
                    testimonial.featured
                      ? "bg-blue-600 border-blue-500 text-white shadow-2xl shadow-blue-500/20 translate-y-2]"
                      : "bg-slate-50 border-slate-100 text-slate-900 hover:bg-white hover:border-blue-100 hover:shadow-xl hover:-translate-y-2"
                  }
                `}
              >
                {testimonial.featured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white text-blue-600 border border-blue-200 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
                    ⭐ Top Rated
                  </div>
                )}

                <div className="flex gap-1 mb-6">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={
                        i < testimonial.rating
                          ? testimonial.featured
                            ? "fill-white text-white"
                            : "fill-amber-400 text-amber-400"
                          : "text-slate-300"
                      }
                    />
                  ))}
                </div>

                <div className="relative mb-8">
                  <Quote 
                    className={`absolute -top-2 -left-2 w-8 h-8 opacity-10 ${testimonial.featured ? 'text-white' : 'text-blue-600'}`} 
                  />
                  <p className="text-lg font-medium leading-relaxed italic relative z-10">
                    "{testimonial.quote}"
                  </p>
                </div>

                <div className="flex items-center gap-4 mt-auto">
                  <div 
                    className={`
                      w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-colors
                      ${
                        testimonial.featured
                          ? "bg-white/20 text-white border border-white/30"
                          : "bg-blue-50 text-blue-700 border border-blue-100 group-hover:bg-blue-100 group-hover:text-blue-800"
                      }
                    `}
                  >
                    {testimonial.initials}
                  </div>
                  <div>
                    <div className={`font-bold ${testimonial.featured ? "text-white" : "text-slate-900"}`}>
                      {testimonial.name}
                    </div>
                    <div className={`text-xs ${testimonial.featured ? "text-blue-100" : "text-slate-500"}`}>
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
