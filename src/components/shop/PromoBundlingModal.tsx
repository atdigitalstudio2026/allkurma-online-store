import React, { useState } from 'react';
import { 
  X, 
  Boxes, 
  Sparkles, 
  CheckCircle2, 
  Plus, 
  ShoppingBag, 
  ArrowRight, 
  Percent, 
  ShieldCheck, 
  Star, 
  Tag,
  Zap,
  Gift
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';

export interface BundleDeal {
  id: string;
  name: string;
  subtitle: string;
  badge: string;
  tag: string;
  originalPrice: number;
  bundlePrice: number;
  discountPct: number;
  savings: number;
  rating: number;
  soldCount: number;
  image: string;
  items: {
    title: string;
    qty: string;
    description: string;
  }[];
  benefits: string[];
}

export const BUNDLE_DEALS: BundleDeal[] = [
  {
    id: 'bundle-sunnah-vip',
    name: 'Paket Sehat Sunnah VIP',
    subtitle: 'Kombinasi kurma nabi + madu herbal + air zamzam murni',
    badge: 'HEMAT Rp 86.000',
    tag: 'Best Seller',
    originalPrice: 325000,
    bundlePrice: 239000,
    discountPct: 26,
    savings: 86000,
    rating: 5.0,
    soldCount: 428,
    image: 'https://images.unsplash.com/photo-1608755728617-aefab37d2edd?w=800&auto=format&fit=crop&q=80',
    items: [
      { title: 'Kurma Ajwa Madinah Grade VIP', qty: '500 gram (Box Eksklusif)', description: 'Asli kebun Madinah dengan serat halus lembut' },
      { title: 'Madu Murni Yaman Habbatussauda', qty: '250 gram (Toples Kaca)', description: 'Madu murni kaya antioksidan dan enzim aktif' },
      { title: 'Air Zamzam Murni Al-Munawwarah', qty: '250 ml (Kemasan Segel)', description: 'Air berkah asli sertifikasi resmi karantina' }
    ],
    benefits: [
      'Menjaga daya tahan tubuh dan imunitas optimal',
      'Minuman & cemilan sunnah pembuka puasa terbaik',
      'Kemasan box tebal elegan sangat cocok untuk kado / hadiah'
    ]
  },
  {
    id: 'bundle-duo-lumer',
    name: 'Paket Duo Lumer Al-Qassim',
    subtitle: 'Favorit keluarga: Kurma Sukari basah legit + cokelat almond',
    badge: 'HEMAT Rp 70.000',
    tag: 'Paling Laris',
    originalPrice: 255000,
    bundlePrice: 185000,
    discountPct: 27,
    savings: 70000,
    rating: 4.9,
    soldCount: 612,
    image: 'https://images.unsplash.com/photo-1596797882870-8c33deeac224?w=800&auto=format&fit=crop&q=80',
    items: [
      { title: 'Kurma Sukari Al-Qassim Basah (Rutob)', qty: '2x Box (@850 gram = 1.7 kg)', description: 'Tekstur karamel lumer di lidah, dingin segar' },
      { title: 'Kurma Cokelat Almond Crispy Premium', qty: '1 Toples (250 gram)', description: 'Kurma manis berbalut dark coklat dan almond utuh' }
    ],
    benefits: [
      'Disukai anak-anak dan lansia karena sangat empuk',
      'Stok melimpah 1.7kg cukup untuk camilan 1 bulan sekeluarga',
      'Freezer-friendly tetap lembut saat disajikan dingin'
    ]
  },
  {
    id: 'bundle-trio-nusantara',
    name: 'Paket Trio Favorit Nusantara',
    subtitle: '3 varietas kurma terpopuler dalam 1 paket hemat',
    badge: 'HEMAT Rp 96.000',
    tag: 'Kombo Komplit',
    originalPrice: 365000,
    bundlePrice: 269000,
    discountPct: 26,
    savings: 96000,
    rating: 4.9,
    soldCount: 310,
    image: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=800&auto=format&fit=crop&q=80',
    items: [
      { title: 'Kurma Ajwa Madinah Grade VIP', qty: '1 Box (500 gram)', description: 'Kurma nabi kaya khasiat dan serat' },
      { title: 'Kurma Sukari Basah Al-Qassim', qty: '1 Box (850 gram)', description: 'Manis legit karamel mentega' },
      { title: 'Kurma Deglet Nour Tangkai Tunisia', qty: '1 Box (500 gram)', description: 'Renyah segar masih menempel tangkai asli' }
    ],
    benefits: [
      'Mencicipi 3 jenis kurma dari tekstur kering, renyah, hingga lumer',
      'Harga jauh lebih hemat dibanding beli eceran terpisah',
      'Bonus kartu ucapan Ramadhan & tas belanja spunbond SRA'
    ]
  },
  {
    id: 'bundle-bumil-menyusui',
    name: 'Paket Bundling Bumil & Menyusui',
    subtitle: 'Formula nutrisi alami pelancar ASI & asam folat janin',
    badge: 'HEMAT Rp 111.000',
    tag: 'Rekomendasi Bidan',
    originalPrice: 410000,
    bundlePrice: 299000,
    discountPct: 27,
    savings: 111000,
    rating: 5.0,
    soldCount: 245,
    image: 'https://images.unsplash.com/photo-1608755728617-aefab37d2edd?w=800&auto=format&fit=crop&q=80',
    items: [
      { title: 'Kurma Ajwa Madinah Jumbo', qty: '1 Box (1 kg)', description: 'Kandungan zat besi & kalsium tinggi' },
      { title: 'Sari Kurma Organik Murni Kental', qty: '1 Botol (350 gram)', description: 'Ekstrak murni tanpa gula tambahan' },
      { title: 'Minyak Zaitun Extra Virgin Palestine', qty: '1 Botol (250 ml)', description: 'Cold-pressed asam lemak tak jenuh ganda' }
    ],
    benefits: [
      'Membantu meningkatkan hormon oksitosin alami saat persalinan',
      'Mencegah anemia pada ibu hamil dan mempercepat pemulihan',
      'Meningkatkan kualitas dan volume ASI booster alami'
    ]
  }
];

interface PromoBundlingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PromoBundlingModal: React.FC<PromoBundlingModalProps> = ({ isOpen, onClose }) => {
  const { addToCart, showToast, setCurrentView } = useApp();
  const [selectedBundleId, setSelectedBundleId] = useState<string>(BUNDLE_DEALS[0].id);

  if (!isOpen) return null;

  const activeBundle = BUNDLE_DEALS.find(b => b.id === selectedBundleId) || BUNDLE_DEALS[0];

  const handleAddBundleToCart = (bundle: BundleDeal) => {
    // Create a bundle product representation
    const bundleProduct: Product = {
      id: `bundle-prod-${bundle.id}`,
      name: `[BUNDLING] ${bundle.name}`,
      sku: `BDL-${bundle.id}`,
      category: 'Bundling',
      description: `${bundle.subtitle}. Berisi: ${bundle.items.map(i => `${i.title} (${i.qty})`).join(', ')}.`,
      regularPrice: bundle.originalPrice,
      discountPrice: bundle.bundlePrice,
      rating: bundle.rating,
      reviewCount: bundle.soldCount,
      soldCount: bundle.soldCount,
      stock: 45,
      minStockAlert: 5,
      warehouseLocation: 'Jakarta Cold Storage',
      weightGram: 1500,
      images: [bundle.image],
      badge: bundle.badge,
      origin: 'Arab Saudi & Nusantara',
      isFlashSale: false,
      wholesalePrices: [
        { minQty: 5, pricePerUnit: bundle.bundlePrice - 15000 },
        { minQty: 20, pricePerUnit: bundle.bundlePrice - 30000 }
      ],
      variations: []
    };

    addToCart(bundleProduct, 1);
    showToast(`Paket "${bundle.name}" berhasil ditambahkan ke keranjang belanja! Hemat Rp ${bundle.savings.toLocaleString('id-ID')}`, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[92vh]">
        
        {/* Header Bar */}
        <div className="p-4 bg-gradient-to-r from-[#1E3A8A] via-blue-700 to-[#009A44] text-white flex items-center justify-between border-b border-white/20">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center shadow-xs">
              <Boxes className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-white">Promo Bundling Hemat SRA</h3>
                <span className="text-[9px] bg-red-600 text-white font-extrabold px-1.5 py-0.2 rounded-full shadow-2xs">
                  HEMAT S/D 40%
                </span>
              </div>
              <p className="text-[11px] text-blue-100">
                Paket kombo kurma pilihan + madu murni lebih untung
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Horizontal Bundle Selector Pills */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 overflow-x-auto scrollbar-none flex gap-2">
          {BUNDLE_DEALS.map((bundle) => {
            const isSelected = selectedBundleId === bundle.id;
            return (
              <button
                key={bundle.id}
                onClick={() => setSelectedBundleId(bundle.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#1E3A8A] to-[#009A44] text-white shadow-xs scale-102'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>📦</span>
                <span>{bundle.name}</span>
                {isSelected && (
                  <span className="text-[9px] bg-white/25 px-1.5 py-0.2 rounded-full font-bold">
                    -{bundle.discountPct}%
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Scrollable Content Body */}
        <div className="p-4 overflow-y-auto space-y-4 text-xs">
          
          {/* Bundle Highlight Card */}
          <div className="relative rounded-2xl overflow-hidden bg-slate-900 text-white border border-slate-200 shadow-md">
            <div className="aspect-16/9 w-full relative">
              <img 
                src={activeBundle.image} 
                alt={activeBundle.name} 
                className="w-full h-full object-cover opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              
              <div className="absolute top-3 left-3 flex gap-1.5">
                <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs">
                  {activeBundle.badge}
                </span>
                <span className="bg-amber-400 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                  {activeBundle.tag}
                </span>
              </div>

              <div className="absolute bottom-3 left-3 right-3">
                <h4 className="text-base font-extrabold text-white leading-tight">
                  {activeBundle.name}
                </h4>
                <p className="text-[11px] text-blue-200 mt-0.5">
                  {activeBundle.subtitle}
                </p>
                <div className="flex items-baseline gap-2 mt-1.5">
                  <span className="text-lg font-black text-amber-300">
                    Rp {activeBundle.bundlePrice.toLocaleString('id-ID')}
                  </span>
                  <span className="text-xs text-slate-300 line-through">
                    Rp {activeBundle.originalPrice.toLocaleString('id-ID')}
                  </span>
                  <span className="text-[10px] text-emerald-300 font-bold bg-emerald-900/80 px-1.5 py-0.5 rounded-sm border border-emerald-700">
                    Hemat Rp {activeBundle.savings.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Included Items Checklist */}
          <div className="bg-blue-50/50 rounded-2xl p-3.5 border border-blue-100 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#1E3A8A] flex items-center gap-1">
                <Gift className="w-3.5 h-3.5 text-[#1E3A8A]" />
                <span>Isi Paket Bundling ({activeBundle.items.length} Produk):</span>
              </span>
              <span className="text-[10px] text-emerald-700 font-semibold">100% Original SRA</span>
            </div>

            <div className="space-y-2">
              {activeBundle.items.map((item, idx) => (
                <div 
                  key={idx} 
                  className="p-2.5 bg-white rounded-xl border border-blue-100 flex items-start gap-2 shadow-2xs"
                >
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-[#009A44] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h5 className="font-bold text-slate-900 text-xs truncate">{item.title}</h5>
                      <span className="text-[10px] font-extrabold text-[#1E3A8A] bg-blue-50 px-1.5 py-0.2 rounded-sm shrink-0 ml-1">
                        {item.qty}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Benefits */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
            <h5 className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">
              Keunggulan Paket Ini:
            </h5>
            <div className="space-y-1">
              {activeBundle.benefits.map((b, i) => (
                <div key={i} className="flex items-start gap-1.5 text-[11px] text-slate-600">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#009A44] shrink-0 mt-0.5" />
                  <span className="leading-tight">{b}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Footer Bar with Direct Add to Cart Button */}
        <div className="p-3.5 bg-white border-t border-slate-200 flex items-center gap-2.5">
          <div className="min-w-0 flex-1">
            <span className="text-[10px] text-slate-500 block leading-none">Harga Spesial Paket</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-base font-black text-[#1E3A8A] leading-none">
                Rp {activeBundle.bundlePrice.toLocaleString('id-ID')}
              </span>
              <span className="text-[10px] text-slate-400 line-through leading-none">
                Rp {activeBundle.originalPrice.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          <button
            onClick={() => handleAddBundleToCart(activeBundle)}
            className="px-4 py-2.5 bg-gradient-to-r from-[#009A44] to-[#047857] hover:from-[#047857] hover:to-[#065f46] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>+ Beli Paket Hemat</span>
          </button>
        </div>

      </div>
    </div>
  );
};
