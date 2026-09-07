"use client";

import React, { useState } from "react";
import {
  Wallet,
  Database,
  CheckCircle2,
  AlertCircle,
  Loader2,
  UserRound,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

interface SeededWallet {
  _id: string;
  buyerId: string;
  buyerName: string;
  currency: string;
  availableBalance: number;
  heldBalance: number;
  totalDeposited: number;
  totalSpent: number;
  totalRefunded: number;
  totalReversed: number;
  status: "ACTIVE" | "SUSPENDED" | "LOCKED";
  createdAt: string;
  updatedAt: string;
}

interface SeedWalletResponse {
  success: boolean;
  seeded?: boolean;
  alreadyExists?: boolean;
  message: string;
  wallet?: SeededWallet;
  buyerId?: string;
  role?: string;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
};

const SeedBuyerWallet: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [wallet, setWallet] = useState<SeededWallet | null>(null);
  const [status, setStatus] = useState<
    "idle" | "success" | "exists" | "error"
  >("idle");

  const seedWallet = async () => {
    try {
      setIsLoading(true);
      setStatus("idle");

      const response = await fetch("/api/seed-wallet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data: SeedWalletResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to seed buyer wallet."
        );
      }

      if (data.wallet) {
        setWallet(data.wallet);
      }

      if (data.alreadyExists) {
        setStatus("exists");

        toast.info("Wallet already exists", {
          description: data.message,
        });

        return;
      }

      setStatus("success");

      toast.success("Buyer wallet seeded", {
        description: `₦${data.wallet?.availableBalance.toLocaleString(
          "en-NG"
        )} available balance created.`,
      });
    } catch (error) {
      console.error(error);

      setStatus("error");

      toast.error("Wallet seeding failed", {
        description:
          error instanceof Error
            ? error.message
            : "Unable to seed buyer wallet.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="border-b border-slate-200 bg-slate-50 px-6 py-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100">
              <Wallet className="h-5 w-5 text-emerald-700" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Seed Buyer Wallet
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Create the initial wallet for the seeded LUTH buyer.
              </p>
            </div>
          </div>

          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
            ADMIN
          </span>
        </div>
      </div>

      {/* Buyer Information */}
      <div className="p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-500">
              <UserRound className="h-4 w-4" />
              Buyer
            </div>

            <p className="font-semibold text-slate-900">
              Lagos University Teaching Hospital (LUTH)
            </p>

            <p className="mt-1 break-all font-mono text-xs text-slate-500">
              6a9cb82d853e785e43c110b8
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-500">
              <Database className="h-4 w-4" />
              Initial Balance
            </div>

            <p className="hidden text-2xl font-bold text-emerald-700">
              ₦1,450,000
            </p>

            <p className="mt-1 text-xs text-slate-500">
              NGN wallet balance
            </p>
          </div>
        </div>

        {/* Action */}
        <div className="mt-6">
          <button
            type="button"
            onClick={seedWallet}
            disabled={isLoading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Seeding Wallet...
              </>
            ) : wallet ? (
              <>
                <RefreshCw className="h-4 w-4" />
                Check Wallet Again
              </>
            ) : (
              <>
                <Wallet className="h-4 w-4" />
                Seed Buyer Wallet
              </>
            )}
          </button>
        </div>

        {/* Status */}
        {status !== "idle" && (
          <div className="mt-5">
            {status === "success" && (
              <div className="flex gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

                <div>
                  <p className="font-semibold text-emerald-900">
                    Wallet seeded successfully
                  </p>

                  <p className="mt-1 text-sm text-emerald-700">
                    The buyer wallet is now active and ready for
                    transactions.
                  </p>
                </div>
              </div>
            )}

            {status === "exists" && (
              <div className="flex gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />

                <div>
                  <p className="font-semibold text-blue-900">
                    Wallet already exists
                  </p>

                  <p className="mt-1 text-sm text-blue-700">
                    No duplicate wallet was created because each
                    buyer can only have one wallet.
                  </p>
                </div>
              </div>
            )}

            {status === "error" && (
              <div className="flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

                <div>
                  <p className="font-semibold text-red-900">
                    Wallet seeding failed
                  </p>

                  <p className="mt-1 text-sm text-red-700">
                    Check the server logs for more details.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Wallet Result */}
        {wallet && (
          <div className="mt-6 rounded-2xl border border-slate-200 overflow-hidden">
            <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-900">
                  Wallet Record
                </h3>

                <span
                  className={[
                    "rounded-full px-3 py-1 text-xs font-semibold",
                    wallet.status === "ACTIVE"
                      ? "bg-emerald-100 text-emerald-700"
                      : wallet.status === "SUSPENDED"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-red-100 text-red-700",
                  ].join(" ")}
                >
                  {wallet.status}
                </span>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              <div className="flex items-center justify-between gap-4 px-5 py-3">
                <span className="text-sm text-slate-500">
                  Wallet ID
                </span>

                <span className="break-all font-mono text-xs text-slate-700">
                  {wallet._id}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4 px-5 py-3">
                <span className="text-sm text-slate-500">
                  Buyer
                </span>

                <span className="text-right text-sm font-medium text-slate-900">
                  {wallet.buyerName}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4 px-5 py-3">
                <span className="text-sm text-slate-500">
                  Available Balance
                </span>

                <span className="text-sm font-bold text-emerald-700">
                  {formatCurrency(wallet.availableBalance)}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4 px-5 py-3">
                <span className="text-sm text-slate-500">
                  Total Deposited
                </span>

                <span className="text-sm font-semibold text-slate-900">
                  {formatCurrency(wallet.totalDeposited)}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4 px-5 py-3">
                <span className="text-sm text-slate-500">
                  Held Balance
                </span>

                <span className="text-sm font-semibold text-slate-900">
                  {formatCurrency(wallet.heldBalance)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default SeedBuyerWallet;