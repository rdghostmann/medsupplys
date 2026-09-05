// app/(dashboard)/buyer/procurement-sourcing/page.tsx
"use client";

import { useRouter } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import BuyerProcurements from "./BuyerProcurements";

export default function Page() {
  const router = useRouter();

  /**
   * Mock refresh handler.
   *
   * BuyerProcurements already handles its own mock refresh state
   * and toast notification. This callback is intentionally kept
   * available for future page-level refresh/API synchronization.
   */
  const refreshProcurements = async () => {
    // Future API synchronization can be handled here.
    await Promise.resolve();
  };

  /**
   * Navigate to the Master Catalogue.
   */
  const handleOpenCatalogue = () => {
    router.push("/buyer/catalogue");
  };

  /**
   * Navigate to Buyer Orders.
   *
   * The order ID is preserved as a query parameter so the
   * Orders page can optionally open the specific order.
   */
  const handleOpenOrders = (orderId: string) => {
    router.push(
      `/buyer/orders?orderId=${encodeURIComponent(orderId)}`
    );
  };

  return (
    <div className="flex flex-1 flex-col">
      {/* Breadcrumb */}
      <Breadcrumb className="p-4 lg:px-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/buyer">
              Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbPage>
              Procurement Sourcing
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Main Content */}
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <BuyerProcurements
              onRefresh={refreshProcurements}
              onOpenCatalogue={handleOpenCatalogue}
              onOpenOrders={handleOpenOrders}
            />
          </div>
        </div>
      </div>
    </div>
  );
}