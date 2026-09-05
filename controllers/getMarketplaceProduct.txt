// /controllers/getMarketplaceProduct.ts

import mongoose from "mongoose"

import { Product } from "@/models/Product"
import { SupplierProduct } from "@/models/SupplierProduct"
import { User } from "@/models/User"
import { connectToDB } from "@/lib/connectToDB"


/* =========================================================
   TYPES
========================================================= */

type GetMarketplaceProductByIdParams =
  {
    productId: string

    supplierProductId?: string
  }

/* =========================================================
   GET MARKETPLACE PRODUCT BY ID
========================================================= */

export async function getMarketplaceProductById({
  productId,
  supplierProductId,
}: GetMarketplaceProductByIdParams) {
  try {
    /* =====================================================
       DB CONNECTION
    ===================================================== */

    await connectToDB()

    /* =====================================================
       VALIDATE PRODUCT ID
    ===================================================== */

    if (
      !mongoose.Types.ObjectId.isValid(
        productId
      )
    ) {
      return null
    }

    /* =====================================================
       VALIDATE SUPPLIER PRODUCT ID
    ===================================================== */

    if (
      supplierProductId &&
      !mongoose.Types.ObjectId.isValid(
        supplierProductId
      )
    ) {
      return null
    }

    /* =====================================================
       FETCH PRODUCT
    ===================================================== */

    const product =
      await Product.findById(
        productId
      ).lean()

    if (!product) {
      return null
    }

    /* =====================================================
       FETCH SUPPLIER PRODUCTS
    ===================================================== */

    const supplierProducts =
      await SupplierProduct.find({
        productId,
        isFlagged: false,
      })
        .populate({
          path: "supplierId",

          model: User,

          select: `
            _id
            name
            email
            rating
            verified
            supplierType
            supplierProfile
          `,
        })
        .sort({
          createdAt: -1,
        })
        .lean()

    /* =====================================================
       NORMALIZE SUPPLIERS
    ===================================================== */

    const suppliers =
      supplierProducts.map(
        (item: any) => {
          const supplier =
            item.supplierId

          return {
            _id:
              supplier?._id?.toString() ||
              "",

            supplierProductId:
              item._id?.toString() ||
              "",

            name:
              supplier
                ?.supplierProfile
                ?.businessName ||
              supplier?.name ||
              "Unknown Supplier",

            email:
              supplier?.email ||
              "",

            supplierType:
              item.supplierType ||
              "distributor",

            verified:
              Boolean(
                supplier?.verified
              ),

            rating:
              Number(
                supplier?.rating
              ) || 0,

            logo:
              supplier
                ?.supplierProfile
                ?.logo || "",

            phone:
              supplier
                ?.supplierProfile
                ?.phone || "",

            address:
              supplier
                ?.supplierProfile
                ?.address || "",

            license:
              supplier
                ?.supplierProfile
                ?.license || "",

            salesUnit:
              item.salesUnit ||
              "unit",

            price:
              Number(item.price) ||
              0,

            stock:
              Number(item.stock) ||
              0,

            status:
              item.status ||
              "available",

            minOrderQuantity:
              Number(
                item.minOrderQuantity
              ) || 1,

            maxOrderQuantity:
              item.maxOrderQuantity ||
              null,

            verificationImages:
              item.verificationImages ||
              [],

            createdAt:
              item.createdAt?.toISOString?.() ||
              new Date().toISOString(),
          }
        }
      )

    /* =====================================================
       FIND SELECTED SUPPLIER PRODUCT
    ===================================================== */

    const selectedSupplier =
      suppliers.find(
        (supplier) =>
          supplier.supplierProductId ===
          supplierProductId
      ) || suppliers[0]

    /* =====================================================
       ANALYTICS
    ===================================================== */

    const availableSuppliers =
      suppliers.filter(
        (supplier) =>
          supplier.status !== "out"
      )

    const lowestPrice =
      availableSuppliers.length > 0
        ? Math.min(
            ...availableSuppliers.map(
              (supplier) =>
                supplier.price
            )
          )
        : 0

    const highestPrice =
      availableSuppliers.length > 0
        ? Math.max(
            ...availableSuppliers.map(
              (supplier) =>
                supplier.price
            )
          )
        : 0

    const totalStock =
      availableSuppliers.reduce(
        (acc, supplier) =>
          acc + supplier.stock,
        0
      )

    /* =====================================================
       RESPONSE
    ===================================================== */

    return {
      product: {
        _id:
          product._id?.toString() ||
          "",

        name:
          product.name || "",

        category:
          product.category || "",

        description:
          product.description || "",

        image:
          product.images?.primary ||
          "",

        gallery:
          product.images?.gallery ||
          [],

        pricing:
          product.pricing ||
          null,
      },

      suppliers,

      selectedSupplier,

      analytics: {
        totalSuppliers:
          suppliers.length,

        availableSuppliers:
          availableSuppliers.length,

        totalStock,

        lowestPrice,

        highestPrice,
      },
    }
  } catch (error) {
    console.error(
      "GET_MARKETPLACE_PRODUCT_BY_ID_ERROR",
      error
    )

    return null
  }
}