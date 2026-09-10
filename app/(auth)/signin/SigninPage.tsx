// /(auth)/signin/SigninPage.tsx

"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  PackageCheck,
  Truck,
} from "lucide-react"
import { useForm, UseFormRegisterReturn } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "next-auth/react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import type { Role } from "@/types"

/* =========================================================
   ROUTES
========================================================= */
const ROLE_ROUTES: Record<Role, string> = {
  admin: "/admin",
  supplier: "/supplier",
  buyer: "/buyer",
  pharmacist: "/pharmacist",
}

/* =========================================================
   SCHEMA
========================================================= */
const signinSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type FormData = z.infer<typeof signinSchema>

const CAROUSEL_ITEMS = [
  {
    title: "Verified Global Network",
    description:
      "Connect with licensed pharmaceutical partners across Africa and beyond.",
    image:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1200",
    icon: <ShieldCheck className="h-8 w-8" />,
  },
  {
    title: "Seamless Procurement",
    description:
      "Post requirements and receive competitive bids from qualified suppliers instantly.",
    image: "/cold_chain_logistics_1788851150748.png",
    icon: <PackageCheck className="h-8 w-8" />,
  },
  {
    title: "Cold-Chain Logistics",
    description:
      "Real-time tracking of medications from the manufacturer directly to the ward.",
    image: "/cold_chain_logistics_1788851150748.png",
    icon: <Truck className="h-8 w-8" />,
  },
]

export default function SigninPage() {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [carouselIndex, setCarouselIndex] = useState(0)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(signinSchema),
    defaultValues: { email: "", password: "" },
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setCarouselIndex((prev) =>
        prev === CAROUSEL_ITEMS.length - 1 ? 0 : prev + 1
      )
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const onSubmit = async (values: FormData) => {
    setIsPending(true)
    try {
      const response = await signIn("credentials", {
        email: values.email.trim().toLowerCase(),
        password: values.password,
        redirect: false,
      })

      if (response?.error) {
        toast.error("Invalid email or password")
        return
      }

      // Fetch fresh session to determine role
      const res = await fetch("/api/auth/session")
      const session = await res.json()
      const role = session?.user?.role as Role

      if (!role) {
        toast.error("User role not identified. Please contact support.")
        return
      }

      toast.success("Signed in successfully")
      router.push(ROLE_ROUTES[role])
      router.refresh()
    } catch (error) {
      toast.error("An unexpected error occurred")
    } finally {
      setIsPending(false)
    }
  }

  return (
    <section className="font-sora flex min-h-screen overflow-hidden bg-white">
      <div className="flex min-h-screen w-full flex-col overflow-y-auto bg-white px-6 py-8 lg:w-[48%] lg:px-16 lg:py-10">
        <div className="mx-auto my-auto w-full max-w-md">
          {/* Mobile Logo */}
          <Link
            href="/"
            className="mb-10 flex w-fit items-center gap-3 select-none lg:hidden"
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
              <h3 className="bg-linear-to-r from-blue-600 via-cyan-500 to-emerald-500 bg-clip-text text-2xl font-black tracking-tight text-transparent">
                MedSupply
              </h3>
              <span className="text-[10px] font-semibold tracking-[0.2em] text-slate-400 uppercase">
                Procurement Platform
              </span>
            </div>
          </Link>

          {/* Header */}
          <div className="mb-10 space-y-3">
            <h1 className="text-4xl font-black tracking-tight text-slate-900">
              Welcome back
            </h1>
            <p className="text-base leading-relaxed text-slate-500">
              Secure B2B authentication for healthcare buyers and verified
              suppliers
            </p>
            <p className="hidden text-base leading-relaxed text-slate-500">
              Sign in to continue managing procurement workflows, suppliers,
              inventory, and pharmaceutical orders.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <InputField
              label="Email Address"
              placeholder="john@example.com"
              icon={<Mail className="h-4 w-4" />}
              error={errors.email?.message}
              registration={register("email")}
            />
            <InputField
              label="Password"
              placeholder="••••••••"
              type={showPassword ? "text" : "password"}
              icon={<Lock className="h-4 w-4" />}
              error={errors.password?.message}
              registration={register("password")}
              isPassword
              showPassword={showPassword}
              togglePassword={() => setShowPassword(!showPassword)}
            />

            <div className="flex items-center justify-between gap-4">
              <label className="flex cursor-pointer items-center gap-2 select-none">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-slate-600">
                  Remember me
                </span>
              </label>

              <Link
                href="/forgot-password"
                className="text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700"
              >
                Forgot password?
              </Link>
            </div>
            <Button
              type="submit"
              disabled={isPending}
              className="h-14 w-full rounded-xl bg-blue-700 text-base font-semibold text-white hover:bg-blue-800"
            >
              {isPending ? "Signing in..." : "Sign In"}
              {!isPending && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="font-semibold text-blue-600 transition-colors hover:text-blue-700"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* =========================================================
          RIGHT SIDE — IMAGE CAROUSEL
      ========================================================= */}
      <div className="relative hidden overflow-hidden bg-slate-950 lg:block lg:w-[52%]">
        <AnimatePresence mode="wait">
          <motion.div
            key={carouselIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            {/* Background Image */}
            <motion.div
              initial={{ scale: 1.08 }}
              animate={{ scale: 1 }}
              transition={{ duration: 6, ease: "easeOut" }}
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${CAROUSEL_ITEMS[carouselIndex].image})`,
              }}
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-linear-to-br from-blue-950/90 via-slate-950/60 to-slate-950/85" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.25),transparent_40%)]" />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-between p-14">
              <div
                className="flex items-center gap-3 select-none"
                onContextMenu={(e) => e.preventDefault()}
              >
                <Link href="/" className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/10 backdrop-blur-md">
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
                    <h1 className="text-2xl font-black tracking-tight text-white">
                      MedSupply
                    </h1>
                    <span className="text-[10px] font-semibold tracking-[0.2em] text-slate-300 uppercase">
                      Procurement Platform
                    </span>
                  </div>
                </Link>
              </div>

              {/* Carousel Content */}
              <div className="relative z-10 max-w-xl">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="space-y-8"
                >
                  <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-white/15 bg-white/10 text-white shadow-2xl backdrop-blur-xl">
                    {CAROUSEL_ITEMS[carouselIndex].icon}
                  </div>
                  <div className="space-y-5">
                    <h2 className="text-5xl leading-tight font-black tracking-tight text-white">
                      {CAROUSEL_ITEMS[carouselIndex].title}
                    </h2>
                    <p className="max-w-lg text-xl leading-relaxed font-medium text-blue-50/90">
                      {CAROUSEL_ITEMS[carouselIndex].description}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 pt-2">
                    {CAROUSEL_ITEMS.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setCarouselIndex(i)}
                        className={cn(
                          "h-1.5 rounded-full transition-all duration-500",
                          i === carouselIndex
                            ? "w-10 bg-cyan-400"
                            : "w-2 bg-white/30 hover:bg-white/50"
                        )}
                      />
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}

function InputField({
  label,
  placeholder,
  icon,
  error,
  type = "text",
  registration,
  isPassword,
  showPassword,
  togglePassword,
}: InputFieldProps) {
  return (
    <div className="space-y-1.5">
      <Label className="ml-1 text-sm font-semibold text-slate-700">
        {label}
      </Label>
      <div className="relative">
        <div className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-500">
          {icon}
        </div>
        <Input
          {...registration}
          type={type}
          placeholder={placeholder}
          className={cn(
            "h-12 rounded-xl border-slate-200 bg-slate-50 pr-12 pl-12 transition-all focus:bg-white focus:ring-2 focus:ring-blue-600/20",
            error && "border-red-500 focus:ring-red-500/20"
          )}
        />
        {isPassword && (
          <button
            type="button"
            onClick={togglePassword}
            className="absolute top-1/2 right-4 -translate-y-1/2 text-slate-400 hover:text-slate-700"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        )}
      </div>
      {error && (
        <p className="ml-1 text-xs font-medium text-red-500">{error}</p>
      )}
    </div>
  )
}

interface InputFieldProps {
  label: string
  placeholder: string
  icon: React.ReactNode
  error?: string
  type?: string
  registration: UseFormRegisterReturn
  isPassword?: boolean
  showPassword?: boolean
  togglePassword?: () => void
}
