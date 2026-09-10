// app/forgot-password/ForgotPasswordPage.tsx
"use client"
import React, { useState, useEffect } from "react"
import {
  Lock,
  Mail,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  KeyRound,
  Smartphone,
  HelpCircle,
  Clock,
  Eye,
  EyeOff,
  RefreshCw,
  AlertCircle,
} from "lucide-react"
import { MedSupplyLogo } from "@/components/ui/MedSupplyLogo"
import { useRouter } from "next/navigation"

type RecoveryStep = "request" | "otp" | "new_password" | "success"
type RecoveryMethod = "email" | "sms" | "admin"

export const ForgotPasswordPage: React.FC = () => {
  const router = useRouter()
  const [accountType, setAccountType] = useState<"buyer" | "supplier">("buyer")
  const [step, setStep] = useState<RecoveryStep>("request")
  const [recoveryMethod, setRecoveryMethod] = useState<RecoveryMethod>("email")
  const [email, setEmail] = useState("procurement@cedarcrest.org")
  const [phone, setPhone] = useState("+234 803 555 0192")
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [timer, setTimer] = useState(60)

  // Password fields
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  // Countdown timer for OTP resend
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (step === "otp" && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [step, timer])

  // Handle role change pre-fill
  const handleRoleChange = (role: "buyer" | "supplier") => {
    setAccountType(role)
    if (role === "buyer") {
      setEmail("procurement@cedarcrest.org")
      setPhone("+234 803 555 0192")
    } else {
      setEmail("orders@swipha.com.ng")
      setPhone("+234 802 333 4810")
    }
  }

  // Step 1 Submit: Request Reset
  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage("")
    if (!email || !email.includes("@")) {
      setErrorMessage("Please enter a valid institutional email address.")
      return
    }

    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setStep("otp")
      setTimer(60)
    }, 800)
  }

  // OTP change handler
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(-1)
    }
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`)
      if (nextInput) {
        nextInput.focus()
      }
    }
  }

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`)
      if (prevInput) {
        prevInput.focus()
      }
    }
  }

  const autofillDemoOtp = () => {
    setOtp(["9", "4", "8", "2", "0", "1"])
    setErrorMessage("")
  }

  // Step 2 Submit: Verify OTP
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage("")
    const enteredCode = otp.join("")
    if (enteredCode.length < 6) {
      setErrorMessage("Please enter the complete 6-digit verification code.")
      return
    }

    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setStep("new_password")
    }, 800)
  }

  // Password requirements calculation
  const hasMinLength = newPassword.length >= 8
  const hasUppercase = /[A-Z]/.test(newPassword)
  const hasNumber = /[0-9]/.test(newPassword)
  const hasSpecial = /[^A-Za-z0-9]/.test(newPassword)
  const passwordsMatch =
    newPassword.length > 0 && newPassword === confirmPassword
  const isPasswordValid =
    hasMinLength && hasUppercase && hasNumber && hasSpecial && passwordsMatch

  // Step 3 Submit: Set New Password
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage("")
    if (!isPasswordValid) {
      setErrorMessage(
        "Please ensure your password meets all enterprise security criteria and passwords match."
      )
      return
    }

    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setStep("success")
    }, 1000)
  }

  return (
    <div className="flex min-h-[85vh] items-center justify-center bg-linear-to-b from-white via-blue-50/20 to-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg space-y-8 rounded-2xl border border-slate-200/90 bg-white p-8 shadow-xl sm:p-10">
        {/* Brand Header */}
        <div className="text-center">
          <button
            onClick={() => router.push("/")}
            className="group mb-4 inline-flex cursor-pointer items-center justify-center focus:outline-hidden"
          >
            <MedSupplyLogo variant="horizontal" size="md" />
          </button>

          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-blue-200/70 bg-blue-50 px-3 py-1 text-[11px] font-semibold tracking-wider text-blue-800 uppercase">
            <KeyRound size={12} className="text-blue-600" />
            Institutional Account Recovery
          </div>

          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
            {step === "request" && "Reset Enterprise Password"}
            {step === "otp" && "Verify Security Authorization"}
            {step === "new_password" && "Create New Secure Password"}
            {step === "success" && "Password Successfully Reset"}
          </h2>
          <p className="mx-auto mt-1 max-w-sm text-xs text-slate-500">
            {step === "request" &&
              "Enter your verified institutional credentials to receive a secure authorization token."}
            {step === "otp" &&
              `Enter the 6-digit authentication token dispatched to ${email}.`}
            {step === "new_password" &&
              "Configure a compliant, high-entropy password for your healthcare organization."}
            {step === "success" &&
              "Your credentials have been securely updated and active sessions rotated."}
          </p>
        </div>

        {/* Multi-step progress track */}
        <div className="relative flex items-center justify-between px-4">
          <div className="absolute top-1/2 right-8 left-8 z-0 h-0.5 -translate-y-1/2 bg-slate-100" />

          <div className="relative z-10 flex flex-col items-center">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
                step === "request"
                  ? "bg-linear-to-r from-[#1e40af] to-[#00b87c] text-white shadow-xs"
                  : "bg-emerald-500 text-white"
              }`}
            >
              {step === "request" ? "1" : <CheckCircle2 size={16} />}
            </div>
            <span className="mt-1 text-[10px] font-medium text-slate-500">
              Identity
            </span>
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
                step === "otp"
                  ? "bg-linear-to-r from-[#1e40af] to-[#00b87c] text-white shadow-xs ring-2 ring-blue-100"
                  : step === "new_password" || step === "success"
                    ? "bg-emerald-500 text-white"
                    : "bg-slate-100 text-slate-400"
              }`}
            >
              {step === "new_password" || step === "success" ? (
                <CheckCircle2 size={16} />
              ) : (
                "2"
              )}
            </div>
            <span className="mt-1 text-[10px] font-medium text-slate-500">
              Verify
            </span>
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
                step === "new_password"
                  ? "bg-linear-to-r from-[#1e40af] to-[#00b87c] text-white shadow-xs ring-2 ring-blue-100"
                  : step === "success"
                    ? "bg-emerald-500 text-white"
                    : "bg-slate-100 text-slate-400"
              }`}
            >
              {step === "success" ? <CheckCircle2 size={16} /> : "3"}
            </div>
            <span className="mt-1 text-[10px] font-medium text-slate-500">
              New Key
            </span>
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
                step === "success"
                  ? "bg-linear-to-r from-[#1e40af] to-[#00b87c] text-white shadow-xs"
                  : "bg-slate-100 text-slate-400"
              }`}
            >
              4
            </div>
            <span className="mt-1 text-[10px] font-medium text-slate-500">
              Ready
            </span>
          </div>
        </div>

        {/* Error notification banner */}
        {errorMessage && (
          <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
            <AlertCircle size={16} className="shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* STEP 1: Request Reset */}
        {step === "request" && (
          <form onSubmit={handleRequestSubmit} className="space-y-5">
            {/* Account Role Selector */}
            <div>
              <label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-700 uppercase">
                Select Account Designation
              </label>
              <div className="flex rounded-xl bg-slate-100 p-1">
                <button
                  type="button"
                  onClick={() => handleRoleChange("buyer")}
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
                  onClick={() => handleRoleChange("supplier")}
                  className={`flex-1 cursor-pointer rounded-lg py-2 text-xs font-bold transition-all ${
                    accountType === "supplier"
                      ? "bg-linear-to-r from-[#1e40af] to-[#00b87c] text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Verified Supplier
                </button>
              </div>
            </div>

            {/* Email Address */}
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
                  placeholder={
                    accountType === "buyer"
                      ? "procurement@hospital.org"
                      : "orders@pharma-distributor.ng"
                  }
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 py-2.5 pr-3.5 pl-9 text-xs text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:outline-hidden"
                />
              </div>
              <p className="mt-1 text-[11px] text-slate-500">
                Must match your Pharmacists Council (PCN) or corporate registry
                profile.
              </p>
            </div>

            {/* Verification Delivery Channel */}
            <div>
              <label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-700 uppercase">
                Preferred Authorization Channel
              </label>
              <div className="space-y-2">
                <label
                  onClick={() => setRecoveryMethod("email")}
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-all ${
                    recoveryMethod === "email"
                      ? "border-blue-500/60 bg-blue-50/50 ring-1 ring-blue-500/20"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="recovery_method"
                    checked={recoveryMethod === "email"}
                    onChange={() => setRecoveryMethod("email")}
                    className="mt-0.5 text-blue-700"
                  />
                  <div className="text-left">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                      <Mail size={14} className="text-blue-700" />
                      <span>Email Authentication Token</span>
                    </div>
                    <p className="mt-0.5 text-[11px] text-slate-500">
                      Send a 6-digit cryptographic security code to your
                      registered corporate domain.
                    </p>
                  </div>
                </label>

                <label
                  onClick={() => setRecoveryMethod("sms")}
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-all ${
                    recoveryMethod === "sms"
                      ? "border-blue-500/60 bg-blue-50/50 ring-1 ring-blue-500/20"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="recovery_method"
                    checked={recoveryMethod === "sms"}
                    onChange={() => setRecoveryMethod("sms")}
                    className="mt-0.5 text-blue-700"
                  />
                  <div className="text-left">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                      <Smartphone size={14} className="text-blue-700" />
                      <span>
                        SMS OTP to Designated Pharmacist ({phone.slice(0, 7)}
                        ****)
                      </span>
                    </div>
                    <p className="mt-0.5 text-[11px] text-slate-500">
                      Direct SMS token to the authorized pharmacy
                      director&apos;s registered phone.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#1e40af] via-[#0284c7] to-[#00b87c] py-3 text-xs font-bold tracking-wide text-white shadow-md shadow-blue-700/20 transition-all hover:from-[#1d4ed8] hover:to-[#059669]"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  <span>Dispatching Security Token...</span>
                </>
              ) : (
                <>
                  <span>Send Recovery Authorization</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>
        )}

        {/* STEP 2: OTP Verification */}
        {step === "otp" && (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-3.5 text-xs text-slate-700">
              <p className="font-semibold text-blue-950">
                Security Token Dispatched
              </p>
              <p className="mt-0.5 text-[11px] text-slate-600">
                We sent a 6-digit one-time passcode to{" "}
                <strong className="text-slate-900">{email}</strong>. Please
                check your inbox or spam filter.
              </p>
            </div>

            {/* 6 Digit OTP Inputs */}
            <div>
              <label className="mb-2 block text-center text-xs font-bold tracking-wider text-slate-700 uppercase">
                Enter 6-Digit Passcode
              </label>
              <div className="flex justify-center gap-2 sm:gap-3">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-input-${idx}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    className="h-12 w-11 rounded-xl border border-slate-200 bg-slate-50/50 text-center font-mono text-lg font-bold text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:outline-hidden"
                  />
                ))}
              </div>
            </div>

            {/* Demo Helper Pill */}
            <div className="flex justify-center">
              <button
                type="button"
                onClick={autofillDemoOtp}
                className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold text-emerald-800 transition-colors hover:bg-emerald-100"
              >
                <CheckCircle2 size={13} className="text-emerald-600" />
                <span>Quick Demo: Auto-fill valid code (948201)</span>
              </button>
            </div>

            {/* Resend Countdown */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-1 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <Clock size={13} />
                <span>
                  {timer === 0 ? "Token expired" : `Token expires in ${timer}s`}
                </span>
              </div>
              <button
                type="button"
                disabled={timer !== 0}
                onClick={() => {
                  setTimer(60)
                }}
                className={`cursor-pointer font-semibold ${
                  timer === 0
                    ? "text-blue-700 hover:text-emerald-700"
                    : "cursor-not-allowed text-slate-400"
                }`}
              >
                Resend Code
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep("request")}
                className="flex flex-1 cursor-pointer items-center justify-center gap-1 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-50"
              >
                <ArrowLeft size={14} />
                <span>Back</span>
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex flex-2 cursor-pointer items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#1e40af] via-[#0284c7] to-[#00b87c] py-2.5 text-xs font-bold text-white shadow-md shadow-blue-700/20 transition-all hover:from-[#1d4ed8] hover:to-[#059669]"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    <span>Verifying Code...</span>
                  </>
                ) : (
                  <>
                    <span>Verify &amp; Proceed</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: Create New Password */}
        {step === "new_password" && (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-bold tracking-wider text-slate-700 uppercase">
                New Enterprise Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Lock size={16} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Create high-entropy password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 py-2.5 pr-10 pl-9 text-xs text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold tracking-wider text-slate-700 uppercase">
                Confirm New Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Lock size={16} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Re-enter password to match"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 py-2.5 pr-3.5 pl-9 text-xs text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Password Requirements Checklist */}
            <div className="space-y-1.5 rounded-xl border border-slate-200/80 bg-slate-50 p-3.5 text-[11px]">
              <p className="mb-1 text-xs font-bold text-slate-700">
                Healthcare Security Standards
              </p>

              <div className="flex items-center gap-2">
                <div
                  className={`flex h-3.5 w-3.5 items-center justify-center rounded-full text-[10px] ${
                    hasMinLength
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-200 text-slate-400"
                  }`}
                >
                  ✓
                </div>
                <span
                  className={
                    hasMinLength
                      ? "font-medium text-slate-900"
                      : "text-slate-500"
                  }
                >
                  At least 8 characters
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div
                  className={`flex h-3.5 w-3.5 items-center justify-center rounded-full text-[10px] ${
                    hasUppercase
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-200 text-slate-400"
                  }`}
                >
                  ✓
                </div>
                <span
                  className={
                    hasUppercase
                      ? "font-medium text-slate-900"
                      : "text-slate-500"
                  }
                >
                  At least 1 uppercase letter (A-Z)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div
                  className={`flex h-3.5 w-3.5 items-center justify-center rounded-full text-[10px] ${
                    hasNumber
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-200 text-slate-400"
                  }`}
                >
                  ✓
                </div>
                <span
                  className={
                    hasNumber ? "font-medium text-slate-900" : "text-slate-500"
                  }
                >
                  At least 1 numerical digit (0-9)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div
                  className={`flex h-3.5 w-3.5 items-center justify-center rounded-full text-[10px] ${
                    hasSpecial
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-200 text-slate-400"
                  }`}
                >
                  ✓
                </div>
                <span
                  className={
                    hasSpecial ? "font-medium text-slate-900" : "text-slate-500"
                  }
                >
                  At least 1 special character (!@#$%^&amp;*)
                </span>
              </div>

              <div className="flex items-center gap-2 border-t border-slate-200/60 pt-1">
                <div
                  className={`flex h-3.5 w-3.5 items-center justify-center rounded-full text-[10px] ${
                    passwordsMatch
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-200 text-slate-400"
                  }`}
                >
                  ✓
                </div>
                <span
                  className={
                    passwordsMatch
                      ? "font-semibold text-emerald-700"
                      : "text-slate-500"
                  }
                >
                  Passwords match
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !isPasswordValid}
              className={`flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold tracking-wide shadow-md transition-all ${
                isPasswordValid && !isSubmitting
                  ? "bg-linear-to-r from-[#1e40af] via-[#0284c7] to-[#00b87c] text-white shadow-blue-700/20 hover:from-[#1d4ed8] hover:to-[#059669]"
                  : "cursor-not-allowed bg-slate-200 text-slate-400 shadow-none"
              }`}
            >
              {isSubmitting ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  <span>Encrypting &amp; Updating Credentials...</span>
                </>
              ) : (
                <>
                  <span>Save Password &amp; Update Access</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>
        )}

        {/* STEP 4: Success Screen */}
        {step === "success" && (
          <div className="space-y-4 rounded-2xl border border-blue-200 bg-blue-50/50 p-6 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-md shadow-emerald-600/20">
              <CheckCircle2 size={30} />
            </div>

            <div>
              <h4 className="text-lg font-bold text-slate-900">
                Credentials Updated Successfully
              </h4>
              <p className="mx-auto mt-2 max-w-sm text-xs leading-relaxed text-slate-600">
                Your password has been changed for{" "}
                <strong className="text-slate-900">{email}</strong>. In
                compliance with NAFDAC Good Distribution Practices and
                healthcare data security protocols, all previous active sessions
                have been invalidated.
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={() => router.push("/login")}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#1e40af] via-[#0284c7] to-[#00b87c] py-3 text-xs font-bold text-white shadow-md shadow-blue-700/20 transition-all hover:from-[#1d4ed8] hover:to-[#059669]"
              >
                <span>
                  Sign In to{" "}
                  {accountType === "buyer"
                    ? "Buyer Console"
                    : "Supplier Console"}
                </span>
                <ArrowRight size={14} />
              </button>

              <button
                onClick={() => router.push("/")}
                className="w-full cursor-pointer rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-white"
              >
                Return to MedSupply Home
              </button>
            </div>
          </div>
        )}

        {/* Return to Sign In Link */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-xs">
          <span className="text-slate-500">Remembered your credentials?</span>
          <button
            onClick={() => router.push("/login")}
            className="flex cursor-pointer items-center gap-1 font-bold text-blue-700 hover:text-emerald-700"
          >
            <span>Back to Sign In</span>
            <ArrowRight size={12} />
          </button>
        </div>

        {/* Emergency clinical support note */}
        <div className="flex items-start gap-2.5 rounded-xl border border-slate-200/80 bg-slate-50 p-3.5 text-[11px] text-slate-600">
          <HelpCircle size={16} className="mt-0.5 shrink-0 text-blue-700" />
          <div className="leading-relaxed">
            <span className="font-bold text-slate-800">
              Urgent Clinical Replenishment?
            </span>{" "}
            If your facility requires immediate access for critical care or ICU
            drug requisitions, please contact the 24/7 MedSupply Sourcing Desk
            at <strong className="text-slate-800">+234 800 MEDSUPPLY</strong> or{" "}
            <strong className="text-slate-800">
              urgent@medsupply.healthcare
            </strong>
            .
          </div>
        </div>

        {/* Security & compliance footer strip */}
        <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
          <ShieldCheck size={14} className="text-emerald-600" />
          <span>
            256-Bit TLS Encryption &bull; PCN &amp; NAFDAC Audit Trail Enforced
          </span>
        </div>
      </div>
    </div>
  )
}
