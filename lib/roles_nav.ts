// lib/roles_nav.ts - Defines the navigation structure for different user roles in the application.

export const roleNavMain = {
  buyer: [
    { id: "overview", title: "Overview", icon: "📊", url: "/buyer" },
    { id: "browse", title: "Products Catalogue", icon: "🛍️", url: "/buyer/marketplace" },
    { id: "orders", title: "My Orders & Tracking", icon: "📋", url: "/buyer/orders" },
    { id: "buyer-wallet", title: "Procurement Wallet", icon: "💰", url: "/buyer/buyerwallet" },
    { id: "revolving-credit", title: "Revolving Credit", icon: "💰", url: "/buyer/revolving-credit" },
  ],
  supplier: [
    { id: "overview", title: "Overview", icon: "📊", url: "/supplier" },
    { id: "inventory", title: "Inventory", icon: "📦", url: "/supplier/inventory" },
    { id: "order-requests", title: "Incoming Requests", icon: "📃", url: "/supplier/order-requests" },
    { id: "order-tracking", title: "Commited Order & Dispatch", icon: "🚛", url: "/supplier/order-tracking" },
    { id: "earnings", title: "Revenue & Earnings", icon: "💰", url: "/supplier/earnings" },
  ],
  pharmacist: [
    { id: "overview", title: "Compliance Overview", icon: "📊", url: "/pharmacist" },
    { id: "verification-history", title: "Verification History", icon: "🕥", url: "/pharmacist/verification-history" },
    // { id: "inspection-queue", title: "Inspection Queue", icon: "🕥", url: "/pharmacist/inspection-queue" },
    { id: "verify-order-registry", title: "Verified Order Registry", icon: "🕥", url: "/pharmacist/verify-order-registry" },
    { id: "audit-log", title: "Audit Log", icon: "📝", url: "/pharmacist/pharmaceutical-audit-log" },
  ],
  admin: [
    { id: "overview", title: "Overview", icon: "📊", url: "/admin" },
    { id: "suppliers", title: "Suppliers & KYC Approval", icon: "👩‍👩‍👦‍👦", url: "/admin/suppliers" },
    { id: "master-product-catalog", title: "Master Product Catalog", icon: "📦", url: "/admin/master-product-catalog" },
    { id: "revolving-credit-facilities", title: "Revolving Credit Facilities", icon: "💳", url: "/admin/revolving-credit-facilities" },
    { id: "global-sourcing-monitor", title: "Global Sourcing Monitor", icon: "💹", url: "/admin/global-sourcing-monitor" },
    { id: "global-order-logistics", title: "Global Order & Logistics", icon: "✈", url: "/admin/global-order-logistics  " },
    { id: "master-system-audit", title: "Master System Audit Logs", icon: "🕥", url: "/admin/master-system-audit" },
  ],
}