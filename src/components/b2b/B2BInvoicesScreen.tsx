import React, { useState } from 'react';
import { 
  ArrowLeft, 
  FileText, 
  Download, 
  CreditCard, 
  Search
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { WholesaleInvoice } from '../../types';

export const B2BInvoicesScreen: React.FC = () => {
  const { invoices, payInvoice, setCurrentView, showToast } = useApp();
  const [filterTab, setFilterTab] = useState<'all' | 'unpaid' | 'paid'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Metrics
  const outstandingBalance = invoices
    .filter(inv => inv.status === 'Unpaid' || inv.status === 'Overdue')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const totalPaidYTD = invoices
    .filter(inv => inv.status === 'Paid')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const filteredInvoices = invoices.filter(inv => {
    if (filterTab === 'unpaid' && inv.status === 'Paid') return false;
    if (filterTab === 'paid' && inv.status !== 'Paid') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        inv.invoiceNumber.toLowerCase().includes(q) ||
        inv.orderNumber.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleDownloadInvoicePDF = (inv: WholesaleInvoice) => {
    showToast(`Mengunduh berkas e-Faktur Pajak & Faktur Komersial: ${inv.invoiceNumber}.pdf`, 'success');
  };

  return (
    <div className="pb-28 max-w-lg mx-auto bg-stone-50 min-h-screen">
      
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
            Faktur Grosir & Tagihan
          </h1>
          <p className="text-[10px] text-stone-500">Enterprise Invoicing & Net-30 Ledger</p>
        </div>

        <div className="w-8" />
      </div>

      {/* 1. Top Metrics Grid (Matching Screenshot 3 screen 7) */}
      <div className="p-4 space-y-3">
        <div className="grid grid-cols-2 gap-2">
          
          <div className="p-3.5 bg-amber-900 text-white rounded-2xl shadow-sm">
            <span className="text-[10px] text-amber-200 block font-medium">
              Outstanding Balance
            </span>
            <span className="text-base font-black font-mono mt-0.5 block">
              Rp {outstandingBalance.toLocaleString('id-ID')}
            </span>
            <span className="text-[9px] text-amber-300 mt-1 block">Termin Net 30 Aktif</span>
          </div>

          <div className="p-3.5 bg-white border border-stone-200 rounded-2xl shadow-xs">
            <span className="text-[10px] text-stone-500 block font-medium">
              Total Paid YTD (2026)
            </span>
            <span className="text-base font-black text-emerald-800 font-mono mt-0.5 block">
              Rp {totalPaidYTD.toLocaleString('id-ID')}
            </span>
            <span className="text-[9px] text-emerald-600 mt-1 block">100% On-Time Credit Score</span>
          </div>

        </div>

        {/* 2. Filter Tabs & Search */}
        <div className="bg-white rounded-2xl border border-stone-200 p-3 shadow-xs space-y-2.5">
          <div className="flex bg-stone-100 p-1 rounded-xl">
            <button
              onClick={() => setFilterTab('all')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterTab === 'all' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              Semua ({invoices.length})
            </button>
            <button
              onClick={() => setFilterTab('unpaid')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterTab === 'unpaid' ? 'bg-white text-amber-900 shadow-xs' : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              Belum Dibayar ({invoices.filter(i => i.status !== 'Paid').length})
            </button>
            <button
              onClick={() => setFilterTab('paid')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterTab === 'paid' ? 'bg-white text-emerald-800 shadow-xs' : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              Lunas ({invoices.filter(i => i.status === 'Paid').length})
            </button>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari Nomor Faktur / Pesanan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg font-mono"
            />
          </div>
        </div>

        {/* 3. Invoices List (Matching Screenshot 3 screen 7) */}
        <div className="space-y-3">
          {filteredInvoices.map((inv) => {
            const isPaid = inv.status === 'Paid';
            const isOverdue = inv.status === 'Overdue';

            return (
              <div
                key={inv.id}
                className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs space-y-3 hover:border-amber-400 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-amber-800" />
                      <span className="font-bold text-xs text-stone-900 font-mono">
                        {inv.invoiceNumber}
                      </span>
                    </div>
                    <span className="text-[10px] text-stone-500 mt-0.5 block">
                      Pesanan: <strong className="font-mono text-stone-700">{inv.orderNumber}</strong>
                    </span>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isPaid
                        ? 'bg-emerald-100 text-emerald-800'
                        : isOverdue
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {isPaid ? 'Lunas' : isOverdue ? 'Jatuh Tempo' : 'Menunggu Pembayaran'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-stone-100 text-stone-600">
                  <div>
                    <span className="text-[10px] text-stone-400 block">Tanggal Terbit</span>
                    <span className="font-medium text-stone-800">{inv.dateIssued}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 block">Jatuh Tempo</span>
                    <span className={`font-medium ${isOverdue ? 'text-red-700 font-bold' : 'text-stone-800'}`}>
                      {inv.dueDate}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="text-[10px] text-stone-400 block">Total Tagihan</span>
                    <span className="font-black text-amber-950 text-sm font-mono">
                      Rp {inv.amount.toLocaleString('id-ID')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDownloadInvoicePDF(inv)}
                      className="p-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl"
                      title="Download Faktur PDF"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>

                    {!isPaid && (
                      <button
                        onClick={() => payInvoice(inv.id)}
                        className="px-3.5 py-1.5 bg-amber-800 hover:bg-amber-900 active:scale-95 text-white text-xs font-bold rounded-xl flex items-center gap-1 shadow-xs transition-all"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Bayar Faktur</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
