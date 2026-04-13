import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import EmergencyAlertIndicator from '../../components/ui/EmergencyAlertIndicator';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import LocationRiskMap from './components/LocationRiskMap';
import RescueShelterCard from './components/RescueShelterCard';
import { useAppData } from '../../contexts/AppDataContext';
import { useAuth } from '../../contexts/AuthContext';

const rescueShelterSeedData = [
  {
    id: 'shelter-vijayawada-ndrf',
    name: 'NDRF Relief Camp - Vijayawada',
    city: 'Vijayawada',
    state: 'Andhra Pradesh',
    disasterType: 'Flood',
    capacityTotal: 500,
    capacityAvailable: 120,
    status: 'Open',
    managedBy: 'NDRF',
    contactPhone: '+91-9876543210',
    contactEmail: 'relief.ap@ndrf.gov.in',
    services: ['Medical desk', 'Women and child support', 'Drinking water', 'Temporary bedding'],
    notes: 'Receiving evacuees from low-lying Krishna river belt communities and nearby highway diversions.'
  },
  {
    id: 'shelter-chennai-north',
    name: 'Cyclone Shelter - Chennai North',
    city: 'Chennai',
    state: 'Tamil Nadu',
    disasterType: 'Cyclone',
    capacityTotal: 300,
    capacityAvailable: 0,
    status: 'Full',
    managedBy: 'State Disaster Response Force',
    contactPhone: '+91-9123456780',
    contactEmail: 'tnrelief@gov.in',
    services: ['Food distribution', 'Charging points', 'Medical observation'],
    notes: 'Currently full. New arrivals are being redirected to overflow camps in Ennore and Red Hills.'
  },
  {
    id: 'shelter-guwahati-central',
    name: 'Emergency Camp - Guwahati Central',
    city: 'Guwahati',
    state: 'Assam',
    disasterType: 'Flood',
    capacityTotal: 400,
    capacityAvailable: 200,
    status: 'Open',
    managedBy: 'NGO + NDRF',
    contactPhone: '+91-9988776655',
    contactEmail: 'assamhelp@ngo.org',
    services: ['Boat coordination', 'First aid', 'Family reunification help', 'Child-friendly safe zone'],
    notes: 'Serving central city wards and riverside settlements affected by rising Brahmaputra water levels.'
  },
  {
    id: 'shelter-delhi-ncr',
    name: 'Delhi NCR Emergency Transit Shelter',
    city: 'New Delhi',
    state: 'Delhi',
    disasterType: 'Earthquake',
    capacityTotal: 250,
    capacityAvailable: 95,
    status: 'Open',
    managedBy: 'National Disaster Management Authority',
    contactPhone: '+91-9811002211',
    contactEmail: 'quake-response@ndma.gov.in',
    services: ['Structural safety screening', 'Basic trauma care', 'Emergency supplies', 'Counselling support'],
    notes: 'Activated as a precautionary shelter and staging point during seismic advisories and public drills.'
  },
  {
    id: 'shelter-kolkata-relief',
    name: 'Howrah Riverside Relief Camp',
    city: 'Kolkata',
    state: 'West Bengal',
    disasterType: 'Flood',
    capacityTotal: 350,
    capacityAvailable: 35,
    status: 'Open',
    managedBy: 'West Bengal SDRF',
    contactPhone: '+91-9830012345',
    contactEmail: 'howrah.relief@wb.gov.in',
    services: ['Senior citizen assistance', 'Meals', 'Clean water', 'Sanitation kits'],
    notes: 'High occupancy due to embankment overflow. Priority intake continues for elderly residents and families with infants.'
  },
  {
    id: 'shelter-bhubaneswar-closed',
    name: 'Coastal Rescue Camp - Bhubaneswar East',
    city: 'Bhubaneswar',
    state: 'Odisha',
    disasterType: 'Cyclone',
    capacityTotal: 280,
    capacityAvailable: 0,
    status: 'Closed',
    managedBy: 'Odisha State Disaster Management Authority',
    contactPhone: '+91-9778899001',
    contactEmail: 'coastalcamp.osdma@odisha.gov.in',
    services: ['Temporary shelter', 'Food packets', 'Power backup'],
    notes: 'Closed for sanitation reset and resupply. Nearby open camps are handling incoming evacuees.'
  }
];

const formatAlertTime = (timestamp) =>
  new Date(timestamp).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit'
  });

const RescueSheltersPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { alerts, profile } = useAppData();
  const [search, setSearch] = useState('');
  const [selectedDisaster, setSelectedDisaster] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [userLocation, setUserLocation] = useState('mumbai');

  const normalizedAlerts = useMemo(() => alerts.map((alert) => ({
    ...alert,
    acknowledged: (alert?.acknowledgedBy || []).includes(user?.uid)
  })), [alerts, user?.uid]);

  const activeAlerts = normalizedAlerts.filter((alert) => !alert.acknowledged);
  const activeAlertCount = activeAlerts.length;
  const criticalAlerts = activeAlerts.filter((item) => item.severity === 'critical');
  const latestAlert = normalizedAlerts[0]
    ? {
        title: normalizedAlerts[0].title,
        preview: `${normalizedAlerts[0].description.substring(0, 100)}...`,
        time: formatAlertTime(normalizedAlerts[0].timestamp)
      }
    : null;

  const sheltersWithContext = useMemo(() => {
    return rescueShelterSeedData.map((shelter) => {
      const relatedAlerts = activeAlerts.filter((alert) => {
        const sameType = alert?.type?.toLowerCase() === shelter.disasterType.toLowerCase();
        const locationText = `${alert?.location || ''} ${(alert?.affectedAreas || []).join(' ')}`.toLowerCase();
        const locationMatch =
          locationText.includes(shelter.city.toLowerCase()) ||
          locationText.includes(shelter.state.toLowerCase());

        return sameType || locationMatch;
      });

      return {
        ...shelter,
        relatedAlerts,
        relatedAlertCount: relatedAlerts.length
      };
    });
  }, [activeAlerts]);

  const locationOptions = useMemo(() => [
    { label: 'All locations', value: 'all' },
    ...sheltersWithContext.map((shelter) => ({
      label: `${shelter.city}, ${shelter.state}`,
      value: shelter.id
    }))
  ], [sheltersWithContext]);

  const disasterOptions = [
    { label: 'All disaster types', value: 'all' },
    { label: 'Flood', value: 'Flood' },
    { label: 'Cyclone', value: 'Cyclone' },
    { label: 'Earthquake', value: 'Earthquake' }
  ];

  const filteredShelters = useMemo(() => sheltersWithContext.filter((shelter) => {
    if (selectedDisaster !== 'all' && shelter.disasterType !== selectedDisaster) {
      return false;
    }

    if (selectedLocation !== 'all' && shelter.id !== selectedLocation) {
      return false;
    }

    if (search.trim()) {
      const term = search.toLowerCase();
      const haystack = [
        shelter.name,
        shelter.city,
        shelter.state,
        shelter.managedBy,
        shelter.disasterType
      ].join(' ').toLowerCase();

      if (!haystack.includes(term)) {
        return false;
      }
    }

    return true;
  }), [search, selectedDisaster, selectedLocation, sheltersWithContext]);

  const openShelterCount = sheltersWithContext.filter((shelter) => shelter.status === 'Open').length;
  const fullShelterCount = sheltersWithContext.filter((shelter) => shelter.status === 'Full').length;
  const availableSlots = sheltersWithContext.reduce((sum, shelter) => sum + shelter.capacityAvailable, 0);
  const sheltersLinkedToAlerts = sheltersWithContext.filter((shelter) => shelter.relatedAlertCount > 0).length;

  return (
    <div className="min-h-screen bg-background">
      <Header userRole={profile?.role || 'public'} alertCount={activeAlertCount} onMenuToggle={() => {}} />
      <EmergencyAlertIndicator
        alertCount={activeAlertCount}
        alertLevel={criticalAlerts.length > 0 ? 'critical' : 'medium'}
        latestAlert={latestAlert}
      />

      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Rescue Shelters</h1>
              <p className="text-muted-foreground mt-2">
                Find nearby rescue shelters and camps during active disaster alerts, including facilities coordinated by NDRF, SDRF teams, and partner NGOs.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => navigate('/real-time-alerts')} iconName="BellRing" iconPosition="left">
                Active Alerts
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => navigate('/real-time-alerts')} iconName="AlertTriangle" iconPosition="left">
              Alerts Feed
            </Button>
            <Button variant="default" onClick={() => navigate('/real-time-alerts/rescue-shelters')} iconName="HousePlus" iconPosition="left">
              Rescue Shelters
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-xl p-4 shadow-soft">
            <div className="text-2xl font-bold text-card-foreground">{openShelterCount}</div>
            <div className="text-xs text-muted-foreground">Open Shelters</div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 shadow-soft">
            <div className="text-2xl font-bold text-card-foreground">{availableSlots}</div>
            <div className="text-xs text-muted-foreground">Available Slots</div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 shadow-soft">
            <div className="text-2xl font-bold text-card-foreground">{sheltersLinkedToAlerts}</div>
            <div className="text-xs text-muted-foreground">Linked to Active Alerts</div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 shadow-soft">
            <div className="text-2xl font-bold text-card-foreground">{fullShelterCount}</div>
            <div className="text-xs text-muted-foreground">At Full Capacity</div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            <div className="bg-card border border-border rounded-xl p-4 shadow-soft">
              <div className="flex items-center gap-2 mb-4">
                <Icon name="Filter" size={18} className="text-primary" />
                <h2 className="text-lg font-semibold text-card-foreground">Find a Shelter</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Search shelters"
                  placeholder="Search by shelter, city, or agency"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
                <Select
                  label="Disaster type"
                  options={disasterOptions}
                  value={selectedDisaster}
                  onChange={setSelectedDisaster}
                />
                <Select
                  label="Location"
                  options={locationOptions}
                  value={selectedLocation}
                  onChange={setSelectedLocation}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">
                  Available Shelters ({filteredShelters.length})
                </h2>
                <div className="text-sm text-muted-foreground">
                  Updated against the current alert feed
                </div>
              </div>

              {filteredShelters.length === 0 ? (
                <div className="bg-card border border-border rounded-xl p-8 text-center">
                  <Icon name="HouseX" size={44} className="mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-medium text-card-foreground mb-2">No shelters match those filters</h3>
                  <p className="text-sm text-muted-foreground">
                    Try widening your location or disaster type filters to see nearby rescue camps.
                  </p>
                </div>
              ) : (
                filteredShelters.map((shelter) => (
                  <RescueShelterCard key={shelter.id} shelter={shelter} />
                ))
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-card border border-border rounded-xl p-4 shadow-soft">
              <h3 className="font-semibold text-card-foreground mb-4 flex items-center">
                <Icon name="Radio" size={18} className="mr-2" />
                Alert Coordination
              </h3>
              <div className="space-y-3">
                {activeAlerts.length > 0 ? activeAlerts.slice(0, 3).map((alert) => (
                  <div key={alert.id} className="rounded-lg border border-border bg-muted/30 p-3">
                    <div className="font-medium text-card-foreground">{alert.title}</div>
                    <div className="text-sm text-muted-foreground mt-1">{alert.location}</div>
                  </div>
                )) : (
                  <p className="text-sm text-muted-foreground">
                    No active alerts right now. Shelter listing remains available for preparedness planning and overflow coordination.
                  </p>
                )}
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-4 shadow-soft">
              <h3 className="font-semibold text-card-foreground mb-4 flex items-center">
                <Icon name="Phone" size={18} className="mr-2" />
                Emergency Contacts
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between"><span>National Emergency</span><a href="tel:112" className="text-primary font-medium">112</a></div>
                <div className="flex items-center justify-between"><span>NDRF Helpline</span><a href="tel:01124363260" className="text-primary font-medium">011-24363260</a></div>
                <div className="flex items-center justify-between"><span>Disaster Helpline</span><a href="tel:1078" className="text-primary font-medium">1078</a></div>
                <div className="flex items-center justify-between"><span>Medical Emergency</span><a href="tel:108" className="text-primary font-medium">108</a></div>
              </div>
            </div>

            <LocationRiskMap userLocation={userLocation} riskData={{}} onLocationChange={setUserLocation} />

            <div className="bg-card border border-border rounded-xl p-4 shadow-soft">
              <h3 className="font-semibold text-card-foreground mb-4 flex items-center">
                <Icon name="Siren" size={18} className="mr-2" />
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Button variant="outline" fullWidth onClick={() => navigate('/real-time-alerts')} iconName="BellRing" iconPosition="left">
                  Review Active Alerts
                </Button>
                <Button variant="outline" fullWidth onClick={() => navigate('/disaster-learning-modules')} iconName="BookOpen" iconPosition="left">
                  Preparedness Learning
                </Button>
                <Button variant="outline" fullWidth onClick={() => navigate('/virtual-emergency-drills')} iconName="Play" iconPosition="left">
                  Practice Emergency Drills
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RescueSheltersPage;
