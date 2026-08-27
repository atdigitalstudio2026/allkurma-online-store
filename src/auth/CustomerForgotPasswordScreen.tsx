import React, { useState } from 'react';
import { 
  Mail, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  ChevronLeft, 
  ShieldCheck, 
  Info 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { authService, validateEmail } from '../services/authService';
import { SRALogo } from '../components/common/SRALogo';

export const CustomerForgotPasswordScreen: React.FC = () => {
  const { setCurrentView, showToast } = useApp();

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!validateEmail(email)) {
      setErrorMessage('Format alamat email tidak valid. Pastikan penulisan benar.');
      return;
    }

    setIsLoading(true);

    try {
      await authService.forgotPassword(email);
      setIsSuccess(true);
      showToast('Tautan atur ulang kata sandi berhasil dikirimkan ke email Anda.', 'success');
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal mengirim email reset. Mohon periksa kembali.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-stone-100/90 py-8 px-4 sm:px-6 flex items-center justify-center font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="w-full max-w-md">
        
        {/* Back Link */}
        <button
          onClick={() => setCurrentView('customer-login')}
          className="mb-4 inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-[#1E3A8A] transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Kembali ke Halaman Masuk</span>
        </button>

        {/* Main Card */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden">
          
          {/* Card Header & Brand */}
          <div className="p-6 sm:p-7 bg-gradient-to-br from-[#1E3A8A] via-[#1e326f] to-[#009A44] text-white text-center relative overflow-hidden">
            <div className="inline-flex items-center justify-center p-2.5 rounded-2xl bg-white shadow-lg mb-2.5 border border-emerald-100">
              <SRALogo size="sm" variant="stacked" showSubtitle={false} />
            </div>
            
            <h1 className="text-xl font-bold tracking-tight text-white font-['Plus_Jakarta_Sans',sans-serif]">
              Lupa Kata Sandi Akun?
            </h1>
            <p className="text-xs text-blue-100/90 mt-1">
              Masukkan email yang terdaftar pada SRA ALLKURMA untuk menerima instruksi pemulihan
            </p>
          </div>

          {/* Form / Result Body */}
          <div className="p-6 sm:p-7 space-y-4">

            {isSuccess ? (
              <div className="space-y-4 text-center py-2 animate-in fade-in zoom-in-95">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-[#009A44] flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div className="space-y-1.5">
                  <h3 className="font-bold text-base text-stone-900">
                    Instruksi Reset Terkirim
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Jika email <strong className="text-stone-900">{email}</strong> terdaftar di sistem SRA ALLKURMA, Anda akan menerima email dengan tautan untuk mengatur ulang kata sandi.
                  </p>
                </div>

                <div className="p-3 bg-blue-50/80 rounded-2xl border border-blue-200/70 text-left text-xs text-[#1E3A8A] flex items-start gap-2">
                  <Info className="w-4 h-4 text-[#1E3A8A] shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    Periksa juga folder <em>Spam</em> atau <em>Promosi</em> jika email belum muncul di kotak masuk Anda dalam 2 menit.
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setCurrentView('customer-login')}
                    className="w-full py-3 px-4 bg-gradient-to-r from-[#1E3A8A] to-[#009A44] hover:from-[#172554] hover:to-[#047857] text-white font-bold rounded-2xl text-xs shadow-md transition-all cursor-pointer"
                  >
                    Kembali ke Halaman Masuk
                  </button>
                </div>
              </div>
            ) : (
              <>
                {errorMessage && (
                  <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-red-700 text-xs animate-in fade-in">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                    <div className="flex-1 leading-relaxed">
                      {errorMessage}
                    </div>
                  </div>
                )}

                <form onSubmit={handleResetSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">
                      Alamat Email Terdaftar <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="nama@email.com"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#009A44]/40 focus:border-[#009A44] transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-4 bg-gradient-to-r from-[#1E3A8A] to-[#009A44] hover:from-[#172554] hover:to-[#047857] active:scale-[0.99] text-white font-bold rounded-2xl text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Mengirimkan Tautan...</span>
                      </>
                    ) : (
                      <>
                        <span>Kirim Tautan Atur Ulang</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                <div className="pt-3 border-t border-stone-100 text-center text-xs text-stone-600">
                  Ingat kata sandi Anda?{' '}
                  <button
                    type="button"
                    onClick={() => setCurrentView('customer-login')}
                    className="font-bold text-[#1E3A8A] hover:text-[#009A44] hover:underline cursor-pointer transition-colors"
                  >
                    Masuk kembali
                  </button>
                </div>
              </>
            )}

          </div>
        </div>

        {/* Security Legal Footer */}
        <div className="text-center mt-6 text-[11px] text-stone-500">
          <p>© 2026 PT Exindokarsa Agung. Perlindungan Keamanan Akun.</p>
        </div>

      </div>
    </div>
  );
};
