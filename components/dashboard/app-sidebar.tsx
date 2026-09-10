// app-sidebar.tsx
"use client"

import * as React from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { Gear, Command } from "@phosphor-icons/react"

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
import { roleNavMain, type NavItem } from "@/lib/role_nav"
import Image from "next/image"

type UserRole = keyof typeof roleNavMain

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession()

  // Get current user role
  const role = session?.user?.role as UserRole | undefined

  // Dynamically get nav items based on role
  const navMain: NavItem[] = role ? roleNavMain[role] || [] : []

  const data = {
    user: {
      name:
        `${session?.user?.firstName || ""} ${session?.user?.lastName || ""}`.trim() ||
        "Guest",
      email: session?.user?.email || "guest@example.com",
      avatar: "/avatars/shadcn.webp",
      role: session?.user?.role || "guest",
    },
    navMain,
    navSecondary: [
      {
        title: "Account Settings",
        url: `/${role}/profile-settings`,
        icon: <Gear />,
      },
    ],
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      {/* <Sidebar collapsible="offcanvas" {...props}> */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link href="/">
                <Command className="hidden size-5!" />
                <Image
                  src="/logo.png"
                  alt="User Avatar"
                  width={20}
                  height={20}
                />
                <span className="bg-linear-to-r from-blue-600 via-cyan-500 to-emerald-500 bg-clip-text text-xl font-black tracking-tight text-transparent sm:text-2xl">
                  MedSupply
                </span>
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
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
