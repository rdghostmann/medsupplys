'use client';

import React, { useMemo, useState } from 'react';
import {
  Sparkles,
  TrendingUp,
  Package,
  Clock,
  Truck,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  ShieldCheck,
  Building2,
  DollarSign,
  ChevronRight,
  ThermometerSnowflake,
  Plus,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type {
  CurrentSupplierUser,
} from "@/controllers/supplier.action";

/* =========================================================
   TYPES
========================================================= */

type SupplierType = 'IMPORTER' | 'DISTRIBUTOR' | 'RETAILER';

type OrderStatus =
  | 'PROCESSING'
  | 'READY_FOR_DISPATCH'
  | 'SUPPLIER_CONFIRMED'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'REFUNDED';

type ProcurementStatus =
  | 'SUPPLIER_CONTACTED'
  | 'NEXT_SUPPLIER_PENDING'
  | 'ACCEPTED'
  | 'REJECTED';


type InventoryItem = {
  id: string;
  supplierId: string;
  productId: string;
  productName: string;
  batchNumber: string;
  stock: number;
  basePrice: number;
  expiryDate: string;
};

type Procurement = {
  id: string;
  procurementNumber: string;
  currentSupplierId: string;
  productName: string;
  buyerName: string;
  quantity: number;
  unit: string;
  deliveryAddress: string;
  totalAmount: number;
  paymentMethod: string;
  status: ProcurementStatus;
};

type OrderItem = {
  id: string;
  name: string;
  quantity: number;
  unit: string;
};

type Order = {
  id: string;
  orderNumber: string;
  supplierId: string;
  buyerName: string;
  status: OrderStatus;
  items: OrderItem[];
  batchNumber: string;
  expiryDate: string;
  deliveryAddress: string;
  subtotal: number;
  total: number;
  commission: number;
};

type SupplierMetrics = {
  totalGrossRevenue: number;
  totalPlatformCommission: number;
  availableForPayout: number;
  inEscrow: number;
  fulfillmentRate: number;
};


/* =========================================================
   MOCK INVENTORY
========================================================= */

const MOCK_INVENTORY: InventoryItem[] = [
  {
    id: 'inv-001',
    supplierId: 'usr-supplier-1',
    productId: 'prod-001',
    productName: 'Paracetamol 500mg Tablets',
    batchNumber: 'MB-PAR-2408',
    stock: 1250,
    basePrice: 1000,
    expiryDate: '2027-08-31',
  },
  {
    id: 'inv-002',
    supplierId: 'usr-supplier-1',
    productId: 'prod-002',
    productName: 'Amoxicillin 500mg Capsules',
    batchNumber: 'MB-AMX-2407',
    stock: 620,
    basePrice: 2150,
    expiryDate: '2027-07-30',
  },
  {
    id: 'inv-003',
    supplierId: 'usr-supplier-1',
    productId: 'prod-003',
    productName: 'Artemether/Lumefantrine 20/120mg',
    batchNumber: 'MB-AL-2406',
    stock: 78,
    basePrice: 3100,
    expiryDate: '2027-06-30',
  },
  {
    id: 'inv-004',
    supplierId: 'usr-supplier-1',
    productId: 'prod-004',
    productName: 'Vitamin C 1000mg Tablets',
    batchNumber: 'MB-VIT-2409',
    stock: 45,
    basePrice: 850,
    expiryDate: '2028-01-31',
  },
  {
    id: 'inv-005',
    supplierId: 'usr-supplier-1',
    productId: 'prod-005',
    productName: 'Metformin 500mg Tablets',
    batchNumber: 'MB-MET-2405',
    stock: 310,
    basePrice: 1800,
    expiryDate: '2027-05-31',
  },
  {
    id: 'inv-006',
    supplierId: 'usr-supplier-1',
    productId: 'prod-006',
    productName: 'Omeprazole 20mg Capsules',
    batchNumber: 'MB-OME-2404',
    stock: 92,
    basePrice: 1450,
    expiryDate: '2027-04-30',
  },
  {
    id: 'inv-007',
    supplierId: 'usr-supplier-1',
    productId: 'prod-007',
    productName: 'ORS Sachets',
    batchNumber: 'MB-ORS-2409',
    stock: 850,
    basePrice: 420,
    expiryDate: '2028-02-28',
  },
];

/* =========================================================
   MOCK PROCUREMENT REQUESTS
========================================================= */

const MOCK_PROCUREMENTS: Procurement[] = [
  {
    id: 'proc-001',
    procurementNumber: 'RFQ-2025-00182',
    currentSupplierId: 'usr-supplier-1',
    productName: 'Paracetamol 500mg Tablets',
    buyerName: 'Lagos University Teaching Hospital',
    quantity: 500,
    unit: 'packs',
    deliveryAddress: 'LUTH Procurement Warehouse, Idi-Araba, Lagos',
    totalAmount: 500000,
    paymentMethod: 'WALLET_ESCROW',
    status: 'SUPPLIER_CONTACTED',
  },
  {
    id: 'proc-002',
    procurementNumber: 'RFQ-2025-00179',
    currentSupplierId: 'usr-supplier-1',
    productName: 'Amoxicillin 500mg Capsules',
    buyerName: 'University of Nigeria Teaching Hospital',
    quantity: 250,
    unit: 'packs',
    deliveryAddress: 'UNTH Central Pharmacy, Ituku-Ozalla, Enugu',
    totalAmount: 537500,
    paymentMethod: 'CREDIT_ESCROW',
    status: 'SUPPLIER_CONTACTED',
  },
  {
    id: 'proc-003',
    procurementNumber: 'RFQ-2025-00174',
    currentSupplierId: 'usr-supplier-1',
    productName: 'Artemether/Lumefantrine 20/120mg',
    buyerName: 'Rivers State University Teaching Hospital',
    quantity: 100,
    unit: 'packs',
    deliveryAddress: 'RSUTH Pharmacy Department, Port Harcourt',
    totalAmount: 310000,
    paymentMethod: 'WALLET_ESCROW',
    status: 'NEXT_SUPPLIER_PENDING',
  },
  {
    id: 'proc-004',
    procurementNumber: 'RFQ-2025-00162',
    currentSupplierId: 'usr-supplier-2',
    productName: 'Vitamin C 1000mg Tablets',
    buyerName: 'National Hospital Abuja',
    quantity: 200,
    unit: 'packs',
    deliveryAddress: 'National Hospital Pharmacy, Abuja',
    totalAmount: 170000,
    paymentMethod: 'WALLET_ESCROW',
    status: 'SUPPLIER_CONTACTED',
  },
];

/* =========================================================
   MOCK ORDERS
========================================================= */

const MOCK_ORDERS: Order[] = [
  {
    id: 'ord-001',
    orderNumber: 'MS-ORD-8820',
    supplierId: 'usr-supplier-1',
    buyerName: 'Lagos University Teaching Hospital',
    status: 'READY_FOR_DISPATCH',
    items: [
      {
        id: 'item-001',
        name: 'Paracetamol 500mg Tablets',
        quantity: 400,
        unit: 'packs',
      },
    ],
    batchNumber: 'MB-PAR-2408',
    expiryDate: '2027-08-31',
    deliveryAddress:
      'LUTH Procurement Warehouse, Idi-Araba, Lagos',
    subtotal: 380000,
    total: 400000,
    commission: 20000,
  },
  {
    id: 'ord-002',
    orderNumber: 'MS-ORD-8814',
    supplierId: 'usr-supplier-1',
    buyerName: 'University College Hospital Ibadan',
    status: 'SUPPLIER_CONFIRMED',
    items: [
      {
        id: 'item-002',
        name: 'Amoxicillin 500mg Capsules',
        quantity: 180,
        unit: 'packs',
      },
    ],
    batchNumber: 'MB-AMX-2407',
    expiryDate: '2027-07-30',
    deliveryAddress:
      'UCH Central Pharmacy, Queen Elizabeth Road, Ibadan',
    subtotal: 387000,
    total: 430000,
    commission: 43000,
  },
  {
    id: 'ord-003',
    orderNumber: 'MS-ORD-8792',
    supplierId: 'usr-supplier-1',
    buyerName: 'Rivers State University Teaching Hospital',
    status: 'IN_TRANSIT',
    items: [
      {
        id: 'item-003',
        name: 'Metformin 500mg Tablets',
        quantity: 150,
        unit: 'packs',
      },
    ],
    batchNumber: 'MB-MET-2405',
    expiryDate: '2027-05-31',
    deliveryAddress:
      'RSUTH Pharmacy Department, Port Harcourt',
    subtotal: 270000,
    total: 300000,
    commission: 30000,
  },
  {
    id: 'ord-004',
    orderNumber: 'MS-ORD-8775',
    supplierId: 'usr-supplier-1',
    buyerName: 'National Hospital Abuja',
    status: 'DELIVERED',
    items: [
      {
        id: 'item-004',
        name: 'Omeprazole 20mg Capsules',
        quantity: 100,
        unit: 'packs',
      },
    ],
    batchNumber: 'MB-OME-2404',
    expiryDate: '2027-04-30',
    deliveryAddress:
      'National Hospital Pharmacy, Central Area, Abuja',
    subtotal: 145000,
    total: 160000,
    commission: 15000,
  },
  {
    id: 'ord-005',
    orderNumber: 'MS-ORD-8741',
    supplierId: 'usr-supplier-1',
    buyerName: 'Federal Medical Centre Owerri',
    status: 'COMPLETED',
    items: [
      {
        id: 'item-005',
        name: 'ORS Sachets',
        quantity: 300,
        unit: 'packs',
      },
    ],
    batchNumber: 'MB-ORS-2409',
    expiryDate: '2028-02-28',
    deliveryAddress:
      'FMC Owerri Central Pharmacy, Owerri',
    subtotal: 126000,
    total: 140000,
    commission: 14000,
  },
];

/* =========================================================
   MOCK METRICS
========================================================= */

const MOCK_METRICS: SupplierMetrics = {
  totalGrossRevenue: 1430000,
  totalPlatformCommission: 122000,
  availableForPayout: 691000,
  inEscrow: 1037000,
  fulfillmentRate: 99.2,
};

/* =========================================================
   SUPPLIER DASHBOARD
========================================================= */

interface SupplierDashboardPageProps {
  user: CurrentSupplierUser | null;
}

const SupplierDashboardPage: React.FC<
  SupplierDashboardPageProps
> = ({ user }) => {

  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [procurements, setProcurements] =
    useState<Procurement[]>(MOCK_PROCUREMENTS);
  const [inventory] = useState<InventoryItem[]>(MOCK_INVENTORY);
  const [metrics] = useState<SupplierMetrics>(MOCK_METRICS);

  const [responseNotes, setResponseNotes] =
    useState<Record<string, string>>({});

  const [isProcessingRFQ, setIsProcessingRFQ] =
    useState<string | null>(null);

  const [isSyncing, setIsSyncing] = useState(false);

  // Dispatch Modal State
  const [dispatchOrder, setDispatchOrder] =
    useState<Order | null>(null);

  const [courierName, setCourierName] = useState(
    'MediSupply Cold Logistics'
  );

  const [trackingNumber, setTrackingNumber] = useState('');

  const [coldChainTemp, setColdChainTemp] = useState(
    '4.2°C (Calibrated Log)'
  );

  const [isSubmittingDispatch, setIsSubmittingDispatch] =
    useState(false);

  const router = useRouter();


  // Demo navigation state
  const [activeTab, setActiveTab] = useState('dashboard');

  const [selectedOrderId, setSelectedOrderId] =
    useState<string | null>(null);

  /* =========================================================
     DERIVED DATA
  ========================================================= */

  const myInventory = useMemo(
    () =>
      inventory.filter(
        (item) => item.supplierId === user?.id
      ),
    [inventory, user?.id]
  );

  const lowStockItems = useMemo(
    () => myInventory.filter((item) => item.stock < 100),
    [myInventory]
  );

  const pendingRequests = useMemo(
    () =>
      procurements.filter(
        (p) =>
          p.currentSupplierId === user?.id &&
          (p.status === 'SUPPLIER_CONTACTED' ||
            p.status === 'NEXT_SUPPLIER_PENDING')
      ),
    [procurements, user?.id]
  );

  const supplierOrders = useMemo(
    () =>
      orders.filter(
        (order) => order.supplierId === user?.id
      ),
    [orders, user?.id]
  );

  const activeCommittedOrders = useMemo(
    () =>
      supplierOrders.filter(
        (order) =>
          ![
            'DELIVERED',
            'COMPLETED',
            'CANCELLED',
            'REFUNDED',
          ].includes(order.status)
      ),
    [supplierOrders]
  );

  const completedOrders = useMemo(
    () =>
      supplierOrders.filter((order) =>
        ['DELIVERED', 'COMPLETED'].includes(order.status)
      ),
    [supplierOrders]
  );

  const availablePayout = metrics.availableForPayout;
  const inEscrow = metrics.inEscrow;

  /* =========================================================
     MOCK SYNC
  ========================================================= */

  const handleSync = () => {
    setIsSyncing(true);

    setTimeout(() => {
      setIsSyncing(false);

      toast.success('Dashboard Synchronized', {
        description:
          'Supplier inventory, RFQs, orders and settlement data have been refreshed.',
      });
    }, 900);
  };

  /* =========================================================
     MOCK RFQ RESPONSE
  ========================================================= */

  const handleRespondRFQ = async (
    procurementId: string,
    response: 'ACCEPT' | 'REJECT' | 'UNAVAILABLE'
  ) => {
    if (!user) {
      toast.error('Supplier Account Not Found');
      return;
    }

    setIsProcessingRFQ(procurementId);

    const request = procurements.find(
      (item) => item.id === procurementId
    );

    if (!request) {
      toast.error('Request Not Found', {
        description:
          'The procurement request could not be located.',
      });

      setIsProcessingRFQ(null);
      return;
    }

    setTimeout(() => {
      if (response === 'ACCEPT') {
        const newOrder: Order = {
          id: `ord-${Date.now()}`,
          orderNumber: `MS-ORD-${Date.now()
            .toString()
            .slice(-4)}`,
          supplierId: user.id,
          buyerName: request.buyerName,
          status: 'SUPPLIER_CONFIRMED',
          items: [
            {
              id: `item-${Date.now()}`,
              name: request.productName,
              quantity: request.quantity,
              unit: request.unit,
            },
          ],
          batchNumber: 'MB-DEMO-2501',
          expiryDate: '2027-12-31',
          deliveryAddress: request.deliveryAddress,
          subtotal: request.totalAmount * 0.9,
          total: request.totalAmount,
          commission: request.totalAmount * 0.1,
        };

        setOrders((prev) => [newOrder, ...prev]);

        setProcurements((prev) =>
          prev.map((item) =>
            item.id === procurementId
              ? {
                ...item,
                status: 'ACCEPTED',
              }
              : item
          )
        );

        toast.success('Procurement Request Accepted', {
          description: `Order #${newOrder.orderNumber} committed. Funds locked in escrow.`,
        });
      } else {
        setProcurements((prev) =>
          prev.map((item) =>
            item.id === procurementId
              ? {
                ...item,
                status: 'REJECTED',
              }
              : item
          )
        );

        toast.info(
          `Procurement Request ${response === 'REJECT'
            ? 'Declined'
            : 'Marked Unavailable'
          }`,
          {
            description:
              'Automated fallback routing has been initiated to the next ranked supplier.',
          }
        );
      }

      setResponseNotes((prev) => {
        const next = { ...prev };
        delete next[procurementId];
        return next;
      });

      setIsProcessingRFQ(null);
    }, 700);

  };

  /* =========================================================
     MOCK DISPATCH
  ========================================================= */

  const handleConfirmDispatch = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!dispatchOrder) return;

    setIsSubmittingDispatch(true);

    const orderBeingDispatched = dispatchOrder;

    setTimeout(() => {
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderBeingDispatched.id
            ? {
              ...order,
              status: 'IN_TRANSIT',
            }
            : order
        )
      );

      setDispatchOrder(null);
      setIsSubmittingDispatch(false);

      toast.success('Shipment Dispatched', {
        description: `Order #${orderBeingDispatched.orderNumber} is now in transit with GPS and cold-chain logging enabled.`,
      });

      setTrackingNumber('');
    }, 900);
  };

  /* =========================================================
     DEMO TAB NAVIGATION
  ========================================================= */

  const navigateTo = (tab: string) => {
    setActiveTab(tab);

    toast.info(
      `${tab.charAt(0).toUpperCase() + tab.slice(1)} Module`,
      {
        description:
          'Navigation action simulated using mock data.',
      }
    );
  };


  if (!user) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <ShieldCheck className="mx-auto mb-4 h-10 w-10 text-slate-300" />

          <h2 className="text-base font-bold text-slate-900">
            Supplier Account Not Found
          </h2>

          <p className="mt-2 text-xs leading-relaxed text-slate-500">
            We could not resolve an authenticated supplier
            account for this dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Header Profile & Status Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-4">
          <div className="flex items-start gap-4">


            <div>
              <div className=" gap-2">
                {/* <div className="flex flex-wrap items-center gap-2"> */}
                <h1 className="font-display text-2xl font-bold text-slate-900 tracking-tight">
                  {user?.organization ||
                    user?.name ||
                    'Authorized Pharmaceutical Supplier'}
                </h1>

                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] md:text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {user?.supplierApprovalStatus ===
                    'APPROVED'
                    ? 'KYC Verified & Licensed'
                    : 'KYC Pending Review'}
                </span>
                <div className="">

                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] md:text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                    Tier: {user?.supplierType} (100% Matching
                    Priority)
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-3">
                <span>
                  PCN Premise:{' '}
                  <strong className="text-slate-700">
                    {user?.pcnPremisesLicense}
                  </strong>
                </span>

                <span>•</span>

                <span>
                  NAFDAC GDP:{' '}
                  <strong className="text-slate-700">
                    {user?.nafdacGdpLicense}
                  </strong>
                </span>

                <span>•</span>

                <span>
                  Settlement Bank:{' '}
                  <strong className="text-slate-700">
                    {user?.settlementBankName} (
                    {user?.settlementAccountNumber})
                  </strong>
                </span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              id="supplier-btn-refresh-dashboard"
              onClick={handleSync}
              className="hidden items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              // className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              title="Refresh Real-Time Data"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''
                  }`}
              />
              Sync
            </button>

            <button
              id="supplier-btn-nav-revenue"
              onClick={() => navigateTo('ledger')}
              className="hidden items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors shadow-sm"
            // className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors shadow-sm"
            >
              <DollarSign className="w-4 h-4 text-emerald-400" />
              Settlement & Payouts
            </button>

            <button
              id="supplier-btn-add-inventory"
              onClick={() => navigateTo('inventory')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Add Stock SKU
            </button>
          </div>
        </div>
      </div>

      {/* 2. Key Operational & Financial Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-emerald-200 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Available For Payout
            </span>

            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 group-hover:scale-105 transition-transform">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3">
            <div className="text-2xl font-bold font-display text-slate-900 tracking-tight">
              ₦{availablePayout.toLocaleString()}
            </div>

            <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Delivered QA-approved orders
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              Direct NIBSS NUBAN
            </span>

            <button
              onClick={() => navigateTo('ledger')}
              className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              Withdraw Funds
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-blue-200 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Funds in MediSupply Escrow
            </span>

            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3">
            <div className="text-2xl font-bold font-display text-slate-900 tracking-tight">
              ₦{inEscrow.toLocaleString()}
            </div>

            <p className="text-xs text-blue-600 font-medium mt-1">
              {activeCommittedOrders.length} active committed
              order(s)
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              Releases on hospital QA
            </span>

            <span className="text-[11px] font-semibold text-blue-600">
              Locked & Insured
            </span>
          </div>
        </div>

        {/* Card 3 */}
        <div
          className={`rounded-2xl border p-5 shadow-sm transition-all group ${pendingRequests.length > 0
            ? 'bg-amber-50/50 border-amber-200'
            : 'bg-white border-slate-200'
            }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Pending RFQs / Quotes
            </span>

            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform ${pendingRequests.length > 0
                ? 'bg-amber-100 text-amber-700'
                : 'bg-slate-100 text-slate-600'
                }`}
            >
              <Sparkles className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3">
            <div className="text-2xl font-bold font-display text-slate-900 tracking-tight">
              {pendingRequests.length}
            </div>

            <p
              className={`text-xs font-medium mt-1 ${pendingRequests.length > 0
                ? 'text-amber-700 font-semibold'
                : 'text-slate-500'
                }`}
            >
              {pendingRequests.length > 0
                ? 'Immediate action required'
                : 'All live RFQs addressed'}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              Ranked by Matching Engine
            </span>

            <button
              onClick={() => navigateTo('requests')}
              className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              Review RFQs
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-slate-300 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Fulfillment & Catalog
            </span>

            <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 group-hover:scale-105 transition-transform">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3">
            <div className="text-2xl font-bold font-display text-slate-900 tracking-tight">
              {metrics.fulfillmentRate}%
            </div>

            <p className="text-xs text-slate-500 mt-1">
              {myInventory.length} listed SKUs (
              {lowStockItems.length} low stock)
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-emerald-600 font-medium">
              Grade A Credited
            </span>

            <button
              onClick={() => navigateTo('inventory')}
              className="text-[11px] font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1"
            >
              Manage Stock
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Real-Time RFQ Alert Banner */}
      {pendingRequests.length > 0 && (
        <div className="bg-linear-to-r from-amber-500 to-amber-600 rounded-2xl p-4 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-amber-100" />
            </div>

            <div>
              <h4 className="font-bold text-sm">
                You have {pendingRequests.length} incoming
                institutional procurement request(s) awaiting
                your commitment!
              </h4>

              <p className="text-xs text-amber-100 mt-0.5">
                Respond promptly to maintain your 99%+
                algorithmic fulfillment priority rank.
              </p>
            </div>
          </div>

          <button
            onClick={() => router.push('/supplier/order-requests')}
            className="px-4 py-2 rounded-xl bg-white text-amber-900 font-bold text-xs hover:bg-amber-50 transition-colors shadow-sm shrink-0"
          >
            Review & Accept Orders
          </button>
        </div>
      )}

      {/* 4. Two-Column Core Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-8">
          {/* Incoming RFQs */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />

                <h3 className="font-bold text-sm text-slate-900">
                  Incoming Procurement RFQs
                </h3>

                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                  {pendingRequests.length} Active
                </span>
              </div>

              {/* <Link
                href="/supplier/order-requests"
                // onClick={() => router.push('/supplier/order-requests')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                View Full Queue
                <ChevronRight className="w-3 h-3" />
              </Link> */}
              <button
                onClick={() => router.push('/supplier/order-requests')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                View Full Queue
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            {pendingRequests.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />

                <p className="text-xs font-semibold text-slate-700">
                  No Pending Requests
                </p>

                <p className="text-[11px] text-slate-400 mt-0.5">
                  You are fully caught up. New procurement
                  matchings will appear here instantly.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {pendingRequests.slice(0, 3).map((req) => (
                  <div
                    key={req.id}
                    className="p-5 hover:bg-slate-50/80 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                            {req.procurementNumber}
                          </span>

                          <span className="text-xs font-semibold text-slate-900">
                            {req.productName}
                          </span>
                        </div>

                        <p className="text-xs text-slate-500 mt-1">
                          Buyer:{' '}
                          <strong className="text-slate-700">
                            {req.buyerName}
                          </strong>{' '}
                          • Qty:{' '}
                          <strong className="text-slate-700">
                            {req.quantity} {req.unit}
                          </strong>
                        </p>

                        <p className="text-xs text-slate-500">
                          Destination:{' '}
                          <span className="text-slate-600">
                            {req.deliveryAddress}
                          </span>
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-base font-bold text-slate-900 font-display">
                          ₦{req.totalAmount.toLocaleString()}
                        </div>

                        <div className="text-[11px] text-emerald-600 font-medium">
                          Escrow Pre-Funded (
                          {req.paymentMethod.replace(/_/g, ' ')})
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <input
                        type="text"
                        placeholder="Optional batch or fulfillment note..."
                        value={responseNotes[req.id] || ''}
                        onChange={(e) =>
                          setResponseNotes((prev) => ({
                            ...prev,
                            [req.id]: e.target.value,
                          }))
                        }
                        className="flex-1 text-xs px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          disabled={isProcessingRFQ === req.id}
                          onClick={() =>
                            handleRespondRFQ(
                              req.id,
                              'REJECT'
                            )
                          }
                          className="px-3 py-1.5 rounded-lg border border-rose-200 text-rose-600 text-xs font-semibold hover:bg-rose-50 transition-colors disabled:opacity-50"
                        >
                          Decline
                        </button>

                        <button
                          disabled={isProcessingRFQ === req.id}
                          onClick={() =>
                            handleRespondRFQ(
                              req.id,
                              'ACCEPT'
                            )
                          }
                          className="px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />

                          {isProcessingRFQ === req.id
                            ? 'Processing...'
                            : 'Accept & Commit'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active Orders */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-blue-600" />

                <h3 className="font-bold text-sm text-slate-900">
                  Committed Orders & Dispatch Pipeline
                </h3>

                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                  {activeCommittedOrders.length} In Progress
                </span>
              </div>

              <button
                onClick={() => navigateTo('orders')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                All Orders
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            {activeCommittedOrders.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                <Package className="w-10 h-10 text-slate-300 mx-auto mb-2" />

                <p className="text-xs font-semibold text-slate-700">
                  No Orders in Active Transit
                </p>

                <p className="text-[11px] text-slate-400 mt-0.5">
                  Committed orders awaiting dispatch or
                  verification will display here.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {activeCommittedOrders.map((order) => {
                  const canDispatch =
                    order.status === 'PROCESSING' ||
                    order.status === 'READY_FOR_DISPATCH' ||
                    order.status === 'SUPPLIER_CONFIRMED';

                  return (
                    <div
                      key={order.id}
                      className="p-5 hover:bg-slate-50/80 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                              {order.orderNumber}
                            </span>

                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                              {order.status.replace(
                                /_/g,
                                ' '
                              )}
                            </span>
                          </div>

                          <h4 className="font-bold text-sm text-slate-900 mt-1">
                            {order.items[0]?.name ||
                              'Pharmaceutical Consignment'}
                          </h4>

                          <p className="text-xs text-slate-500">
                            Hospital:{' '}
                            <strong className="text-slate-700">
                              {order.buyerName}
                            </strong>{' '}
                            • Batch:{' '}
                            <span className="font-mono text-slate-700">
                              {order.batchNumber}
                            </span>
                          </p>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="text-base font-bold text-slate-900 font-display">
                            ₦{order.subtotal.toLocaleString()}{' '}
                            <span className="text-[10px] text-slate-400 font-normal">
                              Net
                            </span>
                          </div>

                          <div className="text-[11px] text-slate-500">
                            Gross: ₦
                            {order.total.toLocaleString()}{' '}
                            (10% Comm: ₦
                            {order.commission.toLocaleString()})
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />

                          <span>
                            Destination:{' '}
                            {order.deliveryAddress.length >
                              45
                              ? `${order.deliveryAddress.slice(
                                0,
                                45
                              )}...`
                              : order.deliveryAddress}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {canDispatch && (
                            <button
                              id={`btn-dispatch-${order.id}`}
                              onClick={() => {
                                setDispatchOrder(order);
                                setTrackingNumber(
                                  `WB-${Date.now()
                                    .toString()
                                    .slice(-6)}`
                                );
                              }}
                              className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-1.5"
                            >
                              <Truck className="w-3.5 h-3.5" />
                              Dispatch Shipment
                            </button>
                          )}

                          <button
                            onClick={() => {
                              setSelectedOrderId(order.id);
                              navigateTo('orders');
                            }}
                            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${selectedOrderId === order.id
                              ? 'border-blue-200 bg-blue-50 text-blue-700'
                              : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                              }`}
                          >
                            Track
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-8">
          {/* Settlement Account */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-5 text-white shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                NIBSS Settlement Account
              </span>

              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Direct Credit Active
              </span>
            </div>

            <div className="mt-4">
              <p className="text-xs text-slate-400">
                Commercial Bank
              </p>

              <h4 className="font-bold text-base text-white">
                {user?.settlementBankName}
              </h4>

              <p className="font-mono text-sm tracking-wider text-slate-200 mt-1">
                {user?.settlementAccountNumber}
              </p>

              <p className="text-xs text-slate-400 mt-0.5">
                {user?.settlementAccountName}
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-700/60 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">
                  Ready to Disburse:
                </span>

                <span className="font-bold text-emerald-400 text-sm">
                  ₦{availablePayout.toLocaleString()}
                </span>
              </div>

              <button
                onClick={() => router.push('/supplier/earnings  ')}
                className="px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-colors"
              >
                Instant Payout
              </button>
            </div>
          </div>

          {/* Low Stock */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />

                <h3 className="font-bold text-sm text-slate-900">
                  Stock Reorder Alerts
                </h3>
              </div>

              <span className="text-xs font-bold text-slate-500">
                {lowStockItems.length} Low Stock
              </span>
            </div>

            {lowStockItems.length === 0 ? (
              <div className="text-center py-6">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />

                <p className="text-xs font-semibold text-slate-700">
                  Healthy Stock Reserves
                </p>

                <p className="text-[11px] text-slate-400">
                  All listed catalog items have &gt;100 units
                  in warehouse.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {lowStockItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl border border-amber-100 bg-amber-50/40 flex items-center justify-between"
                  >
                    <div>
                      <h5 className="font-bold text-xs text-slate-900">
                        {item.productName}
                      </h5>

                      <p className="text-[11px] text-slate-500">
                        Batch:{' '}
                        <span className="font-mono">
                          {item.batchNumber}
                        </span>{' '}
                        • Base:{' '}
                        <strong>
                          ₦{item.basePrice.toLocaleString()}
                        </strong>
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-amber-200 text-amber-900">
                        {item.stock} left
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => router.push('/supplier/inventory')}
              className="w-full mt-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5"
            >
              <Package className="w-3.5 h-3.5" />
              Manage All Inventory ({myInventory.length} SKUs)
            </button>
          </div>

          {/* Compliance */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5">
            <h4 className="font-bold text-xs text-slate-900 flex items-center gap-2">
              <ThermometerSnowflake className="w-4 h-4 text-blue-600" />
              Cold-Chain & GDP Standard
            </h4>

            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              MediSupply escrow payments release automatically
              upon delivery confirmation and licensed pharmacist
              QA stamp. Ensure all temperature-sensitive batches
              include digital data loggers calibrating between{' '}
              <strong>2°C and 8°C</strong>.
            </p>

            <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
              <span>Standard Commission: 10%</span>

              <span className="font-semibold text-slate-700">
                Zero Hidden Deductions
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Dispatch Shipment Modal */}
      {dispatchOrder && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-blue-600" />
                  Dispatch Consignment #
                  {dispatchOrder.orderNumber}
                </h3>

                <p className="text-xs text-slate-500 mt-0.5">
                  Generate courier waybill and log storage
                  conditions for Pharmacist inspection
                </p>
              </div>

              <button
                type="button"
                onClick={() => setDispatchOrder(null)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600"
                aria-label="Close dispatch modal"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={handleConfirmDispatch}
              className="mt-4 space-y-4"
            >
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">
                    Item:
                  </span>

                  <span className="font-semibold text-slate-800 text-right">
                    {dispatchOrder.items[0]?.name}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">
                    Batch & Expiry:
                  </span>

                  <span className="font-mono text-slate-800 text-right">
                    {dispatchOrder.batchNumber} (Exp:{' '}
                    {dispatchOrder.expiryDate})
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">
                    Delivery Address:
                  </span>

                  <span className="text-slate-800 text-right">
                    {dispatchOrder.deliveryAddress}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Dedicated Medical Logistics Courier
                </label>

                <select
                  value={courierName}
                  onChange={(e) =>
                    setCourierName(e.target.value)
                  }
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="MediSupply Cold Logistics">
                    MediSupply Cold-Chain Logistics Fleet
                  </option>

                  <option value="Red Star Express Healthcare Direct">
                    Red Star Express Healthcare Direct
                  </option>

                  <option value="GIG Logistics Pharma Cargo">
                    GIG Logistics Pharma Cargo
                  </option>

                  <option value="DHL Medical Express">
                    DHL Medical Express Cold-Chain
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Waybill / Consignment Tracking Number
                </label>

                <input
                  type="text"
                  required
                  value={trackingNumber}
                  onChange={(e) =>
                    setTrackingNumber(e.target.value)
                  }
                  className="w-full text-xs font-mono px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="e.g. WB-884920"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Cold-Chain Transit Temperature Reading
                </label>

                <input
                  type="text"
                  value={coldChainTemp}
                  onChange={(e) =>
                    setColdChainTemp(e.target.value)
                  }
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="e.g. 4.2°C (Continuous Data Logger Verified)"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setDispatchOrder(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmittingDispatch}
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Truck className="w-4 h-4" />

                  {isSubmittingDispatch
                    ? 'Confirming Dispatch...'
                    : 'Confirm & Handover'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierDashboardPage;