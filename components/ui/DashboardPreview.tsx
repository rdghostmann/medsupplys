import React, { useState } from 'react';
import { 
  MOCK_PRODUCTS, 
  MOCK_SUPPLIERS, 
  MOCK_ORDERS 
} from '../../data/mockData';
import { OrderStatus } from '../../types';
import { MedSupplyLogo } from './MedSupplyLogo';
import { 
  Search, 
  Building2, 
  Package, 
  ClipboardList, 
  BadgeCheck, 
  Star, 
  Truck, 
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ExternalLink
} from 'lucide-react';
import { useRouter } from '../../context/RouterContext';

export const DashboardPreview: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'catalogue' | 'suppliers' | 'orders'>('catalogue');
  const [searchTerm, setSearchTerm] = useState('');
  const { openQuoteModal, openOrderModal } = useRouter();

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Dispatched':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'Delivered':
      case 'Completed':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Processing':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Verification':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'Supplier Contacted':
        return 'bg-cyan-50 text-cyan-800 border-cyan-200';
      case 'Pending':
        return 'bg-slate-100 text-slate-800 border-slate-200';
      case 'Cancelled':
        return 'bg-red-50 text-red-800 border-red-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const filteredProducts = MOCK_PRODUCTS.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSuppliers = MOCK_SUPPLIERS.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredOrders = MOCK_ORDERS.filter(o =>
    o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.supplierName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xl overflow-hidden">
      {/* Top Header on White with Brand Gradient Accent */}
      <div className="bg-white text-slate-900 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/90">
        <div className="flex items-center gap-3">
          <MedSupplyLogo variant="iconOnly" size="sm" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900">MedSupply Institutional Procurement Console</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300 text-[10px] font-mono font-bold">
                LIVE DEMO
              </span>
            </div>
            <p className="text-xs text-slate-500">Access Tier: Chief Pharmacist / Hospital Sourcing Director</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('catalogue')}
            className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'catalogue' 
                ? 'bg-gradient-to-r from-[#1e40af] to-[#00b87c] text-white shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Package size={14} />
            <span>Formulary Catalogue</span>
          </button>
          <button
            onClick={() => setActiveTab('suppliers')}
            className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'suppliers' 
                ? 'bg-gradient-to-r from-[#1e40af] to-[#00b87c] text-white shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 size={14} />
            <span>Supplier Marketplace</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'orders' 
                ? 'bg-gradient-to-r from-[#1e40af] to-[#00b87c] text-white shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ClipboardList size={14} />
            <span>Active Orders ({MOCK_ORDERS.length})</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-slate-50/70 border-b border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={
              activeTab === 'catalogue' 
                ? 'Search active ingredient, SKU, or category...' 
                : activeTab === 'suppliers' 
                ? 'Search supplier name, type, or city...' 
                : 'Search PO number, buyer hospital, or status...'
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
          />
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-500 w-full sm:w-auto justify-between sm:justify-end">
          <span className="flex items-center gap-1 font-mono text-[11px] text-blue-900 font-semibold bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
            <ShieldCheck size={13} className="text-emerald-600" />
            NAFDAC &amp; GDP Real-Time Verified
          </span>
          <span className="text-slate-300">|</span>
          <span className="font-semibold text-slate-700">Currency: NGN (₦)</span>
        </div>
      </div>

      {/* Content Panels */}
      <div className="overflow-x-auto min-h-[360px]">
        {activeTab === 'catalogue' && (
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-100/80 text-slate-700 uppercase font-semibold text-[11px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Product &amp; Active Ingredient</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Strength &amp; Form</th>
                <th className="py-3 px-4">Pack Size</th>
                <th className="py-3 px-4">Suppliers</th>
                <th className="py-3 px-4">Reference Price</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/70">
              {filteredProducts.slice(0, 5).map((product) => (
                <tr key={product.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{product.name}</div>
                    <div className="text-[11px] text-slate-500">{product.genericName}</div>
                    <div className="text-[10px] font-mono text-blue-700 mt-0.5">{product.nafdacRegNumber}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium text-[10px] border border-slate-200">
                      {product.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-800">
                    {product.dosageForm} ({product.strength})
                  </td>
                  <td className="py-3.5 px-4 text-slate-700">
                    {product.packSize}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 text-[11px]">
                      <Building2 size={11} className="text-blue-700" />
                      {product.suppliersAvailable} Available
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-extrabold text-slate-900">
                    {product.currency}{product.referencePrice.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => openQuoteModal(product)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#1e40af] to-[#00b87c] hover:from-[#1d4ed8] hover:to-[#059669] text-white font-bold text-[11px] transition-all shadow-xs cursor-pointer"
                    >
                      <span>Compare</span>
                      <ArrowUpRight size={12} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === 'suppliers' && (
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-100/80 text-slate-700 uppercase font-semibold text-[11px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Supplier Name</th>
                <th className="py-3 px-4">Tier</th>
                <th className="py-3 px-4">Rating &amp; Reviews</th>
                <th className="py-3 px-4">Min. Order Value</th>
                <th className="py-3 px-4">Fulfillment Rate</th>
                <th className="py-3 px-4">Lead Time</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/70">
              {filteredSuppliers.map((supplier) => (
                <tr key={supplier.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span>{supplier.name}</span>
                      {supplier.verified && (
                        <BadgeCheck size={14} className="text-emerald-600 shrink-0" />
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500">{supplier.location}</div>
                    <div className="text-[10px] font-mono text-slate-400 mt-0.5">{supplier.nafdacLicense}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 font-semibold text-[10px] border border-blue-200">
                      {supplier.type}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    <div className="flex items-center gap-1">
                      <Star size={12} className="fill-amber-400 text-amber-500" />
                      <span>{supplier.rating.toFixed(1)}</span>
                      <span className="text-[10px] text-slate-400 font-normal">({supplier.reviewCount})</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">
                    {supplier.minOrderValue}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/80 text-[11px]">
                      {supplier.fulfillmentRate}%
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 font-medium">
                    {supplier.leadTime}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => openQuoteModal()}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 font-bold text-[11px] transition-colors cursor-pointer"
                    >
                      <span>Request RFQ</span>
                      <ExternalLink size={11} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === 'orders' && (
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-100/80 text-slate-700 uppercase font-semibold text-[11px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Order ID &amp; Date</th>
                <th className="py-3 px-4">Buyer Organization</th>
                <th className="py-3 px-4">Supplier</th>
                <th className="py-3 px-4">Summary</th>
                <th className="py-3 px-4">Total Value</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/70">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-mono font-bold text-slate-900">{order.orderNumber}</div>
                    <div className="text-[10px] text-slate-400">{order.orderDate}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800">{order.buyerName}</div>
                    <div className="text-[10px] text-slate-500">{order.buyerType}</div>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-700">
                    {order.supplierName}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 max-w-[200px] truncate">
                    {order.productsSummary}
                  </td>
                  <td className="py-3.5 px-4 font-extrabold text-slate-900">
                    {order.currency}{order.totalAmount.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] border ${getStatusBadge(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => openOrderModal(order)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 font-bold text-[11px] transition-colors cursor-pointer"
                    >
                      <Truck size={12} className="text-blue-700" />
                      <span>Track PO</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-3 bg-slate-50 text-[11px] text-slate-500 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span className="flex items-center gap-1.5">
          <Clock size={12} className="text-blue-600" />
          Synchronized with hospital procurement formulary. Real-time stock queries updated every 60 seconds.
        </span>
        <button
          onClick={() => openQuoteModal()}
          className="text-blue-700 hover:text-emerald-700 font-bold underline cursor-pointer"
        >
          Open Interactive Price Comparison Matrix &rarr;
        </button>
      </div>
    </div>
  );
};
