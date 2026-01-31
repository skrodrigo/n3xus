import { getApiBaseUrl, proxyJson, requireAuthToken } from '@/server/bff';

export async function GET() {
  const auth = await requireAuthToken();
  if (!auth.ok) return auth.res;

  const upstream = await fetch(`${getApiBaseUrl()}/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${auth.token}`,
    },
    cache: 'no-store',
  });

  return proxyJson(upstream);
}
