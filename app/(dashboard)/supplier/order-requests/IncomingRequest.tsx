// IncomingRequest.tsx
"use client";

import React, { useMemo, useState } from "react";
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertTriangle,

} from "lucide-react";
import { toast } from "sonner";
import type {
  CurrentSupplierUser,
  IncomingProcurementRequest,
} from "@/controllers/supplier.action";
type ResponseType = "ACCEPT" | "REJECT" | "UNAVAILABLE";

interface IncomingRequestsProps {
  user: CurrentSupplierUser;
  procurements: IncomingProcurementRequest[];
}

const IncomingRequests: React.FC<
  IncomingRequestsProps
> = ({
  user,
  procurements,
}) => {

  const [responseNotes, setResponseNotes] = useState<Record<string, string>
  >({});

  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  // Filter procurements where this supplier is the CURRENT ACTIVE
  // candidate in the sourcing queue.
  const pendingRequests = useMemo(() => {
    return procurements.filter(
      (procurement) =>
        procurement.currentSupplierId === user.id
    );
  }, [procurements, user.id]);

  const handleRespond = async (
    procurementId: string,
    response: ResponseType
  ) => {
    const procurement = procurements.find(
      (p) => p.id === procurementId
    );

    if (!procurement) {
      toast.error("Procurement request not found");
      return;
    }

    setIsProcessing(procurementId);

    try {
      // Simulate backend processing
      await new Promise((resolve) => setTimeout(resolve, 900));

      const note = responseNotes[procurementId]?.trim();

      if (response === "ACCEPT") {
     
        toast.success("Procurement Request Accepted", {
          description: `Committed to Order #${procurement.procurementNumber}. Ready for Pharmacist verification.`,
        });

        if (note) {
          toast.info("Fulfillment remark recorded", {
            description: note,
          });
        }
      } else {
        const nextSupplierIndex =
          procurement.currentSupplierIndex + 1;

        const hasFallbackSupplier =
          nextSupplierIndex < procurement.supplierQueue.length;


        if (hasFallbackSupplier) {
          const nextSupplier =
            procurement.supplierQueue[nextSupplierIndex];

          toast.info(
            response === "UNAVAILABLE"
              ? "Stock Unavailable — Fallback Triggered"
              : "Request Declined — Fallback Triggered",
            {
              description: `The sourcing engine has forwarded the request to ${nextSupplier.supplierName}, ranked #${nextSupplier.rank}.`,
            }
          );
        } else {
          toast.warning("No Additional Supplier Available", {
            description:
              "The fallback queue has been exhausted. Buyer action is required.",
          });
        }
      }

      setResponseNotes((current) => ({
        ...current,
        [procurementId]: "",
      }));
    } catch {
      toast.error("Response failed", {
        description:
          "Unable to process the procurement response. Please try again.",
      });
    } finally {
      setIsProcessing(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-xl font-bold text-slate-900">
            Incoming Procurement RFQs & Sourcing Requests
          </h1>

          <p className="text-xs text-slate-500 mt-0.5">
            Real-time procurement requests routed to you based on
            stock, tier score, and pricing
          </p>
        </div>
      </div>

      {pendingRequests.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Sparkles className="w-12 h-12 text-slate-300 mx-auto mb-3" />

          <h3 className="font-bold text-slate-800 text-sm">
            No Pending RFQs for Your Account
          </h3>

          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            You are currently up to date. Sourcing requests will alert
            you immediately when matching your catalogue listings.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingRequests.map((proc) => {
            const isSubmitting = isProcessing === proc.id;

            const activeSupplier =
              proc.supplierQueue[proc.currentSupplierIndex];

            return (
              <div
                key={proc.id}
                className="bg-white rounded-2xl border-2 border-blue-400 p-6 shadow-md shadow-blue-500/10 space-y-4"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-display text-base font-bold text-slate-900">
                        {proc.productName}
                      </span>

                      <span className="font-mono text-xs bg-slate-900 text-white px-2 py-0.5 rounded font-bold">
                        #{proc.procurementNumber}
                      </span>

                      <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded animate-pulse">
                        ACTION REQUIRED
                      </span>
                    </div>

                    <div className="flex flex-col lg:flex-row lg:items-center gap-1 lg:gap-3 text-xs text-slate-600 mt-1">
                      <span>
                        Buyer:{" "}
                        <strong className="text-slate-900">
                          {proc.buyerName}
                        </strong>
                      </span>

                      <span className="hidden lg:inline">•</span>

                      <span>
                        Delivery:{" "}
                        <strong className="text-slate-900">
                          {proc.deliveryAddress}
                        </strong>
                      </span>
                    </div>
                  </div>

                  <div className="text-left lg:text-right">
                    <div className="text-xs text-slate-500">
                      Requested Volume
                    </div>

                    <div className="font-mono font-bold text-lg text-slate-900">
                      {proc.quantity.toLocaleString()} {proc.unit}
                    </div>
                  </div>
                </div>

                {/* Financial Value */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 block">
                      Unit Selling Price:
                    </span>

                    <span className="font-mono font-bold text-slate-900 text-sm">
                      ₦
                      {activeSupplier?.unitPrice.toLocaleString() || "0"}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 block">
                      Gross Procurement Value:
                    </span>

                    <span className="font-mono font-bold text-blue-700 text-sm">
                      ₦{activeSupplier?.totalPrice.toLocaleString() || "0"}
                    </span>
                  </div>

                  <div className="">
                    <span className="text-slate-500 block">
                      Buyer Payment Status:
                    </span>

                    <span className=" font-semibold text-emerald-700">
                      ✓ Funds Escrowed 
                      {/* (
                      {proc.paymentMethod.replace(
                        "_",
                        " + "
                      )}
                      ) */}
                    </span>
                  </div>
                </div>

                {/* Current Queue Context */}
                <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-3">
                  <div className="flex flex-wrap items-center gap-2 text-[11px]">
                    <span className="font-semibold text-slate-500">
                      Current sourcing position:
                    </span>

                    <span className="font-bold text-blue-700">
                      Rank #{activeSupplier?.rank}
                    </span>

                    <span className="text-slate-400">•</span>

                    <span className="font-semibold text-slate-900">
                      {activeSupplier?.supplierName}
                    </span>

                    <span className="text-slate-400">•</span>

                    <span className="text-slate-600">
                      Stock:{" "}
                      <strong>
                        {activeSupplier?.stock.toLocaleString()}
                      </strong>
                    </span>
                  </div>
                </div>

                {/* Response Note input */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Response Note / Fulfillment Dispatch Remark
                  </label>

                  <input
                    type="text"
                    placeholder="e.g. Batch BATCH-2025-01 ready for cold chain dispatch from Ikeja Warehouse"
                    value={responseNotes[proc.id] || ""}
                    onChange={(e) =>
                      setResponseNotes((current) => ({
                        ...current,
                        [proc.id]: e.target.value,
                      }))
                    }
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:bg-slate-50 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    disabled={isSubmitting}
                    onClick={() =>
                      handleRespond(proc.id, "UNAVAILABLE")
                    }
                    className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-xl text-xs font-semibold transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Reject Order
                  </button>



                  <button
                    disabled={isSubmitting}
                    onClick={() =>
                      handleRespond(proc.id, "ACCEPT")
                    }
                    className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CheckCircle2 className="w-4 h-4" />

                    <span>
                      {isSubmitting
                        ? "Processing..."
                        : "Accept Order"}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default IncomingRequests;