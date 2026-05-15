// lib/roles.ts

export const roleNav = {
    buyer: [
    { id: "overview", title: "Overview", icon: "📊", url: "/dashboard/buyer" },
    { id: "browse", title: "Browse Products", icon: "🛍️", url: "/dashboard/buyer/browse" },
    { id: "orders", title: "My Orders", icon: "📋", url: "/dashboard/buyer/orders" },
    { id: "order-track", title: "Track Order", icon: "🚚", url: "/dashboard/buyer/orders-tracking" },
  ],
  supplier: [
    { id: "overview", title: "Overview", icon: " ", url: "/dashboard/supplier" },
    { id: "inventory", title: "Inventory", icon: " ", url: "/dashboard/supplier/inventory" },
  ],
  pharmacist: [
    { id: "verification", title: "Verification", icon: " ", url: "/dashboard/pharmacist/verification" },
  ],
  admin: [
    { id: "users", title: "Users", icon: " ", url: "/dashboard/admin/users" },
    { id: "products", title: "Products", icon: " ", url: "/dashboard/admin/products" },
  ],
}