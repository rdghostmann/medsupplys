// app/(dashboard)/buyer/marketplace/components/ProductCatalogueDataTable.tsx
"use client"

import * as React from "react"
import {
   flexRender,
   getCoreRowModel,
   getFilteredRowModel,
   getPaginationRowModel,
   getSortedRowModel,
   useReactTable,
   type ColumnDef,
   type ColumnFiltersState,
   type SortingState,
} from "@tanstack/react-table"

import {
   CaretDoubleLeftIcon,
   CaretDoubleRightIcon,
   CaretDownIcon,
   CaretLeftIcon,
   CaretRightIcon,
   ColumnsIcon,
   DotsThreeVerticalIcon,
   MagnifyingGlassIcon,
   PlusIcon,
} from "@phosphor-icons/react"

import type { MarketplaceProduct } from "../MarketplacePage"

import { getLowestPrice, getStockStatus } from "@/lib/utility_functions"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
   DropdownMenu,
   DropdownMenuCheckboxItem,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
   Select,
   SelectContent,
   SelectGroup,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select"
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table"

type ProductCatalogueDataTableProps = {
   products: MarketplaceProduct[]
}

type TableProduct = {
   id: string
   image: string
   name: string
   category: string
   description: string
   suppliers: number
   lowestPrice: number
   stock: string
}

export function ProductCatalogueDataTable({
   products,
}: ProductCatalogueDataTableProps) {
   const [sorting, setSorting] = React.useState<SortingState>([])
   const [columnFilters, setColumnFilters] =
      React.useState<ColumnFiltersState>([])

   const [columnVisibility, setColumnVisibility] = React.useState({})

   const [pagination, setPagination] = React.useState({
      pageIndex: 0,
      pageSize: 10,
   })

   const data: TableProduct[] = React.useMemo(() => {
      return products.map((item) => ({
         id: item.product._id,
         image: item.product.image,
         name: item.product.name,
         category: item.product.category,
         description: item.product.description,
         suppliers: item.suppliers.length,
         lowestPrice: getLowestPrice(item.suppliers),
         stock: getStockStatus(item.suppliers),
      }))
   }, [products])

   const columns = React.useMemo<ColumnDef<TableProduct>[]>(
      () => [
         {
            accessorKey: "image",
            header: () => null,
            cell: ({ row }) => (
               <div className="size-14 overflow-hidden rounded-lg border bg-muted">
                  <img
                     src={row.original.image}
                     alt={row.original.name}
                     className="h-full w-full object-cover"
                  />
               </div>
            ),
            enableHiding: false,
         },

         {
            accessorKey: "name",
            header: "Product",
            cell: ({ row }) => (
               <div className="flex flex-col gap-1">
                  <button className="w-fit text-left font-medium text-foreground hover:underline">
                     {row.original.name}
                  </button>

                  <p className="line-clamp-2 max-w-md text-sm text-muted-foreground">
                     {row.original.description}
                  </p>
               </div>
            ),
            enableHiding: false,
         },

         {
            accessorKey: "category",
            header: "Category",
            cell: ({ row }) => (
               <div className="w-32">
                  <Badge
                     variant="outline"
                     className="px-1.5 text-muted-foreground capitalize"
                  >
                     {row.original.category}
                  </Badge>
               </div>
            ),
         },


         {
            accessorKey: "suppliers",
            header: "Suppliers",
            cell: ({ row }) => (
               <div className="font-medium text-foreground">
                  {row.original.suppliers}
               </div>
            ),
         },



         {
            id: "actions",
            cell: () => (
               <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                     <Button
                        variant="ghost"
                        className="flex size-8 text-muted-foreground data-[state=open]:bg-muted"
                        size="icon"
                     >
                        <DotsThreeVerticalIcon />
                        <span className="sr-only">Open menu</span>
                     </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-36">
                     <DropdownMenuItem>View Suppliers</DropdownMenuItem>

                  </DropdownMenuContent>
               </DropdownMenu>
            ),
         },
      ],
      []
   )

   const table = useReactTable({
      data,
      columns,

      state: {
         sorting,
         columnFilters,
         columnVisibility,
         pagination,
      },

      onSortingChange: setSorting,
      onColumnFiltersChange: setColumnFilters,
      onColumnVisibilityChange: setColumnVisibility,
      onPaginationChange: setPagination,

      getCoreRowModel: getCoreRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getSortedRowModel: getSortedRowModel(),
   })

   return (
      <div className="hidden flex-col gap-6">
         {/* TOPBAR */}
         <div className="flex items-center justify-between px-4 lg:px-6">

            <div className="w-full flex flex-col gap-3">
               <div>
                  <h1
                     className="
                  text-2xl
                  font-black
                  uppercase
                  tracking-tight
                  text-primary
                "
                  >
                     Product Catalog
                  </h1>

                  <p className="text-sm text-muted-foreground">
                     Browse verified healthcare products from multiple suppliers.
                  </p>
               </div>
               <div className="relative flex-1">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                     placeholder="Search products..."
                     value={
                        (table.getColumn("name")?.getFilterValue() as string) ?? ""
                     }
                     onChange={(event) =>
                        table.getColumn("name")?.setFilterValue(event.target.value)
                     }
                     className="h-11
                  rounded-xl
                  border-slate-200
                  bg-slate-50
                  pl-10
                  text-sm
                  shadow-none
                  focus-visible:ring-1
                  focus-visible:ring-blue-500"
                  />
               </div>


               <Select
                  onValueChange={(value) => {
                     table
                        .getColumn("category")
                        ?.setFilterValue(value === "all" ? "" : value)
                  }}
               >
                  <SelectTrigger className="w-[180px]" size="sm">
                     <SelectValue placeholder="Category" />
                  </SelectTrigger>

                  <SelectContent>
                     <SelectGroup>
                        <SelectItem value="all">All Categories</SelectItem>

                        {[...new Set(data.map((item) => item.category))].map(
                           (category) => (
                              <SelectItem key={category} value={category}>
                                 {category}
                              </SelectItem>
                           )
                        )}
                     </SelectGroup>
                  </SelectContent>
               </Select>
            </div>


         </div>

         {/* TABLE */}
         <div className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
            <div className="overflow-hidden rounded-lg border">
               <Table>
                  <TableHeader className="sticky top-0 z-10 bg-muted">
                     {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                           {headerGroup.headers.map((header) => (
                              <TableHead key={header.id}>
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
                     {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                           <TableRow
                              key={row.id}
                              className="transition-colors hover:bg-muted/40"
                           >
                              {row.getVisibleCells().map((cell) => (
                                 <TableCell key={cell.id}>
                                    {flexRender(
                                       cell.column.columnDef.cell,
                                       cell.getContext()
                                    )}
                                 </TableCell>
                              ))}
                           </TableRow>
                        ))
                     ) : (
                        <TableRow>
                           <TableCell
                              colSpan={columns.length}
                              className="h-24 text-center"
                           >
                              No products found.
                           </TableCell>
                        </TableRow>
                     )}
                  </TableBody>
               </Table>
            </div>

            {/* PAGINATION */}
            <div className="flex items-center justify-between px-4">
               <div className="hidden flex-1 text-sm text-muted-foreground lg:flex">
                  Showing {table.getRowModel().rows.length} of{" "}
                  {data.length} products.
               </div>

               <div className="flex w-full items-center gap-8 lg:w-fit">
                  <div className="hidden items-center gap-2 lg:flex">
                     <Label
                        htmlFor="rows-per-page"
                        className="text-sm font-medium"
                     >
                        Rows per page
                     </Label>

                     <Select
                        value={`${table.getState().pagination.pageSize}`}
                        onValueChange={(value) => {
                           table.setPageSize(Number(value))
                        }}
                     >
                        <SelectTrigger
                           size="sm"
                           className="w-20"
                           id="rows-per-page"
                        >
                           <SelectValue />
                        </SelectTrigger>

                        <SelectContent side="top">
                           <SelectGroup>
                              {[10, 20, 30, 40, 50].map((pageSize) => (
                                 <SelectItem
                                    key={pageSize}
                                    value={`${pageSize}`}
                                 >
                                    {pageSize}
                                 </SelectItem>
                              ))}
                           </SelectGroup>
                        </SelectContent>
                     </Select>
                  </div>

                  <div className="flex w-fit items-center justify-center text-sm font-medium">
                     Page {table.getState().pagination.pageIndex + 1} of{" "}
                     {table.getPageCount()}
                  </div>

                  <div className="ml-auto flex items-center gap-2 lg:ml-0">
                     <Button
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex"
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                     >
                        <span className="sr-only">Go to first page</span>

                        <CaretDoubleLeftIcon />
                     </Button>

                     <Button
                        variant="outline"
                        className="size-8"
                        size="icon"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                     >
                        <span className="sr-only">Go to previous page</span>

                        <CaretLeftIcon />
                     </Button>

                     <Button
                        variant="outline"
                        className="size-8"
                        size="icon"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                     >
                        <span className="sr-only">Go to next page</span>

                        <CaretRightIcon />
                     </Button>

                     <Button
                        variant="outline"
                        className="hidden size-8 lg:flex"
                        size="icon"
                        onClick={() =>
                           table.setPageIndex(table.getPageCount() - 1)
                        }
                        disabled={!table.getCanNextPage()}
                     >
                        <span className="sr-only">Go to last page</span>

                        <CaretDoubleRightIcon />
                     </Button>
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}