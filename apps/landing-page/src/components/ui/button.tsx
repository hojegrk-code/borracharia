import * as React from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'cta';
  size?: 'default' | 'sm' | 'lg' | 'xl' | 'icon';
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-bold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer active:scale-[0.98]';

    const variants = {
      default:
        'bg-[#FF6600] text-white hover:bg-[#E65C00] shadow-lg shadow-orange-600/25 border border-orange-500/20',
      cta: 'bg-gradient-to-r from-[#FF6600] via-[#FF771A] to-[#E65C00] hover:from-[#E65C00] hover:to-[#CC5200] text-white font-black uppercase tracking-wider shadow-2xl shadow-orange-600/35 border border-orange-400/30',
      destructive: 'bg-red-600 text-white hover:bg-red-500 shadow-md shadow-red-600/20',
      outline:
        'border border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-800 hover:border-zinc-400 shadow-sm',
      secondary: 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200 border border-zinc-200/80',
      ghost: 'hover:bg-zinc-100 text-zinc-700 hover:text-zinc-900',
      link: 'text-[#FF6600] underline-offset-4 hover:underline p-0',
    };

    const sizes = {
      default: 'h-10 px-4 py-2',
      sm: 'h-8 rounded-lg px-3 text-xs',
      lg: 'h-12 rounded-xl px-6 text-base',
      xl: 'h-14 sm:h-16 rounded-2xl px-8 text-base sm:text-lg font-black tracking-wide',
      icon: 'h-10 w-10',
    };

    return (
      <button
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';
