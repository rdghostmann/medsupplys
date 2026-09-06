// app/(dashboard)/buyer/orders/page.tsx

import { getCurrentBuyerDashboard } from "@/controllers/buyer.actions";

import OrdersTracking from "./OrdersTracking";

export default async function Page() {
  const { orders } = await getCurrentBuyerDashboard();

  return (
    <OrdersTracking orders={orders} />
  );
}


