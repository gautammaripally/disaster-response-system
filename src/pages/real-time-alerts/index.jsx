import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import EmergencyAlertIndicator from '../../components/ui/EmergencyAlertIndicator';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import AlertCard from './components/AlertCard';
import AlertFilters from './components/AlertFilters';
import AlertHistory from './components/AlertHistory';
import BroadcastPanel from './components/BroadcastPanel';
import LocationRiskMap from './components/LocationRiskMap';
import { useAppData } from '../../contexts/AppDataContext';
import { useAuth } from '../../contexts/AuthContext';

const RealTimeAlerts = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { alerts, profile, acknowledgeAlert, createAlert } = useAppData();
  const [filters, setFilters] = useState({
    type: 'all',
    severity: 'all',
    status: 'all',
    location: 'all',
    timeRange: 'all',
    search: ''
  });
  const [showBroadcastPanel, setShowBroadcastPanel] = useState(false);
  const [userLocation, setUserLocation] = useState('mumbai');

  const normalizedAlerts = useMemo(() => alerts.map((alert) => ({
    ...alert,
    acknowledged: (alert?.acknowledgedBy || []).includes(user?.uid)
  })), [alerts, user?.uid]);

  const filteredAlerts = normalizedAlerts.filter((alert) => {
    if (filters.type !== 'all' && alert.type !== filters.type) return false;
    if (filters.severity !== 'all' && alert.severity !== filters.severity) return false;
    if (filters.status === 'active' && alert.acknowledged) return false;
    if (filters.status === 'acknowledged' && !alert.acknowledged) return false;
    if (filters.search) {
      const term = filters.search.toLowerCase();
      if (!alert.title.toLowerCase().includes(term) && !alert.description.toLowerCase().includes(term)) {
        return false;
      }
    }
    return true;
  });

  const alertCounts = {
    critical: normalizedAlerts.filter((item) => item.severity === 'critical').length,
    high: normalizedAlerts.filter((item) => item.severity === 'high').length,
    medium: normalizedAlerts.filter((item) => item.severity === 'medium').length,
    low: normalizedAlerts.filter((item) => item.severity === 'low').length
  };

  const activeAlertCount = normalizedAlerts.filter((item) => !item.acknowledged).length;
  const criticalAlerts = normalizedAlerts.filter((item) => item.severity === 'critical' && !item.acknowledged);
  const latestAlert = normalizedAlerts[0]
    ? {
        title: normalizedAlerts[0].title,
        preview: `${normalizedAlerts[0].description.substring(0, 100)}...`,
        time: new Date(normalizedAlerts[0].timestamp).toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit'
        })
      }
    : null;

  const handleShareAlert = (alert) => {
    if (navigator.share) {
      navigator.share({
        title: alert.title,
        text: alert.description,
        url: window.location.href
      });
      return;
    }

    navigator.clipboard?.writeText(`${alert.title}\n\n${alert.description}\n\nSource: DisasterEd`);
    window.alert('Alert details copied to clipboard.');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header userRole={profile?.role || 'public'} alertCount={activeAlertCount} onMenuToggle={() => {}} />
      <EmergencyAlertIndicator
        alertCount={activeAlertCount}
        alertLevel={criticalAlerts.length > 0 ? 'critical' : 'medium'}
        latestAlert={latestAlert}
      />

      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Real-Time Alerts</h1>
            <p className="text-muted-foreground mt-2">
              These alerts now use Firestore real-time listeners, so new alerts appear automatically without manual refresh.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {profile?.role === 'admin' && (
              <Button variant="default" onClick={() => setShowBroadcastPanel(true)} iconName="Radio" iconPosition="left">
                Broadcast Alert
              </Button>
            )}

            <Button variant="outline" onClick={() => navigate('/disaster-learning-modules')} iconName="BookOpen" iconPosition="left">
              Learning Modules
            </Button>
          </div>
        </div>

        {criticalAlerts.length > 0 && (
          <div className="bg-error/10 border-2 border-error rounded-lg p-4 animate-alert-pulse">
            <div className="flex items-center space-x-3">
              <Icon name="AlertTriangle" size={24} className="text-error animate-pulse" />
              <div>
                <h3 className="font-semibold text-error">
                  {criticalAlerts.length} Critical Alert{criticalAlerts.length !== 1 ? 's' : ''} Require Immediate Attention
                </h3>
                <p className="text-sm text-error/80 mt-1">
                  These alerts update in real time when new documents are added in Firestore.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <AlertFilters
              filters={filters}
              onFilterChange={(field, value) => setFilters((prev) => ({ ...prev, [field]: value }))}
              onClearFilters={() => setFilters({
                type: 'all',
                severity: 'all',
                status: 'all',
                location: 'all',
                timeRange: 'all',
                search: ''
              })}
              alertCounts={alertCounts}
            />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">Active Alerts ({filteredAlerts.length})</h2>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Icon name="RefreshCw" size={16} />
                  <span>Live from Firestore</span>
                </div>
              </div>

              {filteredAlerts.length === 0 ? (
                <div className="bg-card border border-border rounded-lg p-8 text-center">
                  <Icon name="CheckCircle" size={48} className="mx-auto text-success mb-4" />
                  <h3 className="font-medium text-card-foreground mb-2">No Active Alerts</h3>
                  <p className="text-sm text-muted-foreground">
                    No alerts match the current filters, or there are currently no live alerts.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredAlerts.map((alert) => (
                    <AlertCard
                      key={alert.id}
                      alert={alert}
                      onAcknowledge={acknowledgeAlert}
                      onShare={handleShareAlert}
                      onViewDetails={(selectedAlert) => console.log('Viewing alert details:', selectedAlert)}
                    />
                  ))}
                </div>
              )}
            </div>

            <AlertHistory
              alerts={normalizedAlerts.filter((alert) => alert.acknowledged)}
              onViewAlert={(selectedAlert) => console.log('Viewing alert history item:', selectedAlert)}
            />
          </div>

          <div className="space-y-6">
            <div className="bg-card border border-border rounded-lg p-4 shadow-soft">
              <h3 className="font-semibold text-card-foreground mb-4 flex items-center">
                <Icon name="Phone" size={18} className="mr-2" />
                Emergency Contacts
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between"><span>National Emergency</span><a href="tel:112" className="text-primary font-medium">112</a></div>
                <div className="flex items-center justify-between"><span>Fire Department</span><a href="tel:101" className="text-primary font-medium">101</a></div>
                <div className="flex items-center justify-between"><span>Police</span><a href="tel:100" className="text-primary font-medium">100</a></div>
                <div className="flex items-center justify-between"><span>Medical Emergency</span><a href="tel:108" className="text-primary font-medium">108</a></div>
                <div className="flex items-center justify-between"><span>Disaster Helpline</span><a href="tel:1078" className="text-primary font-medium">1078</a></div>
              </div>
            </div>

            <LocationRiskMap userLocation={userLocation} riskData={{}} onLocationChange={setUserLocation} />

            <div className="bg-card border border-border rounded-lg p-4 shadow-soft">
              <h3 className="font-semibold text-card-foreground mb-4 flex items-center">
                <Icon name="Zap" size={18} className="mr-2" />
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Button variant="outline" fullWidth onClick={() => navigate('/virtual-emergency-drills')} iconName="Play" iconPosition="left">
                  Start Emergency Drill
                </Button>
                <Button variant="outline" fullWidth onClick={() => navigate('/preparedness-assessment')} iconName="ClipboardCheck" iconPosition="left">
                  Take Assessment
                </Button>
                <Button variant="outline" fullWidth onClick={() => navigate('/admin-dashboard')} iconName="BarChart3" iconPosition="left">
                  View Dashboard
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BroadcastPanel
        userRole={profile?.role}
        onSendBroadcast={createAlert}
        isVisible={showBroadcastPanel}
        onClose={() => setShowBroadcastPanel(false)}
      />
    </div>
  );
};

export default RealTimeAlerts;
