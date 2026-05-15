// app-sidebar.tsx
"use client"

import * as React from "react"
import { useSession } from "next-auth/react"
import { Gear, Question, MagnifyingGlass, Command } from "@phosphor-icons/react"

import { NavMain } from "@/components/dashboard/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession()

  // Define data inside the component so it has access to 'session'
  const data = {
    user: {
      name: `${session?.user?.firstName || ""} ${session?.user?.lastName || ""}`.trim() || "Guest",
      email: session?.user?.email || "guest@example.com",
      avatar: "/avatars/shadcn.webp",
    },
    navMain: [
      { id: "overview", title: "Overview", icon: "📊", url: "/buyer" },
      { id: "browse", title: "Browse Products", icon: "🛍️", url: "/buyer/marketplace" },
      { id: "orders", title: "My Orders", icon: "📋", url: "/buyer/orders" },
      { id: "order-track", title: "Track Order", icon: "🚚", url: "/buyer/orders-tracking" },
    ],
    navSecondary: [
      { title: "Settings", url: "#", icon: <Gear /> },
      { title: "Get Help", url: "#", icon: <Question /> },
      { title: "Search", url: "#", icon: <MagnifyingGlass /> },
    ],
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:p-1.5!">
              <Link href="/">
                <Command className="size-5!" />
                <span className="text-base font-semibold">MedSupply</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
        {/* Only render user menu if session exists, or show a loading state */}
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}

