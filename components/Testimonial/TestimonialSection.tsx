"use client"
import { motion } from "framer-motion"
import { Star, MessageSquare, Quote } from "lucide-react"

interface Testimonial {
  id: string
  name: string
  role: string
  quote: string
  rating: number
  initials: string
  featured?: boolean
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    initials: "EO",
    name: "Emeka Okonkwo",
    role: "Procurement Lead · Lagos General Hospital",
    quote:
      "MedSupply completely transformed how we source medications. The pharmacist verification step gives us full confidence that every batch we receive is genuine and within expiry.",
    rating: 5,
  },
  {
    id: "2",
    initials: "CN",
    name: "Chidi Nwosu",
    role: "Head of Pharmacy · Eko Hospitals Group",
    quote:
      "The AI supplier matching engine is a game-changer. It ranks suppliers by price, stock availability, and type — we always get the best deal without spending hours comparing quotes manually.",
    rating: 5,
    featured: true,
  },
  {
    id: "3",
    initials: "NG",
    name: "Ngozi Eze",
    role: "Director · PharmaCorp Nigeria Ltd.",
    quote:
      "As an importer, MedSupply gives us direct access to verified buyers. The escrow model means we get paid on time, every time — right after the pharmacist confirms our products are legit.",
    rating: 5,
  },
  {
    id: "4",
    initials: "FA",
    name: "Femi Adeyemi",
    role: "Pharmacy Manager · Reddington Hospital",
    quote:
      "The split fulfillment feature saved our supply chain when one supplier had partial stock. The platform automatically sourced the remainder from a secondary supplier — completely seamless.",
    rating: 4,
  },
  {
    id: "5",
    initials: "AO",
    name: "Adaeze Obi, PharmD",
    role: "Lead Pharmacist · MedSupply Verification Office",
    quote:
      "Verifying batches used to take our team all day. With the barcode scan workflow on MedSupply, I can process an entire shipment in under 30 minutes. The queue management is excellent.",
    rating: 5,
  },
  {
    id: "6",
    initials: "KA",
    name: "Kunle Abiola",
    role: "Owner · MedCo Supplies Ltd.",
    quote:
      "Getting approved as a supplier was fast and professional. The onboarding team walked us through everything. Within a week we had our first confirmed order and payment released.",
    rating: 5,
  },
]

export default function TestimonialSection() {
  // Triple the list for smooth infinite scroll
  const scrollItems = [...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS]

  return (
    <section
      className="overflow-hidden bg-white py-24"
      id="testimonials-section"
    >
      <div className="mx-auto mb-16 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mb-6 inline-flex cursor-default items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm transition-transform hover:scale-105">
            <MessageSquare size={16} />
            <span>What Our Users Say</span>
          </div>
          <h2 className="mb-6 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
            Trusted by Healthcare Professionals
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-slate-600">
            From hospital procurement teams to licensed distributors — real
            stories from the MedSupply community.
          </p>
        </div>
      </div>

      {/* Interactive Auto-scrolling Carousel */}
      <div className="group relative">
        {/* Fade Edges overlay */}
        <div className="pointer-events-none absolute top-0 bottom-0 left-0 z-10 w-24 bg-linear-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute top-0 right-0 bottom-0 z-10 w-24 bg-linear-to-l from-white to-transparent" />

        <div className="flex overflow-hidden">
          <motion.div
            className="flex gap-6 px-4 py-8"
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
                className={`relative w-[85vw] shrink-0 rounded-3xl border-2 p-8 transition-all duration-500 sm:w-[45vw] lg:w-[30vw] ${
                  testimonial.featured
                    ? "translate-y-2] border-blue-500 bg-blue-600 text-white shadow-2xl shadow-blue-500/20"
                    : "border-slate-100 bg-slate-50 text-slate-900 hover:-translate-y-2 hover:border-blue-100 hover:bg-white hover:shadow-xl"
                } `}
              >
                {testimonial.featured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full border border-blue-200 bg-white px-4 py-1 text-xs font-bold tracking-widest text-blue-600 uppercase shadow-lg">
                    ⭐ Top Rated
                  </div>
                )}

                <div className="mb-6 flex gap-1">
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
                    className={`absolute -top-2 -left-2 h-8 w-8 opacity-10 ${testimonial.featured ? "text-white" : "text-blue-600"}`}
                  />
                  <p className="relative z-10 text-lg leading-relaxed font-medium italic">
                    "{testimonial.quote}"
                  </p>
                </div>

                <div className="mt-auto flex items-center gap-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                      testimonial.featured
                        ? "border border-white/30 bg-white/20 text-white"
                        : "border border-blue-100 bg-blue-50 text-blue-700 group-hover:bg-blue-100 group-hover:text-blue-800"
                    } `}
                  >
                    {testimonial.initials}
                  </div>
                  <div>
                    <div
                      className={`font-bold ${testimonial.featured ? "text-white" : "text-slate-900"}`}
                    >
                      {testimonial.name}
                    </div>
                    <div
                      className={`text-xs ${testimonial.featured ? "text-blue-100" : "text-slate-500"}`}
                    >
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
  )
}
