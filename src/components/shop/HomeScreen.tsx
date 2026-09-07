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
  Calculator,
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
import { normalizeImageUrl } from '../../utils/imageUrlHelper';

interface StoryItem {
  id: string;
  title: string;
  subtitle: string;
  avatar: string;
  image: string;
  content: string;
  badge: string;
  ctaText: string;
  targetView?: string;
  targetCategory?: string;
  isBundling?: boolean;
  isNewArrival?: boolean;
}

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
    heroBanners: appHeroBanners
  } = useApp();

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

  // Stories Highlight Data
  const stories: StoryItem[] = [
    {
      id: 'story-bundling',
      title: 'Promo Bundling',
      subtitle: 'Paket Kombo Sehat Berkah Hemat s/d 40%',
      avatar: 'https://images.unsplash.com/photo-1608755728617-aefab37d2edd?w=200&auto=format&fit=crop&q=80',
      image: 'https://images.unsplash.com/photo-1608755728617-aefab37d2edd?w=800&auto=format&fit=crop&q=80',
      content: 'Beli kurma lebih hemat dalam paket bundling! Dapatkan kombinasi kurma Ajwa Madinah Grade VIP + Madu Yaman Asli + Air Zamzam dengan potongan diskon hingga Rp 111.000.',
      badge: 'PROMO BUNDLING',
      ctaText: 'Buka Promo Bundling',
      isBundling: true
    },
    {
      id: 'story-panen',
      title: 'Panen Madinah 2026',
      subtitle: 'Langsung dari kebun kurma binaan di Madinah Al-Munawwarah',
      avatar: 'https://images.unsplash.com/photo-1608755728617-aefab37d2edd?w=200&auto=format&fit=crop&q=80',
      image: 'https://images.unsplash.com/photo-1608755728617-aefab37d2edd?w=800&auto=format&fit=crop&q=80',
      content: 'Kurma Ajwa SRA ALLKURMA dipetik saat tingkat kematangan sempurna (tamr). Setiap butir disortir manual, dibersihkan higienis, dan dikemas vakum tanpa tambahan glukosa atau pengawet buatan.',
      badge: 'PANEN SEGAR',
      ctaText: 'Beli Kurma Ajwa Asli',
      targetCategory: 'Ajwa'
    },
    {
      id: 'story-keaslian',
      title: '100% Asli & Halal',
      subtitle: 'Sertifikasi Kemenag RI, Lab Kemenkes & Uji Karantina',
      avatar: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=200&auto=format&fit=crop&q=80',
      image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&auto=format&fit=crop&q=80',
      content: 'PT Exindokarsa Agung menjamin seluruh produk berizin edar resmi, bersertifikat Halal Kemenag RI, serta lolos uji karantina tumbuhan bebas hama kutu.',
      badge: 'MUTU RESMI',
      ctaText: 'Lihat Semua Katalog',
      targetCategory: 'Semua'
    },
    {
      id: 'story-nabeez',
      title: 'Resep Air Nabeez',
      subtitle: 'Minuman sunnah infused water kurma penambah stamina',
      avatar: 'https://images.unsplash.com/photo-1596797882870-8c33deeac224?w=200&auto=format&fit=crop&q=80',
      image: 'https://images.unsplash.com/photo-1596797882870-8c33deeac224?w=800&auto=format&fit=crop&q=80',
      content: 'Cara membuat: Masukkan 3-7 butir kurma Ajwa ke dalam air matang 500ml, tutup rapat dan diamkan 8-12 jam. Minum airnya di pagi hari untuk alkali tubuh alami & pencernaan sehat.',
      badge: 'TIPS KESEHATAN',
      ctaText: 'Beli Kurma Ajwa',
      targetCategory: 'Ajwa'
    },
    {
      id: 'story-b2b',
      title: 'Gudang Kontainer',
      subtitle: 'Cold Storage kapasitas 100+ ton siap kirim se-Indonesia',
      avatar: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=200&auto=format&fit=crop&q=80',
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80',
      content: 'Melayani pasokan kartonan & kontainer untuk distributor herbal, jaringan minimarket, toko oleh-oleh haji, dan masjid dengan invoice tempo & harga pabrik termurah.',
      badge: 'GROSIR RESELLER',
      ctaText: 'Buka Portal Grosir B2B',
      targetView: 'b2b-portal'
    },
    {
      id: 'story-newproduct',
      title: 'New Product 2026',
      subtitle: 'Rilis varian baru Sukari Platinum & Kurma Cokelat Almond',
      avatar: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=200&auto=format&fit=crop&q=80',
      image: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=800&auto=format&fit=crop&q=80',
      content: 'Sambut panen perdana 2026! Hadir Kurma Ajwa Jumbo Al-Aliya, Kurma Sukari Platinum Chilled dalam kemasan kedap udara higienis, dan kreasi Cokelat Kurma Almond Lapis Emas.',
      badge: 'NEW ARRIVAL',
      ctaText: 'Lihat Produk Baru',
      isNewArrival: true
    }
  ];

  const [activeStory, setActiveStory] = useState<StoryItem | null>(null);

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

  // Kurma Recommendation Quiz / Finder State
  type QuizTag = 'bumil' | 'lumer' | 'renyah' | 'diet' | 'hampers';
  const [selectedQuizTag, setSelectedQuizTag] = useState<QuizTag>('bumil');

  const quizRecommendations: Record<QuizTag, {
    label: string;
    icon: string;
    productTitle: string;
    productId: string;
    category: string;
    price: number;
    originalPrice: number;
    image: string;
    texture: string;
    origin: string;
    taste: string;
    benefits: string[];
  }> = {
    bumil: {
      label: 'Ibu Hamil & Menyusui',
      icon: '🤰',
      productTitle: 'Kurma Ajwa Madinah Grade VIP',
      productId: 'prod-01',
      category: 'Ajwa',
      price: 185000,
      originalPrice: 220000,
      image: 'https://images.unsplash.com/photo-1608755728617-aefab37d2edd?w=600&auto=format&fit=crop&q=80',
      texture: 'Padat lembut berserat halus, tidak lengket',
      origin: 'Madinah Al-Munawwarah, Arab Saudi',
      taste: 'Manis legit pas & aroma khas harum kurma nabi',
      benefits: [
        'Kaya asam folat, zat besi & kalsium alami untuk janin',
        'Membantu merangsang kontraksi rahim secara alami saat persalinan',
        'Mempercepat pemulihan pasca melahirkan & melancarkan ASI'
      ]
    },
    lumer: {
      label: 'Tekstur Lembut Lumer',
      icon: '🍯',
      productTitle: 'Kurma Sukari Al-Qassim Basah (Rutob)',
      productId: 'prod-02',
      category: 'Sukari',
      price: 95000,
      originalPrice: 120000,
      image: 'https://images.unsplash.com/photo-1596797882870-8c33deeac224?w=600&auto=format&fit=crop&q=80',
      texture: 'Sangat basah & lumer langsung di lidah (melt in mouth)',
      origin: 'Al-Qassim, Arab Saudi',
      taste: 'Manis karamel alami seperti toffee mentega',
      benefits: [
        'Sumber energi instan alami tanpa kolesterol',
        'Sangat disukai anak-anak dan lansia karena empuk tanpa gigi sakit',
        'Cocok disajikan dingin dari freezer/chiller'
      ]
    },
    renyah: {
      label: 'Renyah Manis Pas',
      icon: '🌴',
      productTitle: 'Kurma Tunisia Deglet Nour Tangkai',
      productId: 'prod-04',
      category: 'Tunisia',
      price: 85000,
      originalPrice: 105000,
      image: 'https://images.unsplash.com/photo-1596797882870-8c33deeac224?w=600&auto=format&fit=crop&q=80',
      texture: 'Semi-kering, renyah kenyal berserat elegan',
      origin: 'Tozeur, Tunisia',
      taste: 'Manis madu ringan, segar dan tidak enek',
      benefits: [
        'Kandungan gula alami seimbang dengan serat tinggi',
        'Masih menempel pada tangkai alami pohon kurma',
        'Paling nikmat untuk camilan harian dan pendamping teh/kopi'
      ]
    },
    diet: {
      label: 'Diet Rendah Gula',
      icon: '🥗',
      productTitle: 'Kurma Khalas Saad Premium',
      productId: 'prod-05',
      category: 'Khalas',
      price: 65000,
      originalPrice: 80000,
      image: 'https://images.unsplash.com/photo-1608755728617-aefab37d2edd?w=600&auto=format&fit=crop&q=80',
      texture: 'Kenyal padat dengan kulit luar tipis mengkilap',
      origin: 'Al-Kharj, Arab Saudi',
      taste: 'Manis gurih alami dengan aftertaste seperti kurma panggang',
      benefits: [
        'Indeks glikemik lebih rendah, aman untuk diabetes terkontrol',
        'Kaya kalium & serat larut menjaga rasa kenyang lebih lama',
        'Ideal sebagai pengganti gula pasir dan bahan smoothies diet'
      ]
    },
    hampers: {
      label: 'Hampers & Souvenir',
      icon: '🎁',
      productTitle: 'Kurma Medjool Jumbo Premium Grade A',
      productId: 'prod-03',
      category: 'Medjool',
      price: 245000,
      originalPrice: 290000,
      image: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=600&auto=format&fit=crop&q=80',
      texture: 'Super tebal, daging buah melimpah & empuk juicy',
      origin: 'Jericho / California Grade A',
      taste: 'Kaya cita rasa manis karamel mewah dan legit',
      benefits: [
        'Dikenal sebagai "King of Dates" dengan ukuran super jumbo',
        'Dikemas dalam box eksklusif sangat mewah untuk relasi & kolega',
        'Pilihan utama untuk bingkisan hari raya dan oleh-oleh premium'
      ]
    }
  };

  // Wholesale Profit Calculator State
  const [cartonCount, setCartonCount] = useState<number>(20);

  const getWholesaleCalculation = (cartons: number) => {
    let tierName = 'Silver Partner';
    let discountPercent = 10;
    let pricePerBox = 75000;
    const regularRetailPrice = 110000;

    if (cartons >= 100) {
      tierName = 'Distributor Utama';
      discountPercent = 25;
      pricePerBox = 62000;
    } else if (cartons >= 50) {
      tierName = 'Platinum Partner';
      discountPercent = 20;
      pricePerBox = 66000;
    } else if (cartons >= 20) {
      tierName = 'Gold Partner';
      discountPercent = 15;
      pricePerBox = 70000;
    }

    const totalBoxes = cartons * 10; // 1 karton = 10 box
    const totalModal = totalBoxes * pricePerBox;
    const totalRetailValue = totalBoxes * regularRetailPrice;
    const estimatedProfit = totalRetailValue - totalModal;
    const totalSavings = (totalBoxes * regularRetailPrice) * (discountPercent / 100);

    return {
      tierName,
      discountPercent,
      totalBoxes,
      totalModal,
      totalSavings,
      estimatedProfit,
      pricePerBox
    };
  };

  const wholesaleCalc = getWholesaleCalculation(cartonCount);

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

  const categories = [
    { id: 'Ajwa', name: 'Kurma Ajwa', image: 'https://images.unsplash.com/photo-1608755728617-aefab37d2edd?w=160&auto=format&fit=crop&q=80' },
    { id: 'Sukari', name: 'Sukari', image: 'https://images.unsplash.com/photo-1596797882870-8c33deeac224?w=160&auto=format&fit=crop&q=80' },
    { id: 'Medjool', name: 'Medjool', image: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=160&auto=format&fit=crop&q=80' },
    { id: 'Tunisia', name: 'Tunisia', image: 'https://images.unsplash.com/photo-1596797882870-8c33deeac224?w=160&auto=format&fit=crop&q=80' },
    { id: 'Khalas', name: 'Khalas', image: 'https://images.unsplash.com/photo-1608755728617-aefab37d2edd?w=160&auto=format&fit=crop&q=80' },
    { id: 'Grosir', name: 'Grosir B2B', image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=160&auto=format&fit=crop&q=80' },
  ];

  const flashSaleProducts = products.filter(p => p.isFlashSale);
  const bestSellers = products.slice(0, 4);

  const handleProductClick = (id: string) => {
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
  const activeQuiz = quizRecommendations[selectedQuizTag];

  return (
    <div className="pb-28 max-w-lg mx-auto bg-slate-50 min-h-screen font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* 1. Mobile Search Bar & Poin Bar */}
      <div className="p-3.5 bg-white border-b border-slate-100 sticky top-0 z-20 shadow-2xs space-y-2">
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
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#009A44]/30 focus:border-[#009A44] focus:bg-white transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Quick Points & Wallet Summary Bar */}
        <div className="flex items-center justify-between bg-gradient-to-r from-blue-50/80 via-emerald-50/80 to-blue-50/80 border border-blue-100 rounded-xl px-3 py-1.5 text-[11px]">
          <div 
            onClick={() => setCurrentView('allkurma-games')}
            className="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="w-5 h-5 rounded-full bg-amber-500 text-stone-900 flex items-center justify-center font-bold text-[9px] shadow-2xs">
              🪙
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block leading-none">Poin Belanja</span>
              <span className="font-extrabold text-amber-900 leading-none">
                {kurmaPoints.toLocaleString('id-ID')} Poin
              </span>
            </div>
          </div>

          <div className="h-5 w-px bg-slate-200" />

          <div 
            onClick={() => setCurrentView('customer-dashboard')}
            className="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <span className="text-[10px] text-slate-500 block leading-none">Saldo KurmaPay</span>
            <span className="font-extrabold text-[#1E3A8A] leading-none">
              Rp {kurmaPayBalance.toLocaleString('id-ID')}
            </span>
          </div>

          <button
            onClick={handleDailyCheckIn}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
              isCheckedInToday 
                ? 'bg-emerald-100 text-[#009A44] border border-emerald-200 cursor-default' 
                : 'bg-gradient-to-r from-[#009A44] to-[#1E3A8A] text-white shadow-2xs active:scale-95'
            }`}
          >
            {isCheckedInToday ? (
              <>
                <Check className="w-3 h-3" />
                <span>Check-in ✓</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3 h-3" />
                <span>Klaim +10</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. Interactive SRA Stories Bar */}
      <div className="px-4 py-2.5 bg-white border-b border-slate-100 overflow-hidden">
        <div className="flex items-center gap-3.5 overflow-x-auto pb-1 scrollbar-none snap-x">
          {stories.map((story) => (
            <button
              key={story.id}
              onClick={() => {
                if (story.isBundling) {
                  setIsBundlingModalOpen(true);
                } else if (story.isNewArrival) {
                  const el = document.getElementById('new-arrivals-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                  else {
                    setSelectedCategory('Semua');
                    setCurrentView('catalog');
                  }
                } else {
                  setActiveStory(story);
                }
              }}
              className="flex flex-col items-center shrink-0 snap-start group cursor-pointer focus:outline-none"
            >
              <div className={`relative p-0.5 rounded-full ${
                story.isBundling 
                  ? 'bg-gradient-to-tr from-amber-500 via-orange-500 to-red-600' 
                  : story.isNewArrival
                  ? 'bg-gradient-to-tr from-emerald-500 via-teal-500 to-[#009A44]'
                  : 'bg-gradient-to-tr from-[#1E3A8A] via-emerald-500 to-[#009A44]'
              }`}>
                <div className="w-14 h-14 rounded-full p-0.5 bg-white overflow-hidden">
                  <img 
                    src={story.avatar} 
                    alt={story.title} 
                    className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                {story.isBundling ? (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[7px] font-black px-1.5 py-0.2 rounded-full border border-white tracking-wider">
                    HEMAT
                  </span>
                ) : story.isNewArrival ? (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-[#009A44] text-white text-[7px] font-black px-1.5 py-0.2 rounded-full border border-white tracking-wider">
                    NEW
                  </span>
                ) : (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-[#1E3A8A] text-white text-[7px] font-bold px-1 rounded-sm border border-white">
                    SRA
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium text-slate-800 mt-1.5 text-center truncate max-w-[64px] group-hover:text-[#1E3A8A]">
                {story.title}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Dynamic 5-Slide Banner Carousel (Landscape 1:2 / 2:1 Aspect Ratio) */}
      <div 
        className="p-4"
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
            className="relative w-full aspect-[2/1] rounded-2xl overflow-hidden bg-stone-950 text-white shadow-lg border border-stone-200/80 transition-all duration-500 flex flex-col justify-between cursor-pointer group"
          >
            {/* 100% Full Image without gradient color tint or wash */}
            <img 
              src={normalizeImageUrl(activeBanner.image)} 
              alt={activeBanner.title} 
              className={`absolute inset-0 w-full h-full ${activeBanner.objectFit === 'contain' ? 'object-contain bg-stone-950' : 'object-cover'} block transition-transform duration-700 group-hover:scale-[1.02]`} 
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
          <div className={`relative w-full aspect-[2/1] rounded-2xl overflow-hidden bg-gradient-to-r ${activeBanner.bgGradient} text-white p-3.5 sm:p-5 shadow-lg border border-white/20 transition-all duration-500 flex flex-col justify-between`}>
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

      {/* Official Store Card with Follow Button & Followers Perk */}
      <div className="px-4 pb-2">
        <StoreFollowHeader variant="card" />
      </div>

      {/* 4. 8 Quick Action Icons Grid (DIPERBARUI: Promo Bundling & New Product) */}
      <div className="px-4 py-1">
        <div className="grid grid-cols-4 gap-2.5">
          
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
            <span className="text-[8px] font-bold text-[#009A44]">Panen Baru</span>
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

      {/* 5. Interactive Promo Bundling Showcase Section */}
      <div className="px-4 py-2">
        <div className="bg-gradient-to-br from-amber-50/90 via-orange-50/40 to-white border border-amber-200/80 rounded-2xl p-4 text-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-xs">
                <Boxes className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <span>Paket Promo Bundling SRA</span>
                  <span className="text-[8px] bg-red-600 text-white font-extrabold px-1.5 py-0.2 rounded-full shadow-2xs">
                    HEMAT S/D 40%
                  </span>
                </h4>
                <p className="text-[10px] text-slate-500">
                  Kurma Ajwa + Madu Murni + Air Zamzam Asli
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsBundlingModalOpen(true)}
              className="text-[11px] font-bold text-[#009A44] hover:text-[#047857] flex items-center gap-0.5 transition-colors cursor-pointer"
            >
              <span>Lihat Semua</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Bundling Cards Horizontal Scroll */}
          <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none snap-x">
            {BUNDLE_DEALS.slice(0, 3).map((bundle) => (
              <div
                key={bundle.id}
                className="min-w-[210px] max-w-[210px] bg-white rounded-xl p-3 border border-amber-200/80 shrink-0 snap-start flex flex-col justify-between space-y-2 hover:border-amber-400 hover:shadow-xs transition-all shadow-2xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[8px] bg-red-600 text-white font-bold px-1.5 py-0.5 rounded-sm shadow-2xs">
                      {bundle.badge}
                    </span>
                    <div className="flex items-center gap-0.5 text-[9px] text-amber-600 font-bold">
                      <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                      <span>{bundle.rating}</span>
                    </div>
                  </div>

                  <h5 className="font-bold text-slate-900 text-xs leading-tight line-clamp-1">
                    {bundle.name}
                  </h5>
                  <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                    {bundle.items.map(i => i.title).join(' + ')}
                  </p>

                  <div className="mt-2 flex items-baseline gap-1.5">
                    <span className="text-xs font-black text-[#1E3A8A]">
                      Rp {bundle.bundlePrice.toLocaleString('id-ID')}
                    </span>
                    <span className="text-[9px] text-slate-400 line-through">
                      Rp {bundle.originalPrice.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleAddBundleDirect(bundle)}
                  className="w-full py-1.5 bg-gradient-to-r from-[#009A44] to-emerald-600 hover:from-emerald-600 hover:to-[#009A44] active:scale-95 text-white font-bold text-[10px] rounded-lg flex items-center justify-center gap-1 shadow-xs transition-all cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>Beli Paket Bundling</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 6. Flash Sale Section with Stock Bar */}
      <div className="mt-2 px-4 py-3 bg-gradient-to-b from-blue-50/50 to-transparent">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-[#009A44] font-bold text-xs tracking-tight">
              <Flame className="w-4 h-4 fill-[#009A44] text-[#009A44] animate-pulse" />
              <span>Flash Sale</span>
            </div>
            {/* Countdown timer pill */}
            <div className="flex items-center gap-1 font-mono text-[10px] font-bold text-white">
              <span className="bg-[#1E3A8A] px-1.5 py-0.5 rounded-sm">
                {timeLeft.hours.toString().padStart(2, '0')}
              </span>
              <span className="text-[#1E3A8A]">:</span>
              <span className="bg-[#1E3A8A] px-1.5 py-0.5 rounded-sm">
                {timeLeft.minutes.toString().padStart(2, '0')}
              </span>
              <span className="text-[#1E3A8A]">:</span>
              <span className="bg-[#009A44] px-1.5 py-0.5 rounded-sm animate-pulse">
                {timeLeft.seconds.toString().padStart(2, '0')}
              </span>
            </div>
          </div>

          <button
            onClick={() => setCurrentView('catalog')}
            className="text-[11px] font-semibold text-[#1E3A8A] hover:text-[#009A44] flex items-center gap-0.5 transition-colors cursor-pointer"
          >
            <span>Lihat Semua</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Flash Sale Cards Horizontal Scroll */}
        {flashSaleProducts.length === 0 ? (
          <div className="bg-white/80 rounded-xl p-4 text-center border border-dashed border-stone-200 text-xs text-stone-500">
            <Flame className="w-5 h-5 text-amber-500/70 mx-auto mb-1" />
            <p className="font-semibold text-stone-700">Sesi Flash Sale Berikutnya Segera Hadir!</p>
            <p className="text-[10px] text-stone-400 mt-0.5">Seller sedang menyiapkan kurma pilihan dengan diskon promo kilat.</p>
          </div>
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none snap-x">
            {flashSaleProducts.map((prod) => (
              <div
                key={prod.id}
                className="min-w-[145px] max-w-[145px] bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs shrink-0 snap-start flex flex-col justify-between"
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
                <div className="p-2">
                  <p className="text-[11px] font-medium text-stone-800 line-clamp-2 leading-tight">
                    {prod.name}
                  </p>
                  <p className="text-xs font-bold text-[#1E3A8A] mt-1">
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

              <div className="p-2 pt-0">
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

      {/* 7. DEDICATED SECTION: New Product / Panen Raya 2026 */}
      <div id="new-arrivals-section" className="px-4 py-3 scroll-mt-20">
        <div className="bg-white rounded-2xl border border-emerald-100 p-4 shadow-xs space-y-3.5 bg-gradient-to-b from-emerald-50/30 to-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-[#009A44] text-white flex items-center justify-center shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                    New Product 2026
                  </h3>
                  <span className="text-[8px] bg-[#009A44] text-white font-extrabold px-1.5 py-0.2 rounded-full">
                    PANEN PERDANA
                  </span>
                </div>
                <p className="text-[10px] text-stone-500">
                  Stok segar baru tiba langsung dari perkebunan Madinah & Al-Qassim
                </p>
              </div>
            </div>

            <button
              onClick={() => { setSelectedCategory(null); setCurrentView('catalog'); }}
              className="text-[11px] font-semibold text-[#009A44] hover:text-[#047857] flex items-center gap-0.5 cursor-pointer"
            >
              <span>Semua</span>
              <ChevronRight className="w-3.5 h-3.5" />
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
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {newProducts.map((prod) => {
                const hasImage = Boolean(prod.images && prod.images.length > 0 && prod.images[0]);
                const displayPrice = prod.discountPrice || prod.regularPrice;
                const hasDiscount = Boolean(prod.discountPrice && prod.discountPrice < prod.regularPrice);
                const badgeText = prod.badge || (prod.harvestYear ? prod.harvestYear : 'NEW HARVEST 2026');
                const harvestTag = prod.harvestYear || prod.origin || 'Panen Terbaru';

                return (
                  <div 
                    key={prod.id}
                    onClick={() => handleProductClick(prod.id)}
                    className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs flex flex-col justify-between hover:border-emerald-400 hover:shadow-xs transition-all group cursor-pointer"
                  >
                    <div>
                      <div className="relative aspect-4/3 bg-stone-100 overflow-hidden">
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
                        <span className="absolute bottom-1.5 left-1.5 bg-black/60 backdrop-blur-xs text-white text-[8px] font-semibold px-1.5 py-0.2 rounded-sm flex items-center gap-0.5">
                          <Calendar className="w-2.5 h-2.5" />
                          <span>{harvestTag}</span>
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

      {/* 8. Interactive Kurma Finder / "Rekomendasi Pintar Sesuai Kebutuhan" */}
      <div className="px-4 py-3">
        <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[#1E3A8A]">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                Rekomendasi Kurma Pintar
              </h3>
            </div>
            <span className="text-[10px] bg-blue-50 text-[#1E3A8A] font-bold px-2 py-0.5 rounded-full">
              Pilihan Dokter & Ahli Gizi
            </span>
          </div>
          <p className="text-[11px] text-stone-500 leading-relaxed">
            Pilih kebutuhan kesehatan atau selera Anda untuk rekomendasi kurma terbaik:
          </p>

          {/* Quiz Tag Selector Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {(Object.keys(quizRecommendations) as QuizTag[]).map((tagKey) => {
              const item = quizRecommendations[tagKey];
              const isSelected = selectedQuizTag === tagKey;
              return (
                <button
                  key={tagKey}
                  onClick={() => setSelectedQuizTag(tagKey)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1 shrink-0 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#1E3A8A] to-[#009A44] text-white shadow-2xs scale-102'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Spotlight Recommendation Card */}
          <div className="bg-gradient-to-br from-stone-50 to-blue-50/40 rounded-xl p-3.5 border border-stone-200 space-y-3">
            <div className="flex gap-3">
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-white shrink-0 border border-stone-200">
                <img 
                  src={activeQuiz.image} 
                  alt={activeQuiz.productTitle} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[9px] bg-amber-100 text-amber-900 font-bold px-1.5 py-0.5 rounded-sm">
                  {activeQuiz.origin}
                </span>
                <h4 className="text-xs font-bold text-stone-900 mt-1 leading-snug truncate">
                  {activeQuiz.productTitle}
                </h4>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-xs font-bold text-[#1E3A8A]">
                    Rp {activeQuiz.price.toLocaleString('id-ID')}
                  </span>
                  <span className="text-[10px] text-stone-400 line-through">
                    Rp {activeQuiz.originalPrice.toLocaleString('id-ID')}
                  </span>
                </div>
                <p className="text-[10px] text-stone-600 mt-1">
                  <strong className="text-stone-800">Tekstur:</strong> {activeQuiz.texture}
                </p>
              </div>
            </div>

            {/* Benefits Checklist */}
            <div className="space-y-1.5 pt-1 border-t border-stone-200/70">
              {activeQuiz.benefits.map((benefit, i) => (
                <div key={i} className="flex items-start gap-1.5 text-[11px] text-stone-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#009A44] shrink-0 mt-0.5" />
                  <span className="leading-tight">{benefit}</span>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => {
                  const targetProd = products.find(p => p.id === activeQuiz.productId) || products[0];
                  if (targetProd) addToCart(targetProd, 1);
                }}
                className="flex-1 py-2 bg-[#009A44] hover:bg-[#047857] active:scale-95 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Beli Sekarang</span>
              </button>
              <button
                onClick={() => {
                  setSelectedCategory(activeQuiz.category);
                  setCurrentView('catalog');
                }}
                className="px-3.5 py-2 bg-white hover:bg-stone-100 text-stone-700 text-xs font-bold rounded-xl border border-stone-200 transition-colors cursor-pointer"
              >
                Katalog {activeQuiz.category}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 9. Kategori Varietas Kurma Circular Avatars */}
      <div className="px-4 py-2">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-stone-900 tracking-tight">
            Kategori Varietas Kurma
          </h3>
          <button
            onClick={() => { setSelectedCategory(null); setCurrentView('catalog'); }}
            className="text-[11px] font-semibold text-[#1E3A8A] hover:text-[#009A44] flex items-center gap-0.5 cursor-pointer"
          >
            <span>Semua</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-6 gap-2 text-center">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className="flex flex-col items-center group cursor-pointer focus:outline-none"
            >
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-stone-200 group-hover:border-[#009A44] group-active:scale-95 transition-all shadow-xs bg-stone-100">
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                />
              </div>
              <span className="text-[10px] font-medium text-stone-700 mt-1.5 truncate w-full group-hover:text-[#1E3A8A]">
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 10. Kalkulator Untung Reseller & Grosir B2B Interaktif */}
      <div className="px-4 py-3">
        <div className="bg-gradient-to-br from-blue-50/90 via-white to-emerald-50/40 rounded-2xl p-4 text-slate-800 shadow-sm space-y-3.5 border border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#1E3A8A] text-white flex items-center justify-center shadow-xs">
                <Calculator className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 leading-tight">
                  Simulasi Untung Reseller & Grosir
                </h4>
                <p className="text-[10px] text-slate-500">
                  Hitung potensi margin keuntungan toko Anda
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold bg-blue-100 text-[#1E3A8A] border border-blue-200 px-2 py-0.5 rounded-full">
              Tier: {wholesaleCalc.tierName}
            </span>
          </div>

          {/* Quick Volume Slider Buttons */}
          <div>
            <div className="flex items-center justify-between text-[11px] text-slate-600 mb-1.5">
              <span>Volume Pengambilan:</span>
              <span className="font-bold text-[#1E3A8A]">{cartonCount} Karton ({wholesaleCalc.totalBoxes} Box)</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {[5, 20, 50, 100].map((num) => (
                <button
                  key={num}
                  onClick={() => setCartonCount(num)}
                  className={`py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    cartonCount === num
                      ? 'bg-[#1E3A8A] text-white shadow-xs scale-102'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {num} Karton
                </button>
              ))}
            </div>
          </div>

          {/* Output Calculation Grid */}
          <div className="grid grid-cols-2 gap-2 bg-white p-3 rounded-xl border border-blue-100 text-xs shadow-2xs">
            <div>
              <span className="text-[10px] text-slate-500 block">Harga Modal Reseller</span>
              <span className="text-sm font-extrabold text-slate-900">
                Rp {wholesaleCalc.pricePerBox.toLocaleString('id-ID')}/box
              </span>
              <span className="text-[9px] text-[#009A44] block font-bold">
                Diskon -{wholesaleCalc.discountPercent}%
              </span>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 block">Estimasi Profit Laba</span>
              <span className="text-sm font-extrabold text-[#009A44]">
                +Rp {wholesaleCalc.estimatedProfit.toLocaleString('id-ID')}
              </span>
              <span className="text-[9px] text-emerald-700 block">
                Hemat Rp {wholesaleCalc.totalSavings.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentView('b2b-portal')}
              className="flex-1 py-2 bg-gradient-to-r from-[#009A44] to-emerald-600 hover:from-emerald-600 hover:to-[#009A44] active:scale-95 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 shadow-xs transition-all cursor-pointer"
            >
              <span>Pesan Grosir B2B</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsChatOpen(true)}
              className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold text-xs rounded-xl flex items-center gap-1 transition-colors cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Tanya CS</span>
            </button>
          </div>
        </div>
      </div>

      {/* 11. Koleksi Kurma Terlaris Grid */}
      <div className="px-4 py-2">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-xs font-bold text-stone-900 tracking-tight">
              Koleksi Kurma Terlaris
            </h3>
            <p className="text-[10px] text-stone-500">Panen segar pilihan grade premium standar ekspor</p>
          </div>
          <button
            onClick={() => setCurrentView('catalog')}
            className="text-[11px] font-semibold text-[#1E3A8A] hover:text-[#009A44] flex items-center gap-0.5 cursor-pointer transition-colors"
          >
            <span>Semua</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {bestSellers.map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs flex flex-col justify-between group"
            >
              <div 
                className="cursor-pointer"
                onClick={() => handleProductClick(prod.id)}
              >
                <div className="relative aspect-4/3 bg-stone-100 overflow-hidden">
                  <img
                    src={prod.images[0]}
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
                  <p className="text-[11px] font-medium text-stone-900 line-clamp-2 leading-tight">
                    {prod.name}
                  </p>
                  <div className="mt-1.5 flex items-baseline gap-1.5">
                    <span className="text-xs font-bold text-[#1E3A8A]">
                      Rp {(prod.discountPrice || prod.regularPrice).toLocaleString('id-ID')}
                    </span>
                    {prod.discountPrice && (
                      <span className="text-[9px] text-stone-400 line-through">
                        Rp {prod.regularPrice.toLocaleString('id-ID')}
                      </span>
                    )}
                  </div>
                  <p className="text-[9px] text-stone-500 mt-0.5">
                    Mulai dari {prod.wholesalePrices[0] ? `Rp ${prod.wholesalePrices[prod.wholesalePrices.length - 1].pricePerUnit.toLocaleString('id-ID')}/pcs` : 'Harga Grosir'}
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
      <div className="px-4 py-3">
        <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs space-y-3">
          <h4 className="text-xs font-bold text-stone-900 text-center uppercase tracking-wider">
            4 Jaminan Keaslian SRA ALLKURMA
          </h4>
          <div className="grid grid-cols-2 gap-2.5 text-[11px]">
            <div className="flex items-start gap-2 p-2 rounded-xl bg-blue-50/50 border border-blue-100">
              <ShieldCheck className="w-4 h-4 text-[#1E3A8A] shrink-0 mt-0.5" />
              <div>
                <strong className="text-stone-900 block text-[10px]">100% Impor Resmi</strong>
                <span className="text-[10px] text-stone-500 leading-tight block">
                  Langsung dari Madinah, Al-Qassim, Mesir & Tunisia.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2 p-2 rounded-xl bg-emerald-50/50 border border-emerald-100">
              <Award className="w-4 h-4 text-[#009A44] shrink-0 mt-0.5" />
              <div>
                <strong className="text-stone-900 block text-[10px]">Halal Kemenag</strong>
                <span className="text-[10px] text-stone-500 leading-tight block">
                  Uji laboratorium & karantina bebas residu kimia.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2 p-2 rounded-xl bg-amber-50/50 border border-amber-100">
              <Package className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong className="text-stone-900 block text-[10px]">Cold Storage</strong>
                <span className="text-[10px] text-stone-500 leading-tight block">
                  Disimpan pada suhu terkontrol bebas kutu & jamur.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2 p-2 rounded-xl bg-rose-50/50 border border-rose-100">
              <Percent className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-stone-900 block text-[10px]">Garansi Retur 100%</strong>
                <span className="text-[10px] text-stone-500 leading-tight block">
                  Ganti baru bila kurma busuk atau rusak di jalan.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 13. Testimoni Pembeli Terverifikasi */}
      <div className="px-4 py-2">
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="text-xs font-bold text-stone-900">
            Ulasan & Testimoni Pelanggan
          </h3>
          <div className="flex items-center gap-1 text-[10px] text-amber-600 font-bold">
            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
            <span>4.9 / 5.0 (2.400+ Ulasan)</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="p-3 bg-white rounded-xl border border-stone-200 text-xs shadow-2xs space-y-1.5">
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

          <div className="p-3 bg-white rounded-xl border border-stone-200 text-xs shadow-2xs space-y-1.5">
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
      <div className="px-4 py-3">
        <div className="bg-gradient-to-r from-[#009A44] via-emerald-600 to-[#1E3A8A] text-white rounded-2xl p-4 shadow-sm flex items-center justify-between border border-emerald-400/20">
          <div className="space-y-0.5">
            <span className="text-[10px] text-emerald-100 font-bold uppercase tracking-wider flex items-center gap-1">
              <MessageCircle className="w-3 h-3" />
              <span>Customer Care 24/7</span>
            </span>
            <h4 className="font-bold text-xs">Konsultasi Kurma & Custom Hampers</h4>
            <p className="text-[10px] text-white/90">
              Butuh bantuan memilih varietas kurma atau kirim sample?
            </p>
          </div>
          <button
            onClick={() => setIsChatOpen(true)}
            className="px-3.5 py-2 bg-white hover:bg-emerald-50 active:scale-95 text-[#009A44] text-xs font-bold rounded-xl shadow-xs transition-all shrink-0 cursor-pointer"
          >
            Chat CS
          </button>
        </div>
      </div>

      {/* MODAL 1: Interactive Story Viewer Modal */}
      {activeStory && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl border border-stone-800 relative space-y-4">
            
            {/* Story Image Header */}
            <div className="relative aspect-4/3 bg-stone-900">
              <img 
                src={activeStory.image} 
                alt={activeStory.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />

              {/* Story Top Progress / Close Bar */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                <span className="bg-white/20 backdrop-blur-md text-white text-[9px] font-bold px-2 py-0.5 rounded-full border border-white/30">
                  {activeStory.badge}
                </span>
                <button
                  onClick={() => setActiveStory(null)}
                  className="w-7 h-7 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Story Header Title */}
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <h3 className="text-base font-bold leading-tight">{activeStory.title}</h3>
                <p className="text-[11px] text-stone-200 mt-0.5">{activeStory.subtitle}</p>
              </div>
            </div>

            {/* Story Content Body */}
            <div className="p-4 pt-0 space-y-4">
              <p className="text-xs text-stone-600 leading-relaxed">
                {activeStory.content}
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const isBundling = activeStory.isBundling;
                    const isNewArrival = activeStory.isNewArrival;
                    const targetCategory = activeStory.targetCategory;
                    const targetView = activeStory.targetView;
                    setActiveStory(null);
                    if (isBundling) {
                      setIsBundlingModalOpen(true);
                    } else if (isNewArrival) {
                      const el = document.getElementById('new-arrivals-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    } else if (targetView) {
                      setCurrentView(targetView as any);
                    } else if (targetCategory && targetCategory !== 'Semua') {
                      setSelectedCategory(targetCategory);
                      setCurrentView('catalog');
                    } else {
                      setCurrentView('catalog');
                    }
                  }}
                  className="flex-1 py-2.5 bg-gradient-to-r from-[#1E3A8A] to-[#009A44] hover:from-[#172554] hover:to-[#047857] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
                >
                  <span>{activeStory.ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setActiveStory(null)}
                  className="px-3.5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* MODAL 2: Interactive Promo Bundling Modal */}
      <PromoBundlingModal
        isOpen={isBundlingModalOpen}
        onClose={() => setIsBundlingModalOpen(false)}
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
                  <span>Jakarta Pusat (Gudang Utama SRA Cold Storage)</span>
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
                        SUBSIDI SRA
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
