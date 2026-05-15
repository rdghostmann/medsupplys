// dashboard/site-header.tsx
"use client"

import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { NotificationBell } from "../NotificationBell/NotificationBell"

export function SiteHeader() {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center border-b px-4 lg:px-6">

      {/* LEFT SECTION */}
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />

        <Separator
          orientation="vertical"
          className="mx-2 h-4"
        />

        <h1 className="hidden text-base font-medium">Dashboard</h1>
      </div>

      {/* RIGHT SECTION */}
      <div className="ml-auto flex items-center gap-3">

        {/* SEARCH */}
        <div className="relative hidden ">
        {/* <div className="relative hidden sm:block"> */}
          <Input
            placeholder="Search products..."
            className="w-[240px] pl-9 focus-visible:ring-1"
          />

          {/* ICON */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
        </div>
        {/* NOTIFICATIONS */}
        <NotificationBell />


      </div>
    </header>
  )
}