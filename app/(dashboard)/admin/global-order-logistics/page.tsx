// app/(dashboard)/admin/global-order-logistics/page.tsx

import GlobalLogisticsOrderPage from "./GlobalLogisticsOrderPage"
import { getAdminOrders } from "@/controllers/admin.actions"

export default async function Page() {
  const orders = await getAdminOrders()

  return <GlobalLogisticsOrderPage orders={orders} />
}
