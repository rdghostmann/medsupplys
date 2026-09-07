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
  ChevronRight,
  Clock3,
  CreditCard,
  Loader2,
  Lock,
  MapPin,
  Package2,
  ShieldCheck,
  ShoppingCart,
  Star,
  Wallet,
  X,
  Zap,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import type {
  MarketplaceProduct,
  SupplierScoreBreakdown,
  PaymentMethod,
} from "@/types";

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
  const [quantity, setQuantity] = useState(
    product.suppliers[0]?.minOrderQuantity ?? 1
  );

  const [selectedSupplierId, setSelectedSupplierId] =
    useState<string | null>(null);

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("WALLET");

  const [walletAmount, setWalletAmount] =
    useState(0);

  const [creditAmount, setCreditAmount] =
    useState(0);

  const [deliveryAddress, setDeliveryAddress] =
    useState("");

  const [isMatching, setIsMatching] =
    useState(false);

  const [matches, setMatches] =
    useState<SupplierScoreBreakdown[]>([]);

  const [error, setError] =
    useState<string | null>(null);

  /* =======================================================
     Reset when product changes
     ======================================================= */

  useEffect(() => {
    const defaultQuantity =
      product.suppliers[0]?.minOrderQuantity ?? 1;

    setQuantity(defaultQuantity);
    setSelectedSupplierId(null);
    setPaymentMethod("WALLET");
    setWalletAmount(0);
    setCreditAmount(0);
    setDeliveryAddress("");
    setMatches([]);
    setError(null);
  }, [product]);

  /* =======================================================
     Match suppliers
     ======================================================= */

  useEffect(() => {
    if (!open || !product.productId) {
      return;
    }

    const controller = new AbortController();

    async function loadMatches() {
      try {
        setIsMatching(true);
        setError(null);

        const response = await fetch(
          "/api/marketplace/matching",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              productId: product.productId,
              quantity,
            }),
            signal: controller.signal,
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message ||
              "Unable to match suppliers."
          );
        }

        setMatches(
          Array.isArray(data.matches)
            ? data.matches
            : []
        );
      } catch (err) {
        if (
          err instanceof DOMException &&
          err.name === "AbortError"
        ) {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load supplier matches."
        );

        setMatches([]);
      } finally {
        setIsMatching(false);
      }
    }

    loadMatches();

    return () => controller.abort();
  }, [
    open,
    product.productId,
    quantity,
  ]);

  /* =======================================================
     Selected supplier
     ======================================================= */

  const selectedSupplier = useMemo(() => {
    return (
      matches.find(
        (supplier) =>
          supplier.supplierId ===
          selectedSupplierId
      ) ?? null
    );
  }, [
    matches,
    selectedSupplierId,
  ]);

  /* =======================================================
     Pricing
     
     IMPORTANT:
     These are display values only.

     The backend MUST recalculate authoritative
     pricing during procurement creation.
     ======================================================= */

  const totalAmount = useMemo(() => {
    if (!selectedSupplier) {
      return 0;
    }

    return Math.round(
      selectedSupplier.finalPrice *
        quantity
    );
  }, [
    selectedSupplier,
    quantity,
  ]);

  /* =======================================================
     Payment allocation
     ======================================================= */

  useEffect(() => {
    if (!totalAmount) {
      setWalletAmount(0);
      setCreditAmount(0);
      return;
    }

    if (paymentMethod === "WALLET") {
      setWalletAmount(totalAmount);
      setCreditAmount(0);
      return;
    }

    if (paymentMethod === "CREDIT") {
      setWalletAmount(0);
      setCreditAmount(totalAmount);
      return;
    }

    if (
      paymentMethod ===
      "WALLET_AND_CREDIT"
    ) {
      setWalletAmount(totalAmount);
      setCreditAmount(0);
    }
  }, [
    paymentMethod,
    totalAmount,
  ]);

  /* =======================================================
     Drawer guard
     ======================================================= */

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50">

      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close sourcing drawer"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
      />

      {/* Drawer */}
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-2xl flex-col bg-white shadow-2xl">

        {/* =================================================
            Header
            ================================================= */}

        <div className="border-b border-slate-200 bg-white px-5 py-4">

          <div className="flex items-start justify-between gap-4">

            <div className="flex min-w-0 items-start gap-3">

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
                    className="rounded-full bg-blue-50 text-[10px] text-blue-700"
                  >
                    {product.category}
                  </Badge>

                </div>

                <p className="mt-1 text-xs text-slate-500">
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
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

          </div>
        </div>

        {/* =================================================
            Scrollable Content
            ================================================= */}

        <div className="flex-1 overflow-y-auto">

          <div className="space-y-6 p-5">

            {/* Quantity */}
            <section>
              <div className="mb-2 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Procurement Quantity
                  </h3>

                  <p className="text-xs text-slate-500">
                    Quantity is measured in {product.unit}.
                  </p>
                </div>

                <Badge
                  variant="outline"
                  className="rounded-full"
                >
                  {product.unit}
                </Badge>
              </div>

              <Input
                type="number"
                min={1}
                value={quantity}
                onChange={(event) => {
                  const value = Number(
                    event.target.value
                  );

                  setQuantity(
                    Number.isFinite(value)
                      ? Math.max(1, value)
                      : 1
                  );
                }}
                className="h-11 rounded-xl"
              />
            </section>

            {/* =================================================
                Supplier Matching
                ================================================= */}

            <section>
              <div className="mb-3 flex items-center justify-between">

                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Supplier Matching Engine
                  </h3>

                  <p className="text-xs text-slate-500">
                    Suppliers are ranked according to
                    availability, price, reliability and
                    fulfilment performance.
                  </p>
                </div>

                {isMatching && (
                  <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                )}
              </div>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {error}
                </div>
              )}

              {!isMatching &&
                !error &&
                matches.length === 0 && (
                  <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
                    <Package2 className="mx-auto h-7 w-7 text-slate-400" />

                    <p className="mt-2 text-sm font-medium text-slate-700">
                      No eligible suppliers found
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Try adjusting the procurement quantity.
                    </p>
                  </div>
                )}

              <div className="space-y-3">

                {matches.map(
                  (supplier, index) => {
                    const isSelected =
                      selectedSupplierId ===
                      supplier.supplierId;

                    return (
                      <button
                        key={
                          supplier.supplierId
                        }
                        type="button"
                        disabled={
                          !supplier.isEligible
                        }
                        onClick={() =>
                          supplier.isEligible &&
                          setSelectedSupplierId(
                            supplier.supplierId
                          )
                        }
                        className={[
                          "w-full rounded-2xl border p-4 text-left transition-all",
                          supplier.isEligible
                            ? "cursor-pointer"
                            : "cursor-not-allowed opacity-60",
                          isSelected
                            ? "border-blue-500 bg-blue-50/50 ring-2 ring-blue-100"
                            : "border-slate-200 bg-white hover:border-blue-200 hover:bg-slate-50",
                        ].join(" ")}
                      >

                        <div className="flex items-start justify-between gap-4">

                          <div className="flex min-w-0 items-start gap-3">

                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600">
                              #{index + 1}
                            </div>

                            <div className="min-w-0">

                              <div className="flex flex-wrap items-center gap-2">

                                <span className="font-semibold text-slate-900">
                                  {supplier.supplierName}
                                </span>

                                {supplier.isEligible && (
                                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                                )}

                              </div>

                              <div className="mt-1 flex flex-wrap gap-2 text-[11px] text-slate-500">

                                <span className="rounded-full bg-slate-100 px-2 py-1">
                                  {String(
                                    supplier.supplierType
                                  ).toUpperCase()}
                                </span>

                                <span className="flex items-center gap-1">
                                  <Star className="h-3 w-3 fill-current text-amber-500" />
                                  {supplier.rating.toFixed(
                                    1
                                  )}
                                </span>

                                <span>
                                  {supplier.stock.toLocaleString()}{" "}
                                  stock
                                </span>

                              </div>
                            </div>
                          </div>

                          <div className="shrink-0 text-right">

                            <p className="text-base font-bold text-slate-900">
                              ₦
                              {supplier.finalPrice.toLocaleString()}
                            </p>

                            <p className="text-[10px] text-slate-400">
                              per {product.unit}
                            </p>

                          </div>

                        </div>

                        <div className="mt-4 grid grid-cols-3 gap-2">

                          <div className="rounded-lg bg-slate-50 p-2">
                            <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">
                              MOQ
                            </p>

                            <p className="mt-0.5 text-xs font-semibold text-slate-700">
                              {supplier.moq.toLocaleString()}
                            </p>
                          </div>

                          <div className="rounded-lg bg-slate-50 p-2">
                            <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">
                              Fulfilment
                            </p>

                            <p className="mt-0.5 text-xs font-semibold text-slate-700">
                              {supplier.fulfillmentRate}%
                            </p>
                          </div>

                          <div className="rounded-lg bg-slate-50 p-2">
                            <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">
                              Delivery
                            </p>

                            <p className="mt-0.5 text-xs font-semibold text-slate-700">
                              {supplier.deliveryDays}{" "}
                              days
                            </p>
                          </div>

                        </div>

                        {!supplier.isEligible &&
                          supplier.ineligibilityReason && (
                            <div className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
                              {supplier.ineligibilityReason}
                            </div>
                          )}

                        {isSelected && (
                          <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-blue-700">
                            <CheckCircle2 className="h-4 w-4" />
                            Supplier selected
                          </div>
                        )}

                      </button>
                    );
                  }
                )}

              </div>
            </section>

            {/* =================================================
                Pricing Summary
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

                  <div className="flex justify-between">
                    <span className="text-slate-500">
                      Supplier
                    </span>

                    <span className="font-medium text-slate-800">
                      {selectedSupplier.supplierName}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500">
                      Quantity
                    </span>

                    <span className="font-medium text-slate-800">
                      {quantity.toLocaleString()}{" "}
                      {product.unit}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500">
                      Unit price
                    </span>

                    <span className="font-medium text-slate-800">
                      ₦
                      {selectedSupplier.finalPrice.toLocaleString()}
                    </span>
                  </div>

                  <div className="my-2 border-t border-blue-100" />

                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-700">
                      Estimated Total
                    </span>

                    <span className="text-lg font-bold text-blue-700">
                      ₦{totalAmount.toLocaleString()}
                    </span>
                  </div>

                </div>

                <p className="mt-3 text-[10px] leading-4 text-slate-400">
                  Final pricing is validated by the MedSupply
                  procurement service before the procurement
                  is created.
                </p>
              </section>
            )}

            {/* =================================================
                Payment
                ================================================= */}

            <section>
              <div className="mb-3">
                <h3 className="text-sm font-semibold text-slate-900">
                  Payment Method
                </h3>

                <p className="text-xs text-slate-500">
                  Select how this procurement should be funded.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">

                <button
                  type="button"
                  onClick={() =>
                    setPaymentMethod("WALLET")
                  }
                  className={[
                    "rounded-xl border p-3 text-left transition-colors",
                    paymentMethod === "WALLET"
                      ? "border-blue-500 bg-blue-50"
                      : "border-slate-200 hover:border-blue-200",
                  ].join(" ")}
                >
                  <Wallet className="h-4 w-4 text-blue-600" />

                  <p className="mt-2 text-xs font-semibold text-slate-800">
                    100% Wallet
                  </p>

                  <p className="mt-0.5 text-[10px] text-slate-500">
                    Pay from wallet balance
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setPaymentMethod("CREDIT")
                  }
                  className={[
                    "rounded-xl border p-3 text-left transition-colors",
                    paymentMethod === "CREDIT"
                      ? "border-blue-500 bg-blue-50"
                      : "border-slate-200 hover:border-blue-200",
                  ].join(" ")}
                >
                  <CreditCard className="h-4 w-4 text-blue-600" />

                  <p className="mt-2 text-xs font-semibold text-slate-800">
                    100% Credit
                  </p>

                  <p className="mt-0.5 text-[10px] text-slate-500">
                    Use approved credit
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setPaymentMethod(
                      "WALLET_AND_CREDIT"
                    )
                  }
                  className={[
                    "rounded-xl border p-3 text-left transition-colors",
                    paymentMethod ===
                    "WALLET_AND_CREDIT"
                      ? "border-blue-500 bg-blue-50"
                      : "border-slate-200 hover:border-blue-200",
                  ].join(" ")}
                >
                  <Zap className="h-4 w-4 text-blue-600" />

                  <p className="mt-2 text-xs font-semibold text-slate-800">
                    Split Payment
                  </p>

                  <p className="mt-0.5 text-[10px] text-slate-500">
                    Wallet + credit
                  </p>
                </button>

              </div>

              {paymentMethod ===
                "WALLET_AND_CREDIT" &&
                totalAmount > 0 && (
                  <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-4">

                    <div className="grid gap-3 sm:grid-cols-2">

                      <div>
                        <label className="text-xs font-medium text-slate-600">
                          Wallet Amount
                        </label>

                        <Input
                          type="number"
                          min={0}
                          max={totalAmount}
                          value={walletAmount}
                          onChange={(event) => {
                            const value = Math.min(
                              totalAmount,
                              Math.max(
                                0,
                                Number(
                                  event.target.value
                                ) || 0
                              )
                            );

                            setWalletAmount(value);
                            setCreditAmount(
                              totalAmount - value
                            );
                          }}
                          className="mt-1 rounded-lg"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-medium text-slate-600">
                          Credit Amount
                        </label>

                        <Input
                          type="number"
                          value={creditAmount}
                          readOnly
                          className="mt-1 rounded-lg bg-slate-100"
                        />
                      </div>

                    </div>
                  </div>
                )}
            </section>

            {/* =================================================
                Delivery
                ================================================= */}

            <section>
              <div className="mb-3">
                <h3 className="text-sm font-semibold text-slate-900">
                  Delivery Address
                </h3>

                <p className="text-xs text-slate-500">
                  Where should the procurement be delivered?
                </p>
              </div>

              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />

                <textarea
                  value={deliveryAddress}
                  onChange={(event) =>
                    setDeliveryAddress(
                      event.target.value
                    )
                  }
                  placeholder="Enter receiving facility and delivery address..."
                  className="min-h-[100px] w-full resize-none rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </section>

          </div>
        </div>

        {/* =================================================
            Footer
            ================================================= */}

        <div className="border-t border-slate-200 bg-white p-4">

          <div className="mb-3 flex items-center justify-between">

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                Estimated Procurement Total
              </p>

              <p className="text-xl font-bold text-slate-900">
                ₦{totalAmount.toLocaleString()}
              </p>
            </div>

            {selectedSupplier && (
              <div className="text-right text-xs text-slate-500">
                <p>
                  {quantity.toLocaleString()}{" "}
                  {product.unit}
                </p>

                <p>
                  {selectedSupplier.supplierName}
                </p>
              </div>
            )}

          </div>

          <div className="flex gap-3">

            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-11 flex-1 rounded-xl"
            >
              Cancel
            </Button>

            <Button
              type="button"
              disabled={
                !selectedSupplier ||
                !selectedSupplier.isEligible ||
                quantity <= 0 ||
                !deliveryAddress.trim()
              }
              className="h-11 flex-[2] rounded-xl bg-blue-600 font-semibold hover:bg-blue-700"
            >
              Submit Procurement Request
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

          </div>

          <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
            <Lock className="h-3 w-3" />
            Procurement pricing and payment are verified server-side
          </div>

        </div>
      </aside>
    </div>
  );
}