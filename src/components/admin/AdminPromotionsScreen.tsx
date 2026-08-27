import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Tag, 
  Plus, 
  Trash2, 
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PromotionVoucher } from '../../types';

export const AdminPromotionsScreen: React.FC = () => {
  const { setCurrentView, showToast, promotions, createPromotion, togglePromotionStatus } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [discPercent, setDiscPercent] = useState(10);
  const [minOrder, setMinOrder] = useState(100000);
  const [desc, setDesc] = useState('');

  const handleAddVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    createPromotion({
      name: name || 'Promo Spesial',
      code: code.trim().toUpperCase(),
      status: 'Active',
      description: desc || 'Voucher Promo AllKurma',
      discountType: 'percentage',
      discountValue: Number(discPercent),
      maxDiscountCap: 500000,
      minPurchase: Number(minOrder),
      totalUsageLimit: 500,
      usagePerCustomer: 2,
      startDate: '2026-01-01',
      endDate: '2026-12-31',
      customerSegment: 'All Customers'
    });

    showToast(`Kupon ${code.toUpperCase()} berhasil dibuat & diaktifkan!`, 'success');
    setIsModalOpen(false);
    setCode('');
    setDesc('');
    setName('');
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
              Kupon & Diskon Promosi
            </h1>
            <p className="text-[10px] text-stone-400">Marketing & Campaign Management</p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-2.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-[11px] font-bold flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Kupon</span>
        </button>
      </div>

      {/* Vouchers list */}
      <div className="p-4 space-y-3">
        {promotions.map(v => (
          <div key={v.id} className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs space-y-2.5">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-sm text-amber-900 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                    {v.code}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    v.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-stone-100 text-stone-500'
                  }`}>
                    {v.discountType === 'percentage' ? `Diskon ${v.discountValue}%` : `Potongan Rp ${v.discountValue.toLocaleString('id-ID')}`}
                  </span>
                </div>
                <p className="text-xs text-stone-600 mt-1">{v.description}</p>
              </div>

              <button
                onClick={() => togglePromotionStatus(v.id)}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                  v.status === 'Active' ? 'bg-amber-100 text-amber-900 hover:bg-amber-200' : 'bg-stone-100 text-stone-600'
                }`}
              >
                {v.status === 'Active' ? 'Aktif' : 'Expired'}
              </button>
            </div>

            <div className="flex items-center justify-between text-[10px] text-stone-500 pt-2 border-t border-stone-100">
              <span>Min. Belanja: <strong>Rp {v.minPurchase.toLocaleString('id-ID')}</strong></span>
              <span>Berlaku s/d: <strong>{v.endDate}</strong></span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add Voucher */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl space-y-3 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <h3 className="font-bold text-stone-900 text-sm">Buat Kupon Promosi Baru</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddVoucher} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Nama Promo</label>
                <input
                  type="text"
                  required
                  placeholder="Ramadan Festive Sale"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Kode Voucher</label>
                <input
                  type="text"
                  required
                  placeholder="BERKAH2026"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg uppercase font-mono font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Diskon (%)</label>
                  <input
                    type="number"
                    value={discPercent}
                    onChange={(e) => setDiscPercent(Number(e.target.value))}
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Min. Belanja (Rp)</label>
                  <input
                    type="number"
                    value={minOrder}
                    onChange={(e) => setMinOrder(Number(e.target.value))}
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Keterangan Promosi</label>
                <input
                  type="text"
                  placeholder="Kupon Flash Sale Awal Musim"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2 border border-stone-200 rounded-xl text-stone-600"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-amber-800 text-white rounded-xl font-bold"
                >
                  Simpan Kupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
