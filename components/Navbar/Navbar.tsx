// Navbar.tsx
"use client"

import React, {
  useEffect,
  useState,
} from "react"

import Link from "next/link"
import Image from "next/image"

import {
  usePathname,
  useRouter,
} from "next/navigation"

import {
  AnimatePresence,
  motion,
} from "framer-motion"

import {
  ChevronRight,
  Menu,
  X,
  LayoutDashboard,
  } from "lucide-react"

import {
  PackageIcon,
  ProhibitInsetIcon,
  SignOut,
  StorefrontIcon,
  TruckIcon,
} from "@phosphor-icons/react"

import { signOut, useSession } from "next-auth/react"

import { cn } from "@/lib/utils"
import { LogoutButton } from "../LogoutButton/LogoutButton"

interface NavLink {
  name: string
  href: string
  icon?: React.ReactNode
}

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()

  const { data: session, status } =    useSession()

  const isAuthenticated =    status === "authenticated"

  const [isOpen, setIsOpen] =    useState(false)

  const [scrolled, setScrolled] =    useState(false)

  /* =========================================================
     EFFECTS
  ========================================================= */

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(false)
      }
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 8)
    }

    window.addEventListener(
      "resize",
      handleResize
    )

    window.addEventListener(
      "scroll",
      handleScroll
    )

    return () => {
      window.removeEventListener(
        "resize",
        handleResize
      )

      window.removeEventListener(
        "scroll",
        handleScroll
      )
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow =
      isOpen ? "hidden" : "unset"

    return () => {
      document.body.style.overflow =
        "unset"
    }
  }, [isOpen])

  /* =========================================================
     NAV LINKS
  ========================================================= */

  const navLinks: NavLink[] = [
    {
      name: "Products",
      href: "/signin",
      icon: (
        <PackageIcon
          size={18}
          weight="duotone"
        />
      ),
    },

    {
      name: "How It Works",
      href: "Signin",
      icon: (
        <ProhibitInsetIcon
          size={18}
          weight="duotone"
        />
      ),
    },

    {
      name: "Suppliers",
      href: "/signup",
      icon: (
        <TruckIcon
          size={18}
          weight="duotone"
        />
      ),
    },

    {
      name: "Marketplace",
      href: "/signin",
      icon: (
        <StorefrontIcon
          size={18}
          weight="duotone"
        />
      ),
    },
  ]

  /* =========================================================
     HELPERS
  ========================================================= */

  const closeMenu = () =>
    setIsOpen(false)

  const handleDashboard = () => {
    closeMenu()
    const role = session?.user?.role // Typed from next-auth.d.ts
    
    const routes: Record<string, string> = {
      supplier: "/supplier",
      buyer: "/buyer",
      admin: "/admin"
    }

    router.push(routes[role as string] || "/buyer")
  }

  const handleSignOut = async () => {
    closeMenu()

    await signOut({
      callbackUrl: "/signin",
    })
  }

  /* =========================================================
     COMPONENT
  ========================================================= */

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 h-16 transition-all duration-300",

          scrolled
            ? "bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-sm"
            : "bg-white/80 backdrop-blur-md border-b border-slate-100"
        )}
      >
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* =========================================================
              LOGO
          ========================================================= */}

          <div
            className="flex items-center gap-3 shrink-0 select-none"
            onContextMenu={(e) =>
              e.preventDefault()
            }
            onCopy={(e) =>
              e.preventDefault()
            }
            onCut={(e) =>
              e.preventDefault()
            }
            onDragStart={(e) =>
              e.preventDefault()
            }
          >
            <Link
              href="/"
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-md overflow-hidden flex items-center justify-center">
                <Image
                  src="/logo.png"
                  width={36}
                  height={36}
                  alt="MedSupply"
                  className="object-cover"
                  priority
                  unoptimized
                />
              </div>

              <div className="flex flex-col leading-none">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight bg-linear-to-r from-blue-600 via-cyan-500 to-emerald-500 bg-clip-text text-transparent">
                  MedSupply
                </h1>

                <span className="text-[8px] uppercase tracking-[0.22em] text-slate-400 font-semibold">
                  Procurement & Verification
                </span>
              </div>
            </Link>
          </div>

          {/* =========================================================
              DESKTOP NAVIGATION
          ========================================================= */}

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const active =
                pathname === link.href

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "group flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200",

                    active
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  )}
                >
                  <span
                    className={cn(
                      "transition-colors",

                      active
                        ? "text-blue-600"
                        : "text-slate-400 group-hover:text-blue-600"
                    )}
                  >
                    {link.icon}
                  </span>

                  {link.name}
                </Link>
              )
            })}

            <div className="w-px h-6 bg-slate-200 mx-3" />

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={
                    handleDashboard
                  }
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-all"
                >
                  <LayoutDashboard className="w-4 h-4" />

                  Dashboard
                </button>

                <button
                  onClick={
                    handleSignOut
                  }
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 transition-all"
                >
                  <SignOut className="w-4 h-4" />

                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/signin"
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all"
                >
                  Sign In
                </Link>

                <Link
                  href="/signup"
                  className="group inline-flex items-center gap-2 bg-linear-to-r from-blue-600 to-cyan-500 text-white px-5 py-2.5 rounded-2xl text-sm font-bold hover:shadow-xl hover:shadow-blue-500/20 transition-all active:scale-[0.98]"
                >
                  Get Started

                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            )}
          </div>

          {/* =========================================================
              MOBILE MENU BUTTON
          ========================================================= */}

          <button
            onClick={() =>
              setIsOpen(true)
            }
            className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-2xl border border-slate-200 text-slate-700 hover:bg-slate-100 transition-all"
            aria-label="Open Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* =========================================================
          MOBILE NAVIGATION
      ========================================================= */}

      <AnimatePresence>
        {isOpen && (
          <>
            {/* BACKDROP */}

            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              onClick={closeMenu}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] lg:hidden"
            />

            {/* DRAWER */}

            <motion.div
              initial={{
                x: "-100%",
              }}
              animate={{
                x: 0,
              }}
              exit={{
                x: "-100%",
              }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 24,
              }}
              className="fixed top-0 left-0 h-screen w-full max-w-sm bg-white z-[70] lg:hidden flex flex-col shadow-2xl"
            >
              {/* HEADER */}

              <div className="h-16 px-5 border-b border-slate-200 flex items-center justify-between">
                <Link
                  href="/"
                  onClick={closeMenu}
                  className="flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center">
                    <Image
                      src="/logo.png"
                      width={36}
                      height={36}
                      alt="Logo"
                      className="object-cover"
                      unoptimized
                      priority
                    />
                  </div>

                  <div className="flex flex-col leading-none">
                    <h3 className="text-2xl bg-linear-to-r from-blue-600 via-cyan-500 to-emerald-500 bg-clip-text text-transparent font-extrabold tracking-tight">
                      MedSupply
                    </h3>

                    <span className="text-[8px] uppercase tracking-[0.22em] text-slate-400 font-semibold">
                      Procurement Platform
                    </span>
                  </div>
                </Link>

                <button
                  onClick={closeMenu}
                  className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-all"
                  aria-label="Close Menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* NAV LINKS */}

              <div className="flex-1 overflow-y-auto px-5 py-6">
                <div className="space-y-4">
                  {navLinks.map(
                    (link, index) => {
                      const active =
                        pathname ===
                        link.href

                      return (
                        <motion.div
                          key={link.name}
                          initial={{
                            opacity: 0,
                            x: -20,
                          }}
                          animate={{
                            opacity: 1,
                            x: 0,
                          }}
                          transition={{
                            delay:
                              index *
                              0.08,
                          }}
                        >
                          <Link
                            href={link.href}
                            onClick={
                              closeMenu
                            }
                            className={cn(
                              "group flex items-center justify-between px-5 py-4 rounded-2xl border transition-all",

                              active
                                ? "border-blue-100 bg-blue-50"
                                : "border-slate-100 hover:border-blue-100 hover:bg-blue-50/60"
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={cn(
                                  "transition-colors",

                                  active
                                    ? "text-blue-600"
                                    : "text-slate-400 group-hover:text-blue-600"
                                )}
                              >
                                {
                                  link.icon
                                }
                              </div>

                              <span className="text-lg font-semibold text-slate-800">
                                {
                                  link.name
                                }
                              </span>
                            </div>

                            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-all group-hover:translate-x-1" />
                          </Link>
                        </motion.div>
                      )
                    }
                  )}
                </div>
              </div>

              {/* FOOTER ACTIONS */}

              <div className="border-t border-slate-200 p-5 space-y-3">
                {isAuthenticated ? (
                  <>
                    <button
                      onClick={
                        handleDashboard
                      }
                      className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl border border-slate-200 font-bold text-slate-700 hover:bg-slate-50 transition-all"
                    >
                      <LayoutDashboard className="w-5 h-5" />

                      Dashboard
                    </button>

                    <LogoutButton />

                    {/* <button
                      onClick={
                        handleSignOut
                      }
                      className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl border border-red-200 text-red-600 font-bold hover:bg-red-50 transition-all"
                    >
                      <SignOut className="w-5 h-5" />

                      Sign Out
                    </button> */}
                  </>
                ) : (
                  <>
                    <Link
                      href="/signin"
                      onClick={
                        closeMenu
                      }
                      className="flex items-center justify-center w-full py-4 rounded-2xl border-2 border-slate-100 font-bold text-slate-700 hover:bg-slate-50 transition-all text-lg"
                    >
                      Sign In
                    </Link>

                    <Link
                      href="/signup"
                      onClick={
                        closeMenu
                      }
                      className="flex items-center justify-center w-full py-4 rounded-2xl bg-linear-to-r from-blue-600 to-cyan-500 text-white font-bold shadow-xl shadow-blue-500/20 hover:opacity-95 transition-all active:scale-[0.98] text-lg"
                    >
                      Get Started
                    </Link>
                  </>
                )}

                <p className="text-center text-slate-400 text-[10px] pt-4 font-semibold uppercase tracking-[0.22em]">
                  Procurement & Verification
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}