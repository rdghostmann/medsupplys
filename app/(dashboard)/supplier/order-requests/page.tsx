// /dashboard/supplier/order-requests/page.tsx

import OrderRequestPage from "./OrderRequestPage";
import {
    getCurrentSupplierDashboard,
} from "@/controllers/supplier.action";

export default async function Page() {
    const {
        user,
        incomingProcurementRequests,
    } = await getCurrentSupplierDashboard();

    return (
        <OrderRequestPage
            user={user}
            incomingProcurementRequests={incomingProcurementRequests}
        />
    );
}