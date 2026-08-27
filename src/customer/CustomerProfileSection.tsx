import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Camera, 
  Save, 
  Award, 
  Calendar,
  Building2,
  CheckCircle2,
  Lock,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { updateUserProfile } from '../firebase/db';

export const CustomerProfileSection: React.FC = () => {
  const { user, setUser, showToast } = useApp();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [avatar, setAvatar] = useState(user.avatar);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const updatedData = {
        name: name.trim(),
        phone: phone.trim(),
        avatar: avatar.trim()
      };

      await updateUserProfile(user.id, updatedData);
      
      const newProfile = {
        ...user,
        ...updatedData
      };
      
      setUser(newProfile);
      localStorage.setItem('allkurma_user', JSON.stringify(newProfile));
      showToast('Profil customer berhasil diperbarui!', 'success');
    } catch (error) {
      showToast('Gagal menyimpan profil.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
        <div>
          <h2 className="text-xl font-bold text-stone-900 font-['Playfair_Display',serif]">
            Profil Saya
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Kelola informasi data pribadi dan akun pembeli resmi ALLKURMA Anda.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-full font-bold flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-amber-700" />
            <span>Tier: Member {user.tier}</span>
          </span>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSaveProfile} className="space-y-6">
        
        {/* Avatar & Info Banner */}
        <div className="flex flex-col sm:flex-row items-center gap-5 p-4 bg-stone-50 rounded-2xl border border-stone-200/70">
          <div className="relative">
            <img 
              src={avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'} 
              alt={user.name} 
              className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
            />
            <button
              type="button"
              onClick={() => {
                const url = prompt('Masukkan URL foto profil baru:', avatar);
                if (url) setAvatar(url);
              }}
              className="absolute bottom-0 right-0 p-1.5 bg-amber-800 hover:bg-amber-900 text-white rounded-full shadow-md transition-all cursor-pointer"
              title="Ubah Foto Profil"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="text-center sm:text-left space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-1.5">
              <h3 className="font-bold text-base text-stone-900">{user.name}</h3>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-xs text-stone-500">{user.email}</p>
            <p className="text-[11px] text-amber-800 font-semibold flex items-center justify-center sm:justify-start gap-1">
              <Sparkles className="w-3 h-3 text-amber-600" />
              <span>{user.rewardPoints.toLocaleString('id-ID')} Poin Reward ALLKURMA</span>
            </p>
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">
              Nama Lengkap
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
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-800/40 focus:border-amber-800 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">
              Nomor WhatsApp / HP
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
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-800/40 focus:border-amber-800 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">
              Alamat Email (Akun Utama)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                disabled
                value={email}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 bg-stone-100 text-sm text-stone-500 cursor-not-allowed"
              />
            </div>
            <span className="text-[10px] text-stone-400 mt-1 block">Email terhubung dengan kredensial Firebase Auth Anda</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">
              Role Hak Akses
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="text"
                disabled
                value="Customer / Pelanggan Terverifikasi"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 bg-stone-100 text-sm text-amber-900 font-semibold cursor-not-allowed"
              />
            </div>
            <span className="text-[10px] text-stone-400 mt-1 block">Akun terdaftar di PT Exindokarsa Agung</span>
          </div>
        </div>

        {/* Action Save Button */}
        <div className="flex justify-end pt-3">
          <button
            type="submit"
            disabled={isSaving}
            className="py-2.5 px-6 bg-amber-800 hover:bg-amber-900 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {isSaving ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Simpan Perubahan</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
};
