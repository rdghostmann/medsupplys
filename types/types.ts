/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CatalogProduct {
  id: string;
  name: string;
  category: string;
  type: 'IMPORTER' | 'DISTRIBUTOR';
  unit: string;
  moq: number;
  defaultBasePrice: number;
  iconType: 'capsule-yellow-red' | 'pill-red' | 'pill-blue' | 'heart-red' | 'heart-blue' | 'pill-green' | 'tablet-white' | 'capsule-blue' | 'tablet-purple';
}

export interface InventoryProduct {
  id: string; // instance id
  catalogId: string;
  name: string;
  category: string;
  type: 'IMPORTER' | 'DISTRIBUTOR';
  unit: string;
  basePrice: number;
  commission: number; // 10% of base price
  finalPrice: number; // basePrice + commission
  stock: number;
  moq: number;
  batchInfo: string;
  iconType: CatalogProduct['iconType'];
}

export interface InventoryStats {
  totalSkus: number;
  totalStockElements: number;
  outOfStockCount: number;
  lowStockCount: number; // stock < moq
  totalValuation: number; // sum of stock * basePrice
}
