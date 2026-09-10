// Navbar.tsx
"use client"

import React, { useEffect, useState } from "react"

import Link from "next/link"
import Image from "next/image"

import { usePathname, useRouter } from "next/navigation"

import { AnimatePresence, motion } from "framer-motion"

import { ChevronRight, Menu, X, LayoutDashboard } from "lucide-react"

import {
  HouseIcon,
  InfoIcon,
  StorefrontIcon,
  GearIcon,
  ListChecksIcon,
  TruckIcon,
  PhoneIcon,
} from "@phosphor-icons/react"

import { signOut, useSession } from "next-auth/react"

import { cn } from "@/lib/utils"
import { LogoutButton } from "../LogoutButton/LogoutButton"

interface NavLink {
  name: string
  href: string
  icon?: React.ReactNode
  desktop?: boolean
}

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()

  const { data: session, status } = useSession()

  const isAuthenticated = status === "authenticated"

  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

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

    window.addEventListener("resize", handleResize)
    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset"

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  /* =========================================================
     NAVIGATION LINKS
  ========================================================= */

  const navLinks: NavLink[] = [
    {
      name: "Home",
      href: "/",
      desktop: true,
      icon: <HouseIcon size={19} weight="duotone" />,
    },

    {
      name: "About",
      href: "/about",
      desktop: true,
      icon: <InfoIcon size={19} weight="duotone" />,
    },

    {
      name: "Why MedSupply",
      href: "/why-medsupply",
      icon: <StorefrontIcon size={19} weight="duotone" />,
    },

    {
      name: "Features",
      href: "/features",
      icon: <ListChecksIcon size={19} weight="duotone" />,
    },

    {
      name: "Services",
      href: "/services",
      desktop: true,
      icon: <GearIcon size={19} weight="duotone" />,
    },

    {
      name: "How it Works",
      href: "/how-it-works",
      icon: <ListChecksIcon size={19} weight="duotone" />,
    },

    {
      name: "Become a Supplier",
      href: "/become-supplier",
      icon: <TruckIcon size={19} weight="duotone" />,
    },

    {
      name: "Contact",
      href: "/contact",
      desktop: true,
      icon: <PhoneIcon size={19} weight="duotone" />,
    },
  ]

  /* =========================================================
     FILTERED NAVIGATION
  ========================================================= */

  const desktopNavLinks = navLinks.filter((link) => link.desktop)

  const mobileNavLinks = navLinks

  /* =========================================================
     HELPERS
  ========================================================= */

  const closeMenu = () => {
    setIsOpen(false)
  }

  const handleDashboard = () => {
    closeMenu()

    const role = session?.user?.role

    const routes: Record<string, string> = {
      supplier: "/supplier",
      buyer: "/buyer",
      admin: "/admin",
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
      {/* =========================================================
          DESKTOP / MAIN NAVBAR
      ========================================================= */}

      <nav
        className={cn(
          "h-16 transition-all duration-300",
          // "fixed top-0 left-0 right-0 z-50 h-16 transition-all duration-300",
          scrolled
            ? "border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-xl"
            : "border-b border-slate-100 bg-white/80 backdrop-blur-md"
        )}
      >
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* =========================================================
              LOGO
          ========================================================= */}

          <div
            className="flex shrink-0 items-center gap-3 select-none"
            onContextMenu={(e) => e.preventDefault()}
            onCopy={(e) => e.preventDefault()}
            onCut={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
          >
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-md">
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
                <h1 className="bg-linear-to-r from-blue-600 via-cyan-500 to-emerald-500 bg-clip-text text-xl font-black tracking-tight text-transparent sm:text-2xl">
                  MedSupply
                </h1>

                <span className="text-[8px] font-semibold tracking-[0.22em] text-slate-400 uppercase">
                  Procurement & Verification
                </span>
              </div>
            </Link>
          </div>

          {/* =========================================================
              DESKTOP NAVIGATION
              
              Desktop:
              Home
              About
              Services
              Contact
          ========================================================= */}

          <div className="hidden items-center gap-1 lg:flex">
            {desktopNavLinks.map((link) => {
              const active = pathname === link.href

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "group flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200",
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
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            {/* =====================================================
                AUTHENTICATED ACTIONS
            ===================================================== */}

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleDashboard}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-100"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </button>

                <button
                  type="button"
                  onClick={handleSignOut}
                  className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition-all hover:bg-red-50"
                >
                  <X className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/signin"
                  className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 transition-all hover:bg-slate-100 hover:text-slate-900"
                >
                  Sign In
                </Link>

                <Link
                  href="/signup"
                  className="group inline-flex items-center gap-2 rounded-2xl bg-linear-to-r from-blue-600 to-cyan-500 px-5 py-2.5 text-sm font-bold text-white transition-all hover:shadow-xl hover:shadow-blue-500/20 active:scale-[0.98]"
                >
                  Get Started
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            )}
          </div>

          {/* =========================================================
              MOBILE MENU BUTTON
          ========================================================= */}

          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-slate-200 text-slate-700 transition-all hover:bg-slate-100 lg:hidden"
            aria-label="Open Menu"
            aria-expanded={isOpen}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </nav>

      {/* =========================================================
          MOBILE NAVIGATION
          
          Mobile:
          Home
          About
          Why MedSupply
          Features
          Services
          How it Works
          Become a Supplier
          Contact
      ========================================================= */}

      <AnimatePresence>
        {isOpen && (
          <>
            {/* =====================================================
                BACKDROP
            ===================================================== */}

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
              className="fixed inset-0 z-60 bg-black/40 backdrop-blur-sm lg:hidden"
            />

            {/* =====================================================
                DRAWER
            ===================================================== */}

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
              className="fixed top-0 left-0 z-70 flex h-screen w-full max-w-sm flex-col bg-white shadow-2xl lg:hidden"
            >
              {/* =================================================
                  HEADER
              ================================================= */}

              <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5">
                <Link
                  href="/"
                  onClick={closeMenu}
                  className="flex items-center gap-3"
                >
                  <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg">
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
                    <h3 className="bg-linear-to-r from-blue-600 via-cyan-500 to-emerald-500 bg-clip-text text-2xl font-extrabold tracking-tight text-transparent">
                      MedSupply
                    </h3>

                    <span className="text-[8px] font-semibold tracking-[0.22em] text-slate-400 uppercase">
                      Procurement Platform
                    </span>
                  </div>
                </Link>

                <button
                  type="button"
                  onClick={closeMenu}
                  className="flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 transition-all hover:bg-slate-100"
                  aria-label="Close Menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* =================================================
                  NAV LINKS
              ================================================= */}

              <div className="flex-1 overflow-y-auto px-5 py-6">
                <div className="space-y-3">
                  {mobileNavLinks.map((link, index) => {
                    const active = pathname === link.href

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
                          delay: index * 0.06,
                        }}
                      >
                        <Link
                          href={link.href}
                          onClick={closeMenu}
                          className={cn(
                            "group flex items-center justify-between rounded-2xl border px-5 py-4 transition-all",

                            active
                              ? "border-blue-100 bg-blue-50"
                              : "border-slate-100 hover:border-blue-100 hover:bg-blue-50/60"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={cn(
                                "flex h-9 w-9 items-center justify-center rounded-xl transition-colors",

                                active
                                  ? "bg-blue-100 text-blue-600"
                                  : "bg-slate-50 text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600"
                              )}
                            >
                              {link.icon}
                            </div>

                            <span className="text-lg font-semibold text-slate-800">
                              {link.name}
                            </span>
                          </div>

                          <ChevronRight className="h-5 w-5 text-slate-400 transition-all group-hover:translate-x-1 group-hover:text-blue-600" />
                        </Link>
                      </motion.div>
                    )
                  })}
                </div>
              </div>

              {/* =================================================
                  FOOTER ACTIONS
              ================================================= */}

              <div className="space-y-3 border-t border-slate-200 p-5">
                {isAuthenticated ? (
                  <>
                    <button
                      type="button"
                      onClick={handleDashboard}
                      className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 py-4 font-bold text-slate-700 transition-all hover:bg-slate-50"
                    >
                      <LayoutDashboard className="h-5 w-5" />
                      Dashboard
                    </button>

                    <LogoutButton />
                  </>
                ) : (
                  <>
                    <Link
                      href="/signin"
                      onClick={closeMenu}
                      className="flex w-full items-center justify-center rounded-2xl border-2 border-slate-100 py-4 text-lg font-bold text-slate-700 transition-all hover:bg-slate-50"
                    >
                      Sign In
                    </Link>

                    <Link
                      href="/signup"
                      onClick={closeMenu}
                      className="flex w-full items-center justify-center rounded-2xl bg-linear-to-r from-blue-600 to-cyan-500 py-4 text-lg font-bold text-white shadow-xl shadow-blue-500/20 transition-all hover:opacity-95 active:scale-[0.98]"
                    >
                      Get Started
                    </Link>
                  </>
                )}

                <p className="pt-4 text-center text-[10px] font-semibold tracking-[0.22em] text-slate-400 uppercase">
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
