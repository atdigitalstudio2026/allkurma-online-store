import React, { useState, useEffect } from 'react';
import { 
  Tv, 
  Sparkles, 
  Check, 
  RotateCcw, 
  Eye, 
  ExternalLink, 
  Play, 
  Video, 
  Info,
  Layers,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { 
  VIDEO_BANNER_PRESETS, 
  getYouTubeEmbedUrl, 
  isYouTubeUrl, 
  isDirectVideoUrl 
} from '../../utils/videoHelper';

interface SellerVideoBannerTabProps {
  setCurrentView: (view: string) => void;
}

export const SellerVideoBannerTab: React.FC<SellerVideoBannerTabProps> = ({ setCurrentView }) => {
  const { 
    homeVideoBanner, 
    updateHomeVideoBanner, 
    resetHomeVideoBanner, 
    showToast 
  } = useApp();

  const [formVideoUrl, setFormVideoUrl] = useState(homeVideoBanner?.videoUrl || '');
  const [formTitle, setFormTitle] = useState(homeVideoBanner?.title || '');
  const [formSubtitle, setFormSubtitle] = useState('');
  const [formBadge, setFormBadge] = useState(homeVideoBanner?.badge || 'Video Resmi Toko');
  const [formCtaText, setFormCtaText] = useState(homeVideoBanner?.ctaText || 'Lihat Katalog Panen');
  const [formAutoPlay, setFormAutoPlay] = useState(homeVideoBanner?.autoPlay ?? true);
  const [formMuted, setFormMuted] = useState(homeVideoBanner?.muted ?? false);
  const [formLoop, setFormLoop] = useState(homeVideoBanner?.loop ?? true);
  const [formEnabled, setFormEnabled] = useState(homeVideoBanner?.enabled ?? true);

  // Synchronize when homeVideoBanner changes
  useEffect(() => {
    if (homeVideoBanner) {
      setFormVideoUrl(homeVideoBanner.videoUrl || '');
      setFormTitle(homeVideoBanner.title || '');
      setFormSubtitle('');
      setFormBadge(homeVideoBanner.badge || 'Video Resmi Toko');
      setFormCtaText(homeVideoBanner.ctaText || 'Lihat Katalog Panen');
      setFormAutoPlay(homeVideoBanner.autoPlay ?? true);
      setFormMuted(homeVideoBanner.muted ?? false);
      setFormLoop(homeVideoBanner.loop ?? true);
      setFormEnabled(homeVideoBanner.enabled ?? true);
    }
  }, [homeVideoBanner]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateHomeVideoBanner({
      videoUrl: formVideoUrl.trim(),
      title: formTitle.trim() || 'Video Promosi Kurma',
      subtitle: '',
      badge: formBadge.trim() || 'Video Resmi',
      ctaText: formCtaText.trim() || 'Lihat Katalog',
      autoPlay: true,
      muted: formMuted,
      loop: true,
      enabled: formEnabled
    });
    showToast('Banner video 16:9 berhasil disimpan!', 'success');
  };

  const handleApplyPreset = (preset: typeof VIDEO_BANNER_PRESETS[0]) => {
    setFormVideoUrl(preset.url);
    setFormTitle(preset.title);
    setFormSubtitle('');
    setFormBadge(preset.badge);
    showToast(`Template "${preset.title}" diterapkan ke form!`, 'info');
  };

  const isYoutube = isYouTubeUrl(formVideoUrl);
  const isDirect = isDirectVideoUrl(formVideoUrl);
  const embedUrl = isYoutube 
    ? getYouTubeEmbedUrl(formVideoUrl, { 
        autoPlay: true, 
        muted: formMuted, 
        loop: true 
      }) 
    : formVideoUrl;

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Tv className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-black text-stone-900">
                  Banner Video Beranda (Landscape 16:9)
                </h3>
                <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-red-200">
                  Dimensi Standar YouTube 16:9
                </span>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                  formEnabled ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-stone-200 text-stone-600 border-stone-300'
                }`}>
                  {formEnabled ? '● Aktif di Beranda' : '○ Nonaktif'}
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-1 max-w-2xl">
                Banner video ini tampil tepat di bawah banner sliding beranda. Anda dapat memasukkan tautan YouTube resmi perkebunan/toko kurma, liputan panen, atau video dokumenter untuk meningkatkan kepercayaan pembeli.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Kembalikan banner video ke video awal bawaan?')) {
                  resetHomeVideoBanner();
                }
              }}
              className="flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 px-3.5 py-2.5 rounded-xl border border-stone-300 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Default</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentView('home')}
              className="flex items-center gap-1.5 text-xs font-bold text-stone-700 hover:text-stone-900 bg-white hover:bg-stone-50 px-3.5 py-2.5 rounded-xl border border-stone-300 shadow-2xs transition-colors cursor-pointer"
            >
              <Eye className="w-4 h-4 text-blue-600" />
              <span>Lihat di Beranda</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Form Konfigurasi (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleSave} className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs space-y-5">
            <h4 className="font-bold text-sm text-stone-900 pb-3 border-b border-stone-100 flex items-center justify-between">
              <span>Pengaturan Konten Video 16:9</span>
              <span className="text-[11px] font-mono text-stone-400">Rasio Widescreen 16:9</span>
            </h4>

            {/* Switch Aktif */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-stone-800 block">Status Banner Video</span>
                <p className="text-[11px] text-stone-500">Tampilkan banner video di beranda tepat di bawah sliding carousel</p>
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

            {/* Input Video URL */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-stone-800">
                  Tautan / URL Video YouTube atau Direct MP4 <span className="text-red-500">*</span>
                </label>
                {isYoutube && (
                  <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                    YouTube URL Terdeteksi
                  </span>
                )}
                {isDirect && (
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                    Video Direct MP4 Terdeteksi
                  </span>
                )}
              </div>
              <input
                type="text"
                value={formVideoUrl}
                onChange={(e) => setFormVideoUrl(e.target.value)}
                placeholder="Contoh: https://www.youtube.com/watch?v=0k2G3b_uSsc atau https://youtu.be/..."
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] bg-stone-50/50"
                required
              />
              <p className="text-[11px] text-stone-500">
                Format yang didukung: YouTube Standar (`watch?v=...`), YouTube Singkat (`youtu.be/...`), YouTube Shorts (`shorts/...`), atau URL langsung file video (.mp4/.webm).
              </p>
            </div>

            {/* Preset Video Rekomendasi 1-Klik */}
            <div className="space-y-2 pt-1">
              <label className="text-xs font-bold text-stone-800 block">
                💡 Template Video Rekomendasi (Klik untuk langsung pasang):
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {VIDEO_BANNER_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className="p-3 text-left rounded-xl border border-stone-200 hover:border-[#009A44] hover:bg-emerald-50/40 transition-all text-xs cursor-pointer group"
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="font-bold text-stone-800 group-hover:text-[#009A44] line-clamp-1">
                        {preset.title}
                      </span>
                      <span className="text-[9px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded-sm shrink-0">
                        {preset.badge}
                      </span>
                    </div>
                    <p className="text-[10px] text-stone-500 line-clamp-2">
                      {preset.subtitle}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Judul Banner */}
            <div className="space-y-3 pt-2">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-stone-800">
                  Judul Video Banner
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Contoh: Dokumenter Eksklusif: Panen Raya Kurma Ajwa & Sukari 2026"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                />
              </div>
            </div>

            {/* Badge & Teks Tombol CTA */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-stone-800">
                  Label Lencana (Badge Header)
                </label>
                <input
                  type="text"
                  value={formBadge}
                  onChange={(e) => setFormBadge(e.target.value)}
                  placeholder="Video Resmi Toko / Panen Perdana"
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
                  placeholder="Lihat Katalog Panen / Beli Sekarang"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                />
              </div>
            </div>

            {/* Playback Toggles */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2.5">
              <span className="text-xs font-bold text-stone-800 block">Opsi Pemutaran (Playback):</span>
              
              <label className="flex items-center justify-between text-xs text-stone-700 cursor-pointer">
                <span>Musik / Audio Video Selalu Aktif (ON)</span>
                <input
                  type="checkbox"
                  checked={!formMuted}
                  onChange={(e) => setFormMuted(!e.target.checked)}
                  className="w-4 h-4 text-[#1E3A8A] rounded-sm focus:ring-[#1E3A8A]"
                />
              </label>

              <label className="flex items-center justify-between text-xs text-stone-700 cursor-pointer">
                <span>Putar Ulang Otomatis (Looping berulang)</span>
                <input
                  type="checkbox"
                  checked={formLoop}
                  onChange={(e) => setFormLoop(e.target.checked)}
                  className="w-4 h-4 text-[#1E3A8A] rounded-sm focus:ring-[#1E3A8A]"
                />
              </label>

              <label className="flex items-center justify-between text-xs text-stone-700 cursor-pointer">
                <span>Autoplay Otomatis (Memerlukan Mute pada mayoritas browser)</span>
                <input
                  type="checkbox"
                  checked={formAutoPlay}
                  onChange={(e) => setFormAutoPlay(e.target.checked)}
                  className="w-4 h-4 text-[#1E3A8A] rounded-sm focus:ring-[#1E3A8A]"
                />
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-3 flex items-center justify-end gap-3 border-t border-stone-100">
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#009A44] hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Simpan Perubahan Banner Video</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Live 16:9 Simulator Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-stone-900 text-white rounded-2xl p-5 shadow-md border border-stone-800 sticky top-24">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-black text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Pratinjau Langsung (Rasio 16:9)
              </h4>
              <span className="text-[10px] bg-stone-800 text-stone-300 px-2 py-0.5 rounded-full border border-stone-700">
                16:9 Widescreen
              </span>
            </div>

            <p className="text-xs text-stone-400 mb-4">
              Tampilan banner video beranda secara nyata:
            </p>

            {/* 16:9 Container Simulator Card */}
            <div className="bg-white text-stone-900 rounded-2xl border border-amber-300 shadow-lg overflow-hidden">
              
              {/* Header Card */}
              <div className="px-3 py-2 bg-gradient-to-r from-stone-900 via-[#1E3A8A] to-[#009A44] text-white flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-6 h-6 rounded-lg bg-red-600 text-white flex items-center justify-center shrink-0">
                    <Tv className="w-3.5 h-3.5 text-white" />
                  </span>
                  <div className="min-w-0">
                    <span className="bg-red-600 text-white text-[8px] font-black px-1.5 py-0.2 rounded-full uppercase tracking-wider">
                      {formBadge || 'Video Resmi'}
                    </span>
                    <h5 className="text-[11px] font-black truncate text-white">
                      {formTitle || 'Dokumenter Panen Kurma'}
                    </h5>
                  </div>
                </div>

                <span className="px-2.5 py-1 bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 font-black text-[10px] rounded-lg shrink-0 flex items-center gap-0.5">
                  <span>{formCtaText || 'Katalog'}</span>
                  <ChevronRight className="w-3 h-3" />
                </span>
              </div>

              {/* 16:9 Landscape Video Element */}
              <div className="relative w-full aspect-video bg-black overflow-hidden">
                {isYoutube ? (
                  <iframe
                    src={embedUrl}
                    title={formTitle}
                    className="w-full h-full border-0 absolute inset-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : isDirect ? (
                  <video
                    src={formVideoUrl}
                    controls
                    playsInline
                    autoPlay={formAutoPlay}
                    muted={formMuted}
                    loop={formLoop}
                    className="w-full h-full object-cover"
                  />
                ) : formVideoUrl ? (
                  <iframe
                    src={formVideoUrl}
                    title={formTitle}
                    className="w-full h-full border-0 absolute inset-0"
                    allowFullScreen
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center text-stone-400 bg-stone-950">
                    <Video className="w-8 h-8 text-stone-600 mb-1" />
                    <p className="text-xs font-bold text-stone-300">Belum Ada URL Video</p>
                    <p className="text-[10px] text-stone-500 mt-0.5">Masukkan tautan YouTube di formulir sebelah kiri</p>
                  </div>
                )}
              </div>
            </div>

            {/* Helper Tips */}
            <div className="mt-4 p-3 bg-stone-800/80 rounded-xl border border-stone-700/80 text-[11px] text-stone-300 space-y-1.5">
              <div className="font-bold text-amber-300 flex items-center gap-1">
                <Info className="w-3.5 h-3.5" />
                <span>Tips Dimensi 16:9:</span>
              </div>
              <p className="text-stone-400 text-[10px] leading-relaxed">
                Rasio 16:9 adalah dimensi standar video YouTube widescreen (1920×1080 atau 1280×720). Video akan tampil utuh dan proporsional tanpa ada pemotongan atau bilah hitam ganjil di seluruh perangkat pengunjung.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
