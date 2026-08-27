import React, { useState } from 'react';
import { 
  Package, 
  Clock, 
  Truck, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Receipt, 
  RotateCcw, 
  ShoppingBag,
  CreditCard
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Order } from '../types';

interface CustomerOrdersSectionProps {
  initialStatusFilter?: string;
}

export const CustomerOrdersSection: React.FC<CustomerOrdersSectionProps> = ({ 
  initialStatusFilter = 'Semua' 
}) => {
  const { orders, setCurrentView, addToCart, showToast, products } = useApp();
  const [activeFilter, setActiveFilter] = useState<string>(initialStatusFilter);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filterTabs = [
    { label: 'Semua', count: orders.length },
    { label: 'Belum Bayar', count: orders.filter(o => o.status === 'Belum Bayar' || (o.status as string) === 'Belum Dibayar').length },
    { label: 'Diproses', count: orders.filter(o => o.status === 'Diproses').length },
    { label: 'Dikirim', count: orders.filter(o => o.status === 'Dikirim').length },
    { label: 'Selesai', count: orders.filter(o => o.status === 'Selesai').length },
    { label: 'Dibatalkan', count: orders.filter(o => o.status === 'Dibatalkan').length },
  ];

  const filteredOrders = activeFilter === 'Semua' 
    ? orders 
    : orders.filter(o => {
        if (activeFilter === 'Belum Bayar') {
          return o.status === 'Belum Bayar' || (o.status as string) === 'Belum Dibayar';
        }
        return o.status === activeFilter;
      });

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'Belum Bayar':
      case 'Belum Dibayar':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1"><Clock className="w-3 h-3 text-amber-700" /> Belum Dibayar</span>;
      case 'Diproses':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-900 border border-blue-300 flex items-center gap-1"><Package className="w-3 h-3 text-blue-700" /> Diproses</span>;
      case 'Dikirim':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-100 text-indigo-900 border border-indigo-300 flex items-center gap-1"><Truck className="w-3 h-3 text-indigo-700" /> Dikirim</span>;
      case 'Selesai':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-700" /> Selesai</span>;
      case 'Dibatalkan':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-stone-100 text-stone-700 border border-stone-300 flex items-center gap-1"><XCircle className="w-3 h-3 text-stone-500" /> Dibatalkan</span>;
      case 'Retur':
      case 'Komplain/Retur':
      default:
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-100 text-red-900 border border-red-300 flex items-center gap-1"><AlertTriangle className="w-3 h-3 text-red-700" /> Retur</span>;
    }
  };

  const handleBuyAgain = (order: Order) => {
    order.items.forEach(item => {
      const prod = item.product || products.find(p => p.id === item.productId);
      if (prod) {
        addToCart(prod, item.quantity);
      }
    });
    showToast('Produk berhasil ditambahkan kembali ke keranjang belanja!', 'success');
    setCurrentView('cart');
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
        <div>
          <h2 className="text-xl font-bold text-stone-900 font-['Playfair_Display',serif]">
            Pesanan Saya
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Pantau status pengiriman, riwayat pembayaran, dan resi ekspedisi pesanan kurma Anda.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-stone-100">
        {filterTabs.map((tab) => (
          <button
            key={tab.label}
            onClick={() => setActiveFilter(tab.label)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeFilter === tab.label
                ? 'bg-amber-800 text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              activeFilter === tab.label ? 'bg-amber-950/40 text-amber-200' : 'bg-stone-200 text-stone-700'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Order List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-16 space-y-3">
          <div className="w-16 h-16 bg-amber-50 text-amber-800 rounded-3xl mx-auto flex items-center justify-center border border-amber-200">
            <Package className="w-8 h-8 opacity-70" />
          </div>
          <h3 className="font-bold text-base text-stone-800">Tidak ada pesanan di kategori "{activeFilter}"</h3>
          <p className="text-xs text-stone-500 max-w-xs mx-auto">
            Jelajahi katalog kurma impor terbaik dari Timur Tengah dan nikmati pengiriman cepat.
          </p>
          <button
            onClick={() => setCurrentView('catalog')}
            className="mt-2 py-2.5 px-6 bg-amber-800 hover:bg-amber-900 text-white font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Mulai Belanja Sekarang</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const orderTotal = order.totalAmount ?? order.total ?? 0;
            return (
              <div 
                key={order.id}
                className="border border-stone-200 rounded-2xl overflow-hidden hover:border-amber-400 transition-all bg-white"
              >
                {/* Order Header */}
                <div className="p-4 bg-stone-50/80 border-b border-stone-200/70 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-stone-900">{order.invoiceCode || order.orderNumber || order.id}</span>
                    <span className="text-stone-400">•</span>
                    <span className="text-stone-500">{order.createdAt}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(order.status)}
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-4 space-y-3">
                  {order.items.map((item, idx) => {
                    const itemImg = item.image || item.product?.images?.[0] || 'https://images.unsplash.com/photo-1546548970-71785318a17b?w=200&auto=format&fit=crop&q=80';
                    const itemName = item.productName || item.product?.name || 'Kurma Premium';
                    const itemPrice = item.unitPrice || item.product?.discountPrice || item.product?.regularPrice || 0;

                    return (
                      <div key={idx} className="flex items-center gap-3.5">
                        <img 
                          src={itemImg} 
                          alt={itemName} 
                          className="w-14 h-14 rounded-xl object-cover border border-stone-200 shrink-0" 
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-xs text-stone-900 truncate">
                            {itemName}
                          </h4>
                          <p className="text-[11px] text-stone-500 mt-0.5">
                            {item.selectedVariation?.name || 'Kemasan Standar'} • {item.quantity} pcs
                          </p>
                          <p className="text-xs font-bold text-amber-900 mt-1">
                            Rp {(itemPrice * item.quantity).toLocaleString('id-ID')}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Order Footer & Actions */}
                <div className="p-4 bg-stone-50/50 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="text-stone-500 text-[11px]">Total Pesanan: </span>
                    <span className="font-bold text-sm text-stone-900">
                      Rp {orderTotal.toLocaleString('id-ID')}
                    </span>
                    {order.trackingNumber && (
                      <p className="text-[11px] text-stone-500 mt-0.5 flex items-center gap-1">
                        <Truck className="w-3 h-3 text-amber-700" />
                        <span>Resi: <strong className="font-mono text-stone-800">{order.trackingNumber}</strong> ({order.courier || order.courierName || 'SiCepat BEST'})</span>
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {(order.status === 'Belum Bayar' || (order.status as string) === 'Belum Dibayar') && (
                      <button
                        onClick={() => showToast('Membuka instruksi pembayaran...', 'info')}
                        className="py-2 px-4 bg-amber-800 hover:bg-amber-900 text-white font-bold rounded-xl text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Bayar Sekarang</span>
                      </button>
                    )}

                    {order.status === 'Selesai' && (
                      <button
                        onClick={() => handleBuyAgain(order)}
                        className="py-2 px-3.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-stone-600" />
                        <span>Beli Lagi</span>
                      </button>
                    )}

                    <button
                      onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                      className="py-2 px-3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-xl text-xs transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Receipt className="w-3.5 h-3.5" />
                      <span>{selectedOrder?.id === order.id ? 'Tutup Rincian' : 'Rincian Invoice'}</span>
                    </button>
                  </div>
                </div>

                {/* Expanded Invoice Detail View */}
                {selectedOrder?.id === order.id && (
                  <div className="p-4 bg-amber-50/60 border-t border-amber-200/60 text-xs space-y-3 animate-in fade-in">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-stone-700">
                      <div>
                        <span className="text-stone-500 font-medium block">Alamat Tujuan Pengiriman:</span>
                        <p className="font-semibold text-stone-900 mt-0.5">{order.shippingAddress?.recipientName} ({order.shippingAddress?.phone})</p>
                        <p className="text-[11px] text-stone-600">{order.shippingAddress?.fullAddress || order.shippingAddress?.streetAddress}, {order.shippingAddress?.city}</p>
                      </div>
                      <div>
                        <span className="text-stone-500 font-medium block">Metode Pembayaran:</span>
                        <p className="font-semibold text-stone-900 mt-0.5">{order.paymentMethod || 'KurmaPay Saldo'}</p>
                        <span className="text-stone-500 font-medium block mt-2">Status Pembayaran:</span>
                        <span className="font-bold text-emerald-700">{order.paymentStatus || 'Lunas'}</span>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
