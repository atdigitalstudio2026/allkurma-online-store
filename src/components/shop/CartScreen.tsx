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
  ChevronRight,
  AlertCircle
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
    useCoinsInCheckout,
    setUseCoinsInCheckout,
    showToast
  } = useApp();

  const [voucherInput, setVoucherInput] = useState('');
  const [isVoucherSectionOpen, setIsVoucherSectionOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  // Selection state for cart items (defaults to all selected)
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>(() => 
    cart.map(c => `${c.product.id}-${c.selectedVariation?.id || 'def'}`)
  );

  const toggleItemSelect = (idKey: string) => {
    setSelectedItemIds(prev =>
      prev.includes(idKey) ? prev.filter(id => id !== idKey) : [...prev, idKey]
    );
  };

  const isAllSelected = cart.length > 0 && selectedItemIds.length === cart.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedItemIds([]);
    } else {
      setSelectedItemIds(cart.map(c => `${c.product.id}-${c.selectedVariation?.id || 'def'}`));
    }
  };

  const handleApplyVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!voucherInput.trim()) return;
    if (applyVoucher(voucherInput)) {
      setVoucherInput('');
    }
  };

  // Filter selected items
  const selectedCartItems = cart.filter(c => 
    selectedItemIds.includes(`${c.product.id}-${c.selectedVariation?.id || 'def'}`)
  );

  const selectedCount = selectedCartItems.reduce((acc, it) => acc + it.quantity, 0);

  const selectedSubtotal = selectedCartItems.reduce((acc, it) => {
    const basePrice = it.selectedVariation
      ? (it.selectedVariation.discountPrice || it.selectedVariation.regularPrice)
      : (it.product.discountPrice || it.product.regularPrice);
    return acc + (basePrice * it.quantity);
  }, 0);

  const selectedWeightKg = (selectedCartItems.reduce((acc, it) => {
    const unitWeight = it.selectedVariation?.weightGram || it.product.weightGram || 500;
    return acc + (unitWeight * it.quantity);
  }, 0) / 1000).toFixed(2);

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
            Jelajahi koleksi kurma premium impor terlengkap dari Timur Tengah dan Madinah.
          </p>
          <button
            onClick={() => setCurrentView('catalog')}
            className="mt-6 px-6 py-2.5 bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold rounded-xl shadow-xs transition-all"
          >
            Mulai Belanja Sekarang
          </button>
        </div>
      ) : (
        <>
          {/* Wholesale and Free Shipping Banner */}
          <div className="p-4 space-y-2">
            <div className="p-3 bg-amber-100/80 border border-amber-300 rounded-xl flex items-center gap-2.5 text-xs text-amber-950 shadow-xs">
              <Sparkles className="w-4 h-4 text-amber-700 shrink-0" />
              <span className="font-medium">
                {cartTotals.wholesaleDiscount > 0 
                  ? `Diskon Grosir hemat Rp ${cartTotals.wholesaleDiscount.toLocaleString('id-ID')} aktif!`
                  : 'Gratis Ongkir hingga Rp 20.000 untuk transaksi di atas Rp 250.000!'}
              </span>
            </div>

            {/* Select All Bar */}
            <div className="bg-white rounded-xl border border-stone-200 px-3.5 py-2.5 flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 font-bold text-stone-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 text-amber-800 rounded-sm focus:ring-amber-800"
                />
                <span>Pilih Semua ({cart.length} Produk)</span>
              </label>

              <span className="text-stone-500 text-[11px]">
                Total Berat: <strong className="text-stone-900 font-mono">{selectedWeightKg} kg</strong>
              </span>
            </div>
          </div>

          {/* Items List */}
          <div className="px-4 space-y-3">
            {cart.map(({ product, selectedVariation, quantity }) => {
              const itemKey = `${product.id}-${selectedVariation?.id || 'def'}`;
              const isChecked = selectedItemIds.includes(itemKey);
              const maxStock = selectedVariation ? selectedVariation.stock : product.stock;
              const isOutOfStock = maxStock <= 0;

              const basePrice = selectedVariation
                ? (selectedVariation.discountPrice || selectedVariation.regularPrice)
                : (product.discountPrice || product.regularPrice);
              const lineTotal = basePrice * quantity;

              return (
                <div
                  key={itemKey}
                  className={`bg-white rounded-2xl border p-3 shadow-xs flex items-center gap-3 transition-all ${
                    isChecked ? 'border-amber-300' : 'border-stone-200 opacity-80'
                  }`}
                >
                  {/* Select checkbox */}
                  <input
                    type="checkbox"
                    checked={isChecked}
                    disabled={isOutOfStock}
                    onChange={() => toggleItemSelect(itemKey)}
                    className="w-4 h-4 text-amber-800 rounded-sm focus:ring-amber-800 shrink-0"
                  />

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

                    {/* Variation Pill & Weight */}
                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                      <span className="text-[10px] text-amber-950 font-bold bg-amber-100/80 px-2 py-0.5 rounded-md border border-amber-200">
                        {selectedVariation ? selectedVariation.name : `${product.weightGram}g Pack`}
                      </span>
                      <span className="text-[10px] text-stone-500 font-mono">
                        {selectedVariation?.weightGram || product.weightGram}g
                      </span>
                      {isOutOfStock && (
                        <span className="text-[9px] font-bold bg-red-100 text-red-700 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                          <AlertCircle className="w-2.5 h-2.5" />
                          Stok Habis
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
                          onClick={() => {
                            if (quantity >= maxStock) {
                              showToast(`Stok maksimal tersedia: ${maxStock} pcs`, 'error');
                              return;
                            }
                            updateCartQuantity(product.id, quantity + 1, selectedVariation?.id);
                          }}
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

          {/* Voucher & Loyalty Options */}
          <div className="p-4 space-y-3">
            {/* Voucher Box */}
            <div className="bg-white rounded-2xl border border-stone-200 p-3 shadow-xs space-y-2">
              <div
                onClick={() => setIsVoucherSectionOpen(!isVoucherSectionOpen)}
                className="flex items-center justify-between cursor-pointer text-xs"
              >
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-amber-800" />
                  <span className="font-bold text-stone-800">
                    {appliedVoucher ? `Voucher: ${appliedVoucher.code}` : 'Gunakan / Masukkan Kode Voucher'}
                  </span>
                </div>
                <ChevronRight className={`w-4 h-4 text-stone-400 transition-transform ${isVoucherSectionOpen ? 'rotate-90' : ''}`} />
              </div>

              {isVoucherSectionOpen && (
                <form onSubmit={handleApplyVoucher} className="pt-2 flex gap-2">
                  <input
                    type="text"
                    placeholder="Contoh: BERKAHRAMADHAN / KURMA10"
                    value={voucherInput}
                    onChange={(e) => setVoucherInput(e.target.value.toUpperCase())}
                    className="flex-1 p-2 bg-stone-50 border border-stone-200 rounded-xl text-xs uppercase font-mono font-bold"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-800 text-white rounded-xl text-xs font-bold hover:bg-amber-900"
                  >
                    Pakai
                  </button>
                </form>
              )}

              {appliedVoucher && (
                <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between text-xs text-emerald-900">
                  <span>Diskon Voucher: <strong>-Rp {cartTotals.voucherDiscount.toLocaleString('id-ID')}</strong></span>
                  <button onClick={removeVoucher} className="text-xs font-bold text-red-600">Hapus</button>
                </div>
              )}
            </div>

            {/* Coins Redemption Box */}
            {shopeeCoins > 0 && (
              <div className="bg-white rounded-2xl border border-stone-200 p-3 shadow-xs flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-amber-600" />
                  <div>
                    <span className="font-bold text-stone-800 block">Tukarkan Koin Kurma</span>
                    <span className="text-[10px] text-stone-500">Saldo: {shopeeCoins.toLocaleString('id-ID')} Koin</span>
                  </div>
                </div>

                <label className="flex items-center gap-1.5 cursor-pointer font-bold text-amber-900">
                  <input
                    type="checkbox"
                    checked={useCoinsInCheckout}
                    onChange={(e) => setUseCoinsInCheckout(e.target.checked)}
                    className="w-4 h-4 text-amber-800 rounded-sm focus:ring-amber-800"
                  />
                  <span>Gunakan</span>
                </label>
              </div>
            )}
            {/* Notice Kurir & Pengiriman */}
            <div className="bg-gradient-to-r from-amber-50 to-emerald-50 rounded-2xl border border-amber-200/80 p-3 shadow-xs flex items-center gap-2.5 text-xs">
              <div className="w-8 h-8 rounded-xl bg-amber-800 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Truck className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-bold text-amber-950 block">Pilihan Kurir & Ongkir Tersedia</span>
                <p className="text-[11px] text-stone-600">
                  Pengiriman Toko, Pickup Toko (Gratis Rp0), JNE, J&T, SiCepat, dll. dipilih di halaman Checkout selanjutnya.
                </p>
              </div>
            </div>
          </div>

          {/* Sticky Bottom Checkout Action */}
          <div className="fixed bottom-16 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-stone-200 p-4 shadow-lg max-w-lg mx-auto">
            <div className="flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] text-stone-500 block">Total ({selectedCount} Produk)</span>
                <span className="font-black text-base text-amber-950 font-mono">
                  Rp {selectedSubtotal.toLocaleString('id-ID')}
                </span>
              </div>

              <button
                disabled={selectedCartItems.length === 0}
                onClick={() => setIsCheckoutModalOpen(true)}
                className="flex-1 py-3 bg-amber-800 hover:bg-amber-900 active:scale-98 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
              >
                <Truck className="w-4 h-4" />
                <span>Pilih Kurir & Checkout ({selectedCount})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}

      {/* Checkout Modal Dialog */}
      {isCheckoutModalOpen && (
        <CheckoutModal onClose={() => setIsCheckoutModalOpen(false)} />
      )}
    </div>
  );
};
