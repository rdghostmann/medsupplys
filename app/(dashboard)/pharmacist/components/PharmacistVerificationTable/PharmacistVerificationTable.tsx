"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
  type VisibilityState,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ShieldCheck,
  XCircle,
  FileText,
  Download,
  Filter,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  UserCheck,
  Building2,
  Sparkles,
  RefreshCw,
  Clock,
  Plus
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PharmacistVerificationRecord, VerificationStatus } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
// import type { PharmacistVerificationRecord, VerificationStatus } from "../types";

export interface PharmacistVerificationTableProps {
  data?: PharmacistVerificationRecord[];
  onViewDetails?: (record: PharmacistVerificationRecord) => void;
  isLoading?: boolean;
  className?: string;
  showCardHeader?: boolean;
}

export const INITIAL_VERIFICATION_HISTORY: PharmacistVerificationRecord[] = [
  {
    id: "rec-1",
    orderId: "ORD-2021",
    product: "Paracetamol 500mg",
    category: "Analgesic / Antipyretic",
    dosage: "500mg Tablets (Blister Pack)",
    batchNo: "BATCH-4420",
    result: "Verified",
    pharmacist: "Dr. Amaka Obi",
    pharmacistLicense: "PCN/2018/88421",
    date: "2024-01-12",
    nafdacNumber: "04-2819",
    manufacturer: "Emzor Pharmaceuticals",
    expiryDate: "2026-11-30",
    quantity: 5000,
    facility: "National Hospital Abuja - Central Pharmacy",
    notes: "Batch passed laboratory dissolution test and chemical assay. Seal intact, cold storage specs verified at 21°C."
  },
  {
    id: "rec-2",
    orderId: "ORD-2018",
    product: "Ciprofloxacin 500mg",
    category: "Antibiotics / Fluoroquinolone",
    dosage: "500mg Film-coated Tablets",
    batchNo: "BATCH-4419",
    result: "Verified",
    pharmacist: "Dr. Amaka Obi",
    pharmacistLicense: "PCN/2018/88421",
    date: "2024-01-10",
    nafdacNumber: "04-9912",
    manufacturer: "Fidson Healthcare Plc",
    expiryDate: "2026-08-15",
    quantity: 2400,
    facility: "Lagos University Teaching Hospital (LUTH)",
    notes: "All blister packs tamper-evident. Micro-engraving on tablets conforms with standard NAFDAC reference."
  },
  {
    id: "rec-3",
    orderId: "ORD-2017",
    product: "Metformin 500mg",
    category: "Antidiabetic / Biguanide",
    dosage: "500mg Extended Release",
    batchNo: "BATCH-4418",
    result: "Verified",
    pharmacist: "Dr. Amaka Obi",
    pharmacistLicense: "PCN/2018/88421",
    date: "2024-01-09",
    nafdacNumber: "04-5534",
    manufacturer: "May & Baker Nigeria",
    expiryDate: "2027-02-28",
    quantity: 3600,
    facility: "Federal Medical Centre Ebute Metta",
    notes: "Certificate of Analysis (CoA) matched barcode scan against NAFDAC national verification ledger."
  },
  {
    id: "rec-4",
    orderId: "ORD-2016",
    product: "Ciprofloxacin 500mg",
    category: "Antibiotics / Fluoroquinolone",
    dosage: "500mg Film-coated Tablets",
    batchNo: "BATCH-4416",
    result: "Rejected",
    pharmacist: "Dr. Amaka Obi",
    pharmacistLicense: "PCN/2018/88421",
    date: "2024-01-08",
    nafdacNumber: "04-9912-EXP",
    manufacturer: "Unverified Third-Party Distributor",
    expiryDate: "2024-03-01",
    quantity: 1200,
    facility: "Port Harcourt General Hospital",
    notes: "Barcode check failed cryptographic checksum verification. Security seal was tampered with; flagged immediately for quarantine."
  },
  {
    id: "rec-5",
    orderId: "ORD-2015",
    product: "Lisinopril 10mg",
    category: "Cardiovascular / ACE Inhibitor",
    dosage: "10mg Oral Tablets",
    batchNo: "BATCH-4415",
    result: "Verified",
    pharmacist: "Dr. Amaka Obi",
    pharmacistLicense: "PCN/2018/88421",
    date: "2024-01-07",
    nafdacNumber: "04-1189",
    manufacturer: "Swiss Pharma Nigeria Ltd (Swipha)",
    expiryDate: "2026-10-31",
    quantity: 1800,
    facility: "University of Nigeria Teaching Hospital",
    notes: "Moisture-barrier foil packaging intact. Batch sample passed disintegration and pH consistency testing."
  },
  {
    id: "rec-6",
    orderId: "ORD-2014",
    product: "Amoxicillin + Clavulanic Acid 625mg",
    category: "Antibacterial / Penicillin",
    dosage: "625mg Co-amoxiclav Tablets",
    batchNo: "BATCH-4412",
    result: "Verified",
    pharmacist: "Dr. Amaka Obi",
    pharmacistLicense: "PCN/2018/88421",
    date: "2024-01-05",
    nafdacNumber: "04-7740",
    manufacturer: "GlaxoSmithKline Nigeria",
    expiryDate: "2026-05-30",
    quantity: 4200,
    facility: "Aminu Kano Teaching Hospital",
    notes: "Desiccant intact in all bottles. Secondary cartons verified with manufacturer serialized QR tags."
  },
  {
    id: "rec-7",
    orderId: "ORD-2012",
    product: "Artemether + Lumefantrine 80/480mg",
    category: "Antimalarial / ACT",
    dosage: "80/480mg Dispersible",
    batchNo: "BATCH-4408",
    result: "Verified",
    pharmacist: "Dr. Chidi Nwosu",
    pharmacistLicense: "PCN/2015/61902",
    date: "2024-01-04",
    nafdacNumber: "04-3310",
    manufacturer: "Novartis / Sandoz",
    expiryDate: "2026-12-31",
    quantity: 8000,
    facility: "National Hospital Abuja - Pediatric Wing",
    notes: "Batch release documentation reviewed and approved for pediatric clinical distribution."
  },
  {
    id: "rec-8",
    orderId: "ORD-2009",
    product: "Azithromycin 500mg",
    category: "Antibiotics / Macrolide",
    dosage: "500mg Tablets",
    batchNo: "BATCH-4403",
    result: "Rejected",
    pharmacist: "Dr. Amaka Obi",
    pharmacistLicense: "PCN/2018/88421",
    date: "2024-01-02",
    nafdacNumber: "04-0012-INV",
    manufacturer: "Suspicious Import Batch",
    expiryDate: "2024-05-15",
    quantity: 950,
    facility: "Lagos Island Maternity Hospital",
    notes: "Temperature excursion alert triggered on cold log monitor during transit (>32°C for 48 hours)."
  }
];

/* =========================================================
   RESULT BADGE COMPONENT (Matches UI Screenshot exactly)
========================================================= */
export function VerificationResultBadge({ result }: { result: VerificationStatus }) {
  if (result === "Verified") {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100/80">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
        Verified
      </span>
    );
  }

  if (result === "Rejected") {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-600 border border-rose-100/80">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
        Rejected
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-600 border border-amber-100/80">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
      Pending
    </span>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */
export function PharmacistVerificationTable({
  data = INITIAL_VERIFICATION_HISTORY,
  onViewDetails,
  isLoading = false,
  className,
  showCardHeader = true,
}: PharmacistVerificationTableProps) {
  const [tableData, setTableData] = React.useState<PharmacistVerificationRecord[]>(data);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<"ALL" | "Verified" | "Rejected">("ALL");
  const [selectedRecord, setSelectedRecord] = React.useState<PharmacistVerificationRecord | null>(null);
  const [showAddModal, setShowAddModal] = React.useState(false);

  // Sync state if prop changes
  React.useEffect(() => {
    setTableData(data);
  }, [data]);

  // Handle status quick filters
  const handleStatusFilterChange = (status: "ALL" | "Verified" | "Rejected") => {
    setStatusFilter(status);
    if (status === "ALL") {
      setColumnFilters((prev) => prev.filter((f) => f.id !== "result"));
    } else {
      setColumnFilters((prev) => [
        ...prev.filter((f) => f.id !== "result"),
        { id: "result", value: status },
      ]);
    }
  };

  /* =========================================================
     COLUMNS CONFIGURATION
  ========================================================= */
  const columns = React.useMemo<ColumnDef<PharmacistVerificationRecord>[]>(
    () => [
      {
        accessorKey: "orderId",
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1.5 hover:text-slate-700 transition-colors uppercase text-slate-400 font-bold text-xs tracking-wider"
          >
            ORDER ID
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="w-3 h-3 text-blue-600" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="w-3 h-3 text-blue-600" />
            ) : (
              <ArrowUpDown className="w-3 h-3 opacity-40 hover:opacity-100" />
            )}
          </button>
        ),
        cell: ({ row }) => (
          <div className="font-bold text-slate-900 text-sm whitespace-nowrap">
            {row.original.orderId}
          </div>
        ),
      },
      {
        accessorKey: "product",
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1.5 hover:text-slate-700 transition-colors uppercase text-slate-400 font-bold text-xs tracking-wider"
          >
            PRODUCT
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="w-3 h-3 text-blue-600" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="w-3 h-3 text-blue-600" />
            ) : (
              <ArrowUpDown className="w-3 h-3 opacity-40 hover:opacity-100" />
            )}
          </button>
        ),
        cell: ({ row }) => (
          <div className="text-slate-800 font-medium text-sm">
            {row.original.product}
            {row.original.dosage && (
              <span className="hidden lg:inline text-xs text-slate-400 ml-2">
                • {row.original.dosage}
              </span>
            )}
          </div>
        ),
      },
      {
        accessorKey: "batchNo",
        header: "BATCH NO.",
        cell: ({ row }) => (
          <span className="font-mono text-xs text-slate-700 font-medium tracking-tight bg-slate-100/70 px-2 py-0.5 rounded border border-slate-200/50">
            {row.original.batchNo}
          </span>
        ),
      },
      {
        accessorKey: "result",
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1.5 hover:text-slate-700 transition-colors uppercase text-slate-400 font-bold text-xs tracking-wider"
          >
            RESULT
            {column.getIsSorted() ? (
              <ArrowUpDown className="w-3 h-3 text-blue-600" />
            ) : (
              <ArrowUpDown className="w-3 h-3 opacity-40" />
            )}
          </button>
        ),
        cell: ({ row }) => <VerificationResultBadge result={row.original.result} />,
      },
      {
        accessorKey: "pharmacist",
        header: "PHARMACIST",
        cell: ({ row }) => (
          <div className="text-slate-700 font-medium text-sm whitespace-nowrap">
            {row.original.pharmacist}
          </div>
        ),
      },
      {
        accessorKey: "date",
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1.5 hover:text-slate-700 transition-colors uppercase text-slate-400 font-bold text-xs tracking-wider"
          >
            DATE
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="w-3 h-3 text-blue-600" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="w-3 h-3 text-blue-600" />
            ) : (
              <ArrowUpDown className="w-3 h-3 opacity-40 hover:opacity-100" />
            )}
          </button>
        ),
        cell: ({ row }) => (
          <span className="text-slate-700 font-medium text-sm tabular-nums whitespace-nowrap">
            {row.original.date}
          </span>
        ),
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <div className="text-right">
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onViewDetails) {
                  onViewDetails(row.original);
                } else {
                  setSelectedRecord(row.original);
                }
              }}
              className="px-2.5 py-1 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors inline-flex items-center gap-1 opacity-0 group-hover:opacity-100"
            >
              <Eye className="w-3.5 h-3.5" />
              View
            </button>
          </div>
        ),
      },
    ],
    [onViewDetails]
  );

  /* =========================================================
     TABLE INSTANCE
  ========================================================= */
  const table = useReactTable<PharmacistVerificationRecord>({
    data: tableData,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 6,
      },
    },
  });

  // Calculate quick stats
  const totalVerifications = tableData.length;
  const verifiedCount = tableData.filter((r) => r.result === "Verified").length;
  const rejectedCount = tableData.filter((r) => r.result === "Rejected").length;
  const verifiedRate = totalVerifications ? Math.round((verifiedCount / totalVerifications) * 100) : 100;

  // Export to CSV helper
  const handleExportCSV = () => {
    const headers = ["Order ID", "Product", "Batch No", "Result", "Pharmacist", "Date", "NAFDAC", "Facility", "Notes"];
    const rows = tableData.map((r) => [
      r.orderId,
      r.product,
      r.batchNo,
      r.result,
      r.pharmacist,
      r.date,
      r.nafdacNumber || "",
      r.facility || "",
      `"${(r.notes || "").replace(/"/g, '""')}"`,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `pharmacist_verification_history_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Top Controls Bar */}
      {showCardHeader && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Pharmacist Verification History</h2>
              <p className="text-xs text-slate-500">
                Official clinical audit trail & batch release verification logs
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search orders, batches, drugs..."
                value={globalFilter ?? ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all text-slate-800 placeholder:text-slate-400"
              />
              {globalFilter && (
                <button
                  onClick={() => setGlobalFilter("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  ×
                </button>
              )}
            </div>

            {/* Status Filter Buttons */}
            <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200/60 text-xs font-semibold">
              <button
                onClick={() => handleStatusFilterChange("ALL")}
                className={cn(
                  "px-3 py-1.5 rounded-lg transition-all",
                  statusFilter === "ALL"
                    ? "bg-white text-slate-900 shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                )}
              >
                All ({totalVerifications})
              </button>
              <button
                onClick={() => handleStatusFilterChange("Verified")}
                className={cn(
                  "px-3 py-1.5 rounded-lg transition-all flex items-center gap-1",
                  statusFilter === "Verified"
                    ? "bg-emerald-500 text-white shadow-xs font-bold"
                    : "text-slate-600 hover:text-emerald-700"
                )}
              >
                <span className={cn("w-1.5 h-1.5 rounded-full", statusFilter === "Verified" ? "bg-white" : "bg-emerald-500")} />
                Verified ({verifiedCount})
              </button>
              <button
                onClick={() => handleStatusFilterChange("Rejected")}
                className={cn(
                  "px-3 py-1.5 rounded-lg transition-all flex items-center gap-1",
                  statusFilter === "Rejected"
                    ? "bg-rose-500 text-white shadow-xs font-bold"
                    : "text-slate-600 hover:text-rose-700"
                )}
              >
                <span className={cn("w-1.5 h-1.5 rounded-full", statusFilter === "Rejected" ? "bg-white" : "bg-rose-500")} />
                Rejected ({rejectedCount})
              </button>
            </div>

            {/* Export CSV */}
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors shadow-xs"
              title="Export Log as CSV"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Export</span>
            </button>

            {/* New Verification Simulation */}
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-sm shadow-blue-500/20 active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Verify Batch</span>
            </button>
          </div>
        </div>
      )}

      {/* =========================================================
          THE MAIN TABLE CONTAINER (Matches UI mockup)
      ========================================================= */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b border-slate-100 bg-white">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider select-none"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody className="divide-y divide-slate-100/90">
              {isLoading ? (
                <tr>
                  <td colSpan={columns.length} className="py-16 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
                      <p className="text-sm font-medium text-slate-500">Loading pharmacist verification logs...</p>
                    </div>
                  </td>
                </tr>
              ) : table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => {
                      if (onViewDetails) {
                        onViewDetails(row.original);
                      } else {
                        setSelectedRecord(row.original);
                      }
                    }}
                    className="group transition-colors hover:bg-slate-50/80 cursor-pointer"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="py-4.5 px-6 align-middle">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="py-16 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                        <FileText className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-bold text-slate-700 mb-1">No matching verification records</p>
                      <p className="text-xs text-slate-400 mb-4">
                        Try adjusting your search keywords or clearing active filters.
                      </p>
                      <button
                        onClick={() => {
                          setGlobalFilter("");
                          handleStatusFilterChange("ALL");
                        }}
                        className="px-4 py-2 text-xs font-bold text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
                      >
                        Reset Filter
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* =========================================================
            TABLE FOOTER & PAGINATION
        ========================================================= */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/50 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>
              Showing{" "}
              <strong className="text-slate-800 font-semibold">
                {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}-
                {Math.min(
                  (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                  table.getFilteredRowModel().rows.length
                )}
              </strong>{" "}
              of <strong className="text-slate-800 font-semibold">{table.getFilteredRowModel().rows.length}</strong> records
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 mr-2">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
            </span>

            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-slate-600 transition-colors"
              aria-label="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-slate-600 transition-colors"
              aria-label="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================
          VERIFICATION DETAILS MODAL INSPECTOR
      ========================================================= */}
      <AnimatePresence>
        {selectedRecord && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden"
            >
              {/* Header */}
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">
                      Clinical Inspection Audit Certificate
                    </h3>
                    <p className="text-xs text-slate-500">Record ID: {selectedRecord.id}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="w-8 h-8 rounded-full bg-slate-200/60 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Order ID</span>
                    <p className="text-xl font-extrabold text-slate-900">{selectedRecord.orderId}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Verification Result
                    </span>
                    <VerificationResultBadge result={selectedRecord.result} />
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-xl border border-slate-100 bg-white space-y-1">
                    <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Product</span>
                    <p className="font-bold text-slate-900 text-sm">{selectedRecord.product}</p>
                    <p className="text-slate-500">{selectedRecord.category || "Pharmaceutical"}</p>
                  </div>

                  <div className="p-3.5 rounded-xl border border-slate-100 bg-white space-y-1">
                    <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Batch Number</span>
                    <p className="font-mono font-bold text-slate-900 text-sm">{selectedRecord.batchNo}</p>
                    <p className="text-slate-500">NAFDAC: {selectedRecord.nafdacNumber || "Verified Registry"}</p>
                  </div>

                  <div className="p-3.5 rounded-xl border border-slate-100 bg-white space-y-1">
                    <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Manufacturer</span>
                    <p className="font-bold text-slate-800">{selectedRecord.manufacturer || "Licensed Producer"}</p>
                    <p className="text-slate-500">Exp Date: {selectedRecord.expiryDate || "2026-12"}</p>
                  </div>

                  <div className="p-3.5 rounded-xl border border-slate-100 bg-white space-y-1">
                    <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Verified By</span>
                    <p className="font-bold text-slate-800">{selectedRecord.pharmacist}</p>
                    <p className="text-slate-500 font-mono">{selectedRecord.pharmacistLicense || "PCN/2018/88421"}</p>
                  </div>
                </div>

                {/* Facility info */}
                {selectedRecord.facility && (
                  <div className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-100 text-xs flex items-start gap-2.5">
                    <Building2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-blue-900">Destination Hospital / Facility</span>
                      <p className="text-blue-700">{selectedRecord.facility}</p>
                    </div>
                  </div>
                )}

                {/* Pharmacist Notes */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                    Clinical Audit Notes & Release Observations
                  </label>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 leading-relaxed font-sans">
                    {selectedRecord.notes || "Standard physical and laboratory quality release protocol conducted."}
                  </div>
                </div>

                {/* Pharmacist Stamp Badge */}
                <div className="p-4 rounded-2xl border-2 border-dashed border-emerald-200 bg-emerald-50/40 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                      PCN
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-xs">Pharmacists Council of Nigeria (PCN)</p>
                      <p className="text-[11px] text-slate-500">
                        Digitally signed on {selectedRecord.date} by {selectedRecord.pharmacist}
                      </p>
                    </div>
                  </div>
                  <UserCheck className="w-5 h-5 text-emerald-600" />
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-white border border-slate-200 rounded-xl transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    window.print();
                  }}
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all flex items-center gap-1.5 shadow-sm shadow-blue-500/20"
                >
                  <Download className="w-3.5 h-3.5" />
                  Print Inspection Certificate
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =========================================================
          SIMULATE ADDING A NEW VERIFICATION RECORD
      ========================================================= */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 p-6 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-blue-600" />
                  Log New Batch Verification
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-slate-400 hover:text-slate-600 text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.currentTarget;
                  const formData = new FormData(form);
                  const newRec: PharmacistVerificationRecord = {
                    id: `rec-${Date.now()}`,
                    orderId: (formData.get("orderId") as string) || `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
                    product: (formData.get("product") as string) || "Amoxicillin 500mg",
                    batchNo: (formData.get("batchNo") as string) || `BATCH-${Math.floor(4000 + Math.random() * 999)}`,
                    result: (formData.get("result") as VerificationStatus) || "Verified",
                    pharmacist: (formData.get("pharmacist") as string) || "Dr. Amaka Obi",
                    date: new Date().toISOString().slice(0, 10),
                    notes: (formData.get("notes") as string) || "Conducted thorough visual and chemical assay testing.",
                  };
                  setTableData((prev) => [newRec, ...prev]);
                  setShowAddModal(false);
                }}
                className="space-y-3 text-xs"
              >
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Order ID</label>
                  <input
                    name="orderId"
                    defaultValue={`ORD-${Math.floor(2022 + Math.random() * 50)}`}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 outline-hidden font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Product Name & Strength</label>
                  <input
                    name="product"
                    defaultValue="Ibuprofen 400mg Tablets"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Batch Number</label>
                    <input
                      name="batchNo"
                      defaultValue={`BATCH-${Math.floor(4421 + Math.random() * 200)}`}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 outline-hidden font-mono"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Verification Result</label>
                    <select
                      name="result"
                      defaultValue="Verified"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 outline-hidden font-semibold"
                    >
                      <option value="Verified">Verified (Pass)</option>
                      <option value="Rejected">Rejected (Fail/Quarantine)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Attending Pharmacist</label>
                  <input
                    name="pharmacist"
                    defaultValue="Dr. Amaka Obi"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Pharmacist Audit Notes</label>
                  <textarea
                    name="notes"
                    rows={2}
                    defaultValue="Security barcode intact. NAFDAC certificate cross-verified."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 outline-hidden"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-sm"
                  >
                    Save Record
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
export default PharmacistVerificationTable;
