"use client"

export default function SupplierQueue({ order }: any) {
  return (
    <div className="bg-white border rounded-2xl p-5">

      <h3 className="font-semibold mb-3">
        🧠 Supplier Routing Queue
      </h3>

      {order.candidateSuppliers.map((s: any, i: number) => (
        <div
          key={s.supplierId}
          className="flex justify-between items-center py-2 border-b"
        >
          <div>
            <p className="text-sm font-medium">
              #{i + 1} Supplier
            </p>
            <p className="text-xs text-gray-500">
              {s.status}
            </p>
          </div>

          <span
            className={`text-xs px-2 py-1 rounded ${
              s.status === "accepted"
                ? "bg-green-100 text-green-600"
                : s.status === "rejected"
                ? "bg-red-100 text-red-600"
                : "bg-yellow-100 text-yellow-600"
            }`}
          >
            {s.status}
          </span>
        </div>
      ))}
    </div>
  )
}