'use client';

import { useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';

export function useSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const debounceRef = useRef<NodeJS.Timeout>();

  const search = useCallback(async (q: string) => {
    if (q.length < 2) { setResults([]); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data.results || []);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChange = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(value), 300);
  };

  const handleSelect = (result: any) => {
    setIsOpen(false);
    if (result.resultType === 'task') router.push(`/tasks/${result.id}`);
    else if (result.resultType === 'project') router.push(`/projects/${result.id}`);
    else if (result.resultType === 'team') router.push(`/teams/${result.id}`);
  };

  return { query, setQuery: handleChange, results, loading, isOpen, setIsOpen, handleSelect };
}