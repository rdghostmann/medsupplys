// /buyer/procurement-wizard/[productId]/page.tsx

import { notFound } from "next/navigation"
import ProcurementWizard from "../components/ProcurementWizard"
import { getMarketplaceProductById } from "@/controllers/getMarketplaceProduct"

type PageProps = {
  params: Promise<{ productId: string }>
  searchParams?: Promise<{ supplierProduct?: string }>
}

export default async function Page({ params, searchParams }: PageProps) {
  const { productId } = await params
  const resolvedSearchParams = searchParams ? await searchParams : {}
  const supplierProductId = resolvedSearchParams?.supplierProduct

  const marketplaceProduct = await getMarketplaceProductById({
    productId,
    supplierProductId,
  })

  if (!marketplaceProduct) {
    notFound()
  }

  const selectedSupplier =
    marketplaceProduct.suppliers.find(
      (supplier) => supplier.supplierProductId === supplierProductId
    ) || marketplaceProduct.suppliers?.[0]

  return (
    <div className="min-h-screen bg-slate-50">
      <ProcurementWizard
        product={marketplaceProduct.product}
        suppliers={marketplaceProduct.suppliers}
        initialSupplierId={selectedSupplier?.supplierProductId}
      />
    </div>
  )
}