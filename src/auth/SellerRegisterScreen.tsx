import React, { useState } from 'react';
import { 
  Store, 
  Building2, 
  Mail, 
  Lock, 
  Phone, 
  MapPin, 
  CreditCard, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ChevronLeft,
  Eye,
  EyeOff,
  Sparkles,
  PackageCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { authService, validateEmail, validateIndonesianPhone } from '../services/authService';
import { SRALogo } from '../components/common/SRALogo';
import { UserProfile } from '../types';
import confetti from 'canvas-confetti';

export const SellerRegisterScreen: React.FC = () => {
  const { 
    setUser, 
    setCurrentView, 
    showToast,
    updateSellerStore,
    addSellerStaff
  } = useApp();

  const [formData, setFormData] = useState({
    storeName: '',
    storeHandle: '',
    ownerName: '',
    email: '',
    phone: '',
    password: '',
    city: 'Jakarta Pusat',
    postalCode: '10110',
    fullAddress: '',
    productCategory: 'Kurma Premium & Madu Timur Tengah',
    bankName: 'BCA',
    accountNumber: '',
    holderName: '',
    agreeTerms: true
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.storeName.trim()) {
      setErrorMessage('Harap masukkan nama toko resmi Anda.');
      return;
    }

    if (!formData.ownerName.trim()) {
      setErrorMessage('Harap masukkan nama pemilik toko.');
      return;
    }

    if (!validateEmail(formData.email)) {
      setErrorMessage('Alamat email toko tidak valid.');
      return;
    }

    if (!validateIndonesianPhone(formData.phone)) {
      setErrorMessage('Nomor WhatsApp / HP tidak valid (Contoh: 08123456789).');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage('Kata sandi minimal 6 karakter.');
      return;
    }

    if (!formData.fullAddress.trim()) {
      setErrorMessage('Harap masukkan alamat gudang/toko untuk penjemputan kurir.');
      return;
    }

    if (!formData.agreeTerms) {
      setErrorMessage('Harap setujui Syarat & Ketentuan Mitra Seller AllKurma.');
      return;
    }

    setIsLoading(true);

    try {
      // 1. Try Firebase Auth registration
      let uid = `seller-${Date.now().toString(36)}`;
      try {
        const { profile } = await authService.registerCustomer(
          formData.ownerName,
          formData.email,
          formData.phone,
          formData.password
        );
        uid = profile.id;
      } catch (authErr) {
        console.warn('Firebase register fallback for seller:', authErr);
      }

      // 2. Build official Seller profile
      const newSellerProfile: UserProfile = {
        id: uid,
        name: formData.ownerName,
        email: formData.email.toLowerCase(),
        phone: formData.phone,
        role: 'seller',
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&auto=format&fit=crop&q=80',
        tier: 'Platinum',
        rewardPoints: 5000,
        totalOrders: 0,
        savedLists: 0,
        annualSpend: 0,
        companyName: formData.storeName,
        defaultAddressId: 'addr-01'
      };

      // 3. Update store profile in state
      updateSellerStore({
        storeName: formData.storeName,
        storeHandle: formData.storeHandle.toLowerCase().replace(/[^a-z0-9_]/g, '') || formData.storeName.toLowerCase().replace(/\s+/g, '_'),
        tagline: `Pusat Belanja ${formData.productCategory} Terpercaya`,
        description: `Toko Resmi ${formData.storeName} di Platform SRA ALLKURMA (PT Exindokarsa Agung). Melayani pesanan retail dan grosir berkualitas.`,
        city: formData.city,
        postalCode: formData.postalCode,
        fullAddress: formData.fullAddress,
        phone: formData.phone,
        email: formData.email,
        bankAccount: {
          bankName: formData.bankName,
          accountNumber: formData.accountNumber || '8801928374',
          holderName: formData.holderName || formData.ownerName,
          verified: true
        }
      });

      // 4. Authorize in staff whitelist
      addSellerStaff({
        name: formData.ownerName,
        email: formData.email.toLowerCase(),
        role: 'Super Admin Toko',
        phone: formData.phone,
        status: 'active'
      });

      setUser(newSellerProfile);
      localStorage.setItem('allkurma_user', JSON.stringify(newSellerProfile));

      // Celebration
      try {
        confetti({
          particleCount: 120,
          spread: 90,
          origin: { y: 0.6 }
        });
      } catch {}

      showToast(`Selamat! Toko "${formData.storeName}" berhasil didaftarkan dan diaktifkan.`, 'success');
      setCurrentView('seller-dashboard');
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal mendaftarkan toko seller. Silakan coba kembali.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] bg-stone-100/90 py-8 px-4 sm:px-6 flex items-center justify-center font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="w-full max-w-2xl">
        
        {/* Top Back Navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setCurrentView('seller-login')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-[#1E3A8A] transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Kembali ke Login Seller</span>
          </button>

          <button
            onClick={() => setCurrentView('home')}
            className="text-xs font-semibold text-stone-500 hover:text-stone-800 transition-colors"
          >
            Beranda AllKurma
          </button>
        </div>

        {/* Card Container */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden">
          
          {/* Header */}
          <div className="p-6 sm:p-7 bg-gradient-to-br from-[#0F172A] via-[#1E3A8A] to-[#009A44] text-white relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="p-3 rounded-2xl bg-white shadow-lg shrink-0">
                <SRALogo size="md" variant="stacked" showSubtitle={false} />
              </div>
              <div className="text-center sm:text-left">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 text-[10px] font-black uppercase tracking-wider mb-1">
                  Registrasi Mitra Merchant
                </span>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-['Playfair_Display',serif]">
                  Buka Toko Seller di AllKurma
                </h1>
                <p className="text-xs text-blue-200/90 mt-0.5">
                  Bergabunglah bersama ribuan mitra penjual kurma & produk Timur Tengah terpercaya se-Indonesia.
                </p>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleRegisterSubmit} className="p-6 sm:p-8 space-y-6">
            
            {/* Error Message */}
            {errorMessage && (
              <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-red-700 text-xs animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                <div className="flex-1 leading-relaxed">{errorMessage}</div>
              </div>
            )}

            {/* Section 1: Informasi Toko */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-stone-100 text-stone-900 font-bold text-sm">
                <Store className="w-4 h-4 text-[#1E3A8A]" />
                <span>1. Informasi Identitas Toko</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Nama Toko / Brand <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.storeName}
                    onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                    placeholder="Contoh: Toko Kurma Barokah"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#1E3A8A]/40 focus:border-[#1E3A8A] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Handle / Username Toko
                  </label>
                  <input
                    type="text"
                    value={formData.storeHandle}
                    onChange={(e) => setFormData({ ...formData, storeHandle: e.target.value })}
                    placeholder="kurmabarokah_store"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#1E3A8A]/40 focus:border-[#1E3A8A] focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Kategori Produk Utama
                  </label>
                  <select
                    value={formData.productCategory}
                    onChange={(e) => setFormData({ ...formData, productCategory: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#1E3A8A]/40 focus:border-[#1E3A8A] focus:outline-none bg-white"
                  >
                    <option value="Kurma Premium (Ajwa, Sukari, Medjool)">Kurma Premium (Ajwa, Sukari, Medjool)</option>
                    <option value="Kurma Grosir & Kemasan Karton">Kurma Grosir & Kemasan Karton</option>
                    <option value="Madu Arab & Herbal Thibbun Nabawi">Madu Arab & Herbal Thibbun Nabawi</option>
                    <option value="Hampers & Paket Oleh-Oleh Haji/Umroh">Hampers & Paket Oleh-Oleh Haji/Umroh</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2: Pemilik & Login */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-stone-100 text-stone-900 font-bold text-sm">
                <Building2 className="w-4 h-4 text-[#1E3A8A]" />
                <span>2. Kontak Pemilik & Keamanan Akun</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Nama Pemilik / PIC Toko <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.ownerName}
                    onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                    placeholder="Nama lengkap Anda"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#1E3A8A]/40 focus:border-[#1E3A8A] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Nomor WhatsApp Toko <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="081234567890"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#1E3A8A]/40 focus:border-[#1E3A8A] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Email Bisnis Seller <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="toko@domain.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#1E3A8A]/40 focus:border-[#1E3A8A] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Kata Sandi Akun Seller <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Minimal 6 karakter"
                      className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#1E3A8A]/40 focus:border-[#1E3A8A] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-700"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Alamat Gudang Asal Pengiriman */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-stone-100 text-stone-900 font-bold text-sm">
                <MapPin className="w-4 h-4 text-[#1E3A8A]" />
                <span>3. Lokasi Gudang / Pickup Ekspedisi</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Kota / Kabupaten Gudang</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#1E3A8A]/40 focus:border-[#1E3A8A] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Kode Pos Gudang</label>
                  <input
                    type="text"
                    required
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#1E3A8A]/40 focus:border-[#1E3A8A] focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Alamat Lengkap Gudang (Jalan, Nomor, Patokan) <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={formData.fullAddress}
                    onChange={(e) => setFormData({ ...formData, fullAddress: e.target.value })}
                    placeholder="Jl. Kurma Niaga No. 12, Kel. Tanah Abang, Jakarta Pusat"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#1E3A8A]/40 focus:border-[#1E3A8A] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Rekening Payout */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-stone-100 text-stone-900 font-bold text-sm">
                <CreditCard className="w-4 h-4 text-[#009A44]" />
                <span>4. Rekening Bank Penarikan Saldo Toko</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Nama Bank</label>
                  <select
                    value={formData.bankName}
                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#009A44]/40 focus:border-[#009A44] focus:outline-none bg-white"
                  >
                    <option value="BCA">Bank Central Asia (BCA)</option>
                    <option value="Mandiri">Bank Mandiri</option>
                    <option value="BSI">Bank Syariah Indonesia (BSI)</option>
                    <option value="BRI">Bank Rakyat Indonesia (BRI)</option>
                    <option value="BNI">Bank Negara Indonesia (BNI)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Nomor Rekening</label>
                  <input
                    type="text"
                    value={formData.accountNumber}
                    onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value.replace(/[^0-9]/g, '') })}
                    placeholder="8801928374"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#009A44]/40 focus:border-[#009A44] focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Nama Pemilik Rekening</label>
                  <input
                    type="text"
                    value={formData.holderName}
                    onChange={(e) => setFormData({ ...formData, holderName: e.target.value })}
                    placeholder="Sesuai buku tabungan"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#009A44]/40 focus:border-[#009A44] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Terms Agreement */}
            <div className="pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.agreeTerms}
                  onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                  className="w-4 h-4 mt-0.5 rounded text-[#1E3A8A] focus:ring-[#1E3A8A] border-stone-300 cursor-pointer"
                />
                <span className="text-xs text-stone-600 leading-relaxed">
                  Saya menyatakan bahwa informasi toko ini benar, serta menyetujui <strong>Syarat & Ketentuan Kemitraan Penjual</strong> PT Exindokarsa Agung.
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-[#1E3A8A] via-[#1e326f] to-[#009A44] hover:from-[#172554] hover:to-[#047857] active:scale-[0.99] text-white font-bold rounded-2xl text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Mendaftarkan Toko Seller...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Buka Toko & Aktifkan Seller Center</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Footer Login Link */}
            <div className="text-center text-xs text-stone-600">
              Sudah memiliki akun seller?{' '}
              <button
                type="button"
                onClick={() => setCurrentView('seller-login')}
                className="font-bold text-[#1E3A8A] hover:text-[#009A44] hover:underline cursor-pointer"
              >
                Masuk ke Seller Center
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
};
