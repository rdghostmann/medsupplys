import { motion, AnimatePresence } from 'motion/react';
import { PayoutRecord } from '../types';
import { 
  X, Download, Printer, ShieldCheck, 
  ArrowUpRight, Building2, User, Landmark, 
  HelpCircle, CheckCircle2, BadgePercent, Clock
} from 'lucide-react';
import { useState } from 'react';

interface PayoutDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  record: PayoutRecord | null;
}

export default function PayoutDetailsDrawer({ isOpen, onClose, record }: PayoutDetailsDrawerProps) {
  const [downloading, setDownloading] = useState(false);
  const [printing, setPrinting] = useState(false);

  if (!record) return null;

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      // Simulate receipt file download
      const content = `
EARNINGS & PAYOUTS CLEARING HOUSE RECEIPT
=========================================
Reference ID: ${record.id}
Date Issued: ${record.date}
Total Gross: ₦${record.gross.toLocaleString('en-NG')}
Platform Service Fee (10%): ₦${record.platformFee.toLocaleString('en-NG')}
Total Net Paid: ₦${record.netPayout.toLocaleString('en-NG')}
Status: ${record.status}
Destination Bank: ${record.bankAccount?.bankName || 'Guaranty Trust Bank (GTB)'}
=========================================
      `;
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Receipt-${record.id}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 1200);
  };

  const handlePrint = () => {
    setPrinting(true);
    setTimeout(() => {
      setPrinting(false);
      window.print();
    }, 1200);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950 z-50 cursor-pointer"
            id="drawer-backdrop"
          />

          {/* Sliding Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-white shadow-2xl z-50 overflow-y-auto flex flex-col border-l border-slate-100"
            id="drawer-container"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
                    Receipt Number
                  </span>
                  <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md font-bold font-mono">
                    {record.id}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-1 font-sans">Payout Clearings Details</h3>
              </div>
              
              <button
                onClick={onClose}
                className="p-1 px-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors focus:outline-none cursor-pointer"
                id="close-drawer"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* Content area */}
            <div className="flex-1 p-6 space-y-6">
              
              {/* Stepper Status Tracker */}
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                <h4 className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-4">Clearing Milestones</h4>
                
                <div className="space-y-4">
                  {/* Step 1 */}
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">
                        <CheckCircle2 className="w-4.5 h-4.5" />
                      </div>
                      <div className="w-0.5 h-6 bg-emerald-500" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-950">Purchase Orders Audited</p>
                      <p className="text-[11px] text-slate-400">Total volume of {record.ordersCount} sales verified successfully.</p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">
                        <CheckCircle2 className="w-4.5 h-4.5" />
                      </div>
                      <div className="w-0.5 h-6 bg-emerald-500" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-950">Platform Split Fees Settled</p>
                      <p className="text-[11px] text-slate-400">Automated 10% platform fee of ₦{record.platformFee.toLocaleString('en-NG')} debited from gross.</p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        record.status === 'Paid' ? 'bg-emerald-500 text-white' : 'bg-amber-400 text-white'
                      }`}>
                        {record.status === 'Paid' ? (
                          <CheckCircle2 className="w-4.5 h-4.5" />
                        ) : (
                          <Clock className="w-4 h-4" />
                        )}
                      </div>
                      <div className={`w-0.5 h-6 ${record.status === 'Paid' ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-950">Security & Anti-Fraud Clearance</p>
                      <p className="text-[11px] text-slate-400">
                        {record.status === 'Paid' 
                          ? 'Ledgers match. Clearing approved and completed.' 
                          : 'Validating commercial bank routing credentials...'}
                      </p>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        record.status === 'Paid' 
                          ? 'bg-emerald-500 text-white' 
                          : 'bg-slate-100 text-slate-400 border border-slate-200'
                      }`}>
                        {record.status === 'Paid' ? (
                          <ShieldCheck className="w-4.5 h-4.5" />
                        ) : (
                          <Landmark className="w-3.5 h-3.5" />
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-950">Bank Transfer Despatched</p>
                      <p className="text-[11px] text-slate-400">
                        {record.status === 'Paid'
                          ? `Funds fully remitted to associated commercial account on ${record.date}.`
                          : 'Pending settlement initiation clearance.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bank Account Destination Details */}
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                <h4 className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-3 flex items-center gap-1">
                  <Landmark className="w-3.5 h-3.5" />
                  Payout Destination
                </h4>
                
                <div className="grid grid-cols-2 gap-y-3 text-xs">
                  <div>
                    <span className="text-slate-400 block mb-0.5">Beneficiary Bank</span>
                    <span className="font-bold text-slate-800">{record.bankAccount?.bankName || 'Guaranty Trust Bank (GTB)'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Account Number</span>
                    <span className="font-mono font-bold text-slate-800">{record.bankAccount?.accountNumber || '012****345'}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400 block mb-0.5">Account Name</span>
                    <span className="font-bold text-slate-800">{record.bankAccount?.accountName || 'Randal Wilson'}</span>
                  </div>
                </div>
              </div>

              {/* Financial Calculation ledger */}
              <div className="border border-slate-100 rounded-xl overflow-hidden shadow-xs">
                <div className="bg-slate-50 px-4 py-3 border-b border-indigo-50 flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-700 uppercase">Calculation Ledger</span>
                  <span className="text-xs text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-full flex items-center gap-1 font-sans">
                    <BadgePercent className="w-3.5 h-3.5" />
                    10% Service Split
                  </span>
                </div>
                
                <div className="p-4 space-y-3 text-sm">
                  <div className="flex justify-between items-center text-slate-500">
                    <span>Gross Sales Total</span>
                    <span className="font-mono font-semibold">₦{record.gross.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between items-center text-red-500 bg-red-50/40 p-1 px-2 rounded-lg text-xs font-medium">
                    <span>Platform Service Deductions</span>
                    <span className="font-mono">- ₦{record.platformFee.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</span>
                  </div>
                  
                  <div className="border-t border-slate-100 pt-3 flex justify-between items-center font-bold text-slate-900 text-base">
                    <span>Net Settlement Amount</span>
                    <span className="font-mono text-indigo-600">
                      ₦{record.netPayout.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Orders Sub-list */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-3 px-1">
                  Constituent Orders ({record.orders.length})
                </h4>
                
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {record.orders.map((order) => (
                    <div 
                      key={order.id} 
                      className="border border-slate-100 hover:border-slate-200 rounded-xl p-3 flex items-center justify-between text-xs transition-colors bg-white hover:bg-slate-50/30"
                    >
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="font-mono font-bold text-indigo-600">{order.id}</span>
                          <span className="text-[10px] text-slate-400 font-medium">|</span>
                          <span className="text-slate-400 font-medium">{order.date}</span>
                        </div>
                        <span className="font-semibold text-slate-800 block text-xs">{order.customerName}</span>
                        <span className="text-[10px] text-slate-400 block">{order.itemsCount} items purchased</span>
                      </div>
                      
                      <div className="text-right">
                        <span className="font-mono font-bold text-slate-950 block">
                          ₦{order.amount.toLocaleString('en-NG')}
                        </span>
                        <span className="text-[9px] text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded-sm">
                          Deposited
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Sticky Actions bar */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
              <button
                onClick={handlePrint}
                disabled={printing}
                className="flex-1 border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-950 rounded-xl py-3 text-xs font-bold flex items-center justify-center gap-2 transition-all focus:outline-none disabled:opacity-50 cursor-pointer"
                id="btn-print-receipt"
              >
                <Printer className={`w-3.5 h-3.5 ${printing ? 'animate-spin' : ''}`} />
                <span>{printing ? 'Preparing Printer...' : 'Print Receipt'}</span>
              </button>

              <button
                onClick={handleDownload}
                disabled={downloading}
                className="flex-1 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl py-3 text-xs font-bold flex items-center justify-center gap-2 transition-all focus:outline-none hover:shadow-lg hover:shadow-indigo-100 disabled:opacity-50 cursor-pointer"
                id="btn-download-receipt"
              >
                <Download className={`w-3.5 h-3.5 ${downloading ? 'animate-bounce' : ''}`} />
                <span>{downloading ? 'Downloading...' : 'Download Receipt'}</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
