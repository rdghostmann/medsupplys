// /dashboard/supplier/order-requests/OrderRequestsPage.tsx
"use client"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import OrderRequestTable, {
  type OrderRequest,
} from "./OrderRequestTable"


export default function OrderRequestsPage() {
  
const orders: OrderRequest[] = [
  {
    id: "1",
    orderId: "ORD-1001",
    productName: "Paracetamol 500mg",
    buyerName: "St. Mary's Pharmacy",
    quantity: 120,
    value: 85000,
    status: "PENDING",
  },

  {
    id: "2",
    orderId: "ORD-1002",
    productName: "Amoxicillin Capsules",
    buyerName: "LifeCare Hospital",
    quantity: 60,
    value: 120000,
    status: "APPROVED",
  },

  {
    id: "3",
    orderId: "ORD-1003",
    productName: "Vitamin C Tablets",
    buyerName: "MediPlus Store",
    quantity: 200,
    value: 45000,
    status: "REJECTED",
  },
]
  return (
    <div className="flex flex-1 flex-col">
      <Breadcrumb className="p-4 lg:px-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/supplier">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Order Requests</BreadcrumbPage>
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

                  <OrderRequestTable
                    orders={orders}
                    onView={(order) => {
                      console.log("VIEW:", order)
                    }}
                    onApprove={(order) => {
                      console.log("APPROVE:", order)
                    }}
                    onReject={(order) => {
                      console.log("REJECT:", order)
                    }}
                  />

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}