"use client"
import React, { useState } from "react"

import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageSquare,
  CheckCircle2,
  Send,
  ShieldCheck,
  Headphones,
} from "lucide-react"

const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    orgName: "",
    orgType: "Hospital",
    subject: "Procurement Partnership",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const contactChannels = [
    {
      title: "Hospital Buyer Desk",
      desc: "Formulary requests, emergency clinical POs, and bulk hospital onboarding.",
      email: "hospitals@medsupply.healthcare",
      phone: "+234 1 800 6337",
      icon: Building2,
    },
    {
      title: "Verified Supplier Desk",
      desc: "Vendor registration, catalogue inventory sync, and GDP compliance audits.",
      email: "suppliers@medsupply.healthcare",
      phone: "+234 1 800 6338",
      icon: ShieldCheck,
    },
    {
      title: "Emergency Formulary Hotline",
      desc: "Critical care and ICU stock replenishment with priority courier dispatch.",
      email: "dispatch@medsupply.healthcare",
      phone: "+234 800 MED-URGENT",
      icon: Headphones,
    },
  ]

  return (
    <div className="bg-white pt-4">
      {/* Hero Section - Clean White Theme */}
      <section className="relative overflow-hidden border-b border-slate-200/80 bg-linear-to-b from-blue-50/40 via-white to-white py-16 sm:py-24">
        <div className="pointer-events-none absolute top-0 right-1/4 h-96 w-96 rounded-full bg-blue-500/5 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-semibold tracking-wider text-blue-900 uppercase">
            <MessageSquare size={14} className="text-emerald-600" />
            Institutional Support &amp; Partnerships
          </div>
          <h1 className="mx-auto max-w-3xl text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Connect with MedSupply Procurement Specialists
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            Whether you are a hospital pharmacy director modernizing requisition
            workflows or a licensed wholesaler seeking broader distribution, our
            healthcare team is ready.
          </p>
        </div>
      </section>

      {/* Contact Channels Grid */}
      <section className="border-b border-slate-200/80 bg-slate-50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {contactChannels.map((c, idx) => {
              const Icon = c.icon
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs transition-all hover:border-blue-300 hover:shadow-sm"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-700">
                    <Icon size={20} />
                  </div>
                  <h4 className="text-base font-bold text-slate-900">
                    {c.title}
                  </h4>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600">
                    {c.desc}
                  </p>
                  <div className="mt-4 space-y-1 border-t border-slate-100 pt-4 text-xs">
                    <p className="flex items-center gap-2 font-semibold text-slate-800">
                      <Mail size={13} className="text-blue-700" />
                      <span>{c.email}</span>
                    </p>
                    <p className="flex items-center gap-2 font-semibold text-slate-800">
                      <Phone size={13} className="text-blue-700" />
                      <span>{c.phone}</span>
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Main Form & Office Hubs Section */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
            {/* Form */}
            <div className="lg:col-span-7">
              <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold tracking-wider text-blue-800 uppercase">
                Direct Inquiry
              </span>
              <h3 className="mt-2 text-2xl font-bold text-slate-900">
                Send an Enterprise Procurement Request
              </h3>
              <p className="mt-1 mb-6 text-xs text-slate-600 sm:text-sm">
                Our clinical and technical team responds to institutional
                inquiries within 2 hours during normal business operating
                shifts.
              </p>

              {submitted ? (
                <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-8 text-center">
                  <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-md">
                    <CheckCircle2 size={28} />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900">
                    Message Successfully Transmitted
                  </h4>
                  <p className="mx-auto mt-2 max-w-md text-xs text-slate-600">
                    Thank you, {formData.name}. Our healthcare procurement
                    specialist has been assigned to your ticket.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-6 cursor-pointer rounded-xl bg-linear-to-r from-[#1e40af] to-[#00b87c] px-5 py-2 text-xs font-bold text-white"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
                >
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-700 uppercase">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Dr. / Pharm. First Last"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-700 uppercase">
                        Work Email *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="name@hospital.org"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-700 uppercase">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+234 800 000 0000"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-700 uppercase">
                        Organization Type *
                      </label>
                      <select
                        value={formData.orgType}
                        onChange={(e) =>
                          setFormData({ ...formData, orgType: e.target.value })
                        }
                        className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:outline-hidden"
                      >
                        <option value="Hospital">
                          Teaching / Specialist Hospital
                        </option>
                        <option value="Clinic">
                          Private Clinic / Surgical Center
                        </option>
                        <option value="Pharmacy Chain">
                          Community Pharmacy Network
                        </option>
                        <option value="Supplier">
                          Pharmaceutical Wholesaler / Importer
                        </option>
                        <option value="Government">
                          State Medical Store / NGO
                        </option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-700 uppercase">
                      Healthcare Facility / Organization Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Cedarcrest Specialist Hospital"
                      value={formData.orgName}
                      onChange={(e) =>
                        setFormData({ ...formData, orgName: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-700 uppercase">
                      Detailed Requisition / Inquiry *
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Please describe your hospital formulary requirements, procurement volume, or partnership request..."
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:outline-hidden"
                    />
                  </div>

                  <button
                    type="submit"
                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#1e40af] via-[#0284c7] to-[#00b87c] py-3.5 text-xs font-bold text-white shadow-md shadow-blue-700/20 transition-all hover:from-[#1d4ed8] hover:to-[#059669]"
                  >
                    <Send size={14} />
                    <span>Transmit Message to Procurement Desk</span>
                  </button>
                </form>
              )}
            </div>

            {/* Office Hubs & Operations Info */}
            <div className="space-y-6 lg:col-span-5">
              <div className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900 p-7 text-white shadow-xl">
                <h4 className="flex items-center gap-2 text-base font-bold text-white">
                  <MapPin size={18} className="text-emerald-400" />
                  <span>Central Operations Headquarters</span>
                </h4>
                <p className="text-xs leading-relaxed text-slate-300">
                  MedSupply Healthcare Logistics Hub
                  <br />
                  Plot 14B, Adeola Odeku Street,
                  <br />
                  Victoria Island, Lagos State, Nigeria
                </p>

                <div className="space-y-3 border-t border-slate-800 pt-4 text-xs text-slate-300">
                  <div className="flex items-center gap-2.5">
                    <Clock size={16} className="shrink-0 text-emerald-400" />
                    <span>
                      Customer Operations: Mon - Fri: 08:00 - 18:00 WAT
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Headphones
                      size={16}
                      className="shrink-0 text-emerald-400"
                    />
                    <span>
                      Emergency Hospital Requisitions: 24/7/365 On-Call
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 rounded-2xl border border-blue-200/80 bg-blue-50/70 p-6 text-xs">
                <span className="block text-sm font-bold text-blue-900">
                  Regional Cold-Chain Depots
                </span>
                <p className="leading-relaxed text-slate-600">
                  Fast delivery within 24 hours across Lagos, Abuja FCT, Port
                  Harcourt, Ibadan, Enugu, and Kano through our
                  climate-certified distribution hubs.
                </p>
                <div className="pt-2 font-mono text-[11px] font-bold text-emerald-700">
                  NAFDAC AUDITED &bull; GDP CERTIFIED LOGISTICS
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ContactPage
