import type { TextareaHTMLAttributes } from 'react';
import { forwardRef } from 'react';
import { cn } from '../../utils';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: 'default' | 'glass' | 'transparent';
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variantClasses = {
      default: 'border-gray-200 bg-white text-gray-900 placeholder:text-gray-500',
      glass: 'glass border-white/20 bg-white/5 text-white placeholder:text-gray-400',
      transparent: 'border-transparent bg-transparent text-white placeholder:text-gray-400',
    };

    return (
      <textarea
        className={cn(
          'flex min-h-[120px] w-full rounded-lg px-3 py-2 text-sm ring-offset-black/50 placeholder:text-gray-400 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 resize-none transition-all duration-200',
          variantClasses[variant],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';

export { Textarea };
