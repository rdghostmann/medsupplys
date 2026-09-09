import React, { useState } from 'react';
import { SectionHeader } from '../components/ui/SectionHeader';
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
  Headphones
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    orgName: '',
    orgType: 'Hospital',
    subject: 'Procurement Partnership',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const contactChannels = [
    {
      title: 'Hospital Buyer Desk',
      desc: 'Formulary requests, emergency clinical POs, and bulk hospital onboarding.',
      email: 'hospitals@medsupply.healthcare',
      phone: '+234 1 800 6337',
      icon: Building2
    },
    {
      title: 'Verified Supplier Desk',
      desc: 'Vendor registration, catalogue inventory sync, and GDP compliance audits.',
      email: 'suppliers@medsupply.healthcare',
      phone: '+234 1 800 6338',
      icon: ShieldCheck
    },
    {
      title: 'Emergency Formulary Hotline',
      desc: 'Critical care and ICU stock replenishment with priority courier dispatch.',
      email: 'dispatch@medsupply.healthcare',
      phone: '+234 800 MED-URGENT',
      icon: Headphones
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section - Clean White Theme */}
      <section className="bg-gradient-to-b from-blue-50/40 via-white to-white py-16 sm:py-24 relative overflow-hidden border-b border-slate-200/80">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-xs font-semibold uppercase tracking-wider mb-6">
            <MessageSquare size={14} className="text-emerald-600" />
            Institutional Support &amp; Partnerships
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 max-w-3xl mx-auto">
            Connect with MedSupply Procurement Specialists
          </h1>
          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Whether you are a hospital pharmacy director modernizing requisition workflows or a licensed wholesaler seeking broader distribution, our healthcare team is ready.
          </p>
        </div>
      </section>

      {/* Contact Channels Grid */}
      <section className="py-12 sm:py-16 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contactChannels.map((c, idx) => {
              const Icon = c.icon;
              return (
                <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-blue-300 hover:shadow-sm transition-all">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-4 border border-blue-100">
                    <Icon size={20} />
                  </div>
                  <h4 className="text-base font-bold text-slate-900">{c.title}</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{c.desc}</p>
                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-1 text-xs">
                    <p className="font-semibold text-slate-800 flex items-center gap-2">
                      <Mail size={13} className="text-blue-700" />
                      <span>{c.email}</span>
                    </p>
                    <p className="font-semibold text-slate-800 flex items-center gap-2">
                      <Phone size={13} className="text-blue-700" />
                      <span>{c.phone}</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Form & Office Hubs Section */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Form */}
            <div className="lg:col-span-7">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-800 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                Direct Inquiry
              </span>
              <h3 className="text-2xl font-bold text-slate-900 mt-2">
                Send an Enterprise Procurement Request
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 mb-6">
                Our clinical and technical team responds to institutional inquiries within 2 hours during normal business operating shifts.
              </p>

              {submitted ? (
                <div className="p-8 rounded-2xl bg-blue-50/60 border border-blue-200 text-center">
                  <div className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto mb-3 shadow-md">
                    <CheckCircle2 size={28} />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900">Message Successfully Transmitted</h4>
                  <p className="text-xs text-slate-600 mt-2 max-w-md mx-auto">
                    Thank you, {formData.name}. Our healthcare procurement specialist has been assigned to your ticket.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-6 px-5 py-2 rounded-xl bg-gradient-to-r from-[#1e40af] to-[#00b87c] text-white text-xs font-bold cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Dr. / Pharm. First Last"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Work Email *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="name@hospital.org"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+234 800 000 0000"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Organization Type *
                      </label>
                      <select
                        value={formData.orgType}
                        onChange={(e) => setFormData({ ...formData, orgType: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                      >
                        <option value="Hospital">Teaching / Specialist Hospital</option>
                        <option value="Clinic">Private Clinic / Surgical Center</option>
                        <option value="Pharmacy Chain">Community Pharmacy Network</option>
                        <option value="Supplier">Pharmaceutical Wholesaler / Importer</option>
                        <option value="Government">State Medical Store / NGO</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Healthcare Facility / Organization Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Cedarcrest Specialist Hospital"
                      value={formData.orgName}
                      onChange={(e) => setFormData({ ...formData, orgName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Detailed Requisition / Inquiry *
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Please describe your hospital formulary requirements, procurement volume, or partnership request..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#1e40af] via-[#0284c7] to-[#00b87c] hover:from-[#1d4ed8] hover:to-[#059669] text-white font-bold text-xs shadow-md shadow-blue-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send size={14} />
                    <span>Transmit Message to Procurement Directorate</span>
                  </button>
                </form>
              )}
            </div>

            {/* Office Hubs & Operations Info */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-slate-900 text-white p-7 rounded-2xl border border-slate-800 shadow-xl space-y-5">
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <MapPin size={18} className="text-emerald-400" />
                  <span>Central Operations Headquarters</span>
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  MedSupply Healthcare Logistics Hub<br />
                  Plot 14B, Adeola Odeku Street,<br />
                  Victoria Island, Lagos State, Nigeria
                </p>

                <div className="pt-4 border-t border-slate-800 space-y-3 text-xs text-slate-300">
                  <div className="flex items-center gap-2.5">
                    <Clock size={16} className="text-emerald-400 shrink-0" />
                    <span>Customer Operations: Mon - Fri: 08:00 - 18:00 WAT</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Headphones size={16} className="text-emerald-400 shrink-0" />
                    <span>Emergency Hospital Requisitions: 24/7/365 On-Call</span>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-blue-50/70 border border-blue-200/80 text-xs space-y-3">
                <span className="font-bold text-blue-900 block text-sm">Regional Cold-Chain Depots</span>
                <p className="text-slate-600 leading-relaxed">
                  Fast delivery within 24 hours across Lagos, Abuja FCT, Port Harcourt, Ibadan, Enugu, and Kano through our climate-certified distribution hubs.
                </p>
                <div className="pt-2 text-[11px] font-mono text-emerald-700 font-bold">
                  NAFDAC AUDITED &bull; GDP CERTIFIED LOGISTICS
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};
