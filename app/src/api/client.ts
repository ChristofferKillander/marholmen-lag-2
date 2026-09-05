import type { ComposeOptions, Pulse, Vibe, VibeCreate } from './types';

/** The API surface the app needs, per `api/vibe-check.openapi.yaml`. */
export interface VibeCheckApi {
  listVibes(params?: { limit?: number; since?: string }): Promise<Vibe[]>;
  postVibe(input: VibeCreate): Promise<Vibe>;
  getPulse(): Promise<Pulse>;
  getComposeOptions(): Promise<ComposeOptions>;
}

/** Real HTTP implementation, calling a deployed Vibe Check backend. */
export function createHttpClient(baseUrl: string): VibeCheckApi {
  async function request<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${baseUrl}${path}`, {
      ...init,
      headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
    });
    if (!res.ok) {
      let message = `Request failed (${res.status})`;
      try {
        const body = await res.json();
        if (body?.error) message = body.error;
      } catch {
        // response wasn't JSON — keep the generic message
      }
      throw new Error(message);
    }
    if (res.status === 204) return undefined as T;
    return res.json() as Promise<T>;
  }

  return {
    async listVibes(params = {}) {
      const query = new URLSearchParams();
      if (params.limit) query.set('limit', String(params.limit));
      if (params.since) query.set('since', params.since);
      const qs = query.toString();
      const data = await request<{ vibes: Vibe[] }>(`/vibes${qs ? `?${qs}` : ''}`);
      return data.vibes;
    },
    postVibe(input) {
      return request<Vibe>('/vibes', { method: 'POST', body: JSON.stringify(input) });
    },
    getPulse() {
      return request<Pulse>('/pulse');
    },
    getComposeOptions() {
      return request<ComposeOptions>('/options');
    },
  };
}
