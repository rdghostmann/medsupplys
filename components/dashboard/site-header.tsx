// SiteHeader.tsx
"use client"

import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { NotificationBell } from "../NotificationBell/NotificationBell"
import { useSession } from "next-auth/react"

export function SiteHeader() {
  const { data: session, status } = useSession()

  const user = session?.user

  // Safely extract first and last name from the session
  const firstName = user?.firstName?.trim() || ""
  const lastName = user?.lastName?.trim() || ""

  const fullName =
    `${firstName} ${lastName}`.trim() || user?.name?.trim() || "MedSupply User"

  const email = user?.email || "user@medsupply.com"

  return (
    <header className="flex h-16 shrink-0 items-center border-b bg-background px-4 lg:px-6">
      {/* LEFT SECTION */}
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />

        <Separator orientation="vertical" className="mx-2 h-4" />

        <h1 className="hidden text-base font-medium sm:block">Dashboard</h1>
      </div>

      {/* RIGHT SECTION */}
      <div className="ml-auto flex items-center gap-3">
        {/* SEARCH */}
        <div className="relative hidden">
          <Input
            placeholder="Search products..."
            className="w-[240px] pl-9 focus-visible:ring-1"
          />

          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
        </div>

        {/* USER SECTION */}
        <div className="flex items-center gap-3">
          <NotificationBell />

          <div className="h-4 w-px bg-slate-200" />

          <div className="flex items-center gap-2">
            {/* USER TEXT */}
            <div className="hidden flex-col text-right sm:flex">
              {status === "loading" ? (
                <>
                  <span className="animate-pulse text-xs leading-tight font-bold text-slate-400">
                    Loading...
                  </span>

                  <span className="animate-pulse font-mono text-[10px] font-medium text-slate-300">
                    loading...
                  </span>
                </>
              ) : (
                <>
                  <span className="text-xs leading-tight font-bold text-slate-800">
                    {fullName}
                  </span>

                  <span className="font-mono text-[10px] font-medium text-slate-400">
                    {email}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
