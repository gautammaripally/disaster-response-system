import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import AssessmentCard from './components/AssessmentCard';
import ScoreBreakdown from './components/ScoreBreakdown';
import ProgressTracker from './components/ProgressTracker';

const PreparednessAssessment = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [userProgress, setUserProgress] = useState({});

  // Mock data for assessments
  const assessments = [
    {
      id: 'basic-preparedness',
      title: 'Basic Preparedness Assessment',
      description: 'Evaluate your fundamental disaster preparedness knowledge and skills',
      icon: 'CheckCircle',
      questions: 25,
      duration: '30 min',
      difficulty: 'Beginner',
      status: 'completed',
      score: 78,
      progress: 100,
      attempts: 2,
      lastAttempt: '15/09/2025'
    },
    {
      id: 'earthquake-response',
      title: 'Earthquake Response Assessment',
      description: 'Test your knowledge of earthquake safety protocols and response procedures',
      icon: 'Mountain',
      questions: 20,
      duration: '25 min',
      difficulty: 'Intermediate',
      status: 'in-progress',
      score: null,
      progress: 65,
      attempts: 1,
      lastAttempt: '16/09/2025'
    },
    {
      id: 'flood-preparedness',
      title: 'Flood Preparedness Assessment',
      description: 'Assess your understanding of flood risks and mitigation strategies',
      icon: 'Waves',
      questions: 18,
      duration: '20 min',
      difficulty: 'Beginner',
      status: 'not-started',
      score: null,
      progress: 0,
      attempts: 0,
      lastAttempt: null
    },
    {
      id: 'fire-safety',
      title: 'Fire Safety Assessment',
      description: 'Evaluate your fire prevention and response capabilities',
      icon: 'Flame',
      questions: 22,
      duration: '28 min',
      difficulty: 'Intermediate',
      status: 'completed',
      score: 85,
      progress: 100,
      attempts: 1,
      lastAttempt: '12/09/2025'
    },
    {
      id: 'advanced-response',
      title: 'Advanced Emergency Response',
      description: 'Comprehensive assessment of advanced emergency management skills',
      icon: 'Shield',
      questions: 35,
      duration: '45 min',
      difficulty: 'Advanced',
      status: 'not-started',
      score: null,
      progress: 0,
      attempts: 0,
      lastAttempt: null
    },
    {
      id: 'first-aid',
      title: 'First Aid Assessment',
      description: 'Test your first aid knowledge and emergency medical response skills',
      icon: 'Heart',
      questions: 30,
      duration: '35 min',
      difficulty: 'Intermediate',
      status: 'completed',
      score: 92,
      progress: 100,
      attempts: 1,
      lastAttempt: '10/09/2025'
    }
  ];

  // Mock data for score breakdown
  const overallScore = 82;
  const categoryScores = [
    { id: 'personal', name: 'Personal Preparedness', icon: 'User', score: 85 },
    { id: 'institutional', name: 'Institutional Knowledge', icon: 'Building', score: 78 },
    { id: 'emergency', name: 'Emergency Response', icon: 'AlertTriangle', score: 88 },
    { id: 'communication', name: 'Communication Skills', icon: 'MessageCircle', score: 75 },
    { id: 'first-aid', name: 'First Aid Knowledge', icon: 'Heart', score: 92 },
    { id: 'disaster-specific', name: 'Disaster-Specific Knowledge', icon: 'Mountain', score: 80 }
  ];

  const benchmarkData = [
    {
      type: 'personal',
      label: 'Your Score',
      score: 82,
      icon: 'User',
      description: 'Current preparedness level'
    },
    {
      type: 'institutional',
      label: 'Institution Average',
      score: 75,
      icon: 'Building',
      description: 'School/college average'
    },
    {
      type: 'regional',
      label: 'Regional Average',
      score: 68,
      icon: 'MapPin',
      description: 'State-wide average'
    }
  ];

  // Mock data for progress tracking
  const progressData = [
    { month: 3, score: 65 }, // April
    { month: 4, score: 68 }, // May
    { month: 5, score: 72 }, // June
    { month: 6, score: 75 }, // July
    { month: 7, score: 79 }, // August
    { month: 8, score: 82 }  // September
  ];

  const milestones = [
    {
      id: 'first-assessment',
      title: 'First Assessment Complete',
      description: 'Complete your first preparedness assessment',
      type: 'completion',
      achieved: true,
      achievedDate: '15/08/2025'
    },
    {
      id: 'score-70',
      title: '70% Score Achievement',
      description: 'Achieve a score of 70% or higher',
      type: 'score',
      achieved: true,
      achievedDate: '20/08/2025'
    },
    {
      id: 'score-80',
      title: '80% Score Achievement',
      description: 'Achieve a score of 80% or higher',
      type: 'score',
      achieved: true,
      achievedDate: '10/09/2025'
    },
    {
      id: 'all-basic',
      title: 'All Basic Assessments',
      description: 'Complete all basic level assessments',
      type: 'completion',
      achieved: false,
      progress: 75
    }
    // {
    //   id: 'certificate',
    //   title: 'Preparedness Certificate',
    //   description: 'Earn your disaster preparedness certificate',
    //   type: 'certificate',
    //   achieved: false,
    //   progress: 85
    // }
    // {
    //   id: 'streak-7',
    //   title: '7-Day Learning Streak',
    //   description: 'Maintain a 7-day learning streak',
    //   type: 'streak',
    //   achieved: false,
    //   progress: 60
    // }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
    { id: 'assessments', label: 'Assessments', icon: 'ClipboardCheck' },
    { id: 'progress', label: 'Progress', icon: 'TrendingUp' }
  ];

  const handleStartAssessment = (assessmentId) => {
    console.log('Starting assessment:', assessmentId);
    // In a real app, this would navigate to the assessment
  };

  const handleContinueAssessment = (assessmentId) => {
    console.log('Continuing assessment:', assessmentId);
    // In a real app, this would navigate to the assessment
  };

  const handleViewResults = (assessmentId) => {
    console.log('Viewing results for:', assessmentId);
    // In a real app, this would show detailed results
  };

  useEffect(() => {
    // Initialize user progress
    const progress = {};
    assessments?.forEach(assessment => {
      progress[assessment.id] = {
        percentage: assessment?.progress,
        completed: assessment?.status === 'completed'
      };
    });
    setUserProgress(progress);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Preparedness Assessment</h1>
              <p className="text-muted-foreground mt-1">
                Evaluate and improve your disaster readiness with comprehensive assessments
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">{overallScore}%</div>
                <div className="text-sm text-muted-foreground">Overall Score</div>
              </div>
              <Button
                variant="default"
                onClick={() => setActiveTab('assessments')}
                iconName="Play"
                iconPosition="left"
              >
                Take Assessment
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Navigation Tabs */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`
                  flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-quick whitespace-nowrap
                  ${activeTab === tab?.id
                    ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
                  }
                `}
              >
                <Icon name={tab?.icon} size={18} />
                <span>{tab?.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="space-y-8">
              <ScoreBreakdown
                overallScore={overallScore}
                categoryScores={categoryScores}
                benchmarkData={benchmarkData}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {assessments?.slice(0, 4)?.map((assessment) => (
                  <AssessmentCard
                    key={assessment?.id}
                    assessment={assessment}
                    onStart={handleStartAssessment}
                    onContinue={handleContinueAssessment}
                    onViewResults={handleViewResults}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'assessments' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {assessments?.map((assessment) => (
                <AssessmentCard
                  key={assessment?.id}
                  assessment={assessment}
                  onStart={handleStartAssessment}
                  onContinue={handleContinueAssessment}
                  onViewResults={handleViewResults}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'progress' && (
          <div className="space-y-8">
            <ProgressTracker
              progressData={progressData}
              milestones={milestones}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PreparednessAssessment;
