import { create } from 'zustand';
import type { Dream, DreamStore, TagWithColor, GraphData, GraphFilters } from '../types';
import { storage } from '../utils/storage';
import { AIService } from '../utils/aiService';
import { generateId } from '../utils';

// Available colors for tags - expanded range
const TAG_COLORS: Array<'cyan' | 'purple' | 'pink' | 'emerald' | 'amber' | 'blue' | 'indigo' | 'violet' | 'rose' | 'teal' | 'lime' | 'orange' | 'red' | 'green' | 'yellow'> = [
  'cyan', 'purple', 'pink', 'emerald', 'amber', 'blue', 'indigo', 'violet', 'rose', 'teal', 'lime', 'orange', 'red', 'green', 'yellow'
];

// Generate a consistent color for a tag based on its name
const getTagColor = (tagName: string): 'cyan' | 'purple' | 'pink' | 'emerald' | 'amber' | 'blue' | 'indigo' | 'violet' | 'rose' | 'teal' | 'lime' | 'orange' | 'red' | 'green' | 'yellow' => {
  const hash = tagName.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  return TAG_COLORS[Math.abs(hash) % TAG_COLORS.length];
};

export const useDreamStore = create<DreamStore>((set, get) => ({
  dreams: storage.getDreams(),
  trashedDreams: storage.getTrashedDreams(),
  selectedDreamId: null,
  currentView: 'home',
  selectedTag: null,
  searchQuery: '',
  dateRange: { startDate: null, endDate: null },
  aiConfig: storage.getAIConfig('gemini'),
  graphFilters: {
    dateRange: { startDate: null, endDate: null },
    selectedTags: [],
    showIsolated: true,
    layout: 'force'
  },

  addDream: (dreamData) => {
    const now = new Date().toISOString();
    const newDream: Dream = {
      ...dreamData,
      citedDreams: dreamData.citedDreams || [], // Initialize empty citations
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    
    set((state) => {
      const updatedDreams = [...state.dreams, newDream];
      storage.saveDreams(updatedDreams);
      return {
        dreams: updatedDreams,
        selectedDreamId: newDream.id,
        currentView: 'dream',
      };
    });
  },

  updateDream: (id, updates) => {
    set((state) => {
      const updatedDreams = state.dreams.map((dream) =>
        dream.id === id
          ? { ...dream, ...updates, updatedAt: new Date().toISOString() }
          : dream
      );
      storage.saveDreams(updatedDreams);
      return { dreams: updatedDreams };
    });
  },

  deleteDream: (id) => {
    set((state) => {
      const dreamToDelete = state.dreams.find(dream => dream.id === id);
      if (!dreamToDelete) return state;

      // Move dream to trash instead of permanent deletion
      const trashedDream = {
        ...dreamToDelete,
        deletedAt: new Date().toISOString()
      };

      const updatedDreams = state.dreams.filter((dream) => dream.id !== id);
      const updatedTrashedDreams = [...state.trashedDreams, trashedDream];

      storage.saveDreams(updatedDreams);
      storage.saveTrashedDreams(updatedTrashedDreams);

      return {
        dreams: updatedDreams,
        trashedDreams: updatedTrashedDreams,
        selectedDreamId: state.selectedDreamId === id ? null : state.selectedDreamId,
        currentView: state.selectedDreamId === id ? 'home' : state.currentView,
      };
    });
  },

  restoreDream: (id) => {
    set((state) => {
      const dreamToRestore = state.trashedDreams.find(dream => dream.id === id);
      if (!dreamToRestore) return state;

      // Remove deletedAt field and move back to dreams
      const { deletedAt, ...restoredDream } = dreamToRestore;
      const updatedTrashedDreams = state.trashedDreams.filter((dream) => dream.id !== id);
      const updatedDreams = [...state.dreams, restoredDream];

      storage.saveDreams(updatedDreams);
      storage.saveTrashedDreams(updatedTrashedDreams);

      return {
        dreams: updatedDreams,
        trashedDreams: updatedTrashedDreams,
      };
    });
  },

  permanentlyDeleteDream: (id) => {
    set((state) => {
      const updatedTrashedDreams = state.trashedDreams.filter((dream) => dream.id !== id);
      storage.saveTrashedDreams(updatedTrashedDreams);
      return {
        trashedDreams: updatedTrashedDreams,
      };
    });
  },

  clearTrash: () => {
    set(() => {
      storage.saveTrashedDreams([]);
      return {
        trashedDreams: [],
      };
    });
  },

  getTrashedDreams: () => {
    return get().trashedDreams;
  },

  setSelectedDream: (id) => {
    set({
      selectedDreamId: id,
      currentView: id ? 'dream' : 'home',
    });
  },

  setCurrentView: (view) => {
    set({
      currentView: view,
      selectedDreamId: view === 'home' || view === 'graph' ? null : get().selectedDreamId,
    });
  },

  setSelectedTag: (tag) => {
    set({
      selectedTag: tag,
      currentView: 'home',
    });
  },

  setSearchQuery: (query) => {
    set({
      searchQuery: query,
      currentView: 'home',
    });
  },

  setDateRange: (startDate: string | null, endDate: string | null) => {
    set({
      dateRange: { startDate, endDate },
      currentView: 'home',
    });
  },

  updateAIConfig: (config) => {
    set((state) => {
      const updatedConfig = { ...state.aiConfig, ...config };
      storage.saveAIConfig(updatedConfig);
      return { aiConfig: updatedConfig };
    });
  },

  setAIProvider: (provider: 'gemini' | 'lmstudio') => {
    set(() => {
      const newConfig = storage.getAIConfig(provider);
      return { aiConfig: newConfig };
    });
  },

  generateAITags: async (dreamContent: string) => {
    const { aiConfig } = get();
    
    if (!aiConfig.enabled) {
      throw new Error('AI is disabled');
    }

    const result = await AIService.generateTags({
      content: dreamContent,
      config: aiConfig,
    });

    if (result.error) {
      throw new Error(result.error);
    }

    return result.tags;
  },

  generateAITitle: async (dreamContent: string) => {
    const { aiConfig } = get();
    
    if (!aiConfig.enabled) {
      throw new Error('AI is disabled');
    }

    const result = await AIService.generateTitle({
      content: dreamContent,
      config: aiConfig,
    });

    if (result.error) {
      throw new Error(result.error);
    }

    return result.title;
  },

  getFilteredDreams: () => {
    const { dreams, selectedTag, searchQuery, dateRange } = get();
    let filteredDreams = dreams;

    // Filter by tag if selected
    if (selectedTag) {
      filteredDreams = filteredDreams.filter((dream) => dream.tags.includes(selectedTag));
    }

    // Filter by search query if provided
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filteredDreams = filteredDreams.filter((dream) => 
        dream.title.toLowerCase().includes(query) ||
        dream.description.toLowerCase().includes(query) ||
        dream.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Filter by date range if provided
    if (dateRange.startDate || dateRange.endDate) {
      filteredDreams = filteredDreams.filter((dream) => {
        const dreamDate = dream.date;
        
        if (dateRange.startDate && dateRange.endDate) {
          return dreamDate >= dateRange.startDate && dreamDate <= dateRange.endDate;
        } else if (dateRange.startDate) {
          return dreamDate >= dateRange.startDate;
        } else if (dateRange.endDate) {
          return dreamDate <= dateRange.endDate;
        }
        
        return true;
      });
    }

    return filteredDreams;
  },

  getAllTags: () => {
    const { dreams } = get();
    const tagCounts: Record<string, number> = {};
    
    dreams.forEach((dream) => {
      dream.tags.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    return Object.entries(tagCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  },

  getAllTagsWithColors: (): TagWithColor[] => {
    const { dreams } = get();
    const tagCounts: Record<string, number> = {};
    
    dreams.forEach((dream) => {
      dream.tags.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    return Object.entries(tagCounts)
      .map(([name, count]) => ({ 
        name, 
        count, 
        color: getTagColor(name)
      }))
      .sort((a, b) => b.count - a.count);
  },

  getTagColor: (tagName: string) => {
    return getTagColor(tagName);
  },

  // Citation methods
  addCitation: (dreamId: string, citedDreamId: string) => {
    const { dreams } = get();
    const dream = dreams.find(d => d.id === dreamId);
    const citedDream = dreams.find(d => d.id === citedDreamId);
    
    if (!dream || !citedDream) return;
    
    // Prevent self-citation
    if (dreamId === citedDreamId) return;
    
    // Prevent duplicate citations
    if (dream.citedDreams.includes(citedDreamId)) return;
    
    set((state) => {
      const updatedDreams = state.dreams.map((d) =>
        d.id === dreamId
          ? { ...d, citedDreams: [...d.citedDreams, citedDreamId], updatedAt: new Date().toISOString() }
          : d
      );
      storage.saveDreams(updatedDreams);
      return { dreams: updatedDreams };
    });
  },

  removeCitation: (dreamId: string, citedDreamId: string) => {
    set((state) => {
      const updatedDreams = state.dreams.map((d) =>
        d.id === dreamId
          ? { ...d, citedDreams: d.citedDreams.filter(id => id !== citedDreamId), updatedAt: new Date().toISOString() }
          : d
      );
      storage.saveDreams(updatedDreams);
      return { dreams: updatedDreams };
    });
  },

  getCitedDreams: (dreamId: string) => {
    const { dreams } = get();
    const dream = dreams.find(d => d.id === dreamId);
    if (!dream) return [];
    return dreams.filter(d => dream.citedDreams.includes(d.id));
  },

  getDreamsThatCite: (dreamId: string) => {
    const { dreams } = get();
    return dreams.filter(d => d.citedDreams.includes(dreamId));
  },

  // Graph methods
  getGraphData: (): GraphData => {
    const { dreams, graphFilters } = get();
    
    // Apply filters
    let filteredDreams = dreams;
    
    // Filter by date range
    if (graphFilters.dateRange.startDate || graphFilters.dateRange.endDate) {
      filteredDreams = filteredDreams.filter((dream) => {
        const dreamDate = dream.date;
        
        if (graphFilters.dateRange.startDate && graphFilters.dateRange.endDate) {
          return dreamDate >= graphFilters.dateRange.startDate && dreamDate <= graphFilters.dateRange.endDate;
        } else if (graphFilters.dateRange.startDate) {
          return dreamDate >= graphFilters.dateRange.startDate;
        } else if (graphFilters.dateRange.endDate) {
          return dreamDate <= graphFilters.dateRange.endDate;
        }
        
        return true;
      });
    }
    
    // Filter by tags
    if (graphFilters.selectedTags.length > 0) {
      filteredDreams = filteredDreams.filter((dream) =>
        graphFilters.selectedTags.some(tag => dream.tags.includes(tag))
      );
    }
    
    // Filter out isolated dreams if needed
    if (!graphFilters.showIsolated) {
      filteredDreams = filteredDreams.filter((dream) =>
        dream.citedDreams.length > 0 || get().getDreamsThatCite(dream.id).length > 0
      );
    }
    
    // Create nodes
    const nodes = filteredDreams.map((dream) => ({
      id: dream.id,
      title: dream.title,
      date: dream.date,
      tags: dream.tags,
      citedDreams: dream.citedDreams,
      citationCount: get().getDreamsThatCite(dream.id).length,
    }));
    
    // Create edges
    const edges: { source: string; target: string; strength: number }[] = [];
    filteredDreams.forEach((dream) => {
      dream.citedDreams.forEach((citedDreamId) => {
        // Only create edge if the cited dream is also in the filtered set
        if (filteredDreams.some(d => d.id === citedDreamId)) {
          edges.push({
            source: dream.id,
            target: citedDreamId,
            strength: 1
          });
        }
      });
    });
    
    return { nodes, edges };
  },

  updateGraphFilters: (filters: Partial<GraphFilters>) => {
    set((state) => ({
      graphFilters: { ...state.graphFilters, ...filters }
    }));
  },

  getDreamById: (id: string) => {
    const { dreams } = get();
    return dreams.find(d => d.id === id);
  },
}));
