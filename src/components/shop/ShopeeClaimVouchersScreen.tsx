import React, { useState } from 'react';
import { 
  Tag, 
  Sparkles, 
  Truck, 
  Percent, 
  Check, 
  ArrowLeft, 
  ChevronRight, 
  Clock, 
  ShieldCheck,
  Award
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ShopeeClaimVouchersScreen: React.FC = () => {
  const { 
    promotions, 
    claimedVoucherIds, 
    claimVoucher, 
    claimAllVouchers, 
    setCurrentView,
    applyVoucher,
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'ongkir' | 'discount' | 'cashback'>('all');

  const allVouchers = [
    {
      code: 'ONGKIR0',
      title: 'Gratis Ongkir XTRA s/d Rp 20.000',
      description: 'Min. Belanja Rp 50.000 • Semua Kurir Ekspedisi',
      type: 'ongkir',
      badge: 'GRATIS ONGKIR',
      expiry: '3 Hari lagi',
      color: 'bg-emerald-600'
    },
    {
      code: 'SPECIAL35K',
      title: 'Voucher Eksklusif Flash Deal Rp 35.000',
      description: 'Min. Belanja Rp 150.000 • Khusus produk kurma',
      type: 'discount',
      badge: 'SPECIAL DEAL',
      expiry: 'Hari ini',
      color: 'bg-red-600'
    },
    {
      code: 'KURMA30K',
      title: 'Diskon Spesial Toko Rp 30.000',
      description: 'Min. Belanja Rp 200.000 • Semua produk',
      type: 'discount',
      badge: 'DISKON TOKO',
      expiry: '7 Hari lagi',
      color: 'bg-amber-600'
    },
    {
      code: 'CASHBACK50',
      title: 'Cashback 50% hingga 25.000 Poin',
      description: 'Min. Belanja Rp 100.000 • Pembayaran KurmaPay',
      type: 'cashback',
      badge: 'CASHBACK XTRA',
      expiry: '5 Hari lagi',
      color: 'bg-orange-600'
    },
    ...promotions.map(p => ({
      code: p.code,
      title: `${p.title} (${p.code})`,
      description: `Min. Belanja Rp ${p.minPurchase.toLocaleString('id-ID')} • Potongan ${p.discountType === 'percentage' ? `${p.discountValue}%` : `Rp ${p.discountValue.toLocaleString('id-ID')}`}`,
      type: 'discount',
      badge: 'PROMO OFFICIAL',
      expiry: p.expiryDate,
      color: 'bg-indigo-600'
    }))
  ];

  const filteredVouchers = allVouchers.filter(v => {
    if (activeTab === 'all') return true;
    if (activeTab === 'ongkir') return v.type === 'ongkir';
    if (activeTab === 'discount') return v.type === 'discount';
    if (activeTab === 'cashback') return v.type === 'cashback';
    return true;
  });

  return (
    <div className="pb-32 max-w-lg mx-auto bg-stone-100 min-h-screen">
      
      {/* Top Header */}
      <div className="sticky top-0 z-30 bg-white border-b border-stone-200 px-4 py-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setCurrentView('home')}
            className="p-1.5 rounded-lg text-stone-700 hover:bg-stone-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-red-600" />
            <h1 className="font-bold text-sm text-stone-900 font-['Playfair_Display',serif]">
              Voucher & Promo Hemat
            </h1>
          </div>
        </div>

        <button
          onClick={claimAllVouchers}
          className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-sm active:scale-95 transition-all"
        >
          Klaim Semua
        </button>
      </div>

      {/* Categories Tabs */}
      <div className="bg-white border-b border-stone-200 px-2 flex text-xs">
        <button
          onClick={() => setActiveTab('all')}
          className={`flex-1 py-3 font-bold border-b-2 text-center transition-colors ${
            activeTab === 'all' ? 'border-red-600 text-red-700' : 'border-transparent text-stone-500'
          }`}
        >
          Semua
        </button>
        <button
          onClick={() => setActiveTab('ongkir')}
          className={`flex-1 py-3 font-bold border-b-2 text-center transition-colors ${
            activeTab === 'ongkir' ? 'border-red-600 text-red-700' : 'border-transparent text-stone-500'
          }`}
        >
          Gratis Ongkir
        </button>
        <button
          onClick={() => setActiveTab('discount')}
          className={`flex-1 py-3 font-bold border-b-2 text-center transition-colors ${
            activeTab === 'discount' ? 'border-red-600 text-red-700' : 'border-transparent text-stone-500'
          }`}
        >
          Diskon Toko
        </button>
        <button
          onClick={() => setActiveTab('cashback')}
          className={`flex-1 py-3 font-bold border-b-2 text-center transition-colors ${
            activeTab === 'cashback' ? 'border-red-600 text-red-700' : 'border-transparent text-stone-500'
          }`}
        >
          Cashback
        </button>
      </div>

      {/* Voucher Cards List */}
      <div className="p-4 space-y-3">
        {filteredVouchers.map((v, i) => {
          const isClaimed = claimedVoucherIds.includes(v.code);

          return (
            <div
              key={i}
              className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden flex items-stretch transition-all hover:shadow-md"
            >
              {/* Left Stub with Badge */}
              <div className={`${v.color} w-24 text-white p-3 flex flex-col items-center justify-center text-center relative border-r-2 border-dashed border-white/40`}>
                <span className="text-[9px] font-black tracking-tighter uppercase leading-tight">
                  {v.badge}
                </span>
                <span className="text-xs font-mono font-bold mt-1 bg-black/20 px-1 rounded-sm">
                  {v.code}
                </span>
              </div>

              {/* Right Body */}
              <div className="p-3 flex-1 flex flex-col justify-between text-xs space-y-2">
                <div>
                  <h4 className="font-bold text-stone-900 leading-tight">{v.title}</h4>
                  <p className="text-[11px] text-stone-500 mt-1">{v.description}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                  <div className="flex items-center gap-1 text-[10px] text-stone-400">
                    <Clock className="w-3 h-3" />
                    <span>Kedaluwarsa: {v.expiry}</span>
                  </div>

                  {isClaimed ? (
                    <button
                      onClick={() => {
                        applyVoucher(v.code);
                        setCurrentView('cart');
                      }}
                      className="px-3 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg font-bold text-xs flex items-center gap-1"
                    >
                      <Check className="w-3 h-3 text-emerald-700 stroke-[3]" />
                      <span>Pakai</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => claimVoucher(v.code)}
                      className="px-3.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-xs shadow-xs active:scale-95 transition-all"
                    >
                      KLAIM
                    </button>
                  )}
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
