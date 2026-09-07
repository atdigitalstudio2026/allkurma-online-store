/**
 * Utility helper to normalize image URLs from cloud storage providers
 * such as Dropbox and Google Drive into direct raw image URLs usable in <img> tags.
 */

export function normalizeImageUrl(rawUrl: string): string {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  const trimmed = rawUrl.trim();

  // 1. Handle Dropbox URLs
  // Standard Dropbox share links: https://www.dropbox.com/scl/fi/.../image.jpeg?rlkey=...&st=...&dl=0
  // To serve directly as an image in <img src="...">, change dl=0 to raw=1
  if (trimmed.includes('dropbox.com')) {
    let normalized = trimmed;

    // Replace dl=0 or dl=1 with raw=1
    if (normalized.includes('dl=0')) {
      normalized = normalized.replace('dl=0', 'raw=1');
    } else if (normalized.includes('dl=1')) {
      normalized = normalized.replace('dl=1', 'raw=1');
    } else if (!normalized.includes('raw=1')) {
      normalized += (normalized.includes('?') ? '&' : '?') + 'raw=1';
    }

    return normalized;
  }

  // 2. Handle Google Drive URLs
  // e.g. https://drive.google.com/file/d/FILE_ID/view?usp=sharing
  const gDriveMatch = trimmed.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (gDriveMatch && gDriveMatch[1]) {
    return `https://drive.google.com/uc?export=view&id=${gDriveMatch[1]}`;
  }

  return trimmed;
}

export function isDropboxUrl(url: string): boolean {
  return typeof url === 'string' && url.includes('dropbox.com');
}
