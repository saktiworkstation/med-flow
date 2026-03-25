'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  colorClass: string;
  label: string;
  pulse?: boolean;
}

export function StatusBadge({ status, colorClass, label, pulse }: StatusBadgeProps) {
  return (
    <motion.span
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
        colorClass,
        pulse && 'animate-pulse-soft'
      )}
    >
      <span
        className={cn(
          'h-1.5 w-1.5 rounded-full',
          status === 'in_progress' && 'animate-pulse-soft',
          colorClass.includes('green') && 'bg-green-500',
          colorClass.includes('blue') && 'bg-blue-500',
          colorClass.includes('amber') && 'bg-amber-500',
          colorClass.includes('red') && 'bg-red-500',
          colorClass.includes('gray') && 'bg-gray-500',
          colorClass.includes('indigo') && 'bg-indigo-500',
          colorClass.includes('purple') && 'bg-purple-500',
          colorClass.includes('pink') && 'bg-pink-500',
          colorClass.includes('teal') && 'bg-teal-500'
        )}
      />
      {label}
    </motion.span>
  );
}
