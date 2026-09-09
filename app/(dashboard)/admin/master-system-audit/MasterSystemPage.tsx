// /dashboard/admin/master-system-audit/MasterSystemPage.tsx
"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import MasterSystemAudit from "./MasterSystemAudit";
import type { AdminAuditLog } from "@/controllers/admin.actions";

export default function MasterSystemPage({
  audits,
}: {
  audits: AdminAuditLog[];
}) {
  return (
    <div className="flex flex-1 flex-col">
      <Breadcrumb className="p-4 lg:px-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/pharmacist">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Master System Audit Trail</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <MasterSystemAudit audits={audits} />

          </div>
        </div>
      </div>
    </div>

  )
}
