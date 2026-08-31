import React, { useState } from 'react';
import { 
  User, 
  Store, 
  Mail, 
  Lock, 
  Phone, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  X, 
  Building2, 
  ArrowRight,
  Eye,
  EyeOff,
  ShoppingBag,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    authModalMode, 
    setAuthModalMode,
    loginCustomer,
    registerCustomer,
    loginSeller,
    switchRole,
    user,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'customer' | 'seller'>(
    authModalMode === 'seller_login' ? 'seller' : 'customer'
  );
  const [customerSubMode, setCustomerSubMode] = useState<'login' | 'register'>(
    authModalMode === 'customer_register' ? 'register' : 'login'
  );

  // Form states
  const [customerEmail, setCustomerEmail] = useState('budi.santoso@gmail.com');
  const [customerPassword, setCustomerPassword] = useState('password123');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Seller form states
  const [sellerEmail, setSellerEmail] = useState('seller@allkurma.id');
  const [sellerPin, setSellerPin] = useState('8888');

  if (!isAuthModalOpen) return null;

  const handleCustomerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerEmail.trim()) {
      showToast('Harap masukkan alamat email valid', 'error');
      return;
    }
    loginCustomer(customerEmail);
    setIsAuthModalOpen(false);
  };

  const handleCustomerRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim()) {
      showToast('Harap lengkapi nama dan email pendaftaran', 'error');
      return;
    }
    registerCustomer(regName, regEmail, regPhone || '+62 812-3456-7890');
    setIsAuthModalOpen(false);
  };

  const handleSellerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginSeller(sellerEmail);
    setIsAuthModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl animate-in zoom-in-95 my-8 border border-stone-200">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-br from-amber-900 via-stone-900 to-amber-950 text-white relative">
          <button 
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 font-bold font-['Playfair_Display',serif]">
              AK
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-300">
              Autentikasi Akun
            </span>
          </div>
          <h2 className="text-xl font-bold font-['Playfair_Display',serif] text-white">
            Selamat Datang di AllKurma
          </h2>
          <p className="text-xs text-stone-300 mt-1">
            Pilih jenis akun sesuai kebutuhan Anda: Belanja Kurma atau Kelola Toko Penjual.
          </p>
        </div>

        {/* Top Role Selector Tabs */}
        <div className="grid grid-cols-2 p-2 bg-stone-100 border-b border-stone-200 gap-1 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('customer')}
            className={`py-2.5 px-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'customer' 
                ? 'bg-white text-amber-900 shadow-sm border border-stone-200' 
                : 'text-stone-600 hover:text-stone-900 hover:bg-white/50'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-amber-700" />
            <span>Akun Pembeli</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('seller')}
            className={`py-2.5 px-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'seller' 
                ? 'bg-amber-800 text-white shadow-sm' 
                : 'text-stone-600 hover:text-stone-900 hover:bg-white/50'
            }`}
          >
            <Store className="w-4 h-4 text-amber-300" />
            <span>Toko Seller</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4">

          {/* TAB 1: CUSTOMER (USER) */}
          {activeTab === 'customer' && (
            <div className="space-y-4">
              {/* Customer Mode Switcher: Login vs Register */}
              <div className="flex border-b border-stone-200 pb-1 gap-4 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setCustomerSubMode('login')}
                  className={`pb-2 border-b-2 transition-all cursor-pointer ${
                    customerSubMode === 'login' 
                      ? 'border-amber-800 text-amber-900' 
                      : 'border-transparent text-stone-400 hover:text-stone-700'
                  }`}
                >
                  Masuk Akun Pembeli
                </button>
                <button
                  type="button"
                  onClick={() => setCustomerSubMode('register')}
                  className={`pb-2 border-b-2 transition-all cursor-pointer ${
                    customerSubMode === 'register' 
                      ? 'border-amber-800 text-amber-900' 
                      : 'border-transparent text-stone-400 hover:text-stone-700'
                  }`}
                >
                  Daftar Akun Baru
                </button>
              </div>

              {/* Notice regarding role limits */}
              <div className="p-2.5 bg-amber-50 rounded-2xl border border-amber-200/70 text-[11px] text-amber-950 flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <p>
                  <strong>Akun Pembeli:</strong> Akses penuh belanja kurma, klaim promo voucher diskon, pantau resi pengiriman, dan simpan alamat. <em>(Tidak dapat melihat menu Toko Seller)</em>.
                </p>
              </div>

              {/* Sub-mode: Customer Login */}
              {customerSubMode === 'login' && (
                <form onSubmit={handleCustomerLogin} className="space-y-3">
                  <div>
                    <label className="text-[11px] font-bold text-stone-700 block mb-1">
                      Alamat Email Pembeli
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="contoh@gmail.com"
                        className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-700/30 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-stone-700 block mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={customerPassword}
                        onChange={(e) => setCustomerPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-10 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-700/30 focus:bg-white transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-amber-800 hover:bg-amber-900 active:scale-98 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Masuk sebagai Pembeli</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}

              {/* Sub-mode: Customer Register */}
              {customerSubMode === 'register' && (
                <form onSubmit={handleCustomerRegister} className="space-y-3">
                  <div>
                    <label className="text-[11px] font-bold text-stone-700 block mb-1">
                      Nama Lengkap Pembeli
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="Nama Lengkap Anda"
                        className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-700/30 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-stone-700 block mb-1">
                      Alamat Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="email@gmail.com"
                        className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-700/30 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-stone-700 block mb-1">
                      Nomor WhatsApp / HP
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="0812-3456-7890"
                        className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-700/30 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-stone-700 block mb-1">
                      Buat Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        required
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="Minimal 6 karakter"
                        className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-700/30 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-amber-800 hover:bg-amber-900 active:scale-98 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Daftar Akun Pembeli Baru</span>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 2: SELLER PORTAL */}
          {activeTab === 'seller' && (
            <div className="space-y-4">
              <div className="p-3 bg-stone-900 text-white rounded-2xl space-y-1.5">
                <div className="flex items-center gap-1.5 text-amber-300 font-bold text-xs">
                  <Store className="w-4 h-4" />
                  <span>Portal Seller AllKurma Official</span>
                </div>
                <p className="text-[11px] text-stone-300 leading-relaxed">
                  Akses eksklusif untuk penjual. Kelola produk kurma, terima orderan pembeli, konfigurasi kurir & ongkir, atur auto-reply pesan, serta tarik saldo penjualan.
                </p>
              </div>

              <form onSubmit={handleSellerLogin} className="space-y-3">
                <div>
                  <label className="text-[11px] font-bold text-stone-700 block mb-1">
                    Email Resmi Seller / Toko
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={sellerEmail}
                      onChange={(e) => setSellerEmail(e.target.value)}
                      placeholder="seller@allkurma.id"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-700/30 focus:bg-white transition-all font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-stone-700 block mb-1">
                    PIN / Password Seller Center
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={sellerPin}
                      onChange={(e) => setSellerPin(e.target.value)}
                      placeholder="••••"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-700/30 focus:bg-white transition-all font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 active:scale-98 text-amber-300 text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-amber-400/30"
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>Masuk ke Dashboard Seller (Toko)</span>
                </button>
              </form>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
