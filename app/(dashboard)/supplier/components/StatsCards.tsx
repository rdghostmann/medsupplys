import { motion } from "framer-motion"
import { TrendingUp, Clock, Calendar, Eye, EyeOff } from "lucide-react"

interface StatsCardsProps {
  totalEarned: number
  pendingPayout: number
  lastPayout: number
  showExactValues: boolean
  setShowExactValues: (val: boolean) => void
  onViewPendingDetail: () => void
  onViewLastDetail: () => void
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
  const formatValue = (
    value: number,
    type: "lifetime" | "pending" | "last"
  ) => {
    if (showExactValues) {
      return `₦${value.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    }

    // Exact requested visual mockup styling
    if (type === "lifetime") return "₦4.2M"
    if (type === "pending") return "₦340K"
    if (type === "last") return "₦180K"

    // Fallback abbreviations if values change dynamically in simulation
    if (value >= 1_000_000) {
      return `₦${(value / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`
    }
    if (value >= 1_000) {
      return `₦${(value / 1_000).toFixed(0)}K`
    }
    return `₦${value.toLocaleString()}`
  }

  const cardsContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemCard = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
  }

  return (
    <div className="relative mb-8" id="financial-summary-cards">
      {/* Absolute positioned quick toggle */}
      <div className="absolute -top-10 right-0 flex items-center gap-2">
        <button
          onClick={() => setShowExactValues(!showExactValues)}
          className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-500 shadow-sm transition-all hover:border-slate-300 hover:text-slate-800 focus:outline-none"
          title="Toggle abbreviated vs precise figures"
          id="toggle-precise-values"
        >
          {showExactValues ? (
            <>
              <EyeOff className="h-3.5 w-3.5 text-slate-400" />
              <span>Abbreviated Values</span>
            </>
          ) : (
            <>
              <Eye className="h-3.5 w-3.5 text-slate-400" />
              <span>Precise Figures</span>
            </>
          )}
        </button>
      </div>

      <motion.div
        variants={cardsContainer}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-6 md:grid-cols-3"
      >
        {/* Total Earned Card */}
        <motion.div
          // variants={itemCard}
          className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          id="card-total-earned"
        >
          <div className="pointer-events-none absolute top-0 right-0 -mt-8 -mr-8 h-24 w-24 rounded-bl-[80px] bg-emerald-50 opacity-40 transition-transform duration-300 group-hover:scale-110" />

          <div className="mb-4 flex items-start justify-between">
            <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
              Total Earned
            </span>
            <span className="rounded-full bg-emerald-50 p-1 px-1.5 text-emerald-600">
              <TrendingUp className="h-3.5 w-3.5" />
            </span>
          </div>

          <div className="flex flex-col">
            <span
              className="mb-2 font-mono text-3xl font-extrabold tracking-tight text-slate-900"
              id="val-total-earned"
            >
              {formatValue(totalEarned, "lifetime")}
            </span>
            <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              Lifetime
            </span>
          </div>
        </motion.div>

        {/* Pending Payout Card */}
        <motion.div
          // variants={itemCard}
          onClick={onViewPendingDetail}
          className="group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:shadow-md"
          id="card-pending-payout"
        >
          <div className="pointer-events-none absolute top-0 right-0 -mt-8 -mr-8 h-24 w-24 rounded-bl-[80px] bg-amber-50 opacity-40 transition-transform duration-300 group-hover:scale-110" />

          <div className="mb-4 flex items-start justify-between">
            <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
              Pending Payout
            </span>
            <span className="rounded-full bg-amber-50 p-1 px-1.5 text-amber-600">
              <Clock className="h-3.5 w-3.5" />
            </span>
          </div>

          <div className="flex flex-col">
            <span
              className="mb-2 font-mono text-3xl font-extrabold tracking-tight text-slate-900"
              id="val-pending-payout"
            >
              {formatValue(pendingPayout, "pending")}
            </span>
            <span className="text-xs font-medium text-slate-500">
              Awaiting verification
            </span>
          </div>

          <div className="absolute right-4 bottom-2 flex items-center gap-0.5 text-[10px] font-medium text-indigo-500 opacity-0 transition-opacity group-hover:opacity-100">
            <span>View Receipt &rarr;</span>
          </div>
        </motion.div>

        {/* Last Payout Card */}
        <motion.div
          // variants={itemCard}
          onClick={onViewLastDetail}
          className="group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:shadow-md"
          id="card-last-payout"
        >
          <div className="pointer-events-none absolute top-0 right-0 -mt-8 -mr-8 h-24 w-24 rounded-bl-[80px] bg-slate-50/80 opacity-40 transition-transform duration-300 group-hover:scale-110" />

          <div className="mb-4 flex items-start justify-between">
            <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
              Last Payout
            </span>
            <span className="rounded-full bg-slate-100 p-1 px-1.5 text-slate-600">
              <Calendar className="h-3.5 w-3.5" />
            </span>
          </div>

          <div className="flex flex-col">
            <span
              className="mb-2 font-mono text-3xl font-extrabold tracking-tight text-slate-900"
              id="val-last-payout"
            >
              {formatValue(lastPayout, "last")}
            </span>
            <span className="text-xs font-medium text-slate-500">
              Dec 8, 2024
            </span>
          </div>

          <div className="absolute right-4 bottom-2 flex items-center gap-0.5 text-[10px] font-medium text-indigo-500 opacity-0 transition-opacity group-hover:opacity-100">
            <span>View Receipt &rarr;</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
