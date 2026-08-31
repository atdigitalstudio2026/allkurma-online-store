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
    sellerStore,
    isEmailAuthorizedSeller
  } = useApp();

  const [identifier, setIdentifier] = useState('seller@allkurma.id');
  const [password, setPassword] = useState('seller123');
  const [sellerPin, setSellerPin] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
      // 1. Authenticate with Firebase Email Auth
      const { profile } = await authService.loginWithEmail(identifier, password);
      
      const authEmail = profile.email || identifier;
      
      // 2. Strict Whitelist Check: verify if email is registered as authorized staff
      if (!isEmailAuthorizedSeller(authEmail)) {
        await authService.logout();
        setErrorMessage(
          `Akses Ditolak: Email "${authEmail}" tidak terdaftar sebagai staf / pengelola resmi AllKurma. ` +
          `Hanya akun yang telah didaftarkan oleh Administrator di menu Pengaturan Toko yang diizinkan masuk.`
        );
        showToast('Akses Ditolak: Akun Anda tidak terdaftar sebagai staf seller resmi.', 'error');
        return;
      }

      // 3. Enforce official seller profile
      const staffInfo = (sellerStore.authorizedStaff || []).find(
        s => s.email.trim().toLowerCase() === authEmail.trim().toLowerCase()
      );

      const sellerProfile: UserProfile = {
        ...profile,
        name: staffInfo?.name || profile.name || 'Staff Toko AllKurma',
        role: 'seller',
        companyName: sellerStore.storeName || 'AllKurma Official Store',
        tier: 'Platinum'
      };

      setUser(sellerProfile);
      if (rememberMe) {
        localStorage.setItem('allkurma_user', JSON.stringify(sellerProfile));
      }
      showToast(`Selamat datang di Seller Center AllKurma, ${sellerProfile.name}!`, 'success');
      setCurrentView('seller-dashboard');
    } catch (err: any) {
      const errMsg = err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password'
        ? 'Email toko atau kata sandi seller tidak sesuai. Silakan periksa kembali.'
        : err.message || 'Gagal masuk akun seller.';
      setErrorMessage(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSellerLogin = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const { profile } = await authService.loginWithGoogle();
      const googleEmail = profile.email;

      // Strict Whitelist Check: verify if Google Email is registered as authorized seller staff
      if (!isEmailAuthorizedSeller(googleEmail)) {
        await authService.logout();
        setErrorMessage(
          `Akses Ditolak: Akun Google "${googleEmail}" belum terdaftar sebagai staf resmi AllKurma. ` +
          `Toko ini eksklusif milik AllKurma dan hanya dapat diakses oleh email staf yang didaftarkan oleh Admin di Pengaturan Seller.`
        );
        showToast('Akses Ditolak: Akun Google Anda tidak terdaftar di staf seller.', 'error');
        return;
      }

      const staffInfo = (sellerStore.authorizedStaff || []).find(
        s => s.email.trim().toLowerCase() === googleEmail.trim().toLowerCase()
      );

      const sellerProfile: UserProfile = {
        ...profile,
        name: staffInfo?.name || profile.name || 'Staff Toko AllKurma',
        role: 'seller',
        companyName: sellerStore.storeName || 'AllKurma Official Store',
        tier: 'Platinum'
      };
      setUser(sellerProfile);
      localStorage.setItem('allkurma_user', JSON.stringify(sellerProfile));
      showToast(`Login Google Staf Berhasil! Selamat datang, ${sellerProfile.name}`, 'success');
      setCurrentView('seller-dashboard');
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal masuk dengan Akun Google Seller.');
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
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Portal Internal Staf Toko AllKurma</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-['Playfair_Display',serif]">
              Seller Center & Manajemen Toko
            </h1>
            <p className="text-xs text-blue-200/90 mt-1 max-w-sm mx-auto leading-relaxed">
              Khusus pengelola & staf resmi AllKurma (PT Exindokarsa Agung). Akses login dibatasi berdasarkan otorisasi Administrator.
            </p>
          </div>

          {/* Form Body */}
          <div className="p-6 sm:p-8 space-y-5">

            {/* Whitelist Security Notice */}
            <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 shrink-0 text-amber-700 mt-0.5" />
              <div className="leading-relaxed">
                <span className="font-bold">Keamanan Akses Staf:</span> Hanya akun email (Email Toko / Akun Google Staf) yang telah didaftarkan oleh Super Admin di menu <strong>Pengaturan Toko &gt; Manajemen Staf</strong> yang diizinkan masuk.
              </div>
            </div>

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

            {/* Staff Registration Info */}
            <div className="pt-3 border-t border-stone-100 text-center text-xs text-stone-600">
              Belum memiliki izin akses staf toko?{' '}
              <button
                type="button"
                onClick={() => {
                  showToast('Pendaftaran staf baru hanya dapat dilakukan oleh Super Admin dari Dashboard Pengaturan Toko.', 'info');
                }}
                className="font-bold text-[#1E3A8A] hover:text-[#009A44] hover:underline cursor-pointer transition-colors"
              >
                Panduan Akses Staf Toko ℹ️
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
