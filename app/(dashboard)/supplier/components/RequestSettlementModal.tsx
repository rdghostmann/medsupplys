import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BankAccountDetails } from '../types';
import { X, Landmark, Coins, ArrowRight, Loader2, CheckCircle2, ShieldCheck } from 'lucide-react';

interface RequestSettlementModalProps {
  isOpen: boolean;
  onClose: () => void;
  pendingAmount: number;
  bankInfo: BankAccountDetails;
  onInitiateSettlement: (amount: number) => void;
}

export default function RequestSettlementModal({
  isOpen,
  onClose,
  pendingAmount,
  bankInfo,
  onInitiateSettlement,
}: RequestSettlementModalProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (pendingAmount <= 0) return;

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      
      // Fire callback after animation
      setTimeout(() => {
        onInitiateSettlement(pendingAmount);
        setSuccess(false);
        onClose();
      }, 1500);
    }, 2000);
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
            id="settlement-modal-backdrop"
          />

          {/* Modal card */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.3 }}
            className="relative bg-white rounded-3xl w-full max-w-sm h-auto overflow-hidden shadow-2xl z-55 border border-slate-100 p-6 space-y-5"
            id="request-settlement-modal"
          >
            {/* Header controls - show only if not success */}
            {!success && (
              <div className="flex justify-between items-center pb-2 border-b border-slate-50">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                    <Coins className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-950 block">Request Settlement</h3>
                    <p className="text-[11px] text-slate-400">Initiate bank sweep of available funds.</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-1 px-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors focus:outline-none cursor-pointer"
                  id="close-settlement-modal"
                >
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            )}

            {/* Content states */}
            {success ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-6 flex flex-col items-center justify-center text-center space-y-4"
                id="settlement-success-view"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mb-2">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-950 font-sans">Settlement Requested!</h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                    A payout of <span className="font-mono font-bold text-slate-950">₦{pendingAmount.toLocaleString('en-NG')}</span> has been queued. Verification reports will update shortly.
                  </p>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Visual Amount Display */}
                <div className="bg-slate-50 border border-slate-100/80 rounded-2xl p-5 text-center space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Available Balance
                  </span>
                  <span className="text-3xl font-extrabold text-slate-950 tracking-tight font-mono block">
                    ₦{pendingAmount.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-1">
                    Free Instant Settlement
                  </span>
                </div>

                {/* Bank Account review box */}
                <div className="border border-slate-100 rounded-xl p-3.5 space-y-2.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Paying Out To:
                  </span>
                  
                  <div className="flex items-center gap-3 bg-violet-50/20 p-2.5 rounded-lg">
                    <Landmark className="w-5 h-5 text-indigo-500 shrink-0" />
                    <div className="text-xs">
                      <span className="font-bold text-slate-800 block">{bankInfo.bankName}</span>
                      <span className="font-mono text-slate-500 font-semibold">{bankInfo.accountNumber}</span>
                      <span className="text-slate-400 block mt-0.5">{bankInfo.accountName}</span>
                    </div>
                  </div>
                </div>

                {/* Audit & security confirmation */}
                <div className="flex items-start gap-2 text-[10px] text-slate-400 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <p>
                    Clearance processing matches active NIBSS standard settlement contracts. Transactions are secured with high-grade clearing keys.
                  </p>
                </div>

                {/* Action Trigger button */}
                <button
                  type="submit"
                  disabled={loading || pendingAmount <= 0}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-4 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all disabled:opacity-50 hover:shadow-lg hover:shadow-indigo-100 cursor-pointer"
                  id="btn-confirm-settlement"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4.5 h-4.5 text-white animate-spin" />
                      <span>Initiating Settlement...</span>
                    </>
                  ) : (
                    <>
                      <span>Transfer ₦{pendingAmount.toLocaleString('en-NG')}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

              </form>
            )}

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
