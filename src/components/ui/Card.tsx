import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import { cn } from '../../utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'glass-dark';
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variantClasses = {
      default: 'glass border border-white/10 shadow-glass hover:shadow-glass-hover hover:glass-hover',
      glass: 'glass border border-white/15 shadow-glass hover:shadow-glass-hover hover:glass-hover',
      'glass-dark': 'glass-dark border border-white/8 shadow-depth-3 hover:shadow-depth-4 hover:glass-hover',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-2xl transition-all duration-300 ease-out group',
          variantClasses[variant],
          className
        )}
        {...props}
      />
    );
  }
);

Card.displayName = 'Card';

const CardHeader = forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex flex-col space-y-1.5 p-6', className)}
        {...props}
      />
    );
  }
);

CardHeader.displayName = 'CardHeader';

const CardContent = forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
    );
  }
);

CardContent.displayName = 'CardContent';

export { Card, CardHeader, CardContent };
