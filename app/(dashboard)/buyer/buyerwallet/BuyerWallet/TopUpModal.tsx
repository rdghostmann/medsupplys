// TopUpModal.tsx
"use client";

import React, { useState } from "react";
import {
  X,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Radio,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

type PaymentMethod =
  | "paystack"
  | "flutterwave";

type PaymentStep =
  | "FORM"
  | "PROCESSING";

interface PaymentInitializeResponse {
  success?: boolean;
  message?: string;
  reference?: string;
  checkoutUrl?: string;
  provider?: string;
  providerReference?: string;
}

interface TopUpModalProps {
  isOpen: boolean;
  onClose: () => void;

  currentUser?: {
    id: string;
  } | null;

  onSuccess?: () => Promise<void> | void;
}

export const TopUpModal: React.FC<
  TopUpModalProps
> = ({
  isOpen,
  onClose,
  currentUser,
  onSuccess,
}) => {
  const [amount, setAmount] =
    useState<number>(100000);

  const [
    paymentMethod,
    setPaymentMethod,
  ] = useState<PaymentMethod>(
    "paystack"
  );

  const [step, setStep] =
    useState<PaymentStep>("FORM");

  const [
    isProcessing,
    setIsProcessing,
  ] = useState(false);

  const [lastRef, setLastRef] =
    useState("");

  if (!isOpen) {
    return null;
  }

  const quickAmounts = [
    10000,
    25000,
    50000,
    100000,
  ];

  const formatAmount = (
    value: number
  ) =>
    `₦${value.toLocaleString("en-NG")}`;

  const handleAmountChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = Number(
      event.target.value
    );

    if (Number.isNaN(value)) {
      setAmount(0);
      return;
    }

    setAmount(value);
  };

  const handleContinuePayment =
    async () => {
      /*
       * ---------------------------------------------------------
       * CLIENT-SIDE VALIDATION
       * ---------------------------------------------------------
       */

      if (
        !Number.isFinite(amount) ||
        amount <= 0
      ) {
        toast.error(
          "Invalid amount",
          {
            description:
              "Please enter an amount greater than ₦0.",
          }
        );

        return;
      }

      /*
       * The server does the authoritative
       * authentication and validation.
       *
       * We still check this client-side so
       * the user gets an immediate message.
       */
      if (!currentUser?.id) {
        toast.error(
          "Authentication required",
          {
            description:
              "Unable to identify your wallet account.",
          }
        );

        return;
      }

      /*
       * Prevent duplicate clicks while
       * initialization is running.
       */
      if (isProcessing) {
        return;
      }

      setIsProcessing(true);
      setStep("PROCESSING");

      try {
        /*
         * -------------------------------------------------------
         * INITIALIZE PAYMENT ON OUR SERVER
         * -------------------------------------------------------
         *
         * IMPORTANT:
         *
         * We intentionally send ONLY the amount.
         *
         * buyerId comes from the authenticated
         * NextAuth session on the server.
         *
         * The client must never be trusted to
         * choose which buyer wallet gets credited.
         */
        const endpoint =
          paymentMethod === "paystack"
            ? "/api/payments/paystack/initialize"
            : "/api/payments/flutterwave/initialize";

        const response =
          await fetch(
            endpoint,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                amount,
              }),
            }
          );

        /*
         * Safely parse the response.
         */
        let data: PaymentInitializeResponse;

        try {
          data =
            (await response.json()) as PaymentInitializeResponse;
        } catch {
          throw new Error(
            "Invalid response from payment service."
          );
        }

        /*
         * -------------------------------------------------------
         * INITIALIZATION FAILED
         * -------------------------------------------------------
         */
        if (
          !response.ok ||
          !data?.success ||
          !data?.checkoutUrl
        ) {
          throw new Error(
            data?.message ||
              "Unable to initialize payment."
          );
        }

        /*
         * Store our INTERNAL payment reference.
         *
         * This is useful for displaying the transaction
         * while the browser is redirected.
         */
        if (data.reference) {
          setLastRef(
            data.reference
          );
        }

        /*
         * -------------------------------------------------------
         * GATEWAY REDIRECT
         * -------------------------------------------------------
         *
         * Do NOT:
         *
         * - credit wallet here
         * - mark payment successful here
         * - trust checkout success here
         * - create WalletTransaction here
         *
         * The payment callback + server-side gateway
         * verification handles that.
         */
        window.location.assign(
          data.checkoutUrl
        );
      } catch (error: unknown) {
        console.error(
          "[WALLET_TOPUP_INITIALIZE]",
          error
        );

        setIsProcessing(false);
        setStep("FORM");

        toast.error(
          "Unable to start payment",
          {
            description:
              error instanceof Error
                ? error.message
                : "Please try again.",
          }
        );
      }
    };

  const handleClose = () => {
    /*
     * Do not allow closing while the
     * initialization request is active.
     */
    if (isProcessing) {
      return;
    }

    setStep("FORM");
    setIsProcessing(false);
    setLastRef("");

    onClose();
  };

  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-slate-950/50
        backdrop-blur-sm
        p-4
        animate-in fade-in duration-200
      "
    >
      <div
        className="
          relative
          w-full max-w-md
          overflow-hidden
          rounded-2xl
          border border-slate-200
          bg-white
          shadow-2xl
          animate-in
          zoom-in-95
          duration-200
        "
      >
        {/* =========================================================
            FORM
        ========================================================= */}
        {step === "FORM" && (
          <>
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Top Up Wallet
                </h2>

                <p className="mt-0.5 text-[11px] text-slate-500">
                  Add funds to your institutional wallet
                </p>
              </div>

              <button
                type="button"
                onClick={handleClose}
                className="
                  flex h-8 w-8
                  cursor-pointer
                  items-center justify-center
                  rounded-lg
                  text-slate-400
                  transition
                  hover:bg-slate-100
                  hover:text-slate-700
                "
                aria-label="Close top up modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-5 p-5">
              {/* =====================================================
                  AMOUNT
              ===================================================== */}
              <div>
                <label
                  htmlFor="topup-amount"
                  className="mb-2 block text-xs font-semibold text-slate-700"
                >
                  Amount
                </label>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-500">
                    ₦
                  </span>

                  <input
                    id="topup-amount"
                    type="number"
                    min="100"
                    step="1"
                    inputMode="numeric"
                    value={
                      amount || ""
                    }
                    onChange={
                      handleAmountChange
                    }
                    placeholder="100,000"
                    disabled={
                      isProcessing
                    }
                    className="
                      w-full rounded-xl
                      border border-slate-200
                      bg-white
                      py-3 pl-9 pr-4
                      text-base font-semibold text-slate-900
                      outline-none transition
                      focus:border-emerald-500
                      focus:ring-4
                      focus:ring-emerald-500/10
                      placeholder:text-slate-300
                      disabled:cursor-not-allowed
                      disabled:bg-slate-50
                    "
                  />
                </div>

                <p className="mt-1.5 text-[10px] text-slate-400">
                  Minimum top-up: ₦100
                </p>
              </div>

              {/* =====================================================
                  PAYMENT METHOD
              ===================================================== */}
              <div>
                <label className="mb-2 block text-xs font-semibold text-slate-700">
                  Payment Method
                </label>

                <div className="space-y-2">
                  {/* Paystack */}
                  <button
                    type="button"
                    disabled={
                      isProcessing
                    }
                    onClick={() =>
                      setPaymentMethod(
                        "paystack"
                      )
                    }
                    className={`
                      group flex w-full items-center justify-between
                      rounded-xl border px-4 py-3
                      text-left transition
                      cursor-pointer
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                      ${
                        paymentMethod ===
                        "paystack"
                          ? "border-emerald-500 bg-emerald-50/60"
                          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`
                          flex h-9 w-9
                          items-center justify-center
                          rounded-lg
                          ${
                            paymentMethod ===
                            "paystack"
                              ? "bg-emerald-100 text-emerald-600"
                              : "bg-slate-100 text-slate-500"
                          }
                        `}
                      >
                        <CreditCard className="h-4 w-4" />
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-slate-900">
                          Paystack
                        </p>

                        <p className="text-[10px] text-slate-500">
                          Card, bank transfer & USSD
                        </p>
                      </div>
                    </div>

                    <span
                      className={`
                        flex h-5 w-5
                        items-center justify-center
                        rounded-full border-2
                        ${
                          paymentMethod ===
                          "paystack"
                            ? "border-emerald-600"
                            : "border-slate-300"
                        }
                      `}
                    >
                      {paymentMethod ===
                        "paystack" && (
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" />
                      )}
                    </span>
                  </button>

                  {/* Flutterwave */}
                  <button
                    type="button"
                    disabled={
                      isProcessing
                    }
                    onClick={() =>
                      setPaymentMethod(
                        "flutterwave"
                      )
                    }
                    className={`
                      group flex w-full items-center justify-between
                      rounded-xl border px-4 py-3
                      text-left transition
                      cursor-pointer
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                      ${
                        paymentMethod ===
                        "flutterwave"
                          ? "border-emerald-500 bg-emerald-50/60"
                          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`
                          flex h-9 w-9
                          items-center justify-center
                          rounded-lg
                          ${
                            paymentMethod ===
                            "flutterwave"
                              ? "bg-emerald-100 text-emerald-600"
                              : "bg-slate-100 text-slate-500"
                          }
                        `}
                      >
                        <Radio className="h-4 w-4" />
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-slate-900">
                          Flutterwave
                        </p>

                        <p className="text-[10px] text-slate-500">
                          Card, bank transfer & other methods
                        </p>
                      </div>
                    </div>

                    <span
                      className={`
                        flex h-5 w-5
                        items-center justify-center
                        rounded-full border-2
                        ${
                          paymentMethod ===
                          "flutterwave"
                            ? "border-emerald-600"
                            : "border-slate-300"
                        }
                      `}
                    >
                      {paymentMethod ===
                        "flutterwave" && (
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" />
                      )}
                    </span>
                  </button>
                </div>
              </div>

              {/* =====================================================
                  QUICK AMOUNTS
              ===================================================== */}
              <div>
                <span className="mb-2 block text-xs font-semibold text-slate-700">
                  Quick Amount
                </span>

                <div className="grid grid-cols-4 gap-2">
                  {quickAmounts.map(
                    (quickAmount) => {
                      const isSelected =
                        amount ===
                        quickAmount;

                      return (
                        <button
                          key={
                            quickAmount
                          }
                          type="button"
                          disabled={
                            isProcessing
                          }
                          onClick={() =>
                            setAmount(
                              quickAmount
                            )
                          }
                          className={`
                            rounded-lg border px-2 py-2
                            text-[11px] font-semibold
                            transition
                            cursor-pointer
                            disabled:cursor-not-allowed
                            disabled:opacity-60
                            ${
                              isSelected
                                ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                            }
                          `}
                        >
                          ₦
                          {(
                            quickAmount /
                            1000
                          ).toLocaleString()}
                          k
                        </button>
                      );
                    }
                  )}
                </div>
              </div>

              {/* =====================================================
                  SECURITY
              ===================================================== */}
              <div className="flex items-start gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />

                <p className="text-[10px] leading-relaxed text-slate-500">
                  Payments are securely processed
                  through your selected payment gateway.
                  Your wallet is credited only after
                  successful server-side payment
                  verification.
                </p>
              </div>

              {/* =====================================================
                  CONTINUE
              ===================================================== */}
              <button
                type="button"
                onClick={
                  handleContinuePayment
                }
                disabled={
                  isProcessing ||
                  !Number.isFinite(
                    amount
                  ) ||
                  amount <= 0
                }
                className="
                  flex w-full
                  items-center justify-center gap-2
                  rounded-xl
                  bg-emerald-600
                  px-4 py-3
                  text-sm font-bold text-white
                  shadow-lg shadow-emerald-600/20
                  transition
                  hover:bg-emerald-700
                  active:scale-[0.99]
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                <span>
                  Continue Payment
                </span>

                <ArrowRight className="h-4 w-4" />
              </button>

              <p className="text-center text-[10px] text-slate-400">
                You will be redirected to{" "}
                <span className="font-semibold text-slate-600">
                  {paymentMethod ===
                  "paystack"
                    ? "Paystack"
                    : "Flutterwave"}
                </span>{" "}
                to complete payment.
              </p>
            </div>
          </>
        )}

        {/* =========================================================
            PROCESSING
        ========================================================= */}
        {step === "PROCESSING" && (
          <div className="px-6 py-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            </div>

            <h3 className="mt-5 text-base font-bold text-slate-900">
              Preparing Payment
            </h3>

            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              Connecting to{" "}
              <span className="font-semibold capitalize text-slate-700">
                {paymentMethod}
              </span>
              ...
            </p>

            <div className="mt-4 rounded-lg bg-slate-50 px-3 py-2">
              <p className="text-[10px] text-slate-400">
                Amount
              </p>

              <p className="mt-0.5 font-mono text-sm font-bold text-slate-700">
                {formatAmount(
                  amount
                )}
              </p>
            </div>

            {lastRef && (
              <div className="mt-2 rounded-lg bg-slate-50 px-3 py-2">
                <p className="text-[10px] text-slate-400">
                  Transaction Reference
                </p>

                <p className="mt-0.5 break-all font-mono text-[10px] text-slate-600">
                  {lastRef}
                </p>
              </div>
            )}

            <p className="mt-4 text-[10px] text-emerald-600">
              Redirecting you to the secure
              payment gateway...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopUpModal;