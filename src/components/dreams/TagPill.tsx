import { X } from 'lucide-react';
import { cn } from '../../utils';

interface TagPillProps {
  tag: string;
  size?: 'sm' | 'md';
  removable?: boolean;
  onRemove?: (tag: string) => void;
  variant?: 'default' | 'gradient' | 'outline';
  color?: 'cyan' | 'purple' | 'pink' | 'emerald' | 'amber' | 'blue' | 'indigo' | 'violet' | 'rose' | 'teal' | 'lime' | 'orange' | 'red' | 'green' | 'yellow';
  tooltip?: string;
}

export function TagPill({ 
  tag, 
  size = 'md', 
  removable = false, 
  onRemove, 
  variant = 'default',
  color = 'cyan',
  tooltip
}: TagPillProps) {
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove?.(tag);
  };

  const colorClasses = {
    cyan: 'bg-gradient-to-r from-cyan-500/20 to-cyan-600/20 text-cyan-300 border border-gray-400/30 hover:border-gray-300/50',
    purple: 'bg-gradient-to-r from-purple-500/20 to-purple-600/20 text-purple-300 border border-gray-400/30 hover:border-gray-300/50',
    pink: 'bg-gradient-to-r from-pink-500/20 to-pink-600/20 text-pink-300 border border-gray-400/30 hover:border-gray-300/50',
    emerald: 'bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 text-emerald-300 border border-gray-400/30 hover:border-gray-300/50',
    amber: 'bg-gradient-to-r from-amber-500/20 to-amber-600/20 text-amber-300 border border-gray-400/30 hover:border-gray-300/50',
    blue: 'bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-300 border border-gray-400/30 hover:border-gray-300/50',
    indigo: 'bg-gradient-to-r from-indigo-500/20 to-indigo-600/20 text-indigo-300 border border-gray-400/30 hover:border-gray-300/50',
    violet: 'bg-gradient-to-r from-violet-500/20 to-violet-600/20 text-violet-300 border border-gray-400/30 hover:border-gray-300/50',
    rose: 'bg-gradient-to-r from-rose-500/20 to-rose-600/20 text-rose-300 border border-gray-400/30 hover:border-gray-300/50',
    teal: 'bg-gradient-to-r from-teal-500/20 to-teal-600/20 text-teal-300 border border-gray-400/30 hover:border-gray-300/50',
    lime: 'bg-gradient-to-r from-lime-500/20 to-lime-600/20 text-lime-300 border border-gray-400/30 hover:border-gray-300/50',
    orange: 'bg-gradient-to-r from-orange-500/20 to-orange-600/20 text-orange-300 border border-gray-400/30 hover:border-gray-300/50',
    red: 'bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-300 border border-gray-400/30 hover:border-gray-300/50',
    green: 'bg-gradient-to-r from-green-500/20 to-green-600/20 text-green-300 border border-gray-400/30 hover:border-gray-300/50',
    yellow: 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 text-yellow-300 border border-gray-400/30 hover:border-gray-300/50',
  };

  const variantClasses = {
    default: 'glass text-gray-100 border border-white/20 hover:glass-hover hover:border-gray-300/50',
    gradient: colorClasses[color],
    outline: 'bg-transparent text-gray-300 border border-gray-400/30 hover:bg-white/5 hover:border-gray-300/50',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-medium rounded-full px-3 py-1 transition-all duration-300 ease-out border backdrop-blur-sm',
        variantClasses[variant],
        {
          'text-xs': size === 'sm',
          'text-sm': size === 'md',
        }
      )}
      title={tooltip}
    >
      <span className="truncate">{tag}</span>
      {removable && (
        <button
          onClick={handleRemove}
          className="ml-1 rounded-full p-0.5 transition-all duration-200 hover:bg-white/10 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/20"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
}
