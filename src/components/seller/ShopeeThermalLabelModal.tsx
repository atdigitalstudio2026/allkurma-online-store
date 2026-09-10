import React from 'react';
import { X, Printer, Download, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Order } from '../../types';
import { useApp } from '../../context/AppContext';

interface ShopeeThermalLabelModalProps {
  order: Order;
  trackingNumber?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ShopeeThermalLabelModal: React.FC<ShopeeThermalLabelModalProps> = ({
  order,
  trackingNumber: propTrackingNumber,
  isOpen,
  onClose
}) => {
  const { sellerStore, showToast } = useApp();

  if (!isOpen) return null;

  const trackingNumber = propTrackingNumber || order.trackingNumber || `SPX-ID-${Date.now().toString().slice(-8)}`;
  const courier = order.courierName || order.courier || 'SPX Express (Standard)';
  const sortingHub = `JKT-${order.shippingAddress.city.slice(0, 3).toUpperCase()}-01`;
  const isCod = order.paymentMethod.toLowerCase().includes('cod');
  const codAmount = isCod ? order.total : 0;
  const totalWeight = order.totalWeightGram || (order.items.reduce((sum, it) => sum + (it.weightGram || 500) * it.quantity, 0));

  const handlePrint = () => {
    window.print();
    showToast('Membuka dialog cetak printer thermal...', 'info');
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-stone-200 animate-in zoom-in-95 my-6 font-['Plus_Jakarta_Sans',sans-serif]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-stone-900 text-sm sm:text-base">
                Label Pengiriman Thermal (100x150 mm)
              </h3>
              <p className="text-[11px] text-stone-500">
                Standar cetak waybill AWB marketplace ekspedisi
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

        {/* Printable Thermal Label Area */}
        <div className="mt-4 flex justify-center">
          <div 
            id="shopee-thermal-waybill"
            className="w-full max-w-[380px] bg-white border-2 border-dashed border-stone-900 p-4 text-stone-900 font-mono text-[10px] space-y-2.5 shadow-sm rounded-lg selection:bg-amber-100"
          >
            {/* Courier Banner */}
            <div className="flex items-center justify-between border-b-2 border-stone-900 pb-2">
              <div>
                <div className="font-black text-base tracking-tighter uppercase">
                  {courier.toUpperCase()}
                </div>
                <div className="text-[9px] font-bold tracking-widest text-stone-700">
                  STANDARD LOGISTICS
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-black px-2 py-0.5 border-2 border-stone-900 bg-stone-100">
                  {sortingHub}
                </div>
              </div>
            </div>

            {/* Barcode AWB Section */}
            <div className="text-center py-1 border-b-2 border-stone-900">
              {/* Simulated High Density Barcode (SVG) */}
              <div className="h-12 w-full flex items-center justify-center gap-0.5 overflow-hidden px-4">
                {[
                  3, 1, 4, 1, 2, 4, 1, 3, 2, 1, 4, 1, 3, 2, 1, 1, 4, 2, 1, 3,
                  1, 4, 2, 1, 3, 1, 2, 4, 1, 3, 2, 1, 4, 1, 3, 2, 1, 1, 4, 2,
                  2, 1, 3, 1, 4, 2, 1, 3, 1, 2, 4, 1, 3, 2, 1, 4, 1, 3, 2, 4
                ].map((w, idx) => (
                  <div 
                    key={idx} 
                    className="bg-black h-full" 
                    style={{ width: `${w}px` }} 
                  />
                ))}
              </div>
              <div className="font-black text-xs tracking-widest mt-1">
                NO. RESI: {trackingNumber}
              </div>
            </div>

            {/* Recipient & Sender 2-Column */}
            <div className="grid grid-cols-2 gap-2 border-b-2 border-stone-900 pb-2">
              <div className="border-r border-stone-400 pr-2">
                <div className="font-bold text-[9px] text-stone-500 uppercase">Penerima (To):</div>
                <div className="font-black text-xs mt-0.5 text-stone-900">
                  {order.customerName}
                </div>
                <div className="font-bold text-[10px] text-stone-800">
                  {order.customerPhone}
                </div>
                <div className="text-[9px] text-stone-700 leading-tight mt-1 line-clamp-3">
                  {order.shippingAddress.fullAddress || order.shippingAddress.streetAddress}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                </div>
              </div>

              <div className="pl-1">
                <div className="font-bold text-[9px] text-stone-500 uppercase">Pengirim (From):</div>
                <div className="font-black text-xs mt-0.5 text-stone-900">
                  {sellerStore.storeName}
                </div>
                <div className="font-bold text-[10px] text-stone-800">
                  {sellerStore.phone}
                </div>
                <div className="text-[9px] text-stone-700 leading-tight mt-1">
                  {sellerStore.city}, Indonesia
                </div>
                <div className="mt-1 text-[8px] bg-stone-100 font-bold px-1 py-0.5 inline-block border border-stone-300">
                  OFFICIAL STORE VERIFIED
                </div>
              </div>
            </div>

            {/* COD vs NON-COD Status Banner */}
            <div className="border-b-2 border-stone-900 pb-2">
              <div className="flex items-center justify-between p-1.5 border border-stone-900 bg-stone-50">
                <span className="font-bold text-[10px]">TIPE PEMBAYARAN:</span>
                {isCod ? (
                  <span className="font-black text-xs bg-black text-white px-2 py-0.5">
                    COD: Rp {codAmount.toLocaleString('id-ID')}
                  </span>
                ) : (
                  <span className="font-black text-xs bg-stone-900 text-white px-2 py-0.5">
                    NON COD - SUDAH LUNAS
                  </span>
                )}
              </div>
              <div className="flex justify-between text-[9px] font-bold text-stone-700 mt-1 px-1">
                <span>Berat Paket: ~{(totalWeight / 1000).toFixed(2)} Kg</span>
                <span>Ongkir: Terbayar Sistem</span>
              </div>
            </div>

            {/* Product Manifest Checklist */}
            <div className="border-b border-stone-400 pb-2">
              <div className="font-bold text-[9px] text-stone-500 uppercase mb-1">
                Daftar Isi Paket ({order.items.length} SKU):
              </div>
              <div className="space-y-1 text-[9px]">
                {order.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between items-start gap-1">
                    <span className="truncate flex-1">
                      [ ] {it.quantity}x {it.productName} ({it.selectedVariation?.name || 'Kemasan Standar'})
                    </span>
                    <span className="font-bold shrink-0">
                      SKU: {it.sku || 'AK-DEFAULT'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer QR & Handover Signature */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                {/* Simulated 2D QR Code SVG */}
                <div className="w-10 h-10 border border-stone-900 p-0.5 flex flex-wrap gap-0.5 bg-white">
                  <div className="w-3 h-3 bg-black" />
                  <div className="w-1.5 h-1.5 bg-black" />
                  <div className="w-3 h-3 bg-black ml-auto" />
                  <div className="w-1.5 h-1.5 bg-black" />
                  <div className="w-2 h-2 bg-black" />
                  <div className="w-3 h-3 bg-black mt-auto" />
                  <div className="w-2 h-2 bg-black ml-auto mt-auto" />
                </div>
                <div className="text-[8px] text-stone-500 leading-tight">
                  SCAN FOR<br/>
                  COURIER APP<br/>
                  HANDOVER
                </div>
              </div>

              <div className="text-right border-l border-stone-400 pl-2">
                <div className="text-[8px] text-stone-400">Tanda Tangan Kurir:</div>
                <div className="w-24 h-6 border-b border-stone-400 mt-1" />
                <div className="text-[8px] text-stone-500 mt-0.5">Waktu Serah Terima</div>
              </div>
            </div>

          </div>
        </div>

        {/* Modal Actions */}
        <div className="mt-4 pt-3.5 border-t border-stone-100 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-stone-600 hover:bg-stone-100 font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            Tutup
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Label Thermal (Direct Print)</span>
          </button>
        </div>

      </div>
    </div>
  );
};
