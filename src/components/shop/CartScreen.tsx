import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Trash2, 
  Plus, 
  Minus, 
  Tag, 
  Building2, 
  Sparkles, 
  ArrowRight, 
  Check, 
  ShoppingBag,
  CreditCard,
  Truck,
  ShieldCheck,
  Coins,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CheckoutModal } from './CheckoutModal';

export const CartScreen: React.FC = () => {
  const { 
    cart, 
    updateCartQuantity, 
    removeFromCart, 
    cartTotals, 
    appliedVoucher, 
    applyVoucher, 
    removeVoucher, 
    setCurrentView,
    shopeeCoins,
    isUsingCoins,
    setIsUsingCoins
  } = useApp();

  const [voucherInput, setVoucherInput] = useState('');
  const [isVoucherSectionOpen, setIsVoucherSectionOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  const handleApplyVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!voucherInput.trim()) return;
    if (applyVoucher(voucherInput)) {
      setVoucherInput('');
    }
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

        <h1 className="text-base font-bold text-stone-900 font-['Playfair_Display',serif]">
          Keranjang Belanja
        </h1>

        <button
          onClick={() => setCurrentView('wishlist')}
          className="text-xs font-bold text-amber-800 hover:text-amber-950"
        >
          Favorit
        </button>
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-20 px-4">
          <div className="w-20 h-20 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto mb-4 text-amber-800">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h2 className="text-base font-bold text-stone-900 font-['Playfair_Display',serif]">
            Keranjang Anda Kosong
          </h2>
          <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
            Jelajahi koleksi kurma berkualitas impor dan produk organik pilihan kami.
          </p>
          <button
            onClick={() => setCurrentView('catalog')}
            className="mt-6 px-6 py-2.5 bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
          >
            Mulai Belanja Sekarang
          </button>
        </div>
      ) : (
        <>
          {/* 1. Wholesale Tier Announcement Banner */}
          <div className="p-4">
            <div className="p-3 bg-amber-100/70 border border-amber-300/80 rounded-xl flex items-center gap-2.5 text-xs text-amber-950">
              <Sparkles className="w-4 h-4 text-amber-700 shrink-0" />
              <span className="font-medium">
                {cartTotals.wholesaleDiscount > 0 
                  ? `Selamat! Diskon Grosir hemat Rp ${cartTotals.wholesaleDiscount.toLocaleString('id-ID')} otomatis diterapkan.`
                  : 'Tambah produk atau kuantitas untuk mendapatkan harga grosir spesial!'}
              </span>
            </div>
          </div>

          {/* 2. Items List */}
          <div className="px-4 space-y-3">
            {cart.map(({ product, selectedVariation, quantity }) => {
              const basePrice = selectedVariation
                ? (selectedVariation.discountPrice || selectedVariation.regularPrice)
                : (product.discountPrice || product.regularPrice);
              const lineTotal = basePrice * quantity;

              return (
                <div
                  key={`${product.id}-${selectedVariation?.id || 'def'}`}
                  className="bg-white rounded-2xl border border-stone-200 p-3 shadow-xs flex items-center gap-3"
                >
                  {/* Image */}
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-16 h-16 rounded-xl object-cover border border-stone-100 shrink-0 bg-stone-100"
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h3 className="text-xs font-bold text-stone-900 truncate">
                        {product.name}
                      </h3>
                      <button
                        onClick={() => removeFromCart(product.id, selectedVariation?.id)}
                        className="text-stone-400 hover:text-red-600 p-1 transition-colors"
                        title="Hapus"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Variation Pill */}
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-[10px] text-amber-950 font-bold bg-amber-100/80 px-2 py-0.5 rounded-md border border-amber-200">
                        {selectedVariation ? selectedVariation.name : `${product.weightGram}g Pack`}
                      </span>
                      {product.wholesalePrices && product.wholesalePrices.length > 0 && (
                        <span className="text-[9px] font-bold bg-stone-100 text-stone-700 px-1.5 py-0.5 rounded-md">
                          Grosir Ready
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-stone-100">
                      <span className="text-xs font-black text-amber-950 font-mono">
                        Rp {basePrice.toLocaleString('id-ID')}
                      </span>

                      {/* Quantity Controller */}
                      <div className="flex items-center border border-stone-300 rounded-lg overflow-hidden bg-stone-50">
                        <button
                          onClick={() => updateCartQuantity(product.id, quantity - 1, selectedVariation?.id)}
                          className="p-1 px-2 text-stone-600 hover:bg-stone-200 active:scale-95 transition-all"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-stone-900 min-w-[20px] text-center font-mono">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(product.id, quantity + 1, selectedVariation?.id)}
                          className="p-1 px-2 text-stone-600 hover:bg-stone-200 active:scale-95 transition-all"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 3. Shopee Coins Redemption Checkbox Toggle */}
          <div className="p-4 pt-3">
            <div className="bg-white rounded-2xl border border-stone-200 p-3.5 shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <Coins className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-bold text-stone-900">Tukarkan Koin Shopee</h4>
                    <span className="text-[9px] bg-amber-500 text-black px-1.5 py-0.2 rounded-xs font-black">
                      HEMAT
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500">
                    Saldo: <b className="text-amber-900">{shopeeCoins.toLocaleString('id-ID')} Koin</b> (Maks. potong 25%)
                  </p>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={isUsingCoins} 
                  onChange={(e) => setIsUsingCoins(e.target.checked)} 
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-stone-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
              </label>
            </div>
          </div>

          {/* 4. Voucher Accordion & Quick Claim */}
          <div className="px-4 pb-1">
            <div className="bg-white rounded-2xl border border-stone-200 p-3.5 shadow-xs">
              <button
                onClick={() => setIsVoucherSectionOpen(!isVoucherSectionOpen)}
                className="w-full flex items-center justify-between text-xs font-bold text-stone-800"
              >
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-red-600" />
                  <span>
                    {appliedVoucher ? `Voucher Aktif: ${appliedVoucher.code}` : 'Voucher Shopee & Toko'}
                  </span>
                </div>
                <span className="text-amber-800 text-xs font-semibold flex items-center gap-0.5">
                  {isVoucherSectionOpen ? 'Tutup' : 'Pilih Voucher >'}
                </span>
              </button>

              {isVoucherSectionOpen && (
                <div className="mt-3 pt-3 border-t border-stone-100 space-y-2.5 animate-in fade-in">
                  {appliedVoucher ? (
                    <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs">
                      <div>
                        <span className="font-bold text-emerald-900 block">{appliedVoucher.code}</span>
                        <span className="text-[10px] text-emerald-700">{appliedVoucher.description}</span>
                      </div>
                      <button
                        onClick={removeVoucher}
                        className="text-xs text-red-600 font-bold hover:underline"
                      >
                        Hapus
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyVoucher} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Contoh: ONGKIR0 / LIVE35K"
                        value={voucherInput}
                        onChange={(e) => setVoucherInput(e.target.value)}
                        className="flex-1 px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl uppercase tracking-wider font-mono font-bold"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
                      >
                        Pasang
                      </button>
                    </form>
                  )}

                  {/* Voucher Links */}
                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={() => setCurrentView('shopee-vouchers')}
                      className="text-[11px] text-amber-800 font-bold flex items-center gap-1 hover:underline"
                    >
                      <span>Lihat Semua Voucher Toko</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 5. Ringkasan Belanja */}
          <div className="px-4 mt-3">
            <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs space-y-2 text-xs">
              <h3 className="font-bold text-stone-900 text-xs tracking-tight border-b border-stone-100 pb-2">
                Rincian Pembayaran
              </h3>

              <div className="flex items-center justify-between text-stone-600">
                <span>Subtotal ({cartTotals.totalItems} Barang)</span>
                <span className="font-semibold text-stone-900 font-mono">
                  Rp {cartTotals.subtotal.toLocaleString('id-ID')}
                </span>
              </div>

              {cartTotals.wholesaleDiscount > 0 && (
                <div className="flex items-center justify-between text-emerald-700">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Diskon Grosir Volume</span>
                  </span>
                  <span className="font-bold font-mono">
                    -Rp {cartTotals.wholesaleDiscount.toLocaleString('id-ID')}
                  </span>
                </div>
              )}

              {cartTotals.voucherDiscount > 0 && (
                <div className="flex items-center justify-between text-emerald-700">
                  <span>Diskon Voucher ({appliedVoucher?.code})</span>
                  <span className="font-bold font-mono">
                    -Rp {cartTotals.voucherDiscount.toLocaleString('id-ID')}
                  </span>
                </div>
              )}

              {cartTotals.coinsDiscount > 0 && (
                <div className="flex items-center justify-between text-amber-800">
                  <span className="flex items-center gap-1">
                    <Coins className="w-3.5 h-3.5 text-amber-600" />
                    <span>Koin Shopee Digunakan</span>
                  </span>
                  <span className="font-bold font-mono">
                    -Rp {cartTotals.coinsDiscount.toLocaleString('id-ID')}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between text-stone-600">
                <span>Pengiriman</span>
                <span className="text-[11px] font-bold text-emerald-700">
                  {cartTotals.shippingCost === 0 ? 'GRATIS ONGKIR XTRA' : `Rp ${cartTotals.shippingCost.toLocaleString('id-ID')}`}
                </span>
              </div>

              <div className="border-t border-stone-200 pt-2.5 flex items-center justify-between font-bold text-sm text-stone-900">
                <span className="font-['Playfair_Display',serif]">Total Tagihan</span>
                <span className="text-base font-black text-amber-950 font-mono">
                  Rp {cartTotals.total.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </div>

          {/* 6. Fixed Checkout Button */}
          <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 p-3 shadow-xl">
            <div className="max-w-lg mx-auto flex items-center justify-between gap-3">
              <div className="text-left">
                <span className="text-[10px] text-stone-500 block">Total Pembayaran</span>
                <span className="text-base font-black text-amber-950 font-mono">
                  Rp {cartTotals.total.toLocaleString('id-ID')}
                </span>
              </div>

              <button
                onClick={() => setIsCheckoutModalOpen(true)}
                className="flex-1 py-3 bg-amber-800 hover:bg-amber-900 active:scale-95 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <span>Checkout ({cartTotals.totalItems})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}

      {/* Checkout Modal Flow */}
      {isCheckoutModalOpen && (
        <CheckoutModal onClose={() => setIsCheckoutModalOpen(false)} />
      )}

    </div>
  );
};
