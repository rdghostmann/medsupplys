"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { useRouter, useParams, useSearchParams } from "next/navigation"
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

type Status = "verifying" | "success" | "error"

export default function VerificationPaymentPage() {
  const router = useRouter()

  const params = useParams<{ orderId: string }>()
  const searchParams = useSearchParams()

  const reference = searchParams.get("reference")

  const [status, setStatus] = useState<Status>("verifying")

  useEffect(() => {
    let mounted = true

    const run = async () => {
      if (!reference) {
        if (mounted) setStatus("error")
        return
      }

      try {
        setStatus("verifying")

        await axios.get(`/api/transaction/verify?reference=${reference}`)

        if (!mounted) return

        setStatus("success")

        setTimeout(() => {
          router.push( `/buyer/orders/${params.orderId}` )
        }, 2000)
      } catch (err) {
        console.error(err)
        if (mounted) setStatus("error")
      }
    }

    run()

    return () => {
      mounted = false
    }
  }, [reference, params.orderId, router])

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-3xl border bg-white p-8 text-center shadow-sm">

        {status === "verifying" && (
          <div className="space-y-4">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
            <h2 className="text-xl font-bold">
              Verifying Payment
            </h2>
            <p className="text-sm text-slate-500">
              Confirming transaction...
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-4">
            <CheckCircle2 className="mx-auto h-14 w-14 text-green-500" />
            <h2 className="text-xl font-bold">
              Payment Successful
            </h2>
            <p className="text-sm text-slate-500">
              Redirecting to order...
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-4">
            <AlertCircle className="mx-auto h-14 w-14 text-red-500" />
            <h2 className="text-xl font-bold">
              Verification Failed
            </h2>
            <p className="text-sm text-slate-500">
              Payment could not be verified.
            </p>

            <Button
              className="w-full rounded-2xl"
              variant="outline"
              onClick={() =>
                router.push("/buyer/orders")
              }
            >
              Back to Orders
            </Button>
          </div>
        )}

      </div>
    </main>
  )
}