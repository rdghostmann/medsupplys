"use client"
import React, { useState } from 'react';
import { 
  Scale, 
  ShieldCheck, 
  FileText, 
  Building2, 
  ThermometerSnowflake, 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  Printer, 
  ArrowRight, 
  ChevronRight, 
  HelpCircle,
  Clock,
  Mail,
  Phone,
  Banknote,
  Truck,
  RotateCcw,
  Gavel
} from 'lucide-react';

import { useRouter } from 'next/navigation';

interface TermSection {
  id: string;
  title: string;
  badge: string;
  content: React.ReactNode;
}

const TermsConditionsPage: React.FC = () => {
const router = useRouter();


  const [searchQuery, setSearchQuery] = useState('');
 const [activeSectionId, setActiveSectionId] = useState('acceptance');
  const [copiedNotification, setCopiedNotification] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedNotification(true);
      setTimeout(() => setCopiedNotification(false), 2500);
    }
  };

  const sections: TermSection[] = [
    {
      id: 'acceptance',
      title: '1. Acceptance of Terms & Healthcare Institutional Eligibility',
      badge: 'Eligibility',
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <p>
            These Terms and Conditions of Sourcing and Supply <q>(Terms)</q> constitute a legally binding agreement between <strong>MedSupply Healthcare Infrastructure Ltd.</strong> <q>MedSupply</q>, <q>we</q>, <q>us</q> and your organization <q>Institutional Buyer</q> or <q>Verified Supplier</q>. By creating an enterprise profile, issuing a Purchase Order (PO), or listing pharmaceutical inventory on MedSupply, your entity unconditionally accepts these Terms.
          </p>
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-slate-800">
            <h5 className="font-bold text-amber-950 flex items-center gap-1.5 mb-1 text-xs">
              <AlertTriangle size={15} className="text-amber-700" />
              Strict B2B Healthcare Institutional Access Only
            </h5>
            <p className="text-xs text-slate-700">
              Access to MedSupply is strictly limited to verified, licensed healthcare corporate entities. Under no circumstances may retail individuals or non-clinical entities register or order medications through this portal.
            </p>
          </div>
          <p>
            Every Institutional Buyer must maintain an active <strong>Premises License</strong> issued by the <strong>Pharmacy Council of Nigeria (PCN)</strong> or an operational facility authorization from their respective State Ministry of Health, under the continuous oversight of a licensed Superintendent Pharmacist.
          </p>
        </div>
      )
    },
    {
      id: 'supplier-accreditation',
      title: '2. Supplier Vetting, GDP & NAFDAC Accreditation',
      badge: 'Compliance',
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <p>
            MedSupply enforces strict qualification criteria before any pharmaceutical manufacturer, importer, or primary distributor is authorized to list pharmaceuticals:
          </p>
          <ul className="list-disc list-inside space-y-2 text-xs text-slate-600">
            <li>
              <strong>Mandatory NAFDAC Registration:</strong> Every listed SKU must possess a valid, verifiable National Agency for Food and Drug Administration and Control (NAFDAC) registration number.
            </li>
            <li>
              <strong>Good Distribution Practices (GDP):</strong> All warehouses and distribution nodes must satisfy WHO and NAFDAC GDP guidelines, including climate-controlled storage and lot-level traceability.
            </li>
            <li>
              <strong>Manufacturer Certificate of Analysis (COA):</strong> Suppliers must electronically upload a certified batch-specific COA for every lot dispatched.
            </li>
            <li>
              <strong>Continuous Vetting &amp; Re-audit:</strong> Supplier premises are subjected to unannounced physical quality audits by MedSupply pharmaceutical quality inspection teams.
            </li>
          </ul>
        </div>
      )
    },
    {
      id: 'orders-escrow',
      title: '3. Purchase Orders, Pricing & Smart Escrow Settlement',
      badge: 'Financials',
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <p>
            To prevent fraud, eliminate payment defaults, and guarantee product authenticity, all commercial transactions across MedSupply utilize our <strong>Smart Escrow Settlement Engine</strong>:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-2">
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60">
              <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs mb-2">
                1
              </div>
              <h6 className="font-bold text-xs text-slate-900">Binding RFQ / PO Acceptance</h6>
              <p className="text-[11px] text-slate-600 mt-1">Once a supplier accepts a buyer purchase order, unit pricing and batch allocations are locked for the delivery window.</p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60">
              <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs mb-2">
                2
              </div>
              <h6 className="font-bold text-xs text-slate-900">Escrow Account Deposit</h6>
              <p className="text-[11px] text-slate-600 mt-1">Funds are secured in a CBN-licensed commercial escrow vault until goods are physically inspected at the hospital dock.</p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60">
              <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs mb-2">
                3
              </div>
              <h6 className="font-bold text-xs text-slate-900">Milestone Release</h6>
              <p className="text-[11px] text-slate-600 mt-1">Upon digital confirmation of seal integrity and temperature pass, escrow funds are automatically disbursed to the supplier.</p>
            </div>
          </div>

          <p className="text-xs text-slate-500">
            For accredited tertiary hospitals operating on verified 30-day corporate credit terms, invoices become payable on the 30th day following certified delivery acceptance.
          </p>
        </div>
      )
    },
    {
      id: 'cold-chain',
      title: '4. Cold Chain Obligations & Loading Dock Inspection',
      badge: 'Logistics',
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <p>
            For thermosensitive pharmaceuticals (including insulins, vaccines, biologics, and oncology injectables requiring <strong>2°C to 8°C</strong> storage):
          </p>
          
          <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 space-y-2">
            <h6 className="font-bold text-xs text-blue-950 flex items-center gap-2">
              <ThermometerSnowflake size={16} className="text-blue-700" />
              24-Hour Inspection &amp; Rejection Protocol
            </h6>
            <p className="text-xs text-slate-700">
              Institutional Buyers have a <strong>24-hour verification window</strong> from the physical arrival timestamp at the hospital loading dock to inspect temperature data loggers, container seals, and lot numbers.
            </p>
            <ul className="list-disc list-inside space-y-1 text-xs text-slate-600 pt-1">
              <li>If the IoT temperature logger indicates a critical excursion outside allowable kinetic limits, the buyer may reject the delivery immediately with zero financial liability.</li>
              <li>Tamper-evident seals broken prior to hospital receipt entitle the buyer to immediate rejection and replacement dispatch.</li>
              <li>Escrow funds remain frozen during any active temperature audit investigation.</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'recalls-pharmacovigilance',
      title: '5. Mandatory Batch Recalls & Pharmacovigilance',
      badge: 'Safety',
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <p>
            MedSupply maintains a zero-compromise clinical pharmacovigilance safety network:
          </p>
          <div className="space-y-2.5">
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
              <strong className="text-xs font-bold text-slate-900 block mb-1">Immediate 24-Hour Recall Notification</strong>
              <p className="text-xs text-slate-600">
                In the event that NAFDAC, the World Health Organization (WHO), or the manufacturing principal issues a recall alert for any lot distributed via MedSupply, our automated tracing system alerts all affected hospital pharmacies within 4 hours.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
              <strong className="text-xs font-bold text-slate-900 block mb-1">Quarantine &amp; Reverse Logistics</strong>
              <p className="text-xs text-slate-600">
                Suppliers are contractually obligated to fund and coordinate the immediate reverse-quarantine retrieval of all affected stock within 48 hours of notice.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
              <strong className="text-xs font-bold text-slate-900 block mb-1">Full Commercial Refund / Credit</strong>
              <p className="text-xs text-slate-600">
                Buyers impacted by a regulatory or manufacturer recall receive an immediate 100% financial credit or cash refund from the supplier via escrow offset.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'prohibited-conduct',
      title: '6. Prohibited Acts & Anti-Counterfeiting Enforcement',
      badge: 'Zero Tolerance',
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <p>
            Any participant engaging in the following actions will face immediate account termination, forfeiture of escrow balances, and direct referral to the <strong>NAFDAC Enforcement Directorate</strong> and the <strong>Nigeria Police Force</strong>:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-600">
            <li>Listing or distributing counterfeit, substandard, falsified, or expired pharmaceuticals.</li>
            <li>Diverting public-health humanitarian donations or government-subsidized medications into private commercial channels.</li>
            <li>Uploading forged or manipulated PCN retention certificates, CAC registration numbers, or manufacturer COAs.</li>
            <li>Collusive price-fixing, artificial supply withholding, or bid-rigging across hospital tenders.</li>
            <li>Attempting to bypass the MedSupply escrow system to consummate off-platform transactions after connecting via the portal.</li>
          </ul>
        </div>
      )
    },
    {
      id: 'intellectual-property',
      title: '7. Platform Intellectual Property & Data Ownership',
      badge: 'IP Rights',
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <p>
            All intellectual property rights in the MedSupply infrastructure—including the procurement matching engine, inventory tracking UI, verification algorithms, and analytics dashboards—belong exclusively to MedSupply Healthcare Infrastructure Ltd.
          </p>
          <p>
            Institutional participants retain full ownership of their proprietary commercial transaction data and clinical facility purchase orders. MedSupply is granted a worldwide, non-exclusive license to use aggregated, de-identified procurement statistics to publish industry benchmark reports and national availability indices.
          </p>
        </div>
      )
    },
    {
      id: 'liability-disclaimer',
      title: '8. Limitation of Liability & Clinical Disclaimer',
      badge: 'Legal Scope',
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-slate-800">
            <h6 className="font-bold text-xs uppercase tracking-wider text-slate-900 mb-1">
              Clinical Practice Disclaimer
            </h6>
            <p className="text-xs leading-relaxed text-slate-700">
              MedSupply is a technology and verification marketplace. MedSupply does not prescribe, diagnose, or practice clinical pharmacy. The licensed hospital medical staff and Superintendent Pharmacists remain solely and exclusively responsible for the clinical appropriateness, dispensing, and administration of medications to patients.
            </p>
          </div>
          <p>
            To the maximum extent permitted by Nigerian law, MedSupply’s aggregate liability arising out of any procurement dispute is strictly capped at the total platform transaction fees collected by MedSupply on the disputed Purchase Order.
          </p>
        </div>
      )
    },
    {
      id: 'dispute-resolution',
      title: '9. Governing Law, Arbitration & Dispute Resolution',
      badge: 'Jurisdiction',
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <p>
            These Terms shall be interpreted and governed in accordance with the <strong>Laws of the Federal Republic of Nigeria</strong>.
          </p>
          <p>
            In the event of any commercial controversy, claim, or dispute arising out of or relating to a purchase order or platform fulfillment:
          </p>
          <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-600">
            <li>
              <strong>Amicable Negotiation:</strong> The parties shall first submit the matter to the MedSupply Sourcing Resolution Panel for an expedited 14-day conciliation period.
            </li>
            <li>
              <strong>Binding Arbitration:</strong> If unresolved, the dispute shall be finally settled under the Arbitration and Mediation Act 2023 at the <strong>Lagos Court of Arbitration (LCA)</strong>, before a single arbitrator appointed jointly by the parties.
            </li>
            <li>
              <strong>Emergency Injunctive Relief:</strong> Nothing in this clause prevents either party from seeking urgent injunctive relief from the Federal High Court of Nigeria to prevent counterfeit dissemination or trademark infringement.
            </li>
          </ol>
        </div>
      )
    },
    {
      id: 'modifications-contact',
      title: '10. Amendments & Institutional Legal Counsel Desk',
      badge: 'Amendments',
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <p>
            MedSupply reserves the right to amend these Terms to reflect evolving regulatory updates from PCN, NAFDAC, or the Central Bank of Nigeria. Institutional subscribers will be notified electronically at least 14 days prior to any material change taking effect.
          </p>

          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-blue-950 text-white space-y-3 shadow-md">
            <div className="flex items-center gap-2">
              <Scale className="text-emerald-400" size={20} />
              <h5 className="font-bold text-sm text-white">Office of the General Counsel &amp; Legal Affairs</h5>
            </div>
            <p className="text-xs text-slate-300">
              MedSupply Healthcare Infrastructure Ltd.<br />
              Commercial Legal Division, Plot 14, Commercial District, Victoria Island, Lagos, Nigeria
            </p>
            <div className="pt-2 border-t border-slate-700/80 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-200">
                <Mail size={14} className="text-blue-400" />
                <span>legal@medsupply.healthcare</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <Phone size={14} className="text-emerald-400" />
                <span>+234 800 MEDSUPPLY (Ext. 401)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <Clock size={14} className="text-blue-400" />
                <span>Legal Review Turnaround: 24-48 Hours</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <Building2 size={14} className="text-emerald-400" />
                <span>Corporate Affairs Comm: #RC-1928401</span>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const filteredSections = searchQuery.trim() === '' 
    ? sections 
    : sections.filter(s => 
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        s.badge.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    <div className="bg-white min-h-screen">
      {/* Header Banner */}
      <div className="border-b border-slate-200 bg-gradient-to-b from-blue-50/40 via-white to-white py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
            <button 
              onClick={() => router.push('/')} 
              className="hover:text-blue-700 transition-colors cursor-pointer"
            >
              Home
            </button>
            <ChevronRight size={12} />
            <span className="text-slate-900 font-semibold">Terms &amp; Conditions</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/70 border border-blue-200 text-blue-800 text-[11px] font-semibold uppercase tracking-wider mb-3">
                <Scale size={13} className="text-blue-700" />
                Commercial Master Agreement &bull; Version 4.1 &bull; September 2026
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Terms &amp; Conditions of Sourcing
              </h1>
              <p className="mt-2 text-sm text-slate-600 max-w-2xl leading-relaxed">
                Legally binding procurement standards, cold-chain verification guarantees, smart escrow protections, and pharmacovigilance commitments for verified healthcare operators.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handlePrint}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <Printer size={14} className="text-slate-500" />
                <span>Print Terms</span>
              </button>
              
              <button
                onClick={handleCopyLink}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <FileText size={14} className="text-slate-500" />
                <span>{copiedNotification ? 'Link Copied!' : 'Share Terms'}</span>
              </button>

              <button
                onClick={() => router.push('/privacy-policy')}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#1e40af] to-[#00b87c] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs hover:opacity-95 transition-all cursor-pointer"
              >
                <span>Privacy Policy</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>

          {/* Key Terms Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-slate-200/80">
            <div className="flex items-center gap-2 text-xs">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              <div>
                <span className="font-bold text-slate-900 block text-xs">Strictly B2B Only</span>
                <span className="text-[11px] text-slate-500">PCN/NAFDAC Licensed Entities</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-xs">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              <div>
                <span className="font-bold text-slate-900 block text-xs">24-Hr Cold Inspection</span>
                <span className="text-[11px] text-slate-500">2°C – 8°C Dock Rejection Right</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              <div>
                <span className="font-bold text-slate-900 block text-xs">Smart Escrow Hold</span>
                <span className="text-[11px] text-slate-500">Release Only After Physical Audit</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              <div>
                <span className="font-bold text-slate-900 block text-xs">100% Recall Refund</span>
                <span className="text-[11px] text-slate-500">Full Regulatory Protection</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar Navigation */}
          <div className="lg:col-span-4 space-y-6">
            <div className="sticky top-24 space-y-6">
              
              {/* Search Bar */}
              <div className="relative">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter terms & clauses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-slate-50/50"
                />
              </div>

              {/* Navigation List */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    Agreement Clauses
                  </h3>
                  <span className="text-[10px] text-slate-500">
                    {sections.length} Articles
                  </span>
                </div>

                <nav className="space-y-1">
                  {filteredSections.map((sec) => (
                    <button
                      key={sec.id}
                      onClick={() => {
                        setActiveSectionId(sec.id);
                        const el = document.getElementById(sec.id);
                        if (el) {
                          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                        activeSectionId === sec.id
                          ? 'bg-blue-50 text-blue-900 font-bold border border-blue-200/80 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <span className="truncate pr-2">{sec.title}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 shrink-0">
                        {sec.badge}
                      </span>
                    </button>
                  ))}
                  {filteredSections.length === 0 && (
                    <p className="text-xs text-slate-400 py-3 text-center">
                      No matching clauses found.
                    </p>
                  )}
                </nav>
              </div>

              {/* Legal Dispute Assistance */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-3">
                <div className="flex items-center gap-2 text-slate-900 font-bold">
                  <Gavel size={16} className="text-blue-700" />
                  <span>Escrow &amp; Procurement Tenders</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Need a customized Master Supply Agreement (MSA) or formal hospital tender procurement addendum?
                </p>
                <button
                  onClick={() => router.push('/contact')}
                  className="w-full py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
                >
                  Contact Institutional Counsel
                </button>
              </div>

              {/* Version & Notice */}
              <div className="text-[11px] text-slate-400 px-2">
                MedSupply Sourcing Governance &bull; Binding on all active buyers &amp; suppliers &bull; Lagos, Nigeria
              </div>
            </div>
          </div>

          {/* Terms Content Body */}
          <div className="lg:col-span-8 space-y-8">
            {filteredSections.map((sec) => (
              <div
                key={sec.id}
                id={sec.id}
                className={`p-6 sm:p-8 rounded-2xl border transition-all scroll-mt-24 ${
                  activeSectionId === sec.id
                    ? 'border-blue-300 bg-white shadow-md ring-1 ring-blue-100'
                    : 'border-slate-200/90 bg-white shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    {sec.title}
                  </h3>
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                    {sec.badge}
                  </span>
                </div>
                {sec.content}
              </div>
            ))}

            {/* Bottom Cross Link */}
            <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-blue-900 via-blue-800 to-teal-800 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg">
              <div>
                <h4 className="text-lg font-bold text-white">Institutional Privacy &amp; Data Security</h4>
                <p className="text-xs text-blue-100 mt-1 max-w-md leading-relaxed">
                  Read how your corporate credentials, cold-chain telemetry, and order audit trails are shielded under the NDPA 2023.
                </p>
              </div>
              <button
                onClick={() => router.push('/privacy-policy')}
                className="shrink-0 px-5 py-3 rounded-xl bg-white text-blue-900 font-bold text-xs hover:bg-blue-50 transition-colors shadow-md cursor-pointer flex items-center gap-2"
              >
                <span>Read Privacy Policy</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TermsConditionsPage;
