// /admin/master-product-catalog/page.tsx
import { findAllMasterProducts } from "@/controllers/product.action";
import MasterCataloguePage from "./MasterCataloguePage";

export default async function Page() {
  const products = await findAllMasterProducts();

  return (
    <MasterCataloguePage
      products={products}
    />
  );
}