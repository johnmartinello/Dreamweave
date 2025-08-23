import { useState, useMemo } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useDreamStore } from '../../store/dreamStore';
import { CATEGORY_META, UNCATEGORIZED_META, getTranslatedSubcategory } from '../../types/taxonomy';
import { useI18n } from '../../hooks/useI18n';
import { cn } from '../../utils';

interface TagStats {
  id: string;
  label: string;
  categoryId: string;
  subcategoryId: string;
  categoryLabel: string;
  subcategoryLabel: string;
  color: string;
  count: number;
  percentage: number;
  avgPerDream: number;
  coOccurrences: Record<string, number>;
  isCustom: boolean;
}

interface TagRelationship {
  source: string;
  target: string;
  sourceLabel: string;
  targetLabel: string;
  sourceCategory: string;
  targetCategory: string;
  sourceSubcategory: string;
  targetSubcategory: string;
  strength: number;
  count: number;
}

interface CategoryTagSummary {
  categoryId: string;
  categoryLabel: string;
  color: string;
  totalTags: number;
  totalUsage: number;
  mostUsedTags: TagStats[];
  subcategoryBreakdown: Record<string, { count: number; tags: TagStats[] }>;
}

export function CategoryAnalysis() {
  const { t, language } = useI18n();
  const { dreams } = useDreamStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'tags' | 'relationships' | 'categories' | 'trends'>('overview');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);

  // Calculate tag statistics
  const tagStats = useMemo((): TagStats[] => {
    const stats: Record<string, TagStats> = {};
    const totalDreams = dreams.length;

    // Calculate statistics from dreams
    dreams.forEach(dream => {
      const dreamTags = new Set<string>();
      
      dream.tags.forEach(tag => {
        const tagId = tag.id;
        if (!stats[tagId]) {
          const categoryMeta = tag.categoryId === 'uncategorized' ? UNCATEGORIZED_META : CATEGORY_META[tag.categoryId as keyof typeof CATEGORY_META];
          const subcategoryLabel = getTranslatedSubcategory(String(tag.subcategoryId), language);
          
          stats[tagId] = {
            id: tagId,
            label: tag.label,
            categoryId: tag.categoryId,
            subcategoryId: tag.subcategoryId,
            categoryLabel: t(`categoryNames.${tag.categoryId}`),
            subcategoryLabel,
            color: categoryMeta.color,
            count: 0,
            percentage: 0,
            avgPerDream: 0,
            coOccurrences: {},
            isCustom: tag.isCustom || false
          };
        }
        
        stats[tagId].count++;
        dreamTags.add(tagId);
      });

      // Calculate co-occurrences between tags
      const tagArray = Array.from(dreamTags);
      tagArray.forEach((tag1, i) => {
        tagArray.slice(i + 1).forEach(tag2 => {
          stats[tag1].coOccurrences[tag2] = (stats[tag1].coOccurrences[tag2] || 0) + 1;
          stats[tag2].coOccurrences[tag1] = (stats[tag2].coOccurrences[tag1] || 0) + 1;
        });
      });
    });

    // Calculate percentages and averages
    Object.values(stats).forEach(stat => {
      stat.percentage = totalDreams > 0 ? (stat.count / totalDreams) * 100 : 0;
      stat.avgPerDream = stat.count > 0 ? stat.count / totalDreams : 0;
    });

    return Object.values(stats).sort((a, b) => b.count - a.count);
  }, [dreams, language, t]);

  // Calculate tag relationships
  const tagRelationships = useMemo((): TagRelationship[] => {
    const relationships: TagRelationship[] = [];
    const processed = new Set<string>();

    tagStats.forEach(stat1 => {
      tagStats.forEach(stat2 => {
        if (stat1.id === stat2.id) return;
        
        const key = [stat1.id, stat2.id].sort().join('-');
        if (processed.has(key)) return;
        processed.add(key);

        const coOccurrenceCount = stat1.coOccurrences[stat2.id] || 0;
        if (coOccurrenceCount > 0) {
          const strength = coOccurrenceCount / Math.min(stat1.count, stat2.count);
          relationships.push({
            source: stat1.id,
            target: stat2.id,
            sourceLabel: stat1.label,
            targetLabel: stat2.label,
            sourceCategory: stat1.categoryId,
            targetCategory: stat2.categoryId,
            sourceSubcategory: stat1.subcategoryId,
            targetSubcategory: stat2.subcategoryId,
            strength,
            count: coOccurrenceCount
          });
        }
      });
    });

    return relationships.sort((a, b) => b.strength - a.strength);
  }, [tagStats]);

  // Calculate category summaries
  const categorySummaries = useMemo((): CategoryTagSummary[] => {
    const summaries: Record<string, CategoryTagSummary> = {};

    // Initialize summaries
    Object.values(CATEGORY_META).forEach(meta => {
      summaries[meta.id] = {
        categoryId: meta.id,
        categoryLabel: t(`categoryNames.${meta.id}`),
        color: meta.color,
        totalTags: 0,
        totalUsage: 0,
        mostUsedTags: [],
        subcategoryBreakdown: {}
      };
    });

    // Add uncategorized
    summaries.uncategorized = {
      categoryId: 'uncategorized',
      categoryLabel: t('categoryNames.uncategorized'),
      color: UNCATEGORIZED_META.color,
      totalTags: 0,
      totalUsage: 0,
      mostUsedTags: [],
      subcategoryBreakdown: {}
    };

    // Calculate summaries from tag stats
    tagStats.forEach(tag => {
      const summary = summaries[tag.categoryId];
      if (summary) {
        summary.totalTags++;
        summary.totalUsage += tag.count;
        summary.mostUsedTags.push(tag);
        
        if (!summary.subcategoryBreakdown[tag.subcategoryId]) {
          summary.subcategoryBreakdown[tag.subcategoryId] = { count: 0, tags: [] };
        }
        summary.subcategoryBreakdown[tag.subcategoryId].count += tag.count;
        summary.subcategoryBreakdown[tag.subcategoryId].tags.push(tag);
      }
    });

    // Sort most used tags and limit to top 5
    Object.values(summaries).forEach(summary => {
      summary.mostUsedTags.sort((a, b) => b.count - a.count).splice(5);
    });

    return Object.values(summaries).sort((a, b) => b.totalUsage - a.totalUsage);
  }, [tagStats, language, t]);

  // Get filtered tags based on selection
  const filteredTags = useMemo(() => {
    let filtered = tagStats;
    
    if (selectedCategory) {
      filtered = filtered.filter(tag => tag.categoryId === selectedCategory);
    }
    
    if (selectedSubcategory) {
      filtered = filtered.filter(tag => tag.subcategoryId === selectedSubcategory);
    }
    
    return filtered;
  }, [tagStats, selectedCategory, selectedSubcategory]);

  // Get color for category
  const getCategoryColor = (colorName: string) => {
    const colorMap: Record<string, string> = {
      amber: '#f59e0b',
      indigo: '#6366f1',
      blue: '#3b82f6',
      orange: '#f97316',
      teal: '#14b8a6',
      pink: '#ec4899',
      violet: '#8b5cf6',
      gray: '#6b7280'
    };
    
    return colorMap[colorName] || '#6b7280';
  };

  const tabs = [
    { id: 'overview', label: t('overview') },
    { id: 'tags', label: t('tags') },
    { id: 'relationships', label: t('relationships') },
    { id: 'categories', label: t('categories') },
    { id: 'trends', label: t('trends') }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">{t('tagAnalysis')}</h2>
        <div className="text-sm text-gray-400">
          {t('totalTags')}: {tagStats.length} | {t('totalDreams')}: {dreams.length}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-white/5 rounded-lg p-1">
        {tabs.map(tab => (
          <Button
            key={tab.id}
            variant="ghost"
            size="sm"
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex items-center gap-2",
              activeTab === tab.id 
                ? "glass text-white/90 font-medium shadow-inner-lg border border-white/20"
                : "text-white/60 hover:glass hover:text-white/90 hover:font-medium hover:shadow-inner-lg hover:border-white/20"
            )}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card variant="glass" className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">{tagStats.length}</div>
              <div className="text-gray-400">{t('uniqueTags')}</div>
            </Card>
            
            <Card variant="glass" className="p-6 text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">
                {tagStats.reduce((sum, tag) => sum + tag.count, 0)}
              </div>
              <div className="text-gray-400">{t('totalTagUsage')}</div>
            </Card>
            
            <Card variant="glass" className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">
                {tagStats.filter(tag => tag.isCustom).length}
              </div>
              <div className="text-gray-400">{t('customTags')}</div>
            </Card>
            
            <Card variant="glass" className="p-6 text-center">
              <div className="text-3xl font-bold text-orange-400 mb-2">
                {(tagStats.reduce((sum, tag) => sum + tag.count, 0) / dreams.length).toFixed(1)}
              </div>
              <div className="text-gray-400">{t('avgTagsPerDream')}</div>
            </Card>
          </div>
        )}

        {activeTab === 'tags' && (
          <div className="space-y-6">
            {/* Filters */}
            <Card variant="glass" className="p-4">
              <div className="flex flex-wrap gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">{t('filterByCategory')}</label>
                  <select
                    value={selectedCategory || ''}
                    onChange={(e) => setSelectedCategory(e.target.value || null)}
                    className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all duration-200 [&>option]:bg-gray-800 [&>option]:text-white"
                  >
                    <option value="">{t('allCategories')}</option>
                    {categorySummaries.map(summary => (
                      <option key={summary.categoryId} value={summary.categoryId}>
                        {summary.categoryLabel}
                      </option>
                    ))}
                  </select>
                </div>
                
                {selectedCategory && (
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">{t('filterBySubcategory')}</label>
                    <select
                      value={selectedSubcategory || ''}
                      onChange={(e) => setSelectedSubcategory(e.target.value || null)}
                      className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all duration-200 [&>option]:bg-gray-800 [&>option]:text-white"
                    >
                      <option value="">{t('allSubcategories')}</option>
                      {Object.keys(categorySummaries.find(s => s.categoryId === selectedCategory)?.subcategoryBreakdown || {}).map(sub => (
                        <option key={sub} value={sub}>{getTranslatedSubcategory(sub, language)}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </Card>

            {/* Tag List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTags.slice(0, 20).map(tag => (
                <Card key={tag.id} variant="glass" className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-white truncate">{tag.label}</h3>
                    <div 
                      className="w-4 h-4 rounded-full flex-shrink-0"
                      style={{ backgroundColor: getCategoryColor(tag.color) }}
                    />
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">{t('category')}:</span>
                      <span className="text-white">{tag.categoryLabel}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-400">{t('subcategory')}:</span>
                      <span className="text-white">{getTranslatedSubcategory(String(tag.subcategoryId), language)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-400">{t('usage')}:</span>
                      <span className="text-white font-medium">{tag.count}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-400">{t('percentage')}:</span>
                      <span className="text-white font-medium">{tag.percentage.toFixed(1)}%</span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>{t('usage')}</span>
                      <span>{tag.percentage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${Math.min(tag.percentage * 2, 100)}%`,
                          backgroundColor: getCategoryColor(tag.color)
                        }}
                      />
                    </div>
                  </div>

                  {tag.isCustom && (
                    <div className="mt-3 text-xs text-purple-400 font-medium">
                      {t('customTag')}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'relationships' && (
          <div className="space-y-6">
            <Card variant="glass" className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">{t('tagCoOccurrences')}</h3>
              
              <div className="space-y-4">
                {tagRelationships.slice(0, 15).map((rel, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: getCategoryColor(categorySummaries.find(s => s.categoryId === rel.sourceCategory)?.color || 'gray') }}
                      />
                      <span className="text-white font-medium">{rel.sourceLabel}</span>
                      <span className="text-gray-400 text-xs">({getTranslatedSubcategory(String(rel.sourceSubcategory), language)})</span>
                      <span className="text-gray-400">→</span>
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: getCategoryColor(categorySummaries.find(s => s.categoryId === rel.targetCategory)?.color || 'gray') }}
                      />
                      <span className="text-white font-medium">{rel.targetLabel}</span>
                      <span className="text-gray-400 text-xs">({getTranslatedSubcategory(String(rel.targetSubcategory), language)})</span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-gray-400">{t('coOccurrences')}: {rel.count}</span>
                      <span className="text-gray-400">{t('strength')}: {(rel.strength * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="space-y-6">
            {categorySummaries.map(summary => (
              <Card key={summary.categoryId} variant="glass" className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-6 h-6 rounded-full"
                      style={{ backgroundColor: getCategoryColor(summary.color) }}
                    />
                    <h3 className="text-lg font-semibold text-white">{summary.categoryLabel}</h3>
                  </div>
                  <div className="text-sm text-gray-400">
                    {summary.totalTags} {t('tags')} | {summary.totalUsage} {t('uses')}
                  </div>
                </div>

                {/* Most Used Tags */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-300 mb-3">{t('mostUsedTags')}</h4>
                  <div className="flex flex-wrap gap-2">
                    {summary.mostUsedTags.map(tag => (
                      <div
                        key={tag.id}
                        className="px-3 py-1 bg-white/10 rounded-full text-sm text-white border border-white/20"
                      >
                        {tag.label} ({tag.count})
                      </div>
                    ))}
                  </div>
                </div>

                {/* Subcategory Breakdown */}
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-3">{t('subcategoryBreakdown')}</h4>
                  <div className="space-y-2">
                    {Object.entries(summary.subcategoryBreakdown)
                      .sort(([,a], [,b]) => b.count - a.count)
                      .map(([subcategory, data]) => (
                        <div key={subcategory} className="flex items-center justify-between p-2 bg-white/5 rounded">
                          <span className="text-sm text-white">{getTranslatedSubcategory(subcategory, language)}</span>
                          <span className="text-sm text-gray-400">{data.count} {t('uses')}</span>
                        </div>
                      ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'trends' && (
          <Card variant="glass" className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">{t('tagTrends')}</h3>
            <p className="text-gray-400">{t('trendsComingSoon')}</p>
          </Card>
        )}
      </div>
    </div>
  );
}
