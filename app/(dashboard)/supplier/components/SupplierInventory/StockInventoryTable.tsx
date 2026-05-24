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
import { z } from "zod"

import {
  CaretDownIcon,
  CaretLeftIcon,
  CaretRightIcon,
  CaretDoubleLeftIcon,
  CaretDoubleRightIcon,
  DotsThreeVerticalIcon,
  PencilSimpleIcon,
  PackageIcon,
  ColumnsIcon,
} from "@phosphor-icons/react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
} from "@/components/ui/select"

import { Badge } from "@/components/ui/badge"

export const inventorySchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  batchInfo: z.string(),
  type: z.enum(["IMPORTER", "DISTRIBUTOR"]),
  unit: z.string(),
  basePrice: z.number(),
  commission: z.number(),
  finalPrice: z.number(),
  stock: z.number(),
  moq: z.number(),
})

type InventoryProduct = z.infer<typeof inventorySchema>

interface StockInventoryTableProps {
  inventory: InventoryProduct[]
  onEdit?: (product: InventoryProduct) => void
}

function StatusBadge({
  stock,
  moq,
}: {
  stock: number
  moq: number
}) {
  const isLowStock = stock > 0 && stock < moq
  const isOutOfStock = stock === 0

  if (isOutOfStock) {
    return (
      <Badge className="bg-red-50 text-red-700 border border-red-100 hover:bg-red-50">
        Out of Stock
      </Badge>
    )
  }

  if (isLowStock) {
    return (
      <Badge className="bg-amber-50 text-amber-700 border border-amber-100 hover:bg-amber-50">
        Low Stock
      </Badge>
    )
  }

  return (
    <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-50">
      Available
    </Badge>
  )
}

const columns: ColumnDef<InventoryProduct>[] = [
  {
    accessorKey: "name",
    header: "Product",
    cell: ({ row }) => {
      const product = row.original

      return (
        <div className="flex items-center gap-2">
          <div>
            <div className="font-semibold text-slate-900 leading-snug">
              {product.name}
            </div>

            <div className="text-xs text-slate-400 font-medium mt-0.5">
              {product.category}
            </div>

            <div
              className="text-[10px] text-slate-400 font-mono mt-0.5 italic max-w-[180px] truncate hover:text-slate-600 cursor-copy"
              title={product.batchInfo}
            >
              {product.batchInfo}
            </div>
          </div>
        </div>
      )
    },
  },

  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.original.type

      return type === "IMPORTER" ? (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border border-blue-200 bg-blue-50 text-blue-700">
          IMPORTER
        </span>
      ) : (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border border-emerald-200 bg-emerald-50 text-emerald-700">
          DISTRIBUTOR
        </span>
      )
    },
  },

  {
    accessorKey: "unit",
    header: "Unit",
    cell: ({ row }) => (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200/40">
        {row.original.unit}
      </span>
    ),
  },

  {
    accessorKey: "basePrice",
    header: "Base Price",
    cell: ({ row }) => (
      <div className="font-mono font-medium text-slate-700">
        ₦{row.original.basePrice.toLocaleString()}
      </div>
    ),
  },

  {
    accessorKey: "commission",
    header: "Commission",
    cell: ({ row }) => (
      <div className="font-mono text-xs text-slate-400 font-semibold">
        +₦{row.original.commission.toLocaleString()}
      </div>
    ),
  },

  {
    accessorKey: "finalPrice",
    header: "Final Price",
    cell: ({ row }) => (
      <div className="font-mono font-bold text-blue-600">
        ₦{row.original.finalPrice.toLocaleString()}
      </div>
    ),
  },

  {
    accessorKey: "stock",
    header: "Stock / MOQ",
    cell: ({ row }) => {
      const product = row.original

      const isLowStock =
        product.stock > 0 && product.stock < product.moq

      const isOutOfStock = product.stock === 0

      return (
        <div>
          <div
            className={`font-mono font-bold text-sm ${
              isOutOfStock
                ? "text-red-600"
                : isLowStock
                ? "text-amber-600"
                : "text-slate-800"
            }`}
          >
            {product.stock.toLocaleString()}
          </div>

          <div className="text-[10px] text-slate-400 font-medium">
            MOQ: {product.moq}
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
    header: () => <div className="text-right">Actions</div>,

    cell: ({ row, table }) => {
      const meta = table.options.meta as {
        onEdit?: (product: InventoryProduct) => void
      }

      return (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-8"
              >
                <DotsThreeVerticalIcon className="size-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem
                onClick={() => meta?.onEdit?.(row.original)}
              >
                <PencilSimpleIcon className="size-4 mr-2" />
                Edit Product
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem className="text-red-600 focus:text-red-600">
                Delete Product
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
  },
]

export default function StockInventoryTable({
  inventory,
  onEdit,
}: StockInventoryTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] =
    React.useState<ColumnFiltersState>([])

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})

  const [globalFilter, setGlobalFilter] = React.useState("")

  const table = useReactTable({
    data: inventory,
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

    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">

      {/* Top Toolbar */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 p-4 border-b border-slate-200 bg-slate-50/50">

        <div className="flex items-center gap-3 w-full lg:w-auto">
          <Input
            placeholder="Search pharmaceuticals..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="max-w-sm"
          />

          <Select
            onValueChange={(value) => {
              if (value === "all") {
                table.getColumn("type")?.setFilterValue(undefined)
              } else {
                table.getColumn("type")?.setFilterValue(value)
              }
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter type" />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="IMPORTER">
                  Importer
                </SelectItem>
                <SelectItem value="DISTRIBUTOR">
                  Distributor
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <ColumnsIcon className="mr-2 size-4" />
                Columns
                <CaretDownIcon className="ml-2 size-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-44">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                    className="capitalize"
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-slate-50 sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-b border-slate-200"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-[11px] font-bold text-slate-400 uppercase tracking-wider h-12"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            <AnimatePresence initial={false}>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="group border-b border-slate-100 hover:bg-slate-50/55 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="py-3.5 px-4"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </motion.tr>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-40"
                  >
                    <div className="flex flex-col items-center justify-center gap-3 text-center">
                      <PackageIcon className="size-12 text-slate-300" />

                      <div>
                        <p className="text-slate-600 font-semibold">
                          No inventory products found
                        </p>

                        <p className="text-xs text-slate-400 mt-1">
                          Try adjusting your filters or search query.
                        </p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>

      {/* Footer */}
      <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-col lg:flex-row items-center justify-between gap-4">

        <div className="text-xs text-slate-500">
          Showing{" "}
          <span className="font-semibold text-slate-700">
            {table.getRowModel().rows.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-slate-700">
            {inventory.length}
          </span>{" "}
          listed products
        </div>

        <div className="flex items-center gap-6">

          {/* Pagination */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <CaretDoubleLeftIcon className="size-4" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <CaretLeftIcon className="size-4" />
            </Button>

            <div className="text-xs font-medium text-slate-600 px-2">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>

            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <CaretRightIcon className="size-4" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() =>
                table.setPageIndex(table.getPageCount() - 1)
              }
              disabled={!table.getCanNextPage()}
            >
              <CaretDoubleRightIcon className="size-4" />
            </Button>
          </div>

          {/* Live Sync */}
          <div className="flex items-center gap-1.5 opacity-90">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse inline-block" />

            <span className="font-medium text-slate-600 font-mono text-xs">
              Live Sync Connected
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}