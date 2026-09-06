// app/(dashboard)/OrdersTracking.tsx
"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { BuyerOrders } from "./BuyerOrder";
import type { BuyerOrder } from "./BuyerOrder";
import type { Order } from "@/types";

interface OrdersTrackingProps {
  orders: Order[];
}

const toBuyerOrder = (order: Order): BuyerOrder => {
  const firstItem = order.items?.[0];
  const supplierType = order.supplierType?.toLowerCase();

  return {
    id: order.id,
    orderNumber: order.orderNumber || order.id,
    status: order.status.toUpperCase().replace(/ /g, "_") as BuyerOrder["status"],
    supplierId: order.supplierId || "",
    supplierName: order.supplierName || order.supplier,
    supplierType:
      supplierType === "importer" ||
      supplierType === "distributor" ||
      supplierType === "retailer"
        ? supplierType
        : "retailer",
    items: (order.items || []).map((item) => ({
      id: item.productId,
      name: item.name,
      category: "Pharmaceutical",
      quantity: item.quantity,
      unit: item.unit,
      unitPrice: item.unitPrice,
      total: item.subtotal,
    })),
    subtotal: order.subtotal || 0,
    deliveryFee: 0,
    total: order.total || 0,
    batchNumber:
      order.batchNo || firstItem?.batchNumber || "-",
    manufacturingDate: order.mfgDate,
    expiryDate:
      order.expiryDate || firstItem?.expiryDate || "",
    deliveryAddress: order.deliveryAddress || "-",
    coldChainRequired: false,
    trackingUpdates: (order.trackingUpdates || []).map(
      (update) => ({
        title: update.title,
        description: update.description,
        timestamp: update.timestamp,
        completed: true,
      })
    ),
    createdAt: order.createdAt || order.date,
    updatedAt: order.updatedAt || order.date,
  };
};

export default function OrdersTracking({
  orders,
}: OrdersTrackingProps) {



  return (
    <div className="flex flex-1 flex-col">
      <Breadcrumb className="p-4 lg:px-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/buyer">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>My Orders & Tracking</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">

          <div className="px-4 lg:px-6">
            <BuyerOrders orders={orders.map(toBuyerOrder)} />

          </div>
        </div>
      </div>
    </div>

  )
}


