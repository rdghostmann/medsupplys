// SupplierPool.tsx

"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ArrowLeft, FunnelSimple, MagnifyingGlass } from "@phosphor-icons/react"

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

import { useOrderStore } from "@/hooks/useOrderStore"
import SupplierCard from "../../components/SupplierCard"
import Loading from "./loading"
import { Supplier } from "@/types"

type Product = {
  _id: string
  name: string
  category: string
  description: string
  image: string
}

type Props = {
  product: Product
  suppliers: Supplier[]
}

type SortBy = "default" | "price" | "stock" | "score"

export function SupplierPool({ product, suppliers }: Props) {
  const router = useRouter()
  const { setRankedSuppliers, setComparisonSuppliers, setSelectedProduct, setBestSupplier, comparisonSuppliers } = useOrderStore()

  const [query, setQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const [sortBy, setSortBy] = useState<SortBy>("default")
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false)

  // Debounce Search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 250)
    return () => clearTimeout(timer)
  }, [query])

  // Rank Suppliers
  const rankedSuppliers = useMemo(() => {
    return [...suppliers].sort((a, b) => (b.score ?? 0) - (a.score ?? 0) || a.name.localeCompare(b.name))
  }, [suppliers])

  // Sync with Global Store
  useEffect(() => {
    if (rankedSuppliers.length > 0) {
      setRankedSuppliers(rankedSuppliers)
      setComparisonSuppliers(rankedSuppliers.slice(0, 5))
    }
  }, [rankedSuppliers, setRankedSuppliers, setComparisonSuppliers])

  // Filter & Sort Logic
  const filteredSuppliers = useMemo(() => {
    const search = debouncedQuery.toLowerCase()
    const filtered = rankedSuppliers.filter(
      (s) => s.name.toLowerCase().includes(search) || s.supplierType.toLowerCase().includes(search)
    )

    return [...filtered].sort((a, b) => {
      if (sortBy === "price") return a.price - b.price
      if (sortBy === "stock") return b.stock - a.stock
      if (sortBy === "score") return (b.score ?? 0) - (a.score ?? 0)
      return a.name.localeCompare(b.name)
    })
  }, [rankedSuppliers, debouncedQuery, sortBy])

  const handleOrderNow = useCallback((supplier: Supplier) => {
    if (!supplier?.supplierProductId) return
    setSelectedProduct({ _id: product._id, name: product.name, image: product.image })
    setBestSupplier(supplier.supplierProductId)
    router.push(`/buyer/procurement-wizard/${product._id}?supplierProduct=${supplier.supplierProductId}`)
  }, [product, router, setBestSupplier, setSelectedProduct])

  return (
    <>
      <Breadcrumb className="p-4 lg:px-6">
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="/buyer/marketplace">Marketplace</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>Suppliers Pool</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="min-h-screen bg-slate-50 pb-20">
        <div className="border-b bg-white/95 backdrop-blur">
          <div className="mx-auto flex w-full flex-col gap-5 p-4 lg:px-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="relative flex w-full flex-col items-start gap-4">
                <Button size="icon" variant="outline" className="absolute right-0 top-0 rounded-xl" onClick={() => router.back()}>
                  <ArrowLeft size={18} />
                </Button>
                <div className="flex items-center gap-4">
                  <div className="h-18 w-18 overflow-hidden rounded-2xl border bg-white">
                    <Image src={product.image || "/placeholder.png"} alt={product.name} width={72} height={72} className="h-full w-full object-cover" />
                  </div>
                  <div className="space-y-1">
                    <Badge variant="secondary" className="rounded-full px-3 py-1 text-[10px] uppercase">{product.category}</Badge>
                    <h1 className="text-xl font-black uppercase tracking-tight text-slate-900 lg:text-2xl">{product.name}</h1>
                    <p className="max-w-2xl text-sm text-slate-500">{product.description}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto w-full px-4 py-6 lg:px-6">
          <div className="mb-6 flex flex-col gap-3 py-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-md">
              <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search suppliers..." className="h-11 rounded-2xl border-slate-200 bg-white pl-10" />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {(["default", "price", "stock", "score"] as SortBy[]).map((item) => (
                <Button key={item} size="sm" variant={sortBy === item ? "default" : "outline"} onClick={() => setSortBy(item)} className="rounded-xl capitalize">
                  <FunnelSimple size={14} className="mr-2" />
                  {item === "default" ? "A-Z" : item}
                </Button>
              ))}
            </div>
          </div>

          {!suppliers ? <Loading /> : filteredSuppliers.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredSuppliers.map((s, idx) => (
                <SupplierCard key={s._id} s={s} idx={idx} onOrder={handleOrderNow} onCompare={() => setIsCompareModalOpen(true)} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center text-slate-500">No suppliers found matching your criteria.</div>
          )}
        </div>
      </div>

      <Dialog open={isCompareModalOpen} onOpenChange={setIsCompareModalOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto rounded-3xl sm:max-w-5xl">
          <DialogHeader><DialogTitle className="text-xl font-bold">Compare Suppliers</DialogTitle></DialogHeader>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {comparisonSuppliers.map((s) => (
              <div key={s._id} className="rounded-3xl border border-slate-200 bg-white p-5">
                <h3 className="font-bold">{s.name}</h3>
                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-slate-500">Price</span><span className="font-bold">₦{s.price.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Stock</span><span className="font-bold">{s.stock}</span></div>
                </div>
                <Button onClick={() => { setIsCompareModalOpen(false); handleOrderNow(s); }} className="mt-6 w-full rounded-2xl">Select Supplier</Button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
