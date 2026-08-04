export const API_BASE_URL = 'https://api-cmsmalut-dev.intermatika.id';
// export const API_BASE_URL = 'http://localhost:3000';

export function buildApiUrl(path: string): string {
  return `${API_BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
}

export function buildUploadUrl(value?: string | null, defaultFolder = 'berita'): string | null {
  if (!value) return null;

  const rawValue = String(value).trim();
  const uploadIndex = rawValue.indexOf('/uploads/');

  if (uploadIndex >= 0) {
    return buildApiUrl(rawValue.slice(uploadIndex));
  }

  if (rawValue.startsWith('uploads/')) {
    return buildApiUrl(rawValue);
  }

  if (rawValue.startsWith('/uploads/')) {
    return buildApiUrl(rawValue);
  }

  return buildApiUrl(`/uploads/${defaultFolder}/${rawValue.split('/').pop()}`);
}
