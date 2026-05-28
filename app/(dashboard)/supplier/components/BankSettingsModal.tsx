"use client"
import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// import { BankAccountDetails } from '../types';
// import { NIGERIAN_BANKS } from '../data';
import { X, Landmark, User, Hash, HelpCircle, ArrowRight, Loader2, Check } from 'lucide-react';
import { BankAccountDetails, NIGERIAN_BANKS } from '../earnings/components/data';

interface BankSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBank: BankAccountDetails;
  onSave: (updated: BankAccountDetails) => void;
}

export default function BankSettingsModal({ isOpen, onClose, currentBank, onSave }: BankSettingsModalProps) {
  const [bankName, setBankName] = useState(currentBank.bankName);
  const [accountNumber, setAccountNumber] = useState(currentBank.accountNumber.replace(/\*/g, ''));
  const [accountName, setAccountName] = useState(currentBank.accountName);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [errorString, setErrorString] = useState('');

  useEffect(() => {
    if (isOpen) {
      setBankName(currentBank.bankName);
      setAccountNumber(currentBank.accountNumber.replace(/\*/g, ''));
      setAccountName(currentBank.accountName);
      setVerified(false);
      setErrorString('');
    }
  }, [isOpen, currentBank]);

  // Handle auto-lookup simulation when account number is typed
  const handleAccountNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    setAccountNumber(val);
    setVerified(false);
    setErrorString('');

    if (val.length === 10) {
      triggerNIBSSLookup(val, bankName);
    }
  };

  const handleBankChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const nextBank = e.target.value;
    setBankName(nextBank);
    setVerified(false);
    setErrorString('');

    if (accountNumber.length === 10) {
      triggerNIBSSLookup(accountNumber, nextBank);
    }
  };

  const triggerNIBSSLookup = (accNum: string, bank: string) => {
    setVerifying(true);
    setVerified(false);
    setErrorString('');

    setTimeout(() => {
      setVerifying(false);
      if (accNum.startsWith('0') || accNum.startsWith('1') || accNum.startsWith('2') || accNum.startsWith('3')) {
        setAccountName('Randal Wilson');
        setVerified(true);
      } else {
        setErrorString('Could not verify account name. Please check account number and try again.');
        setAccountName('');
      }
    }, 1500);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (accountNumber.length !== 10) {
      setErrorString('Account number must be exactly 10 digits.');
      return;
    }
    if (!verified && !accountName) {
      setErrorString('Please verify the account name before saving.');
      return;
    }

    onSave({
      bankName,
      accountNumber,
      accountName: accountName || 'Randal Wilson'
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950 cursor-pointer"
            id="bank-modal-backdrop"
          />

          {/* Modal card */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.3 }}
            className="relative bg-white rounded-3xl w-full max-w-md h-auto overflow-hidden shadow-2xl z-55 border border-slate-100 p-6 space-y-5"
            id="bank-settings-modal"
          >
            {/* Header controls */}
            <div className="flex justify-between items-center pb-2 border-b border-slate-50">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Landmark className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-950">Settlement Account</h3>
                  <p className="text-[11px] text-slate-400">Manage where automated payouts are cleared.</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1 px-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors focus:outline-none cursor-pointer"
                id="close-bank-modal"
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Bank Choice */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 uppercase flex items-center gap-1">
                  Commercial Bank
                </label>
                <div className="relative">
                  <select
                    value={bankName}
                    onChange={handleBankChange}
                    className="w-full bg-slate-50 hover:bg-slate-100/50 border border-slate-200 focus:border-indigo-500 rounded-xl py-3 px-4 text-sm font-medium outline-none transition-all cursor-pointer appearance-none text-slate-800"
                    id="settlement-bank-select"
                  >
                    {NIGERIAN_BANKS.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-4 text-xs pointer-events-none text-slate-400 font-bold font-sans">
                    ▼
                  </div>
                </div>
              </div>

              {/* Account Number input */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 uppercase">
                  Account Number (NUBAN)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    maxLength={10}
                    placeholder="Enter 10-digit NUBAN number"
                    value={accountNumber}
                    onChange={handleAccountNumberChange}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl py-3 px-4 text-sm font-mono tracking-wider outline-none transition-all placeholder:font-sans font-semibold text-slate-800"
                    id="settlement-account-input"
                  />
                  
                  <div className="absolute right-3 top-3">
                    {verifying && (
                      <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
                    )}
                    {verified && !verifying && (
                      <div className="bg-emerald-50 text-emerald-600 p-0.5 rounded-full" title="Verified with NIBSS Gateway">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Account Name (Auto-looked up) */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 uppercase">
                  Account Name
                </label>
                <input
                  type="text"
                  disabled
                  placeholder="Will resolve automatically..."
                  value={accountName}
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl py-3 px-4 text-sm font-bold text-slate-500 outline-none"
                  id="settlement-account-name"
                />
              </div>

              {/* Error Alert Box */}
              {errorString && (
                <div className="bg-red-50 text-red-700 text-xs p-3 rounded-lg border border-red-100 font-medium">
                  {errorString}
                </div>
              )}

              {/* Secure Info Alert */}
              <div className="bg-indigo-50/50 p-3 rounded-xl border border-indigo-100 flex items-start gap-2.5 text-xs text-indigo-700">
                <HelpCircle className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                <p>
                  Payout deposits require secure commercial verification. Changes are deployed instantly across current automated ledger processing schedules.
                </p>
              </div>

              {/* Action Trigger */}
              <button
                type="submit"
                disabled={verifying || !!errorString || (accountNumber && !accountName)}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-4 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all disabled:opacity-50 hover:shadow-lg hover:shadow-indigo-100 cursor-pointer mt-2"
                id="btn-save-bank-settings"
              >
                <span>Save Bank Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
