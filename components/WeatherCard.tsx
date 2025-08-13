'use client';

import { motion } from 'framer-motion';
import cn from 'classnames';
import { ThermometerSun, Droplets, Wind, Thermometer } from 'lucide-react';
import OutfitSuggestion from './OutfitSuggestion';

type WeatherData = {
  name: string;
  main: { temp: number; humidity: number; feels_like?: number };
  weather: { description: string; main?: string; icon: string }[];
  wind: { speed: number };
};

function getAccent(conditionRaw: string) {
  const c = conditionRaw.toLowerCase();
  if (c.includes('snow'))
    return { gradient: 'from-cyan-300 to-blue-500', ring: 'ring-blue-500/40' };
  if (c.includes('rain') || c.includes('drizzle') || c.includes('thunder'))
    return {
      gradient: 'from-sky-500 to-indigo-600',
      ring: 'ring-indigo-500/40',
    };
  if (c.includes('clear') || c.includes('sun'))
    return {
      gradient: 'from-amber-400 to-orange-500',
      ring: 'ring-orange-500/40',
    };
  if (c.includes('cloud'))
    return {
      gradient: 'from-slate-400 to-slate-600',
      ring: 'ring-slate-500/40',
    };
  return {
    gradient: 'from-emerald-400 to-teal-500',
    ring: 'ring-emerald-500/40',
  };
}

const tileVariants = {
  hidden: { opacity: 0, y: 8 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.06 * i, duration: 0.25, ease: 'easeOut' },
  }),
};

export default function WeatherCard({ data }: { data: WeatherData }) {
  const temp = Math.round(data.main.temp);
  const feels = Math.round(data.main.feels_like ?? data.main.temp);
  const cond = data.weather[0]?.description ?? 'Unknown';
  const icon = data.weather[0]?.icon;
  const mood = getAccent(cond);

  const tiles = [
    {
      label: 'Temperature',
      value: `${temp}°C`,
      Icon: ThermometerSun,
    },
    {
      label: 'Humidity',
      value: `${data.main.humidity}%`,
      Icon: Droplets,
    },
    {
      label: 'Wind',
      value: `${Math.round(data.wind.speed)} m/s`,
      Icon: Wind,
    },
    {
      label: 'Feels Like',
      value: `${feels}°C`,
      Icon: Thermometer,
    },
  ];

  return (
    <div className={cn('rounded-2xl p-[1px] bg-gradient-to-r', mood.gradient)}>
      <motion.div
        layout
        className={cn(
          'rounded-2xl p-5 shadow-lg',
          'bg-white/60 dark:bg-gray-900/60 backdrop-blur',
          'border border-white/20 dark:border-white/10',
        )}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold truncate">{data.name}</h2>
              <span
                className={cn(
                  'text-xs px-2 py-0.5 rounded-full border',
                  'border-white/30 bg-white/40 dark:bg-white/10',
                )}
              >
                {data.weather[0]?.main ?? '—'}
              </span>
            </div>
            <p className="opacity-80 capitalize">{cond}</p>
          </div>

          {icon && (
            <motion.img
              src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
              alt={cond}
              className="w-16 h-16"
              initial={{ rotate: -8, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 220, damping: 15 }}
            />
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {tiles.map((t, i) => (
            <motion.div
              key={t.label}
              className={cn(
                'p-3 rounded-xl bg-gray-50/70 dark:bg-gray-900/70',
                'border border-white/20 dark:border-white/10',
                'relative overflow-hidden',
              )}
              variants={tileVariants}
              initial="hidden"
              animate="show"
              custom={i}
              layout
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'w-9 h-9 rounded-lg flex items-center justify-center',
                    'bg-white/60 dark:bg-white/10',
                    'ring-2',
                    mood.ring,
                  )}
                >
                  <t.Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm opacity-70">{t.label}</p>
                  <p className="text-xl font-semibold leading-tight">
                    {t.value}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <OutfitSuggestion
          tempC={temp}
          condition={cond}
          humidity={data.main.humidity}
          windMs={data.wind.speed}
        />
      </motion.div>
    </div>
  );
}
