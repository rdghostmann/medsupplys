// QuantityStep.tsx

"use client"

import {
  Minus,
  Plus,
} from "lucide-react"

import { Button } from "@/components/ui/button"

import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Supplier } from "@/types"



type Props = {
  supplier: Supplier

  quantity: number

  setQuantity: (
    value: number
  ) => void

  unitType:
    | "carton"
    | "pack"
    | "unit"

  setUnitType: (
    value:
      | "carton"
      | "pack"
      | "unit"
  ) => void

  totalUnits: number

  totalCost: number
}

export default function QuantityStep({
  supplier,
  quantity,
  setQuantity,
  unitType,
  setUnitType,
  totalUnits,
  totalCost,
}: Props) {
  const unitOptions = [
    "carton",
    "pack",
    "unit",
  ]

  return (
    <div
      className="
        grid
        gap-6
        lg:grid-cols-3
      "
    >
      <Card
        className="
          rounded-md
          lg:col-span-2
        "
      >
        <CardContent className="p-5">
          <div className="space-y-6">
            {/* UNIT TYPE */}

            <div>
              <h3
                className="
                  mb-3
                  text-lg
                  font-bold
                "
              >
                Select Unit Type
              </h3>

              <div className="flex flex-wrap gap-3">
                {unitOptions.map(
                  (unit) => (
                    <button
                      key={unit}
                      onClick={() =>
                        setUnitType(
                          unit as
                            | "carton"
                            | "pack"
                            | "unit"
                        )
                      }
                      className={`
                        rounded-md
                        border
                        px-4
                        py-1
                        text-sm
                        font-semibold
                        capitalize
                        transition-all
                        focus:outline-2

                        ${
                          unitType ===
                          unit
                            ? `
                              border-primary
                              bg-primary
                              text-white
                            `
                            : `
                              border-slate-200
                              bg-white
                              text-slate-600
                            `
                        }
                      `}
                    >
                      {unit}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* QUANTITY */}

            <div>
              <h3
                className="
                  mb-3
                  text-lg
                  font-bold
                "
              >
                Quantity
              </h3>

              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >
                <Button
                  size="icon"
                  variant="outline"
                  className="rounded-2xl focus:outline-2"
                  onClick={() =>
                    setQuantity(
                      Math.max(
                        supplier.minOrderQuantity,
                        quantity - 1
                      )
                    )
                  }
                >
                  <Minus
                    className="
                      h-4
                      w-4
                    "
                  />
                </Button>

                <div
                  className="
                    flex
                    h-12
                    w-24
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    text-xl
                    font-black
                  "
                >
                  {quantity}
                </div>

                <Button
                  size="icon"
                  variant="outline"
                  className="rounded-2xl focus:outline-2"
                  onClick={() =>
                    setQuantity(
                      quantity + 1
                    )
                  }
                >
                  <Plus
                    className="
                      h-4
                      w-4
                    "
                  />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SUMMARY */}

      <Card className="rounded-3xl">
        <CardContent className="p-5">
          <h3
            className="
              mb-5
              text-lg
              font-bold
            "
          >
            Order Summary
          </h3>

          <div className="space-y-4">
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
                Unit Type
              </span>

              <span
                className="
                  font-semibold
                  capitalize
                "
              >
                {unitType}
              </span>
            </div>

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
                Total Units
              </span>

              <span
                className="
                  font-semibold
                "
              >
                {totalUnits}
              </span>
            </div>

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
                  font-semibold
                "
              >
                ₦
                {supplier.price.toLocaleString()}
              </span>
            </div>

            <div
              className="
                border-t
                pt-4
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
                    text-base
                    font-semibold
                  "
                >
                  Total Cost
                </span>

                <span
                  className="
                    text-2xl
                    font-black
                    text-primary
                  "
                >
                  ₦
                  {totalCost.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}