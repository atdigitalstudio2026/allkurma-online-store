import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  User, 
  Phone, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  ChevronLeft,
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { authService, validateEmail, validateIndonesianPhone } from '../services/authService';
import { SRALogo } from '../components/common/SRALogo';

export const CustomerRegisterScreen: React.FC = () => {
  const { setUser, setCurrentView, showToast } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Field validation checks for visual cues
  const isPassLengthValid = password.length >= 8;
  const isPassMatch = password.length > 0 && password === confirmPassword;

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // 1. Validation: Name
    if (!name.trim()) {
      setErrorMessage('Harap masukkan nama lengkap Anda.');
      return;
    }

    // 2. Validation: Email
    if (!validateEmail(email)) {
      setErrorMessage('Format alamat email tidak valid (contoh: nama@domain.com).');
      return;
    }

    // 3. Validation: Phone
    if (!validateIndonesianPhone(phone)) {
      setErrorMessage('Nomor HP tidak valid. Gunakan format nomor Indonesia (contoh: 08123456789 atau +628123456789).');
      return;
    }

    // 4. Validation: Password min 8 chars
    if (password.length < 8) {
      setErrorMessage('Kata sandi harus terdiri dari minimal 8 karakter.');
      return;
    }

    // 5. Validation: Password confirmation match
    if (password !== confirmPassword) {
      setErrorMessage('Konfirmasi kata sandi tidak cocok dengan kata sandi yang dimasukkan.');
      return;
    }

    // 6. Validation: Terms & Privacy agreement
    if (!agreeTerms) {
      setErrorMessage('Anda harus menyetujui Syarat & Ketentuan serta Kebijakan Privasi ALLKURMA.');
      return;
    }

    setIsLoading(true);

    try {
      const { profile } = await authService.registerCustomer(name, email, phone, password);
      setUser(profile);
      localStorage.setItem('allkurma_user', JSON.stringify(profile));
      showToast(`Pendaftaran Berhasil! Selamat datang di ALLKURMA, ${profile.name}. Bonus 250 Poin telah ditambahkan!`, 'success');
      setCurrentView('customer-dashboard');
    } catch (err: any) {
      const errMsg = err.code === 'auth/email-already-in-use'
        ? 'Email ini sudah terdaftar. Silakan masuk menggunakan akun Anda atau gunakan email lain.'
        : err.code === 'auth/weak-password'
        ? 'Kata sandi terlalu lemah. Gunakan minimal 6-8 karakter kombinasi huruf dan angka.'
        : err.message || 'Pendaftaran akun gagal. Silakan periksa kembali data Anda.';
      setErrorMessage(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] bg-stone-100/90 py-8 px-4 sm:px-6 flex items-center justify-center font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="w-full max-w-lg">
        
        {/* Back Link */}
        <button
          onClick={() => setCurrentView('customer-login')}
          className="mb-4 inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-[#1E3A8A] transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Kembali ke Halaman Masuk</span>
        </button>

        {/* Main Register Card */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden">
          
          {/* Card Header & SRA Brand */}
          <div className="p-6 sm:p-7 bg-gradient-to-br from-[#1E3A8A] via-[#1e326f] to-[#009A44] text-white text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="inline-flex items-center justify-center p-2.5 rounded-2xl bg-white shadow-lg mb-2.5 border border-emerald-100">
              <SRALogo size="sm" variant="stacked" showSubtitle={false} />
            </div>
            
            <h1 className="text-xl font-bold tracking-tight text-white font-['Plus_Jakarta_Sans',sans-serif]">
              Daftar Akun Baru
            </h1>
            <p className="text-[11px] font-semibold tracking-wider uppercase text-emerald-300 mt-0.5">
              SRA ALLKURMA • PT Exindokarsa Agung
            </p>

            <p className="text-xs text-blue-100/90 mt-2">
              Nikmati kurma pilihan terbaik, harga grosir spesial, dan reward poin belanja
            </p>
          </div>

          {/* Form Body */}
          <div className="p-6 sm:p-7 space-y-4">

            {/* Error Alert */}
            {errorMessage && (
              <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-red-700 text-xs animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                <div className="flex-1 leading-relaxed">
                  {errorMessage}
                </div>
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              
              {/* Field 1: Nama Lengkap */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Budi Santoso"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#009A44]/40 focus:border-[#009A44] transition-all"
                  />
                </div>
              </div>

              {/* Grid 2 Fields: Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Field 2: Email */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    Alamat Email <span className="text-red-500">*</span>
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

                {/* Field 3: Nomor HP */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    Nomor WhatsApp / HP <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="08123456789"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#009A44]/40 focus:border-[#009A44] transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Grid 2 Fields: Password & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Field 4: Password */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    Kata Sandi <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min. 8 karakter"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-stone-300 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#009A44]/40 focus:border-[#009A44] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-700 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Field 5: Konfirmasi Password */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    Ulangi Kata Sandi <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Ulangi kata sandi"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-stone-300 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#009A44]/40 focus:border-[#009A44] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-700 cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Password Requirement Indicators */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-[11px] space-y-1">
                <div className={`flex items-center gap-1.5 ${isPassLengthValid ? 'text-[#009A44] font-bold' : 'text-stone-500'}`}>
                  {isPassLengthValid ? <Check className="w-3.5 h-3.5 text-[#009A44] shrink-0" /> : <span className="w-1.5 h-1.5 rounded-full bg-stone-400 ml-1 mr-1" />}
                  <span>Minimal 8 karakter</span>
                </div>
                <div className={`flex items-center gap-1.5 ${isPassMatch ? 'text-[#009A44] font-bold' : 'text-stone-500'}`}>
                  {isPassMatch ? <Check className="w-3.5 h-3.5 text-[#009A44] shrink-0" /> : <span className="w-1.5 h-1.5 rounded-full bg-stone-400 ml-1 mr-1" />}
                  <span>Konfirmasi kata sandi cocok</span>
                </div>
              </div>

              {/* Field 6: Terms & Conditions Checkbox */}
              <div className="pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    required
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded text-[#009A44] focus:ring-[#009A44] border-stone-300 cursor-pointer shrink-0"
                  />
                  <span className="text-xs text-stone-600 leading-relaxed">
                    Saya menyetujui <strong className="text-stone-800">Syarat & Ketentuan</strong>, <strong className="text-stone-800">Kebijakan Privasi</strong> PT Exindokarsa Agung, serta menerima program reward belanja ALLKURMA.
                  </span>
                </label>
              </div>

              {/* Submit Register Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-gradient-to-r from-[#1E3A8A] to-[#009A44] hover:from-[#172554] hover:to-[#047857] active:scale-[0.99] text-white font-bold rounded-2xl text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed mt-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Mendaftarkan Akun Customer...</span>
                  </>
                ) : (
                  <>
                    <span>Daftar Sekarang</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Login Link Footer */}
            <div className="pt-4 border-t border-stone-100 text-center text-xs text-stone-600">
              Sudah memiliki akun?{' '}
              <button
                type="button"
                onClick={() => setCurrentView('customer-login')}
                className="font-bold text-[#1E3A8A] hover:text-[#009A44] hover:underline cursor-pointer transition-colors"
              >
                Masuk di sini
              </button>
            </div>

          </div>
        </div>

        {/* Security Legal Footer */}
        <div className="text-center mt-6 text-[11px] text-stone-500">
          <p>© 2026 PT Exindokarsa Agung. Seluruh hak cipta dilindungi.</p>
        </div>

      </div>
    </div>
  );
};
