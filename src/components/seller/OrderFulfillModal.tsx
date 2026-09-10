import React, { useState } from 'react';
import { 
  X, 
  Truck, 
  Package, 
  MapPin, 
  Clock, 
  Printer, 
  CheckCircle2, 
  Building2, 
  AlertCircle,
  Barcode
} from 'lucide-react';
import { Order } from '../../types';
import { useApp } from '../../context/AppContext';

interface OrderFulfillModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (trackingNumber: string) => void;
  onPrintLabel?: (order: Order, trackingNumber: string) => void;
}

export const OrderFulfillModal: React.FC<OrderFulfillModalProps> = ({
  order,
  isOpen,
  onClose,
  onSuccess,
  onPrintLabel
}) => {
  const { updateOrderStatus, sellerStore, showToast } = useApp();

  const [fulfillmentMethod, setFulfillmentMethod] = useState<'dropoff' | 'pickup'>('dropoff');
  const [pickupSlot, setPickupSlot] = useState<string>('14:00 - 17:00 WIB (Hari Ini)');
  const [courierNotes, setCourierNotes] = useState<string>('Paket berisi kurma fresh food. Harap jangan dibanting/terkena panas.');
  
  // Suggested auto-generated AWB Resi
  const initialAwb = order.trackingNumber || `SPX-ID-${Date.now().toString().slice(-8)}`;
  const [awbNumber, setAwbNumber] = useState<string>(initialAwb);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  if (!isOpen) return null;

  const courierName = order.courierName || order.courier || 'SPX Express (Standard)';

  const handleConfirmFulfillment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!awbNumber.trim()) {
      showToast('Nomor resi pengiriman tidak boleh kosong', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      updateOrderStatus(order.id, 'Dikirim', { trackingNumber: awbNumber.trim() });
      showToast(`Pesanan #${order.orderNumber} berhasil diatur pengiriman! Resi: ${awbNumber}`, 'success');
      onSuccess(awbNumber.trim());
    } catch (err) {
      console.error(err);
      showToast('Gagal memproses pengiriman', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-stone-200 animate-in zoom-in-95 my-6 font-['Plus_Jakarta_Sans',sans-serif]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-stone-900 text-sm sm:text-base">
                Atur Pengiriman Pesanan
              </h3>
              <p className="text-[11px] text-stone-500 font-mono mt-0.5">
                Pesanan #{order.orderNumber} • {courierName}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleConfirmFulfillment} className="mt-4 space-y-4 text-xs">
          
          {/* Method Selection: Drop Off vs Pick Up */}
          <div>
            <label className="font-bold text-stone-800 block mb-1.5">
              Pilih Metode Penyerahan Paket ke Ekspedisi:
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              
              <button
                type="button"
                onClick={() => setFulfillmentMethod('dropoff')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  fulfillmentMethod === 'dropoff'
                    ? 'border-amber-600 bg-amber-50 ring-1 ring-amber-500'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-600'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-black text-stone-900 flex items-center gap-1.5 text-xs">
                    <Building2 className="w-4 h-4 text-amber-800" />
                    Antar ke Konter
                  </span>
                  {fulfillmentMethod === 'dropoff' && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  )}
                </div>
                <p className="text-[10px] text-stone-500 leading-normal">
                  Drop-off mandiri ke counter {courierName} terdekat sebelum jam 20:00 WIB.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setFulfillmentMethod('pickup')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  fulfillmentMethod === 'pickup'
                    ? 'border-amber-600 bg-amber-50 ring-1 ring-amber-500'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-600'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-black text-stone-900 flex items-center gap-1.5 text-xs">
                    <Truck className="w-4 h-4 text-amber-800" />
                    Kurir Jemput (Pick Up)
                  </span>
                  {fulfillmentMethod === 'pickup' && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  )}
                </div>
                <p className="text-[10px] text-stone-500 leading-normal">
                  Driver kurir datang menjemput ke alamat gudang toko Anda.
                </p>
              </button>

            </div>
          </div>

          {/* Conditional Dropoff vs Pickup Detail */}
          {fulfillmentMethod === 'dropoff' ? (
            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-stone-700 space-y-1.5 text-[11px]">
              <div className="flex items-center gap-1.5 font-bold text-stone-900">
                <Barcode className="w-4 h-4 text-amber-800" />
                <span>Instruksi Drop-Off Outlet:</span>
              </div>
              <p className="text-stone-600 leading-relaxed">
                1. Tempelkan Label Resi Thermal di atas kardus packing.<br/>
                2. Serahkan paket ke petugas outlet ekspedisi tanpa perlu membayar ongkir tunai.<br/>
                3. Mintalah tanda terima / scan barcode drop-off dari petugas.
              </p>
            </div>
          ) : (
            <div className="space-y-3 p-3 bg-stone-50 rounded-2xl border border-stone-200">
              <div>
                <label className="font-bold text-stone-800 block mb-1 text-xs">
                  Pilih Jadwal Penjemputan Driver Kurir:
                </label>
                <select
                  value={pickupSlot}
                  onChange={(e) => setPickupSlot(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-stone-900 font-semibold bg-white text-xs"
                >
                  <option value="11:00 - 14:00 WIB (Hari Ini)">Slot 1: 11:00 - 14:00 WIB (Hari Ini)</option>
                  <option value="14:00 - 17:00 WIB (Hari Ini)">Slot 2: 14:00 - 17:00 WIB (Hari Ini)</option>
                  <option value="17:00 - 20:00 WIB (Hari Ini)">Slot 3: 17:00 - 20:00 WIB (Hari Ini)</option>
                  <option value="09:00 - 12:00 WIB (Besok Pagi)">Slot 4: 09:00 - 12:00 WIB (Besok Pagi)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-stone-800 block mb-1 text-xs">
                  Alamat Gudang Penjemputan:
                </label>
                <div className="text-[11px] text-stone-700 bg-white p-2.5 rounded-xl border border-stone-200">
                  <strong className="font-bold text-stone-900">{sellerStore.storeName}</strong> ({sellerStore.phone})<br/>
                  {sellerStore.fullAddress || 'Gudang Pusat AllKurma'}, {sellerStore.city}
                </div>
              </div>
            </div>
          )}

          {/* Nomor Resi / Booking AWB Code */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-stone-800 text-xs">
                Nomor Resi / Booking Code Ekspedisi:
              </label>
              <span className="text-[10px] text-stone-400">Otomatis / Bisa Manual</span>
            </div>
            <input
              type="text"
              value={awbNumber}
              onChange={(e) => setAwbNumber(e.target.value.toUpperCase())}
              placeholder="Contoh: SPXID02919827"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 font-mono font-black text-sm text-stone-900 tracking-wider focus:outline-hidden focus:ring-2 focus:ring-amber-600 bg-white"
              required
            />
          </div>

          {/* Catatan untuk Kurir */}
          <div>
            <label className="font-bold text-stone-800 block mb-1 text-xs">
              Instruksi Penanganan Khusus Paket:
            </label>
            <input
              type="text"
              value={courierNotes}
              onChange={(e) => setCourierNotes(e.target.value)}
              placeholder="Contoh: Makanan fresh kurma, jangan dibanting..."
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-stone-800 text-xs"
            />
          </div>

          {/* Receiver Info Preview */}
          <div className="p-3 bg-amber-50/70 rounded-2xl border border-amber-200/70 flex items-start gap-2.5 text-[11px]">
            <MapPin className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
            <div className="min-w-0">
              <span className="font-bold text-stone-900">Tujuan Penerima: </span>
              <strong className="text-amber-950">{order.customerName}</strong> ({order.customerPhone})<br />
              <span className="text-stone-600 line-clamp-1">{order.shippingAddress.fullAddress || order.shippingAddress.streetAddress}, {order.shippingAddress.city}</span>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
            {onPrintLabel && (
              <button
                type="button"
                onClick={() => onPrintLabel(order, awbNumber)}
                className="px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-stone-600" />
                <span>Preview Label</span>
              </button>
            )}

            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2.5 rounded-xl text-stone-600 hover:bg-stone-100 font-bold text-xs transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isProcessing}
                className="px-5 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-extrabold text-xs shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isProcessing ? 'Memproses...' : 'Konfirmasi & Kirim Paket'}</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
