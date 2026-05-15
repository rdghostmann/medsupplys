"use client"

import { useEffect } from "react"

import axios from "axios"

import { useRouter, useSearchParams } from "next/navigation"

import { Loader2 } from "lucide-react"

import { toast } from "sonner"

export default function VerifyPaymentPage() {
  const router = useRouter()

  const searchParams =
    useSearchParams()

  useEffect(() => {
    const verify =
      async () => {
        try {
          const reference =
            searchParams.get(
              "reference"
            )

          if (!reference) return

          await axios.get(
            `/api/payments/verify?reference=${reference}`
          )

          toast.success(
            "Payment successful"
          )

          router.push(
            "/buyer/orders"
          )
        } catch (error) {
          console.log(error)

          toast.error(
            "Payment verification failed"
          )
        }
      }

    verify()
  }, [router, searchParams])

  return (
    <div
      className="
        flex
        min-h-screen
        flex-col
        items-center
        justify-center
        gap-4
      "
    >
      <Loader2
        className="
          h-10
          w-10
          animate-spin
        "
      />

      <p
        className="
          text-sm
          text-slate-500
        "
      >
        Verifying payment...
      </p>
    </div>
  )
}