import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Search, 
  Plus, 
  Trash2, 
  Building2, 
  ShoppingCart, 
  CheckCircle2, 
  Minus, 
  Layers, 
  Sparkles,
  ArrowRight,
  Warehouse
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';

interface BulkRow {
  product: Product;
  quantity: number;
}

export const B2BQuickOrderScreen: React.FC = () => {
  const { 
    products, 
    addToCart, 
    setCurrentView, 
    user, 
    showToast 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  
  // Initial rows matching Screenshot 1 screen 6 & Screenshot 3 screen 6
  const [rows, setRows] = useState<BulkRow[]>([
    { product: products[1], quantity: 50 }, // Ajwa 50x
    { product: products[2], quantity: 5 }   // Medjool Jumbo 5x
  ]);

  const [destinationWarehouse, setDestinationWarehouse] = useState('Gudang Utama - Jakarta Pusat');
  const [paymentTerm, setPaymentTerm] = useState('Net 30 Days (Wholesale Invoicing)');
  const [poNumber, setPoNumber] = useState('PO-2026-WS-991');

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    const q = query.toLowerCase();
    const matches = products.filter(
      p => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
    );
    setSearchResults(matches.slice(0, 5));
  };

  const handleAddProduct = (prod: Product) => {
    setRows(prev => {
      const existing = prev.find(r => r.product.id === prod.id);
      if (existing) {
        return prev.map(r => r.product.id === prod.id ? { ...r, quantity: r.quantity + 10 } : r);
      }
      return [...prev, { product: prod, quantity: 10 }];
    });
    setSearchQuery('');
    setSearchResults([]);
    showToast(`Produk ${prod.sku} ditambahkan ke daftar pesanan massal`);
  };

  const updateQuantity = (productId: string, newQty: number) => {
    if (newQty <= 0) {
      removeRow(productId);
      return;
    }
    setRows(prev =>
      prev.map(r => (r.product.id === productId ? { ...r, quantity: newQty } : r))
    );
  };

  const removeRow = (productId: string) => {
    setRows(prev => prev.filter(r => r.product.id !== productId));
  };

  // Calculations
  const totalItems = rows.reduce((sum, r) => sum + r.quantity, 0);
  const totalWeightKg = rows.reduce((sum, r) => sum + (r.product.weightGram * r.quantity) / 1000, 0);

  const getLinePrice = (row: BulkRow) => {
    const base = row.product.discountPrice || row.product.regularPrice;
    if (row.product.wholesalePrices && row.product.wholesalePrices.length > 0) {
      const match = row.product.wholesalePrices.find(
        w => row.quantity >= w.minQty && (!w.maxQty || row.quantity <= w.maxQty)
      );
      if (match) return match.pricePerUnit;
    }
    // Tier discount default
    return base * 0.88; // 12% Gold discount
  };

  const estimatedTotal = rows.reduce((sum, r) => sum + getLinePrice(r) * r.quantity, 0);

  const handlePushToCart = () => {
    if (rows.length === 0) {
      showToast('Daftar pesanan cepat masih kosong', 'error');
      return;
    }
    rows.forEach(r => {
      addToCart(r.product, r.quantity);
    });
    showToast(`${totalItems} item berhasil dimasukkan ke keranjang grosir!`, 'success');
    setCurrentView('cart');
  };

  return (
    <div className="pb-32 max-w-lg mx-auto bg-stone-50 min-h-screen">
      
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setCurrentView('b2b-portal')}
          className="p-1.5 rounded-lg text-stone-700 hover:bg-stone-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="text-center">
          <h1 className="text-sm font-bold text-stone-900 font-['Playfair_Display',serif]">
            Pesanan Cepat (Quick Order)
          </h1>
          <p className="text-[10px] text-stone-500">Rapid Bulk Entry Matrix</p>
        </div>

        <button
          onClick={() => setCurrentView('b2b-bulk-upload')}
          className="text-xs text-amber-800 font-semibold hover:underline"
        >
          CSV Upload
        </button>
      </div>

      {/* 1. Search & Add Product Row (Matching Screenshot 1 screen 6) */}
      <div className="p-4 bg-white border-b border-stone-200 space-y-2">
        <label className="text-xs font-bold text-stone-800 block">
          Cari Produk atau masukkan SKU
        </label>
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Ketik SKU (cth: AK-AJW-001) atau nama kurma..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-700/30 focus:bg-white transition-all font-mono"
          />

          {/* Autocomplete Suggestions */}
          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-stone-200 rounded-xl shadow-xl z-20 overflow-hidden divide-y divide-stone-100">
              {searchResults.map(p => (
                <div
                  key={p.id}
                  onClick={() => handleAddProduct(p)}
                  className="p-2.5 flex items-center justify-between hover:bg-amber-50 cursor-pointer text-xs transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <img src={p.images[0]} alt={p.name} className="w-8 h-8 rounded-md object-cover" />
                    <div>
                      <span className="font-bold text-stone-900 block">{p.name}</span>
                      <span className="text-[10px] font-mono text-stone-500">SKU: {p.sku} • Stok: {p.stock}</span>
                    </div>
                  </div>
                  <button className="px-2.5 py-1 bg-amber-700 text-white rounded-lg text-[10px] font-bold">
                    + Tambah
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 2. Active Bulk Rows List (Matching Screenshot 1 screen 6) */}
      <div className="p-4 space-y-3">
        {rows.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-stone-200 p-6">
            <Layers className="w-10 h-10 text-stone-300 mx-auto mb-2" />
            <h3 className="font-bold text-stone-800 text-sm">Belum Ada Item Terpilih</h3>
            <p className="text-xs text-stone-500 mt-1">Cari produk berdasarkan SKU di atas untuk memulai pengisian massal.</p>
          </div>
        ) : (
          rows.map((row) => {
            const linePrice = getLinePrice(row);
            const lineTotal = linePrice * row.quantity;

            return (
              <div
                key={row.product.id}
                className="bg-white rounded-2xl border border-stone-200 p-3.5 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={row.product.images[0]}
                      alt={row.product.name}
                      className="w-12 h-12 rounded-xl object-cover border border-stone-100 shrink-0"
                    />
                    <div>
                      <h4 className="font-bold text-xs text-stone-900 leading-tight">
                        {row.product.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-mono text-stone-500">
                          SKU: {row.product.sku}
                        </span>
                        <span className="text-[9px] font-bold px-1.5 py-0.2 bg-amber-100 text-amber-900 rounded-sm">
                          Gold Harvest (12% Off)
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => removeRow(row.product.id)}
                    className="text-stone-400 hover:text-red-600 p-1 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Quantity modifier and Line Price */}
                <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-stone-500 text-[11px]">Jumlah (Karton/Pcs):</span>
                    <div className="flex items-center border border-stone-300 rounded-lg overflow-hidden bg-stone-50">
                      <button
                        onClick={() => updateQuantity(row.product.id, row.quantity - 5)}
                        className="p-1 px-2 text-stone-600 hover:bg-stone-200 active:scale-95"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={row.quantity}
                        onChange={(e) => updateQuantity(row.product.id, Math.max(1, Number(e.target.value)))}
                        className="w-12 text-center text-xs font-bold text-stone-900 border-x border-stone-200 py-1 font-mono"
                      />
                      <button
                        onClick={() => updateQuantity(row.product.id, row.quantity + 5)}
                        className="p-1 px-2 text-stone-600 hover:bg-stone-200 active:scale-95"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-stone-400 block">
                      @ Rp {linePrice.toLocaleString('id-ID')}
                    </span>
                    <span className="font-bold text-amber-950 font-mono text-xs">
                      Rp {lineTotal.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 3. Logistics & Billing Parameters */}
      {rows.length > 0 && (
        <div className="px-4 space-y-3">
          <div className="bg-white rounded-2xl border border-stone-200 p-4 space-y-3 text-xs">
            <h3 className="font-bold text-stone-900 text-xs flex items-center gap-1.5">
              <Warehouse className="w-4 h-4 text-amber-800" />
              <span>Parameter Logistik & Faktur Grosir</span>
            </h3>

            <div>
              <label className="text-[10px] font-semibold text-stone-600 block mb-1">
                Gudang Tujuan Pengiriman
              </label>
              <select
                value={destinationWarehouse}
                onChange={(e) => setDestinationWarehouse(e.target.value)}
                className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-xs"
              >
                <option value="Gudang Utama - Jakarta Pusat">Gudang Utama - Jakarta Pusat (Hub 1)</option>
                <option value="Gudang Cakung - Jakarta Timur">Gudang Cakung - Jakarta Timur (Hub 2)</option>
                <option value="Surabaya Cross-Dock Hub">Surabaya Cross-Dock Hub (Jawa Timur)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-semibold text-stone-600 block mb-1">
                  Termin Pembayaran
                </label>
                <select
                  value={paymentTerm}
                  onChange={(e) => setPaymentTerm(e.target.value)}
                  className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-xs"
                >
                  <option value="Net 30 Days (Wholesale Invoicing)">Net 30 Hari</option>
                  <option value="Custom Delivery COD">COD saat Kontainer Tiba</option>
                  <option value="Bank Transfer BCA">Transfer Bank Langsung</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-semibold text-stone-600 block mb-1">
                  Nomor PO Internal
                </label>
                <input
                  type="text"
                  value={poNumber}
                  onChange={(e) => setPoNumber(e.target.value)}
                  className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-mono font-bold"
                />
              </div>
            </div>

            {/* Quick Metrics Summary */}
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex justify-between text-xs font-semibold text-stone-700">
              <span>Total Item: <strong className="text-stone-900">{totalItems} pcs</strong></span>
              <span>Berat Total: <strong className="text-stone-900">{totalWeightKg.toFixed(1)} kg</strong></span>
            </div>
          </div>
        </div>
      )}

      {/* 4. Bottom Sticky Action Bar (Matching Screenshot 1 screen 6) */}
      {rows.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 p-3 shadow-xl">
          <div className="max-w-lg mx-auto flex items-center justify-between gap-3">
            <div>
              <span className="text-[10px] text-stone-500 block">
                Total Estimasi ({totalItems} items)
              </span>
              <span className="font-black text-amber-950 text-base font-mono">
                Rp {estimatedTotal.toLocaleString('id-ID')}
              </span>
            </div>

            <button
              onClick={handlePushToCart}
              className="px-6 py-2.5 bg-amber-800 hover:bg-amber-900 active:scale-95 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Tambah ke Keranjang Grosir</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
