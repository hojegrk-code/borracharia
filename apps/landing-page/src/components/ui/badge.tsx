import * as React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'orange' | 'emerald';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variants = {
    default: 'border-transparent bg-[#FF6600] text-white shadow-sm hover:bg-[#E65C00]',
    secondary: 'border-transparent bg-zinc-100 text-zinc-800 hover:bg-zinc-200',
    destructive: 'border-transparent bg-red-600 text-white shadow hover:bg-red-700',
    outline: 'border-zinc-300 text-zinc-700 bg-white/80',
    orange: 'border-orange-200 bg-orange-50 text-[#FF6600] font-bold',
    emerald: 'border-emerald-200 bg-emerald-50 text-emerald-700 font-bold',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
