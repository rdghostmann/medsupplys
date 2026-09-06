// app/(dashboard)/supplier/order-tracking/page.tsx

import OrderTrackingPage from "./OrderTrackingPage";

import {
  getCurrentSupplierOrders,
} from "@/controllers/supplier.action";

export default async function Page() {
  const orders =
    await getCurrentSupplierOrders();

  return (
    <OrderTrackingPage
      orders={orders}
    />
  );
}