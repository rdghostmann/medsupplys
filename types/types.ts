
export interface InventoryProduct {
  id: string;
  name: string;
  category: string;
  nafdacNumber?: string;
  basePrice: number;
  finalPrice: number;
  stock: number;
  moq: number;
}
