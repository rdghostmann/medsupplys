// CreatditProductModal.tsx

"use client"

import React, { useMemo, useRef, useState } from "react"

import {
  Package,
  X,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Pill,
  DollarSign,
  Thermometer,
  Info,
  ArrowRight,
  ArrowLeft,
  SlidersHorizontal,
  Image as ImageIcon,
} from "lucide-react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import type { MasterProduct, ProductStatus } from "@/types"
import { DOSAGE_FORM_GROUPS, PACK_SIZE_GROUPS } from "@/lib/catalogOptions"
import { CATEGORIES } from "@/lib/categories"

/* =========================================================
   TYPES
========================================================= */

export interface ProductFormData {
  emoji?: string
  image?: string

  name: string
  category: string
  description: string

  activeIngredient: string
  strength: string
  dosageForm: string

  unit: string
  packSize: string

  referenceBasePrice: number
  commissionPercent: number
  maxMarkupPercent: number

  status: ProductStatus

  storageCondition: string
}

interface CreateEditProductModalProps {
  isCreateEditModalOpen: boolean
  setIsCreateEditModalOpen: (open: boolean) => void

  editingProduct: MasterProduct | null

  onSaveProduct: (
    productData: ProductFormData,
    id?: string
  ) => void | Promise<void>
}

/* =========================================================
   CONSTANTS
========================================================= */

const EMOJI_OPTIONS = [
  "💊",
  "💉",
  "🧴",
  "🩹",
  "🧪",
  "🫁",
  "🩺",
  "🧬",
  "🌡️",
  "🧫",
  "🩸",
  "🧻",
]

const PRODUCT_STATUSES: {
  label: string
  value: ProductStatus
  description: string
}[] = [
  {
    label: "Active",
    value: "ACTIVE" as ProductStatus,
    description: "Product is available in the master catalogue",
  },
  {
    label: "Inactive",
    value: "INACTIVE" as ProductStatus,
    description: "Product is temporarily unavailable",
  },
  {
    label: "Archived",
    value: "ARCHIVED" as ProductStatus,
    description: "Product has been retired from the catalogue",
  },
]

const STORAGE_PRESETS = [
  "Store below 25°C in original container or protect from moisture",
  "Store at 2–8°C. Do not freeze",
  "Store below 30°C in a cool, dry place",
  "Protect from direct sunlight and excessive heat",
  "Store in a dry place at room temperature",
]

/* =========================================================
   DEFAULT FORM
========================================================= */

const DEFAULT_FORM_DATA: ProductFormData = {
  emoji: EMOJI_OPTIONS[0],
  image: "",

  name: "",
  category: "ANTI_INFECTIVES",
  description: "",

  activeIngredient: "",
  strength: "",
  dosageForm: "Oral Tablet",

  unit: "Tablets",
  packSize: "100 tablets",

  referenceBasePrice: 2500,
  commissionPercent: 5,
  maxMarkupPercent: 20,

  status: "ACTIVE" as ProductStatus,

  storageCondition:
    "Store below 25°C in original container or protect from moisture",
}

/* =========================================================
   HELPERS
========================================================= */

function flattenDosageForms() {
  return DOSAGE_FORM_GROUPS.flatMap((group) => group.options)
}

function flattenPackSizes() {
  return PACK_SIZE_GROUPS.flatMap((group) => group.options)
}

function isKnownDosageForm(value: string) {
  return flattenDosageForms().some((item) => item.value === value)
}

function isKnownPackSize(value: string) {
  return flattenPackSizes().some((item) => item.value === value)
}

/* =========================================================
   COMPONENT
========================================================= */

export default function CreateEditProductModal({
  isCreateEditModalOpen,
  setIsCreateEditModalOpen,
  editingProduct,
  onSaveProduct,
}: CreateEditProductModalProps) {
  const [formData, setFormData] = useState<ProductFormData>(() => {
    if (!editingProduct) return { ...DEFAULT_FORM_DATA }

    return {
      emoji: editingProduct.emoji ?? EMOJI_OPTIONS[0],
      image: editingProduct.image ?? "",
      name: editingProduct.name ?? "",
      category: editingProduct.category ?? "ANTI_INFECTIVES",
      description: editingProduct.description ?? "",
      activeIngredient: editingProduct.activeIngredient ?? "",
      strength: editingProduct.strength ?? "",
      dosageForm: editingProduct.dosageForm ?? "",
      unit: editingProduct.unit ?? "",
      packSize: editingProduct.packSize ?? "",
      referenceBasePrice: Number(editingProduct.referenceBasePrice ?? 0),
      commissionPercent: Number(editingProduct.commissionPercent ?? 0),
      maxMarkupPercent: Number(editingProduct.maxMarkupPercent ?? 0),
      status: editingProduct.status,
      storageCondition: editingProduct.storageCondition ?? "",
    }
  })

  const [isCustomDosage, setIsCustomDosage] = useState(() =>
    editingProduct ? !isKnownDosageForm(editingProduct.dosageForm) : false
  )

  const [isCustomPackSize, setIsCustomPackSize] = useState(() =>
    editingProduct ? !isKnownPackSize(editingProduct.packSize) : false
  )

  const [isSubmitting, setIsSubmitting] = useState(false)

  const [errorMessage, setErrorMessage] = useState("")

  const [activeSectionIndex, setActiveSectionIndex] = useState(0)

  const horizontalScrollRef = useRef<HTMLDivElement | null>(null)

  const sectionRefs = useRef<(HTMLDivElement | null)[]>([])

  /* =======================================================
     MEMOS
  ======================================================= */

  const packSizes = useMemo(() => flattenPackSizes(), [])

  const isEditing = Boolean(editingProduct)

  /* =======================================================
     SECTION NAVIGATION
  ======================================================= */

  const sections = [
    {
      id: "identity",
      label: "Product Identity",
      icon: Package,
    },
    {
      id: "formulation",
      label: "Formulation & Packaging",
      icon: Pill,
    },
    {
      id: "regulatory",
      label: "Regulatory & Storage",
      icon: ShieldCheck,
    },
    {
      id: "pricing",
      label: "Pricing & Monetization",
      icon: DollarSign,
    },
  ]

  const scrollToSection = (index: number) => {
    const container = horizontalScrollRef.current

    const target = sectionRefs.current[index]

    if (!container || !target) return

    const left = target.offsetLeft - container.offsetLeft - 16

    container.scrollTo({
      left,
      behavior: "smooth",
    })

    setActiveSectionIndex(index)
  }

  const goNext = () => {
    if (activeSectionIndex < sections.length - 1) {
      scrollToSection(activeSectionIndex + 1)
    }
  }

  const goPrevious = () => {
    if (activeSectionIndex > 0) {
      scrollToSection(activeSectionIndex - 1)
    }
  }

  /* =======================================================
     SCROLL TRACKING
  ======================================================= */

  const handleScroll = () => {
    const container = horizontalScrollRef.current

    if (!container) return

    const containerCenter = container.scrollLeft + container.clientWidth / 2

    let closestIndex = 0
    let closestDistance = Infinity

    sectionRefs.current.forEach((section, index) => {
      if (!section) return

      const sectionCenter = section.offsetLeft + section.offsetWidth / 2

      const distance = Math.abs(containerCenter - sectionCenter)

      if (distance < closestDistance) {
        closestDistance = distance
        closestIndex = index
      }
    })

    setActiveSectionIndex(closestIndex)
  }

  /* =======================================================
     WHEEL NAVIGATION
  ======================================================= */

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    const container = horizontalScrollRef.current

    if (!container) return

    const target = event.target as HTMLElement

    const scrollArea = target.closest(".card-scroll-area")

    if (scrollArea) {
      const element = scrollArea as HTMLElement

      const canScrollVertically = element.scrollHeight > element.clientHeight

      const atTop = element.scrollTop <= 0

      const atBottom =
        Math.ceil(element.scrollTop + element.clientHeight) >=
        element.scrollHeight

      if (canScrollVertically && event.deltaY < 0 && !atTop) {
        return
      }

      if (canScrollVertically && event.deltaY > 0 && !atBottom) {
        return
      }
    }

    if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
      event.preventDefault()

      container.scrollLeft += event.deltaY
    }
  }

  /* =======================================================
     FORM UPDATE
  ======================================================= */

  const updateField = <K extends keyof ProductFormData>(
    field: K,
    value: ProductFormData[K]
  ) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }))

    setErrorMessage("")
  }

  /* =======================================================
     DOSAGE FORM
  ======================================================= */

  const handleDosageChange = (value: string) => {
    if (value === "__CUSTOM__") {
      setIsCustomDosage(true)

      updateField("dosageForm", "")

      return
    }

    setIsCustomDosage(false)

    updateField("dosageForm", value)
  }

  /* =======================================================
     PACK SIZE
  ======================================================= */

  const handlePackSizeChange = (value: string) => {
    if (value === "__CUSTOM__") {
      setIsCustomPackSize(true)

      updateField("packSize", "")

      return
    }

    const selectedPack = packSizes.find((item) => item.value === value)

    setIsCustomPackSize(false)

    updateField("packSize", value)

    if (selectedPack?.unitHint) {
      updateField("unit", selectedPack.unitHint)
    }
  }

  /* =======================================================
     VALIDATION
  ======================================================= */

  const validateForm = () => {
    if (!formData.name.trim()) {
      return "Product name is required."
    }

    if (!formData.activeIngredient.trim()) {
      return "Active ingredient is required."
    }

    if (!formData.category.trim()) {
      return "Product category is required."
    }

    if (!formData.strength.trim()) {
      return "Product strength is required."
    }

    if (!formData.dosageForm.trim()) {
      return "Dosage form is required."
    }

    if (!formData.packSize.trim()) {
      return "Pack size is required."
    }

    if (!formData.unit.trim()) {
      return "Procurement unit is required."
    }

    if (!formData.storageCondition.trim()) {
      return "Storage condition is required."
    }

    if (
      !Number.isFinite(formData.referenceBasePrice) ||
      formData.referenceBasePrice <= 0
    ) {
      return "Reference base price must be greater than zero."
    }

    if (
      !Number.isFinite(formData.commissionPercent) ||
      formData.commissionPercent < 0 ||
      formData.commissionPercent > 100
    ) {
      return "Commission must be between 0% and 100%."
    }

    if (
      !Number.isFinite(formData.maxMarkupPercent) ||
      formData.maxMarkupPercent < 0 ||
      formData.maxMarkupPercent > 100
    ) {
      return "Maximum markup must be between 0% and 100%."
    }

    return null
  }

  /* =======================================================
     SUBMIT
  ======================================================= */

  const handleSubmitProduct = async (event: React.FormEvent) => {
    event.preventDefault()

    const validationError = validateForm()

    if (validationError) {
      setErrorMessage(validationError)

      return
    }

    try {
      setIsSubmitting(true)
      setErrorMessage("")

      const payload: ProductFormData = {
        ...formData,

        name: formData.name.trim(),
        activeIngredient: formData.activeIngredient.trim(),

        category: formData.category.trim(),

        description: formData.description.trim(),

        strength: formData.strength.trim(),

        dosageForm: formData.dosageForm.trim(),

        packSize: formData.packSize.trim(),

        unit: formData.unit.trim(),

        storageCondition: formData.storageCondition.trim(),

        image: formData.image?.trim() || "",
      }

      await onSaveProduct(payload, editingProduct?.id)

      setIsCreateEditModalOpen(false)
    } catch (error) {
      console.error("Failed to save product:", error)

      setErrorMessage("Unable to save the product. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  /* =======================================================
     CLOSE
  ======================================================= */

  const handleClose = () => {
    if (isSubmitting) return

    setIsCreateEditModalOpen(false)
  }

  /* =======================================================
     PRICING CALCULATIONS
  ======================================================= */

  const referenceBasePrice = Number(formData.referenceBasePrice || 0)

  const commissionPercent = Number(formData.commissionPercent || 0)

  const maxMarkupPercent = Number(formData.maxMarkupPercent || 0)

  const platformFee = referenceBasePrice * (commissionPercent / 100)

  const hospitalSourcingCost = referenceBasePrice + platformFee

  const maximumHospitalPrice = referenceBasePrice * (1 + maxMarkupPercent / 100)

  const estimatedPlatformRevenue = platformFee

  const preflightChecks: [string, boolean][] = [
    [
      "Product identity",
      Boolean(formData.name.trim() && formData.activeIngredient.trim()),
    ],
    [
      "Product specification",
      Boolean(
        formData.strength.trim() &&
        formData.dosageForm.trim() &&
        formData.packSize.trim()
      ),
    ],

    ["Pricing configuration", referenceBasePrice > 0],
  ]

  /* =======================================================
     RENDER
  ======================================================= */

  if (!isCreateEditModalOpen) {
    return null
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-sm sm:p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          handleClose()
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-modal-title"
        className="flex h-[94vh] w-full max-w-7xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="shrink-0 border-b border-slate-200 bg-white">
          <div className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-2xl">
                {formData.emoji || "💊"}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2
                    id="product-modal-title"
                    className="truncate text-base font-semibold text-slate-900 sm:text-lg"
                  >
                    {isEditing
                      ? "Edit Master Product"
                      : "Create Master Product"}
                  </h2>

                  <span
                    className={`hidden rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wide uppercase sm:inline-flex ${
                      isEditing
                        ? "bg-amber-50 text-amber-700"
                        : "bg-emerald-50 text-emerald-700"
                    } `}
                  >
                    {isEditing ? "Editing" : "New Product"}
                  </span>
                </div>

                <p className="mt-0.5 text-xs text-slate-500">
                  Master Product Catalogue
                  {" · "}
                  {isEditing
                    ? "Update catalogue specifications"
                    : "Define the canonical product record"}
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={goPrevious}
                disabled={activeSectionIndex === 0}
                className="hidden h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 sm:flex"
                aria-label="Previous section"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={goNext}
                disabled={activeSectionIndex === sections.length - 1}
                className="hidden h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 sm:flex"
                aria-label="Next section"
              >
                <ChevronRight className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* =================================================
              SECTION NAVIGATION
          ================================================= */}

          <div className="overflow-x-auto px-4 sm:px-6">
            <div className="flex min-w-max gap-1">
              {sections.map((section, index) => {
                const Icon = section.icon

                const active = activeSectionIndex === index

                return (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => scrollToSection(index)}
                    className={`relative flex items-center gap-2 border-b-2 px-3 py-3 text-xs font-medium transition sm:px-4 ${
                      active
                        ? "border-blue-600 text-blue-700"
                        : "border-transparent text-slate-500 hover:text-slate-800"
                    } `}
                  >
                    <Icon className="h-4 w-4" />

                    <span>{section.label}</span>

                    {active && (
                      <span className="absolute bottom-0 left-1/2 h-0.5 w-8 -translate-x-1/2 bg-blue-600" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {errorMessage && (
          <div className="shrink-0 border-b border-red-100 bg-red-50 px-5 py-3 sm:px-6">
            <div className="flex items-center gap-2 text-sm font-medium text-red-700">
              <Info className="h-4 w-4 shrink-0" />

              <span>{errorMessage}</span>
            </div>
          </div>
        )}

        {/* =================================================
            FORM
        ================================================= */}

        <form
          onSubmit={handleSubmitProduct}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div
            ref={horizontalScrollRef}
            onScroll={handleScroll}
            onWheel={handleWheel}
            className="card-scroll-area flex min-h-0 flex-1 snap-x snap-mandatory [scrollbar-width:thin] gap-4 overflow-x-auto overflow-y-hidden bg-slate-50/70 p-4 sm:p-5 lg:p-6"
          >
            {/* =================================================
                SECTION 1
            ================================================= */}

            <div
              ref={(element) => {
                sectionRefs.current[0] = element
              }}
              className="flex w-[320px] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:w-[370px] lg:w-[410px]"
            >
              <div className="shrink-0 border-b border-slate-100 px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <Package className="h-4 w-4" />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      Product Identity
                    </h3>

                    <p className="text-xs text-slate-500">
                      Core catalogue identity
                    </p>
                  </div>
                </div>
              </div>

              <div className="card-scroll-area min-h-0 flex-1 space-y-5 overflow-y-auto p-5">
                {/* Product Name */}

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700">
                    Product Name
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <input
                    value={formData.name}
                    onChange={(event) =>
                      updateField("name", event.target.value)
                    }
                    placeholder="e.g. Paracetamol 500mg"
                    className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm transition outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                  />
                </div>

                {/* Emoji */}

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700">
                    Product Symbol
                  </label>

                  <Select
                    value={formData.emoji || EMOJI_OPTIONS[0]}
                    onValueChange={(value) => updateField("emoji", value)}
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Select Symbol</SelectLabel>

                        {EMOJI_OPTIONS.map((emoji) => (
                          <SelectItem key={emoji} value={emoji}>
                            <span className="mr-2 text-lg">{emoji}</span>

                            {emoji}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                {/* Image URL */}

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <ImageIcon className="h-3.5 w-3.5" />
                    Product Image URL
                  </label>

                  <input
                    value={formData.image ?? ""}
                    onChange={(event) =>
                      updateField("image", event.target.value)
                    }
                    placeholder="https://..."
                    className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm transition outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                  />

                  <p className="text-[11px] text-slate-400">
                    Optional. The emoji remains the catalogue fallback.
                  </p>
                </div>

                {/* Status */}

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700">
                    Catalogue Status
                  </label>

                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      updateField("status", value as ProductStatus)
                    }
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      {PRODUCT_STATUSES.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <p className="text-[11px] text-slate-400">
                    Controls whether this master product can be used in
                    procurement.
                  </p>
                </div>

                {/* Active Ingredient */}

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700">
                    Active Ingredient
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <input
                    value={formData.activeIngredient}
                    onChange={(event) =>
                      updateField("activeIngredient", event.target.value)
                    }
                    placeholder="e.g. Paracetamol"
                    className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm transition outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                  />
                </div>

                {/* Category */}

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700">
                    Therapeutic Category
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <Select
                    value={formData.category}
                    onValueChange={(value) => updateField("category", value)}
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Product Categories</SelectLabel>

                        {CATEGORIES.filter(
                          (category) => category.value !== "ALL"
                        ).map((category) => (
                          <SelectItem
                            key={category.value}
                            value={category.value}
                          >
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                {/* Description */}

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700">
                    Description
                  </label>

                  <textarea
                    value={formData.description}
                    onChange={(event) =>
                      updateField("description", event.target.value)
                    }
                    rows={5}
                    placeholder="Describe the product, therapeutic use, or other catalogue information..."
                    className="min-h-[120px] w-full resize-none rounded-lg border border-slate-200 bg-white p-3 text-sm transition outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                  />
                </div>

                {/* Summary */}

                <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />

                    <div>
                      <p className="text-xs font-semibold text-blue-900">
                        Master Catalogue Record
                      </p>

                      <p className="mt-1 text-[11px] leading-5 text-blue-700">
                        This information defines the canonical pharmaceutical
                        product that suppliers will reference through their
                        inventory records.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* =================================================
                SECTION 2
            ================================================= */}

            <div
              ref={(element) => {
                sectionRefs.current[1] = element
              }}
              className="flex w-[320px] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:w-[370px] lg:w-[410px]"
            >
              <div className="shrink-0 border-b border-slate-100 px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                    <Pill className="h-4 w-4" />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      Formulation & Packaging
                    </h3>

                    <p className="text-xs text-slate-500">
                      Pharmaceutical specification
                    </p>
                  </div>
                </div>
              </div>

              <div className="card-scroll-area min-h-0 flex-1 space-y-5 overflow-y-auto p-5">
                {/* Strength */}

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700">
                    Strength
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <input
                    value={formData.strength}
                    onChange={(event) =>
                      updateField("strength", event.target.value)
                    }
                    placeholder="e.g. 500mg"
                    className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm transition outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                  />
                </div>

                {/* Dosage Form */}

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700">
                    Dosage Form
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  {!isCustomDosage ? (
                    <Select
                      value={formData.dosageForm}
                      onValueChange={handleDosageChange}
                    >
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Select dosage form" />
                      </SelectTrigger>

                      <SelectContent>
                        {DOSAGE_FORM_GROUPS.map((group, groupIndex) => (
                          <React.Fragment key={group.group}>
                            {groupIndex > 0 && <SelectSeparator />}

                            <SelectGroup>
                              <SelectLabel>{group.group}</SelectLabel>

                              {group.options.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </React.Fragment>
                        ))}

                        <SelectSeparator />

                        <SelectItem value="__CUSTOM__">
                          Custom dosage form
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="space-y-2">
                      <input
                        autoFocus
                        value={formData.dosageForm}
                        onChange={(event) =>
                          updateField("dosageForm", event.target.value)
                        }
                        placeholder="Enter custom dosage form"
                        className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                      />

                      <button
                        type="button"
                        onClick={() => {
                          setIsCustomDosage(false)

                          updateField("dosageForm", "Oral Tablet")
                        }}
                        className="text-[11px] font-medium text-blue-600 hover:underline"
                      >
                        Choose standard dosage form
                      </button>
                    </div>
                  )}
                </div>

                {/* Pack Size */}

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700">
                    Pack Size
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  {!isCustomPackSize ? (
                    <Select
                      value={formData.packSize}
                      onValueChange={handlePackSizeChange}
                    >
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Select pack size" />
                      </SelectTrigger>

                      <SelectContent>
                        {PACK_SIZE_GROUPS.map((group, groupIndex) => (
                          <React.Fragment key={group.group}>
                            {groupIndex > 0 && <SelectSeparator />}

                            <SelectGroup>
                              <SelectLabel>{group.group}</SelectLabel>

                              {group.options.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.value}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </React.Fragment>
                        ))}

                        <SelectSeparator />

                        <SelectItem value="__CUSTOM__">
                          Custom pack size
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="space-y-2">
                      <input
                        autoFocus
                        value={formData.packSize}
                        onChange={(event) =>
                          updateField("packSize", event.target.value)
                        }
                        placeholder="e.g. 24 tablets"
                        className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                      />

                      <button
                        type="button"
                        onClick={() => {
                          setIsCustomPackSize(false)

                          updateField("packSize", "100 tablets")

                          updateField("unit", "Tablets")
                        }}
                        className="text-[11px] font-medium text-blue-600 hover:underline"
                      >
                        Choose standard pack size
                      </button>
                    </div>
                  )}
                </div>

                {/* Unit */}

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700">
                    Procurement Unit
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <input
                    value={formData.unit}
                    onChange={(event) =>
                      updateField("unit", event.target.value)
                    }
                    placeholder="e.g. Tablets, Bottles, Packs"
                    className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm transition outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                  />

                  <p className="text-[11px] leading-5 text-slate-400">
                    This is the canonical procurement unit displayed when
                    supplier inventory references this master product.
                  </p>
                </div>

                {/* Product Specification Preview */}

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                    Specification Preview
                  </p>

                  <div className="mt-3 space-y-2 text-xs">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-slate-500">Strength</span>

                      <span className="font-medium text-slate-800">
                        {formData.strength || "—"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <span className="text-slate-500">Dosage</span>

                      <span className="text-right font-medium text-slate-800">
                        {formData.dosageForm || "—"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <span className="text-slate-500">Pack</span>

                      <span className="font-medium text-slate-800">
                        {formData.packSize || "—"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <span className="text-slate-500">Unit</span>

                      <span className="font-medium text-slate-800">
                        {formData.unit || "—"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* =================================================
                SECTION 3
            ================================================= */}

            <div
              ref={(element) => {
                sectionRefs.current[2] = element
              }}
              className="flex w-[320px] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:w-[370px] lg:w-[410px]"
            >
              <div className="shrink-0 border-b border-slate-100 px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                    <ShieldCheck className="h-4 w-4" />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      Regulatory & Storage
                    </h3>

                    <p className="text-xs text-slate-500">
                      Compliance and GDP information
                    </p>
                  </div>
                </div>
              </div>

              <div className="card-scroll-area min-h-0 flex-1 space-y-5 overflow-y-auto p-5">
                {/* NAFDAC */}

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700">
                    NAFDAC Registration Number
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <p className="text-[11px] text-slate-400">
                    Store the regulatory registration reference associated with
                    the master product.
                  </p>
                </div>

                {/* Storage */}

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-700">
                      GDP Storage Condition
                      <span className="ml-1 text-red-500">*</span>
                    </label>

                    <Thermometer className="h-4 w-4 text-emerald-500" />
                  </div>

                  <textarea
                    value={formData.storageCondition}
                    onChange={(event) =>
                      updateField("storageCondition", event.target.value)
                    }
                    rows={4}
                    placeholder="e.g. Store below 25°C..."
                    className="min-h-[100px] w-full resize-none rounded-lg border border-slate-200 p-3 text-sm transition outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                  />
                </div>

                {/* Storage presets */}

                <div className="space-y-2">
                  <p className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
                    Common Storage Presets
                  </p>

                  <div className="space-y-2">
                    {STORAGE_PRESETS.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => updateField("storageCondition", preset)}
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-left text-[11px] leading-5 text-slate-600 transition hover:border-emerald-200 hover:bg-emerald-50/50"
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Compliance box */}

                <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-4">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />

                    <div>
                      <p className="text-xs font-semibold text-emerald-900">
                        Regulatory Information
                      </p>

                      <p className="mt-1 text-[11px] leading-5 text-emerald-700">
                        Regulatory and storage data belongs to the master
                        product record so supplier listings can reference a
                        consistent product definition.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* =================================================
                SECTION 4
            ================================================= */}

            <div
              ref={(element) => {
                sectionRefs.current[3] = element
              }}
              className="flex w-[320px] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:w-[370px] lg:w-[410px]"
            >
              <div className="shrink-0 border-b border-slate-100 px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                    <DollarSign className="h-4 w-4" />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      Pricing & Monetization
                    </h3>

                    <p className="text-xs text-slate-500">
                      Master pricing configuration
                    </p>
                  </div>
                </div>
              </div>

              <div className="card-scroll-area min-h-0 flex-1 space-y-5 overflow-y-auto p-5">
                {/* Reference Price */}

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700">
                    Reference Base Price
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <span className="absolute top-1/2 left-3 -translate-y-1/2 text-sm font-semibold text-slate-400">
                      ₦
                    </span>

                    <input
                      type="number"
                      min={0}
                      step={50}
                      value={formData.referenceBasePrice || ""}
                      onChange={(event) =>
                        updateField(
                          "referenceBasePrice",
                          Number(event.target.value)
                        )
                      }
                      className="h-11 w-full rounded-lg border border-slate-200 pr-3 pl-8 text-sm font-medium transition outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10"
                    />
                  </div>

                  <p className="text-[11px] leading-5 text-slate-400">
                    Canonical reference price used by the platform for pricing
                    and procurement calculations.
                  </p>
                </div>

                {/* Commission */}

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-700">
                      Commission
                    </label>

                    <span className="text-xs font-semibold text-amber-600">
                      {commissionPercent}%
                    </span>
                  </div>

                  <input
                    type="number"
                    min={0}
                    max={100}
                    step={1}
                    value={formData.commissionPercent}
                    onChange={(event) =>
                      updateField(
                        "commissionPercent",
                        Math.min(100, Math.max(0, Number(event.target.value)))
                      )
                    }
                    className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10"
                  />
                </div>

                {/* Max Markup */}

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-700">
                      Maximum Markup
                    </label>

                    <span className="text-xs font-semibold text-amber-600">
                      {maxMarkupPercent}%
                    </span>
                  </div>

                  <input
                    type="number"
                    min={0}
                    max={100}
                    step={1}
                    value={formData.maxMarkupPercent}
                    onChange={(event) =>
                      updateField(
                        "maxMarkupPercent",
                        Math.min(100, Math.max(0, Number(event.target.value)))
                      )
                    }
                    className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10"
                  />
                </div>

                {/* Pricing Simulator */}

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-slate-900">
                        Pricing Simulator
                      </p>

                      <p className="text-[10px] text-slate-400">
                        Based on current configuration
                      </p>
                    </div>

                    <SlidersHorizontal className="h-4 w-4 text-slate-400" />
                  </div>

                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Base price</span>

                      <span className="font-medium text-slate-800">
                        ₦{referenceBasePrice.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">
                        Platform commission
                      </span>

                      <span className="font-medium text-slate-800">
                        ₦
                        {platformFee.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>

                    <div className="border-t border-slate-200 pt-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-slate-600">
                          Sourcing cost
                        </span>

                        <span className="text-sm font-bold text-slate-900">
                          ₦
                          {hospitalSourcingCost.toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">
                        Maximum hospital price
                      </span>

                      <span className="text-sm font-bold text-amber-600">
                        ₦
                        {maximumHospitalPrice.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">
                        Platform revenue
                      </span>

                      <span className="text-xs font-semibold text-emerald-600">
                        ₦
                        {estimatedPlatformRevenue.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Pricing notice */}

                <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
                  <div className="flex items-start gap-3">
                    <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />

                    <p className="text-[11px] leading-5 text-amber-800">
                      Supplier-specific prices should remain in the supplier
                      inventory layer. These values define the master catalogues
                      reference pricing configuration.
                    </p>
                  </div>
                </div>

                {/* Preflight */}

                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <p className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                    Preflight
                  </p>

                  <div className="mt-3 space-y-2">
                    {preflightChecks.map(([label, complete]) => (
                      <div
                        key={label}
                        className="flex items-center justify-between gap-3"
                      >
                        <span className="text-xs text-slate-600">{label}</span>

                        <CheckCircle2
                          className={`h-4 w-4 ${
                            complete ? "text-emerald-500" : "text-slate-300"
                          } `}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* =================================================
              FOOTER
          ================================================= */}

          <div className="shrink-0 border-t border-slate-200 bg-white px-4 py-3 sm:px-6">
            <div className="flex items-center justify-between gap-3">
              {/* Previous */}

              <button
                type="button"
                onClick={goPrevious}
                disabled={activeSectionIndex === 0 || isSubmitting}
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 px-3 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 sm:px-4"
              >
                <ArrowLeft className="h-4 w-4" />

                <span className="hidden sm:inline">Previous</span>
              </button>

              {/* Progress */}

              <div className="hidden items-center gap-1.5 sm:flex">
                {sections.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => scrollToSection(index)}
                    aria-label={`Go to section ${index + 1}`}
                    className={`h-1.5 rounded-full transition-all ${
                      index === activeSectionIndex
                        ? "w-7 bg-blue-600"
                        : "w-1.5 bg-slate-300"
                    } `}
                  />
                ))}
              </div>

              {/* Actions */}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="h-10 rounded-lg px-3 text-xs font-medium text-slate-600 transition hover:bg-slate-100 disabled:opacity-50 sm:px-4"
                >
                  Cancel
                </button>

                {activeSectionIndex < sections.length - 1 ? (
                  <button
                    type="button"
                    onClick={goNext}
                    disabled={isSubmitting}
                    className="inline-flex h-10 items-center gap-2 rounded-lg bg-slate-900 px-4 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex h-10 items-center gap-2 rounded-lg bg-blue-600 px-4 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 sm:px-5"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                        {isEditing ? "Updating..." : "Creating..."}
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4" />

                        {isEditing ? "Update Product" : "Create Product"}
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
