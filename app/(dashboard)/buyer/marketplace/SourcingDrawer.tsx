// SourcingDrawer.tsx

"use client";

import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Layers,
  Loader2,
  Lock,
  MapPin,
  Package2,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Star,
  Wallet,
  X,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import type {
  MarketplaceProduct,
  SupplierScoreBreakdown,
} from "@/types";

import type {
  ProcurementPaymentMethod,
} from "@/services/procurement.service";

import {
  matchSuppliers,
} from "@/services/supplier-matching.service";

import {
  createProcurement,
} from "@/services/procurement.service";

/* =========================================================
   Props
   ========================================================= */

interface SourcingDrawerProps {
  product: MarketplaceProduct;
  open: boolean;
  onClose: () => void;
}

/* =========================================================
   Component
   ========================================================= */

export default function SourcingDrawer({
  product,
  open,
  onClose,
}: SourcingDrawerProps) {


  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [submitError, setSubmitError] =
    useState<string | null>(null);

  /* =======================================================
     Procurement State
     ======================================================= */

  const [quantity, setQuantity] = useState(
    product.suppliers[0]?.minOrderQuantity ?? 1
  );

  /* =======================================================
     Selected Supplier Listing
     
     IMPORTANT:
     We select the SupplierProduct listing rather than
     merely selecting a supplier account.
     ======================================================= */

  const [
    selectedSupplierProductId,
    setSelectedSupplierProductId,
  ] = useState<string | null>(null);

  /* =======================================================
     Payment State
     ======================================================= */

  const [paymentMethod, setPaymentMethod] =
    useState<ProcurementPaymentMethod>(
      "WALLET"
    );

  /*
   * Only the wallet portion needs to be stored.
   *
   * Credit portion is derived:
   *
   * totalAmount - walletAmount
   */

  const [splitWalletAmount, setSplitWalletAmount] =
    useState(0);

  /* =======================================================
     Delivery State
     ======================================================= */

  const [deliveryAddress, setDeliveryAddress] =
    useState("");

  /* =======================================================
     Supplier Matching State
     ======================================================= */

  const [isMatching, setIsMatching] =
    useState(false);

  const [matches, setMatches] =
    useState<SupplierScoreBreakdown[]>([]);

  const [error, setError] =
    useState<string | null>(null);


  useEffect(() => {
    if (!open || !product.productId) {
      return;
    }

    let cancelled = false;

    async function loadMatches() {
      try {
        setIsMatching(true);
        setError(null);

        /*
         * Clear the old supplier pool while the new
         * quantity is being evaluated.
         */
        setMatches([]);

        /*
         * Call the canonical supplier matching service
         * directly.
         *
         * No fetch().
         * No API route.
         * No response.json().
         * Therefore an HTML <!DOCTYPE> response cannot
         * occur here.
         */
        const result = await matchSuppliers(
          product.productId,
          quantity
        );

        if (cancelled) {
          return;
        }

        const nextMatches = Array.isArray(result)
          ? result
          : [];

        setMatches(nextMatches);

        /*
         * Automatically select the highest-ranked
         * eligible SupplierProduct.
         *
         * The canonical matching service sorts eligible
         * suppliers first and then by score.
         */
        const topEligibleSupplier =
          nextMatches.find(
            (supplier) => supplier.isEligible
          );

        setSelectedSupplierProductId(
          topEligibleSupplier?.supplierProductId ??
          null
        );
      } catch (err) {
        if (cancelled) {
          return;
        }

        console.error(
          "[SOURCING_DRAWER_MATCHING]",
          err
        );

        setMatches([]);
        setSelectedSupplierProductId(null);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to evaluate supplier matches."
        );
      } finally {
        if (!cancelled) {
          setIsMatching(false);
        }
      }
    }

    loadMatches();

    return () => {
      cancelled = true;
    };
  }, [
    open,
    product.productId,
    quantity,
  ]);

  /* =======================================================
     Selected Supplier
     ======================================================= */

  const selectedSupplier = useMemo(() => {
    if (!selectedSupplierProductId) {
      return null;
    }

    return (
      matches.find(
        (supplier) =>
          supplier.supplierProductId ===
          selectedSupplierProductId
      ) ?? null
    );
  }, [
    matches,
    selectedSupplierProductId,
  ]);

  /* =======================================================
     Procurement Total
     
     IMPORTANT:
     
     SupplierProduct.finalPrice is the buyer-facing
     supplier listing price.
     
     Product.referenceBasePrice is NOT reconstructed
     here.
     ======================================================= */

  const totalAmount = useMemo(() => {
    if (
      !selectedSupplier ||
      !selectedSupplier.isEligible
    ) {
      return 0;
    }

    return Math.round(
      selectedSupplier.finalPrice * quantity
    );
  }, [
    selectedSupplier,
    quantity,
  ]);

  /* =======================================================
     Payment Allocation
     ======================================================= */

  const paymentAllocation = useMemo(() => {
    if (totalAmount <= 0) {
      return {
        walletAmount: 0,
        creditAmount: 0,
      };
    }

    if (paymentMethod === "WALLET") {
      return {
        walletAmount: totalAmount,
        creditAmount: 0,
      };
    }

    if (paymentMethod === "CREDIT") {
      return {
        walletAmount: 0,
        creditAmount: totalAmount,
      };
    }

    const walletAmount = Math.min(
      totalAmount,
      Math.max(0, splitWalletAmount)
    );

    return {
      walletAmount,
      creditAmount:
        totalAmount - walletAmount,
    };
  }, [
    paymentMethod,
    totalAmount,
    splitWalletAmount,
  ]);

  /* =======================================================
     Payment Handlers
     ======================================================= */

  const handleWalletPayment = () => {
    setPaymentMethod("WALLET");
    setSplitWalletAmount(0);
  };

  const handleCreditPayment = () => {
    setPaymentMethod("CREDIT");
    setSplitWalletAmount(0);
  };

  const handleSplitPayment = () => {
    setPaymentMethod(
      "WALLET_AND_CREDIT"
    );

    /*
     * Start at 50/50 rather than allocating 100%
     * of the total to wallet.
     *
     * Buyer can modify either portion.
     */
    setSplitWalletAmount(
      Math.round(totalAmount / 2)
    );
  };

  /* =======================================================
     Split Wallet Amount
     ======================================================= */

  const handleSplitWalletAmountChange = (
    value: number
  ) => {
    const safeValue = Number.isFinite(value)
      ? value
      : 0;

    const normalizedValue = Math.min(
      totalAmount,
      Math.max(0, safeValue)
    );

    setSplitWalletAmount(
      normalizedValue
    );
  };

  /* =======================================================
     Quantity Validation
     ======================================================= */

  const handleQuantityChange = (
    value: number
  ) => {
    const safeValue = Number.isFinite(value)
      ? value
      : 1;

    setQuantity(
      Math.max(1, Math.floor(safeValue))
    );

    /*
     * The selected SupplierProduct may no longer
     * satisfy the new quantity.
     *
     * Clear it while the matching engine evaluates
     * the new quantity.
     */
    setSelectedSupplierProductId(null);
  };

  /* =======================================================
     Submit Validation
     
     This is client-side UX validation only.
     
     Final validation MUST happen server-side before
     creating the procurement.
     ======================================================= */

  const canSubmit =
    Boolean(selectedSupplier) &&
    Boolean(selectedSupplier?.isEligible) &&
    quantity > 0 &&
    Boolean(deliveryAddress.trim()) &&
    totalAmount > 0 &&
    (
      paymentMethod !==
      "WALLET_AND_CREDIT" ||
      paymentAllocation.walletAmount +
      paymentAllocation.creditAmount ===
      totalAmount
    );

  /* =======================================================
     Drawer Guard
     ======================================================= */

  if (!open) {
    return null;
  }

  const handleSubmitProcurement =
    async () => {
      if (
        !canSubmit ||
        isSubmitting ||
        !selectedSupplier
      ) {
        return;
      }

      try {
        setIsSubmitting(true);
        setSubmitError(null);
        setError(null);

        const result =
          await createProcurement({
            productId:
              product.productId,

            supplierProductId:
              selectedSupplier.supplierProductId,

            quantity,

            paymentMethod,

            splitWalletAmount:
              paymentMethod ===
                "WALLET_AND_CREDIT"
                ? splitWalletAmount
                : undefined,

            deliveryAddress:
              deliveryAddress.trim(),
          });

        if (
          !result.success
        ) {
          throw new Error(
            "Unable to create procurement."
          );
        }

        toast.success(
          `Procurement ${result.procurement.procurementNumber} created successfully.`
        );

        onClose();
      } catch (err) {
        console.error(
          "[CREATE_PROCUREMENT]",
          err
        );

        const message =
          err instanceof Error
            ? err.message
            : "Unable to submit procurement request.";

        setSubmitError(
          message
        );

        toast.error(
          message
        );
      } finally {
        setIsSubmitting(
          false
        );
      }
    };
  /* =======================================================
     Render
     ======================================================= */

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">

      {/* ===================================================
          Backdrop
          =================================================== */}

      <button
        type="button"
        aria-label="Close sourcing drawer"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />

      {/* ===================================================
          Drawer
          =================================================== */}

      <aside className="relative flex h-full w-full max-w-2xl flex-col overflow-hidden border-l border-slate-200 bg-white shadow-2xl animate-in slide-in-from-right duration-200">

        {/* =================================================
            Header
            ================================================= */}

        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-6 py-4">

          <div className="flex min-w-0 items-center gap-3">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50">
              <Package2 className="h-5 w-5 text-blue-600" />
            </div>

            <div className="min-w-0">

              <div className="flex flex-wrap items-center gap-2">

                <h2 className="truncate text-base font-bold text-slate-900">
                  {product.name}
                </h2>

                <Badge
                  variant="secondary"
                  className="rounded bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800"
                >
                  {product.category}
                </Badge>

              </div>

              <p className="mt-1 text-xs font-mono text-slate-500">
                {product.activeIngredient}

                {product.strength
                  ? ` • ${product.strength}`
                  : ""}

                {" • "}

                {product.unit}
              </p>

            </div>

          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-200/60 hover:text-slate-700"
            aria-label="Close sourcing drawer"
          >
            <X className="h-4 w-4" />
          </button>

        </div>

        {/* =================================================
            Content
            ================================================= */}

        <div className="flex-1 overflow-y-auto">

          <div className="space-y-6 p-6">

            {/* =================================================
                Quantity & Pricing
                ================================================= */}

            <section className="rounded-xl border border-blue-100 bg-blue-50/50 p-4">

              <div className="grid gap-4 sm:grid-cols-2">

                {/* Quantity */}

                <div>

                  <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-700">
                    Required Order Quantity
                  </label>

                  <div className="flex items-center gap-2">

                    <Input
                      type="number"
                      min={1}
                      step={1}
                      value={quantity}
                      onChange={(event) => {
                        handleQuantityChange(
                          Number(
                            event.target.value
                          )
                        );
                      }}
                      className="h-10 rounded-lg bg-white font-mono text-sm font-bold"
                    />

                    <span className="whitespace-nowrap text-[11px] font-medium text-slate-500">
                      {product.unit}
                    </span>

                  </div>

                  <p className="mt-1.5 text-[10px] text-slate-500">
                    Quantity is measured in{" "}
                    {product.unit}.
                  </p>

                </div>

                {/* Pricing */}

                <div className="flex flex-col justify-center rounded-lg border border-slate-200 bg-white p-3">

                  <div className="mb-1 flex items-center justify-between text-[11px] text-slate-500">

                    <span>
                      Unit Price
                    </span>

                    <span className="font-mono font-semibold text-slate-700">
                      {selectedSupplier
                        ? `₦${selectedSupplier.finalPrice.toLocaleString()}`
                        : "—"}
                    </span>

                  </div>

                  <div className="mb-1 flex items-center justify-between text-[11px] text-slate-500">

                    <span>
                      Quantity
                    </span>

                    <span className="font-mono">
                      {quantity.toLocaleString()}x
                    </span>

                  </div>

                  <div className="mt-1.5 flex items-center justify-between border-t border-slate-100 pt-1.5 text-xs font-bold text-slate-900">

                    <span>
                      Total Procurement Cost
                    </span>

                    <span className="font-mono text-sm text-blue-700">
                      ₦
                      {totalAmount.toLocaleString()}
                    </span>

                  </div>

                </div>

              </div>

            </section>

            {/* =================================================
                Matching Engine
                ================================================= */}

            <section>

              <div className="mb-2 flex items-center justify-between">

                <div className="flex items-center gap-2">

                  <Sparkles className="h-4 w-4 text-blue-600" />

                  <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-900">
                    Supplier Matching Engine & Dynamic Ranked Pool
                  </h3>

                </div>

                {isMatching && (
                  <span className="flex items-center gap-1.5 text-[10px] text-blue-600">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Calculating scores...
                  </span>
                )}

              </div>

              <p className="mb-3 text-xs text-slate-500">
                Suppliers are dynamically ranked by price,
                stock availability, rating, fulfilment,
                delivery performance and supplier
                classification.
              </p>

              {/* Error */}

              {error && (
                <div className="mb-3 rounded-xl border border-red-200 bg-red-50 p-3">

                  <div className="flex items-start gap-2">

                    <X className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />

                    <div>

                      <p className="text-xs font-semibold text-red-700">
                        Supplier matching unavailable
                      </p>

                      <p className="mt-0.5 text-[10px] leading-4 text-red-600">
                        {error}
                      </p>

                    </div>

                  </div>

                </div>
              )}

              {/* Loading */}

              {isMatching &&
                matches.length === 0 && (
                  <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-5 text-center">

                    <Sparkles className="mx-auto h-6 w-6 animate-pulse text-blue-600" />

                    <p className="mt-2 text-xs font-semibold text-slate-700">
                      Evaluating supplier network...
                    </p>

                    <p className="mt-1 text-[10px] text-slate-500">
                      Comparing price, stock, reliability
                      and delivery performance.
                    </p>

                  </div>
                )}

              {/* Empty */}

              {!isMatching &&
                !error &&
                matches.length === 0 && (
                  <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">

                    <Package2 className="mx-auto h-7 w-7 text-slate-400" />

                    <p className="mt-2 text-sm font-semibold text-slate-700">
                      No supplier listings found
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Try adjusting the procurement
                      quantity.
                    </p>

                  </div>
                )}

              {/* Ranked Pool */}

              {matches.length > 0 && (
                <div className="max-h-60 space-y-2 overflow-y-auto pr-1">

                  {matches.map(
                    (supplier, index) => {
                      const isSelected =
                        selectedSupplierProductId ===
                        supplier.supplierProductId;

                      const supplierType =
                        String(
                          supplier.supplierType
                        ).toUpperCase();

                      const statusLabel =
                        String(
                          supplier.status
                        )
                          .replaceAll(
                            "_",
                            " "
                          )
                          .toLowerCase()
                          .replace(
                            /^\w/,
                            (char) =>
                              char.toUpperCase()
                          );

                      return (
                        <button
                          key={
                            supplier.supplierProductId
                          }
                          type="button"
                          disabled={
                            !supplier.isEligible
                          }
                          onClick={() => {
                            if (
                              supplier.isEligible
                            ) {
                              setSelectedSupplierProductId(
                                supplier.supplierProductId
                              );
                            }
                          }}
                          className={[
                            "w-full rounded-xl border p-3 text-left transition-all",

                            supplier.isEligible
                              ? "cursor-pointer"
                              : "cursor-not-allowed opacity-60",

                            isSelected
                              ? "border-blue-500 bg-blue-50/80 shadow-sm"
                              : supplier.isEligible
                                ? "border-slate-200 bg-white hover:border-blue-200 hover:bg-slate-50"
                                : "border-slate-200 bg-slate-50/70",
                          ].join(" ")}
                        >

                          {/* Main row */}

                          <div className="flex items-center justify-between gap-3">

                            {/* Supplier information */}

                            <div className="flex min-w-0 items-center gap-3">

                              {/* Rank */}

                              <div
                                className={[
                                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold",

                                  index === 0 &&
                                    supplier.isEligible
                                    ? "border border-amber-300 bg-amber-100 text-amber-900"
                                    : "bg-slate-100 text-slate-700",
                                ].join(" ")}
                              >
                                #{index + 1}
                              </div>

                              <div className="min-w-0">

                                <div className="flex flex-wrap items-center gap-2">

                                  <span className="truncate text-xs font-semibold text-slate-900">
                                    {
                                      supplier.supplierName
                                    }
                                  </span>

                                  <span
                                    className={[
                                      "rounded px-1.5 py-0.5 text-[9px] font-bold",

                                      supplierType ===
                                        "IMPORTER"
                                        ? "bg-emerald-100 text-emerald-800"
                                        : supplierType ===
                                          "DISTRIBUTOR"
                                          ? "bg-blue-100 text-blue-800"
                                          : "bg-slate-100 text-slate-700",
                                    ].join(" ")}
                                  >
                                    {supplierType}
                                  </span>

                                  {supplier.verified && (
                                    <span className="flex items-center gap-0.5 text-[9px] font-semibold text-emerald-600">
                                      <ShieldCheck className="h-3 w-3" />
                                      Verified
                                    </span>
                                  )}

                                </div>

                                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-slate-500">

                                  <span>
                                    Stock:{" "}
                                    {supplier.stock.toLocaleString()}
                                  </span>

                                  <span>
                                    MOQ:{" "}
                                    {supplier.moq.toLocaleString()}
                                  </span>

                                  <span className="flex items-center gap-0.5 font-semibold text-amber-600">

                                    <Star className="h-3 w-3 fill-current" />

                                    {supplier.rating.toFixed(
                                      1
                                    )}

                                  </span>

                                  <span>
                                    {
                                      supplier.deliveryDays
                                    }
                                    d delivery
                                  </span>

                                </div>

                              </div>

                            </div>

                            {/* Price */}

                            <div className=" shrink-0 text-right">

                              <div className="flex flex-col font-mono text-xs font-bold text-slate-900">

                                <span> ₦ {supplier.finalPrice.toLocaleString()}</span>

                                <span className="font-sans text-[9px] font-normal text-slate-400">
                                  /{product.unit}
                                </span>

                              </div>

                              <div className="mt-1">

                                <span className="rounded bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-semibold text-slate-700">
                                  Score:{" "}
                                  {
                                    supplier.totalScore
                                  }{" "}
                                  pts
                                </span>

                              </div>

                            </div>

                          </div>

                          {/* Secondary metrics */}

                          <div className="mt-2 hidden flex-wrap items-center gap-1.5">
                            {/* <div className="mt-2 flex flex-wrap items-center gap-1.5"> */}

                            <span className="rounded-md bg-slate-50 px-2 py-1 text-[9px] font-medium text-slate-600">
                              Fulfilment{" "}
                              {
                                supplier.fulfillmentRate
                              }
                              %
                            </span>

                            <span
                              className={[
                                "rounded-md px-2 py-1 text-[9px] font-medium",

                                supplier.status ===
                                  "AVAILABLE"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-amber-50 text-amber-700",
                              ].join(" ")}
                            >
                              {statusLabel}
                            </span>

                            {supplier.state && (
                              <span className="flex items-center gap-0.5 rounded-md bg-slate-50 px-2 py-1 text-[9px] font-medium text-slate-600">

                                <MapPin className="h-2.5 w-2.5" />

                                {supplier.state}

                                {supplier.lga
                                  ? `, ${supplier.lga}`
                                  : ""}

                              </span>
                            )}

                          </div>

                          {/* Ranking breakdown */}

                          {isSelected &&
                            supplier.isEligible && (
                              <div className="hidden mt-2 rounded-lg border border-blue-100 bg-white/80 p-2">
                                {/* <div className="mt-2 rounded-lg border border-blue-100 bg-white/80 p-2"> */}

                                <div className="mb-1.5 flex items-center justify-between">

                                  <span className="text-[9px] font-bold uppercase tracking-wide text-blue-700">
                                    Ranking Breakdown
                                  </span>

                                  <span className="text-[9px] font-semibold text-slate-500">
                                    {
                                      supplier.totalScore
                                    }{" "}
                                    / 100
                                  </span>

                                </div>

                                <div className="grid grid-cols-3 gap-1.5">

                                  {[
                                    [
                                      "Price",
                                      supplier
                                        .scoreBreakdown
                                        .price,
                                    ],
                                    [
                                      "Stock",
                                      supplier
                                        .scoreBreakdown
                                        .stock,
                                    ],
                                    [
                                      "Rating",
                                      supplier
                                        .scoreBreakdown
                                        .rating,
                                    ],
                                    [
                                      "Fulfilment",
                                      supplier
                                        .scoreBreakdown
                                        .fulfillment,
                                    ],
                                    [
                                      "Delivery",
                                      supplier
                                        .scoreBreakdown
                                        .delivery,
                                    ],
                                    [
                                      "Supplier",
                                      supplier
                                        .scoreBreakdown
                                        .supplierType,
                                    ],
                                  ].map(
                                    ([
                                      label,
                                      score,
                                    ]) => (
                                      <div
                                        key={String(
                                          label
                                        )}
                                        className="rounded bg-slate-50 p-1.5"
                                      >

                                        <p className="text-[8px] uppercase text-slate-400">
                                          {label}
                                        </p>

                                        <p className="text-[10px] font-semibold text-slate-700">
                                          {score}
                                        </p>

                                      </div>
                                    )
                                  )}

                                </div>

                                <div className="mt-2 flex items-center gap-1.5 text-[10px] font-semibold text-blue-700">

                                  <CheckCircle2 className="h-3.5 w-3.5" />

                                  Supplier selected for procurement

                                </div>

                              </div>
                            )}

                          {/* Ineligibility */}

                          {!supplier.isEligible &&
                            supplier.ineligibilityReason && (
                              <div className="mt-2 rounded-lg border border-red-100 bg-red-50 px-2.5 py-2">

                                <div className="flex items-start gap-1.5">

                                  <X className="mt-0.5 h-3 w-3 shrink-0 text-red-500" />

                                  <span className="text-[9.5px] font-medium leading-4 text-red-600">
                                    {
                                      supplier.ineligibilityReason
                                    }
                                  </span>

                                </div>

                              </div>
                            )}

                        </button>
                      );
                    }
                  )}

                </div>
              )}

            </section>

            {/* =================================================
                Procurement Summary
                ================================================= */}

            {selectedSupplier && (
              <section className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4">

                <div className="mb-3 flex items-center gap-2">

                  <ShoppingCart className="h-4 w-4 text-blue-600" />

                  <h3 className="text-sm font-semibold text-slate-900">
                    Procurement Summary
                  </h3>

                </div>

                <div className="space-y-2 text-sm">

                  <div className="flex justify-between gap-4">

                    <span className="text-slate-500">
                      Supplier
                    </span>

                    <span className="text-right font-medium text-slate-800">
                      {
                        selectedSupplier.supplierName
                      }
                    </span>

                  </div>

                  <div className="flex justify-between gap-4">

                    <span className="text-slate-500">
                      Supplier Type
                    </span>

                    <span className="font-medium uppercase text-slate-800">
                      {
                        selectedSupplier.supplierType
                      }
                    </span>

                  </div>

                  <div className="flex justify-between gap-4">

                    <span className="text-slate-500">
                      Quantity
                    </span>

                    <span className="font-medium text-slate-800">
                      {quantity.toLocaleString()}{" "}
                      {product.unit}
                    </span>

                  </div>

                  <div className="flex justify-between gap-4">

                    <span className="text-slate-500">
                      Unit price
                    </span>

                    <span className="font-medium text-slate-800">
                      ₦
                      {selectedSupplier.finalPrice.toLocaleString()}
                    </span>

                  </div>

                  <div className="flex justify-between gap-4">

                    <span className="text-slate-500">
                      Delivery
                    </span>

                    <span className="font-medium text-slate-800">
                      {
                        selectedSupplier.deliveryDays
                      }{" "}
                      days
                    </span>

                  </div>

                  <div className="my-2 border-t border-blue-100" />

                  <div className="flex justify-between gap-4">

                    <span className="font-semibold text-slate-700">
                      Estimated Total
                    </span>

                    <span className="text-lg font-bold text-blue-700">
                      ₦
                      {totalAmount.toLocaleString()}
                    </span>

                  </div>

                </div>

                <p className="mt-3 text-[10px] leading-4 text-slate-400">
                  Final price, stock, supplier eligibility
                  and payment availability are revalidated
                  by the procurement service before creation.
                </p>

              </section>
            )}

            {/* =================================================
                Payment
                ================================================= */}

            <section>

              <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-700">
                Payment & Procurement Finance Method
              </label>

              <div className="grid gap-2 sm:grid-cols-3">

                {/* Wallet */}

                <button
                  type="button"
                  onClick={
                    handleWalletPayment
                  }
                  className={[
                    "flex flex-col justify-between rounded-xl border p-3 text-left transition",

                    paymentMethod ===
                      "WALLET"
                      ? "border-blue-500 bg-blue-50/80 text-blue-900 shadow-sm"
                      : "border-slate-200 hover:bg-slate-50",
                  ].join(" ")}
                >

                  <div>

                    <div className="mb-1 flex items-center gap-1.5 font-bold">

                      <Wallet className="h-4 w-4 text-blue-600" />

                      <span>
                        100% Wallet
                      </span>

                    </div>

                    <p className="text-[10px] text-slate-500">
                      Pay from wallet balance
                    </p>

                  </div>

                  <div className="mt-2 font-mono text-[10px] text-slate-500">
                    Atomic instant debit
                  </div>

                </button>

                {/* Credit */}

                <button
                  type="button"
                  onClick={
                    handleCreditPayment
                  }
                  className={[
                    "flex flex-col justify-between rounded-xl border p-3 text-left transition",

                    paymentMethod ===
                      "CREDIT"
                      ? "border-emerald-500 bg-emerald-50/80 text-emerald-900 shadow-sm"
                      : "border-slate-200 hover:bg-slate-50",
                  ].join(" ")}
                >

                  <div>

                    <div className="mb-1 flex items-center gap-1.5 font-bold">

                      <CreditCard className="h-4 w-4 text-emerald-600" />

                      <span>
                        100% Credit
                      </span>

                    </div>

                    <p className="text-[10px] text-slate-500">
                      Use approved credit
                    </p>

                  </div>

                  <div className="mt-2 font-mono text-[10px] text-slate-500">
                    Approved credit facility
                  </div>

                </button>

                {/* Split */}

                <button
                  type="button"
                  onClick={
                    handleSplitPayment
                  }
                  className={[
                    "flex flex-col justify-between rounded-xl border p-3 text-left transition",

                    paymentMethod ===
                      "WALLET_AND_CREDIT"
                      ? "border-indigo-500 bg-indigo-50/80 text-indigo-900 shadow-sm"
                      : "border-slate-200 hover:bg-slate-50",
                  ].join(" ")}
                >

                  <div>

                    <div className="mb-1 flex items-center gap-1.5 font-bold">

                      <Layers className="h-4 w-4 text-indigo-600" />

                      <span>
                        Split Payment
                      </span>

                    </div>

                    <p className="text-[10px] text-slate-500">
                      Wallet + approved credit
                    </p>

                  </div>

                  <div className="mt-2 font-mono text-[10px] text-slate-500">
                    Custom allocation
                  </div>

                </button>

              </div>

              {/* Split Allocation */}

              {paymentMethod ===
                "WALLET_AND_CREDIT" &&
                totalAmount > 0 && (
                  <div className="mt-3 rounded-xl border border-indigo-100 bg-indigo-50/50 p-3">

                    <div className="grid grid-cols-2 gap-3">

                      {/* Wallet */}

                      <div>

                        <label className="mb-1 block text-[10px] font-bold text-indigo-900">
                          Wallet Portion
                        </label>

                        <Input
                          type="number"
                          min={0}
                          max={totalAmount}
                          value={
                            splitWalletAmount
                          }
                          onChange={(
                            event
                          ) =>
                            handleSplitWalletAmountChange(
                              Number(
                                event.target
                                  .value
                              )
                            )
                          }
                          className="rounded-lg border-indigo-200 bg-white font-mono text-xs font-bold"
                        />

                      </div>

                      {/* Credit */}

                      <div>

                        <label className="mb-1 block text-[10px] font-bold text-indigo-900">
                          Credit Line Portion
                        </label>

                        <Input
                          type="number"
                          min={0}
                          value={
                            paymentAllocation.creditAmount
                          }
                          readOnly
                          className="rounded-lg border-indigo-200 bg-white font-mono text-xs font-bold"
                        />

                      </div>

                    </div>

                    <div className="mt-3 flex items-center justify-between border-t border-indigo-100 pt-2 text-[10px]">

                      <span className="text-slate-500">
                        Total allocation
                      </span>

                      <span className="font-mono font-bold text-indigo-700">
                        ₦
                        {totalAmount.toLocaleString()}
                      </span>

                    </div>

                  </div>
                )}

            </section>

            {/* =================================================
                Delivery
                ================================================= */}

            <section>

              <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-700">
                Verified Delivery & Storage Address
              </label>

              <p className="mb-2 text-[10px] text-slate-500">
                Enter the receiving facility and delivery
                location for this procurement.
              </p>

              <div className="relative">

                <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />

                <textarea
                  value={
                    deliveryAddress
                  }
                  onChange={(event) =>
                    setDeliveryAddress(
                      event.target.value
                    )
                  }
                  placeholder="Enter receiving facility and delivery address..."
                  className="min-h-[100px] w-full resize-none rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-3 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />

              </div>

            </section>

          </div>

        </div>

        {/* ===================================================
            Footer
            =================================================== */}
        {submitError && (
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {submitError}
          </div>
        )}
        <div className="flex items-center justify-between gap-4 border-t border-slate-200 bg-slate-50 p-6">

          <div>

            <p className="text-[11px] text-slate-500">
              Committed Sourcing Total
            </p>

            <p className="font-mono text-lg font-bold text-slate-900">
              ₦
              {totalAmount.toLocaleString()}
            </p>

            {selectedSupplier && (
              <p className="mt-0.5 text-[9px] text-slate-400">
                {
                  selectedSupplier.supplierName
                }
              </p>
            )}

          </div>

          <div className="flex items-center gap-3">

            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-11 rounded-xl px-4 text-xs font-semibold"
            >
              Cancel
            </Button>

            <Button
              type="button"
              disabled={
                !canSubmit ||
                isSubmitting
              }
              onClick={
                handleSubmitProcurement
              }
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Procurement...
                </>
              ) : (
                <>
                  Submit Procurement Request
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>

          </div>

        </div>

        {/* ===================================================
            Security
            =================================================== */}

        <div className="border-t border-slate-100 bg-white px-6 py-2.5">

          <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400">

            <Lock className="h-3 w-3" />

            Procurement pricing and payment are
            verified server-side

          </div>

        </div>

      </aside>

    </div>
  );
}