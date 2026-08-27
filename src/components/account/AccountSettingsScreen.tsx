import React, { useState } from 'react';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  Building2, 
  Lock, 
  ShieldCheck, 
  Bell, 
  Save, 
  CheckCircle2 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AccountSettingsScreen: React.FC = () => {
  const { user, setCurrentView, showToast } = useApp();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone || '081298765432');
  const [companyName, setCompanyName] = useState(user.companyName || 'PT Berkah Mandiri Kurma');
  const [taxId, setTaxId] = useState(user.taxId || '01.234.567.8-012.000');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Pengaturan profil & informasi perpajakan berhasil diperbarui!', 'success');
  };

  return (
    <div className="pb-28 max-w-lg mx-auto bg-stone-50 min-h-screen">
      
      {/* Top Header */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setCurrentView('my-profile')}
          className="p-1.5 rounded-lg text-stone-700 hover:bg-stone-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <h1 className="text-sm font-bold text-stone-900 font-['Playfair_Display',serif]">
          Pengaturan Akun
        </h1>

        <div className="w-8" />
      </div>

      <form onSubmit={handleSave} className="p-4 space-y-4 text-xs">
        
        {/* Profile Information */}
        <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs space-y-3">
          <h2 className="font-bold text-xs text-stone-900 flex items-center gap-2">
            <User className="w-4 h-4 text-amber-800" />
            <span>Informasi Pribadi</span>
          </h2>

          <div>
            <label className="font-semibold text-stone-600 block mb-1">Nama Lengkap</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
            />
          </div>

          <div>
            <label className="font-semibold text-stone-600 block mb-1">Alamat Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
            />
          </div>

          <div>
            <label className="font-semibold text-stone-600 block mb-1">Nomor WhatsApp</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-mono"
            />
          </div>
        </div>

        {/* Business & Tax Information */}
        <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs space-y-3">
          <h2 className="font-bold text-xs text-stone-900 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-amber-800" />
            <span>Informasi Bisnis & e-Faktur Pajak</span>
          </h2>

          <div>
            <label className="font-semibold text-stone-600 block mb-1">Nama Perusahaan / Toko</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
            />
          </div>

          <div>
            <label className="font-semibold text-stone-600 block mb-1">NPWP / Tax ID</label>
            <input
              type="text"
              value={taxId}
              onChange={(e) => setTaxId(e.target.value)}
              className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-mono"
            />
          </div>
        </div>

        {/* Security & Password */}
        <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs space-y-3">
          <h2 className="font-bold text-xs text-stone-900 flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-800" />
            <span>Keamanan & Kata Sandi</span>
          </h2>

          <div>
            <label className="font-semibold text-stone-600 block mb-1">Kata Sandi Baru</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-amber-800 hover:bg-amber-900 active:scale-95 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Simpan Perubahan</span>
        </button>

      </form>

    </div>
  );
};
