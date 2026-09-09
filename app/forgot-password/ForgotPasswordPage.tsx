// app/forgot-password/ForgotPasswordPage.tsx
"use client"
import React, { useState, useEffect } from 'react';
import {
  Building2,
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
  AlertCircle
} from 'lucide-react';
import { MedSupplyLogo } from '@/components/ui/MedSupplyLogo';
import { useRouter } from 'next/navigation';

type RecoveryStep = 'request' | 'otp' | 'new_password' | 'success';
type RecoveryMethod = 'email' | 'sms' | 'admin';

export const ForgotPasswordPage: React.FC = () => {
  const router = useRouter();
  const [accountType, setAccountType] = useState<'buyer' | 'supplier'>('buyer');
  const [step, setStep] = useState<RecoveryStep>('request');
  const [recoveryMethod, setRecoveryMethod] = useState<RecoveryMethod>('email');
  const [email, setEmail] = useState('procurement@cedarcrest.org');
  const [phone, setPhone] = useState('+234 803 555 0192');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);

  // Password fields
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Countdown timer for OTP resend
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  // Handle role change pre-fill
  const handleRoleChange = (role: 'buyer' | 'supplier') => {
    setAccountType(role);
    if (role === 'buyer') {
      setEmail('procurement@cedarcrest.org');
      setPhone('+234 803 555 0192');
    } else {
      setEmail('orders@swipha.com.ng');
      setPhone('+234 802 333 4810');
    }
  };

  // Step 1 Submit: Request Reset
  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid institutional email address.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep('otp');
      setTimer(60);
    }, 800);
  };

  // OTP change handler
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(-1);
    }
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
      }
    }
  };

  const autofillDemoOtp = () => {
    setOtp(['9', '4', '8', '2', '0', '1']);
    setErrorMessage('');
  };

  // Step 2 Submit: Verify OTP
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const enteredCode = otp.join('');
    if (enteredCode.length < 6) {
      setErrorMessage('Please enter the complete 6-digit verification code.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep('new_password');
    }, 800);
  };

  // Password requirements calculation
  const hasMinLength = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;
  const isPasswordValid = hasMinLength && hasUppercase && hasNumber && hasSpecial && passwordsMatch;

  // Step 3 Submit: Set New Password
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!isPasswordValid) {
      setErrorMessage('Please ensure your password meets all enterprise security criteria and passwords match.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep('success');
    }, 1000);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-linear-to-b from-white via-blue-50/20 to-white">
      <div className="max-w-lg w-full space-y-8 bg-white p-8 sm:p-10 rounded-2xl border border-slate-200/90 shadow-xl">

        {/* Brand Header */}
        <div className="text-center">
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center justify-center mb-4 group cursor-pointer focus:outline-hidden"
          >
            <MedSupplyLogo variant="horizontal" size="md" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/70 text-blue-800 text-[11px] font-semibold uppercase tracking-wider mb-2">
            <KeyRound size={12} className="text-blue-600" />
            Institutional Account Recovery
          </div>

          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {step === 'request' && 'Reset Enterprise Password'}
            {step === 'otp' && 'Verify Security Authorization'}
            {step === 'new_password' && 'Create New Secure Password'}
            {step === 'success' && 'Password Successfully Reset'}
          </h2>
          <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
            {step === 'request' && 'Enter your verified institutional credentials to receive a secure authorization token.'}
            {step === 'otp' && `Enter the 6-digit authentication token dispatched to ${email}.`}
            {step === 'new_password' && 'Configure a compliant, high-entropy password for your healthcare organization.'}
            {step === 'success' && 'Your credentials have been securely updated and active sessions rotated.'}
          </p>
        </div>

        {/* Multi-step progress track */}
        <div className="flex items-center justify-between relative px-4">
          <div className="absolute top-1/2 left-8 right-8 h-0.5 bg-slate-100 -translate-y-1/2 z-0" />

          <div className="relative z-10 flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step === 'request'
                ? 'bg-linear-to-r from-[#1e40af] to-[#00b87c] text-white shadow-xs'
                : 'bg-emerald-500 text-white'
              }`}>
              {step === 'request' ? '1' : <CheckCircle2 size={16} />}
            </div>
            <span className="text-[10px] font-medium text-slate-500 mt-1">Identity</span>
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step === 'otp'
                ? 'bg-linear-to-r from-[#1e40af] to-[#00b87c] text-white shadow-xs ring-2 ring-blue-100'
                : step === 'new_password' || step === 'success'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-100 text-slate-400'
              }`}>
              {step === 'new_password' || step === 'success' ? <CheckCircle2 size={16} /> : '2'}
            </div>
            <span className="text-[10px] font-medium text-slate-500 mt-1">Verify</span>
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step === 'new_password'
                ? 'bg-linear-to-r from-[#1e40af] to-[#00b87c] text-white shadow-xs ring-2 ring-blue-100'
                : step === 'success'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-100 text-slate-400'
              }`}>
              {step === 'success' ? <CheckCircle2 size={16} /> : '3'}
            </div>
            <span className="text-[10px] font-medium text-slate-500 mt-1">New Key</span>
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step === 'success'
                ? 'bg-linear-to-r from-[#1e40af] to-[#00b87c] text-white shadow-xs'
                : 'bg-slate-100 text-slate-400'
              }`}>
              4
            </div>
            <span className="text-[10px] font-medium text-slate-500 mt-1">Ready</span>
          </div>
        </div>

        {/* Error notification banner */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* STEP 1: Request Reset */}
        {step === 'request' && (
          <form onSubmit={handleRequestSubmit} className="space-y-5">
            {/* Account Role Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Select Account Designation
              </label>
              <div className="flex bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => handleRoleChange('buyer')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${accountType === 'buyer'
                      ? 'bg-linear-to-r from-[#1e40af] to-[#00b87c] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                  Healthcare Buyer
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleChange('supplier')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${accountType === 'supplier'
                      ? 'bg-linear-to-r from-[#1e40af] to-[#00b87c] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                  Verified Supplier
                </button>
              </div>
            </div>

            {/* Email Address */}
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
                  placeholder={accountType === 'buyer' ? 'procurement@hospital.org' : 'orders@pharma-distributor.ng'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>
              <p className="mt-1 text-[11px] text-slate-500">
                Must match your Pharmacists Council (PCN) or corporate registry profile.
              </p>
            </div>

            {/* Verification Delivery Channel */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Preferred Authorization Channel
              </label>
              <div className="space-y-2">
                <label
                  onClick={() => setRecoveryMethod('email')}
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${recoveryMethod === 'email'
                      ? 'bg-blue-50/50 border-blue-500/60 ring-1 ring-blue-500/20'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                >
                  <input
                    type="radio"
                    name="recovery_method"
                    checked={recoveryMethod === 'email'}
                    onChange={() => setRecoveryMethod('email')}
                    className="mt-0.5 text-blue-700"
                  />
                  <div className="text-left">
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Mail size={14} className="text-blue-700" />
                      <span>Email Authentication Token</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Send a 6-digit cryptographic security code to your registered corporate domain.
                    </p>
                  </div>
                </label>

                <label
                  onClick={() => setRecoveryMethod('sms')}
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${recoveryMethod === 'sms'
                      ? 'bg-blue-50/50 border-blue-500/60 ring-1 ring-blue-500/20'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                >
                  <input
                    type="radio"
                    name="recovery_method"
                    checked={recoveryMethod === 'sms'}
                    onChange={() => setRecoveryMethod('sms')}
                    className="mt-0.5 text-blue-700"
                  />
                  <div className="text-left">
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Smartphone size={14} className="text-blue-700" />
                      <span>SMS OTP to Designated Pharmacist ({phone.slice(0, 7)}****)</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Direct SMS token to the authorized pharmacy director&apos;s registered phone.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-linear-to-r from-[#1e40af] via-[#0284c7] to-[#00b87c] hover:from-[#1d4ed8] hover:to-[#059669] text-white font-bold text-xs tracking-wide shadow-md shadow-blue-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
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
        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200 text-xs text-slate-700">
              <p className="font-semibold text-blue-950">Security Token Dispatched</p>
              <p className="text-[11px] text-slate-600 mt-0.5">
                We sent a 6-digit one-time passcode to <strong className="text-slate-900">{email}</strong>. Please check your inbox or spam filter.
              </p>
            </div>

            {/* 6 Digit OTP Inputs */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 text-center">
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
                    className="w-11 h-12 text-center text-lg font-bold text-slate-900 font-mono rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-slate-50/50"
                  />
                ))}
              </div>
            </div>

            {/* Demo Helper Pill */}
            <div className="flex justify-center">
              <button
                type="button"
                onClick={autofillDemoOtp}
                className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-[11px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <CheckCircle2 size={13} className="text-emerald-600" />
                <span>Quick Demo: Auto-fill valid code (948201)</span>
              </button>
            </div>

            {/* Resend Countdown */}
            <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
              <div className="flex items-center gap-1.5">
                <Clock size={13} />
                <span>
                  {timer === 0 ? 'Token expired' : `Token expires in ${timer}s`}
                </span>
              </div>
              <button
                type="button"
                disabled={timer !== 0}
                onClick={() => {
                  setTimer(60);
                }}
                className={`font-semibold cursor-pointer ${timer === 0 ? 'text-blue-700 hover:text-emerald-700' : 'text-slate-400 cursor-not-allowed'
                  }`}
              >
                Resend Code
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep('request')}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors cursor-pointer flex items-center justify-center gap-1"
              >
                <ArrowLeft size={14} />
                <span>Back</span>
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-2 py-2.5 rounded-xl bg-linear-to-r from-[#1e40af] via-[#0284c7] to-[#00b87c] hover:from-[#1d4ed8] hover:to-[#059669] text-white font-bold text-xs shadow-md shadow-blue-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
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
        {step === 'new_password' && (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                New Enterprise Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock size={16} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Create high-entropy password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock size={16} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Re-enter password to match"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>
            </div>

            {/* Password Requirements Checklist */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5 text-[11px]">
              <p className="font-bold text-slate-700 text-xs mb-1">Healthcare Security Standards</p>

              <div className="flex items-center gap-2">
                <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] ${hasMinLength ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-400'
                  }`}>
                  ✓
                </div>
                <span className={hasMinLength ? 'text-slate-900 font-medium' : 'text-slate-500'}>
                  At least 8 characters
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] ${hasUppercase ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-400'
                  }`}>
                  ✓
                </div>
                <span className={hasUppercase ? 'text-slate-900 font-medium' : 'text-slate-500'}>
                  At least 1 uppercase letter (A-Z)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] ${hasNumber ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-400'
                  }`}>
                  ✓
                </div>
                <span className={hasNumber ? 'text-slate-900 font-medium' : 'text-slate-500'}>
                  At least 1 numerical digit (0-9)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] ${hasSpecial ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-400'
                  }`}>
                  ✓
                </div>
                <span className={hasSpecial ? 'text-slate-900 font-medium' : 'text-slate-500'}>
                  At least 1 special character (!@#$%^&amp;*)
                </span>
              </div>

              <div className="flex items-center gap-2 pt-1 border-t border-slate-200/60">
                <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] ${passwordsMatch ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-400'
                  }`}>
                  ✓
                </div>
                <span className={passwordsMatch ? 'text-emerald-700 font-semibold' : 'text-slate-500'}>
                  Passwords match
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !isPasswordValid}
              className={`w-full py-3 rounded-xl font-bold text-xs tracking-wide shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${isPasswordValid && !isSubmitting
                  ? 'bg-linear-to-r from-[#1e40af] via-[#0284c7] to-[#00b87c] hover:from-[#1d4ed8] hover:to-[#059669] text-white shadow-blue-700/20'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
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
        {step === 'success' && (
          <div className="p-6 rounded-2xl bg-blue-50/50 border border-blue-200 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md shadow-emerald-600/20">
              <CheckCircle2 size={30} />
            </div>

            <div>
              <h4 className="text-lg font-bold text-slate-900">
                Credentials Updated Successfully
              </h4>
              <p className="text-xs text-slate-600 mt-2 max-w-sm mx-auto leading-relaxed">
                Your password has been changed for <strong className="text-slate-900">{email}</strong>.
                In compliance with NAFDAC Good Distribution Practices and healthcare data security protocols,
                all previous active sessions have been invalidated.
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => router.push('/login')}
                className="w-full py-3 rounded-xl bg-linear-to-r from-[#1e40af] via-[#0284c7] to-[#00b87c] hover:from-[#1d4ed8] hover:to-[#059669] text-white text-xs font-bold shadow-md shadow-blue-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Sign In to {accountType === 'buyer' ? 'Buyer Console' : 'Supplier Console'}</span>
                <ArrowRight size={14} />
              </button>

              <button
                onClick={() => router.push('/')}
                className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-white transition-colors cursor-pointer"
              >
                Return to MedSupply Home
              </button>
            </div>
          </div>
        )}

        {/* Return to Sign In Link */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500">Remembered your credentials?</span>
          <button
            onClick={() => router.push('/login')}
            className="font-bold text-blue-700 hover:text-emerald-700 cursor-pointer flex items-center gap-1"
          >
            <span>Back to Sign In</span>
            <ArrowRight size={12} />
          </button>
        </div>

        {/* Emergency clinical support note */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5 text-[11px] text-slate-600">
          <HelpCircle size={16} className="text-blue-700 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold text-slate-800">Urgent Clinical Replenishment?</span> If your facility requires immediate access for critical care or ICU drug requisitions, please contact the 24/7 MedSupply Sourcing Desk at <strong className="text-slate-800">+234 800 MEDSUPPLY</strong> or <strong className="text-slate-800">urgent@medsupply.healthcare</strong>.
          </div>
        </div>

        {/* Security & compliance footer strip */}
        <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
          <ShieldCheck size={14} className="text-emerald-600" />
          <span>256-Bit TLS Encryption &bull; PCN &amp; NAFDAC Audit Trail Enforced</span>
        </div>

      </div>
    </div>
  );
};
