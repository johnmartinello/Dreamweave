export interface Dream {
  id: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  citedDreams: string[]; // Array of dream IDs that this dream cites
  createdAt: string;
  updatedAt: string;
  deletedAt?: string; // When the dream was moved to trash
}

export interface Tag {
  name: string;
  count: number;
}

export interface TagWithColor {
  name: string;
  count: number;
  color: 'cyan' | 'purple' | 'pink' | 'emerald' | 'amber' | 'blue' | 'indigo' | 'violet' | 'rose' | 'teal' | 'lime' | 'orange' | 'red' | 'green' | 'yellow';
}

export type ViewType = 'home' | 'dream' | 'graph';

export type AIProvider = 'gemini' | 'lmstudio';

export interface AIConfig {
  enabled: boolean;
  provider: AIProvider;
  apiKey: string;
  completionEndpoint: string;
  modelName: string;
}

// Graph-related types
export interface GraphNode {
  id: string;
  title: string;
  date: string;
  tags: string[];
  citedDreams: string[];
  citationCount: number; // How many dreams cite this dream
  x?: number;
  y?: number;
}

export interface GraphEdge {
  source: string;
  target: string;
  strength: number; // Could be used for edge thickness
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface GraphFilters {
  dateRange: { startDate: string | null; endDate: string | null };
  selectedTags: string[];
  showIsolated: boolean;
  layout: 'force' | 'hierarchical' | 'circular';
}

// Password protection types
export interface PasswordConfig {
  isEnabled: boolean;
  autoLockTimeout: number; // in minutes
  lastActivity: number; // timestamp
  failedAttempts: number; // track failed password attempts
}

export interface PasswordStore {
  isLocked: boolean;
  isFirstLaunch: boolean;
  passwordHash: string | null;
  config: PasswordConfig;
  
  // Actions
  setPassword: (password: string) => void;
  verifyPassword: (password: string) => Promise<boolean>;
  lock: () => void;
  unlock: () => void;
  updateActivity: () => void;
  checkAutoLock: () => boolean;
  resetPassword: () => void;
  updateConfig: (config: Partial<PasswordConfig>) => void;
}

export interface DreamStore {
  dreams: Dream[];
  trashedDreams: Dream[]; // Array of dreams in trash
  selectedDreamId: string | null;
  currentView: ViewType;
  selectedTag: string | null;
  searchQuery: string;
  dateRange: { startDate: string | null; endDate: string | null };
  aiConfig: AIConfig;
  graphFilters: GraphFilters;
  
  // Actions
  addDream: (dream: Omit<Dream, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateDream: (id: string, updates: Partial<Omit<Dream, 'id' | 'createdAt'>>) => void;
  deleteDream: (id: string) => void;
  restoreDream: (id: string) => void;
  permanentlyDeleteDream: (id: string) => void;
  clearTrash: () => void;
  getTrashedDreams: () => Dream[];
  setSelectedDream: (id: string | null) => void;
  setCurrentView: (view: ViewType) => void;
  setSelectedTag: (tag: string | null) => void;
  setSearchQuery: (query: string) => void;
  setDateRange: (startDate: string | null, endDate: string | null) => void;
  getFilteredDreams: () => Dream[];
  getAllTags: () => Tag[];
  getAllTagsWithColors: () => TagWithColor[];
  getTagColor: (tagName: string) => 'cyan' | 'purple' | 'pink' | 'emerald' | 'amber' | 'blue' | 'indigo' | 'violet' | 'rose' | 'teal' | 'lime' | 'orange' | 'red' | 'green' | 'yellow';
  updateAIConfig: (config: Partial<AIConfig>) => void;
  setAIProvider: (provider: AIProvider) => void;
  generateAITags: (dreamContent: string) => Promise<string[]>;
  
  // Citation methods
  addCitation: (dreamId: string, citedDreamId: string) => void;
  removeCitation: (dreamId: string, citedDreamId: string) => void;
  getCitedDreams: (dreamId: string) => Dream[];
  getDreamsThatCite: (dreamId: string) => Dream[];
  
  // Graph methods
  getGraphData: () => GraphData;
  updateGraphFilters: (filters: Partial<GraphFilters>) => void;
  getDreamById: (id: string) => Dream | undefined;
}
