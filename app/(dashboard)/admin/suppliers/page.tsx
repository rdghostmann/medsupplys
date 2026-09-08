// /admin/suppliers/page.tsx

import SupplierKYCSupplierKYCPage from "./SupplierKYCSupplierKYCPage";
import { getAdminSuppliers } from "@/controllers/admin.actions";

export default async function Page() {
  const suppliers = await getAdminSuppliers();

  return <SupplierKYCSupplierKYCPage suppliers={suppliers} />;
}
