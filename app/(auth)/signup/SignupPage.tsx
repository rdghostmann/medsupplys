// (auth)/signup/Signup.tsx

"use client"

import React, { useState, useTransition } from "react"

import { z } from "zod"

import { useForm, Controller } from "react-hook-form"

import { zodResolver } from "@hookform/resolvers/zod"

import { motion, AnimatePresence } from "framer-motion"

import {
  User,
  Mail,
  Phone,
  Lock,
  Building,
  Globe,
  Eye,
  EyeOff,
  Briefcase,
  CheckCircle2,
} from "lucide-react"

import PhoneInput, {
  isValidPhoneNumber,
  parsePhoneNumber,
} from "react-phone-number-input"

import countryNames from "react-phone-number-input/locale/en.json"

import { Input } from "@/components/ui/input"

import { Button } from "@/components/ui/button"

import { Label } from "@/components/ui/label"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { toast } from "sonner"

import { cn } from "@/lib/utils"

import { useRouter } from "next/navigation"

import Link from "next/link"

import { UseFormReturn } from "react-hook-form"

// IMPORT signIn to auto-login after signup
import { signIn } from "next-auth/react"
import { MedSupplyLogo } from "@/components/ui/MedSupplyLogo"

/* =========================================================
   VALIDATION SCHEMA
========================================================= */

const onboardingSchema = z
  .object({
    role: z.enum(["buyer", "supplier"]),

    firstName: z.string().min(2, "First name is required"),

    lastName: z.string().min(2, "Last name is required"),

    phone: z.string().refine((value) => isValidPhoneNumber(value), {
      message: "Invalid phone number",
    }),

    email: z.string().email("Invalid email address"),

    password: z.string().min(8, "Password must be at least 8 characters"),

    confirmPassword: z.string(),

    organizationName: z.string().min(2, "Organization name is required"),

    organizationType: z.string().min(1, "Please select an organization type"),

    roleInOrganization: z.string().min(1, "Please select your role"),

    country: z.string().min(1, "Country is required"),

    /*
     * Both fields are maintained in the form because
     * the registration API expects both values.
     *
     * The UI uses one checkbox to set both to true.
     */
    agreeToTerms: z
      .boolean()
      .refine(
        (value) => value === true,
        "You must agree to the Terms & Conditions"
      ),

    agreeToPrivacy: z
      .boolean()
      .refine(
        (value) => value === true,
        "You must agree to the Privacy Policy"
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

/* =========================================================
   FORM TYPE
========================================================= */

type FormData = z.infer<typeof onboardingSchema>

/* =========================================================
   PAGE
========================================================= */

export default function SignupPage() {
  const router = useRouter()

  const [step, setStep] = useState(1)

  const [isPending, startTransition] = useTransition()

  const [showPassword, setShowPassword] = useState(false)

  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [detectedCountry, setDetectedCountry] = useState("")

  /* =======================================================
     FORM
  ======================================================= */

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

      agreeToPrivacy: false,
    },
  })

  const {
    watch,
    trigger,
    handleSubmit,
    control,
    setValue,
    register,
    formState: { errors },
  } = form

  const role = watch("role")

  /*
   * Both consent fields must be true for the checkbox
   * to display as checked.
   */
  const agreeToTerms = watch("agreeToTerms")

  const agreeToPrivacy = watch("agreeToPrivacy")

  const consentChecked = agreeToTerms && agreeToPrivacy

  /* =======================================================
     PHONE HANDLER
  ======================================================= */

  const handlePhoneChange = (
    value: string | undefined,
    onChange: (v: string) => void
  ) => {
    const phone = value || ""

    onChange(phone)

    if (phone && isValidPhoneNumber(phone)) {
      try {
        const parsed = parsePhoneNumber(phone)

        const code = parsed?.country

        const name = code ? (countryNames as Record<string, string>)[code] : ""

        if (name) {
          setDetectedCountry(name)

          setValue("country", name, {
            shouldValidate: true,
          })
        }
      } catch {
        // Ignore invalid parsing
      }
    } else {
      setDetectedCountry("")

      setValue("country", "", {
        shouldValidate: false,
      })
    }
  }

  /* =======================================================
     NEXT STEP
  ======================================================= */

  const nextStep = async () => {
    const fields: Record<number, (keyof FormData)[]> = {
      1: ["role"],

      2: [
        "firstName",
        "lastName",
        "email",
        "phone",
        "password",
        "confirmPassword",
      ],

      3: [
        "organizationName",
        "organizationType",
        "roleInOrganization",
        "country",
        "agreeToTerms",
        "agreeToPrivacy",
      ],
    }

    const valid = await trigger(fields[step])

    if (valid) {
      setStep((s) => Math.min(s + 1, 3))
    }
  }

  /* =======================================================
     PREVIOUS STEP
  ======================================================= */

  const prevStep = () => {
    setStep((s) => Math.max(s - 1, 1))
  }

  /* =======================================================
     SUBMIT
  ======================================================= */

  const onSubmit = (values: FormData) => {
    startTransition(async () => {
      try {
        /* ------------------------------------------------
               Pre-flight validation
            ------------------------------------------------ */

        if (!values.email?.trim() || !values.password?.trim()) {
          toast.error("Email and password are required")

          return
        }

        /*
         * Final client-side consent guard.
         *
         * Both values should always be true because
         * they are controlled by the same checkbox.
         */
        if (!values.agreeToTerms || !values.agreeToPrivacy) {
          toast.error(
            "You must agree to the Terms & Conditions and Privacy Policy"
          )

          return
        }

        /* ------------------------------------------------
               Registration API
            ------------------------------------------------ */

        const response = await fetch("/api/register", {
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

        /* ------------------------------------------------
               Auto-login after registration
            ------------------------------------------------ */

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

        const errorMessage =
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again."

        toast.error(errorMessage)
      }
    })
  }

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <section className="font-sora flex h-screen bg-white">
      {/* =====================================================
          LEFT SIDE
      ===================================================== */}

      <div className="relative hidden items-center justify-center overflow-hidden bg-blue-700 p-12 lg:flex lg:w-[45%]">
        <div className="absolute inset-0 bg-linear-to-br from-blue-600 via-blue-700 to-indigo-900 opacity-90" />

        <div className="relative z-10 w-full max-w-md">
          <div className="space-y-8">
            <h2 className="text-4xl leading-tight font-semibold text-white">
              {role === "buyer"
                ? "Submit your medicine and health product needs."
                : "Browse procurement opportunities."}
            </h2>
          </div>
        </div>
      </div>

      {/* =====================================================
          RIGHT SIDE
      ===================================================== */}

      <div className="flex min-h-screen w-full flex-col overflow-y-auto bg-white p-8 lg:w-[55%] lg:p-16">
        <div className="mx-auto my-auto w-full max-w-md py-8">
          {/* Header with MedSupply Logo */}
          <div className="text-center">
            <button
              onClick={() => router.push("/")}
              className="group mb-4 inline-flex cursor-pointer items-center justify-center"
            >
              <MedSupplyLogo variant="horizontal" size="md" />
            </button>

            <h2 className="hidden text-2xl font-extrabold tracking-tight text-slate-900">
              Create an Enterprise Account
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Join Nigeria&apos;s trusted B2B pharmaceutical procurement network
            </p>
            {/* =================================================
              TITLE
          ================================================= */}

            <div className="my-10 text-center lg:text-left">
              <h1 className="mb-2 text-4xl font-semibold text-slate-900">
                I am looking to...
              </h1>
            </div>
          </div>

          {/* =================================================
              FORM
          ================================================= */}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{
                  opacity: 0,
                  x: 20,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                exit={{
                  opacity: 0,
                  x: -20,
                }}
                transition={{
                  duration: 0.2,
                }}
                className="space-y-6"
              >
                {/* =================================================
                    STEP 1
                ================================================= */}

                {step === 1 && (
                  <div className="animate-in space-y-4 duration-500 fade-in slide-in-from-right-4">
                    <RoleCard
                      active={role === "buyer"}
                      onClick={() => setValue("role", "buyer")}
                      title="Procure Medicines"
                      description="Post your requirements and receive competitive bids from qualified suppliers"
                    />

                    <RoleCard
                      active={role === "supplier"}
                      onClick={() => setValue("role", "supplier")}
                      title="Supply Medicines"
                      description="Discover open tenders and bid on procurement opportunities"
                    />
                  </div>
                )}

                {/* =================================================
                    STEP 2
                ================================================= */}

                {step === 2 && (
                  <div className="animate-in space-y-5 duration-500 fade-in slide-in-from-right-4">
                    <div className="grid grid-cols-2 gap-4">
                      <InputField
                        form={form}
                        name="firstName"
                        label="First Name"
                        placeholder="John"
                        icon={<User className="h-4 w-4" />}
                      />

                      <InputField
                        form={form}
                        name="lastName"
                        label="Last Name"
                        placeholder="Doe"
                        icon={<User className="h-4 w-4" />}
                      />
                    </div>

                    <InputField
                      form={form}
                      name="email"
                      label="Email Address"
                      placeholder="john@example.com"
                      icon={<Mail className="h-4 w-4" />}
                    />

                    <Controller
                      control={control}
                      name="phone"
                      render={({ field }) => (
                        <div className="space-y-1.5">
                          <Label className="text-sm">Phone Number</Label>

                          <div
                            className={cn(
                              "flex items-center rounded-md border border-input bg-background px-3",
                              errors.phone && "border-red-500"
                            )}
                          >
                            <Phone className="mr-2 h-4 w-4 text-slate-400" />

                            <PhoneInput
                              international
                              defaultCountry="NG"
                              value={field.value}
                              onChange={(value) =>
                                handlePhoneChange(value, field.onChange)
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
                      <InputField
                        form={form}
                        name="password"
                        type={showPassword ? "text" : "password"}
                        label="Password"
                        placeholder="••••••••"
                        icon={<Lock className="h-4 w-4" />}
                        isPassword
                        showPassword={showPassword}
                        togglePassword={() => setShowPassword(!showPassword)}
                      />

                      <InputField
                        form={form}
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        label="Confirm Password"
                        placeholder="••••••••"
                        icon={<Lock className="h-4 w-4" />}
                        isPassword
                        showPassword={showConfirmPassword}
                        togglePassword={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      />
                    </div>
                  </div>
                )}

                {/* =================================================
                    STEP 3
                ================================================= */}

                {step === 3 && (
                  <div className="animate-in space-y-5 duration-500 fade-in slide-in-from-right-4">
                    <InputField
                      form={form}
                      name="organizationName"
                      label="Organization / Facility Name *"
                      placeholder="MedHealth Solutions"
                      icon={<Building className="h-4 w-4" />}
                    />

                    <SelectField
                      form={form}
                      name="organizationType"
                      label="Organization Type"
                      placeholder="Select type"
                      icon={<Building className="h-4 w-4" />}
                      options={[
                        {
                          label: "Manufacturer",
                          value: "manufacturer",
                        },
                        {
                          label: "Distributor",
                          value: "distributor",
                        },
                        {
                          label: "Wholesaler",
                          value: "wholesaler",
                        },
                        {
                          label: "Retail Pharmacy Chain",
                          value: "pharmacy",
                        },
                      ]}
                    />

                    <SelectField
                      form={form}
                      name="roleInOrganization"
                      label="Your Role"
                      placeholder="Select your role"
                      icon={<Briefcase className="h-4 w-4" />}
                      options={[
                        {
                          label: "Supply Chain & Export",
                          value: "Supply Chain & Export",
                        },
                        {
                          label: "Procurement Officer",
                          value: "Procurement Officer",
                        },
                      ]}
                    />

                    <InputField
                      form={form}
                      name="country"
                      label="Country"
                      placeholder="e.g Nigeria"
                      icon={<Globe className="h-4 w-4" />}
                      readOnly={!!detectedCountry}
                    />

                    {/* =================================================
                        TERMS + PRIVACY CONSENT
                    ================================================= */}

                    <div className="pt-2">
                      <div className="flex items-start gap-3">
                        {/* ---------------------------------------------
                            Checkbox
                        --------------------------------------------- */}

                        <div className="mt-0.5 flex h-5 shrink-0 items-center">
                          <input
                            {...register("agreeToTerms")}
                            type="checkbox"
                            id="terms-privacy"
                            checked={consentChecked}
                            onChange={(event) => {
                              const checked = event.target.checked

                              /*
                               * One checkbox controls both
                               * legal consent fields.
                               */
                              setValue("agreeToTerms", checked, {
                                shouldValidate: true,
                                shouldDirty: true,
                              })

                              setValue("agreeToPrivacy", checked, {
                                shouldValidate: true,
                                shouldDirty: true,
                              })
                            }}
                            className="h-5 w-5 cursor-pointer rounded border-slate-300 text-blue-600 transition-all focus:ring-blue-500"
                          />
                        </div>

                        {/* ---------------------------------------------
                            Consent Text
                        --------------------------------------------- */}

                        <label
                          htmlFor="terms-privacy"
                          className="cursor-pointer text-sm leading-relaxed font-medium text-slate-500"
                        >
                          I agree to the{" "}
                          <Link
                            href="/terms"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-slate-900 hover:underline"
                          >
                            Terms & Conditions
                          </Link>{" "}
                          and{" "}
                          <Link
                            href="/privacy"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-slate-900 hover:underline"
                          >
                            Privacy Policy
                          </Link>
                          .
                        </label>
                      </div>

                      {/* ---------------------------------------------
                          Validation Errors
                      --------------------------------------------- */}

                      {(errors.agreeToTerms || errors.agreeToPrivacy) && (
                        <p className="mt-2 ml-8 text-xs font-medium text-red-500">
                          You must agree to the Terms & Conditions and Privacy
                          Policy.
                        </p>
                      )}
                    </div>

                    {/* =================================================
                        SUBMIT
                    ================================================= */}

                    <div className="pt-4">
                      <Button
                        type="submit"
                        disabled={isPending}
                        className="h-14 w-full rounded-md bg-blue-600 text-lg font-semibold text-white hover:bg-blue-700"
                      >
                        {isPending ? "Processing..." : "Complete Signup"}
                      </Button>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* =====================================================
                NAVIGATION
            ===================================================== */}

            <div className="flex flex-col gap-4 pt-4">
              {step < 3 && (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="h-14 w-full bg-blue-700 text-white"
                >
                  Continue
                </Button>
              )}

              {step > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={prevStep}
                  className="h-12 w-full text-slate-500"
                >
                  Go Back
                </Button>
              )}
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
  form: UseFormReturn<FormData>
  name: keyof FormData
  label: string
  icon: React.ReactNode
  placeholder: string
  type?: string
  isPassword?: boolean
  showPassword?: boolean
  togglePassword?: () => void
  readOnly?: boolean
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
  const {
    register,
    formState: { errors },
  } = form

  const error = errors[name]?.message as string | undefined

  return (
    <div className="space-y-1.5">
      <Label className="text-sm">{label}</Label>

      <div className="relative">
        <div className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400">
          {icon}
        </div>

        <Input
          {...register(name)}
          type={type}
          placeholder={placeholder}
          readOnly={readOnly}
          className={cn("h-12 pl-12", error && "border-red-500")}
        />

        {isPassword && (
          <button
            type="button"
            onClick={togglePassword}
            className="absolute top-1/2 right-4 -translate-y-1/2"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        )}
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}
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
  form: UseFormReturn<FormData>
  name: keyof FormData
  label: string
  icon: React.ReactNode
  placeholder: string
  options: SelectOption[]
}

function SelectField({
  form,
  name,
  label,
  icon,
  placeholder,
  options,
}: SelectFieldProps) {
  const {
    control,
    formState: { errors },
  } = form

  const error = errors[name]?.message as string | undefined

  return (
    <div className="space-y-1.5">
      <Label className="text-sm">{label}</Label>

      <div className="relative">
        <div className="pointer-events-none absolute top-1/2 left-4 z-10 -translate-y-1/2 text-slate-400">
          {icon}
        </div>

        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <Select
              onValueChange={field.onChange}
              value={
                typeof field.value === "string"
                  ? field.value
                  : String(field.value || "")
              }
            >
              <SelectTrigger
                className={cn("h-12 pl-12", error && "border-red-500")}
              >
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

      {error && <p className="text-xs text-red-500">{error}</p>}
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
      className={`flex w-full justify-between gap-5 rounded-xl border-2 p-6 text-left transition-all ${
        active ? "border-blue-700 bg-blue-50" : "border-slate-100"
      }`}
    >
      <div>
        <h4 className="font-semibold">{title}</h4>

        <p className="text-sm text-slate-500">{description}</p>
      </div>

      <div
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
          active ? "border-blue-700 bg-blue-700" : "border-slate-200"
        }`}
      >
        {active && <CheckCircle2 className="h-4 w-4 text-white" />}
      </div>
    </button>
  )
}
