"use client"
import React, { useState } from "react"
import {
  ShieldCheck,
  Lock,
  FileText,
  Building2,
  Server,
  CheckCircle2,
  Search,
  Printer,
  ArrowRight,
  ChevronRight,
  HelpCircle,
  Database,
  UserCheck,
  Clock,
  Mail,
  Phone,
  Globe,
} from "lucide-react"

import { useRouter } from "next/navigation"

interface PolicySection {
  id: string
  title: string
  category: string
  content: React.ReactNode
}

const PrivacyPolicyPage: React.FC = () => {
  const router = useRouter()

  const [searchQuery, setSearchQuery] = useState("")
  const [activeSectionId, setActiveSectionId] = useState("scope")
  const [copiedNotification, setCopiedNotification] = useState(false)

  const handlePrint = () => {
    window.print()
  }

  const handleCopyLink = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href)
      setCopiedNotification(true)
      setTimeout(() => setCopiedNotification(false), 2500)
    }
  }

  const sections: PolicySection[] = [
    {
      id: "scope",
      title: "1. Institutional Scope & Regulatory Jurisdiction",
      category: "Foundation",
      content: (
        <div className="space-y-4 text-xs leading-relaxed text-slate-600 sm:text-sm">
          <p>
            This Privacy and Data Protection Policy governs the collection,
            processing, storage, and cross-party verification of institutional
            data across the{" "}
            <strong>MedSupply Healthcare B2B Infrastructure</strong>, operating
            in full compliance with the{" "}
            <strong>Nigeria Data Protection Act (NDPA 2023)</strong>, the{" "}
            <strong>Nigeria Data Protection Regulation (NDPR 2019)</strong>, the{" "}
            <strong>Pharmacy Council of Nigeria (PCN) Act</strong>, and the{" "}
            <strong>
              National Agency for Food and Drug Administration and Control
              (NAFDAC)
            </strong>{" "}
            Good Distribution Practices (GDP).
          </p>
          <p>
            MedSupply operates exclusively as an enterprise business-to-business
            (B2B) digital pharmaceutical marketplace connecting licensed
            healthcare institutions (including Tertiary Teaching Hospitals,
            Specialist Medical Centers, Clinical Laboratories, and Community
            Pharmacies) with accredited pharmaceutical manufacturers, importers,
            and bulk distributors.
          </p>
          <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-4 text-slate-700">
            <h5 className="mb-1 flex items-center gap-1.5 text-xs font-bold text-blue-950">
              <ShieldCheck size={16} className="text-blue-700" />
              Non-Consumer Healthcare Guarantee
            </h5>
            <p className="text-xs text-slate-600">
              MedSupply does not solicit, capture, or market to individual
              retail patients or consumers. Individual patient-identifiable
              medical charts are never ingested into the MedSupply central
              procurement directory.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "data-collected",
      title: "2. Institutional Data We Collect & Verify",
      category: "Data Ingestion",
      content: (
        <div className="space-y-4 text-xs leading-relaxed text-slate-600 sm:text-sm">
          <p>
            To uphold supply-chain integrity, prevent counterfeit drug
            proliferation, and fulfill anti-diversion statutory mandates,
            MedSupply collects and verifies the following categories of
            organizational information:
          </p>

          <div className="my-3 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
              <h5 className="mb-2 flex items-center gap-1.5 text-xs font-bold text-slate-900">
                <Building2 size={15} className="text-blue-700" />
                Institutional Identity &amp; Licensing
              </h5>
              <ul className="list-inside list-disc space-y-1 text-xs text-slate-600">
                <li>
                  Corporate Affairs Commission (CAC) incorporation certificates
                </li>
                <li>PCN Premises Inspection &amp; Annual Retention Licenses</li>
                <li>
                  Superintendent Pharmacist Annual Practicing Certificates
                </li>
                <li>
                  Hospital State Ministry of Health Operating Registrations
                </li>
              </ul>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
              <h5 className="mb-2 flex items-center gap-1.5 text-xs font-bold text-slate-900">
                <Database size={15} className="text-emerald-700" />
                Procurement &amp; Batch Telemetry
              </h5>
              <ul className="list-inside list-disc space-y-1 text-xs text-slate-600">
                <li>
                  Institutional purchase orders, RFQs, and delivery coordinates
                </li>
                <li>
                  NAFDAC registration numbers and manufacturer batch release
                  certificates
                </li>
                <li>
                  Cold-chain continuous temperature logs (2°C – 8°C IoT
                  telemetry)
                </li>
                <li>
                  Batch serialization, expiry tracking, and proof-of-delivery
                  signatures
                </li>
              </ul>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
            <h5 className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-slate-900">
              <UserCheck size={15} className="text-blue-700" />
              Designated Officer Contact &amp; Auth Credentials
            </h5>
            <p className="text-xs text-slate-600">
              Official institutional email addresses, authorized telephone
              lines, hashed passwords, cryptographic two-factor authentication
              tokens, and audit session timestamps for clinical directors and
              procurement heads.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "lawful-basis",
      title: "3. Lawful Grounds for Processing",
      category: "Legal Basis",
      content: (
        <div className="space-y-3 text-xs leading-relaxed text-slate-600 sm:text-sm">
          <p>
            Under Section 25 of the Nigeria Data Protection Act 2023, MedSupply
            processes organizational and operational data under the following
            legitimate grounds:
          </p>
          <div className="space-y-2.5">
            <div className="flex items-start gap-3 rounded-lg border border-slate-200/80 bg-slate-50 p-3">
              <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-800">
                a
              </div>
              <div>
                <strong className="text-xs text-slate-900">
                  Contractual Execution:
                </strong>{" "}
                To authenticate orders, route verified requisitions to compliant
                distributors, initiate commercial escrow settlements, and
                orchestrate physical dispatch.
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-slate-200/80 bg-slate-50 p-3">
              <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-800">
                b
              </div>
              <div>
                <strong className="text-xs text-slate-900">
                  Statutory Health Authority Mandates:
                </strong>{" "}
                To comply with mandatory pharmacovigilance logging, NAFDAC
                counterfeit tracing, and controlled medication distribution
                records required by Federal law.
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-slate-200/80 bg-slate-50 p-3">
              <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-800">
                c
              </div>
              <div>
                <strong className="text-xs text-slate-900">
                  Legitimate Supply-Chain Security:
                </strong>{" "}
                To continuously monitor anomaly patterns, protect healthcare
                providers from compromised lot distributions, and verify active
                cold-chain compliance.
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "data-custodianship",
      title: "4. Third-Party Disclosures & Accredited Custodians",
      category: "Governance",
      content: (
        <div className="space-y-4 text-xs leading-relaxed text-slate-600 sm:text-sm">
          <p>
            MedSupply strictly maintains a <strong>Zero-Sale Policy</strong>: we
            never sell, monetize, or license your institutional order histories
            or corporate credentials to third-party commercial marketing
            brokers.
          </p>
          <p>
            Information is only transferred to rigorously audited sub-processors
            strictly required to consummate your verified procurement orders:
          </p>

          <div className="space-y-3">
            <div className="rounded-xl border border-slate-200 bg-white p-3.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                <span>Accredited Cold-Chain Logistics Operators</span>
                <span className="rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                  GDP Certified
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-600">
                Shared data: Destination hospital loading dock, delivery
                receiver name, phone contact, invoice manifest, and live
                temperature sensor IDs.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-3.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                <span>
                  Central Bank of Nigeria (CBN) Licensed Escrow Partners
                </span>
                <span className="rounded-md border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
                  PCI-DSS Level 1
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-600">
                Shared data: Institutional corporate banking identifiers,
                transaction amounts, and escrow milestone release triggers.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-3.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                <span>Regulatory Bodies (NAFDAC &amp; PCN)</span>
                <span className="rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                  Statutory Obligation
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-600">
                Shared data: Batch release documentation, mandatory adverse
                event notices, and recall audit certificates in events of
                manufacturer alert notices.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "security-measures",
      title: "5. Enterprise Cryptography & Technical Safeguards",
      category: "Security",
      content: (
        <div className="space-y-3 text-xs leading-relaxed text-slate-600 sm:text-sm">
          <p>
            MedSupply employs defense-in-depth infrastructure to insulate
            healthcare commercial assets from unauthorized intercept, data
            leakage, and cryptographic compromise:
          </p>

          <div className="my-2 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
              <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-700">
                <Lock size={16} />
              </div>
              <h6 className="text-xs font-bold text-slate-900">
                TLS 1.3 Encryption
              </h6>
              <p className="mt-1 text-[11px] text-slate-500">
                All in-transit data protected by 256-bit elliptic-curve
                cryptography.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
              <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                <Server size={16} />
              </div>
              <h6 className="text-xs font-bold text-slate-900">
                AES-256 at Rest
              </h6>
              <p className="mt-1 text-[11px] text-slate-500">
                Institutional databases and audit vaults encrypted with rotating
                KMS keys.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
              <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-purple-50 text-purple-700">
                <ShieldCheck size={16} />
              </div>
              <h6 className="text-xs font-bold text-slate-900">
                Granular RBAC
              </h6>
              <p className="mt-1 text-[11px] text-slate-500">
                Role-based controls isolating buyer hospital records from
                competitor views.
              </p>
            </div>
          </div>

          <p>
            Routine penetration testing is conducted bi-annually by independent
            CREST-accredited cybersecurity auditors. Automated session timeouts
            and geo-fenced IP validation are applied to all procurement
            consoles.
          </p>
        </div>
      ),
    },
    {
      id: "retention-destruction",
      title: "6. Data Retention Schedules & Disposal",
      category: "Governance",
      content: (
        <div className="space-y-3 text-xs leading-relaxed text-slate-600 sm:text-sm">
          <p>
            In alignment with Nigerian pharmaceutical regulations, data is
            preserved in accordance with statutory minimum retention timeframes:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full overflow-hidden rounded-lg border border-slate-200 text-left text-xs">
              <thead className="bg-slate-100 font-bold text-slate-700">
                <tr>
                  <th className="p-2.5">Record Classification</th>
                  <th className="p-2.5">Mandatory Retention</th>
                  <th className="p-2.5">Regulatory Authority</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                <tr>
                  <td className="p-2.5 font-medium text-slate-900">
                    General Pharmaceutical POs &amp; Invoices
                  </td>
                  <td className="p-2.5">6 Years</td>
                  <td className="p-2.5">Federal Inland Revenue / CAC</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-medium text-slate-900">
                    Controlled Substances &amp; Schedule Requisitions
                  </td>
                  <td className="p-2.5">7 Years</td>
                  <td className="p-2.5">PCN &amp; NAFDAC Narcotics Desk</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-medium text-slate-900">
                    Cold Chain IoT Temperature Logs
                  </td>
                  <td className="p-2.5">3 Years after product expiry</td>
                  <td className="p-2.5">WHO / GDP Guidelines</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-medium text-slate-900">
                    Unsuccessful KYC Rejection Archives
                  </td>
                  <td className="p-2.5">2 Years (Anti-Fraud Register)</td>
                  <td className="p-2.5">MedSupply Compliance Audit</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-500">
            Upon expiration of statutory retention mandates, records are
            securely shredded or irreversibly obfuscated using cryptographic
            zeroization protocols.
          </p>
        </div>
      ),
    },
    {
      id: "institutional-rights",
      title: "7. Institutional Rights Under the NDPA",
      category: "Rights",
      content: (
        <div className="space-y-3 text-xs leading-relaxed text-slate-600 sm:text-sm">
          <p>
            Designated institutional representatives and superintendent
            pharmacists retain full statutory rights regarding their
            institutional records:
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-white p-3">
              <strong className="mb-1 block text-xs font-bold text-slate-900">
                Right of Rectification
              </strong>
              <span className="text-xs text-slate-600">
                Request immediate correction of outdated premises licenses,
                superintendent designations, or bank settlement coordinates.
              </span>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-3">
              <strong className="mb-1 block text-xs font-bold text-slate-900">
                Right to Data Portability
              </strong>
              <span className="text-xs text-slate-600">
                Export historic order manifests, COA batch certificates, and
                spending ledger reports in open standard formats (CSV, JSON,
                PDF).
              </span>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-3">
              <strong className="mb-1 block text-xs font-bold text-slate-900">
                Right to Audit Log Access
              </strong>
              <span className="text-xs text-slate-600">
                Inspect comprehensive timestamped access records indicating when
                authorized supplier personnel accessed quotation details.
              </span>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-3">
              <strong className="mb-1 block text-xs font-bold text-slate-900">
                Right to Lodge a Grievance
              </strong>
              <span className="text-xs text-slate-600">
                Submit formal compliance inquiries directly to the Nigeria Data
                Protection Commission (NDPC) if remedies are not resolved.
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "cookies-telemetry",
      title: "8. Telemetry, Cookies & Operational Tokens",
      category: "Technical",
      content: (
        <div className="space-y-3 text-xs leading-relaxed text-slate-600 sm:text-sm">
          <p>
            MedSupply deploys essential authentication tokens and session
            monitoring cookies strictly to maintain state across secure
            enterprise procurement flows.
          </p>
          <ul className="list-inside list-disc space-y-1.5 text-xs text-slate-600">
            <li>
              <strong>Strictly Necessary Cookies:</strong> Required to maintain
              cryptographically signed JWT sessions, prevent Cross-Site Request
              Forgery (CSRF), and isolate multi-tenant hospital portals.
            </li>
            <li>
              <strong>Security Telemetry:</strong> Anonymized latency, API
              response time, and geographic login anomaly signals used to block
              brute-force penetration attacks.
            </li>
            <li>
              <strong>No Third-Party Ad Trackers:</strong> We do not embed
              ad-retargeting pixels, social tracking widgets, or commercial ad
              network telemetry within the portal.
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: "dpo-contact",
      title: "9. Contact the Data Protection Officer (DPO)",
      category: "Contact",
      content: (
        <div className="space-y-4 text-xs leading-relaxed text-slate-600 sm:text-sm">
          <p>
            If you have questions regarding this Privacy Policy, wish to
            exercise statutory institutional rights, or suspect an enterprise
            data security irregularity, contact our designated Data Protection
            Officer:
          </p>

          <div className="space-y-3 rounded-2xl bg-linear-to-br from-slate-900 to-blue-950 p-5 text-white shadow-md">
            <div className="flex items-center gap-2">
              <ShieldCheck className="text-emerald-400" size={20} />
              <h5 className="text-sm font-bold text-white">
                Office of the Data Protection Officer
              </h5>
            </div>
            <p className="text-xs text-slate-300">
              MedSupply Enterprise Healthcare Infrastructure Ltd.
              <br />
              Plot 14, Commercial District, Victoria Island, Lagos, Nigeria
            </p>
            <div className="grid grid-cols-1 gap-3 border-t border-slate-700/80 pt-2 text-xs sm:grid-cols-2">
              <div className="flex items-center gap-2 text-slate-200">
                <Mail size={14} className="text-blue-400" />
                <span>dpo@medsupply.healthcare</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <Phone size={14} className="text-emerald-400" />
                <span>+234 800 MEDSUPPLY (Ext. 402)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <Clock size={14} className="text-blue-400" />
                <span>Statutory Response: Within 48 Hours</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <Globe size={14} className="text-emerald-400" />
                <span>NDPC Registration: #NDPC-2024-MS981</span>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ]

  const filteredSections =
    searchQuery.trim() === ""
      ? sections
      : sections.filter(
          (s) =>
            s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.category.toLowerCase().includes(searchQuery.toLowerCase())
        )

  return (
    <div className="min-h-screen bg-white">
      {/* Header Banner */}
      <div className="border-b border-slate-200 bg-linear-to-b from-blue-50/40 via-white to-white py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <div className="mb-4 flex items-center gap-2 text-xs text-slate-500">
            <button
              onClick={() => router.push("/")}
              className="cursor-pointer transition-colors hover:text-blue-700"
            >
              Home
            </button>
            <ChevronRight size={12} />
            <span className="font-semibold text-slate-900">Privacy Policy</span>
          </div>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-100/70 px-3 py-1 text-[11px] font-semibold tracking-wider text-blue-800 uppercase">
                <ShieldCheck size={13} className="text-blue-700" />
                Enterprise Compliance &bull; NDPA 2023 &bull; NAFDAC GDP
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                Institutional Privacy &amp; Data Governance
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
                Clear, legally binding protocols governing how medical
                supply-chain credentials, cold-chain telemetry, and
                institutional procurement records are safeguarded.
              </p>
            </div>

            {/* Quick Actions & Meta */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handlePrint}
                className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-xs transition-colors hover:bg-slate-50"
              >
                <Printer size={14} className="text-slate-500" />
                <span>Print Document</span>
              </button>

              <button
                onClick={handleCopyLink}
                className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-xs transition-colors hover:bg-slate-50"
              >
                <FileText size={14} className="text-slate-500" />
                <span>
                  {copiedNotification ? "Link Copied!" : "Share Policy"}
                </span>
              </button>

              <button
                onClick={() => router.push("/terms-conditionss")}
                className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-linear-to-r from-[#1e40af] to-[#00b87c] px-4 py-2 text-xs font-bold text-white shadow-xs transition-all hover:opacity-95"
              >
                <span>Terms &amp; Conditions</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>

          {/* Compliance Status Badges */}
          <div className="mt-8 grid grid-cols-2 gap-3 border-t border-slate-200/80 pt-6 sm:grid-cols-4">
            <div className="flex items-center gap-2 text-xs">
              <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
              <div>
                <span className="block text-xs font-bold text-slate-900">
                  NDPA 2023 Compliant
                </span>
                <span className="text-[11px] text-slate-500">
                  Nigeria Data Protection Act
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
              <div>
                <span className="block text-xs font-bold text-slate-900">
                  256-Bit TLS &amp; AES
                </span>
                <span className="text-[11px] text-slate-500">
                  Military-Grade Encryption
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
              <div>
                <span className="block text-xs font-bold text-slate-900">
                  Zero Patient Data Resale
                </span>
                <span className="text-[11px] text-slate-500">
                  Strict B2B Isolation
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
              <div>
                <span className="block text-xs font-bold text-slate-900">
                  PCN Audit Synchronized
                </span>
                <span className="text-[11px] text-slate-500">
                  7-Year Statutory Traceability
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Sidebar / Table of Contents */}
          <div className="space-y-6 lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              {/* Search Bar */}
              <div className="relative">
                <Search
                  size={15}
                  className="absolute top-1/2 left-3.5 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Filter privacy articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pr-4 pl-10 text-xs text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:outline-hidden"
                />
              </div>

              {/* Navigation List */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
                <div className="mb-2 flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-xs font-bold tracking-wider text-slate-900 uppercase">
                    Policy Articles
                  </h3>
                  <span className="text-[10px] text-slate-500">
                    {sections.length} Sections
                  </span>
                </div>

                <nav className="space-y-1">
                  {filteredSections.map((sec) => (
                    <button
                      key={sec.id}
                      onClick={() => {
                        setActiveSectionId(sec.id)
                        const el = document.getElementById(sec.id)
                        if (el) {
                          el.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                          })
                        }
                      }}
                      className={`flex w-full cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-medium transition-all ${
                        activeSectionId === sec.id
                          ? "border border-blue-200/80 bg-blue-50 font-bold text-blue-900 shadow-xs"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <span className="truncate pr-2">{sec.title}</span>
                      <span className="shrink-0 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-500">
                        {sec.category}
                      </span>
                    </button>
                  ))}
                  {filteredSections.length === 0 && (
                    <p className="py-3 text-center text-xs text-slate-400">
                      No matching sections found.
                    </p>
                  )}
                </nav>
              </div>

              {/* Quick Legal Help Box */}
              <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <HelpCircle size={16} className="text-blue-700" />
                  <span>Compliance Inquiries</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-500">
                  Require an enterprise Data Processing Addendum (DPA) for your
                  hospital board or health maintenance organization (HMO)?
                </p>
                <button
                  onClick={() => router.push("/contact")}
                  className="w-full cursor-pointer rounded-xl border border-slate-200 bg-white py-2 text-xs font-bold text-slate-800 transition-colors hover:bg-slate-100"
                >
                  Request Legal DPA
                </button>
              </div>

              {/* Version & Effective Date */}
              <div className="px-2 text-[11px] text-slate-400">
                Version 3.4 &bull; Effective: September 1, 2026 &bull; MedSupply
                Legal &amp; Regulatory Division
              </div>
            </div>
          </div>

          {/* Policy Articles Body */}
          <div className="space-y-8 lg:col-span-8">
            {filteredSections.map((sec) => (
              <div
                key={sec.id}
                id={sec.id}
                className={`scroll-mt-24 rounded-2xl border p-6 transition-all sm:p-8 ${
                  activeSectionId === sec.id
                    ? "border-blue-300 bg-white shadow-md ring-1 ring-blue-100"
                    : "border-slate-200/90 bg-white shadow-xs"
                }`}
              >
                <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-base font-bold text-slate-900 sm:text-lg">
                    {sec.title}
                  </h3>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                    {sec.category}
                  </span>
                </div>
                {sec.content}
              </div>
            ))}

            {/* Bottom CTA Box */}
            <div className="flex flex-col items-center justify-between gap-6 rounded-2xl bg-linear-to-r from-blue-900 via-blue-800 to-teal-800 p-6 text-white shadow-lg sm:flex-row sm:p-8">
              <div>
                <h4 className="text-lg font-bold text-white">
                  Review Our Commercial Terms
                </h4>
                <p className="mt-1 max-w-md text-xs leading-relaxed text-blue-100">
                  Understand our escrow payment protections, cold-chain
                  verification liabilities, and NAFDAC return policies.
                </p>
              </div>
              <button
                onClick={() => router.push("/terms-conditionss")}
                className="flex shrink-0 cursor-pointer items-center gap-2 rounded-xl bg-white px-5 py-3 text-xs font-bold text-blue-900 shadow-md transition-colors hover:bg-blue-50"
              >
                <span>Read Terms &amp; Conditions</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicyPage
