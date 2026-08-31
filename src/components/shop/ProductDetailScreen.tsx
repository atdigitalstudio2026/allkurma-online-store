import React, { useState } from 'react';
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
  ChevronRight, 
  Send,
  Heart,
  Store,
  BadgePercent,
  Coins,
  DollarSign,
  PackageCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ProductVariation } from '../../types';
import { ShopeeReviewsSection } from './ShopeeReviewsSection';
import { StoreFollowHeader } from './StoreFollowHeader';

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
    setIsChatOpen
  } = useApp();

  const product = products.find(p => p.id === selectedProductId) || products[0];
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariation, setSelectedVariation] = useState<ProductVariation | undefined>(
    product?.variations?.[1] || product?.variations?.[0]
  );
  const [buyQty, setBuyQty] = useState(1);
  const [isQuotationModalOpen, setIsQuotationModalOpen] = useState(false);
  const [quotationNote, setQuotationNote] = useState('');
  const [quotationCompany, setQuotationCompany] = useState('');
  const [quotationQty, setQuotationQty] = useState(50);

  if (!product) return null;

  const isFavorite = wishlistProductIds.includes(product.id);

  // Dynamic price based on selected variation & wholesale qty
  const basePrice = selectedVariation
    ? (selectedVariation.discountPrice || selectedVariation.regularPrice)
    : (product.discountPrice || product.regularPrice);

  const regularPrice = selectedVariation?.regularPrice || product.regularPrice;

  const currentUnitPrice = () => {
    if (product.wholesalePrices && product.wholesalePrices.length > 0) {
      const match = product.wholesalePrices.find(
        rule => buyQty >= rule.minQty && (!rule.maxQty || buyQty <= rule.maxQty)
      );
      if (match) return match.pricePerUnit;
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
    <div className="pb-36 max-w-lg mx-auto bg-stone-50 min-h-screen">
      
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200 px-4 py-3 flex items-center justify-between shadow-xs">
        <button
          onClick={() => setCurrentView('catalog')}
          className="p-1.5 rounded-lg text-stone-700 hover:bg-stone-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <h2 className="text-sm font-bold text-stone-900 font-['Playfair_Display',serif]">
          Detail Produk
        </h2>

        <div className="flex items-center gap-1.5">
          <button 
            onClick={() => toggleWishlist(product.id)}
            className="p-1.5 rounded-lg text-stone-700 hover:bg-stone-100 transition-colors"
            title="Favorit"
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-stone-700'}`} />
          </button>

          <button 
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href);
                showToast('Link produk berhasil disalin!');
              }
            }}
            className="p-1.5 rounded-lg text-stone-700 hover:bg-stone-100 transition-colors"
            title="Bagikan"
          >
            <Share2 className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => setCurrentView('cart')}
            className="relative p-1.5 rounded-lg text-stone-700 hover:bg-stone-100 transition-colors"
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
        <div className="aspect-square w-full max-h-[380px] overflow-hidden flex items-center justify-center bg-stone-100">
          <img
            src={product.images[selectedImageIndex] || product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover"
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
        {product.images.length > 1 && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
            {product.images.map((_, i) => (
              <button
                key={i}
                onClick={() => setSelectedImageIndex(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  selectedImageIndex === i ? 'w-5 bg-amber-700' : 'bg-stone-300'
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
              <span className="font-bold text-stone-900">{product.rating}</span>
              <span className="text-stone-400">({product.reviewCount} Ulasan)</span>
            </div>
          </div>

          <div className="text-[11px] text-stone-500">
            Terjual {product.soldCount.toLocaleString('id-ID')}+ • {product.origin}
          </div>
        </div>

        {/* Title */}
        <h1 className="text-lg font-bold text-stone-900 font-['Playfair_Display',serif] leading-tight">
          {product.name}
        </h1>

        {/* Pricing */}
        <div className="flex items-baseline gap-2 pt-1">
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
        {product.variations && product.variations.length > 0 && (
          <div className="pt-2 border-t border-stone-100 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-stone-900">Pilihan Variasi / Kemasan:</span>
              {selectedVariation && (
                <span className="text-stone-500 text-[11px]">
                  Stok: <b className="text-stone-800">{selectedVariation.stock} pcs</b>
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {product.variations.map((v) => {
                const isSelected = selectedVariation?.id === v.id;
                const vPrice = v.discountPrice || v.regularPrice;

                return (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariation(v)}
                    className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
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
        {product.wholesalePrices && product.wholesalePrices.length > 0 && (
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
                      Rp {tier.pricePerUnit.toLocaleString('id-ID')} / pcs
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-2.5 text-[11px] text-amber-900 flex items-center gap-1 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>
                {buyQty < 11 
                  ? `Tambah ${11 - buyQty} pcs lagi untuk tier grosir selanjutnya`
                  : `Anda mendapatkan tier harga grosir terbaik!`}
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
            {product.description}
          </p>
        </div>

        <div className="border-t border-stone-100 pt-3 space-y-2">
          <h4 className="font-bold text-stone-900">Spesifikasi & Detail Panen</h4>
          <div className="grid grid-cols-2 gap-2 text-stone-600">
            <div className="bg-stone-50 p-2 rounded-lg">
              <span className="text-[10px] text-stone-400 block">SKU / Kode Produk</span>
              <span className="font-bold text-stone-800 font-mono">{selectedVariation?.sku || product.sku}</span>
            </div>
            <div className="bg-stone-50 p-2 rounded-lg">
              <span className="text-[10px] text-stone-400 block">Berat Kemasan</span>
              <span className="font-bold text-stone-800">{selectedVariation?.weightGram || product.weightGram} gram</span>
            </div>
            <div className="bg-stone-50 p-2 rounded-lg">
              <span className="text-[10px] text-stone-400 block">Asal Negara</span>
              <span className="font-bold text-stone-800">{product.origin}</span>
            </div>
            <div className="bg-stone-50 p-2 rounded-lg">
              <span className="text-[10px] text-stone-400 block">Stok Gudang</span>
              <span className="font-bold text-emerald-700">{selectedVariation?.stock || product.stock} pcs</span>
            </div>
          </div>
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
                  onClick={() => setBuyQty(prev => Math.max(1, prev - 1))}
                  className="p-1 px-2.5 text-stone-600 hover:bg-stone-100 active:scale-95"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <input
                  type="number"
                  min="1"
                  max={selectedVariation?.stock || product.stock}
                  value={buyQty}
                  onChange={(e) => setBuyQty(Math.max(1, Number(e.target.value)))}
                  className="w-12 text-center text-xs font-bold text-stone-900 border-x border-stone-200 py-1"
                />
                <button
                  onClick={() => setBuyQty(prev => prev + 1)}
                  className="p-1 px-2.5 text-stone-600 hover:bg-stone-100 active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-stone-400 block">Total Estimasi</span>
              <span className="font-bold text-amber-900 text-sm font-mono">
                Rp {(currentUnitPrice() * buyQty).toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          {/* Action buttons row */}
          <div className="grid grid-cols-12 gap-2">
            <button
              onClick={() => setIsChatOpen(true)}
              className="col-span-2 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl flex items-center justify-center transition-colors active:scale-95 shadow-xs"
              title="Chat Penjual"
            >
              <MessageSquare className="w-4 h-4" />
            </button>

            <button
              onClick={handleAddToCart}
              className="col-span-5 py-2.5 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 font-bold rounded-xl text-xs flex items-center justify-center gap-1 active:scale-95 transition-all shadow-xs"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>+ Keranjang</span>
            </button>

            <button
              onClick={handleBuyNow}
              className="col-span-5 py-2.5 bg-amber-800 hover:bg-amber-900 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1 shadow-md active:scale-95 transition-all"
            >
              <span>Beli Langsung</span>
            </button>
          </div>

          {/* B2B Quotation Button */}
          <button
            onClick={() => setIsQuotationModalOpen(true)}
            className="w-full py-1.5 bg-stone-900 hover:bg-stone-800 text-amber-300 font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors"
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
                onClick={() => setIsQuotationModalOpen(false)}
                className="text-stone-400 hover:text-stone-600"
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
                  className="flex-1 py-2 border border-stone-200 rounded-xl text-stone-600 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-amber-800 text-white rounded-xl font-bold flex items-center justify-center gap-1"
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

