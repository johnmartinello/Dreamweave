import { AppLayout } from './components/layout/AppLayout';
import { LockScreen } from './components/auth/LockScreen';
import { usePasswordStore } from './store/passwordStore';
import { useActivityTracker } from './hooks/useActivityTracker';

function App() {
  const { isLocked, isFirstLaunch } = usePasswordStore();
  
  // Track user activity for auto-lock
  useActivityTracker();

  // Show lock screen if app is locked or if it's first launch
  if (isLocked || isFirstLaunch) {
    return <LockScreen isFirstLaunch={isFirstLaunch} />;
  }

  return <AppLayout />;
}

export default App;
