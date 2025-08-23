import { Button } from '../ui/Button';
import { useDreamStore } from '../../store/dreamStore';
import { useI18n } from '../../hooks/useI18n';
import { cn } from '../../utils';
import { TagPill } from '../dreams/TagPill';
import { Settings, Trash2 } from 'lucide-react';
import { ConfigurationModal } from '../ConfigurationModal';
import { TrashModal } from '../dreams/TrashModal';
import { LockButton } from '../auth/LockButton';
import { useState } from 'react';

export function Sidebar() {
  const { t } = useI18n();
  const currentView = useDreamStore((state) => state.currentView);
  const selectedTag = useDreamStore((state) => state.selectedTag);
  const trashedDreams = useDreamStore((state) => state.trashedDreams);
  const setCurrentView = useDreamStore((state) => state.setCurrentView);
  const setSelectedTag = useDreamStore((state) => state.setSelectedTag);
  const getAllTagsWithColors = useDreamStore((state) => state.getAllTagsWithColors);
  

  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showTrashModal, setShowTrashModal] = useState(false);
  const tags = getAllTagsWithColors();

  const handleTagClick = (tagName: string) => {
    if (selectedTag === tagName) {
      setSelectedTag(null);
    } else {
      setSelectedTag(tagName);
    }
  };

  return (
    <>
      <div className="w-80 relative">
        
        <div className="h-full p-6 relative z-10 flex flex-col">
          {/* Enhanced Header */}
          <div className="flex items-center mb-8 group cursor-pointer hover:opacity-80 transition-opacity duration-200">

            <div>
              <h1 className="text-2xl font-bold text-white/90 group-hover:text-white transition-colors duration-200">DreamWeave</h1>
            </div>
          </div>
          
          {/* Enhanced Navigation */}
          <div className="space-y-3 mb-8">
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start h-12 text-base rounded-xl relative overflow-hidden group cursor-pointer",
                currentView === 'home' && !selectedTag
                  ? "glass text-white/90 font-medium shadow-inner-lg border border-white/20"
                  : "text-white/60 hover:glass hover:text-white/90 hover:font-medium hover:shadow-inner-lg hover:border-white/20"
              )}
              onClick={() => {
                setCurrentView('home');
                setSelectedTag(null);
              }}
            >
              {/* Shimmer effect on hover */}
              <div className="absolute inset-0 bg-gradient-shimmer bg-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <span className="relative z-10">{t('home')}</span>
            </Button>

            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start h-12 text-base rounded-xl relative overflow-hidden group cursor-pointer",
                currentView === 'graph'
                  ? "glass text-white/90 font-medium shadow-inner-lg border border-white/20"
                  : "text-white/60 hover:glass hover:text-white/90 hover:font-medium hover:shadow-inner-lg hover:border-white/20"
              )}
              onClick={() => {
                setSelectedTag(null);
                setTimeout(() => {
                  setCurrentView('graph');
                }, 0);
              }}
            >
              {/* Shimmer effect on hover */}
              <div className="absolute inset-0 bg-gradient-shimmer bg-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <span className="relative z-10">{t('connections')}</span>
            </Button>
          </div>

          {/* Enhanced Categories Section */}
          <div className="flex-1 min-h-0 flex flex-col">
            <div className="flex items-center mb-4">
              <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wide">
                {t('categories')}
              </h3>
            </div>
            
            {tags.length === 0 ? (
              <div className="text-center py-8 glass rounded-xl border border-white/10">

                <p className="text-sm text-white/50 mb-1">{t('noTagsYet')}</p>
                <p className="text-xs text-white/40">{t('tagsWillAppear')}</p>
              </div>
            ) : (
              <div className="space-y-2 flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent hover:scrollbar-thumb-white/30">
                {tags.map((tag) => (
                  <button
                    key={tag.name}
                    onClick={() => handleTagClick(tag.name)}
                    className={cn(
                      'w-full text-left px-4 py-3 rounded-xl text-sm transition-all duration-300 ease-out relative overflow-hidden group cursor-pointer',
                      selectedTag === tag.name
                        ? 'glass text-white/90 font-medium shadow-inner-lg border border-white/20'
                        : 'text-white/60 hover:glass hover:text-white/90 hover:font-medium hover:shadow-inner-lg hover:border-white/20'
                    )}
                  >
                    {/* Shimmer effect for all tags on hover */}
                    <div className="absolute inset-0 bg-gradient-shimmer bg-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className="flex items-center justify-between relative z-10">
                      <div className="flex items-center gap-3">
                        <TagPill 
                          tag={tag.name} 
                          size="sm" 
                          variant="gradient"
                          color={tag.color}
                        />
                      </div>
                      <span className={cn(
                        "text-[10px] px-2 py-1 rounded-full flex-shrink-0 ml-2 transition-all duration-200",
                        selectedTag === tag.name
                          ? "bg-gradient-to-r from-white/20 to-white/10 text-white/90 border border-white/20"
                          : "bg-white/5 text-white/50 border border-white/10 group-hover:bg-gradient-to-r group-hover:from-white/20 group-hover:to-white/10 group-hover:text-white/90 group-hover:border-white/20"
                      )}>
                        {tag.count}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Enhanced Footer */}
          <div className="mt-auto">
            <div className="text-center mb-4">
              <p className="text-xs text-white/50">
                {t('dreamsStoredLocally')}
              </p>
            </div>
            <div className="pt-4 border-t border-white/10 flex items-center justify-center">
              <div className="flex items-center gap-2">
                <LockButton
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 rounded-lg relative overflow-hidden group cursor-pointer text-white/60 hover:glass hover:text-white/90 hover:shadow-inner-lg hover:border-white/20"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 rounded-lg relative overflow-hidden group cursor-pointer text-white/60 hover:glass hover:text-white/90 hover:shadow-inner-lg hover:border-white/20"
                  onClick={() => setShowTrashModal(true)}
                  title={t('trash')}
                >
                  {/* Shimmer effect on hover */}
                  <div className="absolute inset-0 bg-gradient-shimmer bg-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <Trash2 className="w-3 h-3" />
                    {trashedDreams.length > 0 && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-400 rounded-full text-[8px] text-white flex items-center justify-center">
                        {trashedDreams.length > 9 ? '9+' : trashedDreams.length}
                      </span>
                    )}
                  </div>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 rounded-lg relative overflow-hidden group cursor-pointer text-white/60 hover:glass hover:text-white/90 hover:shadow-inner-lg hover:border-white/20"
                  onClick={() => setShowConfigModal(true)}
                  title={t('settings')}
                >
                  {/* Shimmer effect on hover */}
                  <div className="absolute inset-0 bg-gradient-shimmer bg-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Settings className="w-3 h-3 relative z-10" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfigurationModal 
        isOpen={showConfigModal} 
        onClose={() => setShowConfigModal(false)} 
      />
      <TrashModal 
        isOpen={showTrashModal} 
        onClose={() => setShowTrashModal(false)} 
      />
    </>
  );
}
