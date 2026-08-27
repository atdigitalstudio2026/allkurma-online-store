import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ShieldCheck, 
  UserCheck, 
  Lock, 
  CheckCircle2, 
  XCircle, 
  Building2,
  Users
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminRolesScreen: React.FC = () => {
  const { setCurrentView, switchRole, user, showToast } = useApp();

  const [permissions, setPermissions] = useState([
    { module: 'Lihat Katalog & Beli Eceran', retail: true, b2b: true, warehouse: true, admin: true },
    { module: 'Akses Harga Tier Grosir & Order Cepat B2B', retail: false, b2b: true, warehouse: true, admin: true },
    { module: 'Upload CSV Pesanan Massal (Bulk Order)', retail: false, b2b: true, warehouse: false, admin: true },
    { module: 'Kredit Termin Faktur Net-30 Hari', retail: false, b2b: true, warehouse: false, admin: true },
    { module: 'Penyesuaian Stok Gudang & Restock Kontainer', retail: false, b2b: false, warehouse: true, admin: true },
    { module: 'Input Resi Logistik & Cetak Surat Jalan', retail: false, b2b: false, warehouse: true, admin: true },
    { module: 'Tambah / Edit Katalog Produk & Tier Pricing', retail: false, b2b: false, warehouse: false, admin: true },
    { module: 'Manajemen Kupon Promo & Pengaturan Sistem', retail: false, b2b: false, warehouse: false, admin: true },
  ]);

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
              Hak Akses & Role RBAC
            </h1>
            <p className="text-[10px] text-stone-400">Role-Based Access Control Governance</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4 text-xs">
        
        {/* Active Role Persona Switcher Card */}
        <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs space-y-3">
          <h2 className="font-bold text-xs text-stone-900 flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-amber-800" />
            <span>Simulasi Hak Akses Persona Saat Ini</span>
          </h2>
          <p className="text-[11px] text-stone-500">
            Pilih role di bawah untuk langsung menguji tampilan antarmuka dan batasan hak akses:
          </p>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => {
                switchRole('super_admin');
                showToast('Beralih ke persona Super Administrator');
              }}
              className={`p-2.5 rounded-xl border text-left flex items-center gap-2 ${
                user.role === 'super_admin' ? 'bg-amber-50 border-amber-500 font-bold text-amber-950 ring-1 ring-amber-500' : 'bg-stone-50 border-stone-200 text-stone-700'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-amber-800 shrink-0" />
              <div>
                <span className="block text-[11px]">Super Admin</span>
                <span className="text-[9px] text-stone-400">Akses Penuh Sistem</span>
              </div>
            </button>

            <button
              onClick={() => {
                switchRole('warehouse_manager');
                showToast('Beralih ke persona Warehouse Manager');
              }}
              className={`p-2.5 rounded-xl border text-left flex items-center gap-2 ${
                user.role === 'warehouse_manager' ? 'bg-amber-50 border-amber-500 font-bold text-amber-950 ring-1 ring-amber-500' : 'bg-stone-50 border-stone-200 text-stone-700'
              }`}
            >
              <Building2 className="w-4 h-4 text-amber-800 shrink-0" />
              <div>
                <span className="block text-[11px]">Warehouse Mgr</span>
                <span className="text-[9px] text-stone-400">Stok & Fulfillment</span>
              </div>
            </button>

            <button
              onClick={() => {
                switchRole('wholesale_partner');
                showToast('Beralih ke persona Wholesale Partner (B2B)');
              }}
              className={`p-2.5 rounded-xl border text-left flex items-center gap-2 ${
                user.role === 'wholesale_partner' ? 'bg-amber-50 border-amber-500 font-bold text-amber-950 ring-1 ring-amber-500' : 'bg-stone-50 border-stone-200 text-stone-700'
              }`}
            >
              <Building2 className="w-4 h-4 text-amber-800 shrink-0" />
              <div>
                <span className="block text-[11px]">B2B Partner</span>
                <span className="text-[9px] text-stone-400">Tier & Quick Order</span>
              </div>
            </button>

            <button
              onClick={() => {
                switchRole('retail_customer');
                showToast('Beralih ke persona Retail Customer (B2C)');
              }}
              className={`p-2.5 rounded-xl border text-left flex items-center gap-2 ${
                user.role === 'retail_customer' ? 'bg-amber-50 border-amber-500 font-bold text-amber-950 ring-1 ring-amber-500' : 'bg-stone-50 border-stone-200 text-stone-700'
              }`}
            >
              <Users className="w-4 h-4 text-amber-800 shrink-0" />
              <div>
                <span className="block text-[11px]">Retail Customer</span>
                <span className="text-[9px] text-stone-400">Belanja Eceran</span>
              </div>
            </button>
          </div>
        </div>

        {/* Permissions Matrix Table */}
        <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs space-y-3">
          <h2 className="font-bold text-xs text-stone-900">
            Matriks Hak Akses Modul (RBAC)
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px]">
              <thead>
                <tr className="border-b border-stone-200 text-[10px] text-stone-400 font-bold uppercase">
                  <th className="pb-2">Modul Aplikasi</th>
                  <th className="pb-2 text-center">Retail</th>
                  <th className="pb-2 text-center">B2B</th>
                  <th className="pb-2 text-center">Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {permissions.map((p, idx) => (
                  <tr key={idx} className="hover:bg-stone-50">
                    <td className="py-2.5 text-stone-800 font-medium pr-2">{p.module}</td>
                    <td className="py-2.5 text-center">
                      {p.retail ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mx-auto" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-stone-300 mx-auto" />
                      )}
                    </td>
                    <td className="py-2.5 text-center">
                      {p.b2b ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mx-auto" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-stone-300 mx-auto" />
                      )}
                    </td>
                    <td className="py-2.5 text-center">
                      {p.admin ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mx-auto" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-stone-300 mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
};
