// /dashboard/supplier/inventory/InventoryPage.tsx
"use client"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import SupplierInventory  from "../components/SupplierInventory/SupplierInventory"

export default function InventoryPage() {
  return (
    <div className="flex flex-1 flex-col">
      <Breadcrumb className="p-4 lg:px-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/supplier">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Supplier Inventory</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 pb-4 md:gap-6 md:pb-6">
          <div className="px-4 lg:px-6">
            <div className="flex flex-1 flex-col">
              {/* Inventory management UI goes here */}
              <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-4 pb-4 md:gap-6 md:py-6">
          
                  <SupplierInventory  />

                </div>


              </div>
            </div>

          </div>
        </div>
      </div>
    </div>



  )
}