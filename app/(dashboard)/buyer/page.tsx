// app/(dashboard)/buyer/page.tsx
"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { BuyerStatsCard } from "./components/BuyerStatsCard"
import BuyerOverview from "./components/BuyerOverview";
import { useSession } from "next-auth/react";

export default function Page() {

    const { data: session, status } = useSession();
  const isLoading = status === "loading";
   const user = session?.user
    ? {
        id: session.user.id,
        firstName: session.user.firstName,
        lastName: session.user.lastName,
        organization: session.user.organization,
        email: session.user.email ?? undefined,
      }
    : undefined;

  return (
    <div className="flex flex-1 flex-col">
      <Breadcrumb className="p-4 lg:px-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/buyer">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Buyer Overview</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">

          <div className="px-4 lg:px-6">
          <BuyerOverview
            user={user}
            loading={isLoading}
          />
            {/* <ChartAreaInteractive /> */}

          </div>
        </div>
      </div>
    </div>

  )
}


