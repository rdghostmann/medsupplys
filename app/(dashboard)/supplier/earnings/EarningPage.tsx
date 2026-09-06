// /dashboard/supplier/EarningPage.tsx
"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import SupplierRevenueCommission from "./SupplierRevenueCommission";

import type {
  CurrentSupplierUser,
  SupplierOrder,
  SupplierPayoutRecord,
} from "@/controllers/supplier.action";

interface EarningPageProps {
  user: CurrentSupplierUser | null;
  orders: SupplierOrder[];
  payouts: SupplierPayoutRecord[];
}

export default function EarningPage({
  user,
  orders,
  payouts,
}: EarningPageProps) {
  return (
    <div className="flex flex-1 flex-col">
      {/* Breadcrumb */}
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
              Revenue & Commission
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Page Content */}
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <SupplierRevenueCommission
              user={user}
              orders={orders}
              payouts={payouts}
            />
          </div>
        </div>
      </div>
    </div>
  );
}