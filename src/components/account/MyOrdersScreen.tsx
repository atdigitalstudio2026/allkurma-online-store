import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Package, 
  Truck, 
  Repeat, 
  RotateCcw, 
  X,
  CreditCard,
  CheckCircle2,
  Clock,
  MapPin,
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
  Star,
  MessageSquarePlus
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus } from '../../types';
import { shippingService } from '../../services/shippingService';
import { WriteReviewModal } from '../shop/WriteReviewModal';
import { ReturnRequestModal } from '../shop/ReturnRequestModal';
import { OrderTrackingModal } from '../shop/OrderTrackingModal';

export const MyOrdersScreen: React.FC = () => {
  const { orders, updateOrderStatus, products, setCurrentView, addToCart, showToast, reviews } = useApp();
  const [selectedStatusTab, setSelectedStatusTab] = useState<string>('all');
  
  // Tracking Modal State
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);

  // Return Modal State
  const [returnModalOrder, setReturnModalOrder] = useState<Order | null>(null);

  // Cancellation Modal State
  const [cancelModalOrder, setCancelModalOrder] = useState<Order | null>(null);
  const [cancelReason, setCancelReason] = useState('Ingin mengubah pesanan/alamat');

  // Pay Now Modal State
  const [payNowOrder, setPayNowOrder] = useState<Order | null>(null);

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

  const tabs = [
    { id: 'all', label: 'Semua' },
    { id: 'Belum Bayar', label: 'Belum Bayar' },
    { id: 'Diproses', label: 'Dikemas' },
    { id: 'Dikirim', label: 'Dikirim' },
    { id: 'Selesai', label: 'Selesai' },
    { id: 'Komplain/Retur', label: 'Komplain / Retur' },
    { id: 'Dibatalkan', label: 'Dibatalkan' },
  ];

  const filteredOrders = orders.filter(o => {
    if (selectedStatusTab === 'all') return true;
    if (selectedStatusTab === 'Diproses') {
      return o.status === 'Diproses' || o.status === 'Dikemas' || o.status === 'PROCESSING' || o.status === 'PACKED';
    }
    if (selectedStatusTab === 'Belum Bayar') {
      return o.status === 'Belum Bayar' || o.status === 'Belum Dibayar' || o.status === 'PENDING_PAYMENT';
    }
    if (selectedStatusTab === 'Dikirim') {
      return o.status === 'Dikirim' || o.status === 'SHIPPED' || o.status === 'DELIVERED';
    }
    if (selectedStatusTab === 'Selesai') {
      return o.status === 'Selesai' || o.status === 'COMPLETED';
    }
    if (selectedStatusTab === 'Komplain/Retur') {
      return o.status === 'Komplain/Retur' || o.status === 'Retur' || (o.status as string) === 'REFUNDED';
    }
    if (selectedStatusTab === 'Dibatalkan') {
      return o.status === 'Dibatalkan' || o.status === 'CANCELLED';
    }
    return o.status === selectedStatusTab;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Belum Bayar':
      case 'Belum Dibayar':
      case 'PENDING_PAYMENT':
        return <span className="px-2.5 py-0.5 bg-amber-100 text-amber-900 text-[10px] font-extrabold rounded-full">Menunggu Pembayaran</span>;
      case 'Diproses':
      case 'Dikemas':
      case 'PAYMENT_CONFIRMED':
      case 'PROCESSING':
      case 'PACKED':
        return <span className="px-2.5 py-0.5 bg-blue-100 text-blue-900 text-[10px] font-extrabold rounded-full">Sedang Dikemas</span>;
      case 'Dikirim':
      case 'SHIPPED':
      case 'DELIVERED':
        return <span className="px-2.5 py-0.5 bg-purple-100 text-purple-900 text-[10px] font-extrabold rounded-full">Dalam Pengiriman</span>;
      case 'Selesai':
      case 'COMPLETED':
        return <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-900 text-[10px] font-extrabold rounded-full">Selesai</span>;
      case 'Komplain/Retur':
      case 'Retur':
      case 'REFUNDED':
        return <span className="px-2.5 py-0.5 bg-orange-100 text-orange-950 text-[10px] font-extrabold rounded-full">Komplain / Retur</span>;
      case 'Dibatalkan':
      case 'CANCELLED':
        return <span className="px-2.5 py-0.5 bg-red-100 text-red-900 text-[10px] font-extrabold rounded-full">Dibatalkan</span>;
      default:
        return <span className="px-2.5 py-0.5 bg-stone-100 text-stone-700 text-[10px] font-bold rounded-full">{status}</span>;
    }
  };

  const handleReorder = (order: Order) => {
    order.items.forEach(item => {
      const prod = products.find(p => p.id === item.productId);
      if (prod) {
        addToCart(prod, item.quantity);
      }
    });
    showToast(`${order.items.length} produk dari pesanan ${order.orderNumber} dimasukkan kembali ke keranjang!`, 'success');
    setCurrentView('cart');
  };

  const handleConfirmReceived = (order: Order) => {
    updateOrderStatus(order.id, 'Selesai');
    showToast('Terima kasih! Pesanan telah selesai dan koin loyalitas telah dikreditkan.', 'success');
    
    // Automatically prompt customer to write a review with star rating & photos
    if (order.items && order.items.length > 0) {
      const firstItem = order.items[0];
      setReviewingTarget({
        product: {
          id: firstItem.productId,
          name: firstItem.productName,
          image: firstItem.image,
          variation: firstItem.selectedVariation?.name
        },
        orderId: order.orderNumber || order.id
      });
    }
  };

  const handleCancelOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancelModalOrder) return;
    updateOrderStatus(cancelModalOrder.id, 'Dibatalkan');
    showToast(`Pesanan #${cancelModalOrder.orderNumber} berhasil dibatalkan. Alasan: ${cancelReason}`, 'info');
    setCancelModalOrder(null);
  };

  const handleSimulatePayment = (orderId: string) => {
    updateOrderStatus(orderId, 'Diproses');
    showToast('Pembayaran berhasil diverifikasi secara instan!', 'success');
    setPayNowOrder(null);
  };

  return (
    <div className="pb-28 max-w-lg mx-auto bg-stone-50 min-h-screen">
      
      {/* Top Header */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200 px-4 py-3 flex items-center justify-between shadow-xs">
        <button
          onClick={() => setCurrentView('my-profile')}
          className="p-1.5 rounded-lg text-stone-700 hover:bg-stone-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <h1 className="text-sm font-bold text-stone-900 font-['Playfair_Display',serif]">
          Pesanan & Belanja Saya
        </h1>

        <div className="w-8" />
      </div>

      {/* Status Filter Tabs */}
      <div className="bg-white border-b border-stone-200 px-4 py-2 overflow-x-auto scrollbar-none sticky top-12 z-20 shadow-2xs">
        <div className="flex gap-1.5">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedStatusTab(tab.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${
                selectedStatusTab === tab.id
                  ? 'bg-amber-800 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Cards List */}
      <div className="p-4 space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
            <Package className="w-10 h-10 text-stone-300 mx-auto mb-2" />
            <h3 className="font-bold text-stone-800 text-sm">Tidak Ada Pesanan</h3>
            <p className="text-xs text-stone-500 mt-1">Belum ada catatan transaksi pada tab status ini.</p>
            <button
              onClick={() => setCurrentView('catalog')}
              className="mt-4 px-5 py-2.5 bg-amber-800 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-amber-900 transition-colors"
            >
              Mulai Belanja Kurma
            </button>
          </div>
        ) : (
          filteredOrders.map(order => {
            const isUnpaid = order.status === 'Belum Bayar' || order.status === 'Belum Dibayar' || order.status === 'PENDING_PAYMENT';
            const isShipped = order.status === 'Dikirim' || order.status === 'SHIPPED' || order.status === 'DELIVERED';
            const isProcessing = order.status === 'Diproses' || order.status === 'Dikemas' || order.status === 'PACKED';
            const isCompleted = order.status === 'Selesai' || order.status === 'COMPLETED';

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs space-y-3"
              >
                {/* Card Header */}
                <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-amber-800" />
                    <span className="font-bold text-xs text-stone-900 font-mono">
                      {order.orderNumber}
                    </span>
                  </div>
                  {getStatusBadge(order.status)}
                </div>

                {/* Items in order */}
                <div className="space-y-2.5">
                  {order.items.map((item, idx) => {
                    const isItemReviewed = reviews.some(r => r.productId === item.productId && (r.orderId === order.orderNumber || r.orderId === order.id));

                    return (
                      <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 rounded-xl bg-stone-50/60 border border-stone-100">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.productName}
                            className="w-12 h-12 rounded-xl object-cover border border-stone-100 shrink-0 bg-white"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-stone-900 truncate">
                              {item.productName}
                            </h4>
                            <p className="text-[11px] text-stone-500">
                              {item.selectedVariation?.name || 'Varian Reguler'} • {item.quantity}x
                            </p>
                            <span className="text-xs font-black text-amber-950 font-mono sm:hidden">
                              Rp {item.lineTotal.toLocaleString('id-ID')}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-2 pt-1 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                          <span className="text-xs font-black text-amber-950 font-mono hidden sm:inline">
                            Rp {item.lineTotal.toLocaleString('id-ID')}
                          </span>

                          {/* Write Review Button per Item for Completed Orders */}
                          {isCompleted && (
                            <button
                              type="button"
                              onClick={() => {
                                setReviewingTarget({
                                  product: {
                                    id: item.productId,
                                    name: item.productName,
                                    image: item.image,
                                    variation: item.selectedVariation?.name
                                  },
                                  orderId: order.orderNumber || order.id
                                });
                              }}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                                isItemReviewed
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                                  : 'bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300'
                              }`}
                            >
                              <Star className={`w-3.5 h-3.5 ${isItemReviewed ? 'fill-emerald-600 text-emerald-600' : 'fill-amber-500 text-amber-500'}`} />
                              <span>{isItemReviewed ? 'Lihat/Edit Ulasan' : 'Nilai Produk (+50 Poin)'}</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Total & Logistics */}
                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-stone-600 font-semibold block">
                      {order.courierName || order.courier} {order.trackingNumber && `• Resi: ${order.trackingNumber}`}
                    </span>
                    <span className="text-[10px] text-stone-400">{order.createdAt}</span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-stone-400 block">Total Tagihan</span>
                    <span className="font-black text-amber-950 text-sm font-mono">
                      Rp {order.total.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                {/* Card Actions Bar */}
                <div className="pt-2 border-t border-stone-100 flex items-center justify-end gap-2 flex-wrap">
                  {/* Tracking Button */}
                  {(isShipped || isProcessing || isCompleted) && (
                    <button
                      onClick={() => setTrackingOrder(order)}
                      className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Truck className="w-3.5 h-3.5 text-amber-800" />
                      <span>Lacak Pengiriman</span>
                    </button>
                  )}

                  {/* Pay Now Button */}
                  {isUnpaid && (
                    <button
                      onClick={() => setPayNowOrder(order)}
                      className="px-3.5 py-1.5 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Bayar Sekarang</span>
                    </button>
                  )}

                  {/* Cancel Order Button */}
                  {(isUnpaid || isProcessing) && (
                    <button
                      onClick={() => setCancelModalOrder(order)}
                      className="px-2.5 py-1.5 border border-stone-200 hover:bg-red-50 hover:text-red-700 text-stone-600 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Batalkan
                    </button>
                  )}

                  {/* Return / Refund Button */}
                  {(isShipped || isCompleted) && (
                    <button
                      onClick={() => setReturnModalOrder(order)}
                      className="px-2.5 py-1.5 border border-stone-200 hover:bg-orange-50 hover:text-orange-950 text-stone-600 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3 text-amber-800" />
                      <span>Ajukan Retur</span>
                    </button>
                  )}

                  {/* Confirm Received */}
                  {isShipped && (
                    <button
                      onClick={() => handleConfirmReceived(order)}
                      className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Pesanan Diterima & Nilai</span>
                    </button>
                  )}

                  {/* Write Review Button on Card Bar */}
                  {isCompleted && order.items && order.items.length > 0 && (
                    <button
                      onClick={() => {
                        const itemToReview = order.items[0];
                        setReviewingTarget({
                          product: {
                            id: itemToReview.productId,
                            name: itemToReview.productName,
                            image: itemToReview.image,
                            variation: itemToReview.selectedVariation?.name
                          },
                          orderId: order.orderNumber || order.id
                        });
                      }}
                      className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                    >
                      <Star className="w-3.5 h-3.5 fill-white text-white" />
                      <span>Beri Nilai & Ulasan Foto</span>
                    </button>
                  )}

                  {/* Reorder Button */}
                  {isCompleted && (
                    <button
                      onClick={() => handleReorder(order)}
                      className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Repeat className="w-3.5 h-3.5 text-amber-800" />
                      <span>Beli Lagi</span>
                    </button>
                  )}
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* TRACKING TIMELINE MODAL */}
      {trackingOrder && (
        <OrderTrackingModal
          order={trackingOrder}
          isOpen={!!trackingOrder}
          onClose={() => setTrackingOrder(null)}
        />
      )}

      {/* RMA RETURN REQUEST MODAL */}
      {returnModalOrder && (
        <ReturnRequestModal
          order={returnModalOrder}
          isOpen={!!returnModalOrder}
          onClose={() => setReturnModalOrder(null)}
          onSuccess={() => {
            setSelectedStatusTab('Komplain/Retur');
          }}
        />
      )}

      {/* CANCELLATION MODAL */}
      {cancelModalOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl space-y-3 animate-in zoom-in-95 text-xs">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <h3 className="font-bold text-stone-900 text-sm">Konfirmasi Pembatalan</h3>
              <button onClick={() => setCancelModalOrder(null)} className="text-stone-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCancelOrderSubmit} className="space-y-3">
              <p className="text-stone-600">
                Apakah Anda yakin ingin membatalkan pesanan <strong>{cancelModalOrder.orderNumber}</strong>?
              </p>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Pilih Alasan Pembatalan:</label>
                <select
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                >
                  <option value="Ingin mengubah pesanan/alamat">Ingin mengubah varian kurma / alamat pengiriman</option>
                  <option value="Menemukan harga lebih murah">Menemukan promo lain</option>
                  <option value="Ingin ganti metode pembayaran">Ingin ganti metode pembayaran</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setCancelModalOrder(null)}
                  className="flex-1 py-2 border border-stone-200 rounded-xl text-stone-600"
                >
                  Kembali
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl"
                >
                  Batalkan Pesanan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PAY NOW MODAL */}
      {payNowOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl space-y-3 animate-in zoom-in-95 text-xs text-center">
            <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center mx-auto">
              <CreditCard className="w-6 h-6" />
            </div>

            <h3 className="font-bold text-stone-900 text-sm">Pembayaran Pesanan</h3>
            <p className="text-stone-600">
              Nomor: <strong className="font-mono">{payNowOrder.orderNumber}</strong>
            </p>
            <p className="text-base font-black text-amber-950 font-mono">
              Rp {payNowOrder.total.toLocaleString('id-ID')}
            </p>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-left text-[11px] space-y-1">
              <div className="flex justify-between">
                <span>Metode:</span>
                <strong className="text-stone-900">{payNowOrder.paymentMethod}</strong>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="text-amber-800 font-bold">Menunggu Verifikasi</span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => handleSimulatePayment(payNowOrder.id)}
                className="w-full py-2.5 bg-amber-800 hover:bg-amber-900 text-white font-bold rounded-xl shadow-xs"
              >
                Konfirmasi Pembayaran Selesai
              </button>
              <button
                onClick={() => setPayNowOrder(null)}
                className="w-full py-2 border border-stone-200 text-stone-600 rounded-xl"
              >
                Tutup
              </button>
            </div>
          </div>
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

    </div>
  );
};
