// InventoryFooter.tsx
import { Info } from 'lucide-react'

const InventoryFooter = () => {
  return (
         <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex items-start gap-4">
           <div className="p-2 bg-blue-100 text-blue-600 rounded-lg mt-0.5 shrink-0">
             <Info className="w-5 h-5" />
           </div>
           <div>
             <h4 className="text-sm font-bold text-slate-900">Supplier Authority & Safety Guidelines</h4>
             <p className="text-xs text-slate-500 mt-1 leading-relaxed">
               As a registered supplier, your pricing inputs directly affect final hospital and pharmacy disbursements. Only <strong>Base price</strong> and <b>Stock Quantities</b> can be modified. Minimun Order Quantity (MOQ) limits and Platform Commission margins (set at 10%) are regulated by the administrative platform to ensure unified health access parameters.
             </p>
           </div>
         </div>
  )
}

export default InventoryFooter
