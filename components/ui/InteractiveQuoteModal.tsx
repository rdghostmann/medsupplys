import React, { useState } from 'react';
import { useRouter } from '../../context/RouterContext';
import { MOCK_PRODUCT_SUPPLIERS, MOCK_PRODUCTS } from '../../data/mockData';
import { 
  X, 
  CheckCircle2, 
  Building2, 
  Star, 
  BadgeCheck, 
  Truck, 
  ShieldCheck, 
  Clock, 
  AlertCircle,
  FileCheck
} from 'lucide-react';

export const InteractiveQuoteModal: React.FC = () => {
  const { isQuoteModalOpen, closeQuoteModal, selectedProduct } = useRouter();
  const product = selectedProduct || MOCK_PRODUCTS[0];

  const [quantity, setQuantity] = useState<number>(100);
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>(MOCK_PRODUCT_SUPPLIERS[0].supplierId);
  const [buyerOrg, setBuyerOrg] = useState<string>('Cedarcrest Specialist Hospital');
  const [orderSubmitted, setOrderSubmitted] = useState<boolean>(false);
  const [poNumber, setPoNumber] = useState<string>('');

  if (!isQuoteModalOpen) return null;

  const currentSupplier = MOCK_PRODUCT_SUPPLIERS.find(s => s.supplierId === selectedSupplierId) || MOCK_PRODUCT_SUPPLIERS[0];
  const unitPrice = currentSupplier.unitPrice;
  // Volume discount calculation (e.g. >100 units gets 5% discount)
  const discountRate = quantity >= 100 ? 0.05 : 0;
  const subtotal = quantity * unitPrice;
  const discountAmount = subtotal * discountRate;
  const estimatedTax = (subtotal - discountAmount) * 0.075; // 7.5% VAT
  const totalAmount = subtotal - discountAmount + estimatedTax;

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedPO = `PO-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setPoNumber(generatedPO);
    setOrderSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        
        {/* Header */}
        <div className="bg-white text-slate-900 p-5 sm:p-6 flex items-center justify-between border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
              <Building2 size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">Compare Supplier Quotations</h3>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 font-semibold">
                  Live Quotation Engine
                </span>
              </div>
              <p className="text-xs text-slate-500">Direct hospital-to-wholesaler procurement channel</p>
            </div>
          </div>
          <button
            onClick={closeQuoteModal}
            className="text-slate-400 hover:text-slate-700 p-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {orderSubmitted ? (
          <div className="p-8 sm:p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4 border border-emerald-200">
              <CheckCircle2 size={32} />
            </div>
            <h4 className="text-2xl font-extrabold text-slate-900">
              Procurement Request Successfully Transmitted!
            </h4>
            <p className="text-sm text-slate-600 max-w-lg mx-auto mt-2 leading-relaxed">
              Your Purchase Order has been generated and dispatched to <strong className="text-slate-900">{currentSupplier.supplierName}</strong>. 
              The vendor has been notified for batch reservation and Good Distribution Practice (GDP) inspection.
            </p>

            <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200 max-w-md mx-auto text-left font-mono text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Purchase Order:</span>
                <span className="font-bold text-slate-900">{poNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Buyer Entity:</span>
                <span className="font-semibold text-slate-800">{buyerOrg}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Ordered Quantity:</span>
                <span className="font-semibold text-slate-800">{quantity} Standard Packs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Encumbered Value:</span>
                <span className="font-bold text-blue-900">₦{totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Batch Reservation:</span>
                <span className="text-emerald-700">{currentSupplier.batchNumber} (Exp: {currentSupplier.expiryDate})</span>
              </div>
            </div>

            <div className="mt-8 flex justify-center gap-3">
              <button
                onClick={() => {
                  setOrderSubmitted(false);
                  closeQuoteModal();
                }}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#1e40af] to-[#00b87c] text-white font-bold text-xs cursor-pointer"
              >
                Done &amp; Return to Marketplace
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 sm:p-8 space-y-6">
            {/* Product Summary Header */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {product.category}
                </span>
                <h4 className="text-base font-bold text-slate-900 mt-1">
                  {product.name}
                </h4>
                <p className="text-xs text-slate-500">
                  {product.genericName} &bull; {product.packSize} &bull; <span className="font-mono">{product.nafdacRegNumber}</span>
                </p>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Market Reference</span>
                <span className="text-base font-extrabold text-slate-900">
                  {product.currency}{product.referencePrice.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-500 block">per pack</span>
              </div>
            </div>

            {/* Supplier Comparison Cards */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Select Verified Supplier for this Requisition
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {MOCK_PRODUCT_SUPPLIERS.map((sup) => {
                  const isSelected = sup.supplierId === selectedSupplierId;
                  return (
                    <div
                      key={sup.id}
                      onClick={() => setSelectedSupplierId(sup.supplierId)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-blue-50/60 border-blue-600 ring-2 ring-blue-500/20 shadow-xs'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 mb-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {sup.supplierType}
                        </span>
                        <div className="flex items-center gap-0.5 text-xs font-bold text-amber-700">
                          <Star size={11} className="fill-amber-400 text-amber-400" />
                          <span>{sup.rating}</span>
                        </div>
                      </div>

                      <h5 className="font-bold text-xs text-slate-900 line-clamp-1">
                        {sup.supplierName}
                      </h5>

                      <div className="mt-3 text-lg font-extrabold text-slate-900">
                        {sup.currency}{sup.unitPrice.toLocaleString()}
                        <span className="text-[10px] font-normal text-slate-500"> / pack</span>
                      </div>

                      <div className="mt-2 text-[11px] text-slate-500 space-y-1">
                        <div className="flex justify-between">
                          <span>Available Stock:</span>
                          <span className="font-semibold text-slate-700">{sup.stockQuantity.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Batch / Expiry:</span>
                          <span className="font-mono text-slate-700">{sup.expiryDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Lead Time:</span>
                          <span className="font-semibold text-emerald-700">{sup.leadTimeDays} Day(s)</span>
                        </div>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                        <BadgeCheck size={13} />
                        <span>NAFDAC GDP Audited</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quantity and Order Configuration Form */}
            <form onSubmit={handleOrderSubmit} className="pt-4 border-t border-slate-200 grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
              <div className="md:col-span-4">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Ordering Healthcare Facility
                </label>
                <input
                  type="text"
                  value={buyerOrg}
                  onChange={(e) => setBuyerOrg(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>

              <div className="md:col-span-3">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Packs Quantity (MOQ: {currentSupplier.minimumOrderQuantity})
                </label>
                <input
                  type="number"
                  min={currentSupplier.minimumOrderQuantity}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(currentSupplier.minimumOrderQuantity, Number(e.target.value)))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>

              <div className="md:col-span-5 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                <div className="flex justify-between text-slate-600 mb-1">
                  <span>Subtotal:</span>
                  <span>₦{subtotal.toLocaleString()}</span>
                </div>
                {discountRate > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold mb-1">
                    <span>Institutional Tier Discount (5%):</span>
                    <span>-₦{discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600 mb-2">
                  <span>Standard Healthcare VAT (7.5%):</span>
                  <span>₦{estimatedTax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total Estimated Cost:</span>
                  <span className="text-blue-900">₦{totalAmount.toLocaleString()}</span>
                </div>
              </div>

              <div className="md:col-span-12 flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeQuoteModal}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#1e40af] via-[#0284c7] to-[#00b87c] hover:from-[#1d4ed8] hover:to-[#059669] text-white text-xs font-bold shadow-md shadow-blue-700/20 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <FileCheck size={14} />
                  <span>Transmit Digital Purchase Order</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
