export const subscriptionService = {
  async get() {
    const res = await fetch('/api/subscription', { cache: 'no-store' });
    if (!res.ok) {
      const body = await res.json().catch(() => null);
      throw new Error(body?.error || `Request failed (${res.status})`);
    }
    return res.json();
  },

  async deleteIncomplete() {
    const res = await fetch('/api/subscription', { method: 'DELETE', cache: 'no-store' });
    if (!res.ok) {
      const body = await res.json().catch(() => null);
      throw new Error(body?.error || `Request failed (${res.status})`);
    }
    return res.json();
  },
};
