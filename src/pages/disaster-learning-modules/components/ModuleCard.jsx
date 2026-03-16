import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ModuleCard = ({ module, userProgress = {}, onOpen = null }) => {
  const navigate = useNavigate();
  
  const progress = userProgress?.[module.id]?.percentage || 0;
  const isCompleted = userProgress?.[module.id]?.completed || false;
  const lastAccessed = userProgress?.[module.id]?.lastAccessed;

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-success/10 text-success border-success/20';
      case 'Intermediate':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'Advanced':
        return 'bg-error/10 text-error border-error/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 100) return 'bg-success';
    if (percentage >= 75) return 'bg-primary';
    if (percentage >= 50) return 'bg-warning';
    return 'bg-muted-foreground';
  };

  const handleModuleClick = async () => {
    if (onOpen) {
      await onOpen(module.id);
    }

    if (module.id === 'fire-safety') {
      navigate('/disaster-learning-modules/fire-safety');
    } else if (module.id === 'earthquake-safety') {
      navigate('/disaster-learning-modules/earthquake-safety');
    } else {
      navigate(`/disaster-learning-modules/${module.id}`);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-soft hover:shadow-elevated transition-smooth overflow-hidden group">
      {/* Module Image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={module.image}
          alt={module.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Progress Overlay */}
        {progress > 0 && (
          <div className="absolute top-4 right-4">
            <div className="w-12 h-12 bg-surface/90 rounded-full flex items-center justify-center">
              <div className="relative w-10 h-10">
                <svg className="w-10 h-10 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeDasharray="100, 100"
                    className="text-muted"
                  />
                  <path
                    d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeDasharray={`${progress}, 100`}
                    className={getProgressColor(progress)}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-medium text-foreground">
                    {Math.round(progress)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Completion Badge */}
        {isCompleted && (
          <div className="absolute top-4 left-4">
            <div className="bg-success text-success-foreground px-2 py-1 rounded-full flex items-center space-x-1 text-xs font-medium">
              <Icon name="CheckCircle" size={14} />
              <span>Completed</span>
            </div>
          </div>
        )}

        {/* Difficulty Badge */}
        <div className="absolute bottom-4 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(module.difficulty)}`}>
            {module.difficulty}
          </span>
        </div>
      </div>
      {/* Module Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name={module.icon} size={16} className="text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-quick">
                {module.title}
              </h3>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
                <Icon name="Clock" size={12} />
                <span>{module.estimatedTime}</span>
                <span>•</span>
                <span>{module.lessonsCount} lessons</span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
          {module.description}
        </p>

        {/* Module Stats */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Icon name="Users" size={12} />
              <span>{module.enrolledCount?.toLocaleString('en-IN')} enrolled</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Star" size={12} />
              <span>{module.rating}</span>
            </div>
          </div>
          {lastAccessed && (
            <div className="text-xs text-muted-foreground">
              Last accessed: {new Date(lastAccessed)?.toLocaleDateString('en-IN')}
            </div>
          )}
        </div>

        {/* Progress Bar */}
        {progress > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <span>Progress</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(progress)}`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Action Button */}
        <Button
          variant="default"
          fullWidth
          onClick={handleModuleClick}
          className="group-hover:shadow-soft transition-smooth"
        >
          
            <>
              <Icon name="BookOpen" size={16} className="mr-2" />
              Start Learning
            </>
          
        </Button>
      </div>
    </div>
  );
};

export default ModuleCard;
