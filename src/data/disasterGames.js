export const TRUSTED_GAME_HOSTS = [
  'www.stopdisastersgame.org',
  'stopdisastersgame.org',
  'www.ready.gov',
  'ready.gov',
  'www.fema.gov',
  'fema.gov'
];

export const disasterGames = [
  {
    id: 'stop-disasters',
    gameTitle: 'Stop Disasters!',
    description: 'Build safer schools, towns, and coastlines while learning how risk-reduction choices can limit disaster damage.',
    disasterType: 'Multiple',
    externalLink: 'https://www.stopdisastersgame.org/game/',
    sourceName: 'UNDRR',
    verified: true
  },
  {
    id: 'disaster-master',
    gameTitle: 'Disaster Master',
    description: 'Choose a disaster scenario, answer preparedness questions, and practice smart response decisions for families and classrooms.',
    disasterType: 'Multiple',
    externalLink: 'https://www.ready.gov/kids/games/data/dm-english/index.html',
    sourceName: 'Ready.gov',
    verified: true
  },
  {
    id: 'prepare-with-pedro',
    gameTitle: 'Prepare with Pedro',
    description: 'Help Pedro get ready for hazards like home fires and hurricanes through a child-friendly preparedness game experience.',
    disasterType: 'Fire and Storm',
    externalLink: 'https://www.ready.gov/kids/games/data/pedro.html',
    sourceName: 'Ready.gov',
    verified: true
  },
  {
    id: 'disaster-mind',
    gameTitle: 'Disaster Mind',
    description: 'Test your knowledge with FEMA’s emergency preparedness quiz-style game focused on practical disaster safety decisions.',
    disasterType: 'Multiple',
    externalLink: 'https://www.fema.gov/about/organization/region-8/disaster-mind',
    sourceName: 'FEMA',
    verified: true
  }
];
