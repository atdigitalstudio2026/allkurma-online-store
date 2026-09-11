import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Flame, 
  Sparkles, 
  ArrowRight, 
  Star, 
  Plus, 
  ChevronRight, 
  ChevronLeft, 
  Percent, 
  Building2, 
  ShieldCheck, 
  Package, 
  Coins, 
  Tag, 
  Heart, 
  Truck, 
  Gift,
  Boxes,
  ShoppingBag,
  CheckCircle2,
  MessageCircle,
  X,
  Award,
  Clock,
  MapPin,
  Check,
  Zap,
  HelpCircle,
  Calendar,
  Layers
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import { PromoBundlingModal, BUNDLE_DEALS, BundleDeal } from './PromoBundlingModal';
import { StoreFollowHeader } from './StoreFollowHeader';
import { HomeVideoBannerCard } from './HomeVideoBannerCard';
import { normalizeImageUrl } from '../../utils/imageUrlHelper';

export const HomeScreen: React.FC = () => {
  const { 
    products, 
    addToCart, 
    setSelectedProductId, 
    setCurrentView, 
    setSelectedCategory, 
    searchQuery, 
    setSearchQuery,
    kurmaPoints,
    kurmaPayBalance,
    setIsChatOpen,
    claimDailyCoin,
    lastCheckInDate,
    showToast,
    user,
    heroBanners: appHeroBanners,
    categories: appCategories,
    bundlingDeals,
    sellerStore
  } = useApp();

  // Active Bundling Deals from Store / App Context
  const activeBundlingDeals = useMemo(() => {
    const list = bundlingDeals?.filter(b => b.active !== false) || [];
    return list.length > 0 ? list : (bundlingDeals || []);
  }, [bundlingDeals]);

  // Active Hero Banners from Store / App Context
  const heroBanners = useMemo(() => {
    const list = appHeroBanners?.filter(b => b.active !== false) || [];
    return list.length > 0 ? list : (appHeroBanners || []);
  }, [appHeroBanners]);

  const bannerCount = heroBanners.length || 1;

  // 5-Slide Banner Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Promo Bundling Modal State
  const [isBundlingModalOpen, setIsBundlingModalOpen] = useState(false);
  const [selectedBundleModalId, setSelectedBundleModalId] = useState<string | undefined>(undefined);

  // Auto slide effect
  useEffect(() => {
    if (isPaused || bannerCount <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % bannerCount);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused, bannerCount]);

  const handleNextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % bannerCount);
  };

  const handlePrevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + bannerCount) % bannerCount);
  };

  // Flash sale countdown timer state (hours:mins:secs)
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 18, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 2, minutes: 30, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Automatically detect newly submitted products from the actual inventory
  // Sorts by newest submitted or prioritizes products marked with isNewArrival === true
  const newProducts = useMemo(() => {
    // 1. Get all published non-draft products
    const activeProducts = products.filter(p => !p.isDraft);
    if (activeProducts.length === 0) return [];

    // 2. Products explicitly marked as isNewArrival
    const markedNew = activeProducts.filter(p => p.isNewArrival);
    if (markedNew.length > 0) {
      return markedNew.slice(0, 6);
    }

    // 3. Otherwise sort by newest created (or array insertion order)
    const sorted = [...activeProducts].sort((a, b) => {
      if (a.createdAt && b.createdAt) {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return 0; // preserve newest-first order from addProduct
    });
    return sorted.slice(0, 6);
  }, [products]);

  // Interactive Shipping Calculator Modal State
  const [isShippingModalOpen, setIsShippingModalOpen] = useState(false);
  const [shippingDestCity, setShippingDestCity] = useState('Surabaya');
  const [shippingWeightKg, setShippingWeightKg] = useState(2);

  const shippingRates: Record<string, { reg: number; express: number; cargo: number; eta: string }> = {
    'Jakarta': { reg: 0, express: 15000, cargo: 2500, eta: '1-2 Hari' },
    'Surabaya': { reg: 0, express: 18000, cargo: 3000, eta: '2-3 Hari' },
    'Bandung': { reg: 0, express: 12000, cargo: 2000, eta: '1-2 Hari' },
    'Medan': { reg: 0, express: 28000, cargo: 4500, eta: '3-4 Hari' },
    'Makassar': { reg: 0, express: 32000, cargo: 5000, eta: '3-4 Hari' },
    'Yogyakarta': { reg: 0, express: 16000, cargo: 2800, eta: '2-3 Hari' },
    'Semarang': { reg: 0, express: 16000, cargo: 2700, eta: '2-3 Hari' },
    'Balikpapan': { reg: 0, express: 30000, cargo: 4800, eta: '3-5 Hari' },
    'Palembang': { reg: 0, express: 22000, cargo: 3800, eta: '2-3 Hari' }
  };

  const currentShippingRate = shippingRates[shippingDestCity] || shippingRates['Surabaya'];

  const categories = appCategories && appCategories.length > 0 ? appCategories : [
    { id: 'Ajwa', name: 'Kurma Ajwa', image: 'https://images.unsplash.com/photo-1608755728617-aefab37d2edd?w=600&auto=format&fit=crop&q=80' },
    { id: 'Sukari', name: 'Sukari', image: 'https://images.unsplash.com/photo-1596797882870-8c33deeac224?w=600&auto=format&fit=crop&q=80' },
    { id: 'Medjool', name: 'Medjool', image: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=600&auto=format&fit=crop&q=80' },
    { id: 'Tunisia', name: 'Tunisia', image: 'https://images.unsplash.com/photo-1596797882870-8c33deeac224?w=600&auto=format&fit=crop&q=80' },
    { id: 'Khalas', name: 'Khalas', image: 'https://images.unsplash.com/photo-1608755728617-aefab37d2edd?w=600&auto=format&fit=crop&q=80' },
    { id: 'Madu', name: 'Madu & Herbal', image: 'https://images.unsplash.com/photo-1596797882870-8c33deeac224?w=600&auto=format&fit=crop&q=80' },
  ];

  const flashSaleProducts = products.filter(p => p.isFlashSale);
  const bestSellers = products.slice(0, 4);

  const handleProductClick = (id: string) => {
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    } catch {
      window.scrollTo(0, 0);
    }
    setSelectedProductId(id);
    setCurrentView('product-detail');
  };

  const handleCategoryClick = (cat: string) => {
    if (cat === 'Grosir') {
      setCurrentView('b2b-portal');
    } else {
      setSelectedCategory(cat);
      setCurrentView('catalog');
    }
  };

  const isCheckedInToday = lastCheckInDate === new Date().toISOString().split('T')[0];

  const handleDailyCheckIn = () => {
    const success = claimDailyCoin();
    if (success) {
      showToast('Koin harian berhasil diklaim! +10 Koin Kurma.', 'success');
    } else {
      showToast('Anda sudah check-in hari ini. Kembali lagi besok ya!', 'info');
    }
  };

  const handleAddBundleDirect = (bundle: BundleDeal) => {
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
    showToast(`Paket "${bundle.name}" berhasil ditambahkan ke keranjang! Hemat Rp ${bundle.savings.toLocaleString('id-ID')}`, 'success');
  };

  const activeBanner = (heroBanners && heroBanners.length > 0)
    ? heroBanners[currentSlide % heroBanners.length] || heroBanners[0]
    : {
        id: 'default',
        badge: 'AllKurma Official',
        title: 'Kurma Premium Pilihan',
        subtitle: 'Kurma segar pilihan langsung dari Madinah dan Timur Tengah.',
        cta: 'Lihat Katalog',
        bgGradient: 'from-[#1E3A8A] via-blue-700 to-[#009A44]',
        image: 'https://images.unsplash.com/photo-1608755728617-aefab37d2edd?w=800&auto=format&fit=crop&q=80',
        tagColor: 'bg-white/20 text-emerald-100 border-white/30'
      };

  return (
    <div className="pb-28 w-full max-w-5xl lg:max-w-6xl mx-auto bg-slate-50 min-h-screen font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* 1. Customer Member Dock, Wallet & Quick Search Bar */}
      <div className="px-3 sm:px-4 pt-3 pb-1">
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-3 sm:p-3.5 space-y-2.5">
          
          {/* Mobile Search Bar with Quick Filter Tags (Visible on Mobile, Unified on Desktop) */}
          <div className="sm:hidden space-y-2">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Cari kurma Ajwa, Sukari, Medjool, grosir..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') setCurrentView('catalog');
                }}
                className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-full focus:outline-hidden focus:ring-2 focus:ring-[#009A44]/30 focus:border-[#009A44] focus:bg-white transition-all placeholder:text-slate-400"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Search Tag Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none text-[10px]">
              <span className="text-slate-400 font-medium shrink-0">Populer:</span>
              {['Ajwa Madinah', 'Sukari Basah', 'Promo Bundling', 'Grosir B2B'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    if (tag === 'Promo Bundling') {
                      setIsBundlingModalOpen(true);
                    } else if (tag === 'Grosir B2B') {
                      setCurrentView('b2b-portal');
                    } else {
                      setSearchQuery(tag);
                      setCurrentView('catalog');
                    }
                  }}
                  className="px-2 py-0.5 rounded-full bg-slate-100 hover:bg-emerald-50 hover:text-[#009A44] text-slate-600 font-medium shrink-0 transition-colors cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Points & Wallet Summary Bar (Responsive Grid) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-gradient-to-r from-blue-50/90 via-emerald-50/70 to-amber-50/70 border border-blue-100/80 rounded-xl p-2.5 sm:px-4 sm:py-2 text-[11px]">
            <div className="flex items-center justify-between sm:justify-start gap-4 sm:gap-6 flex-wrap">
              
              {/* KurmaPay Balance */}
              <div 
                onClick={() => setCurrentView('customer-dashboard')}
                className="flex items-center gap-2 cursor-pointer group"
                title="Buka Saldo & Dompet KurmaPay"
              >
                <div className="w-7 h-7 rounded-lg bg-[#1E3A8A] text-white flex items-center justify-center font-bold text-xs shadow-2xs group-hover:scale-105 transition-transform">
                  <span className="text-[10px]">Rp</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block leading-tight">Saldo KurmaPay</span>
                  <span className="font-extrabold text-[#1E3A8A] text-xs leading-none group-hover:underline">
                    Rp {kurmaPayBalance.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              <div className="h-6 w-px bg-slate-200 hidden sm:block" />

              {/* KurmaPoints */}
              <div 
                onClick={() => setCurrentView('allkurma-games')}
                className="flex items-center gap-2 cursor-pointer group"
                title="Buka Poin Belanja & Mini Games"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 text-stone-900 flex items-center justify-center font-bold text-xs shadow-2xs group-hover:scale-105 transition-transform">
                  🪙
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block leading-tight">Poin Belanja SRA</span>
                  <span className="font-extrabold text-amber-900 text-xs leading-none group-hover:underline">
                    {kurmaPoints.toLocaleString('id-ID')} Poin
                  </span>
                </div>
              </div>

            </div>

            {/* Daily Check-In & Bonus Claim Button */}
            <div className="flex items-center justify-end gap-2 border-t sm:border-t-0 pt-1.5 sm:pt-0 border-slate-200/60">
              <button
                onClick={handleDailyCheckIn}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
                  isCheckedInToday 
                    ? 'bg-emerald-100 text-[#009A44] border border-emerald-200 cursor-default' 
                    : 'bg-gradient-to-r from-[#009A44] to-[#1E3A8A] hover:from-[#047857] hover:to-blue-900 text-white active:scale-95'
                }`}
              >
                {isCheckedInToday ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#009A44]" />
                    <span>Sudah Check-In Hari Ini ✓</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
                    <span>Check-In Harian (+10 Poin)</span>
                  </>
                )}
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* 2. Official Shopee Store Profile Header & Stats & Navigation (STANDAR SHOPEE: DI ATAS BANNER) */}
      <div className="px-3 sm:px-4 py-2">
        <StoreFollowHeader variant="card" />
      </div>

      {/* 3. Dynamic 5-Slide Banner Carousel (TEPAT BERADA DI BAWAH PROFILE TOKO SESUAI STANDAR SHOPEE) */}
      <div 
        className="px-3 sm:px-4 py-2"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {activeBanner.displayMode === 'full-image' ? (
          <div 
            onClick={() => {
              if (activeBanner.isBundlingTrigger) {
                setIsBundlingModalOpen(true);
              } else if (activeBanner.targetView) {
                setCurrentView(activeBanner.targetView as any);
              } else if (activeBanner.targetCategory) {
                setSelectedCategory(activeBanner.targetCategory);
                setCurrentView('catalog');
              } else {
                setCurrentView('catalog');
              }
            }}
            className="relative w-full aspect-[2/1] rounded-2xl overflow-hidden bg-stone-950 text-white shadow-md border border-stone-200/80 transition-all duration-500 flex flex-col justify-between cursor-pointer group"
          >
            {/* 100% Full Image without gradient color tint or wash */}
            <img 
              src={normalizeImageUrl(activeBanner.image)} 
              alt={activeBanner.title} 
              className={`absolute inset-0 w-full h-full ${activeBanner.objectFit === 'contain' ? 'object-contain bg-stone-950' : 'object-cover'} block transition-opacity duration-500`} 
            />

            {/* Seller Shortcut to Banner Management */}
            {user?.role === 'seller' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentView('seller-dashboard');
                }}
                title="Kelola Banner dari Dashboard Seller"
                className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-30 flex items-center gap-1 text-[9px] sm:text-[10px] bg-black/60 hover:bg-black/85 text-amber-300 font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full backdrop-blur-md border border-amber-400/40 shadow-xs transition-all cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>Kelola Banner</span>
              </button>
            )}

            {/* Optional text overlay if enabled by seller */}
            {activeBanner.showTextOverlay ? (
              <div className="relative z-10 mt-auto pt-8 sm:pt-10 pb-2.5 sm:pb-3 px-3 sm:px-4 bg-gradient-to-t from-black/85 via-black/40 to-transparent">
                {activeBanner.badge && (
                  <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold border mb-1 backdrop-blur-xs ${activeBanner.tagColor || 'bg-white/20 text-white border-white/30'}`}>
                    {activeBanner.badge}
                  </span>
                )}
                <h2 className="text-sm sm:text-lg font-bold leading-tight text-white drop-shadow-sm line-clamp-1 sm:line-clamp-2">
                  {activeBanner.title}
                </h2>
                {activeBanner.subtitle && (
                  <p className="text-[10px] sm:text-[11px] text-white/90 mt-0.5 leading-tight sm:leading-relaxed line-clamp-1">
                    {activeBanner.subtitle}
                  </p>
                )}
                {activeBanner.cta && (
                  <span className="inline-flex items-center gap-1 mt-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 bg-white hover:bg-slate-100 text-[#1E3A8A] text-[10px] sm:text-xs font-bold rounded-lg shadow-sm transition-all">
                    <span>{activeBanner.cta}</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                )}
              </div>
            ) : (
              <div className="h-full flex-1" />
            )}

            {/* Carousel Arrow Controls */}
            <div className="absolute top-1/2 -translate-y-1/2 left-2 z-20">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevSlide();
                }}
                aria-label="Previous Slide"
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-black/45 hover:bg-black/75 text-white flex items-center justify-center backdrop-blur-xs transition-colors cursor-pointer shadow-sm"
              >
                <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 right-2 z-20">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextSlide();
                }}
                aria-label="Next Slide"
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-black/45 hover:bg-black/75 text-white flex items-center justify-center backdrop-blur-xs transition-colors cursor-pointer shadow-sm"
              >
                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>

            {/* 5-Slide Indicators Dots */}
            <div 
              onClick={(e) => e.stopPropagation()} 
              className="relative z-10 flex items-center justify-center gap-1.5 pb-2 pt-1"
            >
              {heroBanners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentSlide(idx);
                  }}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    currentSlide === idx ? 'w-5 sm:w-6 bg-white shadow-xs' : 'w-1.5 sm:w-2 bg-white/50 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className={`relative w-full aspect-[2/1] rounded-2xl overflow-hidden bg-gradient-to-r ${activeBanner.bgGradient} text-white p-3.5 sm:p-5 md:p-6 shadow-md border border-white/20 transition-all duration-500 flex flex-col justify-between`}>
            {/* Seller Shortcut to Banner Management */}
            {user?.role === 'seller' && (
              <button
                onClick={() => setCurrentView('seller-dashboard')}
                title="Kelola Banner dari Dashboard Seller"
                className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-30 flex items-center gap-1 text-[9px] sm:text-[10px] bg-black/40 hover:bg-black/65 text-amber-300 font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full backdrop-blur-md border border-amber-400/40 shadow-xs transition-all cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>Kelola Banner</span>
              </button>
            )}

            <div className="relative z-10 max-w-[65%] sm:max-w-[70%]">
              <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold border mb-1 sm:mb-1.5 ${activeBanner.tagColor}`}>
                {activeBanner.badge}
              </span>
              <h2 className="text-sm sm:text-lg lg:text-xl font-bold leading-tight text-white drop-shadow-xs line-clamp-2">
                {activeBanner.title}
              </h2>
              <p className="text-[10px] sm:text-xs text-white/90 mt-0.5 sm:mt-1 leading-tight sm:leading-relaxed line-clamp-1 sm:line-clamp-2">
                {activeBanner.subtitle}
              </p>
              <button 
                onClick={() => {
                  if (activeBanner.isBundlingTrigger) {
                    setIsBundlingModalOpen(true);
                  } else if (activeBanner.targetView) {
                    setCurrentView(activeBanner.targetView as any);
                  } else if (activeBanner.targetCategory) {
                    setSelectedCategory(activeBanner.targetCategory);
                    setCurrentView('catalog');
                  } else {
                    setCurrentView('catalog');
                  }
                }}
                className="mt-1.5 sm:mt-2.5 px-2.5 py-1 sm:px-3.5 sm:py-1.5 bg-white hover:bg-slate-100 active:scale-95 text-[#1E3A8A] text-[10px] sm:text-xs font-bold rounded-lg sm:rounded-xl flex items-center gap-1 shadow-sm transition-all cursor-pointer"
              >
                <span>{activeBanner.cta}</span>
                <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </button>
            </div>

            {/* Background decorative image with smooth transition */}
            <div className="absolute right-0 bottom-0 top-0 w-1/2 opacity-40 pointer-events-none">
              <img 
                src={normalizeImageUrl(activeBanner.image)} 
                alt={activeBanner.title} 
                className="w-full h-full object-cover object-center mix-blend-overlay opacity-60 transition-opacity duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-black/10 to-black/40" />
            </div>

            {/* Carousel Arrow Controls */}
            <div className="absolute top-1/2 -translate-y-1/2 left-2 z-20">
              <button
                onClick={handlePrevSlide}
                aria-label="Previous Slide"
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center backdrop-blur-xs transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 right-2 z-20">
              <button
                onClick={handleNextSlide}
                aria-label="Next Slide"
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center backdrop-blur-xs transition-colors cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>

            {/* 5-Slide Indicators Dots */}
            <div className="relative z-10 flex items-center justify-center gap-1.5 pb-1 sm:pb-2 pt-0.5">
              {heroBanners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    currentSlide === idx ? 'w-5 sm:w-6 bg-white shadow-xs' : 'w-1.5 sm:w-2 bg-white/40 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* NEW: 16:9 Landscape Video Banner (Standar Dimensi YouTube) */}
      <HomeVideoBannerCard
        setCurrentView={setCurrentView}
        setSelectedCategory={setSelectedCategory}
      />

      {/* 4. 8 Quick Action Icons Grid (DIPERBARUI: Promo Bundling & New Product) */}
      <div className="px-3 sm:px-4 py-2">
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5 sm:gap-3">
          
          {/* 1. Katalog Kurma */}
          <button
            onClick={() => { setSelectedCategory(null); setCurrentView('catalog'); }}
            className="flex flex-col items-center p-2 bg-white hover:bg-blue-50/50 rounded-2xl border border-stone-200 shadow-2xs group transition-all cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1E3A8A] to-[#1e326f] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <Package className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-stone-800 mt-1.5 text-center leading-tight group-hover:text-[#1E3A8A]">
              Katalog
            </span>
            <span className="text-[8px] font-medium text-stone-400">Semua Produk</span>
          </button>

          {/* 2. Voucher & Diskon */}
          <button
            onClick={() => setCurrentView('allkurma-vouchers')}
            className="flex flex-col items-center p-2 bg-white hover:bg-red-50/50 rounded-2xl border border-stone-200 shadow-2xs group transition-all cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-red-800 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <Tag className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-stone-800 mt-1.5 text-center leading-tight group-hover:text-red-700">
              Voucher
            </span>
            <span className="text-[8px] font-bold text-red-600">Diskon 50%</span>
          </button>

          {/* 3. Promo Bundling (Menggantikan SRA Live) */}
          <button
            onClick={() => setIsBundlingModalOpen(true)}
            className="flex flex-col items-center p-2 bg-white hover:bg-amber-50/50 rounded-2xl border border-stone-200 shadow-2xs group transition-all cursor-pointer relative"
          >
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[7px] font-black px-1.5 py-0.2 rounded-full border border-white tracking-wider shadow-xs">
              HEMAT 40%
            </span>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-orange-500 to-red-600 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <Boxes className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-stone-800 mt-1.5 text-center leading-tight group-hover:text-amber-800">
              Promo Bundling
            </span>
            <span className="text-[8px] font-bold text-orange-600">Paket Hemat</span>
          </button>

          {/* 4. New Product (Menggantikan Koin Game) */}
          <button
            onClick={() => {
              const el = document.getElementById('new-arrivals-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
              else {
                setSelectedCategory('Semua');
                setCurrentView('catalog');
              }
            }}
            className="flex flex-col items-center p-2 bg-white hover:bg-emerald-50/50 rounded-2xl border border-stone-200 shadow-2xs group transition-all cursor-pointer relative"
          >
            <span className="absolute -top-1 -right-1 bg-[#009A44] text-white text-[7px] font-black px-1.5 py-0.2 rounded-full border border-white tracking-wider shadow-xs">
              2026
            </span>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-[#009A44] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform font-black">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-[10px] font-bold text-stone-800 mt-1.5 text-center leading-tight group-hover:text-emerald-800">
              New Product
            </span>
            <span className="text-[8px] font-bold text-[#009A44]">Produk Baru</span>
          </button>

          {/* 5. Grosir B2B */}
          <button
            onClick={() => setCurrentView('b2b-portal')}
            className="flex flex-col items-center p-2 bg-white hover:bg-emerald-50/50 rounded-2xl border border-stone-200 shadow-2xs group transition-all cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#009A44] to-[#047857] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <Building2 className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-stone-800 mt-1.5 text-center leading-tight group-hover:text-[#009A44]">
              Grosir B2B
            </span>
            <span className="text-[8px] font-bold text-[#009A44]">Partai Besar</span>
          </button>

          {/* 6. Cek Ongkir Ekspedisi */}
          <button
            onClick={() => setIsShippingModalOpen(true)}
            className="flex flex-col items-center p-2 bg-white hover:bg-blue-50/50 rounded-2xl border border-stone-200 shadow-2xs group transition-all cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <Truck className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-stone-800 mt-1.5 text-center leading-tight group-hover:text-blue-700">
              Cek Ongkir
            </span>
            <span className="text-[8px] font-medium text-stone-400">Gratis XTRA</span>
          </button>

          {/* 7. Paket Hampers */}
          <button
            onClick={() => { setSelectedCategory('Hampers'); setCurrentView('catalog'); }}
            className="flex flex-col items-center p-2 bg-white hover:bg-purple-50/50 rounded-2xl border border-stone-200 shadow-2xs group transition-all cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-purple-800 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <Gift className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-stone-800 mt-1.5 text-center leading-tight group-hover:text-purple-700">
              Hampers
            </span>
            <span className="text-[8px] font-medium text-stone-400">Gift Box</span>
          </button>

          {/* 8. Wishlist Favorit */}
          <button
            onClick={() => setCurrentView('wishlist')}
            className="flex flex-col items-center p-2 bg-white hover:bg-rose-50/50 rounded-2xl border border-stone-200 shadow-2xs group transition-all cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <Heart className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-stone-800 mt-1.5 text-center leading-tight group-hover:text-rose-700">
              Favorit
            </span>
            <span className="text-[8px] font-medium text-stone-400">Wishlist</span>
          </button>

        </div>
      </div>

      {/* 5. Flash Sale Section with Stock Bar */}
      <div className="px-3 sm:px-4 py-2">
        <div className="bg-gradient-to-b from-red-50/50 via-amber-50/20 to-white rounded-2xl border border-red-100 p-3.5 sm:p-4 shadow-2xs space-y-3">
          <div className="flex items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5 sm:gap-3.5 flex-wrap">
              <div className="flex items-center gap-1.5 sm:gap-2 text-red-600 font-black text-base sm:text-lg lg:text-xl tracking-tight leading-tight">
                <Flame className="w-5 h-5 sm:w-6 sm:h-6 fill-red-600 text-red-600 animate-bounce shrink-0 drop-shadow-sm" />
                <span className="drop-shadow-xs">Flash Sale Kilat</span>
              </div>
              {/* Countdown timer pill */}
              <div className="flex items-center gap-1 sm:gap-1.5 font-mono text-xs sm:text-sm font-black text-white">
                <span className="bg-gradient-to-b from-[#1E3A8A] to-blue-950 px-2 sm:px-2.5 py-1 rounded-md shadow-xs ring-1 ring-blue-900/40">
                  {timeLeft.hours.toString().padStart(2, '0')}
                </span>
                <span className="text-[#1E3A8A] font-black text-sm sm:text-base">:</span>
                <span className="bg-gradient-to-b from-[#1E3A8A] to-blue-950 px-2 sm:px-2.5 py-1 rounded-md shadow-xs ring-1 ring-blue-900/40">
                  {timeLeft.minutes.toString().padStart(2, '0')}
                </span>
                <span className="text-[#1E3A8A] font-black text-sm sm:text-base">:</span>
                <span className="bg-gradient-to-r from-red-600 to-rose-600 px-2 sm:px-2.5 py-1 rounded-md shadow-xs animate-pulse ring-1 ring-red-400">
                  {timeLeft.seconds.toString().padStart(2, '0')}
                </span>
              </div>
            </div>

            <button
              onClick={() => setCurrentView('catalog')}
              className="text-xs sm:text-sm font-bold text-[#1E3A8A] hover:text-[#009A44] bg-white/90 hover:bg-white border border-red-200/80 px-3 py-1.5 rounded-xl shadow-2xs flex items-center gap-1 transition-all cursor-pointer shrink-0"
            >
              <span>Lihat Semua</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Flash Sale Cards Horizontal Scroll */}
          {flashSaleProducts.length === 0 ? (
            <div className="bg-white/90 rounded-xl p-4 text-center border border-dashed border-stone-200 text-xs text-stone-500">
              <Flame className="w-5 h-5 text-amber-500/70 mx-auto mb-1" />
              <p className="font-semibold text-stone-700">Sesi Flash Sale Berikutnya Segera Hadir!</p>
              <p className="text-[10px] text-stone-400 mt-0.5">Seller sedang menyiapkan kurma pilihan dengan diskon promo kilat.</p>
            </div>
          ) : (
            <div className="flex gap-3 overflow-x-auto pb-1.5 scrollbar-none snap-x">
              {flashSaleProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="min-w-[150px] sm:min-w-[175px] max-w-[150px] sm:max-w-[175px] bg-white rounded-xl border border-stone-200/90 overflow-hidden shadow-2xs shrink-0 snap-start flex flex-col justify-between hover:border-red-300 transition-colors"
                >
                  <div 
                    className="cursor-pointer"
                    onClick={() => handleProductClick(prod.id)}
                  >
                    <div className="relative aspect-square bg-stone-100">
                      <img
                        src={prod.images?.[0] || 'https://images.unsplash.com/photo-1596797882870-8c33deeac224?w=600&auto=format&fit=crop&q=80'}
                        alt={prod.name}
                        className="w-full h-full object-cover"
                      />
                    {prod.flashSaleDiscountPercent && (
                      <div className="absolute top-1.5 left-1.5 bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm shadow-xs">
                        -{prod.flashSaleDiscountPercent}%
                      </div>
                    )}
                  </div>
                  <div className="p-2 sm:p-2.5">
                    <p className="text-[11px] font-medium text-stone-800 line-clamp-2 leading-tight">
                      {prod.name}
                    </p>
                    <p className="text-xs sm:text-sm font-bold text-[#1E3A8A] mt-1">
                      Rp {prod.discountPrice?.toLocaleString('id-ID')}
                    </p>
                    <p className="text-[9px] text-stone-400 line-through">
                      Rp {prod.regularPrice.toLocaleString('id-ID')}
                    </p>

                    {/* Flash sale progress bar */}
                    <div className="mt-1.5">
                      <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-gradient-to-r from-amber-500 to-red-600 h-full rounded-full w-[82%]" />
                      </div>
                      <span className="text-[8px] text-stone-500 font-medium block mt-0.5">
                        🔥 Terjual 82%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-2 sm:p-2.5 pt-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(prod, 1);
                    }}
                    className="w-full py-1 bg-[#009A44] hover:bg-[#047857] active:scale-95 text-white text-[10px] font-bold rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Tambah</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
          )}
        </div>
      </div>

      {/* 6. Interactive Promo Bundling Showcase Section */}
      <div className="px-3 sm:px-4 py-2">
        <div className="bg-gradient-to-br from-amber-50/90 via-orange-50/40 to-white border border-amber-200/90 rounded-2xl p-3.5 sm:p-4 text-slate-800 shadow-2xs space-y-3">
          <div className="flex items-center justify-between gap-2.5">
            <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 text-white flex items-center justify-center shadow-md ring-2 ring-amber-300/70 shrink-0">
                <Boxes className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base sm:text-lg lg:text-xl font-black text-stone-900 tracking-tight leading-tight">
                    Paket Promo Bundling SRA
                  </h3>
                  <span className="text-[10px] sm:text-xs bg-gradient-to-r from-red-600 to-rose-600 text-white font-black px-2.5 py-0.5 rounded-full shadow-xs uppercase tracking-wider animate-pulse">
                    HEMAT S/D 40%
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsBundlingModalOpen(true)}
              className="text-xs sm:text-sm font-bold text-[#009A44] hover:text-[#047857] bg-white/90 hover:bg-white border border-amber-300/80 px-3 py-1.5 rounded-xl shadow-2xs flex items-center gap-1 transition-all cursor-pointer shrink-0"
            >
              <span>Lihat Semua</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Bundling Cards Horizontal Scroll */}
          <div className="flex gap-3 overflow-x-auto pb-1.5 scrollbar-none snap-x">
            {activeBundlingDeals.slice(0, 6).map((bundle) => (
              <div
                key={bundle.id}
                onClick={() => {
                  setSelectedBundleModalId(bundle.id);
                  setIsBundlingModalOpen(true);
                }}
                className="min-w-[240px] sm:min-w-[270px] max-w-[240px] sm:max-w-[270px] bg-white rounded-2xl border border-amber-200/90 shrink-0 snap-start flex flex-col justify-between overflow-hidden hover:border-amber-400 hover:shadow-md transition-all shadow-2xs cursor-pointer group"
              >
                {/* Bundle Image Header */}
                <div className="relative aspect-16/10 w-full bg-stone-100 overflow-hidden">
                  <img
                    src={bundle.image || 'https://images.unsplash.com/photo-1608755728617-aefab37d2edd?w=400'}
                    alt={bundle.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex items-center gap-1">
                    <span className="text-[9px] bg-red-600 text-white font-extrabold px-2 py-0.5 rounded-md shadow-xs">
                      {bundle.badge || `HEMAT ${bundle.discountPct}%`}
                    </span>
                  </div>

                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-white text-[10px]">
                    <div className="flex items-center gap-1 bg-black/50 backdrop-blur-xs px-1.5 py-0.5 rounded-md">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span className="font-bold">{bundle.rating || 5.0}</span>
                    </div>
                    <span className="bg-[#009A44]/90 backdrop-blur-xs px-2 py-0.5 rounded-md font-bold">
                      {bundle.items.length} Produk SRA
                    </span>
                  </div>
                </div>

                <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <h5 className="font-bold text-stone-900 text-xs sm:text-sm leading-snug line-clamp-1 group-hover:text-amber-700 transition-colors">
                      {bundle.name}
                    </h5>
                    <p className="text-[10px] text-stone-500 line-clamp-1 mt-0.5">
                      {bundle.subtitle || bundle.items.map(i => i.title).join(' + ')}
                    </p>

                    {/* Preview product mini badges */}
                    <div className="flex items-center gap-1 mt-2 flex-wrap">
                      {bundle.items.slice(0, 3).map((it, idx) => (
                        <span key={idx} className="text-[9px] font-medium bg-amber-50 text-amber-900 px-1.5 py-0.5 rounded-md border border-amber-200/60 truncate max-w-[120px]">
                          • {it.title}
                        </span>
                      ))}
                    </div>

                    <div className="mt-2.5 flex items-baseline gap-1.5 flex-wrap">
                      <span className="text-sm sm:text-base font-black text-[#1E3A8A]">
                        Rp {bundle.bundlePrice.toLocaleString('id-ID')}
                      </span>
                      <span className="text-[10px] text-stone-400 line-through">
                        Rp {bundle.originalPrice.toLocaleString('id-ID')}
                      </span>
                      <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-xs border border-emerald-200">
                        Hemat Rp {bundle.savings.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddBundleDirect(bundle);
                    }}
                    className="w-full py-2 bg-gradient-to-r from-[#009A44] to-emerald-600 hover:from-emerald-600 hover:to-[#009A44] active:scale-95 text-white font-bold text-[11px] rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Beli Paket Bundling</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 7. Kategori Varietas Kurma - Eye-Catching Showcase dengan Thumbnail 3x Lebih Besar */}
      <div className="px-3 sm:px-4 py-2">
        <div className="bg-gradient-to-br from-amber-100/90 via-orange-50/80 to-emerald-50/70 border-2 border-amber-300/80 rounded-3xl p-4 sm:p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between gap-2.5">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg lg:text-xl font-black text-stone-900 tracking-tight">
                  Kategori Varietas Kurma
                </h3>
                <span className="text-[10px] sm:text-xs bg-gradient-to-r from-amber-500 via-orange-500 to-[#009A44] text-white font-black px-2.5 py-0.5 rounded-full shadow-2xs uppercase tracking-wider">
                  PILIHAN FAVORIT
                </span>
              </div>
              <p className="text-xs text-amber-950/80 font-medium mt-0.5">
                Pilih jenis varietas kurma premium sesuai selera & khasiat favorit Anda
              </p>
            </div>
            <button
              onClick={() => { setSelectedCategory(null); setCurrentView('catalog'); }}
              className="text-xs sm:text-sm font-bold text-[#1E3A8A] hover:text-[#009A44] bg-white hover:bg-amber-50 border border-amber-300/90 px-3.5 py-1.5 rounded-xl shadow-2xs flex items-center gap-1 cursor-pointer transition-all shrink-0"
            >
              <span>Semua</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {categories.map((cat) => {
              const rawImg = cat.image || 'https://images.unsplash.com/photo-1596797882870-8c33deeac224?w=600&auto=format&fit=crop&q=80';
              const highResImg = rawImg.replace(/w=160/g, 'w=600').replace(/w=200/g, 'w=600');

              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.name || cat.id)}
                  className="bg-white/95 hover:bg-white border-2 border-amber-200/90 hover:border-[#009A44] rounded-2xl p-3 sm:p-4 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center group cursor-pointer focus:outline-none transform hover:-translate-y-1"
                >
                  {/* Thumbnail Icon Diperbesar 3x (dari 48px menjadi 120-144px) dengan Ring Gradien Menarik */}
                  <div className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full p-1.5 bg-gradient-to-tr from-amber-400 via-orange-400 to-[#009A44] shadow-md group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
                    <div className="w-full h-full rounded-full overflow-hidden bg-stone-100 ring-2 ring-white">
                      <img 
                        src={highResImg} 
                        alt={cat.name} 
                        className="w-full h-full object-cover group-hover:scale-115 transition-transform duration-500" 
                      />
                    </div>
                  </div>

                  <span className="text-sm sm:text-base font-black text-stone-900 mt-3 truncate w-full group-hover:text-[#1E3A8A] transition-colors">
                    {cat.name}
                  </span>

                  <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full mt-1.5 group-hover:bg-[#009A44] group-hover:text-white transition-all">
                    <span>Lihat Produk</span>
                    <ChevronRight className="w-3 h-3" />
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 8. DEDICATED SECTION: New Product / Panen Raya 2026 */}
      <div id="new-arrivals-section" className="px-3 sm:px-4 py-2 scroll-mt-20">
        <div className="bg-white rounded-2xl border border-emerald-100 p-3.5 sm:p-4 shadow-2xs space-y-3.5 bg-gradient-to-b from-emerald-50/30 to-white">
          <div className="flex items-center justify-between gap-2.5">
            <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-emerald-500 via-[#009A44] to-teal-600 text-white flex items-center justify-center shadow-md ring-2 ring-emerald-300/70 shrink-0">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base sm:text-lg lg:text-xl font-black text-stone-900 uppercase tracking-tight leading-tight">
                    New Product 2026
                  </h3>
                  <span className="text-[10px] sm:text-xs bg-gradient-to-r from-[#009A44] to-emerald-600 text-white font-black px-2.5 py-0.5 rounded-full shadow-xs uppercase tracking-wider">
                    PRODUK TERBARU
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => { setSelectedCategory(null); setCurrentView('catalog'); }}
              className="text-xs sm:text-sm font-bold text-[#009A44] hover:text-[#047857] bg-white/90 hover:bg-white border border-emerald-200/80 px-3 py-1.5 rounded-xl shadow-2xs flex items-center gap-1 cursor-pointer shrink-0"
            >
              <span>Semua</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* New Products Grid */}
          {newProducts.length === 0 ? (
            <div className="bg-emerald-50/40 rounded-xl p-5 text-center border border-dashed border-emerald-200">
              <div className="w-9 h-9 rounded-full bg-emerald-100 text-[#009A44] flex items-center justify-center mx-auto mb-2">
                <Sparkles className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-stone-800">Mendeteksi Produk Baru...</h4>
              <p className="text-[11px] text-stone-500 mt-1 max-w-sm mx-auto">
                Belum ada produk baru yang di-submit. Produk kurma yang baru ditambahkan dari Dashboard Toko Seller akan otomatis terdeteksi dan ditampilkan di sini.
              </p>
              {user.role === 'seller' ? (
                <button
                  onClick={() => setCurrentView('seller-dashboard')}
                  className="mt-3 px-3.5 py-1.5 bg-[#009A44] hover:bg-[#047857] text-white text-xs font-bold rounded-xl inline-flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Produk Baru di Seller Dashboard</span>
                </button>
              ) : (
                <button
                  onClick={() => setCurrentView('catalog')}
                  className="mt-3 px-3.5 py-1.5 bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 text-xs font-semibold rounded-xl inline-flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                >
                  <span>Eksplor Katalog Lengkap</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {newProducts.map((prod) => {
                const hasImage = Boolean(prod.images && prod.images.length > 0 && prod.images[0]);
                const displayPrice = prod.discountPrice || prod.regularPrice;
                const hasDiscount = Boolean(prod.discountPrice && prod.discountPrice < prod.regularPrice);
                const badgeText = prod.badge || 'NEW ARRIVAL';

                return (
                  <div 
                    key={prod.id}
                    onClick={() => handleProductClick(prod.id)}
                    className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs flex flex-col justify-between hover:border-emerald-400 hover:shadow-xs transition-all group cursor-pointer"
                  >
                    <div>
                      <div className="relative aspect-square bg-stone-100 overflow-hidden">
                        {hasImage && (
                          <img 
                            src={prod.images[0]} 
                            alt={prod.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).style.display = 'none';
                              const fallback = (e.currentTarget.parentElement?.querySelector('.img-fallback') as HTMLElement);
                              if (fallback) fallback.style.display = 'flex';
                            }}
                          />
                        )}
                        <div className={`img-fallback w-full h-full flex flex-col items-center justify-center bg-stone-50 text-stone-400 ${hasImage ? 'hidden' : 'flex'}`}>
                          <Package className="w-7 h-7 stroke-1 text-emerald-600/70" />
                          <span className="text-[9px] font-bold text-stone-500 mt-1">{prod.category || 'Kurma Baru'}</span>
                        </div>
                        <span className="absolute top-1.5 left-1.5 bg-[#009A44] text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded-sm shadow-xs flex items-center gap-0.5">
                          <Sparkles className="w-2.5 h-2.5" />
                          <span>{badgeText}</span>
                        </span>
                      </div>

                      <div className="p-2.5">
                        <div className="text-[9px] font-bold text-[#009A44] uppercase tracking-wider mb-0.5">
                          {prod.category}
                        </div>
                        <h5 className="font-bold text-stone-900 text-[11px] leading-tight line-clamp-2 group-hover:text-[#009A44] transition-colors">
                          {prod.name}
                        </h5>
                        <p className="text-[9px] text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                          {prod.description || 'Kurma pilihan mutu ekspor segar langsung dari kebun.'}
                        </p>

                        <div className="mt-2 flex items-baseline gap-1.5">
                          <span className="text-xs font-extrabold text-[#1E3A8A]">
                            Rp {displayPrice.toLocaleString('id-ID')}
                          </span>
                          {hasDiscount && (
                            <span className="text-[9px] text-stone-400 line-through">
                              Rp {prod.regularPrice.toLocaleString('id-ID')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="p-2.5 pt-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(prod, 1);
                        }}
                        className="w-full py-1.5 bg-emerald-50 hover:bg-[#009A44] text-[#009A44] hover:text-white border border-emerald-200 hover:border-transparent active:scale-95 text-[10px] font-bold rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>+ Keranjang</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Koleksi Kurma Terlaris Grid */}
      <div className="px-3 sm:px-4 py-2">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-base sm:text-lg lg:text-xl font-black text-stone-900 tracking-tight">
              Koleksi Kurma Terlaris
            </h3>
            <p className="text-xs text-stone-500 font-medium mt-0.5">Pilihan kurma grade premium standar ekspor</p>
          </div>
          <button
            onClick={() => setCurrentView('catalog')}
            className="text-xs sm:text-sm font-bold text-[#1E3A8A] hover:text-[#009A44] bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-xl flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>Semua</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          {bestSellers.map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs flex flex-col justify-between group hover:border-emerald-400 hover:shadow-xs transition-all"
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
                    <div className="absolute top-1.5 left-1.5 bg-[#1E3A8A] text-white text-[8px] font-bold px-1.5 py-0.5 rounded-sm">
                      {prod.badge}
                    </div>
                  )}
                  <div className="absolute bottom-1.5 right-1.5 bg-white/90 backdrop-blur-xs text-stone-800 text-[9px] font-bold px-1.5 py-0.5 rounded-sm flex items-center gap-0.5 shadow-xs">
                    <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                    <span>{prod.rating}</span>
                  </div>
                </div>

                <div className="p-2.5">
                  <p className="text-[11px] font-medium text-stone-900 line-clamp-2 leading-tight group-hover:text-[#009A44] transition-colors">
                    {prod.name}
                  </p>
                  <div className="mt-1.5 flex items-baseline gap-1.5">
                    <span className="text-xs sm:text-sm font-bold text-[#1E3A8A]">
                      Rp {(prod.discountPrice || prod.regularPrice).toLocaleString('id-ID')}
                    </span>
                    {prod.discountPrice && (
                      <span className="text-[9px] text-stone-400 line-through">
                        Rp {prod.regularPrice.toLocaleString('id-ID')}
                      </span>
                    )}
                  </div>
                  <p className="text-[9px] text-stone-500 mt-0.5">
                    Mulai dari {prod.wholesalePrices && prod.wholesalePrices.length > 0 && prod.wholesalePrices[0] ? `Rp ${prod.wholesalePrices[prod.wholesalePrices.length - 1].pricePerUnit.toLocaleString('id-ID')}/pcs` : 'Harga Grosir'}
                  </p>
                </div>
              </div>

              <div className="p-2.5 pt-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(prod, 1);
                  }}
                  className="w-full py-1.5 bg-emerald-50 hover:bg-[#009A44] text-[#009A44] hover:text-white border border-emerald-200 hover:border-transparent active:scale-95 text-[10px] font-bold rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>+ Keranjang</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 12. 4 Pilar Jaminan Mutu SRA ALLKURMA */}
      <div className="px-3 sm:px-4 py-2">
        <div className="bg-white rounded-2xl border border-stone-200 p-3.5 sm:p-4 shadow-2xs space-y-3">
          <h4 className="text-xs sm:text-sm font-bold text-stone-900 text-center uppercase tracking-wider">
            4 Jaminan Keaslian SRA ALLKURMA
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 text-[11px]">
            <div className="flex items-start gap-2 p-2.5 rounded-xl bg-blue-50/50 border border-blue-100">
              <ShieldCheck className="w-4 h-4 text-[#1E3A8A] shrink-0 mt-0.5" />
              <div>
                <strong className="text-stone-900 block text-[10px] sm:text-[11px]">100% Impor Resmi</strong>
                <span className="text-[9px] sm:text-[10px] text-stone-500 leading-tight block mt-0.5">
                  Langsung dari Madinah, Al-Qassim, Mesir & Tunisia.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2 p-2.5 rounded-xl bg-emerald-50/50 border border-emerald-100">
              <Award className="w-4 h-4 text-[#009A44] shrink-0 mt-0.5" />
              <div>
                <strong className="text-stone-900 block text-[10px] sm:text-[11px]">Halal Kemenag</strong>
                <span className="text-[9px] sm:text-[10px] text-stone-500 leading-tight block mt-0.5">
                  Uji laboratorium & karantina bebas residu kimia.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2 p-2.5 rounded-xl bg-amber-50/50 border border-amber-100">
              <Package className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong className="text-stone-900 block text-[10px] sm:text-[11px]">Cold Storage</strong>
                <span className="text-[9px] sm:text-[10px] text-stone-500 leading-tight block mt-0.5">
                  Disimpan pada suhu terkontrol bebas kutu & jamur.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2 p-2.5 rounded-xl bg-rose-50/50 border border-rose-100">
              <Percent className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-stone-900 block text-[10px] sm:text-[11px]">Garansi Retur 100%</strong>
                <span className="text-[9px] sm:text-[10px] text-stone-500 leading-tight block mt-0.5">
                  Ganti baru bila kurma busuk atau rusak di jalan.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 13. Testimoni Pembeli Terverifikasi */}
      <div className="px-3 sm:px-4 py-2">
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="text-xs sm:text-sm font-bold text-stone-900">
            Ulasan & Testimoni Pelanggan
          </h3>
          <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-amber-600 font-bold">
            <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-500 text-amber-500" />
            <span>4.9 / 5.0 (2.400+ Ulasan)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3.5 bg-white rounded-xl border border-stone-200 text-xs shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-blue-100 text-[#1E3A8A] font-bold text-[10px] flex items-center justify-center">
                  UD
                </div>
                <div>
                  <h5 className="font-bold text-stone-900 text-[11px] leading-tight">
                    Ustadz Danial (Masjid Agung)
                  </h5>
                  <span className="text-[9px] text-[#009A44] font-medium flex items-center gap-0.5">
                    <CheckCircle2 className="w-2.5 h-2.5" /> Pembeli Grosir Terverifikasi
                  </span>
                </div>
              </div>
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-amber-400" />
                ))}
              </div>
            </div>
            <p className="text-[11px] text-stone-600 italic leading-relaxed">
              "Alhamdulillah repeat order kurma Ajwa & Sukari untuk santri dan takjil jamaah. Kualitasnya selalu segar, lembut, tanpa ada kutu sama sekali. Pengiriman cargo cepat!"
            </p>
          </div>

          <div className="p-3.5 bg-white rounded-xl border border-stone-200 text-xs shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-emerald-100 text-[#009A44] font-bold text-[10px] flex items-center justify-center">
                  HN
                </div>
                <div>
                  <h5 className="font-bold text-stone-900 text-[11px] leading-tight">
                    Hj. Nurul Aini (Reseller Herbal Surabaya)
                  </h5>
                  <span className="text-[9px] text-[#009A44] font-medium flex items-center gap-0.5">
                    <CheckCircle2 className="w-2.5 h-2.5" /> Gold Partner
                  </span>
                </div>
              </div>
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-amber-400" />
                ))}
              </div>
            </div>
            <p className="text-[11px] text-stone-600 italic leading-relaxed">
              "Margin reseller sangat bersahabat. Kemasan box SRA sangat eksklusif, pelanggan saya selalu puas dengan tekstur kurma Sukari basah yang legit."
            </p>
          </div>
        </div>
      </div>

      {/* 14. WhatsApp & Konsultasi Hotline Banner */}
      <div className="px-3 sm:px-4 py-2">
        <div className="bg-gradient-to-r from-[#009A44] via-emerald-600 to-[#1E3A8A] text-white rounded-2xl p-4 shadow-sm flex items-center justify-between border border-emerald-400/20">
          <div className="space-y-0.5">
            <span className="text-[10px] text-emerald-100 font-bold uppercase tracking-wider flex items-center gap-1">
              <MessageCircle className="w-3 h-3" />
              <span>Customer Care 24/7</span>
            </span>
            <h4 className="font-bold text-xs sm:text-sm">Konsultasi Kurma & Custom Hampers</h4>
            <p className="text-[10px] text-white/90">
              Butuh bantuan memilih varietas kurma atau kirim sample?
            </p>
          </div>
          <button
            onClick={() => setIsChatOpen(true)}
            className="px-3.5 sm:px-4 py-2 bg-white hover:bg-emerald-50 active:scale-95 text-[#009A44] text-xs font-bold rounded-xl shadow-xs transition-all shrink-0 cursor-pointer"
          >
            Chat CS
          </button>
        </div>
      </div>

      {/* MODAL 2: Interactive Promo Bundling Modal */}
      <PromoBundlingModal
        isOpen={isBundlingModalOpen}
        onClose={() => {
          setIsBundlingModalOpen(false);
          setSelectedBundleModalId(undefined);
        }}
        initialBundleId={selectedBundleModalId}
      />

      {/* MODAL 3: Interactive Shipping Calculator Modal */}
      {isShippingModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#1E3A8A]">
                <Truck className="w-5 h-5" />
                <h3 className="font-bold text-sm text-stone-900">
                  Kalkulator Estimasi Ongkir
                </h3>
              </div>
              <button
                onClick={() => setIsShippingModalOpen(false)}
                className="w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {/* Origin (Fixed) */}
              <div>
                <label className="text-[10px] text-stone-500 font-bold uppercase block mb-1">
                  Kota Asal Pengiriman
                </label>
                <div className="p-2.5 bg-stone-100 rounded-xl font-medium text-stone-800 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#1E3A8A]" />
                  <span>{sellerStore?.city || 'Jakarta Pusat'} (Gudang Utama {sellerStore?.storeName || 'SRA'} Cold Storage)</span>
                </div>
              </div>

              {/* Destination City */}
              <div>
                <label className="text-[10px] text-stone-500 font-bold uppercase block mb-1">
                  Pilih Kota Tujuan Anda
                </label>
                <select
                  value={shippingDestCity}
                  onChange={(e) => setShippingDestCity(e.target.value)}
                  className="w-full p-2.5 bg-white border border-stone-200 rounded-xl font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                >
                  {Object.keys(shippingRates).map((city) => (
                    <option key={city} value={city}>
                      {city} (Estimasi {shippingRates[city].eta})
                    </option>
                  ))}
                </select>
              </div>

              {/* Weight selection */}
              <div>
                <div className="flex justify-between text-[10px] text-stone-500 font-bold uppercase mb-1">
                  <span>Estimasi Berat Paket:</span>
                  <span className="text-[#1E3A8A]">{shippingWeightKg} kg</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={20}
                  value={shippingWeightKg}
                  onChange={(e) => setShippingWeightKg(Number(e.target.value))}
                  className="w-full accent-[#009A44] cursor-pointer"
                />
              </div>

              {/* Shipping Rates Calculation List */}
              <div className="space-y-2 pt-2 border-t border-stone-200">
                {/* Regular with SRA Subsidy */}
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-stone-900 text-xs">J&T / SiCepat Reguler</span>
                      <span className="text-[8px] bg-[#009A44] text-white px-1.5 py-0.2 rounded-full font-extrabold">
                        SUBSIDI {sellerStore?.storeName?.slice(0, 10) || 'SRA'}
                      </span>
                    </div>
                    <span className="text-[10px] text-stone-500">Estimasi {currentShippingRate.eta}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-[#009A44]">GRATIS</span>
                    <span className="text-[9px] text-stone-400 line-through block">
                      Rp {(18000 * shippingWeightKg).toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                {/* Express / Next Day */}
                <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-stone-900 text-xs">Next Day / Sameday</span>
                    <span className="text-[10px] text-stone-500 block">Pengiriman prioritas esok sampai</span>
                  </div>
                  <span className="text-xs font-bold text-stone-800">
                    Rp {(currentShippingRate.express * shippingWeightKg).toLocaleString('id-ID')}
                  </span>
                </div>

                {/* Cargo / Bulk */}
                <div className="p-2.5 rounded-xl bg-blue-50/60 border border-blue-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-stone-900 text-xs">JNE Trucking / Cargo B2B</span>
                    <span className="text-[10px] text-stone-500 block">Khusus pesanan grosir & kartonan</span>
                  </div>
                  <span className="text-xs font-bold text-[#1E3A8A]">
                    Rp {(currentShippingRate.cargo * Math.max(10, shippingWeightKg)).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setIsShippingModalOpen(false);
                setCurrentView('catalog');
              }}
              className="w-full py-2.5 bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Mulai Belanja dengan Bebas Ongkir
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
