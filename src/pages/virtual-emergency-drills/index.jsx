import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import DrillScenarioCard from './components/DrillScenarioCard';
import DrillSimulation from './components/DrillSimulation';
import DrillResults from './components/DrillResults';
import DrillProgress from './components/DrillProgress';
import DrillCategories from './components/DrillCategories';
import { useAppData } from '../../contexts/AppDataContext';
import { useAuth } from '../../contexts/AuthContext';

const drillScenarios = [
  {
    id: 'evacuation-drill',
    title: 'School Evacuation Drill',
    description: 'Practice safe evacuation procedures from a multi-story building during a fire emergency.',
    imageUrl: 'https://images.pexels.com/photos/8199562/pexels-photo-8199562.jpeg',
    icon: 'Users',
    difficulty: 'Beginner',
    duration: '15-20 min',
    participants: '20-30',
    location: 'Public Building',
    objectives: 5,
    estimatedTime: '15 min',
    timeLimit: 900,
    category: 'fire-safety',
    features: ['Real-time decisions', 'Multiple routes', 'Team coordination', 'Safety protocols']
  },
  {
    id: 'shelter-in-place',
    title: 'Shelter-in-Place Protocol',
    description: 'Learn how to shelter in place during severe weather, chemical hazards, or security incidents.',
    imageUrl: 'https://images.pexels.com/photos/8199559/pexels-photo-8199559.jpeg',
    icon: 'Home',
    difficulty: 'Intermediate',
    duration: '10-15 min',
    participants: '15-25',
    location: 'Indoor Space',
    objectives: 4,
    estimatedTime: '12 min',
    timeLimit: 720,
    category: 'all',
    features: ['Threat assessment', 'Communication', 'Resource management', 'Duration planning']
  },
  {
    id: 'fire-evacuation',
    title: 'Fire Emergency Response',
    description: 'Cover fire detection, alarm response, evacuation procedures, and assembly point protocols.',
    imageUrl: 'https://images.pexels.com/photos/6980523/pexels-photo-6980523.jpeg',
    icon: 'Flame',
    difficulty: 'Intermediate',
    duration: '18-25 min',
    participants: '25-40',
    location: 'Campus / Institution',
    objectives: 6,
    estimatedTime: '20 min',
    timeLimit: 1200,
    category: 'fire-safety',
    features: ['Fire detection', 'Alarm systems', 'Route planning', 'First aid basics']
  },
  {
    id: 'earthquake-response',
    title: 'Earthquake Safety Drill',
    description: 'Practice Drop, Cover, and Hold On and post-earthquake evacuation and assessment steps.',
    imageUrl: 'https://images.pexels.com/photos/8199564/pexels-photo-8199564.jpeg',
    icon: 'Mountain',
    difficulty: 'Advanced',
    duration: '20-30 min',
    participants: '30-50',
    location: 'Multi-floor Building',
    objectives: 7,
    estimatedTime: '25 min',
    timeLimit: 1500,
    category: 'earthquake',
    features: ['Drop-Cover-Hold', 'Aftershock response', 'Damage assessment', 'Medical triage']
  },
  {
    id: 'flood-response',
    title: 'Flood Emergency Drill',
    description: 'Learn flood warning recognition, safe movement, vertical evacuation, and communication response.',
    imageUrl: 'https://images.pexels.com/photos/8199560/pexels-photo-8199560.jpeg',
    icon: 'Waves',
    difficulty: 'Advanced',
    duration: '25-35 min',
    participants: '20-35',
    location: 'Ground-Level Areas',
    objectives: 6,
    estimatedTime: '30 min',
    timeLimit: 1800,
    category: 'flood',
    features: ['Water level monitoring', 'Vertical evacuation', 'Supply management', 'Communication']
  },
  {
    id: 'medical-emergency',
    title: 'Medical Emergency Response',
    description: 'Cover first aid, emergency calling, scene safety, and coordination with medical support.',
    imageUrl: 'https://images.pexels.com/photos/6980524/pexels-photo-6980524.jpeg',
    icon: 'Heart',
    difficulty: 'Intermediate',
    duration: '15-20 min',
    participants: '10-20',
    location: 'Any Location',
    objectives: 5,
    estimatedTime: '18 min',
    timeLimit: 1080,
    category: 'medical',
    features: ['CPR basics', 'Emergency calling', 'Victim assessment', 'Scene safety']
  }
];

const VirtualEmergencyDrills = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, progress, alerts, updateDrillProgress } = useAppData();
  const [currentView, setCurrentView] = useState('overview');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeScenario, setActiveScenario] = useState(null);
  const [drillResults, setDrillResults] = useState(null);

  const userProgress = progress.drills;
  const activeAlertCount = alerts.filter((alert) => !(alert?.acknowledgedBy || []).includes(user?.uid)).length;
  const filteredScenarios = selectedCategory === 'all'
    ? drillScenarios
    : drillScenarios.filter((scenario) => scenario.category === selectedCategory);

  const totalDrills = drillScenarios.length;
  const completedDrills = Object.values(userProgress).filter((item) => item?.completed).length;

  const averageScore = useMemo(() => {
    const scores = Object.values(userProgress).map((item) => item?.lastScore || 0).filter(Boolean);
    return scores.length ? Math.round(scores.reduce((sum, value) => sum + value, 0) / scores.length) : 0;
  }, [userProgress]);

  const handleStartDrill = (scenario) => {
    setActiveScenario(scenario);
    setCurrentView('simulation');
  };

  const handleDrillComplete = async (results) => {
    setDrillResults(results);
    setCurrentView('results');

    await updateDrillProgress(activeScenario?.id, {
      percentage: results?.completed ? 100 : 75,
      completed: Boolean(results?.completed),
      lastScore: results?.score || 0,
      points: results?.score || 0,
      timeUsed: results?.timeUsed || null,
      attempts: (userProgress?.[activeScenario?.id]?.attempts || 0) + 1
    });
  };

  const renderTopBar = () => (
    <>
      <Header userRole={profile?.role || 'public'} alertCount={activeAlertCount} onMenuToggle={() => {}} />
      {/* <div className="container mx-auto px-4 py-4">
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
    </>
  );

  if (currentView === 'simulation' && activeScenario) {
    return (
      <div className="min-h-screen bg-background">
        {renderTopBar()}
        <div className="container mx-auto px-4 py-6">
          <DrillSimulation
            scenario={activeScenario}
            onComplete={handleDrillComplete}
            onExit={() => {
              setCurrentView('overview');
              setActiveScenario(null);
            }}
            onPause={() => {}}
          />
        </div>
      </div>
    );
  }

  if (currentView === 'results' && drillResults) {
    return (
      <div className="min-h-screen bg-background">
        {renderTopBar()}
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-4xl mx-auto">
            <DrillResults
              results={drillResults}
              scenario={activeScenario}
              onRetry={() => setCurrentView('simulation')}
              onContinue={() => {
                setCurrentView('overview');
                setActiveScenario(null);
                setDrillResults(null);
              }}
              onViewCertificate={() => window.alert('Certificate download can be connected next.')}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {renderTopBar()}
      <div className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Virtual Emergency Drills</h1>
              <p className="text-muted-foreground">
                Practice emergency response skills through guided simulations for public and institutional safety.
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{completedDrills}</div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-warning">{totalDrills - completedDrills}</div>
                <div className="text-sm text-muted-foreground">Remaining</div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate('/disaster-learning-modules')} iconName="BookOpen">
              Learning Modules
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate('/preparedness-assessment')} iconName="ClipboardCheck">
              Assessment
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate('/real-time-alerts')} iconName="AlertTriangle">
              Emergency Alerts
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-1 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <DrillCategories selectedCategory={selectedCategory} onCategorySelect={setSelectedCategory} userProgress={userProgress} />

            <div className="bg-card border border-border rounded-lg shadow-soft p-4">
              <h3 className="font-semibold text-card-foreground mb-3">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Completion Rate</span>
                  <span className="font-medium text-card-foreground">{Math.round((completedDrills / totalDrills) * 100)}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Average Score</span>
                  <span className="font-medium text-card-foreground">{averageScore}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Points</span>
                  <span className="font-medium text-primary">
                    {Object.values(userProgress).reduce((sum, item) => sum + (item?.points || 0), 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6">
            {selectedCategory === 'all' && (
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-card-foreground mb-1">Featured Drill</h3>
                    <p className="text-muted-foreground">Recommended based on your current drill progress</p>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4 items-center">
                  <div>
                    <h4 className="font-semibold text-card-foreground mb-2">Fire Emergency Response</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Strengthen evacuation, fire response, and coordination skills with a guided scenario.
                    </p>
                    <Button onClick={() => handleStartDrill(drillScenarios[2])} iconName="Play">
                      Start Featured Drill
                    </Button>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-1">{averageScore || 92}%</div>
                    <div className="text-sm text-muted-foreground">Recent Drill Score</div>
                  </div>
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-card-foreground">
                  {selectedCategory === 'all' ? 'All Drills' : `${selectedCategory.replace('-', ' ')} Drills`}
                </h3>
                <span className="text-sm text-muted-foreground">
                  {filteredScenarios.length} drill{filteredScenarios.length !== 1 ? 's' : ''} available
                </span>
              </div>

              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredScenarios.map((scenario) => (
                  <DrillScenarioCard
                    key={scenario.id}
                    scenario={scenario}
                    onStartDrill={handleStartDrill}
                    userProgress={userProgress}
                  />
                ))}
              </div>
            </div>

            <DrillProgress userProgress={userProgress} totalDrills={totalDrills} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualEmergencyDrills;
