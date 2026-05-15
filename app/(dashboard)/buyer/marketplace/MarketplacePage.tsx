// app/(dashboard)/buyer/marketplace/MarketplacePage.tsx
"use client"


import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ProductCatalogue } from "./components/ProductCatalogue"
export type MarketplaceProduct = {
  _id: string
  product: {
    _id: string
    name: string
    category: string
    description: string
    image: string
  }
  suppliers: any[]
}

export default function MarketplacePage({
  products,
}: {
  products: MarketplaceProduct[]

}) {


  return (
    <>
      <div className="flex flex-1 flex-col">
        <Breadcrumb className="p-4 lg:px-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Browse Products</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <ProductCatalogue products={products} />
          </div>
        </div>
        {/* <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <ProductCatalogueDataTable products={products} />
          </div>
        </div> */}

        


      </div>

     

    </>
  )
}