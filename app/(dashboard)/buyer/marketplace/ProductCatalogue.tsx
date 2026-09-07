// ProductCatalogue.tsx
"use client";

import React, { useMemo, useState } from "react";
import {
  Package2,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import ProductCard from "./ProductCard";
import SourcingDrawer from "./SourcingDrawer";

import type { MarketplaceProduct } from "@/types";

interface ProductCatalogueProps {
  products: MarketplaceProduct[];
}

export default function ProductCatalogue({
  products,
}: ProductCatalogueProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  const [selectedProduct, setSelectedProduct] =
    useState<MarketplaceProduct | null>(null);

  const [isSourcingOpen, setIsSourcingOpen] = useState(false);

  /*
   * Build categories from the Master Product catalogue.
   */
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(
        products
          .map((product) => product.category)
          .filter(Boolean)
      )
    ).sort();

    return ["ALL", ...uniqueCategories];
  }, [products]);

  /*
   * Search + category filtering.
   */
  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === "ALL" ||
        product.category === selectedCategory;

      if (!normalizedSearch) {
        return matchesCategory;
      }

      const searchableText = [
        product.name,
        product.genericName,
        product.brandName,
        product.activeIngredient,
        product.strength,
        product.category,
        product.description,
        product.dosageForm,
        product.packSize,
        product.storageCondition,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return (
        matchesCategory &&
        searchableText.includes(normalizedSearch)
      );
    });
  }, [
    products,
    search,
    selectedCategory,
  ]);

  /*
   * ProductCard → SourcingDrawer
   */
  const handleProcure = (
    product: MarketplaceProduct
  ) => {
    setSelectedProduct(product);
    setIsSourcingOpen(true);
  };

  /*
   * Close drawer.
   */
  const handleCloseSourcing = () => {
    setIsSourcingOpen(false);

    window.setTimeout(() => {
      setSelectedProduct(null);
    }, 250);
  };

  /*
   * Clear catalogue filters.
   */
  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("ALL");
  };

  return (
    <>
      <section className="space-y-6">

        {/* Catalogue Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <div className="hidden h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                  {/* <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50"> */}
                    <Package2 className="h-5 w-5 text-blue-600" />
                  </div>
                  <h1 className="text-xl font-bold tracking-tight text-slate-900">
                    Regulated Master Pharmaceutical Catalog
                  </h1>

                  <Badge
                    variant="secondary"
                    className="rounded-full bg-slate-100 text-xs text-slate-600"
                  >
                    {products.length}
                  </Badge>
                </div>

                <p className="mt-1 text-sm text-slate-500">
                  Browse verified healthcare products from across
                  Importers, Manufacturers and Tier-1 Distributors.
                </p>
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-500">
            {filteredProducts.length} of {products.length} products
          </div>
        </div>

        {/* Search + Filters */}
        <div className="space-y-3">

          <div className="flex flex-col gap-3 md:flex-row">

            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <Input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search pharmaceutical products..."
                className="h-11 rounded-xl border-slate-200 bg-white pl-10 pr-10"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <Button
              type="button"
              variant="outline"
              className="h-11 rounded-xl border-slate-200"
            >
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((category) => {
              const active =
                selectedCategory === category;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() =>
                    setSelectedCategory(category)
                  }
                  className={[
                    "whitespace-nowrap rounded-full border px-4 py-2 text-xs font-semibold transition-colors",
                    active
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700",
                  ].join(" ")}
                >
                  {category === "ALL"
                    ? "All Products"
                    : category}
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.productId}
                product={product}
                onProcure={handleProcure}
              />
            ))}
          </div>
        ) : (
          <div className="flex min-h-75 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 px-6 text-center">

            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">
              <Package2 className="h-6 w-6 text-slate-400" />
            </div>

            <h3 className="mt-4 text-base font-semibold text-slate-800">
              No products found
            </h3>

            <p className="mt-1 max-w-md text-sm text-slate-500">
              No pharmaceutical products match your current
              search or category filter.
            </p>

            {(search || selectedCategory !== "ALL") && (
              <Button
                type="button"
                variant="outline"
                className="mt-4 rounded-xl"
                onClick={clearFilters}
              >
                Clear Filters
              </Button>
            )}
          </div>
        )}
      </section>

      {/* =====================================================
          PHASE 4
          ProductCatalogue → SourcingDrawer
          ===================================================== */}

      {selectedProduct && (
        <SourcingDrawer
          product={selectedProduct}
          open={isSourcingOpen}
          onClose={handleCloseSourcing}
        />
      )}
    </>
  );
}