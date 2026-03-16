import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import EmergencyAlertIndicator from '../../components/ui/EmergencyAlertIndicator';
import ProgressIndicatorSystem from '../../components/ui/ProgressIndicatorSystem';
import ModuleCard from './components/ModuleCard';
import LearningPathway from './components/LearningPathway';
import GameificationPanel from './components/GameificationPanel';
import QuickAccessPanel from './components/QuickAccessPanel';
import FilterAndSearch from './components/FilterAndSearch';
import { useAppData } from '../../contexts/AppDataContext';
import { useAuth } from '../../contexts/AuthContext';

const allModules = [
  {
    id: 'earthquake-safety',
    title: 'Earthquake Safety & Preparedness',
    description: 'Learn comprehensive earthquake safety measures including drop, cover, and hold techniques. Understand seismic zones, building safety, emergency kits, and family response planning.',
    image: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg',
    icon: 'Mountain',
    difficulty: 'Beginner',
    estimatedTime: '45 min',
    lessonsCount: 8,
    enrolledCount: 15420,
    rating: 4.8,
    category: 'natural-disasters'
  },
  {
    id: 'flood-preparedness',
    title: 'Flood Preparedness & Response',
    description: 'Master flood preparedness strategies for monsoon seasons and urban flooding, including warning systems, evacuation procedures, and community response.',
    image: 'https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg',
    icon: 'Waves',
    difficulty: 'Beginner',
    estimatedTime: '35 min',
    lessonsCount: 6,
    enrolledCount: 12890,
    rating: 4.7,
    category: 'natural-disasters'
  },
  {
    id: 'fire-safety',
    title: 'Fire Safety & Prevention',
    description: 'Understand fire prevention, alarm response, extinguisher basics, and evacuation procedures for homes, schools, workplaces, and public spaces.',
    image: 'https://images.pexels.com/photos/266487/pexels-photo-266487.jpeg',
    icon: 'Flame',
    difficulty: 'Intermediate',
    estimatedTime: '40 min',
    lessonsCount: 7,
    enrolledCount: 18750,
    rating: 4.9,
    category: 'man-made-disasters'
  },
  {
    id: 'cyclone-awareness',
    title: 'Cyclone Awareness & Safety',
    description: 'Learn cyclone tracking, safety measures, evacuation strategies, and post-cyclone recovery for coastal and inland communities.',
    image: 'https://images.pexels.com/photos/1446076/pexels-photo-1446076.jpeg',
    icon: 'Wind',
    difficulty: 'Intermediate',
    estimatedTime: '50 min',
    lessonsCount: 9,
    enrolledCount: 9340,
    rating: 4.6,
    category: 'natural-disasters'
  },
  {
    id: 'first-aid-basics',
    title: 'First Aid & Emergency Medical Response',
    description: 'Build essential first-aid skills including CPR, wound care, trauma response, and coordination with emergency medical services.',
    image: 'https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg',
    icon: 'Heart',
    difficulty: 'Advanced',
    estimatedTime: '60 min',
    lessonsCount: 12,
    enrolledCount: 21560,
    rating: 4.9,
    category: 'first-aid'
  }
];

const bookmarkedContent = [
  {
    id: 'bookmark-1',
    title: 'Emergency Kit Checklist',
    type: 'Resource',
    moduleId: 'earthquake-safety',
    moduleName: 'Earthquake Safety'
  },
  {
    id: 'bookmark-2',
    title: 'CPR Techniques Video',
    type: 'Video',
    moduleId: 'first-aid-basics',
    moduleName: 'First Aid Basics'
  }
];

const DisasterLearningModules = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { progress, alerts, profile, updateModuleProgress } = useAppData();
  const [activeView, setActiveView] = useState('grid');
  const [filters, setFilters] = useState({
    searchTerm: '',
    difficulty: '',
    category: '',
    duration: '',
    sortBy: 'recommended'
  });

  const userProgress = progress.modules;
  const activeAlertCount = alerts.filter((alert) => !(alert?.acknowledgedBy || []).includes(user?.uid)).length;
  const latestAlert = alerts[0]
    ? {
        title: alerts[0].title,
        preview: `${alerts[0].description.substring(0, 100)}...`,
        time: new Date(alerts[0].timestamp).toLocaleTimeString('en-IN')
      }
    : null;

  const filteredModules = useMemo(() => {
    let filtered = [...allModules];

    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter((module) =>
        module.title.toLowerCase().includes(searchLower) ||
        module.description.toLowerCase().includes(searchLower)
      );
    }

    if (filters.difficulty) {
      filtered = filtered.filter((module) => module.difficulty === filters.difficulty);
    }

    if (filters.category) {
      filtered = filtered.filter((module) => module.category === filters.category);
    }

    if (filters.duration) {
      filtered = filtered.filter((module) => {
        const duration = parseInt(module.estimatedTime, 10);
        if (filters.duration === 'short') return duration < 30;
        if (filters.duration === 'medium') return duration >= 30 && duration <= 60;
        if (filters.duration === 'long') return duration > 60;
        return true;
      });
    }

    switch (filters.sortBy) {
      case 'newest':
        filtered.reverse();
        break;
      case 'popular':
        filtered.sort((a, b) => b.enrolledCount - a.enrolledCount);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'duration-asc':
        filtered.sort((a, b) => parseInt(a.estimatedTime, 10) - parseInt(b.estimatedTime, 10));
        break;
      case 'duration-desc':
        filtered.sort((a, b) => parseInt(b.estimatedTime, 10) - parseInt(a.estimatedTime, 10));
        break;
      default:
        break;
    }

    return filtered;
  }, [filters]);

  const userStats = useMemo(() => {
    const moduleEntries = Object.values(userProgress);
    const totalPoints = moduleEntries.reduce((sum, item) => sum + Math.round((item?.percentage || 0) * 10), 0);
    const completedCount = moduleEntries.filter((item) => item?.completed).length;

    return {
      totalPoints,
      level: Math.max(1, Math.floor(totalPoints / 500) + 1),
      badges: completedCount > 0 ? ['first-module'] : [],
      streak: completedCount,
      rank: completedCount >= 3 ? 'Prepared' : 'Getting Started',
      nextLevelPoints: Math.ceil((totalPoints + 1) / 500) * 500,
      weeklyGoal: 500,
      weeklyProgress: Math.min(totalPoints, 500)
    };
  }, [userProgress]);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleModuleOpen = async (moduleId) => {
    const existingProgress = userProgress?.[moduleId];
    if (!existingProgress?.percentage) {
      await updateModuleProgress(moduleId, {
        percentage: 10,
        completed: false
      });
    } else {
      await updateModuleProgress(moduleId, {
        percentage: existingProgress.percentage,
        completed: existingProgress.completed
      });
    }
  };

  const handleModuleSelect = async (moduleId) => {
    await handleModuleOpen(moduleId);
    navigate(`/disaster-learning-modules/${moduleId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Disaster Learning Modules - Disaster Preparedness and Response Education System</title>
      </Helmet>
      <Header userRole={profile?.role || 'public'} alertCount={activeAlertCount} onMenuToggle={() => {}} />
      <EmergencyAlertIndicator
        alertCount={activeAlertCount}
        alertLevel={activeAlertCount > 0 ? 'medium' : 'low'}
        latestAlert={latestAlert}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Disaster Learning Modules</h1>
              <p className="text-muted-foreground">
                Practical disaster preparedness education for students, families, institutions, and the wider public.
              </p>
            </div>

            <div className="flex items-center space-x-2 bg-muted rounded-lg p-1">
              <Button
                variant={activeView === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveView('grid')}
              >
                <Icon name="Grid3X3" size={16} className="mr-2" />
                Modules
              </Button>
              <Button
                variant={activeView === 'pathway' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveView('pathway')}
              >
                <Icon name="Route" size={16} className="mr-2" />
                Pathway
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="text-2xl font-bold text-card-foreground">{allModules.length}</div>
              <div className="text-xs text-muted-foreground">Total Modules</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="text-2xl font-bold text-card-foreground">
                {Object.values(userProgress).filter((item) => item?.completed).length}
              </div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="text-2xl font-bold text-card-foreground">
                {Object.values(userProgress).filter((item) => item?.percentage > 0 && !item?.completed).length}
              </div>
              <div className="text-xs text-muted-foreground">In Progress</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="text-2xl font-bold text-card-foreground">{userStats.totalPoints.toLocaleString('en-IN')}</div>
              <div className="text-xs text-muted-foreground">Preparedness Points</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            {activeView === 'grid' ? (
              <>
                <FilterAndSearch onFiltersChange={handleFiltersChange} totalModules={filteredModules.length} />

                <div className="mt-8">
                  {filteredModules.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {filteredModules.map((module) => (
                        <ModuleCard
                          key={module.id}
                          module={module}
                          userProgress={userProgress}
                          onOpen={handleModuleOpen}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">No modules found</h3>
                      <p className="text-muted-foreground mb-4">Try adjusting your search criteria or filters.</p>
                      <Button
                        variant="outline"
                        onClick={() => setFilters({
                          searchTerm: '',
                          difficulty: '',
                          category: '',
                          duration: '',
                          sortBy: 'recommended'
                        })}
                      >
                        Clear all filters
                      </Button>
                    </div>
                  )}
                </div>

                <div className="mt-8">
                  <ProgressIndicatorSystem userProgress={userProgress} horizontal />
                </div>
              </>
            ) : (
              <LearningPathway userProgress={userProgress} onModuleSelect={handleModuleSelect} />
            )}
          </div>

          <div className="lg:col-span-1 space-y-6">
            <QuickAccessPanel bookmarkedContent={bookmarkedContent} />
            <GameificationPanel userStats={userStats} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisasterLearningModules;
