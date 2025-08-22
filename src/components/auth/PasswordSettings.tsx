import { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { usePasswordStore } from '../../store/passwordStore';

interface PasswordSettingsProps {
  onClose: () => void;
}

export function PasswordSettings({ onClose }: PasswordSettingsProps) {
  const { config, updateConfig } = usePasswordStore();
  const [timeout, setTimeout] = useState(config.autoLockTimeout.toString());

  const handleSave = () => {
    const timeoutValue = parseInt(timeout, 10);
    if (timeoutValue >= 1 && timeoutValue <= 60) {
      updateConfig({ autoLockTimeout: timeoutValue });
      onClose();
    }
  };



  const isValidTimeout = () => {
    const value = parseInt(timeout, 10);
    return value >= 1 && value <= 60;
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white/90 mb-2">Lockscreen Options </h3>
        <p className="text-white/60 text-sm">
          Configure your lockscreen settings
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white/90 mb-2">
            Auto-lock timeout (minutes)
          </label>
          <Input
            type="number"
            variant="transparent"
            value={timeout}
            onChange={(e) => setTimeout(e.target.value)}
            min="1"
            max="60"
            className="w-full hover:border-white/50 focus:border-white/70 focus:ring-2 focus:ring-white/20 transition-all duration-200"
            placeholder="10"
          />
          <p className="text-xs text-white/50 mt-1">
            App will automatically lock after this many minutes of inactivity (1-60 minutes)
          </p>
        </div>

        <div className="flex items-center justify-between p-3 glass rounded-lg border border-white/20">
          <div>
            <p className="text-white/90 text-sm font-medium">Current Status</p>
            <p className="text-white/60 text-xs">
              Auto-lock: {config.autoLockTimeout} minutes
            </p>
          </div>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          variant="ghost"
          onClick={handleSave}
          disabled={!isValidTimeout()}
          className="flex-1 glass text-white/90 font-medium shadow-inner-lg border border-white/20 hover:glass-hover hover:text-white hover:border-white/30 relative overflow-hidden group cursor-pointer transition-all duration-300"
        >
          <div className="absolute inset-0 bg-gradient-shimmer bg-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <span className="relative z-10">Save Settings</span>
        </Button>
      </div>
    </div>
  );
}
