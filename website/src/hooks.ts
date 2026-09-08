import { useState, useEffect } from 'react';
import type { ChainLensData, HistoricalEntry } from './types';

export function useLatestData() {
  const [data, setData] = useState<ChainLensData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/data/latest.json')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

export function useHistoricalData() {
  const [data, setData] = useState<HistoricalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/historical/results.json')
      .then((res) => {
        if (!res.ok) return [];
        return res.json();
      })
      .then(setData)
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading };
}
