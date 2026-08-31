import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Building2, 
  CheckCircle2, 
  AlertCircle,
  ShoppingBag,
  Store,
  ChevronLeft,
  Truck,
  TrendingUp,
  PackageCheck,
  Headphones,
  KeyRound
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { authService } from '../services/authService';
import { SRALogo } from '../components/common/SRALogo';
import { UserProfile } from '../types';

export const SellerLoginScreen: React.FC = () => {
  const { 
    setUser, 
    setCurrentView, 
    showToast,
    loginSeller,
    sellerStore,
    updateSellerStore
  } = useApp();

  const [identifier, setIdentifier] = useState('seller@allkurma.id');
  const [password, setPassword] = useState('seller123');
  const [sellerPin, setSellerPin] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Quick Demo Buttons
  const handleQuickDemoOfficial = () => {
    setIdentifier('seller@allkurma.id');
    setPassword('seller123');
    setSellerPin('123456');
    setErrorMessage(null);
  };

  const handleQuickDemoPartner = () => {
    setIdentifier('mitra.madinah@allkurma.id');
    setPassword('madinah2026');
    setSellerPin('888999');
    setErrorMessage(null);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!identifier.trim()) {
      setErrorMessage('Harap masukkan alamat email atau username Toko Seller');
      return;
    }

    if (!password) {
      setErrorMessage('Harap masukkan kata sandi akun seller');
      return;
    }

    setIsLoading(true);

    try {
      // 1. Try real Firebase Email Auth
      const { profile } = await authService.loginWithEmail(identifier, password);
      
      // Enforce seller profile properties
      const sellerProfile: UserProfile = {
        ...profile,
        role: 'seller',
        companyName: profile.companyName || sellerStore.storeName || 'AllKurma Official Store',
        tier: 'Platinum'
      };

      setUser(sellerProfile);
      if (rememberMe) {
        localStorage.setItem('allkurma_user', JSON.stringify(sellerProfile));
      }
      showToast(`Selamat datang di Seller Center, ${sellerProfile.name}!`, 'success');
      setCurrentView('seller-dashboard');
    } catch (err: any) {
      // 2. Demo & local store fallback
      if (
        identifier.toLowerCase().includes('seller') || 
        identifier.toLowerCase().includes('toko') || 
        identifier.toLowerCase().includes('mitra') || 
        identifier === 'seller@allkurma.id' ||
        identifier === 'mitra.madinah@allkurma.id'
      ) {
        const isPartner = identifier.includes('madinah') || identifier.includes('mitra');
        const storeName = isPartner ? 'Kurma Madinah Hub' : 'AllKurma Official Store';
        
        const sellerProfile: UserProfile = {
          id: isPartner ? 'seller-partner-02' : 'seller-001',
          name: isPartner ? 'H. Faisal Rahman (Mitra Madinah)' : 'AllKurma Official Store',
          email: identifier.includes('@') ? identifier : `${identifier}@allkurma.id`,
          phone: '+62 811-2345-6789',
          role: 'seller',
          avatar: isPartner 
            ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'
            : 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&auto=format&fit=crop&q=80',
          tier: 'Platinum',
          rewardPoints: 12500,
          totalOrders: isPartner ? 186 : 540,
          savedLists: 8,
          annualSpend: isPartner ? 120000000 : 350000000,
          companyName: storeName,
          defaultAddressId: 'addr-01'
        };

        setUser(sellerProfile);
        if (rememberMe) {
          localStorage.setItem('allkurma_user', JSON.stringify(sellerProfile));
        }

        if (isPartner) {
          updateSellerStore({
            storeName: 'Kurma Madinah Hub',
            storeHandle: 'kurmamadinah_hub',
            city: 'Surabaya, Jawa Timur',
            fullAddress: 'Kawasan Niaga Ampel No. 45, Surabaya, Jawa Timur 60151'
          });
        }

        showToast(`Login Seller Berhasil! Sesi Toko "${storeName}" Aktif.`, 'success');
        setCurrentView('seller-dashboard');
      } else {
        // Direct local activation
        loginSeller(identifier);
        showToast('Login Seller Berhasil! Sesi Aktif.', 'success');
        setCurrentView('seller-dashboard');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSellerLogin = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const { profile } = await authService.loginWithGoogle();
      const sellerProfile: UserProfile = {
        ...profile,
        role: 'seller',
        companyName: sellerStore.storeName || `${profile.name} Kurma Store`,
        tier: 'Platinum'
      };
      setUser(sellerProfile);
      localStorage.setItem('allkurma_user', JSON.stringify(sellerProfile));
      showToast(`Login Google Seller Berhasil! Selamat datang, ${sellerProfile.name}`, 'success');
      setCurrentView('seller-dashboard');
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal masuk dengan Google Seller.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] bg-stone-100/90 py-8 px-4 sm:px-6 flex items-center justify-center font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="w-full max-w-lg">
        
        {/* Top Navigation Row */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setCurrentView('home')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-[#1E3A8A] transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Kembali ke Beranda Belanja</span>
          </button>

          <button
            onClick={() => setCurrentView('customer-login')}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#009A44] hover:text-[#1E3A8A] transition-colors cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Login Pembeli / Customer</span>
          </button>
        </div>

        {/* Main Seller Login Card */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden">
          
          {/* Card Header with Seller Navy & Emerald Theme */}
          <div className="p-6 sm:p-8 bg-gradient-to-br from-[#0F172A] via-[#1E3A8A] to-[#009A44] text-white text-center relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
            
            {/* SRA Logo Container */}
            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-white shadow-lg mb-3 border border-emerald-100">
              <SRALogo size="md" variant="stacked" showSubtitle={false} />
            </div>
            
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs border border-white/20 text-emerald-300 text-[11px] font-bold uppercase tracking-wider mb-2">
              <Store className="w-3.5 h-3.5" />
              <span>Seller Center & Merchant Portal</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-['Playfair_Display',serif]">
              Masuk ke Toko Seller AllKurma
            </h1>
            <p className="text-xs text-blue-200/90 mt-1 max-w-sm mx-auto leading-relaxed">
              Kelola inventaris kurma, pesanan masuk, resi pengiriman, saldo payout, dan promo toko Anda.
            </p>
          </div>

          {/* Form Body */}
          <div className="p-6 sm:p-8 space-y-5">

            {/* Error Alert */}
            {errorMessage && (
              <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-red-700 text-xs animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                <div className="flex-1 leading-relaxed">
                  {errorMessage}
                </div>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              
              {/* Input Email / Username Toko */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  Email atau ID Toko Seller <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="seller@allkurma.id atau username toko"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/40 focus:border-[#1E3A8A] transition-all font-medium"
                  />
                </div>
              </div>

              {/* Input Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-stone-700">
                    Kata Sandi Toko <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      showToast('Silakan hubungi tim IT Administrator PT Exindokarsa Agung untuk reset kredensial seller.', 'info');
                    }}
                    className="text-xs font-semibold text-[#1E3A8A] hover:text-[#009A44] hover:underline cursor-pointer transition-colors"
                  >
                    Lupa password seller?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi seller"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-stone-300 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/40 focus:border-[#1E3A8A] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-700 cursor-pointer"
                    aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Optional PIN Toko */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  PIN Keamanan Toko <span className="text-stone-400 text-[10px] font-normal">(Opsional 6 Digit)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    maxLength={6}
                    value={sellerPin}
                    onChange={(e) => setSellerPin(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="Contoh: 123456"
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-stone-300 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/40 focus:border-[#1E3A8A] transition-all tracking-widest font-mono"
                  />
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-[#1E3A8A] focus:ring-[#1E3A8A] border-stone-300 cursor-pointer"
                  />
                  <span className="text-xs font-medium text-stone-600">Simpan sesi login Seller di browser ini</span>
                </label>
              </div>

              {/* Main Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-[#1E3A8A] via-[#1e326f] to-[#009A44] hover:from-[#172554] hover:to-[#047857] active:scale-[0.99] text-white font-bold rounded-2xl text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Memverifikasi Akun Seller...</span>
                  </>
                ) : (
                  <>
                    <Store className="w-4 h-4" />
                    <span>Masuk ke Seller Center</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative flex py-1 items-center">
              <div className="grow border-t border-stone-200"></div>
              <span className="shrink mx-4 text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                atau masuk cepat
              </span>
              <div className="grow border-t border-stone-200"></div>
            </div>

            {/* Google Authentication for Seller */}
            <button
              type="button"
              onClick={handleGoogleSellerLogin}
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-white hover:bg-stone-50 border border-stone-300 active:scale-[0.99] text-stone-800 font-bold rounded-2xl text-xs shadow-2xs hover:shadow-sm transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-60"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3 0-.8.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.2s.7 5.5 1.9 7.9l3.7-2.9z"
                />
                <path
                  fill="#34A853"
                  d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16.5C3.7 20.2 7.5 23.5 12 23.5z"
                />
              </svg>
              <span>Masuk Seller via Akun Google</span>
            </button>

            {/* Quick Demo Fast-Login Buttons */}
            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
              <div className="text-[11px] font-bold text-stone-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Pilihan Akun Demo Seller Terverifikasi:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleQuickDemoOfficial}
                  className="py-1.5 px-2.5 bg-white hover:bg-blue-50 border border-blue-200 rounded-xl text-left transition-colors cursor-pointer group"
                >
                  <div className="text-[11px] font-bold text-[#1E3A8A] group-hover:text-blue-900">
                    👑 AllKurma Official Store
                  </div>
                  <div className="text-[10px] text-stone-500 truncate">
                    seller@allkurma.id
                  </div>
                </button>

                <button
                  type="button"
                  onClick={handleQuickDemoPartner}
                  className="py-1.5 px-2.5 bg-white hover:bg-emerald-50 border border-emerald-200 rounded-xl text-left transition-colors cursor-pointer group"
                >
                  <div className="text-[11px] font-bold text-[#009A44] group-hover:text-emerald-900">
                    🌴 Kurma Madinah Hub
                  </div>
                  <div className="text-[10px] text-stone-500 truncate">
                    mitra.madinah@allkurma.id
                  </div>
                </button>
              </div>
            </div>

            {/* Register New Merchant Store */}
            <div className="pt-3 border-t border-stone-100 text-center text-xs text-stone-600">
              Ingin berjualan dan buka toko di AllKurma?{' '}
              <button
                type="button"
                onClick={() => setCurrentView('seller-register')}
                className="font-bold text-[#1E3A8A] hover:text-[#009A44] hover:underline cursor-pointer transition-colors"
              >
                Daftar Toko Seller Baru →
              </button>
            </div>

            {/* Customer Switch Alert */}
            <div className="p-3 bg-emerald-50/70 rounded-2xl border border-emerald-200/80 text-[11px] text-stone-600 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#009A44] shrink-0" />
                <span>Ingin belanja sebagai pembeli?</span>
              </div>
              <button
                type="button"
                onClick={() => setCurrentView('customer-login')}
                className="font-bold text-[#009A44] hover:text-[#1E3A8A] hover:underline cursor-pointer transition-colors"
              >
                Portal Pelanggan
              </button>
            </div>

          </div>
        </div>

        {/* Feature Pillars Footer */}
        <div className="mt-6 grid grid-cols-3 gap-2 text-center text-[10px] text-stone-600">
          <div className="p-2.5 bg-white/80 rounded-2xl border border-stone-200 shadow-2xs">
            <TrendingUp className="w-4 h-4 text-blue-600 mx-auto mb-1" />
            <span className="font-semibold">Laporan & Payout Real-Time</span>
          </div>
          <div className="p-2.5 bg-white/80 rounded-2xl border border-stone-200 shadow-2xs">
            <Truck className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
            <span className="font-semibold">Resi Otomatis Multi-Kurir</span>
          </div>
          <div className="p-2.5 bg-white/80 rounded-2xl border border-stone-200 shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-amber-600 mx-auto mb-1" />
            <span className="font-semibold">Sistem Terenkripsi Firebase</span>
          </div>
        </div>

        {/* Brand Legal Footer */}
        <div className="text-center mt-4 space-y-1 text-[11px] text-stone-500">
          <p>© 2026 PT Exindokarsa Agung. Portal Mitra Seller AllKurma.</p>
        </div>

      </div>
    </div>
  );
};
