"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion"

import {
  ShieldCheck,
  CheckCircle2,
  AlertOctagon,
  Clock,
  Building2,
  Activity,
  FileCheck2,
  UserCheck,
  Search,
  Filter,
  ArrowUpRight,
  Sparkles,
  QrCode,
  Layers,
  ChevronRight,
  TrendingUp,
  Download,
  AlertTriangle,
  FileSpreadsheet,
  RotateCcw,
  Check,
  Plus,
  Package,
  Boxes
} from "lucide-react";
import { Order, PharmacistVerificationRecord } from "@/types";
import { INITIAL_VERIFICATION_HISTORY } from "./components/PharmacistVerificationTable/PharmacistVerificationTable";
import PharmacistVerifyModal, { OrderStatusBadge } from "./components/PharmacistVerifyModal/PharmacistVerifyModal";



export const INITIAL_ORDERS: Order[] = [
  {
    id: "ORD-2024",
    product: "Amoxicillin 500mg",
    buyer: "Lagos General Hospital",
    qty: 200,
    basePrice: 2800,
    status: "Under Verification",
    date: "2024-01-15",
    supplier: "PharmaCo Ltd",
    batchNo: "BATCH-NG-2024-4421",
    barcode: "NG-AMX-2024-4421",
  },
  {
    id: "ORD-2023",
    product: "Metformin 500mg",
    buyer: "Federal Medical Centre",
    qty: 500,
    basePrice: 1200,
    status: "In Transit to Office",
    date: "2024-01-14",
    supplier: "MediSource NG",
    batchNo: "BATCH-MET-2024-3819",
    barcode: "NG-MET-2024-3819",
  },
  {
    id: "ORD-2022",
    product: "Lisinopril 10mg",
    buyer: "Unity Clinic",
    qty: 100,
    basePrice: 3400,
    status: "Verified",
    date: "2024-01-13",
    supplier: "HealthBridge",
    batchNo: "BATCH-LIS-2024-1189",
    barcode: "NG-LIS-2024-1189",
  },
  {
    id: "ORD-2021",
    product: "Paracetamol 500mg",
    buyer: "City Pharmacy",
    qty: 1000,
    basePrice: 450,
    status: "Delivered",
    date: "2024-01-12",
    supplier: "PharmaCo Ltd",
    batchNo: "BATCH-4420",
    barcode: "NG-PCM-2024-4420",
  },
  {
    id: "ORD-2020",
    product: "Omeprazole 20mg",
    buyer: "Lagos General Hospital",
    qty: 150,
    basePrice: 1800,
    status: "Supplier Contacted",
    date: "2024-01-11",
    supplier: "MediSource NG",
    batchNo: "BATCH-OMP-2024-5510",
    barcode: "NG-OMP-2024-5510",
  },
  {
    id: "ORD-2019",
    product: "Amlodipine 5mg",
    buyer: "Federal Medical Centre",
    qty: 80,
    basePrice: 2100,
    status: "Pending",
    date: "2024-01-10",
    supplier: "HealthBridge",
    batchNo: "BATCH-AML-2024-8840",
    barcode: "NG-AML-2024-8840",
  },
  {
    id: "ORD-2018",
    product: "Ciprofloxacin 500mg",
    buyer: "Community Health Clinic",
    qty: 300,
    basePrice: 3200,
    status: "Supplier Confirmed",
    date: "2024-01-09",
    supplier: "PharmaCo Ltd",
    batchNo: "BATCH-CIP-2024-4419",
    barcode: "NG-CIP-2024-4419",
  },
];

const PharmacistDashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [verificationHistory, setVerificationHistory] = useState<PharmacistVerificationRecord[]>(
    INITIAL_VERIFICATION_HISTORY
  );
  const [selectedOrderToVerify, setSelectedOrderToVerify] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [queueFilter, setQueueFilter] = useState<"pending" | "all">("pending");
  const [toastMessage, setToastMessage] = useState<{
    title: string;
    description: string;
    type: "success" | "danger";
  } | null>(null);

  // Filter incoming queue: items awaiting pharmacist processing
  const incomingQueue = orders.filter((o) => {
    if (queueFilter === "pending") {
      return (
        o.status === "Under Verification" ||
        o.status === "In Transit to Office" ||
        o.status === "Pending" ||
        o.status === "Supplier Confirmed"
      );
    }
    return true;
  });

  const handleOpenVerifyModal = (order?: Order) => {
    // If specific order provided, use it; otherwise find first Under Verification or first item
    const targetOrder =
      order ||
      orders.find((x) => x.status === "Under Verification") ||
      incomingQueue[0] ||
      orders[0];

    setSelectedOrderToVerify(targetOrder);
    setIsModalOpen(true);
  };

  const handleVerifySubmit = (
    orderId: string,
    result: "Verified" | "Rejected",
    verificationData: {
      batchNo: string;
      mfgDate: string;
      expiryDate: string;
      condition: string;
      notes: string;
      barcode: string;
    }
  ) => {
    // 1. Update the order in the orders list
    const nextStatus: Order["status"] = result === "Verified" ? "Verified" : "Rejected";
    const updatedOrders = orders.map((o) => {
      if (o.id === orderId) {
        return {
          ...o,
          status: nextStatus,
          batchNo: verificationData.batchNo,
          expiryDate: verificationData.expiryDate,
          mfgDate: verificationData.mfgDate,
          condition: verificationData.condition,
          notes: verificationData.notes,
        };
      }
      return o;
    });
    setOrders(updatedOrders);

    const targetOrder = orders.find((o) => o.id === orderId);
    const productName = targetOrder ? targetOrder.product : "Pharmaceutical Consignment";
    const buyerName = targetOrder ? targetOrder.buyer : "Hospital Central Pharmacy";

    // 2. Prepend a new record to the Pharmacist Verification History
    const newHistoryRecord: PharmacistVerificationRecord = {
      id: `rec-${Date.now()}`,
      orderId: orderId,
      product: productName,
      dosage: targetOrder?.qty ? `${targetOrder.qty} units inspected` : "Standard Units",
      batchNo: verificationData.batchNo,
      result: result,
      pharmacist: "Dr. Amaka Obi",
      pharmacistLicense: "PCN/2018/88421",
      date: new Date().toISOString().slice(0, 10),
      notes: verificationData.notes,
      nafdacNumber: "04-8921",
      manufacturer: targetOrder?.supplier || "Licensed Manufacturer",
      expiryDate: verificationData.expiryDate,
      quantity: targetOrder?.qty,
      facility: buyerName,
    };

    setVerificationHistory((prev) => [newHistoryRecord, ...prev]);

    // 3. Show Toast notification
    setToastMessage({
      title: result === "Verified" ? `Batch ${verificationData.batchNo} Verified & Released!` : `Batch ${verificationData.batchNo} Flagged as Rejected!`,
      description: result === "Verified"
        ? `Order ${orderId} (${productName}) has passed clinical inspection and logged to NAFDAC register.`
        : `Order ${orderId} quarantined due to inspection findings. Supplier notified.`,
      type: result === "Verified" ? "success" : "danger",
    });

    setTimeout(() => {
      setToastMessage(null);
    }, 5000);
  };

  const handleResetQueue = () => {
    setOrders(INITIAL_ORDERS);
    setToastMessage({
      title: "Queue Reset Successfully",
      description: "Original incoming consignments restored for verification.",
      type: "success",
    });
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="min-h-screen  text-slate-900 pb-24 font-sans">
      {/* Toast Notification Banner */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-4 z-50 max-w-md w-full"
          >
            <div
              className={`p-4 rounded-2xl shadow-xl border flex items-start gap-3 backdrop-blur-md ${toastMessage.type === "success"
                ? "bg-emerald-900/90 text-white border-emerald-700/60"
                : "bg-rose-900/90 text-white border-rose-700/60"
                }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${toastMessage.type === "success" ? "bg-emerald-600" : "bg-rose-600"
                  }`}
              >
                {toastMessage.type === "success" ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <AlertOctagon className="w-5 h-5" />
                )}
              </div>
              <div className="flex-1 text-xs">
                <p className="font-bold text-sm">{toastMessage.title}</p>
                <p className="text-slate-200 mt-0.5">{toastMessage.description}</p>
              </div>
              <button
                onClick={() => setToastMessage(null)}
                className="text-slate-300 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header */}
      <header className="bg-white mb-4 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="">
              <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                Licensed Pharmacist Quality Assurance Station
              </h1>
            
            <p className="text-xs text-slate-400">Physical batch inspection, NAFDAC chemical seal verification, and cold-chain compliance clearance</p>
          </div>


        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto space-y-8">
        {/* Banner / Welcome */}
        <div className=" lg:block rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                Verified Supply Chain Audit Ledger
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Batch Verification & Audit History
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                Review incoming consignments, perform barcode & spectral verification against the NAFDAC database, and sign digital batch release certificates.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="bg-white/10 backdrop-blur-md border border-white/10 p-3.5 rounded-2xl text-center min-w-[110px]">
                <span className="text-[10px] uppercase font-bold text-blue-200 block">Queue Items</span>
                <span className="text-2xl font-black text-white">{incomingQueue.length}</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/10 p-3.5 rounded-2xl text-center min-w-[110px]">
                <span className="text-[10px] uppercase font-bold text-emerald-300 block">Pass Rate</span>
                <span className="text-2xl font-black text-emerald-400">96.8%</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Stat Metric Cards */}
        <div className="hidden space-y-6">
          {/* <PharmacistStatsCard
            verificationHistory={verificationHistory}
          /> */}
        </div>

        {/* =========================================================
            SECTION: INCOMING PRODUCTS (Requested by user)
        ========================================================= */}
        <section className="space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                <Boxes className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Verification Queue</h3>
                <p className="text-xs text-slate-500">
                  Consignments arriving at central dispatch awaiting pharmacist verification
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200/60 text-xs font-semibold">
                <button
                  onClick={() => setQueueFilter("pending")}
                  className={`px-3 py-1.5 rounded-lg transition-all ${queueFilter === "pending"
                    ? "bg-white text-slate-900 shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                    }`}
                >
                  Pending Queue ({orders.filter((o) => o.status !== "Verified" && o.status !== "Delivered" && o.status !== "Rejected").length})
                </button>
                <button
                  onClick={() => setQueueFilter("all")}
                  className={`px-3 py-1.5 rounded-lg transition-all ${queueFilter === "all"
                    ? "bg-white text-slate-900 shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                    }`}
                >
                  All Orders ({orders.length})
                </button>
              </div>

              {incomingQueue.length === 0 && (
                <button
                  onClick={handleResetQueue}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-xs transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Queue
                </button>
              )}
            </div>
          </div>

          {/* Queue Content Rendering */}
          {incomingQueue.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-xs flex flex-col items-center justify-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl mb-3 shadow-xs">
                ✅
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1">Queue is clear</h4>
              <p className="text-xs text-slate-500 mb-4 max-w-sm">
                All products have been processed and released to hospital pharmacies.
              </p>
              <button
                onClick={handleResetQueue}
                className="px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl font-bold text-xs transition-colors flex items-center gap-1.5 border border-blue-200/60"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Restore Demo Queue Orders
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {incomingQueue.map((o) => (
                <div
                  key={o.id}
                  className="rounded-2xl border border-slate-200/90 bg-white p-4.5 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all"
                >
                  <div className="flex items-center gap-4 flex-wrap justify-between">
                    <div className="flex-1 min-w-[220px]">
                      <div className="text-[15px] font-bold text-slate-900 flex items-center gap-2">
                        <span>{o.product}</span>
                        {o.batchNo && (
                          <span className="font-mono text-[11px] font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                            {o.batchNo}
                          </span>
                        )}
                      </div>
                      <div className="text-[13px] text-slate-500 mt-0.5">
                        <strong className="text-slate-700 font-semibold">{o.id}</strong> · Qty:{" "}
                        {o.qty.toLocaleString()} · {o.buyer}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 flex-wrap">
                      <OrderStatusBadge status={o.status} />

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenVerifyModal(o)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm shadow-blue-500/20 active:scale-98"
                        >
                          <span>🔬</span> Verify Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>


      </main>

      {/* =========================================================
          VERIFY PRODUCT MODAL (renderPhaVerify)
      ========================================================= */}
      <PharmacistVerifyModal
        order={selectedOrderToVerify}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedOrderToVerify(null);
        }}
        onVerify={handleVerifySubmit}
      />
    </div>
  );
}
export default PharmacistDashboard;
