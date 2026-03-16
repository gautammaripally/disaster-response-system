import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import AssessmentCard from './components/AssessmentCard';
import ScoreBreakdown from './components/ScoreBreakdown';
import ProgressTracker from './components/ProgressTracker';
import { useAppData } from '../../contexts/AppDataContext';
import { useAuth } from '../../contexts/AuthContext';

const baseAssessments = [
  { id: 'basic-preparedness', title: 'Basic Preparedness Assessment', description: 'Evaluate your fundamental disaster preparedness knowledge and skills', icon: 'CheckCircle', questions: 25, duration: '30 min', difficulty: 'Beginner' },
  { id: 'earthquake-response', title: 'Earthquake Response Assessment', description: 'Test your knowledge of earthquake safety protocols and response procedures', icon: 'Mountain', questions: 20, duration: '25 min', difficulty: 'Intermediate' },
  { id: 'flood-preparedness', title: 'Flood Preparedness Assessment', description: 'Assess your understanding of flood risks and mitigation strategies', icon: 'Waves', questions: 18, duration: '20 min', difficulty: 'Beginner' },
  { id: 'fire-safety', title: 'Fire Safety Assessment', description: 'Evaluate your fire prevention and response capabilities', icon: 'Flame', questions: 22, duration: '28 min', difficulty: 'Intermediate' },
  { id: 'advanced-response', title: 'Advanced Emergency Response', description: 'Comprehensive assessment of advanced emergency management skills', icon: 'Shield', questions: 35, duration: '45 min', difficulty: 'Advanced' },
  { id: 'first-aid', title: 'First Aid Assessment', description: 'Test your first aid knowledge and emergency medical response skills', icon: 'Heart', questions: 30, duration: '35 min', difficulty: 'Intermediate' }
];

const PreparednessAssessment = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, progress, alerts, updateAssessmentProgress } = useAppData();
  const [activeTab, setActiveTab] = useState('overview');

  const activeAlertCount = alerts.filter((alert) => !(alert?.acknowledgedBy || []).includes(user?.uid)).length;
  const assessmentProgress = progress.assessments;

  const assessments = useMemo(() => baseAssessments.map((assessment) => {
    const saved = assessmentProgress?.[assessment.id] || {};
    return {
      ...assessment,
      progress: saved?.percentage || 0,
      status: saved?.status || 'not-started',
      score: saved?.score ?? null,
      attempts: saved?.attempts || 0,
      lastAttempt: saved?.lastAttempt ? new Date(saved.lastAttempt).toLocaleDateString('en-IN') : null
    };
  }), [assessmentProgress]);

  const completedScores = assessments.filter((item) => typeof item.score === 'number').map((item) => item.score);
  const overallScore = completedScores.length ? Math.round(completedScores.reduce((sum, value) => sum + value, 0) / completedScores.length) : 0;

  const categoryScores = [
    { id: 'personal', name: 'Personal Preparedness', icon: 'User', score: overallScore || 0 },
    { id: 'institutional', name: 'Institutional Readiness', icon: 'Building', score: Math.max(overallScore - 5, 0) },
    { id: 'emergency', name: 'Emergency Response', icon: 'AlertTriangle', score: Math.min(overallScore + 4, 100) },
    { id: 'communication', name: 'Communication Skills', icon: 'MessageCircle', score: Math.max(overallScore - 8, 0) },
    { id: 'first-aid', name: 'First Aid Knowledge', icon: 'Heart', score: overallScore },
    { id: 'disaster-specific', name: 'Disaster-Specific Knowledge', icon: 'Mountain', score: overallScore }
  ];

  const benchmarkData = [
    { type: 'personal', label: 'Your Score', score: overallScore, icon: 'User', description: 'Current preparedness level' },
    { type: 'institutional', label: 'Community Average', score: Math.max(overallScore - 7, 0), icon: 'Building', description: 'Public platform average' },
    { type: 'regional', label: 'Regional Average', score: Math.max(overallScore - 12, 0), icon: 'MapPin', description: 'Regional average' }
  ];

  const progressData = [
    { month: 3, score: Math.max(overallScore - 20, 0) },
    { month: 4, score: Math.max(overallScore - 15, 0) },
    { month: 5, score: Math.max(overallScore - 10, 0) },
    { month: 6, score: Math.max(overallScore - 8, 0) },
    { month: 7, score: Math.max(overallScore - 4, 0) },
    { month: 8, score: overallScore }
  ];

  const milestones = [
    { id: 'first-assessment', title: 'First Assessment Complete', description: 'Complete your first preparedness assessment', type: 'completion', achieved: assessments.some((item) => item.status === 'completed') },
    { id: 'score-70', title: '70% Score Achievement', description: 'Reach a preparedness score of 70% or higher', type: 'score', achieved: overallScore >= 70 },
    { id: 'score-80', title: '80% Score Achievement', description: 'Reach a preparedness score of 80% or higher', type: 'score', achieved: overallScore >= 80 },
    { id: 'all-basic', title: 'All Basic Assessments', description: 'Complete all beginner assessments', type: 'completion', achieved: assessments.filter((item) => item.difficulty === 'Beginner').every((item) => item.status === 'completed'), progress: Math.round((assessments.filter((item) => item.difficulty === 'Beginner' && item.status === 'completed').length / Math.max(assessments.filter((item) => item.difficulty === 'Beginner').length, 1)) * 100) }
  ];

  const handleStartAssessment = async (assessmentId) => {
    const existing = assessmentProgress?.[assessmentId];
    await updateAssessmentProgress(assessmentId, {
      percentage: existing?.percentage > 0 ? existing.percentage : 25,
      completed: false,
      status: 'in-progress',
      score: existing?.score ?? null,
      attempts: existing?.attempts || 1
    });
    setActiveTab('assessments');
  };

  const handleContinueAssessment = async (assessmentId) => {
    const existing = assessmentProgress?.[assessmentId] || {};
    const nextProgress = Math.min((existing?.percentage || 0) + 25, 100);
    const completed = nextProgress >= 100;
    await updateAssessmentProgress(assessmentId, {
      percentage: nextProgress,
      completed,
      status: completed ? 'completed' : 'in-progress',
      score: completed ? Math.max(existing?.score || 82, 82) : existing?.score ?? null,
      attempts: Math.max(existing?.attempts || 1, 1)
    });
  };

  const handleViewResults = async (assessmentId) => {
    const existing = assessmentProgress?.[assessmentId] || {};
    if (existing?.status !== 'completed') {
      await updateAssessmentProgress(assessmentId, {
        percentage: 100,
        completed: true,
        status: 'completed',
        score: existing?.score || 80,
        attempts: Math.max(existing?.attempts || 0, 1)
      });
    }
    setActiveTab('overview');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header userRole={profile?.role || 'public'} alertCount={activeAlertCount} onMenuToggle={() => {}} />

      {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/disaster-learning-modules')}
          iconName="ArrowLeft"
          iconPosition="left"
        >
          Back to Home
        </Button>
      </div> */}

      <div className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Preparedness Assessment</h1>
              <p className="text-muted-foreground mt-1">
                Measure readiness levels and keep your assessment record synced to your account.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">{overallScore}%</div>
                <div className="text-sm text-muted-foreground">Overall Score</div>
              </div>
              <Button variant="default" onClick={() => setActiveTab('assessments')} iconName="Play" iconPosition="left">
                Take Assessment
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
              { id: 'assessments', label: 'Assessments', icon: 'ClipboardCheck' },
              { id: 'progress', label: 'Progress', icon: 'TrendingUp' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-quick whitespace-nowrap ${activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'}`}
              >
                <Icon name={tab.icon} size={18} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <ScoreBreakdown overallScore={overallScore} categoryScores={categoryScores} benchmarkData={benchmarkData} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {assessments.slice(0, 4).map((assessment) => (
                <AssessmentCard
                  key={assessment.id}
                  assessment={assessment}
                  onStart={handleStartAssessment}
                  onContinue={handleContinueAssessment}
                  onViewResults={handleViewResults}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'assessments' && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {assessments.map((assessment) => (
              <AssessmentCard
                key={assessment.id}
                assessment={assessment}
                onStart={handleStartAssessment}
                onContinue={handleContinueAssessment}
                onViewResults={handleViewResults}
              />
            ))}
          </div>
        )}

        {activeTab === 'progress' && (
          <ProgressTracker progressData={progressData} milestones={milestones} />
        )}
      </div>
    </div>
  );
};

export default PreparednessAssessment;
