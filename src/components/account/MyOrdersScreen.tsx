import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Package, 
  Truck, 
  Repeat, 
  RotateCcw, 
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus } from '../../types';

export const MyOrdersScreen: React.FC = () => {
  const { orders, products, setCurrentView, addToCart, showToast } = useApp();
  const [selectedStatusTab, setSelectedStatusTab] = useState<string>('all');
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);
  const [isRmaModalOpen, setIsRmaModalOpen] = useState(false);
  const [rmaReason, setRmaReason] = useState('');
  const [rmaOrder, setRmaOrder] = useState<Order | null>(null);

  const tabs = [
    { id: 'all', label: 'Semua' },
    { id: 'Belum Bayar', label: 'Belum Bayar' },
    { id: 'Diproses', label: 'Diproses' },
    { id: 'Dikirim', label: 'Dikirim' },
    { id: 'Selesai', label: 'Selesai' },
  ];

  const filteredOrders = orders.filter(o => {
    if (selectedStatusTab === 'all') return true;
    return o.status === selectedStatusTab;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Belum Bayar':
        return <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-full">Belum Bayar</span>;
      case 'Diproses':
        return <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded-full">Diproses</span>;
      case 'Dikirim':
        return <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-[10px] font-bold rounded-full">Dalam Pengiriman</span>;
      case 'Selesai':
        return <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">Selesai</span>;
      case 'Dibatalkan':
        return <span className="px-2 py-0.5 bg-red-100 text-red-800 text-[10px] font-bold rounded-full">Dibatalkan</span>;
      case 'Retur':
        return <span className="px-2 py-0.5 bg-orange-100 text-orange-800 text-[10px] font-bold rounded-full">Retur / RMA</span>;
      default:
        return <span className="px-2 py-0.5 bg-stone-100 text-stone-700 text-[10px] font-bold rounded-full">{status}</span>;
    }
  };

  const handleReorder = (order: Order) => {
    order.items.forEach(item => {
      const prod = products.find(p => p.id === item.productId);
      if (prod) {
        addToCart(prod, item.quantity);
      }
    });
    showToast(`${order.items.length} produk dari pesanan ${order.orderNumber} dimasukkan kembali ke keranjang!`, 'success');
    setCurrentView('cart');
  };

  const handleRmaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(`Pengajuan retur/komplain untuk ${rmaOrder?.orderNumber} berhasil dicatat dengan nomor tiket #RMA-2026-${Math.floor(1000 + Math.random() * 9000)}. Tim QC akan menghubungi Anda dalam 1x24 jam.`, 'success');
    setIsRmaModalOpen(false);
    setRmaReason('');
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
          Riwayat Pesanan & Belanja
        </h1>

        <div className="w-8" />
      </div>

      {/* 1. Status Filter Tabs (Matching Screenshot 2 screen 2) */}
      <div className="bg-white border-b border-stone-200 px-4 py-2 overflow-x-auto scrollbar-none">
        <div className="flex gap-1.5">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedStatusTab(tab.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${
                selectedStatusTab === tab.id
                  ? 'bg-amber-800 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Orders Cards List (Matching Screenshot 2 screen 2 & 3) */}
      <div className="p-4 space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-stone-200 p-6">
            <Package className="w-10 h-10 text-stone-300 mx-auto mb-2" />
            <h3 className="font-bold text-stone-800 text-sm">Tidak Ada Pesanan</h3>
            <p className="text-xs text-stone-500 mt-1">Belum ada pesanan pada status ini.</p>
            <button
              onClick={() => setCurrentView('catalog')}
              className="mt-4 px-4 py-2 bg-amber-800 text-white rounded-xl text-xs font-bold"
            >
              Belanja Sekarang
            </button>
          </div>
        ) : (
          filteredOrders.map(order => (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs space-y-3"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-amber-800" />
                  <span className="font-bold text-xs text-stone-900 font-mono">
                    {order.orderNumber}
                  </span>
                </div>
                {getStatusBadge(order.status)}
              </div>

              {/* Items in order */}
              <div className="space-y-2">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="w-12 h-12 rounded-xl object-cover border border-stone-100 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-stone-900 truncate">
                        {item.productName}
                      </h4>
                      <p className="text-[11px] text-stone-500">
                        {item.quantity} x Rp {item.unitPrice.toLocaleString('id-ID')}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-amber-950 font-mono">
                      Rp {item.lineTotal.toLocaleString('id-ID')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Total & Logistics */}
              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-stone-500 block">
                    {order.courierName} {order.trackingNumber && `• Resi: ${order.trackingNumber}`}
                  </span>
                  <span className="text-[10px] text-stone-400">{order.createdAt}</span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-stone-400 block">Total Tagihan</span>
                  <span className="font-black text-amber-950 text-sm font-mono">
                    Rp {order.total.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="pt-2 border-t border-stone-100 flex flex-wrap gap-2 justify-end">
                {order.trackingNumber && (
                  <button
                    onClick={() => setTrackingOrder(order)}
                    className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Lacak Resi</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setRmaOrder(order);
                    setIsRmaModalOpen(true);
                  }}
                  className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-medium flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Komplain / RMA</span>
                </button>

                <button
                  onClick={() => handleReorder(order)}
                  className="px-3 py-1.5 bg-amber-800 hover:bg-amber-900 active:scale-95 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs transition-all"
                >
                  <Repeat className="w-3.5 h-3.5" />
                  <span>Beli Lagi</span>
                </button>
              </div>

            </div>
          ))
        )}
      </div>

      {/* 3. Tracking Modal with Timeline */}
      {trackingOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-bold text-stone-900 text-sm">Lacak Pengiriman Kurir</h3>
                <p className="text-[11px] font-mono text-amber-800">
                  {trackingOrder.courierName} • {trackingOrder.trackingNumber}
                </p>
              </div>
              <button
                onClick={() => setTrackingOrder(null)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Visual Milestones */}
            <div className="space-y-4 text-xs pl-2 relative border-l-2 border-amber-300 ml-2">
              <div className="relative pl-4">
                <span className="w-3 h-3 rounded-full bg-emerald-600 absolute -left-[23px] top-0.5 ring-4 ring-emerald-100" />
                <span className="font-bold text-stone-900 block">Paket Sedang Dibawa Kurir Menuju Alamat</span>
                <span className="text-[10px] text-stone-500">Jakarta Selatan Hub • Hari ini 14:30 WIB</span>
              </div>
              <div className="relative pl-4">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-600 absolute -left-[22px] top-0.5" />
                <span className="font-bold text-stone-900 block">Tiba di Sorting Center Jakarta Hub 1</span>
                <span className="text-[10px] text-stone-500">Kemarin 21:15 WIB</span>
              </div>
              <div className="relative pl-4">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-600 absolute -left-[22px] top-0.5" />
                <span className="font-bold text-stone-900 block">Diserahkan ke Kurir dari Gudang Pusat</span>
                <span className="text-[10px] text-stone-500">2 hari lalu 10:00 WIB</span>
              </div>
              <div className="relative pl-4">
                <span className="w-2.5 h-2.5 rounded-full bg-stone-400 absolute -left-[22px] top-0.5" />
                <span className="font-bold text-stone-600 block">Pesanan Dibuat & Pembayaran Terverifikasi</span>
                <span className="text-[10px] text-stone-400">{trackingOrder.createdAt}</span>
              </div>
            </div>

            <button
              onClick={() => setTrackingOrder(null)}
              className="w-full py-2 bg-amber-800 text-white rounded-xl font-bold text-xs"
            >
              Tutup Pelacakan
            </button>
          </div>
        </div>
      )}

      {/* 4. RMA Complaint Modal */}
      {isRmaModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-bold text-stone-900 text-sm">Form Pengajuan Retur / Komplain</h3>
                <p className="text-[11px] font-mono text-stone-500">{rmaOrder?.orderNumber}</p>
              </div>
              <button
                onClick={() => setIsRmaModalOpen(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRmaSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Alasan Komplain</label>
                <select className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-xs">
                  <option>Kemasan Rusak saat Pengiriman</option>
                  <option>Kualitas Buah Kurma Tidak Sesuai Standar</option>
                  <option>Jumlah / SKU Tidak Sesuai Faktur</option>
                  <option>Lainnya</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Deskripsi Detail Masalah</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Jelaskan kondisi kemasan, segel, dan batch panen..."
                  value={rmaReason}
                  onChange={(e) => setRmaReason(e.target.value)}
                  className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-xs"
                />
              </div>

              <div className="p-2.5 bg-amber-50 rounded-xl text-[11px] text-amber-900">
                Garansi AllKurma: Penggantian produk baru atau pengembalian dana 100% jika ditemukan cacat kualitas.
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRmaModalOpen(false)}
                  className="flex-1 py-2 border border-stone-200 rounded-xl text-stone-600 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-amber-800 text-white rounded-xl font-bold"
                >
                  Kirim Tiket RMA
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
