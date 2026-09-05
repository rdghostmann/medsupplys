// BuyerOrders.tsx

"use client";

import React, { useState } from "react";
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

type BuyerOrderStatus =
  | "PENDING"
  | "SUPPLIER_CONTACTED"
  | "SUPPLIER_CONFIRMED"
  | "UNDER_VERIFICATION"
  | "READY_FOR_DISPATCH"
  | "DISPATCHED"
  | "IN_TRANSIT"
  | "VERIFIED"
  | "DELIVERED"
  | "COMPLETED"
  | "REJECTED";

type BuyerOrderItem = {
  id: string;
  name: string;
  category: string;
  dosage?: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
};

type TrackingUpdate = {
  title: string;
  description: string;
  timestamp: string;
  completed: boolean;
};

type PharmacistVerification = {
  verifiedByName: string;
  pharmacistLicense?: string;
  verifiedAt: string;
  notes: string;
  result: "APPROVED" | "REJECTED" | "PENDING";
};

type BuyerOrder = {
  id: string;
  orderNumber: string;

  status: BuyerOrderStatus;

  supplierId: string;
  supplierName: string;
  supplierType: "importer" | "distributor" | "retailer";

  items: BuyerOrderItem[];

  subtotal: number;
  deliveryFee: number;
  total: number;

  batchNumber: string;
  nafdacNumber?: string;

  manufacturingDate?: string;
  expiryDate: string;

  deliveryAddress: string;
  estimatedDeliveryDate?: string;

  coldChainRequired: boolean;
  temperature?: number;

  pharmacistVerification?: PharmacistVerification;

  trackingUpdates: TrackingUpdate[];

  createdAt: string;
  updatedAt: string;
};

/**
 * Mock Buyer Orders
 *
 * Replace this with API/SWR data when the procurement
 * order endpoint is connected.
 */
const mockOrders: BuyerOrder[] = [
  {
    id: "ord_001",
    orderNumber: "MS-2026-000184",

    status: "IN_TRANSIT",

    supplierId: "sup_maybaker",
    supplierName: "May & Baker Nigeria Plc",
    supplierType: "importer",

    items: [
      {
        id: "item_001",
        name: "Paracetamol 500mg",
        category: "Analgesic",
        dosage: "500mg",
        quantity: 5000,
        unit: "tablets",
        unitPrice: 120,
        total: 600000,
      },
    ],

    subtotal: 600000,
    deliveryFee: 15000,
    total: 615000,

    batchNumber: "MB-PARA-2607-B12",
    nafdacNumber: "A4-1234",

    manufacturingDate: "2026-07-01",
    expiryDate: "2028-06-30",

    deliveryAddress:
      "St. Mary's Hospital Procurement Unit, Port Harcourt, Rivers State",

    estimatedDeliveryDate: "2026-09-06",

    coldChainRequired: true,
    temperature: 4.2,

    pharmacistVerification: {
      verifiedByName: "Pharm. Chinedu Okafor",
      pharmacistLicense: "PCN/PH/48291",
      verifiedAt: "2026-09-04T14:35:00",
      notes:
        "Batch number, NAFDAC details and packaging verified. Seal intact and product condition meets procurement requirements.",
      result: "APPROVED",
    },

    trackingUpdates: [
      {
        title: "Order Created",
        description:
          "Procurement order successfully created and submitted to the selected supplier.",
        timestamp: "2026-09-02T09:15:00",
        completed: true,
      },
      {
        title: "Supplier Confirmed",
        description:
          "May & Baker Nigeria Plc confirmed availability and accepted the procurement request.",
        timestamp: "2026-09-02T12:40:00",
        completed: true,
      },
      {
        title: "Pharmacist Verification",
        description:
          "Batch, packaging, NAFDAC information and product condition verified by the pharmacist.",
        timestamp: "2026-09-04T14:35:00",
        completed: true,
      },
      {
        title: "Dispatched",
        description:
          "Order released from supplier warehouse and handed over for controlled delivery.",
        timestamp: "2026-09-05T07:30:00",
        completed: true,
      },
      {
        title: "In Transit to Office",
        description:
          "Shipment is currently in transit to the buyer's designated receiving facility.",
        timestamp: "2026-09-05T09:20:00",
        completed: true,
      },
      {
        title: "Delivered",
        description:
          "Awaiting delivery confirmation at the buyer's receiving facility.",
        timestamp: "2026-09-06T10:00:00",
        completed: false,
      },
    ],

    createdAt: "2026-09-02T09:15:00",
    updatedAt: "2026-09-05T09:20:00",
  },

  {
    id: "ord_002",
    orderNumber: "MS-2026-000181",

    status: "UNDER_VERIFICATION",

    supplierId: "sup_fidson",
    supplierName: "Fidson Healthcare Plc",
    supplierType: "importer",

    items: [
      {
        id: "item_002",
        name: "Amoxicillin 500mg",
        category: "Antibiotic",
        dosage: "500mg",
        quantity: 2000,
        unit: "capsules",
        unitPrice: 250,
        total: 500000,
      },
    ],

    subtotal: 500000,
    deliveryFee: 10000,
    total: 510000,

    batchNumber: "FID-AMX-2606-C08",
    nafdacNumber: "A4-7821",

    manufacturingDate: "2026-06-15",
    expiryDate: "2028-05-31",

    deliveryAddress:
      "St. Mary's Hospital Procurement Unit, Port Harcourt, Rivers State",

    estimatedDeliveryDate: "2026-09-06",

    coldChainRequired: false,

    trackingUpdates: [
      {
        title: "Order Created",
        description:
          "Procurement order successfully created from the approved supplier match.",
        timestamp: "2026-09-01T10:10:00",
        completed: true,
      },
      {
        title: "Supplier Confirmed",
        description:
          "Supplier confirmed stock availability and procurement terms.",
        timestamp: "2026-09-01T13:25:00",
        completed: true,
      },
      {
        title: "Shipment Received",
        description:
          "Shipment arrived at the MedSupply verification station.",
        timestamp: "2026-09-04T11:15:00",
        completed: true,
      },
      {
        title: "Under Pharmacist Verification",
        description:
          "Physical inspection and NAFDAC validation are currently in progress.",
        timestamp: "2026-09-05T08:30:00",
        completed: true,
      },
    ],

    createdAt: "2026-09-01T10:10:00",
    updatedAt: "2026-09-05T08:30:00",
  },

  {
    id: "ord_003",
    orderNumber: "MS-2026-000165",

    status: "DELIVERED",

    supplierId: "sup_emzor",
    supplierName: "Emzor Pharmaceutical Industries Ltd",
    supplierType: "distributor",

    items: [
      {
        id: "item_003",
        name: "Vitamin C 1000mg",
        category: "Vitamin",
        dosage: "1000mg",
        quantity: 3000,
        unit: "tablets",
        unitPrice: 90,
        total: 270000,
      },
    ],

    subtotal: 270000,
    deliveryFee: 8000,
    total: 278000,

    batchNumber: "EMZ-VITC-2605-A19",
    nafdacNumber: "A5-3312",

    manufacturingDate: "2026-05-10",
    expiryDate: "2028-05-09",

    deliveryAddress:
      "St. Mary's Hospital Procurement Unit, Port Harcourt, Rivers State",

    estimatedDeliveryDate: "2026-08-30",

    coldChainRequired: false,

    pharmacistVerification: {
      verifiedByName: "Pharm. Blessing Ekanem",
      pharmacistLicense: "PCN/PH/39201",
      verifiedAt: "2026-08-29T15:20:00",
      notes:
        "Product received in good condition. Batch and expiry details correspond with procurement documentation.",
      result: "APPROVED",
    },

    trackingUpdates: [
      {
        title: "Order Created",
        description:
          "Procurement order created and submitted to the distributor.",
        timestamp: "2026-08-26T09:00:00",
        completed: true,
      },
      {
        title: "Supplier Confirmed",
        description:
          "Supplier confirmed availability and accepted the order.",
        timestamp: "2026-08-26T11:45:00",
        completed: true,
      },
      {
        title: "Pharmacist Verification",
        description:
          "Product and batch information successfully verified.",
        timestamp: "2026-08-29T15:20:00",
        completed: true,
      },
      {
        title: "Dispatched",
        description:
          "Order dispatched from supplier warehouse.",
        timestamp: "2026-08-30T07:15:00",
        completed: true,
      },
      {
        title: "Delivered",
        description:
          "Order delivered and receiving facility confirmed successful receipt.",
        timestamp: "2026-08-30T13:45:00",
        completed: true,
      },
    ],

    createdAt: "2026-08-26T09:00:00",
    updatedAt: "2026-08-30T13:45:00",
  },
];

const formatCurrency = (value: number) =>
  `₦${Number(value || 0).toLocaleString("en-NG")}`;

const formatDate = (date?: string) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-NG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getStatusStyles = (status: BuyerOrderStatus) => {
  if (["DELIVERED", "COMPLETED", "VERIFIED"].includes(status)) {
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

  if (status === "REJECTED") {
    return "bg-red-100 text-red-800";
  }

  return "bg-amber-100 text-amber-800";
};

const formatStatus = (status: BuyerOrderStatus) =>
  status.replace(/_/g, " ");

export const BuyerOrders: React.FC = () => {
  const [orders] = useState<BuyerOrder[]>(mockOrders);

  const [activeExpandedOrderId, setActiveExpandedOrderId] =
    useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setActiveExpandedOrderId((currentId) =>
      currentId === id ? null : id
    );
  };

  const downloadWaybill = (order: BuyerOrder) => {
    toast.success(
      `Preparing Waybill PDF for Order #${order.orderNumber}`
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-xl font-bold text-slate-900">
            Committed Orders & Cold-Chain Tracking
          </h1>

          <p className="text-xs text-slate-500 mt-0.5">
            Strict QA inspection by licensed pharmacists and
            end-to-end temperature monitored transit
          </p>
        </div>
      </div>

      {/* Empty State */}
      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />

          <h3 className="font-bold text-slate-800 text-sm">
            No Orders Yet
          </h3>

          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            When suppliers confirm your procurement sourcing
            requests, committed transactions will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((ord) => {
            const isExpanded =
              activeExpandedOrderId === ord.id;

            const item = ord.items[0];

            return (
              <div
                key={ord.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition"
              >
                {/* Summary Row */}
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
                        {formatStatus(ord.status)}
                      </span>
                    </div>

                    {/* Order Information */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                      <span>
                        Supplier:{" "}
                        <strong className="text-slate-900">
                          {ord.supplierName}
                        </strong>{" "}
                        ({ord.supplierType})
                      </span>

                      <span>
                        Batch:{" "}
                        <strong className="font-mono text-slate-900">
                          {ord.batchNumber}
                        </strong>
                      </span>

                      <span>
                        Total:{" "}
                        <strong className="font-mono text-blue-700">
                          {formatCurrency(ord.total)}
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
                            ord.pharmacistVerification
                              .verifiedByName
                          }
                        </span>
                      ) : ord.pharmacistVerification
                          ?.result === "REJECTED" ? (
                        <span className="font-semibold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                          ✕ REJECTED
                        </span>
                      ) : (
                        <span className="font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 animate-pulse">
                          Pending QA Station Verification
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => downloadWaybill(ord)}
                      className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-500" />

                      <span>Waybill PDF</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        toggleExpand(ord.id)
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

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="border-t border-slate-100 bg-slate-50/70 p-5 space-y-6 text-xs">
                    {/* Order Overview */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="bg-white rounded-xl border border-slate-200 p-3">
                        <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                          Quantity
                        </p>

                        <p className="mt-1 font-mono font-bold text-slate-900">
                          {item?.quantity.toLocaleString()}{" "}
                          {item?.unit}
                        </p>
                      </div>

                      <div className="bg-white rounded-xl border border-slate-200 p-3">
                        <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                          Unit Price
                        </p>

                        <p className="mt-1 font-mono font-bold text-slate-900">
                          {formatCurrency(
                            item?.unitPrice ?? 0
                          )}
                        </p>
                      </div>

                      <div className="bg-white rounded-xl border border-slate-200 p-3">
                        <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                          Order Date
                        </p>

                        <p className="mt-1 font-semibold text-slate-900">
                          {formatDate(ord.createdAt)}
                        </p>
                      </div>

                      <div className="bg-white rounded-xl border border-slate-200 p-3">
                        <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                          ETA
                        </p>

                        <p className="mt-1 font-semibold text-blue-700">
                          {formatDate(
                            ord.estimatedDeliveryDate
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div>
                      <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-4 flex items-center gap-1.5">
                        <Truck className="w-4 h-4 text-blue-600" />

                        <span>
                          Fulfillment & Compliance Stepper
                          Timeline
                        </span>
                      </h4>

                      <div className="relative pl-6 border-l-2 border-blue-200 space-y-4">
                        {ord.trackingUpdates.map(
                          (step, idx) => (
                            <div
                              key={`${ord.id}-step-${idx}`}
                              className="relative"
                            >
                              <div
                                className={`absolute -left-[31px] top-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold shadow-xs ${
                                  step.completed
                                    ? "bg-blue-600 text-white"
                                    : "bg-slate-200 text-slate-500"
                                }`}
                              >
                                {step.completed ? (
                                  "✓"
                                ) : (
                                  <Clock className="w-2.5 h-2.5" />
                                )}
                              </div>

                              <div>
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="font-bold text-slate-900">
                                    {step.title}
                                  </span>

                                  <span className="text-[10px] text-slate-400 font-mono">
                                    {new Date(
                                      step.timestamp
                                    ).toLocaleString(
                                      "en-NG",
                                      {
                                        month: "short",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      }
                                    )}
                                  </span>
                                </div>

                                <p className="text-slate-600 text-[11.5px] mt-0.5">
                                  {step.description}
                                </p>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    {/* Compliance Breakdown */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Batch / Storage */}
                      <div>
                        <h5 className="font-bold text-slate-900 uppercase tracking-wider text-[10.5px] mb-2 flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />

                          <span>
                            Batch Authentication & Storage
                            Specs
                          </span>
                        </h5>

                        <div className="space-y-1.5 text-[11px]">
                          <div className="flex justify-between gap-4">
                            <span className="text-slate-500">
                              Batch Code:
                            </span>

                            <span className="font-mono font-bold text-slate-900">
                              {ord.batchNumber}
                            </span>
                          </div>

                          <div className="flex justify-between gap-4">
                            <span className="text-slate-500">
                              NAFDAC Number:
                            </span>

                            <span className="font-mono text-slate-900">
                              {ord.nafdacNumber || "—"}
                            </span>
                          </div>

                          <div className="flex justify-between gap-4">
                            <span className="text-slate-500">
                              Manufacturing Date:
                            </span>

                            <span className="font-mono text-slate-900">
                              {formatDate(
                                ord.manufacturingDate
                              )}
                            </span>
                          </div>

                          <div className="flex justify-between gap-4">
                            <span className="text-slate-500">
                              Expiry Date:
                            </span>

                            <span className="font-mono text-slate-900">
                              {formatDate(ord.expiryDate)}
                            </span>
                          </div>

                          <div className="flex justify-between gap-4">
                            <span className="text-slate-500">
                              Cold-Chain Temperature:
                            </span>

                            {ord.coldChainRequired ? (
                              <span className="font-semibold text-sky-700 flex items-center gap-1">
                                <ThermometerSnowflake className="w-3 h-3" />

                                {ord.temperature
                                  ? `+${ord.temperature}°C Monitored`
                                  : "Monitoring Active"}
                              </span>
                            ) : (
                              <span className="text-slate-500">
                                Not Required
                              </span>
                            )}
                          </div>

                          <div className="flex justify-between gap-4">
                            <span className="text-slate-500">
                              Delivery Destination:
                            </span>

                            <span className="text-slate-800 text-right max-w-[240px]">
                              {ord.deliveryAddress}
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
                            Notes
                          </span>
                        </h5>

                        {ord.pharmacistVerification?.result ===
                        "APPROVED" ? (
                          <div className="bg-purple-50/50 p-3 rounded-lg border border-purple-100 text-[11px] text-purple-950 space-y-1">
                            <p className="font-semibold">
                              Verified by:{" "}
                              {
                                ord.pharmacistVerification
                                  .verifiedByName
                              }
                            </p>

                            <q className="text-slate-600 italic">
                              
                              {
                                ord.pharmacistVerification
                                  .notes
                              }
                              
                            </q>

                            <div className="flex flex-wrap gap-2 pt-1 text-[10px] text-purple-700 font-medium">
                              <span>✓ Seal Intact</span>
                              <span>✓ Expiry Valid</span>
                              <span>
                                ✓ Storage GDP Compliant
                              </span>
                            </div>
                          </div>
                        ) : ord.status === "REJECTED" ? (
                          <div className="bg-red-50 p-3 rounded-lg border border-red-100 text-[11px] text-red-900 flex gap-2">
                            <AlertCircle className="w-4 h-4 shrink-0" />

                            <p>
                              This order was rejected during
                              the procurement verification
                              process and requires buyer
                              attention.
                            </p>
                          </div>
                        ) : (
                          <div className="bg-amber-50 p-3 rounded-lg border border-amber-100 text-[11px] text-amber-900 flex gap-2">
                            <Clock className="w-4 h-4 shrink-0" />

                            <p>
                              Order is currently queued at the
                              Central Verification Station for
                              pharmacist physical inspection
                              and NAFDAC barcode validation.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Order Financial Summary */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200">
                      <div className="flex items-center gap-2 mb-3">
                        <Package className="w-4 h-4 text-blue-600" />

                        <h5 className="font-bold text-slate-900 uppercase tracking-wider text-[10.5px]">
                          Procurement Cost Breakdown
                        </h5>
                      </div>

                      <div className="max-w-md ml-auto space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-500">
                            Subtotal
                          </span>

                          <span className="font-mono text-slate-900">
                            {formatCurrency(ord.subtotal)}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-slate-500">
                            Delivery Fee
                          </span>

                          <span className="font-mono text-slate-900">
                            {formatCurrency(ord.deliveryFee)}
                          </span>
                        </div>

                        <div className="pt-2 border-t border-slate-100 flex justify-between">
                          <span className="font-bold text-slate-800">
                            Total
                          </span>

                          <span className="font-mono font-bold text-blue-700">
                            {formatCurrency(ord.total)}
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
  );
};

export default BuyerOrders;