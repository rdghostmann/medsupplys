// DeliveryStep.tsx
"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label" // Recommended for accessibility

type DeliveryDetails = {
  contactName: string
  phone: string
  address: string
  deliveryDate?: string
  notes?: string
}

type Props = {
  deliveryDetails: DeliveryDetails
  setDeliveryDetails: (details: DeliveryDetails) => void
}

export default function DeliveryStep({ deliveryDetails, setDeliveryDetails }: Props) {
  const updateField = (field: keyof DeliveryDetails, value: string) => {
    setDeliveryDetails({
      ...deliveryDetails,
      [field]: value,
    })
  }

  return (
    <Card className="rounded-md">
      <CardContent className="p-5">
        <div className="space-y-5">
          <div>
            <h2 className="text-xl font-black">Delivery Details</h2>
            <p className="mt-1 text-sm text-slate-500">Enter your delivery information</p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="contactName">Contact Name</Label>
              <Input
                id="contactName"
                value={deliveryDetails.contactName}
                onChange={(e) => updateField("contactName", e.target.value)}
                className="h-12 rounded-md"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={deliveryDetails.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                className="h-12 rounded-md"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Delivery Address</Label>
            <Textarea
              id="address"
              value={deliveryDetails.address}
              onChange={(e) => updateField("address", e.target.value)}
              className="min-h-[120px] rounded-md"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="deliveryDate">Preferred Delivery Date</Label>
              <Input
                id="deliveryDate"
                type="date"
                value={deliveryDetails.deliveryDate || ""}
                onChange={(e) => updateField("deliveryDate", e.target.value)}
                className="h-12 rounded-md"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={deliveryDetails.notes || ""}
                onChange={(e) => updateField("notes", e.target.value)}
                className="rounded-md"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

