import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Users, 
  Search, 
  Award, 
  Building2, 
  Mail, 
  Phone, 
  Coins, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminCustomersScreen: React.FC = () => {
  const { setCurrentView, showToast, user } = useApp();

  const [customers, setCustomers] = useState([
    { id: '1', name: 'Zaid Al-Fatih', email: 'zaid@berkahkurma.co.id', phone: '0812-9876-5432', company: 'PT Berkah Mandiri Kurma', tier: 'Gold', totalOrders: 18, totalSpend: 120000000, points: 450 },
    { id: '2', name: 'Siti Rahmawati', email: 'siti.rahma@tokoamanah.com', phone: '0813-1122-3344', company: 'Toko Kurma Amanah Jaya', tier: 'Silver', totalOrders: 9, totalSpend: 45000000, points: 180 },
    { id: '3', name: 'Ahmad Fauzi', email: 'fauzi.retail@gmail.com', phone: '0857-4455-6677', company: 'Pribadi / Retail', tier: 'Bronze', totalOrders: 3, totalSpend: 2400000, points: 24 },
    { id: '4', name: 'Haji Mansur', email: 'mansur@barokahfood.id', phone: '0811-2233-4455', company: 'CV Barokah Pangan Nusantara', tier: 'Platinum', totalOrders: 34, totalSpend: 280000000, points: 950 },
  ]);

  const [search, setSearch] = useState('');

  const filtered = customers.filter(c => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.company.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
  });

  const handleTierChange = (id: string, newTier: string) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, tier: newTier } : c));
    showToast(`Tier pelanggan berhasil diubah ke ${newTier}!`, 'success');
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
              Pelanggan & CRM Grosir
            </h1>
            <p className="text-[10px] text-stone-400">Customer Relationship & B2B Tiers</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 bg-white border-b border-stone-200">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari nama pelanggan, perusahaan, atau email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg"
          />
        </div>
      </div>

      {/* Customer List */}
      <div className="p-4 space-y-3">
        {filtered.map(c => (
          <div key={c.id} className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-xs text-stone-900">{c.name}</h3>
                <span className="text-[10px] text-amber-800 font-medium">{c.company}</span>
                <span className="text-[10px] text-stone-500 block">{c.email} • {c.phone}</span>
              </div>

              {/* Tier selector */}
              <select
                value={c.tier}
                onChange={(e) => handleTierChange(c.id, e.target.value)}
                className="text-[10px] font-bold p-1 bg-amber-50 border border-amber-300 text-amber-900 rounded-lg"
              >
                <option value="Bronze">Tier Bronze (5%)</option>
                <option value="Silver">Tier Silver (12%)</option>
                <option value="Gold">Tier Gold (12% AM)</option>
                <option value="Platinum">Tier Platinum (20%)</option>
              </select>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-stone-100 text-center text-xs">
              <div className="bg-stone-50 p-2 rounded-xl">
                <span className="text-[9px] text-stone-400 block">Total Pesanan</span>
                <span className="font-bold font-mono text-stone-800">{c.totalOrders}x</span>
              </div>
              <div className="bg-stone-50 p-2 rounded-xl">
                <span className="text-[9px] text-stone-400 block">Akumulasi Belanja</span>
                <span className="font-bold font-mono text-amber-950 text-[10px]">
                  Rp {(c.totalSpend / 1000000).toFixed(1)} jt
                </span>
              </div>
              <div className="bg-stone-50 p-2 rounded-xl">
                <span className="text-[9px] text-stone-400 block">Poin Loyalitas</span>
                <span className="font-bold font-mono text-emerald-700">{c.points} Pts</span>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
