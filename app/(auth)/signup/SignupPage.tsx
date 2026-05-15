// (auth)/signup/OnboardingUser.tsx (Sign Up Component)
"use client"

import React, { useState, useTransition, useEffect, ReactNode } from "react"
import { z } from "zod"
import { useForm, Controller, FieldValues } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion, AnimatePresence } from "framer-motion"
import {
  User, Mail, Phone, Lock, Building, Globe, Eye, EyeOff,
  Briefcase, MapPin, CheckCircle2
} from "lucide-react"

import PhoneInput, { isValidPhoneNumber, parsePhoneNumber } from 'react-phone-number-input'
import countryNames from 'react-phone-number-input/locale/en.json'
import 'react-phone-number-input/style.css';

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"

import { UseFormReturn } from "react-hook-form";


// IMPORT signIn to auto-login after signup
import { signIn } from "next-auth/react"

const onboardingSchema = z.object({
  role: z.enum(["buyer", "supplier"]),
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  phone: z
    .string()
    .refine(
      (value) => isValidPhoneNumber(value),
      {
        message: "Invalid phone number",
      }
    ), email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  organizationName: z.string().min(2, "Organization name is required"),
  organizationType: z.string().min(1, "Please select an organization type"),
  roleInOrganization: z.string().min(1, "Please select your role"),
  country: z.string().min(1, "Country is required"),
  agreeToTerms: z.boolean().refine(val => val === true, 'You must agree to the terms'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

type FormData = z.infer<typeof onboardingSchema>

export default function SignupPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isPending, startTransition] = useTransition()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [detectedCountry, setDetectedCountry] = useState("")

  const form = useForm<FormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      role: "buyer",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      organizationName: "",
      organizationType: "",
      roleInOrganization: "",
      country: "",
      agreeToTerms: false,
    },
  })

  const { watch, trigger, handleSubmit, control, setValue, register, formState: { errors } } = form
  const role = watch("role")

  const handlePhoneChange = (value: string | undefined, onChange: (v: string) => void) => {
    const phone = value || ''
    onChange(phone)
    if (phone && isValidPhoneNumber(phone)) {
      try {
        const parsed = parsePhoneNumber(phone)
        const code = parsed?.country
        const name = code ? (countryNames as Record<string, string>)[code] : ''
        if (name) {
          setDetectedCountry(name)
          setValue('country', name, { shouldValidate: true })
        }
      } catch { }
    } else {
      setDetectedCountry('')
      setValue('country', '', { shouldValidate: false })
    }
  }

  const nextStep = async () => {
    const fields: Record<number, (keyof FormData)[]> = {
      1: ["role"],
      2: ["firstName", "lastName", "email", "phone", "password", "confirmPassword"],
      3: ["organizationName", "organizationType", "roleInOrganization", "country", "agreeToTerms"],
    }
    const valid = await trigger(fields[step])
    if (valid) setStep((s) => Math.min(s + 1, 3))
  }

  const prevStep = () => setStep((s) => Math.max(s - 1, 1))

  const onSubmit = (values: FormData) => {
    startTransition(async () => {
      try {
        // Pre-flight validation
        if (!values.email?.trim() || !values.password?.trim()) {
          toast.error("Email and password are required")
          return
        }

        const response = await fetch("/api/onboarding", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        })

        const contentType = response.headers.get("content-type")
        if (!contentType?.includes("application/json")) {
          throw new Error("Invalid server response received")
        }

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || "Registration failed")
        }

        toast.success("Registration successful")

        // Auto-login after successful registration
        const signInResponse = await signIn("credentials", {
          email: values.email.trim().toLowerCase(),
          password: values.password,
          redirect: false,
        })

        if (!signInResponse?.ok || signInResponse?.error) {
          toast.warning("Please sign in with your credentials")
          router.push("/signin")
          return
        }

        toast.success("Authenticated successfully")
        router.refresh()
        router.push(values.role === "supplier" ? "/supplier" : "/buyer")
      } catch (error) {
        console.error("SIGNUP_ERROR:", error)
        const errorMessage = error instanceof Error ? error.message : "Something went wrong. Please try again."
        toast.error(errorMessage)
      }
    })
  }

  return (
    <section className="h-screen flex bg-white font-sora">
      {/* LEFT SIDE OMITTED FOR BREVITY (Kept identical to your provided code) */}
      <div className="hidden lg:flex lg:w-[45%] bg-blue-700 p-12 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-blue-600 via-blue-700 to-indigo-900 opacity-90" />
        <div className="relative z-10 w-full max-w-md">
          <div className="space-y-8">
            <h2 className="text-4xl font-semibold text-white leading-tight">
              {role === 'buyer' ? "Submit your medicine and health product needs." : "Browse procurement opportunities."}
            </h2>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-[55%] p-8 lg:p-16 flex flex-col min-h-screen overflow-y-auto bg-white">
        <div className="max-w-md mx-auto w-full my-auto py-8">
          <Link href="/" className="mb-5 w-fit mx-auto cursor-pointer flex items-center font-sora font-bold text-lg">
            <h3 className="text-2xl bg-linear-to-r from-blue-600 via-teal-500 to-emerald-500 bg-clip-text font-extrabold tracking-tight text-transparent">
              MedSupply
            </h3>
          </Link>
          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-4xl font-semibold text-slate-900 mb-2">I am looking to...</h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <AnimatePresence mode="wait">
              <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} className="space-y-6">

                {step === 1 && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                    <RoleCard active={role === "buyer"} onClick={() => setValue("role", "buyer")} title="Procure Medicines" description="Post your requirements and receive competitive bids from qualified suppliers" />
                    <RoleCard active={role === "supplier"} onClick={() => setValue("role", "supplier")} title="Supply Medicines" description="Discover open tenders and bid on procurement opportunities" />
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="grid grid-cols-2 gap-4">
                      <InputField form={form} name="firstName" label="First Name" placeholder="John" icon={<User className="w-4 h-4" />} />
                      <InputField form={form} name="lastName" label="Last Name" placeholder="Doe" icon={<User className="w-4 h-4" />} />
                    </div>
                    <InputField form={form} name="email" label="Email Address" placeholder="john@example.com" icon={<Mail className="w-4 h-4" />} />
                    <Controller
                      control={control}
                      name="phone"
                      render={({ field }) => (
                        <div className="space-y-1.5">
                          <Label className="text-sm">
                            Phone Number
                          </Label>

                          <div
                            className={cn(
                              "flex items-center rounded-md border border-input bg-background px-3",
                              errors.phone && "border-red-500"
                            )}
                          >
                            <Phone className="w-4 h-4 text-slate-400 mr-2" />

                            <PhoneInput
                              international
                              defaultCountry="NG"
                              value={field.value}
                              onChange={(value) =>
                                handlePhoneChange(
                                  value,
                                  field.onChange
                                )
                              }
                              className="w-full py-3 outline-none"
                            />
                          </div>

                          {errors.phone && (
                            <p className="text-xs text-red-500">
                              {errors.phone.message}
                            </p>
                          )}
                        </div>
                      )}
                    />
                    <div className="grid grid-cols-1 gap-4">
                      <InputField form={form} name="password" type={showPassword ? "text" : "password"} label="Password" placeholder="••••••••" icon={<Lock className="w-4 h-4" />} isPassword showPassword={showPassword} togglePassword={() => setShowPassword(!showPassword)} />
                      <InputField form={form} name="confirmPassword" type={showConfirmPassword ? "text" : "password"} label="Confirm Password" placeholder="••••••••" icon={<Lock className="w-4 h-4" />} isPassword showPassword={showConfirmPassword} togglePassword={() => setShowConfirmPassword(!showConfirmPassword)} />
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
                    <InputField form={form} name="organizationName" label="Organization Name" placeholder="MedHealth Solutions" icon={<Building className="w-4 h-4" />} />

                    {/* FIXED: Values are now lowercase to strictly match your Mongoose Schema */}
                    <SelectField
                      form={form} name="organizationType" label="Organization Type" placeholder="Select type" icon={<Building className="w-4 h-4" />}
                      options={[
                        { label: "Manufacturer", value: "manufacturer" },
                        { label: "Distributor", value: "distributor" },
                        { label: "Wholesaler", value: "wholesaler" },
                        { label: "Retail Pharmacy", value: "pharmacy" }
                      ]}
                    />

                    <SelectField
                      form={form} name="roleInOrganization" label="Your Role" placeholder="Select your role" icon={<Briefcase className="w-4 h-4" />}
                      options={[
                        { label: "Supply Chain & Export", value: "Supply Chain & Export" },
                        { label: "Procurement Officer", value: "Procurement Officer" }
                      ]}
                    />

                    <InputField form={form} name="country" label="Country" placeholder="e.g Nigeria" icon={<Globe className="w-4 h-4" />} readOnly={!!detectedCountry} />

                    <div className="flex items-start gap-3 pt-2">
                      <div className="flex items-center h-5 mt-0.5">
                        <input {...register('agreeToTerms')} type="checkbox" id="terms" className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 transition-all cursor-pointer" />
                      </div>
                      <label htmlFor="terms" className="text-sm text-slate-500 font-medium cursor-pointer leading-relaxed">
                        I agree to the <a href="#" className="text-slate-900 font-semibold hover:underline">Terms & Conditions</a>
                      </label>
                    </div>
                    {errors.agreeToTerms && <p className="text-red-500 text-xs font-medium ml-8">{errors.agreeToTerms.message}</p>}

                    <div className="pt-4">
                      <Button type="submit" disabled={isPending} className="w-full h-14 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold">
                        {isPending ? "Processing..." : "Complete Signup"}
                      </Button>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="flex flex-col gap-4 pt-4">
              {step < 3 && <Button type="button" onClick={nextStep} className="w-full h-14 bg-blue-700 text-white">Continue</Button>}
              {step > 1 && <Button type="button" variant="ghost" onClick={prevStep} className="w-full h-12 text-slate-500">Go Back</Button>}
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}


/* =========================================================
   INPUT FIELD INTERFACE & COMPONENT
========================================================= */
interface InputFieldProps {
  form: UseFormReturn<FormData>;
  name: keyof FormData; // This ensures 'name' must be a valid key of your schema
  label: string;
  icon: React.ReactNode;
  placeholder: string;
  type?: string;
  isPassword?: boolean;
  showPassword?: boolean;
  togglePassword?: () => void;
  readOnly?: boolean;
}

function InputField({
  form,
  name,
  label,
  icon,
  placeholder,
  type = "text",
  isPassword,
  showPassword,
  togglePassword,
  readOnly,
}: InputFieldProps) {
  // Now 'register' and 'errors' are strictly typed
  const { register, formState: { errors } } = form;
  const error = errors[name]?.message as string | undefined;

  return (
    <div className="space-y-1.5">
      <Label className="text-sm">{label}</Label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">{icon}</div>
        <Input
          {...register(name)}
          type={type}
          placeholder={placeholder}
          readOnly={readOnly}
          className={cn("pl-12 h-12", error && "border-red-500")}
        />
        {isPassword && (
          <button
            type="button"
            onClick={togglePassword}
            className="absolute right-4 top-1/2 -translate-y-1/2"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  )
}

/* =========================================================
   SELECT OPTION INTERFACE & SELECT FIELD COMPONENT
========================================================= */
interface SelectOption {
  label: string
  value: string
}

interface SelectFieldProps {
  form: UseFormReturn<FormData>;
  name: keyof FormData; // Same type-safety here
  label: string;
  icon: React.ReactNode;
  placeholder: string;
  options: SelectOption[];
}


function SelectField({
  form,
  name,
  label,
  icon,
  placeholder,
  options,
}: SelectFieldProps) {
  const { control, formState: { errors } } = form;
  const error = errors[name]?.message as string | undefined;

  return (
    <div className="space-y-1.5">
      <Label className="text-sm">{label}</Label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10 pointer-events-none">{icon}</div>
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <Select
              onValueChange={field.onChange}
              // FIX: Cast field.value to string, or fallback to "" if it's undefined
              value={typeof field.value === 'string' ? field.value : String(field.value || "")}
            >
              <SelectTrigger className={cn("pl-12 h-12", error && "border-red-500")}>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {options.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  )
}


/* =========================================================
   ROLE CARD INTERFACE & COMPONENT
========================================================= */
interface RoleCardProps {
  active: boolean
  onClick: () => void
  title: string
  description: string
}

function RoleCard({ active, onClick, title, description }: RoleCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full p-6 text-left flex justify-between gap-5 border-2 rounded-xl transition-all ${active ? "border-blue-700 bg-blue-50" : "border-slate-100"
        }`}
    >
      <div>
        <h4 className="font-semibold">{title}</h4>
        <p className="text-sm text-slate-500">{description}</p>
      </div>
      <div
        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${active ? "border-blue-700 bg-blue-700" : "border-slate-200"
          }`}
      >
        {active && <CheckCircle2 className="w-4 h-4 text-white" />}
      </div>
    </button>
  )
}