// lib/roles_nav.ts - Defines the navigation structure for different user roles in the application.

export const roleNavMain = {
  buyer: [
    { id: "overview", title: "Overview", icon: "📊", url: "/buyer" },
    { id: "browse", title: "Browse Products", icon: "🛍️", url: "/buyer/browse" },
    { id: "orders", title: "My Orders", icon: "📋", url: "/buyer/orders" },
    { id: "order-track", title: "Track Order", icon: "🚚", url: "/buyer/orders-tracking" },
  ],
  supplier: [
    { id: "overview", title: "Overview", icon: "📊", url: "/supplier" },
    { id: "inventory", title: "Inventory", icon: "📦", url: "/supplier/inventory" },
    { id: "order-requests", title: "Order Requests", icon: "📃", url: "/supplier/order-requests" },
    { id: "earnings", title: "Earnings", icon: "💰", url: "/supplier/earnings" },
  ],
  pharmacist: [
    { id: "overview", title: "Overview", icon: "📊", url: "/pharmacist" },
    { id: "verification", title: "Verification", icon: "📄", url: "/pharmacist/verification" },
    { id: "verify-product", title: "Verify Product", icon: "✅", url: "/pharmacist/verify-product" },
    { id: "verification-history", title: "Verification History", icon: "🕥", url: "/pharmacist/verify-history" },
  ],
  admin: [
    { id: "overview", title: "Overview", icon: "📊", url: "/admin" },
    { id: "users", title: "Users", icon: "👥", url: "/admin/users" },
    { id: "suppliers", title: "Suppliers", icon: "🏦", url: "/admin/suppliers" },
    { id: "products-catalog", title: "Product Catalog", icon: "📦", url: "/admin/products" },
    { id: "all-orders", title: "All Orders", icon: "📦", url: "/admin/all-orders" },
  ],
}