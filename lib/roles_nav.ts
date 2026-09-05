// lib/roles_nav.ts - Defines the navigation structure for different user roles in the application.

export const roleNavMain = {
  buyer: [
    { id: "overview", title: "Overview", icon: "📊", url: "/buyer" },
    { id: "browse", title: "Products Catalogue", icon: "🛍️", url: "/buyer/marketplace" },
    { id: "orders", title: "My Orders", icon: "📋", url: "/buyer/orders" },
    { id: "buyer-wallet", title: "Wallet", icon: "💰", url: "/buyer/buyerwallet" },
  ],
  supplier: [
    { id: "overview", title: "Overview", icon: "📊", url: "/supplier" },
    { id: "inventory", title: "Inventory", icon: "📦", url: "/supplier/inventory" },
    { id: "order-requests", title: "Order Requests", icon: "📃", url: "/supplier/order-requests" },
    { id: "earnings", title: "Earnings", icon: "💰", url: "/supplier/earnings" },
  ],
  pharmacist: [
    { id: "overview", title: "Overview", icon: "📊", url: "/pharmacist" },
    { id: "verification-history", title: "Verification History", icon: "🕥", url: "/pharmacist/verification-history" },
  ],
  admin: [
    { id: "overview", title: "Overview", icon: "📊", url: "/admin" },
    { id: "suppliers", title: "Suppliers & KYC Approval", icon: "🏦", url: "/admin/suppliers" },
    { id: "products-catalog", title: "Product Catalog", icon: "📦", url: "/admin/products" },
    { id: "all-orders", title: "All Orders", icon: "📦", url: "/admin/all-orders" },
  ],
}