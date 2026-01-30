import { getApiBaseUrl } from './api';

export type AuthTokenResponse = { token: string };

export type User = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  createdAt: string;
  updatedAt: string;
  stripeCustomerId?: string | null;
};


export const authService = {
  async register(data: { name: string; email: string; password: string }) {
    const res = await fetch(`${getApiBaseUrl()}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      cache: 'no-store',
    });
    const body = await res.json().catch(() => null);
    if (!res.ok) throw new Error(body?.error || `Request failed (${res.status})`);
    return body as User;
  },

  async login(data: { email: string; password: string }) {
    const res = await fetch(`${getApiBaseUrl()}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      cache: 'no-store',
    });
    const body = await res.json().catch(() => null);
    if (!res.ok) throw new Error(body?.error || `Request failed (${res.status})`);
    return body as AuthTokenResponse;
  },

  async me(token: string) {
    const res = await fetch(`${getApiBaseUrl()}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    const body = await res.json().catch(() => null);
    if (!res.ok) throw new Error(body?.error || `Request failed (${res.status})`);
    return body as User;
  },
};
