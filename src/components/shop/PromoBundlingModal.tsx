import React, { useState, useEffect } from 'react';
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
import { Product, BundleDeal } from '../../types';
import { INITIAL_BUNDLE_DEALS } from '../../data/mockData';

export type { BundleDeal };
export const BUNDLE_DEALS = INITIAL_BUNDLE_DEALS;

interface PromoBundlingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialBundleId?: string;
}

export const PromoBundlingModal: React.FC<PromoBundlingModalProps> = ({ isOpen, onClose, initialBundleId }) => {
  const { addToCart, showToast, setCurrentView, setSelectedProductId, bundlingDeals, products } = useApp();
  const availableDeals = (bundlingDeals && bundlingDeals.length > 0 ? bundlingDeals : INITIAL_BUNDLE_DEALS)
    .filter(b => b.active !== false);
  const displayDeals = availableDeals.length > 0 ? availableDeals : INITIAL_BUNDLE_DEALS;

  const [selectedBundleId, setSelectedBundleId] = useState<string>(() => initialBundleId || displayDeals[0]?.id || '');

  // Keep selected bundle in sync when initialBundleId changes or modal opens
  useEffect(() => {
    if (initialBundleId && displayDeals.some(b => b.id === initialBundleId)) {
      setSelectedBundleId(initialBundleId);
    } else if (displayDeals.length > 0 && !displayDeals.some(b => b.id === selectedBundleId)) {
      setSelectedBundleId(displayDeals[0]?.id || '');
    }
  }, [initialBundleId, displayDeals]);

  if (!isOpen) return null;

  const activeBundle = displayDeals.find(b => b.id === selectedBundleId) || displayDeals[0];

  const handleAddBundleToCart = (bundle: BundleDeal, directCheckout = false) => {
    // Create a bundle product representation
    const bundleProduct: Product = {
      id: `bundle-prod-${bundle.id}`,
      name: `[BUNDLING] ${bundle.name}`,
      sku: `BDL-${bundle.id}`,
      category: 'Bundling',
      description: `${bundle.subtitle}. Berisi: ${bundle.items.map(i => `${i.title} (${i.qty})`).join(', ')}.`,
      regularPrice: bundle.originalPrice,
      discountPrice: bundle.bundlePrice,
      rating: bundle.rating || 5.0,
      reviewCount: bundle.soldCount || 120,
      soldCount: bundle.soldCount || 120,
      stock: 50,
      minStockAlert: 5,
      warehouseLocation: 'Jakarta Cold Storage',
      weightGram: 1500,
      images: [bundle.image || 'https://images.unsplash.com/photo-1608755728617-aefab37d2edd?w=800&auto=format&fit=crop&q=80'],
      badge: bundle.badge || 'HEMAT 30%',
      origin: 'Arab Saudi & Nusantara',
      isFlashSale: false,
      wholesalePrices: [
        { minQty: 5, pricePerUnit: Math.max(1000, bundle.bundlePrice - 15000) },
        { minQty: 20, pricePerUnit: Math.max(1000, bundle.bundlePrice - 30000) }
      ],
      variations: []
    };

    addToCart(bundleProduct, 1);
    if (directCheckout) {
      onClose();
      setCurrentView('cart');
      showToast(`Paket "${bundle.name}" ditambahkan. Menuju ke Checkout...`, 'success');
    } else {
      showToast(`Paket "${bundle.name}" berhasil masuk ke keranjang! Hemat Rp ${bundle.savings.toLocaleString('id-ID')}`, 'success');
    }
  };

  const handleViewItemDetail = (productId?: string) => {
    if (!productId) return;
    const match = products.find(p => p.id === productId);
    if (match) {
      setSelectedProductId(productId);
      setCurrentView('product-detail');
      onClose();
    }
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
          {displayDeals.map((bundle) => {
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
              {activeBundle.items.map((item, idx) => {
                const matchedProduct = item.productId ? products.find(p => p.id === item.productId) : null;
                const itemImage = item.image || matchedProduct?.images?.[0] || 'https://images.unsplash.com/photo-1608755728617-aefab37d2edd?w=150';

                return (
                  <div 
                    key={idx} 
                    className="p-2.5 bg-white rounded-xl border border-blue-100 flex items-center gap-3 shadow-2xs hover:border-blue-300 transition-colors"
                  >
                    <div className="relative shrink-0">
                      <img
                        src={itemImage}
                        alt={item.title}
                        className="w-12 h-12 rounded-lg object-cover border border-stone-200"
                      />
                      <span className="absolute -top-1.5 -left-1.5 w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[9px]">
                        ✓
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h5 className="font-bold text-slate-900 text-xs truncate">{item.title}</h5>
                        <span className="text-[10px] font-extrabold text-[#1E3A8A] bg-blue-50 px-2 py-0.5 rounded-full shrink-0 border border-blue-100">
                          {item.qty}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">
                        {item.description}
                      </p>
                      <div className="flex items-center justify-between mt-1 pt-1 border-t border-stone-100">
                        <span className="text-[10px] text-stone-500">
                          {item.price ? `Nilai: Rp ${item.price.toLocaleString('id-ID')}` : (matchedProduct?.discountPrice ? `Rp ${matchedProduct.discountPrice.toLocaleString('id-ID')}` : 'Termasuk dalam paket')}
                        </span>
                        {(item.productId || matchedProduct) && (
                          <button
                            type="button"
                            onClick={() => handleViewItemDetail(item.productId || matchedProduct?.id)}
                            className="text-[10px] font-bold text-blue-700 hover:text-blue-900 hover:underline cursor-pointer"
                          >
                            Lihat Produk &gt;
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
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

        {/* Modal Footer Bar with Direct Add to Cart and Instant Checkout Buttons */}
        <div className="p-3.5 bg-white border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="min-w-0">
            <span className="text-[10px] text-slate-500 block leading-none">Harga Total Paket Bundling</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-base sm:text-lg font-black text-[#1E3A8A] leading-none">
                Rp {activeBundle.bundlePrice.toLocaleString('id-ID')}
              </span>
              <span className="text-[11px] text-slate-400 line-through leading-none">
                Rp {activeBundle.originalPrice.toLocaleString('id-ID')}
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded-sm">
                Hemat Rp {activeBundle.savings.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => handleAddBundleToCart(activeBundle, false)}
              className="flex-1 sm:flex-initial px-3.5 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-[#009A44] border border-[#009A44] text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-2xs active:scale-95 transition-all cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>+ Keranjang</span>
            </button>

            <button
              type="button"
              onClick={() => handleAddBundleToCart(activeBundle, true)}
              className="flex-1 sm:flex-initial px-4 py-2.5 bg-gradient-to-r from-[#009A44] to-[#047857] hover:from-[#047857] hover:to-[#065f46] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <span>Beli Sekarang &gt;</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
