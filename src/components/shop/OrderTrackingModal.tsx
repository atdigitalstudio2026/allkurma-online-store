import React, { useState } from 'react';
import { 
  X, 
  Truck, 
  Package, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Copy, 
  ExternalLink,
  Phone,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { Order } from '../../types';
import { useApp } from '../../context/AppContext';

interface OrderTrackingModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  order,
  isOpen,
  onClose
}) => {
  const { showToast, sellerStore } = useApp();
  const [copiedResi, setCopiedResi] = useState(false);

  if (!isOpen) return null;

  const trackingNumber = order.trackingNumber || `SPX-ID-${order.orderNumber.replace(/[^0-9]/g, '').slice(-8) || '20268819'}`;
  const courierName = order.courierName || order.courier || 'SPX Express Standard';

  const handleCopyResi = () => {
    navigator.clipboard.writeText(trackingNumber);
    setCopiedResi(true);
    showToast(`No. Resi ${trackingNumber} berhasil disalin!`, 'success');
    setTimeout(() => setCopiedResi(false), 2500);
  };

  const isCompleted = order.status === 'Selesai';
  const isShipped = order.status === 'Dikirim' || isCompleted;

  const milestones = [
    {
      title: 'Pesanan Diterima oleh Penjual',
      desc: 'Pesanan telah berhasil diverifikasi dan masuk antrean packing gudang.',
      time: order.createdAt || '2026-03-01 09:30 WIB',
      isDone: true,
      icon: Package
    },
    {
      title: 'Pesanan Telah Dikemas & Resi Dicetak',
      desc: `Gudang ${sellerStore.storeName} (${sellerStore.city}) telah selesai memverifikasi QC kurma dan menempelkan label pengiriman.`,
      time: order.shippedAt || '2026-03-01 13:45 WIB',
      isDone: true,
      icon: CheckCircle2
    },
    {
      title: 'Diserahkan ke Kurir & Tiba di DC Utama',
      desc: `Paket telah diterima di Hub Sortir Ekspedisi ${courierName} Jakarta Pusat.`,
      time: '2026-03-01 17:20 WIB',
      isDone: isShipped,
      icon: Truck
    },
    {
      title: 'Paket Dalam Perjalanan ke Kota Tujuan',
      desc: `Paket diberangkatkan menuju Hub Drop Point ${order.shippingAddress.city}.`,
      time: '2026-03-02 04:10 WIB',
      isDone: isShipped,
      icon: MapPin
    },
    {
      title: 'Kurir Mengantarkan Paket ke Alamat Anda',
      desc: `Kurir Mitra Ekspedisi sedang menuju alamat penerima (${order.customerName}).`,
      time: isCompleted ? '2026-03-02 11:15 WIB' : (isShipped ? 'Estimasi Hari Ini 10:00 - 14:00 WIB' : '-'),
      isDone: isShipped,
      isActive: isShipped && !isCompleted,
      icon: Clock
    },
    {
      title: 'Pesanan Berhasil Diterima',
      desc: isCompleted
        ? `Paket diterima langsung oleh ${order.customerName} (Keluarga / Penerima).`
        : 'Menunggu konfirmasi penerimaan paket oleh pembeli.',
      time: isCompleted ? (order.completedAt || '2026-03-02 12:40 WIB') : 'Estimasi Besok',
      isDone: isCompleted,
      isActive: isCompleted,
      icon: CheckCircle2
    }
  ];

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
                Lacak Pengiriman Paket
              </h3>
              <p className="text-[11px] text-stone-500 font-mono mt-0.5">
                Pesanan #{order.orderNumber || order.invoiceCode}
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

        {/* Courier Summary Card */}
        <div className="mt-4 p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                Jasa Ekspedisi
              </span>
              <span className="font-extrabold text-xs sm:text-sm text-stone-900 flex items-center gap-1.5">
                {courierName}
                <span className="bg-amber-100 text-amber-900 text-[9px] font-black px-1.5 py-0.5 rounded">
                  REGULER
                </span>
              </span>
            </div>

            <button
              type="button"
              onClick={handleCopyResi}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white hover:bg-stone-100 border border-stone-300 text-stone-700 text-xs font-bold transition-all shadow-2xs active:scale-95 cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5 text-amber-800" />
              <span>{copiedResi ? 'Disalin!' : 'Salin Resi'}</span>
            </button>
          </div>

          <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-xs font-mono">
            <span className="text-stone-500">Nomor Resi AWB:</span>
            <span className="font-black text-amber-950 text-sm tracking-wider">
              {trackingNumber}
            </span>
          </div>
        </div>

        {/* Destination Info */}
        <div className="mt-3 p-3 rounded-2xl bg-amber-50/60 border border-amber-200/60 flex items-start gap-2.5 text-xs text-stone-800">
          <MapPin className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <strong className="font-bold text-stone-900">{order.customerName}</strong>
              <span className="text-stone-500 font-mono">({order.customerPhone})</span>
            </div>
            <p className="text-[11px] text-stone-600 line-clamp-2 mt-0.5">
              {order.shippingAddress.fullAddress || order.shippingAddress.streetAddress}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}
            </p>
          </div>
        </div>

        {/* Milestones Live Tracking */}
        <div className="mt-5 space-y-4 max-h-64 overflow-y-auto pr-1">
          {milestones.map((m, idx) => {
            const Icon = m.icon;
            const isLast = idx === milestones.length - 1;

            return (
              <div key={idx} className="relative flex items-start gap-3.5">
                {/* Vertical Line Connector */}
                {!isLast && (
                  <div 
                    className={`absolute left-4 top-7 bottom-0 w-0.5 -ml-px ${
                      m.isDone ? 'bg-amber-600' : 'bg-stone-200'
                    }`}
                  />
                )}

                {/* Node Icon */}
                <div 
                  className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${
                    m.isActive
                      ? 'bg-amber-600 text-white border-amber-300 ring-4 ring-amber-100 shadow-sm'
                      : m.isDone
                      ? 'bg-emerald-600 text-white border-white shadow-2xs'
                      : 'bg-stone-100 text-stone-400 border-stone-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                {/* Text Description */}
                <div className="flex-1 pb-4 min-w-0">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <h4 className={`text-xs font-bold ${m.isActive ? 'text-amber-950 font-black' : m.isDone ? 'text-stone-900' : 'text-stone-400'}`}>
                      {m.title}
                    </h4>
                    <span className="text-[10px] font-mono text-stone-400">
                      {m.time}
                    </span>
                  </div>
                  <p className={`text-[11px] mt-0.5 leading-relaxed ${m.isActive ? 'text-stone-800' : 'text-stone-500'}`}>
                    {m.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="mt-4 pt-3.5 border-t border-stone-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-stone-500 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Resi resmi tersinkronisasi live</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
