import React, { useState, useEffect } from 'react';
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
  Sparkles,
  Copy,
  Clock,
  AlertCircle,
  ExternalLink,
  Check,
  ChevronDown
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { shippingService, ShippingRateResult, PROVINCES, CITIES, DISTRICTS } from '../../services/shippingService';
import { paymentService, PaymentMethodOption, PaymentTransactionRecord } from '../../services/paymentService';
import { Address, Order, ProductVariation } from '../../types';

interface CheckoutModalProps {
  onClose: () => void;
  directBuyItem?: {
    product: any;
    variation?: ProductVariation;
    quantity: number;
  };
}

export const PICKUP_WAREHOUSES = [
  {
    id: 'wh_jkt',
    name: 'Gudang Pusat AllKurma Jakarta',
    address: 'Jl. RS Fatmawati Raya No. 45, Cilandak, Jakarta Selatan, DKI Jakarta 12110',
    hours: 'Senin - Minggu: 08.00 - 20.00 WIB',
    phone: '0812-8888-2931',
    note: 'Siap diambil 30 menit setelah pembayaran'
  },
  {
    id: 'wh_sby',
    name: 'Hub AllKurma Surabaya',
    address: 'Komp. Pergudangan Rungkut Industri III No. 12, Surabaya, Jawa Timur 60293',
    hours: 'Senin - Sabtu: 08.30 - 17.30 WIB',
    phone: '0813-7777-1942',
    note: 'Pengambilan di loading dock pintu 2'
  },
  {
    id: 'wh_bdg',
    name: 'Hub AllKurma Bandung',
    address: 'Jl. Ir. H. Juanda (Dago) No. 182, Coblong, Bandung, Jawa Barat 40135',
    hours: 'Senin - Sabtu: 08.30 - 18.00 WIB',
    phone: '0812-9999-4451',
    note: 'Free parking pickup point'
  },
  {
    id: 'wh_mdn',
    name: 'Hub AllKurma Medan',
    address: 'Jl. Ringroad No. 88, Medan Sunggal, Kota Medan, Sumatera Utara 20122',
    hours: 'Senin - Sabtu: 08.30 - 17.30 WIB',
    phone: '0811-6666-8821',
    note: 'Hub distribusi Sumatera'
  }
];

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ onClose, directBuyItem }) => {
  const { 
    addresses, 
    addAddress,
    cart,
    cartTotals, 
    user, 
    setCurrentView, 
    appliedVoucher,
    kurmaPayBalance,
    shopeeCoins,
    useCoinsInCheckout,
    showToast,
    createOrder,
    clearCart
  } = useApp();

  // Selected checkout items: either directBuyItem or cart items
  const checkoutItems = directBuyItem 
    ? [{
        product: directBuyItem.product,
        selectedVariation: directBuyItem.variation,
        quantity: directBuyItem.quantity
      }]
    : cart;

  // Calculate items weight & subtotal
  const totalWeightGrams = checkoutItems.reduce((acc, it) => {
    const unitWeight = it.selectedVariation?.weightGram || it.product.weightGram || 500;
    return acc + (unitWeight * it.quantity);
  }, 0);

  const subtotal = checkoutItems.reduce((acc, it) => {
    const basePrice = it.selectedVariation
      ? (it.selectedVariation.discountPrice || it.selectedVariation.regularPrice)
      : (it.product.discountPrice || it.product.regularPrice);
    return acc + (basePrice * it.quantity);
  }, 0);

  // Address state
  const defaultAddr = addresses.find(a => a.isDefault) || addresses[0];
  const [selectedAddressId, setSelectedAddressId] = useState<string>(defaultAddr?.id || '');
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [isChangingAddress, setIsChangingAddress] = useState(false);

  // New Address Form State
  const [newRecipient, setNewRecipient] = useState(user.name || '');
  const [newPhone, setNewPhone] = useState(user.phone || '');
  const [newProvinceId, setNewProvinceId] = useState(PROVINCES[0]?.id || 'p-1');
  const [newCityId, setNewCityId] = useState(CITIES[0]?.id || 'c-101');
  const [newDistrictId, setNewDistrictId] = useState(DISTRICTS[0]?.id || 'd-10101');
  const [newPostalCode, setNewPostalCode] = useState('12110');
  const [newStreetAddress, setNewStreetAddress] = useState('');
  const [newAddressLabel, setNewAddressLabel] = useState('Rumah');
  const [newIsDefault, setNewIsDefault] = useState(false);

  const selectedAddr = addresses.find(a => a.id === selectedAddressId) || defaultAddr;

  // Shipping dynamic options & categories
  const [shippingRates, setShippingRates] = useState<ShippingRateResult[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<ShippingRateResult | null>(null);
  const [isSelectingShipping, setIsSelectingShipping] = useState(true);
  const [shippingCategoryFilter, setShippingCategoryFilter] = useState<'all' | 'store_delivery' | 'pickup' | 'reguler' | 'instant'>('all');
  const [selectedPickupWarehouseId, setSelectedPickupWarehouseId] = useState('wh_jkt');
  const [storeDeliverySlot, setStoreDeliverySlot] = useState('Pagi (09:00 - 12:00 WIB)');

  // Recalculate shipping rates when address or items change
  useEffect(() => {
    if (selectedAddr) {
      const rates = shippingService.calculateShippingCost({
        destinationProvince: selectedAddr.province || 'DKI Jakarta',
        destinationCity: selectedAddr.city || 'Jakarta Selatan',
        destinationDistrict: selectedAddr.district,
        totalWeightGrams,
        subtotal
      });
      setShippingRates(rates);
      if (rates.length > 0) {
        // preserve or set first
        setSelectedShipping(prev => {
          const match = rates.find(r => r.serviceCode === prev?.serviceCode);
          return match || rates[0];
        });
      }
    }
  }, [selectedAddressId, selectedAddr, totalWeightGrams, subtotal]);

  // Payment methods
  const paymentMethods = paymentService.getAvailablePaymentMethods(kurmaPayBalance);
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<string>(paymentMethods[0]?.id || 'qris_all');
  const [isSelectingPayment, setIsSelectingPayment] = useState(false);

  // Notes & PO
  const [orderNotes, setOrderNotes] = useState('');

  // Step 5: Success State
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [paymentTransaction, setPaymentTransaction] = useState<PaymentTransactionRecord | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculation Breakdown
  const shippingCost = selectedShipping?.cost ?? 20000;
  const shippingDiscount = selectedShipping?.discount ?? 0;
  
  let voucherDiscount = 0;
  if (appliedVoucher) {
    if (appliedVoucher.discountType === 'percentage') {
      voucherDiscount = subtotal * (appliedVoucher.discountValue / 100);
      if (appliedVoucher.maxDiscountCap && voucherDiscount > appliedVoucher.maxDiscountCap) {
        voucherDiscount = appliedVoucher.maxDiscountCap;
      }
    } else {
      voucherDiscount = appliedVoucher.discountValue;
    }
  }

  const maxCoinsDeduct = Math.min(shopeeCoins, Math.floor(subtotal * 0.25));
  const coinsDiscount = useCoinsInCheckout ? maxCoinsDeduct : 0;
  const selectedPaymentMethod = paymentMethods.find(m => m.id === selectedPaymentMethodId) || paymentMethods[0];
  const paymentFee = selectedPaymentMethod?.fee || 0;

  const grandTotal = Math.max(0, subtotal - voucherDiscount - coinsDiscount + shippingCost + paymentFee);

  // Save new address
  const handleSaveNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecipient || !newPhone || !newStreetAddress) {
      showToast('Harap lengkapi semua field alamat wajib!', 'error');
      return;
    }
    const provObj = PROVINCES.find(p => p.id === newProvinceId);
    const cityObj = CITIES.find(c => c.id === newCityId);
    const distObj = DISTRICTS.find(d => d.id === newDistrictId);

    const fullAddrString = `${newStreetAddress}, Kec. ${distObj?.name || ''}, ${cityObj?.name || ''}, ${provObj?.name || ''} ${newPostalCode}`;

    const newAddrObj: Omit<Address, 'id'> = {
      label: newAddressLabel,
      recipientName: newRecipient,
      phone: newPhone,
      streetAddress: newStreetAddress,
      fullAddress: fullAddrString,
      province: provObj?.name || 'DKI Jakarta',
      city: cityObj?.name || 'Jakarta Selatan',
      district: distObj?.name || '',
      postalCode: newPostalCode,
      country: 'Indonesia',
      isDefault: newIsDefault || addresses.length === 0
    };

    addAddress(newAddrObj);
    setIsAddingNewAddress(false);
    setIsChangingAddress(false);
    showToast('Alamat baru berhasil ditambahkan dan dipilih!', 'success');
  };

  // Place Order Action with Idempotency Protection
  const handlePlaceOrder = async () => {
    if (!selectedAddr) {
      showToast('Silakan pilih atau tambahkan alamat pengiriman terlebih dahulu!', 'error');
      setIsChangingAddress(true);
      return;
    }
    if (!selectedShipping) {
      showToast('Silakan pilih opsi kurir pengiriman!', 'error');
      return;
    }

    if (selectedPaymentMethodId === 'wallet_kurmapay' && kurmaPayBalance < grandTotal) {
      showToast(`Saldo KurmaPay (Rp ${kurmaPayBalance.toLocaleString('id-ID')}) tidak mencukupi untuk pembayaran Rp ${grandTotal.toLocaleString('id-ID')}!`, 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Create order snapshot
      const orderNumber = `INV/${new Date().getFullYear()}${(new Date().getMonth() + 1).toString().padStart(2, '0')}${new Date().getDate().toString().padStart(2, '0')}/${Math.floor(10000 + Math.random() * 90000)}`;
      const now = new Date();
      const dateStr = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

      const isDirectPaid = selectedPaymentMethod.category === 'kurmapay';

      const newOrder = createOrder({
        orderNumber,
        customerId: user.id,
        customerName: user.name,
        customerEmail: user.email,
        customerPhone: selectedAddr.phone || user.phone,
        customerType: user.role === 'wholesale_partner' ? 'Wholesale' : 'Retail',
        items: checkoutItems.map(it => {
          const unitPrice = it.selectedVariation
            ? (it.selectedVariation.discountPrice || it.selectedVariation.regularPrice)
            : (it.product.discountPrice || it.product.regularPrice);
          const weight = it.selectedVariation?.weightGram || it.product.weightGram || 500;
          return {
            productId: it.product.id,
            productName: it.selectedVariation ? `${it.product.name} - ${it.selectedVariation.name}` : it.product.name,
            sku: it.selectedVariation?.sku || it.product.sku,
            image: it.product.images?.[0] || '',
            unitPrice,
            quantity: it.quantity,
            lineTotal: unitPrice * it.quantity,
            weightGram: weight,
            selectedVariation: it.selectedVariation
          };
        }),
        subtotal,
        wholesaleDiscount: 0,
        voucherDiscount,
        voucherCode: appliedVoucher?.code,
        coinsDiscount,
        shippingCost,
        shippingDiscount,
        totalWeightGram: totalWeightGrams,
        total: grandTotal,
        totalAmount: grandTotal,
        status: isDirectPaid ? 'Diproses' : 'Belum Bayar',
        detailedStatus: isDirectPaid ? 'PROCESSING' : 'PENDING_PAYMENT',
        paymentMethod: selectedPaymentMethod.name,
        paymentMethodCategory: selectedPaymentMethod.category,
        paymentStatus: isDirectPaid ? 'Paid' : 'PENDING',
        shippingAddress: selectedAddr,
        courierName: selectedShipping.courierCode === 'pickup' 
          ? `Pickup (${PICKUP_WAREHOUSES.find(w => w.id === selectedPickupWarehouseId)?.name || 'Gudang Pusat'})`
          : selectedShipping.courierCode === 'store_delivery'
          ? `Kurir Toko (${storeDeliverySlot})`
          : selectedShipping.courierName,
        courier: selectedShipping.courierName,
        courierCode: selectedShipping.courierCode,
        shippingService: selectedShipping.courierCode === 'pickup'
          ? `Pickup by Customer - ${PICKUP_WAREHOUSES.find(w => w.id === selectedPickupWarehouseId)?.name}`
          : selectedShipping.courierCode === 'store_delivery'
          ? `Pengiriman Toko Direct - Slot: ${storeDeliverySlot}`
          : selectedShipping.serviceName,
        serviceCode: selectedShipping.serviceCode,
        notes: selectedShipping.courierCode === 'pickup'
          ? `[PICKUP DI GUDANG]: ${PICKUP_WAREHOUSES.find(w => w.id === selectedPickupWarehouseId)?.name} (${PICKUP_WAREHOUSES.find(w => w.id === selectedPickupWarehouseId)?.address}). ${orderNotes}`.trim()
          : selectedShipping.courierCode === 'store_delivery'
          ? `[PENGIRIMAN TOKO]: Slot ${storeDeliverySlot}. ${orderNotes}`.trim()
          : orderNotes
      });

      // 2. Generate Payment Transaction record
      const paymentTx = await paymentService.createPayment({
        orderId: newOrder.id,
        orderNumber: newOrder.orderNumber,
        amount: grandTotal,
        methodId: selectedPaymentMethod.id,
        customerName: user.name,
        customerEmail: user.email,
        customerPhone: user.phone
      });

      setCreatedOrder(newOrder);
      setPaymentTransaction(paymentTx);

      // If was from cart, clear cart
      if (!directBuyItem) {
        clearCart();
      }

      showToast(`Pesanan #${newOrder.orderNumber} berhasil dibuat!`, 'success');
    } catch (err: any) {
      showToast('Gagal memproses pesanan: ' + (err.message || 'Terjadi kesalahan'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Copy helper
  const handleCopy = (text: string, label: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      showToast(`${label} berhasil disalin!`, 'info');
    }
  };

  // ==========================================
  // VIEW: ORDER SUCCESS / PAYMENT DETAILS
  // ==========================================
  if (createdOrder && paymentTransaction) {
    const isPaid = paymentTransaction.status === 'PAID' || createdOrder.paymentStatus === 'Paid';

    return (
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl max-w-md w-full max-h-[92vh] overflow-y-auto p-6 text-center shadow-2xl animate-in zoom-in-95 space-y-4">
          
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="inline-block px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-[10px] font-extrabold uppercase tracking-wider mb-1.5">
              {isPaid ? 'Pembayaran Berhasil' : 'Menunggu Pembayaran'}
            </span>
            <h2 className="text-xl font-bold text-stone-900 font-['Playfair_Display',serif]">
              Pesanan Berhasil Dibuat!
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Nomor Invoice: <span className="font-mono font-bold text-stone-900">{createdOrder.orderNumber}</span>
            </p>
          </div>

          {/* Payment Specific Instructions */}
          {!isPaid && (
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 text-left space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-700">Total Pembayaran:</span>
                <span className="text-base font-black text-amber-950 font-mono">
                  Rp {grandTotal.toLocaleString('id-ID')}
                </span>
              </div>

              {/* QRIS Display */}
              {paymentTransaction.category === 'qris' && paymentTransaction.qrImageUrl && (
                <div className="text-center py-2 bg-white rounded-xl border border-stone-200 p-3 space-y-2">
                  <span className="text-[11px] font-bold text-stone-700 block">Pindai QRIS untuk Bayar</span>
                  <img
                    src={paymentTransaction.qrImageUrl}
                    alt="QRIS Code"
                    className="w-48 h-48 mx-auto object-contain border border-stone-100 rounded-lg shadow-xs"
                  />
                  <span className="text-[10px] text-stone-400 block">
                    Mendukung BCA Mobile, Livin Mandiri, BSI Mobile, GoPay, OVO, Dana & LinkAja
                  </span>
                </div>
              )}

              {/* Virtual Account Display */}
              {paymentTransaction.category === 'virtual_account' && paymentTransaction.vaNumber && (
                <div className="bg-white rounded-xl border border-stone-200 p-3 space-y-1.5">
                  <span className="text-[10px] text-stone-500 font-semibold block">{paymentTransaction.bankName}</span>
                  <div className="flex items-center justify-between">
                    <span className="text-base font-black font-mono text-stone-900 tracking-wider">
                      {paymentTransaction.vaNumber}
                    </span>
                    <button
                      onClick={() => handleCopy(paymentTransaction.vaNumber!, 'Nomor VA')}
                      className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-[10px] font-bold flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Salin</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Manual Bank Transfer */}
              {paymentTransaction.category === 'bank_transfer' && (
                <div className="bg-white rounded-xl border border-stone-200 p-3 space-y-1.5">
                  <span className="text-[10px] text-stone-500 font-semibold block">Transfer ke Rekening Resmi:</span>
                  <p className="text-xs font-bold text-stone-800">{paymentTransaction.bankName}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-black font-mono text-stone-900">
                      {paymentTransaction.paymentCode}
                    </span>
                    <button
                      onClick={() => handleCopy(paymentTransaction.paymentCode!, 'No Rekening')}
                      className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-[10px] font-bold flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Salin</span>
                    </button>
                  </div>
                  <span className="text-[10px] text-stone-500 block">a.n {paymentTransaction.accountHolder}</span>
                </div>
              )}

              {/* COD note */}
              {paymentTransaction.category === 'cod' && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <span>Siapkan uang pas sebesar <strong>Rp {grandTotal.toLocaleString('id-ID')}</strong> saat kurir mengantarkan paket.</span>
                </div>
              )}

              <div className="flex items-center gap-1.5 text-[11px] text-stone-500 pt-1 border-t border-stone-200">
                <Clock className="w-3.5 h-3.5 text-amber-700" />
                <span>Batas waktu bayar: <strong>24 Jam</strong></span>
              </div>
            </div>
          )}

          {/* Delivery & Summary Card */}
          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-left text-xs space-y-1.5">
            <div className="flex justify-between text-stone-600">
              <span>Kurir Pengiriman:</span>
              <span className="font-semibold text-stone-900">{createdOrder.courierName} ({createdOrder.shippingService})</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Alamat Tujuan:</span>
              <span className="font-semibold text-stone-900 truncate max-w-[200px]">{createdOrder.shippingAddress.city}</span>
            </div>
            <div className="flex justify-between text-stone-600 pt-1 border-t border-stone-200">
              <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                <Coins className="w-3.5 h-3.5 text-amber-600" />
                <span>Poin Loyalitas Didapat:</span>
              </span>
              <span className="font-bold text-emerald-700 font-mono">+{Math.floor(grandTotal / 10000)} Poin</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <button
              onClick={() => {
                onClose();
                setCurrentView('my-orders');
              }}
              className="w-full py-3 bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Truck className="w-4 h-4" />
              <span>Lihat Detail & Lacak Pesanan</span>
            </button>
            <button
              onClick={() => {
                onClose();
                setCurrentView('catalog');
              }}
              className="w-full py-2.5 border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-semibold rounded-xl transition-colors"
            >
              Lanjut Belanja Kurma Lain
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW: MAIN CHECKOUT INTERFACE
  // ==========================================
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col animate-in zoom-in-95">
        
        {/* Modal Header */}
        <div className="p-4 border-b border-stone-200 sticky top-0 bg-white z-20 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
              <h2 className="text-base font-bold text-stone-900 font-['Playfair_Display',serif]">
                Checkout Pembelian & Pilihan Kurir
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Checkout Steps Progress Bar */}
          <div className="grid grid-cols-3 gap-1 mt-3 bg-stone-100 p-1 rounded-xl text-[10px] font-bold text-center">
            <div className="py-1 px-1.5 bg-white text-stone-800 rounded-lg shadow-2xs flex items-center justify-center gap-1">
              <span className="w-3.5 h-3.5 rounded-full bg-amber-800 text-white flex items-center justify-center text-[8px]">1</span>
              <span>Alamat</span>
            </div>
            <div className="py-1 px-1.5 bg-amber-900 text-white rounded-lg shadow-xs flex items-center justify-center gap-1 font-extrabold animate-pulse">
              <span className="w-3.5 h-3.5 rounded-full bg-white text-amber-900 flex items-center justify-center text-[8px]">2</span>
              <span>Pilih Kurir</span>
            </div>
            <div className="py-1 px-1.5 text-stone-500 rounded-lg flex items-center justify-center gap-1">
              <span className="w-3.5 h-3.5 rounded-full bg-stone-300 text-stone-700 flex items-center justify-center text-[8px]">3</span>
              <span>Bayar</span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 space-y-4 text-xs">

          {/* 1. Alamat Pengiriman */}
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between border-b border-stone-200 pb-2">
              <div className="flex items-center gap-1.5 text-stone-900 font-bold">
                <span className="w-5 h-5 rounded-full bg-amber-800 text-white flex items-center justify-center text-[10px] font-mono font-bold">1</span>
                <MapPin className="w-4 h-4 text-amber-800" />
                <span>Alamat Pengiriman & Penerima</span>
              </div>
              <button
                onClick={() => setIsChangingAddress(!isChangingAddress)}
                className="text-amber-800 hover:text-amber-950 font-bold text-[11px] cursor-pointer"
              >
                {isChangingAddress ? 'Tutup' : 'Ganti Alamat'}
              </button>
            </div>

            {/* Address Selector Drawer */}
            {isChangingAddress ? (
              <div className="space-y-3 pt-1">
                {addresses.map(a => (
                  <label
                    key={a.id}
                    className={`block p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedAddressId === a.id ? 'bg-amber-50/60 border-amber-400 ring-2 ring-amber-800/10' : 'bg-white border-stone-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-stone-900">{a.recipientName}</span>
                          <span className="text-stone-400">•</span>
                          <span className="text-stone-600 font-mono">{a.phone}</span>
                          {a.isDefault && (
                            <span className="px-1.5 py-0.5 bg-amber-100 text-amber-900 rounded text-[9px] font-bold">
                              Utama
                            </span>
                          )}
                        </div>
                        <p className="text-stone-600 leading-relaxed text-[11px]">{a.fullAddress || a.streetAddress}</p>
                      </div>
                      <input
                        type="radio"
                        name="address_select"
                        checked={selectedAddressId === a.id}
                        onChange={() => {
                          setSelectedAddressId(a.id);
                          setIsChangingAddress(false);
                        }}
                        className="text-amber-800 focus:ring-amber-800 mt-1"
                      />
                    </div>
                  </label>
                ))}

                {!isAddingNewAddress ? (
                  <button
                    onClick={() => setIsAddingNewAddress(true)}
                    className="w-full py-2 border-2 border-dashed border-stone-300 hover:border-amber-700 text-stone-700 hover:text-amber-900 rounded-xl font-bold flex items-center justify-center gap-1 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Alamat Baru</span>
                  </button>
                ) : (
                  <form onSubmit={handleSaveNewAddress} className="p-3 bg-white rounded-xl border border-stone-200 space-y-2.5">
                    <h4 className="font-bold text-stone-900 text-xs">Form Tambah Alamat Baru</h4>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Nama Penerima *"
                        value={newRecipient}
                        onChange={(e) => setNewRecipient(e.target.value)}
                        className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-xs"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Nomor HP / WhatsApp *"
                        value={newPhone}
                        onChange={(e) => setNewPhone(e.target.value)}
                        className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-mono"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <select
                        value={newProvinceId}
                        onChange={(e) => {
                          setNewProvinceId(e.target.value);
                          const city = CITIES.find(c => c.provinceId === e.target.value);
                          if (city) setNewCityId(city.id);
                        }}
                        className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-xs"
                      >
                        {PROVINCES.map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>

                      <select
                        value={newCityId}
                        onChange={(e) => {
                          setNewCityId(e.target.value);
                          const dist = DISTRICTS.find(d => d.cityId === e.target.value);
                          if (dist) setNewDistrictId(dist.id);
                        }}
                        className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-xs"
                      >
                        {CITIES.filter(c => c.provinceId === newProvinceId).map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>

                      <input
                        type="text"
                        placeholder="Kode Pos"
                        value={newPostalCode}
                        onChange={(e) => setNewPostalCode(e.target.value)}
                        className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-mono"
                      />
                    </div>

                    <textarea
                      placeholder="Alamat Lengkap (Jalan, RT/RW, No Rumah, Kelurahan, Patokan) *"
                      rows={2}
                      value={newStreetAddress}
                      onChange={(e) => setNewStreetAddress(e.target.value)}
                      className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-xs resize-none"
                      required
                    />

                    <div className="flex items-center justify-between pt-1">
                      <label className="flex items-center gap-1.5 text-[11px] text-stone-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newIsDefault}
                          onChange={(e) => setNewIsDefault(e.target.checked)}
                          className="w-3.5 h-3.5 text-amber-800 rounded-sm"
                        />
                        <span>Jadikan Alamat Utama</span>
                      </label>
                      
                      <div className="flex gap-1.5">
                        <button
                          type="button"
                          onClick={() => setIsAddingNewAddress(false)}
                          className="px-2.5 py-1 border border-stone-200 rounded-lg text-stone-600"
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          className="px-3 py-1 bg-amber-800 text-white rounded-lg font-bold"
                        >
                          Simpan
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            ) : (
              selectedAddr ? (
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-900">{selectedAddr.recipientName}</span>
                    <span className="text-stone-400 font-mono">({selectedAddr.phone})</span>
                  </div>
                  <p className="text-stone-600 leading-relaxed text-[11px]">
                    {selectedAddr.fullAddress || selectedAddr.streetAddress}
                  </p>
                </div>
              ) : (
                <div className="py-2 text-center">
                  <p className="text-stone-500 mb-2">Belum ada alamat pengiriman tersimpan.</p>
                  <button
                    onClick={() => {
                      setIsChangingAddress(true);
                      setIsAddingNewAddress(true);
                    }}
                    className="px-3 py-1.5 bg-amber-800 text-white rounded-xl font-bold"
                  >
                    Tambah Alamat Sekarang
                  </button>
                </div>
              )
            )}
          </div>

          {/* 2. Items Snapshot Preview */}
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between border-b border-stone-200 pb-2">
              <span className="font-bold text-stone-900">
                Produk Dipesan ({checkoutItems.length} item • {(totalWeightGrams / 1000).toFixed(2)} kg)
              </span>
              <span className="text-[10px] text-stone-500">Harga Snapshot</span>
            </div>

            <div className="space-y-2 max-h-36 overflow-y-auto">
              {checkoutItems.map((it, idx) => {
                const basePrice = it.selectedVariation
                  ? (it.selectedVariation.discountPrice || it.selectedVariation.regularPrice)
                  : (it.product.discountPrice || it.product.regularPrice);
                return (
                  <div key={idx} className="flex items-center gap-2.5 bg-white p-2 rounded-xl border border-stone-200">
                    <img
                      src={it.product.images?.[0] || 'https://images.unsplash.com/photo-1596797882870-8c33deeac224?w=600&auto=format&fit=crop&q=80'}
                      alt={it.product.name}
                      className="w-10 h-10 rounded-lg object-cover border border-stone-100 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-stone-900 truncate">{it.product.name}</h4>
                      <p className="text-[10px] text-stone-500">
                        {it.selectedVariation ? it.selectedVariation.name : `${it.product.weightGram}g`} • {it.quantity}x
                      </p>
                    </div>
                    <span className="font-black text-amber-950 font-mono">
                      Rp {(basePrice * it.quantity).toLocaleString('id-ID')}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. Pilihan Jasa Pengiriman & Ongkir */}
          <div className="bg-white border-2 border-amber-800/30 rounded-2xl p-4 space-y-3 shadow-sm ring-1 ring-amber-800/10">
            <div className="flex items-center justify-between border-b border-stone-200 pb-2.5">
              <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
                <span className="w-6 h-6 rounded-full bg-amber-900 text-white flex items-center justify-center text-[11px] font-mono font-bold shrink-0 shadow-xs">2</span>
                <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center shrink-0">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <span className="block leading-tight text-amber-950 font-extrabold">Pilihan Jasa Kurir & Pengiriman</span>
                  <span className="text-[10px] font-normal text-stone-500">
                    Total Berat: {totalWeightGrams.toLocaleString('id-ID')} gram ({Math.max(1, Math.ceil(totalWeightGrams / 1000))} kg) • Pilih salah satu opsi di bawah
                  </span>
                </div>
              </div>
              <span className="text-[11px] font-bold text-amber-900 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full shrink-0">
                {shippingRates.length} Opsi Kurir
              </span>
            </div>

            {/* Filter Kategori Pengiriman */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <button
                type="button"
                onClick={() => setShippingCategoryFilter('all')}
                className={`px-2.5 py-1 rounded-lg font-bold shrink-0 transition-all ${
                  shippingCategoryFilter === 'all'
                    ? 'bg-amber-900 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                Semua ({shippingRates.length})
              </button>
              <button
                type="button"
                onClick={() => setShippingCategoryFilter('store_delivery')}
                className={`px-2.5 py-1 rounded-lg font-bold shrink-0 transition-all flex items-center gap-1 ${
                  shippingCategoryFilter === 'store_delivery'
                    ? 'bg-amber-900 text-white shadow-xs'
                    : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
                }`}
              >
                <span>🚛 Pengiriman Toko</span>
              </button>
              <button
                type="button"
                onClick={() => setShippingCategoryFilter('pickup')}
                className={`px-2.5 py-1 rounded-lg font-bold shrink-0 transition-all flex items-center gap-1 ${
                  shippingCategoryFilter === 'pickup'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                }`}
              >
                <span>🏪 Pickup di Toko (Gratis)</span>
              </button>
              <button
                type="button"
                onClick={() => setShippingCategoryFilter('reguler')}
                className={`px-2.5 py-1 rounded-lg font-bold shrink-0 transition-all ${
                  shippingCategoryFilter === 'reguler'
                    ? 'bg-amber-900 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                📦 Ekspedisi Reguler
              </button>
              <button
                type="button"
                onClick={() => setShippingCategoryFilter('instant')}
                className={`px-2.5 py-1 rounded-lg font-bold shrink-0 transition-all ${
                  shippingCategoryFilter === 'instant'
                    ? 'bg-amber-900 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                ⚡ Instant / SameDay
              </button>
            </div>

            {/* List Pilihan Kurir */}
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {shippingRates
                .filter(rate => {
                  if (shippingCategoryFilter === 'store_delivery') return rate.courierCode === 'store_delivery';
                  if (shippingCategoryFilter === 'pickup') return rate.courierCode === 'pickup';
                  if (shippingCategoryFilter === 'instant') return rate.courierCode === 'gosend' || rate.courierCode === 'grab';
                  if (shippingCategoryFilter === 'reguler') return !['store_delivery', 'pickup', 'gosend', 'grab'].includes(rate.courierCode);
                  return true;
                })
                .map((rate) => {
                  const isSelected = selectedShipping?.serviceCode === rate.serviceCode;
                  const isPickup = rate.courierCode === 'pickup';
                  const isStoreDelivery = rate.courierCode === 'store_delivery';

                  return (
                    <div
                      key={rate.serviceCode}
                      onClick={() => setSelectedShipping(rate)}
                      className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                        isSelected
                          ? isPickup 
                            ? 'bg-emerald-50/80 border-emerald-600 ring-2 ring-emerald-600/20' 
                            : 'bg-amber-50/80 border-amber-700 ring-2 ring-amber-700/20'
                          : 'bg-stone-50 hover:bg-stone-100/80 border-stone-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2.5">
                          <div className="text-xl shrink-0 mt-0.5">
                            {isPickup ? '🏪' : isStoreDelivery ? '🚛' : rate.courierCode === 'gosend' || rate.courierCode === 'grab' ? '⚡' : '📦'}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-extrabold text-stone-900 text-xs">{rate.courierName}</span>
                              <span className="px-1.5 py-0.5 bg-stone-200/80 rounded text-[10px] font-bold text-stone-700">
                                {rate.serviceName}
                              </span>
                              {isPickup && (
                                <span className="px-1.5 py-0.5 bg-emerald-600 text-white rounded text-[9px] font-black tracking-wide">
                                  FREE ONGKIR
                                </span>
                              )}
                              {isStoreDelivery && (
                                <span className="px-1.5 py-0.5 bg-amber-800 text-white rounded text-[9px] font-black tracking-wide">
                                  DIRECT ARMADA
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-stone-600 mt-1 leading-snug">{rate.description}</p>
                            <span className="text-[10px] font-semibold text-stone-500 block mt-0.5">
                              ⏱️ Estimasi: <span className="text-stone-800 font-bold">{rate.etd}</span>
                            </span>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          {rate.cost === 0 ? (
                            <span className="font-black text-emerald-700 text-xs font-mono bg-emerald-100 px-2 py-0.5 rounded-full">
                              Rp 0 (GRATIS)
                            </span>
                          ) : rate.discount > 0 ? (
                            <div>
                              <span className="text-[10px] text-stone-400 line-through block font-mono">
                                Rp {rate.originalCost.toLocaleString('id-ID')}
                              </span>
                              <span className="font-black text-emerald-700 text-xs font-mono">
                                Rp {rate.cost.toLocaleString('id-ID')}
                              </span>
                            </div>
                          ) : (
                            <span className="font-black text-stone-900 text-xs font-mono">
                              Rp {rate.cost.toLocaleString('id-ID')}
                            </span>
                          )}
                          <div className="mt-1 flex justify-end">
                            <input
                              type="radio"
                              name="shipping_select"
                              checked={isSelected}
                              onChange={() => setSelectedShipping(rate)}
                              className="text-amber-800 focus:ring-amber-800 cursor-pointer"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Special Sub-Section: If Pickup by Customer selected */}
            {selectedShipping?.courierCode === 'pickup' && (
              <div className="mt-3 p-3 bg-emerald-50 rounded-xl border border-emerald-300 space-y-2 text-xs animate-in fade-in duration-200">
                <div className="flex items-center gap-1.5 font-bold text-emerald-950">
                  <Building2 className="w-4 h-4 text-emerald-700" />
                  <span>Pilih Lokasi Gudang / Toko Pengambilan:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {PICKUP_WAREHOUSES.map((wh) => (
                    <label
                      key={wh.id}
                      className={`p-2 rounded-lg border cursor-pointer transition-all ${
                        selectedPickupWarehouseId === wh.id
                          ? 'bg-white border-emerald-600 ring-2 ring-emerald-600/20 shadow-xs'
                          : 'bg-white/70 border-emerald-200 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1">
                        <div className="font-bold text-stone-900 text-xs">{wh.name}</div>
                        <input
                          type="radio"
                          name="pickup_warehouse"
                          checked={selectedPickupWarehouseId === wh.id}
                          onChange={() => setSelectedPickupWarehouseId(wh.id)}
                          className="text-emerald-700 focus:ring-emerald-700 mt-0.5"
                        />
                      </div>
                      <p className="text-[10px] text-stone-600 mt-0.5 leading-tight">{wh.address}</p>
                      <p className="text-[9px] text-emerald-800 font-semibold mt-1">🕒 {wh.hours} • 📞 {wh.phone}</p>
                    </label>
                  ))}
                </div>
                <div className="text-[10px] text-emerald-900 bg-emerald-100/80 p-2 rounded-md font-medium">
                  💡 <span className="font-bold">Info Ambil:</span> Anda dapat langsung mengambil pesanan ke gudang yang dipilih dengan menunjukkan Kode Invoice / Barcode pesanan setelah checkout selesai.
                </div>
              </div>
            )}

            {/* Special Sub-Section: If Pengiriman Toko selected */}
            {selectedShipping?.courierCode === 'store_delivery' && (
              <div className="mt-3 p-3 bg-amber-50 rounded-xl border border-amber-300 space-y-2 text-xs animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-amber-950">
                    <Clock className="w-4 h-4 text-amber-800" />
                    <span>Pilih Slot Waktu Pengiriman Armada Toko:</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {['Pagi (09:00 - 12:00 WIB)', 'Siang (13:00 - 16:00 WIB)', 'Sore (16:30 - 20:00 WIB)'].map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setStoreDeliverySlot(slot)}
                      className={`p-2 rounded-lg border text-center transition-all ${
                        storeDeliverySlot === slot
                          ? 'bg-amber-900 text-white font-bold border-amber-950 shadow-xs'
                          : 'bg-white text-stone-700 border-amber-200 hover:bg-amber-100'
                      }`}
                    >
                      <span className="text-[11px] block leading-tight">{slot}</span>
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-amber-900 leading-tight">
                  ❄️ Dikirim menggunakan mobil van berpendingin AllKurma untuk memastikan kurma basah (seperti Sukari & Ruthob) tetap dingin, higienis, dan segar sampai di tangan Anda.
                </p>
              </div>
            )}
          </div>

          {/* 3. Pilihan Metode Pembayaran */}
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between border-b border-stone-200 pb-2">
              <div className="flex items-center gap-1.5 text-stone-900 font-bold">
                <span className="w-5 h-5 rounded-full bg-amber-800 text-white flex items-center justify-center text-[10px] font-mono font-bold">3</span>
                <CreditCard className="w-4 h-4 text-amber-800" />
                <span>Metode Pembayaran Tagihan</span>
              </div>
              <button
                onClick={() => setIsSelectingPayment(!isSelectingPayment)}
                className="text-amber-800 hover:text-amber-950 font-bold text-[11px] cursor-pointer"
              >
                {isSelectingPayment ? 'Tutup' : 'Ganti Metode'}
              </button>
            </div>

            {isSelectingPayment ? (
              <div className="space-y-2 pt-1 max-h-48 overflow-y-auto">
                {paymentMethods.map((m) => (
                  <label
                    key={m.id}
                    className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
                      selectedPaymentMethodId === m.id
                        ? 'bg-amber-50/70 border-amber-400 ring-2 ring-amber-800/10'
                        : 'bg-white border-stone-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">{m.icon}</span>
                      <div>
                        <span className="font-bold text-stone-900 block">{m.name}</span>
                        <span className="text-[10px] text-stone-500">{m.subname}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {m.fee > 0 && (
                        <span className="text-[10px] text-stone-500 font-mono">+Rp {m.fee.toLocaleString('id-ID')}</span>
                      )}
                      <input
                        type="radio"
                        name="payment_select"
                        checked={selectedPaymentMethodId === m.id}
                        onChange={() => {
                          setSelectedPaymentMethodId(m.id);
                          setIsSelectingPayment(false);
                        }}
                        className="text-amber-800 focus:ring-amber-800"
                      />
                    </div>
                  </label>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-stone-200">
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">{selectedPaymentMethod?.icon}</span>
                  <div>
                    <span className="font-bold text-stone-900 block">{selectedPaymentMethod?.name}</span>
                    <span className="text-[10px] text-stone-500">{selectedPaymentMethod?.subname}</span>
                  </div>
                </div>
                {selectedPaymentMethod?.fee ? (
                  <span className="text-[10px] text-stone-500 font-mono">+Rp {selectedPaymentMethod.fee.toLocaleString('id-ID')}</span>
                ) : (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                    Bebas Biaya
                  </span>
                )}
              </div>
            )}
          </div>

          {/* 5. Catatan Pesanan */}
          <div>
            <label className="font-semibold text-stone-700 block mb-1">Catatan untuk Penjual / Kurir (Opsional)</label>
            <input
              type="text"
              placeholder="Contoh: Tolong bungkus bubble wrap ekstra untuk hampers..."
              value={orderNotes}
              onChange={(e) => setOrderNotes(e.target.value)}
              className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl text-xs"
            />
          </div>

          {/* 6. Ringkasan Rincian Biaya */}
          <div className="bg-stone-50 rounded-2xl border border-stone-200 p-3.5 space-y-1.5 text-xs">
            <div className="flex justify-between text-stone-600">
              <span>Subtotal Produk:</span>
              <span className="font-mono font-bold text-stone-900">Rp {subtotal.toLocaleString('id-ID')}</span>
            </div>

            {voucherDiscount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Voucher Diskon ({appliedVoucher?.code}):</span>
                <span className="font-mono font-bold">-Rp {voucherDiscount.toLocaleString('id-ID')}</span>
              </div>
            )}

            {coinsDiscount > 0 && (
              <div className="flex justify-between text-amber-700">
                <span>Diskon Koin Kurma:</span>
                <span className="font-mono font-bold">-Rp {coinsDiscount.toLocaleString('id-ID')}</span>
              </div>
            )}

            <div className="flex justify-between text-stone-600">
              <span>Biaya Pengiriman:</span>
              <span className="font-mono font-bold text-stone-900">Rp {shippingCost.toLocaleString('id-ID')}</span>
            </div>

            {paymentFee > 0 && (
              <div className="flex justify-between text-stone-600">
                <span>Biaya Penanganan:</span>
                <span className="font-mono font-bold text-stone-900">Rp {paymentFee.toLocaleString('id-ID')}</span>
              </div>
            )}

            <div className="pt-2 border-t border-stone-200 flex justify-between items-center text-stone-900">
              <span className="font-bold text-sm">Total Tagihan Pembayaran:</span>
              <span className="font-black text-amber-950 text-base font-mono">
                Rp {grandTotal.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-stone-200 bg-white sticky bottom-0 z-20 flex items-center justify-between gap-3 shadow-lg">
          <div>
            <span className="text-[10px] text-stone-500 block">Total Tagihan</span>
            <span className="font-black text-base text-amber-950 font-mono">
              Rp {grandTotal.toLocaleString('id-ID')}
            </span>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={isSubmitting}
            className="flex-1 py-3 bg-amber-800 hover:bg-amber-900 active:scale-98 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Memproses Pesanan...</span>
            ) : (
              <>
                <span>Buat Pesanan & Bayar</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
