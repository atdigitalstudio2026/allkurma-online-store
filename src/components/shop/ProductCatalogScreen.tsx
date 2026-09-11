import React, { useState } from 'react';
import { 
  SlidersHorizontal, 
  ChevronDown, 
  Star, 
  ShoppingCart, 
  Plus, 
  Check, 
  Search, 
  ArrowLeft, 
  Sparkles,
  Building2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';

export const ProductCatalogScreen: React.FC = () => {
  const { 
    products, 
    addToCart, 
    setSelectedProductId, 
    setCurrentView, 
    selectedCategory, 
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    categories: appCategories
  } = useApp();

  const [priceSort, setPriceSort] = useState<'all' | 'low-high' | 'high-low'>('all');
  const [minRating, setMinRating] = useState<number>(0);
  const [onlyWholesale, setOnlyWholesale] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Dynamic categories list from AppContext
  const categoryTabs = ['Semua', ...appCategories.map(c => c.name || c.id)];

  // Filter products
  const filteredProducts = products.filter(p => {
    if (selectedCategory && selectedCategory !== 'Semua') {
      const match = p.category === selectedCategory || 
        appCategories.some(c => (c.name === selectedCategory || c.id === selectedCategory) && (c.id === p.category || c.name === p.category));
      if (!match) return false;
    }
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchSku = p.sku.toLowerCase().includes(q);
      const matchCat = p.category.toLowerCase().includes(q);
      if (!matchName && !matchSku && !matchCat) return false;
    }
    if (minRating > 0 && p.rating < minRating) {
      return false;
    }
    if (onlyWholesale && (!p.wholesalePrices || p.wholesalePrices.length === 0)) {
      return false;
    }
    return true;
  }).sort((a, b) => {
    const priceA = a.discountPrice || a.regularPrice;
    const priceB = b.discountPrice || b.regularPrice;
    if (priceSort === 'low-high') return priceA - priceB;
    if (priceSort === 'high-low') return priceB - priceA;
    return 0;
  });

  const handleProductClick = (id: string) => {
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    } catch {
      window.scrollTo(0, 0);
    }
    setSelectedProductId(id);
    setCurrentView('product-detail');
  };

  return (
    <div className="pb-24 max-w-lg mx-auto bg-stone-50 min-h-screen">
      
      {/* Header section (Matching Screenshot 1 screen 2) */}
      <div className="bg-white border-b border-stone-200 p-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-[10px] text-stone-400 mb-2">
          <button onClick={() => setCurrentView('home')} className="hover:text-stone-700">
            Beranda
          </button>
          <span>&gt;</span>
          <span className="text-stone-700 font-medium">
            {selectedCategory || 'Katalog Kurma'}
          </span>
        </div>

        <h1 className="text-xl font-bold text-stone-900 tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
          Katalog Kurma SRA ALLKURMA
        </h1>
        <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">
          Temukan koleksi kurma terbaik kami dari panen pilihan resmi PT Exindokarsa Agung.
        </p>

        {/* Filter Pills Bar */}
        <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1 scrollbar-none">
          
          {/* Main Filter Button */}
          <button
            onClick={() => setIsFilterModalOpen(!isFilterModalOpen)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
              minRating > 0 || onlyWholesale || priceSort !== 'all'
                ? 'bg-[#1E3A8A] text-white shadow-xs'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filter</span>
          </button>

          {/* Price Sort Dropdown */}
          <button
            onClick={() => {
              if (priceSort === 'all') setPriceSort('low-high');
              else if (priceSort === 'low-high') setPriceSort('high-low');
              else setPriceSort('all');
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1 shrink-0 border transition-all cursor-pointer ${
              priceSort !== 'all'
                ? 'bg-blue-50 text-[#1E3A8A] border-blue-300 font-semibold'
                : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
            }`}
          >
            <span>Harga {priceSort === 'low-high' ? '↑ Terendah' : priceSort === 'high-low' ? '↓ Tertinggi' : ''}</span>
            <ChevronDown className="w-3 h-3 text-stone-400" />
          </button>

          {/* Rating Filter Pill */}
          <button
            onClick={() => setMinRating(prev => prev === 4.8 ? 0 : 4.8)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1 shrink-0 border transition-all cursor-pointer ${
              minRating > 0
                ? 'bg-emerald-50 text-[#009A44] border-emerald-300 font-semibold'
                : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
            }`}
          >
            <Star className={`w-3 h-3 ${minRating > 0 ? 'fill-amber-500 text-amber-500' : 'text-stone-400'}`} />
            <span>Rating 4.8+</span>
          </button>

          {/* Wholesale Pill */}
          <button
            onClick={() => setOnlyWholesale(!onlyWholesale)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1 shrink-0 border transition-all cursor-pointer ${
              onlyWholesale
                ? 'bg-blue-50 text-[#1E3A8A] border-blue-300 font-semibold'
                : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
            }`}
          >
            <Building2 className="w-3 h-3 text-[#1E3A8A]" />
            <span>Grosir</span>
          </button>

        </div>

        {/* Category horizontal tabs */}
        <div className="flex items-center gap-1.5 mt-3 overflow-x-auto pb-1 scrollbar-none">
          {categoryTabs.map((cat) => {
            const isSelected = (selectedCategory === cat) || (!selectedCategory && cat === 'Semua');
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat === 'Semua' ? null : cat)}
                className={`px-3 py-1 rounded-lg text-xs font-medium shrink-0 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#1E3A8A] text-white font-semibold shadow-xs'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Modal Drawer */}
      {isFilterModalOpen && (
        <div className="p-4 bg-blue-50/70 border-b border-blue-200 text-xs space-y-3 animate-in slide-in-from-top-2">
          <div className="flex items-center justify-between font-bold text-stone-800">
            <span>Filter Kustomisasi</span>
            <button
              onClick={() => {
                setMinRating(0);
                setOnlyWholesale(false);
                setPriceSort('all');
                setSelectedCategory(null);
                setSearchQuery('');
              }}
              className="text-[#1E3A8A] hover:underline text-[11px] cursor-pointer"
            >
              Reset Semua
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-semibold text-stone-500 block mb-1">Urutan Harga</label>
              <select
                value={priceSort}
                onChange={(e: any) => setPriceSort(e.target.value)}
                className="w-full p-2 bg-white border border-stone-200 rounded-lg text-xs"
              >
                <option value="all">Default / Populer</option>
                <option value="low-high">Harga: Rendah ke Tinggi</option>
                <option value="high-low">Harga: Tinggi ke Rendah</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-semibold text-stone-500 block mb-1">Rating Minimal</label>
              <select
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="w-full p-2 bg-white border border-stone-200 rounded-lg text-xs"
              >
                <option value={0}>Semua Rating</option>
                <option value={4.5}>4.5 Bintang ke atas</option>
                <option value={4.8}>4.8 Bintang ke atas</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Products 2-Column Grid (Matching Screenshot 1 screen 2) */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3 text-xs text-stone-500">
          <span>Menampilkan <strong className="text-stone-800 font-semibold">{filteredProducts.length}</strong> produk</span>
          {searchQuery && (
            <span className="text-[11px] bg-stone-200 px-2 py-0.5 rounded-full text-stone-700 truncate max-w-[150px]">
              "{searchQuery}"
            </span>
          )}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-stone-200 p-6">
            <Sparkles className="w-10 h-10 text-stone-300 mx-auto mb-2" />
            <h3 className="font-bold text-stone-800 text-sm">Tidak ada produk ditemukan</h3>
            <p className="text-xs text-stone-500 mt-1">Coba sesuaikan filter atau kata kunci pencarian Anda.</p>
            <button
              onClick={() => {
                setSelectedCategory(null);
                setMinRating(0);
                setOnlyWholesale(false);
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 bg-[#1E3A8A] text-white rounded-xl text-xs font-semibold cursor-pointer"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredProducts.map((prod) => (
              <div
                key={prod.id}
                className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs flex flex-col justify-between group hover:shadow-md transition-shadow"
              >
                <div 
                  className="cursor-pointer"
                  onClick={() => handleProductClick(prod.id)}
                >
                  <div className="relative aspect-square bg-stone-100 overflow-hidden">
                    <img
                      src={prod.images?.[0] || 'https://images.unsplash.com/photo-1596797882870-8c33deeac224?w=600&auto=format&fit=crop&q=80'}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {prod.badge && (
                      <div className="absolute top-2 left-2 bg-[#1E3A8A] text-white text-[9px] font-bold px-2 py-0.5 rounded-sm">
                        {prod.badge}
                      </div>
                    )}
                  </div>

                  <div className="p-3">
                    {/* Rating & Review */}
                    <div className="flex items-center gap-1 text-[10px] text-stone-500 mb-1">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      <span className="font-bold text-stone-800">{prod.rating}</span>
                      <span>({prod.reviewCount})</span>
                    </div>

                    <h4 className="text-xs font-medium text-stone-900 line-clamp-2 leading-tight">
                      {prod.name}
                    </h4>

                    {/* Price */}
                    <div className="mt-2">
                      <div className="text-xs font-bold text-[#1E3A8A]">
                        Rp {(prod.discountPrice || prod.regularPrice).toLocaleString('id-ID')}
                      </div>
                      {prod.discountPrice && (
                        <div className="text-[10px] text-stone-400 line-through">
                          Rp {prod.regularPrice.toLocaleString('id-ID')}
                        </div>
                      )}
                    </div>

                    {/* Wholesale hint */}
                    {prod.wholesalePrices && prod.wholesalePrices.length > 0 && (
                      <div className="mt-1.5 text-[9px] text-[#009A44] bg-emerald-50 px-1.5 py-0.5 rounded-sm inline-block font-medium">
                        Grosir ≥ {prod.wholesalePrices[0].minQty} pcs: Rp {prod.wholesalePrices[0].pricePerUnit.toLocaleString('id-ID')}
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Add to Cart action */}
                <div className="p-3 pt-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(prod, 1);
                    }}
                    className="w-full py-1.5 bg-emerald-50 hover:bg-[#009A44] text-[#009A44] hover:text-white border border-emerald-200 hover:border-transparent active:scale-95 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Keranjang</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
