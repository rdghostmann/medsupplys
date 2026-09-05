"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";

type AuditLogEntry = {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: "ADMIN" | "BUYER" | "SUPPLIER" | "PHARMACIST";
  action: string;
  entity: string;
  entityId: string;
  newValue: string;
  details: string;
  ipAddress: string;
  timestamp: string;
};

const auditLogs: AuditLogEntry[] = [
  {
    id: "aud-001",
    actorId: "usr-admin-1",
    actorName: "Engr. Randal Wilson",
    actorRole: "ADMIN",
    action: "CREDIT_ACCOUNT_APPROVED",
    entity: "CreditAccount",
    entityId: "crd-buyer-1",
    newValue: "₦5,000,000 Limit (Net 30)",
    details:
      "Approved revolving institutional credit line for LUTH",
    ipAddress: "197.210.226.41",
    timestamp: "2025-01-10T09:00:00.000Z",
  },
  {
    id: "aud-002",
    actorId: "usr-buyer-1",
    actorName: "Dr. Tunde Fashola",
    actorRole: "BUYER",
    action: "WALLET_TOPUP_SUCCESS",
    entity: "Wallet",
    entityId: "wlt-buyer-1",
    newValue:
      "+₦2,000,000 (Paystack Ref: PSTK_TOPUP_88492019)",
    details:
      "Buyer funded wallet using Paystack direct bank settlement",
    ipAddress: "102.89.33.102",
    timestamp: "2025-01-10T09:15:00.000Z",
  },
  {
    id: "aud-003",
    actorId: "usr-pharmacist-1",
    actorName: "Pharm. Dr. Amaka Obi",
    actorRole: "PHARMACIST",
    action: "PHARMACEUTICAL_BATCH_VERIFIED",
    entity: "Order",
    entityId: "ord-8820",
    newValue: "APPROVED (Batch MB-ACT-2408)",
    details:
      "Passed chemical stability & NAFDAC compliance check",
    ipAddress: "197.210.88.19",
    timestamp: "2025-01-13T10:30:00.000Z",
  },
];

const getRoleClass = (role: AuditLogEntry["actorRole"]) => {
  switch (role) {
    case "ADMIN":
      return "bg-purple-100 text-purple-700";

    case "BUYER":
      return "bg-blue-100 text-blue-700";

    case "SUPPLIER":
      return "bg-amber-100 text-amber-700";

    case "PHARMACIST":
      return "bg-emerald-100 text-emerald-700";

    default:
      return "bg-slate-100 text-slate-600";
  }
};

const formatDate = (timestamp: string) => {
  return new Date(timestamp).toLocaleDateString("en-NG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatTime = (timestamp: string) => {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

const AuditLog = () => {
  const columns = useMemo<ColumnDef<AuditLogEntry>[]>(
    () => [
      {
        accessorKey: "timestamp",
        header: "Timestamp",
        cell: ({ row }) => {
          const timestamp = row.original.timestamp;

          return (
            <div className="text-slate-500 font-mono text-[11px] whitespace-nowrap">
              <div>{formatDate(timestamp)}</div>

              <div className="text-[10px] text-slate-400 mt-0.5">
                {formatTime(timestamp)}
              </div>
            </div>
          );
        },
      },

      {
        accessorKey: "actorName",
        header: "Actor (Role)",
        cell: ({ row }) => {
          const log = row.original;

          return (
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-slate-900">
                {log.actorName}
              </span>

              <span
                className={`w-fit text-[9px] font-bold px-1.5 py-0.5 rounded ${getRoleClass(
                  log.actorRole
                )}`}
              >
                {log.actorRole}
              </span>
            </div>
          );
        },
      },

      {
        accessorKey: "action",
        header: "Action",
        cell: ({ row }) => (
          <span className="font-mono font-semibold text-blue-700 text-[11.5px]">
            {row.original.action}
          </span>
        ),
      },

      {
        accessorKey: "entity",
        header: "Entity",
        cell: ({ row }) => {
          const log = row.original;

          return (
            <div>
              <div className="font-semibold text-slate-700">
                {log.entity}
              </div>

              <div className="font-mono text-[10px] text-slate-400 mt-0.5">
                {log.entityId}
              </div>
            </div>
          );
        },
      },

      {
        accessorKey: "details",
        header: "Details",
        cell: ({ row }) => {
          const log = row.original;

          return (
            <div className="text-slate-600 max-w-md">
              <div className="truncate">
                {log.details}
              </div>

              <div className="text-[10px] text-slate-400 mt-1 font-mono truncate">
                {log.newValue}
              </div>

              <div className="text-[9px] text-slate-400 mt-1 font-mono">
                IP: {log.ipAddress}
              </div>
            </div>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data: auditLogs,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <h2 className="font-display text-sm font-bold text-slate-900 uppercase tracking-wider">
          System-wide Cryptographic Audit Trail ({auditLogs.length} Events)
        </h2>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10.5px] border-b border-slate-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="py-3 px-4 font-semibold"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody className="divide-y divide-slate-100">
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-slate-50 transition"
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="py-3 px-4"
                  >
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </td>
                ))}
              </tr>
            ))}

            {table.getRowModel().rows.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-12 text-center text-xs text-slate-500"
                >
                  No audit events found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditLog;