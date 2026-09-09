// components/Footer/Footer.tsx

import Link from "next/link";
import { MedSupplyLogo } from "../ui/MedSupplyLogo";
import { ShieldCheck, Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative border-t border-slate-200 bg-white text-slate-900">
      {/* Decorative Brand Gradient Bar */}
      <div className="h-1.5 w-full bg-linear-to-r from-[#1e40af] via-[#0284c7] to-[#00b87c]" />

      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5 lg:gap-8">
          
          {/* =========================================================
              Column 1: Brand & Identity
          ========================================================= */}
          <div className="space-y-4 lg:col-span-2">
            <Link
              href="/"
              aria-label="MedSupply Home"
              className="inline-block rounded-md text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
            >
              <MedSupplyLogo
                variant="horizontal"
                size="lg"
                showTagline={true}
              />
            </Link>

            <p className="max-w-sm pt-1 text-xs leading-relaxed text-slate-600">
              Modernizing pharmaceutical procurement and institutional
              verification through intelligent technology, audited
              transparency, and trusted supplier networks.
            </p>

            {/* Trust / Contact Information */}
            <div className="space-y-2.5 pt-2 text-xs text-slate-600">
              {/* Compliance */}
              <div className="flex items-center gap-2.5">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-700">
                  <ShieldCheck size={13} />
                </div>

                <span>
                  Good Distribution Practice (GDP) &amp; NAFDAC Verified
                  Network
                </span>
              </div>

              {/* Location */}
              <div className="flex items-center gap-2.5">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  <MapPin size={13} />
                </div>

                <span>
                  HQ Hub: Victoria Island, Lagos &bull; National Cold-Chain
                  Depots
                </span>
              </div>

              {/* Email */}
              <div className="flex items-center gap-2.5">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-700">
                  <Mail size={13} />
                </div>

                <a
                  href="mailto:procure@medsupply.healthcare"
                  className="transition-colors hover:text-blue-700"
                >
                  procure@medsupply.healthcare
                </a>
              </div>
            </div>
          </div>

          {/* =========================================================
              Column 2: Platform
          ========================================================= */}
          <div>
            <h4 className="mb-4 border-b border-slate-100 pb-1 text-xs font-bold uppercase tracking-wider text-slate-900">
              Platform
            </h4>

            <ul className="space-y-2.5 text-xs text-slate-600">
              <li>
                <Link
                  href="/"
                  className="transition-colors hover:text-blue-700"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  href="/services"
                  className="transition-colors hover:text-blue-700"
                >
                  Services
                </Link>
              </li>

              <li>
                <Link
                  href="/features"
                  className="transition-colors hover:text-blue-700"
                >
                  Features
                </Link>
              </li>

              <li>
                <Link
                  href="/how-it-works"
                  className="transition-colors hover:text-blue-700"
                >
                  How It Works
                </Link>
              </li>

              <li>
                <Link
                  href="/why-medsupply"
                  className="transition-colors hover:text-blue-700"
                >
                  Why MedSupply
                </Link>
              </li>

              <li>
                <Link
                  href="/privacy-policy"
                  className="transition-colors hover:text-blue-700"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-conditions"
                  className="transition-colors hover:text-blue-700"
                >
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* =========================================================
              Column 3: For Healthcare
          ========================================================= */}
          <div>
            <h4 className="mb-4 border-b border-slate-100 pb-1 text-xs font-bold uppercase tracking-wider text-slate-900">
              For Healthcare
            </h4>

            <ul className="space-y-2.5 text-xs text-slate-600">
              <li>
                <Link
                  href="/become-a-supplier"
                  className="font-medium transition-colors hover:text-emerald-700"
                >
                  Become a Supplier
                </Link>
              </li>

              <li>
                <Link
                  href="/login"
                  className="transition-colors hover:text-blue-700"
                >
                  Supplier Portal Sign In
                </Link>
              </li>

              <li>
                <Link
                  href="/register"
                  className="transition-colors hover:text-blue-700"
                >
                  Hospital &amp; Clinic Registration
                </Link>
              </li>

              <li>
                <Link
                  href="/contact"
                  className="transition-colors hover:text-blue-700"
                >
                  Institutional Sales
                </Link>
              </li>

              <li>
                <Link
                  href="/contact"
                  className="transition-colors hover:text-blue-700"
                >
                  24/7 Clinical Emergency Line
                </Link>
              </li>
            </ul>
          </div>

          {/* =========================================================
              Column 4: Company & Compliance
          ========================================================= */}
          <div>
            <h4 className="mb-4 border-b border-slate-100 pb-1 text-xs font-bold uppercase tracking-wider text-slate-900">
              Company &amp; Audit
            </h4>

            <ul className="space-y-2.5 text-xs text-slate-600">
              <li>
                <Link
                  href="/about"
                  className="transition-colors hover:text-blue-700"
                >
                  About Us
                </Link>
              </li>

              <li>
                <Link
                  href="/contact"
                  className="transition-colors hover:text-blue-700"
                >
                  Contact
                </Link>
              </li>

              <li>
                <Link
                  href="/about"
                  className="transition-colors hover:text-blue-700"
                >
                  Regulatory Compliance &amp; PCN
                </Link>
              </li>

              <li>
                <Link
                  href="/about"
                  className="transition-colors hover:text-blue-700"
                >
                  Quality Assurance Standards
                </Link>
              </li>

              <li>
                <Link
                  href="/about"
                  className="transition-colors hover:text-blue-700"
                >
                  Terms of Sourcing &amp; Escrow
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* =========================================================
          Bottom Bar
      ========================================================= */}
      <div className="border-t border-slate-100 bg-slate-50/70 py-6 text-xs text-slate-500">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
          
          <p className="text-center sm:text-left">
            &copy; 2026{" "}
            <span className="font-bold text-slate-700">
              MedSupply
            </span>
            . All rights reserved. &bull; Enterprise pharmaceutical
            procurement &amp; verification infrastructure.
          </p>

          {/* Social / External Links */}
          <div className="flex items-center gap-4 font-medium text-slate-500">
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-blue-700"
            >
              LinkedIn
            </a>

            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-blue-700"
            >
              X / Twitter
            </a>

            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-blue-700"
            >
              HealthTech Nigeria
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;