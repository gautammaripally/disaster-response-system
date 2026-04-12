import React, { useEffect, useMemo, useState } from 'react';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import AssessmentCard from './components/AssessmentCard';
import ScoreBreakdown from './components/ScoreBreakdown';
import ProgressTracker from './components/ProgressTracker';
import AssessmentQuiz from './components/AssessmentQuiz';
import { useAppData } from '../../contexts/AppDataContext';
import { useAuth } from '../../contexts/AuthContext';

const ASSESSMENT_RESULTS_STORAGE_KEY = 'disastered_assessment_results';

const baseAssessments = [
  { id: 'basic-preparedness', title: 'Basic Preparedness Assessment', description: 'Evaluate your fundamental disaster preparedness knowledge and skills', icon: 'CheckCircle', questions: 25, duration: '30 min', difficulty: 'Beginner' },
  { id: 'earthquake-response', title: 'Earthquake Response Assessment', description: 'Test your knowledge of earthquake safety protocols and response procedures', icon: 'Mountain', questions: 20, duration: '25 min', difficulty: 'Intermediate' },
  { id: 'flood-preparedness', title: 'Flood Preparedness Assessment', description: 'Assess your understanding of flood risks and mitigation strategies', icon: 'Waves', questions: 18, duration: '20 min', difficulty: 'Beginner' },
  { id: 'fire-safety', title: 'Fire Safety Assessment', description: 'Evaluate your fire prevention and response capabilities', icon: 'Flame', questions: 22, duration: '28 min', difficulty: 'Intermediate' },
  { id: 'advanced-response', title: 'Advanced Emergency Response', description: 'Comprehensive assessment of advanced emergency management skills', icon: 'Shield', questions: 35, duration: '45 min', difficulty: 'Advanced' },
  { id: 'first-aid', title: 'First Aid Assessment', description: 'Test your first aid knowledge and emergency medical response skills', icon: 'Heart', questions: 30, duration: '35 min', difficulty: 'Intermediate' }
];

const assessmentQuestionBank = {
  'basic-preparedness': [
    { id: 'bp-1', prompt: 'What is the most important first step in household disaster preparedness?', context: 'This assessment focuses on fundamental readiness and family planning.', options: ['Wait until a warning is issued before planning', 'Create and practice an emergency plan with your household', 'Only store food supplies', 'Memorize social media updates'], correctOption: 1, explanation: 'Preparedness starts with a clear emergency plan that everyone in the household understands and can practice.' },
    { id: 'bp-2', prompt: 'Which item best belongs in a basic emergency kit?', context: 'Basic preparedness includes keeping essential supplies ready.', options: ['A week of perishable food only', 'Flashlight, water, first-aid supplies, and emergency contacts', 'Large furniture', 'Only phone chargers'], correctOption: 1, explanation: 'A basic kit should include light, water, first aid, and communication essentials.' },
    { id: 'bp-3', prompt: 'Why should emergency contacts be written down as well as stored on a phone?', context: 'Preparedness planning should work even when power or connectivity fails.', options: ['Because written copies are easier to decorate', 'Phones may be unavailable, uncharged, or disconnected during emergencies', 'It is only useful for school assignments', 'It replaces the need for drills'], correctOption: 1, explanation: 'Written contact details remain available when phones, batteries, or networks are unavailable.' },
    { id: 'bp-4', prompt: 'What does a preparedness drill help improve most directly?', context: 'The page emphasizes practice, readiness, and coordinated response.', options: ['Luck during emergencies', 'Faster, calmer decision-making under pressure', 'The number of devices at home', 'The need for official alerts'], correctOption: 1, explanation: 'Drills build familiarity and confidence, helping people act quickly and calmly.' },
    { id: 'bp-5', prompt: 'Which statement best reflects personal preparedness?', context: 'Readiness combines planning, awareness, and access to resources.', options: ['Preparedness matters only after a disaster happens', 'Preparedness is limited to emergency professionals', 'Preparedness means planning ahead, staying informed, and knowing how to respond', 'Preparedness only requires one-time training'], correctOption: 2, explanation: 'Personal preparedness is ongoing and combines planning, information, and practiced response.' }
  ],
  'earthquake-response': [
    { id: 'eq-1', prompt: 'What is the recommended immediate action during an earthquake indoors?', context: 'This assessment covers earthquake safety protocols and response procedures.', options: ['Run outside immediately', 'Use the elevator to exit quickly', 'Drop, Cover, and Hold On', 'Stand near windows for visibility'], correctOption: 2, explanation: 'Drop, Cover, and Hold On is the safest immediate protective action during shaking indoors.' },
    { id: 'eq-2', prompt: 'Why should you stay away from windows during an earthquake?', context: 'Earthquake response includes reducing injury from falling or breaking objects.', options: ['Windows block phone signals', 'Glass can shatter and cause injury', 'They make rooms darker', 'They increase aftershocks'], correctOption: 1, explanation: 'Broken glass is a common injury risk during earthquakes.' },
    { id: 'eq-3', prompt: 'After the shaking stops, what should you expect?', context: 'Response planning should include post-event safety.', options: ['No further risk exists', 'Aftershocks may occur and require continued caution', 'All alarms are false', 'Road travel is always safe immediately'], correctOption: 1, explanation: 'Aftershocks are common and can cause additional hazards after the main quake.' },
    { id: 'eq-4', prompt: 'If you are driving during an earthquake, what is the safer choice?', context: 'Vehicle safety is part of the earthquake learning content.', options: ['Speed up to reach home faster', 'Stop in a clear area away from bridges, trees, and power lines', 'Park under a flyover', 'Leave the car in traffic'], correctOption: 1, explanation: 'Pulling over in a clear open area reduces risk from collapse and falling debris.' },
    { id: 'eq-5', prompt: 'Which action supports community safety after an earthquake?', context: 'The platform emphasizes helping others safely when possible.', options: ['Re-enter damaged buildings immediately', 'Ignore official advisories', 'Check for injuries, avoid hazards, and follow local guidance', 'Use open flames for lighting'], correctOption: 2, explanation: 'Post-earthquake safety depends on injury checks, hazard awareness, and official instructions.' }
  ],
  'flood-preparedness': [
    { id: 'fp-1', prompt: 'What is one of the earliest signs that flood preparedness plans should be activated?', context: 'Flood assessments focus on warning signs and mitigation strategy.', options: ['Ignoring weather updates', 'Official warnings and rapidly rising water levels', 'Dry roads in distant areas', 'A routine school bell'], correctOption: 1, explanation: 'Official alerts and rising water are key signals to activate flood plans.' },
    { id: 'fp-2', prompt: 'Why should people avoid walking or driving through floodwater?', context: 'Flood response includes safe movement and evacuation.', options: ['It slows down rescue teams only', 'Floodwater can hide depth, debris, and electrical hazards', 'It always improves traction', 'It is only a concern at night'], correctOption: 1, explanation: 'Floodwater is unpredictable and may conceal fast currents, debris, or live electricity.' },
    { id: 'fp-3', prompt: 'Which preparation is most helpful before flood season?', context: 'Preparedness should happen before an emergency becomes critical.', options: ['Waiting to pack until evacuation is announced', 'Keeping go-bags, documents, and evacuation routes ready', 'Parking only in basements', 'Relying on rumors'], correctOption: 1, explanation: 'Advance preparation reduces confusion and speeds up safe evacuation.' },
    { id: 'fp-4', prompt: 'What should happen with electrical equipment in a flooded area?', context: 'The page includes specific flood electrical risk content.', options: ['Use it normally if the light still turns on', 'Keep it plugged in for visibility', 'Avoid contact and treat it as a serious hazard', 'Dry it with bare hands in standing water'], correctOption: 2, explanation: 'Electrical equipment near water can be deadly and should be treated as hazardous.' },
    { id: 'fp-5', prompt: 'What is the safest evacuation direction during severe flooding when instructed to leave?', context: 'Flood evacuation planning prioritizes safer terrain.', options: ['Toward low-lying roads', 'Toward higher ground using approved safe routes', 'Into underpasses', 'Toward riverbanks for a better view'], correctOption: 1, explanation: 'Higher ground and official safe routes reduce exposure to rising water.' }
  ],
  'fire-safety': [
    { id: 'fs-1', prompt: 'What is the safest first response when a fire alarm sounds in a building?', context: 'This assessment covers prevention, response, and evacuation.', options: ['Finish your current task before moving', 'Evacuate promptly using the nearest safe exit', 'Use the elevator for speed', 'Hide until smoke clears'], correctOption: 1, explanation: 'A prompt evacuation through safe exits is the correct immediate response to a fire alarm.' },
    { id: 'fs-2', prompt: 'Why should elevators generally be avoided during a fire?', context: 'Evacuation procedures are a core part of fire safety training.', options: ['They may fail or open onto a dangerous floor', 'They are too noisy', 'They always stop at the lobby safely', 'They make alarms louder'], correctOption: 0, explanation: 'Elevators can malfunction or expose occupants to smoke and heat.' },
    { id: 'fs-3', prompt: 'If smoke is present, what movement is usually safer?', context: 'Fire response includes smoke-awareness and safer body positioning.', options: ['Run upright', 'Stay low and move carefully toward an exit', 'Open every door quickly', 'Move toward the source of heat'], correctOption: 1, explanation: 'Smoke rises, so staying low may reduce smoke inhalation during evacuation.' },
    { id: 'fs-4', prompt: 'What is the purpose of a fire drill?', context: 'The learning modules emphasize training and repeated practice.', options: ['To decorate evacuation maps', 'To practice alarm response, evacuation routes, and assembly procedures', 'To replace extinguishers', 'To test internet speed'], correctOption: 1, explanation: 'Fire drills build familiarity with routes, timing, and coordination.' },
    { id: 'fs-5', prompt: 'Which behavior supports fire prevention?', context: 'Prevention is as important as emergency response.', options: ['Ignoring overloaded electrical outlets', 'Blocking exits with supplies', 'Checking electrical safety and keeping escape paths clear', 'Storing flammables near open flames'], correctOption: 2, explanation: 'Good fire prevention includes electrical safety and clear escape routes.' }
  ],
  'advanced-response': [
    { id: 'ar-1', prompt: 'What best describes advanced emergency response?', context: 'This assessment is focused on broader emergency management skills.', options: ['Only individual action without coordination', 'Coordinated decision-making, communication, and resource management', 'Responding without a plan', 'Waiting for others to act first'], correctOption: 1, explanation: 'Advanced response requires coordination, communication, and resource awareness.' },
    { id: 'ar-2', prompt: 'Why is clear communication critical during emergencies?', context: 'Strong communication reduces confusion and improves team response.', options: ['It delays action', 'It helps people understand roles, risks, and next steps', 'It is only useful after the incident ends', 'It replaces training'], correctOption: 1, explanation: 'Clear communication keeps teams aligned and reduces dangerous confusion.' },
    { id: 'ar-3', prompt: 'What is a good example of resource management in a response scenario?', context: 'Advanced emergency management includes allocating limited support carefully.', options: ['Sending everyone to the same location without checking needs', 'Matching people, supplies, and time to the most urgent priorities', 'Ignoring available shelter capacity', 'Moving equipment without instruction'], correctOption: 1, explanation: 'Resource management means using limited people, supplies, and time effectively.' },
    { id: 'ar-4', prompt: 'Why should institutions run scenario-based exercises?', context: 'The app includes drills and assessments to improve institutional readiness.', options: ['To avoid documenting procedures', 'To test plans, uncover gaps, and improve coordination', 'To reduce the need for communication', 'To replace all real-world training'], correctOption: 1, explanation: 'Scenario-based exercises reveal weaknesses and strengthen preparedness plans.' },
    { id: 'ar-5', prompt: 'Which choice best improves response quality during a fast-changing event?', context: 'Advanced response depends on informed adaptation.', options: ['Ignore updated situational information', 'Continue the original plan no matter what', 'Monitor conditions and adapt decisions based on verified information', 'Delay every decision until the event ends'], correctOption: 2, explanation: 'Strong responders adapt as conditions change, using verified information to guide action.' }
  ],
  'first-aid': [
    { id: 'fa-1', prompt: 'What should come first before giving first aid?', context: 'First-aid response begins with scene awareness and safety.', options: ['Move the injured person immediately', 'Check that the scene is safe for you and the victim', 'Offer food and water first', 'Leave without calling for help'], correctOption: 1, explanation: 'Scene safety is the first priority so that responders do not become additional victims.' },
    { id: 'fa-2', prompt: 'What is a good first response for serious bleeding?', context: 'The page includes cuts and bleeding first-aid content.', options: ['Apply direct pressure with a clean cloth or dressing', 'Wait to see if it stops on its own', 'Wash with unsafe water first', 'Ask the person to walk around'], correctOption: 0, explanation: 'Direct pressure is a key first-aid step for controlling serious bleeding.' },
    { id: 'fa-3', prompt: 'Why is calling emergency services important during a major medical emergency?', context: 'First aid supports professional care; it does not replace it.', options: ['It is optional in all serious cases', 'It ensures trained medical help is on the way', 'It delays care unnecessarily', 'It matters only after the person stands up'], correctOption: 1, explanation: 'Professional medical support is essential for serious injuries or life-threatening conditions.' },
    { id: 'fa-4', prompt: 'What is the purpose of CPR?', context: 'Emergency medical response includes life-saving interventions.', options: ['To treat minor cuts', 'To support circulation and breathing when a person is unresponsive', 'To cool burns', 'To reduce flood levels'], correctOption: 1, explanation: 'CPR helps maintain circulation and oxygen flow during cardiac or breathing emergencies.' },
    { id: 'fa-5', prompt: 'Which statement reflects good first-aid practice?', context: 'The platform emphasizes calm, practical response.', options: ['Act calmly, assess the person, and use the appropriate first-aid step', 'Panic so others react faster', 'Provide treatment without checking symptoms', 'Ignore follow-up care'], correctOption: 0, explanation: 'Good first aid is calm, deliberate, and matched to the person’s condition.' }
  ]
};

const PreparednessAssessment = () => {
  const { user } = useAuth();
  const { profile, progress, alerts, updateAssessmentProgress } = useAppData();
  const [activeTab, setActiveTab] = useState('overview');
  const [activeAssessmentId, setActiveAssessmentId] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [submittedAnswer, setSubmittedAnswer] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [savedResults, setSavedResults] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(ASSESSMENT_RESULTS_STORAGE_KEY) || '{}');
    } catch {
      return {};
    }
  });

  const activeAlertCount = alerts.filter((alert) => !(alert?.acknowledgedBy || []).includes(user?.uid)).length;
  const assessmentProgress = progress.assessments;

  const assessments = useMemo(() => baseAssessments.map((assessment) => {
    const saved = assessmentProgress?.[assessment.id] || {};
    const localResult = savedResults?.[assessment.id];

    return {
      ...assessment,
      progress: saved?.percentage || 0,
      status: saved?.status || 'not-started',
      score: saved?.score ?? localResult?.score ?? null,
      attempts: saved?.attempts || 0,
      lastAttempt: saved?.lastAttempt
        ? new Date(saved.lastAttempt).toLocaleDateString('en-IN')
        : localResult?.completedAt
          ? new Date(localResult.completedAt).toLocaleDateString('en-IN')
          : null
    };
  }), [assessmentProgress, savedResults]);

  const activeAssessment = useMemo(
    () => assessments.find((assessment) => assessment.id === activeAssessmentId) || null,
    [assessments, activeAssessmentId]
  );
  const activeQuestions = useMemo(
    () => (activeAssessmentId ? assessmentQuestionBank[activeAssessmentId] || [] : []),
    [activeAssessmentId]
  );
  const activeQuizAnswers = activeAssessmentId
    ? (quizAnswers?.[activeAssessmentId] || savedResults?.[activeAssessmentId]?.answers || [])
    : [];
  const isQuizComplete = activeAssessmentId ? Boolean(savedResults?.[activeAssessmentId]?.completed) : false;
  const activeQuizScore = activeAssessmentId ? savedResults?.[activeAssessmentId]?.score ?? 0 : 0;

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
  const resultSummary = useMemo(() => ({
    correctCount: activeQuizAnswers.filter((answer) => answer?.isCorrect).length,
    incorrectCount: activeQuizAnswers.filter((answer) => answer && !answer.isCorrect).length
  }), [activeQuizAnswers]);

  useEffect(() => {
    localStorage.setItem(ASSESSMENT_RESULTS_STORAGE_KEY, JSON.stringify(savedResults));
  }, [savedResults]);

  useEffect(() => {
    if (!activeAssessmentId) return;
    const answer = (quizAnswers?.[activeAssessmentId] || [])[currentQuestionIndex];
    setSelectedOption(answer?.selectedOption ?? null);
    setSubmittedAnswer(Boolean(answer));
  }, [activeAssessmentId, currentQuestionIndex, quizAnswers]);

  const openAssessment = async (assessmentId) => {
    const existing = assessmentProgress?.[assessmentId];
    setActiveAssessmentId(assessmentId);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setSubmittedAnswer(false);
    setActiveTab('assessments');

    if (savedResults?.[assessmentId]?.completed) return;

    await updateAssessmentProgress(assessmentId, {
      percentage: existing?.percentage || 0,
      completed: false,
      status: 'in-progress',
      score: null,
      attempts: Math.max(existing?.attempts || 0, 1)
    });
  };

  const handleStartAssessment = async (assessmentId) => {
    setSavedResults((previous) => ({
      ...previous,
      [assessmentId]: { ...(previous?.[assessmentId] || {}), completed: false, score: null, answers: [] }
    }));
    setQuizAnswers((previous) => ({ ...previous, [assessmentId]: [] }));
    await updateAssessmentProgress(assessmentId, {
      percentage: 0,
      completed: false,
      status: 'in-progress',
      score: null,
      attempts: (assessmentProgress?.[assessmentId]?.attempts || 0) + 1
    });
    await openAssessment(assessmentId);
  };

  const handleContinueAssessment = async (assessmentId) => {
    await openAssessment(assessmentId);
  };

  const handleViewResults = async (assessmentId) => {
    await openAssessment(assessmentId);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || !activeAssessmentId) return;
    const currentQuestion = activeQuestions[currentQuestionIndex];
    const answerPayload = {
      questionId: currentQuestion.id,
      selectedOption,
      isCorrect: selectedOption === currentQuestion.correctOption
    };

    setQuizAnswers((previous) => {
      const nextAnswers = [...(previous?.[activeAssessmentId] || [])];
      nextAnswers[currentQuestionIndex] = answerPayload;
      return { ...previous, [activeAssessmentId]: nextAnswers };
    });
    setSubmittedAnswer(true);
  };

  const handleNextQuestion = async () => {
    if (!activeAssessmentId) return;
    const nextIndex = currentQuestionIndex + 1;
    const currentAnswers = quizAnswers?.[activeAssessmentId] || [];

    if (nextIndex >= activeQuestions.length) {
      const correctCount = currentAnswers.filter((answer) => answer?.isCorrect).length;
      const score = Math.round((correctCount / activeQuestions.length) * 100);
      const completedAt = new Date().toISOString();

      setSavedResults((previous) => ({
        ...previous,
        [activeAssessmentId]: { score, answers: currentAnswers, completed: true, completedAt }
      }));

      await updateAssessmentProgress(activeAssessmentId, {
        percentage: 100,
        completed: true,
        status: 'completed',
        score,
        attempts: Math.max(assessmentProgress?.[activeAssessmentId]?.attempts || 0, 1)
      });

      setSelectedOption(null);
      setSubmittedAnswer(false);
      return;
    }

    await updateAssessmentProgress(activeAssessmentId, {
      percentage: Math.round((currentAnswers.length / activeQuestions.length) * 100),
      completed: false,
      status: 'in-progress',
      score: null,
      attempts: Math.max(assessmentProgress?.[activeAssessmentId]?.attempts || 0, 1)
    });

    setCurrentQuestionIndex(nextIndex);
    setSelectedOption(null);
    setSubmittedAnswer(false);
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex === 0) return;
    const previousIndex = currentQuestionIndex - 1;
    const previousAnswer = activeQuizAnswers[previousIndex];
    setCurrentQuestionIndex(previousIndex);
    setSelectedOption(previousAnswer?.selectedOption ?? null);
    setSubmittedAnswer(Boolean(previousAnswer));
  };

  const handleExitQuiz = () => {
    setActiveAssessmentId(null);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setSubmittedAnswer(false);
  };

  const handleRestartAssessment = async () => {
    if (!activeAssessmentId) return;

    setQuizAnswers((previous) => ({ ...previous, [activeAssessmentId]: [] }));
    setSavedResults((previous) => ({
      ...previous,
      [activeAssessmentId]: { ...(previous?.[activeAssessmentId] || {}), completed: false, score: null, answers: [] }
    }));
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setSubmittedAnswer(false);

    await updateAssessmentProgress(activeAssessmentId, {
      percentage: 0,
      completed: false,
      status: 'in-progress',
      score: null,
      attempts: (assessmentProgress?.[activeAssessmentId]?.attempts || 0) + 1
    });
  };

  const handleCardOpen = (assessment) => {
    if (assessment.status === 'completed') {
      handleViewResults(assessment.id);
      return;
    }
    if (assessment.status === 'in-progress') {
      handleContinueAssessment(assessment.id);
      return;
    }
    handleStartAssessment(assessment.id);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header userRole={profile?.role || 'public'} alertCount={activeAlertCount} onMenuToggle={() => {}} />

      <div className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Preparedness Assessment</h1>
              <p className="text-muted-foreground mt-1">
                Measure readiness levels and complete interactive quizzes built from the learning content on this page.
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
                  onCardClick={handleCardOpen}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'assessments' && (
          <div className="space-y-6">
            {activeAssessment && (
              <AssessmentQuiz
                assessment={activeAssessment}
                questions={activeQuestions}
                currentQuestionIndex={currentQuestionIndex}
                selectedOption={selectedOption}
                submittedAnswer={submittedAnswer}
                answers={activeQuizAnswers}
                score={activeQuizScore}
                isComplete={isQuizComplete}
                resultSummary={resultSummary}
                onSelectOption={setSelectedOption}
                onSubmitAnswer={handleSubmitAnswer}
                onPreviousQuestion={handlePreviousQuestion}
                onNextQuestion={handleNextQuestion}
                onRestart={handleRestartAssessment}
                onExit={handleExitQuiz}
              />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {assessments.map((assessment) => (
                <AssessmentCard
                  key={assessment.id}
                  assessment={assessment}
                  onStart={handleStartAssessment}
                  onContinue={handleContinueAssessment}
                  onViewResults={handleViewResults}
                  onCardClick={handleCardOpen}
                  className={activeAssessmentId === assessment.id ? 'ring-2 ring-primary/30' : ''}
                />
              ))}
            </div>
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
