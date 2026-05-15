// /lib/unit-config.ts
import { SupplierType, UnitType } from "@/types"


export const UNIT_CONFIG: Record<
  SupplierType,
  {
    label: string
    unitsPerPackage: number
    minOrderQuantity: number
  }
> = {
  importer: {
    label: "carton",
    unitsPerPackage: 100,
    minOrderQuantity: 100,
  },
  distributor: {
    label: "pack",
    unitsPerPackage: 10,
    minOrderQuantity: 10,
  },
  retailer: {
    label: "unit",
    unitsPerPackage: 1,
    minOrderQuantity: 1,
  },
}

const UNIT_MAP: Record<UnitType, number> = {
  unit: 1,
  pack: 10,
  carton: 1000,
}


export function toBaseUnits(
  quantity: number,
  unit: UnitType
): number {
  return quantity * UNIT_MAP[unit]
}

/**
 * Convert base unit → display unit
 */
export function fromBaseUnits(
  baseQty: number,
  unit: UnitType
): number {
  return baseQty / UNIT_MAP[unit]
}