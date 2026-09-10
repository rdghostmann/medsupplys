"use client"

import { useState } from "react"
import { toast } from "sonner"
import {
  updateSupplierStatus,
  type AdminSupplier,
  type AdminSupplierStatus,
} from "@/controllers/admin.actions"

interface SupplierListingProps {
  initialSuppliers: AdminSupplier[]
}

export default function SupplierListing({
  initialSuppliers,
}: SupplierListingProps) {
  const [suppliers, setSuppliers] = useState(initialSuppliers)
  const [isUpdating, setIsUpdating] = useState<string | null>(null)

  const handleUpdateSupplierStatus = async (
    supplierId: string,
    status: AdminSupplierStatus
  ) => {
    if (isUpdating) return

    setIsUpdating(supplierId)

    try {
      const updatedSupplier = await updateSupplierStatus(supplierId, status)

      setSuppliers((current) =>
        current.map((supplier) =>
          supplier.id === updatedSupplier.id ? updatedSupplier : supplier
        )
      )

      toast.success("Supplier status updated", {
        description: `${updatedSupplier.organization} is now ${status.toLowerCase()}.`,
      })
    } catch (error) {
      console.error("Supplier status update failed:", error)
      toast.error("Supplier status update failed")
    } finally {
      setIsUpdating(null)
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-100 p-5">
        <h2 className="font-display text-sm font-bold tracking-wider text-slate-900 uppercase">
          Supplier Pool & Regulatory Verification ({suppliers.length} Entities)
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-slate-100 bg-slate-50 text-[10.5px] tracking-wider text-slate-500 uppercase">
            <tr>
              <th className="px-4 py-3.5 font-semibold">
                Supplier Name & Organization
              </th>
              <th className="px-4 py-3.5 font-semibold">Tier Classification</th>
              <th className="px-4 py-3.5 font-semibold">Fulfillment Rating</th>
              <th className="px-4 py-3.5 font-semibold">
                KYC Verification Status
              </th>
              <th className="px-4 py-3.5 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {suppliers.map((supplier) => (
              <tr key={supplier.id} className="transition hover:bg-slate-50">
                <td className="px-4 py-3.5">
                  <div className="font-semibold text-slate-900">
                    {supplier.organization || supplier.name}
                  </div>
                  <div className="font-mono text-[11px] text-slate-500">
                    Contact: {supplier.email}
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <span
                    className={`rounded px-2 py-0.5 text-[10px] font-bold ${
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
                <td className="px-4 py-3.5 font-mono font-bold text-slate-800">
                  Not yet rated
                </td>
                <td className="px-4 py-3.5">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
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
                <td className="space-x-2 px-4 py-3.5 text-right">
                  {supplier.supplierApprovalStatus === "APPROVED" ? (
                    <button
                      disabled={isUpdating === supplier.id}
                      onClick={() =>
                        handleUpdateSupplierStatus(supplier.id, "SUSPENDED")
                      }
                      className="cursor-pointer rounded-lg border border-red-200 bg-red-50 px-2.5 py-1 text-[11px] font-semibold text-red-700 hover:bg-red-100 disabled:opacity-50"
                    >
                      Suspend
                    </button>
                  ) : (
                    <button
                      disabled={isUpdating === supplier.id}
                      onClick={() =>
                        handleUpdateSupplierStatus(supplier.id, "APPROVED")
                      }
                      className="cursor-pointer rounded-lg border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-800 hover:bg-emerald-100 disabled:opacity-50"
                    >
                      Approve KYC
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {suppliers.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="py-12 text-center text-xs text-slate-500"
                >
                  No supplier accounts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
