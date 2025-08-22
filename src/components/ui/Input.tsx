import type { InputHTMLAttributes } from 'react';
import { forwardRef } from 'react';
import { cn } from '../../utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'glass' | 'transparent';
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant = 'default', ...props }, ref) => {
    const variantClasses = {
      default: 'border-gray-200 bg-white text-gray-900 placeholder:text-gray-500',
      glass: 'glass border-white/20 bg-white/5 text-white placeholder:text-gray-400',
      transparent: 'border-transparent bg-transparent text-white placeholder:text-gray-400',
    };

    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-lg px-3 py-2 text-sm ring-offset-black/50 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200',
          variantClasses[variant],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input };
