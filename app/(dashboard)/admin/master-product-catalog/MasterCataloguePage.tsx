"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import MasterProductCatalog from "./MasterProductCatalog";

import type { MasterProduct } from "@/types";
import type { SupplierInventoryRecord } from "@/controllers/product.action";

interface MasterCataloguePageProps {
  products: MasterProduct[];
  inventory: SupplierInventoryRecord[];
}

export default function MasterCataloguePage({
  products,
  inventory,
}: MasterCataloguePageProps) {
  return (
    <div className="flex flex-1 flex-col">
      <Breadcrumb className="p-4 lg:px-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">
              Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbPage>
              Master Product Catalog
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <MasterProductCatalog
              products={products}
              inventory={inventory}
            />
          </div>
        </div>
      </div>
    </div>
  );
}