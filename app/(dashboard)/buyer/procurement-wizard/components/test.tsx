To make your ProcurementWizard robust and production-ready, I have updated the
handleMakePayment function to use window.location.assign() (which is more
reliable for redirects) and added extra safety checks for the totalCost.

Here is the clean, updated component:

"use client"

import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { AlertTriangle, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import WizardStepper from "./WizardStepper"
import QuantityStep from "./QuantityStep"
import DeliveryStep from "./DeliveryStep"
import SummaryStep from "./SummaryStep"
import ReviewOrderStep from "./ReviewOrderStep"
import { Supplier } from "@/types"

/* =========================================================
   TYPES & COMPONENT
========================================================= */
// ... (Keep existing Type definitions)

export default function ProcurementWizard({
  product,
  suppliers,
  initialSupplierId,
}: Props) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [unitType, setUnitType] = useState<"carton" | "pack" | "unit">("unit")
  const [deliveryDetails, setDeliveryDetails] = useState<DeliveryDetails>({
    contactName: "",
    phone: "",
    address: "",
    deliveryDate: "",
    notes: "",
  })

  const selectedSupplier = useMemo(() => {
    return suppliers.find((s) => s.supplierProductId === initialSupplierId)
  }, [suppliers, initialSupplierId])

  const unitsPerType = { carton: 120, pack: 12, unit: 1 }
  const totalUnits = quantity * unitsPerType[unitType]
  const totalCost = totalUnits * (selectedSupplier?.price ?? 0)

  const steps = [
    { id: 1, title: "Review" },
    { id: 2, title: "Quantity" },
    { id: 3, title: "Delivery" },
    { id: 4, title: "Summary" },
  ]

  const validateOrder = () => {
    if (!selectedSupplier) { toast.error("Supplier not found"); return false }
    if (quantity < selectedSupplier.minOrderQuantity) {
      toast.error(`Min order quantity is ${selectedSupplier.minOrderQuantity}`); return false
    }
    if (!deliveryDetails.contactName.trim()) { toast.error("Contact name required"); return false }
    if (!deliveryDetails.phone.trim()) { toast.error("Phone required"); return false }
    if (!deliveryDetails.address.trim()) { toast.error("Address required"); return false }
    return true
  }

  /* ======================================================
     PAYMENT HANDLER
  ====================================================== */
  const handleMakePayment = async () => {
    if (!validateOrder()) return
    
    // Safety check for payment amount
    if (totalCost <= 0) {
      toast.error("Invalid total cost")
      return
    }

    setIsProcessingPayment(true)
    try {
      const payload = {
        productId: product._id,
        supplierId: selectedSupplier?.supplierProductId,
        quantity: totalUnits,
        supplierPrice: selectedSupplier?.price,
        totalPrice: totalCost,
        commission: Math.floor(totalCost * 0.05),
        fulfillmentMode: "single",
        candidateSuppliers: suppliers.map((s, idx) => ({
          supplierId: s?.supplierProductId,
          position: idx + 1,
        })),
        deliveryDetails,
      }

      const { data } = await axios.post("/api/payments/initialize", payload)

      if (data?.authorizationUrl) {
        // Use assign for proper history management
        window.location.assign(data.authorizationUrl)
      } else {
        throw new Error("No authorization URL received")
      }
    } catch (error: any) {
      console.error("PAYMENT_INIT_ERROR:", error)
      toast.error(error.response?.data?.message || "Payment initialization failed")
      setIsProcessingPayment(false)
    }
  }

  const nextStep = () => step < 4 && setStep((prev) => prev + 1)
  const prevStep = () => step > 1 && setStep((prev) => prev - 1)

  if (!selectedSupplier) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <Card className="w-full max-w-md rounded-3xl p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold">Supplier Not Found</h2>
          <Button className="mt-6 w-full rounded-2xl" onClick={() => router.back()}>Go Back</Button>
        </Card>
      </div>
    )
  }

  return (
    // ... (Keep your existing UI layout)
    // Ensure the Proceed Button calls handleMakePayment
    <Button 
      className="h-12 rounded-2xl px-8 font-semibold"
      onClick={handleMakePayment}
      disabled={isProcessingPayment}
    >
      {isProcessingPayment ? "Processing..." : "Proceed to Payment"}
    </Button>
  )
}

Key Debugging Advice for this specific component:

1.  Total Cost Logic: I kept your totalUnits and totalCost calculations. Ensure
    that selectedSupplier.price is coming from your Supplier type correctly. If
    totalCost results in NaN, the API will fail.
2.  axios request: Since you are using axios, check your browser's Network tab
    -> Payload on the request to /api/payments/initialize. Ensure totalPrice is
    a number, not a string.
3.  Redirection: If you click the button and nothing happens, check the Console
    for 401 Unauthorized errors. If you see that, it means your getServerSession
    in the API route is failing. Ensure you are logged in to the same domain as
    the app.
