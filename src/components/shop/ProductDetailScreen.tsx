import React, { useState, useEffect, useMemo } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { 
  ArrowLeft, 
  Share2, 
  ShoppingCart, 
  Star, 
  MessageSquare, 
  ShieldCheck, 
  Truck, 
  Building2, 
  Check, 
  Plus, 
  Minus,
  Sparkles, 
  Send,
  Heart,
  Coins,
  Barcode,
  Layers,
  Globe,
  Shield,
  Box,
  Copy,
  Link2,
  Home
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Product, ProductVariation } from '../../types';
import { ShopeeReviewsSection } from './ShopeeReviewsSection';
import { StoreFollowHeader } from './StoreFollowHeader';

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1596797882870-8c33deeac224?w=600&auto=format&fit=crop&q=80';

// High-performance Mobile Skeleton to prevent blank screen flash on slow networks
const ProductDetailSkeleton: React.FC<{ onBack: () => void; productId?: string | null }> = ({ onBack, productId }) => (
  <div className="pb-36 max-w-lg mx-auto bg-stone-50 min-h-screen animate-pulse font-['Plus_Jakarta_Sans',sans-serif]">
    {/* Top Bar Skeleton */}
    <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200 px-4 py-3 flex items-center justify-between shadow-xs">
      <button
        onClick={onBack}
        className="p-1.5 rounded-lg text-stone-700 hover:bg-stone-100 transition-colors"
        aria-label="Kembali"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>
      <div className="h-4 w-28 bg-stone-200 rounded-md" />
      <div className="w-8 h-8 rounded-lg bg-stone-100" />
    </div>

    {/* Hero Image Skeleton */}
    <div className="aspect-square w-full bg-stone-200 relative flex items-center justify-center">
      <Box className="w-12 h-12 text-stone-300" />
      <div className="absolute bottom-3 left-4 right-4 bg-white/80 backdrop-blur-xs py-1.5 px-3 rounded-xl flex items-center justify-between">
        <span className="text-[11px] text-stone-600 font-medium">Memuat detail produk...</span>
        <div className="w-3 h-3 rounded-full border-2 border-amber-600 border-t-transparent animate-spin" />
      </div>
    </div>

    {/* Content Placeholders */}
    <div className="p-4 bg-white border-b border-stone-200 space-y-3">
      <div className="flex items-center gap-2">
        <div className="h-5 w-24 bg-amber-100/70 rounded-full" />
        <div className="h-4 w-20 bg-stone-200 rounded-md" />
      </div>
      <div className="h-6 w-3/4 bg-stone-200 rounded-lg" />
      <div className="h-4 w-1/2 bg-stone-150 rounded-md" />
      <div className="h-8 w-40 bg-amber-100/60 rounded-xl mt-2" />
    </div>

    {/* Features Box Placeholder */}
    <div className="m-4 p-3.5 bg-white rounded-2xl border border-stone-200 space-y-2.5">
      <div className="h-4 w-1/3 bg-stone-200 rounded" />
      <div className="h-12 w-full bg-stone-100 rounded-xl" />
      <div className="h-12 w-full bg-stone-100 rounded-xl" />
    </div>

    {/* Floating Footer Placeholder */}
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 border-t border-stone-200 p-3 shadow-xl max-w-lg mx-auto flex gap-2">
      <div className="h-10 w-12 bg-stone-200 rounded-xl" />
      <div className="h-10 flex-1 bg-stone-200 rounded-xl" />
      <div className="h-10 flex-1 bg-amber-200/80 rounded-xl" />
    </div>
  </div>
);

export const ProductDetailScreen: React.FC = () => {
  const { 
    products, 
    selectedProductId, 
    addToCartWithVariation, 
    setCurrentView, 
    cartTotals,
    showToast,
    wishlistProductIds,
    toggleWishlist,
    setIsChatOpen,
    isProductsLoading,
    getProductShareUrl
  } = useApp();

  const [directFetchedProduct, setDirectFetchedProduct] = useState<Product | null>(null);
  const [isFetchingDirect, setIsFetchingDirect] = useState(false);

  // 1. Synchronous Instant Product Resolution (0ms delay on mobile)
  const matchedProduct = useMemo(() => {
    if (!selectedProductId) {
      return products[0] || directFetchedProduct || null;
    }

    const cleanId = String(selectedProductId).trim();

    // Priority 1: Current in-memory products array
    const inMemory = products.find(p => p.id === cleanId || String(p.id).trim() === cleanId);
    if (inMemory) return inMemory;

    // Priority 2: Direct fetched product from Firestore
    if (directFetchedProduct && (directFetchedProduct.id === cleanId || String(directFetchedProduct.id).trim() === cleanId)) {
      return directFetchedProduct;
    }

    // Priority 3: Offline cached products from mobile localStorage
    try {
      const cached = localStorage.getItem('allkurma_products');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) {
          const inCache = parsed.find((p: Product) => p.id === cleanId || String(p.id).trim() === cleanId);
          if (inCache) return inCache;
        }
      }
    } catch {}

    return null;
  }, [products, selectedProductId, directFetchedProduct]);

  // 2. Direct fetch with safety timeout for newly-shared external links
  useEffect(() => {
    if (!selectedProductId) {
      setDirectFetchedProduct(null);
      setIsFetchingDirect(false);
      return;
    }

    const cleanId = String(selectedProductId).trim();
    // If already resolved from memory or cache, no need to show loading
    if (products.some(p => String(p.id).trim() === cleanId)) {
      setIsFetchingDirect(false);
      return;
    }

    let isMounted = true;
    setIsFetchingDirect(true);

    // Safety timeout: stop spinning after 4.5 seconds to prevent hanging on dead mobile signals
    const timer = setTimeout(() => {
      if (isMounted) setIsFetchingDirect(false);
    }, 4500);

    getDoc(doc(db, 'products', cleanId))
      .then((snap) => {
        if (!isMounted) return;
        clearTimeout(timer);
        setIsFetchingDirect(false);
        if (snap.exists()) {
          setDirectFetchedProduct({ id: snap.id, ...(snap.data() as Omit<Product, 'id'>) });
        }
      })
      .catch((err) => {
        console.warn('Direct product fetch fallback:', err);
        if (isMounted) {
          clearTimeout(timer);
          setIsFetchingDirect(false);
        }
      });

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [selectedProductId, products]);

  // 3. Mobile Scroll Position Reset: Instantly reset scroll to top on product change
  useEffect(() => {
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    } catch {
      window.scrollTo(0, 0);
    }
  }, [selectedProductId, matchedProduct?.id]);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariation, setSelectedVariation] = useState<ProductVariation | undefined>(
    matchedProduct?.variations?.[1] || matchedProduct?.variations?.[0]
  );
  const [buyQty, setBuyQty] = useState(1);
  const [isQuotationModalOpen, setIsQuotationModalOpen] = useState(false);
  const [quotationNote, setQuotationNote] = useState('');
  const [quotationCompany, setQuotationCompany] = useState('');
  const [quotationQty, setQuotationQty] = useState(50);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (matchedProduct) {
      setSelectedVariation(matchedProduct.variations?.[1] || matchedProduct.variations?.[0]);
      setSelectedImageIndex(0);
      setBuyQty(1);
    }
  }, [matchedProduct?.id]);

  // Show Skeleton placeholder if waiting for deep-link / direct Firestore document
  if (selectedProductId && !matchedProduct && (isProductsLoading || isFetchingDirect)) {
    return (
      <ProductDetailSkeleton 
        onBack={() => setCurrentView('catalog')} 
        productId={selectedProductId} 
      />
    );
  }

  // Not Found State with dual recovery buttons
  if (!matchedProduct) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center font-['Plus_Jakarta_Sans',sans-serif]">
        <div className="w-16 h-16 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-stone-400">
          <Box className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-stone-800">Produk Tidak Ditemukan</h2>
        <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto leading-relaxed">
          {selectedProductId 
            ? `Produk dengan ID "${selectedProductId}" belum tersedia di katalog atau telah dinonaktifkan.` 
            : 'Produk belum tersedia di etalase toko saat ini.'}
        </p>
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2.5">
          <button
            type="button"
            onClick={() => setCurrentView('catalog')}
            className="w-full sm:w-auto px-5 py-2.5 bg-[#009A44] hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer inline-flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Lihat Katalog Produk</span>
          </button>
          <button
            type="button"
            onClick={() => setCurrentView('home')}
            className="w-full sm:w-auto px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl transition-colors cursor-pointer inline-flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </button>
        </div>
      </div>
    );
  }

  const product = matchedProduct;

  // Safe images list
  const productImages = Array.isArray(product.images) && product.images.length > 0
    ? product.images.filter(Boolean)
    : [DEFAULT_IMAGE];

  const currentMainImage = productImages[selectedImageIndex] || productImages[0] || DEFAULT_IMAGE;
  const directProductUrl = getProductShareUrl(product.id);

  const handleShareProduct = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${product.name} - SRA AllKurma`,
          text: `Beli ${product.name} kualitas grade premium di SRA AllKurma:`,
          url: directProductUrl
        });
        showToast('Link produk berhasil dibagikan!', 'success');
        return;
      } catch (err: any) {
        if (err?.name === 'AbortError') return;
      }
    }

    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(directProductUrl);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
        showToast('Link unik produk berhasil disalin!', 'success');
      } else {
        showToast(`Link produk: ${directProductUrl}`, 'info');
      }
    } catch {
      showToast('Gagal menyalin link secara otomatis.', 'error');
    }
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `Assalamu'alaikum! Cek produk pilihan ${product.name} di SRA AllKurma Official Store: ${directProductUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const isFavorite = wishlistProductIds.includes(product.id);

  // Dynamic price calculation
  const basePrice = Number(
    selectedVariation
      ? (selectedVariation.discountPrice || selectedVariation.regularPrice)
      : (product.discountPrice || product.regularPrice)
  ) || 0;

  const regularPrice = Number(selectedVariation?.regularPrice || product.regularPrice) || 0;

  const currentUnitPrice = () => {
    if (Array.isArray(product.wholesalePrices) && product.wholesalePrices.length > 0) {
      const match = product.wholesalePrices.find(
        rule => buyQty >= rule.minQty && (!rule.maxQty || buyQty <= rule.maxQty)
      );
      if (match && Number(match.pricePerUnit)) return Number(match.pricePerUnit);
    }
    return basePrice;
  };

  const handleBuyNow = () => {
    addToCartWithVariation(product, selectedVariation, buyQty);
    setCurrentView('cart');
  };

  const handleAddToCart = () => {
    addToCartWithVariation(product, selectedVariation, buyQty);
  };

  const handleRequestQuotationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(`Permintaan quotation untuk ${quotationQty} pcs ${product.name} telah dikirim ke Account Manager B2B!`, 'success');
    setIsQuotationModalOpen(false);
    setQuotationNote('');
  };

  return (
    <div className="pb-36 max-w-lg mx-auto bg-stone-50 min-h-screen touch-manipulation font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200 px-4 py-3 flex items-center justify-between shadow-xs">
        <button
          onClick={() => setCurrentView('catalog')}
          className="p-1.5 rounded-lg text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          aria-label="Kembali ke Katalog"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <h2 className="text-sm font-bold text-stone-900 font-['Playfair_Display',serif]">
          Detail Produk
        </h2>

        <div className="flex items-center gap-1.5">
          <button 
            onClick={() => toggleWishlist(product.id)}
            className="p-1.5 rounded-lg text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            title="Favorit"
            aria-label="Favoritkan Produk"
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-stone-700'}`} />
          </button>

          <button 
            onClick={handleShareProduct}
            className="p-1.5 rounded-lg text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            title="Bagikan Link Produk"
            aria-label="Bagikan Produk"
          >
            <Share2 className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => setCurrentView('cart')}
            className="relative p-1.5 rounded-lg text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            aria-label="Buka Keranjang"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartTotals.totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                {cartTotals.totalItems}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Product Image Carousel with Dots */}
      <div className="relative bg-white border-b border-stone-200">
        <div className="aspect-square w-full overflow-hidden flex items-center justify-center bg-stone-100">
          <img
            src={currentMainImage}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="eager"
          />
        </div>

        {/* Mall / Shopee Badge */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          <span className="px-2.5 py-1 rounded-md text-[10px] font-black bg-red-600 text-white shadow-md">
            MALL
          </span>
          <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-amber-500 text-black shadow-md">
            ORIGINAL 100%
          </span>
        </div>

        {/* Dots */}
        {productImages.length > 1 && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
            {productImages.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setSelectedImageIndex(i)}
                aria-label={`Lihat foto ke-${i + 1}`}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  selectedImageIndex === i ? 'w-5 bg-amber-700' : 'w-2 bg-stone-300'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Product Main Details */}
      <div className="p-4 bg-white border-b border-stone-200 space-y-3">
        
        {/* Badges & Rating */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
              {product.badge || 'PREMIUM GRADE'}
            </span>
            <div className="flex items-center gap-1 text-xs text-stone-600">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span className="font-bold text-stone-900">{Number(product.rating || 5).toFixed(1)}</span>
              <span className="text-stone-400">({Number(product.reviewCount || 0)} Ulasan)</span>
            </div>
          </div>

          <div className="text-[11px] text-stone-500">
            Terjual {(Number(product.soldCount) || 0).toLocaleString('id-ID')}+ • {product.origin || 'Timur Tengah'}
          </div>
        </div>

        {/* Title */}
        <h1 className="text-lg font-bold text-stone-900 font-['Playfair_Display',serif] leading-tight">
          {product.name}
        </h1>

        {/* Pricing */}
        <div className="flex items-baseline gap-2 pt-1 flex-wrap">
          <span className="text-2xl font-black text-amber-950 font-mono">
            Rp {basePrice.toLocaleString('id-ID')}
          </span>
          {regularPrice > basePrice && (
            <span className="text-xs text-stone-400 line-through font-mono">
              Rp {regularPrice.toLocaleString('id-ID')}
            </span>
          )}
          {regularPrice > basePrice && (
            <span className="px-1.5 py-0.5 text-[10px] font-bold bg-red-100 text-red-700 rounded-sm">
              Hemat Rp {(regularPrice - basePrice).toLocaleString('id-ID')}
            </span>
          )}
        </div>

        {/* 1. Shopee Variations Picker (Kemasan / Ukuran) */}
        {Array.isArray(product.variations) && product.variations.length > 0 && (
          <div className="pt-2 border-t border-stone-100 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-stone-900">Pilihan Variasi / Kemasan:</span>
              {selectedVariation && (
                <span className="text-stone-500 text-[11px]">
                  Stok: <b className="text-stone-800">{selectedVariation.stock ?? 0} pcs</b>
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {product.variations.map((v) => {
                const isSelected = selectedVariation?.id === v.id;
                const vPrice = Number(v.discountPrice || v.regularPrice) || 0;

                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelectedVariation(v)}
                    className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'border-amber-700 bg-amber-50/90 text-amber-950 shadow-xs ring-1 ring-amber-700'
                        : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs">{v.name}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-amber-800 stroke-[3]" />}
                    </div>
                    <span className="text-[11px] font-semibold text-amber-900 mt-1 font-mono">
                      Rp {vPrice.toLocaleString('id-ID')}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 2. Shopee Trust & Shipping Guarantees */}
        <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-2 text-xs">
          <div className="flex items-center gap-2 text-stone-700">
            <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="font-bold text-stone-900">Gratis Ongkir XTRA</span>
              <p className="text-[11px] text-stone-500">Potongan ongkir s/d Rp 20.000 ke seluruh Indonesia</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-stone-700 pt-1.5 border-t border-stone-200/60">
            <Coins className="w-4 h-4 text-amber-600 shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="font-bold text-stone-900">Cashback & Koin AllKurma</span>
              <p className="text-[11px] text-stone-500">Dapatkan hingga 15.000 Koin AllKurma untuk pesanan ini</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-stone-700 pt-1.5 border-t border-stone-200/60">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="font-bold text-stone-900">Garansi Resmi AllKurma Segar & Asli</span>
              <p className="text-[11px] text-stone-500">Jaminan uang kembali 100% jika produk tidak original</p>
            </div>
          </div>
        </div>

        {/* 3. Harga Grosir (B2B) Tier Table Card */}
        {Array.isArray(product.wholesalePrices) && product.wholesalePrices.length > 0 && (
          <div className="p-3.5 bg-amber-50/70 rounded-xl border border-amber-200/80">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-1.5 font-bold text-xs text-amber-950">
                <Building2 className="w-4 h-4 text-amber-700" />
                <span>Harga Grosir & Mitra B2B</span>
              </div>
              <span className="text-[10px] text-amber-800 font-medium bg-amber-200/60 px-2 py-0.5 rounded-full">
                Tier Volume Bertingkat
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              {product.wholesalePrices.map((tier, idx) => {
                const isApplicable = buyQty >= tier.minQty && (!tier.maxQty || buyQty <= tier.maxQty);
                return (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-2 rounded-lg transition-colors ${
                      isApplicable ? 'bg-amber-600 text-white font-bold shadow-xs' : 'bg-white/80 text-stone-700'
                    }`}
                  >
                    <span>
                      {tier.minQty} - {tier.maxQty ? `${tier.maxQty} pcs` : '≥ pcs'}
                    </span>
                    <span className="font-mono">
                      Rp {(Number(tier.pricePerUnit) || 0).toLocaleString('id-ID')} / pcs
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-2.5 text-[11px] text-amber-900 flex items-center gap-1 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>
                {buyQty < 11 
                  ? 'Beli minimal 11 pcs untuk mendapatkan harga grosir lebih hemat.' 
                  : 'Anda memenuhi syarat harga tier grosir volume!'}
              </span>
            </div>
          </div>
        )}

      </div>

      {/* 4. Shopee/Tokopedia/TikTok Store Profile Card with Follow button */}
      <StoreFollowHeader variant="card" className="mt-3" />

      {/* 5. Product Description & Specifications */}
      <div className="mt-3 p-4 bg-white border-y border-stone-200 space-y-4 text-xs">
        <div>
          <h3 className="font-bold text-sm text-stone-900 mb-2">Deskripsi Produk</h3>
          <p className="text-stone-600 leading-relaxed whitespace-pre-line">
            {product.description || 'Kurma berkualitas grade premium yang diimpor langsung dari kebun terbaik.'}
          </p>
        </div>

        <div className="border-t border-stone-100 pt-3 space-y-2.5">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-stone-900 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-amber-600" />
              <span>Spesifikasi Produk & Inventori</span>
            </h4>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 font-bold px-2 py-0.5 rounded-md border border-emerald-200">
              QC Lulus Grade A
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-stone-600">
            <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200/70">
              <span className="text-[10px] text-stone-400 block font-semibold flex items-center gap-1">
                <Barcode className="w-3 h-3 text-stone-500" />
                <span>SKU & Barcode</span>
              </span>
              <span className="font-bold text-stone-900 font-mono text-[11px] block mt-0.5">
                {selectedVariation?.sku || product.sku || '-'}
              </span>
              <span className="text-[10px] text-stone-500 font-mono">
                EAN: {selectedVariation?.barcode || product.barcode || '-'}
              </span>
            </div>

            <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200/70">
              <span className="text-[10px] text-stone-400 block font-semibold flex items-center gap-1">
                <Box className="w-3 h-3 text-stone-500" />
                <span>Kemasan & Netto</span>
              </span>
              <span className="font-bold text-stone-900 text-[11px] block mt-0.5">
                {selectedVariation?.weightGram || product.weightGram || 500} gram
              </span>
              <span className="text-[10px] text-stone-500">
                {selectedVariation?.packagingType || product.packagingType || 'Food-Grade Sealed'}
              </span>
            </div>

            <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200/70">
              <span className="text-[10px] text-stone-400 block font-semibold flex items-center gap-1">
                <Globe className="w-3 h-3 text-stone-500" />
                <span>Negara & Asal Produk</span>
              </span>
              <span className="font-bold text-stone-900 text-[11px] block mt-0.5">
                {product.origin || 'Timur Tengah'}
              </span>
              <span className="text-[10px] text-stone-500">
                Impor Resmi Bergaransi
              </span>
            </div>

            <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200/70">
              <span className="text-[10px] text-stone-400 block font-semibold flex items-center gap-1">
                <Shield className="w-3 h-3 text-stone-500" />
                <span>Sertifikasi & Garansi</span>
              </span>
              <span className="font-bold text-emerald-800 text-[11px] block mt-0.5">
                {product.certification || 'Halal MUI & Kementan RI'}
              </span>
              <span className="text-[10px] text-stone-500">
                100% Produk Original
              </span>
            </div>

            <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200/70 col-span-2 sm:col-span-1">
              <span className="text-[10px] text-stone-400 block font-semibold">
                Penyimpanan & Expired
              </span>
              <span className="font-bold text-stone-800 text-[11px] block mt-0.5">
                {product.storageCondition || 'Suhu Sejuk (Simpan Kulkas)'}
              </span>
              <span className="text-[10px] text-stone-500">
                Masa Simpan: {product.shelfLife || '18 Bulan'} (Exp: {product.expiryDate || '2027'})
              </span>
            </div>

            <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200/70 col-span-2 sm:col-span-1">
              <span className="text-[10px] text-stone-400 block font-semibold">
                Lokasi Rak & Stok Gudang
              </span>
              <div className="flex items-center justify-between mt-0.5">
                <span className="font-bold text-emerald-700 text-xs">
                  {selectedVariation?.stock ?? product.stock ?? 0} unit ready
                </span>
                <span className="text-[10px] font-mono text-stone-500 bg-stone-200/60 px-1.5 py-0.5 rounded">
                  Rak: {selectedVariation?.warehouseRack || product.warehouseRack || product.warehouseLocation || 'G-01'}
                </span>
              </div>
              <span className="text-[10px] text-stone-500">
                Gudang Hub: {product.warehouseLocation || 'Gudang Utama Jakarta'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 5.1 Deep Link & Bagikan Produk Card */}
      <div className="mt-3 p-4 bg-white border-y border-stone-200">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Link2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-xs text-stone-900">Link Unik Produk</h3>
              <p className="text-[10px] text-stone-500">Tautan langsung tertuju ke produk ini saat dibagikan</p>
            </div>
          </div>
          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/80">
            Direct Link
          </span>
        </div>

        {/* Link Display Box with Copy Button */}
        <div className="flex items-center gap-2 p-2 bg-stone-50 border border-stone-200 rounded-xl mb-3">
          <div className="flex-1 font-mono text-[11px] text-stone-700 truncate select-all px-1">
            {directProductUrl}
          </div>
          <button
            type="button"
            onClick={handleShareProduct}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
              copiedLink 
                ? 'bg-emerald-600 text-white shadow-xs' 
                : 'bg-stone-800 hover:bg-stone-900 text-white'
            }`}
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Salin Link</span>
              </>
            )}
          </button>
        </div>

        {/* Share buttons: WhatsApp & Web Share */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-colors shadow-xs cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Bagikan via WhatsApp</span>
          </button>
          <button
            type="button"
            onClick={handleShareProduct}
            className="flex items-center justify-center gap-1.5 py-2 px-3 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-amber-700" />
            <span>Bagikan Lainnya</span>
          </button>
        </div>
      </div>

      {/* 6. Embedded Shopee Reviews Component */}
      <div className="mt-3">
        <ShopeeReviewsSection product={product} />
      </div>

      {/* 7. Bottom Floating Actions Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 p-3 shadow-xl">
        <div className="max-w-lg mx-auto space-y-2.5">
          
          {/* Quantity selector + Unit Price */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="text-stone-500 font-medium">Jumlah:</span>
              <div className="flex items-center border border-stone-300 rounded-lg overflow-hidden bg-white shadow-xs">
                <button
                  type="button"
                  onClick={() => setBuyQty(prev => Math.max(1, prev - 1))}
                  className="p-1 px-2.5 text-stone-600 hover:bg-stone-100 active:scale-95 cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <input
                  type="number"
                  min="1"
                  max={selectedVariation?.stock || product.stock || 999}
                  value={buyQty}
                  onChange={(e) => setBuyQty(Math.max(1, Number(e.target.value)))}
                  className="w-12 text-center text-xs font-bold text-stone-900 border-x border-stone-200 py-1"
                />
                <button
                  type="button"
                  onClick={() => setBuyQty(prev => prev + 1)}
                  className="p-1 px-2.5 text-stone-600 hover:bg-stone-100 active:scale-95 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-stone-400 block">Total Estimasi</span>
              <span className="font-bold text-amber-900 text-sm font-mono">
                Rp {(Number(currentUnitPrice() * buyQty) || 0).toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          {/* Action buttons row */}
          <div className="grid grid-cols-12 gap-2">
            <button
              type="button"
              onClick={() => setIsChatOpen(true)}
              className="col-span-2 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl flex items-center justify-center transition-colors active:scale-95 shadow-xs cursor-pointer"
              title="Chat Penjual"
              aria-label="Chat Penjual"
            >
              <MessageSquare className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleAddToCart}
              className="col-span-5 py-2.5 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 font-bold rounded-xl text-xs flex items-center justify-center gap-1 active:scale-95 transition-all shadow-xs cursor-pointer"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>+ Keranjang</span>
            </button>

            <button
              type="button"
              onClick={handleBuyNow}
              className="col-span-5 py-2.5 bg-amber-800 hover:bg-amber-900 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1 shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <span>Beli Langsung</span>
            </button>
          </div>

          {/* B2B Quotation Button */}
          <button
            type="button"
            onClick={() => setIsQuotationModalOpen(true)}
            className="w-full py-1.5 bg-stone-900 hover:bg-stone-800 text-amber-300 font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Request Quotation Grosir (B2B)</span>
          </button>

        </div>
      </div>

      {/* B2B Quotation Modal */}
      {isQuotationModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-bold text-stone-900 text-sm">Request Penawaran B2B</h3>
                <p className="text-[11px] text-stone-500">{product.name}</p>
              </div>
              <button 
                type="button"
                onClick={() => setIsQuotationModalOpen(false)}
                className="text-stone-400 hover:text-stone-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRequestQuotationSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Nama Perusahaan / Bisnis</label>
                <input
                  type="text"
                  required
                  placeholder="PT Berkah Mandiri / Toko Kurma Utama"
                  value={quotationCompany}
                  onChange={(e) => setQuotationCompany(e.target.value)}
                  className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Jumlah Rencana Pembelian (pcs/karton)</label>
                <input
                  type="number"
                  min="20"
                  required
                  value={quotationQty}
                  onChange={(e) => setQuotationQty(Number(e.target.value))}
                  className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg font-mono font-bold"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Catatan Kebutuhan / Spesifikasi Khusus</label>
                <textarea
                  rows={3}
                  placeholder="Kebutuhan private label, jadwal pengiriman bertahap, termin pembayaran..."
                  value={quotationNote}
                  onChange={(e) => setQuotationNote(e.target.value)}
                  className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsQuotationModalOpen(false)}
                  className="flex-1 py-2 border border-stone-200 rounded-xl text-stone-600 font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-amber-800 text-white rounded-xl font-bold flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim RFQ</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
