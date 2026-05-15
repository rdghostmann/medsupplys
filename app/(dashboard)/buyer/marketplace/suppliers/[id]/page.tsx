// /buyer/marketplace/suppliers/[id]/page.tsx

import { notFound } from "next/navigation"

import "@/models/User"
import "@/models/Product"
import "@/models/SupplierProduct"

import { SupplierProduct } from "@/models/SupplierProduct"

import {
  getProcurementIntelligence,
} from "@/services/marketplace.service"

import { SupplierPool } from "./SupplierPool"

import { connectToDB } from "@/lib/connectToDB"

import type {
  Supplier,
  MarketplaceSupplier,
} from "@/types"

type PageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function Page({
  params,
}: PageProps) {
  const { id } = await params

  await connectToDB()

  const supplierProducts =
    await SupplierProduct.find({
      productId: id,
    })
      .populate(
        "supplierId",
        `
          name
          email
          verified
          rating
          supplierType
          supplierProfile
        `
      )
      .populate("productId")
      .lean()

  if (!supplierProducts?.length) {
    notFound()
  }

  const first =
    supplierProducts[0] as any

  /* ======================================================
     PRODUCT
  ====================================================== */

  const product = {
    _id:
      first?.productId?._id?.toString() ||
      "",

    name:
      first?.productId?.name || "",

    category:
      first?.productId?.category ||
      "",

    description:
      first?.productId?.description ||
      "",

    image:
      first?.productId?.images
        ?.primary || "",
  }

  /* ======================================================
     SUPPLIERS
  ====================================================== */

  const suppliers: MarketplaceSupplier[] =
    supplierProducts.map(
      (sp: any): MarketplaceSupplier => ({
        _id:
          sp?.supplierId?._id?.toString() ||
          "",

        supplierProductId:
          sp?._id?.toString() || "",

        name:
          sp?.supplierId
            ?.supplierProfile
            ?.businessName ||
          sp?.supplierId?.name ||
          "Unknown Supplier",

        email:
          sp?.supplierId?.email || "",

        supplierType:
          sp?.supplierType ||
          sp?.supplierId
            ?.supplierType ||
          "retailer",

        verified: Boolean(
          sp?.supplierId?.verified
        ),

        rating: Number(
          sp?.supplierId?.rating || 0
        ),

        logo:
          sp?.supplierId
            ?.supplierProfile?.logo ||
          "",

        phone:
          sp?.supplierId
            ?.supplierProfile?.phone ||
          "",

        address:
          sp?.supplierId
            ?.supplierProfile
            ?.address || "",

        license:
          sp?.supplierId
            ?.supplierProfile
            ?.license || "",

        salesUnit:
          sp?.salesUnit || "unit",

        price: Number(
          sp?.price ?? 0
        ),

        stock: Number(
          sp?.stock ?? 0
        ),

        minOrderQuantity: Number(
          sp?.minOrderQuantity ?? 1
        ),

        maxOrderQuantity:
          sp?.maxOrderQuantity ??
          null,

        createdAt:
          sp?.createdAt?.toISOString?.() ||
          new Date().toISOString(),

        supplierProfile: {
          businessName:
            sp?.supplierId
              ?.supplierProfile
              ?.businessName || "",

          logo:
            sp?.supplierId
              ?.supplierProfile?.logo ||
            "",
        },
      })
    )

  /* ======================================================
     PROCUREMENT INTELLIGENCE
  ====================================================== */

  const intelligence = await getProcurementIntelligence({
    suppliers,
    quantity: 10,
  })

  const enrichedSuppliers: Supplier[] =
    suppliers.map((supplier) => {
      const matched =
        intelligence.rankedSuppliers.find(
          (m) =>
            m._id === supplier._id
        )

      return {
        ...supplier,

        score:
          matched?.score ?? 0,

        rank:
          matched?.rank ?? 0,

        reasons:
          matched?.reasons ?? [],

        recommendation:
          matched?.recommendation ?? {
            isRecommended: false,
            confidence: 0,
            badges: [],
          },
      }
    })

  /* ======================================================
     RENDER
  ====================================================== */

  return (
    <SupplierPool
      product={product}
      suppliers={enrichedSuppliers}
    />
  )
}