// /dashboard/supplier/earnings/EarningsPage.tsx
"use client"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Coins, ArrowLeft, Landmark,
    Sparkles, CheckCircle2, Info
} from 'lucide-react';
import { BankAccountDetails, INITIAL_PAYOUTS, OrderDetail, PayoutRecord } from "./components/data";
import StatsCards from "../components/StatsCards";
import PayoutTable from "../components/PayoutTable";
import PayoutDetailsDrawer from "../components/PayoutDetailsDrawer";
import BankSettingsModal from "../components/BankSettingsModal";
import RequestSettlementModal from "../components/RequestSettlementModal";
import QuickSimulator from "../components/QuickSimulator";


interface ToastMessage {
    id: string;
    type: 'sale' | 'success' | 'info';
    title: string;
    body: string;
}


export default function EarningsPage() {

    const [payouts, setPayouts] = useState<PayoutRecord[]>(INITIAL_PAYOUTS);

    // Starting master financial values matching screenshot perfectly
    const [totalEarned, setTotalEarned] = useState<number>(4200000); // ₦4.2M
    const [pendingPayout, setPendingPayout] = useState<number>(340000); // ₦340K
    const [lastPayout, setLastPayout] = useState<number>(180000); // ₦180K

    const [showExactValues, setShowExactValues] = useState<boolean>(false);

    // Bank Information State
    const [bankInfo, setBankInfo] = useState<BankAccountDetails>({
        bankName: 'Guaranty Trust Bank (GTB)',
        accountNumber: '012****345',
        accountName: 'Randal Wilson'
    });

    // Modal / Drawer control states
    const [selectedPayout, setSelectedPayout] = useState<PayoutRecord | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);
    const [isBankSettingsOpen, setIsBankSettingsOpen] = useState<boolean>(false);
    const [isRequestSettlementOpen, setIsRequestSettlementOpen] = useState<boolean>(false);

    // Custom live Toast State
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    // Show a sleek notification
    const triggerToast = (title: string, body: string, type: 'sale' | 'success' | 'info' = 'success') => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, title, body, type }]);

        // Auto clear after 4 seconds
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 4500);
    };

    // Click handler for table rows
    const handleRowClick = (record: PayoutRecord) => {
        // Populate drawer with the clicked record and show it
        setSelectedPayout({
            ...record,
            bankAccount: record.id === 'PO-004' ? bankInfo : record.bankAccount // use dynamic bank account state for pending, if applicable
        });
        setIsDetailsOpen(true);
    };

    // Callback to view details directly from Stats Cards
    const handleViewPendingDetail = () => {
        const pendingRecord = payouts.find(p => p.status === 'Awaiting Verification' || p.date === 'Pending');
        if (pendingRecord) {
            handleRowClick(pendingRecord);
        } else {
            triggerToast('No Pending Payout', 'You have no outstanding pending balances at this time.', 'info');
        }
    };

    const handleViewLastDetail = () => {
        const lastPaidRecord = payouts.find(p => p.status === 'Paid');
        if (lastPaidRecord) {
            handleRowClick(lastPaidRecord);
        } else {
            triggerToast('No Historic Record', 'No historic processed payouts were located in the ledger archives.', 'info');
        }
    };

    // Callback to save Bank selection changes
    const handleSaveBankInfo = (updated: BankAccountDetails) => {
        // Mask account number for visual display
        const maskedNum = `${updated.accountNumber.slice(0, 3)}****${updated.accountNumber.slice(7)}`;
        const savedDetails = {
            ...updated,
            accountNumber: maskedNum
        };

        setBankInfo(savedDetails);

        // Also propagate to history listings if necessary
        triggerToast(
            'Bank Settings Deployed',
            `Payout clearance successfully connected to ${updated.bankName} (${maskedNum}).`,
            'success'
        );
    };

    // Callback to finalize simulated settlement requests
    const handleInitiateSettlement = (amount: number) => {
        setPendingPayout(0);

        // Transition the previous "Pending" payout record to a processed "Awaiting Verification" record with current bank info
        setPayouts((prev) =>
            prev.map((rec) => {
                if (rec.date === 'Pending') {
                    return {
                        ...rec,
                        status: 'Awaiting Verification',
                        bankAccount: bankInfo
                    };
                }
                return rec;
            })
        );

        triggerToast(
            'Sweep Dispatched',
            `Manual balance settlement of ₦${amount.toLocaleString('en-NG')} released to bank router.`,
            'success'
        );
    };

    // Interactive Live Simulator: Simulate high value e-commerce purchase order
    const handleSimulateSale = (customer: string, amount: number) => {
        const orderId = `ORD-${Math.floor(Math.random() * 8000 + 1000)}`;
        const netGains = Math.round(amount * 0.9); // 10% platform split fee
        const platformFee = Math.round(amount * 0.1);
        const currentDateString = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

        // 1. Update overall financial state variables
        setTotalEarned((prev) => prev + amount);
        setPendingPayout((prev) => prev + netGains);

        // 2. Add or update the "Pending" payout history list row
        setPayouts((prev) => {
            const pendingIndex = prev.findIndex(p => p.date === 'Pending');

            const newOrder: OrderDetail = {
                id: orderId,
                customerName: customer,
                amount: amount,
                date: currentDateString,
                itemsCount: Math.floor(Math.random() * 3) + 1
            };

            if (pendingIndex !== -1) {
                // Expand the existing pending row
                const updated = [...prev];
                const existing = updated[pendingIndex];
                updated[pendingIndex] = {
                    ...existing,
                    ordersCount: existing.ordersCount + 1,
                    gross: existing.gross + amount,
                    platformFee: existing.platformFee + platformFee,
                    netPayout: existing.netPayout + netGains,
                    orders: [newOrder, ...existing.orders]
                };
                return updated;
            } else {
                // Compose a brand new pending row representation at the top of the history list
                const newPendingRow: PayoutRecord = {
                    id: `PO-00${prev.length + 1}`,
                    date: 'Pending',
                    ordersCount: 1,
                    gross: amount,
                    platformFee: platformFee,
                    netPayout: netGains,
                    status: 'Awaiting Verification',
                    bankAccount: bankInfo,
                    orders: [newOrder]
                };
                return [newPendingRow, ...prev];
            }
        });

        // 3. Trigger notification feedback
        triggerToast(
            'Online Sale Secured',
            `Received ₦${amount.toLocaleString()} from ${customer}. Net allocation of ₦${netGains.toLocaleString()} added to Pending.`,
            'sale'
        );
    };

    // Interactive Live Simulator: Fast-Track reconciliation and clear pending to paid
    const handleClearPending = () => {
        const pendingItem = payouts.find(p => p.status === 'Awaiting Verification' || p.date === 'Pending');
        if (!pendingItem) {
            triggerToast('No Settlements to Clear', 'There are no active "Awaiting Verification" payouts inside the cleared channels.', 'info');
            return;
        }

        const sweptNet = pendingItem.netPayout;

        // Transition state
        setLastPayout(sweptNet);
        setPendingPayout(0);

        setPayouts((prev) =>
            prev.map((rec) => {
                if (rec.status === 'Awaiting Verification' || rec.date === 'Pending') {
                    return {
                        ...rec,
                        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                        status: 'Paid',
                        bankAccount: bankInfo
                    };
                }
                return rec;
            })
        );

        triggerToast(
            'Clearing Confirmed',
            `Audit approved! ₦${sweptNet.toLocaleString('en-NG')} safely deposited to ${bankInfo.bankName}.`,
            'success'
        );
    };

    return (
        <div className="flex flex-1 flex-col">
            <Breadcrumb className="p-4 lg:px-6">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/supplier">Dashboard</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Supplier Inventory</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-4 pb-4 md:gap-6 md:pb-6">
                    <div className="px-4 lg:px-6">
                        <div className="flex flex-1 flex-col">
                            {/* Inventory management UI goes here */}
                            <div className="@container/main flex flex-1 flex-col gap-2">
                                <div className="flex flex-col gap-4 pb-4 md:gap-6 md:py-6">

                                    <div className="bg-[#f8fafc] text-slate-900 font-sans min-h-screen pb-20 relative overflow-hidden" id="applet-viewport">

                                        {/* Visual background decoration accents */}
                                        <div className="absolute top-0 left-0 right-0 h-64 bg-slate-900 pointer-events-none z-0" />
                                        <div className="absolute top-48 left-0 right-0 h-40 bg-gradient-to-b from-slate-900 to-[#f8fafc] pointer-events-none z-0" />

                                        {/* Primary Container */}
                                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 relative z-10">

                                            {/* Navigation / Header Actions Row */}
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4" id="main-navigation-dashboard">

                                                {/* Leftside: Breadcrumb & Title */}
                                                <div className="space-y-1">
                                                    <button className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors uppercase tracking-wider group bg-transparent border-none outline-none cursor-pointer">
                                                        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                                                        <span>Commercial Hub</span>
                                                    </button>
                                                    <h1 className="text-3xl font-extrabold text-white tracking-tight font-sans">
                                                        Earnings & Payouts
                                                    </h1>
                                                </div>

                                                {/* Rightside Action Triggers */}
                                                <div className="flex flex-wrap items-center gap-3">
                                                    {/* Action 1: Settings modal launcher */}
                                                    <button
                                                        onClick={() => setIsBankSettingsOpen(true)}
                                                        className="flex items-center gap-2 bg-slate-800 hover:bg-slate-755 border border-slate-700 hover:border-slate-600 text-slate-200 hover:text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm focus:outline-none cursor-pointer"
                                                        id="btn-trigger-bank-settings"
                                                    >
                                                        <Landmark className="w-4 h-4 text-slate-400" />
                                                        <span>Settlement Destination</span>
                                                    </button>

                                                    {/* Action 2: Sweeper settlement launcher */}
                                                    <button
                                                        onClick={() => setIsRequestSettlementOpen(true)}
                                                        disabled={pendingPayout <= 0}
                                                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 hover:bg-indigo-700 disabled:opacity-40 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md hover:shadow-lg hover:shadow-indigo-950/20 focus:outline-none cursor-pointer"
                                                        id="btn-trigger-instant-sweep"
                                                    >
                                                        <Coins className="w-4 h-4" />
                                                        <span>Request Settlement</span>
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Dashboard Financial Summary Metrics Block */}
                                            <StatsCards
                                                totalEarned={totalEarned}
                                                pendingPayout={pendingPayout}
                                                lastPayout={lastPayout}
                                                showExactValues={showExactValues}
                                                setShowExactValues={setShowExactValues}
                                                onViewPendingDetail={handleViewPendingDetail}
                                                onViewLastDetail={handleViewLastDetail}
                                            />

                                            {/* Dynamic payouts Table & search layout */}
                                            <div className="mt-6">
                                                <PayoutTable
                                                    payouts={payouts}
                                                    onRowClick={handleRowClick}
                                                />
                                            </div>

                                            {/* Warning block */}
                                            <div className="mt-6 bg-slate-100/50 border border-slate-200/50 rounded-2xl p-4 flex items-start gap-3 text-xs text-slate-500" id="compliance-regulatory-notice">
                                                <Info className="w-4.5 h-4.5 text-slate-400 shrink-0 mt-0.5" />
                                                <div className="space-y-1">
                                                    <span className="font-bold text-slate-700">Audit Compliance Regulation Standard</span>
                                                    <p>
                                                        Clearing house records are monitored by local banking clearing agents. Manual requests can reside in Awaiting Verification under standard security clearance guidelines up to 24 hours. Use the <strong>Interactive Controls panel (bottom-left)</strong> to fast-track verification.
                                                    </p>
                                                </div>
                                            </div>

                                        </div>

                                        {/* Sliding Payout receipt Details Drawer Drawer */}
                                        <PayoutDetailsDrawer
                                            isOpen={isDetailsOpen}
                                            onClose={() => setIsDetailsOpen(false)}
                                            record={selectedPayout}
                                        />

                                        {/* Bank Account settings reconfiguration dialog */}
                                        <BankSettingsModal
                                            isOpen={isBankSettingsOpen}
                                            onClose={() => setIsBankSettingsOpen(false)}
                                            currentBank={bankInfo}
                                            onSave={handleSaveBankInfo}
                                        />

                                        {/* Instant balance settlement request dialog */}
                                        <RequestSettlementModal
                                            isOpen={isRequestSettlementOpen}
                                            onClose={() => setIsRequestSettlementOpen(false)}
                                            pendingAmount={pendingPayout}
                                            bankInfo={bankInfo}
                                            onInitiateSettlement={handleInitiateSettlement}
                                        />

                                        {/* Floating Mock Simulator Controller */}
                                        <QuickSimulator
                                            onSimulateSale={handleSimulateSale}
                                            onClearPending={handleClearPending}
                                            hasPendingPayouts={payouts.some(p => p.status === 'Awaiting Verification' || p.date === 'Pending')}
                                            bankAccountName={bankInfo.accountName}
                                        />

                                        {/* Animated Floating Toasts Notifications Hub */}
                                        <div className="fixed top-6 right-6 z-55 w-80 space-y-3 pointer-events-none" id="toasts-notifications-hub">
                                            <AnimatePresence>
                                                {toasts.map((toast) => (
                                                    <motion.div
                                                        key={toast.id}
                                                        initial={{ x: 120, opacity: 0, scale: 0.9 }}
                                                        animate={{ x: 0, opacity: 1, scale: 1 }}
                                                        exit={{ x: 80, opacity: 0, scale: 0.95 }}
                                                        transition={{ type: 'spring', damping: 15, stiffness: 200 }}
                                                        className="bg-slate-900 border border-slate-800 text-white p-4 rounded-2xl shadow-2xl flex items-start gap-3 pointer-events-auto"
                                                        id={`toast-${toast.id}`}
                                                    >
                                                        <div className="shrink-0 mt-0.5">
                                                            {toast.type === 'sale' ? (
                                                                <div className="p-1.5 bg-amber-500/10 text-amber-400 rounded-lg">
                                                                    <Sparkles className="w-4.5 h-4.5" />
                                                                </div>
                                                            ) : toast.type === 'info' ? (
                                                                <div className="p-1.5 bg-slate-800 text-slate-400 rounded-lg">
                                                                    <Info className="w-4.5 h-4.5" />
                                                                </div>
                                                            ) : (
                                                                <div className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg">
                                                                    <CheckCircle2 className="w-4.5 h-4.5" />
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="flex-1 space-y-1 text-xs">
                                                            <span className="font-bold text-slate-100 block">{toast.title}</span>
                                                            <p className="text-slate-400 font-medium leading-relaxed">{toast.body}</p>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </AnimatePresence>
                                        </div>

                                    </div>



                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>



    )
}