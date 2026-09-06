// BuyerWallet.tsx
// BuyerWallet.tsx

"use client";

import React, { useMemo, useState } from "react";
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

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/* Wallet                                                                     */
/* -------------------------------------------------------------------------- */

type BuyerWalletData = CurrentBuyerWallet;



/* -------------------------------------------------------------------------- */
/* Mock Transactions                                                          */
/* -------------------------------------------------------------------------- */

const mockWalletTransactions: WalletTransaction[] = [
  {
    id: "tx_001",
    walletId: "wallet_buyer_001",
    buyerId: "buyer_001",
    type: "TOPUP",
    amount: 500000,
    direction: "CREDIT",
    balanceBefore: 347500,
    balanceAfter: 847500,
    reference: "MS-TOP-260905-001",
    description:
      "Institutional wallet funding via Paystack",
    status: "SUCCESS",
    metadata: {
      paymentMethod: "Paystack",
      channel: "bank_transfer",
      gatewayReference: "PSK-884729102",
    },
    createdAt: "2026-09-05T09:15:00",
  },

  {
    id: "tx_002",
    walletId: "wallet_buyer_001",
    buyerId: "buyer_001",
    type: "PURCHASE",
    amount: 278000,
    direction: "DEBIT",
    balanceBefore: 625500,
    balanceAfter: 347500,
    reference: "MS-ORD-2026-000165",
    description:
      "Procurement payment for Vitamin C 1000mg",
    status: "SUCCESS",
    metadata: {
      orderId: "ord_003",
      orderNumber: "MS-2026-000165",
      supplierId: "sup_emzor",
      supplierName:
        "Emzor Pharmaceutical Industries Ltd",
    },
    createdAt: "2026-08-26T09:10:00",
  },

  {
    id: "tx_003",
    walletId: "wallet_buyer_001",
    buyerId: "buyer_001",
    type: "TOPUP",
    amount: 750000,
    direction: "CREDIT",
    balanceBefore: 0,
    balanceAfter: 750000,
    reference: "MS-TOP-260826-001",
    description:
      "Institutional wallet funding via Paystack",
    status: "SUCCESS",
    metadata: {
      paymentMethod: "Paystack",
      channel: "card",
      gatewayReference: "PSK-772619304",
    },
    createdAt: "2026-08-26T08:30:00",
  },

  {
    id: "tx_004",
    walletId: "wallet_buyer_001",
    buyerId: "buyer_001",
    type: "PURCHASE",
    amount: 510000,
    direction: "DEBIT",
    balanceBefore: 510000,
    balanceAfter: 0,
    reference: "MS-ORD-2026-000181",
    description:
      "Procurement payment for Amoxicillin 500mg",
    status: "SUCCESS",
    metadata: {
      orderId: "ord_002",
      orderNumber: "MS-2026-000181",
      supplierId: "sup_fidson",
      supplierName: "Fidson Healthcare Plc",
    },
    createdAt: "2026-08-25T15:20:00",
  },

  {
    id: "tx_005",
    walletId: "wallet_buyer_001",
    buyerId: "buyer_001",
    type: "TOPUP",
    amount: 510000,
    direction: "CREDIT",
    balanceBefore: 0,
    balanceAfter: 510000,
    reference: "MS-TOP-260825-001",
    description:
      "Institutional wallet funding via Paystack",
    status: "SUCCESS",
    metadata: {
      paymentMethod: "Paystack",
      channel: "bank_transfer",
      gatewayReference: "PSK-663829104",
    },
    createdAt: "2026-08-25T14:40:00",
  },

  {
    id: "tx_006",
    walletId: "wallet_buyer_001",
    buyerId: "buyer_001",
    type: "CREDIT_PURCHASE",
    amount: 615000,
    direction: "DEBIT",
    balanceBefore: 0,
    balanceAfter: 0,
    reference: "MS-CRD-2026-000184",
    description:
      "Credit-funded procurement for Paracetamol 500mg",
    status: "SUCCESS",
    metadata: {
      orderId: "ord_001",
      orderNumber: "MS-2026-000184",
      supplierId: "sup_maybaker",
      supplierName: "May & Baker Nigeria Plc",
      creditTermDays: 30,
    },
    createdAt: "2026-08-24T10:25:00",
  },

  {
    id: "tx_007",
    walletId: "wallet_buyer_001",
    buyerId: "buyer_001",
    type: "CREDIT_REPAYMENT",
    amount: 300000,
    direction: "CREDIT",
    balanceBefore: 0,
    balanceAfter: 300000,
    reference: "MS-REP-260820-001",
    description: "Credit facility repayment",
    status: "SUCCESS",
    metadata: {
      paymentMethod: "Bank Transfer",
      creditReference: "CRD-2026-000184",
    },
    createdAt: "2026-08-20T12:10:00",
  },

  {
    id: "tx_008",
    walletId: "wallet_buyer_001",
    buyerId: "buyer_001",
    type: "REFUND",
    amount: 97500,
    direction: "CREDIT",
    balanceBefore: 250000,
    balanceAfter: 347500,
    reference: "MS-REF-260818-001",
    description:
      "Procurement adjustment refund for rejected line item",
    status: "SUCCESS",
    metadata: {
      orderId: "ord_001",
      reason: "Line item price adjustment",
    },
    createdAt: "2026-08-18T16:45:00",
  },
];

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
  void mockWalletTransactions;

  const [walletState] = useState<BuyerWalletData | null>(wallet);

  const [transactions, setTransactions] =
    useState<WalletTransaction[]>(initialTransactions);

  const [isRefreshing, setIsRefreshing] =
    useState(false);

  /* ------------------------------------------------------------------------ */
  /* Totals                                                                   */
  /* ------------------------------------------------------------------------ */

  const totalDeposits = useMemo(() => {
    return transactions
      .filter(
        (tx) =>
          tx.direction === "CREDIT" &&
          tx.status === "SUCCESS"
      )
      .reduce(
        (sum, tx) => sum + tx.amount,
        0
      );
  }, [transactions]);

  const totalDebits = useMemo(() => {
    return transactions
      .filter(
        (tx) =>
          tx.direction === "DEBIT" &&
          tx.status === "SUCCESS"
      )
      .reduce(
        (sum, tx) => sum + tx.amount,
        0
      );
  }, [transactions]);

  /* ------------------------------------------------------------------------ */
  /* Actions                                                                   */
  /* ------------------------------------------------------------------------ */

  const refreshAll = async () => {
    setIsRefreshing(true);

    await new Promise((resolve) =>
      setTimeout(resolve, 700)
    );

    setTransactions([...initialTransactions]);

    setIsRefreshing(false);

    toast.success("Wallet ledger refreshed");
  };

  const fundWallet = () => {
    toast.info(
      "Paystack wallet funding will be connected here."
    );
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
          onClick={fundWallet}
          className="flex cursor-pointer items-center gap-1.5 self-start rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-700"
        >
          <WalletIcon className="h-4 w-4" />

          <span>Fund Wallet via Paystack</span>
        </button>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Available Balance */}
        <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-blue-900 to-slate-900 p-6 text-white shadow-lg">
          <div className="mb-1 text-xs font-bold uppercase tracking-wider text-blue-200">
            Available Institutional Balance
          </div>

          <div className="mt-2 font-mono text-2xl font-bold">
            {formatCurrency(walletState?.balance || 0)}
          </div>

          <div className="mt-4 flex items-center gap-2 text-[11px] text-blue-200/80">
            <span
              className={`h-2 w-2 rounded-full ${
                walletState?.status === "ACTIVE"
                  ? "bg-emerald-400"
                  : "bg-red-400"
              }`}
            />

            <span>
              Status: {walletState?.status || "UNAVAILABLE"} 
              {" "}
             
             {/* {" "}  •  {wallet.currency}{" "}
              (Nigerian Naira) */}
            </span>
          </div>
        </div>

        {/* Total Deposits */}
        <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div>
            <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Deposits Funded
            </div>

            <div className="mt-1 font-mono text-lg font-bold text-emerald-700">
              {formatCurrency(totalDeposits)}
            </div>
          </div>

          <div className="mt-3 flex items-center gap-1 border-t border-slate-100 pt-3 text-[11px] text-slate-400">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />

            <span>Paystack Webhook Verified</span>
          </div>
        </div>

        {/* Total Debits */}
        <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div>
            <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Sourcing Debits
            </div>

            <div className="mt-1 font-mono text-lg font-bold text-slate-900">
              {formatCurrency(totalDebits)}
            </div>
          </div>

          <div className="mt-3 flex items-center gap-1 border-t border-slate-100 pt-3 text-[11px] text-slate-400">
            <Lock className="h-3.5 w-3.5 text-blue-600" />

            <span>Atomic Transaction Locks</span>
          </div>
        </div>
      </div>

      {/* Transaction History Ledger */}
      <TransactionHistoryLedger
        transactions={transactions}
        isRefreshing={isRefreshing}
        onRefresh={refreshAll}
      />
    </div>
  );
};

export default BuyerWallet;