import { useEffect, useRef } from 'react';
import { usePasswordStore } from '../store/passwordStore';

export function useActivityTracker() {
  const { updateActivity, checkAutoLock, config } = usePasswordStore();
  const autoLockIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!config.isEnabled) return;

    const handleActivity = () => {
      updateActivity();
    };

    const startAutoLockCheck = () => {
      // Check for auto-lock every 30 seconds
      autoLockIntervalRef.current = setInterval(() => {
        checkAutoLock();
      }, 30000);
    };

    const stopAutoLockCheck = () => {
      if (autoLockIntervalRef.current) {
        clearInterval(autoLockIntervalRef.current);
        autoLockIntervalRef.current = null;
      }
    };

    // Track various user activities
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    // Start auto-lock checking
    startAutoLockCheck();

    // Initial activity update
    updateActivity();

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
      stopAutoLockCheck();
    };
  }, [config.isEnabled, updateActivity, checkAutoLock]);

  return null;
}
