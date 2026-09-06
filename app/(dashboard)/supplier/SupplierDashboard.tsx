// /dashboard/supplier/SupplierDashboard.tsx

"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import type {
  CurrentSupplierUser,
  IncomingProcurementRequest,
  SupplierOrder,
} from "@/controllers/supplier.action";

import SupplierDashboardPage from "./SupplierDashboardPage";

interface SupplierDashboardProps {
  user: CurrentSupplierUser | null;
  incomingProcurementRequests: IncomingProcurementRequest[];
  orders: SupplierOrder[];
}

export default function SupplierDashboard({
  user,
  incomingProcurementRequests,
  orders,
}: SupplierDashboardProps) {
  return (
    <div className="flex flex-1 flex-col">
      <Breadcrumb className="p-4 lg:px-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/supplier">
              Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbPage>
              Supplier Dashboard
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <SupplierDashboardPage
              user={user}
              incomingProcurementRequests={incomingProcurementRequests}
              orders={orders}
            />
          </div>
        </div>
      </div>
    </div>
  );
}