// /(auth)/signin/SigninPage.tsx

"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Eye, EyeOff, Lock, Mail, ShieldCheck, PackageCheck, Truck } from "lucide-react"
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
    description: "Connect with licensed pharmaceutical partners across Africa and beyond.",
    image: "https://images.unsplash.com/photo-1587854692152-cbe660dbbb88?auto=format&fit=crop&q=80&w=1200",
    icon: <ShieldCheck className="w-8 h-8" />,
  },
  {
    title: "Seamless Procurement",
    description: "Post requirements and receive competitive bids from qualified suppliers instantly.",
    image: "https://images.unsplash.com/photo-1554224155-1696413575b3?auto=format&fit=crop&q=80&w=1200",
    icon: <PackageCheck className="w-8 h-8" />,
  },
  {
    title: "Cold-Chain Logistics",
    description: "Real-time tracking of medications from the manufacturer directly to the ward.",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1200",
    icon: <Truck className="w-8 h-8" />,
  },
]

export default function SigninPage() {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [carouselIndex, setCarouselIndex] = useState(0)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(signinSchema),
    defaultValues: { email: "", password: "" },
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev === CAROUSEL_ITEMS.length - 1 ? 0 : prev + 1))
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
    <section className="min-h-screen flex bg-white font-sora overflow-hidden">
      <div className="w-full lg:w-[48%] bg-white flex flex-col min-h-screen overflow-y-auto px-6 py-8 lg:px-16 lg:py-10">
        <div className="max-w-md w-full mx-auto my-auto">
          {/* Mobile Logo */}
          <Link href="/" className="lg:hidden mb-10 w-fit flex items-center gap-3 select-none">
            <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center">
              <Image src="/logo.png" width={36} height={36} alt="Logo" className="object-cover" unoptimized priority />
            </div>
            <div className="flex flex-col leading-none">
              <h3 className="text-2xl bg-linear-to-r from-blue-600 via-cyan-500 to-emerald-500 bg-clip-text text-transparent font-black tracking-tight">
                MedSupply
              </h3>
              <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-semibold">
                Procurement Platform
              </span>
            </div>
          </Link>

          {/* Header */}
          <div className="space-y-3 mb-10">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Welcome back</h1>
            <p className="text-slate-500 leading-relaxed text-base">
              Sign in to continue managing procurement workflows, suppliers,
              inventory, and pharmaceutical orders.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <InputField label="Email Address" placeholder="john@example.com" icon={<Mail className="w-4 h-4" />} error={errors.email?.message} registration={register("email")} />
            <InputField label="Password" placeholder="••••••••" type={showPassword ? "text" : "password"} icon={<Lock className="w-4 h-4" />} error={errors.password?.message} registration={register("password")} isPassword showPassword={showPassword} togglePassword={() => setShowPassword(!showPassword)} />

            <div className="flex items-center justify-between gap-4">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                <span className="text-sm text-slate-600 font-medium">Remember me</span>
              </label>

              <Link href="/forgot-password" className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                Forgot password?
              </Link>
            </div>
            <Button type="submit" disabled={isPending} className="w-full h-14 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-base font-semibold">
              {isPending ? "Signing in..." : "Sign In"}
              {!isPending && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* =========================================================
          RIGHT SIDE — IMAGE CAROUSEL
      ========================================================= */}
      <div className="hidden lg:block lg:w-[52%] relative overflow-hidden bg-slate-950">
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
              style={{ backgroundImage: `url(${CAROUSEL_ITEMS[carouselIndex].image})` }}
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-linear-to-br from-blue-950/90 via-slate-950/60 to-slate-950/85" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.25),transparent_40%)]" />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-between p-14">
              <div className="flex items-center gap-3 select-none" onContextMenu={(e) => e.preventDefault()}>
                <Link href="/" className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl overflow-hidden flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/10">
                    <Image src="/logo.png" width={36} height={36} alt="Logo" className="object-cover" unoptimized priority />
                  </div>
                  <div className="flex flex-col leading-none">
                    <h1 className="text-2xl font-black tracking-tight text-white">MedSupply</h1>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-slate-300 font-semibold">Procurement Platform</span>
                  </div>
                </Link>
              </div>

              {/* Carousel Content */}
              <div className="relative z-10 max-w-xl">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }} className="space-y-8">
                  <div className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/15 flex items-center justify-center text-white shadow-2xl">
                    {CAROUSEL_ITEMS[carouselIndex].icon}
                  </div>
                  <div className="space-y-5">
                    <h2 className="text-5xl font-black tracking-tight leading-tight text-white">
                      {CAROUSEL_ITEMS[carouselIndex].title}
                    </h2>
                    <p className="text-xl leading-relaxed text-blue-50/90 font-medium max-w-lg">
                      {CAROUSEL_ITEMS[carouselIndex].description}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 pt-2">
                    {CAROUSEL_ITEMS.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setCarouselIndex(i)}
                        className={cn("h-1.5 rounded-full transition-all duration-500", i === carouselIndex ? "w-10 bg-cyan-400" : "w-2 bg-white/30 hover:bg-white/50")}
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

function InputField({ label, placeholder, icon, error, type = "text", registration, isPassword, showPassword, togglePassword }: InputFieldProps) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-semibold text-slate-700 ml-1">{label}</Label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">{icon}</div>
        <Input {...registration} type={type} placeholder={placeholder} className={cn("h-12 pl-12 pr-12 rounded-xl bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-600/20 transition-all", error && "border-red-500 focus:ring-red-500/20")} />
        {isPassword && (
          <button type="button" onClick={togglePassword} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {error && <p className="text-xs font-medium text-red-500 ml-1">{error}</p>}
    </div>
  )
}

interface InputFieldProps {
  label: string; placeholder: string; icon: React.ReactNode; error?: string; type?: string; registration: UseFormRegisterReturn; isPassword?: boolean; showPassword?: boolean; togglePassword?: () => void;
}
