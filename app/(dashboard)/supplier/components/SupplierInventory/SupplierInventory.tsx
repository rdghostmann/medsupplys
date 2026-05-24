// SupplierInventory.tsx
"use client"

import React, { useEffect, useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Plus, 
  Search, 
  Edit3, 
  X, 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  Check, 
  Info, 
  TrendingDown, 
  DollarSign, 
  Filter, 
  Clipboard, 
  RotateCcw,
  CheckCircle2,
  Lock,
  ArrowUpDown
} from 'lucide-react';
import { AddInventoryModal } from "./AddInventoryModal"
import { getProductCatalog } from "@/services/product-catalog.service"
import { toast } from "sonner"


export const SupplierInventory = () => {
  const [inventory, setInventory] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])

   // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<InventoryProduct | null>(null);

  const [open, setOpen] = useState(false)

  // Editing Product Form State
  const [editBasePrice, setEditBasePrice] = useState<number>(0);
  const [editStockQuantity, setEditStockQuantity] = useState<number>(0);
  const [editBatchInfo, setEditBatchInfo] = useState('');

  // Unique Categories computed from catalog
  const categories = useMemo(() => {
    const list = new Set(inventory.map(item => item.category));
    return ['All', ...Array.from(list)];
  }, [inventory]);


    // Filtering & Sorting State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortField, setSortField] = useState<'name' | 'basePrice' | 'stock' | 'finalPrice'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Load product catalog (server action)
  useEffect(() => {
    const load = async () => {
      const data = await getProductCatalog()
      setProducts(data)
    }
    load()
  }, [])

  const handleAdd = (item: any) => {
    setInventory(prev => [item, ...prev])
  }

   // Handle addition of product
  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  
  // Handle editing triggers
  const handleOpenEditModal = (product: InventoryProduct) => {
    setEditingProduct(product);
    setEditBasePrice(product.basePrice);
    setEditStockQuantity(product.stock);
    setEditBatchInfo(product.batchInfo);
  };

   const handleEditProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
		return;
  };

    // Calculate stats dynamically in real-time
  const stats: InventoryStats = useMemo(() => {
    let totalStockElements = 0;
    let outOfStockCount = 0;
    let lowStockCount = 0;
    let totalValuation = 0;

    inventory.forEach(item => {
      totalStockElements += item.stock;
      if (item.stock === 0) {
        outOfStockCount++;
      } else if (item.stock < item.moq) {
        lowStockCount++;
      }
      totalValuation += item.stock * item.basePrice;
    });

    return {
      totalSkus: inventory.length,
      totalStockElements,
      outOfStockCount,
      lowStockCount,
      totalValuation,
    };
  }, [inventory]);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let result = [...inventory];

    // Text query (name or category)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        item =>
          item.name.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
      );
    }

    // Category Filter
    if (selectedCategory !== 'All') {
      result = result.filter(item => item.category === selectedCategory);
    }

    // Sort order
    result.sort((a, b) => {
      let valA: any = a[sortField];
      let valB: any = b[sortField];

      if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [inventory, searchQuery, selectedCategory, sortField, sortOrder]);

  const toggleSort = (field: 'name' | 'basePrice' | 'stock' | 'finalPrice') => {
    if (sortField === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };


  return (
    <div className="">
      {/* Header */}
   {/* Main Title Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            My Inventory
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Supplier workspace to catalog pharmaceuticals, pricing, and monitor stock volumes instantly.
          </p>
        </div>

        <div className="flex items-center gap-3">

          <button
            id="btn-add-product"
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-sm active:scale-98"
          >
            <Plus className="w-5 h-5" />
            Add Product
          </button>
        </div>
      </div>

		 {/* Dynamic Real-time Analytics Dashboard Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {/* SKUs */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase font-bold tracking-wider">Total SKUs</span>
            <span className="p-1.5 bg-slate-50 text-slate-600 rounded-md">
              <Clipboard className="w-4 h-4" />
            </span>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-slate-800">{stats.totalSkus}</div>
            <p className="text-xs text-slate-400 mt-0.5">Active Catalog listings</p>
          </div>
        </div>

        {/* Registered Stock */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase font-bold tracking-wider">Stock Units</span>
            <span className="p-1.5 bg-blue-50 text-blue-600 rounded-md">
              <Package className="w-4 h-4" />
            </span>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-slate-800">{stats.totalStockElements.toLocaleString()}</div>
            <p className="text-xs text-slate-400 mt-0.5">Total count stored</p>
          </div>
        </div>

        {/* Low Stock count */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase font-bold tracking-wider">Low Stock</span>
            <span className={`p-1.5 rounded-md ${stats.lowStockCount > 0 ? 'bg-amber-50 text-amber-600' : 'bg-slate-50 text-slate-400'}`}>
              <AlertTriangle className="w-4 h-4" />
            </span>
          </div>
          <div>
            <div className={`text-2xl font-bold font-mono ${stats.lowStockCount > 0 ? 'text-amber-600' : 'text-slate-800'}`}>
              {stats.lowStockCount}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Stock below product MOQ</p>
          </div>
        </div>

        {/* Out of Stock count */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase font-bold tracking-wider">Out of Stock</span>
            <span className={`p-1.5 rounded-md ${stats.outOfStockCount > 0 ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-400'}`}>
              <AlertTriangle className="w-4 h-4" />
            </span>
          </div>
          <div>
            <div className={`text-2xl font-bold font-mono ${stats.outOfStockCount > 0 ? 'text-red-600' : 'text-slate-800'}`}>
              {stats.outOfStockCount}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Requires immediate fill</p>
          </div>
        </div>

        {/* Inventory Valuation */}
        <div className="col-span-2 lg:col-span-1 bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase font-bold tracking-wider">Valuation (₦)</span>
            <span className="p-1.5 bg-emerald-50 text-emerald-600 rounded-md">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div>
            <div className="text-xl font-bold font-mono text-emerald-700 truncate">
              ₦{stats.totalValuation.toLocaleString()}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Weighted base inventory value</p>
          </div>
        </div>
      </div>

		  {/* Beautiful Filter, Search & Sort Shelf */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs mb-6 grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
        {/* Search */}
        <div className="relative md:col-span-2">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search products by brand name or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Dropdown */}
        <div className="relative">
          <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50/50 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/10 appearance-none focus:border-blue-500 cursor-pointer text-slate-700"
          >
            <option value="All">All Categories</option>
            {categories.filter(c => c !== 'All').map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">
            <ArrowUpDown className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>


      {/* Inventory Grid */}
      <div className="grid gap-3">


        {inventory.map(item => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 border rounded-lg bg-white"
          >
            <div className="font-semibold">{item.name}</div>
            <div className="text-sm text-slate-500">
              ₦{item.finalPrice.toLocaleString()}
            </div>
          </motion.div>
        ))}

		    <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6 select-none cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => toggleSort('name')}>
                  <div className="flex items-center gap-1">
                    PRODUCT
                    {sortField === 'name' && (
                      <span className="text-blue-500 font-bold">{sortOrder === 'asc' ? ' ↑' : ' ↓'}</span>
                    )}
                  </div>
                </th>
                <th className="py-4 px-4">TYPE</th>
                <th className="py-4 px-4">UNIT</th>
                <th className="py-4 px-4 select-none cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => toggleSort('basePrice')}>
                  <div className="flex items-center gap-1">
                    BASE PRICE
                    {sortField === 'basePrice' && (
                      <span className="text-blue-500 font-bold">{sortOrder === 'asc' ? ' ↑' : ' ↓'}</span>
                    )}
                  </div>
                </th>
                <th className="py-4 px-4">COMMISSION</th>
                <th className="py-4 px-4 select-none cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => toggleSort('finalPrice')}>
                  <div className="flex items-center gap-1">
                    FINAL PRICE
                    {sortField === 'finalPrice' && (
                      <span className="text-blue-500 font-bold">{sortOrder === 'asc' ? ' ↑' : ' ↓'}</span>
                    )}
                  </div>
                </th>
                <th className="py-4 px-4 select-none cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => toggleSort('stock')}>
                  <div className="flex items-center gap-1">
                    STOCK / MOQ
                    {sortField === 'stock' && (
                      <span className="text-blue-500 font-bold">{sortOrder === 'asc' ? ' ↑' : ' ↓'}</span>
                    )}
                  </div>
                </th>
                <th className="py-4 px-4">STATUS</th>
                <th className="py-4 px-6 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150">
              <AnimatePresence initial={false}>
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 px-6 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <Package className="w-12 h-12 text-slate-300" />
                        <p className="text-slate-500 font-medium">No inventory products found</p>
                        <p className="text-xs text-slate-400 max-w-sm">
                          Try relaxing your search query or category filters, or add a new pharmaceutical to your list.
                        </p>
                        {searchQuery || selectedCategory !== 'All' ? (
                          <button
                            onClick={() => {
                              setSearchQuery('');
                              setSelectedCategory('All');
                            }}
                            className="mt-2 text-xs text-blue-600 hover:text-blue-800 font-semibold underline underline-offset-2"
                          >
                            Clear filters
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => {
                    const isLowStock = product.stock > 0 && product.stock < product.moq;
                    const isOutOfStock = product.stock === 0;

                    return (
                      <motion.tr
                        key={product.id}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                        className="group hover:bg-slate-50/55 transition-colors"
                      >
                        {/* PRODUCT Column */}
                        <td className="py-3.5 px-6">
                          <div className="flex items-center gap-2">
                            <div>
                              <div className="font-semibold text-slate-900 leading-snug">
                                {product.name}
                              </div>
                              <div className="text-xs text-slate-400 font-medium mt-0.5">
                                {product.category}
                              </div>
                              <div className="text-[10px] text-slate-400 font-mono mt-0.5 italic max-w-[180px] hover:text-slate-600 select-all cursor-copy truncate" title={product.batchInfo}>
                                {product.batchInfo}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* TYPE Column */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {product.type === 'IMPORTER' ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border border-blue-200 bg-blue-50 text-blue-700">
                              IMPORTER
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border border-emerald-200 bg-emerald-50 text-emerald-700">
                              DISTRIBUTOR
                            </span>
                          )}
                        </td>

                        {/* UNIT Column */}
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200/40">
                            {product.unit}
                          </span>
                        </td>

                        {/* BASE PRICE Column */}
                        <td className="py-3.5 px-4 font-mono font-medium text-slate-700">
                          ₦{product.basePrice.toLocaleString()}
                        </td>

                        {/* COMMISSION Column */}
                        <td className="py-3.5 px-4 font-mono text-xs text-slate-400 font-semibold">
                          +₦{product.commission.toLocaleString()}
                        </td>

                        {/* FINAL PRICE Column */}
                        <td className="py-3.5 px-4 font-mono font-bold text-blue-600">
                          ₦{product.finalPrice.toLocaleString()}
                        </td>

                        {/* STOCK / MOQ Column */}
                        <td className="py-3.5 px-4">
                          <div>
                            <div className={`font-mono font-bold text-sm ${isOutOfStock
                                ? 'text-red-600'
                                : isLowStock
                                  ? 'text-amber-600'
                                  : 'text-slate-800'
                              }`}>
                              {product.stock.toLocaleString()}
                            </div>
                            <div className="text-[10px] text-slate-400 font-medium">
                              MOQ: {product.moq}
                            </div>
                          </div>
                        </td>

                        {/* STATUS Column */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {isOutOfStock ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-100">
                              Out of Stock
                            </span>
                          ) : isLowStock ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-100">
                              Low Stock List
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                              Available
                            </span>
                          )}
                        </td>

                        {/* ACTIONS Column */}
                        <td className="py-3.5 px-6 text-right whitespace-nowrap">
                          <button
                            onClick={() => handleOpenEditModal(product)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-250 text-slate-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50/50 rounded-lg text-xs font-semibold transition-all shadow-xs active:scale-95 cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            Edit
                          </button>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

		    <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            Showing <span className="font-semibold text-slate-700">{filteredProducts.length}</span> of <span className="font-semibold text-slate-700">{inventory.length}</span> listed products
          </div>
          <div className="flex items-center gap-1.5 opacity-90">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse inline-block" />
            <span className="font-medium text-slate-600 font-mono">Live Sync Connected</span>
          </div>
        </div>
      </div>

		

		   {/* FOOTER INFORMATIONAL BLOCK OF COMPLIANCE */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex items-start gap-4">
        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg mt-0.5 shrink-0">
          <Info className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-900">Supplier Authority & Safety Guidelines</h4>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            As a registered supplier, your pricing inputs directly affect final hospital and pharmacy disbursements. Only <strong>Base price</strong> and <b>Stock Quantities</b> can be modified. Minimun Order Quantity (MOQ) limits and Platform Commission margins (set at 10%) are regulated by the administrative platform to ensure unified health access parameters.
          </p>
        </div>
      </div>

      {/* Modal */}
      <AddInventoryModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onAdd={handleAdd}
        existingInventory={inventory}
        products={products}
      />

		
      {/* ==================================== MODAL: EDIT PRODUCT (STOCK & BASE PRICE ONLY) ==================================== */}
      <AnimatePresence>
        {editingProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop Blur overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingProduct(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            />

            {/* Modal Body Container */}
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 16 }}
              transition={{ type: 'spring', duration: 0.35, bounce: 0.15 }}
              className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-150">
                <div className="flex items-center gap-2.5">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Edit Product</h3>
                    <p className="text-xs text-slate-400 font-medium">Updating {editingProduct.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => setEditingProduct(null)}
                  className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleEditProductSubmit} className="p-6 space-y-5">

                {/* Visual disclaimer of fields that cannot be modified */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-500 space-y-1.5 leading-snug">
                  <div className="flex items-center gap-1.5 font-bold text-slate-700">
                    <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    Locked Parameters (Fixed Platform Rules)
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1 font-medium">
                    <div className="bg-white p-2 border border-slate-150 rounded-lg">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wide block">Platform Commission</span>
                      <span className="font-mono text-slate-700 font-bold block mt-0.5">10% fixed margin</span>
                    </div>
                    <div className="bg-white p-2 border border-slate-150 rounded-lg">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wide block">Minimum Order Qty</span>
                      <span className="font-mono text-slate-700 font-bold block mt-0.5">MOQ: {editingProduct.moq} {editingProduct.unit}s</span>
                    </div>
                  </div>
                </div>

                {/* Base Price and Stock Level modification */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Base Price (Editable) */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                      Base Price (₦)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={editBasePrice}
                      onChange={(e) => setEditBasePrice(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 border border-slate-250 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 rounded-lg text-sm transition-all font-mono font-bold text-slate-800"
                      required
                    />
                  </div>

                  {/* Stock Quantity (Editable) */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                      Stock Level
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={editStockQuantity}
                      onChange={(e) => setEditStockQuantity(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 border border-slate-250 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 rounded-lg text-sm transition-all font-mono font-bold text-slate-800"
                      required
                    />
                  </div>
                </div>

                {/* Expiry Details (Editable) */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                    Batch / Expiry Info
                  </label>
                  <input
                    type="text"
                    value={editBatchInfo}
                    onChange={(e) => setEditBatchInfo(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-250 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 rounded-lg text-sm text-slate-800 font-medium"
                    required
                  />
                </div>

                {/* Live pricing calculations preview */}
                <div className="bg-blue-50/80 border border-blue-100 rounded-xl p-4 text-xs font-medium text-blue-800 space-y-1.5 leading-snug">
                  <div className="flex justify-between items-center text-blue-700">
                    <span>New Base Price:</span>
                    <span className="font-bold font-mono">₦{editBasePrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-blue-700">
                    <span>10% Platform Margin:</span>
                    <span className="font-bold font-mono">+₦{Math.round(editBasePrice * 0.1).toLocaleString()}</span>
                  </div>
                  <div className="h-px bg-blue-100/50 my-1" />
                  <div className="flex justify-between items-center text-blue-900 text-sm font-bold pt-0.5">
                    <span>New listing final price:</span>
                    <span className="font-mono text-blue-600">
                      ₦{Math.round(editBasePrice * 1.1).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Bottom submission action button */}
                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold rounded-lg transition-colors text-sm text-center cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-sm cursor-pointer hover:scale-101 active:scale-99 text-center"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}