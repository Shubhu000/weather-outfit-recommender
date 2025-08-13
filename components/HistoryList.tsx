'use client';

import { motion } from 'framer-motion';

type Props = {
  items: string[];
  onPick: (city: string) => void;
};

export default function HistoryList({ items, onPick }: Props) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Recent searches</h2>
      <motion.div
        className="flex flex-wrap gap-2"
        initial="hidden"
        animate="show"
        variants={{
          hidden: {
            transition: { staggerChildren: 0.04, staggerDirection: -1 },
          },
          show: { transition: { staggerChildren: 0.04 } },
        }}
      >
        {items.map((c) => (
          <motion.button
            key={c}
            onClick={() => onPick(c)}
            className="px-3 py-1 rounded-full border border-gray-300 dark:border-gray-700 text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
            variants={{
              hidden: { opacity: 0, y: 6 },
              show: { opacity: 1, y: 0 },
            }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            {c}
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}
