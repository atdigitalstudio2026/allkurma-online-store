import React, { useState } from 'react';
import { 
  X, 
  RotateCcw, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  MessageSquare, 
  AlertCircle,
  Eye,
  Camera,
  DollarSign
} from 'lucide-react';
import { ReturnRequest } from '../../types';
import { useApp } from '../../context/AppContext';

interface SellerReturnManagementModalProps {
  returnRequest: ReturnRequest;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onOpenChatWithCustomer?: (customerName: string) => void;
}

export const SellerReturnManagementModal: React.FC<SellerReturnManagementModalProps> = ({
  returnRequest,
  isOpen,
  onClose,
  onSuccess,
  onOpenChatWithCustomer
}) => {
  const { updateReturnStatus, showToast } = useApp();

  const [inspectionNotes, setInspectionNotes] = useState<string>('');
  const [rejectReason, setRejectReason] = useState<string>('');
  const [activePhoto, setActivePhoto] = useState<string>(returnRequest.proofImages[0] || '');
  const [actionStep, setActionStep] = useState<'view' | 'reject'>('view');

  if (!isOpen) return null;

  const handleApproveRefund = () => {
    updateReturnStatus(
      returnRequest.id,
      'Completed',
      inspectionNotes || 'Pengajuan pengembalian disetujui penjual. Dana diteruskan kembali ke pembeli.',
      returnRequest.estimatedCredit,
      'Approved Full'
    );
    showToast(`Pengajuan retur #${returnRequest.returnCode} berhasil disetujui! Dana dikembalikan ke pembeli.`, 'success');
    onClose();
  };

  const handleApproveReplacement = () => {
    updateReturnStatus(
      returnRequest.id,
      'Completed',
      inspectionNotes || 'Penggantian produk kurma baru telah disetujui dan dijadwalkan untuk dikirim.',
      0,
      'Approved Full'
    );
    showToast(`Pengajuan retur #${returnRequest.returnCode} disetujui untuk penggantian produk baru!`, 'success');
    onClose();
  };

  const handleReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectReason.trim()) {
      showToast('Mohon masukkan alasan penolakan retur', 'error');
      return;
    }

    updateReturnStatus(
      returnRequest.id,
      'Rejected',
      rejectReason,
      0,
      'Rejected'
    );
    showToast(`Pengajuan retur #${returnRequest.returnCode} telah ditolak`, 'info');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-5 sm:p-6 shadow-2xl border border-stone-200 animate-in zoom-in-95 my-6 font-['Plus_Jakarta_Sans',sans-serif]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-stone-900 text-sm sm:text-base">
                  Inspeksi Pengajuan Retur Pembeli
                </h3>
                <span className="bg-amber-100 text-amber-900 font-mono text-[10px] font-black px-2 py-0.5 rounded">
                  #{returnRequest.returnCode}
                </span>
              </div>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Pesanan #{returnRequest.orderNumber} • Pembeli: <strong>{returnRequest.customerName}</strong>
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

        {/* Status Alert */}
        <div className="mt-4 p-3 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-xs">
          <ShieldCheck className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold text-amber-950">Alasan Pengajuan oleh Pembeli:</span>
            <p className="text-stone-800 font-semibold mt-0.5">
              "{returnRequest.reason}"
            </p>
            {returnRequest.comments && (
              <p className="text-[11px] text-stone-600 mt-1 italic bg-white/70 p-2 rounded-xl border border-amber-100">
                "{returnRequest.comments}"
              </p>
            )}
          </div>
        </div>

        {/* Product Items to Return */}
        <div className="mt-3.5 space-y-2">
          <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
            Daftar Produk yang Dikomplain:
          </label>
          {returnRequest.items.map((it, idx) => (
            <div key={idx} className="flex items-center gap-3 p-2.5 rounded-2xl bg-stone-50 border border-stone-200">
              <img src={it.image} alt={it.productName} className="w-12 h-12 rounded-xl object-cover border border-stone-200 bg-white" />
              <div className="flex-1 min-w-0 text-xs">
                <div className="font-bold text-stone-900 truncate">{it.productName}</div>
                <div className="text-[11px] text-stone-500 font-mono">SKU: {it.sku} • Qty: {it.quantityReturned} pcs</div>
              </div>
              <div className="text-right font-black font-mono text-xs text-amber-950">
                Rp {(it.unitPrice * it.quantityReturned).toLocaleString('id-ID')}
              </div>
            </div>
          ))}
        </div>

        {/* Photo Evidence Gallery */}
        {returnRequest.proofImages && returnRequest.proofImages.length > 0 && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1">
                <Camera className="w-3.5 h-3.5 text-amber-800" />
                <span>Foto Bukti Fisik / Kerusakan:</span>
              </label>
              <span className="text-[10px] text-stone-400">({returnRequest.proofImages.length} Foto)</span>
            </div>

            <div className="flex items-center gap-2">
              {returnRequest.proofImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActivePhoto(img)}
                  className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    activePhoto === img ? 'border-amber-600 ring-2 ring-amber-300' : 'border-stone-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Bukti" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {activePhoto && (
              <div className="relative rounded-2xl overflow-hidden border border-stone-200 h-44 bg-stone-900 flex items-center justify-center">
                <img src={activePhoto} alt="Bukti Terpilih" className="max-h-full max-w-full object-contain" />
              </div>
            )}
          </div>
        )}

        {/* Action Panel */}
        {actionStep === 'view' ? (
          <div className="mt-4 space-y-3 pt-3 border-t border-stone-100 text-xs">
            <div>
              <label className="font-bold text-stone-700 block mb-1">
                Catatan Persetujuan / Tindak Lanjut Toko (Opsional):
              </label>
              <input
                type="text"
                value={inspectionNotes}
                onChange={(e) => setInspectionNotes(e.target.value)}
                placeholder="Contoh: Paket pengganti dikirim hari ini nomor resi SPX..."
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-stone-900"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <button
                type="button"
                onClick={() => setActionStep('reject')}
                className="px-3.5 py-2 rounded-xl text-red-700 hover:bg-red-50 font-bold border border-red-200 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <XCircle className="w-4 h-4" />
                <span>Tolak Retur</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleApproveReplacement}
                  className="px-3.5 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold border border-amber-300 transition-colors cursor-pointer"
                >
                  Setujui Ganti Barang
                </button>

                <button
                  type="button"
                  onClick={handleApproveRefund}
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Setujui Refund (Rp {returnRequest.estimatedCredit.toLocaleString('id-ID')})</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleReject} className="mt-4 space-y-3 pt-3 border-t border-stone-100 text-xs">
            <div>
              <label className="font-bold text-red-800 block mb-1">
                Alasan Penolakan Retur ke Pembeli:
              </label>
              <textarea
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Jelaskan alasan penolakan secara jelas dan sopan (misal: Kerusakan terjadi karena kurir pengiriman pihak ketiga atau segel telah terbuka melebihi batas waktu komplain)..."
                className="w-full px-3 py-2 rounded-xl border border-red-300 text-stone-900 focus:ring-2 focus:ring-red-500"
                required
              />
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setActionStep('view')}
                className="px-3.5 py-2 rounded-xl text-stone-600 hover:bg-stone-100 font-bold transition-colors cursor-pointer"
              >
                Kembali
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold transition-colors cursor-pointer"
              >
                Konfirmasi Tolak Pengajuan
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
