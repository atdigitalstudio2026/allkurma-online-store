import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Truck, 
  CreditCard, 
  Building2, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  ChevronRight,
  Plus,
  Coins,
  Wallet,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface CheckoutModalProps {
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ onClose }) => {
  const { 
    addresses, 
    cartTotals, 
    createOrder, 
    user, 
    setCurrentView, 
    appliedVoucher,
    shopeePayBalance,
    spayLaterLimit,
    spayLaterUsed,
    shopeeCoins,
    showToast
  } = useApp();

  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    addresses.find(a => a.isDefault)?.id || addresses[0]?.id || ''
  );
  const [selectedCourier, setSelectedCourier] = useState('Shopee Xpress Standard');
  const [selectedPayment, setSelectedPayment] = useState('ShopeePay');
  const [poNumber, setPoNumber] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdOrderNumber, setCreatedOrderNumber] = useState('');

  const couriers = [
    { id: 'Shopee Xpress Standard', name: 'Shopee Xpress Standard (1-2 Hari)', cost: 15000 },
    { id: 'J&T Express', name: 'J&T Express - Reguler', cost: 18000 },
    { id: 'JNE Reguler', name: 'JNE Reguler / OKE', cost: 20000 },
    { id: 'Kurir Internal Cargo', name: 'Kurir AllKurma Cargo (Grosir Pallet B2B)', cost: 50000 },
    { id: 'Instant 2 Jam', name: 'Instant Delivery 2 Jam (Jabodetabek)', cost: 40000 }
  ];

  const paymentMethods = [
    { 
      id: 'ShopeePay', 
      label: 'ShopeePay', 
      desc: `Saldo: Rp ${shopeePayBalance.toLocaleString('id-ID')}`, 
      icon: '🟠',
      badge: 'Cashback 5%'
    },
    { 
      id: 'SPayLater', 
      label: 'SPayLater (Beli Sekarang Bayar Nanti)', 
      desc: `Sisa Limit: Rp ${(spayLaterLimit - spayLaterUsed).toLocaleString('id-ID')}`, 
      icon: '💳',
      badge: 'Bunga 0%'
    },
    { id: 'COD (Bayar di Tempat)', label: 'COD (Bayar di Tempat)', desc: 'Bayar saat kurir mengantar barang', icon: '💵' },
    { id: 'BCA Virtual Account', label: 'BCA Virtual Account', desc: 'Verifikasi otomatis 24 jam', icon: '🏦' },
    { id: 'Mandiri Virtual Account', label: 'Mandiri Virtual Account', desc: 'Verifikasi instan', icon: '🏛️' },
    { id: 'QRIS', label: 'QRIS Semua Bank & E-Wallet', desc: 'Scan via BCA Mobile, GoPay, OVO', icon: '📱' },
    ...(user.role === 'wholesale_partner' || user.tier === 'Gold' || user.tier === 'Platinum'
      ? [{ id: 'Net 30 Days (Wholesale Billing)', label: 'Termin Net 30 Hari (Faktur B2B)', desc: 'Tempo tagihan bisnis korporasi', icon: '📑' }]
      : [])
  ];

  const selectedAddr = addresses.find(a => a.id === selectedAddressId) || addresses[0];

  const handlePlaceOrder = () => {
    // If using ShopeePay, check balance
    if (selectedPayment === 'ShopeePay' && shopeePayBalance < cartTotals.total) {
      showToast(`Saldo ShopeePay tidak mencukupi (Rp ${shopeePayBalance.toLocaleString('id-ID')}). Silakan pilih metode lain atau top-up!`, 'error');
      return;
    }

    const newOrder = createOrder({
      shippingAddress: selectedAddr,
      courierName: selectedCourier,
      paymentMethod: selectedPayment,
      notes: orderNotes,
      poNumber: poNumber || undefined
    });
    setCreatedOrderNumber(newOrder.orderNumber);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl animate-in zoom-in-95 space-y-4">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-stone-900 font-['Playfair_Display',serif]">
              Pesanan Berhasil Dibuat!
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Nomor Pesanan: <span className="font-mono font-bold text-stone-900">{createdOrderNumber}</span>
            </p>
          </div>

          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-left text-xs space-y-1.5">
            <div className="flex justify-between text-stone-600">
              <span>Metode Pembayaran:</span>
              <span className="font-semibold text-stone-900">{selectedPayment}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Total Tagihan:</span>
              <span className="font-bold text-amber-900 font-mono">Rp {cartTotals.total.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-stone-600 pt-1 border-t border-stone-200">
              <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                <Coins className="w-3.5 h-3.5 text-amber-600" />
                <span>Koin Shopee Didapat:</span>
              </span>
              <span className="font-bold text-emerald-700 font-mono">+{Math.floor(cartTotals.total / 500)} Koin</span>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <button
              onClick={() => {
                onClose();
                setCurrentView('my-orders');
              }}
              className="w-full py-2.5 bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              Lihat Riwayat & Lacak Pesanan
            </button>
            <button
              onClick={() => {
                onClose();
                setCurrentView('home');
              }}
              className="w-full py-2 border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-semibold rounded-xl transition-colors"
            >
              Kembali ke Beranda Toko
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col animate-in zoom-in-95">
        
        {/* Modal Header */}
        <div className="p-4 border-b border-stone-200 flex items-center justify-between sticky top-0 bg-white z-10 shadow-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
            <h2 className="text-base font-bold text-stone-900 font-['Playfair_Display',serif]">
              Checkout Pembelian
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 space-y-4 text-xs">
          
          {/* 1. Alamat Pengiriman */}
          <div className="space-y-2">
            <div className="flex items-center justify-between font-bold text-stone-800">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-800" />
                <span>Alamat Pengiriman</span>
              </span>
            </div>

            <div className="space-y-2">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  onClick={() => setSelectedAddressId(addr.id)}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                    selectedAddressId === addr.id
                      ? 'bg-amber-50/80 border-amber-600 ring-1 ring-amber-600 shadow-xs'
                      : 'bg-stone-50 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900 flex items-center gap-1.5">
                      <span className="text-[10px] px-1.5 py-0.2 bg-stone-200 text-stone-800 rounded font-semibold">
                        {addr.label}
                      </span>
                      <span>{addr.recipientName}</span>
                    </span>
                    <span className="text-[10px] text-stone-500">{addr.phone}</span>
                  </div>
                  <p className="text-[11px] text-stone-600 mt-1 leading-relaxed">
                    {addr.streetAddress}, {addr.city}, {addr.province} {addr.postalCode}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Opsi Pengiriman */}
          <div className="space-y-2">
            <span className="flex items-center gap-1.5 font-bold text-stone-800">
              <Truck className="w-4 h-4 text-amber-800" />
              <span>Opsi Pengiriman / Kurir</span>
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {couriers.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setSelectedCourier(c.id)}
                  className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                    selectedCourier === c.id
                      ? 'bg-amber-50/80 border-amber-600 font-bold text-amber-950 shadow-xs'
                      : 'bg-stone-50 border-stone-200 text-stone-700'
                  }`}
                >
                  <div className="text-[11px]">{c.name}</div>
                  <div className="text-[10px] text-stone-500 mt-0.5">
                    {cartTotals.shippingCost === 0 ? 'Gratis Ongkir XTRA' : `Rp ${c.cost.toLocaleString('id-ID')}`}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Metode Pembayaran (ShopeePay & SPayLater First) */}
          <div className="space-y-2">
            <span className="flex items-center gap-1.5 font-bold text-stone-800">
              <CreditCard className="w-4 h-4 text-amber-800" />
              <span>Metode Pembayaran</span>
            </span>
            <div className="space-y-2">
              {paymentMethods.map((pm) => (
                <div
                  key={pm.id}
                  onClick={() => setSelectedPayment(pm.id)}
                  className={`p-3 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                    selectedPayment === pm.id
                      ? 'bg-amber-50/80 border-amber-600 font-bold text-amber-950 ring-1 ring-amber-600 shadow-xs'
                      : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{pm.icon}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs">{pm.label}</span>
                        {pm.badge && (
                          <span className="text-[9px] bg-red-100 text-red-700 font-bold px-1.5 py-0.2 rounded-xs">
                            {pm.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-stone-500 font-normal">{pm.desc}</p>
                    </div>
                  </div>
                  {selectedPayment === pm.id && (
                    <span className="w-3 h-3 rounded-full bg-amber-700 ring-2 ring-amber-300" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 4. PO Number & Notes */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-semibold text-stone-600 block mb-1">
                No. PO Perusahaan (B2B)
              </label>
              <input
                type="text"
                placeholder="PO-2026-XYZ"
                value={poNumber}
                onChange={(e) => setPoNumber(e.target.value)}
                className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-stone-600 block mb-1">
                Pesan untuk Penjual / Kurir
              </label>
              <input
                type="text"
                placeholder="Titip di pos security..."
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-xs"
              />
            </div>
          </div>

          {/* 5. Summary Breakdown */}
          <div className="p-3.5 bg-amber-50/50 rounded-2xl border border-amber-200/60 space-y-1.5">
            <div className="flex justify-between text-stone-600">
              <span>Subtotal:</span>
              <span className="font-mono">Rp {cartTotals.subtotal.toLocaleString('id-ID')}</span>
            </div>
            {cartTotals.wholesaleDiscount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Diskon Grosir Volume:</span>
                <span className="font-mono font-bold">-Rp {cartTotals.wholesaleDiscount.toLocaleString('id-ID')}</span>
              </div>
            )}
            {cartTotals.voucherDiscount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Diskon Voucher ({appliedVoucher?.code}):</span>
                <span className="font-mono font-bold">-Rp {cartTotals.voucherDiscount.toLocaleString('id-ID')}</span>
              </div>
            )}
            {cartTotals.coinsDiscount > 0 && (
              <div className="flex justify-between text-amber-900">
                <span className="flex items-center gap-1">
                  <Coins className="w-3.5 h-3.5 text-amber-600" />
                  <span>Koin Shopee:</span>
                </span>
                <span className="font-mono font-bold">-Rp {cartTotals.coinsDiscount.toLocaleString('id-ID')}</span>
              </div>
            )}
            <div className="flex justify-between text-stone-600">
              <span>Biaya Pengiriman:</span>
              <span className="font-bold text-emerald-700">
                {cartTotals.shippingCost === 0 ? 'GRATIS ONGKIR XTRA' : `Rp ${cartTotals.shippingCost.toLocaleString('id-ID')}`}
              </span>
            </div>
            <div className="border-t border-amber-200 pt-2 flex justify-between font-bold text-sm text-stone-900">
              <span>Total Pembayaran:</span>
              <span className="font-black text-amber-950 font-mono text-base">
                Rp {cartTotals.total.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between sticky bottom-0">
          <div>
            <span className="text-[10px] text-stone-500 block">Total Akhir</span>
            <span className="font-bold text-amber-950 text-base font-mono">
              Rp {cartTotals.total.toLocaleString('id-ID')}
            </span>
          </div>

          <button
            onClick={handlePlaceOrder}
            className="px-6 py-3 bg-amber-800 hover:bg-amber-900 active:scale-95 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
          >
            <span>Bayar & Buat Pesanan</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
