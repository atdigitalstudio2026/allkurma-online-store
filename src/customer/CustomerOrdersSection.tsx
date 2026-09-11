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
  CreditCard,
  Star,
  MessageSquarePlus,
  ShieldCheck,
  Eye
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Order } from '../types';
import { WriteReviewModal } from '../components/shop/WriteReviewModal';
import { OrderTrackingModal } from '../components/shop/OrderTrackingModal';
import { ReturnRequestModal } from '../components/shop/ReturnRequestModal';

interface CustomerOrdersSectionProps {
  initialStatusFilter?: string;
}

export const CustomerOrdersSection: React.FC<CustomerOrdersSectionProps> = ({ 
  initialStatusFilter = 'Semua' 
}) => {
  const { orders, setCurrentView, addToCart, addToCartWithVariation, showToast, products, updateOrderStatus, reviews } = useApp();
  const [activeFilter, setActiveFilter] = useState<string>(initialStatusFilter);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  // Tracking Modal State
  const [trackingTargetOrder, setTrackingTargetOrder] = useState<Order | null>(null);

  // Return Modal State
  const [returnTargetOrder, setReturnTargetOrder] = useState<Order | null>(null);

  // Review Modal State
  const [reviewingTarget, setReviewingTarget] = useState<{
    product: {
      id: string;
      name: string;
      image?: string;
      variation?: string;
    };
    orderId?: string;
  } | null>(null);

  const filterTabs = [
    { label: 'Semua', count: orders.length },
    { label: 'Belum Bayar', count: orders.filter(o => o.status === 'Belum Bayar' || (o.status as string) === 'Belum Dibayar').length },
    { label: 'Diproses', count: orders.filter(o => o.status === 'Diproses').length },
    { label: 'Dikirim', count: orders.filter(o => o.status === 'Dikirim').length },
    { label: 'Selesai', count: orders.filter(o => o.status === 'Selesai').length },
    { label: 'Komplain / Retur', count: orders.filter(o => o.status === 'Komplain/Retur' || o.status === 'Retur').length },
    { label: 'Dibatalkan', count: orders.filter(o => o.status === 'Dibatalkan').length },
  ];

  const filteredOrders = activeFilter === 'Semua' 
    ? orders 
    : orders.filter(o => {
        if (activeFilter === 'Belum Bayar') {
          return o.status === 'Belum Bayar' || (o.status as string) === 'Belum Dibayar';
        }
        if (activeFilter === 'Komplain / Retur') {
          return o.status === 'Komplain/Retur' || o.status === 'Retur';
        }
        return o.status === activeFilter;
      });

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'Belum Bayar':
      case 'Belum Dibayar':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
            <Clock className="w-3.5 h-3.5" />
            <span>Menunggu Pembayaran</span>
          </span>
        );
      case 'Diproses':
      case 'Dikemas':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
            <Package className="w-3.5 h-3.5" />
            <span>Sedang Dikemas</span>
          </span>
        );
      case 'Dikirim':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-800 border border-indigo-200">
            <Truck className="w-3.5 h-3.5" />
            <span>Sedang Dikirim</span>
          </span>
        );
      case 'Selesai':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Pesanan Selesai</span>
          </span>
        );
      case 'Komplain/Retur':
      case 'Retur':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-950 border border-orange-300">
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Proses Retur / Garansi</span>
          </span>
        );
      case 'Dibatalkan':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-stone-100 text-stone-600 border border-stone-300">
            <XCircle className="w-3.5 h-3.5" />
            <span>Dibatalkan</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-stone-100 text-stone-700">
            {status}
          </span>
        );
    }
  };

  const handleBuyAgain = (order: Order) => {
    let addedCount = 0;
    order.items.forEach(it => {
      const liveProduct = products.find(p => p.id === it.productId || p.sku === it.sku);
      if (liveProduct) {
        if (it.selectedVariation) {
          addToCartWithVariation(liveProduct, it.selectedVariation, it.quantity);
        } else {
          addToCart(liveProduct, it.quantity);
        }
        addedCount++;
      }
    });

    if (addedCount > 0) {
      showToast(`${addedCount} produk dari pesanan berhasil ditambahkan ke keranjang!`, 'success');
      setCurrentView('cart');
    } else {
      showToast('Produk dalam pesanan ini sedang tidak tersedia', 'error');
    }
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
                    const itemImg = item.image || item.product?.images?.[0] || 'https://images.unsplash.com/photo-1608755728617-aefab37d2edd?w=200&auto=format&fit=crop&q=80';
                    const itemName = item.productName || item.product?.name || 'Kurma Premium';
                    const itemPrice = item.unitPrice || item.product?.discountPrice || item.product?.regularPrice || 0;
                    const isItemReviewed = reviews.some(r => r.productId === (item.productId || item.product?.id) && (r.orderId === order.invoiceCode || r.orderId === order.orderNumber || r.orderId === order.id));

                    return (
                      <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-2.5 rounded-2xl bg-stone-50/70 border border-stone-100">
                        <div className="flex items-center gap-3.5">
                          <img 
                            src={itemImg} 
                            alt={itemName} 
                            className="w-14 h-14 rounded-xl object-cover border border-stone-200 shrink-0 bg-white" 
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

                        {/* Item Review Action if Order is Completed */}
                        {order.status === 'Selesai' && (
                          <div className="flex items-center justify-end pt-1 sm:pt-0">
                            <button
                              type="button"
                              onClick={() => {
                                setReviewingTarget({
                                  product: {
                                    id: item.productId || item.product?.id || 'prod-01',
                                    name: itemName,
                                    image: itemImg,
                                    variation: item.selectedVariation?.name || 'Kemasan Standar'
                                  },
                                  orderId: order.invoiceCode || order.orderNumber || order.id
                                });
                              }}
                              className={`py-1.5 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                                isItemReviewed
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
                                  : 'bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300'
                              }`}
                            >
                              <Star className={`w-3.5 h-3.5 ${isItemReviewed ? 'fill-emerald-600 text-emerald-600' : 'fill-amber-500 text-amber-500'}`} />
                              <span>{isItemReviewed ? 'Lihat / Edit Ulasan' : 'Beri Nilai & Foto (+50 Poin)'}</span>
                            </button>
                          </div>
                        )}
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

                  <div className="flex items-center gap-2 flex-wrap">
                    {(order.status === 'Belum Bayar' || (order.status as string) === 'Belum Dibayar') && (
                      <button
                        onClick={() => showToast('Membuka instruksi pembayaran...', 'info')}
                        className="py-2 px-4 bg-amber-800 hover:bg-amber-900 text-white font-bold rounded-xl text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Bayar Sekarang</span>
                      </button>
                    )}

                    {/* Live Courier Tracking Action */}
                    {(order.status === 'Dikirim' || order.status === 'Diproses' || order.status === 'Selesai') && (
                      <button
                        type="button"
                        onClick={() => setTrackingTargetOrder(order)}
                        className="py-2 px-3 bg-amber-50 hover:bg-amber-100 text-amber-950 font-bold rounded-xl text-xs border border-amber-300 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        <Truck className="w-3.5 h-3.5 text-amber-800" />
                        <span>Lacak Pengiriman</span>
                      </button>
                    )}

                    {order.status === 'Dikirim' && (
                      <button
                        onClick={() => {
                          updateOrderStatus(order.id, 'Selesai');
                          showToast('Terima kasih! Pesanan Anda telah ditandai Selesai.', 'success');
                          if (order.items && order.items.length > 0) {
                            const first = order.items[0];
                            setReviewingTarget({
                              product: {
                                id: first.productId || first.product?.id || 'prod-01',
                                name: first.productName || first.product?.name || 'Kurma Premium',
                                image: first.image || first.product?.images?.[0],
                                variation: first.selectedVariation?.name
                              },
                              orderId: order.invoiceCode || order.orderNumber || order.id
                            });
                          }
                        }}
                        className="py-2 px-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Konfirmasi Terima Paket</span>
                      </button>
                    )}

                    {/* Return / Warranty Action */}
                    {(order.status === 'Dikirim' || order.status === 'Selesai') && (
                      <button
                        type="button"
                        onClick={() => setReturnTargetOrder(order)}
                        className="py-2 px-3 text-stone-600 hover:text-red-700 hover:bg-red-50 font-bold rounded-xl text-xs border border-stone-200 hover:border-red-200 transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Ajukan Pengembalian</span>
                      </button>
                    )}

                    {order.status === 'Selesai' && order.items && order.items.length > 0 && (
                      <button
                        onClick={() => {
                          const first = order.items[0];
                          setReviewingTarget({
                            product: {
                              id: first.productId || first.product?.id || 'prod-01',
                              name: first.productName || first.product?.name || 'Kurma Premium',
                              image: first.image || first.product?.images?.[0],
                              variation: first.selectedVariation?.name
                            },
                            orderId: order.invoiceCode || order.orderNumber || order.id
                          });
                        }}
                        className="py-2 px-3.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Star className="w-3.5 h-3.5 fill-white text-white" />
                        <span>Tulis Ulasan & Foto</span>
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

      {/* WRITE REVIEW MODAL */}
      {reviewingTarget && (
        <WriteReviewModal
          isOpen={!!reviewingTarget}
          onClose={() => setReviewingTarget(null)}
          product={reviewingTarget.product}
          orderId={reviewingTarget.orderId}
          onReviewSubmitted={() => {
            showToast('Ulasan dan foto produk Anda berhasil dipublikasikan!', 'success');
          }}
        />
      )}

      {/* COURIER TRACKING MODAL */}
      {trackingTargetOrder && (
        <OrderTrackingModal
          order={trackingTargetOrder}
          isOpen={!!trackingTargetOrder}
          onClose={() => setTrackingTargetOrder(null)}
        />
      )}

      {/* RMA RETURN REQUEST MODAL */}
      {returnTargetOrder && (
        <ReturnRequestModal
          order={returnTargetOrder}
          isOpen={!!returnTargetOrder}
          onClose={() => setReturnTargetOrder(null)}
          onSuccess={() => {
            setActiveFilter('Komplain / Retur');
          }}
        />
      )}

    </div>
  );
};
