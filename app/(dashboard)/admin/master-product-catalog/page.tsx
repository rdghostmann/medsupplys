// /admin/master-product-catalog/page.tsx
import {
  findAllMasterProducts,
  findAllSupplierProductInventory,
} from "@/controllers/product.action";
import MasterCataloguePage from "./MasterCataloguePage";

export default async function Page() {
  const [products, inventory] = await Promise.all([
    findAllMasterProducts(),
    findAllSupplierProductInventory(),
  ]);


  return (
    <MasterCataloguePage
      products={products}
      inventory={inventory}
    />
  );
}