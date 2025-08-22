import { motion, AnimatePresence } from 'framer-motion';
import { useDreamStore } from '../../store/dreamStore';
import { DreamList } from '../dreams/DreamList';
import { DreamEditor } from '../dreams/DreamEditor.tsx';
import { DreamGraph } from '../dreams/DreamGraph';

export function MainPanel() {
  const currentView = useDreamStore((state) => state.currentView);
  

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <DreamList />;
      case 'dream':
        return <DreamEditor />;
      case 'graph':
        return <DreamGraph />;
      default:
        return <DreamList />;
    }
  };

  return (
    <div className="flex-1 overflow-hidden relative">
      
      <div className="h-full relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="h-full"
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
