const learningModuleNodes = [
  {
    id: 'earthquake-safety',
    title: 'Earthquake Safety & Preparedness',
    path: '/disaster-learning-modules/earthquake-safety',
    icon: 'Mountain',
    description: 'Foundational earthquake safety guidance and response steps.',
    children: [
      {
        id: 'earthquake-car-safety',
        title: 'Earthquake Car Safety',
        path: '/disaster-learning-modules/EarthquakeCarSafety',
        icon: 'Car',
        description: 'Staying safe while driving during an earthquake.'
      },
      {
        id: 'earthquake-wheelchair-safety',
        title: 'Earthquake Safety for Wheelchair Users',
        path: '/disaster-learning-modules/EarthquakeWheelchairSafety',
        icon: 'Accessibility',
        description: 'Accessible earthquake response guidance for wheelchair users.'
      },
      {
        id: 'earthquake-help-friends',
        title: 'Helping Friends During Earthquakes',
        path: '/disaster-learning-modules/EarthquakeHelpFriends',
        icon: 'Users',
        description: 'Support others safely during and after seismic activity.'
      },
      {
        id: 'earthquake-dos-donts',
        title: 'Earthquake Dos and Don’ts',
        path: '/disaster-learning-modules/EarthquakeDosDonts',
        icon: 'ListChecks',
        description: 'Quick reference actions to follow and avoid.'
      }
    ]
  },
  {
    id: 'flood-preparedness',
    title: 'Flood Preparedness & Response',
    path: '/disaster-learning-modules/flood-preparedness',
    icon: 'Waves',
    description: 'Flood awareness, evacuation, and rescue readiness.',
    children: [
      {
        id: 'flood-awareness',
        title: 'Flood Awareness',
        path: '/disaster-learning-modules/FloodAwareness',
        icon: 'Droplets',
        description: 'Understand flood causes, signs, and local risks.'
      },
      {
        id: 'flood-evacuation-safety',
        title: 'Flood Evacuation Safety',
        path: '/disaster-learning-modules/FloodEvacuationSafety',
        icon: 'ArrowUpFromLine',
        description: 'Safe evacuation strategies during rising water levels.'
      },
      {
        id: 'flood-electrocution-risk',
        title: 'Electrocution Risks in Floods',
        path: '/disaster-learning-modules/FloodElectrocutionRisk',
        icon: 'Zap',
        description: 'Recognize and avoid electrical hazards in flooded areas.'
      },
      {
        id: 'flood-rescue-aid',
        title: 'Flood Rescue and Aid',
        path: '/disaster-learning-modules/FloodRescueAid',
        icon: 'LifeBuoy',
        description: 'Learn safe rescue support and post-flood aid basics.'
      }
    ]
  },
  {
    id: 'fire-safety',
    title: 'Fire Safety & Prevention',
    path: '/disaster-learning-modules/fire-safety',
    icon: 'Flame',
    description: 'Prevention, evacuation, and emergency response for fire incidents.',
    children: [
      {
        id: 'fire-safety-training',
        title: 'Fire Safety Training',
        path: '/disaster-learning-modules/fire-safety-training',
        icon: 'ClipboardList',
        description: 'Guided training on fire response procedures.'
      },
      {
        id: 'fire-blanket-training',
        title: 'Using a Fire Blanket',
        path: '/disaster-learning-modules/FireBlanketTraining',
        icon: 'Shield',
        description: 'Learn when and how to use a fire blanket safely.'
      },
      {
        id: 'fire-safety-dos-donts',
        title: 'Fire Safety Dos and Don’ts',
        path: '/disaster-learning-modules/FireSafetyDosDonts',
        icon: 'ListChecks',
        description: 'Fast-reference fire safety reminders for daily use.'
      }
    ]
  },
  {
    id: 'cyclone-awareness',
    title: 'Cyclone Awareness & Safety',
    path: '/disaster-learning-modules/cyclone-awareness',
    icon: 'Wind',
    description: 'Tracking, sheltering, and recovery guidance for storms and cyclones.',
    children: [
      {
        id: 'storm-official-warnings',
        title: 'Official Disaster Warnings',
        path: '/disaster-learning-modules/StormOfficialWarnings',
        icon: 'BellRing',
        description: 'Understand warning systems and official advisories.'
      },
      {
        id: 'cyclone-eye-safety',
        title: 'Cyclone Eye Safety',
        path: '/disaster-learning-modules/CycloneEyeSafety',
        icon: 'Eye',
        description: 'Why the eye of the cyclone is not the end of danger.'
      },
      {
        id: 'cyclone-power-safety',
        title: 'Cyclone Power Safety',
        path: '/disaster-learning-modules/CyclonePowerSafety',
        icon: 'PlugZap',
        description: 'Electrical safety practices before and after storms.'
      }
    ]
  },
  {
    id: 'first-aid-basics',
    title: 'First Aid & Emergency Medical Response',
    path: '/disaster-learning-modules/first-aid-basics',
    icon: 'HeartPulse',
    description: 'Emergency medical basics for public preparedness.',
    children: [
      {
        id: 'cuts-bleeding-aid',
        title: 'Cuts and Bleeding Aid',
        path: '/disaster-learning-modules/CutsBleedingAid',
        icon: 'Bandage',
        description: 'Control bleeding and provide basic wound care.'
      },
      {
        id: 'fracture-aid',
        title: 'Fracture and Broken Bones Aid',
        path: '/disaster-learning-modules/FractureAid',
        icon: 'Bone',
        description: 'Stabilize fractures and reduce further harm.'
      },
      {
        id: 'nosebleed-aid',
        title: 'Nosebleed First Aid',
        path: '/disaster-learning-modules/NosebleedAid',
        icon: 'Cross',
        description: 'Simple first-aid steps for nosebleed management.'
      },
      {
        id: 'cpr-aid',
        title: 'CPR First Aid',
        path: '/disaster-learning-modules/CprAid',
        icon: 'Heart',
        description: 'Basic CPR awareness and response flow.'
      },
      {
        id: 'emergency-get-help',
        title: 'Getting Help in an Emergency',
        path: '/disaster-learning-modules/EmergencyGetHelp',
        icon: 'PhoneCall',
        description: 'Know when, where, and how to ask for urgent help.'
      },
      {
        id: 'emergency-training',
        title: 'Emergency Training Scenario',
        path: '/disaster-learning-modules/EmergencyTraining',
        icon: 'Siren',
        description: 'Practice calm decision-making during emergencies.'
      }
    ]
  }
];

export const siteStructure = [
  {
    id: 'home',
    title: 'Home',
    path: '/',
    icon: 'House',
    description: 'Entry point that redirects to the learning hub for signed-in users.',
    children: [
      {
        id: 'learn',
        title: 'Learn',
        navLabel: 'Learn',
        path: '/disaster-learning-modules',
        icon: 'BookOpen',
        description: 'Access learning modules, drills, and preparedness assessments.',
        inPrimaryNav: true,
        isDropdownNav: true,
        children: [
          {
            id: 'learning-modules-overview',
            title: 'Learning Modules',
            path: '/disaster-learning-modules',
            icon: 'Library',
            description: 'Overview of all disaster learning modules.',
            inDropdownNav: true,
            children: learningModuleNodes
          },
          {
            id: 'virtual-emergency-drills',
            title: 'Virtual Emergency Drills',
            path: '/virtual-emergency-drills',
            icon: 'PlaySquare',
            description: 'Interactive emergency drill simulations.',
            inDropdownNav: true
          },
          {
            id: 'preparedness-assessment',
            title: 'Preparedness Assessment',
            path: '/preparedness-assessment',
            icon: 'ClipboardCheck',
            description: 'Measure disaster readiness through assessments.',
            inDropdownNav: true
          }
        ]
      },
      {
        id: 'disaster-games',
        title: 'Disaster Games',
        navLabel: 'Disaster Games',
        path: '/disaster-games',
        icon: 'Gamepad2',
        description: 'Trusted external disaster education games.',
        inPrimaryNav: true
      },
      {
        id: 'sitemap',
        title: 'Sitemap',
        navLabel: 'Sitemap',
        path: '/sitemap',
        icon: 'GitBranch',
        description: 'Interactive map of the full application structure.',
        inPrimaryNav: true
      },
      {
        id: 'dashboard',
        title: 'Dashboard',
        navLabel: 'Dashboard',
        path: '/admin-dashboard',
        icon: 'LayoutDashboard',
        description: 'View analytics, monitoring, and administration tools.',
        inPrimaryNav: true
      },
      {
        id: 'alerts',
        title: 'Alerts',
        navLabel: 'Alerts',
        path: '/real-time-alerts',
        icon: 'AlertTriangle',
        description: 'Real-time emergency alerts and updates.',
        inPrimaryNav: true,
        isEmergency: true
      },
      {
        id: 'donations',
        title: 'Donations',
        navLabel: 'Donations',
        path: '/donations',
        icon: 'HeartHandshake',
        description: 'Support disaster relief initiatives and organizations.',
        inPrimaryNav: true
      },
      {
        id: 'profile',
        title: 'Profile',
        path: '/profile',
        icon: 'User',
        description: 'Manage your account details and preferences.'
      },
      {
        id: 'onboarding',
        title: 'Onboarding',
        path: '/onboarding',
        icon: 'Sparkles',
        description: 'Complete account setup and profile details.'
      },
      {
        id: 'login',
        title: 'Login',
        path: '/login',
        icon: 'LogIn',
        description: 'Authenticate with your account.'
      }
    ]
  }
];

export const flattenSiteStructure = (nodes, trail = []) =>
  nodes.flatMap((node) => {
    const nextTrail = [...trail, node];
    return [
      { ...node, breadcrumbTrail: nextTrail },
      ...(node.children ? flattenSiteStructure(node.children, nextTrail) : [])
    ];
  });

export const findTrailByPath = (nodes, targetPath, trail = []) => {
  for (const node of nodes) {
    const nextTrail = [...trail, node];

    if (node.path === targetPath) {
      return nextTrail;
    }

    if (node.children) {
      const childResult = findTrailByPath(node.children, targetPath, nextTrail);
      if (childResult.length > 0) {
        return childResult;
      }
    }
  }

  return [];
};

export const collectNodeIds = (nodes) =>
  nodes.flatMap((node) => [node.id, ...(node.children ? collectNodeIds(node.children) : [])]);

export const filterSiteStructure = (nodes, query) => {
  if (!query) {
    return nodes;
  }

  const normalizedQuery = query.toLowerCase();

  return nodes.reduce((accumulator, node) => {
    const filteredChildren = node.children ? filterSiteStructure(node.children, normalizedQuery) : [];
    const isMatch =
      node.title.toLowerCase().includes(normalizedQuery) ||
      node.description?.toLowerCase().includes(normalizedQuery) ||
      node.path?.toLowerCase().includes(normalizedQuery);

    if (isMatch || filteredChildren.length > 0) {
      accumulator.push({
        ...node,
        children: filteredChildren
      });
    }

    return accumulator;
  }, []);
};

export const getPrimaryNavigationItems = () => {
  const allNodes = flattenSiteStructure(siteStructure);

  return allNodes
    .filter((node) => node.inPrimaryNav)
    .map((node) => ({
      label: node.navLabel || node.title,
      path: node.path,
      icon: node.icon,
      description: node.description,
      isEmergency: node.isEmergency,
      subItems: node.isDropdownNav
        ? (node.children || [])
            .filter((child) => child.inDropdownNav)
            .map((child) => ({
              label: child.title,
              path: child.path
            }))
        : undefined
    }));
};
