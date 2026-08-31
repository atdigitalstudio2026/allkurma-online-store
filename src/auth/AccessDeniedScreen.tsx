import React from 'react';
import { 
  ShieldAlert, 
  Store, 
  User, 
  Home, 
  LogIn,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface AccessDeniedScreenProps {
  targetViewName?: string;
  isSellerPortal?: boolean;
}

export const AccessDeniedScreen: React.FC<AccessDeniedScreenProps> = ({ 
  targetViewName = 'Admin Command Center',
  isSellerPortal = false
}) => {
  const { user, setCurrentView, showToast } = useApp();

  const isSellerTarget = isSellerPortal || targetViewName.toLowerCase().includes('seller') || targetViewName.toLowerCase().includes('toko');

  return (
    <div className="min-h-[85vh] bg-stone-100/90 py-12 px-4 flex items-center justify-center font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xl text-center space-y-5 animate-in zoom-in-95">
        
        {/* Icon */}
        <div className={`w-16 h-16 rounded-3xl mx-auto flex items-center justify-center border shadow-inner ${
          isSellerTarget 
            ? 'bg-amber-50 text-[#1E3A8A] border-amber-200' 
            : 'bg-red-50 text-red-600 border-red-200'
        }`}>
          {isSellerTarget ? (
            <Store className="w-8 h-8 text-[#1E3A8A]" />
          ) : (
            <ShieldAlert className="w-8 h-8 text-red-600" />
          )}
        </div>

        {/* Text Header */}
        <div className="space-y-2">
          <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${
            isSellerTarget
              ? 'text-blue-800 bg-blue-100'
              : 'text-red-700 bg-red-100'
          }`}>
            {isSellerTarget ? 'Akses Portal Seller Toko' : '403 - Akses Terbatas Administrator'}
          </span>
          <h1 className="text-2xl font-bold font-['Playfair_Display',serif] text-stone-900">
            {isSellerTarget ? 'Akses Khusus Toko Seller' : 'Akses Terbatas Administrator'}
          </h1>
          <p className="text-xs text-stone-600 leading-relaxed">
            Halaman <strong className="text-stone-900">{targetViewName}</strong> hanya dapat diakses oleh akun Seller Resmi atau Administrator <strong>PT Exindokarsa Agung</strong>.
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
            {isSellerTarget 
              ? 'Untuk membuka Seller Center, silakan login dengan akun Seller atau beralih ke sesi Toko Seller.'
              : 'Akun Customer tidak memiliki izin untuk memodifikasi inventaris, harga, atau data internal perusahaan.'}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2">
          {/* Primary Action for Customers: Go to Customer Dashboard or Home */}
          <button
            onClick={() => setCurrentView(user.id.startsWith('guest-') ? 'customer-login' : 'customer-dashboard')}
            className="w-full py-3 bg-gradient-to-r from-[#1E3A8A] to-[#009A44] hover:opacity-95 active:scale-95 text-white font-bold rounded-2xl text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <User className="w-4 h-4" />
            <span>
              {user.id.startsWith('guest-') ? 'Masuk ke Akun Customer' : 'Buka Dashboard Akun Customer'}
            </span>
          </button>

          {isSellerTarget && (
            <>
              <button
                onClick={() => setCurrentView('seller-login')}
                className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 border border-stone-300 active:scale-95 text-stone-800 font-bold rounded-2xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogIn className="w-4 h-4 text-blue-900" />
                <span>Masuk dengan Kredensial Toko Seller</span>
              </button>

              <button
                onClick={() => setCurrentView('seller-register')}
                className="w-full py-2 bg-stone-50 hover:bg-stone-100 text-stone-600 font-semibold rounded-2xl text-[11px] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Store className="w-3.5 h-3.5" />
                <span>Pendaftaran Mitra Penjual / Buka Toko</span>
              </button>
            </>
          )}

          <button
            onClick={() => setCurrentView('home')}
            className="w-full py-2 text-stone-500 hover:text-stone-800 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Home className="w-3.5 h-3.5" />
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
