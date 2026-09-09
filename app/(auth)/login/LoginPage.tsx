"use client"
import React, { useState } from 'react';

import { 
  Building2, 
  Lock, 
  Mail, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2
} from 'lucide-react';
import { MedSupplyLogo } from '@/components/ui/MedSupplyLogo';
import { useRouter } from 'next/navigation';
 const LoginPage: React.FC = () => {

  const [accountType, setAccountType] = useState<'buyer' | 'supplier'>('buyer');
  const [email, setEmail] = useState('procurement@cedarcrest.org');
  const [password, setPassword] = useState('••••••••••••');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setTimeout(() => {
      setIsLoggingIn(false);
      setLoggedIn(true);
    }, 600);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-linear-to-b from-white via-blue-50/20 to-white">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-2xl border border-slate-200/90 shadow-xl">
        
        {/* Header with Official MedSupply Logo */}
        <div className="text-center">
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center justify-center mb-4 group cursor-pointer"
          >
            <MedSupplyLogo variant="horizontal" size="md" />
          </button>

          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Sign In to Enterprise Portal
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Secure B2B authentication for healthcare buyers and verified suppliers
          </p>
        </div>

        {/* Account Role Selector */}
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => {
              setAccountType('buyer');
              setEmail('procurement@cedarcrest.org');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              accountType === 'buyer'
                ? 'bg-linear-to-r from-[#1e40af] to-[#00b87c] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Healthcare Buyer
          </button>
          <button
            type="button"
            onClick={() => {
              setAccountType('supplier');
              setEmail('orders@swipha.com.ng');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              accountType === 'supplier'
                ? 'bg-linear-to-r from-[#1e40af] to-[#00b87c] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Verified Supplier
          </button>
        </div>

        {loggedIn ? (
          <div className="p-6 rounded-xl bg-blue-50/60 border border-blue-200 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900">Authenticated Successfully</h4>
              <p className="text-xs text-slate-600 mt-1">
                Welcome back, {accountType === 'buyer' ? 'Cedarcrest Hospital Directorate' : 'Swiss Pharma Portal'}.
              </p>
            </div>
            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={() => {
                  setLoggedIn(false);
                  router.push('/');
                }}
                className="w-full py-2.5 rounded-xl bg-linear-to-r from-[#1e40af] to-[#00b87c] text-white text-xs font-bold cursor-pointer"
              >
                Access Main Dashboard
              </button>
              <button
                onClick={() => { }}
                className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
              >
                Launch Live Quotation Console
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Institutional Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('A reset link has been dispatched to your institutional administrator.'); }} className="text-[11px] font-semibold text-blue-700 hover:text-emerald-700">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock size={16} />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-600">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-blue-700 focus:ring-blue-500" />
                <span>Keep session active for 8 hours</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 rounded-xl bg-linear-to-r from-[#1e40af] via-[#0284c7] to-[#00b87c] hover:from-[#1d4ed8] hover:to-[#059669] text-white font-bold text-xs tracking-wide shadow-md shadow-blue-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoggingIn ? (
                <span>Authenticating Secure Session...</span>
              ) : (
                <>
                  <span>Sign In to {accountType === 'buyer' ? 'Buyer Console' : 'Supplier Console'}</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>
        )}

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500">Need an institutional account?</span>
          <button
            onClick={() => router.push('/register')}
            className="font-bold text-blue-700 hover:text-emerald-700 cursor-pointer"
          >
            Register Organization &rarr;
          </button>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2 text-[11px] text-slate-500">
          <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
          <span>Protected by 256-Bit TLS encryption &bull; NAFDAC compliant data storage</span>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;