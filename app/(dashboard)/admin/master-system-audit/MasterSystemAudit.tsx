"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { useMemo } from "react";

type MasterSystemAuditEntry = {
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

const MasterSystemAudits: MasterSystemAuditEntry[] = [
  {
    id: "aud-001",
    actorId: "usr-admin-2",
    actorName: "MediSupply Fallback Engine",
    actorRole: "ADMIN",
    action: "PROCUREMENT_FALLBACK_ADVANCED",
    entity: "Procurement",
    entityId: "proc-fallback-003",
    newValue: "Automated fallback sequence advanced",
    details: "Buyer manually initiated automated fallback sequence.",
    ipAddress: "197.210.226.41",
    timestamp: "2025-01-10T18:05:14.000Z",
  },
  {
    id: "aud-002",
    actorId: "usr-admin-2",
    actorName: "MediSupply Fallback Engine",
    actorRole: "ADMIN",
    action: "PROCUREMENT_FALLBACK_ADVANCED",
    entity: "Procurement",
    entityId: "proc-fallback-002",
    newValue: "Automated fallback sequence advanced",
    details: "Buyer manually initiated automated fallback sequence.",
    ipAddress: "197.210.226.41",
    timestamp: "2025-01-10T18:02:25.000Z",
  },
  {
    id: "aud-003",
    actorId: "usr-admin-2",
    actorName: "MediSupply Fallback Engine",
    actorRole: "ADMIN",
    action: "PROCUREMENT_FALLBACK_ADVANCED",
    entity: "Procurement",
    entityId: "proc-fallback-001",
    newValue: "Automated fallback sequence advanced",
    details: "Buyer manually initiated automated fallback sequence.",
    ipAddress: "197.210.226.41",
    timestamp: "2025-01-10T18:02:18.000Z",
  },
  {
    id: "aud-004",
    actorId: "usr-admin-1",
    actorName: "Admin",
    actorRole: "ADMIN",
    action: "MATCHING_ALGORITHM_WEIGHTS_UPDATED",
    entity: "PlatformConfig",
    entityId: "platform-config-1",
    newValue: "Availability, Price, Tier & Fulfillment weights updated",
    details:
      "Adjusted matching engine weights across availability, price, tier, and fulfillment",
    ipAddress: "197.210.226.41",
    timestamp: "2025-01-10T17:33:12.000Z",
  },
  {
    id: "aud-005",
    actorId: "usr-admin-1",
    actorName: "Platform Administrator",
    actorRole: "ADMIN",
    action: "PRODUCT_CATALOG_UPDATED",
    entity: "Product",
    entityId: "prod-paracetamol-500",
    newValue:
      "Paracetamol 500mg Tablets (Ref Price: ₦1000, Commission: 10%, Status: ACTIVE)",
    details:
      "Updated Master Product: Paracetamol 500mg Tablets (Ref Price: ₦1000, Commission: 10%, Status: ACTIVE)",
    ipAddress: "197.210.226.41",
    timestamp: "2025-01-10T16:42:27.000Z",
  },
  {
    id: "aud-006",
    actorId: "usr-admin-1",
    actorName: "Platform Administrator",
    actorRole: "ADMIN",
    action: "PRODUCT_CATALOG_UPDATED",
    entity: "Product",
    entityId: "prod-paracetamol-500",
    newValue:
      "Paracetamol 500mg Tablets (Ref Price: ₦1000, Commission: 10%, Status: INACTIVE)",
    details:
      "Updated Master Product: Paracetamol 500mg Tablets (Ref Price: ₦1000, Commission: 10%, Status: INACTIVE)",
    ipAddress: "197.210.226.41",
    timestamp: "2025-01-10T16:42:26.000Z",
  },
  {
    id: "aud-007",
    actorId: "usr-admin-1",
    actorName: "Platform Administrator",
    actorRole: "ADMIN",
    action: "PRODUCT_CATALOG_UPDATED",
    entity: "Product",
    entityId: "prod-paracetamol-500",
    newValue:
      "Paracetamol 500mg Tablets (Ref Price: ₦1000, Commission: 10%, Status: ACTIVE)",
    details:
      "Updated Master Product: Paracetamol 500mg Tablets (Ref Price: ₦1000, Commission: 10%, Status: ACTIVE)",
    ipAddress: "197.210.226.41",
    timestamp: "2025-01-10T16:42:20.000Z",
  },
  {
    id: "aud-008",
    actorId: "usr-admin-1",
    actorName: "Platform Administrator",
    actorRole: "ADMIN",
    action: "PRODUCT_CATALOG_UPDATED",
    entity: "Product",
    entityId: "prod-paracetamol-500",
    newValue:
      "Paracetamol 500mg Tablets (Ref Price: ₦1000, Commission: 10%, Status: INACTIVE)",
    details:
      "Updated Master Product: Paracetamol 500mg Tablets (Ref Price: ₦1000, Commission: 10%, Status: INACTIVE)",
    ipAddress: "197.210.226.41",
    timestamp: "2025-01-10T16:42:18.000Z",
  },
  {
    id: "aud-009",
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
    timestamp: "2025-01-10T10:00:00.000Z",
  },
  {
    id: "aud-010",
    actorId: "usr-buyer-1",
    actorName: "Dr. Tunde Fashola",
    actorRole: "BUYER",
    action: "WALLET_TOPUP_SUCCESS",
    entity: "Wallet",
    entityId: "wlt-buyer-1",
    newValue: "+₦2,000,000 (Paystack Ref: PSTK_TOPUP_88492019)",
    details:
      "Buyer funded wallet using Paystack direct bank settlement",
    ipAddress: "102.89.33.102",
    timestamp: "2025-01-10T10:15:00.000Z",
  },
  {
    id: "aud-011",
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
    timestamp: "2025-01-10T11:30:00.000Z",
  },
];

const getRoleClass = (role: MasterSystemAuditEntry["actorRole"]) => {
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

const MasterSystemAudit = () => {
  const columns = useMemo<ColumnDef<MasterSystemAuditEntry>[]>(
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
    data: MasterSystemAudits,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <h2 className="font-display text-sm font-bold text-slate-900 uppercase tracking-wider">
          System-wide Cryptographic Audit Trail ({MasterSystemAudits.length} Events)
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

export default MasterSystemAudit;