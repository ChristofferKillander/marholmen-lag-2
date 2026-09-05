import { useEffect, useState } from 'react';
import { api } from '../api';
import type { ComposeOptions } from '../api/types';

/** Fetches `GET /options` once for the "drop your vibe" compose sheet. */
export function useComposeOptions() {
  const [options, setOptions] = useState<ComposeOptions | null>(null);

  useEffect(() => {
    let cancelled = false;
    api
      .getComposeOptions()
      .then((next) => {
        if (!cancelled) setOptions(next);
      })
      .catch(() => {
        // sheet falls back to its own defaults if this never resolves
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return options;
}
