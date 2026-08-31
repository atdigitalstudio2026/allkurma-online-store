import React, { useState } from 'react';
import { 
  User, 
  Package, 
  MapPin, 
  Settings, 
  Building2, 
  Headphones, 
  LogOut, 
  ChevronRight, 
  ShieldCheck, 
  CreditCard,
  Wallet,
  Heart,
  Tag,
  Truck,
  Clock,
  CheckCircle2,
  RotateCcw,
  Star,
  PlusCircle,
  Store,
  LogIn
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MyProfileScreen: React.FC = () => {
  const { 
    user, 
    orders, 
    setCurrentView, 
    switchRole, 
    showToast,
    kurmaPayBalance,
    payLaterLimit,
    payLaterUsed,
    wishlistProductIds,
    claimedVoucherIds,
    setIsChatOpen,
    topUpKurmaPay,
    setIsAuthModalOpen,
    setAuthModalMode,
    logout
  } = useApp();

  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('100000');

  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const processingOrders = orders.filter(o => o.status === 'processing').length;
  const shippedOrders = orders.filter(o => o.status === 'shipped').length;
  const deliveredOrders = orders.filter(o => o.status === 'delivered').length;

  const handleTopUp = () => {
    const amt = parseInt(topUpAmount, 10);
    if (!isNaN(amt) && amt > 0) {
      topUpKurmaPay(amt);
      setIsTopUpModalOpen(false);
    }
  };

  return (
    <div className="pb-32 max-w-lg mx-auto bg-stone-100 min-h-screen font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* 1. Header Profile Banner */}
      <div className="bg-gradient-to-br from-amber-900 via-stone-900 to-amber-950 text-white p-5 rounded-b-3xl shadow-lg border-b border-amber-900/40">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] bg-amber-500 text-stone-950 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
              {user.tier} Member
            </span>
            <span className="text-[10px] text-amber-200/80">AllKurma Verified</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsChatOpen(true)}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="Chat Customer Service"
            >
              <Headphones className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentView('account-settings')}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="Pengaturan Akun"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3.5">
          <div className="relative">
            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80'}
              alt={user.name}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-400 shadow-md"
            />
            <div className="absolute -bottom-1 -right-1 bg-amber-500 text-stone-950 p-0.5 rounded-full ring-2 ring-stone-900">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="text-base font-bold font-['Playfair_Display',serif] text-white truncate">
              {user.name}
            </h2>
            <p className="text-[11px] text-stone-300 truncate">{user.email}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-[10px] text-amber-300 font-semibold flex items-center gap-1">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span>Status Akun: {user.role === 'seller' ? 'Toko Seller Mitra' : 'Akun Pembeli (Customer)'}</span>
              </span>
            </div>
          </div>
        </div>

        {/* 2. Kurma Wallet & Balance Dashboard */}
        <div className="mt-4 pt-3 border-t border-white/10 grid grid-cols-2 gap-2">
          
          {/* KurmaPay Card */}
          <div className="bg-white/10 hover:bg-white/15 p-3 rounded-2xl border border-white/10 backdrop-blur-xs transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Wallet className="w-4 h-4 text-amber-400" />
                <span className="text-[10px] font-bold text-amber-200">KurmaPay</span>
              </div>
              <button
                onClick={() => setIsTopUpModalOpen(true)}
                className="text-[9px] bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-2 py-0.5 rounded-md flex items-center gap-0.5 transition-colors cursor-pointer"
              >
                <PlusCircle className="w-2.5 h-2.5" />
                <span>Top Up</span>
              </button>
            </div>
            <p className="text-sm font-black font-mono text-white mt-1.5">
              Rp {kurmaPayBalance.toLocaleString('id-ID')}
            </p>
            <span className="text-[9px] text-stone-300">Dompet Belanja Instan</span>
          </div>

          {/* PayLater Card */}
          <div className="bg-white/10 hover:bg-white/15 p-3 rounded-2xl border border-white/10 backdrop-blur-xs transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-emerald-400" />
                <span className="text-[10px] font-bold text-emerald-300">KurmaPayLater</span>
              </div>
              <span className="text-[9px] bg-emerald-500/30 text-emerald-200 px-1.5 py-0.2 rounded font-bold">
                Aktif
              </span>
            </div>
            <p className="text-sm font-black font-mono text-white mt-1.5">
              Rp {(payLaterLimit - payLaterUsed).toLocaleString('id-ID')}
            </p>
            <span className="text-[9px] text-stone-300">Sisa Limit Kredit</span>
          </div>

        </div>

        {/* 2 Quick Navigation Bars: Vouchers & Wishlist */}
        <div className="grid grid-cols-2 gap-2 mt-2">
          <button
            onClick={() => setCurrentView('allkurma-vouchers')}
            className="bg-white/5 hover:bg-white/10 p-2 rounded-xl text-center border border-white/5 transition-all cursor-pointer"
          >
            <div className="flex items-center justify-center gap-1 text-red-400">
              <Tag className="w-3.5 h-3.5" />
              <span className="text-xs font-black font-mono">{claimedVoucherIds.length || 3}</span>
            </div>
            <span className="text-[9px] text-stone-300 block mt-0.5">Voucher Tersedia</span>
          </button>

          <button
            onClick={() => setCurrentView('wishlist')}
            className="bg-white/5 hover:bg-white/10 p-2 rounded-xl text-center border border-white/5 transition-all cursor-pointer"
          >
            <div className="flex items-center justify-center gap-1 text-rose-400">
              <Heart className="w-3.5 h-3.5" />
              <span className="text-xs font-black font-mono">{wishlistProductIds.length}</span>
            </div>
            <span className="text-[9px] text-stone-300 block mt-0.5">Favorit Saya</span>
          </button>
        </div>

      </div>

      {/* 2. Pesanan Saya (Status Tracker) */}
      <div className="p-4 space-y-3">
        <div className="bg-white rounded-3xl border border-stone-200 p-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-amber-800" />
              <h3 className="font-bold text-xs text-stone-900 font-['Playfair_Display',serif]">
                Pesanan Saya
              </h3>
            </div>
            <button
              onClick={() => setCurrentView('my-orders')}
              className="text-[11px] font-semibold text-amber-800 flex items-center gap-0.5 hover:underline cursor-pointer"
            >
              <span>Lihat Semua Pesanan</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 5 Status Icons */}
          <div className="grid grid-cols-5 gap-1 pt-3 text-center">
            
            <button 
              onClick={() => setCurrentView('my-orders')}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="relative w-10 h-10 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                <Clock className="w-4 h-4" />
                {pendingOrders > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {pendingOrders}
                  </span>
                )}
              </div>
              <span className="text-[9px] text-stone-600 mt-1">Belum Bayar</span>
            </button>

            <button 
              onClick={() => setCurrentView('my-orders')}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="relative w-10 h-10 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                <Package className="w-4 h-4" />
                {processingOrders > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {processingOrders}
                  </span>
                )}
              </div>
              <span className="text-[9px] text-stone-600 mt-1">Dikemas</span>
            </button>

            <button 
              onClick={() => setCurrentView('my-orders')}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="relative w-10 h-10 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                <Truck className="w-4 h-4" />
                {shippedOrders > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {shippedOrders}
                  </span>
                )}
              </div>
              <span className="text-[9px] text-stone-600 mt-1">Dikirim</span>
            </button>

            <button 
              onClick={() => setCurrentView('my-orders')}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="relative w-10 h-10 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                <Star className="w-4 h-4" />
                {deliveredOrders > 0 && (
                  <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {deliveredOrders}
                  </span>
                )}
              </div>
              <span className="text-[9px] text-stone-600 mt-1">Beri Nilai</span>
            </button>

            <button 
              onClick={() => setCurrentView('request-return')}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="relative w-10 h-10 rounded-2xl bg-stone-100 text-stone-700 flex items-center justify-center group-hover:bg-stone-200 transition-colors">
                <RotateCcw className="w-4 h-4" />
              </div>
              <span className="text-[9px] text-stone-600 mt-1">Retur / RMA</span>
            </button>

          </div>
        </div>

        {/* 3. Toko Seller Banner (Only if Seller, else prompt to login) */}
        {user.role === 'seller' || user.role === 'super_admin' ? (
          <div className="bg-gradient-to-r from-amber-900 to-stone-900 text-white rounded-3xl p-4 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-white">Dashboard Toko Seller</h4>
                <p className="text-[10px] text-stone-300">Kelola produk, pesanan, pengiriman & toko</p>
              </div>
            </div>
            <button
              onClick={() => setCurrentView('seller-dashboard')}
              className="py-1.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-colors cursor-pointer"
            >
              Buka Toko
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-amber-200 p-4 shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-stone-900">Pusat Seller AllKurma</h4>
                <p className="text-[10px] text-stone-500">Khusus mitra penjual resmi AllKurma</p>
              </div>
            </div>
            <button
              onClick={() => setCurrentView('seller-login')}
              className="py-1.5 px-3 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              Login Seller
            </button>
          </div>
        )}

        {/* 4. Fitur Pelanggan & Alamat */}
        <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs divide-y divide-stone-100">
          
          <button
            onClick={() => setCurrentView('allkurma-vouchers')}
            className="w-full p-3.5 flex items-center justify-between hover:bg-stone-50 transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                <Tag className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-xs text-stone-900 block">Klaim Voucher Toko & Diskon</span>
                <span className="text-[10px] text-stone-500">Voucher gratis ongkir & potongan harga</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-400" />
          </button>

          <button
            onClick={() => setCurrentView('address-book')}
            className="w-full p-3.5 flex items-center justify-between hover:bg-stone-50 transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-xs text-stone-900 block">Daftar Alamat Pengiriman</span>
                <span className="text-[10px] text-stone-500">Atur alamat rumah dan kantor untuk pengiriman</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-400" />
          </button>

          <button
            onClick={() => setIsChatOpen(true)}
            className="w-full p-3.5 flex items-center justify-between hover:bg-stone-50 transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Headphones className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-xs text-stone-900 block">Bantuan & Hubungi Penjual</span>
                <span className="text-[10px] text-stone-500">Chat CS resmi seputar produk kurma & pesanan</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-400" />
          </button>

          <button
            onClick={() => setCurrentView('b2b-portal')}
            className="w-full p-3.5 flex items-center justify-between hover:bg-stone-50 transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-900 text-amber-200 flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-xs text-stone-900 block">Portal Grosir & Pembelian Jumlah Besar</span>
                <span className="text-[10px] text-stone-500">Order grosir per karton/ton dengan harga distributor</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-400" />
          </button>

        </div>

        {/* 5. Pengaturan Akun & Logout */}
        <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs divide-y divide-stone-100">
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="w-full p-3.5 flex items-center justify-between hover:bg-stone-50 transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center">
                <LogIn className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-xs text-stone-900 block">Ganti Akun / Masuk</span>
                <span className="text-[10px] text-stone-500">Login dengan akun Pembeli atau Akun Seller</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-400" />
          </button>

          <button
            onClick={logout}
            className="w-full p-3.5 flex items-center justify-between hover:bg-red-50 transition-colors text-left cursor-pointer text-red-600"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                <LogOut className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-xs text-red-700 block">Keluar dari Akun (Logout)</span>
                <span className="text-[10px] text-red-500">Keluar dari sesi akun saat ini</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-red-400" />
          </button>
        </div>

      </div>

      {/* Top-up KurmaPay Modal */}
      {isTopUpModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl animate-in zoom-in-95 space-y-4 font-['Plus_Jakarta_Sans',sans-serif]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-amber-700" />
                <h3 className="text-base font-bold text-stone-900 font-['Playfair_Display',serif]">
                  Top Up Saldo KurmaPay
                </h3>
              </div>
              <button
                onClick={() => setIsTopUpModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-600 block mb-1.5">
                Pilih Nominal Top Up
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['50000', '100000', '250000', '500000', '1000000', '2000000'].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setTopUpAmount(amt)}
                    className={`py-2 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer ${
                      topUpAmount === amt 
                        ? 'bg-amber-800 text-white ring-2 ring-amber-400' 
                        : 'bg-stone-50 border border-stone-200 text-stone-800 hover:bg-stone-100'
                    }`}
                  >
                    Rp {parseInt(amt, 10).toLocaleString('id-ID')}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 space-y-1">
              <div className="flex justify-between">
                <span>Saldo Saat Ini:</span>
                <span className="font-mono font-bold">Rp {kurmaPayBalance.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between">
                <span>Saldo Setelah Top Up:</span>
                <span className="font-mono font-bold text-amber-800">
                  Rp {(kurmaPayBalance + (parseInt(topUpAmount, 10) || 0)).toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            <button
              onClick={handleTopUp}
              className="w-full py-3 bg-amber-800 hover:bg-amber-900 active:scale-95 text-white font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer"
            >
              Konfirmasi Top Up Sekarang
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

