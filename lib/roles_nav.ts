// lib/roles_nav.ts - Defines the navigation structure for different user roles in the application.

export const roleNavMain = {
  buyer: [
    { id: "overview", title: "Overview", icon: "📊", url: "/buyer" },
    { id: "browse", title: "Products Catalogue", icon: "🛍️", url: "/buyer/marketplace" },
    { id: "browse", title: "Procurement Sourcing", icon: "✨", url: "/buyer/procurement-sourcing" },
    { id: "orders", title: "My Orders & Tracking", icon: "📋", url: "/buyer/orders" },
    { id: "buyer-wallet", title: "Procurement Wallet", icon: "👜", url: "/buyer/buyerwallet" },
    { id: "credit-repayment", title: "Credit Facility Repayment", icon: "💰", url: "/buyer/revolving-credit" },
  ],
  supplier: [
    { id: "overview", title: "Supplier Dashboard", icon: "📊", url: "/supplier" },
    { id: "order-requests", title: "Incoming Requests", icon: "📃", url: "/supplier/order-requests" },
    { id: "inventory", title: "Inventory & Catalog", icon: "📦", url: "/supplier/inventory" },
    { id: "order-tracking", title: "Order Tracking", icon: "🚛", url: "/supplier/order-tracking" },
    { id: "earnings", title: "Revenue & Commission", icon: "💰", url: "/supplier/earnings" },
    { id: "audit-log", title: "Audit Log", icon: "📝", url: "/supplier/audit-log" },
  ],
  pharmacist: [
    { id: "overview", title: "Compliance Overview", icon: "📊", url: "/pharmacist" },
    { id: "verification-history", title: "Verification History", icon: "🕥", url: "/pharmacist/verification-history" },
    { id: "verify-order-registry", title: "Verified Order Registry", icon: "🕥", url: "/pharmacist/verify-order-registry" },
    { id: "audit-log", title: "Pharmaceutical Audit Log", icon: "📝", url: "/pharmacist/pharmaceutical-audit-log" },
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