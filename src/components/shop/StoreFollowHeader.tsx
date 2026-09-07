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
  Bell, 
  BellRing,
  Tag, 
  Gift, 
  ChevronRight,
  Share2,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { normalizeImageUrl } from '../../utils/imageUrlHelper';

interface StoreFollowHeaderProps {
  variant?: 'full-banner' | 'card' | 'compact';
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
    setCurrentView
  } = useApp();

  const [showBenefitModal, setShowBenefitModal] = useState(false);

  const followerCount = sellerStore.followerCount || 24850;

  const handleShareStore = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.origin + '/?store=allkurma.official');
      showToast('Tautan toko AllKurma berhasil disalin ke clipboard!', 'success');
    } else {
      showToast('Toko Official AllKurma: @allkurma.official', 'info');
    }
  };

  // Compact Variant (e.g. for Top Bar or Product Detail quick view)
  if (variant === 'compact') {
    return (
      <div className={`flex items-center justify-between gap-3 p-3 bg-white rounded-2xl border border-stone-200/90 shadow-2xs ${className}`}>
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative">
            {sellerStore.logo ? (
              <img
                src={normalizeImageUrl(sellerStore.logo)}
                alt={sellerStore.storeName}
                className="w-10 h-10 rounded-full object-cover border border-stone-200 shadow-xs bg-white shrink-0"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-700 to-amber-900 p-0.5 flex items-center justify-center text-white shrink-0 shadow-xs">
                <Store className="w-5 h-5 text-amber-200" />
              </div>
            )}
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" title="Online" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h4 className="font-bold text-stone-900 text-xs truncate font-['Plus_Jakarta_Sans',sans-serif]">
                {sellerStore.storeName || 'AllKurma Official Store'}
              </h4>
              <span className="text-[8px] bg-red-600 text-white px-1 py-0.2 rounded-xs font-black uppercase tracking-wider">
                MALL
              </span>
            </div>
            <p className="text-[10px] text-stone-500 mt-0.5 flex items-center gap-1.5">
              <span className="flex items-center text-amber-600 font-bold">
                <Star className="w-2.5 h-2.5 fill-amber-500 inline mr-0.5" /> 4.9
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
            className="p-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs transition-colors"
            title="Chat Penjual"
          >
            <MessageSquare className="w-3.5 h-3.5" />
          </button>
          
          <button
            type="button"
            onClick={toggleFollowStore}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs active:scale-95 ${
              isFollowingStore
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
                : 'bg-amber-800 hover:bg-amber-900 text-white shadow-xs'
            }`}
          >
            {isFollowingStore ? (
              <>
                <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>Mengikuti</span>
              </>
            ) : (
              <>
                <UserPlus className="w-3.5 h-3.5 text-amber-200" />
                <span>+ Ikuti</span>
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  // Full Banner / Card Variant (Shopee/Tokopedia/TikTok Mall Style)
  return (
    <div className={`overflow-hidden rounded-2xl bg-white border border-stone-200 shadow-sm ${className}`}>
      
      {/* Top Store Cover / Backdrop with dynamic sellerStore.banner */}
      <div className="relative bg-stone-950 text-white p-4 sm:p-5 overflow-hidden">
        {sellerStore.banner ? (
          <img
            src={normalizeImageUrl(sellerStore.banner)}
            alt={sellerStore.storeName}
            className="absolute inset-0 w-full h-full object-cover opacity-35"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-amber-950 via-stone-900 to-amber-900 opacity-90" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/90" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-40" />
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          {/* Store Info Left */}
          <div className="flex items-center gap-3.5">
            <div className="relative shrink-0">
              <img
                src={normalizeImageUrl(sellerStore.logo) || 'https://images.unsplash.com/photo-1596797882870-8c33deeac224?w=200&auto=format&fit=crop&q=80'}
                alt={sellerStore.storeName}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-amber-400/80 shadow-md ring-4 ring-black/40 bg-white"
              />
              <div className="absolute -bottom-1 -right-1 bg-amber-500 text-amber-950 p-1 rounded-full border border-white shadow-xs" title="Official Verified Store">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-extrabold text-white text-base sm:text-lg font-['Playfair_Display',serif] tracking-tight">
                  {sellerStore.storeName || 'AllKurma Official Store'}
                </h3>
                <span className="bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-sm tracking-wider uppercase shadow-xs">
                  OFFICIAL MALL
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Online
                </span>
              </div>

              <p className="text-xs text-amber-200/90 font-medium mt-0.5 truncate max-w-sm">
                {sellerStore.tagline || 'Pusat Kurma Impor Timur Tengah & Grosir Berkah Se-Indonesia'}
              </p>

              {/* Fast stats inline */}
              <div className="flex items-center gap-3 mt-2 text-[11px] text-stone-300 flex-wrap">
                <span className="flex items-center gap-1 text-amber-300 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  4.9 <span className="font-normal text-stone-300">(18.2RB+ Penilaian)</span>
                </span>
                <span className="text-stone-500">•</span>
                <span className="font-semibold text-white">
                  {followerCount.toLocaleString('id-ID')} <span className="text-stone-300 font-normal">Pengikut</span>
                </span>
                <span className="text-stone-500">•</span>
                <span className="text-stone-300">
                  Respon Chat: <b className="text-emerald-400 font-semibold">100%</b>
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons Right */}
          <div className="flex items-center gap-2.5 self-start sm:self-center shrink-0">
            <button
              type="button"
              onClick={() => setIsChatOpen(true)}
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 active:scale-95 backdrop-blur-xs"
            >
              <MessageSquare className="w-3.5 h-3.5 text-amber-300" />
              <span>Chat Toko</span>
            </button>

            <button
              type="button"
              onClick={handleShareStore}
              className="p-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl text-xs transition-all active:scale-95"
              title="Bagikan Tautan Toko"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>

            {/* Main Follow / Unfollow Button */}
            <button
              type="button"
              onClick={toggleFollowStore}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 shadow-md active:scale-95 cursor-pointer ${
                isFollowingStore
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white ring-2 ring-emerald-400/40'
                  : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-black shadow-amber-500/20'
              }`}
            >
              {isFollowingStore ? (
                <>
                  <UserCheck className="w-4 h-4 text-white" />
                  <span>Mengikuti Toko</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 text-stone-950" />
                  <span>+ Ikuti Toko</span>
                </>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Follower Perk Ribbon / Bar */}
      {showVoucherPerk && (
        <div className="bg-amber-50/80 border-t border-amber-200/70 px-4 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <div className="p-1 rounded-md bg-amber-200/70 text-amber-900 shrink-0">
              <Gift className="w-3.5 h-3.5" />
            </div>
            <div className="truncate">
              {isFollowingStore ? (
                <span className="text-emerald-900 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline shrink-0" />
                  <span>Status: <b>Pengikut Aktif</b> • Voucher Diskon 15% (Kode: <b>FOLLOWER15</b>) telah aktif di akun Anda!</span>
                </span>
              ) : (
                <span className="text-amber-950">
                  <b>Keuntungan Follow:</b> Dapatkan Voucher Diskon 15% + Notifikasi Real-Time saat ada panen kurma baru & flash sale!
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setShowBenefitModal(true)}
              className="text-[11px] font-bold text-amber-900 hover:text-amber-950 flex items-center gap-1 underline underline-offset-2"
            >
              <Info className="w-3 h-3 text-amber-700" />
              <span>Benefit Follower</span>
            </button>

            {!isFollowingStore && (
              <button
                type="button"
                onClick={toggleFollowStore}
                className="text-[11px] font-extrabold text-amber-800 hover:text-amber-950 bg-amber-200/60 hover:bg-amber-200 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
              >
                <span>Klaim Diskon</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Follower Perks Modal */}
      {showBenefitModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-2xl bg-amber-100 text-amber-900">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-stone-900 text-base font-['Playfair_Display',serif]">
                    Keuntungan Mengikuti Toko
                  </h3>
                  <p className="text-xs text-stone-500">AllKurma Official Store VIP Community</p>
                </div>
              </div>
              <button 
                onClick={() => setShowBenefitModal(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-600 hover:bg-stone-100"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 flex items-start gap-3">
                <div className="p-2 bg-amber-200/70 rounded-xl text-amber-900 shrink-0">
                  <Tag className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-900">Voucher Diskon 15% Spesial Follower</h4>
                  <p className="text-stone-600 mt-0.5 leading-relaxed">
                    Langsung klaim potongan belanja 15% tanpa minimum pembelian untuk pesanan kurma Ajwa, Sukari, Medjool, atau Madu.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-2xl border border-blue-200 flex items-start gap-3">
                <div className="p-2 bg-blue-200/70 rounded-xl text-blue-900 shrink-0">
                  <BellRing className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-900">Notifikasi Otomatis Promo & Panen Baru</h4>
                  <p className="text-stone-600 mt-0.5 leading-relaxed">
                    Dapatkan peringatan instan di aplikasi ketika stok panen segar baru tiba di gudang dan saat flash sale berlangsung.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-start gap-3">
                <div className="p-2 bg-emerald-200/70 rounded-xl text-emerald-900 shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-900">Prioritas Layanan CS & Garansi Fresh</h4>
                  <p className="text-stone-600 mt-0.5 leading-relaxed">
                    Pertanyaan dan chat Anda akan diprioritaskan oleh tim Customer Support official kami.
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
                className={`w-full py-3 rounded-2xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 ${
                  isFollowingStore
                    ? 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    : 'bg-amber-800 hover:bg-amber-900 text-white'
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

    </div>
  );
};
