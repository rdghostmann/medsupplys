"use client"
import React, { useState } from "react"

import {
  Building2,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react"
import { MedSupplyLogo } from "@/components/ui/MedSupplyLogo"
import { useRouter } from "next/navigation"
const LoginPage: React.FC = () => {
  const [accountType, setAccountType] = useState<"buyer" | "supplier">("buyer")
  const [email, setEmail] = useState("procurement@cedarcrest.org")
  const [password, setPassword] = useState("••••••••••••")
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoggingIn(true)
    setTimeout(() => {
      setIsLoggingIn(false)
      setLoggedIn(true)
    }, 600)
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-linear-to-b from-white via-blue-50/20 to-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-slate-200/90 bg-white p-8 shadow-xl sm:p-10">
        {/* Header with Official MedSupply Logo */}
        <div className="text-center">
          <button
            onClick={() => router.push("/")}
            className="group mb-4 inline-flex cursor-pointer items-center justify-center"
          >
            <MedSupplyLogo variant="horizontal" size="md" />
          </button>

          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Sign In to Enterprise Portal
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Secure B2B authentication for healthcare buyers and verified
            suppliers
          </p>
        </div>

        {/* Account Role Selector */}
        <div className="flex rounded-xl bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => {
              setAccountType("buyer")
              setEmail("procurement@cedarcrest.org")
            }}
            className={`flex-1 cursor-pointer rounded-lg py-2 text-xs font-bold transition-all ${
              accountType === "buyer"
                ? "bg-linear-to-r from-[#1e40af] to-[#00b87c] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Healthcare Buyer
          </button>
          <button
            type="button"
            onClick={() => {
              setAccountType("supplier")
              setEmail("orders@swipha.com.ng")
            }}
            className={`flex-1 cursor-pointer rounded-lg py-2 text-xs font-bold transition-all ${
              accountType === "supplier"
                ? "bg-linear-to-r from-[#1e40af] to-[#00b87c] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Verified Supplier
          </button>
        </div>

        {loggedIn ? (
          <div className="space-y-4 rounded-xl border border-blue-200 bg-blue-50/60 p-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900">
                Authenticated Successfully
              </h4>
              <p className="mt-1 text-xs text-slate-600">
                Welcome back,{" "}
                {accountType === "buyer"
                  ? "Cedarcrest Hospital Directorate"
                  : "Swiss Pharma Portal"}
                .
              </p>
            </div>
            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={() => {
                  setLoggedIn(false)
                  router.push("/")
                }}
                className="w-full cursor-pointer rounded-xl bg-linear-to-r from-[#1e40af] to-[#00b87c] py-2.5 text-xs font-bold text-white"
              >
                Access Main Dashboard
              </button>
              <button
                onClick={() => {}}
                className="w-full cursor-pointer rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-700"
              >
                Launch Live Quotation Console
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-bold tracking-wider text-slate-700 uppercase">
                Institutional Email Address
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 py-2.5 pr-3.5 pl-9 text-xs text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between">
                <label className="block text-xs font-bold tracking-wider text-slate-700 uppercase">
                  Password
                </label>
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault()
                    alert(
                      "A reset link has been dispatched to your institutional administrator."
                    )
                  }}
                  className="text-[11px] font-semibold text-blue-700 hover:text-emerald-700"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Lock size={16} />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 py-2.5 pr-3.5 pl-9 text-xs text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-600">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded text-blue-700 focus:ring-blue-500"
                />
                <span>Keep session active for 8 hours</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#1e40af] via-[#0284c7] to-[#00b87c] py-3 text-xs font-bold tracking-wide text-white shadow-md shadow-blue-700/20 transition-all hover:from-[#1d4ed8] hover:to-[#059669]"
            >
              {isLoggingIn ? (
                <span>Authenticating Secure Session...</span>
              ) : (
                <>
                  <span>
                    Sign In to{" "}
                    {accountType === "buyer"
                      ? "Buyer Console"
                      : "Supplier Console"}
                  </span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>
        )}

        <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-xs">
          <span className="text-slate-500">Need an institutional account?</span>
          <button
            onClick={() => router.push("/register")}
            className="cursor-pointer font-bold text-blue-700 hover:text-emerald-700"
          >
            Register Organization &rarr;
          </button>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-slate-200/80 bg-slate-50 p-3 text-[11px] text-slate-500">
          <ShieldCheck size={16} className="shrink-0 text-emerald-600" />
          <span>
            Protected by 256-Bit TLS encryption &bull; NAFDAC compliant data
            storage
          </span>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
