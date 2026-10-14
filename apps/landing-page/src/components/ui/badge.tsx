import * as React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'orange' | 'emerald';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variants = {
    default: 'border-transparent bg-orange-600 text-white shadow hover:bg-orange-600/80',
    secondary: 'border-transparent bg-zinc-800 text-zinc-100 hover:bg-zinc-800/80',
    destructive: 'border-transparent bg-red-600 text-white shadow hover:bg-red-600/80',
    outline: 'border-zinc-700 text-zinc-300',
    orange: 'border-orange-500/30 bg-orange-500/10 text-orange-400',
    emerald: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
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
