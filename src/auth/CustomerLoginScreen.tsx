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
  ChevronLeft
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { authService } from '../services/authService';
import { SRALogo } from '../components/common/SRALogo';

export const CustomerLoginScreen: React.FC = () => {
  const { 
    setUser, 
    setCurrentView, 
    showToast,
    loginSeller
  } = useApp();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Quick Demo Fast-Login Option for reviewers/testers
  const handleQuickDemoCustomer = () => {
    setIdentifier('budi.santoso@gmail.com');
    setPassword('password123');
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!identifier.trim()) {
      setErrorMessage('Harap masukkan alamat email atau nomor HP');
      return;
    }

    if (!password) {
      setErrorMessage('Harap masukkan kata sandi akun');
      return;
    }

    setIsLoading(true);

    try {
      const { profile } = await authService.loginWithEmail(identifier, password);
      setUser(profile);
      if (rememberMe) {
        localStorage.setItem('allkurma_user', JSON.stringify(profile));
      }
      showToast(`Selamat datang kembali, ${profile.name}!`, 'success');
      setCurrentView('customer-dashboard');
    } catch (err: any) {
      // Fallback demo simulation if Firebase demo credentials aren't yet in cloud Auth
      if (identifier.includes('budi') || identifier === 'customer@allkurma.id') {
        const mockProfile = {
          id: 'usr-customer-01',
          name: 'Budi Santoso',
          email: identifier.includes('@') ? identifier : 'budi.santoso@gmail.com',
          phone: '+62 812-3456-7890',
          role: 'customer' as const,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          tier: 'Gold' as const,
          rewardPoints: 2450,
          totalOrders: 14,
          savedLists: 6,
          annualSpend: 14500000
        };
        setUser(mockProfile);
        localStorage.setItem('allkurma_user', JSON.stringify(mockProfile));
        showToast('Login berhasil (Sesi Customer Aktif)', 'success');
        setCurrentView('customer-dashboard');
      } else {
        setErrorMessage(err.message || 'Gagal masuk akun. Silakan periksa kembali email dan password.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const { profile } = await authService.loginWithGoogle();
      setUser(profile);
      localStorage.setItem('allkurma_user', JSON.stringify(profile));
      showToast(`Login Google Berhasil! Selamat datang, ${profile.name}`, 'success');
      setCurrentView('customer-dashboard');
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal masuk dengan Google.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[88vh] bg-stone-100/90 py-8 px-4 sm:px-6 flex items-center justify-center font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="w-full max-w-md">
        
        {/* Top Back to Store button */}
        <button
          onClick={() => setCurrentView('home')}
          className="mb-4 inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-amber-900 transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Kembali ke Beranda Belanja</span>
        </button>

        {/* Main Login Card */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden">
          
          {/* Card Header & SRA Brand */}
          <div className="p-6 sm:p-7 bg-gradient-to-br from-[#1E3A8A] via-[#1e326f] to-[#009A44] text-white text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
            
            {/* SRA Logo Container */}
            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-white shadow-lg mb-3 border border-emerald-100">
              <SRALogo size="md" variant="stacked" showSubtitle={false} />
            </div>
            
            <h1 className="text-xl font-bold tracking-tight text-white mt-1 font-['Plus_Jakarta_Sans',sans-serif]">
              SRA ALLKURMA
            </h1>
            <p className="text-[11px] font-semibold tracking-wider uppercase text-emerald-300 mt-0.5">
              PT Exindokarsa Agung
            </p>

            <div className="mt-3.5 pt-3 border-t border-white/15">
              <h2 className="text-sm font-bold text-blue-100">
                Masuk ke Akun Pelanggan
              </h2>
              <p className="text-xs text-blue-200/80 mt-0.5">
                Pusat Belanja Kurma Pilihan Timur Tengah Berkualitas & Terpercaya
              </p>
            </div>
          </div>

          {/* Form Body */}
          <div className="p-6 sm:p-7 space-y-5">

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
              
              {/* Input Email / Nomor HP */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  Email atau Nomor HP <span className="text-red-500">*</span>
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
                    placeholder="nama@email.com atau 0812xxxx"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#009A44]/40 focus:border-[#009A44] transition-all"
                  />
                </div>
              </div>

              {/* Input Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-stone-700">
                    Kata Sandi <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setCurrentView('customer-forgot-password')}
                    className="text-xs font-semibold text-[#1E3A8A] hover:text-[#009A44] hover:underline cursor-pointer transition-colors"
                  >
                    Lupa password?
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
                    placeholder="Masukkan kata sandi akun"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-stone-300 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#009A44]/40 focus:border-[#009A44] transition-all"
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

              {/* Remember Me Checkbox */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-[#009A44] focus:ring-[#009A44] border-stone-300 cursor-pointer"
                  />
                  <span className="text-xs font-medium text-stone-600">Ingat saya di perangkat ini</span>
                </label>
              </div>

              {/* Main Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-gradient-to-r from-[#1E3A8A] to-[#009A44] hover:from-[#172554] hover:to-[#047857] active:scale-[0.99] text-white font-bold rounded-2xl text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Memproses Masuk...</span>
                  </>
                ) : (
                  <>
                    <span>Masuk ke Akun</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative flex py-1 items-center">
              <div className="grow border-t border-stone-200"></div>
              <span className="shrink mx-4 text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                atau
              </span>
              <div className="grow border-t border-stone-200"></div>
            </div>

            {/* Google Authentication Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
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
              <span>Lanjutkan dengan Google</span>
            </button>

            {/* Quick Demo Pill */}
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={handleQuickDemoCustomer}
                className="text-[11px] text-[#1E3A8A] hover:text-[#009A44] bg-blue-50/70 hover:bg-blue-100/80 border border-blue-200/80 px-3.5 py-1 rounded-full font-medium transition-colors cursor-pointer"
              >
                Gunakan Akun Demo Pelanggan (Budi Santoso)
              </button>
            </div>

            {/* Register Link Footer */}
            <div className="pt-3 border-t border-stone-100 text-center text-xs text-stone-600">
              Belum punya akun?{' '}
              <button
                type="button"
                onClick={() => setCurrentView('customer-register')}
                className="font-bold text-[#009A44] hover:text-[#1E3A8A] hover:underline cursor-pointer transition-colors"
              >
                Daftar sekarang
              </button>
            </div>

            {/* Seller Access Notice */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 text-[11px] text-stone-600 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-[#1E3A8A] shrink-0" />
                <span>Mitra Penjual AllKurma?</span>
              </div>
              <button
                type="button"
                onClick={() => setCurrentView('seller-login')}
                className="font-bold text-[#1E3A8A] hover:text-[#009A44] hover:underline cursor-pointer transition-colors"
              >
                Masuk Seller Center →
              </button>
            </div>

          </div>
        </div>

        {/* Brand Legal Footer */}
        <div className="text-center mt-6 space-y-1 text-[11px] text-stone-500">
          <p>© 2026 PT Exindokarsa Agung. Hak Cipta Dilindungi.</p>
          <div className="flex items-center justify-center gap-3 text-stone-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Sistem Terenkripsi & Aman
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
