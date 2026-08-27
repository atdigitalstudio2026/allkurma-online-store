import React, { useState } from 'react';
import { 
  ArrowLeft, 
  UploadCloud, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  FileSpreadsheet, 
  Trash2, 
  Edit3, 
  ArrowRight, 
  RefreshCw,
  Building2,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface ParsedBulkItem {
  id: string;
  sku: string;
  name: string;
  quantity: number;
  unitPrice: number;
  isValid: boolean;
  errorMessage?: string;
}

export const B2BBulkUploadScreen: React.FC = () => {
  const { setCurrentView, addToCart, products, showToast } = useApp();

  const [currentStep, setCurrentStep] = useState<number>(3); // currently viewing parsed table as in Screenshot 3 screen 8
  const [fileName, setFileName] = useState('harvest_order_2026_q2.csv');
  
  // Sample parsed items matching Screenshot 3 screen 8 & 9
  const [items, setItems] = useState<ParsedBulkItem[]>([
    { id: '1', sku: 'AK-AJW-001', name: 'Kurma Ajwa Madinah Al-Aliya 1kg', quantity: 20, unitPrice: 320000, isValid: true },
    { id: '2', sku: 'AK-SUK-002', name: 'Kurma Sukari Al Qassim Premium 850g', quantity: 15, unitPrice: 85000, isValid: true },
    { id: '3', sku: 'AK-MDJ-003', name: 'Kurma Medjool Jumbo California 1kg', quantity: 10, unitPrice: 240000, isValid: true },
    { id: '4', sku: 'AK-TUN-999', name: 'Kurma Tangkai Tunisia Spesial', quantity: 5, unitPrice: 95000, isValid: false, errorMessage: 'SKU Tidak Terdaftar di Database' },
    { id: '5', sku: 'AK-MADU-005', name: 'Madu Habbatussauda Yaman Royal 500g', quantity: 8, unitPrice: 165000, isValid: true },
  ]);

  const validCount = items.filter(i => i.isValid).length;
  const invalidCount = items.filter(i => !i.isValid).length;
  const totalItemsCount = items.reduce((acc, curr) => acc + curr.quantity, 0);
  const totalAmount = items.filter(i => i.isValid).reduce((acc, curr) => acc + (curr.quantity * curr.unitPrice), 0);

  const handleFixRow = (id: string) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          sku: 'AK-TUN-004',
          name: 'Kurma Tunisia Palm Fruit Tangkai 500g',
          isValid: true,
          errorMessage: undefined
        };
      }
      return item;
    }));
    showToast('Baris berhasil diperbaiki!', 'success');
  };

  const handleDeleteRow = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
    showToast('Baris dihapus dari daftar unggahan');
  };

  const handleDownloadTemplate = () => {
    const csvContent = "data:text/csv;charset=utf-8,SKU,Quantity,Notes\nAK-AJW-001,20,Ajwa Madinah\nAK-SUK-002,15,Sukari Qassim\nAK-MDJ-003,10,Medjool Jumbo\n";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "AllKurma_B2B_Bulk_Template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Template CSV berhasil diunduh!');
  };

  const handleProceed = () => {
    if (invalidCount > 0) {
      showToast('Harap perbaiki atau hapus baris yang error sebelum melanjutkan', 'error');
      return;
    }
    // Add valid products to cart
    items.forEach(item => {
      const prod = products.find(p => p.sku === item.sku) || products[0];
      addToCart(prod, item.quantity);
    });
    showToast(`${validCount} jenis produk (${totalItemsCount} pcs) berhasil dimasukkan ke keranjang grosir!`, 'success');
    setCurrentView('cart');
  };

  return (
    <div className="pb-32 max-w-lg mx-auto bg-stone-50 min-h-screen">
      
      {/* Top Header */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setCurrentView('b2b-portal')}
          className="p-1.5 rounded-lg text-stone-700 hover:bg-stone-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="text-center">
          <h1 className="text-sm font-bold text-stone-900 font-['Playfair_Display',serif]">
            Unggah Pesanan Massal (Bulk Upload)
          </h1>
          <p className="text-[10px] text-stone-500">CSV & Excel Automated Verification</p>
        </div>

        <button
          onClick={handleDownloadTemplate}
          className="text-stone-600 hover:text-stone-900 p-1.5 rounded-lg"
          title="Download Template"
        >
          <Download className="w-4 h-4" />
        </button>
      </div>

      {/* 1. Steps Progress Indicator (Matching Screenshot 3 screen 8) */}
      <div className="p-4 bg-white border-b border-stone-200">
        <div className="flex items-center justify-between text-[11px] font-bold">
          <div className="flex items-center gap-1.5 text-stone-400">
            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px]">✓</span>
            <span>1. Unduh Template</span>
          </div>
          <span className="text-stone-300">→</span>
          <div className="flex items-center gap-1.5 text-stone-400">
            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px]">✓</span>
            <span>2. Isi Data</span>
          </div>
          <span className="text-stone-300">→</span>
          <div className="flex items-center gap-1.5 text-amber-900">
            <span className="w-5 h-5 rounded-full bg-amber-800 text-white flex items-center justify-center text-[10px]">3</span>
            <span>3. Verifikasi</span>
          </div>
        </div>
      </div>

      {/* 2. File Status & Summary Card (Matching Screenshot 3 screen 8) */}
      <div className="p-4 space-y-3">
        <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-xs text-stone-900 font-mono">
                  {fileName}
                </h3>
                <span className="text-[10px] text-stone-500">File siap diverifikasi</span>
              </div>
            </div>

            <button
              onClick={handleDownloadTemplate}
              className="text-[11px] font-semibold text-amber-800 hover:underline flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Template</span>
            </button>
          </div>

          {/* Metric Badges */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-stone-100 text-center">
            <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-200">
              <span className="text-[10px] text-emerald-700 block font-medium">Item Valid</span>
              <span className="text-base font-black text-emerald-800 font-mono">{validCount}</span>
            </div>
            <div className="p-2 bg-stone-50 rounded-xl border border-stone-200">
              <span className="text-[10px] text-stone-500 block font-medium">Total Baris</span>
              <span className="text-base font-black text-stone-800 font-mono">{items.length}</span>
            </div>
            <div className={`p-2 rounded-xl border ${invalidCount > 0 ? 'bg-red-50 border-red-200' : 'bg-stone-50 border-stone-200'}`}>
              <span className={`text-[10px] block font-medium ${invalidCount > 0 ? 'text-red-700' : 'text-stone-500'}`}>
                Error Flag
              </span>
              <span className={`text-base font-black font-mono ${invalidCount > 0 ? 'text-red-800' : 'text-stone-800'}`}>
                {invalidCount}
              </span>
            </div>
          </div>
        </div>

        {/* 3. Table of Parsed Items */}
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
          <div className="p-3 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
            <span className="font-bold text-xs text-stone-900">
              Detail Baris CSV / Excel
            </span>
            <span className="text-[10px] text-stone-500">
              Periksa & selaraskan SKU sebelum checkout
            </span>
          </div>

          <div className="divide-y divide-stone-100 text-xs">
            {items.map((item) => (
              <div key={item.id} className={`p-3 space-y-1.5 transition-colors ${item.isValid ? 'hover:bg-stone-50' : 'bg-red-50/50'}`}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      {item.isValid ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      ) : (
                        <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                      )}
                      <span className="font-mono font-bold text-stone-900">{item.sku}</span>
                      {item.isValid ? (
                        <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-xs">
                          Valid
                        </span>
                      ) : (
                        <span className="text-[9px] font-bold bg-red-100 text-red-800 px-1.5 py-0.2 rounded-xs">
                          {item.errorMessage}
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-stone-600 mt-0.5">{item.name}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    {!item.isValid && (
                      <button
                        onClick={() => handleFixRow(item.id)}
                        className="px-2 py-1 bg-amber-700 text-white rounded text-[10px] font-bold hover:bg-amber-800"
                        title="Auto-Fix SKU"
                      >
                        Auto-Fix
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteRow(item.id)}
                      className="p-1 text-stone-400 hover:text-red-600 rounded"
                      title="Hapus Baris"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1 border-t border-stone-100/50">
                  <span>Jumlah: <strong className="text-stone-800">{item.quantity} pcs</strong></span>
                  <span>Satuan: <strong className="text-stone-800">Rp {item.unitPrice.toLocaleString('id-ID')}</strong></span>
                  <span>Subtotal: <strong className="text-amber-900 font-mono">Rp {(item.quantity * item.unitPrice).toLocaleString('id-ID')}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Drag & Drop Replacement Upload Zone */}
        <div className="border-2 border-dashed border-stone-300 hover:border-amber-500 rounded-2xl p-6 text-center bg-white cursor-pointer transition-colors">
          <UploadCloud className="w-8 h-8 text-stone-400 mx-auto mb-2" />
          <p className="font-bold text-xs text-stone-800">
            Unggah Ulang Berkas CSV / Excel
          </p>
          <p className="text-[10px] text-stone-500 mt-0.5">
            Mendukung format .csv, .xlsx hingga 10MB
          </p>
        </div>

      </div>

      {/* 5. Sticky Bottom Action Bar (Matching Screenshot 3 screen 8) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 p-3 shadow-xl">
        <div className="max-w-lg mx-auto flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-stone-500 block">
              Total Valid ({totalItemsCount} pcs)
            </span>
            <span className="font-black text-amber-950 text-base font-mono">
              Rp {totalAmount.toLocaleString('id-ID')}
            </span>
          </div>

          <button
            onClick={handleProceed}
            disabled={invalidCount > 0}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all ${
              invalidCount > 0
                ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                : 'bg-amber-800 hover:bg-amber-900 active:scale-95 text-white cursor-pointer'
            }`}
          >
            <span>Lanjutkan Pesanan ({validCount} Items)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};
