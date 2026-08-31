import React, { useState } from 'react';
import {
  Store,
  TrendingUp,
  Package,
  ShoppingBag,
  DollarSign,
  Star,
  MessageSquare,
  Settings,
  Truck,
  Building2,
  Clock,
  ShieldCheck,
  CreditCard,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Printer,
  Eye,
  Percent,
  Send,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  ExternalLink,
  ChevronRight,
  Layers,
  ArrowDownLeft,
  X,
  FileText,
  Lock,
  LogIn,
  ArrowLeft,
  FileSpreadsheet
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Product, Order, PromotionVoucher } from '../../types';
import { exportSalesReportToExcel } from '../../utils/exportReport';

export const SellerDashboardScreen: React.FC = () => {
  const {
    user,
    sellerStore,
    updateSellerStore,
    withdrawSellerBalance,
    toggleSellerCourier,
    replySellerReview,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    orders,
    updateOrderStatus,
    promotions,
    createPromotion,
    togglePromotionStatus,
    reviews,
    setCurrentView,
    setSelectedProductId,
    showToast,
    loginSeller,
    setIsAuthModalOpen,
    setAuthModalMode
  } = useApp();

  // Active Tab in Seller Center
  const [activeTab, setActiveTab] = useState<'overview' | 'settings' | 'orders' | 'products' | 'vouchers' | 'reviews'>('overview');

  // General Settings State
  const [storeForm, setStoreForm] = useState({
    storeName: sellerStore.storeName,
    storeHandle: sellerStore.storeHandle,
    tagline: sellerStore.tagline,
    description: sellerStore.description,
    logo: sellerStore.logo,
    banner: sellerStore.banner,
    city: sellerStore.city,
    fullAddress: sellerStore.fullAddress,
    postalCode: sellerStore.postalCode,
    phone: sellerStore.phone,
    email: sellerStore.email,
    operationalHours: sellerStore.operationalHours,
    isVacationMode: sellerStore.isVacationMode,
    isOfficialStore: sellerStore.isOfficialStore,
    enableAutoReply: sellerStore.enableAutoReply,
    autoReplyGreeting: sellerStore.autoReplyGreeting,
    autoReplyOffHours: sellerStore.autoReplyOffHours,
    taxNumber: sellerStore.taxNumber,
    minFreeShippingOrder: sellerStore.minFreeShippingOrder
  });

  // Payout / Withdrawal modal
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');

  // Shipping Label (Resi) Modal
  const [selectedOrderForLabel, setSelectedOrderForLabel] = useState<Order | null>(null);
  const [trackingInput, setTrackingInput] = useState('');

  // New Product Modal
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newProd, setNewProd] = useState<Partial<Product>>({
    name: '',
    sku: '',
    category: 'Medjool',
    regularPrice: 150000,
    discountPrice: 135000,
    stock: 50,
    minStockAlert: 10,
    origin: 'Madinah, Saudi Arabia',
    description: '',
    warehouseLocation: 'Gudang Utama - Jakarta Pusat',
    weightGram: 500,
    images: ['https://images.unsplash.com/photo-1596797882870-8c33deeac224?w=600&auto=format&fit=crop&q=80'],
    freeShippingExtra: true,
    cashbackExtra: true
  });

  // New Voucher Modal
  const [isAddVoucherOpen, setIsAddVoucherOpen] = useState(false);
  const [newVoucher, setNewVoucher] = useState({
    name: '',
    code: '',
    discountType: 'fixed' as 'fixed' | 'percentage',
    discountValue: 20000,
    minPurchase: 100000,
    totalUsageLimit: 100,
    description: ''
  });

  // Review Reply State
  const [replyingReviewId, setReplyingReviewId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  // Order filter in Seller Center
  const [orderStatusFilter, setOrderStatusFilter] = useState<'All' | 'Perlu Diproses' | 'Dikirim' | 'Selesai' | 'Retur'>('All');

  // Filtered orders
  const filteredOrders = orders.filter(o => {
    if (orderStatusFilter === 'All') return true;
    if (orderStatusFilter === 'Perlu Diproses') return o.status === 'Belum Bayar' || o.status === 'Diproses';
    if (orderStatusFilter === 'Dikirim') return o.status === 'Dikirim';
    if (orderStatusFilter === 'Selesai') return o.status === 'Selesai';
    if (orderStatusFilter === 'Retur') return o.status === 'Retur';
    return true;
  });

  // Handle store profile update
  const handleSaveStoreSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSellerStore(storeForm);
  };

  // Handle Withdrawal submit
  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseInt(withdrawAmount.replace(/[^0-9]/g, ''), 10);
    if (!amt || isNaN(amt)) {
      showToast('Masukkan jumlah penarikan yang valid!', 'error');
      return;
    }
    const success = withdrawSellerBalance(amt);
    if (success) {
      setIsWithdrawOpen(false);
      setWithdrawAmount('');
    }
  };

  // Handle Send Order / Update Tracking
  const handleProcessOrder = (order: Order) => {
    if (order.status === 'Belum Bayar' || order.status === 'Diproses') {
      const generatedResi = `AK-EXP-${Date.now().toString().slice(-6)}`;
      updateOrderStatus(order.id, 'Dikirim');
      showToast(`Pesanan #${order.orderNumber} berhasil diproses! Resi kurir: ${generatedResi}`, 'success');
    }
  };

  // Handle Export Sales Report to Excel
  const handleExportSellerOrders = () => {
    try {
      const dataToExport = filteredOrders.length > 0 ? filteredOrders : orders;
      exportSalesReportToExcel(dataToExport, `Laporan_Penjualan_${sellerStore.storeName.replace(/\s+/g, '_')}`);
      showToast(`Berhasil mengekspor ${dataToExport.length} pesanan ke Excel (.csv)!`, 'success');
    } catch (e: any) {
      showToast(e.message || 'Gagal mengekspor laporan', 'error');
    }
  };

  // Quick stats calculation
  const totalRevenue = orders
    .filter(o => o.status === 'Selesai' || o.paymentStatus === 'Paid')
    .reduce((sum, o) => sum + o.total, 0);

  const pendingOrdersCount = orders.filter(o => o.status === 'Belum Bayar' || o.status === 'Diproses').length;
  const readyToShipCount = orders.filter(o => o.status === 'Diproses').length;
  const lowStockProducts = products.filter(p => p.stock <= p.minStockAlert);

  // ACCESS CONTROL GATE: If current user is not a seller/super_admin
  if (user.role !== 'seller' && user.role !== 'super_admin') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4 bg-stone-100 font-['Plus_Jakarta_Sans',sans-serif]">
        <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-xl text-center space-y-5">
          <div className="w-16 h-16 bg-amber-100 text-[#1E3A8A] rounded-3xl mx-auto flex items-center justify-center shadow-inner">
            <Store className="w-8 h-8 text-[#1E3A8A]" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-stone-900 font-['Playfair_Display',serif]">
              Akses Khusus Toko Seller
            </h2>
            <p className="text-xs text-stone-600 leading-relaxed">
              Anda saat ini sedang login dengan akun <strong className="text-[#1E3A8A]">{user.email}</strong> ({user.name}) sebagai <strong>Pelanggan (Customer)</strong>.
            </p>
            <p className="text-xs text-stone-600 bg-amber-50 p-3.5 rounded-2xl border border-amber-200/60 leading-relaxed text-left">
              🔒 <strong>Pemisahan Akses Pelanggan & Seller:</strong> Dashboard Pengaturan Toko Seller dan manajemen produk/pesanan hanya dapat diakses oleh akun Seller resmi AllKurma.
            </p>
          </div>

          <div className="space-y-2.5 pt-2">
            <button
              onClick={() => setCurrentView('seller-login')}
              className="w-full py-3 bg-[#1E3A8A] hover:bg-[#172554] active:scale-95 text-white font-bold rounded-2xl text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Masuk dengan Akun Seller Toko</span>
            </button>

            <button
              onClick={() => {
                loginSeller('seller@allkurma.id');
                showToast('Login Demo Toko Official Berhasil!', 'success');
              }}
              className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 active:scale-95 text-[#009A44] font-bold rounded-2xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Masuk Instan (Demo Toko Official)</span>
            </button>

            <button
              onClick={() => setCurrentView('seller-register')}
              className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-2xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Daftar / Buka Toko Seller Baru</span>
            </button>

            <button
              onClick={() => setCurrentView('home')}
              className="w-full py-2 text-stone-500 hover:text-stone-800 text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Beranda Belanja</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100/70 pb-20 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Header Seller Center */}
      <div className="bg-stone-900 text-white border-b border-stone-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-black text-xl shadow-inner">
                <Store className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-bold text-white tracking-tight">
                    {sellerStore.storeName}
                  </h1>
                  {sellerStore.isOfficialStore && (
                    <span className="bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded tracking-wider uppercase">
                      Official Store
                    </span>
                  )}
                  {sellerStore.isVacationMode && (
                    <span className="bg-amber-600/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                      Mode Libur Aktif
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-400 font-normal">
                  AllKurma Seller Center • {sellerStore.city}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentView('home')}
                className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-stone-300 hover:text-white bg-stone-800/80 hover:bg-stone-800 px-3 py-2 rounded-xl transition-all border border-stone-700"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Lihat Toko Sebagai Pembeli
              </button>

              <div className="flex items-center gap-2 bg-stone-800/90 border border-stone-700 rounded-xl px-3 py-1.5">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <div>
                  <div className="text-[10px] text-stone-400 font-medium leading-none">Saldo Penarikan</div>
                  <div className="text-xs font-black text-emerald-400 leading-tight">
                    Rp {sellerStore.payoutBalance.toLocaleString('id-ID')}
                  </div>
                </div>
                <button
                  onClick={() => setIsWithdrawOpen(true)}
                  className="ml-2 text-[10px] font-bold bg-emerald-600 hover:bg-emerald-500 text-white px-2 py-1 rounded-lg transition-colors"
                >
                  Tarik Dana
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="flex items-center space-x-1 sm:space-x-4 overflow-x-auto py-2 border-t border-stone-800 text-xs scrollbar-none">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg font-bold transition-all whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'bg-amber-500 text-stone-950 shadow-xs'
                  : 'text-stone-300 hover:bg-stone-800 hover:text-white'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              Ringkasan & Metrik
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg font-bold transition-all whitespace-nowrap ${
                activeTab === 'settings'
                  ? 'bg-amber-500 text-stone-950 shadow-xs'
                  : 'text-stone-300 hover:bg-stone-800 hover:text-white'
              }`}
            >
              <Settings className="w-4 h-4" />
              Pengaturan Toko General
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg font-bold transition-all whitespace-nowrap relative ${
                activeTab === 'orders'
                  ? 'bg-amber-500 text-stone-950 shadow-xs'
                  : 'text-stone-300 hover:bg-stone-800 hover:text-white'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              Pesanan Toko
              {pendingOrdersCount > 0 && (
                <span className="bg-red-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full">
                  {pendingOrdersCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg font-bold transition-all whitespace-nowrap ${
                activeTab === 'products'
                  ? 'bg-amber-500 text-stone-950 shadow-xs'
                  : 'text-stone-300 hover:bg-stone-800 hover:text-white'
              }`}
            >
              <Package className="w-4 h-4" />
              Katalog & Stok SKU ({products.length})
            </button>

            <button
              onClick={() => setActiveTab('vouchers')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg font-bold transition-all whitespace-nowrap ${
                activeTab === 'vouchers'
                  ? 'bg-amber-500 text-stone-950 shadow-xs'
                  : 'text-stone-300 hover:bg-stone-800 hover:text-white'
              }`}
            >
              <Percent className="w-4 h-4" />
              Voucher & Promo
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg font-bold transition-all whitespace-nowrap ${
                activeTab === 'reviews'
                  ? 'bg-amber-500 text-stone-950 shadow-xs'
                  : 'text-stone-300 hover:bg-stone-800 hover:text-white'
              }`}
            >
              <Star className="w-4 h-4 text-amber-400" />
              Ulasan Pelanggan ({reviews.length})
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">

        {/* 1. TAB: OVERVIEW & RINGKASAN */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
                <div className="flex items-center justify-between text-stone-500 text-xs font-semibold">
                  <span>Total Pendapatan</span>
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-xl sm:text-2xl font-black text-stone-900 mt-2">
                  Rp {totalRevenue.toLocaleString('id-ID')}
                </div>
                <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 mt-1">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  +18.4% bulan ini
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
                <div className="flex items-center justify-between text-stone-500 text-xs font-semibold">
                  <span>Pesanan Perlu Diproses</span>
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-xl sm:text-2xl font-black text-stone-900 mt-2">
                  {pendingOrdersCount} <span className="text-xs font-normal text-stone-500">pesanan</span>
                </div>
                <div className="text-[11px] font-medium text-amber-700 mt-1">
                  {readyToShipCount} siap dikirim hari ini
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
                <div className="flex items-center justify-between text-stone-500 text-xs font-semibold">
                  <span>Rating & Performa Toko</span>
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
                    <Star className="w-4 h-4 fill-amber-400" />
                  </div>
                </div>
                <div className="text-xl sm:text-2xl font-black text-stone-900 mt-2 flex items-baseline gap-1">
                  4.9 <span className="text-xs font-normal text-stone-500">/ 5.0</span>
                </div>
                <div className="text-[11px] font-medium text-emerald-700 mt-1">
                  Respon Chat 99% • 100% Kepuasan
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
                <div className="flex items-center justify-between text-stone-500 text-xs font-semibold">
                  <span>Stok Kritis SKU</span>
                  <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-xl sm:text-2xl font-black text-stone-900 mt-2">
                  {lowStockProducts.length} <span className="text-xs font-normal text-stone-500">produk</span>
                </div>
                <div className="text-[11px] font-medium text-rose-600 mt-1">
                  Perlu restock segera
                </div>
              </div>
            </div>

            {/* Quick Action Cockpit */}
            <div className="bg-stone-900 text-white rounded-2xl p-6 shadow-md border border-stone-800">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="inline-block bg-amber-500 text-stone-950 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider mb-2">
                    Aksi Cepat Penjual
                  </span>
                  <h3 className="text-lg font-bold text-white">
                    Pusat Operasional Toko {sellerStore.storeName}
                  </h3>
                  <p className="text-xs text-stone-300 mt-0.5">
                    Kelola pesanan baru, cetak resi thermal, update harga grosir, dan kelola promosi toko.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleExportSellerOrders}
                    className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
                    title="Download Rekap Laporan Penjualan Toko ke Excel (.csv)"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>Tarik Laporan Excel</span>
                  </button>
                  <button
                    onClick={() => setIsAddProductOpen(true)}
                    className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Tambah Produk Baru
                  </button>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="flex items-center gap-1.5 bg-stone-800 hover:bg-stone-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-stone-700 transition-colors"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Proses Pesanan Masuk
                  </button>
                  <button
                    onClick={() => setActiveTab('settings')}
                    className="flex items-center gap-1.5 bg-stone-800 hover:bg-stone-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-stone-700 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    Pengaturan General
                  </button>
                </div>
              </div>
            </div>

            {/* Low Stock Warning & Recent Orders */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Orders Need Action */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-sm font-bold text-stone-900">Pesanan Masuk Terbaru</h4>
                    <p className="text-xs text-stone-500">Pesanan yang memerlukan konfirmasi dan pengiriman</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1"
                  >
                    Lihat Semua <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="divide-y divide-stone-100">
                  {orders.slice(0, 4).map(order => (
                    <div key={order.id} className="py-3 flex items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-stone-900">#{order.orderNumber}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            order.status === 'Selesai'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : order.status === 'Dikirim'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="text-xs text-stone-600 font-medium mt-0.5">
                          {order.customerName} • {order.items.length} item • <span className="font-bold text-stone-900">Rp {order.total.toLocaleString('id-ID')}</span>
                        </div>
                        <div className="text-[10px] text-stone-400 mt-0.5">
                          Kurir: {order.courierName} • {order.createdAt}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {order.status === 'Diproses' || order.status === 'Belum Bayar' ? (
                          <button
                            onClick={() => handleProcessOrder(order)}
                            className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-2xs transition-colors"
                          >
                            Kirim Pesanan
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedOrderForLabel(order);
                              setTrackingInput(order.trackingNumber || `AK-EXP-${Date.now().toString().slice(-6)}`);
                            }}
                            className="bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            Cetak Resi
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Kurir & Gudang Summary */}
              <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold text-stone-900 mb-1">Status Ekspedisi & Gudang</h4>
                  <p className="text-xs text-stone-500 mb-4">Integrasi kurir aktif dan lokasi pickup</p>

                  <div className="space-y-3">
                    <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs">
                      <div className="font-bold text-stone-800 flex items-center gap-1.5 mb-1">
                        <Building2 className="w-4 h-4 text-amber-600" />
                        Gudang Pengiriman Utama:
                      </div>
                      <div className="text-stone-600 leading-relaxed text-[11px]">
                        {sellerStore.fullAddress}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-xs font-bold text-stone-800">Jasa Kirim Terpasang:</div>
                      {sellerStore.couriers.map(courier => (
                        <div key={courier.id} className="flex items-center justify-between text-xs py-1 border-b border-stone-100 last:border-0">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${courier.active ? 'bg-emerald-500' : 'bg-stone-300'}`} />
                            <span className="font-medium text-stone-800">{courier.name}</span>
                          </div>
                          <button
                            onClick={() => toggleSellerCourier(courier.id)}
                            className="text-[11px] font-bold text-stone-500 hover:text-stone-900"
                          >
                            {courier.active ? 'Aktif' : 'Non-Aktif'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-100 mt-4">
                  <button
                    onClick={() => setActiveTab('settings')}
                    className="w-full text-center text-xs font-bold text-amber-700 hover:text-amber-800 py-2 rounded-xl bg-amber-50 hover:bg-amber-100/70 transition-colors"
                  >
                    Buka Pengaturan Ekspedisi Lengkap
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. TAB: PENGATURAN TOKO GENERAL (KOMPLIT) */}
        {activeTab === 'settings' && (
          <form onSubmit={handleSaveStoreSettings} className="space-y-6">
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs">
              <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-6">
                <div>
                  <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                    <Store className="w-5 h-5 text-amber-600" />
                    Profil & Informasi Toko
                  </h3>
                  <p className="text-xs text-stone-500">
                    Pengaturan identitas publik toko yang dilihat oleh pembeli retail dan grosir
                  </p>
                </div>
                <button
                  type="submit"
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors"
                >
                  Simpan Semua Perubahan
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Nama Toko Resmi</label>
                  <input
                    type="text"
                    value={storeForm.storeName}
                    onChange={e => setStoreForm({ ...storeForm, storeName: e.target.value })}
                    className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Username / Handle Toko</label>
                  <input
                    type="text"
                    value={storeForm.storeHandle}
                    onChange={e => setStoreForm({ ...storeForm, storeHandle: e.target.value })}
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 mb-1">Slogan / Bio Toko Singkat</label>
                  <input
                    type="text"
                    value={storeForm.tagline}
                    onChange={e => setStoreForm({ ...storeForm, tagline: e.target.value })}
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 mb-1">Deskripsi Toko Lengkap</label>
                  <textarea
                    rows={3}
                    value={storeForm.description}
                    onChange={e => setStoreForm({ ...storeForm, description: e.target.value })}
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Jam Operasional Toko</label>
                  <input
                    type="text"
                    value={storeForm.operationalHours}
                    onChange={e => setStoreForm({ ...storeForm, operationalHours: e.target.value })}
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Senin - Sabtu: 08:00 - 18:00 WIB"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Nomor WhatsApp / CS Toko</label>
                  <input
                    type="text"
                    value={storeForm.phone}
                    onChange={e => setStoreForm({ ...storeForm, phone: e.target.value })}
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Email Toko / Penjual</label>
                  <input
                    type="email"
                    value={storeForm.email}
                    onChange={e => setStoreForm({ ...storeForm, email: e.target.value })}
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Nomor NPWP / Pajak Toko</label>
                  <input
                    type="text"
                    value={storeForm.taxNumber}
                    onChange={e => setStoreForm({ ...storeForm, taxNumber: e.target.value })}
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="00.000.000.0-000.000"
                  />
                </div>
              </div>

              {/* Status Mode Libur & Official Store Toggle */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-stone-100">
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-stone-900">Mode Libur (Vacation Mode)</div>
                    <div className="text-[11px] text-stone-500">Tutup sementara checkout pembeli saat toko berlibur</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStoreForm({ ...storeForm, isVacationMode: !storeForm.isVacationMode })}
                    className={`p-1 rounded-lg transition-colors ${storeForm.isVacationMode ? 'text-amber-600' : 'text-stone-400'}`}
                  >
                    {storeForm.isVacationMode ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
                  </button>
                </div>

                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-stone-900">Badge Official Store Terverifikasi</div>
                    <div className="text-[11px] text-stone-500">Jaminan produk 100% original bergaransi resmi</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStoreForm({ ...storeForm, isOfficialStore: !storeForm.isOfficialStore })}
                    className={`p-1 rounded-lg transition-colors ${storeForm.isOfficialStore ? 'text-emerald-600' : 'text-stone-400'}`}
                  >
                    {storeForm.isOfficialStore ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Alamat Gudang & Pengiriman */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2 mb-4">
                <Building2 className="w-5 h-5 text-amber-600" />
                Alamat Gudang & Titik Penjemputan Kurir
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Kota / Kabupaten Gudang</label>
                  <input
                    type="text"
                    value={storeForm.city}
                    onChange={e => setStoreForm({ ...storeForm, city: e.target.value })}
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Kode Pos</label>
                  <input
                    type="text"
                    value={storeForm.postalCode}
                    onChange={e => setStoreForm({ ...storeForm, postalCode: e.target.value })}
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Min. Belanja Gratis Ongkir Toko (Rp)</label>
                  <input
                    type="number"
                    value={storeForm.minFreeShippingOrder}
                    onChange={e => setStoreForm({ ...storeForm, minFreeShippingOrder: parseInt(e.target.value, 10) || 0 })}
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="block text-xs font-bold text-stone-700 mb-1">Alamat Gudang Lengkap (Patokan & Nomor)</label>
                  <textarea
                    rows={2}
                    value={storeForm.fullAddress}
                    onChange={e => setStoreForm({ ...storeForm, fullAddress: e.target.value })}
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Template Balasan Chat Otomatis */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-amber-600" />
                    Template Balasan Otomatis Chat (Auto-Reply)
                  </h3>
                  <p className="text-xs text-stone-500">Tingkatkan respon chat toko dengan balasan instan 24/7</p>
                </div>
                <button
                  type="button"
                  onClick={() => setStoreForm({ ...storeForm, enableAutoReply: !storeForm.enableAutoReply })}
                  className={`p-1 rounded-lg transition-colors ${storeForm.enableAutoReply ? 'text-emerald-600' : 'text-stone-400'}`}
                >
                  {storeForm.enableAutoReply ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Pesan Sambutan Pertama Chat</label>
                  <textarea
                    rows={2}
                    value={storeForm.autoReplyGreeting}
                    onChange={e => setStoreForm({ ...storeForm, autoReplyGreeting: e.target.value })}
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Pesan Di Luar Jam Operasional</label>
                  <textarea
                    rows={2}
                    value={storeForm.autoReplyOffHours}
                    onChange={e => setStoreForm({ ...storeForm, autoReplyOffHours: e.target.value })}
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* Rekening Bank & Jasa Kirim */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Rekening Bank Penarikan */}
              <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs">
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2 mb-3">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  Rekening Bank Penarikan Dana (Payout)
                </h3>
                <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200/80 space-y-1.5 text-xs">
                  <div className="text-stone-500 text-[11px]">Bank Rekening Utama:</div>
                  <div className="font-black text-stone-900 text-sm">{sellerStore.bankAccount.bankName}</div>
                  <div className="font-mono font-bold text-stone-800">{sellerStore.bankAccount.accountNumber}</div>
                  <div className="text-stone-600 text-[11px]">a/n {sellerStore.bankAccount.holderName}</div>
                  <span className="inline-block mt-2 bg-emerald-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                    Terverifikasi Otomatis
                  </span>
                </div>
              </div>

              {/* Ekspedisi Toko */}
              <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs">
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2 mb-3">
                  <Truck className="w-4 h-4 text-amber-600" />
                  Pengaturan Jasa Ekspedisi Pengiriman
                </h3>
                <div className="space-y-2.5">
                  {sellerStore.couriers.map(courier => (
                    <div key={courier.id} className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-stone-900">{courier.name}</div>
                        <div className="text-[10px] text-stone-500">Tipe: {courier.type}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleSellerCourier(courier.id)}
                        className={`text-xs font-bold px-3 py-1 rounded-lg border transition-colors ${
                          courier.active
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-stone-200 text-stone-600 border-stone-300'
                        }`}
                      >
                        {courier.active ? 'Aktif' : 'Non-Aktif'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Sticky Save */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
              <button
                type="submit"
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm px-8 py-3 rounded-xl shadow-md transition-colors"
              >
                Simpan Seluruh Pengaturan Toko
              </button>
            </div>
          </form>
        )}

        {/* 3. TAB: PESANAN TOKO (ORDERS) */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {/* Filter Tabs & Export Button */}
            <div className="bg-white rounded-2xl border border-stone-200 p-3 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2 overflow-x-auto">
                {(['All', 'Perlu Diproses', 'Dikirim', 'Selesai', 'Retur'] as const).map(status => (
                  <button
                    key={status}
                    onClick={() => setOrderStatusFilter(status)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                      orderStatusFilter === status
                        ? 'bg-stone-900 text-white'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {status} ({orders.filter(o => status === 'All' ? true : status === 'Perlu Diproses' ? (o.status === 'Belum Bayar' || o.status === 'Diproses') : o.status === status).length})
                  </button>
                ))}
              </div>

              <button
                onClick={handleExportSellerOrders}
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-xs transition-colors shrink-0 self-end sm:self-auto cursor-pointer"
                title="Download Laporan Pesanan Ini ke Excel (.csv)"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Unduh Excel ({filteredOrders.length})</span>
              </button>
            </div>

            {/* Orders List */}
            <div className="space-y-3">
              {filteredOrders.map(order => (
                <div key={order.id} className="bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-stone-100 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-stone-900 text-sm">#{order.orderNumber}</span>
                      <span className="text-stone-400">•</span>
                      <span className="font-semibold text-stone-700">{order.customerName}</span>
                      <span className="text-stone-400">({order.customerType})</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        order.status === 'Selesai'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : order.status === 'Dikirim'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : order.status === 'Retur'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {order.status}
                      </span>
                      <span className="text-stone-400 text-[11px]">{order.createdAt}</span>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="space-y-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-xs">
                        <img src={item.image} alt={item.productName} className="w-12 h-12 rounded-lg object-cover border border-stone-200" />
                        <div className="flex-1">
                          <div className="font-bold text-stone-900">{item.productName}</div>
                          <div className="text-[11px] text-stone-500">SKU: {item.sku} • Qty: {item.quantity} pcs</div>
                        </div>
                        <div className="font-black text-stone-900">
                          Rp {item.lineTotal.toLocaleString('id-ID')}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer & Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-100 text-xs">
                    <div>
                      <span className="text-stone-500">Tujuan Pengiriman: </span>
                      <span className="font-semibold text-stone-800">
                        {order.shippingAddress.city}, {order.shippingAddress.province} ({order.courierName})
                      </span>
                      {order.trackingNumber && (
                        <div className="text-[11px] font-mono text-blue-700 font-bold mt-0.5">
                          No. Resi: {order.trackingNumber}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="text-right mr-3">
                        <div className="text-[10px] text-stone-400">Total Tagihan</div>
                        <div className="text-sm font-black text-amber-700">Rp {order.total.toLocaleString('id-ID')}</div>
                      </div>

                      {order.status === 'Belum Bayar' || order.status === 'Diproses' ? (
                        <button
                          onClick={() => handleProcessOrder(order)}
                          className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-2xs transition-colors flex items-center gap-1.5"
                        >
                          <Send className="w-3.5 h-3.5" />
                          Kirim / Pickup Kurir
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedOrderForLabel(order);
                            setTrackingInput(order.trackingNumber || `AK-EXP-${Date.now().toString().slice(-6)}`);
                          }}
                          className="bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          Cetak Resi Thermal
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. TAB: PRODUK & STOK TOKO */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
              <div>
                <h3 className="text-sm font-bold text-stone-900">Manajemen Katalog Produk & SKU</h3>
                <p className="text-xs text-stone-500">Kelola harga eceran, harga grosir bertingkat, dan stok real-time</p>
              </div>
              <button
                onClick={() => setIsAddProductOpen(true)}
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Tambah Produk Baru
              </button>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 text-stone-600 font-bold border-b border-stone-200">
                    <tr>
                      <th className="p-3.5">Produk / SKU</th>
                      <th className="p-3.5">Kategori</th>
                      <th className="p-3.5">Harga Eceran</th>
                      <th className="p-3.5">Harga Diskon</th>
                      <th className="p-3.5">Stok Unit</th>
                      <th className="p-3.5">Terjual</th>
                      <th className="p-3.5 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {products.map(prod => (
                      <tr key={prod.id} className="hover:bg-stone-50/60 transition-colors">
                        <td className="p-3.5">
                          <div className="flex items-center gap-3">
                            <img src={prod.images[0]} alt={prod.name} className="w-10 h-10 rounded-lg object-cover border border-stone-200" />
                            <div>
                              <div className="font-bold text-stone-900 line-clamp-1">{prod.name}</div>
                              <div className="text-[10px] text-stone-500 font-mono">SKU: {prod.sku} • {prod.origin}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3.5">
                          <span className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md font-semibold text-[10px]">
                            {prod.category}
                          </span>
                        </td>
                        <td className="p-3.5 font-bold text-stone-800">
                          Rp {prod.regularPrice.toLocaleString('id-ID')}
                        </td>
                        <td className="p-3.5 font-bold text-emerald-700">
                          {prod.discountPrice ? `Rp ${prod.discountPrice.toLocaleString('id-ID')}` : '-'}
                        </td>
                        <td className="p-3.5">
                          <span className={`font-bold ${prod.stock <= prod.minStockAlert ? 'text-rose-600 font-black' : 'text-stone-800'}`}>
                            {prod.stock} unit
                          </span>
                          {prod.stock <= prod.minStockAlert && (
                            <span className="block text-[9px] text-rose-600 font-bold">Stok Kritis!</span>
                          )}
                        </td>
                        <td className="p-3.5 font-semibold text-stone-600">
                          {prod.soldCount} terjual
                        </td>
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setSelectedProductId(prod.id);
                                setCurrentView('product-detail');
                              }}
                              className="p-1.5 text-stone-500 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
                              title="Lihat Detail"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                const newStock = prompt(`Update stok untuk ${prod.name}:`, prod.stock.toString());
                                if (newStock !== null) {
                                  const parsed = parseInt(newStock, 10);
                                  if (!isNaN(parsed) && parsed >= 0) {
                                    updateProduct(prod.id, { stock: parsed });
                                    showToast(`Stok ${prod.name} diupdate menjadi ${parsed} unit`, 'success');
                                  }
                                }
                              }}
                              className="p-1.5 text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors"
                              title="Edit Stok Cepat"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Hapus produk ${prod.name}?`)) {
                                  deleteProduct(prod.id);
                                }
                              }}
                              className="p-1.5 text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors"
                              title="Hapus Produk"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 5. TAB: VOUCHER & PROMO TOKO */}
        {activeTab === 'vouchers' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
              <div>
                <h3 className="text-sm font-bold text-stone-900">Manajemen Kupon & Promo Toko</h3>
                <p className="text-xs text-stone-500">Buat voucher diskon untuk menarik pelanggan dan meningkatkan transaksi</p>
              </div>
              <button
                onClick={() => setIsAddVoucherOpen(true)}
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Buat Voucher Baru
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {promotions.map(promo => (
                <div key={promo.id} className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-black text-sm text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                        {promo.code}
                      </span>
                      <button
                        onClick={() => togglePromotionStatus(promo.id)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          promo.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-stone-200 text-stone-600'
                        }`}
                      >
                        {promo.status === 'Active' ? 'Aktif' : 'Non-Aktif'}
                      </button>
                    </div>

                    <h4 className="font-bold text-stone-900 text-sm mt-2">{promo.name}</h4>
                    <p className="text-xs text-stone-500 mt-1">{promo.description}</p>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600">
                    <div>
                      <span>Min. Belanja: </span>
                      <span className="font-bold text-stone-900">Rp {promo.minPurchase.toLocaleString('id-ID')}</span>
                    </div>
                    <div>
                      <span>Terpakai: </span>
                      <span className="font-bold text-stone-900">{promo.usedCount} / {promo.totalUsageLimit}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. TAB: ULASAN & KEPUASAN PEMBELI */}
        {activeTab === 'reviews' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
              <h3 className="text-sm font-bold text-stone-900">Ulasan & Reputasi Toko</h3>
              <p className="text-xs text-stone-500">Tanggapi ulasan pembeli untuk menjaga rating dan kepuasan pelanggan</p>
            </div>

            <div className="space-y-3">
              {reviews.map(rev => (
                <div key={rev.id} className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-xs">
                        {rev.userName.charAt(0)}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-stone-900">{rev.userName}</div>
                        <div className="flex items-center gap-1 text-amber-500">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'}`}
                            />
                          ))}
                          <span className="text-[10px] text-stone-400 ml-1">
                            {rev.date || rev.createdAt || 'Baru saja'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {rev.variationName && (
                      <span className="bg-stone-100 text-stone-600 text-[10px] font-medium px-2 py-0.5 rounded">
                        Variasi: {rev.variationName}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-stone-700 leading-relaxed">{rev.comment}</p>

                  {/* Seller Reply Box */}
                  <div className="pt-2 border-t border-stone-100">
                    {replyingReviewId === rev.id ? (
                      <div className="flex gap-2 mt-2">
                        <input
                          type="text"
                          value={replyText}
                          onChange={e => setReplyText(e.target.value)}
                          placeholder="Tulis balasan resmi toko..."
                          className="flex-1 text-xs px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                        <button
                          onClick={() => {
                            if (replyText.trim()) {
                              replySellerReview(rev.id, replyText);
                              setReplyingReviewId(null);
                              setReplyText('');
                            }
                          }}
                          className="bg-amber-600 text-white text-xs font-bold px-4 py-2 rounded-xl"
                        >
                          Kirim
                        </button>
                        <button
                          onClick={() => setReplyingReviewId(null)}
                          className="bg-stone-100 text-stone-700 text-xs font-bold px-3 py-2 rounded-xl"
                        >
                          Batal
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setReplyingReviewId(rev.id)}
                        className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        Balas Ulasan Ini Sebagai Seller
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* MODAL: TARIK DANA PENJUAL (WITHDRAWAL) */}
      {isWithdrawOpen && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-600" />
                Penarikan Saldo Penjualan
              </h3>
              <button onClick={() => setIsWithdrawOpen(false)} className="text-stone-400 hover:text-stone-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleWithdrawSubmit} className="space-y-4">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                <div className="text-xs text-stone-600">Saldo Penjualan Siap Ditarik:</div>
                <div className="text-2xl font-black text-emerald-700 mt-0.5">
                  Rp {sellerStore.payoutBalance.toLocaleString('id-ID')}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Rekening Tujuan (BCA)</label>
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs">
                  <div className="font-bold text-stone-800">{sellerStore.bankAccount.bankName}</div>
                  <div className="font-mono text-stone-600">{sellerStore.bankAccount.accountNumber} - a/n {sellerStore.bankAccount.holderName}</div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Nominal Penarikan (Rp)</label>
                <input
                  type="number"
                  max={sellerStore.payoutBalance}
                  min={50000}
                  value={withdrawAmount}
                  onChange={e => setWithdrawAmount(e.target.value)}
                  placeholder="Contoh: 1000000"
                  className="w-full text-sm font-bold px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
                <div className="text-[11px] text-stone-400 mt-1">Min. Penarikan Rp 50.000 (Bebas Biaya Admin)</div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsWithdrawOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs transition-colors"
                >
                  Konfirmasi Penarikan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CETAK RESI THERMAL / SHIPPING LABEL */}
      {selectedOrderForLabel && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <Printer className="w-5 h-5 text-amber-600" />
                Thermal Shipping Label
              </h3>
              <button onClick={() => setSelectedOrderForLabel(null)} className="text-stone-400 hover:text-stone-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Simulated Thermal Label */}
            <div className="border-2 border-dashed border-stone-400 p-5 rounded-2xl bg-stone-50 font-mono text-xs space-y-3">
              <div className="flex items-center justify-between border-b border-stone-300 pb-2">
                <div>
                  <div className="font-black text-sm">ALLKURMA LOGISTICS</div>
                  <div className="text-[10px] text-stone-600">{selectedOrderForLabel.courierName} (REGULER)</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-[10px]">NO. RESI:</div>
                  <div className="font-black text-xs text-blue-800">{trackingInput}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] border-b border-stone-300 pb-2">
                <div>
                  <div className="font-bold text-stone-500">PENGIRIM:</div>
                  <div className="font-bold text-stone-900">{sellerStore.storeName}</div>
                  <div className="text-stone-600">{sellerStore.city} ({sellerStore.phone})</div>
                </div>
                <div>
                  <div className="font-bold text-stone-500">PENERIMA:</div>
                  <div className="font-bold text-stone-900">{selectedOrderForLabel.customerName}</div>
                  <div className="text-stone-600">{selectedOrderForLabel.shippingAddress.streetAddress}, {selectedOrderForLabel.shippingAddress.city}</div>
                </div>
              </div>

              <div className="text-[11px]">
                <div className="font-bold text-stone-500 mb-1">DAFTAR ISI BARANG:</div>
                {selectedOrderForLabel.items.map((it, i) => (
                  <div key={i} className="flex justify-between">
                    <span>{it.quantity}x {it.productName}</span>
                    <span>Rp {it.lineTotal.toLocaleString('id-ID')}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-stone-300 pt-2 flex justify-between font-black text-xs">
                <span>TOTAL:</span>
                <span>Rp {selectedOrderForLabel.total.toLocaleString('id-ID')}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-stone-100 mt-4">
              <button
                onClick={() => setSelectedOrderForLabel(null)}
                className="px-4 py-2 text-xs font-bold text-stone-600 hover:bg-stone-100 rounded-xl"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-5 py-2 text-xs font-bold bg-stone-900 hover:bg-stone-800 text-white rounded-xl shadow-xs flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                Cetak Label Fisik
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: TAMBAH PRODUK BARU */}
      {isAddProductOpen && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-stone-200 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-600" />
                Tambah Produk Kurma Baru
              </h3>
              <button onClick={() => setIsAddProductOpen(false)} className="text-stone-400 hover:text-stone-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={e => {
                e.preventDefault();
                if (!newProd.name || !newProd.regularPrice) {
                  showToast('Mohon lengkapi nama dan harga produk!', 'error');
                  return;
                }
                addProduct({
                  name: newProd.name,
                  sku: newProd.sku || `AK-${Date.now().toString().slice(-4)}`,
                  category: newProd.category as any,
                  regularPrice: Number(newProd.regularPrice),
                  discountPrice: newProd.discountPrice ? Number(newProd.discountPrice) : undefined,
                  stock: Number(newProd.stock) || 50,
                  minStockAlert: 10,
                  origin: newProd.origin || 'Madinah, Saudi Arabia',
                  description: newProd.description || 'Kurma pilihan kualitas ekspor kemasan higienis.',
                  warehouseLocation: sellerStore.city,
                  weightGram: Number(newProd.weightGram) || 500,
                  images: newProd.images || ['https://images.unsplash.com/photo-1596797882870-8c33deeac224?w=600&auto=format&fit=crop&q=80'],
                  wholesalePrices: [
                    { minQty: 1, maxQty: 10, pricePerUnit: Number(newProd.regularPrice) },
                    { minQty: 11, maxQty: 50, pricePerUnit: Math.round(Number(newProd.regularPrice) * 0.9) },
                    { minQty: 51, maxQty: undefined, pricePerUnit: Math.round(Number(newProd.regularPrice) * 0.8) }
                  ],
                  rating: 5.0,
                  reviewCount: 0,
                  soldCount: 0,
                  freeShippingExtra: true,
                  cashbackExtra: true
                });
                setIsAddProductOpen(false);
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block font-bold text-stone-700 mb-1">Nama Produk Kurma</label>
                <input
                  type="text"
                  value={newProd.name}
                  onChange={e => setNewProd({ ...newProd, name: e.target.value })}
                  placeholder="Contoh: Kurma Ajwa Madinah Grade VIP 500g"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Kategori</label>
                  <select
                    value={newProd.category}
                    onChange={e => setNewProd({ ...newProd, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Ajwa">Ajwa</option>
                    <option value="Sukari">Sukari</option>
                    <option value="Medjool">Medjool</option>
                    <option value="Tunisia">Tunisia</option>
                    <option value="Khalas">Khalas</option>
                    <option value="Grosir">Grosir</option>
                    <option value="Hampers">Hampers</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">SKU Produk</label>
                  <input
                    type="text"
                    value={newProd.sku}
                    onChange={e => setNewProd({ ...newProd, sku: e.target.value })}
                    placeholder="AK-AJW-500"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Harga Normal (Rp)</label>
                  <input
                    type="number"
                    value={newProd.regularPrice}
                    onChange={e => setNewProd({ ...newProd, regularPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Harga Diskon Promo (Rp)</label>
                  <input
                    type="number"
                    value={newProd.discountPrice || ''}
                    onChange={e => setNewProd({ ...newProd, discountPrice: Number(e.target.value) })}
                    placeholder="Opsional"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Stok Awal</label>
                  <input
                    type="number"
                    value={newProd.stock}
                    onChange={e => setNewProd({ ...newProd, stock: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Berat Kemasan (Gram)</label>
                  <input
                    type="number"
                    value={newProd.weightGram}
                    onChange={e => setNewProd({ ...newProd, weightGram: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Deskripsi Produk</label>
                <textarea
                  rows={3}
                  value={newProd.description}
                  onChange={e => setNewProd({ ...newProd, description: e.target.value })}
                  placeholder="Jelaskan grade buah, tekstur, rasa, dan sertifikat higienis..."
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="px-4 py-2 font-bold text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-xs"
                >
                  Publikasikan Produk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: TAMBAH VOUCHER BARU */}
      {isAddVoucherOpen && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <Percent className="w-5 h-5 text-amber-600" />
                Buat Kupon Diskon Toko
              </h3>
              <button onClick={() => setIsAddVoucherOpen(false)} className="text-stone-400 hover:text-stone-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={e => {
                e.preventDefault();
                if (!newVoucher.code || !newVoucher.discountValue) {
                  showToast('Mohon lengkapi kode dan nilai diskon!', 'error');
                  return;
                }
                createPromotion({
                  name: newVoucher.name || `Diskon Toko ${newVoucher.code}`,
                  code: newVoucher.code.toUpperCase(),
                  status: 'Active',
                  description: newVoucher.description || `Potongan Rp ${newVoucher.discountValue.toLocaleString('id-ID')} untuk produk AllKurma.`,
                  discountType: newVoucher.discountType,
                  discountValue: Number(newVoucher.discountValue),
                  minPurchase: Number(newVoucher.minPurchase) || 50000,
                  totalUsageLimit: Number(newVoucher.totalUsageLimit) || 100,
                  usagePerCustomer: 1,
                  startDate: new Date().toISOString().split('T')[0],
                  endDate: '2026-12-31',
                  customerSegment: 'All Customers'
                });
                setIsAddVoucherOpen(false);
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block font-bold text-stone-700 mb-1">Nama Voucher Promo</label>
                <input
                  type="text"
                  value={newVoucher.name}
                  onChange={e => setNewVoucher({ ...newVoucher, name: e.target.value })}
                  placeholder="Contoh: Diskon Spesial Ramadhan"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Kode Voucher (Kupon)</label>
                <input
                  type="text"
                  value={newVoucher.code}
                  onChange={e => setNewVoucher({ ...newVoucher, code: e.target.value.toUpperCase() })}
                  placeholder="RAMADHAN25K"
                  className="w-full font-mono font-bold px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Potongan Nilai (Rp)</label>
                  <input
                    type="number"
                    value={newVoucher.discountValue}
                    onChange={e => setNewVoucher({ ...newVoucher, discountValue: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Min. Belanja (Rp)</label>
                  <input
                    type="number"
                    value={newVoucher.minPurchase}
                    onChange={e => setNewVoucher({ ...newVoucher, minPurchase: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Batas Kuota Pemakaian</label>
                <input
                  type="number"
                  value={newVoucher.totalUsageLimit}
                  onChange={e => setNewVoucher({ ...newVoucher, totalUsageLimit: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsAddVoucherOpen(false)}
                  className="px-4 py-2 font-bold text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-xs"
                >
                  Rilis Kupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
