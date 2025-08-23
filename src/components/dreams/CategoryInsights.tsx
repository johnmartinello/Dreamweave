import { useState } from 'react';
import { ArrowLeft, BarChart3, PieChart } from 'lucide-react';
import { useDreamStore } from '../../store/dreamStore';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { CategoryAnalysis } from './CategoryAnalysis';
import { useI18n } from '../../hooks/useI18n';

type InsightView = 'overview' | 'analysis';

export function CategoryInsights() {
  const { t } = useI18n();
  const { setCurrentView, dreams } = useDreamStore();
  const [currentInsightView, setCurrentInsightView] = useState<InsightView>('overview');

  const insightViews = [
    {
      id: 'overview' as InsightView,
      label: t('overview'),
      icon: PieChart,
      description: t('tagOverviewDescription'),
      color: 'blue'
    },
    {
      id: 'analysis' as InsightView,
      label: t('detailedAnalysis'),
      icon: BarChart3,
      description: t('tagAnalysisDescription'),
      color: 'green'
    }
  ];

  const getCategoryStats = () => {
    const stats = {
      totalDreams: dreams.length,
      totalTags: 0,
      categoriesUsed: new Set<string>(),
      avgTagsPerDream: 0
    };

    dreams.forEach(dream => {
      stats.totalTags += dream.tags.length;
      dream.tags.forEach(tag => {
        stats.categoriesUsed.add(tag.categoryId);
      });
    });

    stats.avgTagsPerDream = stats.totalDreams > 0 ? stats.totalTags / stats.totalDreams : 0;
    return stats;
  };

  const stats = getCategoryStats();

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={() => setCurrentView('home')} 
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('back')}
            </Button>
            
            <h1 className="text-2xl font-bold text-white">{t('tagInsights')}</h1>
            
            <div className="text-sm text-gray-400">
              {t('totalDreams')}: {stats.totalDreams}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {currentInsightView === 'overview' && (
          <div className="max-w-6xl mx-auto px-6 py-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card variant="glass" className="p-6 text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">{stats.totalDreams}</div>
                <div className="text-gray-400">{t('totalDreams')}</div>
              </Card>
              
              <Card variant="glass" className="p-6 text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">{stats.totalTags}</div>
                <div className="text-gray-400">{t('totalTags')}</div>
              </Card>
              
              <Card variant="glass" className="p-6 text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">{stats.categoriesUsed.size}</div>
                <div className="text-gray-400">{t('categoriesUsed')}</div>
              </Card>
              
              <Card variant="glass" className="p-6 text-center">
                <div className="text-3xl font-bold text-orange-400 mb-2">{stats.avgTagsPerDream.toFixed(1)}</div>
                <div className="text-gray-400">{t('avgTagsPerDream')}</div>
              </Card>
            </div>

            {/* Insight Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {insightViews.slice(1).map(view => {
                const Icon = view.icon;
                return (
                  <Card 
                    key={view.id}
                    variant="glass" 
                    className="p-6 cursor-pointer hover:bg-white/10 transition-all duration-200 group"
                    onClick={() => setCurrentInsightView(view.id)}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-${view.color}-500/20 group-hover:bg-${view.color}-500/30 transition-colors`}>
                        <Icon className={`w-6 h-6 text-${view.color}-400`} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{view.label}</h3>
                        <p className="text-sm text-gray-400">{view.description}</p>
                      </div>
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full mt-4 group-hover:bg-white/10"
                    >
                      {t('explore')}
                    </Button>
                  </Card>
                );
              })}
            </div>

            {/* Quick Tips */}
            <Card variant="glass" className="mt-8 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">{t('insightsTips')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
                <div>
                  <h4 className="font-medium text-white mb-2">{t('understandingRelationships')}</h4>
                  <p>{t('relationshipsTip')}</p>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-2">{t('usingInsights')}</h4>
                  <p>{t('insightsUsageTip')}</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {currentInsightView === 'analysis' && (
          <div className="h-full overflow-auto">
            <div className="max-w-6xl mx-auto px-6 py-8">
              <div className="flex items-center gap-4 mb-6">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setCurrentInsightView('overview')}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {t('backToOverview')}
                </Button>
                <h2 className="text-xl font-semibold text-white">{t('detailedAnalysis')}</h2>
              </div>
              <CategoryAnalysis />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
