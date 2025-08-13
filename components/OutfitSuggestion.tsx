'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  CloudRain,
  SunMedium,
  Umbrella,
  Glasses,
  Shirt,
  Snowflake,
  Wind,
} from 'lucide-react';
import cn from 'classnames';

function computeComfort(tempC: number, humidity: number, windMs: number) {
  // Simple heuristic 0–100 (higher = more comfy)
  let score = 100;
  // temp penalty
  if (tempC < 10) score -= (10 - tempC) * 3;
  if (tempC > 26) score -= (tempC - 26) * 3;
  // humidity penalty
  if (humidity > 65) score -= (humidity - 65) * 0.6;
  // wind bonus/penalty
  score -= Math.max(0, windMs - 7) * 2;
  score = Math.max(0, Math.min(100, Math.round(score)));
  return score;
}

function getBadges(tempC: number, condition: string) {
  const c = condition.toLowerCase();
  const badges: { label: string; Icon: any }[] = [];

  if (c.includes('rain') || c.includes('drizzle') || c.includes('thunder')) {
    badges.push({ label: 'Umbrella', Icon: Umbrella });
  }
  if (c.includes('clear') || c.includes('sun')) {
    badges.push({ label: 'Sunglasses', Icon: Glasses });
  }
  if (c.includes('snow') || tempC < 12) {
    badges.push({ label: 'Warm Layer', Icon: Snowflake });
  }
  if (tempC >= 28) {
    badges.push({ label: 'Lightwear', Icon: Shirt });
  }
  if (badges.length === 0) {
    badges.push({ label: 'Layer Up', Icon: Wind });
  }
  return badges;
}

function outfitText(tempC: number, condition: string) {
  const cond = condition.toLowerCase();
  if (
    cond.includes('rain') ||
    cond.includes('drizzle') ||
    cond.includes('thunder')
  ) {
    return tempC < 15
      ? 'Raincoat + warm layers. Take an umbrella.'
      : 'Light rain jacket. Take an umbrella.';
  }
  if (cond.includes('snow')) return 'Heavy jacket, gloves, beanie, and boots.';
  if (cond.includes('clear') || cond.includes('sun')) {
    if (tempC >= 30) return 'T-shirt & shorts. Sunglasses and hydrate.';
    if (tempC >= 22) return 'Light shirt & jeans. Sunglasses suggested.';
    return 'Long sleeves or light jacket for comfort.';
  }
  if (cond.includes('cloud')) {
    if (tempC >= 25) return 'T-shirt, breathable fabrics.';
    if (tempC >= 18) return 'Light jacket/cardigan.';
    return 'Sweater or jacket—could feel cool.';
  }
  if (tempC < 5) return 'Thermals, coat, gloves.';
  if (tempC < 15) return 'Jacket or hoodie recommended.';
  return 'Comfortable casual wear.';
}

function accentFor(condition: string) {
  const c = condition.toLowerCase();
  if (c.includes('snow')) return 'from-cyan-300 to-blue-500';
  if (c.includes('rain') || c.includes('drizzle') || c.includes('thunder'))
    return 'from-sky-500 to-indigo-600';
  if (c.includes('clear') || c.includes('sun'))
    return 'from-amber-400 to-pink-500';
  if (c.includes('cloud')) return 'from-slate-400 to-slate-600';
  return 'from-emerald-400 to-teal-500';
}

export default function OutfitSuggestion({
  tempC,
  condition,
  humidity = 55,
  windMs = 3,
}: {
  tempC: number;
  condition: string;
  humidity?: number;
  windMs?: number;
}) {
  const text = outfitText(tempC, condition);
  const badges = getBadges(tempC, condition);
  const accent = accentFor(condition);
  const score = computeComfort(tempC, humidity, windMs);

  // pick an icon for the header
  const HeaderIcon = condition.toLowerCase().includes('rain')
    ? CloudRain
    : condition.toLowerCase().includes('clear') ||
      condition.toLowerCase().includes('sun')
    ? SunMedium
    : condition.toLowerCase().includes('snow')
    ? Snowflake
    : Wind;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={text} // animate on content change
        initial={{ opacity: 0, y: 8, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.98 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className={cn('mt-4 rounded-2xl p-[1px] bg-gradient-to-r', accent)}
      >
        <div
          className={cn(
            'rounded-2xl p-4 md:p-5',
            'bg-white/60 dark:bg-gray-900/60 backdrop-blur',
            'border border-white/20 dark:border-white/10',
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-white/70 dark:bg-white/10 flex items-center justify-center border border-white/30 dark:border-white/10">
                <HeaderIcon className="w-4 h-4" />
              </div>
              <p className="font-semibold">Outfit Tip</p>
            </div>
            <div className="text-xs opacity-80">Comfort: {score}%</div>
          </div>

          {/* Tip text */}
          <p className="opacity-90 mb-4">{text}</p>

          {/* Comfort meter */}
          <div className="mb-4">
            <div className="h-2 w-full rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${score}%` }}
                transition={{ duration: 0.4 }}
                className={cn('h-full rounded-full bg-gradient-to-r', accent)}
              />
            </div>
            <div className="mt-1 text-xs opacity-70">
              Temp {tempC}°C · Humidity {humidity}% · Wind {Math.round(windMs)}{' '}
              m/s
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            {badges.map(({ label, Icon }) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full
                           border border-white/30 bg-white/50 dark:bg-white/10"
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
