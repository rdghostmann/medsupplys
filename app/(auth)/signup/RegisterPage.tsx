import React, { useState } from 'react';

import { 
  Building2, 
  Lock, 
  Mail, 
  User, 
  Phone, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2,
  FileBadge
} from 'lucide-react';
import { MedSupplyLogo } from '@/components/ui/MedSupplyLogo';
import { useRouter } from 'next/navigation';
export const RegisterPage: React.FC = () => {

  const router = useRouter();
  const [role, setRole] = useState<'buyer' | 'supplier'>('buyer');
  const [registered, setRegistered] = useState(false);
  const [formData, setFormData] = useState({
    orgName: '',
    orgType: 'Teaching Hospital',
    licenseNumber: '',
    fullName: '',
    email: '',
    phone: '',
    password: '',
    agreeTerms: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegistered(true);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-linear-to-b from-white via-blue-50/20 to-white">
      <div className="max-w-xl w-full space-y-8 bg-white p-8 sm:p-10 rounded-2xl border border-slate-200/90 shadow-xl">
        
        {/* Header with MedSupply Logo */}
        <div className="text-center">
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center justify-center mb-4 group cursor-pointer"
          >
            <MedSupplyLogo variant="horizontal" size="md" />
          </button>

          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Create an Enterprise Account
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Join Nigeria&apos;s trusted B2B pharmaceutical procurement network
          </p>
        </div>

        {/* Role Toggle */}
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setRole('buyer')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              role === 'buyer'
                ? 'bg-linear-to-r from-[#1e40af] to-[#00b87c] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Healthcare Buyer (Hospital / Clinic)
          </button>
          <button
            type="button"
            onClick={() => setRole('supplier')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              role === 'supplier'
                ? 'bg-linear-to-r from-[#1e40af] to-[#00b87c] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pharmaceutical Supplier (Distributor / Importer)
          </button>
        </div>

        {registered ? (
          <div className="p-8 rounded-xl bg-blue-50/60 border border-blue-200 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 size={28} />
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-900">Registration Received</h4>
              <p className="text-xs text-slate-600 mt-2 max-w-sm mx-auto leading-relaxed">
                Your organizational profile for <strong className="text-slate-900">{formData.orgName}</strong> has been provisioned. 
                Our compliance team has initiated license validation against Pharmacists Council records.
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={() => router.push('/')}
                className="px-6 py-2.5 rounded-xl bg-linear-to-r from-[#1e40af] to-[#00b87c] hover:from-[#1d4ed8] hover:to-[#059669] text-white text-xs font-bold cursor-pointer"
              >
                Continue to MedSupply Portal
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Organization / Facility Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder={role === 'buyer' ? 'e.g. Cedarcrest Hospital' : 'e.g. Swiss Pharma Ltd'}
                  value={formData.orgName}
                  onChange={(e) => setFormData({ ...formData, orgName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Facility / Entity Category *
                </label>
                <select
                  value={formData.orgType}
                  onChange={(e) => setFormData({ ...formData, orgType: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                >
                  {role === 'buyer' ? (
                    <>
                      <option value="Teaching Hospital">Teaching / Federal Medical Center</option>
                      <option value="Private Hospital">Private Specialist Hospital</option>
                      <option value="Clinic Group">Outpatient Clinic Network</option>
                      <option value="Community Pharmacy">Retail Pharmacy Chain</option>
                    </>
                  ) : (
                    <>
                      <option value="Manufacturer">Pharmaceutical Manufacturer</option>
                      <option value="Importer">Licensed Importer</option>
                      <option value="Distributor">Wholesale Distributor</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Operating License / PCN Reg No. *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PCN-2026-9812"
                  value={formData.licenseNumber}
                  onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 font-mono focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Lead Pharmacist / Director Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Pharm. / Dr. Full Name"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Official Institutional Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="procurement@hospital.org"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Direct Phone Contact *
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
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Create Strong Password (Minimum 8 Characters) *
              </label>
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>

            <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer pt-1">
              <input
                type="checkbox"
                required
                checked={formData.agreeTerms}
                onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                className="rounded text-blue-700 focus:ring-blue-500 mt-0.5"
              />
              <span>
                I agree to the MedSupply Pharmaceutical Procurement Terms of Service, NAFDAC regulatory compliance audit protocols, and data privacy policies.
              </span>
            </label>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-linear-to-r from-[#1e40af] via-[#0284c7] to-[#00b87c] hover:from-[#1d4ed8] hover:to-[#059669] text-white font-bold text-xs tracking-wide shadow-md shadow-blue-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <ShieldCheck size={16} />
              <span>Register Institutional Account</span>
            </button>
          </form>
        )}

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500">Already have an active account?</span>
          <button
            onClick={() => router.push('/login')}
            className="font-bold text-blue-700 hover:text-emerald-700 cursor-pointer"
          >
            Sign In to Portal &rarr;
          </button>
        </div>

      </div>
    </div>
  );
};
