import React, { useState } from 'react';
import { 
  X, 
  RotateCcw, 
  ShieldCheck, 
  Upload, 
  AlertCircle, 
  CheckCircle2, 
  Camera, 
  Trash2,
  DollarSign,
  Package
} from 'lucide-react';
import { Order, ReturnItem } from '../../types';
import { useApp } from '../../context/AppContext';

interface ReturnRequestModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const SAMPLE_EVIDENCE_PHOTOS = [
  'https://images.unsplash.com/photo-1608755728617-aefab37d2edd?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1596797882870-8c33deeac224?w=400&auto=format&fit=crop&q=80'
];

export const ReturnRequestModal: React.FC<ReturnRequestModalProps> = ({
  order,
  isOpen,
  onClose,
  onSuccess
}) => {
  const { createReturnRequest, updateOrderStatus, showToast, user } = useApp();

  const [selectedProductId, setSelectedProductId] = useState<string>(
    order.items[0]?.productId || ''
  );
  const [returnReason, setReturnReason] = useState<string>('Produk Cacat / Kemasan Rusak');
  const [solutionType, setSolutionType] = useState<'Refund' | 'Replacement'>('Refund');
  const [customerComments, setCustomerComments] = useState<string>('');
  const [evidencePhotos, setEvidencePhotos] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const returnReasons = [
    'Produk Cacat / Kemasan Rusak Saat Pengiriman',
    'Salah Kirim Varian / Produk Tidak Sesuai Pesanan',
    'Kurma Kurang Segar / Tekstur Berbau Apek',
    'Jumlah Produk Tidak Lengkap / Ada yang Kurang',
    'Paket Terbuka / Segel Keamanan Rusak'
  ];

  const selectedItem = order.items.find(i => i.productId === selectedProductId) || order.items[0];

  const handleAddSamplePhoto = (url: string) => {
    if (evidencePhotos.length >= 4) {
      showToast('Maksimal 4 foto bukti kerusakan', 'error');
      return;
    }
    if (!evidencePhotos.includes(url)) {
      setEvidencePhotos([...evidencePhotos, url]);
      showToast('Foto bukti berhasil ditambahkan', 'success');
    }
  };

  const handleRemovePhoto = (index: number) => {
    setEvidencePhotos(evidencePhotos.filter((_, idx) => idx !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerComments.trim()) {
      showToast('Mohon jelaskan kendala atau kerusakan produk', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const returnItems: ReturnItem[] = [
        {
          productId: selectedItem.productId,
          productName: selectedItem.productName,
          sku: selectedItem.sku,
          image: selectedItem.image,
          unitPrice: selectedItem.unitPrice,
          quantityReturned: selectedItem.quantity,
          reason: returnReason,
          conditionNotes: customerComments
        }
      ];

      createReturnRequest({
        orderNumber: order.orderNumber || order.invoiceCode || order.id,
        customerId: user.id || order.customerId,
        customerName: user.name || order.customerName,
        customerEmail: user.email || order.customerEmail,
        items: returnItems,
        reason: returnReason,
        comments: customerComments,
        proofImages: evidencePhotos.length > 0 ? evidencePhotos : [selectedItem.image],
        estimatedCredit: selectedItem.lineTotal,
        resolutionStatus: 'Pending'
      });

      // Update order status to Komplain/Retur
      updateOrderStatus(order.id, 'Komplain/Retur');

      showToast('Pengajuan Garansi & Retur Shopee berhasil dikirim ke Penjual!', 'success');
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      showToast('Gagal mengirimkan pengajuan retur', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-stone-200 animate-in zoom-in-95 my-6 font-['Plus_Jakarta_Sans',sans-serif]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-stone-900 text-sm sm:text-base">
                  Ajukan Pengembalian / Retur
                </h3>
                <span className="bg-amber-500 text-stone-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Garansi 100%
                </span>
              </div>
              <p className="text-[11px] text-stone-500 font-mono mt-0.5">
                Pesanan #{order.orderNumber || order.invoiceCode}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Shopee Guarantee Assurance Banner */}
        <div className="mt-3.5 p-3 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-2.5 text-xs text-amber-950">
          <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Proteksi Garansi AllKurma Terjamin:</span>
            <p className="text-[11px] text-amber-900 leading-relaxed mt-0.5">
              Dana Anda tersimpan aman dan tidak akan diteruskan ke penjual sampai kendala Anda terselesaikan dengan penggantian produk baru atau pengembalian dana penuh.
            </p>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          
          {/* 1. Pilih Produk yang Bermasalah */}
          <div>
            <label className="font-bold text-stone-800 block mb-1.5">
              1. Pilih Produk yang Ingin Diretur:
            </label>
            <div className="space-y-2">
              {order.items.map((item, idx) => {
                const isSelected = item.productId === selectedProductId;
                return (
                  <label
                    key={idx}
                    onClick={() => setSelectedProductId(item.productId)}
                    className={`flex items-center gap-3 p-2.5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-amber-600 bg-amber-50/60 ring-1 ring-amber-500/40'
                        : 'border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="returnProduct"
                      checked={isSelected}
                      onChange={() => setSelectedProductId(item.productId)}
                      className="text-amber-800 focus:ring-amber-500 h-4 w-4"
                    />
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="w-12 h-12 rounded-xl object-cover border border-stone-200 bg-white shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-stone-900 text-xs truncate">
                        {item.productName}
                      </p>
                      <p className="text-[11px] text-stone-500">
                        {item.selectedVariation?.name || 'Kemasan Standar'} • Qty: {item.quantity} pcs
                      </p>
                    </div>
                    <div className="text-right font-black font-mono text-xs text-amber-950 shrink-0">
                      Rp {item.lineTotal.toLocaleString('id-ID')}
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* 2. Alasan Retur */}
          <div>
            <label className="font-bold text-stone-800 block mb-1">
              2. Alasan Pengembalian:
            </label>
            <select
              value={returnReason}
              onChange={(e) => setReturnReason(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-800 font-semibold focus:outline-hidden focus:ring-2 focus:ring-amber-600 bg-white"
            >
              {returnReasons.map((r, i) => (
                <option key={i} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Solusi yang Diharapkan */}
          <div>
            <label className="font-bold text-stone-800 block mb-1">
              3. Solusi yang Anda Inginkan:
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setSolutionType('Refund')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  solutionType === 'Refund'
                    ? 'border-amber-600 bg-amber-50 ring-1 ring-amber-500'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-600'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-black text-stone-900 flex items-center gap-1.5 text-xs">
                    <DollarSign className="w-3.5 h-3.5 text-amber-800" />
                    Pengembalian Dana
                  </span>
                  {solutionType === 'Refund' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                </div>
                <p className="text-[10px] text-stone-500">
                  Uang dikembalikan 100% ke ShopeePay / Rekening Bank.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setSolutionType('Replacement')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  solutionType === 'Replacement'
                    ? 'border-amber-600 bg-amber-50 ring-1 ring-amber-500'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-600'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-black text-stone-900 flex items-center gap-1.5 text-xs">
                    <Package className="w-3.5 h-3.5 text-amber-800" />
                    Kirim Produk Baru
                  </span>
                  {solutionType === 'Replacement' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                </div>
                <p className="text-[10px] text-stone-500">
                  Penjual mengirimkan kurma baru yang segar tanpa biaya tambahan.
                </p>
              </button>
            </div>
          </div>

          {/* 4. Foto Bukti Kerusakan / Unboxing */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-stone-800 flex items-center gap-1">
                <Camera className="w-3.5 h-3.5 text-amber-800" />
                <span>4. Lampirkan Foto Bukti Fisik / Video Unboxing:</span>
              </label>
              <span className="text-[10px] text-stone-400">({evidencePhotos.length}/4 foto)</span>
            </div>

            <div className="flex flex-wrap gap-2 mb-2">
              {evidencePhotos.map((photo, idx) => (
                <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden border border-stone-300 group">
                  <img src={photo} alt={`Bukti ${idx + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(idx)}
                    className="absolute top-1 right-1 p-1 bg-black/70 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}

              {evidencePhotos.length < 4 && (
                <div className="flex items-center gap-1.5">
                  {SAMPLE_EVIDENCE_PHOTOS.map((sampleUrl, sIdx) => (
                    <button
                      key={sIdx}
                      type="button"
                      onClick={() => handleAddSamplePhoto(sampleUrl)}
                      className="px-2.5 py-2 rounded-xl border border-dashed border-stone-300 hover:border-amber-500 hover:bg-amber-50 text-[10px] font-bold text-stone-600 transition-all flex items-center gap-1"
                    >
                      <Upload className="w-3 h-3 text-amber-700" />
                      <span>Gunakan Bukti #{sIdx + 1}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 5. Deskripsi Detail */}
          <div>
            <label className="font-bold text-stone-800 block mb-1">
              5. Jelaskan Kendala Secara Rinci:
            </label>
            <textarea
              rows={3}
              value={customerComments}
              onChange={(e) => setCustomerComments(e.target.value)}
              placeholder="Contoh: Saat paket diterima, kotak luar basah dan segel rusak. Kurma terasa berbau asam..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-amber-600 text-xs"
              required
            />
          </div>

          {/* Submit Actions */}
          <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-stone-600 hover:bg-stone-100 font-bold text-xs transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-extrabold text-xs shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Mengirimkan...' : 'Kirim Pengajuan Retur'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
