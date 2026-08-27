import React from 'react';
import { 
  ShieldAlert, 
  Lock, 
  ArrowLeft, 
  Store, 
  User, 
  Home, 
  HelpCircle,
  Building2
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface AccessDeniedScreenProps {
  targetViewName?: string;
}

export const AccessDeniedScreen: React.FC<AccessDeniedScreenProps> = ({ targetViewName = 'Admin Command Center' }) => {
  const { user, setCurrentView, setIsAuthModalOpen, setAuthModalMode } = useApp();

  return (
    <div className="min-h-[85vh] bg-stone-100/90 py-12 px-4 flex items-center justify-center font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 border border-red-200/80 shadow-xl text-center space-y-5 animate-in zoom-in-95">
        
        {/* Shield Alert Icon */}
        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-3xl mx-auto flex items-center justify-center border border-red-200 shadow-inner">
          <ShieldAlert className="w-8 h-8 text-red-600" />
        </div>

        {/* Text Header */}
        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-red-700 bg-red-100/80 px-2.5 py-1 rounded-full">
            403 - Akses Ditolak
          </span>
          <h1 className="text-2xl font-bold font-['Playfair_Display',serif] text-stone-900">
            Akses Terbatas Administrator
          </h1>
          <p className="text-xs text-stone-600 leading-relaxed">
            Halaman <strong className="text-stone-900">{targetViewName}</strong> hanya dapat diakses oleh Administrator resmi <strong>PT Exindokarsa Agung</strong>.
          </p>
        </div>

        {/* Current User Role Notice */}
        <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 text-left text-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-stone-500 font-medium">Pengguna Saat Ini:</span>
            <span className="font-bold text-stone-900 truncate max-w-[180px]">{user.name}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-stone-500 font-medium">Role Hak Akses:</span>
            <span className="px-2 py-0.5 rounded-md font-bold text-[10px] bg-amber-100 text-amber-900">
              {user.role === 'customer' ? 'Customer / Pelanggan' : user.role}
            </span>
          </div>
          <div className="pt-2 border-t border-stone-200 text-[11px] text-stone-500 leading-relaxed">
            Akun Customer tidak memiliki izin untuk memodifikasi inventaris, harga, atau data internal perusahaan.
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <button
            onClick={() => setCurrentView('customer-dashboard')}
            className="w-full py-3 bg-amber-800 hover:bg-amber-900 active:scale-95 text-white font-bold rounded-2xl text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <User className="w-4 h-4" />
            <span>Kembali ke Dashboard Customer</span>
          </button>

          <button
            onClick={() => setCurrentView('home')}
            className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 active:scale-95 text-stone-700 font-semibold rounded-2xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Kembali ke Beranda Belanja ALLKURMA</span>
          </button>
        </div>

        {/* Footer Note */}
        <p className="text-[11px] text-stone-400">
          ALLKURMA by PT Exindokarsa Agung • Sistem Keamanan Terpadu
        </p>

      </div>
    </div>
  );
};
