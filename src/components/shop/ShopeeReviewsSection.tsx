import React, { useState } from 'react';
import { 
  Star, 
  ThumbsUp, 
  Image as ImageIcon, 
  Sparkles, 
  CheckCircle, 
  MessageSquarePlus, 
  X, 
  Send,
  Filter
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CustomerReview, Product } from '../../types';
import { WriteReviewModal } from './WriteReviewModal';

interface ShopeeReviewsSectionProps {
  product: Product;
}

export const ShopeeReviewsSection: React.FC<ShopeeReviewsSectionProps> = ({ product }) => {
  const { 
    reviews, 
    markReviewHelpful, 
    user,
    showToast 
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'with_photos' | '5' | '4' | '3'>('all');
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [selectedPhotoZoom, setSelectedPhotoZoom] = useState<string | null>(null);

  const productReviews = reviews.filter(r => r.productId === product.id || r.productId === 'prod-01');

  const filteredReviews = productReviews.filter(r => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'with_photos') return r.photos && r.photos.length > 0;
    if (activeFilter === '5') return r.rating === 5;
    if (activeFilter === '4') return r.rating === 4;
    if (activeFilter === '3') return r.rating <= 3;
    return true;
  });

  return (
    <div className="bg-white p-4 border-y border-stone-200 space-y-4">
      
      {/* 1. Header & Rating Summary Score */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-sm text-stone-900 font-['Playfair_Display',serif]">
            Penilaian Produk
          </h3>
          <div className="flex items-center gap-1.5 mt-1 text-xs">
            <div className="flex text-amber-500">
              {[1, 2, 3, 4, 5].map(s => (
                <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="font-bold text-stone-900">{product.rating}</span>
            <span className="text-stone-400">dari 5 ({productReviews.length} Ulasan)</span>
          </div>
        </div>

        <button
          onClick={() => setIsWriteModalOpen(true)}
          className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
        >
          <MessageSquarePlus className="w-3.5 h-3.5" />
          <span>Tulis Ulasan (+25 Poin)</span>
        </button>
      </div>

      {/* 2. Review Filter Pills (Shopee Style) */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3 py-1 rounded-full whitespace-nowrap font-medium transition-all ${
            activeFilter === 'all'
              ? 'bg-amber-800 text-white font-bold'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          Semua ({productReviews.length})
        </button>
        <button
          onClick={() => setActiveFilter('with_photos')}
          className={`px-3 py-1 rounded-full whitespace-nowrap font-medium transition-all ${
            activeFilter === 'with_photos'
              ? 'bg-amber-800 text-white font-bold'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          Dengan Foto/Video ({productReviews.filter(r => r.photos && r.photos.length > 0).length})
        </button>
        <button
          onClick={() => setActiveFilter('5')}
          className={`px-3 py-1 rounded-full whitespace-nowrap font-medium transition-all ${
            activeFilter === '5'
              ? 'bg-amber-800 text-white font-bold'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          5 Bintang ({productReviews.filter(r => r.rating === 5).length})
        </button>
        <button
          onClick={() => setActiveFilter('4')}
          className={`px-3 py-1 rounded-full whitespace-nowrap font-medium transition-all ${
            activeFilter === '4'
              ? 'bg-amber-800 text-white font-bold'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          4 Bintang ({productReviews.filter(r => r.rating === 4).length})
        </button>
      </div>

      {/* 3. Review Cards List */}
      <div className="divide-y divide-stone-100 space-y-3">
        {filteredReviews.map((rev) => (
          <div key={rev.id} className="pt-3 space-y-2 text-xs">
            
            {/* User info & star rating */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img 
                  src={rev.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'} 
                  alt={rev.userName} 
                  className="w-8 h-8 rounded-full object-cover border border-stone-200" 
                />
                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-stone-900">{rev.userName}</span>
                    {rev.isVerifiedPurchase && (
                      <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
                        <CheckCircle className="w-3 h-3 inline" /> Terverifikasi
                      </span>
                    )}
                  </div>
                  <div className="flex text-amber-500">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
              </div>

              <span className="text-[10px] text-stone-400">{rev.createdAt}</span>
            </div>

            {/* Variation pill tag */}
            {rev.variationPurchased && (
              <div className="text-[11px] text-stone-500 bg-stone-50 px-2 py-0.5 rounded-md inline-block">
                Variasi: <span className="font-semibold text-stone-700">{rev.variationPurchased}</span>
              </div>
            )}

            {/* Comment Text */}
            <p className="text-stone-700 leading-relaxed">
              {rev.comment}
            </p>

            {/* Review Photos Grid */}
            {rev.photos && rev.photos.length > 0 && (
              <div className="flex gap-2 pt-1 overflow-x-auto">
                {rev.photos.map((photo, i) => (
                  <img
                    key={i}
                    src={photo}
                    alt="Customer photo review"
                    onClick={() => setSelectedPhotoZoom(photo)}
                    className="w-16 h-16 rounded-xl object-cover border border-stone-200 cursor-pointer hover:opacity-90 transition-opacity"
                  />
                ))}
              </div>
            )}

            {/* Seller Response if any */}
            {rev.sellerResponse && (
              <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200 text-[11px] text-stone-600 space-y-1">
                <span className="font-bold text-amber-900 block">Respon Penjual:</span>
                <p>{rev.sellerResponse}</p>
              </div>
            )}

            {/* Helpful vote button */}
            <div className="flex items-center justify-end pt-1">
              <button
                onClick={() => markReviewHelpful(rev.id)}
                className="flex items-center gap-1 text-[11px] text-stone-500 hover:text-amber-800 transition-colors p-1"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>Membantu ({rev.helpfulCount})</span>
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* 4. Write Review Modal */}
      {isWriteModalOpen && (
        <WriteReviewModal
          isOpen={isWriteModalOpen}
          onClose={() => setIsWriteModalOpen(false)}
          product={{
            id: product.id,
            name: product.name,
            image: product.images?.[0],
            variation: product.variations?.[0]?.name
          }}
          onReviewSubmitted={() => {
            setIsWriteModalOpen(false);
          }}
        />
      )}

      {/* Photo Zoom Lightbox Modal */}
      {selectedPhotoZoom && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedPhotoZoom(null)}
        >
          <div className="relative max-w-md w-full">
            <img 
              src={selectedPhotoZoom} 
              alt="Zoomed Review" 
              className="w-full h-auto max-h-[80vh] rounded-2xl object-contain shadow-2xl" 
            />
            <button 
              onClick={() => setSelectedPhotoZoom(null)}
              className="absolute top-3 right-3 p-2 bg-black/60 rounded-full text-white hover:bg-black"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
