// app/(dashboard)/buyer/procurement-wizard/[productId]/components/ProcurementWizard.tsx
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
   TYPES
========================================================= */

type Product = {
  _id: string

  name: string

  category: string

  description: string

  image: string
}

type Props = {
  product: Product

  suppliers: Supplier[]

  initialSupplierId?: string
}

export type DeliveryDetails = {
  contactName: string

  phone: string

  address: string

  deliveryDate?: string

  notes?: string
}

/* =========================================================
   COMPONENT
========================================================= */

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

      const { data } = await axios.post("/api/transaction/initialize", payload)

      if (data?.authorizationUrl) {
        // Use assign for proper history management
        window.location.assign(data.authorizationUrl)
      } else {
        throw new Error("No authorization URL received")
      }
    } catch (error: unknown) {
      // Create a type-safe way to access the error object
      const err = error as { response?: { data?: { message?: string } } };

      console.error("PAYMENT_INIT_ERROR:", err);

      // Extract the message safely
      const message = err.response?.data?.message || "Payment initialization failed";

      toast.error(message);
      setIsProcessingPayment(false);
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

  /* ======================================================
     UI
  ====================================================== */

  return (
    <>
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div
            className="
              min-h-screen
              bg-slate-50
            "
          >
            {/* HEADER */}

            <div
              className="
                sticky
                top-0
                z-40
                border-b
                bg-white/95
                backdrop-blur
              "
            >
              <div
                className="
                  mx-auto
                  flex
                  max-w-7xl
                  items-center
                  gap-4
                  px-4
                  py-4
                  lg:px-6
                "
              >
                <Button
                  size="icon"
                  variant="outline"
                  className="rounded-2xl"
                  onClick={() =>
                    router.back()
                  }
                >
                  <ArrowLeft
                    className="
                      h-5
                      w-5
                    "
                  />
                </Button>

                <div>
                  <h1
                    className="
                      text-lg
                      font-black
                      text-slate-900
                      lg:text-2xl
                    "
                  >
                    Procurement Wizard
                  </h1>

                  <p
                    className="
                      text-sm
                      text-slate-500
                    "
                  >
                    Complete your
                    procurement order
                  </p>
                </div>
              </div>
            </div>

            {/* CONTENT */}

            <div
              className="
                mx-auto
                flex
                max-w-7xl
                flex-col
                gap-6
                px-4
                py-6
                lg:px-6
              "
            >
              {/* STEPPER */}

              <WizardStepper
                currentStep={step}
                steps={steps}
              />

              {/* STEP CONTENT */}

              <motion.div
                key={step}
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.2,
                }}
              >
                {step === 1 && (
                  <ReviewOrderStep
                    product={product}
                    supplier={
                      selectedSupplier
                    }
                  />
                )}

                {step === 2 && (
                  <QuantityStep
                    supplier={
                      selectedSupplier
                    }
                    quantity={quantity}
                    setQuantity={
                      setQuantity
                    }
                    unitType={unitType}
                    setUnitType={
                      setUnitType
                    }
                    totalUnits={
                      totalUnits
                    }
                    totalCost={
                      totalCost
                    }
                  />
                )}

                {step === 3 && (
                  <DeliveryStep
                    deliveryDetails={
                      deliveryDetails
                    }
                    setDeliveryDetails={
                      setDeliveryDetails
                    }
                  />
                )}

                {step === 4 && (
                  <SummaryStep
                    product={product}
                    supplier={
                      selectedSupplier
                    }
                    quantity={quantity}
                    unitType={unitType}
                    totalUnits={
                      totalUnits
                    }
                    totalCost={
                      totalCost
                    }
                    deliveryDetails={
                      deliveryDetails
                    }
                  />
                )}
              </motion.div>

              {/* FOOTER ACTIONS */}

              <div
                className="
                  flex
                  flex-col-reverse
                  gap-3
                  pt-2
                  sm:flex-row
                  sm:justify-between
                "
              >
                <Button
                  variant="outline"
                  className="
                    h-12
                    rounded-2xl
                  "
                  disabled={step === 1}
                  onClick={prevStep}
                >
                  Previous
                </Button>

                {step < 4 ? (
                  <Button
                    className="
                      h-12
                      rounded-2xl
                      px-8
                      font-semibold
                    "
                    onClick={nextStep}
                  >
                    Continue
                  </Button>
                ) : (
                  <Button
                    className="h-12 rounded-2xl px-8 font-semibold"
                    onClick={handleMakePayment}
                    disabled={isProcessingPayment}
                  >
                    {isProcessingPayment ? "Processing..." : "Proceed to Payment"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}