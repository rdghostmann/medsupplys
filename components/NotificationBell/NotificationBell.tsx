"use client"

import { useState } from "react"
import { Bell } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { MOCK_NOTIFICATIONS } from "@/constants/MockNotifications"

export function NotificationBell() {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {/* TRIGGER */}
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-4 w-4" />

          {/* DOT */}
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
        </Button>
      </PopoverTrigger>

      {/* PANEL */}
      <PopoverContent align="end" className="w-[340px] overflow-hidden p-0">
        {/* HEADER */}
        <div className="border-b px-4 py-3">
          <h3 className="text-sm font-semibold">Notifications</h3>
        </div>

        {/* LIST */}
        <div className="max-h-[360px] overflow-y-auto">
          {MOCK_NOTIFICATIONS.map((n, i) => (
            <div
              key={i}
              className="flex gap-3 border-b px-4 py-3 transition last:border-0 hover:bg-muted/40"
            >
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-md text-sm ${n.bg}`}
              >
                {n.icon}
              </div>

              <div className="flex-1">
                <p className="text-sm leading-snug">{n.msg}</p>
                <span className="text-xs text-muted-foreground">{n.time}</span>
              </div>
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <div className="border-t p-3 text-center">
          <button className="text-xs text-blue-600 hover:underline">
            View all notifications
          </button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
