// app/(dashboard)/buyer/marketplace/page.tsx

import { getMarketplaceProducts } from "@/services/marketplace.service"
import MarketplacePage from "./MarketplacePage"

export default async function Page() {
  const products = await getMarketplaceProducts()

  // console.log("=== BUYER MARKETPLACE DATA ===");
  // console.dir(products, {
  //   depth: null,
  //   colors: true,
  // });

  return <MarketplacePage products={products} />
}
