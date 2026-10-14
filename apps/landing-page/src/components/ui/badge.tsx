import * as React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'orange' | 'emerald';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variants = {
    default: 'border-transparent bg-[#FF6600] text-white shadow-md hover:bg-[#E65C00]',
    secondary: 'border-zinc-700 bg-zinc-800/80 text-zinc-200 backdrop-blur-md',
    destructive: 'border-transparent bg-red-600 text-white shadow hover:bg-red-700',
    outline: 'border-zinc-700 text-zinc-300 bg-zinc-900/60 backdrop-blur-md',
    orange: 'border-orange-500/40 bg-orange-500/20 text-orange-400 font-bold backdrop-blur-md',
    emerald: 'border-emerald-500/40 bg-emerald-500/20 text-emerald-400 font-bold backdrop-blur-md',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
