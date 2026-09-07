import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Building2, 
  Save
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TierPriceRule } from '../../types';

export const AdminAddProductScreen: React.FC = () => {
  const { addProduct, setCurrentView, showToast } = useApp();

  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState<'Ajwa' | 'Sukari' | 'Medjool' | 'Tunisia' | 'Khalas' | 'Madu' | 'Grosir' | 'Hampers'>('Ajwa');
  const [origin, setOrigin] = useState('Madinah, Arab Saudi');
  const [weightGram, setWeightGram] = useState(1000);
  const [regularPrice, setRegularPrice] = useState(320000);
  const [discountPrice, setDiscountPrice] = useState<number | undefined>(undefined);
  const [stock, setStock] = useState(100);
  const [minStockAlert, setMinStockAlert] = useState(20);
  const [description, setDescription] = useState('');
  const [badge, setBadge] = useState('PREMIUM GRADE A');
  
  // Wholesale pricing rules
  const [wholesalePrices, setWholesalePrices] = useState<TierPriceRule[]>([
    { minQty: 1, maxQty: 10, pricePerUnit: 300000 },
    { minQty: 11, maxQty: 50, pricePerUnit: 280000 },
    { minQty: 51, pricePerUnit: 260000 }
  ]);

  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1608755728617-aefab37d2edd?w=800&auto=format&fit=crop&q=80'
  ]);

  const handleAddTier = () => {
    setWholesalePrices(prev => [
      ...prev,
      { minQty: 100, pricePerUnit: 240000 }
    ]);
  };

  const handleRemoveTier = (index: number) => {
    setWholesalePrices(prev => prev.filter((_, i) => i !== index));
  };

  const handleTierChange = (index: number, field: keyof TierPriceRule, value: any) => {
    setWholesalePrices(prev =>
      prev.map((tier, i) => (i === index ? { ...tier, [field]: value } : tier))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !sku) {
      showToast('Harap isi Nama Produk dan SKU', 'error');
      return;
    }

    addProduct({
      name,
      sku: sku.toUpperCase(),
      category,
      origin,
      weightGram: Number(weightGram),
      regularPrice: Number(regularPrice),
      discountPrice: discountPrice ? Number(discountPrice) : undefined,
      stock: Number(stock),
      minStockAlert: Number(minStockAlert),
      warehouseLocation: 'Rak A-12 Central',
      description: description || `${name} kualitas premium panen terbaik.`,
      images,
      rating: 5.0,
      reviewCount: 0,
      soldCount: 0,
      badge: badge || undefined,
      wholesalePrices
    });

    showToast(`Produk ${name} berhasil disimpan & dipublikasikan ke katalog!`, 'success');
    setCurrentView('admin-dashboard');
  };

  return (
    <div className="pb-28 max-w-lg mx-auto bg-stone-50 min-h-screen">
      
      {/* Top Header */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setCurrentView('admin-dashboard')}
          className="p-1.5 rounded-lg text-stone-700 hover:bg-stone-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <h1 className="text-sm font-bold text-stone-900 font-['Playfair_Display',serif]">
          Tambah Produk Baru
        </h1>

        <div className="w-8" />
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-4 text-xs">
        
        {/* 1. Upload Foto Produk (Matching Screenshot 2 screen 5) */}
        <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs space-y-3">
          <label className="font-bold text-xs text-stone-900 block">
            Foto Produk (Galeri)
          </label>
          
          <div className="flex gap-2 overflow-x-auto pb-1">
            {images.map((img, idx) => (
              <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-stone-200 shrink-0">
                <img src={img} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setImages(prev => prev.filter((_, i) => i !== idx))}
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-0.5"
                >
                  ✕
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={() => {
                const sampleImgs = [
                  'https://images.unsplash.com/photo-1596797882870-8c33deeac224?w=800&auto=format&fit=crop&q=80',
                  'https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=800&auto=format&fit=crop&q=80',
                  'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&auto=format&fit=crop&q=80'
                ];
                setImages(prev => [...prev, sampleImgs[prev.length % sampleImgs.length]]);
              }}
              className="w-20 h-20 rounded-xl border-2 border-dashed border-stone-300 hover:border-amber-500 bg-stone-50 flex flex-col items-center justify-center text-stone-400 hover:text-amber-800 shrink-0 transition-colors"
            >
              <Plus className="w-5 h-5 mb-0.5" />
              <span className="text-[9px] font-bold">+ Foto</span>
            </button>
          </div>
        </div>

        {/* 2. Informasi Dasar Produk */}
        <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs space-y-3">
          <h2 className="font-bold text-xs text-stone-900 border-b border-stone-100 pb-2">
            Informasi Dasar
          </h2>

          <div>
            <label className="font-semibold text-stone-600 block mb-1">Nama Produk</label>
            <input
              type="text"
              required
              placeholder="Contoh: Kurma Ajwa Madinah Grade A VIP 1kg"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-semibold text-stone-600 block mb-1">SKU / Kode Produk</label>
              <input
                type="text"
                required
                placeholder="AK-AJW-009"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-mono uppercase"
              />
            </div>
            <div>
              <label className="font-semibold text-stone-600 block mb-1">Kategori</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
              >
                <option value="Ajwa">Kurma Ajwa</option>
                <option value="Sukari">Sukari</option>
                <option value="Medjool">Medjool</option>
                <option value="Tunisia">Tunisia</option>
                <option value="Khalas">Khalas</option>
                <option value="Madu">Madu & Herbal</option>
                <option value="Grosir">Partai Grosir</option>
                <option value="Hampers">Hampers</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-semibold text-stone-600 block mb-1">Berat Bersih (gram)</label>
              <input
                type="number"
                value={weightGram}
                onChange={(e) => setWeightGram(Number(e.target.value))}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-mono"
              />
            </div>
            <div>
              <label className="font-semibold text-stone-600 block mb-1">Asal Negara / Kebun</label>
              <input
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-stone-600 block mb-1">Deskripsi Lengkap</label>
            <textarea
              rows={3}
              placeholder="Jelaskan tekstur, rasa, dan manfaat kesehatan..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
            />
          </div>
        </div>

        {/* 3. Harga & Stok Gudang */}
        <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs space-y-3">
          <h2 className="font-bold text-xs text-stone-900 border-b border-stone-100 pb-2">
            Harga & Stok Gudang
          </h2>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-semibold text-stone-600 block mb-1">Harga Reguler (Rp)</label>
              <input
                type="number"
                required
                value={regularPrice}
                onChange={(e) => setRegularPrice(Number(e.target.value))}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-mono font-bold"
              />
            </div>
            <div>
              <label className="font-semibold text-stone-600 block mb-1">Harga Diskon / Coret (Opsional)</label>
              <input
                type="number"
                placeholder="290000"
                value={discountPrice || ''}
                onChange={(e) => setDiscountPrice(e.target.value ? Number(e.target.value) : undefined)}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-semibold text-stone-600 block mb-1">Stok Awal Gudang (pcs)</label>
              <input
                type="number"
                required
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-mono font-bold text-emerald-700"
              />
            </div>
            <div>
              <label className="font-semibold text-stone-600 block mb-1">Batas Minimum Stok Alert</label>
              <input
                type="number"
                value={minStockAlert}
                onChange={(e) => setMinStockAlert(Number(e.target.value))}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-mono text-red-600"
              />
            </div>
          </div>
        </div>

        {/* 4. Aturan Harga Grosir Bertingkat (Matching Screenshot 2 screen 5) */}
        <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-stone-100 pb-2">
            <div className="flex items-center gap-1.5 font-bold text-xs text-stone-900">
              <Building2 className="w-4 h-4 text-amber-800" />
              <span>Aturan Harga Grosir Bertingkat (Tier Pricing)</span>
            </div>
            <button
              type="button"
              onClick={handleAddTier}
              className="text-[10px] text-amber-800 font-bold hover:underline"
            >
              + Tambah Tier
            </button>
          </div>

          <div className="space-y-2">
            {wholesalePrices.map((tier, idx) => (
              <div key={idx} className="p-2.5 bg-amber-50/50 rounded-xl border border-amber-200/70 flex items-center gap-2">
                <div className="flex-1 grid grid-cols-3 gap-1.5">
                  <div>
                    <span className="text-[9px] text-stone-400 block">Min Qty</span>
                    <input
                      type="number"
                      value={tier.minQty}
                      onChange={(e) => handleTierChange(idx, 'minQty', Number(e.target.value))}
                      className="w-full p-1.5 bg-white border border-stone-200 rounded-lg text-xs font-mono"
                    />
                  </div>
                  <div>
                    <span className="text-[9px] text-stone-400 block">Max Qty (opsional)</span>
                    <input
                      type="number"
                      placeholder="∞"
                      value={tier.maxQty || ''}
                      onChange={(e) => handleTierChange(idx, 'maxQty', e.target.value ? Number(e.target.value) : undefined)}
                      className="w-full p-1.5 bg-white border border-stone-200 rounded-lg text-xs font-mono"
                    />
                  </div>
                  <div>
                    <span className="text-[9px] text-stone-400 block">Harga/pcs (Rp)</span>
                    <input
                      type="number"
                      value={tier.pricePerUnit}
                      onChange={(e) => handleTierChange(idx, 'pricePerUnit', Number(e.target.value))}
                      className="w-full p-1.5 bg-white border border-stone-200 rounded-lg text-xs font-mono font-bold text-amber-900"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveTier(idx)}
                  className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-3 bg-amber-800 hover:bg-amber-900 active:scale-95 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Simpan Produk & Publikasikan</span>
        </button>

      </form>

    </div>
  );
};
