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
  ChevronRight,
  Tv,
  Play,
  Store,
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
  const [formSubtitle, setFormSubtitle] = useState(homeVideoBanner?.subtitle || '');
  const [formBadge, setFormBadge] = useState(homeVideoBanner?.badge || 'Video Resmi Toko');
  const [formCtaText, setFormCtaText] = useState(homeVideoBanner?.ctaText || 'Lihat Katalog Panen');
  const [formAutoPlay, setFormAutoPlay] = useState(homeVideoBanner?.autoPlay ?? false);
  const [formMuted, setFormMuted] = useState(homeVideoBanner?.muted ?? true);
  const [formLoop, setFormLoop] = useState(homeVideoBanner?.loop ?? true);
  const [formEnabled, setFormEnabled] = useState(homeVideoBanner?.enabled ?? true);

  const openEditModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFormVideoUrl(homeVideoBanner?.videoUrl || '');
    setFormTitle(homeVideoBanner?.title || '');
    setFormSubtitle(homeVideoBanner?.subtitle || '');
    setFormBadge(homeVideoBanner?.badge || 'Video Resmi Toko');
    setFormCtaText(homeVideoBanner?.ctaText || 'Lihat Katalog Panen');
    setFormAutoPlay(homeVideoBanner?.autoPlay ?? false);
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
      subtitle: formSubtitle.trim(),
      badge: formBadge.trim() || 'Video Resmi',
      ctaText: formCtaText.trim() || 'Lihat Katalog',
      autoPlay: formAutoPlay,
      muted: formMuted,
      loop: formLoop,
      enabled: formEnabled
    });
    setIsEditModalOpen(false);
  };

  const handleApplyPreset = (preset: typeof VIDEO_BANNER_PRESETS[0]) => {
    setFormVideoUrl(preset.url);
    setFormTitle(preset.title);
    setFormSubtitle(preset.subtitle);
    setFormBadge(preset.badge);
  };

  // If disabled, show compact pill to re-enable
  if (!homeVideoBanner?.enabled) {
    return (
      <div className="px-3 sm:px-4 py-2">
        <div className="bg-amber-50 border border-dashed border-amber-300 rounded-2xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-700 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-amber-200/70 text-amber-900 shrink-0">
              <EyeOff className="w-4 h-4" />
            </span>
            <div>
              <p className="font-bold text-stone-800">Banner Video 16:9 Sedang Dinonaktifkan</p>
              <p className="text-[11px] text-stone-500">Banner video YouTube di bawah slider tidak tampil ke pembeli.</p>
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
  const embedUrl = isYoutube 
    ? getYouTubeEmbedUrl(rawUrl, { 
        autoPlay: homeVideoBanner?.autoPlay, 
        muted: homeVideoBanner?.muted, 
        loop: homeVideoBanner?.loop 
      }) 
    : rawUrl;

  return (
    <div className="px-3 sm:px-4 py-2">
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-amber-200/90 shadow-2xs overflow-hidden transition-all duration-300 hover:border-amber-300">
        
        {/* Header Bar Banner Video */}
        <div className="px-3.5 sm:px-5 py-2.5 sm:py-3 bg-gradient-to-r from-stone-900 via-[#1E3A8A] to-[#009A44] text-white flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 min-w-0">
            <span className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-red-600/90 text-white shadow-xs shrink-0 ring-1 ring-white/20">
              <Tv className="w-4 h-4 text-white" />
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="bg-red-600 text-white text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-2xs flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  {homeVideoBanner.badge || 'Video Resmi'}
                </span>
                <span className="text-[10px] sm:text-xs text-amber-200 font-bold hidden xs:inline">
                  Landscape 16:9 HD
                </span>
              </div>
              <h4 className="text-xs sm:text-sm md:text-base font-black truncate text-white mt-0.5">
                {homeVideoBanner.title || 'Dokumenter Panen Kurma'}
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Quick Button for Settings - Always Accessible */}
            <button
              onClick={openEditModal}
              title="Kelola Video Banner 16:9 (Ganti link YouTube / MP4)"
              className="px-2.5 py-1 sm:px-3 sm:py-1.5 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-black rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs border border-amber-300"
            >
              <Settings className="w-3.5 h-3.5 text-stone-950" />
              <span>Atur Video (16:9)</span>
            </button>

            {/* CTA action button */}
            <button
              onClick={() => {
                setSelectedCategory(null);
                setCurrentView('catalog');
              }}
              className="px-3 py-1 sm:px-3.5 sm:py-1.5 bg-gradient-to-r from-stone-800 to-stone-900 hover:from-stone-700 hover:to-stone-800 text-white font-black text-xs rounded-xl transition-all shadow-xs flex items-center gap-1 cursor-pointer shrink-0 border border-white/20"
            >
              <span>{homeVideoBanner.ctaText || 'Katalog'}</span>
              <ChevronRight className="w-3.5 h-3.5 text-amber-300" />
            </button>
          </div>
        </div>

        {/* 16:9 Landscape Video Container (Dimensi Standard YouTube Widescreen) */}
        <div className="relative w-full aspect-video bg-black overflow-hidden group">
          {isYoutube ? (
            <iframe
              src={embedUrl}
              title={homeVideoBanner.title}
              className="w-full h-full border-0 absolute inset-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : isDirect ? (
            <video
              src={rawUrl}
              controls
              playsInline
              autoPlay={homeVideoBanner.autoPlay}
              muted={homeVideoBanner.muted}
              loop={homeVideoBanner.loop}
              className="w-full h-full object-cover"
            />
          ) : rawUrl ? (
            // Generic Embed iframe fallback
            <iframe
              src={rawUrl}
              title={homeVideoBanner.title}
              className="w-full h-full border-0 absolute inset-0"
              allowFullScreen
            />
          ) : (
            // Placeholder when no video is configured
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-stone-400 bg-stone-900">
              <div className="w-14 h-14 rounded-full bg-stone-800 flex items-center justify-center mb-2">
                <Video className="w-7 h-7 text-stone-400" />
              </div>
              <p className="text-sm font-bold text-stone-200">Belum Ada Video Dikonfigurasi</p>
              <p className="text-xs text-stone-500 mt-1 max-w-sm">
                Masukkan tautan video YouTube (16:9) atau tautan langsung MP4 melalui tombol &quot;Atur Video (16:9)&quot;.
              </p>
              <button
                onClick={openEditModal}
                className="mt-3 px-4 py-2 bg-[#1E3A8A] hover:bg-blue-900 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Settings className="w-3.5 h-3.5 text-amber-400" />
                <span>Atur Video Sekarang</span>
              </button>
            </div>
          )}
        </div>

        {/* Subtitle / Description Footer */}
        {homeVideoBanner.subtitle && (
          <div className="px-3.5 sm:px-5 py-2.5 bg-gradient-to-b from-amber-50/40 to-white flex items-center justify-between gap-3 text-xs text-stone-600 border-t border-amber-100">
            <p className="text-[11px] sm:text-xs text-stone-600 line-clamp-1 flex-1">
              ✨ {homeVideoBanner.subtitle}
            </p>
            <span className="text-[10px] font-mono text-stone-400 shrink-0 hidden sm:inline">
              Rasio Layar 16:9
            </span>
          </div>
        )}

        {/* Quick Settings & Help Strip */}
        <div className="px-3.5 sm:px-5 py-2 bg-stone-50 border-t border-stone-200/80 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-stone-600 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-red-500 shrink-0 animate-pulse" />
            <span>Dimensi: <strong>YouTube 16:9 Widescreen</strong></span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={openEditModal}
              className="text-stone-800 hover:text-[#1E3A8A] font-bold text-xs flex items-center gap-1.5 bg-white hover:bg-stone-100 px-3 py-1.5 rounded-xl border border-stone-300 transition-all cursor-pointer shadow-2xs"
            >
              <Settings className="w-3.5 h-3.5 text-amber-600" />
              <span>Pengaturan Banner Video</span>
            </button>
            <button
              onClick={() => setCurrentView('seller-dashboard')}
              className="text-[#1E3A8A] hover:text-blue-900 font-bold text-xs flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 px-2.5 py-1.5 rounded-xl border border-blue-200 transition-all cursor-pointer shadow-2xs"
              title="Buka Seller Center"
            >
              <Store className="w-3.5 h-3.5 text-[#009A44]" />
              <span>Seller Center</span>
            </button>
          </div>
        </div>
      </div>

      {/* MODAL: Kelola Video Banner (Khusus Seller / Toko) */}
      {isEditModalOpen && (
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

              {/* Subtitle / Keterangan */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-stone-800">
                  Keterangan / Subtitle (Opsional)
                </label>
                <input
                  type="text"
                  value={formSubtitle}
                  onChange={(e) => setFormSubtitle(e.target.value)}
                  placeholder="Contoh: Dipetik segar dari perkebunan pilihan Madinah Al-Munawwarah"
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
