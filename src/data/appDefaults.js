export const moduleCatalog = [
  { id: 'earthquake-safety', title: 'Earthquake Safety & Preparedness' },
  { id: 'flood-preparedness', title: 'Flood Preparedness & Response' },
  { id: 'fire-safety', title: 'Fire Safety & Prevention' },
  { id: 'cyclone-awareness', title: 'Cyclone Awareness & Safety' },
  { id: 'first-aid-basics', title: 'First Aid & Emergency Medical Response' }
];

export const assessmentCatalog = [
  { id: 'basic-preparedness', title: 'Basic Preparedness Assessment' },
  { id: 'earthquake-response', title: 'Earthquake Response Assessment' },
  { id: 'flood-preparedness', title: 'Flood Preparedness Assessment' },
  { id: 'fire-safety', title: 'Fire Safety Assessment' },
  { id: 'advanced-response', title: 'Advanced Emergency Response' },
  { id: 'first-aid', title: 'First Aid Assessment' }
];

export const drillCatalog = [
  { id: 'evacuation-drill', title: 'School Evacuation Drill' },
  { id: 'shelter-in-place', title: 'Shelter-in-Place Protocol' },
  { id: 'fire-evacuation', title: 'Fire Emergency Response' },
  { id: 'earthquake-response', title: 'Earthquake Safety Drill' },
  { id: 'flood-response', title: 'Flood Emergency Drill' },
  { id: 'medical-emergency', title: 'Medical Emergency Response' }
];

export const createDefaultModuleProgress = () =>
  moduleCatalog.reduce((acc, module) => {
    acc[module.id] = { percentage: 0, completed: false, lastAccessed: null };
    return acc;
  }, {});

export const createDefaultAssessmentProgress = () =>
  assessmentCatalog.reduce((acc, assessment) => {
    acc[assessment.id] = {
      percentage: 0,
      completed: false,
      score: null,
      attempts: 0,
      lastAttempt: null,
      status: 'not-started'
    };
    return acc;
  }, {});

export const createDefaultDrillProgress = () =>
  drillCatalog.reduce((acc, drill) => {
    acc[drill.id] = {
      percentage: 0,
      completed: false,
      lastScore: 0,
      points: 0,
      timeUsed: null,
      attempts: 0,
      lastAttempt: null
    };
    return acc;
  }, {});

export const createDefaultProfile = (user) => ({
  fullName: user?.name || '',
  email: user?.email || '',
  phone: '',
  city: '',
  state: '',
  organization: '',
  emergencyContactName: '',
  emergencyContactPhone: '',
  role: 'public'
});

export const requiredProfileFields = [
  'fullName',
  'email',
  'phone',
  'city',
  'state'
];

export const sampleAlerts = [
  {
    id: 'sample-flood-alert',
    title: 'Heavy Rainfall Alert - Mumbai Region',
    description: 'The India Meteorological Department has issued a heavy rainfall warning for Mumbai and surrounding areas. Avoid waterlogged roads, keep emergency supplies ready, and follow official advisories.',
    type: 'flood',
    severity: 'high',
    location: 'Mumbai, Maharashtra',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    source: 'India Meteorological Department',
    impactLevel: 'Regional',
    affectedAreas: ['Mumbai', 'Thane', 'Navi Mumbai', 'Kalyan'],
    expectedDuration: '6-8 hours',
    recommendedActions: [
      'Avoid outdoor travel unless necessary',
      'Keep emergency contact numbers ready',
      'Stay away from electrical equipment near water'
    ],
    acknowledgedBy: []
  },
  {
    id: 'sample-drill-alert',
    title: 'Earthquake Preparedness Drill - Scheduled',
    description: 'A public earthquake preparedness drill is scheduled for participating institutions and community centers. Practice Drop, Cover, and Hold On and follow local safety instructions.',
    type: 'earthquake',
    severity: 'medium',
    location: 'Delhi NCR',
    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    source: 'National Disaster Management Authority',
    impactLevel: 'Regional',
    affectedAreas: ['Delhi', 'Gurgaon', 'Noida', 'Faridabad'],
    expectedDuration: '30 minutes',
    recommendedActions: [
      'Review earthquake response steps',
      'Confirm evacuation points',
      'Keep emergency contacts accessible'
    ],
    acknowledgedBy: []
  }
];
