// MasterProductCatalogue.tsx
"use client";

import React, { useMemo, useState } from "react";
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  X,
  ThermometerSnowflake,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";

// import {
//   DOSAGE_FORM_GROUPS,
//   PACK_SIZE_GROUPS,
// } from '@/lib/catalogOptions';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DOSAGE_FORM_GROUPS, PACK_SIZE_GROUPS } from "@/lib/catalogOptions";
/* =========================================================
   Types
========================================================= */

type ProductStatus = "ACTIVE" | "INACTIVE" | "ARCHIVED";

type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  activeIngredient: string;
  strength: string;
  dosageForm: string;
  unit: string;
  packSize: string;
  nafdacRegNumber: string;
  referenceBasePrice: number;
  commissionPercent: number;
  maxMarkupPercent: number;
  status: ProductStatus;
  storageCondition: string;
  emoji: string;
};

type SupplierInventory = {
  id: string;
  productId: string;
  supplierName: string;
  supplierType: "Importer" | "Distributor" | "Retailer";
  stock: number;
  basePrice: number;
  fulfillmentRate: number;
};

/* =========================================================
   Categories
========================================================= */

const CATEGORIES: { label: string; value: string }[] = [
  { label: "All Categories", value: "ALL" },
  {
    label: "Antibiotics & Antimicrobials",
    value: "Antibiotics & Antimicrobials",
  },
  {
    label: "Antimalarials",
    value: "Antimalarials",
  },
  {
    label: "Analgesics & Antipyretics",
    value: "Analgesics & Antipyretics",
  },
  {
    label: "NSAIDs & Anti-Inflammatory",
    value: "NSAIDs & Anti-Inflammatory",
  },
  {
    label: "Cardiovascular & Antihypertensives",
    value: "Cardiovascular & Antihypertensives",
  },
  {
    label: "Endocrine & Diabetes Care",
    value: "Endocrine & Diabetes Care",
  },
  {
    label: "Intravenous Fluids & Electrolytes",
    value: "Intravenous Fluids & Electrolytes",
  },
  {
    label: "Critical Care & Anesthetics",
    value: "Critical Care & Anesthetics",
  },
  {
    label: "Vaccines & Biologics",
    value: "Vaccines & Biologics",
  },
  {
    label: "Oncology & Specialized",
    value: "Oncology & Specialized",
  },
  {
    label: "Other Formulations",
    value: "Other",
  },
];

const EMOJI_OPTIONS = [
  "💊",
  "🧪",
  "💉",
  "🩸",
  "❄️",
  "🌿",
  "🔴",
  "⚪",
  "📦",
  "🫀",
  "🩺",
];


/* =========================================================
   Mock Product Data
========================================================= */

const MOCK_PRODUCTS: Product[] = [
  {
    id: "PROD-001",
    name: "Paracetamol 500mg Tablets",
    category: "Analgesics & Antipyretics",
    description:
      "Analgesic and antipyretic medication commonly used for the relief of mild to moderate pain and fever.",
    activeIngredient: "Paracetamol",
    strength: "500mg",
    dosageForm: "Oral Tablet",
    unit: "Packs of 100 Tablets",
    packSize: "100 tablets/pack",
    nafdacRegNumber: "NAFDAC-04-7218",
    referenceBasePrice: 12000,
    commissionPercent: 8,
    maxMarkupPercent: 25,
    status: "ACTIVE",
    storageCondition:
      "Store below 30°C in a dry place protected from light.",
    emoji: "💊",
  },
  {
    id: "PROD-002",
    name: "Amoxicillin 500mg Capsules",
    category: "Antibiotics & Antimicrobials",
    description:
      "Broad-spectrum penicillin antibiotic used for the treatment of susceptible bacterial infections.",
    activeIngredient: "Amoxicillin",
    strength: "500mg",
    dosageForm: "Oral Capsule",
    unit: "Packs of 100 Capsules",
    packSize: "100 capsules/pack",
    nafdacRegNumber: "NAFDAC-04-6382",
    referenceBasePrice: 25000,
    commissionPercent: 10,
    maxMarkupPercent: 25,
    status: "ACTIVE",
    storageCondition:
      "Store below 30°C in a dry place protected from excessive heat.",
    emoji: "💊",
  },
  {
    id: "PROD-003",
    name: "Ibuprofen 400mg Tablets",
    category: "NSAIDs & Anti-Inflammatory",
    description:
      "Non-steroidal anti-inflammatory medicine indicated for pain, inflammation and fever.",
    activeIngredient: "Ibuprofen",
    strength: "400mg",
    dosageForm: "Oral Tablet",
    unit: "Packs of 100 Tablets",
    packSize: "100 tablets/pack",
    nafdacRegNumber: "NAFDAC-04-8156",
    referenceBasePrice: 18000,
    commissionPercent: 7,
    maxMarkupPercent: 25,
    status: "ACTIVE",
    storageCondition:
      "Store below 30°C in a dry and well-ventilated location.",
    emoji: "🔴",
  },
  {
    id: "PROD-004",
    name: "Artemether/Lumefantrine",
    category: "Antimalarials",
    description:
      "Artemisinin-based combination therapy for the treatment of uncomplicated Plasmodium falciparum malaria.",
    activeIngredient: "Artemether + Lumefantrine",
    strength: "20mg/120mg",
    dosageForm: "Oral Tablet",
    unit: "Packs of 24 Tablets",
    packSize: "24 tablets/pack",
    nafdacRegNumber: "NAFDAC-04-5531",
    referenceBasePrice: 35000,
    commissionPercent: 12,
    maxMarkupPercent: 25,
    status: "ACTIVE",
    storageCondition:
      "Store below 30°C in a dry place protected from light.",
    emoji: "💊",
  },
  {
    id: "PROD-005",
    name: "Vitamin C 1000mg",
    category: "Other",
    description:
      "Vitamin C supplement used to support normal immune function and address dietary vitamin C deficiency.",
    activeIngredient: "Ascorbic Acid",
    strength: "1000mg",
    dosageForm: "Effervescent Tablet",
    unit: "Tubes of 20 Tablets",
    packSize: "20 tablets/tube",
    nafdacRegNumber: "NAFDAC-04-9127",
    referenceBasePrice: 9000,
    commissionPercent: 5,
    maxMarkupPercent: 20,
    status: "ACTIVE",
    storageCondition:
      "Store below 25°C in a dry place and tightly closed.",
    emoji: "🌿",
  },
  {
    id: "PROD-006",
    name: "Metformin 500mg Tablets",
    category: "Endocrine & Diabetes Care",
    description:
      "Biguanide oral antidiabetic medicine used as part of the management of type 2 diabetes.",
    activeIngredient: "Metformin Hydrochloride",
    strength: "500mg",
    dosageForm: "Oral Tablet",
    unit: "Packs of 100 Tablets",
    packSize: "100 tablets/pack",
    nafdacRegNumber: "NAFDAC-04-4472",
    referenceBasePrice: 22000,
    commissionPercent: 9,
    maxMarkupPercent: 25,
    status: "ACTIVE",
    storageCondition:
      "Store below 30°C in a dry place protected from moisture.",
    emoji: "💊",
  },
  {
    id: "PROD-007",
    name: "Omeprazole 20mg Capsules",
    category: "Other",
    description:
      "Proton pump inhibitor used in the management of acid-related gastrointestinal disorders.",
    activeIngredient: "Omeprazole",
    strength: "20mg",
    dosageForm: "Delayed Release Capsule",
    unit: "Packs of 28 Capsules",
    packSize: "28 capsules/pack",
    nafdacRegNumber: "NAFDAC-04-7364",
    referenceBasePrice: 16000,
    commissionPercent: 6,
    maxMarkupPercent: 25,
    status: "ACTIVE",
    storageCondition:
      "Store below 25°C in a dry place protected from moisture.",
    emoji: "💊",
  },
  {
    id: "PROD-008",
    name: "Cough Relief Syrup",
    category: "Other",
    description:
      "Oral cough preparation for symptomatic relief of uncomplicated cough conditions.",
    activeIngredient: "Dextromethorphan + Guaifenesin",
    strength: "10mg/100mg per 5ml",
    dosageForm: "Oral Syrup",
    unit: "Bottles",
    packSize: "100ml/bottle",
    nafdacRegNumber: "NAFDAC-04-6019",
    referenceBasePrice: 14000,
    commissionPercent: 7,
    maxMarkupPercent: 25,
    status: "ACTIVE",
    storageCondition:
      "Store below 30°C. Protect from direct sunlight.",
    emoji: "🧪",
  },
  {
    id: "PROD-009",
    name: "ORS Sachets",
    category: "Intravenous Fluids & Electrolytes",
    description:
      "Oral rehydration salts used to prevent and treat dehydration associated with diarrhoeal illness.",
    activeIngredient:
      "Sodium Chloride + Potassium Chloride + Glucose",
    strength: "Standard WHO Formula",
    dosageForm: "Oral Powder",
    unit: "Boxes of 100 Sachets",
    packSize: "100 sachets/box",
    nafdacRegNumber: "NAFDAC-04-3817",
    referenceBasePrice: 5000,
    commissionPercent: 4,
    maxMarkupPercent: 20,
    status: "ACTIVE",
    storageCondition:
      "Store below 30°C in a dry place protected from moisture.",
    emoji: "⚪",
  },
  {
    id: "PROD-010",
    name: "Amlodipine 5mg Tablets",
    category: "Cardiovascular & Antihypertensives",
    description:
      "Calcium-channel blocker used in the management of hypertension and selected cardiovascular conditions.",
    activeIngredient: "Amlodipine Besylate",
    strength: "5mg",
    dosageForm: "Oral Tablet",
    unit: "Packs of 30 Tablets",
    packSize: "30 tablets/pack",
    nafdacRegNumber: "NAFDAC-04-2945",
    referenceBasePrice: 20000,
    commissionPercent: 9,
    maxMarkupPercent: 25,
    status: "ACTIVE",
    storageCondition:
      "Store below 30°C in a dry place protected from light.",
    emoji: "🫀",
  },
  {
    id: "PROD-011",
    name: "Insulin Human 100IU/ml",
    category: "Endocrine & Diabetes Care",
    description:
      "Human insulin preparation used for glycaemic control in patients requiring insulin therapy.",
    activeIngredient: "Human Insulin",
    strength: "100IU/ml",
    dosageForm: "Injection",
    unit: "Vials",
    packSize: "10ml/vial",
    nafdacRegNumber: "NAFDAC-04-1843",
    referenceBasePrice: 18500,
    commissionPercent: 10,
    maxMarkupPercent: 20,
    status: "ACTIVE",
    storageCondition:
      "Cold chain required. Store at 2°C–8°C. Do not freeze.",
    emoji: "💉",
  },
  {
    id: "PROD-012",
    name: "Ceftriaxone 1g Injection",
    category: "Antibiotics & Antimicrobials",
    description:
      "Third-generation cephalosporin antibiotic supplied as a sterile injectable formulation.",
    activeIngredient: "Ceftriaxone Sodium",
    strength: "1g",
    dosageForm: "Powder for Injection",
    unit: "Vials",
    packSize: "1 vial/box",
    nafdacRegNumber: "NAFDAC-04-5728",
    referenceBasePrice: 8500,
    commissionPercent: 10,
    maxMarkupPercent: 25,
    status: "INACTIVE",
    storageCondition:
      "Store below 25°C in a dry place protected from light.",
    emoji: "💉",
  },
];

/* =========================================================
   Mock Supplier Inventory
========================================================= */

const MOCK_INVENTORY: SupplierInventory[] = [
  {
    id: "INV-001",
    productId: "PROD-001",
    supplierName: "May & Baker Nigeria Plc",
    supplierType: "Importer",
    stock: 12500,
    basePrice: 10500,
    fulfillmentRate: 99.2,
  },
  {
    id: "INV-002",
    productId: "PROD-001",
    supplierName: "Emzor Pharmaceutical Industries",
    supplierType: "Distributor",
    stock: 8200,
    basePrice: 11000,
    fulfillmentRate: 98.6,
  },
  {
    id: "INV-003",
    productId: "PROD-002",
    supplierName: "Fidson Healthcare Plc",
    supplierType: "Importer",
    stock: 5400,
    basePrice: 21800,
    fulfillmentRate: 99.1,
  },
  {
    id: "INV-004",
    productId: "PROD-002",
    supplierName: "Swiss Pharma Nigeria Ltd",
    supplierType: "Distributor",
    stock: 3200,
    basePrice: 22900,
    fulfillmentRate: 97.8,
  },
  {
    id: "INV-005",
    productId: "PROD-003",
    supplierName: "Neimeth Pharmaceuticals",
    supplierType: "Importer",
    stock: 4700,
    basePrice: 15800,
    fulfillmentRate: 98.9,
  },
  {
    id: "INV-006",
    productId: "PROD-004",
    supplierName: "Juhel Nigeria Limited",
    supplierType: "Distributor",
    stock: 2800,
    basePrice: 31500,
    fulfillmentRate: 98.4,
  },
  {
    id: "INV-007",
    productId: "PROD-005",
    supplierName: "May & Baker Nigeria Plc",
    supplierType: "Importer",
    stock: 9600,
    basePrice: 7900,
    fulfillmentRate: 99.3,
  },
  {
    id: "INV-008",
    productId: "PROD-006",
    supplierName: "Emzor Pharmaceutical Industries",
    supplierType: "Distributor",
    stock: 4100,
    basePrice: 19500,
    fulfillmentRate: 98.2,
  },
  {
    id: "INV-009",
    productId: "PROD-007",
    supplierName: "Fidson Healthcare Plc",
    supplierType: "Importer",
    stock: 3600,
    basePrice: 14100,
    fulfillmentRate: 99.0,
  },
  {
    id: "INV-010",
    productId: "PROD-008",
    supplierName: "Juhel Nigeria Limited",
    supplierType: "Distributor",
    stock: 1800,
    basePrice: 12500,
    fulfillmentRate: 97.9,
  },
  {
    id: "INV-011",
    productId: "PROD-009",
    supplierName: "Swiss Pharma Nigeria Ltd",
    supplierType: "Retailer",
    stock: 25000,
    basePrice: 4200,
    fulfillmentRate: 96.8,
  },
  {
    id: "INV-012",
    productId: "PROD-010",
    supplierName: "Neimeth Pharmaceuticals",
    supplierType: "Importer",
    stock: 2900,
    basePrice: 17600,
    fulfillmentRate: 99.4,
  },
  {
    id: "INV-013",
    productId: "PROD-011",
    supplierName: "May & Baker Nigeria Plc",
    supplierType: "Importer",
    stock: 850,
    basePrice: 16200,
    fulfillmentRate: 99.1,
  },
];

/* =========================================================
   Form Defaults
========================================================= */

const DEFAULT_FORM_DATA = {
  name: "",
  category: "Antibiotics & Antimicrobials",
  description: "",
  activeIngredient: "",
  strength: "",
  dosageForm: "Oral Tablet",
  unit: "Packs of 100 Tablets",
  packSize: "100 tablets/pack",
  nafdacRegNumber: "",
  referenceBasePrice: 1500,
  commissionPercent: 10,
  maxMarkupPercent: 25,
  status: "ACTIVE" as ProductStatus,
  storageCondition: "Store below 30°C in a dry place.",
  emoji: "💊",
};

/* =========================================================
   Component
========================================================= */

export const MasterProductCatalog: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [inventory] = useState<SupplierInventory[]>(MOCK_INVENTORY);

  /* =========================================================
     Filters & State
  ========================================================= */

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("ALL");

  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "ACTIVE" | "INACTIVE" | "ARCHIVED"
  >("ALL");

  const [isColdChainFilter, setIsColdChainFilter] =
    useState(false);

  /* =========================================================
     Modals
  ========================================================= */

  const [isCreateEditModalOpen, setIsCreateEditModalOpen] =
    useState(false);

  const [editingProduct, setEditingProduct] =
    useState<Product | null>(null);

  const [viewingProduct, setViewingProduct] =
    useState<Product | null>(null);

  const [deleteConfirmProduct, setDeleteConfirmProduct] =
    useState<Product | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  /* =========================================================
     Form State
  ========================================================= */

  const [formData, setFormData] = useState({
    ...DEFAULT_FORM_DATA,
  });

  const [isCustomDosage, setIsCustomDosage] = useState(false);
  const [isCustomPackSize, setIsCustomPackSize] = useState(false);

  
  const isKnownDosageForm = useMemo(() => {
    return DOSAGE_FORM_GROUPS.some((g) =>
      g.options.some((opt) => opt.value === formData.dosageForm)
    );
  }, [formData.dosageForm]);

  const isKnownPackSize = useMemo(() => {
    return PACK_SIZE_GROUPS.some((g) =>
      g.options.some((opt) => opt.value === formData.packSize)
    );
  }, [formData.packSize]);

  /* =========================================================
     Helpers
  ========================================================= */

  const isColdChainProduct = (product: Product) => {
    const storage = product.storageCondition.toLowerCase();

    return (
      storage.includes("2°c") ||
      storage.includes("cold chain") ||
      storage.includes("refrigerat")
    );
  };

  const formatCurrency = (value: number) => {
    return `₦${value.toLocaleString("en-NG")}`;
  };

  /* =========================================================
     Filtered Products
  ========================================================= */

  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      const query = searchTerm.trim().toLowerCase();

      const matchesSearch =
        !query ||
        prod.name.toLowerCase().includes(query) ||
        prod.activeIngredient.toLowerCase().includes(query) ||
        prod.nafdacRegNumber.toLowerCase().includes(query);

      const matchesCategory =
        selectedCategory === "ALL" ||
        prod.category === selectedCategory;

      const matchesStatus =
        statusFilter === "ALL" ||
        prod.status === statusFilter;

      const matchesColdChain =
        !isColdChainFilter || isColdChainProduct(prod);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus &&
        matchesColdChain
      );
    });
  }, [
    products,
    searchTerm,
    selectedCategory,
    statusFilter,
    isColdChainFilter,
  ]);

  /* =========================================================
     Catalog Summary Metrics
  ========================================================= */

  const stats = useMemo(() => {
    const total = products.length;

    const active = products.filter(
      (p) => p.status === "ACTIVE"
    ).length;

    const archived = products.filter(
      (p) => p.status === "ARCHIVED"
    ).length;

    const inactive = products.filter(
      (p) => p.status === "INACTIVE"
    ).length;

    const coldChain = products.filter(
      isColdChainProduct
    ).length;

    const avgCommission =
      total > 0
        ? (
          products.reduce(
            (acc, p) => acc + (p.commissionPercent || 10),
            0
          ) / total
        ).toFixed(1)
        : "10.0";

    return {
      total,
      active,
      archived,
      inactive,
      coldChain,
      avgCommission,
    };
  }, [products]);

  /* =========================================================
     Open Create Modal
  ========================================================= */

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setIsCustomDosage(false);
    setIsCustomPackSize(false);

    setFormData({
      ...DEFAULT_FORM_DATA,
      nafdacRegNumber: "NAFDAC-04-",
      referenceBasePrice: 2500,
      storageCondition:
        "Store below 25°C in a dry place protected from light.",
    });

    setIsCreateEditModalOpen(true);
  };

  /* =========================================================
     Open Edit Modal
  ========================================================= */

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setIsCustomDosage(
      !DOSAGE_FORM_GROUPS.some((group) =>
        group.options.some((option) => option.value === product.dosageForm)
      )
    );
    setIsCustomPackSize(
      !PACK_SIZE_GROUPS.some((group) =>
        group.options.some((option) => option.value === product.packSize)
      )
    );

    setFormData({
      name: product.name,
      category: product.category,
      description: product.description,
      activeIngredient: product.activeIngredient,
      strength: product.strength,
      dosageForm: product.dosageForm,
      unit: product.unit,
      packSize: product.packSize,
      nafdacRegNumber: product.nafdacRegNumber,
      referenceBasePrice: product.referenceBasePrice,
      commissionPercent: product.commissionPercent || 10,
      maxMarkupPercent: product.maxMarkupPercent || 25,
      status: product.status || "ACTIVE",
      storageCondition: product.storageCondition,
      emoji: product.emoji || "💊",
    });

    setIsCreateEditModalOpen(true);
  };

  /* =========================================================
     Submit Create / Edit
  ========================================================= */

  const handleSubmitProduct = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.activeIngredient.trim() ||
      !formData.nafdacRegNumber.trim()
    ) {
      toast.error("Validation Incomplete", {
        description:
          "Product name, active ingredient, and NAFDAC registration number are required.",
      });

      return;
    }

    try {
      setIsSubmitting(true);

      await new Promise((resolve) =>
        setTimeout(resolve, 700)
      );

      if (editingProduct) {
        const updatedProduct: Product = {
          ...editingProduct,
          ...formData,
          referenceBasePrice: Number(
            formData.referenceBasePrice
          ),
          commissionPercent: Number(
            formData.commissionPercent
          ),
          maxMarkupPercent: Number(
            formData.maxMarkupPercent
          ),
        };

        setProducts((current) =>
          current.map((product) =>
            product.id === editingProduct.id
              ? updatedProduct
              : product
          )
        );

        toast.success("Product Updated", {
          description: `Successfully updated ${formData.name} in the Master Catalogue.`,
        });
      } else {
        const newProduct: Product = {
          id: `PROD-${String(products.length + 1).padStart(
            3,
            "0"
          )}`,
          ...formData,
          referenceBasePrice: Number(
            formData.referenceBasePrice
          ),
          commissionPercent: Number(
            formData.commissionPercent
          ),
          maxMarkupPercent: Number(
            formData.maxMarkupPercent
          ),
        };

        setProducts((current) => [
          newProduct,
          ...current,
        ]);

        toast.success("Product Catalogued", {
          description: `Successfully listed ${formData.name} under ${formData.category}.`,
        });
      }

      setIsCreateEditModalOpen(false);
      setEditingProduct(null);
    } catch {
      toast.error("Catalog Operation Failed", {
        description:
          "Failed to persist product catalogue changes.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  /* =========================================================
     Toggle Product Status
  ========================================================= */

  const handleToggleStatus = (product: Product) => {
    const nextStatus =
      product.status === "ACTIVE"
        ? "INACTIVE"
        : "ACTIVE";

    setProducts((current) =>
      current.map((item) =>
        item.id === product.id
          ? {
            ...item,
            status: nextStatus,
          }
          : item
      )
    );

    toast.info("Catalog Status Changed", {
      description: `${product.name} is now ${nextStatus}.`,
    });
  };

  /* =========================================================
     Archive / Delete
  ========================================================= */

  const handleExecuteDeleteOrArchive = async (
    archiveOnly: boolean
  ) => {
    if (!deleteConfirmProduct) return;

    try {
      setIsSubmitting(true);

      await new Promise((resolve) =>
        setTimeout(resolve, 500)
      );

      if (archiveOnly) {
        setProducts((current) =>
          current.map((product) =>
            product.id === deleteConfirmProduct.id
              ? {
                ...product,
                status: "ARCHIVED",
              }
              : product
          )
        );

        toast.success("Product Archived", {
          description: `${deleteConfirmProduct.name} moved to archival records.`,
        });
      } else {
        setProducts((current) =>
          current.filter(
            (product) =>
              product.id !== deleteConfirmProduct.id
          )
        );

        toast.success("Product Removed", {
          description: `${deleteConfirmProduct.name} permanently removed from the demo catalogue.`,
        });
      }

      setDeleteConfirmProduct(null);
    } catch {
      toast.error("Action Failed", {
        description: "Could not update the product catalogue.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  /* =========================================================
     Render
  ========================================================= */

  return (
    <div className="space-y-6">
      {/* =====================================================
          Header
      ====================================================== */}

      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
            <Package className="h-5 w-5 text-blue-600" />

            <span>
              Master Pharmaceutical Product Catalog
            </span>
          </h2>

          <p className="mt-0.5 text-xs text-slate-500">
            Central NAFDAC-approved registry, standard reference
            pricing, and automated platform commission controls.
          </p>
        </div>

        <button
          type="button"
          id="btn-add-product"
          onClick={handleOpenCreate}
          className="flex cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />

          <span>Add Regulated Product</span>
        </button>
      </div>

      {/* =====================================================
          KPI Cards
      ====================================================== */}

      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Total Monitored
          </span>

          <span className="mt-1 block font-mono text-xl font-bold text-slate-900">
            {stats.total}
          </span>

          <span className="mt-0.5 block text-[10.5px] text-slate-500">
            Pharmaceutical lines
          </span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="block text-[11px] font-semibold uppercase tracking-wider text-emerald-600">
            Active in Sourcing
          </span>

          <span className="mt-1 block font-mono text-xl font-bold text-emerald-700">
            {stats.active}
          </span>

          <span className="mt-0.5 block text-[10.5px] text-slate-500">
            Available for hospitals
          </span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="block text-[11px] font-semibold uppercase tracking-wider text-sky-600">
            Cold Chain Lines
          </span>

          <span className="mt-1 flex items-center gap-1 font-mono text-xl font-bold text-sky-700">
            <ThermometerSnowflake className="h-4 w-4 text-sky-500" />

            {stats.coldChain}
          </span>

          <span className="mt-0.5 block text-[10.5px] text-slate-500">
            2°C – 8°C regulated
          </span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="block text-[11px] font-semibold uppercase tracking-wider text-blue-600">
            Platform Take-Rate
          </span>

          <span className="mt-1 block font-mono text-xl font-bold text-blue-700">
            {stats.avgCommission}%
          </span>

          <span className="mt-0.5 block text-[10.5px] text-slate-500">
            Average fee per line
          </span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="block text-[11px] font-semibold uppercase tracking-wider text-amber-600">
            Archived / Inactive
          </span>

          <span className="mt-1 block font-mono text-xl font-bold text-amber-700">
            {stats.archived + stats.inactive}
          </span>

          <span className="mt-0.5 block text-[10.5px] text-slate-500">
            Delisted or paused
          </span>
        </div>
      </div>

      {/* =====================================================
          Filter Toolbar
      ====================================================== */}

      <div className="flex flex-col items-stretch justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-xs lg:flex-row lg:items-center">
        <div className="relative min-w-[240px] flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            id="input-product-search"
            type="text"
            placeholder="Search by product name, active molecule, or NAFDAC Reg No..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-9 text-xs text-slate-900 transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none"
          />

          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            id="select-category-filter"
            value={selectedCategory}
            onChange={(e) =>
              setSelectedCategory(e.target.value)
            }
            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 focus:border-blue-500 focus:outline-none"
          >
            {CATEGORIES.map((cat) => (
              <option
                key={cat.value}
                value={cat.value}
              >
                {cat.label}
              </option>
            ))}
          </select>

          <select
            id="select-status-filter"
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value as
                | "ALL"
                | "ACTIVE"
                | "INACTIVE"
                | "ARCHIVED"
              )
            }
            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 focus:border-blue-500 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active Only</option>
            <option value="INACTIVE">Inactive Only</option>
            <option value="ARCHIVED">Archived Only</option>
          </select>

          <button
            type="button"
            onClick={() =>
              setIsColdChainFilter(
                !isColdChainFilter
              )
            }
            className={`flex cursor-pointer items-center gap-1.5 rounded-lg border px-3 py-2 text-xs transition ${isColdChainFilter
                ? "border-sky-300 bg-sky-50 font-semibold text-sky-700"
                : "border-slate-200 bg-slate-50 font-medium text-slate-600 hover:bg-slate-100"
              }`}
          >
            <ThermometerSnowflake className="h-3.5 w-3.5 text-sky-500" />

            <span>Cold Chain (2°–8°C)</span>
          </button>
        </div>
      </div>

      {/* =====================================================
          Products Table
      ====================================================== */}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 bg-slate-50 text-[10.5px] uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">
                  Product & Ingredient
                </th>

                <th className="px-4 py-3 font-semibold">
                  Dosage & Unit
                </th>

                <th className="px-4 py-3 font-semibold">
                  NAFDAC Reg & Storage
                </th>

                <th className="px-4 py-3 font-semibold">
                  Reference Base Price
                </th>

                <th className="px-4 py-3 font-semibold">
                  Take-Rate
                </th>

                <th className="px-4 py-3 font-semibold">
                  Status
                </th>

                <th className="px-4 py-3 text-right font-semibold">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-12 text-center text-slate-400"
                  >
                    <Package className="mx-auto mb-2 h-8 w-8 text-slate-300" />

                    <p className="text-xs font-medium text-slate-600">
                      No pharmaceutical products match
                      your filter criteria.
                    </p>

                    <p className="mt-1 text-[11px] text-slate-400">
                      Try relaxing filters or add a new
                      regulated product.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((prod) => {
                  const isCold =
                    isColdChainProduct(prod);

                  const stockingCount =
                    inventory.filter(
                      (inv) =>
                        inv.productId === prod.id &&
                        inv.stock > 0
                    ).length;

                  const commission =
                    prod.commissionPercent || 10;

                  return (
                    <tr
                      key={prod.id}
                      className="group transition hover:bg-slate-50/80"
                    >
                      {/* Product */}

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-base">
                            {prod.emoji || "💊"}
                          </span>

                          <div>
                            <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                              <span>{prod.name}</span>

                              {isCold && (
                                <span className="rounded border border-sky-200 bg-sky-50 px-1.5 py-0.5 text-[9.5px] font-bold text-sky-700">
                                  Cold Chain
                                </span>
                              )}
                            </div>

                            <div className="text-[11px] text-slate-500">
                              {prod.activeIngredient}

                              <span className="text-slate-400">
                                {" "}
                                • {prod.category}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Dosage */}

                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-800">
                          {prod.strength} (
                          {prod.dosageForm})
                        </div>

                        <div className="text-[11px] text-slate-400">
                          {prod.unit ||
                            prod.packSize}
                        </div>
                      </td>

                      {/* NAFDAC */}

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 font-mono text-[11px] font-semibold text-slate-700">
                          <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-emerald-600" />

                          <span>
                            {prod.nafdacRegNumber}
                          </span>
                        </div>

                        <div
                          className="max-w-[180px] truncate text-[11px] text-slate-400"
                          title={
                            prod.storageCondition
                          }
                        >
                          {prod.storageCondition}
                        </div>
                      </td>

                      {/* Base Price */}

                      <td className="px-4 py-3 font-mono">
                        <div className="font-bold text-slate-900">
                          {formatCurrency(
                            prod.referenceBasePrice
                          )}
                        </div>

                        <div className="text-[10px] text-slate-400">
                          {stockingCount > 0 ? (
                            <span className="font-semibold text-emerald-600">
                              {stockingCount} suppliers
                              stocking
                            </span>
                          ) : (
                            <span>
                              No active stock
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Commission */}

                      <td className="px-4 py-3">
                        <span className="font-mono text-xs font-bold text-blue-700">
                          {commission}%
                        </span>

                        <span className="mt-0.5 block text-[10px] text-slate-400">
                          ~
                          {formatCurrency(
                            Math.round(
                              (prod.referenceBasePrice *
                                commission) /
                              100
                            )
                          )}
                        </span>
                      </td>

                      {/* Status */}

                      <td className="px-4 py-3">
                        <span
                          className={`inline-block rounded-full border px-2 py-0.5 text-[10.5px] font-bold ${prod.status === "ACTIVE"
                              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                              : prod.status ===
                                "ARCHIVED"
                                ? "border-amber-200 bg-amber-50 text-amber-700"
                                : "border-slate-200 bg-slate-100 text-slate-600"
                            }`}
                        >
                          {prod.status}
                        </span>
                      </td>

                      {/* Actions */}

                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() =>
                              setViewingProduct(prod)
                            }
                            title="Inspect Pharmaceutical Monograph"
                            className="cursor-pointer rounded-lg p-1.5 text-slate-500 transition hover:bg-blue-50 hover:text-blue-600"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleToggleStatus(
                                prod
                              )
                            }
                            title={
                              prod.status ===
                                "ACTIVE"
                                ? "Deactivate Product"
                                : "Activate Product"
                            }
                            className="cursor-pointer rounded-lg p-1.5 text-slate-500 transition hover:bg-emerald-50 hover:text-emerald-600"
                          >
                            <RotateCcw className="h-3.5 w-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleOpenEdit(prod)
                            }
                            title="Edit Product"
                            className="cursor-pointer rounded-lg p-1.5 text-slate-500 transition hover:bg-blue-50 hover:text-blue-600"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              setDeleteConfirmProduct(
                                prod
                              )
                            }
                            title="Archive or Remove Product"
                            className="cursor-pointer rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =====================================================
          CREATE / EDIT MODAL
      ====================================================== */}

      {isCreateEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-xl overflow-hidden my-8">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-slate-900 text-sm">
                    {editingProduct ? 'Edit Master Product Specifications' : 'Add New Regulated Pharmaceutical Product'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {editingProduct
                      ? `Updating catalog entry for ${editingProduct.name}`
                      : 'Register new line with NAFDAC regulatory compliance & pricing bounds'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitProduct} className="p-5 space-y-4 text-xs">
              {/* Basic Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="font-semibold text-slate-700 block">Product Trade Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Ciprofloxacin 500mg Film-Coated Tablets"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Icon / Emoji</label>
                  <div className="flex items-center gap-2">
                    <select
                      value={formData.emoji}
                      onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500"
                    >
                      {EMOJI_OPTIONS.map((em) => (
                        <option key={em} value={em}>
                          {em}
                        </option>
                      ))}
                    </select>
                    <span className="text-xl">{formData.emoji}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Active Pharmaceutical Ingredient (API) *</label>
                  <input
                    type="text"
                    required
                    value={formData.activeIngredient}
                    onChange={(e) => setFormData({ ...formData, activeIngredient: e.target.value })}
                    placeholder="e.g. Ciprofloxacin Hydrochloride USP"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Therapeutic Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500"
                  >
                    {CATEGORIES.filter((c) => c.value !== 'ALL').map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Strength, Dosage, Pack */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Strength / Concentration *</label>
                  <input
                    type="text"
                    required
                    value={formData.strength}
                    onChange={(e) => setFormData({ ...formData, strength: e.target.value })}
                    placeholder="e.g. 500mg, 1000mg/10ml"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white text-xs h-9"
                  />
                </div>

                {/* Dosage Form - shadcn UI Select */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-slate-700 block">Dosage Form *</label>
                    {isCustomDosage ? (
                      <button
                        type="button"
                        onClick={() => {
                          setIsCustomDosage(false);
                          setFormData({ ...formData, dosageForm: 'Oral Tablet' });
                        }}
                        className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold"
                      >
                        ← Standard List
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setIsCustomDosage(true);
                        }}
                        className="text-[11px] text-slate-500 hover:text-blue-600"
                        title="Enter a custom dosage form not in the list"
                      >
                        Custom...
                      </button>
                    )}
                  </div>

                  {isCustomDosage ? (
                    <input
                      type="text"
                      required
                      value={formData.dosageForm}
                      onChange={(e) => setFormData({ ...formData, dosageForm: e.target.value })}
                      placeholder="Specify custom formulation (e.g. Sublingual Film)"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white text-xs h-9"
                    />
                  ) : (
                    <Select
                      value={formData.dosageForm}
                      onValueChange={(val) => {
                        if (val === 'OTHER_CUSTOM') {
                          setIsCustomDosage(true);
                          setFormData({ ...formData, dosageForm: '' });
                        } else {
                          setFormData({ ...formData, dosageForm: val });
                        }
                      }}
                    >
                      <SelectTrigger className="w-full h-9 bg-slate-50 border-slate-200 text-xs">
                        <SelectValue placeholder="Select dosage formulation..." />
                      </SelectTrigger>
                      <SelectContent>
                        {!isKnownDosageForm && formData.dosageForm && (
                          <>
                            <SelectGroup>
                              <SelectLabel>Current Specified Form</SelectLabel>
                              <SelectItem value={formData.dosageForm}>
                                {formData.dosageForm}
                              </SelectItem>
                            </SelectGroup>
                            <SelectSeparator />
                          </>
                        )}
                        {DOSAGE_FORM_GROUPS.map((group, groupIdx) => (
                          <React.Fragment key={group.group}>
                            {groupIdx > 0 && <SelectSeparator />}
                            <SelectGroup>
                              <SelectLabel>{group.group}</SelectLabel>
                              {group.options.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                  {opt.label}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </React.Fragment>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                {/* Packaging / Pack Size - shadcn UI Select */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-slate-700 block">Packaging / Pack Size *</label>
                    {isCustomPackSize ? (
                      <button
                        type="button"
                        onClick={() => {
                          setIsCustomPackSize(false);
                          setFormData({
                            ...formData,
                            packSize: '100 tablets/pack',
                            unit: 'Packs of 100 Tablets (10x10 Blister)',
                          });
                        }}
                        className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold"
                      >
                        ← Standard List
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setIsCustomPackSize(true);
                        }}
                        className="text-[11px] text-slate-500 hover:text-blue-600"
                        title="Enter a custom packaging or pack size"
                      >
                        Custom...
                      </button>
                    )}
                  </div>

                  {isCustomPackSize ? (
                    <input
                      type="text"
                      required
                      value={formData.packSize}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          packSize: e.target.value,
                          unit: e.target.value,
                        })
                      }
                      placeholder="e.g. 5x10 Ampoules/Carton or 50 Vials/Box"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white text-xs h-9"
                    />
                  ) : (
                    <Select
                      value={formData.packSize}
                      onValueChange={(val) => {
                        if (val === 'OTHER_CUSTOM') {
                          setIsCustomPackSize(true);
                          setFormData({ ...formData, packSize: '' });
                        } else {
                          const foundOpt = PACK_SIZE_GROUPS.flatMap((g) => g.options).find(
                            (o) => o.value === val
                          );
                          setFormData({
                            ...formData,
                            packSize: val,
                            unit: foundOpt?.unitHint || formData.unit,
                          });
                        }
                      }}
                    >
                      <SelectTrigger className="w-full h-9 bg-slate-50 border-slate-200 text-xs">
                        <SelectValue placeholder="Select pack size..." />
                      </SelectTrigger>
                      <SelectContent>
                        {!isKnownPackSize && formData.packSize && (
                          <>
                            <SelectGroup>
                              <SelectLabel>Current Specified Size</SelectLabel>
                              <SelectItem value={formData.packSize}>
                                {formData.packSize}
                              </SelectItem>
                            </SelectGroup>
                            <SelectSeparator />
                          </>
                        )}
                        {PACK_SIZE_GROUPS.map((group, groupIdx) => (
                          <React.Fragment key={group.group}>
                            {groupIdx > 0 && <SelectSeparator />}
                            <SelectGroup>
                              <SelectLabel>{group.group}</SelectLabel>
                              {group.options.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                  {opt.label}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </React.Fragment>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>

              {/* Dispensing Unit synchronization indicator */}
              <div className="flex items-center justify-between px-3 py-1.5 bg-blue-50/60 rounded-lg border border-blue-100 text-[11px] text-blue-800">
                <span className="text-blue-700">Hospital Sourcing / Dispensing Unit:</span>
                <span className="font-semibold text-blue-900">{formData.unit}</span>
              </div>

              {/* Regulatory & Storage */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">NAFDAC Registration Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.nafdacRegNumber}
                    onChange={(e) => setFormData({ ...formData, nafdacRegNumber: e.target.value })}
                    placeholder="e.g. NAFDAC-04-9912"
                    className="w-full px-3 py-2 font-mono bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Catalog Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as ProductStatus })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500"
                  >
                    <option value="ACTIVE">ACTIVE (Hospital Sourcing Enabled)</option>
                    <option value="INACTIVE">INACTIVE (Temporarily Paused)</option>
                    <option value="ARCHIVED">ARCHIVED (Historical Record)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 block">GDP Storage Conditions *</label>
                <input
                  type="text"
                  required
                  value={formData.storageCondition}
                  onChange={(e) => setFormData({ ...formData, storageCondition: e.target.value })}
                  placeholder="e.g. Store below 25°C in original container or Cold chain 2°C - 8°C"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

              {/* Pricing & Platform Commission Bounds */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3">
                <span className="font-display font-bold text-slate-900 block text-[11px] uppercase tracking-wider">
                  Pricing Bounds & Platform Monetization Controls
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 block">Reference Base Price (₦) *</label>
                    <input
                      type="number"
                      required
                      min="100"
                      value={formData.referenceBasePrice}
                      onChange={(e) => setFormData({ ...formData, referenceBasePrice: Number(e.target.value) })}
                      className="w-full px-3 py-2 font-mono bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 block">Platform Commission (%) *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="30"
                      value={formData.commissionPercent}
                      onChange={(e) => setFormData({ ...formData, commissionPercent: Number(e.target.value) })}
                      className="w-full px-3 py-2 font-mono bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 block">Max Allowed Markup (%) *</label>
                    <input
                      type="number"
                      required
                      min="5"
                      max="100"
                      value={formData.maxMarkupPercent}
                      onChange={(e) => setFormData({ ...formData, maxMarkupPercent: Number(e.target.value) })}
                      className="w-full px-3 py-2 font-mono bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 bg-white p-2.5 rounded-lg border border-slate-200/80 flex items-center justify-between">
                  <span>
                    Calculated platform revenue per unit sold:
                  </span>
                  <span className="font-mono font-bold text-blue-700">
                    ₦{Math.round((formData.referenceBasePrice * formData.commissionPercent) / 100).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 block">Clinical Indication / Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Clinical usage, indication, pharmacology, and standard dispensing warnings..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white text-xs"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateEditModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isSubmitting ? 'Saving...' : editingProduct ? 'Save Changes' : 'Catalog Product'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================
          VIEW PRODUCT MONOGRAPH
      ====================================================== */}

      {viewingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="my-8 w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 p-5">
              <div className="flex items-center gap-3">
                <span className="rounded-xl border border-slate-200 bg-white p-2 text-2xl shadow-2xs">
                  {viewingProduct.emoji}
                </span>

                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {viewingProduct.name}
                  </h3>

                  <p className="text-[11px] text-slate-500">
                    NAFDAC Monograph •{" "}
                    {viewingProduct.activeIngredient}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  setViewingProduct(null)
                }
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-5 p-6 text-xs">
              {/* Attributes */}

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <span className="block text-[10.5px] text-slate-400">
                    NAFDAC Reg No
                  </span>

                  <span className="mt-0.5 block font-mono text-xs font-bold text-slate-900">
                    {viewingProduct.nafdacRegNumber}
                  </span>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <span className="block text-[10.5px] text-slate-400">
                    Therapeutic Class
                  </span>

                  <span className="mt-0.5 block truncate text-xs font-semibold text-slate-900">
                    {viewingProduct.category}
                  </span>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <span className="block text-[10.5px] text-slate-400">
                    Dosage & Strength
                  </span>

                  <span className="mt-0.5 block text-xs font-semibold text-slate-900">
                    {viewingProduct.strength} (
                    {viewingProduct.dosageForm})
                  </span>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <span className="block text-[10.5px] text-slate-400">
                    Regulatory Status
                  </span>

                  <span
                    className={`mt-0.5 block text-xs font-bold ${viewingProduct.status ===
                        "ACTIVE"
                        ? "text-emerald-700"
                        : viewingProduct.status ===
                          "ARCHIVED"
                          ? "text-amber-700"
                          : "text-slate-600"
                      }`}
                  >
                    {viewingProduct.status}
                  </span>
                </div>
              </div>

              {/* Storage */}

              <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3.5">
                <ThermometerSnowflake className="mt-0.5 h-5 w-5 shrink-0 text-sky-600" />

                <div>
                  <span className="block text-xs font-semibold text-slate-900">
                    GDP Environmental Protocol
                  </span>

                  <p className="mt-0.5 text-[11.5px] text-slate-600">
                    {
                      viewingProduct.storageCondition
                    }
                  </p>
                </div>
              </div>

              {/* Financial */}

              <div className="space-y-2 rounded-xl border border-blue-100 bg-blue-50/70 p-4">
                <span className="block text-xs font-bold text-blue-900">
                  Commercial Pricing & Platform Parameters
                </span>

                <div className="grid grid-cols-3 gap-2 text-[11.5px]">
                  <div>
                    <span className="block text-[10.5px] text-blue-600">
                      Reference Base
                    </span>

                    <span className="font-mono font-bold text-slate-900">
                      {formatCurrency(
                        viewingProduct.referenceBasePrice
                      )}
                    </span>
                  </div>

                  <div>
                    <span className="block text-[10.5px] text-blue-600">
                      Commission (
                      {
                        viewingProduct.commissionPercent
                      }
                      %)
                    </span>

                    <span className="font-mono font-bold text-blue-700">
                      {formatCurrency(
                        Math.round(
                          (viewingProduct.referenceBasePrice *
                            viewingProduct.commissionPercent) /
                          100
                        )
                      )}
                    </span>
                  </div>

                  <div>
                    <span className="block text-[10.5px] text-blue-600">
                      Max Markup
                    </span>

                    <span className="font-mono font-bold text-slate-900">
                      {
                        viewingProduct.maxMarkupPercent
                      }
                      %
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}

              {viewingProduct.description && (
                <div>
                  <span className="mb-1 block font-semibold text-slate-800">
                    Clinical Indication & Monograph
                  </span>

                  <p className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs leading-relaxed text-slate-600">
                    {
                      viewingProduct.description
                    }
                  </p>
                </div>
              )}

              {/* Supplier Inventory */}

              <div>
                <span className="mb-2 block font-semibold text-slate-800">
                  Verified Suppliers Stocking this SKU (
                  {
                    inventory.filter(
                      (item) =>
                        item.productId ===
                        viewingProduct.id
                    ).length
                  }
                  )
                </span>

                <div className="overflow-hidden rounded-xl border border-slate-200">
                  <table className="w-full text-left text-[11px]">
                    <thead className="border-b border-slate-100 bg-slate-50 text-slate-500">
                      <tr>
                        <th className="px-3 py-2">
                          Supplier
                        </th>

                        <th className="px-3 py-2">
                          Tier
                        </th>

                        <th className="px-3 py-2">
                          Stock
                        </th>

                        <th className="px-3 py-2">
                          Unit Price
                        </th>

                        <th className="px-3 py-2">
                          Fulfillment
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {inventory
                        .filter(
                          (item) =>
                            item.productId ===
                            viewingProduct.id
                        )
                        .map((inv) => (
                          <tr key={inv.id}>
                            <td className="px-3 py-2 font-semibold text-slate-900">
                              {inv.supplierName}
                            </td>

                            <td className="px-3 py-2">
                              <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-700">
                                {
                                  inv.supplierType
                                }
                              </span>
                            </td>

                            <td className="px-3 py-2 font-mono font-semibold text-slate-800">
                              {inv.stock.toLocaleString()}
                            </td>

                            <td className="px-3 py-2 font-mono font-bold text-slate-900">
                              {formatCurrency(
                                inv.basePrice
                              )}
                            </td>

                            <td className="px-3 py-2 font-mono font-semibold text-emerald-700">
                              {
                                inv.fulfillmentRate
                              }
                              %
                            </td>
                          </tr>
                        ))}

                      {inventory.filter(
                        (item) =>
                          item.productId ===
                          viewingProduct.id
                      ).length === 0 && (
                          <tr>
                            <td
                              colSpan={5}
                              className="py-5 text-center text-slate-400"
                            >
                              No supplier inventory
                              registered for this
                              product.
                            </td>
                          </tr>
                        )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 p-4">
              <button
                type="button"
                onClick={() => {
                  const product =
                    viewingProduct;

                  setViewingProduct(null);

                  handleOpenEdit(product);
                }}
                className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-100"
              >
                <Edit2 className="h-3.5 w-3.5" />

                <span>Edit Parameters</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  setViewingProduct(null)
                }
                className="cursor-pointer rounded-xl bg-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-300"
              >
                Close Monograph
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          DELETE / ARCHIVE MODAL
      ====================================================== */}

      {deleteConfirmProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xl">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <AlertTriangle className="h-5 w-5" />
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Archive or Delist{" "}
                {deleteConfirmProduct.name}?
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Archiving retains the product record and
                audit history while preventing new hospital
                sourcing. Permanent deletion removes the
                product from this demo catalogue.
              </p>
            </div>

            <div className="space-y-1 rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-xs">
              <div>
                NAFDAC Reg:{" "}
                {
                  deleteConfirmProduct.nafdacRegNumber
                }
              </div>

              <div>
                Reference Base:{" "}
                {formatCurrency(
                  deleteConfirmProduct.referenceBasePrice
                )}
              </div>

              <div>
                Status:{" "}
                {deleteConfirmProduct.status}
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                type="button"
                onClick={() =>
                  handleExecuteDeleteOrArchive(true)
                }
                disabled={isSubmitting}
                className="w-full cursor-pointer rounded-xl bg-amber-600 py-2 text-xs font-bold text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Archive Product
              </button>

              <button
                type="button"
                onClick={() =>
                  handleExecuteDeleteOrArchive(false)
                }
                disabled={isSubmitting}
                className="w-full cursor-pointer rounded-xl border border-red-200 bg-red-50 py-2 text-xs font-bold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Permanently Delete
              </button>

              <button
                type="button"
                onClick={() =>
                  setDeleteConfirmProduct(null)
                }
                className="w-full cursor-pointer rounded-xl bg-slate-100 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MasterProductCatalog;