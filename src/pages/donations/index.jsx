import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import EmergencyAlertIndicator from '../../components/ui/EmergencyAlertIndicator';
import { useAppData } from '../../contexts/AppDataContext';
import { useAuth } from '../../contexts/AuthContext';

const donationsData = [
  // CM Relief Funds
  {
    id: 1,
    organization_name: 'CM Relief Fund - Andhra Pradesh',
    state: 'Andhra Pradesh',
    category: 'CM Relief Fund',
    description: 'Supports disaster relief and rehabilitation efforts across Andhra Pradesh. Contributions help provide immediate aid to citizens affected by cyclones, floods, and other calamities.',
    donation_link: 'https://cmrf.ap.gov.in',
    icon: 'Landmark',
    featured: true
  },
  {
    id: 2,
    organization_name: 'CM Relief Fund - Tamil Nadu',
    state: 'Tamil Nadu',
    category: 'CM Relief Fund',
    description: 'Provides financial aid during emergencies and disasters in Tamil Nadu. Funds are used for rescue operations, medical assistance, and rebuilding infrastructure.',
    donation_link: 'https://cmrf.tn.gov.in',
    icon: 'Landmark',
    featured: true
  },
  {
    id: 3,
    organization_name: 'CM Relief Fund - Karnataka',
    state: 'Karnataka',
    category: 'CM Relief Fund',
    description: 'Helps citizens affected by natural calamities in Karnataka. The fund covers emergency shelter, food supplies, and long-term rehabilitation programs.',
    donation_link: 'https://cmrf.karnataka.gov.in',
    icon: 'Landmark',
    featured: false
  },
  {
    id: 4,
    organization_name: 'CM Relief Fund - Kerala',
    state: 'Kerala',
    category: 'CM Relief Fund',
    description: 'Chief Minister\'s Distress Relief Fund for Kerala. Provides critical assistance during floods, landslides, and other natural emergencies prevalent in the state.',
    donation_link: 'https://donation.cmdrf.kerala.gov.in',
    icon: 'Landmark',
    featured: true
  },
  {
    id: 5,
    organization_name: 'CM Relief Fund - Maharashtra',
    state: 'Maharashtra',
    category: 'CM Relief Fund',
    description: 'Supports emergency response and recovery in Maharashtra. Provides relief during monsoon flooding, droughts, and urban disaster incidents.',
    donation_link: 'https://cmrf.maharashtra.gov.in',
    icon: 'Landmark',
    featured: false
  },
  {
    id: 6,
    organization_name: 'CM Relief Fund - Gujarat',
    state: 'Gujarat',
    category: 'CM Relief Fund',
    description: 'Gujarat State Disaster Management Fund for immediate relief. Covers earthquake preparedness, cyclone response, and community resilience programs.',
    donation_link: 'https://cmrf.gujarat.gov.in',
    icon: 'Landmark',
    featured: false
  },
  {
    id: 7,
    organization_name: 'CM Relief Fund - Odisha',
    state: 'Odisha',
    category: 'CM Relief Fund',
    description: 'Odisha Chief Minister\'s Relief Fund focused on cyclone and flood disaster response. Recognized for effective utilization during Cyclone Fani and subsequent disasters.',
    donation_link: 'https://cmrf.odisha.gov.in',
    icon: 'Landmark',
    featured: true
  },
  {
    id: 8,
    organization_name: 'CM Relief Fund - West Bengal',
    state: 'West Bengal',
    category: 'CM Relief Fund',
    description: 'West Bengal State Emergency Relief Fund. Provides assistance during cyclones, river flooding, and other natural calamities affecting the state.',
    donation_link: 'https://cmrf.wb.gov.in',
    icon: 'Landmark',
    featured: false
  },
  // NGOs
  {
    id: 9,
    organization_name: 'Goonj',
    state: 'Pan India',
    category: 'NGO',
    description: 'A national NGO that channels urban surplus material as a development resource for under-served communities. Active in disaster relief across India with community-driven approaches.',
    donation_link: 'https://goonj.org',
    icon: 'Heart',
    featured: true
  },
  {
    id: 10,
    organization_name: 'Rapid Response',
    state: 'Tamil Nadu',
    category: 'NGO',
    description: 'Specializes in rapid disaster response and early recovery across South India. Provides emergency shelters, clean water, and medical aid within hours of a disaster.',
    donation_link: 'https://rapidresponse.org.in',
    icon: 'Heart',
    featured: false
  },
  {
    id: 11,
    organization_name: 'SEEDS India',
    state: 'Pan India',
    category: 'NGO',
    description: 'Sustainable Environment and Ecological Development Society. Works on disaster readiness, response, and recovery with a focus on building resilient communities.',
    donation_link: 'https://seedsindia.org',
    icon: 'Heart',
    featured: true
  },
  {
    id: 12,
    organization_name: 'Save the Children India',
    state: 'Pan India',
    category: 'NGO',
    description: 'Focuses on child protection during disasters. Provides emergency education, nutrition support, and psychological first aid to children in disaster-affected areas.',
    donation_link: 'https://savethechildren.in',
    icon: 'Heart',
    featured: true
  },
  {
    id: 13,
    organization_name: 'ActionAid India',
    state: 'Pan India',
    category: 'NGO',
    description: 'Works with communities to build long-term disaster resilience. Focuses on climate adaptation, emergency preparedness, and rights-based disaster response.',
    donation_link: 'https://actionaidindia.org',
    icon: 'Heart',
    featured: false
  },
  {
    id: 14,
    organization_name: 'Mercy Corps India',
    state: 'Pan India',
    category: 'NGO',
    description: 'Provides emergency relief and long-term recovery programs during major disasters. Focuses on water, sanitation, and hygiene (WASH) in disaster zones.',
    donation_link: 'https://mercycorps.org.in',
    icon: 'Heart',
    featured: false
  },
  {
    id: 15,
    organization_name: 'Habitat for Humanity India',
    state: 'Pan India',
    category: 'NGO',
    description: 'Builds disaster-resilient housing for vulnerable families. Provides shelter repair and reconstruction after floods, earthquakes, and cyclones across India.',
    donation_link: 'https://habitatindia.org',
    icon: 'Heart',
    featured: false
  },
  {
    id: 16,
    organization_name: 'Oxfam India',
    state: 'Pan India',
    category: 'NGO',
    description: 'Responds to humanitarian crises with clean water, food, sanitation, and livelihood recovery. Works in disaster-prone regions to strengthen community preparedness.',
    donation_link: 'https://oxfamindia.org',
    icon: 'Heart',
    featured: true
  }
];

const allStates = [...new Set(donationsData.map(d => d.state))].sort();

const DonationsPage = () => {
  const { user } = useAuth();
  const { alerts, profile } = useAppData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const activeAlertCount = alerts.filter(
    (alert) => !(alert?.acknowledgedBy || []).includes(user?.uid)
  ).length;
  const latestAlert = alerts[0]
    ? {
        title: alerts[0].title,
        preview: `${alerts[0].description.substring(0, 100)}...`,
        time: new Date(alerts[0].timestamp).toLocaleTimeString('en-IN')
      }
    : null;

  const filteredDonations = useMemo(() => {
    let filtered = [...donationsData];

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (d) =>
          d.organization_name.toLowerCase().includes(lowerSearch) ||
          d.state.toLowerCase().includes(lowerSearch) ||
          d.description.toLowerCase().includes(lowerSearch)
      );
    }

    if (selectedState) {
      filtered = filtered.filter((d) => d.state === selectedState);
    }

    if (activeCategory !== 'All') {
      filtered = filtered.filter((d) => d.category === activeCategory);
    }

    return filtered;
  }, [searchTerm, selectedState, activeCategory]);

  const stats = useMemo(() => ({
    totalOrgs: donationsData.length,
    cmFunds: donationsData.filter(d => d.category === 'CM Relief Fund').length,
    ngos: donationsData.filter(d => d.category === 'NGO').length,
    states: new Set(donationsData.map(d => d.state)).size
  }), []);

  const categories = ['All', 'CM Relief Fund', 'NGO'];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Donations - Disaster Preparedness and Response Education System</title>
        <meta name="description" content="Support disaster relief efforts by donating to CM Relief Funds and NGOs across Indian states." />
      </Helmet>
      <Header userRole={profile?.role || 'public'} alertCount={activeAlertCount} onMenuToggle={() => {}} />
      <EmergencyAlertIndicator
        alertCount={activeAlertCount}
        alertLevel={activeAlertCount > 0 ? 'medium' : 'low'}
        latestAlert={latestAlert}
      />

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="relative mb-8 rounded-2xl overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-secondary p-8 md:p-12">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/4" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Icon name="HeartHandshake" size={28} color="white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">Donations</h1>
                <p className="text-white/80 text-sm md:text-base">Support disaster relief across India</p>
              </div>
            </div>
            <p className="text-white/90 max-w-2xl text-sm md:text-base leading-relaxed">
              Every contribution counts. Donate to Chief Minister Relief Funds and verified NGOs working tirelessly to bring relief to disaster-affected communities across Indian states.
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card border border-border rounded-xl p-4 transition-all duration-200 hover:shadow-elevated hover:-translate-y-0.5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Icon name="Building2" size={20} className="text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold text-card-foreground">{stats.totalOrgs}</div>
                <div className="text-xs text-muted-foreground">Organizations</div>
              </div>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 transition-all duration-200 hover:shadow-elevated hover:-translate-y-0.5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                <Icon name="Landmark" size={20} className="text-secondary" />
              </div>
              <div>
                <div className="text-2xl font-bold text-card-foreground">{stats.cmFunds}</div>
                <div className="text-xs text-muted-foreground">CM Relief Funds</div>
              </div>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 transition-all duration-200 hover:shadow-elevated hover:-translate-y-0.5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Icon name="Heart" size={20} className="text-accent" />
              </div>
              <div>
                <div className="text-2xl font-bold text-card-foreground">{stats.ngos}</div>
                <div className="text-xs text-muted-foreground">NGOs</div>
              </div>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 transition-all duration-200 hover:shadow-elevated hover:-translate-y-0.5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <Icon name="MapPin" size={20} className="text-warning" />
              </div>
              <div>
                <div className="text-2xl font-bold text-card-foreground">{stats.states}</div>
                <div className="text-xs text-muted-foreground">States Covered</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-card border border-border rounded-xl p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Icon
                name="Search"
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                id="donations-search"
                type="text"
                placeholder="Search organizations, states..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200"
              />
            </div>
            {/* State Filter */}
            <div className="md:w-56">
              <select
                id="donations-state-filter"
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200 appearance-none cursor-pointer"
              >
                <option value="">All States</option>
                {allStates.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${activeCategory === cat
                    ? 'bg-primary text-primary-foreground shadow-soft'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                  }
                `}
              >
                {cat === 'All' ? 'All' : cat === 'CM Relief Fund' ? '🏛️ CM Funds' : '❤️ NGOs'}
              </button>
            ))}
            <div className="ml-auto text-sm text-muted-foreground">
              {filteredDonations.length} result{filteredDonations.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Featured Section */}
        {activeCategory === 'All' && !searchTerm && !selectedState && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Icon name="Star" size={20} className="text-accent" />
              <h2 className="text-xl font-semibold text-foreground">Featured Organizations</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {donationsData
                .filter((d) => d.featured)
                .slice(0, 3)
                .map((donation) => (
                  <div
                    key={`featured-${donation.id}`}
                    className="group relative bg-gradient-to-br from-primary/5 via-card to-secondary/5 border-2 border-primary/20 rounded-xl p-5 transition-all duration-300 hover:shadow-elevated hover:-translate-y-1 hover:border-primary/40"
                  >
                    <div className="absolute top-3 right-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent/10 text-accent text-xs font-medium">
                        <Icon name="Star" size={12} />
                        Featured
                      </span>
                    </div>
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        donation.category === 'CM Relief Fund'
                          ? 'bg-primary/10'
                          : 'bg-secondary/10'
                      }`}>
                        <Icon
                          name={donation.icon}
                          size={22}
                          className={donation.category === 'CM Relief Fund' ? 'text-primary' : 'text-secondary'}
                        />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-card-foreground text-sm leading-tight group-hover:text-primary transition-colors duration-200">
                          {donation.organization_name}
                        </h3>
                        <div className="flex items-center gap-1 mt-1">
                          <Icon name="MapPin" size={12} className="text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{donation.state}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
                      {donation.description}
                    </p>
                    <a
                      href={donation.donation_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 w-full justify-center px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium transition-all duration-200 hover:bg-primary/90 hover:shadow-soft"
                    >
                      <Icon name="Heart" size={14} />
                      Donate Now
                      <Icon name="ExternalLink" size={14} />
                    </a>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Main Donation Cards Grid */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-foreground mb-1">
            {activeCategory === 'All' ? 'All Organizations' : activeCategory === 'CM Relief Fund' ? 'Chief Minister Relief Funds' : 'Non-Governmental Organizations'}
          </h2>
          <p className="text-sm text-muted-foreground">
            {activeCategory === 'CM Relief Fund'
              ? 'State government-managed funds for disaster relief and rehabilitation.'
              : activeCategory === 'NGO'
              ? 'Verified non-profit organizations working in disaster relief across India.'
              : 'Browse all relief funds and NGOs to support disaster response.'}
          </p>
        </div>

        {filteredDonations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredDonations.map((donation) => (
              <div
                key={donation.id}
                className="group bg-card border border-border rounded-xl overflow-hidden transition-all duration-300 hover:shadow-elevated hover:-translate-y-1 hover:border-primary/30"
              >
                {/* Card Header Bar */}
                <div className={`h-1.5 ${
                  donation.category === 'CM Relief Fund'
                    ? 'bg-gradient-to-r from-primary to-primary/60'
                    : 'bg-gradient-to-r from-secondary to-secondary/60'
                }`} />

                <div className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200 group-hover:scale-110 ${
                        donation.category === 'CM Relief Fund'
                          ? 'bg-primary/10'
                          : 'bg-secondary/10'
                      }`}>
                        <Icon
                          name={donation.icon}
                          size={20}
                          className={donation.category === 'CM Relief Fund' ? 'text-primary' : 'text-secondary'}
                        />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-card-foreground text-sm leading-tight group-hover:text-primary transition-colors duration-200">
                          {donation.organization_name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                            donation.category === 'CM Relief Fund'
                              ? 'bg-primary/10 text-primary'
                              : 'bg-secondary/10 text-secondary'
                          }`}>
                            {donation.category}
                          </span>
                        </div>
                      </div>
                    </div>
                    {donation.featured && (
                      <Icon name="Star" size={16} className="text-accent flex-shrink-0 mt-0.5" />
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 mb-3">
                    <Icon name="MapPin" size={14} className="text-muted-foreground flex-shrink-0" />
                    <span className="text-xs font-medium text-muted-foreground">{donation.state}</span>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                    {donation.description}
                  </p>

                  <a
                    href={donation.donation_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-2 w-full justify-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-soft ${
                      donation.category === 'CM Relief Fund'
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/90'
                    }`}
                  >
                    <Icon name="Heart" size={14} />
                    Donate Now
                    <Icon name="ExternalLink" size={14} className="ml-auto" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-card border border-border rounded-xl">
            <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No organizations found</h3>
            <p className="text-muted-foreground mb-4">Try adjusting your search or filters.</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setSelectedState('');
                setActiveCategory('All');
              }}
            >
              Clear all filters
            </Button>
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-10 bg-muted/50 border border-border rounded-xl p-6">
          <div className="flex items-start gap-3">
            <Icon name="Info" size={20} className="text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-1">Disclaimer</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                The donation links listed are for demonstration purposes. Please verify the authenticity of any organization before making donations. 
                Official CM Relief Fund portals can be accessed through respective state government websites. 
                DisasterEd India does not collect or process any donations directly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationsPage;
