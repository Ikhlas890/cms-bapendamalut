export const API_BASE_URL = 'http://192.168.100.6:3000';

export function buildApiUrl(path: string): string {
  return `${API_BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
}
