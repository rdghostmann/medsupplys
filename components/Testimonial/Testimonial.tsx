// Testimonial.tsx
"use client";

import { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { Star, Quote, Building2 } from "lucide-react";

interface Testimonial {
  id: string;
  author: string;
  role: string;
  quote: string;
  rating: number;
  organization: string;
  organizationType: string;
  avatarUrl?: string;
  featured?: boolean;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "test-1",
    quote:
      "MedSupply has significantly reduced the time our procurement team spends searching for pharmaceutical suppliers. Comparing multiple verified distributor quotes in minutes has cut our procurement turnaround by over 60%.",
    author: "Dr. Chidinma Okafor, PharmD",
    role: "Director of Pharmacy & Clinical Supplies",
    organization: "Cedarcrest Hospitals Group",
    organizationType: "Multi-Center Hospital System",
    rating: 5,
    avatarUrl:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=256&q=80",
  },
  {
    id: "test-2",
    quote:
      "Having supplier comparison, batch verification, and cold-chain temperature tracking in one platform has completely transformed our procurement workflow and regulatory audit compliance.",
    author: "Babatunde Adeleke",
    role: "Chief Procurement Officer",
    organization: "MetroCare Health Network",
    organizationType: "Regional Healthcare Network",
    rating: 5,
    avatarUrl:
      "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=256&q=80",
  },
  {
    id: "test-3",
    quote:
      "As an importer of WHO-prequalified therapeutics, listing on MedSupply gave us direct structured orders from verified tertiary hospitals without payment friction or manual broker middlemen.",
    author: "Khadija Bello",
    role: "Managing Director",
    organization: "Zenith Global Healthcare Importers",
    organizationType: "Licensed Pharmaceutical Importer",
    rating: 5,
    avatarUrl:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80",
  },
];

/**
 * Generate initials from the testimonial author's name.
 */
function getInitials(name: string): string {
  const words = name
    .replace(/,/g, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 0) {
    return "MS";
  }

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
}

export default function Testimonial() {
  const controls = useAnimation();

  // Triple the list to create a seamless scrolling track.
  const scrollItems: Testimonial[] = [
    ...TESTIMONIALS,
    ...TESTIMONIALS,
    ...TESTIMONIALS,
  ];

  useEffect(() => {
    controls.start({
      x: ["0%", "-33.3333%"],
      transition: {
        duration: 40,
        ease: "linear",
        repeat: Infinity,
        repeatType: "loop",
      },
    });
  }, [controls]);

  const handleMouseEnter = () => {
    controls.stop();
  };

  const handleMouseLeave = () => {
    controls.start({
      x: ["0%", "-33.3333%"],
      transition: {
        duration: 40,
        ease: "linear",
        repeat: Infinity,
        repeatType: "loop",
      },
    });
  };

  return (
    <section
      id="testimonials-section"
      className="overflow-hidden bg-white py-10"
      aria-labelledby="testimonials-heading"
    >
      {/* Section Header */}
      <div className="mx-auto mb-10 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-5 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-medium text-blue-600"
          >
            <span
              className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-600"
              aria-hidden="true"
            />

            Healthcare Trust
          </motion.div>

          <motion.h2
            id="testimonials-heading"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mx-auto mb-2 w-11/12 text-center text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl"
          >
            Trusted by Directors of Pharmacy, Supply Officers & Healthcare
            Professionals
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mb-5 max-w-2xl text-center text-sm leading-relaxed text-slate-600 sm:text-base"
          >
            Hear directly from procurement leaders managing hospital
            formularies, clinic networks, and wholesale pharmaceutical
            distribution.
          </motion.p>
        </div>
      </div>

      {/* Auto-scrolling Carousel */}
      <div
        className="group relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Left Fade */}
        <div
          className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-linear-to-r from-white to-transparent sm:w-24"
          aria-hidden="true"
        />

        {/* Right Fade */}
        <div
          className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-linear-to-l from-white to-transparent sm:w-24"
          aria-hidden="true"
        />

        {/* Track */}
        <div className="flex w-full overflow-hidden">
          <motion.div
            className="flex shrink-0 gap-6 px-4 py-4"
            animate={controls}
          >
            {scrollItems.map((testimonial, index) => {
              const initials = getInitials(testimonial.author);

              return (
                <article
                  key={`${testimonial.id}-${index}`}
                  className={`
                    relative flex w-[85vw] shrink-0 flex-col
                    rounded-3xl border-2 p-6
                    transition-all duration-500
                    sm:w-[45vw] sm:p-8
                    lg:w-[30vw]
                    ${testimonial.featured
                      ? "translate-y-2 border-blue-500 bg-blue-600 text-white shadow-2xl shadow-blue-500/20"
                      : "border-slate-100 bg-slate-50 text-slate-900 hover:-translate-y-2 hover:border-blue-100 hover:bg-white hover:shadow-xl"
                    }
                  `}
                >
                  {/* Featured Badge */}
                  {testimonial.featured && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-blue-200 bg-white px-4 py-1 text-xs font-bold uppercase tracking-widest text-blue-600 shadow-lg">
                      Top Rated
                    </div>
                  )}

                  {/* Rating */}
                  <div
                    className="mb-6 flex gap-1"
                    aria-label={`${testimonial.rating} out of 5 stars`}
                  >
                    {Array.from({ length: 5 }).map((_, starIndex) => {
                      const isActive = starIndex < testimonial.rating;

                      return (
                        <Star
                          key={`${testimonial.id}-star-${starIndex}`}
                          size={18}
                          strokeWidth={1.8}
                          aria-hidden="true"
                          className={
                            isActive
                              ? testimonial.featured
                                ? "fill-white text-white"
                                : "fill-amber-400 text-amber-400"
                              : testimonial.featured
                                ? "text-blue-300"
                                : "text-slate-300"
                          }
                        />
                      );
                    })}
                  </div>

                  {/* Quote */}
                  <div className="relative mb-8">
                    <Quote
                      aria-hidden="true"
                      className={`
                        absolute -left-2 -top-2 h-8 w-8 opacity-10
                        ${testimonial.featured
                          ? "text-white"
                          : "text-blue-600"
                        }
                      `}
                    />

                    <blockquote className="relative z-10 text-base font-medium italic leading-relaxed sm:text-lg">
                      &ldquo;{testimonial.quote}&rdquo;
                    </blockquote>
                  </div>

                  {/* Organization */}
                  <div className="hidden mb-6">
                    <p
                      className={`text-xs font-semibold ${testimonial.featured
                        ? "text-blue-100"
                        : "text-blue-700"
                        }`}
                    >
                      {testimonial.organization}
                    </p>

                    <p
                      className={`mt-1 text-[11px] ${testimonial.featured
                        ? "text-blue-200"
                        : "text-slate-500"
                        }`}
                    >
                      {testimonial.organizationType}
                    </p>
                  </div>

                  {/* Author */}
                  <div className="mt-auto flex items-center gap-4">
                    {/* Avatar */}
                    {testimonial.avatarUrl ? (
                      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={testimonial.avatarUrl}
                          alt={testimonial.author}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <div
                        className={`
                          flex h-12 w-12 shrink-0 items-center justify-center
                          rounded-full border text-sm font-bold
                          ${testimonial.featured
                            ? "border-white/30 bg-white/20 text-white"
                            : "border-blue-100 bg-blue-50 text-blue-700"
                          }
                        `}
                        aria-hidden="true"
                      >
                        {initials}
                      </div>
                    )}

                    {/* Author Information */}
                    <div className="min-w-0">
                      <div
                        className={`
                          truncate text-sm font-bold
                          ${testimonial.featured
                            ? "text-white"
                            : "text-slate-900"
                          }
                        `}
                      >
                        {testimonial.author}
                      </div>

                      <div
                        className={`
                          mt-0.5 text-xs
                          ${testimonial.featured
                            ? "text-blue-100"
                            : "text-slate-500"
                          }
                        `}
                      >
                        <Building2 size={11} />

                        {testimonial.role}
                        {/* {testimonial.organization} */}

                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}