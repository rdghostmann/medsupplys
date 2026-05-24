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
  ],
  pharmacist: [
    { id: "verification", title: "Verification", icon: "✅", url: "/pharmacist/verification" },
  ],
  admin: [
    { id: "users", title: "Users", icon: "👥", url: "/admin/users" },
    { id: "products", title: "Products", icon: "📦", url: "/admin/products" },
  ],
}