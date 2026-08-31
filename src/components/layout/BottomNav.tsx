import React from 'react';
import { Store, ShoppingBag, Tag, ShoppingCart, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const BottomNav: React.FC = () => {
  const { 
    currentView, 
    setCurrentView, 
    cartTotals, 
    user
  } = useApp();

  const isHomeActive = currentView === 'home';
  const isCatalogActive = ['catalog', 'product-detail', 'wishlist'].includes(currentView);
  const isVouchersActive = currentView === 'allkurma-vouchers' || currentView === 'shopee-vouchers';
  const isCartActive = currentView === 'cart';
  const isAccountActive = [
    'my-profile', 'customer-dashboard', 'customer-login', 'customer-register', 'customer-forgot-password',
    'account-settings', 'address-book', 'my-orders',
    'b2b-portal', 'b2b-quick-order', 'b2b-bulk-upload', 'b2b-tiers', 'b2b-invoices',
    'admin-dashboard', 'admin-add-product', 'admin-orders', 'admin-stock',
    'admin-customers', 'admin-promotions', 'admin-roles', 'admin-settings'
  ].includes(currentView);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-1 px-2 shadow-lg font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="max-w-md mx-auto grid grid-cols-5 gap-1">
        
        {/* 1. Beranda */}
        <button
          onClick={() => setCurrentView('home')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all cursor-pointer ${
            isHomeActive ? 'text-[#1E3A8A] font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="relative">
            <Store className={`w-5 h-5 ${isHomeActive ? 'text-[#1E3A8A] scale-110' : 'text-slate-500'} transition-transform`} />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Beranda</span>
        </button>

        {/* 2. Katalog */}
        <button
          onClick={() => setCurrentView('catalog')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all cursor-pointer ${
            isCatalogActive ? 'text-[#1E3A8A] font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="relative">
            <ShoppingBag className={`w-5 h-5 ${isCatalogActive ? 'text-[#1E3A8A] scale-110' : 'text-slate-500'} transition-transform`} />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Katalog</span>
        </button>

        {/* 3. Voucher */}
        <button
          onClick={() => setCurrentView('allkurma-vouchers')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all cursor-pointer ${
            isVouchersActive ? 'text-[#009A44] font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="relative">
            <Tag className={`w-5 h-5 ${isVouchersActive ? 'text-[#009A44] scale-110' : 'text-slate-500'} transition-transform`} />
            <span className="absolute -top-1 -right-1.5 bg-red-600 text-white text-[7px] font-bold px-1 rounded-full">
              PROMO
            </span>
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Voucher</span>
        </button>

        {/* 4. Keranjang Belanja */}
        <button
          onClick={() => setCurrentView('cart')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all cursor-pointer ${
            isCartActive ? 'text-[#1E3A8A] font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="relative">
            <ShoppingCart className={`w-5 h-5 ${isCartActive ? 'text-[#1E3A8A] scale-110' : 'text-slate-500'} transition-transform`} />
            {cartTotals.totalItems > 0 && (
              <span className="absolute -top-1.5 -right-2.5 bg-[#009A44] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                {cartTotals.totalItems}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Keranjang</span>
        </button>

        {/* 5. Profil Saya */}
        <button
          onClick={() => {
            if (user.role === 'super_admin' || user.role === 'warehouse_manager') {
              setCurrentView('admin-dashboard');
            } else if (user.id.startsWith('guest-')) {
              setCurrentView('customer-login');
            } else {
              setCurrentView('customer-dashboard');
            }
          }}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all cursor-pointer ${
            isAccountActive ? 'text-[#1E3A8A] font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="relative">
            <User className={`w-5 h-5 ${isAccountActive ? 'text-[#1E3A8A] scale-110' : 'text-slate-500'} transition-transform`} />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">
            {user.role === 'super_admin' ? 'Admin' : 'Saya'}
          </span>
        </button>

      </div>
    </nav>
  );
};
