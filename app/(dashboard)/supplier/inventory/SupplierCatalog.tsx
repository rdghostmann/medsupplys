'use client';

import React, { useMemo, useState } from 'react';
import {
  Package,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Sparkles,
  ShieldCheck,
  X,
} from 'lucide-react';
import { toast } from 'sonner';

/* =========================================================
   Types
========================================================= */

type Product = {
  id: string;
  name: string;
  category: string;
  unit: string;
  commissionPercent: number;
  referenceBasePrice: number;
  nafdacVerified: boolean;
};

type InventoryStatus = 'AVAILABLE' | 'LOW_STOCK' | 'OUT_OF_STOCK';

type InventoryItem = {
  id: string;
  supplierId: string;
  productId: string;
  productName: string;
  unit: string;
  category: string;
  basePrice: number;
  commission: number;
  commissionPercent: number;
  finalPrice: number;
  stock: number;
  minOrderQuantity: number;
  batchNumber: string;
  expiryDate: string;
  status: InventoryStatus;
};

type SupplierUser = {
  id: string;
  name: string;
  role: 'SUPPLIER';
};

const DEFAULT_BATCH_NUMBER = 'BATCH-2026-100';

/* =========================================================
   Mock Data
========================================================= */

const MOCK_CURRENT_USER: SupplierUser = {
  id: 'supplier-001',
  name: 'May & Baker Nigeria Plc',
  role: 'SUPPLIER',
};

const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    name: 'Paracetamol 500mg',
    category: 'Analgesic',
    unit: 'tablets',
    commissionPercent: 8,
    referenceBasePrice: 120,
    nafdacVerified: true,
  },
  {
    id: 'prod-002',
    name: 'Amoxicillin 500mg',
    category: 'Antibiotic',
    unit: 'capsules',
    commissionPercent: 10,
    referenceBasePrice: 250,
    nafdacVerified: true,
  },
  {
    id: 'prod-003',
    name: 'Ibuprofen 400mg',
    category: 'Analgesic',
    unit: 'tablets',
    commissionPercent: 7,
    referenceBasePrice: 180,
    nafdacVerified: true,
  },
  {
    id: 'prod-004',
    name: 'Artemether/Lumefantrine',
    category: 'Antimalarial',
    unit: 'packs',
    commissionPercent: 12,
    referenceBasePrice: 350,
    nafdacVerified: true,
  },
  {
    id: 'prod-005',
    name: 'Vitamin C 1000mg',
    category: 'Vitamins & Supplements',
    unit: 'tablets',
    commissionPercent: 5,
    referenceBasePrice: 90,
    nafdacVerified: true,
  },
  {
    id: 'prod-006',
    name: 'Metformin 500mg',
    category: 'Antidiabetic',
    unit: 'tablets',
    commissionPercent: 9,
    referenceBasePrice: 220,
    nafdacVerified: true,
  },
  {
    id: 'prod-007',
    name: 'Omeprazole 20mg',
    category: 'Gastrointestinal',
    unit: 'capsules',
    commissionPercent: 6,
    referenceBasePrice: 160,
    nafdacVerified: true,
  },
  {
    id: 'prod-008',
    name: 'Cough Syrup',
    category: 'Respiratory',
    unit: 'bottles',
    commissionPercent: 7,
    referenceBasePrice: 1400,
    nafdacVerified: true,
  },
  {
    id: 'prod-009',
    name: 'ORS Sachets',
    category: 'Rehydration',
    unit: 'sachets',
    commissionPercent: 4,
    referenceBasePrice: 50,
    nafdacVerified: true,
  },
  {
    id: 'prod-010',
    name: 'Amlodipine 5mg',
    category: 'Cardiovascular',
    unit: 'tablets',
    commissionPercent: 9,
    referenceBasePrice: 200,
    nafdacVerified: true,
  },
];

const MOCK_INVENTORY: InventoryItem[] = [
  {
    id: 'inventory-001',
    supplierId: 'supplier-001',
    productId: 'prod-001',
    productName: 'Paracetamol 500mg',
    unit: 'tablets',
    category: 'Analgesic',
    basePrice: 120,
    commission: 10,
    commissionPercent: 8,
    finalPrice: 130,
    stock: 8500,
    minOrderQuantity: 100,
    batchNumber: 'PCM-26-081',
    expiryDate: '2028-08-31',
    status: 'AVAILABLE',
  },
  {
    id: 'inventory-002',
    supplierId: 'supplier-001',
    productId: 'prod-002',
    productName: 'Amoxicillin 500mg',
    unit: 'capsules',
    category: 'Antibiotic',
    basePrice: 250,
    commission: 25,
    commissionPercent: 10,
    finalPrice: 275,
    stock: 3200,
    minOrderQuantity: 50,
    batchNumber: 'AMX-26-044',
    expiryDate: '2028-05-30',
    status: 'AVAILABLE',
  },
  {
    id: 'inventory-003',
    supplierId: 'supplier-001',
    productId: 'prod-004',
    productName: 'Artemether/Lumefantrine',
    unit: 'packs',
    category: 'Antimalarial',
    basePrice: 350,
    commission: 42,
    commissionPercent: 12,
    finalPrice: 392,
    stock: 1250,
    minOrderQuantity: 30,
    batchNumber: 'ALU-26-019',
    expiryDate: '2027-11-30',
    status: 'AVAILABLE',
  },
  {
    id: 'inventory-004',
    supplierId: 'supplier-001',
    productId: 'prod-006',
    productName: 'Metformin 500mg',
    unit: 'tablets',
    category: 'Antidiabetic',
    basePrice: 220,
    commission: 20,
    commissionPercent: 9,
    finalPrice: 240,
    stock: 420,
    minOrderQuantity: 50,
    batchNumber: 'MET-26-027',
    expiryDate: '2027-06-30',
    status: 'LOW_STOCK',
  },
  {
    id: 'inventory-005',
    supplierId: 'supplier-001',
    productId: 'prod-007',
    productName: 'Omeprazole 20mg',
    unit: 'capsules',
    category: 'Gastrointestinal',
    basePrice: 160,
    commission: 10,
    commissionPercent: 6,
    finalPrice: 170,
    stock: 0,
    minOrderQuantity: 25,
    batchNumber: 'OMP-26-012',
    expiryDate: '2027-04-30',
    status: 'OUT_OF_STOCK',
  },
  {
    id: 'inventory-006',
    supplierId: 'supplier-001',
    productId: 'prod-010',
    productName: 'Amlodipine 5mg',
    unit: 'tablets',
    category: 'Cardiovascular',
    basePrice: 200,
    commission: 18,
    commissionPercent: 9,
    finalPrice: 218,
    stock: 1800,
    minOrderQuantity: 100,
    batchNumber: 'AML-26-036',
    expiryDate: '2028-01-31',
    status: 'AVAILABLE',
  },
];

/* =========================================================
   Component
========================================================= */

export const SupplierCatalog: React.FC = () => {
  const [currentUser] = useState<SupplierUser>(MOCK_CURRENT_USER);
  const [products] = useState<Product[]>(MOCK_PRODUCTS);
  const [inventory, setInventory] =
    useState<InventoryItem[]>(MOCK_INVENTORY);

  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [selectedProductId, setSelectedProductId] = useState<string>(
    MOCK_PRODUCTS[0]?.id || ''
  );

  const [basePrice, setBasePrice] = useState<number>(3000);
  const [stock, setStock] = useState<number>(500);
  const [moq, setMoq] = useState<number>(20);

  const [batchNumber, setBatchNumber] = useState<string>(
    DEFAULT_BATCH_NUMBER
  );

  const [expiryDate, setExpiryDate] =
    useState<string>('2027-10-31');

  const [isSubmitting, setIsSubmitting] = useState(false);

  /* =========================================================
     Derived Data
  ========================================================= */

  const myInventory = useMemo(
    () =>
      inventory.filter(
        (item) => item.supplierId === currentUser.id
      ),
    [inventory, currentUser.id]
  );

  const selectedProduct =
    products.find((p) => p.id === selectedProductId) ||
    products[0];

  const commPercent = selectedProduct
    ? selectedProduct.commissionPercent
    : 10;

  const platformCommission = Math.round(
    (basePrice * commPercent) / 100
  );

  const finalListedPrice =
    basePrice + platformCommission;

  /* =========================================================
     Helpers
  ========================================================= */

  const getInventoryStatus = (
    quantity: number
  ): InventoryStatus => {
    if (quantity <= 0) return 'OUT_OF_STOCK';
    if (quantity <= 500) return 'LOW_STOCK';
    return 'AVAILABLE';
  };

  const resetForm = () => {
    setSelectedProductId(products[0]?.id || '');
    setBasePrice(3000);
    setStock(500);
    setMoq(20);
    setBatchNumber(DEFAULT_BATCH_NUMBER);
    setExpiryDate('2027-10-31');
  };

  /* =========================================================
     Add Inventory
  ========================================================= */

  const handleAddInventory = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!selectedProductId) {
      toast.error('Invalid product', {
        description:
          'Please select an approved Master Catalogue product.',
      });
      return;
    }

    if (basePrice <= 0) {
      toast.error('Invalid base price', {
        description:
          'Your base price must be greater than ₦0.',
      });
      return;
    }

    if (stock < 0) {
      toast.error('Invalid stock quantity', {
        description:
          'Available stock cannot be negative.',
      });
      return;
    }

    if (moq <= 0) {
      toast.error('Invalid MOQ', {
        description:
          'Minimum Order Quantity must be greater than zero.',
      });
      return;
    }

    if (!batchNumber.trim()) {
      toast.error('Batch number required', {
        description:
          'Enter a valid batch number before publishing.',
      });
      return;
    }

    if (!expiryDate) {
      toast.error('Expiry date required', {
        description:
          'Select the product expiry date.',
      });
      return;
    }

    if (!selectedProduct) {
      toast.error('Product unavailable', {
        description:
          'The selected product could not be found in the catalogue.',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API/network delay
      await new Promise((resolve) =>
        setTimeout(resolve, 900)
      );

      const newInventoryItem: InventoryItem = {
        id: `inventory-${currentUser.id}-${selectedProduct.id}-${batchNumber.trim()}`,
        supplierId: currentUser.id,
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        unit: selectedProduct.unit,
        category: selectedProduct.category,
        basePrice,
        commission: platformCommission,
        commissionPercent: commPercent,
        finalPrice: finalListedPrice,
        stock,
        minOrderQuantity: moq,
        batchNumber: batchNumber.trim(),
        expiryDate,
        status: getInventoryStatus(stock),
      };

      setInventory((previous) => [
        newInventoryItem,
        ...previous,
      ]);

      setShowAddModal(false);
      resetForm();

      toast.success('Inventory Listing Published', {
        description: `${selectedProduct.name} has been added with a ${commPercent}% platform commission.`,
      });
    } catch (error) {
      toast.error('Listing failed', {
        description:
          'Something went wrong while publishing the inventory listing.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  /* =========================================================
     Render
  ========================================================= */

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-xl font-bold text-slate-900">
            Supplier Catalogue & Inventory Stock
          </h1>

          <p className="text-xs text-slate-500 mt-0.5">
            Strict regulatory rule: Products can only be
            selected from the Admin-verified Master Catalogue
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 transition flex items-center gap-1.5 cursor-pointer self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product Listing</span>
        </button>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10.5px] border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-4 font-semibold">
                  Medicine & Master Specs
                </th>

                <th className="py-3.5 px-4 font-semibold">
                  Batch / Expiry
                </th>

                <th className="py-3.5 px-4 font-semibold text-right">
                  Base Price (Your Payout)
                </th>

                <th className="py-3.5 px-4 font-semibold text-right">
                  Commission
                </th>

                <th className="py-3.5 px-4 font-semibold text-right">
                  Buyer Final Price
                </th>

                <th className="py-3.5 px-4 font-semibold text-right">
                  Available Stock
                </th>

                <th className="py-3.5 px-4 font-semibold text-center">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {myInventory.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-12 text-center text-slate-400"
                  >
                    No active inventory listings for your
                    supplier account. Click <q>Add Product
                    Listing</q> above.
                  </td>
                </tr>
              ) : (
                myInventory.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50 transition"
                  >
                    {/* Product */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-start gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                          <Package className="w-4 h-4 text-blue-600" />
                        </div>

                        <div>
                          <div className="font-semibold text-slate-900">
                            {item.productName}
                          </div>

                          <div className="text-[10.5px] text-slate-500 font-mono">
                            MOQ: {item.minOrderQuantity}{' '}
                            {item.unit}
                          </div>

                          <div className="flex items-center gap-1 mt-1">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />

                            <span className="text-[9px] font-bold text-emerald-700 uppercase">
                              NAFDAC Verified
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Batch */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-slate-800">
                        {item.batchNumber}
                      </div>

                      <div className="text-[11px] text-slate-500">
                        Exp: {item.expiryDate}
                      </div>
                    </td>

                    {/* Base Price */}
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                      ₦{item.basePrice.toLocaleString()}
                    </td>

                    {/* Commission */}
                    <td className="py-3.5 px-4 text-right font-mono text-blue-600 font-semibold">
                      +₦{item.commission.toLocaleString()}
                      <div className="text-[9px] text-slate-400 font-sans">
                        {item.commissionPercent}%
                      </div>
                    </td>

                    {/* Final Price */}
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-blue-900">
                      ₦{item.finalPrice.toLocaleString()}
                    </td>

                    {/* Stock */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="font-mono font-bold text-slate-900">
                        {item.stock.toLocaleString()}
                      </div>

                      <div className="text-[9px] text-slate-400">
                        {item.unit}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          item.status === 'AVAILABLE'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.status === 'LOW_STOCK'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inventory Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">
                Active Listings
              </p>

              <p className="text-xl font-bold text-slate-900 mt-1">
                {myInventory.filter(
                  (item) => item.status === 'AVAILABLE'
                ).length}
              </p>
            </div>

            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">
                Low Stock
              </p>

              <p className="text-xl font-bold text-slate-900 mt-1">
                {myInventory.filter(
                  (item) => item.status === 'LOW_STOCK'
                ).length}
              </p>
            </div>

            <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">
                Total Units
              </p>

              <p className="text-xl font-bold text-slate-900 mt-1">
                {myInventory
                  .reduce(
                    (total, item) => total + item.stock,
                    0
                  )
                  .toLocaleString()}
              </p>
            </div>

            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
              <Layers className="w-4 h-4 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="font-display font-bold text-slate-900 text-base">
                  List Medicine from Master Catalogue
                </h3>

                <p className="text-xs text-slate-500">
                  Select an approved medication and specify
                  your warehouse stock and base price
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center cursor-pointer transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleAddInventory}
              className="space-y-4 text-xs"
            >
              {/* Product Selection */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Master Catalogue Product (NAFDAC Verified)
                </label>

                <select
                  value={selectedProductId}
                  onChange={(e) =>
                    setSelectedProductId(e.target.value)
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.category}) — Ref: ₦
                      {p.referenceBasePrice.toLocaleString()}
                    </option>
                  ))}
                </select>

                {selectedProduct && (
                  <div className="mt-2 flex items-center gap-1.5 text-[10px] text-emerald-700">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span className="font-semibold">
                      Admin verified catalogue product
                    </span>
                  </div>
                )}
              </div>

              {/* Price & Commission Calculation */}
              <div className="bg-blue-50/70 p-4 rounded-xl border border-blue-100 space-y-2">
                <div className="grid grid-cols-2 gap-3">
                  {/* Base Price */}
                  <div>
                    <label className="block font-bold text-blue-950 mb-1">
                      Your Base Price (₦)
                    </label>

                    <input
                      type="number"
                      min="0"
                      value={basePrice}
                      onChange={(e) =>
                        setBasePrice(
                          Number(e.target.value)
                        )
                      }
                      className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  {/* Stock */}
                  <div>
                    <label className="block font-bold text-blue-950 mb-1">
                      Available Stock (Units)
                    </label>

                    <input
                      type="number"
                      min="0"
                      value={stock}
                      onChange={(e) =>
                        setStock(Number(e.target.value))
                      }
                      className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>

                {/* Calculation */}
                <div className="pt-2 border-t border-blue-200/60 flex items-center justify-between gap-3 text-[11px] text-blue-900">
                  <span>
                    Platform Commission ({commPercent}%):
                    +₦{platformCommission.toLocaleString()}
                  </span>

                  <span className="font-bold font-mono whitespace-nowrap">
                    Buyer Price: ₦
                    {finalListedPrice.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Batch & Expiry */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Batch Number
                  </label>

                  <input
                    type="text"
                    value={batchNumber}
                    onChange={(e) =>
                      setBatchNumber(e.target.value)
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Expiry Date
                  </label>

                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) =>
                      setExpiryDate(e.target.value)
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              {/* MOQ */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Minimum Order Quantity (MOQ)
                </label>

                <input
                  type="number"
                  min="1"
                  value={moq}
                  onChange={(e) =>
                    setMoq(Number(e.target.value))
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* Listing Preview */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />

                  <span className="text-[11px] font-bold text-slate-700">
                    Listing Preview
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[9px] uppercase font-bold text-slate-400">
                      Supplier Payout
                    </p>

                    <p className="font-mono font-bold text-slate-900">
                      ₦{basePrice.toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <p className="text-[9px] uppercase font-bold text-slate-400">
                      Buyer Price
                    </p>

                    <p className="font-mono font-bold text-blue-700">
                      ₦{finalListedPrice.toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <p className="text-[9px] uppercase font-bold text-slate-400">
                      Commission
                    </p>

                    <p className="font-mono font-semibold text-blue-600">
                      ₦{platformCommission.toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <p className="text-[9px] uppercase font-bold text-slate-400">
                      Stock
                    </p>

                    <p className="font-mono font-bold text-slate-900">
                      {stock.toLocaleString()} {selectedProduct?.unit}
                    </p>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold cursor-pointer hover:bg-slate-50 transition disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {isSubmitting
                    ? 'Publishing...'
                    : 'Publish Listing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierCatalog;