import React, { useState } from 'react';
import { 
  Video, 
  Settings, 
  Sparkles, 
  X, 
  RotateCcw, 
  Check, 
  Eye, 
  EyeOff, 
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { 
  getYouTubeEmbedUrl, 
  isYouTubeUrl, 
  isDirectVideoUrl, 
  VIDEO_BANNER_PRESETS 
} from '../../utils/videoHelper';

interface HomeVideoBannerCardProps {
  setCurrentView: (view: string) => void;
  setSelectedCategory: (cat: string | null) => void;
}

export const HomeVideoBannerCard: React.FC<HomeVideoBannerCardProps> = ({
  setCurrentView,
  setSelectedCategory
}) => {
  const { 
    homeVideoBanner, 
    updateHomeVideoBanner, 
    resetHomeVideoBanner, 
    user 
  } = useApp();

  const isSeller = user?.role === 'seller';
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Form state for editing
  const [formVideoUrl, setFormVideoUrl] = useState(homeVideoBanner?.videoUrl || '');
  const [formTitle, setFormTitle] = useState(homeVideoBanner?.title || '');
  const [formSubtitle, setFormSubtitle] = useState('');
  const [formBadge, setFormBadge] = useState(homeVideoBanner?.badge || 'Video Resmi Toko');
  const [formCtaText, setFormCtaText] = useState(homeVideoBanner?.ctaText || 'Lihat Katalog Panen');
  const [formAutoPlay, setFormAutoPlay] = useState(homeVideoBanner?.autoPlay ?? true);
  const [formMuted, setFormMuted] = useState(homeVideoBanner?.muted ?? true);
  const [formLoop, setFormLoop] = useState(homeVideoBanner?.loop ?? true);
  const [formEnabled, setFormEnabled] = useState(homeVideoBanner?.enabled ?? true);

  const openEditModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFormVideoUrl(homeVideoBanner?.videoUrl || '');
    setFormTitle(homeVideoBanner?.title || '');
    setFormSubtitle('');
    setFormBadge(homeVideoBanner?.badge || 'Video Resmi Toko');
    setFormCtaText(homeVideoBanner?.ctaText || 'Lihat Katalog Panen');
    setFormAutoPlay(homeVideoBanner?.autoPlay ?? true);
    setFormMuted(homeVideoBanner?.muted ?? true);
    setFormLoop(homeVideoBanner?.loop ?? true);
    setFormEnabled(homeVideoBanner?.enabled ?? true);
    setIsEditModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateHomeVideoBanner({
      videoUrl: formVideoUrl.trim(),
      title: formTitle.trim() || 'Video Promosi Kurma',
      subtitle: '',
      badge: formBadge.trim() || 'Video Resmi',
      ctaText: formCtaText.trim() || 'Lihat Katalog',
      autoPlay: true,
      muted: true,
      loop: true,
      enabled: formEnabled
    });
    setIsEditModalOpen(false);
  };

  const handleApplyPreset = (preset: typeof VIDEO_BANNER_PRESETS[0]) => {
    setFormVideoUrl(preset.url);
    setFormTitle(preset.title);
    setFormSubtitle('');
    setFormBadge(preset.badge);
  };

  // If disabled and not seller, do not display to regular users/public
  if (!homeVideoBanner?.enabled && !isSeller) {
    return null;
  }

  // If disabled and is seller, show compact pill to re-enable
  if (!homeVideoBanner?.enabled && isSeller) {
    return (
      <div className="px-3 sm:px-4 py-2">
        <div className="bg-amber-50 border border-dashed border-amber-300 rounded-2xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-700 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-amber-200/70 text-amber-900 shrink-0">
              <EyeOff className="w-4 h-4" />
            </span>
            <div>
              <p className="font-bold text-stone-800">Banner Video 16:9 Sedang Dinonaktifkan (Mode Seller)</p>
              <p className="text-[11px] text-stone-500">Banner video YouTube di bawah slider tidak tampil ke pembeli umum.</p>
            </div>
          </div>
          <button
            onClick={openEditModal}
            className="px-4 py-2 bg-[#1E3A8A] hover:bg-blue-900 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors self-end sm:self-auto"
          >
            <Settings className="w-3.5 h-3.5 text-amber-400" />
            <span>Atur & Aktifkan Video</span>
          </button>
        </div>
      </div>
    );
  }

  const rawUrl = homeVideoBanner?.videoUrl || '';
  const isYoutube = isYouTubeUrl(rawUrl);
  const isDirect = isDirectVideoUrl(rawUrl);

  // If no video configured and not seller, don't show empty box
  if (!rawUrl && !isSeller) {
    return null;
  }

  // Pastikan video otomatis berputar (autoPlay) dan looping berulang-ulang tanpa harus diklik play
  const embedUrl = isYoutube 
    ? getYouTubeEmbedUrl(rawUrl, { 
        autoPlay: true, 
        muted: true, 
        loop: true 
      }) 
    : rawUrl;

  return (
    <div className="px-3 sm:px-4 py-2">
      <div className="relative w-full aspect-video rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xs border border-stone-200/80 bg-black group">
        
        {/* Transparent Shield to prevent YouTube link/title overlays & navigation */}
        <div className="absolute inset-0 z-10 bg-transparent cursor-default pointer-events-auto" />

        {/* Tombol Atur Video (16:9) - HANYA UNTUK AKUN SELLER (TIDAK UNTUK UMUM) */}
        {isSeller && (
          <div className="absolute top-3 right-3 z-20 flex items-center gap-2">
            <button
              onClick={openEditModal}
              title="Pengaturan Banner Video 16:9 (Khusus Akun Seller)"
              className="px-3 py-1.5 bg-black/75 hover:bg-black text-white text-xs font-bold rounded-xl backdrop-blur-md transition-all flex items-center gap-1.5 shadow-md border border-white/25 cursor-pointer pointer-events-auto"
            >
              <Settings className="w-3.5 h-3.5 text-amber-400" />
              <span>Atur Video (Seller)</span>
            </button>
          </div>
        )}

        {/* 16:9 Landscape Video (Clean tanpa tulisan header / footer & tanpa link YouTube) */}
        {isYoutube ? (
          <iframe
            src={embedUrl}
            title={homeVideoBanner.title || 'Video Banner'}
            className="w-full h-full border-0 absolute inset-0 pointer-events-none"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : isDirect ? (
          <video
            src={rawUrl}
            playsInline
            autoPlay
            muted
            loop
            className="w-full h-full object-cover pointer-events-none"
          />
        ) : rawUrl ? (
          <iframe
            src={rawUrl}
            title={homeVideoBanner.title || 'Video Banner'}
            className="w-full h-full border-0 absolute inset-0 pointer-events-none"
            allowFullScreen
          />
        ) : isSeller ? (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-stone-400 bg-stone-900 z-20 relative">
            <div className="w-14 h-14 rounded-full bg-stone-800 flex items-center justify-center mb-2">
              <Video className="w-7 h-7 text-stone-400" />
            </div>
            <p className="text-sm font-bold text-stone-200">Belum Ada Video Dikonfigurasi</p>
            <p className="text-xs text-stone-500 mt-1 max-w-sm">
              Tautan video YouTube (16:9) belum diatur. Masukkan URL video melalui tombol di bawah.
            </p>
            <button
              onClick={openEditModal}
              className="mt-3 px-4 py-2 bg-[#1E3A8A] hover:bg-blue-900 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs pointer-events-auto"
            >
              <Settings className="w-3.5 h-3.5 text-amber-400" />
              <span>Atur Video Sekarang</span>
            </button>
          </div>
        ) : null}
      </div>

      {/* MODAL: Kelola Video Banner (Hanya untuk Seller) */}
      {isSeller && isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div 
            className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-stone-900 via-[#1E3A8A] to-[#009A44] text-white p-4 sm:p-5 flex items-center justify-between rounded-t-3xl z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-red-600 flex items-center justify-center shadow-xs">
                  <Tv className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-black text-sm sm:text-base">Kelola Banner Video Beranda</h3>
                  <p className="text-[11px] text-amber-200">Format Landscape 16:9 (Standar YouTube)</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="p-4 sm:p-5 space-y-4">
              
              {/* Status Aktif / Tampilkan */}
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold text-stone-800 block">Tampilkan Banner Video</label>
                  <p className="text-[11px] text-stone-500">Tampilkan di halaman utama tepat di bawah banner sliding</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormEnabled(!formEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                    formEnabled ? 'bg-[#009A44]' : 'bg-stone-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* URL Video */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-800">
                  Tautan / URL Video YouTube atau Direct MP4 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formVideoUrl}
                  onChange={(e) => setFormVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=... atau https://youtu.be/..."
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] bg-stone-50/50"
                  required
                />
                <p className="text-[11px] text-stone-500">
                  Mendukung tautan standar YouTube, YouTube Shorts, YouTube Embed, atau link video langsung (.mp4/.webm).
                </p>
              </div>

              {/* Preset Video Rekomendasi */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-stone-700">
                  💡 Pilihan Cepat Video Kurma Berkualitas (1-Klik Terapkan):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {VIDEO_BANNER_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleApplyPreset(preset)}
                      className="p-2.5 text-left rounded-xl border border-stone-200 hover:border-[#009A44] hover:bg-emerald-50/40 transition-all text-xs cursor-pointer group"
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold text-stone-800 group-hover:text-[#009A44] line-clamp-1">
                          {preset.title}
                        </span>
                        <span className="text-[9px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded-sm shrink-0">
                          {preset.badge}
                        </span>
                      </div>
                      <p className="text-[10px] text-stone-500 line-clamp-1 mt-0.5">
                        {preset.subtitle}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Judul Banner */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-stone-800">
                  Judul Video Banner
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Contoh: Dokumenter Panen Raya Kurma Ajwa 2026"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                />
              </div>

              {/* Badge & Tombol CTA */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-stone-800">
                    Label Lencana (Badge)
                  </label>
                  <input
                    type="text"
                    value={formBadge}
                    onChange={(e) => setFormBadge(e.target.value)}
                    placeholder="Video Resmi / Panen Perdana"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-stone-800">
                    Teks Tombol CTA
                  </label>
                  <input
                    type="text"
                    value={formCtaText}
                    onChange={(e) => setFormCtaText(e.target.value)}
                    placeholder="Lihat Produk / Beli Sekarang"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                  />
                </div>
              </div>

              {/* Toggle Opsi Playback */}
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-2.5">
                <span className="text-xs font-bold text-stone-800 block">Opsi Pemutaran (Playback):</span>
                
                <div className="flex items-center justify-between text-xs text-stone-700">
                  <span>Mute Audio (Dianjurkan untuk kenyamanan pengunjung)</span>
                  <input
                    type="checkbox"
                    checked={formMuted}
                    onChange={(e) => setFormMuted(e.target.checked)}
                    className="w-4 h-4 text-[#1E3A8A] rounded-sm focus:ring-[#1E3A8A]"
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-stone-700">
                  <span>Putar Ulang Otomatis (Looping)</span>
                  <input
                    type="checkbox"
                    checked={formLoop}
                    onChange={(e) => setFormLoop(e.target.checked)}
                    className="w-4 h-4 text-[#1E3A8A] rounded-sm focus:ring-[#1E3A8A]"
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-stone-700">
                  <span>Mulai Otomatis (Autoplay - memerlukan Mute di sebagian browser)</span>
                  <input
                    type="checkbox"
                    checked={formAutoPlay}
                    onChange={(e) => setFormAutoPlay(e.target.checked)}
                    className="w-4 h-4 text-[#1E3A8A] rounded-sm focus:ring-[#1E3A8A]"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => {
                    resetHomeVideoBanner();
                    setIsEditModalOpen(false);
                  }}
                  className="px-3 py-2 text-stone-600 hover:text-stone-900 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Default</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 border border-stone-300 text-stone-700 hover:bg-stone-100 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#009A44] hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Simpan Perubahan</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
