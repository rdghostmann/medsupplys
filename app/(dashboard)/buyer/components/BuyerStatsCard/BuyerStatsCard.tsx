// BuyerStatsCard.tsx
"use client"

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Badge } from "@/components/ui/badge"
import { TrendUpIcon, TrendDownIcon } from "@phosphor-icons/react"

type StatCard = {
  title: string
  value: string | number
  description: string
  badgeText?: string
  trend?: "up" | "down" | "neutral"
}

const stats: StatCard[] = [
  {
    title: "Total Orders",
    value: 24,
    description: "📦",
    badgeText: "+4 this month",
    trend: "up",
  },
  {
    title: "Pending Delivery",
    value: 5,
    description: "🚚",
    badgeText: "3 under verification",
    trend: "neutral",
  },
  {
    title: "Total Spent",
    value: "₦2.4M",
    description: "💰",
    badgeText: "+12% vs last month",
    trend: "up",
  },
  {
    title: "Saved Items",
    value: 8,
    description: "❤️",
    badgeText: "2 price drops",
    trend: "down",
  },
]

// 🎨 Border color system (scalable)
const borderTopColors = [
  "border-t-blue-500",
  "border-t-yellow-500",
  "border-t-green-500",
  "border-t-indigo-500",
]

const TrendIcon = ({ trend }: { trend?: string }) => {
  if (trend === "up") return <TrendUpIcon className="size-4" />
  if (trend === "down") return <TrendDownIcon className="size-4" />
  return null
}

export function BuyerStatsCard() {
  return (
    <div className="grid grid-cols-2 md:grid-col-4 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {stats.map((item, index) => (
        <Card
          key={item.title}
          className={`@container/card border-t-4 ${borderTopColors[index]}`}
        >
          <CardHeader>
            <CardDescription className="flex items-center justify-between">
              <span>{item.title}</span>
              <span className="text-2xl">{item.description}</span>
            </CardDescription>

            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {item.value}
            </CardTitle>
          </CardHeader>

          <CardFooter className="flex items-center justify-between text-sm text-muted-foreground">
            {item.badgeText && (
              <Badge variant="outline" className="flex items-center gap-1">
                <TrendIcon trend={item.trend} />
                {item.badgeText}
              </Badge>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}