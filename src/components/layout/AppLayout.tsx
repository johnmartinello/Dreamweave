import { Sidebar } from './Sidebar';
import { MainPanel } from './MainPanel';

export function AppLayout() {
  return (
    <div className="flex h-screen relative overflow-hidden">
      {/* Main layout */}
      <div className="relative z-10 flex w-full h-full">
        <Sidebar />
        <MainPanel />
      </div>
    </div>
  );
}
