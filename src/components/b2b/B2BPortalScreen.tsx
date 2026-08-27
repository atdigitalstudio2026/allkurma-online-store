import React from 'react';
import { 
  Building2, 
  Sparkles, 
  ShieldCheck, 
  Headphones, 
  Truck, 
  ArrowRight, 
  CheckCircle2, 
  Package, 
  Award, 
  FileSpreadsheet, 
  Plus, 
  Layers 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const B2BPortalScreen: React.FC = () => {
  const { 
    tiers, 
    products, 
    setCurrentView, 
    setSelectedCategory, 
    setSelectedProductId, 
    addToCart 
  } = useApp();

  const bulkProducts = products.filter(p => p.wholesalePrices && p.wholesalePrices.length > 0).slice(0, 4);

  return (
    <div className="pb-28 max-w-lg mx-auto bg-stone-50 min-h-screen">
      
      {/* 1. Header Hero (Matching Screenshot 1 screen 5) */}
      <div className="bg-linear-to-b from-stone-900 via-amber-950 to-stone-900 text-white p-6 rounded-b-3xl shadow-lg border-b border-amber-900/40">
        <div className="flex items-center gap-2 mb-2">
          <div className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30 flex items-center gap-1">
            <Building2 className="w-3 h-3" />
            <span>B2B Wholesale Portal</span>
          </div>
        </div>

        <h1 className="text-2xl font-bold font-['Playfair_Display',serif] leading-tight text-amber-50">
          Portal Grosir Premium
        </h1>

        <p className="text-xs text-stone-300 mt-2.5 leading-relaxed">
          Tingkatkan bisnis Anda dengan kualitas kurma terbaik. Nikmati harga khusus, dukungan terdedikasi, dan pengiriman cepat untuk mitra grosir kami.
        </p>

        {/* Hero Actions */}
        <div className="flex flex-col sm:flex-row gap-2 mt-4">
          <button
            onClick={() => setCurrentView('b2b-quick-order')}
            className="px-4 py-2.5 bg-amber-600 hover:bg-amber-500 active:scale-95 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <span>Mulai Belanja Grosir</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => setCurrentView('b2b-bulk-upload')}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 active:scale-95 text-amber-200 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Upload CSV / Excel</span>
          </button>
        </div>
      </div>

      {/* 2. Banner Panen Terbaik (Matching Screenshot 1 screen 5) */}
      <div className="p-4">
        <div className="relative rounded-2xl overflow-hidden shadow-md">
          <img
            src="https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=800&auto=format&fit=crop&q=80"
            alt="Date Palm Harvest"
            className="w-full h-32 object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-r from-stone-950/80 via-stone-900/50 to-transparent p-4 flex flex-col justify-center">
            <span className="text-amber-300 text-[10px] font-bold uppercase tracking-wider">
              Langsung dari Kebun
            </span>
            <h3 className="text-white font-bold text-sm font-['Playfair_Display',serif] max-w-[200px]">
              Panen Terbaik, Langsung ke Gudang Anda.
            </h3>
          </div>
        </div>
      </div>

      {/* 3. Core Benefit Cards (Matching Screenshot 1 screen 5) */}
      <div className="px-4 space-y-3">
        
        {/* Card 1: Kualitas Terjamin */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-stone-900 text-xs font-['Playfair_Display',serif]">
              Kualitas Terjamin
            </h4>
            <p className="text-[11px] text-stone-500 mt-0.5 leading-relaxed">
              Kurma pilihan disortir dengan standar premium tertinggi & uji lab kebersihan bebas pestisida.
            </p>
          </div>
        </div>

        {/* Card 2: Dukungan Terdedikasi */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-center shrink-0">
            <Headphones className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-stone-900 text-xs font-['Playfair_Display',serif]">
              Dukungan Terdedikasi
            </h4>
            <p className="text-[11px] text-stone-500 mt-0.5 leading-relaxed">
              Account manager khusus untuk kebutuhan bisnis Anda, pengadaan kontainer, dan kustomisasi hampers.
            </p>
          </div>
        </div>

        {/* Card 3: Pengiriman Cepat */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-center shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-stone-900 text-xs font-['Playfair_Display',serif]">
              Pengiriman Cepat
            </h4>
            <p className="text-[11px] text-stone-500 mt-0.5 leading-relaxed">
              Jaringan logistik andal dengan armada berpendingin (cold chain) untuk pengiriman tepat waktu.
            </p>
          </div>
        </div>

      </div>

      {/* 4. Struktur Harga Tier (Matching Screenshot 1 screen 5) */}
      <div className="p-4 mt-2">
        <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <Award className="w-4 h-4 text-amber-700" />
            <h3 className="font-bold text-xs text-stone-900 tracking-tight">
              Struktur Harga Tier
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-200 text-[10px] text-stone-500 font-bold uppercase tracking-wider">
                  <th className="pb-2 font-medium">Tier</th>
                  <th className="pb-2 font-medium">Volume Min</th>
                  <th className="pb-2 font-medium">Diskon</th>
                  <th className="pb-2 font-medium">Benefit Tambahan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                <tr className="hover:bg-stone-50">
                  <td className="py-2.5 font-bold text-amber-800">Bronze</td>
                  <td className="py-2.5">50 kg</td>
                  <td className="py-2.5 font-bold text-emerald-700">5%</td>
                  <td className="py-2.5 text-[11px] text-stone-500">Standar Support</td>
                </tr>
                <tr className="hover:bg-stone-50">
                  <td className="py-2.5 font-bold text-slate-700">Silver</td>
                  <td className="py-2.5">200 kg</td>
                  <td className="py-2.5 font-bold text-emerald-700">12%</td>
                  <td className="py-2.5 text-[11px] text-stone-500">Prioritas Packing</td>
                </tr>
                <tr className="hover:bg-stone-50 bg-amber-50/50">
                  <td className="py-2.5 font-bold text-amber-600">Gold</td>
                  <td className="py-2.5 font-bold">500+ kg</td>
                  <td className="py-2.5 font-bold text-emerald-700">Custom</td>
                  <td className="py-2.5 text-[11px] text-stone-600">Dedicated AM, Free Shipping</td>
                </tr>
              </tbody>
            </table>
          </div>

          <button
            onClick={() => setCurrentView('b2b-tiers')}
            className="w-full mt-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
          >
            <span>Lihat Detail Semua Benefit Tier</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 5. Pesan Massal Cepat (Matching Screenshot 1 screen 5) */}
      <div className="px-4 pb-4">
        <h3 className="font-bold text-xs text-stone-900 mb-3 tracking-tight">
          Pesan Massal Cepat
        </h3>

        <div className="grid grid-cols-2 gap-3">
          {bulkProducts.map((prod) => (
            <div
              key={prod.id}
              onClick={() => {
                setSelectedProductId(prod.id);
                setCurrentView('product-detail');
              }}
              className="bg-white rounded-xl border border-stone-200 overflow-hidden p-2.5 shadow-xs cursor-pointer hover:border-amber-400 transition-all flex flex-col justify-between"
            >
              <div className="aspect-square bg-stone-100 rounded-lg overflow-hidden mb-2">
                <img
                  src={prod.images[0]}
                  alt={prod.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <p className="text-[11px] font-bold text-stone-900 line-clamp-1">
                  {prod.name}
                </p>
                <p className="text-[10px] text-stone-500">Kemasan {prod.weightGram}g</p>
                <span className="text-[10px] text-amber-800 font-bold mt-1 block">
                  Lihat Harga Tier →
                </span>
              </div>
            </div>
          ))}

          {/* "+ Lihat Semua Katalog Grosir" Box */}
          <div
            onClick={() => {
              setSelectedCategory('Grosir');
              setCurrentView('catalog');
            }}
            className="bg-stone-100 hover:bg-amber-50 border-2 border-dashed border-stone-300 hover:border-amber-400 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all min-h-[140px]"
          >
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-stone-700 shadow-xs mb-2">
              <Plus className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-stone-800">
              Lihat Semua Katalog Grosir
            </span>
          </div>
        </div>
      </div>

      {/* 6. B2B Footer (Matching Screenshot 1 screen 5) */}
      <div className="p-6 bg-stone-900 text-stone-400 text-center text-xs space-y-2">
        <h4 className="font-bold text-stone-200 text-sm font-['Playfair_Display',serif]">
          AllKurma
        </h4>
        <p className="text-[11px]">
          © 2026 PT AllKurma Premium Berkah. All rights reserved.
        </p>
        <div className="flex justify-center gap-3 text-[10px] text-stone-500 pt-1">
          <span className="hover:underline cursor-pointer">Wholesale Terms</span>
          <span>•</span>
          <span className="hover:underline cursor-pointer">Shipping Policy</span>
          <span>•</span>
          <span className="hover:underline cursor-pointer">Privacy Policy</span>
        </div>
      </div>

    </div>
  );
};
