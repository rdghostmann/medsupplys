// TransactionHistoryLedger.tsx

"use client";

import React, { useMemo } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  RefreshCw,
} from "lucide-react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export type WalletTransactionType =
  | "TOPUP"
  | "PURCHASE"
  | "REFUND"
  | "CREDIT_PURCHASE"
  | "CREDIT_REPAYMENT"
  | "ADJUSTMENT";

export type TransactionDirection = "CREDIT" | "DEBIT";

export type TransactionStatus =
  | "PENDING"
  | "SUCCESS"
  | "FAILED"
  | "REVERSED";

export interface WalletTransaction {
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

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

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
  if (
    type === "TOPUP" ||
    type === "CREDIT_REPAYMENT"
  ) {
    return (
      <ArrowDownLeft className="h-3.5 w-3.5 text-emerald-600" />
    );
  }

  if (type === "REFUND") {
    return (
      <RefreshCw className="h-3.5 w-3.5 text-blue-600" />
    );
  }

  if (direction === "DEBIT") {
    return (
      <ArrowUpRight className="h-3.5 w-3.5 text-slate-500" />
    );
  }

  return (
    <ArrowDownLeft className="h-3.5 w-3.5 text-emerald-600" />
  );
};

/* -------------------------------------------------------------------------- */
/* Props                                                                      */
/* -------------------------------------------------------------------------- */

interface TransactionHistoryLedgerProps {
  transactions: WalletTransaction[];
  isRefreshing?: boolean;
  onRefresh?: () => void;
}

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

export const TransactionHistoryLedger: React.FC<
  TransactionHistoryLedgerProps
> = ({
  transactions,
  isRefreshing = false,
  onRefresh,
}) => {
  const columns = useMemo<
    ColumnDef<WalletTransaction>[]
  >(
    () => [
      {
        accessorKey: "reference",
        header: "Reference",
        cell: ({ row }) => {
          const transaction = row.original;

          return (
            <div className="py-1">
              <div className="font-mono font-bold text-slate-900">
                {transaction.reference}
              </div>

              <div className="mt-1 flex items-center gap-1">
                {getTransactionIcon(
                  transaction.type,
                  transaction.direction
                )}

                <span className="text-[10px] uppercase text-slate-400">
                  {transaction.direction}
                </span>
              </div>
            </div>
          );
        },
      },

      {
        accessorKey: "type",
        header: "Type & Description",
        cell: ({ row }) => {
          const transaction = row.original;

          return (
            <div>
              <div className="font-semibold text-slate-900">
                {transaction.type.replace(/_/g, " ")}
              </div>

              <div className="max-w-[280px] line-clamp-1 text-[11px] text-slate-500">
                {transaction.description}
              </div>
            </div>
          );
        },
      },

      {
        accessorKey: "createdAt",
        header: "Timestamp",
        cell: ({ row }) => (
          <span className="whitespace-nowrap font-mono text-[11px] text-slate-500">
            {formatDateTime(row.original.createdAt)}
          </span>
        ),
      },

      {
        accessorKey: "balanceBefore",
        header: () => (
          <div className="text-right">
            Balance Before
          </div>
        ),
        cell: ({ row }) => (
          <div className="whitespace-nowrap text-right font-mono text-slate-600">
            {formatCurrency(row.original.balanceBefore)}
          </div>
        ),
      },

      {
        accessorKey: "amount",
        header: () => (
          <div className="text-right">
            Amount
          </div>
        ),
        cell: ({ row }) => {
          const transaction = row.original;

          return (
            <div
              className={`whitespace-nowrap text-right font-mono font-bold ${
                transaction.direction === "CREDIT"
                  ? "text-emerald-700"
                  : "text-slate-900"
              }`}
            >
              {transaction.direction === "CREDIT"
                ? "+"
                : "-"}
              {formatCurrency(transaction.amount)}
            </div>
          );
        },
      },

      {
        accessorKey: "balanceAfter",
        header: () => (
          <div className="text-right">
            Balance After
          </div>
        ),
        cell: ({ row }) => (
          <div className="whitespace-nowrap text-right font-mono font-bold text-blue-900">
            {formatCurrency(row.original.balanceAfter)}
          </div>
        ),
      },

      {
        accessorKey: "status",
        header: () => (
          <div className="text-center">
            Status
          </div>
        ),
        cell: ({ row }) => {
          const status = row.original.status;

          return (
            <div className="text-center">
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${getTransactionStatusClass(
                  status
                )}`}
              >
                {status === "SUCCESS" && (
                  <CheckCircle2 className="h-3 w-3" />
                )}

                {status}
              </span>
            </div>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data: transactions,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
      {/* Ledger Header */}
      <div className="flex items-center justify-between border-b border-slate-100 p-5">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-slate-500" />

          <h2 className="font-display text-sm font-bold uppercase tracking-wider text-slate-900">
            Immutable Wallet Transaction Ledger (
            {transactions.length})
          </h2>
        </div>

        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline disabled:cursor-not-allowed disabled:opacity-50 disabled:no-underline"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${
                isRefreshing ? "animate-spin" : ""
              }`}
            />

            {isRefreshing
              ? "Refreshing..."
              : "Refresh Ledger"}
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table className="w-full text-left text-xs">
          <TableHeader>
            {table.getHeaderGroups().map(
              (headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="border-b border-slate-100 bg-slate-50 hover:bg-slate-50"
                >
                  {headerGroup.headers.map(
                    (header) => (
                      <TableHead
                        key={header.id}
                        className="h-auto px-4 py-3 text-[10.5px] font-semibold uppercase tracking-wider text-slate-500"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column
                                .columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    )
                  )}
                </TableRow>
              )
            )}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-xs text-slate-400"
                >
                  No wallet transactions recorded yet.
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map(
                (row) => (
                  <TableRow
                    key={row.id}
                    className="transition hover:bg-slate-50"
                  >
                    {row.getVisibleCells().map(
                      (cell) => (
                        <TableCell
                          key={cell.id}
                          className="px-4 py-3"
                        >
                          {flexRender(
                            cell.column
                              .columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      )
                    )}
                  </TableRow>
                )
              )
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TransactionHistoryLedger;