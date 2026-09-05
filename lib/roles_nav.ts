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
    { id: "verification-history", title: "Inspection Queue", icon: "🕥", url: "/pharmacist/verification-history" },
    { id: "verify-order-registry", title: "Verified Order Registry", icon: "🕥", url: "/pharmacist/verify-order-registry" },
    { id: "audit-log", title: "Audit Log", icon: "📝", url: "/pharmacist/pharmaceutical-audit-log" },
  ],
  admin: [
    { id: "overview", title: "Overview", icon: "📊", url: "/admin" },
    { id: "suppliers", title: "Suppliers & KYC Approval", icon: "🏦", url: "/admin/suppliers" },
    { id: "products-catalog", title: "Product Catalog", icon: "📦", url: "/admin/products" },
    { id: "all-orders", title: "All Orders", icon: "📦", url: "/admin/all-orders" },
  ],
}