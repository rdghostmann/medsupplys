"use client"

import * as React from "react"
import { usePathname } from "next/navigation"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import type { LucideIcon } from "lucide-react"

export type NavItem = {
  title: string
  url: string
  icon?: LucideIcon | React.ReactNode
}

const isIconComponent = (
  icon: NavItem["icon"]
): icon is LucideIcon =>
  typeof icon === "function" ||
  (typeof icon === "object" &&
    icon !== null &&
    "render" in icon)

export function NavMain({
  items,
}: {
  items: NavItem[]
}) {
  const pathname = usePathname()

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        {/* <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Quick Create"
              className="min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground"
            >
              <PlusCircleIcon
              />
              <span>Quick Create</span>
            </SidebarMenuButton>
            <Button
              size="icon"
              className="size-8 group-data-[collapsible=icon]:opacity-0"
              variant="outline"
            >
              <EnvelopeIcon
              />
              <span className="sr-only">Inbox</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu> */}
        <SidebarMenu>
          <span className="text-xs font-medium text-muted-foreground">
            Main Menu
          </span>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                className={`text-gray-300 hover:bg-slate-800 hover:text-gray-100 ${
                  pathname === item.url ||
                  pathname.startsWith(`${item.url}/`)
                        ? 'bg-[#EFF6FF] text-[#2563EB] font-semibold shadow-xs ring-1 ring-blue-200'
                        : 'text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100'
                }`}
              >
                <Link href={item.url} className="flex w-full items-center gap-2">
                  {isIconComponent(item.icon) ? (
                    React.createElement(item.icon, {
                      className: "size-4 shrink-0",
                    })
                  ) : (
                    item.icon
                  )}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
