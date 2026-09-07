import React, { useState } from 'react';
import { X, Printer, Barcode, Tag, Check, Copy, Package } from 'lucide-react';
import { Product, ProductVariation } from '../../types';

interface SkuBarcodePrintModalProps {
  product: Product;
  onClose: () => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const SkuBarcodePrintModal: React.FC<SkuBarcodePrintModalProps> = ({
  product,
  onClose,
  showToast
}) => {
  const [selectedVarId, setSelectedVarId] = useState<string>(
    product.variations && product.variations.length > 0 ? product.variations[0].id : 'master'
  );
  const [labelQty, setLabelQty] = useState<number>(12);
  const [labelSize, setLabelSize] = useState<'standard' | 'compact'>('standard');

  const selectedVariation: ProductVariation | undefined = product.variations?.find(
    v => v.id === selectedVarId
  );

  const activeSku = selectedVariation ? selectedVariation.sku : product.sku;
  const activeBarcode = selectedVariation?.barcode || product.barcode || `8997234560${product.id.replace(/\D/g, '').padEnd(3, '0')}`;
  const activePrice = selectedVariation ? (selectedVariation.discountPrice || selectedVariation.regularPrice) : (product.discountPrice || product.regularPrice);
  const activeWeight = selectedVariation ? selectedVariation.weightGram : product.weightGram;
  const activeName = selectedVariation ? `${product.name} (${selectedVariation.name})` : product.name;
  const activeRack = selectedVariation?.warehouseRack || product.warehouseRack || product.warehouseLocation;

  const handlePrint = () => {
    window.print();
    showToast(`Mencetak ${labelQty} lembar label barcode SKU ${activeSku}`, 'success');
  };

  const handleCopyBarcode = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(activeBarcode);
      showToast(`Nomor Barcode ${activeBarcode} berhasil disalin!`);
    }
  };

  return (
    <div className="fixed inset-0 bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-stone-200 overflow-hidden my-6">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-stone-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Barcode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-['Plus_Jakarta_Sans',sans-serif]">
                Cetak Label Barcode & Price Tag SKU
              </h3>
              <p className="text-[11px] text-stone-300">
                Standar label fisik kemasan produk untuk rak gudang & kasir POS
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

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          
          {/* Variant Selector */}
          {product.variations && product.variations.length > 0 && (
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-2 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-amber-600" />
                <span>Pilih Varian SKU yang Akan Dicetak:</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {product.variations.map((v) => {
                  const isSelected = selectedVarId === v.id;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedVarId(v.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-amber-600 bg-amber-50 text-amber-950 font-bold ring-2 ring-amber-500/20'
                          : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                      }`}
                    >
                      <div className="text-xs">{v.name}</div>
                      <div className="text-[10px] text-stone-500 font-mono mt-0.5">{v.sku}</div>
                      <div className="text-[11px] font-bold text-amber-700 mt-1 font-mono">
                        Rp {(v.discountPrice || v.regularPrice).toLocaleString('id-ID')}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Print Options */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 bg-stone-50 rounded-2xl border border-stone-200/80 text-xs">
            <div>
              <label className="block font-bold text-stone-600 mb-1">Jumlah Lembar Cetak</label>
              <input
                type="number"
                min={1}
                max={100}
                value={labelQty}
                onChange={(e) => setLabelQty(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full bg-white px-3 py-1.5 rounded-lg border border-stone-300 font-bold text-stone-900 text-xs focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-600 mb-1">Ukuran Kertas Thermal</label>
              <select
                value={labelSize}
                onChange={(e: any) => setLabelSize(e.target.value)}
                className="w-full bg-white px-3 py-1.5 rounded-lg border border-stone-300 font-semibold text-stone-900 text-xs focus:ring-2 focus:ring-amber-500"
              >
                <option value="standard">Standar (50 x 30 mm)</option>
                <option value="compact">Kompak (40 x 25 mm)</option>
              </select>
            </div>

            <div className="col-span-2 sm:col-span-1 flex flex-col justify-end">
              <button
                type="button"
                onClick={handleCopyBarcode}
                className="w-full py-1.5 px-3 bg-white hover:bg-stone-100 text-stone-700 font-semibold rounded-lg border border-stone-300 flex items-center justify-center gap-1.5 transition-colors"
                title="Salin Barcode EAN-13"
              >
                <Copy className="w-3.5 h-3.5 text-stone-500" />
                <span>Salin EAN-13</span>
              </button>
            </div>
          </div>

          {/* Preview Box */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-stone-700">Preview Label Thermal (1:1 Skala Cetak):</span>
              <span className="text-[11px] font-mono text-stone-500">Rak: {activeRack}</span>
            </div>

            <div className="p-4 bg-stone-200/60 rounded-2xl flex items-center justify-center">
              {/* Simulated Thermal Label */}
              <div
                className={`bg-white border-2 border-stone-800 rounded-lg p-3 text-black font-sans shadow-md ${
                  labelSize === 'standard' ? 'w-[280px]' : 'w-[230px]'
                }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-stone-800 pb-1 mb-1.5">
                  <span className="text-[9px] font-black tracking-wider uppercase">ALLKURMA OFFICIAL</span>
                  <span className="text-[8px] font-bold bg-black text-white px-1 py-0.2 rounded-xs">HALAL</span>
                </div>

                {/* Product Name */}
                <div className="font-extrabold text-[11px] leading-tight line-clamp-2 text-stone-950 mb-1">
                  {activeName}
                </div>

                <div className="flex items-center justify-between text-[8px] text-stone-700 font-semibold mb-1">
                  <span>Asal: {product.origin}</span>
                  <span>Netto: {activeWeight}g</span>
                </div>

                {/* Barcode Graphic Simulation */}
                <div className="my-1.5 py-1 px-1 bg-white border border-stone-300 rounded flex flex-col items-center">
                  <div className="flex items-center justify-center gap-[2px] h-8 w-full">
                    {/* Stylized realistic barcode bars */}
                    {[2,1,3,1,2,1,1,3,2,1,2,3,1,2,1,1,3,1,2,1,3,2,1,2,1,3,1,1,2,3,1,2,1,2,3,1,2].map((width, idx) => (
                      <div
                        key={idx}
                        className={`bg-black h-full ${idx % 2 === 0 ? 'bg-black' : 'bg-transparent'}`}
                        style={{ width: `${width}px` }}
                      />
                    ))}
                  </div>
                  <div className="text-[9px] font-mono font-black tracking-widest mt-0.5 text-stone-900">
                    {activeBarcode}
                  </div>
                </div>

                {/* SKU Code & Price */}
                <div className="flex items-center justify-between border-t border-stone-800 pt-1 mt-1">
                  <div>
                    <div className="text-[7px] text-stone-500 font-bold uppercase">KODE SKU:</div>
                    <div className="text-[9px] font-mono font-bold text-stone-900">{activeSku}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[7px] text-stone-500 font-bold uppercase">HARGA ECERAN:</div>
                    <div className="text-[12px] font-black font-mono text-stone-950">
                      Rp {activePrice.toLocaleString('id-ID')}
                    </div>
                  </div>
                </div>

                <div className="text-[7px] text-stone-400 text-center mt-1 pt-0.5 border-t border-stone-200">
                  {product.storageCondition || 'Simpan Suhu Sejuk'} • Exp: {product.expiryDate || '2027'}
                </div>
              </div>
            </div>
          </div>

          {/* Quick SKU Specs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-stone-600 bg-stone-50 p-3 rounded-xl border border-stone-200">
            <div>
              <span className="text-stone-400 block text-[9px]">SKU MASTER</span>
              <span className="font-mono font-bold text-stone-800">{activeSku}</span>
            </div>
            <div>
              <span className="text-stone-400 block text-[9px]">BARCODE EAN-13</span>
              <span className="font-mono font-bold text-stone-800">{activeBarcode}</span>
            </div>
            <div>
              <span className="text-stone-400 block text-[9px]">LOKASI RAK</span>
              <span className="font-bold text-stone-800">{activeRack}</span>
            </div>
            <div>
              <span className="text-stone-400 block text-[9px]">STANDAR MUTU</span>
              <span className="font-bold text-stone-800">Grade A Ekspor</span>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-stone-50 border-t border-stone-200 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-stone-600 hover:bg-stone-200 rounded-xl transition-colors cursor-pointer"
          >
            Tutup
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="px-5 py-2 text-xs font-bold bg-stone-900 hover:bg-stone-800 text-white rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-amber-400" />
            <span>Cetak {labelQty} Label Thermal</span>
          </button>
        </div>

      </div>
    </div>
  );
};
