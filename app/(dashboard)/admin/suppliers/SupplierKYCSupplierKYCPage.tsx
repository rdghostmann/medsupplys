// /admin/suppliers/SupplierKYCSupplierKYCPage.tsx
"use client"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import SupplierKYCManagement from "./SupplierKYCManagement"
import SupplierListing from "./SupplierListing"
import type { AdminSupplier } from "@/controllers/admin.actions"

export default function SupplierKYCSupplierKYCPage({
  suppliers,
}: {
  suppliers: AdminSupplier[]
}) {
  return (
    <div className="flex flex-1 flex-col">
      <Breadcrumb className="p-4 lg:px-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Supplier & KYC Approval</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <SupplierKYCManagement initialSuppliers={suppliers} />
            <div className="mt-8">
              <SupplierListing initialSuppliers={suppliers} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
