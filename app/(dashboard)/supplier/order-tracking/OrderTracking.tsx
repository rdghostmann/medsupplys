// OrderTracking.tsx

"use client";

import React, {
  useState,
} from "react";

import {
  ShoppingBag,
  Truck,
  CheckCircle2,
  FileCheck2,
  Download,
  ThermometerSnowflake,
  ShieldCheck,
  Package,
  ChevronDown,
  ChevronUp,
  Clock,
  AlertCircle,
} from "lucide-react";

import { toast } from "sonner";

import type {
  SupplierOrderTrackingData,
} from "@/controllers/supplier.action";

/* -------------------------------------------------------------------------- */
/* Props                                                                      */
/* -------------------------------------------------------------------------- */

interface OrderTrackingProps {
  orders: SupplierOrderTrackingData[];
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

type SupplierOrderStatus =
  SupplierOrderTrackingData["status"];

const formatCurrency = (
  value: number
) =>
  `₦${Number(value || 0).toLocaleString(
    "en-NG"
  )}`;

const formatDate = (
  date?: string
) => {
  if (!date) {
    return "—";
  }

  const parsedDate =
    new Date(date);

  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {
    return "—";
  }

  return parsedDate.toLocaleDateString(
    "en-NG",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};

const formatDateTime = (
  date?: string
) => {
  if (!date) {
    return "—";
  }

  const parsedDate =
    new Date(date);

  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {
    return "—";
  }

  return parsedDate.toLocaleString(
    "en-NG",
    {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );
};

const getStatusStyles = (
  status: SupplierOrderStatus
) => {
  if (
    [
      "DELIVERED",
      "COMPLETED",
    ].includes(status)
  ) {
    return "bg-emerald-100 text-emerald-800";
  }

  if (
    [
      "READY_FOR_DISPATCH",
      "DISPATCHED",
      "IN_TRANSIT",
    ].includes(status)
  ) {
    return "bg-sky-100 text-sky-800";
  }

  if (
    [
      "CANCELLED",
      "REFUNDED",
    ].includes(status)
  ) {
    return "bg-red-100 text-red-800";
  }

  if (
    status === "VERIFICATION"
  ) {
    return "bg-purple-100 text-purple-800";
  }

  return "bg-amber-100 text-amber-800";
};

const formatStatus = (
  status: SupplierOrderStatus
) =>
  status.replace(
    /_/g,
    " "
  );

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

const OrderTracking: React.FC<
  OrderTrackingProps
> = ({
  orders,
}) => {
  const [
    activeExpandedOrderId,
    setActiveExpandedOrderId,
  ] = useState<
    string | null
  >(null);

  const toggleExpand = (
    id: string
  ) => {
    setActiveExpandedOrderId(
      (currentId) =>
        currentId === id
          ? null
          : id
    );
  };

  const downloadWaybill = (
    order: SupplierOrderTrackingData
  ) => {
    toast.success(
      `Preparing Waybill PDF for Order #${order.orderNumber}`
    );
  };

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">

          {/* ---------------------------------------------------------------- */}
          {/* Header                                                           */}
          {/* ---------------------------------------------------------------- */}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-display text-xl font-bold text-slate-900">
                Committed Orders & Delivery Tracking
              </h1>

              <p className="text-xs text-slate-500 mt-0.5">
                Monitor committed buyer orders,
                fulfillment, pharmacist verification
                and delivery status.
              </p>
            </div>
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* Empty State                                                      */}
          {/* ---------------------------------------------------------------- */}

          {orders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />

              <h3 className="font-bold text-slate-800 text-sm">
                No Orders Yet
              </h3>

              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Orders accepted by your supplier
                account will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-4 mt-4">

              {orders.map((ord) => {
                const isExpanded =
                  activeExpandedOrderId ===
                  ord.id;

                const item =
                  ord.items[0];

                return (
                  <div
                    key={ord.id}
                    className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition"
                  >

                    {/* ------------------------------------------------------ */}
                    {/* Summary Row                                             */}
                    {/* ------------------------------------------------------ */}

                    <div className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">

                      <div className="space-y-1.5 min-w-0">

                        {/* Product + Order + Status */}

                        <div className="flex flex-wrap items-center gap-2">

                          <span className="font-display font-bold text-slate-900 text-sm">
                            {item?.name ||
                              "Pharmaceutical Order"}
                          </span>

                          <span className="font-mono text-[11px] bg-slate-900 text-white px-2 py-0.5 rounded font-bold">
                            #{ord.orderNumber}
                          </span>

                          <span
                            className={`text-[10.5px] font-bold px-2 py-0.5 rounded-full ${getStatusStyles(
                              ord.status
                            )}`}
                          >
                            {formatStatus(
                              ord.status
                            )}
                          </span>

                        </div>

                        {/* Order Information */}

                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">

                          <span>
                            Buyer:{" "}
                            <strong className="text-slate-900">
                              {ord.buyerName}
                            </strong>
                          </span>

                          <span>
                            Supplier:{" "}
                            <strong className="text-slate-900">
                              {ord.supplierName}
                            </strong>
                          </span>

                          <span>
                            Total:{" "}
                            <strong className="font-mono text-blue-700">
                              {formatCurrency(
                                ord.total
                              )}
                            </strong>
                          </span>

                        </div>

                        {/* Pharmacist Status */}

                        <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">

                          <FileCheck2 className="w-3.5 h-3.5 text-purple-600" />

                          <span>
                            Pharmacist QC Inspection:
                          </span>

                          {ord.pharmacistVerification?.result ===
                          "APPROVED" ? (
                            <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              ✓ APPROVED by{" "}
                              {
                                ord
                                  .pharmacistVerification
                                  .verifiedByName
                              }
                            </span>
                          ) : ord
                              .pharmacistVerification
                              ?.result ===
                            "REJECTED" ? (
                            <span className="font-semibold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                              ✕ REJECTED
                            </span>
                          ) : (
                            <span className="font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                              Pending QA Verification
                            </span>
                          )}

                        </div>
                      </div>

                      {/* ---------------------------------------------------- */}
                      {/* Actions                                               */}
                      {/* ---------------------------------------------------- */}

                      <div className="flex items-center gap-2 shrink-0">

                        <button
                          type="button"
                          onClick={() =>
                            downloadWaybill(
                              ord
                            )
                          }
                          className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5 text-slate-500" />

                          <span>
                            Waybill PDF
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            toggleExpand(
                              ord.id
                            )
                          }
                          className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-semibold transition flex items-center gap-1 cursor-pointer"
                        >
                          <span>
                            {isExpanded
                              ? "Hide Timeline"
                              : "Track Order"}
                          </span>

                          {isExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )}
                        </button>

                      </div>
                    </div>

                    {/* ------------------------------------------------------ */}
                    {/* Expanded Content                                       */}
                    {/* ------------------------------------------------------ */}

                    {isExpanded && (
                      <div className="border-t border-slate-100 bg-slate-50/70 p-5 space-y-6 text-xs">

                        {/* -------------------------------------------------- */}
                        {/* Order Overview                                     */}
                        {/* -------------------------------------------------- */}

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">

                          <div className="bg-white rounded-xl border border-slate-200 p-3">
                            <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                              Quantity
                            </p>

                            <p className="mt-1 font-mono font-bold text-slate-900">
                              {item?.quantity.toLocaleString() ||
                                "0"}{" "}
                              {item?.unit ||
                                ""}
                            </p>
                          </div>

                          <div className="bg-white rounded-xl border border-slate-200 p-3">
                            <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                              Unit Price
                            </p>

                            <p className="mt-1 font-mono font-bold text-slate-900">
                              {formatCurrency(
                                item?.unitPrice ||
                                  0
                              )}
                            </p>
                          </div>

                          <div className="bg-white rounded-xl border border-slate-200 p-3">
                            <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                              Order Date
                            </p>

                            <p className="mt-1 font-semibold text-slate-900">
                              {formatDate(
                                ord.createdAt
                              )}
                            </p>
                          </div>

                          <div className="bg-white rounded-xl border border-slate-200 p-3">
                            <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                              Current Status
                            </p>

                            <p className="mt-1 font-semibold text-blue-700">
                              {formatStatus(
                                ord.status
                              )}
                            </p>
                          </div>

                        </div>

                        {/* -------------------------------------------------- */}
                        {/* Timeline                                            */}
                        {/* -------------------------------------------------- */}

                        <div>

                          <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-4 flex items-center gap-1.5">
                            <Truck className="w-4 h-4 text-blue-600" />

                            <span>
                              Fulfillment & Compliance Timeline
                            </span>
                          </h4>

                          <div className="relative pl-6 border-l-2 border-blue-200 space-y-4">

                            {ord.trackingUpdates.map(
                              (
                                step,
                                idx
                              ) => (
                                <div
                                  key={`${ord.id}-step-${idx}`}
                                  className="relative"
                                >

                                  <div className="absolute -left-7.5 top-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold shadow-xs bg-blue-600 text-white">
                                    <CheckCircle2 className="w-3 h-3" />
                                  </div>

                                  <div>

                                    <div className="flex flex-wrap items-center gap-2">

                                      <span className="font-bold text-slate-900">
                                        {
                                          step.title
                                        }
                                      </span>

                                      <span className="text-[10px] text-slate-400 font-mono">
                                        {formatDateTime(
                                          step.timestamp
                                        )}
                                      </span>

                                    </div>

                                    <p className="text-slate-600 text-[11.5px] mt-0.5">
                                      {
                                        step.description
                                      }
                                    </p>

                                  </div>
                                </div>
                              )
                            )}

                          </div>
                        </div>

                        {/* -------------------------------------------------- */}
                        {/* Compliance Breakdown                              */}
                        {/* -------------------------------------------------- */}

                        <div className="bg-white p-4 rounded-xl border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4">

                          {/* Batch / Storage */}

                          <div>

                            <h5 className="font-bold text-slate-900 uppercase tracking-wider text-[10.5px] mb-2 flex items-center gap-1">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />

                              <span>
                                Batch & Storage Information
                              </span>
                            </h5>

                            <div className="space-y-1.5 text-[11px]">

                              <div className="flex justify-between gap-4">
                                <span className="text-slate-500">
                                  Batch Code:
                                </span>

                                <span className="font-mono font-bold text-slate-900">
                                  {ord.batchNumber ||
                                    item?.batchNumber ||
                                    "—"}
                                </span>
                              </div>

                              <div className="flex justify-between gap-4">
                                <span className="text-slate-500">
                                  Expiry Date:
                                </span>

                                <span className="font-mono text-slate-900">
                                  {formatDate(
                                    ord.expiryDate ||
                                      item?.expiryDate
                                  )}
                                </span>
                              </div>

                              <div className="flex justify-between gap-4">
                                <span className="text-slate-500">
                                  Delivery Address:
                                </span>

                                <span className="text-slate-800 text-right max-w-60">
                                  {
                                    ord.deliveryAddress
                                  }
                                </span>
                              </div>

                            </div>
                          </div>

                          {/* Pharmacist QA */}

                          <div>

                            <h5 className="font-bold text-slate-900 uppercase tracking-wider text-[10.5px] mb-2 flex items-center gap-1">
                              <FileCheck2 className="w-3.5 h-3.5 text-purple-600" />

                              <span>
                                Pharmacist Quality Assurance
                              </span>
                            </h5>

                            {ord
                              .pharmacistVerification
                              ?.result ===
                            "APPROVED" ? (
                              <div className="bg-purple-50/50 p-3 rounded-lg border border-purple-100 text-[11px] text-purple-950 space-y-1">

                                <p className="font-semibold">
                                  Verified by:{" "}
                                  {
                                    ord
                                      .pharmacistVerification
                                      .verifiedByName
                                  }
                                </p>

                                {ord
                                  .pharmacistVerification
                                  .notes && (
                                  <q className="text-slate-600 italic">
                                 
                                    {
                                      ord
                                        .pharmacistVerification
                                        .notes
                                    }
                                  </q>
                                )}

                                <div className="flex flex-wrap gap-2 pt-1 text-[10px] text-purple-700 font-medium">

                                  {ord
                                    .pharmacistVerification
                                    .batchValid && (
                                    <span>
                                      ✓ Batch Valid
                                    </span>
                                  )}

                                  {ord
                                    .pharmacistVerification
                                    .expiryValid && (
                                    <span>
                                      ✓ Expiry Valid
                                    </span>
                                  )}

                                  {ord
                                    .pharmacistVerification
                                    .sealIntact && (
                                    <span>
                                      ✓ Seal Intact
                                    </span>
                                  )}

                                  {ord
                                    .pharmacistVerification
                                    .storageCompliant && (
                                    <span>
                                      ✓ Storage Compliant
                                    </span>
                                  )}

                                </div>
                              </div>
                            ) : ord
                                .pharmacistVerification
                                ?.result ===
                              "REJECTED" ? (
                              <div className="bg-red-50 p-3 rounded-lg border border-red-100 text-[11px] text-red-900 flex gap-2">

                                <AlertCircle className="w-4 h-4 shrink-0" />

                                <p>
                                  This order was
                                  rejected during
                                  pharmacist
                                  verification.
                                </p>

                              </div>
                            ) : (
                              <div className="bg-amber-50 p-3 rounded-lg border border-amber-100 text-[11px] text-amber-900 flex gap-2">

                                <Clock className="w-4 h-4 shrink-0" />

                                <p>
                                  This order is
                                  currently awaiting
                                  or undergoing
                                  pharmacist
                                  verification.
                                </p>

                              </div>
                            )}

                          </div>

                        </div>

                        {/* -------------------------------------------------- */}
                        {/* Financial Summary                                  */}
                        {/* -------------------------------------------------- */}

                        <div className="grid grid-cols-1 lg:grid-col-2 bg-white p-4 rounded-xl border border-slate-200">

                          <div className="flex items-center gap-2 mb-3">

                            <Package className="w-4 h-4 text-blue-600" />

                            <h5 className="font-bold text-slate-900 uppercase tracking-wider text-[10.5px]">
                              Order Financial Summary
                            </h5>

                          </div>

                          <div className="space-y-2 text-xs">

                            <div className="flex justify-between">

                              <span className="text-slate-500">
                                Subtotal
                              </span>

                              <span className="font-mono text-slate-900">
                                {formatCurrency(
                                  ord.subtotal
                                )}
                              </span>

                            </div>

                            <div className="flex justify-between">

                              <span className="text-slate-500">
                                Platform Commission
                              </span>

                              <span className="font-mono text-slate-900">
                                {formatCurrency(
                                  ord.commission
                                )}
                              </span>

                            </div>

                            <div className="pt-2 border-t border-slate-100 flex justify-between">

                              <span className="font-bold text-slate-800">
                                Total
                              </span>

                              <span className="font-mono font-bold text-blue-700">
                                {formatCurrency(
                                  ord.total
                                )}
                              </span>

                            </div>

                          </div>
                        </div>

                      </div>
                    )}

                  </div>
                );
              })}

            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default OrderTracking;