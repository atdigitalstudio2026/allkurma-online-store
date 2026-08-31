import React, { useState, useRef } from 'react';
import { 
  Star, 
  Upload, 
  Image as ImageIcon, 
  X, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  Camera, 
  Plus, 
  Smile, 
  ShieldCheck,
  Tag
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Product, CustomerReview } from '../../types';

interface WriteReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    name: string;
    image?: string;
    variation?: string;
  };
  orderId?: string;
  onReviewSubmitted?: () => void;
}

const SAMPLE_PHOTO_PRESETS = [
  {
    label: 'Kurma Segar',
    url: 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=600&auto=format&fit=crop&q=80'
  },
  {
    label: 'Kemasan Box',
    url: 'https://images.unsplash.com/photo-1546548970-71785318a17b?w=600&auto=format&fit=crop&q=80'
  },
  {
    label: 'Unboxing Paket',
    url: 'https://images.unsplash.com/photo-1577705998148-6da4f3963bc8?w=600&auto=format&fit=crop&q=80'
  }
];

const REVIEW_QUICK_TAGS = [
  'Kurma Segar & Lembut',
  'Kemasan Sangat Rapi & Aman',
  'Rasa Manis Alami Pas',
  'Pengiriman Cepat Siap Santap',
  'Seller Ramah & Responsif',
  'Sesuai Deskripsi Produk'
];

export const WriteReviewModal: React.FC<WriteReviewModalProps> = ({
  isOpen,
  onClose,
  product,
  orderId,
  onReviewSubmitted
}) => {
  const { addReview, user, showToast } = useApp();

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Kurma Segar & Lembut', 'Kemasan Sangat Rapi & Aman']);
  const [photos, setPhotos] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleRatingHover = (val: number) => setHoverRating(val);
  const handleRatingLeave = () => setHoverRating(0);
  const handleRatingClick = (val: number) => setRating(val);

  const getRatingFeedback = (val: number) => {
    switch (val) {
      case 5:
        return { text: 'Sangat Puas! ⭐⭐⭐⭐⭐', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
      case 4:
        return { text: 'Puas / Rekomendasi 👍', color: 'text-blue-700 bg-blue-50 border-blue-200' };
      case 3:
        return { text: 'Cukup Baik 👌', color: 'text-amber-700 bg-amber-50 border-amber-200' };
      case 2:
        return { text: 'Kurang Memuaskan 🙁', color: 'text-orange-700 bg-orange-50 border-orange-200' };
      case 1:
        return { text: 'Sangat Kecewa 😞', color: 'text-red-700 bg-red-50 border-red-200' };
      default:
        return { text: 'Pilih Bintang Penilaian', color: 'text-stone-600 bg-stone-50 border-stone-200' };
    }
  };

  const currentDisplayRating = hoverRating || rating;
  const ratingFeedback = getRatingFeedback(currentDisplayRating);

  const handleToggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(prev => prev.filter(t => t !== tag));
    } else {
      setSelectedTags(prev => [...prev, tag]);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (photos.length + files.length > 5) {
      showToast('Maksimal upload 5 foto per ulasan', 'error');
      return;
    }

    Array.from(files).forEach((file: File) => {
      if (!file.type.startsWith('image/')) {
        showToast('Hanya file foto/gambar yang diperbolehkan!', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        if (result) {
          setPhotos(prev => [...prev, result]);
        }
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddPresetPhoto = (url: string) => {
    if (photos.length >= 5) {
      showToast('Maksimal 5 foto produk', 'error');
      return;
    }
    if (photos.includes(url)) {
      showToast('Foto ini sudah ditambahkan', 'info');
      return;
    }
    setPhotos(prev => [...prev, url]);
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      showToast('Harap tuliskan ulasan pengalaman Anda menerima barang!', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const combinedComment = selectedTags.length > 0
        ? `${comment.trim()}\n\n[Poin Kepuasan: ${selectedTags.join(', ')}]`
        : comment.trim();

      addReview({
        productId: product.id,
        orderId: orderId,
        userName: user?.name || 'Pelanggan Terverifikasi',
        userAvatar: user?.avatar,
        avatar: user?.avatar,
        rating,
        comment: combinedComment,
        photos: photos.length > 0 ? photos : undefined,
        variationName: product.variation || 'Kemasan Standar',
        variationPurchased: product.variation || 'Kemasan Standar',
        isVerifiedBuyer: true,
        isVerifiedPurchase: true,
        tags: selectedTags
      });

      if (onReviewSubmitted) {
        onReviewSubmitted();
      }

      onClose();
    } catch (err) {
      showToast('Terjadi kesalahan saat mengirim ulasan', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl space-y-5 my-auto border border-stone-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
              <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-base font-['Playfair_Display',serif]">
                Beri Penilaian & Ulasan Produk
              </h3>
              <p className="text-xs text-stone-500">
                Ulasan Anda membantu pembeli lain dan meningkatkan kualitas toko.
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Product Target Info */}
        <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-stone-50 border border-stone-200">
          <img 
            src={product.image || 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=200&auto=format&fit=crop&q=80'} 
            alt={product.name} 
            className="w-12 h-12 rounded-xl object-cover border border-stone-200 shrink-0 bg-white"
          />
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-xs text-stone-900 truncate">
              {product.name}
            </h4>
            <div className="flex items-center gap-2 mt-0.5 text-[11px] text-stone-500">
              <span className="bg-stone-200/80 px-2 py-0.5 rounded-md font-medium text-stone-700">
                {product.variation || 'Varian Reguler'}
              </span>
              {orderId && (
                <span className="font-mono text-[10px] text-stone-400">
                  Pesanan #{orderId}
                </span>
              )}
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-200">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              Paket Diterima
            </span>
          </div>
        </div>

        {/* Reward Bonus Callout */}
        <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-400/10 to-amber-600/10 border border-amber-300/80 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="text-stone-800 font-medium">
              Dapatkan <strong className="text-amber-900 font-bold">+25 Poin Kurma</strong> & tambahan <strong className="text-amber-900 font-bold">+25 Poin</strong> dengan menyertakan foto!
            </span>
          </div>
          <span className="px-2 py-0.5 bg-amber-500 text-white font-extrabold text-[10px] rounded-full shrink-0">
            +50 Poin Total
          </span>
        </div>

        {/* Review Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* 1. Star Rating Selection */}
          <div className="space-y-2 text-center py-2 bg-stone-50/60 rounded-2xl border border-stone-100">
            <label className="font-bold text-stone-700 text-xs block">
              Bagaimana kualitas produk dan kepuasan Anda?
            </label>
            
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((starVal) => {
                const isActive = starVal <= (hoverRating || rating);
                return (
                  <button
                    key={starVal}
                    type="button"
                    onMouseEnter={() => handleRatingHover(starVal)}
                    onMouseLeave={handleRatingLeave}
                    onClick={() => handleRatingClick(starVal)}
                    className="p-1 hover:scale-125 transition-transform cursor-pointer"
                  >
                    <Star 
                      className={`w-8 h-8 transition-colors ${
                        isActive 
                          ? 'fill-amber-400 text-amber-400 drop-shadow-xs' 
                          : 'text-stone-300'
                      }`} 
                    />
                  </button>
                );
              })}
            </div>

            <div className="inline-block px-3 py-1 rounded-full text-xs font-bold border transition-all">
              <span className={`px-2.5 py-0.5 rounded-full ${ratingFeedback.color}`}>
                {ratingFeedback.text}
              </span>
            </div>
          </div>

          {/* 2. Quick Tags */}
          <div className="space-y-1.5">
            <label className="font-bold text-stone-700 flex items-center gap-1.5 text-xs">
              <Tag className="w-3.5 h-3.5 text-amber-800" />
              <span>Pilih Topik Penilaian (Opsional):</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {REVIEW_QUICK_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleToggleTag(tag)}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-medium transition-all cursor-pointer border ${
                      isSelected 
                        ? 'bg-amber-800 text-white border-amber-800 shadow-2xs' 
                        : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '} {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Review Comment Textarea */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="font-bold text-stone-700 block text-xs">
                Tulis Ulasan / Testimoni Anda <span className="text-red-500">*</span>
              </label>
              <span className="text-[10px] text-stone-400 font-mono">
                {comment.length}/500 Karakter
              </span>
            </div>
            <textarea
              rows={3}
              required
              maxLength={500}
              placeholder="Ceritakan kepuasan Anda mengenai keaslian kurma, rasa manis alami, tekstur lembut, kemasan bubble wrap, serta kecepatan kurir pengiriman..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-3 bg-stone-50 border border-stone-200 rounded-2xl text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-amber-800/30 focus:border-amber-800 bg-white"
            />
          </div>

          {/* 4. Photo Upload Area (File Input & Gallery) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-stone-700 flex items-center gap-1.5 text-xs">
                <Camera className="w-3.5 h-3.5 text-amber-800" />
                <span>Upload Foto Produk ({photos.length}/5):</span>
              </label>
              <span className="text-[10px] text-amber-800 font-semibold">
                +25 Poin Ekstra Foto
              </span>
            </div>

            {/* Hidden File Input */}
            <input 
              type="file"
              ref={fileInputRef}
              accept="image/*"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />

            <div className="flex items-center gap-2 flex-wrap">
              {/* Upload Trigger Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-16 h-16 rounded-2xl border-2 border-dashed border-amber-300 hover:border-amber-600 bg-amber-50/50 hover:bg-amber-50 flex flex-col items-center justify-center text-amber-900 transition-all cursor-pointer group shrink-0"
              >
                <Upload className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform text-amber-800" />
                <span className="text-[9px] font-bold mt-1 text-amber-900">+ Foto</span>
              </button>

              {/* Uploaded Photos Thumbnails */}
              {photos.map((photoUrl, idx) => (
                <div key={idx} className="relative w-16 h-16 rounded-2xl overflow-hidden border border-amber-300 shadow-2xs group shrink-0">
                  <img 
                    src={photoUrl} 
                    alt={`Preview ${idx + 1}`} 
                    className="w-full h-full object-cover" 
                  />
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(idx)}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 hover:bg-red-600 text-white flex items-center justify-center transition-colors cursor-pointer"
                    title="Hapus foto"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            {/* Quick Presets for Convenient Testing */}
            <div className="pt-1 flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-[10px] text-stone-400 shrink-0">Pilihan Cepat:</span>
              {SAMPLE_PHOTO_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleAddPresetPhoto(preset.url)}
                  className="px-2 py-0.5 bg-stone-100 hover:bg-amber-100 hover:text-amber-900 text-stone-600 rounded-lg text-[10px] font-semibold transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1"
                >
                  <Plus className="w-2.5 h-2.5" />
                  <span>{preset.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2.5 pt-3 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-stone-200 rounded-2xl text-stone-600 font-bold text-xs hover:bg-stone-100 transition-colors cursor-pointer"
            >
              Nanti Saja
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Mengirim...' : 'Kirim Penilaian'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
