import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AssessmentCard = ({
  assessment,
  onStart,
  onContinue,
  onViewResults,
  onCardClick,
  className = ''
}) => {
  const getStatusColor = () => {
    switch (assessment?.status) {
      case 'completed':
        return 'text-success';
      case 'in-progress':
        return 'text-warning';
      case 'not-started':
        return 'text-muted-foreground';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusIcon = () => {
    switch (assessment?.status) {
      case 'completed':
        return 'CheckCircle';
      case 'in-progress':
        return 'Clock';
      case 'not-started':
        return 'Play';
      default:
        return 'FileText';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-success/10 text-success';
      case 'Intermediate':
        return 'bg-warning/10 text-warning';
      case 'Advanced':
        return 'bg-error/10 text-error';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const renderActionButton = () => {
    switch (assessment?.status) {
      case 'completed':
        return (
          <Button
            variant="outline"
            onClick={(event) => {
              event.stopPropagation();
              onViewResults(assessment?.id);
            }}
            iconName="Eye"
            iconPosition="left"
          >
            View Results
          </Button>
        );
      case 'in-progress':
        return (
          <Button
            variant="default"
            onClick={(event) => {
              event.stopPropagation();
              onContinue(assessment?.id);
            }}
            iconName="Play"
            iconPosition="left"
          >
            Continue
          </Button>
        );
      default:
        return (
          <Button
            variant="default"
            onClick={(event) => {
              event.stopPropagation();
              onStart(assessment?.id);
            }}
            iconName="Play"
            iconPosition="left"
          >
            Start Assessment
          </Button>
        );
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onCardClick?.(assessment)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onCardClick?.(assessment);
        }
      }}
      className={`bg-card border border-border rounded-lg p-6 hover:shadow-soft transition-smooth cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30 ${className}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
            assessment?.status === 'completed' ? 'bg-success/10' : 'bg-primary/10'
          }`}>
            <Icon
              name={assessment?.icon}
              size={24}
              color={assessment?.status === 'completed' ? 'var(--color-success)' : 'var(--color-primary)'}
            />
          </div>
          <div>
            <h3 className="font-semibold text-card-foreground">{assessment?.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{assessment?.description}</p>
          </div>
        </div>
        <div className={`flex items-center space-x-2 ${getStatusColor()}`}>
          <Icon name={getStatusIcon()} size={18} />
          <span className="text-sm font-medium capitalize">{assessment?.status?.replace('-', ' ')}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="text-center">
          <div className="text-lg font-bold text-card-foreground">{assessment?.questions}</div>
          <div className="text-xs text-muted-foreground">Questions</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-card-foreground">{assessment?.duration}</div>
          <div className="text-xs text-muted-foreground">Duration</div>
        </div>
        <div className="text-center">
          <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(assessment?.difficulty)}`}>
            {assessment?.difficulty}
          </span>
        </div>
        <div className="text-center">
          {assessment?.score !== null && (
            <>
              <div className={`text-lg font-bold ${assessment?.score >= 80 ? 'text-success' : assessment?.score >= 60 ? 'text-warning' : 'text-error'}`}>
                {assessment?.score}%
              </div>
              <div className="text-xs text-muted-foreground">Score</div>
            </>
          )}
        </div>
      </div>

      {assessment?.progress > 0 && assessment?.status === 'in-progress' && (
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Progress</span>
            <span className="text-card-foreground font-medium">{assessment?.progress}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="h-2 bg-primary rounded-full transition-all duration-300"
              style={{ width: `${assessment?.progress}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Icon name="Users" size={16} />
            <span>{assessment?.attempts} attempts</span>
          </div>
          {assessment?.lastAttempt && (
            <div className="flex items-center space-x-1">
              <Icon name="Calendar" size={16} />
              <span>Last: {assessment?.lastAttempt}</span>
            </div>
          )}
        </div>
        {renderActionButton()}
      </div>
    </div>
  );
};

export default AssessmentCard;
