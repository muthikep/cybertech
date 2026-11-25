// The native app has no "same origin" to resolve relative fetches against,
// so every API call needs an absolute URL. Set EXPO_PUBLIC_API_BASE_URL to
// wherever the server (src/app/api) is deployed - never a localhost address.
const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export function apiUrl(path: string): string {
  if (!BASE_URL) {
    throw new Error('EXPO_PUBLIC_API_BASE_URL is not set');
  }
  return `${BASE_URL}${path}`;
}
