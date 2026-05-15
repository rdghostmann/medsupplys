// import { ArrowRight } from "lucide-react"
import { ArrowRight } from "@phosphor-icons/react"
import { motion } from "framer-motion"


import Image from "next/image"

interface BlogPost {
  title: string
  date: string
  excerpt?: string
  image: string
  gradient: string
}

const FEATURED_POSTS: BlogPost[] = [
  {
    title:
      "Top 5 Tips for Choosing the Right Pharmaceutical Supplier",

    date: "Aug 11, 2025",

    excerpt:
      "In today's fast-paced healthcare market, it's essential to stay informed and partner with verified, licensed suppliers that meet quality standards…",

    image:
      "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?q=80&w=1200&auto=format&fit=crop",

    gradient:
      "from-blue-100 via-cyan-100 to-sky-200",
  },

  {
    title:
      "Essential Advice for Navigating B2B Pharmaceutical Procurement",

    date: "Aug 21, 2025",

    excerpt:
      "Understanding the verification workflow and escrow payment system helps hospitals reduce counterfeit risk and improve supply chain reliability…",

    image:
      "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1200&auto=format&fit=crop",

    gradient:
      "from-emerald-100 via-teal-100 to-cyan-200",
  },
]

const SIDEBAR_POSTS: BlogPost[] = [
  {
    title:
      "Considerations for Finding the Right Pharmacy Partner for Your Hospital",

    date: "Aug 5, 2025",

    image:
      "https://images.unsplash.com/photo-1580281657527-47f249e8f4df?q=80&w=800&auto=format&fit=crop",

    gradient:
      "from-amber-100 via-orange-100 to-yellow-200",
  },

  {
    title:
      "Important Factors to Keep in Mind When Choosing a Pharmaceutical Distributor",

    date: "Aug 23, 2025",

    image:
      "https://images.unsplash.com/photo-1581093458791-9d09d5b1e1b6?q=80&w=800&auto=format&fit=crop",

    gradient:
      "from-violet-100 via-fuchsia-100 to-purple-200",
  },

  {
    title:
      "Smart Strategies for Locating Your Ideal Pharmaceutical Supply Source",

    date: "Aug 21, 2025",

    image:
      "https://images.unsplash.com/photo-1585435557343-3b092031d4f7?q=80&w=800&auto=format&fit=crop",

    gradient:
      "from-pink-100 via-rose-100 to-red-200",
  },
]

export function BlogSection() {
  return (
    <section
      className="
        overflow-hidden
        bg-slate-50
        py-24
      "
      id="blog-section"
    >
      <div
        className="
          mx-auto
          max-w-7xl
          px-4
          sm:px-6
          lg:px-8
        "
      >
        {/* ==================================================
            HEADER
        ================================================== */}

        <div
          className="
            mb-12
            flex
            flex-col
            gap-6
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 border border-blue-200 px-4 py-1.5 rounded-full text-xs font-medium mb-5">
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" />
              MedSupply Insight
            </motion.div>

            <h2
              className="
                text-3xl
                font-semibold
                font-sora
                tracking-tight
                text-slate-900
                lg:text-4xl
              "
            >
              Our Latest Blog Posts
            </h2>
          </div>

          <button
            className="
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-slate-200
              bg-white
              px-6
              py-3
              text-sm
              font-semibold
              text-slate-700
              shadow-sm
              transition-all
              hover:border-slate-300
              hover:bg-slate-100
            "
          >
            See all blogs

            <ArrowRight size={16} />
          </button>
        </div>

        {/* ==================================================
            GRID
        ================================================== */}

        <div className="grid gap-8 lg:grid-cols-12">
          {/* ==================================================
              FEATURED POSTS
          ================================================== */}

          <div
            className="
              grid
              gap-8
              md:grid-cols-2
              lg:col-span-8
            "
          >
            {FEATURED_POSTS.map(
              (post, idx) => (
                <article
                  key={idx}
                  className="
                    group
                    overflow-hidden
                    rounded-[2rem]
                    border
                    border-slate-200
                    bg-white
                    shadow-sm
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:shadow-2xl
                  "
                >
                  {/* IMAGE */}

                  <div className="relative h-64 overflow-hidden">
                    <div
                      className={`
                        absolute
                        inset-0
                        z-10
                        bg-linear-to-br
                        ${post.gradient}
                        opacity-20
                      `}
                    />

                    <div
                      className="
                        absolute
                        inset-0
                        z-20
                        bg-linear-to-t
                        from-slate-950/70
                        via-slate-900/10
                        to-transparent
                      "
                    />

                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      priority={idx === 0}
                      referrerPolicy="no-referrer"
                      className="
                        object-cover
                        transition-transform
                        duration-700
                        group-hover:scale-105
                      "
                    />

                    {/* DATE */}

                    <div
                      className="
                        absolute
                        bottom-4
                        left-4
                        z-30
                        rounded-full
                        bg-white/90
                        px-3
                        py-1
                        text-xs
                        font-bold
                        text-slate-700
                        backdrop-blur
                      "
                    >
                      {post.date}
                    </div>
                  </div>

                  {/* CONTENT */}

                  <div className="flex flex-1 flex-col p-8">
                    <h3
                      className="
                        mb-4
                        text-2xl
                        font-semibold
                        font-sora
                        leading-tight
                        tracking-tight
                        text-slate-900
                        transition-colors
                        group-hover:text-blue-600
                      "
                    >
                      {post.title}
                    </h3>

                    <p
                      className="
                        mb-6
                        leading-relaxed
                        text-slate-600

                      "
                    >
                      {post.excerpt}
                    </p>

                    <div className="mt-auto">
                      <span
                        className="
                          inline-flex
                          items-center
                          gap-2
                          text-sm
                          font-bold
                          text-slate-900
                          transition-all
                          group-hover:gap-3
                          group-hover:text-blue-600
                        "
                      >
                        Read more

                        <ArrowRight
                          size={16}
                        />
                      </span>
                    </div>
                  </div>
                </article>
              )
            )}
          </div>

          {/* ==================================================
              SIDEBAR POSTS
          ================================================== */}

          <div
            className="
              flex
              flex-col
              gap-5
              lg:col-span-4
            "
          >
            {SIDEBAR_POSTS.map(
              (post, idx) => (
                <article
                  key={idx}
                  className="
                    group
                    flex
                    gap-4
                    rounded-3xl
                    border
                    border-slate-200
                    bg-white
                    p-4
                    shadow-sm
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:shadow-lg
                  "
                >
                  {/* THUMBNAIL */}

                  <div
                    className="
                      relative
                      h-24
                      w-24
                      shrink-0
                      overflow-hidden
                      rounded-2xl
                    "
                  >
                    <div
                      className={`
                        absolute
                        inset-0
                        z-10
                        bg-linear-to-br
                        ${post.gradient}
                        opacity-20
                      `}
                    />

                    <div
                      className="
                        absolute
                        inset-0
                        z-20
                        bg-linear-to-t
                        from-slate-950/50
                        via-transparent
                        to-transparent
                      "
                    />

                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      referrerPolicy="no-referrer"
                      className="
                        object-cover
                        transition-transform
                        duration-700
                        group-hover:scale-110
                      "
                    />
                  </div>

                  {/* CONTENT */}

                  <div
                    className="
                      flex
                      flex-1
                      flex-col
                      justify-center
                    "
                  >
                    <span
                      className="
                        mb-2
                        text-xs
                        font-bold
                        uppercase
                        tracking-wide
                        text-blue-600
                      "
                    >
                      {post.date}
                    </span>

                    <h4
                      className="
                        line-clamp-3
                        text-sm
                        font-bold
                        leading-relaxed
                        text-slate-900
                        transition-colors
                        group-hover:text-blue-600
                      "
                    >
                      {post.title}
                    </h4>
                  </div>
                </article>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  )
}