// /app/buyer/buyerwallet/topup/callback/page.tsx

"use client"

import React, { useEffect, useRef, useState } from "react"

import { CheckCircle2, XCircle, Loader2, ArrowLeft } from "lucide-react"

import { useRouter, useSearchParams } from "next/navigation"

import { toast } from "sonner"

type CallbackStatus = "VERIFYING" | "SUCCESS" | "FAILED"

type PaymentProvider = "paystack" | "flutterwave"

interface VerifyResponse {
  success?: boolean
  message?: string
  amount?: number
  reference?: string
  provider?: PaymentProvider
  status?: string
}

export default function WalletTopupCallbackPage() {
  const router = useRouter()

  const searchParams = useSearchParams()

  const verificationStarted = useRef(false)

  const [status, setStatus] = useState<CallbackStatus>("VERIFYING")

  const [message, setMessage] = useState("Verifying your payment...")

  const [amount, setAmount] = useState<number | null>(null)

  const [reference, setReference] = useState("")

  useEffect(() => {
    /*
     * React Strict Mode can execute effects
     * twice during development.
     *
     * Prevent duplicate verification requests.
     */
    if (verificationStarted.current) {
      return
    }

    verificationStarted.current = true

    let cancelled = false

    const verifyPayment = async () => {
      try {
        const providerParam = searchParams.get("provider")

        const provider = providerParam as PaymentProvider | null

        /*
         * Paystack callback:
         *
         * ?provider=paystack
         * &reference=TOPUP-...
         *
         * Flutterwave callback:
         *
         * ?provider=flutterwave
         * &tx_ref=TOPUP-...
         * &transaction_id=...
         * &status=successful
         */
        const paymentReference =
          searchParams.get("reference") ||
          searchParams.get("trxref") ||
          searchParams.get("tx_ref")

        if (!provider) {
          throw new Error("Payment provider was not provided.")
        }

        if (provider !== "paystack" && provider !== "flutterwave") {
          throw new Error("Unsupported payment provider.")
        }

        if (!paymentReference) {
          throw new Error("Payment reference was not provided.")
        }

        if (cancelled) {
          return
        }

        setReference(paymentReference)

        const endpoint =
          provider === "paystack"
            ? "/api/payments/paystack/verify"
            : "/api/payments/flutterwave/verify"

        const response = await fetch(endpoint, {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          /*
           * IMPORTANT:
           *
           * Only send the internal payment
           * reference to our server.
           *
           * The server authenticates the buyer
           * and independently verifies the
           * transaction with Paystack/Flutterwave.
           */
          body: JSON.stringify({
            reference: paymentReference,
          }),
        })

        let data: VerifyResponse

        try {
          data = (await response.json()) as VerifyResponse
        } catch {
          throw new Error("Invalid response from payment verification service.")
        }

        if (!response.ok || !data?.success) {
          throw new Error(data?.message || "Payment verification failed.")
        }

        if (cancelled) {
          return
        }

        const verifiedAmount = Number(data.amount ?? 0)

        setAmount(Number.isFinite(verifiedAmount) ? verifiedAmount : null)

        setStatus("SUCCESS")

        setMessage("Your wallet has been successfully funded.")

        toast.success("Wallet funded successfully")
      } catch (error) {
        if (cancelled) {
          return
        }

        console.error("[WALLET_TOPUP_CALLBACK]", error)

        setStatus("FAILED")

        setMessage(
          error instanceof Error
            ? error.message
            : "We could not verify your payment."
        )

        toast.error("Payment verification failed")
      }
    }

    void verifyPayment()

    return () => {
      cancelled = true
    }
  }, [searchParams])

  const returnToWallet = () => {
    router.push("/buyer/buyerwallet")

    router.refresh()
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="mx-auto w-full max-w-md">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
          {/* =========================================================
              VERIFYING
          ========================================================= */}
          {status === "VERIFYING" && (
            <div className="px-6 py-14 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
              </div>

              <h1 className="mt-6 text-lg font-bold text-slate-900">
                Verifying Payment
              </h1>

              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                Please wait while we verify your payment and update your
                institutional wallet.
              </p>

              {reference && (
                <div className="mt-5 rounded-xl bg-slate-50 p-3 text-left">
                  <p className="text-[10px] font-medium tracking-wide text-slate-400 uppercase">
                    Transaction Reference
                  </p>

                  <p className="mt-1 font-mono text-xs break-all text-slate-600">
                    {reference}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* =========================================================
              SUCCESS
          ========================================================= */}
          {status === "SUCCESS" && (
            <div className="px-6 py-12 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <CheckCircle2 className="h-9 w-9" />
              </div>

              <h1 className="mt-6 text-xl font-bold text-slate-900">
                Wallet Funded
              </h1>

              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                {message}
              </p>

              {amount !== null && amount > 0 && (
                <div className="mt-5 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                  <p className="text-xs font-medium text-emerald-700">
                    Amount Credited
                  </p>

                  <p className="mt-1 font-mono text-2xl font-bold text-emerald-700">
                    ₦{amount.toLocaleString("en-NG")}
                  </p>
                </div>
              )}

              {reference && (
                <div className="mt-4 rounded-xl bg-slate-50 p-3 text-left">
                  <p className="text-[10px] font-medium tracking-wide text-slate-400 uppercase">
                    Transaction Reference
                  </p>

                  <p className="mt-1 font-mono text-[10px] break-all text-slate-600">
                    {reference}
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={returnToWallet}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
              >
                <ArrowLeft className="h-4 w-4" />
                Return to Wallet
              </button>
            </div>
          )}

          {/* =========================================================
              FAILED
          ========================================================= */}
          {status === "FAILED" && (
            <div className="px-6 py-12 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-600">
                <XCircle className="h-9 w-9" />
              </div>

              <h1 className="mt-6 text-xl font-bold text-slate-900">
                Payment Not Verified
              </h1>

              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                {message}
              </p>

              {reference && (
                <div className="mt-5 rounded-xl bg-slate-50 p-3 text-left">
                  <p className="text-[10px] font-medium tracking-wide text-slate-400 uppercase">
                    Transaction Reference
                  </p>

                  <p className="mt-1 font-mono text-[10px] break-all text-slate-600">
                    {reference}
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={returnToWallet}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
              >
                <ArrowLeft className="h-4 w-4" />
                Return to Wallet
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
