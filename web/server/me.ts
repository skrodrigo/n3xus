export type MeUser = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
};

export const meService = {
  async get() {
    const res = await fetch('/api/auth/me', { cache: 'no-store' });
    const body = await res.json().catch(() => null);
    if (!res.ok) throw new Error(body?.error || `Request failed (${res.status})`);
    return body as MeUser;
  },
};
