
"use client"

import { useEffect, useState, useCallback } from "react"
import axios from "axios"
import { useRouter, useParams, useSearchParams } from "next/navigation"
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

type VerificationStatus = "verifying" | "success" | "error"

export default function VerifyPaymentPage() {
  const router = useRouter()
  const params = useParams<{ orderId: string }>()
  const searchParams = useSearchParams()
  const reference = searchParams.get("reference")

  const [status, setStatus] = useState<VerificationStatus>("verifying")

  const verifyPayment = useCallback(async () => {
    // Check reference here inside the function, not as a side-effect
    if (!reference) {
      setStatus("error")
      return
    }

    try {
      setStatus("verifying")

      // NOTE: Ensure your route is actually GET as per previous discussions.
      // If it is GET, use axios.get(`/api/payments/verify?reference=${reference}`)
      await axios.post("/api/payments/verify", { reference })

      setStatus("success")

      setTimeout(() => {
        router.push(`/buyer/orders/${params.orderId}`)
      }, 2000)
    } catch (error) {
      console.error("Verification failed:", error)
      setStatus("error")
    }
  }, [reference, params.orderId, router])

  useEffect(() => {
    verifyPayment()
  }, [verifyPayment])

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        {status === "verifying" && (
          <div className="space-y-4">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
            <h2 className="text-2xl font-black text-slate-900">Verifying Payment</h2>
            <p className="text-sm leading-relaxed text-slate-500">
              Please wait while we confirm your transaction.
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-4">
            <CheckCircle2 className="mx-auto h-14 w-14 text-green-500" />
            <h2 className="text-2xl font-black text-slate-900">Payment Successful</h2>
            <p className="text-sm leading-relaxed text-slate-500">
              Your payment has been verified successfully. Redirecting...
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-5">
            <AlertCircle className="mx-auto h-14 w-14 text-red-500" />
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-slate-900">Verification Failed</h2>
              <p className="text-sm leading-relaxed text-slate-500">
                We could not verify your payment. Please contact support.
              </p>
            </div>
            <Button variant="outline" className="w-full rounded-2xl" onClick={() => router.push("/buyer/orders")}>
              View Orders
            </Button>
          </div>
        )}
      </div>
    </main>
  )
}

