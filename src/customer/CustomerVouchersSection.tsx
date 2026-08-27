import React, { useState } from 'react';
import { 
  Ticket, 
  Sparkles, 
  Clock, 
  Check, 
  Copy, 
  Percent, 
  Truck, 
  ArrowRight,
  ShoppingBag
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CustomerVouchersSection: React.FC = () => {
  const { 
    promotions, 
    claimedVoucherIds, 
    claimVoucher, 
    claimAllVouchers, 
    setCurrentView,
    showToast 
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<'semua' | 'diskon' | 'ongkir'>('semua');

  const filteredVouchers = promotions.filter(v => {
    if (activeCategory === 'diskon') return v.discountType === 'percentage' || v.discountType === 'fixed';
    if (activeCategory === 'ongkir') return v.discountType === 'shipping_free';
    return true;
  });

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    showToast(`Kode voucher "${code}" disalin!`, 'success');
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
        <div>
          <h2 className="text-xl font-bold text-stone-900 font-['Playfair_Display',serif]">
            Voucher Saya
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Klaim dan gunakan kupon potongan diskon kurma dan gratis ongkir XTRA saat checkout.
          </p>
        </div>
        <button
          onClick={claimAllVouchers}
          className="py-2.5 px-4 bg-amber-800 hover:bg-amber-900 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Klaim Semua Voucher</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-100 pb-2">
        <button
          onClick={() => setActiveCategory('semua')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeCategory === 'semua' ? 'bg-amber-800 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          Semua Voucher
        </button>
        <button
          onClick={() => setActiveCategory('diskon')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeCategory === 'diskon' ? 'bg-amber-800 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          Diskon Harga
        </button>
        <button
          onClick={() => setActiveCategory('ongkir')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeCategory === 'ongkir' ? 'bg-amber-800 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          Gratis Ongkir XTRA
        </button>
      </div>

      {/* Voucher Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredVouchers.map((voucher) => {
          const isClaimed = claimedVoucherIds.includes(voucher.id);

          return (
            <div
              key={voucher.id}
              className={`rounded-2xl border overflow-hidden flex flex-col justify-between transition-all ${
                isClaimed 
                  ? 'border-amber-300 bg-amber-50/40 shadow-xs' 
                  : 'border-stone-200 bg-white hover:border-amber-300'
              }`}
            >
              <div className="p-4 flex items-start gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  voucher.discountType === 'shipping_free' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-amber-100 text-amber-900'
                }`}>
                  {voucher.discountType === 'shipping_free' ? (
                    <Truck className="w-6 h-6" />
                  ) : (
                    <Percent className="w-6 h-6" />
                  )}
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs bg-stone-100 px-2 py-0.5 rounded text-amber-900 border border-stone-200">
                      {voucher.code}
                    </span>
                    <span className="text-[10px] text-stone-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Berlaku s/d {voucher.expiresAt}
                    </span>
                  </div>

                  <h4 className="font-bold text-xs text-stone-900 line-clamp-1">
                    {voucher.title}
                  </h4>
                  <p className="text-[11px] text-stone-600 line-clamp-2">
                    {voucher.description}
                  </p>
                  <p className="text-[10px] text-stone-500 font-medium">
                    Min. belanja Rp {voucher.minOrderValue.toLocaleString('id-ID')}
                  </p>
                </div>
              </div>

              {/* Bottom Action Footer */}
              <div className="px-4 py-2.5 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => handleCopyCode(voucher.code)}
                  className="text-stone-500 hover:text-stone-800 flex items-center gap-1 text-[11px] font-medium cursor-pointer"
                >
                  <Copy className="w-3 h-3" />
                  <span>Salin Kode</span>
                </button>

                {isClaimed ? (
                  <button
                    onClick={() => setCurrentView('cart')}
                    className="py-1.5 px-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-[11px] transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Check className="w-3 h-3" />
                    <span>Gunakan di Keranjang</span>
                  </button>
                ) : (
                  <button
                    onClick={() => claimVoucher(voucher.id)}
                    className="py-1.5 px-3.5 bg-amber-800 hover:bg-amber-900 text-white font-bold rounded-lg text-[11px] transition-all cursor-pointer shadow-xs"
                  >
                    Klaim Voucher
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
