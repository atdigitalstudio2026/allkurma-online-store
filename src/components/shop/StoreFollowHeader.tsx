import React, { useState } from 'react';
import { 
  Store, 
  UserPlus, 
  UserCheck, 
  MessageSquare, 
  Star, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Tag, 
  ChevronRight, 
  Share2, 
  Info, 
  X, 
  MapPin, 
  Package, 
  Calendar,
  Clock,
  Search,
  Settings,
  Paintbrush
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { normalizeImageUrl } from '../../utils/imageUrlHelper';

interface StoreFollowHeaderProps {
  variant?: 'full-banner' | 'card' | 'compact' | 'storefront' | 'product-detail';
  className?: string;
  showVoucherPerk?: boolean;
}

export const StoreFollowHeader: React.FC<StoreFollowHeaderProps> = ({
  variant = 'card',
  className = '',
  showVoucherPerk = true
}) => {
  const { 
    sellerStore, 
    isFollowingStore, 
    toggleFollowStore, 
    setIsChatOpen, 
    showToast,
    setCurrentView,
    setSearchQuery,
    products,
    user,
    isEmailAuthorizedSeller
  } = useApp();

  const [activeShopTab, setActiveShopTab] = useState<'home' | 'all-products' | 'bundling' | 'vouchers' | 'categories'>('home');
  const [localSearch, setLocalSearch] = useState('');
  const [showBenefitModal, setShowBenefitModal] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const followerCount = sellerStore.followerCount || 24850;
  const productCount = Math.max(products?.length || 0, 148);

  const isSeller = Boolean((user?.email && isEmailAuthorizedSeller(user.email)) || user?.role === 'seller');

  const handleShareStore = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.origin + '/?store=allkurma.official');
      showToast('Tautan toko AllKurma berhasil disalin ke clipboard!', 'success');
    } else {
      showToast('Toko Official AllKurma: @allkurma.official', 'info');
    }
  };

  const handleInShopSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearch.trim()) {
      setSearchQuery(localSearch.trim());
      setCurrentView('catalog');
      showToast(`Mencari "${localSearch}" di toko AllKurma...`, 'info');
    }
  };

  const storeName = sellerStore.storeName || 'AllKurma Official Store';
  const logoUrl = normalizeImageUrl(sellerStore.logo) || 'https://images.unsplash.com/photo-1596797882870-8c33deeac224?w=200&auto=format&fit=crop&q=80';
  const bannerUrl = normalizeImageUrl(sellerStore.headerBackground || sellerStore.banner) || 'https://images.unsplash.com/photo-1596797882870-8c33deeac224?w=1200&h=600&fit=crop&q=80';

  const blurClass = 
    sellerStore.headerBackgroundBlur === 'none' ? 'backdrop-blur-none' :
    sellerStore.headerBackgroundBlur === 'medium' ? 'backdrop-blur-md' :
    sellerStore.headerBackgroundBlur === 'strong' ? 'backdrop-blur-xl' :
    'backdrop-blur-xs';

  const overlayClass = 
    sellerStore.headerBackgroundOverlay === 'light' ? 'bg-black/40' :
    sellerStore.headerBackgroundOverlay === 'dark' ? 'bg-black/80' :
    sellerStore.headerBackgroundOverlay === 'vibrant' ? 'bg-stone-950/75' :
    'bg-black/65';

  // -------------------------------------------------------------------------
  // VARIANT: COMPACT (e.g. Header dropdown or mini preview)
  // -------------------------------------------------------------------------
  if (variant === 'compact') {
    return (
      <div className={`flex items-center justify-between gap-3 p-3 bg-white rounded-lg border border-stone-200 shadow-2xs font-sans ${className}`}>
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative shrink-0">
            <img
              src={logoUrl}
              alt={storeName}
              className="w-10 h-10 rounded-full object-cover border border-stone-200 shadow-xs bg-white"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" title="Online" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[9px] bg-[#d0011b] text-white px-1.5 py-0.2 rounded-[2px] font-bold uppercase tracking-wider shrink-0">
                Shopee Mall
              </span>
              <h4 className="font-bold text-stone-900 text-xs truncate">
                {storeName}
              </h4>
            </div>
            <p className="text-[10px] text-stone-500 mt-0.5 flex items-center gap-1.5">
              <span className="flex items-center text-[#ee4d2d] font-bold">
                <Star className="w-2.5 h-2.5 fill-[#ee4d2d] inline mr-0.5" /> 4.9
              </span>
              <span>•</span>
              <span>{followerCount.toLocaleString('id-ID')} Pengikut</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => setIsChatOpen(true)}
            className="p-1.5 bg-white hover:bg-[#ffeee8] border border-[#ee4d2d]/40 text-[#ee4d2d] rounded-[2px] text-xs transition-colors cursor-pointer"
            title="Chat Sekarang"
          >
            <MessageSquare className="w-3.5 h-3.5" />
          </button>
          
          <button
            type="button"
            onClick={toggleFollowStore}
            className={`px-3 py-1.5 rounded-[2px] text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs active:scale-95 cursor-pointer ${
              isFollowingStore
                ? 'bg-stone-100 text-stone-600 border border-stone-200 hover:bg-stone-200'
                : 'bg-[#ee4d2d] hover:bg-[#d0011b] text-white'
            }`}
          >
            {isFollowingStore ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Mengikuti</span>
              </>
            ) : (
              <>
                <UserPlus className="w-3.5 h-3.5" />
                <span>+ Ikuti</span>
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // VARIANT: PRODUCT DETAIL (Authentic Shopee Product Page Store Card)
  // Shopee class: page-product__shop
  // -------------------------------------------------------------------------
  if (variant === 'product-detail') {
    return (
      <div className={`bg-white rounded-lg border border-stone-200/90 shadow-2xs font-sans overflow-hidden ${className}`}>
        {/* Main 2-Column Shopee Layout */}
        <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-5">
          
          {/* Left Column: Store Profile (~38% width) */}
          <div className="flex items-center gap-4 min-w-0 md:w-[380px] lg:w-[420px] shrink-0">
            {/* Store Avatar with Shopee Mall Badge */}
            <div className="relative shrink-0">
              <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full border border-black/10 overflow-hidden bg-white shadow-2xs">
                <img
                  src={logoUrl}
                  alt={storeName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-[#d0011b] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-[2px] tracking-wider uppercase whitespace-nowrap shadow-xs">
                Shopee Mall
              </div>
            </div>

            {/* Store Identity & Buttons */}
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-stone-900 text-sm sm:text-base leading-snug truncate">
                {storeName}
              </h3>
              
              <div className="flex items-center gap-1.5 text-stone-400 text-xs mt-0.5 mb-2.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block shrink-0" />
                <span>Aktif beberapa menit lalu</span>
              </div>

              {/* Shopee Action Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setIsChatOpen(true)}
                  className="px-3 py-1.5 bg-[#ffeee8]/60 hover:bg-[#ffeee8] border border-[#ee4d2d] text-[#ee4d2d] text-xs font-semibold rounded-[2px] transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Chat Sekarang</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCurrentView('catalog');
                    showToast('Membuka etalase toko AllKurma...', 'info');
                  }}
                  className="px-3 py-1.5 bg-white hover:bg-stone-50 border border-stone-300 text-stone-700 text-xs font-semibold rounded-[2px] transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Store className="w-3.5 h-3.5 text-stone-500" />
                  <span>Kunjungi Toko</span>
                </button>

                <button
                  type="button"
                  onClick={toggleFollowStore}
                  className={`px-3 py-1.5 rounded-[2px] text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-2xs ${
                    isFollowingStore
                      ? 'bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200'
                      : 'bg-[#ee4d2d] hover:bg-[#d0011b] text-white'
                  }`}
                >
                  {isFollowingStore ? (
                    <>
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Mengikuti</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-3 h-3" />
                      <span>+ Ikuti</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Vertical Divider */}
          <div className="hidden md:block w-px self-stretch bg-stone-200 my-1 shrink-0" />

          {/* Right Column: 6 Shopee Key Metrics in Standard 3-Column Grid */}
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-x-4 sm:gap-x-6 gap-y-2.5 text-xs sm:text-[13px]">
            <div className="flex items-center justify-between sm:justify-start gap-2">
              <span className="text-stone-500 capitalize">Penilaian</span>
              <span className="text-[#ee4d2d] font-semibold">4.9 (18.2RB)</span>
            </div>

            <div className="flex items-center justify-between sm:justify-start gap-2">
              <span className="text-stone-500 capitalize">Produk</span>
              <span className="text-[#ee4d2d] font-semibold">{productCount}</span>
            </div>

            <div className="flex items-center justify-between sm:justify-start gap-2">
              <span className="text-stone-500 capitalize">Waktu Chat Dibalas</span>
              <span className="text-[#ee4d2d] font-semibold">hitungan jam</span>
            </div>

            <div className="flex items-center justify-between sm:justify-start gap-2">
              <span className="text-stone-500 capitalize">Persentase Chat Dibalas</span>
              <span className="text-[#ee4d2d] font-semibold">100%</span>
            </div>

            <div className="flex items-center justify-between sm:justify-start gap-2">
              <span className="text-stone-500 capitalize">Bergabung</span>
              <span className="text-[#ee4d2d] font-semibold">3 tahun lalu</span>
            </div>

            <div className="flex items-center justify-between sm:justify-start gap-2">
              <span className="text-stone-500 capitalize">Pengikut</span>
              <span className="text-[#ee4d2d] font-semibold">{followerCount.toLocaleString('id-ID')}</span>
            </div>
          </div>

        </div>

        {/* Shopee Voucher Perk Strip */}
        {showVoucherPerk && (
          <div className="bg-[#fffbf8] border-t border-[#ee4d2d]/20 px-4 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="px-1.5 py-0.5 rounded-[2px] bg-[#ee4d2d] text-white text-[10px] font-bold shrink-0">
                VOUCHER
              </span>
              <div className="text-stone-800">
                <span className="font-semibold text-[#ee4d2d]">Diskon 15% Min. Belanja Rp50RB</span>
                <span className="text-stone-500 text-[11px] ml-1.5 hidden md:inline">
                  (Khusus pengikut resmi AllKurma Official Store)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                type="button"
                onClick={() => setShowBenefitModal(true)}
                className="text-[11px] text-stone-500 hover:text-stone-800 underline cursor-pointer"
              >
                S&K
              </button>

              {!isFollowingStore ? (
                <button
                  type="button"
                  onClick={toggleFollowStore}
                  className="bg-[#ee4d2d] hover:bg-[#d0011b] text-white text-xs font-bold px-3.5 py-1 rounded-[2px] transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
                >
                  <span>Klaim & Ikuti</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-300 text-[11px] font-bold px-2.5 py-0.5 rounded-[2px] flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Voucher Aktif
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // DEFAULT / VARIANT: STOREFRONT / CARD (Authentic Shopee Storefront Header)
  // Shopee class: page-shop__header
  // Left Box: Frosted Cover Image with Profile & Actions (~390px)
  // Right Box: Clean White Panel with 3 Standard Metric Columns
  // -------------------------------------------------------------------------
  return (
    <div className={`rounded-lg bg-white border border-stone-200/90 shadow-2xs font-sans overflow-hidden ${className}`}>
      
      {/* 1. Shopee Store Overview Header (Height ~140px on desktop) */}
      <div className="flex flex-col md:flex-row bg-white border-b border-stone-200">
        
        {/* LEFT COLUMN: Shopee Frosted Shop Profile Box (~390px on desktop) */}
        <div className="relative w-full md:w-[390px] lg:w-[410px] min-h-[135px] md:h-[148px] overflow-hidden bg-stone-900 shrink-0 p-3.5 sm:p-4 flex items-center gap-3.5 text-white group">
          {/* Cover image in background with dark blur vignette */}
          <img
            src={bannerUrl}
            alt={storeName}
            className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
          />
          <div className={`absolute inset-0 ${overlayClass} ${blurClass}`} />

          {/* Quick Edit button for Seller / Admin */}
          {isSeller && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentView('seller-settings');
                showToast('Membuka Pengaturan Seller: Background Header Toko...', 'info');
              }}
              title="Ganti Background Header di Pengaturan Seller"
              className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 bg-black/75 hover:bg-amber-600 text-white text-[10px] font-bold px-2 py-1 rounded-md border border-white/30 shadow-xs transition-all flex items-center gap-1 cursor-pointer"
            >
              <Paintbrush className="w-3 h-3 text-amber-300" />
              <span>Ganti Background</span>
            </button>
          )}

          {/* Avatar with Shopee Mall Badge */}
          <div 
            onClick={() => setProfileModalOpen(true)}
            className="relative z-10 shrink-0 cursor-pointer group"
            title="Lihat Foto Profil Toko"
          >
            <img
              src={logoUrl}
              alt={storeName}
              className="w-16 h-16 sm:w-18 sm:h-18 rounded-full object-cover border-2 border-white/90 shadow-md bg-white group-hover:scale-105 transition-transform"
            />
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-[#d0011b] text-white text-[8px] sm:text-[9px] font-bold px-1.5 py-0.2 rounded-[2px] tracking-wider uppercase whitespace-nowrap shadow-xs">
              Shopee Mall
            </div>
          </div>

          {/* Shop Details & Action Buttons Inside the Card */}
          <div className="relative z-10 min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h2 className="font-bold text-white text-sm sm:text-base leading-snug truncate">
                {storeName}
              </h2>
              <span title="Terverifikasi Mall">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              </span>
            </div>

            <div className="flex items-center gap-2 text-white/80 text-[11px] mt-0.5 mb-2.5 flex-wrap">
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                Aktif beberapa menit lalu
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-white/70">
                <MapPin className="w-3 h-3 text-white/60" />
                Jakarta Pusat
              </span>
            </div>

            {/* Shopee Action Buttons: [+ IKUTI] and [CHAT] */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleFollowStore}
                className={`px-3.5 py-1.5 rounded-[2px] text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer uppercase shadow-xs flex-1 ${
                  isFollowingStore
                    ? 'bg-white/20 hover:bg-white/30 text-white border border-white/40'
                    : 'bg-[#ee4d2d] hover:bg-[#d0011b] text-white'
                }`}
              >
                {isFollowingStore ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Mengikuti</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>+ Ikuti</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setIsChatOpen(true)}
                className="px-3.5 py-1.5 rounded-[2px] text-xs font-semibold border border-white/60 hover:bg-white/20 text-white transition-all flex items-center justify-center gap-1 cursor-pointer uppercase flex-1"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat</span>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Shopee 3-Column Performance Stats Panel (Clean White Background) */}
        <div className="flex-1 bg-white p-4 sm:p-5 flex items-center">
          <div className="w-full grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3.5 text-xs sm:text-[13px]">
            
            {/* Kolom 1: Produk & Mengikuti */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-stone-400 shrink-0" />
                <span className="text-stone-500">Produk:</span>
                <span className="font-bold text-[#ee4d2d] ml-auto sm:ml-0">{productCount}</span>
              </div>

              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-stone-400 shrink-0" />
                <span className="text-stone-500">Mengikuti:</span>
                <span className="font-bold text-[#ee4d2d] ml-auto sm:ml-0">12</span>
              </div>
            </div>

            {/* Kolom 2: Performa Chat & Waktu Balas */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-stone-400 shrink-0" />
                <span className="text-stone-500">Performa Chat:</span>
                <span className="font-bold text-[#ee4d2d] ml-auto sm:ml-0">100%</span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-stone-400 shrink-0" />
                <span className="text-stone-500">Waktu Balas:</span>
                <span className="font-bold text-[#ee4d2d] ml-auto sm:ml-0">hitungan jam</span>
              </div>
            </div>

            {/* Kolom 3: Pengikut, Penilaian & Bergabung */}
            <div className="space-y-3 col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-stone-400 shrink-0" />
                <span className="text-stone-500">Pengikut:</span>
                <span className="font-bold text-[#ee4d2d] ml-auto sm:ml-0">{followerCount.toLocaleString('id-ID')}</span>
              </div>

              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />
                <span className="text-stone-500">Penilaian:</span>
                <span className="font-bold text-[#ee4d2d] ml-auto sm:ml-0">4.9 (18.2RB Penilaian)</span>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* 2. Shopee Storefront Navigation Tabs Bar */}
      <div className="border-b border-stone-200 bg-white px-3 sm:px-4 flex items-center justify-between gap-4 overflow-x-auto">
        <div className="flex items-center gap-6 text-xs sm:text-sm font-medium whitespace-nowrap">
          <button
            type="button"
            onClick={() => {
              setActiveShopTab('home');
              showToast('Menampilkan Halaman Utama Toko', 'info');
            }}
            className={`py-3 transition-colors cursor-pointer relative ${
              activeShopTab === 'home'
                ? 'text-[#ee4d2d] font-bold'
                : 'text-stone-600 hover:text-[#ee4d2d]'
            }`}
          >
            Halaman Utama
            {activeShopTab === 'home' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ee4d2d]" />
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveShopTab('all-products');
              setCurrentView('catalog');
            }}
            className={`py-3 transition-colors cursor-pointer relative ${
              activeShopTab === 'all-products'
                ? 'text-[#ee4d2d] font-bold'
                : 'text-stone-600 hover:text-[#ee4d2d]'
            }`}
          >
            Semua Produk ({productCount})
            {activeShopTab === 'all-products' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ee4d2d]" />
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveShopTab('bundling');
              setCurrentView('catalog');
              showToast('Menampilkan paket bundling & promo spesial kurma...', 'info');
            }}
            className={`py-3 transition-colors cursor-pointer relative ${
              activeShopTab === 'bundling'
                ? 'text-[#ee4d2d] font-bold'
                : 'text-stone-600 hover:text-[#ee4d2d]'
            }`}
          >
            Paket Diskon
            {activeShopTab === 'bundling' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ee4d2d]" />
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveShopTab('vouchers');
              setCurrentView('allkurma-vouchers');
            }}
            className={`py-3 transition-colors cursor-pointer relative ${
              activeShopTab === 'vouchers'
                ? 'text-[#ee4d2d] font-bold'
                : 'text-stone-600 hover:text-[#ee4d2d]'
            }`}
          >
            Voucher Toko
            {activeShopTab === 'vouchers' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ee4d2d]" />
            )}
          </button>
        </div>

        {/* In-Shop Search Bar */}
        <form onSubmit={handleInShopSearch} className="hidden lg:flex items-center gap-1 py-2">
          <div className="relative">
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Cari di toko ini..."
              className="w-48 xl:w-56 pl-8 pr-3 py-1.5 text-xs bg-stone-100 focus:bg-white rounded-[2px] border border-stone-200 focus:border-[#ee4d2d] outline-hidden transition-all text-stone-900"
            />
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>
          <button
            type="submit"
            className="px-2.5 py-1.5 bg-[#ee4d2d] hover:bg-[#d0011b] text-white text-xs font-bold rounded-[2px] transition-colors cursor-pointer"
          >
            Cari
          </button>
        </form>
      </div>

      {/* 3. Shopee Voucher / Follower Perk Strip */}
      {showVoucherPerk && (
        <div className="bg-[#fffbf8] border-t border-[#ee4d2d]/20 px-3.5 py-2.5 sm:px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-1 rounded-[2px] bg-[#ee4d2d]/10 text-[#ee4d2d] border border-[#ee4d2d]/20 shrink-0">
              <Tag className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              {isFollowingStore ? (
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-emerald-800 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline shrink-0" />
                    Voucher Diskon 15% Aktif
                  </span>
                  <span className="text-stone-500 text-[11px]">
                    (Kode: <b className="text-stone-800 font-mono">FOLLOWER15</b> siap dipakai di halaman checkout)
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-stone-900 font-bold">
                    Voucher Ikuti Toko:
                  </span>
                  <span className="text-[#ee4d2d] font-bold">
                    Diskon 15% Min. Belanja Rp50RB
                  </span>
                  <span className="text-stone-500 text-[11px] hidden md:inline">
                    (Khusus follower resmi AllKurma)
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
            <button
              type="button"
              onClick={handleShareStore}
              className="p-1 text-stone-400 hover:text-stone-700 transition-colors"
              title="Bagikan Toko"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => setShowBenefitModal(true)}
              className="text-[11px] text-stone-500 hover:text-stone-800 flex items-center gap-1 underline underline-offset-2 cursor-pointer"
            >
              <Info className="w-3 h-3 text-stone-400" />
              <span>S&K</span>
            </button>

            {!isFollowingStore ? (
              <button
                type="button"
                onClick={toggleFollowStore}
                className="text-[11px] font-bold text-white bg-[#ee4d2d] hover:bg-[#d0011b] px-3.5 py-1.5 rounded-[2px] transition-colors flex items-center gap-1 cursor-pointer shadow-2xs uppercase tracking-wider"
              >
                <span>Klaim & Ikuti</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            ) : (
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-300 px-2.5 py-0.5 rounded-[2px] flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Tersimpan
              </span>
            )}
          </div>
        </div>
      )}

      {/* Follower Perks Modal */}
      {showBenefitModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-5 shadow-2xl space-y-4 font-sans animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-stone-150 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-[#ee4d2d]/10 text-[#ee4d2d]">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 text-sm sm:text-base">
                    Keuntungan Mengikuti Toko
                  </h3>
                  <p className="text-xs text-stone-500">Shopee Mall AllKurma Official</p>
                </div>
              </div>
              <button 
                onClick={() => setShowBenefitModal(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-600 hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-orange-50/70 rounded-lg border border-orange-200/80 flex items-start gap-3">
                <div className="p-1.5 bg-[#ee4d2d]/10 rounded text-[#ee4d2d] shrink-0">
                  <Tag className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-900">Voucher Diskon 15% Spesial Follower</h4>
                  <p className="text-stone-600 mt-0.5 leading-relaxed">
                    Langsung klaim potongan belanja 15% (maks. Rp25.000) tanpa ribet untuk pembelian kurma Ajwa, Sukari, Medjool, atau Madu Yaman.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-blue-50/70 rounded-lg border border-blue-200/80 flex items-start gap-3">
                <div className="p-1.5 bg-blue-100 rounded text-blue-700 shrink-0">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-900">Update Panen Segar & Flash Sale</h4>
                  <p className="text-stone-600 mt-0.5 leading-relaxed">
                    Peringatan instan di aplikasi saat kurma panen terbaru tiba di gudang dan saat flash sale grosir berlangsung.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-emerald-50/70 rounded-lg border border-emerald-200/80 flex items-start gap-3">
                <div className="p-1.5 bg-emerald-100 rounded text-emerald-700 shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-900">Jaminan 100% Original & CS Prioritas</h4>
                  <p className="text-stone-600 mt-0.5 leading-relaxed">
                    Garansi produk kurma asli bersertifikasi karantina resmi serta respon cepat konsultasi produk via Chat.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  if (!isFollowingStore) toggleFollowStore();
                  setShowBenefitModal(false);
                }}
                className={`w-full py-2.5 rounded-[2px] text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer ${
                  isFollowingStore
                    ? 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    : 'bg-[#ee4d2d] hover:bg-[#d0011b] text-white'
                }`}
              >
                {isFollowingStore ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Anda Sudah Mengikuti Toko (Tutup)</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Ikuti Toko Sekarang & Dapatkan Diskon 15%</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Photo Modal */}
      {profileModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setProfileModalOpen(false)}
        >
          <div 
            className="bg-white rounded-xl max-w-sm w-full p-4 space-y-3 font-sans"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-stone-150">
              <div className="flex items-center gap-1.5">
                <span className="bg-[#d0011b] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-[2px] uppercase">
                  Shopee Mall
                </span>
                <span className="font-bold text-xs text-stone-800">{storeName}</span>
              </div>
              <button 
                onClick={() => setProfileModalOpen(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="w-full aspect-square rounded-lg overflow-hidden bg-stone-100">
              <img
                src={logoUrl}
                alt={storeName}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
