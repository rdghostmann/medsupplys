// ReviewOrderStep.tsx

"use client"

import Image from "next/image"

import {
  BadgeCheck,
  Building2,
  Boxes,
  Package,
} from "lucide-react"

import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Supplier } from "@/types"


type Product = {
  _id: string

  name: string

  category: string

  description: string

  image: string
}

type Props = {
  product: Product

  supplier: Supplier
}

export default function ReviewOrderStep({
  product,
  supplier,
}: Props) {
  return (
    <div
      className="
        grid
        gap-6
        lg:grid-cols-3
      "
    >
      {/* PRODUCT */}

      <Card
        className="
          rounded-3xl
          lg:col-span-2
        "
      >
        <CardContent className="p-5">
          <div
            className="
              flex
              flex-col
              gap-5
              sm:flex-row
            "
          >
            <div
              className="
                relative
                h-40
                w-full
                overflow-hidden
                rounded-2xl
                border
                bg-slate-100
                sm:h-36
                sm:w-36
              "
            >
              <Image
                src={product.image || "/placeholder.png"}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex-1">
              <div
                className="
                  mb-3
                  flex
                  flex-wrap
                  items-center
                  gap-2
                "
              >
                <span
                  className="
                    rounded-full
                    bg-primary/10
                    px-3
                    py-1
                    text-[11px]
                    font-bold
                    uppercase
                    tracking-wide
                    text-primary
                  "
                >
                  {
                    product.category
                  }
                </span>
              </div>

              <h2
                className="
                  text-2xl
                  font-black
                  text-slate-900
                "
              >
                {product.name}
              </h2>

              <p
                className="
                  mt-3
                  text-sm
                  leading-relaxed
                  text-slate-600
                "
              >
                {
                  product.description
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SUPPLIER */}

      <Card className="rounded-3xl">
        <CardContent
          className="
            flex
            h-full
            flex-col
            p-5
          "
        >
          <div
            className="
              mb-5
              flex
              items-center
              justify-between
            "
          >
            <div
              className="
                flex
                items-center
                gap-3
              "
            >
              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-2xl
                  bg-primary/10
                  text-primary
                "
              >
                <Building2
                  className="
                    h-5
                    w-5
                  "
                />
              </div>

              <div>
                <h3
                  className="
                    text-lg
                    font-bold
                    text-slate-900
                  "
                >
                  {supplier.name}
                </h3>

                <p
                  className="
                    text-xs
                    uppercase
                    tracking-wide
                    text-slate-400
                  "
                >
                  {
                    supplier.supplierType
                  }
                </p>
              </div>
            </div>

            {supplier.verified && (
              <BadgeCheck
                className="
                  h-5
                  w-5
                  text-green-500
                "
              />
            )}
          </div>

          <div className="space-y-4">
            <div
              className="
                rounded-2xl
                border
                bg-slate-50
                p-4
              "
            >
              <div
                className="
                  flex
                  items-center
                  justify-between
                "
              >
                <span
                  className="
                    text-sm
                    text-slate-500
                  "
                >
                  Unit Price
                </span>

                <span
                  className="
                    text-lg
                    font-black
                    text-primary
                  "
                >
                  ₦
                  {supplier.price.toLocaleString()}
                </span>
              </div>
            </div>

            <div
              className="
                grid
                grid-cols-2
                gap-3
              "
            >
              <div
                className="
                  rounded-2xl
                  border
                  p-4
                "
              >
                <div
                  className="
                    mb-2
                    flex
                    items-center
                    gap-2
                  "
                >
                  <Boxes
                    className="
                      h-4
                      w-4
                      text-slate-400
                    "
                  />

                  <span
                    className="
                      text-xs
                      text-slate-500
                    "
                  >
                    Stock
                  </span>
                </div>

                <h4
                  className="
                    text-lg
                    font-black
                  "
                >
                  {supplier.stock}
                </h4>
              </div>

              <div
                className="
                  rounded-2xl
                  border
                  p-4
                "
              >
                <div
                  className="
                    mb-2
                    flex
                    items-center
                    gap-2
                  "
                >
                  <Package
                    className="
                      h-4
                      w-4
                      text-slate-400
                    "
                  />

                  <span
                    className="
                      text-xs
                      text-slate-500
                    "
                  >
                    MOQ
                  </span>
                </div>

                <h4
                  className="
                    text-lg
                    font-black
                  "
                >
                  {
                    supplier.minOrderQuantity
                  }
                </h4>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}