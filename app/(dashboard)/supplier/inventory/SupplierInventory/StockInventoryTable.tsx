// StockInventoryTable.tsx
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
  PencilSimpleIcon,
  PackageIcon,
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

import {
  Loader2,
  Search,
} from "lucide-react"

import type { InventoryProduct } from "@/types"

/* =========================================================
   REACT COMPILER FIX
========================================================= */


/* =========================================================
   TYPES
========================================================= */

interface StockInventoryTableProps {
  inventory: InventoryProduct[]
  onEdit?: (product: InventoryProduct) => void
  isLoading?: boolean
}

/* =========================================================
   STATUS BADGE
========================================================= */

function StatusBadge({
  stock,
  moq,
}: {
  stock: number
  moq: number
}) {
  const isOut = stock === 0
  const isLow = stock > 0 && stock < moq

  if (isOut) {
    return (
      <Badge className="border border-red-100 bg-red-50 text-red-700 hover:bg-red-50">
        Out of Stock
      </Badge>
    )
  }

  if (isLow) {
    return (
      <Badge className="border border-amber-100 bg-amber-50 text-amber-700 hover:bg-amber-50">
        Low Stock
      </Badge>
    )
  }

  return (
    <Badge className="border border-emerald-100 bg-emerald-50 text-emerald-700 hover:bg-emerald-50">
      Available
    </Badge>
  )
}

/* =========================================================
   COMPONENT
========================================================= */

export default function StockInventoryTable({
  inventory,
  onEdit,
  isLoading = false,
}: StockInventoryTableProps) {

  const [sorting, setSorting] =
    React.useState<SortingState>([])

  const [columnFilters, setColumnFilters] =
    React.useState<ColumnFiltersState>([])

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})

  const [globalFilter, setGlobalFilter] =
    React.useState("")

  /* =========================================================
     COLUMNS
  ========================================================= */

  const columns = React.useMemo<ColumnDef<InventoryProduct>[]>(
    () => [
      {
        accessorKey: "name",

        header: "Product",

        cell: ({ row }) => {
          const p = row.original

          return (
            <div className="space-y-1">
              <div className="font-semibold text-slate-900">
                {p.name}
              </div>

              <div className="text-xs text-slate-400">
                {p.category}
              </div>

              <div className="font-mono text-[11px] text-slate-500">
                NAFDAC: {p.nafdacNumber ?? "—"}
              </div>
            </div>
          )
        },
      },


      {
        accessorKey: "basePrice",

        header: "Base Price",

        cell: ({ row }) => (
          <span className="font-mono text-sm font-semibold text-slate-700">
            ₦{row.original.basePrice.toLocaleString()}
          </span>
        ),
      },

      {
        accessorKey: "finalPrice",

        header: "Final Price",

        cell: ({ row }) => (
          <span className="font-mono text-sm font-bold text-blue-600">
            ₦{row.original.finalPrice.toLocaleString()}
          </span>
        ),
      },

      {
        accessorKey: "stock",

        header: "Stock / MOQ",

        cell: ({ row }) => {
          const p = row.original

          return (
            <div>
              <div
                className={`font-mono text-sm font-bold ${
                  p.stock === 0
                    ? "text-red-600"
                    : p.stock < p.moq
                    ? "text-amber-600"
                    : "text-slate-800"
                }`}
              >
                {p.stock.toLocaleString()}
              </div>

              <div className="text-[10px] text-slate-400">
                MOQ: {p.moq}
              </div>
            </div>
          )
        },
      },

      {
        id: "status",

        header: "Status",

        cell: ({ row }) => (
          <StatusBadge
            stock={row.original.stock}
            moq={row.original.moq}
          />
        ),
      },

      {
        id: "actions",

        header: () => (
          <div className="text-right">
            Actions
          </div>
        ),

        cell: ({ row, table }) => {
          const meta = table.options.meta as {
            onEdit?: (p: InventoryProduct) => void
          }

          return (
            <div className="flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-slate-100"
                  >
                    <DotsThreeVerticalIcon className="size-4" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">

                  <DropdownMenuItem
                    onClick={() =>
                      meta?.onEdit?.(row.original)
                    }
                  >
                    <PencilSimpleIcon className="mr-2 size-4" />
                    Edit
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem className="text-red-600 focus:text-red-600">
                    Delete
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
    data: inventory ?? [],
    columns,

    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
    },

    meta: {
      onEdit,
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

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

      {/* =========================================================
          SEARCH BAR
      ========================================================= */}

      <div className="flex items-center gap-3 border-b bg-slate-50 p-4">

        <div className="relative w-full ">
        {/* <div className="relative w-full max-w-md"> */}

          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <Input
            placeholder="Search products..."
            value={globalFilter}
            onChange={(e) =>
              setGlobalFilter(e.target.value)
            }
            className="pl-9"
          />
        </div>
      </div>

      {/* =========================================================
          TABLE
      ========================================================= */}

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

                    Loading inventory...
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length ? (
              <AnimatePresence>

                {table.getRowModel().rows.map((row) => (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="border-t transition-colors hover:bg-slate-50"
                  >

                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="py-4"
                      >
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

                  <div className="flex flex-col items-center justify-center py-16 text-center text-slate-400">

                    <PackageIcon className="mb-3 h-10 w-10" />

                    <p className="text-sm font-semibold">
                      No inventory found
                    </p>

                    <p className="mt-1 text-xs">
                      Products added to inventory will appear here.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* =========================================================
          FOOTER
      ========================================================= */}

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