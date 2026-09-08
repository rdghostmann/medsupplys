"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  updateSupplierStatus,
  type AdminSupplier,
  type AdminSupplierStatus,
} from "@/controllers/admin.actions";

interface SupplierListingProps {
  initialSuppliers: AdminSupplier[];
}

export default function SupplierListing({
  initialSuppliers,
}: SupplierListingProps) {
  const [suppliers, setSuppliers] = useState(initialSuppliers);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const handleUpdateSupplierStatus = async (
    supplierId: string,
    status: AdminSupplierStatus
  ) => {
    if (isUpdating) return;

    setIsUpdating(supplierId);

    try {
      const updatedSupplier = await updateSupplierStatus(
        supplierId,
        status
      );

      setSuppliers((current) =>
        current.map((supplier) =>
          supplier.id === updatedSupplier.id
            ? updatedSupplier
            : supplier
        )
      );

      toast.success("Supplier status updated", {
        description: `${updatedSupplier.organization} is now ${status.toLowerCase()}.`,
      });
    } catch (error) {
      console.error("Supplier status update failed:", error);
      toast.error("Supplier status update failed");
    } finally {
      setIsUpdating(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <h2 className="font-display text-sm font-bold text-slate-900 uppercase tracking-wider">
          Supplier Pool & Regulatory Verification ({suppliers.length} Entities)
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10.5px] border-b border-slate-100">
            <tr>
              <th className="py-3.5 px-4 font-semibold">Supplier Name & Organization</th>
              <th className="py-3.5 px-4 font-semibold">Tier Classification</th>
              <th className="py-3.5 px-4 font-semibold">Fulfillment Rating</th>
              <th className="py-3.5 px-4 font-semibold">KYC Verification Status</th>
              <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {suppliers.map((supplier) => (
              <tr key={supplier.id} className="hover:bg-slate-50 transition">
                <td className="py-3.5 px-4">
                  <div className="font-semibold text-slate-900">
                    {supplier.organization || supplier.name}
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    Contact: {supplier.email}
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      supplier.supplierType === "IMPORTER"
                        ? "bg-emerald-100 text-emerald-800"
                        : supplier.supplierType === "DISTRIBUTOR"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {supplier.supplierType}
                  </span>
                </td>
                <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                  Not yet rated
                </td>
                <td className="py-3.5 px-4">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      supplier.supplierApprovalStatus === "APPROVED"
                        ? "bg-emerald-100 text-emerald-800"
                        : supplier.supplierApprovalStatus === "SUSPENDED"
                          ? "bg-red-100 text-red-800"
                          : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {supplier.supplierApprovalStatus}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right space-x-2">
                  {supplier.supplierApprovalStatus === "APPROVED" ? (
                    <button
                      disabled={isUpdating === supplier.id}
                      onClick={() =>
                        handleUpdateSupplierStatus(supplier.id, "SUSPENDED")
                      }
                      className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg text-[11px] font-semibold cursor-pointer disabled:opacity-50"
                    >
                      Suspend
                    </button>
                  ) : (
                    <button
                      disabled={isUpdating === supplier.id}
                      onClick={() =>
                        handleUpdateSupplierStatus(supplier.id, "APPROVED")
                      }
                      className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-[11px] font-semibold cursor-pointer disabled:opacity-50"
                    >
                      Approve KYC
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {suppliers.length === 0 && (
              <tr>
                <td colSpan={5} className="py-12 text-center text-xs text-slate-500">
                  No supplier accounts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
