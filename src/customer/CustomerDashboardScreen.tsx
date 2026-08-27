import React, { useState } from 'react';
import { 
  Home, 
  User, 
  Package, 
  Clock, 
  Truck, 
  CheckCircle2, 
  XCircle, 
  Heart, 
  ShoppingCart, 
  MapPin, 
  Ticket, 
  Gift, 
  Bell, 
  HelpCircle, 
  LogOut, 
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Award,
  Layers,
  Coins
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CustomerProfileSection } from './CustomerProfileSection';
import { CustomerOrdersSection } from './CustomerOrdersSection';
import { CustomerAddressesSection } from './CustomerAddressesSection';
import { CustomerVouchersSection } from './CustomerVouchersSection';
import { CustomerRewardsSection } from './CustomerRewardsSection';
import { CustomerHelpSection } from './CustomerHelpSection';

export type CustomerMenuId = 
  | 'home' 
  | 'profile' 
  | 'orders' 
  | 'unpaid' 
  | 'processing' 
  | 'shipped' 
  | 'completed' 
  | 'cancelled' 
  | 'wishlist' 
  | 'cart' 
  | 'addresses' 
  | 'vouchers' 
  | 'rewards' 
  | 'notifications' 
  | 'help' 
  | 'logout';

export const CustomerDashboardScreen: React.FC = () => {
  const { 
    user, 
    orders, 
    cart, 
    wishlistProductIds, 
    unreadNotifCount, 
    setCurrentView, 
    setIsNotifOpen, 
    logout,
    showToast 
  } = useApp();

  const [activeMenu, setActiveMenu] = useState<CustomerMenuId>('profile');

  // 16 Menus configuration
  const menuItems = [
    { id: 'home' as const, label: '1. Beranda', icon: Home, badge: null },
    { id: 'profile' as const, label: '2. Profil Saya', icon: User, badge: null },
    { id: 'orders' as const, label: '3. Pesanan Saya', icon: Package, badge: orders.length > 0 ? orders.length : null },
    { id: 'unpaid' as const, label: '4. Belum Dibayar', icon: Clock, badge: orders.filter(o => o.status === 'Belum Dibayar').length || null, highlight: true },
    { id: 'processing' as const, label: '5. Diproses', icon: Layers, badge: orders.filter(o => o.status === 'Diproses').length || null },
    { id: 'shipped' as const, label: '6. Dikirim', icon: Truck, badge: orders.filter(o => o.status === 'Dikirim').length || null },
    { id: 'completed' as const, label: '7. Selesai', icon: CheckCircle2, badge: orders.filter(o => o.status === 'Selesai').length || null },
    { id: 'cancelled' as const, label: '8. Dibatalkan', icon: XCircle, badge: null },
    { id: 'wishlist' as const, label: '9. Wishlist', icon: Heart, badge: wishlistProductIds.length || null },
    { id: 'cart' as const, label: '10. Keranjang', icon: ShoppingCart, badge: cart.length || null },
    { id: 'addresses' as const, label: '11. Alamat Saya', icon: MapPin, badge: null },
    { id: 'vouchers' as const, label: '12. Voucher', icon: Ticket, badge: 'XTRA' },
    { id: 'rewards' as const, label: '13. Poin/Reward', icon: Gift, badge: `${user.rewardPoints} Pts` },
    { id: 'notifications' as const, label: '14. Notifikasi', icon: Bell, badge: unreadNotifCount || null },
    { id: 'help' as const, label: '15. Bantuan', icon: HelpCircle, badge: null },
    { id: 'logout' as const, label: '16. Logout', icon: LogOut, badge: null, isDanger: true },
  ];

  const handleMenuClick = (menuId: CustomerMenuId) => {
    if (menuId === 'home') {
      setCurrentView('home');
    } else if (menuId === 'cart') {
      setCurrentView('cart');
    } else if (menuId === 'wishlist') {
      setCurrentView('wishlist');
    } else if (menuId === 'notifications') {
      setIsNotifOpen(true);
    } else if (menuId === 'logout') {
      if (confirm('Apakah Anda yakin ingin keluar dari akun ALLKURMA?')) {
        logout();
        showToast('Anda telah berhasil keluar dari akun.', 'info');
        setCurrentView('customer-login');
      }
    } else {
      setActiveMenu(menuId);
    }
  };

  const renderActiveSection = () => {
    switch (activeMenu) {
      case 'profile':
        return <CustomerProfileSection />;
      case 'orders':
        return <CustomerOrdersSection initialStatusFilter="Semua" />;
      case 'unpaid':
        return <CustomerOrdersSection initialStatusFilter="Belum Dibayar" />;
      case 'processing':
        return <CustomerOrdersSection initialStatusFilter="Diproses" />;
      case 'shipped':
        return <CustomerOrdersSection initialStatusFilter="Dikirim" />;
      case 'completed':
        return <CustomerOrdersSection initialStatusFilter="Selesai" />;
      case 'cancelled':
        return <CustomerOrdersSection initialStatusFilter="Dibatalkan" />;
      case 'addresses':
        return <CustomerAddressesSection />;
      case 'vouchers':
        return <CustomerVouchersSection />;
      case 'rewards':
        return <CustomerRewardsSection />;
      case 'help':
        return <CustomerHelpSection />;
      default:
        return <CustomerProfileSection />;
    }
  };

  return (
    <div className="min-h-screen bg-stone-100/70 pb-20 font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Top Banner Bar */}
      <div className="bg-gradient-to-r from-amber-950 via-stone-900 to-amber-900 text-white py-6 px-4 sm:px-8 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <img 
              src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'} 
              alt={user.name} 
              className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-400/50 shadow-inner"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold font-['Playfair_Display',serif] text-white">
                  {user.name}
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center gap-1">
                  <Award className="w-3 h-3" /> Member {user.tier}
                </span>
              </div>
              <p className="text-xs text-stone-300 mt-0.5">
                {user.email} • {user.phone || 'Nomor HP Belum Diisi'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/10 backdrop-blur-xs px-4 py-2 rounded-2xl border border-white/15 flex items-center gap-3 text-xs">
              <Coins className="w-4 h-4 text-amber-300" />
              <div>
                <span className="text-[10px] text-stone-300 block">Poin Belanja</span>
                <span className="font-bold text-amber-300">{user.rewardPoints.toLocaleString('id-ID')} Poin</span>
              </div>
            </div>

            <button
              onClick={() => {
                logout();
                setCurrentView('customer-login');
              }}
              className="py-2 px-3.5 bg-red-600/80 hover:bg-red-600 text-white rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area: 16-Menu Sidebar + Active Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* LEFT SIDEBAR: 16 Customer Menus */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl border border-stone-200 p-3.5 shadow-sm sticky top-24 space-y-1">
              
              <div className="px-3 py-2 border-b border-stone-100 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                  Menu Akun Customer (16 Layanan)
                </span>
              </div>

              <div className="space-y-0.5 max-h-[75vh] overflow-y-auto pr-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeMenu === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleMenuClick(item.id)}
                      className={`w-full px-3 py-2.5 rounded-2xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                        item.isDanger 
                          ? 'text-red-600 hover:bg-red-50 hover:text-red-700' 
                          : isActive 
                            ? 'bg-amber-800 text-white shadow-xs font-bold' 
                            : 'text-stone-700 hover:bg-stone-100 hover:text-amber-950'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-200' : item.isDanger ? 'text-red-500' : 'text-stone-500'}`} />
                        <span className="truncate">{item.label}</span>
                      </div>

                      {item.badge && (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                          isActive 
                            ? 'bg-amber-950 text-amber-200' 
                            : item.highlight 
                              ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                              : 'bg-stone-100 text-stone-600'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

            </div>
          </div>

          {/* RIGHT VIEW CONTAINER: Rendered Section */}
          <div className="lg:col-span-3">
            {renderActiveSection()}
          </div>

        </div>
      </div>

    </div>
  );
};
