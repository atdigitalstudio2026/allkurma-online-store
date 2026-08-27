import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Package, 
  Search, 
  Truck, 
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Order } from '../../types';

export const AdminOrdersScreen: React.FC = () => {
  const { orders, updateOrderStatus, setCurrentView, showToast } = useApp();
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [trackingModalOrder, setTrackingModalOrder] = useState<Order | null>(null);
  const [trackingInput, setTrackingInput] = useState('');

  const filteredOrders = orders.filter(o => {
    if (filter !== 'all' && o.status !== filter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return o.orderNumber.toLowerCase().includes(q);
    }
    return true;
  });

  const handleSaveTracking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingModalOrder || !trackingInput.trim()) return;
    updateOrderStatus(trackingModalOrder.id, 'Dikirim');
    showToast(`Nomor resi ${trackingInput} berhasil dipasang untuk ${trackingModalOrder.orderNumber}!`, 'success');
    setTrackingModalOrder(null);
    setTrackingInput('');
  };

  return (
    <div className="pb-28 max-w-lg mx-auto bg-stone-50 min-h-screen">
      
      {/* Top Header */}
      <div className="sticky top-0 z-30 bg-stone-900 text-white px-4 py-3 flex items-center justify-between border-b border-stone-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentView('admin-dashboard')}
            className="p-1 rounded-lg text-stone-300 hover:text-white hover:bg-stone-800"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-sm font-bold font-['Playfair_Display',serif] text-amber-300">
              Kelola Pesanan Masuk
            </h1>
            <p className="text-[10px] text-stone-400">Fulfillment & Resi Logistik</p>
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="p-4 bg-white border-b border-stone-200 space-y-2">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari Nomor Pesanan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg font-mono"
          />
        </div>

        <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none text-xs">
          {['all', 'Belum Bayar', 'Diproses', 'Dikirim', 'Selesai'].map(st => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap ${
                filter === st ? 'bg-amber-800 text-white font-bold' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {st === 'all' ? 'Semua' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders list */}
      <div className="p-4 space-y-3">
        {filteredOrders.map(ord => (
          <div key={ord.id} className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono font-bold text-xs text-stone-900 block">{ord.orderNumber}</span>
                <span className="text-[10px] text-stone-500">{ord.createdAt} • {ord.courierName}</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
                {ord.status}
              </span>
            </div>

            <div className="space-y-1.5 text-xs border-y border-stone-100 py-2">
              {ord.items.map((it, idx) => (
                <div key={idx} className="flex justify-between text-stone-700">
                  <span>{it.quantity}x {it.productName}</span>
                  <span className="font-mono font-bold">Rp {it.lineTotal.toLocaleString('id-ID')}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <div>
                <span className="text-[10px] text-stone-400 block">Total Pembayaran</span>
                <span className="font-black text-amber-950 font-mono">
                  Rp {ord.total.toLocaleString('id-ID')}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                {ord.status === 'Diproses' && (
                  <button
                    onClick={() => {
                      setTrackingModalOrder(ord);
                      setTrackingInput('JNE-9988' + Math.floor(1000 + Math.random() * 9000));
                    }}
                    className="px-3 py-1.5 bg-amber-800 text-white rounded-xl text-xs font-bold hover:bg-amber-900 flex items-center gap-1"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Kirim Resi</span>
                  </button>
                )}

                {ord.status === 'Dikirim' && (
                  <button
                    onClick={() => {
                      updateOrderStatus(ord.id, 'Selesai');
                      showToast(`Pesanan ${ord.orderNumber} selesai!`, 'success');
                    }}
                    className="px-3 py-1.5 bg-emerald-700 text-white rounded-xl text-xs font-bold hover:bg-emerald-800"
                  >
                    Tandai Diterima
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tracking Input Modal */}
      {trackingModalOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl space-y-3 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <h3 className="font-bold text-stone-900 text-sm">Input Resi Pengiriman Kurir</h3>
              <button onClick={() => setTrackingModalOrder(null)} className="text-stone-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTracking} className="space-y-3 text-xs">
              <p className="text-stone-600">
                Pesanan: <strong>{trackingModalOrder.orderNumber}</strong> ({trackingModalOrder.courierName})
              </p>
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Nomor Resi / AWB</label>
                <input
                  type="text"
                  required
                  value={trackingInput}
                  onChange={(e) => setTrackingInput(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-mono text-xs font-bold"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setTrackingModalOrder(null)}
                  className="flex-1 py-2 border border-stone-200 rounded-xl text-stone-600"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-amber-800 text-white rounded-xl font-bold"
                >
                  Simpan & Update Resi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
