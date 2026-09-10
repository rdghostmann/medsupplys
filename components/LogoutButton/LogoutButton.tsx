// components/auth/LogoutButton.tsx
"use client"

import { signOut } from "next-auth/react"
import { LogOut } from "lucide-react"
import { Button } from "../ui/button"

export const LogoutButton = () => {
  return (
    <Button
      onClick={() => signOut({ callbackUrl: "/signin" })}
      className="group flex w-full items-center gap-2 p-2 text-sm font-bold text-white transition-colors hover:bg-gray-300 hover:text-red-500"
    >
      <LogOut className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      <span className="text-xs tracking-widest uppercase">Log Out</span>
    </Button>
  )
}
