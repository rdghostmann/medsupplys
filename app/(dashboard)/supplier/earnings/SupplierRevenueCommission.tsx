// SupplierRevenueCommission.tsx
'use client';

import React, { useMemo, useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  ShieldCheck,
  Download,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Search,
  Printer,
  X,
  CreditCard,
  RefreshCw,
  Building2,
} from 'lucide-react';
import { toast } from 'sonner';
import type { CurrentSupplierUser } from '@/controllers/supplier.action';

/* =========================================================
   TYPES
========================================================= */

type OrderStatus =
  | 'PENDING'
  | 'PAYMENT_PENDING'
  | 'PAYMENT_CONFIRMED'
  | 'PROCESSING'
  | 'READY_FOR_DISPATCH'
  | 'VERIFICATION'
  | 'DISPATCHED'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'REFUNDED';

type PaymentMethod =
  | 'WALLET'
  | 'CREDIT'
  | 'WALLET_AND_CREDIT';

type PayoutStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'SETTLED'
  | 'FAILED'
  | 'REVERSED';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

interface Order {
  id: string;
  orderNumber: string;
  supplierId: string;
  buyerName: string;
  buyerId: string;
  items: OrderItem[];
  batchNumber: string;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  total: number;
  commission: number;
  subtotal: number;
  createdAt: string;
}

interface SupplierPayout {
  id: string;
  supplierId: string;
  reference: string;
  amount: number;
  transferFee: number;
  netAmount: number;
  status: PayoutStatus;
  bankName: string;
  accountNumber: string;
  accountName: string;
  notes?: string;
  createdAt: string;
}

interface SupplierMetrics {
  totalGrossRevenue: number;
  totalPlatformCommission: number;
  netEarnings: number;
  inEscrow: number;
  totalPaidOut: number;
  availableForPayout: number;
}


/* =========================================================
   HELPERS
========================================================= */

const formatNaira = (amount: number) =>
  `₦${amount.toLocaleString('en-NG', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;

const isCompletedStatus = (status: OrderStatus) =>
  ['DELIVERED', 'COMPLETED'].includes(status);

const isEscrowStatus = (status: OrderStatus) =>
  !['DELIVERED', 'COMPLETED', 'CANCELLED', 'REFUNDED'].includes(status);

/* =========================================================
   COMPONENT
========================================================= */

interface SupplierRevenueCommissionProps {
  user: CurrentSupplierUser | null;
  orders: Order[];
  payouts: SupplierPayout[];
}

export const SupplierRevenueCommission: React.FC<
  SupplierRevenueCommissionProps
> = ({ user, orders: initialOrders, payouts: initialPayouts }) => {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [payouts, setPayouts] = useState<SupplierPayout[]>(initialPayouts);

  const [isLoading, setIsLoading] = useState(false);

  const [statusFilter, setStatusFilter] = useState<
    'ALL' | 'ESCROW' | 'SETTLED' | 'PROCESSING'
  >('ALL');

  const [searchQuery, setSearchQuery] = useState('');

  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState<number>(0);
  const [payoutNotes, setPayoutNotes] = useState('');
  const [isSubmittingPayout, setIsSubmittingPayout] = useState(false);

  const [selectedVoucherOrder, setSelectedVoucherOrder] =
    useState<Order | null>(null);

  const [selectedPayoutSlip, setSelectedPayoutSlip] =
    useState<SupplierPayout | null>(null);

  /* =========================================================
     SUPPLIER ORDERS
  ========================================================= */

  const supplierOrders = useMemo(
    () => orders.filter((order) => order.supplierId === user?.id),
    [orders]
  );

  /* =========================================================
     FINANCIAL CALCULATIONS
  ========================================================= */

  const metrics = useMemo<SupplierMetrics>(() => {
    const totalGrossRevenue = supplierOrders.reduce(
      (sum, order) => sum + order.total,
      0
    );

    const totalPlatformCommission = supplierOrders.reduce(
      (sum, order) => sum + order.commission,
      0
    );

    const netEarnings = supplierOrders.reduce(
      (sum, order) => sum + order.subtotal,
      0
    );

    const inEscrow = supplierOrders
      .filter((order) => isEscrowStatus(order.status))
      .reduce((sum, order) => sum + order.subtotal, 0);

    const totalPaidOut = payouts
      .filter(
        (payout) =>
          payout.status === 'SETTLED' &&
          payout.supplierId === user?.id
      )
      .reduce((sum, payout) => sum + payout.netAmount, 0);

    /*
     * Mock settlement balance.
     *
     * In a production implementation this would come from the
     * backend wallet/escrow ledger rather than being calculated
     * entirely in the client.
     */
    const availableForPayout = Math.max(
      0,
      netEarnings - inEscrow - totalPaidOut
    );

    return {
      totalGrossRevenue,
      totalPlatformCommission,
      netEarnings,
      inEscrow,
      totalPaidOut,
      availableForPayout,
    };
  }, [supplierOrders, payouts]);

  const {
    totalGrossRevenue,
    totalPlatformCommission,
    netEarnings,
    inEscrow,
    totalPaidOut,
    availableForPayout,
  } = metrics;

  /* =========================================================
     FILTERED ORDERS
  ========================================================= */

  const filteredOrders = useMemo(() => {
    return supplierOrders.filter((order) => {
      const isCompleted = ['DELIVERED', 'COMPLETED'].includes(order.status);

      const isProcessing = [
        'PROCESSING',
        'READY_FOR_DISPATCH',
      ].includes(order.status);

      const isTransit = [
        'DISPATCHED',
        'IN_TRANSIT',
        'VERIFICATION',
      ].includes(order.status);

      if (statusFilter === 'SETTLED' && !isCompleted) {
        return false;
      }

      if (statusFilter === 'ESCROW' && isCompleted) {
        return false;
      }

      if (
        statusFilter === 'PROCESSING' &&
        !(isProcessing || isTransit)
      ) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();

        const matchNumber = order.orderNumber
          .toLowerCase()
          .includes(q);

        const matchBuyer = order.buyerName
          .toLowerCase()
          .includes(q);

        const matchItem = order.items.some((item) =>
          item.name.toLowerCase().includes(q)
        );

        const matchBatch = order.batchNumber
          .toLowerCase()
          .includes(q);

        return (
          matchNumber ||
          matchBuyer ||
          matchItem ||
          matchBatch
        );
      }

      return true;
    });
  }, [supplierOrders, statusFilter, searchQuery]);

  /* =========================================================
     MOCK SYNC
  ========================================================= */

  const fetchRevenueData = async () => {
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 700));

    /*
     * Mock refresh.
     *
     * In production this is where the supplier revenue,
     * escrow and payout APIs would be called.
     */
    setOrders([...initialOrders]);
    setPayouts([...initialPayouts]);

    setIsLoading(false);

    toast.success('Revenue ledger synchronized', {
      description: 'Mock supplier revenue data has been refreshed.',
    });
  };

  /* =========================================================
     PAYOUT REQUEST
  ========================================================= */

  const handleRequestPayout = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (payoutAmount <= 0) {
      toast.error('Invalid payout amount', {
        description: 'Enter a valid payout amount.',
      });
      return;
    }

    if (payoutAmount < 1000) {
      toast.error('Minimum payout is ₦1,000', {
        description: 'Enter an amount of at least ₦1,000.',
      });
      return;
    }

    if (payoutAmount > availableForPayout) {
      toast.error('Exceeds available balance', {
        description: `Maximum available for payout is ${formatNaira(
          availableForPayout
        )}.`,
      });
      return;
    }

    setIsSubmittingPayout(true);

    try {
      /*
       * Simulate settlement processing.
       */
      await new Promise((resolve) => setTimeout(resolve, 1200));

      const transferFee = 50;

      const newPayout: SupplierPayout = {
        id: `pay-${Date.now()}`,
        supplierId: user?.id || '',
        reference: `NIBSS-MS-${Date.now()
          .toString()
          .slice(-10)}`,
        amount: payoutAmount,
        transferFee,
        netAmount: Math.max(0, payoutAmount - transferFee),
        status: 'SETTLED',
        bankName: user?.settlementBankName || 'Not configured',
        accountNumber: user?.settlementAccountNumber || 'Not configured',
        accountName: user?.settlementAccountName || 'Not configured',
        notes: payoutNotes,
        createdAt: new Date().toISOString(),
      };

      setPayouts((current) => [newPayout, ...current]);

      setIsPayoutModalOpen(false);
      setPayoutAmount(0);
      setPayoutNotes('');

      toast.success('Settlement payout disbursed', {
        description: `${formatNaira(
          newPayout.netAmount
        )} has been transferred to the registered settlement account.`,
      });
    } catch (error) {
      console.error(error);

      toast.error('Payout failed', {
        description:
          'Unable to process the mock settlement request.',
      });
    } finally {
      setIsSubmittingPayout(false);
    }
  };

  /* =========================================================
     PRINT
  ========================================================= */

  const printDocument = () => {
    toast.info('Preparing document for printing');

    setTimeout(() => {
      window.print();
    }, 150);
  };

  /* =========================================================
     RESET FILTERS
  ========================================================= */

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');

    toast.success('Filters cleared');
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="space-y-8 pb-12">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-display text-2xl font-bold text-slate-900 tracking-tight">
                Supplier Revenue & Platform Commission Ledger
              </h1>

              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Request Direct Credit Enabled
              </span>

              
            </div>

            <p className="text-xs text-slate-500 mt-1">
              Transparent 10% platform commission accounting,
              institutional escrow release, and commercial bank
              settlement.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              id="btn-sync-revenue"
              onClick={fetchRevenueData}
              disabled={isLoading}
              className="hidden items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              // className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-60"
              title="Refresh ledger"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${
                  isLoading ? 'animate-spin' : ''
                }`}
              />

              {isLoading ? 'Syncing...' : 'Sync Ledger'}
            </button>

            <button
              type="button"
              onClick={() => {
                setPayoutAmount(availableForPayout);
                setIsPayoutModalOpen(true);
              }}
              disabled={availableForPayout <= 0}
              className="hidden items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              // className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowUpRight className="w-4 h-4" />
              Request Settlement Payout (
              {formatNaira(availableForPayout)})
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================
          CORE FINANCIAL CARDS
      ===================================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Available */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Available For Settlement
            </span>

            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3">
            <div className="text-2xl font-bold font-display text-slate-900 tracking-tight">
              {formatNaira(availableForPayout)}
            </div>

            <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Unrestricted balance ready for withdrawal
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">
              Available balance
            </span>

            <button
              type="button"
              onClick={() => {
                setPayoutAmount(availableForPayout);
                setIsPayoutModalOpen(true);
              }}
              disabled={availableForPayout <= 0}
              className="font-bold text-emerald-600 hover:text-emerald-700 disabled:opacity-40"
            >
              Transfer Now →
            </button>
          </div>
        </div>

        {/* Escrow */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-blue-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Held in Escrow
            </span>

            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3">
            <div className="text-2xl font-bold font-display text-slate-900 tracking-tight">
              {formatNaira(inEscrow)}
            </div>

            <p className="text-xs text-blue-600 font-medium mt-1 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              Pending delivery & QA inspection
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Pre-funded by hospital</span>
            <span className="font-semibold text-blue-600">
              Auto-Releasing
            </span>
          </div>
        </div>

        {/* Commission */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Platform Commission (10%)
            </span>

            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-700">
              <FileText className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3">
            <div className="text-2xl font-bold font-display text-slate-900 tracking-tight">
              {formatNaira(totalPlatformCommission)}
            </div>

            <p className="text-xs text-slate-500 mt-1">
              Platform facilitation fee collected on buyer
              invoices
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>No hidden gateway fees</span>

            <span className="font-semibold text-amber-700">
              Audit-Verified
            </span>
          </div>
        </div>

        {/* Lifetime payouts */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Lifetime Net Disbursed
            </span>

            <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3">
            <div className="text-2xl font-bold font-display text-slate-900 tracking-tight">
              {formatNaira(totalPaidOut)}
            </div>

            <p className="text-xs text-slate-500 mt-1">
              Net funds credited to corporate bank
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>
              {payouts.filter((p) => p.status === 'SETTLED').length}{' '}
              successful transfers
            </span>

            <span className="text-purple-600 font-semibold">
              NIBSS Verified
            </span>
          </div>
        </div>
      </div>

      {/* =====================================================
          REVENUE SUMMARY
      ===================================================== */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-col-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            Gross Order Value
          </div>

          <p className="text-xl font-bold text-slate-900 mt-2">
            {formatNaira(totalGrossRevenue)}
          </p>

          <p className="text-[11px] text-slate-400 mt-1">
            Total buyer invoice value
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Building2 className="w-4 h-4 text-emerald-600" />
            Supplier Net Earnings
          </div>

          <p className="text-xl font-bold text-slate-900 mt-2">
            {formatNaira(netEarnings)}
          </p>

          <p className="text-[11px] text-slate-400 mt-1">
            Base supplier receivables
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            Commission Rate
          </div>

          <p className="text-xl font-bold text-slate-900 mt-2">
            10%
          </p>

          <p className="text-[11px] text-slate-400 mt-1">
            Applied at buyer invoice level
          </p>
        </div>
      </div>

      {/* =====================================================
          COMMISSION EXPLAINER
      ===================================================== */}

      <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-xl">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30 inline-block mb-2">
              Transparent Pricing & Fee Structure
            </span>

            <h3 className="font-display text-lg font-bold">
              Zero Supplier Deductions: 100% of your Base Listed
              Price is yours.
            </h3>

            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              MediSupply applies a standard 10% platform
              facilitation fee on top of your base price at the
              buyer invoice level. When an order is completed,
              you receive your full quoted unit amount.
            </p>
          </div>

          <div className="bg-slate-800/90 rounded-xl p-4 border border-slate-700 text-xs shrink-0 w-full lg:w-auto">
            <div className="font-mono text-slate-400 text-[11px] mb-2 font-bold uppercase tracking-wider">
              Hospital Invoice Formula:
            </div>

            <div className="flex items-center gap-2 text-sm font-semibold flex-wrap">
              <span className="text-emerald-400">
                Your Base Quote (100%)
              </span>

              <span className="text-slate-500">+</span>

              <span className="text-amber-400">
                Platform Take-Rate (10%)
              </span>

              <span className="text-slate-500">=</span>

              <span className="text-white">
                Hospital Price
              </span>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-700/80 text-[11px] text-slate-400 flex items-center justify-between gap-4">
              <span>Example on ₦10,000 quote:</span>

              <span className="text-slate-200">
                Buyer pays ₦11,000 → You receive{' '}
                <strong>₦10,000</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          ORDERS LEDGER
      ===================================================== */}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col gap-4 bg-slate-50/50">
          <div>
            <h3 className="font-bold text-sm text-slate-900">
              Committed Orders & Escrow Breakdown
            </h3>

            <p className="text-xs text-slate-500 mt-0.5">
              Detailed transaction ledger showing base supplier
              receivables and platform commission
            </p>
          </div>

          <div className="flex items-center justify-between flex-wrap  gap-2">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />

              <input
                type="text"
                placeholder="Search orders, buyer, SKU..."
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery(e.target.value)
                }
                className="w-full text-xs pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
              />
            </div>

            {/* Filters */}
            <div className="flex rounded-xl border border-slate-200 p-0.5 bg-slate-100 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setStatusFilter('ALL')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  statusFilter === 'ALL'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({supplierOrders.length})
              </button>

              <button
                type="button"
                onClick={() => setStatusFilter('ESCROW')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  statusFilter === 'ESCROW'
                    ? 'bg-white text-blue-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                In Escrow
              </button>

              <button
                type="button"
                onClick={() => setStatusFilter('SETTLED')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  statusFilter === 'SETTLED'
                    ? 'bg-white text-emerald-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Settled
              </button>

              <button
                type="button"
                onClick={resetFilters}
                className="px-2 py-1 rounded-lg text-slate-400 hover:text-slate-700"
                title="Reset filters"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />

            <p className="text-xs font-semibold text-slate-700">
              No Orders Matching Filter
            </p>

            <p className="text-[11px] text-slate-400 mt-0.5">
              Try clearing the search or status filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-5">
                    Order # & Date
                  </th>
                  <th className="py-3.5 px-5">
                    Buyer Hospital
                  </th>
                  <th className="py-3.5 px-5">
                    Consignment Item
                  </th>
                  <th className="py-3.5 px-5 text-right">
                    Gross Total (₦)
                  </th>
                  <th className="py-3.5 px-5 text-right">
                    Platform Fee (10%)
                  </th>
                  <th className="py-3.5 px-5 text-right">
                    Net Receivable (₦)
                  </th>
                  <th className="py-3.5 px-5 text-center">
                    Settlement Status
                  </th>
                  <th className="py-3.5 px-5 text-center">
                    Voucher
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((order) => {
                  const isCompleted = isCompletedStatus(
                    order.status
                  );

                  const isDispatched =
                    order.status === 'DISPATCHED' ||
                    order.status === 'IN_TRANSIT';

                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      <td className="py-3.5 px-5 font-mono">
                        <span className="font-bold text-slate-900 block">
                          {order.orderNumber}
                        </span>

                        <span className="text-[11px] text-slate-400">
                          {new Date(
                            order.createdAt
                          ).toLocaleDateString('en-GB')}
                        </span>
                      </td>

                      <td className="py-3.5 px-5">
                        <span className="font-semibold text-slate-800 block">
                          {order.buyerName}
                        </span>

                        <span className="text-[11px] text-slate-400">
                          Method:{' '}
                          {order.paymentMethod.replace(
                            /_/g,
                            ' '
                          )}
                        </span>
                      </td>

                      <td className="py-3.5 px-5">
                        <span className="font-medium text-slate-900 block">
                          {order.items[0]?.name ||
                            'Medical Supplies'}
                        </span>

                        <span className="text-[11px] text-slate-500 font-mono">
                          Batch: {order.batchNumber} • Qty:{' '}
                          {order.items[0]?.quantity}
                        </span>
                      </td>

                      <td className="py-3.5 px-5 text-right font-medium text-slate-900">
                        {formatNaira(order.total)}
                      </td>

                      <td className="py-3.5 px-5 text-right text-amber-700 font-mono">
                        -{formatNaira(order.commission)}
                      </td>

                      <td className="py-3.5 px-5 text-right font-bold text-emerald-600 font-display">
                        {formatNaira(order.subtotal)}
                      </td>

                      <td className="py-3.5 px-5 text-center">
                        {isCompleted ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" />
                            Escrow Released
                          </span>
                        ) : isDispatched ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                            <Clock className="w-3 h-3" />
                            In Escrow (Transit)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                            <ShieldCheck className="w-3 h-3" />
                            In Escrow (Prep)
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-5 text-center">
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedVoucherOrder(order)
                          }
                          className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors text-[11px] font-semibold inline-flex items-center gap-1"
                        >
                          <FileText className="w-3 h-3" />
                          Slip
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* =====================================================
          PAYOUT HISTORY
      ===================================================== */}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="font-bold text-sm text-slate-900">
              Commercial Bank Settlement Transfers
            </h3>

            <p className="text-xs text-slate-500 mt-0.5">
              Mock disbursement batches sent to the supplier
              registered NUBAN account
            </p>
          </div>

          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
            {payouts.length} Disbursements
          </span>
        </div>

        {payouts.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            <CreditCard className="w-10 h-10 text-slate-300 mx-auto mb-2" />

            <p className="text-xs font-semibold text-slate-700">
              No Historical Payouts Yet
            </p>

            <p className="text-[11px] text-slate-400 mt-0.5">
              Settlement disbursement slips will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3 px-5">
                    Transfer Ref & Date
                  </th>
                  <th className="py-3 px-5">
                    Beneficiary Bank & NUBAN
                  </th>
                  <th className="py-3 px-5 text-right">
                    Requested
                  </th>
                  <th className="py-3 px-5 text-right">
                    Transfer Fee
                  </th>
                  <th className="py-3 px-5 text-right">
                    Net Transferred
                  </th>
                  <th className="py-3 px-5 text-center">
                    Disbursement Status
                  </th>
                  <th className="py-3 px-5 text-center">
                    Proof
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {payouts.map((payout) => (
                  <tr
                    key={payout.id}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    <td className="py-3.5 px-5">
                      <span className="font-mono font-bold text-slate-900 block">
                        {payout.reference}
                      </span>

                      <span className="text-[11px] text-slate-400">
                        {new Date(
                          payout.createdAt
                        ).toLocaleString('en-GB')}
                      </span>
                    </td>

                    <td className="py-3.5 px-5">
                      <span className="font-bold text-slate-800 block">
                        {payout.bankName}
                      </span>

                      <span className="font-mono text-[11px] text-slate-500">
                        {payout.accountNumber} •{' '}
                        {payout.accountName}
                      </span>
                    </td>

                    <td className="py-3.5 px-5 text-right font-medium text-slate-700">
                      {formatNaira(payout.amount)}
                    </td>

                    <td className="py-3.5 px-5 text-right text-slate-400 font-mono">
                      {formatNaira(payout.transferFee)}
                    </td>

                    <td className="py-3.5 px-5 text-right font-bold text-emerald-600 font-display">
                      {formatNaira(payout.netAmount)}
                    </td>

                    <td className="py-3.5 px-5 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          payout.status === 'SETTLED'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : payout.status === 'PROCESSING'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}
                      >
                        {payout.status === 'SETTLED' ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : payout.status === 'PROCESSING' ? (
                          <Clock className="w-3 h-3" />
                        ) : (
                          <AlertCircle className="w-3 h-3" />
                        )}

                        {payout.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-5 text-center">
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedPayoutSlip(payout)
                        }
                        className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors text-[11px] font-semibold inline-flex items-center gap-1"
                      >
                        <Printer className="w-3 h-3" />
                        View Voucher
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* =====================================================
          PAYOUT MODAL
      ===================================================== */}

      {isPayoutModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <ArrowUpRight className="w-5 h-5 text-emerald-600" />
                  Instant Settlement Payout
                </h3>

                <p className="text-xs text-slate-500 mt-0.5">
                  Transfer funds to the registered commercial
                  bank account.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsPayoutModalOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600"
                aria-label="Close payout modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={handleRequestPayout}
              className="mt-4 space-y-4"
            >
              {/* Bank summary */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">
                    Destination Bank:
                  </span>

                  <span className="font-bold text-slate-800 text-right">
                    {user?.settlementBankName || 'Not configured'}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">
                    NUBAN Account:
                  </span>

                  <span className="font-mono font-bold text-slate-800">
                    {user?.settlementAccountNumber || 'Not configured'}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">
                    Beneficiary Name:
                  </span>

                  <span className="text-slate-700 text-right">
                    {user?.settlementAccountName || 'Not configured'}
                  </span>
                </div>

                <div className="flex justify-between pt-1 border-t border-slate-200">
                  <span className="text-slate-500">
                    Available Settlement:
                  </span>

                  <span className="font-bold text-emerald-600">
                    {formatNaira(availableForPayout)}
                  </span>
                </div>
              </div>

              {/* Amount */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">
                    Payout Amount (₦ NGN)
                  </label>

                  <button
                    type="button"
                    onClick={() =>
                      setPayoutAmount(availableForPayout)
                    }
                    className="text-[11px] font-bold text-blue-600 hover:text-blue-700"
                  >
                    Max ({formatNaira(availableForPayout)})
                  </button>
                </div>

                <input
                  type="number"
                  min={1000}
                  max={availableForPayout}
                  required
                  value={payoutAmount || ''}
                  onChange={(e) =>
                    setPayoutAmount(
                      Number(e.target.value) || 0
                    )
                  }
                  placeholder="e.g. 500000"
                  className="w-full text-base font-bold font-mono px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* Fee summary */}
              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 text-xs space-y-1">
                <div className="flex justify-between text-slate-600">
                  <span>Gross Payout:</span>

                  <span className="font-mono">
                    {formatNaira(payoutAmount)}
                  </span>
                </div>

                <div className="flex justify-between text-slate-500">
                  <span>Transfer Fee:</span>

                  <span className="font-mono">
                    {formatNaira(50)}
                  </span>
                </div>

                <div className="flex justify-between font-bold text-emerald-800 pt-1 border-t border-emerald-200">
                  <span>Net Credit to Bank:</span>

                  <span className="font-mono text-sm">
                    {formatNaira(
                      Math.max(0, payoutAmount - 50)
                    )}
                  </span>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Internal Finance Reference Note
                </label>

                <input
                  type="text"
                  value={payoutNotes}
                  onChange={(e) =>
                    setPayoutNotes(e.target.value)
                  }
                  placeholder="e.g. Weekly wholesale liquidation"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setIsPayoutModalOpen(false)
                  }
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    isSubmittingPayout ||
                    payoutAmount <= 0 ||
                    payoutAmount > availableForPayout
                  }
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-1.5"
                >
                  <ArrowUpRight className="w-4 h-4" />

                  {isSubmittingPayout
                    ? 'Processing Settlement...'
                    : 'Confirm Transfer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================
          ORDER VOUCHER MODAL
      ===================================================== */}

      {selectedVoucherOrder && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 printable-voucher">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                  <FileText className="w-5 h-5" />
                </div>

                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    Order Settlement Breakdown Slip
                  </h3>

                  <p className="font-mono text-xs text-slate-500">
                    #{selectedVoucherOrder.orderNumber}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedVoucherOrder(null)
                }
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400"
                aria-label="Close voucher"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[11px]">
                    Buyer Hospital:
                  </span>

                  <span className="font-bold text-slate-800">
                    {selectedVoucherOrder.buyerName}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">
                    Order Date:
                  </span>

                  <span className="font-bold text-slate-800">
                    {new Date(
                      selectedVoucherOrder.createdAt
                    ).toLocaleDateString('en-GB')}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">
                    Batch Number:
                  </span>

                  <span className="font-mono font-bold text-slate-800">
                    {selectedVoucherOrder.batchNumber}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">
                    Payment Channel:
                  </span>

                  <span className="font-bold text-slate-800">
                    {selectedVoucherOrder.paymentMethod.replace(
                      /_/g,
                      ' '
                    )}
                  </span>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-600 font-semibold">
                    <tr>
                      <th className="p-2.5">Component</th>
                      <th className="p-2.5 text-right">
                        Rate
                      </th>
                      <th className="p-2.5 text-right">
                        Amount (₦)
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="p-2.5 font-medium text-slate-900">
                        {selectedVoucherOrder.items[0]?.name}

                        <span className="block text-[10px] text-slate-400 font-normal">
                          Base Quote ×{' '}
                          {
                            selectedVoucherOrder.items[0]
                              ?.quantity
                          }{' '}
                          units
                        </span>
                      </td>

                      <td className="p-2.5 text-right text-slate-500 font-mono">
                        100%
                      </td>

                      <td className="p-2.5 text-right font-bold text-emerald-600 font-mono">
                        {formatNaira(
                          selectedVoucherOrder.subtotal
                        )}
                      </td>
                    </tr>

                    <tr>
                      <td className="p-2.5 font-medium text-slate-900">
                        MediSupply Platform Facilitation Fee

                        <span className="block text-[10px] text-slate-400 font-normal">
                          Institutional matching, escrow &
                          QA inspection
                        </span>
                      </td>

                      <td className="p-2.5 text-right text-amber-600 font-mono">
                        10%
                      </td>

                      <td className="p-2.5 text-right font-bold text-amber-700 font-mono">
                        {formatNaira(
                          selectedVoucherOrder.commission
                        )}
                      </td>
                    </tr>

                    <tr className="bg-slate-50 font-bold">
                      <td className="p-2.5 text-slate-900">
                        Total Invoice Paid by Hospital
                      </td>

                      <td className="p-2.5 text-right font-mono">
                        110%
                      </td>

                      <td className="p-2.5 text-right text-slate-900 font-mono">
                        {formatNaira(
                          selectedVoucherOrder.total
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
                <div>
                  <span className="text-emerald-700 block text-[11px]">
                    Net Supplier Payout Receivable:
                  </span>

                  <span className="text-lg font-bold font-display text-emerald-800">
                    {formatNaira(
                      selectedVoucherOrder.subtotal
                    )}
                  </span>
                </div>

                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  {isCompletedStatus(
                    selectedVoucherOrder.status
                  )
                    ? 'Escrow Released'
                    : 'In Escrow'}
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={printDocument}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print Slip
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedVoucherOrder(null)
                  }
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          PAYOUT VOUCHER MODAL
      ===================================================== */}

      {selectedPayoutSlip && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 printable-voucher">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                  <CheckCircle2 className="w-5 h-5" />
                </div>

                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    NIBSS Disbursement Voucher
                  </h3>

                  <p className="font-mono text-xs text-slate-500">
                    {selectedPayoutSlip.reference}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedPayoutSlip(null)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400"
                aria-label="Close payout voucher"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 text-center">
                <span className="text-slate-500 block text-[11px]">
                  Net Amount Transferred
                </span>

                <span className="text-2xl font-bold font-display text-emerald-700">
                  {formatNaira(
                    selectedPayoutSlip.netAmount
                  )}
                </span>

                <span className="block text-[11px] text-emerald-600 font-medium mt-0.5">
                  Direct Credit • Settlement Reference
                  Validated
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">
                    Commercial Bank:
                  </span>

                  <span className="font-bold text-slate-800">
                    {selectedPayoutSlip.bankName}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">
                    NUBAN Account:
                  </span>

                  <span className="font-mono font-bold text-slate-800">
                    {selectedPayoutSlip.accountNumber}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">
                    Account Name:
                  </span>

                  <span className="text-slate-700 text-right">
                    {selectedPayoutSlip.accountName}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">
                    Gross Withdrawal:
                  </span>

                  <span className="font-mono text-slate-700">
                    {formatNaira(
                      selectedPayoutSlip.amount
                    )}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">
                    Transfer Fee:
                  </span>

                  <span className="font-mono text-slate-700">
                    {formatNaira(
                      selectedPayoutSlip.transferFee
                    )}
                  </span>
                </div>

                {selectedPayoutSlip.notes && (
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500">
                      Reference Note:
                    </span>

                    <span className="text-slate-700 text-right">
                      {selectedPayoutSlip.notes}
                    </span>
                  </div>
                )}

                <div className="flex justify-between pt-2 border-t border-slate-200">
                  <span className="text-slate-500">
                    Settled Timestamp:
                  </span>

                  <span className="text-slate-700">
                    {new Date(
                      selectedPayoutSlip.createdAt
                    ).toLocaleString('en-GB')}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={printDocument}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print Voucher
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedPayoutSlip(null)
                  }
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierRevenueCommission;