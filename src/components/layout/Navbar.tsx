import React, { useState } from 'react';
import { 
  Menu, 
  ShoppingCart, 
  Search, 
  X, 
  Sparkles, 
  Store, 
  Building2, 
  Gift, 
  RotateCcw, 
  ShieldCheck, 
  User, 
  PackagePlus, 
  FileSpreadsheet, 
  FileText, 
  Award, 
  Layers, 
  TrendingUp, 
  Boxes, 
  Users, 
  Tag, 
  Settings as SettingsIcon,
  ChevronRight,
  LogOut,
  Bell,
  MessageSquare,
  Coins,
  Heart,
  Flame
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRoleType } from '../../types';
import { SRALogo } from '../common/SRALogo';

export const Navbar: React.FC = () => {
  const { 
    currentView, 
    setCurrentView, 
    cartTotals, 
    user, 
    switchRole, 
    searchQuery, 
    setSearchQuery,
    setSelectedCategory,
    setIsChatOpen,
    setIsNotifOpen,
    notifications,
    chatMessages,
    wishlistProductIds,
    setIsAuthModalOpen,
    setAuthModalMode,
    logout
  } = useApp();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);

  const unreadNotifsCount = notifications.filter(n => !n.isRead).length;
  const unreadChatCount = chatMessages.filter(m => m.sender === 'seller').length;

  const handleNav = (view: any) => {
    setCurrentView(view);
    setIsDrawerOpen(false);
  };

  const roleLabels: Record<UserRoleType, { label: string; badge: string; color: string }> = {
    customer: { label: 'Pelanggan (Customer)', badge: 'Pembeli', color: 'bg-[#009A44] text-white' },
    seller: { label: 'Toko Seller Official', badge: 'Seller', color: 'bg-[#1E3A8A] text-blue-200' },
    wholesale_partner: { label: 'Mitra Grosir Gold', badge: 'B2B', color: 'bg-[#1E3A8A] text-white' },
    super_admin: { label: 'Super Admin', badge: 'Admin', color: 'bg-indigo-600 text-white' },
    warehouse_manager: { label: 'Manajer Gudang', badge: 'Logistik', color: 'bg-cyan-600 text-white' },
    sales_rep: { label: 'Sales Representative', badge: 'Sales', color: 'bg-blue-600 text-white' },
    marketing_admin: { label: 'Marketing Admin', badge: 'Promo', color: 'bg-purple-600 text-white' }
  };

  return (
    <>
      {/* Top Banner for Storefront & Wholesale */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs font-['Plus_Jakarta_Sans',sans-serif]">
        <div className="max-w-5xl mx-auto px-3 sm:px-4 py-2.5 flex items-center justify-between gap-2.5">
          
          {/* Left: Drawer Button + Logo */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="p-1.5 rounded-xl text-stone-700 hover:bg-stone-100 active:scale-95 transition-all"
              aria-label="Buka Menu"
            >
              <Menu className="w-5 h-5 text-stone-800" />
            </button>
            
            {/* SRA Brand Logo */}
            <button 
              onClick={() => { setSelectedCategory(null); handleNav('home'); }}
              className="flex items-center gap-1.5 text-left group cursor-pointer"
            >
              <SRALogo size="sm" variant="full" showSubtitle={false} />
            </button>
          </div>

          {/* Center Search Input */}
          <div className="flex-1 max-w-xs relative flex items-center">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Cari kurma, SKU, madu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-full focus:outline-hidden focus:ring-2 focus:ring-[#009A44]/30 focus:border-[#009A44] focus:bg-white transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 text-stone-400 hover:text-stone-600 text-xs"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Right Action Icons: Seller Hub, Notifications, Chat, Cart */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            
            {/* Seller Hub Button */}
            <button
              onClick={() => handleNav('seller-dashboard')}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#1E3A8A] hover:bg-[#172554] text-white text-[11px] font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
              title={user.role === 'seller' ? "Dashboard Toko Seller" : "Toko Seller (Khusus Akun Seller)"}
            >
              <Store className="w-3.5 h-3.5 text-emerald-300" />
              <span className="hidden sm:inline">Toko Seller</span>
            </button>

            {/* Customer Account Button */}
            <button
              onClick={() => {
                if (user.id.startsWith('guest-')) {
                  handleNav('customer-login');
                } else {
                  handleNav('customer-dashboard');
                }
              }}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 hover:bg-emerald-100 text-[#009A44] border border-emerald-300/80 text-[11px] font-bold shadow-2xs active:scale-95 transition-all cursor-pointer"
              title={user.id.startsWith('guest-') ? "Masuk / Daftar Akun Customer" : "Dashboard Akun Customer"}
            >
              <User className="w-3.5 h-3.5 text-[#009A44]" />
              <span className="hidden sm:inline">
                {user.id.startsWith('guest-') ? 'Masuk Customer' : user.name.split(' ')[0]}
              </span>
            </button>

            {/* Chat */}
            <button
              onClick={() => setIsChatOpen(true)}
              className="relative p-1.5 sm:p-2 rounded-xl text-stone-700 hover:bg-emerald-50 active:scale-95 transition-all cursor-pointer"
              title="Chat Toko"
            >
              <MessageSquare className="w-5 h-5 text-stone-800" />
              {unreadChatCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#009A44] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                  {unreadChatCount}
                </span>
              )}
            </button>

            {/* Notification Bell */}
            <button
              onClick={() => setIsNotifOpen(true)}
              className="relative p-1.5 sm:p-2 rounded-xl text-stone-700 hover:bg-emerald-50 active:scale-95 transition-all cursor-pointer"
              title="Notifikasi"
            >
              <Bell className="w-5 h-5 text-stone-800" />
              {unreadNotifsCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                  {unreadNotifsCount}
                </span>
              )}
            </button>

            {/* Cart Icon */}
            <button
              onClick={() => handleNav('cart')}
              className="relative p-1.5 sm:p-2 rounded-xl text-stone-700 hover:bg-emerald-50 active:scale-95 transition-all cursor-pointer"
              aria-label="Keranjang Belanja"
            >
              <ShoppingCart className="w-5 h-5 text-stone-800" />
              {cartTotals.totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#009A44] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white animate-in zoom-in">
                  {cartTotals.totalItems}
                </span>
              )}
            </button>

          </div>
        </div>
      </header>

      {/* Slide-over Drawer Menu */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs transition-opacity"
            onClick={() => setIsDrawerOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative w-80 max-w-full bg-white h-full shadow-2xl flex flex-col z-10 overflow-y-auto font-['Plus_Jakarta_Sans',sans-serif]">
            {/* Drawer Header */}
            <div className="p-4 bg-gradient-to-br from-[#1E3A8A] via-[#1b357f] to-[#009A44] text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-xl bg-white shadow-xs">
                  <SRALogo size="xs" variant="stacked" showSubtitle={false} />
                </div>
                <div>
                  <h3 className="font-bold text-base leading-tight font-['Plus_Jakarta_Sans',sans-serif]">SRA ALLKURMA</h3>
                  <p className="text-[11px] text-emerald-200">PT Exindokarsa Agung</p>
                </div>
              </div>
              <button 
                onClick={() => setIsDrawerOpen(false)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Current User Card + Auth Switcher */}
            <div className="px-4 py-3 bg-emerald-50/60 border-b border-emerald-100 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img 
                    src={user.avatar} 
                    alt={user.name} 
                    className="w-10 h-10 rounded-full object-cover border-2 border-emerald-400 shadow-xs shrink-0" 
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-stone-900 truncate">{user.name}</p>
                    <p className="text-[10px] text-stone-500 truncate">{user.email}</p>
                    <span className="inline-block text-[9px] px-1.5 py-0.2 rounded font-bold mt-0.5 bg-[#1E3A8A] text-white">
                      {roleLabels[user.role].label}
                    </span>
                  </div>
                </div>
              </div>

              {/* Login / Customer Dashboard Action Button */}
              {user.id.startsWith('guest-') ? (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleNav('customer-login')}
                    className="py-1.5 px-2 rounded-xl bg-gradient-to-r from-[#1E3A8A] to-[#009A44] text-white text-[11px] font-bold flex items-center justify-center gap-1 hover:opacity-95 transition-all cursor-pointer shadow-2xs"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Masuk</span>
                  </button>
                  <button
                    onClick={() => handleNav('customer-register')}
                    className="py-1.5 px-2 rounded-xl bg-white border border-emerald-300 text-[#009A44] text-[11px] font-bold flex items-center justify-center gap-1 hover:bg-emerald-50 transition-colors cursor-pointer shadow-2xs"
                  >
                    <span>Daftar Akun</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleNav('customer-dashboard')}
                  className="w-full py-1.5 px-2.5 rounded-xl bg-gradient-to-r from-[#1E3A8A] to-[#009A44] text-white text-[11px] font-bold flex items-center justify-center gap-1.5 hover:opacity-95 transition-all cursor-pointer shadow-2xs"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Buka Dashboard Customer</span>
                </button>
              )}
            </div>

            {/* Navigation Sections */}
            <div className="flex-1 p-3 space-y-4 text-xs">
              
              {/* Seller Dashboard Highlight - Only for Seller or Super Admin */}
              {(user.role === 'seller' || user.role === 'super_admin') ? (
                <div>
                  <div className="px-3 py-1 font-bold text-[10px] text-[#1E3A8A] uppercase tracking-wider flex items-center gap-1">
                    <Store className="w-3.5 h-3.5 text-[#009A44]" />
                    <span>Portal Toko Seller (Khusus Mitra)</span>
                  </div>
                  <div className="space-y-0.5">
                    <button
                      onClick={() => handleNav('seller-dashboard')}
                      className={`w-full px-3 py-2 rounded-xl flex items-center justify-between font-medium transition-colors cursor-pointer ${
                        currentView === 'seller-dashboard' ? 'bg-[#1E3A8A] text-white shadow-xs' : 'text-[#1E3A8A] bg-blue-50 hover:bg-blue-100'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Store className="w-4 h-4 text-[#009A44]" />
                        <span className="font-bold">Dashboard Toko Seller (Komplit)</span>
                      </div>
                      <span className="px-1.5 py-0.5 text-[9px] bg-[#009A44] text-white rounded font-bold">
                        SELLER
                      </span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-blue-50/60 rounded-2xl border border-blue-100 text-stone-700 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[#1E3A8A] font-bold text-[11px]">
                    <Store className="w-4 h-4 text-[#009A44]" />
                    <span>Punya Toko di AllKurma?</span>
                  </div>
                  <p className="text-[10px] text-stone-500 leading-tight">
                    Masuk dengan akun seller Anda untuk mengakses pengaturan toko & pesanan.
                  </p>
                  <button
                    onClick={() => {
                      setIsDrawerOpen(false);
                      setAuthModalMode('seller_login');
                      setIsAuthModalOpen(true);
                    }}
                    className="w-full py-1 px-2 rounded-lg bg-[#1E3A8A] text-white text-[10px] font-bold hover:bg-[#172554] transition-colors cursor-pointer"
                  >
                    Masuk ke Toko Seller
                  </button>
                </div>
              )}

              {/* Fitur Belanja & Voucher */}
              <div>
                <div className="px-3 py-1 font-bold text-[10px] text-[#1E3A8A] uppercase tracking-wider flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-[#009A44]" />
                  <span>Promo & Belanja</span>
                </div>
                <div className="space-y-0.5">
                  <button
                    onClick={() => handleNav('shopee-vouchers')}
                    className={`w-full px-3 py-2 rounded-xl flex items-center gap-2.5 font-medium transition-colors cursor-pointer ${
                      currentView === 'shopee-vouchers' ? 'bg-[#009A44] text-white shadow-xs' : 'text-stone-700 hover:bg-emerald-50'
                    }`}
                  >
                    <Tag className="w-4 h-4 text-emerald-600" />
                    <span>Klaim Voucher & Gratis Ongkir</span>
                  </button>

                  <button
                    onClick={() => handleNav('wishlist')}
                    className={`w-full px-3 py-2 rounded-xl flex items-center justify-between font-medium transition-colors cursor-pointer ${
                      currentView === 'wishlist' ? 'bg-[#009A44] text-white shadow-xs' : 'text-stone-700 hover:bg-emerald-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Heart className="w-4 h-4 text-red-500" />
                      <span>Favorit / Wishlist Saya</span>
                    </div>
                    {wishlistProductIds.length > 0 && (
                      <span className="px-1.5 py-0.5 text-[10px] bg-stone-200 text-stone-800 rounded-full font-bold">
                        {wishlistProductIds.length}
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* Storefront & Katalog */}
              <div>
                <div className="px-3 py-1 font-bold text-[10px] text-stone-400 uppercase tracking-wider">
                  Storefront & Pesanan
                </div>
                <div className="space-y-0.5">
                  <button
                    onClick={() => handleNav('home')}
                    className={`w-full px-3 py-2 rounded-xl flex items-center gap-2.5 font-medium transition-colors cursor-pointer ${
                      currentView === 'home' ? 'bg-[#1E3A8A] text-white shadow-xs' : 'text-stone-700 hover:bg-slate-100'
                    }`}
                  >
                    <Store className="w-4 h-4" />
                    <span>Beranda Toko</span>
                  </button>
                  <button
                    onClick={() => handleNav('catalog')}
                    className={`w-full px-3 py-2 rounded-xl flex items-center gap-2.5 font-medium transition-colors cursor-pointer ${
                      currentView === 'catalog' ? 'bg-[#1E3A8A] text-white shadow-xs' : 'text-stone-700 hover:bg-slate-100'
                    }`}
                  >
                    <Layers className="w-4 h-4" />
                    <span>Koleksi Kurma Premium</span>
                  </button>
                  <button
                    onClick={() => handleNav('cart')}
                    className={`w-full px-3 py-2 rounded-xl flex items-center justify-between font-medium transition-colors cursor-pointer ${
                      currentView === 'cart' ? 'bg-[#1E3A8A] text-white shadow-xs' : 'text-stone-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <ShoppingCart className="w-4 h-4" />
                      <span>Keranjang Belanja</span>
                    </div>
                    {cartTotals.totalItems > 0 && (
                      <span className="px-1.5 py-0.5 text-[10px] bg-emerald-100 text-[#009A44] rounded-full font-bold">
                        {cartTotals.totalItems}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => handleNav('my-orders')}
                    className={`w-full px-3 py-2 rounded-xl flex items-center gap-2.5 font-medium transition-colors cursor-pointer ${
                      currentView === 'my-orders' ? 'bg-[#1E3A8A] text-white shadow-xs' : 'text-stone-700 hover:bg-slate-100'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    <span>Pesanan Saya (Lacak & Riwayat)</span>
                  </button>
                </div>
              </div>

              {/* B2B Wholesale Section */}
              <div>
                <div className="px-3 py-1 font-bold text-[10px] text-stone-400 uppercase tracking-wider flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-stone-500" />
                  <span>Portal Grosir & B2B</span>
                </div>
                <div className="space-y-0.5">
                  <button
                    onClick={() => handleNav('b2b-portal')}
                    className={`w-full px-3 py-2 rounded-xl flex items-center gap-2.5 font-medium transition-colors cursor-pointer ${
                      currentView === 'b2b-portal' ? 'bg-[#1E3A8A] text-white shadow-xs' : 'text-stone-700 hover:bg-slate-100'
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                    <span>Portal Grosir Premium</span>
                  </button>
                  <button
                    onClick={() => handleNav('b2b-quick-order')}
                    className={`w-full px-3 py-2 rounded-xl flex items-center gap-2.5 font-medium transition-colors cursor-pointer ${
                      currentView === 'b2b-quick-order' ? 'bg-[#1E3A8A] text-white shadow-xs' : 'text-stone-700 hover:bg-slate-100'
                    }`}
                  >
                    <PackagePlus className="w-4 h-4" />
                    <span>Pesanan Cepat (SKU Matrix)</span>
                  </button>
                  <button
                    onClick={() => handleNav('b2b-tiers')}
                    className={`w-full px-3 py-2 rounded-xl flex items-center gap-2.5 font-medium transition-colors cursor-pointer ${
                      currentView === 'b2b-tiers' ? 'bg-[#1E3A8A] text-white shadow-xs' : 'text-stone-700 hover:bg-slate-100'
                    }`}
                  >
                    <Award className="w-4 h-4" />
                    <span>Struktur Tier & Diskon</span>
                  </button>
                </div>
              </div>

              {/* Admin & Management */}
              <div>
                <div className="px-3 py-1 font-bold text-[10px] text-indigo-700 uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Admin & Manajemen</span>
                </div>
                <div className="space-y-0.5">
                  <button
                    onClick={() => handleNav('admin-dashboard')}
                    className={`w-full px-3 py-2 rounded-xl flex items-center gap-2.5 font-medium transition-colors ${
                      currentView === 'admin-dashboard' ? 'bg-indigo-700 text-white shadow-xs' : 'text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <TrendingUp className="w-4 h-4" />
                    <span>Dashboard Admin Master</span>
                  </button>
                  <button
                    onClick={() => handleNav('admin-promotions')}
                    className={`w-full px-3 py-2 rounded-xl flex items-center gap-2.5 font-medium transition-colors ${
                      currentView === 'admin-promotions' ? 'bg-indigo-700 text-white shadow-xs' : 'text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <Tag className="w-4 h-4" />
                    <span>Kelola Voucher & Promo</span>
                  </button>
                  <button
                    onClick={() => handleNav('admin-stock')}
                    className={`w-full px-3 py-2 rounded-xl flex items-center gap-2.5 font-medium transition-colors ${
                      currentView === 'admin-stock' ? 'bg-indigo-700 text-white shadow-xs' : 'text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <Boxes className="w-4 h-4" />
                    <span>Stok & Logistik Gudang</span>
                  </button>
                </div>
              </div>

              {/* Akun */}
              <div>
                <div className="px-3 py-1 font-bold text-[10px] text-stone-400 uppercase tracking-wider flex items-center gap-1">
                  <User className="w-3 h-3" />
                  <span>Akun Saya</span>
                </div>
                <div className="space-y-0.5">
                  <button
                    onClick={() => handleNav('customer-dashboard')}
                    className={`w-full px-3 py-2 rounded-xl flex items-center gap-2.5 font-medium transition-colors ${
                      currentView === 'customer-dashboard' || currentView === 'my-profile' ? 'bg-[#1E3A8A] text-white shadow-xs' : 'text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <User className="w-4 h-4" />
                    <span>Dashboard Akun Customer (16 Layanan)</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between text-xs text-stone-500">
              <span>AllKurma Enterprise</span>
              <button 
                onClick={() => switchRole('customer')}
                className="flex items-center gap-1 text-stone-700 hover:text-red-600 font-medium"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
