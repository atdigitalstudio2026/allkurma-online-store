import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Package, 
  Search, 
  Truck, 
  X,
  CheckCircle2,
  Clock,
  MapPin,
  CreditCard,
  Phone,
  FileText,
  Printer,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  Eye,
  Send,
  FileSpreadsheet
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus } from '../../types';
import { shippingService } from '../../services/shippingService';
import { exportSalesReportToExcel } from '../../utils/exportReport';

export const AdminOrdersScreen: React.FC = () => {
  const { orders, updateOrderStatus, setCurrentView, showToast, user } = useApp();
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  const handleExportExcel = () => {
    try {
      const dataToExport = filteredOrders.length > 0 ? filteredOrders : orders;
      exportSalesReportToExcel(dataToExport, `Laporan_Pesanan_AllKurma_${filter}`);
      showToast(`Berhasil mengekspor ${dataToExport.length} data pesanan ke Excel (.csv)!`, 'success');
    } catch (e: any) {
      showToast(e.message || 'Gagal mengekspor laporan', 'error');
    }
  };
  
  // Tracking / Shipping Modal
  const [trackingModalOrder, setTrackingModalOrder] = useState<Order | null>(null);
  const [trackingInput, setTrackingInput] = useState('');
  const [selectedCourierCode, setSelectedCourierCode] = useState('jne');

  // Order Detail Inspector Modal
  const [inspectedOrder, setInspectedOrder] = useState<Order | null>(null);

  // Status Filter Tabs
  const statusFilters = [
    { id: 'all', label: 'Semua Order' },
    { id: 'Belum Bayar', label: 'Belum Bayar' },
    { id: 'Diproses', label: 'Perlu Diproses' },
    { id: 'Dikemas', label: 'Siap Kirim / Packing' },
    { id: 'Dikirim', label: 'Dalam Pengiriman' },
    { id: 'Selesai', label: 'Selesai' },
    { id: 'Dibatalkan', label: 'Dibatalkan' }
  ];

  const filteredOrders = orders.filter(o => {
    if (filter !== 'all') {
      if (filter === 'Belum Bayar' && !(o.status === 'Belum Bayar' || o.status === 'Belum Dibayar' || o.status === 'PENDING_PAYMENT')) return false;
      if (filter === 'Diproses' && !(o.status === 'Diproses' || o.status === 'PROCESSING' || o.status === 'PAYMENT_CONFIRMED')) return false;
      if (filter === 'Dikemas' && !(o.status === 'Dikemas' || o.status === 'PACKED')) return false;
      if (filter === 'Dikirim' && !(o.status === 'Dikirim' || o.status === 'SHIPPED')) return false;
      if (filter === 'Selesai' && !(o.status === 'Selesai' || o.status === 'COMPLETED')) return false;
      if (filter === 'Dibatalkan' && !(o.status === 'Dibatalkan' || o.status === 'CANCELLED')) return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        (o.trackingNumber && o.trackingNumber.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Admin Workflow Transitions
  const handleVerifyPayment = (orderId: string, orderNumber: string) => {
    updateOrderStatus(orderId, 'Diproses');
    showToast(`Pembayaran #${orderNumber} berhasil diverifikasi! Pesanan masuk antrean packing.`, 'success');
  };

  const handleStartPacking = (orderId: string, orderNumber: string) => {
    updateOrderStatus(orderId, 'Dikemas');
    showToast(`Pesanan #${orderNumber} ditandai Sedang Dikemas (Packing QC).`, 'info');
  };

  const handleOpenShippingModal = (order: Order) => {
    setTrackingModalOrder(order);
    const courier = order.courierCode || 'jne';
    setSelectedCourierCode(courier);
    const prefix = courier.toUpperCase();
    setTrackingInput(`${prefix}-${Math.floor(10000000 + Math.random() * 90000000)}`);
  };

  const handleSaveTracking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingModalOrder || !trackingInput.trim()) return;
    
    updateOrderStatus(trackingModalOrder.id, 'Dikirim');
    showToast(`Nomor resi ${trackingInput} berhasil disimpan. Pesanan ${trackingModalOrder.orderNumber} telah dikirim ke kurir!`, 'success');
    setTrackingModalOrder(null);
    setTrackingInput('');
  };

  const handleCompleteOrder = (orderId: string, orderNumber: string) => {
    updateOrderStatus(orderId, 'Selesai');
    showToast(`Pesanan #${orderNumber} telah diselesaikan.`, 'success');
  };

  return (
    <div className="pb-28 max-w-lg mx-auto bg-stone-50 min-h-screen">
      
      {/* Top Header */}
      <div className="sticky top-0 z-30 bg-stone-900 text-white px-4 py-3 flex items-center justify-between border-b border-stone-800 shadow-md">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentView('admin-dashboard')}
            className="p-1 rounded-lg text-stone-300 hover:text-white hover:bg-stone-800"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-sm font-bold font-['Playfair_Display',serif] text-amber-300">
              Kelola Pesanan Masuk (Fulfillment)
            </h1>
            <p className="text-[10px] text-stone-400">Verifikasi, Packing, Resi Logistik & Tracking</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleExportExcel}
            className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-600 text-white text-[10px] font-bold rounded-lg flex items-center gap-1 shadow-xs"
            title="Download Data Pesanan ke Excel (.csv)"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Tarik Excel</span>
          </button>

          <button
            onClick={() => setCurrentView('admin-settings')}
            className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-amber-300 text-[10px] font-bold rounded-lg"
          >
            Konfigurasi
          </button>
        </div>
      </div>

      {/* Search & Status Filters */}
      <div className="p-4 bg-white border-b border-stone-200 space-y-2 sticky top-12 z-20 shadow-xs">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari Invoice, Nama Customer, No. Resi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-xl font-mono text-stone-800"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          {statusFilters.map(st => (
            <button
              key={st.id}
              onClick={() => setFilter(st.id)}
              className={`px-3 py-1 rounded-full font-bold whitespace-nowrap text-[11px] transition-all ${
                filter === st.id ? 'bg-amber-800 text-white shadow-xs' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="p-4 space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-stone-200 p-6">
            <Package className="w-10 h-10 text-stone-300 mx-auto mb-2" />
            <h3 className="font-bold text-stone-800 text-sm">Tidak Ada Pesanan</h3>
            <p className="text-xs text-stone-500 mt-1">Tidak ada data order sesuai filter pencarian.</p>
          </div>
        ) : (
          filteredOrders.map(ord => {
            const isUnpaid = ord.status === 'Belum Bayar' || ord.status === 'Belum Dibayar' || ord.status === 'PENDING_PAYMENT';
            const isProcessing = ord.status === 'Diproses' || ord.status === 'PROCESSING' || ord.status === 'PAYMENT_CONFIRMED';
            const isPacked = ord.status === 'Dikemas' || ord.status === 'PACKED';
            const isShipped = ord.status === 'Dikirim' || ord.status === 'SHIPPED';
            const isCompleted = ord.status === 'Selesai' || ord.status === 'COMPLETED';

            return (
              <div key={ord.id} className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs space-y-3">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                  <div>
                    <span className="font-mono font-bold text-xs text-stone-900 block">{ord.orderNumber}</span>
                    <span className="text-[10px] text-stone-500">{ord.createdAt} • <strong>{ord.customerName}</strong></span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                    isUnpaid ? 'bg-amber-100 text-amber-900' :
                    isProcessing ? 'bg-blue-100 text-blue-900' :
                    isPacked ? 'bg-indigo-100 text-indigo-900' :
                    isShipped ? 'bg-purple-100 text-purple-900' :
                    isCompleted ? 'bg-emerald-100 text-emerald-900' : 'bg-stone-100 text-stone-800'
                  }`}>
                    {ord.status}
                  </span>
                </div>

                {/* Items Summary */}
                <div className="space-y-1.5 text-xs">
                  {ord.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between text-stone-700">
                      <span className="truncate max-w-[240px]">{it.quantity}x {it.productName}</span>
                      <span className="font-mono font-bold">Rp {it.lineTotal.toLocaleString('id-ID')}</span>
                    </div>
                  ))}
                </div>

                {/* Shipping info */}
                <div className="p-2 bg-stone-50 rounded-xl text-[11px] text-stone-600 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 truncate">
                    <Truck className="w-3.5 h-3.5 text-amber-800 shrink-0" />
                    <span className="truncate">{ord.courierName || ord.courier} ({ord.shippingService})</span>
                  </div>
                  {ord.trackingNumber ? (
                    <span className="font-mono font-bold text-stone-900 shrink-0 bg-white px-1.5 py-0.5 rounded border border-stone-200">
                      {ord.trackingNumber}
                    </span>
                  ) : (
                    <span className="text-amber-800 font-semibold shrink-0">Belum ada resi</span>
                  )}
                </div>

                {/* Footer Total & Admin Actions */}
                <div className="flex items-center justify-between text-xs pt-1 border-t border-stone-100">
                  <div>
                    <span className="text-[10px] text-stone-400 block">Total Tagihan</span>
                    <span className="font-black text-amber-950 font-mono text-sm">
                      Rp {ord.total.toLocaleString('id-ID')}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap justify-end">
                    {/* View Details */}
                    <button
                      onClick={() => setInspectedOrder(ord)}
                      className="p-1.5 border border-stone-200 hover:bg-stone-100 text-stone-700 rounded-xl text-xs font-semibold"
                      title="Lihat Rincian Lengkap"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {/* Action 1: Verify Payment */}
                    {isUnpaid && (
                      <button
                        onClick={() => handleVerifyPayment(ord.id, ord.orderNumber)}
                        className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Verifikasi Bayar</span>
                      </button>
                    )}

                    {/* Action 2: Start Packing */}
                    {isProcessing && (
                      <button
                        onClick={() => handleStartPacking(ord.id, ord.orderNumber)}
                        className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs"
                      >
                        <Package className="w-3.5 h-3.5" />
                        <span>Proses Packing</span>
                      </button>
                    )}

                    {/* Action 3: Input Resi / Kirim */}
                    {isPacked && (
                      <button
                        onClick={() => handleOpenShippingModal(ord)}
                        className="px-3 py-1.5 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Input Resi & Kirim</span>
                      </button>
                    )}

                    {/* Action 4: Mark Completed */}
                    {isShipped && (
                      <button
                        onClick={() => handleCompleteOrder(ord.id, ord.orderNumber)}
                        className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Tandai Selesai</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* MODAL: INPUT RESI PENGIRIMAN */}
      {trackingModalOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl space-y-3 animate-in zoom-in-95 text-xs">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <h3 className="font-bold text-stone-900 text-sm font-['Playfair_Display',serif]">
                Input Resi & Serah Terima Kurir
              </h3>
              <button onClick={() => setTrackingModalOrder(null)} className="text-stone-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTracking} className="space-y-3">
              <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                <p className="text-stone-700">
                  Invoice: <strong className="font-mono">{trackingModalOrder.orderNumber}</strong>
                </p>
                <p className="text-stone-600">
                  Penerima: <strong>{trackingModalOrder.customerName}</strong> ({trackingModalOrder.shippingAddress?.city || 'Tujuan'})
                </p>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Pilihan Ekspedisi Kurir:</label>
                <select
                  value={selectedCourierCode}
                  onChange={(e) => {
                    setSelectedCourierCode(e.target.value);
                    const prefix = e.target.value.toUpperCase();
                    setTrackingInput(`${prefix}-${Math.floor(10000000 + Math.random() * 90000000)}`);
                  }}
                  className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold"
                >
                  <option value="jne">JNE Express (Reguler / YES / OKE)</option>
                  <option value="jnt">J&T Express (EZ / Super)</option>
                  <option value="sicepat">SiCepat Ekspres (GOKIL / BEST)</option>
                  <option value="anteraja">AnterAja Express</option>
                  <option value="ninja">Ninja Xpress</option>
                  <option value="pos">Pos Indonesia (Pos Reguler / Kilat)</option>
                  <option value="gosend">GoSend Instant Courier</option>
                  <option value="grab">GrabExpress Instant</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Nomor Resi / AWB / No. Waybill *</label>
                <input
                  type="text"
                  required
                  value={trackingInput}
                  onChange={(e) => setTrackingInput(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-mono text-xs font-bold text-stone-900"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setTrackingModalOrder(null)}
                  className="flex-1 py-2.5 border border-stone-200 rounded-xl text-stone-600 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-amber-800 hover:bg-amber-900 text-white font-bold rounded-xl shadow-xs"
                >
                  Simpan & Kirim Resi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ORDER INSPECTOR */}
      {inspectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full max-h-[92vh] overflow-y-auto p-5 shadow-2xl space-y-4 animate-in zoom-in-95 text-xs">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-bold text-stone-900 text-sm font-['Playfair_Display',serif]">
                  Rincian Pesanan #{inspectedOrder.orderNumber}
                </h3>
                <span className="text-[10px] text-stone-400">{inspectedOrder.createdAt}</span>
              </div>
              <button onClick={() => setInspectedOrder(null)} className="text-stone-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer Info */}
            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-900 text-xs">{inspectedOrder.customerName}</span>
                <span className="px-2 py-0.5 bg-amber-100 text-amber-900 font-bold text-[10px] rounded">
                  {inspectedOrder.customerType || 'Customer'}
                </span>
              </div>
              <p className="text-stone-600">No. HP: <strong className="font-mono">{inspectedOrder.customerPhone || '-'}</strong></p>
              <p className="text-stone-600">Alamat Kirim: {inspectedOrder.shippingAddress?.fullAddress || inspectedOrder.shippingAddress?.streetAddress}</p>
              {inspectedOrder.notes && (
                <p className="text-amber-900 bg-amber-50 p-2 rounded-lg border border-amber-200 mt-1">
                  Catatan Pembeli: <em>"{inspectedOrder.notes}"</em>
                </p>
              )}
            </div>

            {/* Products List */}
            <div className="space-y-2">
              <h4 className="font-bold text-stone-900">Daftar Barang ({inspectedOrder.items.length} Item):</h4>
              {inspectedOrder.items.map((it, idx) => (
                <div key={idx} className="flex items-center gap-3 p-2 bg-stone-50 rounded-xl border border-stone-200">
                  <img src={it.image} alt={it.productName} className="w-10 h-10 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <h5 className="font-bold text-stone-900 truncate">{it.productName}</h5>
                    <p className="text-[10px] text-stone-500">
                      {it.quantity} x Rp {it.unitPrice.toLocaleString('id-ID')}
                    </p>
                  </div>
                  <span className="font-mono font-bold text-amber-950">
                    Rp {it.lineTotal.toLocaleString('id-ID')}
                  </span>
                </div>
              ))}
            </div>

            {/* Payment & Shipping Summary */}
            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-1.5">
              <div className="flex justify-between">
                <span>Metode Pembayaran:</span>
                <strong className="text-stone-900">{inspectedOrder.paymentMethod}</strong>
              </div>
              <div className="flex justify-between">
                <span>Kurir:</span>
                <strong className="text-stone-900">{inspectedOrder.courierName} ({inspectedOrder.shippingService})</strong>
              </div>
              {inspectedOrder.trackingNumber && (
                <div className="flex justify-between">
                  <span>Nomor Resi:</span>
                  <strong className="font-mono text-amber-900">{inspectedOrder.trackingNumber}</strong>
                </div>
              )}
              <div className="flex justify-between pt-1 border-t border-stone-200 font-bold text-stone-900">
                <span>Total Keseluruhan:</span>
                <span className="font-mono text-amber-950 text-sm">Rp {inspectedOrder.total.toLocaleString('id-ID')}</span>
              </div>
            </div>

            <button
              onClick={() => {
                showToast('Label Pengiriman & Faktur PDF siap dicetak!', 'info');
              }}
              className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl flex items-center justify-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Shipping Label & Invoice</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
