export const usageService = {
  async get() {
    const res = await fetch('/api/usage', { cache: 'no-store' });
    if (!res.ok) {
      const body = await res.json().catch(() => null);
      throw new Error(body?.error || `Request failed (${res.status})`);
    }
    return res.json();
  },

  async increment() {
    const res = await fetch('/api/usage?action=increment', { method: 'POST', cache: 'no-store' });
    if (!res.ok) {
      const body = await res.json().catch(() => null);
      throw new Error(body?.error || `Request failed (${res.status})`);
    }
    return res.json();
  },
};
