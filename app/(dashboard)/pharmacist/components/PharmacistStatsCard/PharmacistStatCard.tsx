"use client";

import {
  AlertOctagon,
  CheckCircle2,
  Clock,
  FileCheck2,
  TrendingUp,
} from "lucide-react";

interface PharmacistStatsCardProps {
  verificationHistory: import("@/types").PharmacistVerificationRecord[];
}

export default function PharmacistStatCard({
  verificationHistory,
}: PharmacistStatsCardProps) {
  const verifiedCount = verificationHistory.filter(
    (verification) => verification.result === "Verified"
  ).length;

  const rejectedCount = verificationHistory.filter(
    (verification) => verification.result === "Rejected"
  ).length;

  const totalVerifications = verificationHistory.length + 1420;
  const totalVerified = verifiedCount + 1378;
  const totalRejected = rejectedCount + 42;

  const passRate =
    totalVerifications > 0
      ? ((totalVerified / totalVerifications) * 100).toFixed(1)
      : "0.0";

  const flaggedRate =
    totalVerifications > 0
      ? ((totalRejected / totalVerifications) * 100).toFixed(1)
      : "0.0";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Verifications */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Total Verifications
          </span>

          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <FileCheck2 className="w-5 h-5" />
          </div>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-extrabold text-slate-900">
            {totalVerifications.toLocaleString()}
          </span>

          <span className="text-xs font-semibold text-emerald-600 flex items-center">
            <TrendingUp className="w-3 h-3 mr-0.5" />
            +12.4%
          </span>
        </div>

        <p className="text-[11px] text-slate-400 mt-1">
          Across 18 registered hospital hubs
        </p>
      </div>

      {/* Verified Batches */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Verified Batches
          </span>

          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-extrabold text-slate-900">
            {totalVerified.toLocaleString()}
          </span>

          <span className="text-xs font-semibold text-emerald-600">
            {passRate}% Pass
          </span>
        </div>

        <p className="text-[11px] text-slate-400 mt-1">
          Full compliance with NAFDAC standards
        </p>
      </div>

      {/* Quarantined / Rejected */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Quarantined / Rejected
          </span>

          <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertOctagon className="w-5 h-5" />
          </div>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-extrabold text-rose-600">
            {totalRejected.toLocaleString()}
          </span>

          <span className="text-xs font-semibold text-rose-600">
            {flaggedRate}% Flagged
          </span>
        </div>

        <p className="text-[11px] text-slate-400 mt-1">
          Tampered seals or temp excursions
        </p>
      </div>

      {/* Average Release Time */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Avg. Release Time
          </span>

          <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-extrabold text-slate-900">
            18 min
          </span>

          <span className="text-xs font-semibold text-purple-600">
            Fast-Track
          </span>
        </div>

        <p className="text-[11px] text-slate-400 mt-1">
          Automated barcode & spectral assay
        </p>
      </div>
    </div>
  );
}