import { createHttpClient, type VibeCheckApi } from './client';
import { createMockClient } from './mockClient';

export type { VibeCheckApi } from './client';
export * from './types';

/**
 * Set EXPO_PUBLIC_API_BASE_URL (see `.env.example`) once the real backend
 * (built from `api/vibe-check.openapi.yaml`, deployed to Vercel) exists.
 * Until then the app runs entirely against an in-memory mock so it's
 * demoable today — see `mockClient.ts`.
 */
const baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL?.trim();

export const api: VibeCheckApi = baseUrl ? createHttpClient(baseUrl) : createMockClient();

export const isUsingMockApi = !baseUrl;
