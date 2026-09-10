// app/(dashboard)/admin/global-sourcing-monitor/GlobalSourcingPage.tsx
"use client"

import { useRouter } from "next/navigation"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import GlobalSourcingMonitor from "./GlobalSourcingMonitor"

import type { AdminProcurement } from "@/controllers/procurement.controller"

interface GlobalSourcingPageProps {
  procurements: AdminProcurement[]
}

export default function GlobalSourcingPage({
  procurements,
}: GlobalSourcingPageProps) {
  const router = useRouter()

  const refreshProcurements = async () => {
    // Backend refresh can be added later.
    await Promise.resolve()
  }

  const handleOpenCatalogue = () => {
    router.push("/buyer/catalogue")
  }

  const handleOpenOrders = (orderId: string) => {
    router.push(`/buyer/orders?orderId=${encodeURIComponent(orderId)}`)
  }

  return (
    <div className="flex flex-1 flex-col">
      {/* Breadcrumb */}
      <Breadcrumb className="p-4 lg:px-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbPage>Global Sourcing Monitor</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Main Content */}
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <GlobalSourcingMonitor
              procurements={procurements}
              onRefresh={refreshProcurements}
              onOpenCatalogue={handleOpenCatalogue}
              onOpenOrders={handleOpenOrders}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
