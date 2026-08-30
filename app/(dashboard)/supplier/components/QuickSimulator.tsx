import { useState } from 'react';
import { Sparkles, RefreshCw, ChevronUp, ChevronDown, CheckCheck, Landmark } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface QuickSimulatorProps {
  onSimulateSale: (customer: string, amount: number) => void;
  onClearPending: () => void;
  hasPendingPayouts: boolean;
  bankAccountName: string;
}

export default function QuickSimulator({
  onSimulateSale,
  onClearPending,
  hasPendingPayouts,
  bankAccountName,
}: QuickSimulatorProps) {
  const [minimized, setMinimized] = useState(false);
  const [payoutClearing, setPayoutClearing] = useState(false);

  const mockCustomers = [
    'Amaka Obi',
    'Yusuf Katsina',
    'Olawale Kehinde',
    'Ngozi Eze',
    'Adebayo Adelabu',
    'Yetunde Thomas',
    'Hassan Aliyu',
    'Femi Falana'
  ];

  const handleSimulateSale = () => {
    const randomCustomer = mockCustomers[Math.floor(Math.random() * mockCustomers.length)];
    // Random sale amount between 15K and 95K
    const randomAmount = Math.floor(Math.random() * 80 + 15) * 1000;
    onSimulateSale(randomCustomer, randomAmount);
  };

  const handleClearPending = () => {
    setPayoutClearing(true);
    setTimeout(() => {
      onClearPending();
      setPayoutClearing(false);
    }, 1500);
  };

  return (
    <div 
      className="hidden bottom-6 left-6 z-40 bg-slate-900 text-white rounded-2xl shadow-xl shadow-slate-900/40 border border-slate-800 w-72 overflow-hidden transition-all duration-300" 
      // className="fixed bottom-6 left-6 z-40 bg-slate-900 text-white rounded-2xl shadow-xl shadow-slate-900/40 border border-slate-800 w-72 overflow-hidden transition-all duration-300" 
      id="quick-simulator-widget"
    >
      {/* Header Bar */}
      <div 
        onClick={() => setMinimized(!minimized)}
        className="px-4 py-3 bg-slate-950 flex items-center justify-between cursor-pointer select-none border-b border-slate-800 hover:bg-slate-900 transition-colors"
      >
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '3s' }} />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-200">Interactive Controls</span>
        </div>
        
        {minimized ? (
          <ChevronUp className="w-4 h-4 text-slate-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-400" />
        )}
      </div>

      {/* Simulator Actions */}
      <AnimatePresence>
        {!minimized && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="p-4 space-y-3.5 text-xs"
          >
            <p className="text-[11px] text-slate-400">
              Simulate sales streams or bank payouts to test state transitions dynamically.
            </p>

            <div className="space-y-2">
              {/* Action 1 */}
              <button
                onClick={handleSimulateSale}
                className="w-full bg-slate-800 hover:bg-slate-700 active:bg-slate-700/80 border border-slate-700 hover:border-slate-600 rounded-xl py-2.5 px-3 flex items-center justify-between transition-colors focus:outline-none cursor-pointer text-left"
                id="sim-sale-trigger"
                title="Simulate an online checkout purchase order"
              >
                <span className="font-semibold text-slate-200">Receive New Sale</span>
                <span className="bg-amber-500/10 text-amber-400 font-mono text-[10px] px-2 py-0.5 rounded-md font-bold">
                  + ₦15K - ₦95K
                </span>
              </button>

              {/* Action 2 */}
              <button
                onClick={handleClearPending}
                disabled={!hasPendingPayouts || payoutClearing}
                className="w-full bg-indigo-600 hover:bg-indigo-5050 active:bg-indigo-700 hover:bg-indigo-700 text-white rounded-xl py-2.5 px-3 flex items-center justify-between transition-colors focus:outline-none disabled:opacity-40 disabled:hover:bg-slate-800 disabled:border-slate-700 disabled:text-slate-500 disabled:pointer-events-none cursor-pointer text-left"
                id="sim-clearance-trigger"
                title="Reconcile and clear all pending settlements immediately"
              >
                <span className="font-semibold">Reconcile Pending</span>
                {payoutClearing ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <CheckCheck className="w-3.5 h-3.5 text-indigo-200" />
                )}
              </button>
            </div>

            {/* Config State Footer Display */}
            <div className="border-t border-slate-800 pt-3 flex items-center gap-2 text-[10px] text-slate-400">
              <Landmark className="w-3 h-3 text-slate-500" />
              <span>Verified Account name: <span className="text-slate-200 font-semibold">{bankAccountName}</span></span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
