// VerifyPaymenPage.tsx

"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { useRouter, useSearchParams, useParams } from "next/navigation"
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function VerifyPaymentPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const reference = searchParams.get("reference")

  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying")

  useEffect(() => {
    // Prevent execution if no reference exists
    if (!reference) {
      setStatus("error")
      return
    }

    const verifyPayment = async () => {
      try {
        setStatus("verifying")
        await axios.post("/api/payments/verify", { reference })
        
        setStatus("success")
        
        // Redirect after short delay
        setTimeout(() => {
          router.push(`/buyer/orders/${params.orderId}`)
        }, 2000)
      } catch (error) {
        console.error("Verification failed:", error)
        setStatus("error")
      }
    }

    verifyPayment()
  }, [reference, router, params.orderId])

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md rounded-3xl border bg-white p-8 text-center shadow-sm">
        
        {status === "verifying" && (
          <div className="space-y-4">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
            <h2 className="text-xl font-black">Verifying Payment</h2>
            <p className="text-sm text-slate-500">Please wait while we confirm your transaction...</p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-4">
            <CheckCircle2 className="mx-auto h-14 w-14 text-green-500" />
            <h2 className="text-xl font-black">Payment Successful!</h2>
            <p className="text-sm text-slate-500">Redirecting to your order details...</p>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-4">
            <AlertCircle className="mx-auto h-14 w-14 text-red-500" />
            <h2 className="text-xl font-black text-slate-900">Verification Failed</h2>
            <p className="text-sm text-slate-500">We couldn't verify your payment. Please contact support if your money was debited.</p>
            <Button 
              variant="outline" 
              className="mt-4 w-full rounded-2xl" 
              onClick={() => router.push("/buyer/orders")}
            >
              View Orders
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
