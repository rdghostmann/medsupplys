import React from 'react';
import { useRouter } from '../../context/RouterContext';
import { MOCK_ORDERS } from '../../data/mockData';
import { 
  X, 
  Truck, 
  MapPin, 
  ShieldCheck, 
  ThermometerSnowflake, 
  CheckCircle2, 
  Clock, 
  Building2,
  FileText
} from 'lucide-react';

export const OrderTrackingModal: React.FC = () => {
  const { isOrderModalOpen, closeOrderModal, selectedOrder } = useRouter();
  const order = selectedOrder || MOCK_ORDERS[0];

  if (!isOrderModalOpen) return null;

  const milestones = [
    { title: 'Requisition Created & PO Approved', date: 'May 14, 09:15 AM', completed: true },
    { title: 'Supplier Batch Verification & CoA Attached', date: 'May 14, 11:30 AM', completed: true },
    { title: 'Cold-Chain Packaging & Tamper Seal Applied', date: 'May 14, 02:45 PM', completed: true },
    { title: 'Dispatched via GDP Certified Carrier', date: 'May 14, 04:20 PM', completed: true },
    { title: 'In Transit — Live GPS & Temp Monitored', date: 'May 15, 08:00 AM', completed: order.status === 'Dispatched' || order.status === 'Delivered' || order.status === 'Completed' },
    { title: 'Delivered to Hospital Receiving Dock', date: 'Expected: ' + order.expectedDelivery, completed: order.status === 'Delivered' || order.status === 'Completed' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        
        {/* Header */}
        <div className="bg-white text-slate-900 p-5 sm:p-6 flex items-center justify-between border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
              <Truck size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">Live Procurement Tracking</h3>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                  {order.status}
                </span>
              </div>
              <p className="text-xs text-slate-500">Tracking Number: {order.trackingNumber}</p>
            </div>
          </div>
          <button
            onClick={closeOrderModal}
            className="text-slate-400 hover:text-slate-700 p-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Order Snapshot Card */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 uppercase font-semibold text-[10px] block">Purchase Order</span>
              <span className="font-mono font-bold text-slate-900">{order.orderNumber}</span>
            </div>
            <div>
              <span className="text-slate-400 uppercase font-semibold text-[10px] block">Ordering Facility</span>
              <span className="font-semibold text-slate-800 truncate block">{order.buyerName}</span>
            </div>
            <div>
              <span className="text-slate-400 uppercase font-semibold text-[10px] block">Fulfilling Supplier</span>
              <span className="font-semibold text-slate-800 truncate block">{order.supplierName}</span>
            </div>
            <div>
              <span className="text-slate-400 uppercase font-semibold text-[10px] block">Encumbered Total</span>
              <span className="font-extrabold text-blue-900">₦{order.totalAmount.toLocaleString()}</span>
            </div>
          </div>

          {/* Cold Chain Sensor Reading */}
          <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center">
                <ThermometerSnowflake size={18} />
              </div>
              <div>
                <p className="font-bold text-blue-950">Active Cold-Chain Sensor Telemetry</p>
                <p className="text-blue-700 text-[11px]">Sensor #CC-LOG-9821 &bull; Calibrated logger within specification</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                +4.2°C (Optimal 2-8°C)
              </span>
            </div>
          </div>

          {/* Timeline Milestones */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
              Chain of Custody &amp; Fulfillment Milestones
            </p>
            <div className="relative pl-6 space-y-6 border-l-2 border-slate-200 ml-3">
              {milestones.map((ms, idx) => (
                <div key={idx} className="relative">
                  <div className={`absolute -left-[31px] top-0 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center ${
                    ms.completed ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300'
                  }`}>
                    {ms.completed && <CheckCircle2 size={12} />}
                  </div>
                  <div>
                    <h5 className={`text-xs font-bold ${ms.completed ? 'text-slate-900' : 'text-slate-400'}`}>
                      {ms.title}
                    </h5>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {ms.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Destination Address */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5 text-xs text-slate-700">
            <MapPin size={16} className="text-slate-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-900 block">Designated Receiving Dock:</span>
              <span>{order.deliveryAddress}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-200">
            <button
              onClick={() => alert('Certificate of Analysis (CoA) and Purchase Order PDF downloaded.')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-800 hover:text-emerald-700 cursor-pointer"
            >
              <FileText size={14} />
              <span>Download Signed Batch CoA</span>
            </button>
            <button
              onClick={closeOrderModal}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#1e40af] to-[#00b87c] text-white text-xs font-bold cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
