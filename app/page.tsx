'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchWeather } from '@/store/slices/weatherSlice';
import { addCity } from '@/store/slices/historySlice';
import SearchBar from '@/components/SearchBar';
import ThemeToggle from '@/components/ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';

function gradientsFor(conditionRaw: string) {
  const c = (conditionRaw || '').toLowerCase();

  // Return a pair: { light, dark }
  if (c.includes('snow')) {
    return {
      light: 'linear-gradient(to bottom right, #e0f2fe, #60a5fa)',
      dark: 'linear-gradient(to bottom right, #0ea5e9, #1e40af)',
    };
  }
  if (c.includes('rain') || c.includes('drizzle') || c.includes('thunder')) {
    return {
      light: 'linear-gradient(to bottom right, #93c5fd, #6366f1)',
      dark: 'linear-gradient(to bottom right, #1d4ed8, #4f46e5)',
    };
  }
  if (c.includes('clear') || c.includes('sun')) {
    return {
      light: 'linear-gradient(to bottom right, #fde68a, #fb923c, #f472b6)',
      dark: 'linear-gradient(to bottom right, #f59e0b, #ea580c, #9d174d)',
    };
  }
  if (c.includes('cloud')) {
    return {
      light: 'linear-gradient(to bottom right, #cbd5e1, #64748b)',
      dark: 'linear-gradient(to bottom right, #334155, #0f172a)',
    };
  }
  // Default (mist/other)
  return {
    light: 'linear-gradient(to bottom right, #a7f3d0, #60a5fa)',
    dark: 'linear-gradient(to bottom right, #0f766e, #1e3a8a)',
  };
}

export default function HomePage() {
  const dispatch = useAppDispatch();
  const { data, status, error } = useAppSelector((s) => s.weather);
  const history = useAppSelector((s) => s.history.items);

  const onSelectCity = (city: string) => {
    if (!city) return;
    dispatch(fetchWeather(city));
    dispatch(addCity(city));
  };

  // Apply weather-based background for both themes
  useEffect(() => {
    const root = document.documentElement;
    const { light, dark } = gradientsFor(data?.weather?.[0]?.description ?? '');
    root.style.setProperty('--bg-gradient-light', light);
    root.style.setProperty('--bg-gradient-dark', dark);
  }, [data]);

  const cardKey = data
    ? `${data.name}-${Math.round(data.main?.temp ?? 0)}-${
        data.weather?.[0]?.main ?? ''
      }`
    : 'empty';

  return (
    <div className="container py-6">
      <div className="flex items-center justify-between gap-2 mb-5">
        <h1 className="text-2xl font-bold text-white drop-shadow">
          Weather-Based Outfit Recommender
        </h1>
        <ThemeToggle />
      </div>

      <div className="mb-6">
        <SearchBar onSubmit={onSelectCity} />
      </div>

      <AnimatePresence mode="popLayout">
        {status === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-sm text-white/80 drop-shadow"
          >
            Fetching weather...
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/40 text-sm text-white">
          {error}
        </div>
      )}
    </div>
  );
}
