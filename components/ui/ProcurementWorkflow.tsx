import React, { useState } from "react"
import {
  Search,
  Layers,
  CheckCircle2,
  FileCheck,
  Truck,
  ShieldCheck,
  ArrowRight,
  Sparkles,
} from "lucide-react"

export const ProcurementWorkflow: React.FC = () => {
  const [activeStep, setActiveStep] = useState(1)

  const steps = [
    {
      number: 1,
      title: "Search Products",
      subtitle: "Browse 1,500+ Verified SKUs",
      description:
        "Search national formulary medicines by generic name, active pharmaceutical ingredient (API), therapeutic category, or NAFDAC registration number.",
      icon: Search,
      highlight:
        "Standardized national drug catalogue with verified batch numbers",
    },
    {
      number: 2,
      title: "Compare Suppliers",
      subtitle: "Side-by-Side Market Intelligence",
      description:
        "Evaluate transparent supplier quotations side-by-side: unit price, tiered volume discounts, current stock, remaining shelf life, and lead time.",
      icon: Layers,
      highlight:
        "No hidden distributor markups or unverified broker intermediaries",
    },
    {
      number: 3,
      title: "Select Supplier",
      subtitle: "Choose Importer, Distributor, or Retailer",
      description:
        "Select the optimal vendor based on your hospital budget, order volume, clinical urgency, or cold-chain delivery requirements.",
      icon: CheckCircle2,
      highlight:
        "Verified Good Distribution Practice (GDP) ratings & fulfillment metrics",
    },
    {
      number: 4,
      title: "Place Order",
      subtitle: "Digital Purchase Order (PO)",
      description:
        "Generate legally binding digital purchase orders with institutional approval routing, budget code allocation, and escrow protection.",
      icon: FileCheck,
      highlight:
        "Automated finance sign-offs and purchase requisition compliance",
    },
    {
      number: 5,
      title: "Verification & Fulfillment",
      subtitle: "Batch Release & CoA Inspection",
      description:
        "The supplier validates batch numbers, prepares tamper-evident packaging, logs temperature data for biologicals, and readies dispatch.",
      icon: ShieldCheck,
      highlight: "Certificate of Analysis (CoA) attached to digital invoice",
    },
    {
      number: 6,
      title: "Track Delivery",
      subtitle: "Real-Time Logistics Telemetry",
      description:
        "Monitor the shipment in real-time from warehouse dock to hospital pharmacy receiving bay with digital proof-of-delivery signing.",
      icon: Truck,
      highlight: "Continuous 2-8°C cold-chain temperature telemetry logs",
    },
  ]

  return (
    <div className="space-y-10">
      {/* Step Numbers Bar */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        {steps.map((step) => {
          const Icon = step.icon
          const isActive = activeStep === step.number
          return (
            <button
              key={step.number}
              onClick={() => setActiveStep(step.number)}
              className={`group relative cursor-pointer overflow-hidden rounded-xl border p-4 text-left transition-all ${
                isActive
                  ? "border-transparent bg-linear-to-r from-[#1e40af] to-[#00b87c] text-white shadow-md ring-2 ring-blue-500/30"
                  : "border-slate-200/90 bg-white text-slate-700 hover:border-blue-300 hover:shadow-xs"
              }`}
            >
              <div className="mb-2 flex items-center justify-between">
                <span
                  className={`rounded px-2 py-0.5 font-mono text-xs font-bold ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  0{step.number}
                </span>
                <Icon
                  size={16}
                  className={
                    isActive
                      ? "text-white"
                      : "text-slate-400 group-hover:text-blue-700"
                  }
                />
              </div>
              <p
                className={`text-xs font-bold tracking-tight sm:text-sm ${isActive ? "text-white" : "text-slate-900"}`}
              >
                {step.title}
              </p>
              <p
                className={`mt-0.5 truncate text-[11px] ${isActive ? "text-blue-100" : "text-slate-400"}`}
              >
                {step.subtitle}
              </p>
            </button>
          )
        })}
      </div>

      {/* Active Step Detailed View */}
      {(() => {
        const current = steps.find((s) => s.number === activeStep) || steps[0]
        const Icon = current.icon
        return (
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-lg sm:p-8 lg:p-10">
            <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold tracking-wider text-blue-900 uppercase">
                  <Sparkles size={13} className="text-emerald-600" />
                  Stage 0{current.number} of 06 — Workflow Engine
                </div>
                <h3 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                  {current.title}
                </h3>
                <p className="mt-2 text-sm font-semibold text-blue-700">
                  {current.subtitle}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
                  {current.description}
                </p>

                <div className="mt-6 flex items-start gap-3 rounded-xl border border-slate-200/80 bg-slate-50 p-4">
                  <CheckCircle2
                    size={18}
                    className="mt-0.5 shrink-0 text-emerald-600"
                  />
                  <p className="text-xs font-medium text-slate-700">
                    <strong className="font-bold text-slate-900">
                      Enterprise Guarantee:{" "}
                    </strong>
                    {current.highlight}
                  </p>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => {}}
                    className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-linear-to-r from-[#1e40af] to-[#00b87c] px-5 py-2.5 text-xs font-bold text-white shadow-xs transition-all hover:from-[#1d4ed8] hover:to-[#059669]"
                  >
                    <span>Test This Step in Live Preview</span>
                    <ArrowRight size={13} />
                  </button>

                  <button
                    onClick={() =>
                      setActiveStep((prev) => (prev < 6 ? prev + 1 : 1))
                    }
                    className="cursor-pointer rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                  >
                    Next Workflow Step (
                    {activeStep < 6 ? `0${activeStep + 1}` : "01"})
                  </button>
                </div>
              </div>

              {/* Visual Workflow Graphic - Clean White/Light Tech Card */}
              <div className="rounded-2xl border border-slate-200 bg-linear-to-br from-slate-50 to-blue-50/50 p-6 text-slate-900 shadow-sm lg:col-span-5">
                <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-blue-200 bg-blue-100/70 text-blue-700">
                      <Icon size={18} />
                    </div>
                    <div>
                      <span className="font-mono text-xs font-bold text-blue-700">
                        STAGE 0{current.number}
                      </span>
                      <p className="text-xs font-bold text-slate-900">
                        {current.title}
                      </p>
                    </div>
                  </div>
                  <span className="rounded border border-emerald-300 bg-emerald-50 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-700">
                    STATUS: ACTIVE
                  </span>
                </div>

                <div className="space-y-3 font-mono text-[11px]">
                  <div className="rounded-xl border border-slate-200/90 bg-white p-3 shadow-2xs">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase">
                      API Transaction State
                    </span>
                    <span className="font-semibold text-blue-700">
                      Verified &amp; Signed via Hospital Smart Ledger
                    </span>
                  </div>
                  <div className="rounded-xl border border-slate-200/90 bg-white p-3 shadow-2xs">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase">
                      Regulatory Checkpoint
                    </span>
                    <span className="font-semibold text-emerald-700">
                      NAFDAC Reg OK &bull; Batch Validated &bull; GDP Compliant
                    </span>
                  </div>
                  <div className="rounded-xl border border-slate-200/90 bg-white p-3 shadow-2xs">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase">
                      Institutional Security
                    </span>
                    <span className="text-slate-700">
                      256-Bit TLS &bull; Multi-tier Approval Authorized
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })()}
    </div>
  )
}
