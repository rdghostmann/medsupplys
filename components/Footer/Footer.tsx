// components/layout/Footer.tsx
"use client"

import Link from "next/link"
import {
  Asclepius,
  InstagramLogo,
  MessengerLogo,
  WhatsappLogo,
  XLogo,
} from "@phosphor-icons/react/dist/ssr"
import Image from "next/image"

const socialLinks = [
  {
    label: "X (Twitter)",
    href: "https://x.com",
    icon: XLogo,
  },
  {
    label: "Facebook",
    href: "https://facebook.com",
    icon: MessengerLogo,
  },
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: InstagramLogo,
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/2348000000000",
    icon: WhatsappLogo,
  },
]

const footerSections = [
  {
    title: "Company",
    links: [
      { label: "About MedSupply", href: "/about" },
      { label: "How It Works", href: "/how-it-works" },
      // { label: "Careers", href: "/careers" },
      // { label: "Press & Media", href: "/press" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    title: "For Buyers",
    links: [
      { label: "Create Account", href: "/register" },
      { label: "Browse Catalog", href: "/catalog" },
      { label: "Track an Order", href: "/track-order" },
      { label: "Buyer FAQs", href: "/faqs/buyers" },
      { label: "Procurement Guide", href: "/procurement-guide" },
    ],
  },
  {
    title: "For Suppliers",
    links: [
      { label: "Apply as Supplier", href: "/become-supplier" },
      { label: "Supplier Dashboard", href: "/supplier/dashboard" },
      { label: "Pricing & Commission", href: "/supplier/pricing" },
      { label: "Verification Process", href: "/verification-process" },
      { label: "Supplier FAQs", href: "/faqs/suppliers" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms of Service", href: "/terms-of-service" },
      { label: "Cookie Policy", href: "/cookie-policy" },
      { label: "NAFDAC Compliance", href: "/compliance" },
      { label: "Contact Support", href: "/support" },
    ],
  },
]

export function Footer() {
  return (
    <footer
      id="site-footer"
      className="border-t border-slate-800 bg-slate-950 text-slate-300"
    >
      <div className="mx-auto max-w-7xl px-4 pt-20 pb-10 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="grid grid-cols-1 gap-14 md:grid-cols-2 lg:grid-cols-12 lg:gap-10">
          {/* Brand */}
          <div className="space-y-8 lg:col-span-4">
            <Link
              href="/"
              className="group inline-flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                <Image
                  src="/logo-footer.png"
                  width={36}
                  height={36}
                  alt="Logo"
                  className="w-full h-full object-cover"
                  unoptimized
                  priority
                />
              </div>

              <div>
                <h2 className="text-xl font-bold tracking-tight text-white">
                  MedSupply
                </h2>
                <p className="text-xs text-slate-500">
                  Verification-First Pharma Marketplace
                </p>
              </div>
            </Link>

            <p className="max-w-md text-sm leading-7 text-slate-400">
              Africa&apos;s verification-first pharmaceutical B2B marketplace.
              Connecting licensed buyers with verified suppliers through a
              secure, pharmacist-approved procurement workflow.
            </p>

            {/* Socials */}
            <div className="flex flex-wrap items-center gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon

                return (
                  <Link
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="group flex h-11 w-11 items-center justify-center rounded-full border border-slate-800 bg-slate-900/60 transition-all duration-300 hover:-translate-y-1 hover:border-slate-700 hover:bg-slate-800 hover:text-white"
                  >
                    <Icon
                      size={18}
                      weight="fill"
                      className="transition-transform duration-300 group-hover:scale-110"
                    />
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div
              key={section.title}
              className="space-y-6 lg:col-span-2"
            >
              <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-white">
                {section.title}
              </h4>

              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm font-medium text-slate-400 transition-colors duration-200 hover:text-blue-400"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-5 border-t border-slate-800 pt-8 md:flex-row">
          <p className="text-center text-sm text-slate-500 md:text-left">
            © {new Date().getFullYear()} MedSupply Technologies Ltd
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            <Link
              href="/privacy-policy"
              className="transition-colors hover:text-white"
            >
              Privacy
            </Link>

            <Link
              href="/terms-of-service"
              className="transition-colors hover:text-white"
            >
              Terms
            </Link>

            <Link
              href="/cookie-policy"
              className="transition-colors hover:text-white"
            >
              Cookies
            </Link>

            <Link
              href="/accessibility"
              className="transition-colors hover:text-white"
            >
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}