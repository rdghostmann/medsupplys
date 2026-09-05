// BuyerWallet.tsx

"use client";

import React, { useMemo, useState } from "react";
import {
  Wallet as WalletIcon,
  CreditCard,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldCheck,
  Building2,
  RefreshCw,
  Clock,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { toast } from "sonner";

type WalletStatus = "active" | "suspended" | "locked";

type WalletTransactionType =
  | "TOPUP"
  | "PURCHASE"
  | "REFUND"
  | "CREDIT_PURCHASE"
  | "CREDIT_REPAYMENT"
  | "ADJUSTMENT";

type TransactionDirection = "CREDIT" | "DEBIT";

type TransactionStatus =
  | "PENDING"
  | "SUCCESS"
  | "FAILED"
  | "REVERSED";

interface BuyerWalletData {
  _id: string;
  buyerId: string;
  balance: number;
  currency: "NGN";
  status: WalletStatus;
  createdAt: string;
  updatedAt: string;
}

interface WalletTransaction {
  id: string;
  walletId: string;
  buyerId: string;
  type: WalletTransactionType;
  amount: number;
  direction: TransactionDirection;
  balanceBefore: number;
  balanceAfter: number;
  reference: string;
  description: string;
  status: TransactionStatus;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

/**
 * Mock institutional wallet
 */
const mockWallet: BuyerWalletData = {
  _id: "wallet_buyer_001",
  buyerId: "buyer_001",
  balance: 847500,
  currency: "NGN",
  status: "active",
  createdAt: "2026-08-01T09:00:00",
  updatedAt: "2026-09-05T09:30:00",
};

/**
 * Mock wallet transaction ledger.
 *
 * Transactions are ordered newest first.
 */
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
    description: "Institutional wallet funding via Paystack",
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
    description: "Procurement payment for Vitamin C 1000mg",
    status: "SUCCESS",
    metadata: {
      orderId: "ord_003",
      orderNumber: "MS-2026-000165",
      supplierId: "sup_emzor",
      supplierName: "Emzor Pharmaceutical Industries Ltd",
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
    description: "Institutional wallet funding via Paystack",
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
    description: "Procurement payment for Amoxicillin 500mg",
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
    description: "Institutional wallet funding via Paystack",
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

const formatCurrency = (value: number) =>
  `₦${Number(value || 0).toLocaleString("en-NG")}`;

const formatDateTime = (date: string) =>
  new Date(date).toLocaleString("en-NG", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const getTransactionStatusClass = (
  status: TransactionStatus
) => {
  switch (status) {
    case "SUCCESS":
      return "bg-emerald-100 text-emerald-800";

    case "PENDING":
      return "bg-amber-100 text-amber-800";

    case "FAILED":
      return "bg-red-100 text-red-800";

    case "REVERSED":
      return "bg-slate-100 text-slate-700";

    default:
      return "bg-slate-100 text-slate-700";
  }
};

const getTransactionIcon = (
  type: WalletTransactionType,
  direction: TransactionDirection
) => {
  if (type === "TOPUP" || type === "CREDIT_REPAYMENT") {
    return (
      <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-600" />
    );
  }

  if (type === "REFUND") {
    return (
      <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
    );
  }

  if (direction === "DEBIT") {
    return (
      <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
    );
  }

  return (
    <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-600" />
  );
};

export const BuyerWallet: React.FC = () => {
  const [wallet] = useState<BuyerWalletData>(mockWallet);

  const [walletTransactions, setWalletTransactions] =
    useState<WalletTransaction[]>(mockWalletTransactions);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const totalDeposits = useMemo(() => {
    return walletTransactions
      .filter(
        (tx) =>
          tx.direction === "CREDIT" &&
          tx.status === "SUCCESS"
      )
      .reduce((sum, tx) => sum + tx.amount, 0);
  }, [walletTransactions]);

  const totalDebits = useMemo(() => {
    return walletTransactions
      .filter(
        (tx) =>
          tx.direction === "DEBIT" &&
          tx.status === "SUCCESS"
      )
      .reduce((sum, tx) => sum + tx.amount, 0);
  }, [walletTransactions]);

  const refreshAll = async () => {
    setIsRefreshing(true);

    await new Promise((resolve) =>
      setTimeout(resolve, 700)
    );

    setWalletTransactions([...mockWalletTransactions]);

    setIsRefreshing(false);

    toast.success("Wallet ledger refreshed");
  };

  const fundWallet = () => {
    toast.info(
      "Paystack wallet funding will be connected here."
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-xl font-bold text-slate-900">
            Institutional Procurement Wallet
          </h1>

          <p className="text-xs text-slate-500 mt-0.5">
            Direct Paystack automated settlement, atomic balance
            locking, and immutable cryptographic ledger
          </p>
        </div>

        <button
          type="button"
          onClick={fundWallet}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition flex items-center gap-1.5 cursor-pointer self-start"
        >
          <WalletIcon className="w-4 h-4" />

          <span>Fund Wallet via Paystack</span>
        </button>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Available Balance */}
        <div className="bg-gradient-to-br from-blue-900 to-slate-900 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
          <div className="text-xs font-bold uppercase tracking-wider text-blue-200 mb-1">
            Available Institutional Balance
          </div>

          <div className="font-mono text-2xl font-bold mt-2">
            {formatCurrency(wallet.balance)}
          </div>

          <div className="flex items-center gap-2 mt-4 text-[11px] text-blue-200/80">
            <span
              className={`w-2 h-2 rounded-full ${
                wallet.status === "active"
                  ? "bg-emerald-400"
                  : "bg-red-400"
              }`}
            />

            <span>
              Status: {wallet.status} • {wallet.currency}{" "}
              (Nigerian Naira)
            </span>
          </div>
        </div>

        {/* Total Deposits */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Total Deposits Funded
            </div>

            <div className="font-mono text-lg font-bold text-emerald-700 mt-1">
              {formatCurrency(totalDeposits)}
            </div>
          </div>

          <div className="text-[11px] text-slate-400 mt-3 pt-3 border-t border-slate-100 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />

            <span>Paystack Webhook Verified</span>
          </div>
        </div>

        {/* Total Debits */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Total Sourcing Debits
            </div>

            <div className="font-mono text-lg font-bold text-slate-900 mt-1">
              {formatCurrency(totalDebits)}
            </div>
          </div>

          <div className="text-[11px] text-slate-400 mt-3 pt-3 border-t border-slate-100 flex items-center gap-1">
            <Lock className="w-3.5 h-3.5 text-blue-600" />

            <span>Atomic Transaction Locks</span>
          </div>
        </div>
      </div>

      {/* Transaction History Ledger */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Ledger Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-500" />

            <h2 className="font-display text-sm font-bold text-slate-900 uppercase tracking-wider">
              Immutable Wallet Transaction Ledger (
              {walletTransactions.length})
            </h2>
          </div>

          <button
            type="button"
            onClick={refreshAll}
            disabled={isRefreshing}
            className="text-xs text-blue-600 font-semibold hover:underline cursor-pointer disabled:opacity-50 disabled:no-underline flex items-center gap-1.5"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${
                isRefreshing ? "animate-spin" : ""
              }`}
            />

            {isRefreshing
              ? "Refreshing..."
              : "Refresh Ledger"}
          </button>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10.5px] border-b border-slate-100">
              <tr>
                <th className="py-3 px-4 font-semibold">
                  Reference
                </th>

                <th className="py-3 px-4 font-semibold">
                  Type & Description
                </th>

                <th className="py-3 px-4 font-semibold">
                  Timestamp
                </th>

                <th className="py-3 px-4 font-semibold text-right">
                  Balance Before
                </th>

                <th className="py-3 px-4 font-semibold text-right">
                  Amount
                </th>

                <th className="py-3 px-4 font-semibold text-right">
                  Balance After
                </th>

                <th className="py-3 px-4 font-semibold text-center">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {walletTransactions.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-8 text-center text-slate-400"
                  >
                    No wallet transactions recorded yet.
                  </td>
                </tr>
              ) : (
                walletTransactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className="hover:bg-slate-50 transition"
                  >
                    {/* Reference */}
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-slate-900">
                        {tx.reference}
                      </div>

                      <div className="mt-1 flex items-center gap-1">
                        {getTransactionIcon(
                          tx.type,
                          tx.direction
                        )}

                        <span className="text-[10px] text-slate-400 uppercase">
                          {tx.direction}
                        </span>
                      </div>
                    </td>

                    {/* Type / Description */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">
                        {tx.type.replace(/_/g, " ")}
                      </div>

                      <div className="text-[11px] text-slate-500 line-clamp-1 max-w-[280px]">
                        {tx.description}
                      </div>
                    </td>

                    {/* Timestamp */}
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                      {formatDateTime(tx.createdAt)}
                    </td>

                    {/* Before */}
                    <td className="py-3 px-4 text-right font-mono text-slate-600 whitespace-nowrap">
                      {formatCurrency(tx.balanceBefore)}
                    </td>

                    {/* Amount */}
                    <td
                      className={`py-3 px-4 text-right font-mono font-bold whitespace-nowrap ${
                        tx.direction === "CREDIT"
                          ? "text-emerald-700"
                          : "text-slate-900"
                      }`}
                    >
                      {tx.direction === "CREDIT"
                        ? "+"
                        : "-"}
                      {formatCurrency(tx.amount)}
                    </td>

                    {/* After */}
                    <td className="py-3 px-4 text-right font-mono font-bold text-blue-900 whitespace-nowrap">
                      {formatCurrency(tx.balanceAfter)}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${getTransactionStatusClass(
                          tx.status
                        )}`}
                      >
                        {tx.status === "SUCCESS" && (
                          <CheckCircle2 className="w-3 h-3" />
                        )}

                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BuyerWallet;