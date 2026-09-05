import { useEffect, useState } from 'react';
import { api } from '../api';
import type { Pulse } from '../api/types';

const POLL_MS = 5000;

/** Polls `GET /pulse` for the room-energy header + pulse tab. */
export function usePulse() {
  const [pulse, setPulse] = useState<Pulse | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const next = await api.getPulse();
        if (!cancelled) setPulse(next);
      } catch {
        // keep last known pulse on a failed poll
      }
    }

    load();
    const id = setInterval(load, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return pulse;
}
