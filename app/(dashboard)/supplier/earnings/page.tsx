import { getCurrentSupplierDashboard } from "@/controllers/supplier.action";
import EarningPage from "./EarningPage";

export default async function Page() {
  const { user, orders, payouts } =  await getCurrentSupplierDashboard();

  return (
    <EarningPage
      user={user}
      orders={orders}
      payouts={payouts}
    />
  );
}



