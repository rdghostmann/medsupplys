// /dashboard/supplier/page.tsx

import { getCurrentSupplierDashboard } from "@/controllers/supplier.action";
import SupplierDashboard from "./SupplierDashboard";

export default async function Page() {
  const { user } = await getCurrentSupplierDashboard();

  return <SupplierDashboard user={user} />;
}