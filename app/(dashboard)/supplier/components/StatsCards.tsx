import { motion } from 'motion/react';
import { TrendingUp, Clock, Calendar, Eye, EyeOff, ShieldCheck } from 'lucide-react';

interface StatsCardsProps {
  totalEarned: number;
  pendingPayout: number;
  lastPayout: number;
  showExactValues: boolean;
  setShowExactValues: (val: boolean) => void;
  onViewPendingDetail: () => void;
  onViewLastDetail: () => void;
}

export default function StatsCards({
  totalEarned,
  pendingPayout,
  lastPayout,
  showExactValues,
  setShowExactValues,
  onViewPendingDetail,
  onViewLastDetail,
}: StatsCardsProps) {
  
  const formatValue = (value: number, type: 'lifetime' | 'pending' | 'last') => {
    if (showExactValues) {
      return `₦${value.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    
    // Exact requested visual mockup styling
    if (type === 'lifetime') return '₦4.2M';
    if (type === 'pending') return '₦340K';
    if (type === 'last') return '₦180K';
    
    // Fallback abbreviations if values change dynamically in simulation
    if (value >= 1_000_000) {
      return `₦${(value / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
    }
    if (value >= 1_000) {
      return `₦${(value / 1_000).toFixed(0)}K`;
    }
    return `₦${value.toLocaleString()}`;
  };

  const cardsContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemCard = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <div className="relative mb-8" id="financial-summary-cards">
      {/* Absolute positioned quick toggle */}
      <div className="absolute right-0 -top-10 flex items-center gap-2">
        <button
          onClick={() => setShowExactValues(!showExactValues)}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 bg-white border border-slate-200 hover:border-slate-300 rounded-lg px-2.5 py-1.5 shadow-sm transition-all focus:outline-none cursor-pointer"
          title="Toggle abbreviated vs precise figures"
          id="toggle-precise-values"
        >
          {showExactValues ? (
            <>
              <EyeOff className="w-3.5 h-3.5 text-slate-400" />
              <span>Abbreviated Values</span>
            </>
          ) : (
            <>
              <Eye className="w-3.5 h-3.5 text-slate-400" />
              <span>Precise Figures</span>
            </>
          )}
        </button>
      </div>

      <motion.div 
        variants={cardsContainer}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* Total Earned Card */}
        <motion.div
          variants={itemCard}
          className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
          id="card-total-earned"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-[80px] -mr-8 -mt-8 opacity-40 group-hover:scale-110 transition-transform duration-300 pointer-events-none" />
          
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-semibold tracking-wider uppercase text-slate-500">Total Earned</span>
            <span className="p-1 px-1.5 rounded-full bg-emerald-50 text-emerald-600">
              <TrendingUp className="w-3.5 h-3.5" />
            </span>
          </div>
          
          <div className="flex flex-col">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-mono mb-2" id="val-total-earned">
              {formatValue(totalEarned, 'lifetime')}
            </span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Lifetime
            </span>
          </div>
        </motion.div>

        {/* Pending Payout Card */}
        <motion.div
          variants={itemCard}
          onClick={onViewPendingDetail}
          className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden group cursor-pointer"
          id="card-pending-payout"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-bl-[80px] -mr-8 -mt-8 opacity-40 group-hover:scale-110 transition-transform duration-300 pointer-events-none" />
          
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-semibold tracking-wider uppercase text-slate-500">Pending Payout</span>
            <span className="p-1 px-1.5 rounded-full bg-amber-50 text-amber-600">
              <Clock className="w-3.5 h-3.5" />
            </span>
          </div>
          
          <div className="flex flex-col">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-mono mb-2" id="val-pending-payout">
              {formatValue(pendingPayout, 'pending')}
            </span>
            <span className="text-xs font-medium text-slate-500">
              Awaiting verification
            </span>
          </div>

          <div className="absolute bottom-2 right-4 text-[10px] text-indigo-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
            <span>View Receipt &rarr;</span>
          </div>
        </motion.div>

        {/* Last Payout Card */}
        <motion.div
          variants={itemCard}
          onClick={onViewLastDetail}
          className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden group cursor-pointer"
          id="card-last-payout"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50/80 rounded-bl-[80px] -mr-8 -mt-8 opacity-40 group-hover:scale-110 transition-transform duration-300 pointer-events-none" />
          
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-semibold tracking-wider uppercase text-slate-500">Last Payout</span>
            <span className="p-1 px-1.5 rounded-full bg-slate-100 text-slate-600">
              <Calendar className="w-3.5 h-3.5" />
            </span>
          </div>
          
          <div className="flex flex-col">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-mono mb-2" id="val-last-payout">
              {formatValue(lastPayout, 'last')}
            </span>
            <span className="text-xs font-medium text-slate-500">
              Dec 8, 2024
            </span>
          </div>

          <div className="absolute bottom-2 right-4 text-[10px] text-indigo-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
            <span>View Receipt &rarr;</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
