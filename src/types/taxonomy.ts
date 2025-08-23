// Hierarchical taxonomy types and constants for DreamWeave tags

export type CategoryId =
  | 'emotions'
  | 'characters'
  | 'places'
  | 'actions'
  | 'objects'
  | 'dreamTypes'
  | 'uncategorized';

export type CategoryColor =
  | 'amber'
  | 'indigo'
  | 'blue'
  | 'orange'
  | 'teal'
  | 'pink'
  | 'violet'; // used for Uncategorized fallback

export interface CategoryMeta {
  id: CategoryId;
  label: string;
  color: CategoryColor;
}

export const CATEGORY_META: Record<Exclude<CategoryId, 'uncategorized'>, CategoryMeta> = {
  emotions: { id: 'emotions', label: 'Emotions & Moods', color: 'amber' },
  characters: { id: 'characters', label: 'Characters & Beings', color: 'indigo' },
  places: { id: 'places', label: 'Places & Environments', color: 'blue' },
  actions: { id: 'actions', label: 'Actions & Events', color: 'orange' },
  objects: { id: 'objects', label: 'Objects & Items', color: 'teal' },
  dreamTypes: { id: 'dreamTypes', label: 'Dream Types & Styles', color: 'pink' },
};

// Translation mapping for subcategories
export const SUBCATEGORY_TRANSLATIONS = {
  // Emotions
  'Positive': { en: 'Positive', pt: 'Positivo' },
  'Negative': { en: 'Negative', pt: 'Negativo' },
  'Complex States': { en: 'Complex States', pt: 'Estados Complexos' },
  
  // Characters
  'People': { en: 'People', pt: 'Pessoas' },
  'Animals': { en: 'Animals', pt: 'Animais' },
  'Mythical/Spiritual': { en: 'Mythical/Spiritual', pt: 'Mítico/Espiritual' },
  'Deceased/Memory Figures': { en: 'Deceased/Memory Figures', pt: 'Falecidos/Figuras da Memória' },
  
  // Places
  'Natural Settings': { en: 'Natural Settings', pt: 'Ambientes Naturais' },
  'Urban/Manmade': { en: 'Urban/Manmade', pt: 'Urbano/Construído' },
  'Cosmic/Unreal': { en: 'Cosmic/Unreal', pt: 'Cósmico/Irreal' },
  'Weather/Atmosphere': { en: 'Weather/Atmosphere', pt: 'Clima/Atmosfera' },
  
  // Actions
  'Movement': { en: 'Movement', pt: 'Movimento' },
  'Interactions': { en: 'Interactions', pt: 'Interações' },
  'Transformations': { en: 'Transformations', pt: 'Transformações' },
  'Unusual Events': { en: 'Unusual Events', pt: 'Eventos Incomuns' },
  
  // Objects
  'Everyday Objects': { en: 'Everyday Objects', pt: 'Objetos Cotidianos' },
  'Mystical/Unreal Items': { en: 'Mystical/Unreal Items', pt: 'Itens Místicos/Irreais' },
  'Technology/Machines': { en: 'Technology/Machines', pt: 'Tecnologia/Máquinas' },
  'Symbols/Signs': { en: 'Symbols/Signs', pt: 'Símbolos/Sinais' },
  
  // Dream Types
  'Lucidity': { en: 'Lucidity', pt: 'Lucidez' },
  'Tone': { en: 'Tone', pt: 'Tom' },
  'Purpose/Meaning': { en: 'Purpose/Meaning', pt: 'Propósito/Significado' },
  'Physical State': { en: 'Physical State', pt: 'Estado Físico' },
  
  // Uncategorized subcategory
  'Uncategorized': { en: 'Uncategorized', pt: 'Sem categoria' },
} as const;

// Helper function to get translated subcategory name
export function getTranslatedSubcategory(subcategory: string, language: 'en' | 'pt-BR' = 'en'): string {
  const translation = SUBCATEGORY_TRANSLATIONS[subcategory as keyof typeof SUBCATEGORY_TRANSLATIONS];
  if (!translation) return subcategory;
  return language === 'pt-BR' ? translation.pt : translation.en;
}

export const UNCATEGORIZED_META: CategoryMeta = {
  id: 'uncategorized',
  label: 'Uncategorized', // This will be translated via t() function
  color: 'violet',
};

export type EmotionsSubcategory = 'Positive' | 'Negative' | 'Complex States';
export type CharactersSubcategory = 'People' | 'Animals' | 'Mythical/Spiritual' | 'Deceased/Memory Figures';
export type PlacesSubcategory = 'Natural Settings' | 'Urban/Manmade' | 'Cosmic/Unreal' | 'Weather/Atmosphere';
export type ActionsSubcategory = 'Movement' | 'Interactions' | 'Transformations' | 'Unusual Events';
export type ObjectsSubcategory = 'Everyday Objects' | 'Mystical/Unreal Items' | 'Technology/Machines' | 'Symbols/Signs';
export type DreamTypesSubcategory = 'Lucidity' | 'Tone' | 'Purpose/Meaning' | 'Physical State';

export type SubcategoryId<C extends CategoryId = CategoryId> = C extends 'emotions'
  ? EmotionsSubcategory
  : C extends 'characters'
  ? CharactersSubcategory
  : C extends 'places'
  ? PlacesSubcategory
  : C extends 'actions'
  ? ActionsSubcategory
  : C extends 'objects'
  ? ObjectsSubcategory
  : C extends 'dreamTypes'
  ? DreamTypesSubcategory
  : 'Uncategorized'; // This will be translated via getTranslatedSubcategory()

export interface HierarchicalTag {
  id: string; // stable slug id: category/subcategory/label
  label: string; // e.g., "Flying", "City", "Fear"
  categoryId: CategoryId;
  subcategoryId: SubcategoryId;
  isCustom?: boolean;
}

export interface SuggestedTag extends Omit<HierarchicalTag, 'id'> {}

export function getCategoryColor(categoryId: string): CategoryColor {
  if (categoryId === 'uncategorized') return UNCATEGORIZED_META.color;
  const key = (Object.keys(CATEGORY_META) as Array<Exclude<CategoryId, 'uncategorized'>>)
    .find(k => k.toLowerCase() === String(categoryId).toLowerCase());
  if (key) return CATEGORY_META[key].color;
  return UNCATEGORIZED_META.color;
}

export function buildTagId(categoryId: CategoryId, subcategoryId: SubcategoryId, label: string): string {
  const slug = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9\s\-\/]/g, '')
      .replace(/\s+/g, '-')
      .replace(/\/+/, '/');
  // Keep exact categoryId (enum-safe) to avoid case mismatches like dreamTypes → dreamtypes
  // Slugify subcategory and label only
  return `${String(categoryId)}/${slug(String(subcategoryId))}/${slug(label)}`;
}

export const SUBCATEGORY_OPTIONS: Record<Exclude<CategoryId, 'uncategorized'>, Array<SubcategoryId>> = {
  emotions: ['Positive', 'Negative', 'Complex States'],
  characters: ['People', 'Animals', 'Mythical/Spiritual', 'Deceased/Memory Figures'],
  places: ['Natural Settings', 'Urban/Manmade', 'Cosmic/Unreal', 'Weather/Atmosphere'],
  actions: ['Movement', 'Interactions', 'Transformations', 'Unusual Events'],
  objects: ['Everyday Objects', 'Mystical/Unreal Items', 'Technology/Machines', 'Symbols/Signs'],
  dreamTypes: ['Lucidity', 'Tone', 'Purpose/Meaning', 'Physical State'],
};


