"use client"

export default function SupplierQueue({ order }: any) {
  return (
    <div className="rounded-2xl border bg-white p-5">
      <h3 className="mb-3 font-semibold">🧠 Supplier Routing Queue</h3>

      {order.candidateSuppliers.map((s: any, i: number) => (
        <div
          key={s.supplierId}
          className="flex items-center justify-between border-b py-2"
        >
          <div>
            <p className="text-sm font-medium">#{i + 1} Supplier</p>
            <p className="text-xs text-gray-500">{s.status}</p>
          </div>

          <span
            className={`rounded px-2 py-1 text-xs ${
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
