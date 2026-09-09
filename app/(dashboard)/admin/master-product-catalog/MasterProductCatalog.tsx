"use client";

import React, {
  useCallback,
  useMemo,
  useState,
} from "react";

import {
  Package,
  Plus,
  Search,
  AlertTriangle,
  X,
  CheckCircle2,
  ThermometerSnowflake,
  Edit2,
} from "lucide-react";

import { toast } from "sonner";

import type {
  MasterProduct,
  ProductStatus,
} from "@/types";

import type { SupplierInventoryRecord } from "@/controllers/product.action";

import { DOSAGE_FORM_GROUPS, PACK_SIZE_GROUPS } from "@/lib/catalogOptions";

import CatalogStats from "./CatalogStats";
import CatalogToolbar, {
  type CatalogSort,
  type CatalogViewMode,
} from "./CatalogToolbar";

import CatalogTable from "./CatalogTable";
import CatalogGrid from "./CatalogGrid";
import CreateEditProductModal, {
  type ProductFormData,
} from "./CreateEditProductModal";

type Product = MasterProduct;
type SupplierInventory = SupplierInventoryRecord;

interface MasterProductCatalogProps {
  products: MasterProduct[];
  inventory: SupplierInventory[];
}

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
  storageCondition:
    "Store below 30°C in a dry place.",
  emoji: "💊",
};

export const MasterProductCatalog: React.FC<
  MasterProductCatalogProps
> = ({ products, inventory }) => {
  const [catalogProducts, setCatalogProducts] =
    useState<MasterProduct[]>(products);

  /*
   * ==========================================================
   * Catalogue UI State
   * ==========================================================
   */

  const [searchQuery, setSearchQuery] =
    useState("");

  const [selectedCategory, setSelectedCategory] =
    useState("ALL");

  const [selectedStatus, setSelectedStatus] =
    useState<"ALL" | ProductStatus>("ALL");

  const [sortBy, setSortBy] =
    useState<CatalogSort>("name");

  const [viewMode, setViewMode] =
    useState<CatalogViewMode>("table");

  /*
   * ==========================================================
   * Modal State
   * ==========================================================
   */

  const [isCreateEditModalOpen, setIsCreateEditModalOpen] =
    useState(false);

  const [editingProduct, setEditingProduct] =
    useState<Product | null>(null);

  const [viewingProduct, setViewingProduct] =
    useState<Product | null>(null);

  const [deleteConfirmProduct, setDeleteConfirmProduct] =
    useState<Product | null>(null);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  /*
   * ==========================================================
   * Filter + Sort
   * ==========================================================
   */

  const filteredProducts = useMemo(() => {
    const query = searchQuery
      .trim()
      .toLowerCase();

    return [...catalogProducts]
      .filter((product) => {
        const matchesQuery =
          !query ||
          product.name
            .toLowerCase()
            .includes(query) ||
          product.activeIngredient
            .toLowerCase()
            .includes(query) ||
          product.dosageForm
            .toLowerCase()
            .includes(query) ||
          product.unit
            .toLowerCase()
            .includes(query) ||
          product.packSize
            .toLowerCase()
            .includes(query);

        const matchesCategory =
          selectedCategory === "ALL" ||
          product.category === selectedCategory;

        const matchesStatus =
          selectedStatus === "ALL" ||
          product.status === selectedStatus;

        return (
          matchesQuery &&
          matchesCategory &&
          matchesStatus
        );
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "price-asc":
            return (
              Number(a.referenceBasePrice) -
              Number(b.referenceBasePrice)
            );

          case "price-desc":
            return (
              Number(b.referenceBasePrice) -
              Number(a.referenceBasePrice)
            );

          case "commission":
            return (
              Number(b.commissionPercent || 0) -
              Number(a.commissionPercent || 0)
            );

          case "name":
          default:
            return a.name.localeCompare(b.name);
        }
      });
  }, [
    catalogProducts,
    searchQuery,
    selectedCategory,
    selectedStatus,
    sortBy,
  ]);

  /*
   * ==========================================================
   * Modal Helpers
   * ==========================================================
   */

  const handleOpenCreate = useCallback(() => {
    setEditingProduct(null);
    setIsCreateEditModalOpen(true);
  }, []);

  const handleOpenEdit = useCallback(
    (product: Product) => {
      setEditingProduct(product);
      setIsCreateEditModalOpen(true);
    },
    []
  );

  /*
   * ==========================================================
   * Product Submit
   * ==========================================================
   */

  const handleSaveProduct = async (
    productData: ProductFormData,
    id?: string
  ) => {
    const product: Product = {
      id: id || `PROD-${String(catalogProducts.length + 1).padStart(3, "0")}`,
      ...productData,
    };

    setCatalogProducts((current) =>
      id
        ? current.map((item) => (item.id === id ? product : item))
        : [product, ...current]
    );

    toast.success(id ? "Product Updated" : "Product Catalogued", {
      description: `Successfully ${id ? "updated" : "listed"} ${product.name}.`,
    });
  };

  /*
   * ==========================================================
   * Toggle Status
   * ==========================================================
   */

  const handleToggleStatus = useCallback(
    (product: Product) => {
      const nextStatus =
        product.status === "ACTIVE"
          ? "INACTIVE"
          : "ACTIVE";

      setCatalogProducts((current) =>
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
    },
    []
  );

  /*
   * ==========================================================
   * Delete / Archive
   * ==========================================================
   */

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
        setCatalogProducts((current) =>
          current.map((product) =>
            product.id ===
            deleteConfirmProduct.id
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
        setCatalogProducts((current) =>
          current.filter(
            (product) =>
              product.id !==
              deleteConfirmProduct.id
          )
        );

        toast.success("Product Removed", {
          description: `${deleteConfirmProduct.name} permanently removed from the catalogue.`,
        });
      }

      setDeleteConfirmProduct(null);
    } catch {
      toast.error("Action Failed", {
        description:
          "Could not update the product catalogue.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  /*
   * ==========================================================
   * Reset Filters
   * ==========================================================
   */

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("ALL");
    setSelectedStatus("ALL");
    setSortBy("name");
  };

  /*
   * ==========================================================
   * Render
   * ==========================================================
   */

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
            <span>
              Master Pharmaceutical Product Catalog
            </span>
          </h2>

          <p className="mt-0.5 text-xs text-slate-500">
            Central NAFDAC-approved registry,
            standardized reference pricing, and
            automated platform commission controls.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="flex cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Add Regulated Product
        </button>
      </div>

      {/* ======================================================
          KPI
      ======================================================= */}

      <CatalogStats
        products={catalogProducts}
      />

      {/* ======================================================
          Toolbar
      ======================================================= */}

      <CatalogToolbar
        products={catalogProducts}
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
        selectedStatus={selectedStatus}
        sortBy={sortBy}
        viewMode={viewMode}
        onSearchChange={setSearchQuery}
        onCategoryChange={setSelectedCategory}
        onStatusChange={setSelectedStatus}
        onSortChange={setSortBy}
        onViewModeChange={setViewMode}
      />

      {/* ======================================================
          Result Count / Empty State
      ======================================================= */}

      {filteredProducts.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <Search className="h-6 w-6" />
          </div>

          <h3 className="mt-3 text-sm font-bold text-slate-800">
            No matching pharmaceutical lines
            found
          </h3>

          <p className="mx-auto mt-1 max-w-md text-xs text-slate-500">
            Try adjusting your search terms,
            category, or status filters.
          </p>

          <div className="mt-4 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={clearFilters}
              className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
            >
              Clear All Filters
            </button>

            <button
              type="button"
              onClick={handleOpenCreate}
              className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
            >
              <Plus className="mr-1 inline h-3.5 w-3.5" />
              Catalog New Product
            </button>
          </div>
        </div>
      ) : viewMode === "table" ? (
        /* ====================================================
           TANSTACK TABLE VIEW
        ===================================================== */

        <CatalogTable
          products={filteredProducts}
          inventory={inventory}
          onViewProduct={setViewingProduct}
          onEditProduct={handleOpenEdit}
          onToggleStatus={handleToggleStatus}
          onDeleteProduct={
            setDeleteConfirmProduct
          }
        />
      ) : (
        /* ====================================================
           CARD GRID VIEW
        ===================================================== */

        <CatalogGrid
          products={filteredProducts}
          onViewProduct={setViewingProduct}
          onEditProduct={handleOpenEdit}
          onToggleStatus={handleToggleStatus}
          onDeleteProduct={
            setDeleteConfirmProduct
          }
        />
      )}

      <CreateEditProductModal
        key={`${isCreateEditModalOpen ? "open" : "closed"}-${editingProduct?.id ?? "new"}`}
        isCreateEditModalOpen={isCreateEditModalOpen}
        setIsCreateEditModalOpen={setIsCreateEditModalOpen}
        editingProduct={editingProduct}
        onSaveProduct={handleSaveProduct}
      />

      {/* ======================================================
          YOUR EXISTING PRODUCT MONOGRAPH MODAL
      ======================================================= */}

      {viewingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="my-8 w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">

            {/* Keep your existing monograph markup here.
                It continues to receive:
                
                viewingProduct
                inventory
                handleOpenEdit
                setViewingProduct
            */}

          </div>
        </div>
      )}

      {/* ======================================================
          DELETE / ARCHIVE MODAL
      ======================================================= */}

      {deleteConfirmProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-xl">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <AlertTriangle className="h-5 w-5" />
            </div>

            <div className="mt-4">
              <h3 className="text-sm font-bold text-slate-900">
                Archive or Delist{" "}
                {deleteConfirmProduct.name}?
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Archiving retains the product record
                and audit history while preventing new
                hospital sourcing.
              </p>
            </div>

            <div className="mt-4 space-y-1 rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-xs text-slate-600">
              
              <div>
                Reference Base: ₦
                {Number(
                  deleteConfirmProduct.referenceBasePrice
                ).toLocaleString("en-NG")}
              </div>

              <div>
                Status:{" "}
                {deleteConfirmProduct.status}
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() =>
                  handleExecuteDeleteOrArchive(true)
                }
                className="w-full rounded-xl bg-amber-600 py-2 text-xs font-bold text-white transition hover:bg-amber-700 disabled:opacity-50"
              >
                Archive Product
              </button>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={() =>
                  handleExecuteDeleteOrArchive(false)
                }
                className="w-full rounded-xl border border-red-200 bg-red-50 py-2 text-xs font-bold text-red-700 transition hover:bg-red-100 disabled:opacity-50"
              >
                Permanently Delete
              </button>

              <button
                type="button"
                onClick={() =>
                  setDeleteConfirmProduct(null)
                }
                className="w-full rounded-xl bg-slate-100 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
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