// app/(dashboard)/buyer/marketplace/page.tsx
import MarketplacePage from "./MarketplacePage"
import { getMarketplaceProducts } from "@/services/marketplace.service"

export default async function Page() {
  const products = await getMarketplaceProducts()

  return <MarketplacePage products={products} />
}