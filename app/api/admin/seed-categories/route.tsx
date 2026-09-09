import { NextResponse } from "next/server";

import { connectToDB } from "@/lib/connectToDB";
import ProductCategory from "@/models/ProductCategory";

import {
  PRODUCT_CATEGORY_SEED_DATA,
} from "@/lib/seed/product-categories";

export async function POST() {
  try {
    await connectToDB();

    let inserted = 0;
    let updated = 0;

    for (const category of PRODUCT_CATEGORY_SEED_DATA) {
      const existing = await ProductCategory.findOne({
        code: category.code,
      });

      if (existing) {
        existing.name = category.name;
        existing.slug = category.slug;
        existing.isActive = true;

        await existing.save();

        updated++;
      } else {
        await ProductCategory.create({
          ...category,
          isActive: true,
          sortOrder: inserted,
        });

        inserted++;
      }
    }

    const total = await ProductCategory.countDocuments();

    return NextResponse.json({
      success: true,
      message: "Product categories seeded successfully.",
      inserted,
      updated,
      total,
    });
  } catch (error) {
    console.error("SEED_CATEGORIES_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to seed product categories.",
      },
      {
        status: 500,
      }
    );
  }
}