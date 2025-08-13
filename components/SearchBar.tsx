'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/store/slices/themeSlice';

type Props = { onSubmit: (city: string) => void };

function useDebounced<T>(value: T, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

export default function SearchBar({ onSubmit }: Props) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [noResults, setNoResults] = useState(false); // NEW
  const debounced = useDebounced(query, 300);
  const abortRef = useRef<AbortController | null>(null);
  const { theme } = useTheme();
  const listRef = useRef<HTMLUListElement>(null);

  // Fetch suggestions
  useEffect(() => {
    if (!debounced) {
      setSuggestions([]);
      setNoResults(false);
      setHighlightIndex(-1);
      return;
    }
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    (async () => {
      try {
        const res = await fetch(
          `/api/weather?suggest=1&city=${encodeURIComponent(debounced)}`,
          {
            signal: controller.signal,
          },
        );
        if (!res.ok) {
          setSuggestions([]);
          setNoResults(true);
          setOpen(true);
          return;
        }
        const json = await res.json();
        const list = (json.suggestions || []).map(
          (s: any) => `${s.name}${s.state ? ', ' + s.state : ''}, ${s.country}`,
        );
        setSuggestions(list);
        setNoResults(list.length === 0);
        setOpen(true);
        setHighlightIndex(-1);
      } catch {
        setSuggestions([]);
        setNoResults(true);
        setOpen(true);
      }
    })();
    return () => controller.abort();
  }, [debounced]);

  const handlePick = (value: string) => {
    if (!value.trim()) return;
    setQuery('');
    setOpen(false);
    setHighlightIndex(-1);
    onSubmit(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || (!suggestions.length && !noResults)) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIndex((prev) =>
        suggestions.length ? (prev + 1) % suggestions.length : prev,
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIndex((prev) =>
        suggestions.length
          ? (prev - 1 + suggestions.length) % suggestions.length
          : prev,
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (suggestions.length && highlightIndex >= 0) {
        handlePick(suggestions[highlightIndex]);
      } else if (!suggestions.length && noResults) {
        setOpen(false); // just close if no results
      } else {
        handlePick(query);
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => (suggestions.length || noResults) && setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Type a city... e.g., Mumbai"
          className="w-full rounded-xl border border-gray-300 dark:border-gray-700 px-4 py-3 outline-none bg-transparent 
                     placeholder:text-gray-500 dark:placeholder:text-gray-400"
        />
        <button
          onClick={() => handlePick(query)}
          className="rounded-xl px-4 py-2 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          Search
        </button>
      </div>

      <AnimatePresence>
        {open && (suggestions.length > 0 || noResults) && (
          <motion.ul
            ref={listRef}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="absolute z-10 mt-2 w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-[var(--bg)] shadow-lg"
          >
            {noResults ? (
              <li className="px-4 py-2 text-gray-500 dark:text-gray-400 text-sm">
                No results found
              </li>
            ) : (
              suggestions.map((s, i) => (
                <li
                  key={i}
                  onMouseDown={() => handlePick(s)}
                  className={`px-4 py-2 cursor-pointer ${
                    i === highlightIndex
                      ? 'bg-gray-200 dark:bg-gray-700'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {s}
                </li>
              ))
            )}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
