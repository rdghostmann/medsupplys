export type Notification = {
  icon: string
  bg: string
  msg: string
  time: string
}

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    icon: "📦",
    bg: "bg-blue-50",
    msg: "New order #MS-00392 received for Amoxicillin 500mg",
    time: "5 min ago",
  },
  {
    icon: "✅",
    bg: "bg-green-50",
    msg: "Order #MS-00391 verified by pharmacist",
    time: "1 hr ago",
  },
  {
    icon: "⚠️",
    bg: "bg-amber-50",
    msg: "Ibuprofen stock is running low (23 units left)",
    time: "3 hrs ago",
  },
  {
    icon: "🏭",
    bg: "bg-purple-50",
    msg: "New supplier application received",
    time: "Yesterday",
  },
  {
    icon: "💰",
    bg: "bg-green-50",
    msg: "Payout of ₦288,000 processed",
    time: "Yesterday",
  },
]