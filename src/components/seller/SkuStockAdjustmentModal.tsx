import React, { useState } from 'react';
import { 
  X, 
  Layers, 
  ArrowDownLeft, 
  ArrowUpRight, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  UserCheck, 
  Building2 
} from 'lucide-react';
import { Product, ProductVariation } from '../../types';

interface SkuStockAdjustmentModalProps {
  product: Product;
  onClose: () => void;
  onConfirm: (
    productId: string,
    variationId: string | null,
    newStock: number,
    logDetails: {
      type: string;
      qtyChange: number;
      refDoc: string;
      notes: string;
      officer: string;
    }
  ) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const SkuStockAdjustmentModal: React.FC<SkuStockAdjustmentModalProps> = ({
  product,
  onClose,
  onConfirm,
  showToast
}) => {
  const [selectedVarId, setSelectedVarId] = useState<string>(
    product.variations && product.variations.length > 0 ? product.variations[0].id : 'master'
  );

  const selectedVariation: ProductVariation | undefined = product.variations?.find(
    v => v.id === selectedVarId
  );

  const currentStock = selectedVariation ? selectedVariation.stock : product.stock;
  const currentSku = selectedVariation ? selectedVariation.sku : product.sku;
  const currentRack = selectedVariation?.warehouseRack || product.warehouseRack || product.warehouseLocation;

  // Adjustment form states
  const [adjustType, setAdjustType] = useState<'inbound' | 'opname' | 'damage' | 'return'>('inbound');
  const [qtyInput, setQtyInput] = useState<number>(50);
  const [refDoc, setRefDoc] = useState('');
  const [officerName, setOfficerName] = useState('Staff Gudang & QC');
  const [notes, setNotes] = useState('');

  // Calculate resulting stock
  let calculatedNewStock = currentStock;
  let changeDiff = 0;

  if (adjustType === 'inbound' || adjustType === 'return') {
    calculatedNewStock = currentStock + (Number(qtyInput) || 0);
    changeDiff = Number(qtyInput) || 0;
  } else if (adjustType === 'damage') {
    calculatedNewStock = Math.max(0, currentStock - (Number(qtyInput) || 0));
    changeDiff = -(Number(qtyInput) || 0);
  } else if (adjustType === 'opname') {
    calculatedNewStock = Math.max(0, Number(qtyInput) || 0);
    changeDiff = calculatedNewStock - currentStock;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (qtyInput === undefined || isNaN(qtyInput) || qtyInput < 0) {
      showToast('Masukkan kuantitas yang valid!', 'error');
      return;
    }

    const typeLabelMap = {
      inbound: 'Stok Masuk (Inbound Supplier / Kontainer)',
      opname: 'Stock Opname (Hasil Audit Fisik)',
      damage: 'Koreksi Rusak / Expired / Karantina',
      return: 'Retur Pelanggan / Restock'
    };

    onConfirm(
      product.id,
      selectedVarId === 'master' ? null : selectedVarId,
      calculatedNewStock,
      {
        type: typeLabelMap[adjustType],
        qtyChange: changeDiff,
        refDoc: refDoc.trim() || `ADJ-${Date.now().toString().slice(-6)}`,
        notes: notes.trim() || `Penyesuaian stok ${typeLabelMap[adjustType]} untuk SKU ${currentSku}`,
        officer: officerName.trim() || 'Staff Gudang'
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-stone-200 overflow-hidden my-6">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-stone-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-['Plus_Jakarta_Sans',sans-serif]">
                Penyesuaian Stok SKU & Stock Opname
              </h3>
              <p className="text-[11px] text-stone-300">
                Audit fisik, mutasi masuk kontainer, dan koreksi inventori gudang
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          {/* Target Product Summary Banner */}
          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 flex items-center gap-3">
            <img
              src={product.images?.[0] || 'https://images.unsplash.com/photo-1596797882870-8c33deeac224?w=600&auto=format&fit=crop&q=80'}
              alt={product.name}
              className="w-12 h-12 rounded-xl object-cover border border-stone-200 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="font-bold text-stone-900 text-sm truncate">{product.name}</div>
              <div className="text-[11px] text-stone-500 font-mono flex items-center gap-2 mt-0.5">
                <span>SKU: <b>{currentSku}</b></span>
                <span>•</span>
                <span>Rak: <b>{currentRack}</b></span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[10px] text-stone-400 block font-semibold">STOK SAAT INI</span>
              <span className="text-base font-black text-stone-900 font-mono">{currentStock} unit</span>
            </div>
          </div>

          {/* Variant Selection if Multi-Variant */}
          {product.variations && product.variations.length > 0 && (
            <div>
              <label className="block font-bold text-stone-700 mb-1.5">Pilih Varian SKU:</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {product.variations.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelectedVarId(v.id)}
                    className={`p-2 rounded-xl border text-left transition-all ${
                      selectedVarId === v.id
                        ? 'border-amber-600 bg-amber-50 font-bold text-amber-950 ring-1 ring-amber-500/20'
                        : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <div className="text-xs">{v.name}</div>
                    <div className="text-[10px] text-stone-500 font-mono mt-0.5">Stok: {v.stock} unit</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Adjustment Mode Selector */}
          <div>
            <label className="block font-bold text-stone-700 mb-1.5">Tipe Mutasi / Penyesuaian:</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setAdjustType('inbound')}
                className={`p-2.5 rounded-xl border text-center font-bold flex flex-col items-center gap-1 transition-all ${
                  adjustType === 'inbound'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20'
                    : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                }`}
              >
                <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
                <span>Stok Masuk</span>
                <span className="text-[9px] font-normal text-stone-500">Inbound Supplier</span>
              </button>

              <button
                type="button"
                onClick={() => setAdjustType('opname')}
                className={`p-2.5 rounded-xl border text-center font-bold flex flex-col items-center gap-1 transition-all ${
                  adjustType === 'opname'
                    ? 'border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-500/20'
                    : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                }`}
              >
                <RefreshCw className="w-4 h-4 text-blue-600" />
                <span>Stock Opname</span>
                <span className="text-[9px] font-normal text-stone-500">Audit Hitung Fisik</span>
              </button>

              <button
                type="button"
                onClick={() => setAdjustType('damage')}
                className={`p-2.5 rounded-xl border text-center font-bold flex flex-col items-center gap-1 transition-all ${
                  adjustType === 'damage'
                    ? 'border-rose-600 bg-rose-50 text-rose-900 ring-2 ring-rose-500/20'
                    : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                }`}
              >
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Koreksi Rusak</span>
                <span className="text-[9px] font-normal text-stone-500">Expired / Rusak</span>
              </button>

              <button
                type="button"
                onClick={() => setAdjustType('return')}
                className={`p-2.5 rounded-xl border text-center font-bold flex flex-col items-center gap-1 transition-all ${
                  adjustType === 'return'
                    ? 'border-amber-600 bg-amber-50 text-amber-900 ring-2 ring-amber-500/20'
                    : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                }`}
              >
                <ArrowUpRight className="w-4 h-4 text-amber-600" />
                <span>Retur Masuk</span>
                <span className="text-[9px] font-normal text-stone-500">Restock Pelanggan</span>
              </button>
            </div>
          </div>

          {/* Qty and Calculated Calculation Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-stone-50 rounded-2xl border border-stone-200">
            <div>
              <label className="block font-bold text-stone-700 mb-1">
                {adjustType === 'opname' ? 'Kuantitas Hasil Hitung Fisik (Unit)' : 'Jumlah Unit yang Disesuaikan'}
              </label>
              <input
                type="number"
                min={0}
                value={qtyInput}
                onChange={e => setQtyInput(parseInt(e.target.value) || 0)}
                placeholder="0"
                className="w-full text-base font-black px-3.5 py-2 rounded-xl bg-white border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                required
              />
            </div>

            {/* Calculated Stock Outcome Preview */}
            <div className="p-3 bg-white rounded-xl border border-stone-200 flex flex-col justify-center">
              <div className="flex items-center justify-between text-[11px] text-stone-500">
                <span>Stok Sebelum:</span>
                <span className="font-mono font-bold text-stone-700">{currentStock} unit</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-stone-500 mt-0.5">
                <span>Perubahan:</span>
                <span className={`font-mono font-bold ${changeDiff >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {changeDiff >= 0 ? `+${changeDiff}` : changeDiff} unit
                </span>
              </div>
              <div className="flex items-center justify-between text-xs font-black text-stone-900 border-t border-stone-100 pt-1 mt-1">
                <span>Stok Akhir Baru:</span>
                <span className="font-mono text-sm text-amber-700">{calculatedNewStock} unit</span>
              </div>
            </div>
          </div>

          {/* Reference Document & Officer */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-stone-700 mb-1">No. Dokumen Referensi / PO</label>
              <input
                type="text"
                value={refDoc}
                onChange={e => setRefDoc(e.target.value)}
                placeholder="Contoh: PO-IMPORT-2026-08"
                className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Petugas Gudang / Pemeriksa</label>
              <input
                type="text"
                value={officerName}
                onChange={e => setOfficerName(e.target.value)}
                placeholder="Nama Staff QC"
                className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block font-bold text-stone-700 mb-1">Catatan / Alasan Penyesuaian</label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Contoh: Kedatangan kontainer import batch baru via Pelabuhan Tanjung Priok..."
              className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-bold text-stone-600 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Simpan & Update Stok SKU</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
