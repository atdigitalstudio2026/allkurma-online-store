import React, { useState } from 'react';
import { 
  X, 
  Bell, 
  Package, 
  Tag, 
  Coins, 
  Sparkles, 
  CheckCheck, 
  ChevronRight,
  UserPlus,
  UserCheck,
  Store,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ShopeeNotificationModal: React.FC = () => {
  const { 
    isNotifOpen, 
    setIsNotifOpen, 
    notifications, 
    markNotifAsRead, 
    markAllNotifsRead,
    setCurrentView,
    isFollowingStore,
    toggleFollowStore,
    sellerStore
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'order' | 'promo' | 'finance'>('all');

  if (!isNotifOpen) return null;

  const filteredNotifs = notifications.filter(n => {
    if (activeTab === 'all') return true;
    if (activeTab === 'order') return n.type === 'order';
    if (activeTab === 'promo') return n.type === 'promo';
    if (activeTab === 'finance') return n.type === 'finance';
    return true;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <Package className="w-5 h-5 text-blue-600" />;
      case 'promo':
        return <Tag className="w-5 h-5 text-red-600" />;
      case 'finance':
        return <Coins className="w-5 h-5 text-amber-600" />;
      default:
        return <Sparkles className="w-5 h-5 text-purple-600" />;
    }
  };

  const handleNotificationClick = (notif: any) => {
    markNotifAsRead(notif.id);
    setIsNotifOpen(false);
    if (notif.type === 'order') {
      setCurrentView('my-orders');
    } else if (notif.type === 'finance') {
      setCurrentView('allkurma-games');
    } else if (notif.type === 'promo') {
      setCurrentView('allkurma-vouchers');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsNotifOpen(false)}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-stone-50 h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200">
        
        {/* Header */}
        <div className="p-4 bg-white border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-900">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-stone-900">Notifikasi Saya</h3>
              <p className="text-[11px] text-stone-500">Update pesanan, promo, dan koin</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={markAllNotifsRead}
              className="text-xs font-semibold text-amber-800 hover:text-amber-950 flex items-center gap-1"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Baca Semua</span>
            </button>
            <button
              onClick={() => setIsNotifOpen(false)}
              className="p-1 rounded-lg text-stone-400 hover:text-stone-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Store Follow & Push Status Quick Bar */}
        <div className="p-3 bg-linear-to-r from-amber-900 to-stone-900 text-white flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0">
              <Store className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-[11px] truncate">
                  {sellerStore.storeName || 'AllKurma Official'}
                </span>
                <span className="text-[8px] bg-red-600 px-1 py-0.2 rounded-xs font-black">
                  MALL
                </span>
              </div>
              <p className="text-[10px] text-stone-300 truncate">
                {isFollowingStore 
                  ? '🔔 Notifikasi Promo Toko: AKTIF' 
                  : 'Ikuti toko untuk notifikasi promo & diskon 15%'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={toggleFollowStore}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1 shrink-0 ${
              isFollowingStore
                ? 'bg-emerald-600 text-white'
                : 'bg-amber-500 hover:bg-amber-400 text-stone-950 font-black'
            }`}
          >
            {isFollowingStore ? (
              <>
                <UserCheck className="w-3.5 h-3.5" />
                <span>Mengikuti</span>
              </>
            ) : (
              <>
                <UserPlus className="w-3.5 h-3.5" />
                <span>+ Ikuti</span>
              </>
            )}
          </button>
        </div>

        {/* Tab Filters */}
        <div className="flex border-b border-stone-200 bg-white px-2 text-xs">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 py-2.5 font-bold border-b-2 text-center transition-colors ${
              activeTab === 'all' ? 'border-amber-800 text-amber-900' : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => setActiveTab('order')}
            className={`flex-1 py-2.5 font-bold border-b-2 text-center transition-colors ${
              activeTab === 'order' ? 'border-amber-800 text-amber-900' : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Pesanan
          </button>
          <button
            onClick={() => setActiveTab('promo')}
            className={`flex-1 py-2.5 font-bold border-b-2 text-center transition-colors ${
              activeTab === 'promo' ? 'border-amber-800 text-amber-900' : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Promo
          </button>
          <button
            onClick={() => setActiveTab('finance')}
            className={`flex-1 py-2.5 font-bold border-b-2 text-center transition-colors ${
              activeTab === 'finance' ? 'border-amber-800 text-amber-900' : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Keuangan
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
          {filteredNotifs.length === 0 ? (
            <div className="text-center py-16 text-stone-400 text-xs">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p>Tidak ada notifikasi pada kategori ini</p>
            </div>
          ) : (
            filteredNotifs.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                  notif.isRead 
                    ? 'bg-white border-stone-200 hover:border-stone-300' 
                    : 'bg-amber-50/70 border-amber-200 shadow-xs hover:border-amber-300'
                }`}
              >
                <div className="p-2.5 rounded-xl bg-stone-100 shrink-0 mt-0.5">
                  {getIcon(notif.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className={`text-xs ${notif.isRead ? 'font-semibold text-stone-800' : 'font-bold text-stone-900'}`}>
                      {notif.title}
                    </h4>
                    {!notif.isRead && (
                      <span className="w-2 h-2 rounded-full bg-red-600 shrink-0" />
                    )}
                  </div>
                  
                  <p className="text-[11px] text-stone-600 mt-1 leading-relaxed">
                    {notif.message}
                  </p>

                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-stone-100/80 text-[10px] text-stone-400">
                    <span>{notif.time}</span>
                    <span className="font-semibold text-amber-800 flex items-center gap-0.5">
                      Lihat Detail <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
