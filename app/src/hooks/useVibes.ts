import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '../api';
import type { Vibe } from '../api/types';

const POLL_MS = 4000;
const MAX_VIBES = 40;

/**
 * Holds the wall's vibe list, seeded once and then kept live by polling
 * `GET /vibes?since=` — see api/vibe-check.openapi.yaml. New vibes (from the
 * poll, or posted locally) are prepended, matching the design's behaviour.
 */
export function useVibes() {
  const [vibes, setVibes] = useState<Vibe[]>([]);
  const [loading, setLoading] = useState(true);
  const sinceRef = useRef<string | undefined>(undefined);

  const bumpSince = useCallback((iso: string) => {
    if (!sinceRef.current || iso > sinceRef.current) sinceRef.current = iso;
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function poll(initial: boolean) {
      try {
        const fresh = initial
          ? await api.listVibes({ limit: MAX_VIBES })
          : await api.listVibes({ since: sinceRef.current });
        if (cancelled) return;

        if (initial) {
          setVibes(fresh);
        } else if (fresh.length) {
          setVibes((prev) => [...fresh, ...prev].slice(0, MAX_VIBES));
        }
        if (fresh[0]) bumpSince(fresh[0].createdAt);
      } catch {
        // Keep last known state on a failed poll — no need to surface a
        // hackathon-demo network hiccup to the user.
      } finally {
        if (initial) setLoading(false);
      }
    }

    poll(true);
    const id = setInterval(() => poll(false), POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [bumpSince]);

  const addLocal = useCallback(
    (vibe: Vibe) => {
      setVibes((prev) => [vibe, ...prev].slice(0, MAX_VIBES));
      bumpSince(vibe.createdAt);
    },
    [bumpSince],
  );

  return { vibes, loading, addLocal };
}
