/**
 * Video URL helper utilities for 16:9 Landscape Video Banner
 */

export function getYouTubeVideoId(url: string): string | null {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();

  // If already 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // Handle various YouTube URL formats
  const regExp = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|shorts\/|watch\?v=|watch\?.+&v=))([\w-]{11})/;
  const match = trimmed.match(regExp);
  return match ? match[1] : null;
}

export function isYouTubeUrl(url: string): boolean {
  return !!getYouTubeVideoId(url);
}

export function getYouTubeEmbedUrl(
  url: string, 
  options: { autoPlay?: boolean; muted?: boolean; loop?: boolean } = {}
): string {
  const id = getYouTubeVideoId(url);
  if (!id) return url;

  const { autoPlay = false, muted = true, loop = true } = options;
  const params = new URLSearchParams({
    rel: '0',
    modestbranding: '1',
    playsinline: '1',
    iv_load_policy: '3',
  });

  if (autoPlay) {
    params.set('autoplay', '1');
  }
  if (muted) {
    params.set('mute', '1');
  }
  if (loop) {
    params.set('loop', '1');
    params.set('playlist', id);
  }

  return `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`;
}

export function isDirectVideoUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  const cleanUrl = url.split('?')[0].toLowerCase();
  return cleanUrl.endsWith('.mp4') || 
         cleanUrl.endsWith('.webm') || 
         cleanUrl.endsWith('.mov') || 
         cleanUrl.endsWith('.m4v') ||
         cleanUrl.startsWith('blob:');
}

export const VIDEO_BANNER_PRESETS = [
  {
    title: 'Dokumenter Panen Kurma Ajwa Madinah 2026',
    subtitle: 'Liputan panen kurma segar dari perkebunan Madinah Al-Munawwarah',
    url: 'https://www.youtube.com/watch?v=0k2G3b_uSsc',
    badge: 'Panen Perdana',
  },
  {
    title: 'Proses Petik & Seleksi Kurma Sukari Al Qassim',
    subtitle: 'Standar mutu tinggi dan pengemasan cold storage ekspor',
    url: 'https://www.youtube.com/watch?v=0k4w9C4K9Ew',
    badge: 'Grade VIP',
  },
  {
    title: 'Keajaiban Kurma Ajwa & Khasiat Sunnah',
    subtitle: 'Manfaat nutrisi kaya antioksidan untuk kesehatan keluarga',
    url: 'https://www.youtube.com/watch?v=ysz5S6PUM-U',
    badge: 'Edukasi Khasiat',
  },
  {
    title: 'Suasana Gudang & Pengiriman Kurma Indonesia',
    subtitle: 'Pengiriman aman dengan packaging vacuum foil food grade',
    url: 'https://www.youtube.com/watch?v=LXb3EKWsInQ',
    badge: 'AllKurma Official',
  },
];
