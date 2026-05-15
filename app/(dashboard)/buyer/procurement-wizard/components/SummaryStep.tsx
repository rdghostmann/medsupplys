// SummaryStep.tsx
"use client"

import { Card, CardContent } from "@/components/ui/card"
import { DeliveryDetails, Supplier } from "@/types"

// Shared type for clean component props
type Product = {
  name: string
  category: string
}

type Props = {
  product: Product
  supplier: Supplier
  quantity: number
  unitType: string
  totalUnits: number
  totalCost: number
  deliveryDetails: DeliveryDetails
}

export default function SummaryStep({
  product,
  supplier,
  quantity,
  unitType,
  totalUnits,
  totalCost,
  deliveryDetails,
}: Props) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* ORDER SUMMARY */}
      <Card className="rounded-3xl">
        <CardContent className="p-6">
          <h3 className="mb-6 text-lg font-bold">Order Summary</h3>
          <div className="space-y-4">
            <SummaryItem label="Product" value={product.name} />
            <SummaryItem label="Category" value={product.category} />
            <SummaryItem label="Supplier" value={supplier.name} />
            <SummaryItem label="Supplier Type" value={supplier.supplierType} />
            <SummaryItem label="Quantity" value={`${quantity} ${unitType}s`} />
            <SummaryItem label="Total Units" value={totalUnits.toLocaleString()} />
            <SummaryItem label="Unit Price" value={`₦${supplier.price.toLocaleString()}`} />
            
            <div className="border-t pt-4 mt-2">
              <SummaryItem 
                label="Total Cost" 
                value={`₦${totalCost.toLocaleString()}`} 
                large 
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* DELIVERY SUMMARY */}
      <Card className="rounded-3xl">
        <CardContent className="p-6">
          <h3 className="mb-6 text-lg font-bold">Delivery Information</h3>
          <div className="space-y-4">
            <SummaryItem label="Contact Name" value={deliveryDetails.contactName} />
            <SummaryItem label="Phone" value={deliveryDetails.phone} />
            <SummaryItem label="Address" value={deliveryDetails.address} className="items-start" />
            <SummaryItem label="Delivery Date" value={deliveryDetails.deliveryDate || "As soon as possible"} />
            <SummaryItem label="Notes" value={deliveryDetails.notes || "None"} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function SummaryItem({ 
  label, 
  value, 
  large = false,
  className = ""
}: { 
  label: string; 
  value: string; 
  large?: boolean;
  className?: string;
}) {
  return (
    <div className={`flex justify-between gap-4 ${className}`}>
      <span className="text-sm text-slate-500 whitespace-nowrap">{label}</span>
      <span className={`text-right font-semibold text-slate-900 ${large ? "text-2xl font-black text-primary" : "text-sm"}`}>
        {value}
      </span>
    </div>
  )
}

