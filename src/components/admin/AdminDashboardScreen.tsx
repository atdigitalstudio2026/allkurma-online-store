import React from 'react';
import { 
  TrendingUp, 
  Package, 
  AlertTriangle, 
  Building2, 
  Plus, 
  ShoppingCart, 
  Layers, 
  Users, 
  Tag, 
  ShieldCheck, 
  ArrowLeft,
  FileSpreadsheet,
  Download
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { exportSalesReportToExcel } from '../../utils/exportReport';

export const AdminDashboardScreen: React.FC = () => {
  const { 
    products, 
    orders, 
    updateOrderStatus, 
    setCurrentView, 
    showToast,
    addStockMovement 
  } = useApp();

  const lowStockProducts = products.filter(p => p.stock <= p.minStockAlert);
  const recentOrders = orders.slice(0, 4);

  const handleDownloadExcel = () => {
    try {
      exportSalesReportToExcel(orders, 'Laporan_Penjualan_AllKurma_Admin');
      showToast('Laporan penjualan (.csv / Excel) berhasil diunduh!', 'success');
    } catch (e: any) {
      showToast(e.message || 'Gagal mengunduh laporan', 'error');
    }
  };

  // Quick stats
  const totalSales = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingOrdersCount = orders.filter(o => o.status === 'Diproses' || o.status === 'Belum Bayar').length;

  return (
    <div className="pb-28 max-w-lg mx-auto bg-stone-50 min-h-screen">
      
      {/* Top Header */}
      <div className="sticky top-0 z-30 bg-stone-900 text-white px-4 py-3 flex items-center justify-between border-b border-stone-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentView('home')}
            className="p-1 rounded-lg text-stone-300 hover:text-white hover:bg-stone-800"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-sm font-bold font-['Playfair_Display',serif] text-amber-300">
              Admin Command Center
            </h1>
            <p className="text-[10px] text-stone-400">AllKurma Enterprise Operations</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadExcel}
            className="px-2.5 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 shadow-xs"
            title="Download Rekap Laporan Penjualan (.csv / Excel)"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tarik Excel</span>
          </button>

          <button
            onClick={() => setCurrentView('admin-add-product')}
            className="px-2.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Produk</span>
          </button>
        </div>
      </div>

      {/* 1. Metric Cards Grid (Matching Screenshot 2 screen 4) */}
      <div className="p-4 space-y-3">
        <div className="grid grid-cols-2 gap-2.5">
          
          <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between text-stone-400 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">Total Penjualan</span>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-sm font-black text-stone-900 font-mono">
              Rp {totalSales.toLocaleString('id-ID')}
            </div>
            <span className="text-[9px] text-emerald-600 font-bold block mt-0.5">
              +18.4% vs bulan lalu
            </span>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between text-stone-400 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">Pesanan Antrean</span>
              <ShoppingCart className="w-4 h-4 text-amber-700" />
            </div>
            <div className="text-sm font-black text-stone-900 font-mono">
              {pendingOrdersCount} Pesanan
            </div>
            <span className="text-[9px] text-amber-700 font-bold block mt-0.5">
              Perlu segera diproses
            </span>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between text-stone-400 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">Stok Menipis</span>
              <AlertTriangle className="w-4 h-4 text-red-600" />
            </div>
            <div className="text-sm font-black text-red-700 font-mono">
              {lowStockProducts.length} SKU Kritis
            </div>
            <span className="text-[9px] text-red-600 font-bold block mt-0.5">
              Di bawah batas minimum
            </span>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between text-stone-400 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">Mitra B2B</span>
              <Building2 className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-sm font-black text-stone-900 font-mono">
              28 Perusahaan
            </div>
            <span className="text-[9px] text-blue-600 font-bold block mt-0.5">
              Tier Gold & Silver
            </span>
          </div>

        </div>

        {/* 2. Quick Action Tiles (Matching Screenshot 2 screen 4) */}
        <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs">
          <h2 className="text-xs font-bold text-stone-900 mb-3 tracking-tight">
            Aksi Manajemen Cepat
          </h2>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            
            <button
              onClick={() => setCurrentView('admin-add-product')}
              className="p-2.5 bg-amber-50 hover:bg-amber-100 rounded-xl border border-amber-200 text-amber-900 flex flex-col items-center gap-1 transition-colors"
            >
              <Plus className="w-5 h-5 text-amber-800" />
              <span className="font-bold text-[10px]">Tambah Produk</span>
            </button>

            <button
              onClick={() => setCurrentView('admin-orders')}
              className="p-2.5 bg-stone-50 hover:bg-stone-100 rounded-xl border border-stone-200 text-stone-800 flex flex-col items-center gap-1 transition-colors"
            >
              <Package className="w-5 h-5 text-stone-700" />
              <span className="font-bold text-[10px]">Kelola Pesanan</span>
            </button>

            <button
              onClick={() => setCurrentView('admin-stock')}
              className="p-2.5 bg-stone-50 hover:bg-stone-100 rounded-xl border border-stone-200 text-stone-800 flex flex-col items-center gap-1 transition-colors"
            >
              <Layers className="w-5 h-5 text-stone-700" />
              <span className="font-bold text-[10px]">Stok Gudang</span>
            </button>

            <button
              onClick={() => setCurrentView('admin-customers')}
              className="p-2.5 bg-stone-50 hover:bg-stone-100 rounded-xl border border-stone-200 text-stone-800 flex flex-col items-center gap-1 transition-colors"
            >
              <Users className="w-5 h-5 text-stone-700" />
              <span className="font-bold text-[10px]">Pelanggan CRM</span>
            </button>

            <button
              onClick={() => setCurrentView('admin-promotions')}
              className="p-2.5 bg-stone-50 hover:bg-stone-100 rounded-xl border border-stone-200 text-stone-800 flex flex-col items-center gap-1 transition-colors"
            >
              <Tag className="w-5 h-5 text-stone-700" />
              <span className="font-bold text-[10px]">Kupon Promo</span>
            </button>

            <button
              onClick={() => setCurrentView('admin-roles')}
              className="p-2.5 bg-stone-50 hover:bg-stone-100 rounded-xl border border-stone-200 text-stone-800 flex flex-col items-center gap-1 transition-colors"
            >
              <ShieldCheck className="w-5 h-5 text-stone-700" />
              <span className="font-bold text-[10px]">Hak Akses RBAC</span>
            </button>

          </div>
        </div>

        {/* 3. Critical Low Stock Alerts */}
        {lowStockProducts.length > 0 && (
          <div className="bg-red-50/70 rounded-2xl border border-red-200 p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <h3 className="font-bold text-xs text-red-950">
                  Peringatan Stok Menipis ({lowStockProducts.length} Produk)
                </h3>
              </div>
              <button
                onClick={() => setCurrentView('admin-stock')}
                className="text-[10px] text-red-800 font-bold hover:underline"
              >
                Lihat Semua
              </button>
            </div>

            <div className="space-y-2">
              {lowStockProducts.map(p => (
                <div
                  key={p.id}
                  className="bg-white p-2.5 rounded-xl border border-red-200 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <img src={p.images?.[0] || 'https://images.unsplash.com/photo-1596797882870-8c33deeac224?w=600&auto=format&fit=crop&q=80'} alt={p.name} className="w-8 h-8 rounded-md object-cover" />
                    <div>
                      <span className="font-bold text-stone-900 block truncate max-w-[140px]">{p.name}</span>
                      <span className="text-[10px] font-mono text-red-700 font-bold">
                        Sisa {p.stock} pcs (Min: {p.minStockAlert})
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      addStockMovement({
                        productName: p.name,
                        sku: p.sku,
                        type: 'Inbound',
                        quantityChange: 50,
                        unit: 'pcs',
                        sourceOrDestination: 'Supplier Jeddah Import',
                        warehouse: 'Gudang Utama',
                        officer: 'Admin Ops'
                      });
                      showToast(`Stok ${p.name} berhasil ditambah 50 pcs!`, 'success');
                    }}
                    className="px-2.5 py-1 bg-amber-800 hover:bg-amber-900 text-white rounded-lg text-[10px] font-bold"
                  >
                    + Restock 50
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Recent Orders Table (Matching Screenshot 2 screen 4) */}
        <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs text-stone-900 tracking-tight">
              Pesanan Terbaru Masuk
            </h3>
            <button
              onClick={() => setCurrentView('admin-orders')}
              className="text-[11px] text-amber-800 font-bold hover:underline"
            >
              Kelola Semua →
            </button>
          </div>

          <div className="space-y-2.5">
            {recentOrders.map(ord => (
              <div
                key={ord.id}
                className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-stone-900">{ord.orderNumber}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-100 text-amber-900">
                    {ord.status}
                  </span>
                </div>

                <div className="text-[11px] text-stone-600">
                  {ord.items.length} Barang • Total: <strong className="text-amber-950 font-mono">Rp {ord.total.toLocaleString('id-ID')}</strong>
                </div>

                {/* Quick Status Advance Action */}
                <div className="flex items-center justify-between pt-1 border-t border-stone-200/60">
                  <span className="text-[10px] text-stone-500">{ord.courierName}</span>
                  {ord.status === 'Diproses' && (
                    <button
                      onClick={() => {
                        updateOrderStatus(ord.id, 'Dikirim');
                        showToast(`Pesanan ${ord.orderNumber} diubah ke status DIKIRIM!`, 'success');
                      }}
                      className="px-2.5 py-1 bg-purple-700 text-white rounded-lg text-[10px] font-bold hover:bg-purple-800"
                    >
                      Kirim & Terbitkan Resi
                    </button>
                  )}
                  {ord.status === 'Dikirim' && (
                    <button
                      onClick={() => {
                        updateOrderStatus(ord.id, 'Selesai');
                        showToast(`Pesanan ${ord.orderNumber} ditandai SELESAI!`, 'success');
                      }}
                      className="px-2.5 py-1 bg-emerald-700 text-white rounded-lg text-[10px] font-bold hover:bg-emerald-800"
                    >
                      Tandai Selesai
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
