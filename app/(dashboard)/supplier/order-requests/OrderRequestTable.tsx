// /(dashboard)/supplier/order-requests/OrderRequestTable.tsx
"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"

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
} from "@tanstack/react-table"

import {
  CaretLeftIcon,
  CaretRightIcon,
  DotsThreeVerticalIcon,
} from "@phosphor-icons/react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

import { Loader2, Search } from "lucide-react"

/* =========================================================
   TYPES
========================================================= */

export type OrderRequest = {
  id: string
  orderId: string
  productName: string
  buyerName: string
  quantity: number
  value: number
  status: "PENDING" | "APPROVED" | "REJECTED"
}

/* =========================================================
   STATUS BADGE
========================================================= */

function StatusBadge({ status }: { status: OrderRequest["status"] }) {
  switch (status) {
    case "PENDING":
      return (
        <Badge className="border border-amber-100 bg-amber-50 text-amber-700">
          Pending
        </Badge>
      )

    case "APPROVED":
      return (
        <Badge className="border border-emerald-100 bg-emerald-50 text-emerald-700">
          Approved
        </Badge>
      )

    case "REJECTED":
      return (
        <Badge className="border border-red-100 bg-red-50 text-red-700">
          Rejected
        </Badge>
      )
  }
}

/* =========================================================
   COMPONENT
========================================================= */

interface Props {
  orders: OrderRequest[]
  isLoading?: boolean
  onView?: (order: OrderRequest) => void
  onApprove?: (order: OrderRequest) => void
  onReject?: (order: OrderRequest) => void
}

export default function OrderRequestTable({
  orders,
  isLoading = false,
  onView,
  onApprove,
  onReject,
}: Props) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] =
    React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [globalFilter, setGlobalFilter] = React.useState("")

  /* =========================================================
     COLUMNS
  ========================================================= */

  const columns = React.useMemo<ColumnDef<OrderRequest>[]>(
    () => [
      {
        accessorKey: "orderId",
        header: "Order ID",
        cell: ({ row }) => (
          <span className="font-mono text-xs font-semibold text-slate-700">
            {row.original.orderId}
          </span>
        ),
      },

      {
        accessorKey: "productName",
        header: "Product",
        cell: ({ row }) => (
          <div className="space-y-1">
            <div className="font-semibold text-slate-900">
              {row.original.productName}
            </div>
          </div>
        ),
      },

      {
        accessorKey: "buyerName",
        header: "Buyer",
        cell: ({ row }) => (
          <span className="text-sm text-slate-700">
            {row.original.buyerName}
          </span>
        ),
      },

      {
        accessorKey: "quantity",
        header: "Qty",
        cell: ({ row }) => (
          <span className="font-mono text-sm font-semibold text-slate-700">
            {row.original.quantity}
          </span>
        ),
      },

      {
        accessorKey: "value",
        header: "Value",
        cell: ({ row }) => (
          <span className="font-mono text-sm font-bold text-blue-600">
            ₦{row.original.value.toLocaleString()}
          </span>
        ),
      },

      {
        id: "status",
        header: "Status",
        cell: ({ row }) => (
          <StatusBadge status={row.original.status} />
        ),
      },

      {
        id: "actions",
        header: () => (
          <div className="text-right">Actions</div>
        ),
        cell: ({ row, table }) => {
          const meta = table.options.meta as {
            onView?: (o: OrderRequest) => void
            onApprove?: (o: OrderRequest) => void
            onReject?: (o: OrderRequest) => void
          }

          return (
            <div className="flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <DotsThreeVerticalIcon className="size-4" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => meta?.onView?.(row.original)}
                  >
                    View
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={() => meta?.onApprove?.(row.original)}
                  >
                    Approve
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => meta?.onReject?.(row.original)}
                    className="text-red-600"
                  >
                    Reject
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )
        },
      },
    ],
    []
  )

  /* =========================================================
     TABLE INSTANCE
  ========================================================= */

  const table = useReactTable({
    data: orders ?? [],
    columns,

    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
    },

    meta: {
      onView,
      onApprove,
      onReject,
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
  })

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

      {/* SEARCH */}
      <div className="flex items-center gap-3 border-b bg-slate-50 p-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <Input
            placeholder="Search orders..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-slate-50">
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id}>
                {group.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-[11px] font-bold uppercase tracking-wider text-slate-500"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length}>
                  <div className="flex items-center justify-center py-16 text-slate-400">
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Loading orders...
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length ? (
              <AnimatePresence>
                {table.getRowModel().rows.map((row) => (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="border-t hover:bg-slate-50"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-4">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </motion.tr>
                ))}
              </AnimatePresence>
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length}>
                  <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                    <p className="text-sm font-semibold">
                      No orders found
                    </p>
                    <p className="text-xs mt-1">
                      Incoming purchase requests will appear here.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* FOOTER */}
      <div className="flex items-center justify-between border-t bg-slate-50 p-4 text-xs text-slate-500">
        <div>
          Showing{" "}
          <span className="font-semibold text-slate-700">
            {table.getRowModel().rows.length}
          </span>{" "}
          items
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="outline"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <CaretLeftIcon />
          </Button>

          <Button
            size="icon"
            variant="outline"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <CaretRightIcon />
          </Button>
        </div>
      </div>
    </div>
  )
}