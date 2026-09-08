import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Search 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminStockScreen: React.FC = () => {
  const { products, setProducts, addStockMovement, setCurrentView, showToast } = useApp();
  const [search, setSearch] = useState('');
  const [selectedCategory] = useState<string>('all');

  const filtered = products.filter(p => {
    if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
    }
    return true;
  });

  const handleAdjust = (productId: string, delta: number, note: string) => {
    const targetProd = products.find(p => p.id === productId);
    if (!targetProd) return;

    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const nextStock = Math.max(0, p.stock + delta);
        return { ...p, stock: nextStock };
      }
      return p;
    }));

    addStockMovement({
      productName: targetProd.name,
      sku: targetProd.sku,
      type: delta > 0 ? 'Inbound' : 'Outbound',
      quantityChange: delta,
      unit: 'pcs',
      sourceOrDestination: note,
      warehouse: 'Gudang Utama',
      officer: 'Admin Warehouse'
    });

    showToast(`Stok ${targetProd.name} ${delta > 0 ? '+' : ''}${delta} pcs berhasil dicatat!`, 'success');
  };

  return (
    <div className="pb-28 max-w-lg mx-auto bg-stone-50 min-h-screen">
      
      {/* Top Header */}
      <div className="sticky top-0 z-30 bg-stone-900 text-white px-4 py-3 flex items-center justify-between border-b border-stone-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentView('admin-dashboard')}
            className="p-1 rounded-lg text-stone-300 hover:text-white hover:bg-stone-800"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-sm font-bold font-['Playfair_Display',serif] text-amber-300">
              Inventaris & Stok Gudang
            </h1>
            <p className="text-[10px] text-stone-400">Warehouse SKU Inventory Control</p>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="p-4 bg-white border-b border-stone-200 space-y-2">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari SKU atau nama kurma..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg"
          />
        </div>
      </div>

      {/* Product stock cards */}
      <div className="p-4 space-y-3">
        {filtered.map(prod => {
          const isLow = prod.stock <= prod.minStockAlert;

          return (
            <div
              key={prod.id}
              className={`bg-white rounded-2xl border p-4 shadow-xs space-y-3 transition-all ${
                isLow ? 'border-red-300 bg-red-50/20' : 'border-stone-200'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={prod.images?.[0] || 'https://images.unsplash.com/photo-1596797882870-8c33deeac224?w=600&auto=format&fit=crop&q=80'}
                    alt={prod.name}
                    className="w-12 h-12 rounded-xl object-cover border border-stone-100 shrink-0"
                  />
                  <div>
                    <h3 className="font-bold text-xs text-stone-900 leading-tight">{prod.name}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-mono text-stone-500">SKU: {prod.sku}</span>
                      <span className="text-[10px] text-stone-400">• {prod.category}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-base font-black font-mono block ${isLow ? 'text-red-700' : 'text-emerald-700'}`}>
                    {prod.stock} pcs
                  </span>
                  <span className="text-[9px] text-stone-400">Min: {prod.minStockAlert} pcs</span>
                </div>
              </div>

              {/* Adjust Stock Controls */}
              <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                <span className="text-stone-500 text-[11px]">Penyesuaian Stok Cepat:</span>
                
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleAdjust(prod.id, -10, 'Penyesuaian manual stock out')}
                    className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-lg text-[10px]"
                  >
                    -10
                  </button>
                  <button
                    onClick={() => handleAdjust(prod.id, 25, 'Penerimaan stok supplier')}
                    className="px-2.5 py-1 bg-amber-800 hover:bg-amber-900 text-white font-bold rounded-lg text-[10px]"
                  >
                    +25 Pcs
                  </button>
                  <button
                    onClick={() => handleAdjust(prod.id, 100, 'Penerimaan kontainer import')}
                    className="px-2.5 py-1 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-lg text-[10px]"
                  >
                    +100 (1 Pallet)
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
