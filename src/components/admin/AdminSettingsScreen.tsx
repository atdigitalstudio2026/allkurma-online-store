import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Truck, 
  CreditCard, 
  Store, 
  Save, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle,
  Building2,
  RefreshCw,
  Plus,
  Trash2,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { shippingService, AVAILABLE_COURIERS } from '../../services/shippingService';
import { paymentService, AVAILABLE_PAYMENT_METHODS } from '../../services/paymentService';

export const AdminSettingsScreen: React.FC = () => {
  const { setCurrentView, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'shipping' | 'payment' | 'store'>('shipping');

  // Shipping Config State
  const initialShipConfig = shippingService.getConfig();
  const [originWarehouse, setOriginWarehouse] = useState(initialShipConfig.originWarehouseName);
  const [originCity, setOriginCity] = useState(initialShipConfig.originCity);
  const [originProvince, setOriginProvince] = useState(initialShipConfig.originProvince);
  const [originPostal, setOriginPostal] = useState(initialShipConfig.originPostalCode);
  const [freeShipMin, setFreeShipMin] = useState(initialShipConfig.freeShippingThreshold);
  const [freeShipMaxDiscount, setFreeShipMaxDiscount] = useState(initialShipConfig.freeShippingDiscountMax);
  const [activeCouriers, setActiveCouriers] = useState<string[]>(initialShipConfig.activeCouriers);
  const [shippingSandbox, setShippingSandbox] = useState(initialShipConfig.isSandboxMode);

  // Payment Config State
  const initialPayConfig = paymentService.getConfig();
  const [activePaymentProvider, setActivePaymentProvider] = useState(initialPayConfig.activeProvider);
  const [paymentSandbox, setPaymentSandbox] = useState(initialPayConfig.isSandboxMode);
  const [enableQRIS, setEnableQRIS] = useState(initialPayConfig.enableQRIS);
  const [enableVA, setEnableVA] = useState(initialPayConfig.enableVA);
  const [enableBankTransfer, setEnableBankTransfer] = useState(initialPayConfig.enableBankTransfer);
  const [enableEWallet, setEnableEWallet] = useState(initialPayConfig.enableEWallet);
  const [enableCOD, setEnableCOD] = useState(initialPayConfig.enableCOD);
  const [enableKurmaPay, setEnableKurmaPay] = useState(initialPayConfig.enableKurmaPay);
  const [manualAccounts, setManualAccounts] = useState(initialPayConfig.manualAccounts);

  // Store Config State
  const [storeName, setStoreName] = useState('AllKurma Official Store');
  const [storeSlogan, setStoreSlogan] = useState('Pusat Grosir & Eceran Kurma Premium Impor Terpercaya');
  const [csPhone, setCsPhone] = useState('0812-8888-KURMA');
  const [csEmail, setCsEmail] = useState('support@allkurma.id');

  const toggleCourier = (code: string) => {
    setActiveCouriers(prev => 
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
  };

  const handleSaveShipping = (e: React.FormEvent) => {
    e.preventDefault();
    shippingService.updateConfig({
      originWarehouseName: originWarehouse,
      originCity,
      originProvince,
      originPostalCode: originPostal,
      freeShippingThreshold: Number(freeShipMin),
      freeShippingDiscountMax: Number(freeShipMaxDiscount),
      activeCouriers,
      isSandboxMode: shippingSandbox
    });
    showToast('Pengaturan Pengiriman & Kurir berhasil disimpan!', 'success');
  };

  const handleSavePayment = (e: React.FormEvent) => {
    e.preventDefault();
    paymentService.updateConfig({
      activeProvider: activePaymentProvider,
      isSandboxMode: paymentSandbox,
      enableQRIS,
      enableVA,
      enableBankTransfer,
      enableEWallet,
      enableCOD,
      enableKurmaPay,
      manualAccounts
    });
    showToast('Pengaturan Payment Gateway & Metode Pembayaran disimpan!', 'success');
  };

  const handleSaveStore = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Pengaturan Profil Toko & Kontak CS disimpan!', 'success');
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
              Konfigurasi E-Commerce
            </h1>
            <p className="text-[10px] text-stone-400">Shipping, Payment Gateway, & Store</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-stone-200 px-4 py-2 flex gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('shipping')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
            activeTab === 'shipping' 
              ? 'bg-amber-800 text-white shadow-xs' 
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          <Truck className="w-3.5 h-3.5" />
          <span>Ekspedisi & Kurir</span>
        </button>

        <button
          onClick={() => setActiveTab('payment')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
            activeTab === 'payment' 
              ? 'bg-amber-800 text-white shadow-xs' 
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Payment Gateway</span>
        </button>

        <button
          onClick={() => setActiveTab('store')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
            activeTab === 'store' 
              ? 'bg-amber-800 text-white shadow-xs' 
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          <Store className="w-3.5 h-3.5" />
          <span>Profil Toko</span>
        </button>
      </div>

      {/* Tab 1: Shipping Settings */}
      {activeTab === 'shipping' && (
        <form onSubmit={handleSaveShipping} className="p-4 space-y-4 text-xs">
          
          <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs space-y-3">
            <h2 className="font-bold text-stone-900 text-sm flex items-center gap-2">
              <Building2 className="w-4 h-4 text-amber-800" />
              <span>Gudang Asal Pengiriman (Origin)</span>
            </h2>
            
            <div className="space-y-2">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Nama Gudang / Fulfillment Center</label>
                <input
                  type="text"
                  value={originWarehouse}
                  onChange={(e) => setOriginWarehouse(e.target.value)}
                  className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Kota Asal</label>
                  <input
                    type="text"
                    value={originCity}
                    onChange={(e) => setOriginCity(e.target.value)}
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Provinsi</label>
                  <input
                    type="text"
                    value={originProvince}
                    onChange={(e) => setOriginProvince(e.target.value)}
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Kode Pos Gudang</label>
                <input
                  type="text"
                  value={originPostal}
                  onChange={(e) => setOriginPostal(e.target.value)}
                  className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl font-mono"
                />
              </div>
            </div>
          </div>

          {/* Couriers Toggle */}
          <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-800" />
                <span>Pilihan Jasa Kurir Aktif</span>
              </h2>
              <span className="text-[10px] text-stone-400">Centang untuk mengaktifkan</span>
            </div>

            <div className="space-y-2">
              {AVAILABLE_COURIERS.map(c => {
                const isChecked = activeCouriers.includes(c.code);
                return (
                  <label
                    key={c.code}
                    className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
                      isChecked ? 'bg-amber-50/50 border-amber-300' : 'bg-stone-50 border-stone-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">{c.logo}</span>
                      <div>
                        <span className="font-bold text-stone-900 block">{c.name}</span>
                        <span className="text-[10px] text-stone-500">Tipe: {c.type}</span>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleCourier(c.code)}
                      className="w-4 h-4 text-amber-800 rounded-sm focus:ring-amber-800"
                    />
                  </label>
                );
              })}
            </div>
          </div>

          {/* Free Shipping Rules */}
          <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs space-y-3">
            <h2 className="font-bold text-stone-900 text-sm">Promo Subsidi Gratis Ongkir</h2>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Minimal Belanja (Rp)</label>
                <input
                  type="number"
                  value={freeShipMin}
                  onChange={(e) => setFreeShipMin(Number(e.target.value))}
                  className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl font-mono font-bold"
                />
              </div>
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Maks Subsidi (Rp)</label>
                <input
                  type="number"
                  value={freeShipMaxDiscount}
                  onChange={(e) => setFreeShipMaxDiscount(Number(e.target.value))}
                  className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl font-mono font-bold"
                />
              </div>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="bg-amber-50 rounded-2xl border border-amber-200 p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-amber-800 shrink-0" />
              <div>
                <span className="font-bold text-amber-950 block">Sandbox / Development Mode</span>
                <span className="text-[10px] text-amber-800">Menghitung ongkir cerdas tanpa memotong kuota API resmi</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={shippingSandbox}
              onChange={(e) => setShippingSandbox(e.target.checked)}
              className="w-4 h-4 text-amber-800 rounded-sm focus:ring-amber-800"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-amber-800 hover:bg-amber-900 text-white font-bold rounded-xl shadow-xs flex items-center justify-center gap-2 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Pengaturan Pengiriman</span>
          </button>
        </form>
      )}

      {/* Tab 2: Payment Settings */}
      {activeTab === 'payment' && (
        <form onSubmit={handleSavePayment} className="p-4 space-y-4 text-xs">
          
          <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs space-y-3">
            <h2 className="font-bold text-stone-900 text-sm flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-amber-800" />
              <span>Provider Payment Gateway Utama</span>
            </h2>

            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'midtrans', name: 'Midtrans Snap & Core', desc: 'QRIS, VA, E-Wallet' },
                { id: 'xendit', name: 'Xendit Invoice API', desc: 'Multi-Bank & QRIS' },
                { id: 'manual', name: 'Manual Transfer Mandiri', desc: 'Verifikasi Struk Manual' },
                { id: 'internal_wallet', name: 'KurmaPay Ecosystem', desc: 'Dompet Digital Internal' }
              ].map(p => (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => setActivePaymentProvider(p.id as any)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    activePaymentProvider === p.id 
                      ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-800/20' 
                      : 'bg-stone-50 border-stone-200'
                  }`}
                >
                  <span className="font-bold text-stone-900 block">{p.name}</span>
                  <span className="text-[10px] text-stone-500">{p.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Payment Method Channels */}
          <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs space-y-3">
            <h2 className="font-bold text-stone-900 text-sm">Metode Pembayaran yang Diizinkan</h2>
            
            <div className="space-y-2">
              <label className="flex items-center justify-between p-2.5 bg-stone-50 rounded-xl border border-stone-200 cursor-pointer">
                <div className="flex items-center gap-2">
                  <span>📱</span>
                  <span className="font-bold text-stone-800">QRIS (BCA, Gopay, OVO, Dana, LinkAja)</span>
                </div>
                <input
                  type="checkbox"
                  checked={enableQRIS}
                  onChange={(e) => setEnableQRIS(e.target.checked)}
                  className="w-4 h-4 text-amber-800 rounded-sm"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 bg-stone-50 rounded-xl border border-stone-200 cursor-pointer">
                <div className="flex items-center gap-2">
                  <span>🏦</span>
                  <span className="font-bold text-stone-800">Virtual Account (BCA, Mandiri, BSI, BNI)</span>
                </div>
                <input
                  type="checkbox"
                  checked={enableVA}
                  onChange={(e) => setEnableVA(e.target.checked)}
                  className="w-4 h-4 text-amber-800 rounded-sm"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 bg-stone-50 rounded-xl border border-stone-200 cursor-pointer">
                <div className="flex items-center gap-2">
                  <span>🪙</span>
                  <span className="font-bold text-stone-800">Saldo KurmaPay (Instan 0 Biaya)</span>
                </div>
                <input
                  type="checkbox"
                  checked={enableKurmaPay}
                  onChange={(e) => setEnableKurmaPay(e.target.checked)}
                  className="w-4 h-4 text-amber-800 rounded-sm"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 bg-stone-50 rounded-xl border border-stone-200 cursor-pointer">
                <div className="flex items-center gap-2">
                  <span>💵</span>
                  <span className="font-bold text-stone-800">COD (Bayar Tunai di Tempat ke Kurir)</span>
                </div>
                <input
                  type="checkbox"
                  checked={enableCOD}
                  onChange={(e) => setEnableCOD(e.target.checked)}
                  className="w-4 h-4 text-amber-800 rounded-sm"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 bg-stone-50 rounded-xl border border-stone-200 cursor-pointer">
                <div className="flex items-center gap-2">
                  <span>📋</span>
                  <span className="font-bold text-stone-800">Transfer Manual Rekening Resmi PT</span>
                </div>
                <input
                  type="checkbox"
                  checked={enableBankTransfer}
                  onChange={(e) => setEnableBankTransfer(e.target.checked)}
                  className="w-4 h-4 text-amber-800 rounded-sm"
                />
              </label>
            </div>
          </div>

          {/* Sandbox Toggle */}
          <div className="bg-amber-50 rounded-2xl border border-amber-200 p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-800 shrink-0" />
              <div>
                <span className="font-bold text-amber-950 block">Payment Sandbox & Simulation Mode</span>
                <span className="text-[10px] text-amber-800">QRIS & VA disimulasikan aman tanpa debit uang riil</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={paymentSandbox}
              onChange={(e) => setPaymentSandbox(e.target.checked)}
              className="w-4 h-4 text-amber-800 rounded-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-amber-800 hover:bg-amber-900 text-white font-bold rounded-xl shadow-xs flex items-center justify-center gap-2 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Pengaturan Pembayaran</span>
          </button>
        </form>
      )}

      {/* Tab 3: Store Settings */}
      {activeTab === 'store' && (
        <form onSubmit={handleSaveStore} className="p-4 space-y-4 text-xs">
          <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs space-y-3">
            <h2 className="font-bold text-stone-900 text-sm flex items-center gap-2">
              <Store className="w-4 h-4 text-amber-800" />
              <span>Identitas Brand & Kontak</span>
            </h2>

            <div className="space-y-2">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Nama Toko Online</label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Slogan Brand</label>
                <input
                  type="text"
                  value={storeSlogan}
                  onChange={(e) => setStoreSlogan(e.target.value)}
                  className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Hotline WhatsApp CS</label>
                  <input
                    type="text"
                    value={csPhone}
                    onChange={(e) => setCsPhone(e.target.value)}
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Email Dukungan</label>
                  <input
                    type="email"
                    value={csEmail}
                    onChange={(e) => setCsEmail(e.target.value)}
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-amber-800 hover:bg-amber-900 text-white font-bold rounded-xl shadow-xs flex items-center justify-center gap-2 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Profil Toko</span>
          </button>
        </form>
      )}

    </div>
  );
};
