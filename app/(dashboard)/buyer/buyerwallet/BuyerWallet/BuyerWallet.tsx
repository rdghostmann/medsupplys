// BuyerWallet.tsx

"use client";

import React, { useState } from "react";
import {
  Wallet as WalletIcon,
  ShieldCheck,
  Lock,
} from "lucide-react";
import { toast } from "sonner";

import TransactionHistoryLedger, {
  WalletTransaction,
} from "./TransactionHistoryLedger";
import type {
  CurrentBuyerWallet,
  CurrentBuyerWalletTransaction,
} from "@/controllers/buyer.actions";

import TopUpModal from "./TopUpModal";
import { useRouter } from "next/dist/client/components/navigation";

type BuyerWalletData = CurrentBuyerWallet;


/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

const formatCurrency = (value: number) =>
  `₦${Number(value || 0).toLocaleString("en-NG")}`;

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

interface BuyerWalletProps {
  wallet: BuyerWalletData | null;
  walletTransactions: CurrentBuyerWalletTransaction[];
}

export const BuyerWallet: React.FC<BuyerWalletProps> = ({
  wallet,
  walletTransactions: initialTransactions,
}) => {



  const walletState = wallet;

  const [transactions, setTransactions] =
    useState<WalletTransaction[]>(initialTransactions);

  const [isRefreshing, setIsRefreshing] =
    useState(false);

  const [isTopUpModalOpen, setIsTopUpModalOpen] =
    useState(false);
  const router = useRouter();
  const refreshAll = async () => {
    setIsRefreshing(true);

    try {
      router.refresh();

      await new Promise(
        (resolve) =>
          setTimeout(resolve, 500)
      );

      toast.success(
        "Wallet ledger refreshed"
      );
    } finally {
      setIsRefreshing(false);
    }
  };

  /* ------------------------------------------------------------------------ */
  /* UI                                                                        */
  /* ------------------------------------------------------------------------ */

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-xl font-bold text-slate-900">
            Institutional Procurement Wallet
          </h1>

          <p className="mt-0.5 text-xs text-slate-500">
            Direct Paystack automated settlement, atomic
            balance locking, and immutable cryptographic
            ledger
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsTopUpModalOpen(true)}
          className="
          flex cursor-pointer
          items-center gap-1.5
          self-start
          rounded-xl
          bg-emerald-600
          px-4 py-2
          text-xs font-bold
          text-white
          shadow-md
          shadow-emerald-600/20
          transition
          hover:bg-emerald-700
        "
        >
          <WalletIcon className="h-4 w-4" />

          <span>Top-Up Wallet</span>
        </button>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Available Balance */}
        <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-blue-900 to-slate-900 p-6 text-white shadow-lg">
         <div>
           <div className="mb-1 text-xs font-bold uppercase tracking-wider text-blue-200">
            Available Balance
          </div>

          <div className="mt-2 font-mono text-2xl font-bold">
            {formatCurrency(walletState?.balance || 0)}
          </div>
           <p className="mt-1 text-[11px] text-slate-500">
              Available institutional procurement wallet balance
            </p>
         </div>

          <div className="mt-4 flex items-center gap-1 border-t border-white/20 pt-3 text-[11px] text-slate-400">
            <span
              className={`h-2 w-2 animate-pulse rounded-full ${walletState?.status === "ACTIVE"
                ? "bg-emerald-400"
                : "bg-red-400"
                }`}
            />

            <span>
              {walletState?.status || "UNAVAILABLE"}

              <span className="text-blue-200/80">
                {" "}
                • {walletState?.currency || "NGN"} (Nigerian Naira)
              </span>
            </span>
          </div>
        </div>

        {/* Credit Allowance */}
        <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-amber-200 bg-linear-to-br from-amber-50 via-white to-white p-5 shadow-xs">
          <div>
            <div className="mb-1 text-xs font-bold uppercase tracking-wider text-amber-700">
              Credit Allowance
            </div>

            <div className="mt-1 font-mono text-2xl font-bold text-slate-900">
              {formatCurrency(walletState?.creditAllowance || 0)}
            </div>

            <p className="mt-1 text-[11px] text-slate-500">
              Approved procurement credit facility
            </p>
          </div>

          <div className="mt-4 flex items-center gap-1 border-t border-amber-100 pt-3 text-[11px] text-slate-400">
            <ShieldCheck className="h-3.5 w-3.5 text-amber-600" />

            <span>
              {walletState?.creditStatus === "ACTIVE"
                ? "Credit facility active"
                : "Credit facility available"}
            </span>
          </div>
        </div>

        {/* Available Purchasing Power */}
        <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-emerald-200 bg-linear-to-br from-emerald-50 via-white to-white p-5 shadow-xs">
          <div>
            <div className="mb-1 text-xs font-bold uppercase tracking-wider text-emerald-700">
              Purchasing Power
            </div>

            <div className="mt-1 font-mono text-2xl font-bold text-emerald-700">
              {/* Available Purchasing Power */}
              <div className="font-mono text-2xl font-bold text-emerald-700">
                {formatCurrency(walletState?.purchasingPower || 0)}
              </div>

            </div>

            <p className="mt-1 text-[11px] text-slate-500">
              Wallet balance + available credit
            </p>
          </div>

          <div className="mt-4 flex items-center gap-1 border-t border-emerald-100 pt-3 text-[11px] text-slate-400">
            <WalletIcon className="h-3.5 w-3.5 text-emerald-600" />

            <span>Available for procurement</span>
          </div>
        </div>
      </div>

      {/* Transaction History Ledger */}
      <TransactionHistoryLedger
        transactions={transactions}
        isRefreshing={isRefreshing}
        onRefresh={refreshAll}
      />

      <TopUpModal
        isOpen={isTopUpModalOpen}
        onClose={() => setIsTopUpModalOpen(false)}
        currentUser={
          walletState?.buyerId
            ? {
              id: walletState.buyerId,
            }
            : null
        }
        onSuccess={async () => {
          await refreshAll();
        }}
      />
    </div>



  );
};

export default BuyerWallet;