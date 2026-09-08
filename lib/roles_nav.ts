// lib/roles_nav.ts - Defines the navigation structure for different user roles in the application.
import {
  LayoutDashboard,
  Sparkles,
  Package,
  Layers,
  ShoppingBag,
  Wallet as WalletIcon,
  CreditCard,
  FileText,
  ShieldCheck,
  Building2,
  Users,
  Settings,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  History,
  QrCode,
  Truck,
  RotateCcw,
  DollarSign,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';


export const roleNavMain = {
  buyer: [
    { id: "overview", title: "Overview", icon: LayoutDashboard, url: "/buyer" },
    { id: "marketplace", title: "Products Catalogue", icon: Package, url: "/buyer/marketplace" },
    { id: "procurement-sourcing", title: "Procurement Sourcing", icon: Sparkles, url: "/buyer/procurement-sourcing" },
    { id: "orders", title: "My Orders & Tracking", icon: ShoppingBag, url: "/buyer/orders" },
    { id: "buyer-wallet", title: "Procurement Wallet", icon: WalletIcon, url: "/buyer/buyerwallet" },
    { id: "credit-repayment", title: "Credit Facility Repayment", icon: CreditCard, url: "/buyer/revolving-credit" },
    { id: "audit-log", title: "Audit Log", icon: FileText, url: "/buyer/audit-log" },

  ],
  supplier: [
    { id: "overview", title: "Supplier Dashboard", icon: LayoutDashboard, url: "/supplier" },
    { id: "order-requests", title: "Incoming Requests", icon: FileText, url: "/supplier/order-requests" },
    { id: "inventory", title: "Inventory & Catalog", icon: Package, url: "/supplier/inventory" },
    { id: "order-tracking", title: "Committed Orders & Dispatch", icon: Truck, url: "/supplier/order-tracking" },
    { id: "earnings", title: "Revenue & Commission", icon: DollarSign, url: "/supplier/earnings" },
    { id: "audit-log", title: "Audit Log", icon: FileText, url: "/supplier/audit-log" },
  ],
  pharmacist: [
    { id: "overview", title: "Compliance Overview", icon: LayoutDashboard, url: "/pharmacist" },
    { id: "verification-history", title: "Verification History", icon: FileText, url: "/pharmacist/verification-history" },
    { id: "verify-order-registry", title: "Verified Order Registry", icon: FileText, url: "/pharmacist/verify-order-registry" },
    { id: "audit-log", title: "Pharmaceutical Audit Log", icon: FileText, url: "/pharmacist/pharmaceutical-audit-log" },
  ],
  admin: [
    { id: "overview", title: "Overview", icon: LayoutDashboard, url: "/admin" },
    { id: "suppliers", title: "Suppliers & KYC Approval", icon: Users, url: "/admin/suppliers" },
    { id: "master-product-catalog", title: "Master Product Catalog", icon: Package, url: "/admin/master-product-catalog" },
    { id: "revolving-credit-facilities", title: "Revolving Credit Facilities", icon: CreditCard, url: "/admin/revolving-credit-facilities" },
    { id: "matching-algorithm", title: "Matching Algorithm Weight", icon: Sliders, url: "/admin/matching-algorithm" },
    { id: "global-sourcing-monitor", title: "Global Sourcing Monitor", icon: History, url: "/admin/global-sourcing-monitor" },
    { id: "global-order-logistics", title: "Global Order & Logistics", icon: Truck, url: "/admin/global-order-logistics  " },
    { id: "master-system-audit", title: "Master System Audit Logs", icon: FileText, url: "/admin/master-system-audit" },
  ],
}