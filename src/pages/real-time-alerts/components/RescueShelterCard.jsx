import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const getStatusStyles = (status) => {
  switch (status) {
    case 'Open':
      return {
        badge: 'bg-success/10 text-success border-success/30',
        accent: 'text-success',
        panel: 'bg-success/5 border-success/20'
      };
    case 'Full':
      return {
        badge: 'bg-error/10 text-error border-error/30',
        accent: 'text-error',
        panel: 'bg-error/5 border-error/20'
      };
    default:
      return {
        badge: 'bg-muted text-muted-foreground border-border',
        accent: 'text-muted-foreground',
        panel: 'bg-muted/40 border-border'
      };
  }
};

const getDisasterIcon = (type) => {
  switch (type?.toLowerCase()) {
    case 'flood':
      return 'Waves';
    case 'cyclone':
      return 'Wind';
    case 'earthquake':
      return 'Mountain';
    case 'fire':
      return 'Flame';
    default:
      return 'ShieldAlert';
  }
};

const RescueShelterCard = ({ shelter }) => {
  const [showDetails, setShowDetails] = useState(false);
  const statusStyles = getStatusStyles(shelter?.status);
  const availabilityRatio = shelter?.capacityTotal > 0
    ? Math.max(0, Math.min(100, Math.round((shelter.capacityAvailable / shelter.capacityTotal) * 100)))
    : 0;

  return (
    <div className="bg-card border border-border rounded-xl shadow-soft p-5 transition-smooth hover:shadow-elevated">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
            <Icon name={getDisasterIcon(shelter?.disasterType)} size={22} />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-card-foreground">
                {shelter?.name}
              </h3>
              <span className={`px-2.5 py-1 rounded-full border text-xs font-semibold ${statusStyles.badge}`}>
                {shelter?.status}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Icon name="MapPin" size={14} />
                {shelter?.city}, {shelter?.state}
              </span>
              <span className="inline-flex items-center gap-1">
                <Icon name={getDisasterIcon(shelter?.disasterType)} size={14} />
                {shelter?.disasterType}
              </span>
              <span className="inline-flex items-center gap-1">
                <Icon name="ShieldCheck" size={14} />
                Managed by {shelter?.managedBy}
              </span>
            </div>
          </div>
        </div>

        <div className={`rounded-xl border px-4 py-3 min-w-[220px] ${statusStyles.panel}`}>
          <div className="flex items-center justify-between text-sm font-medium text-card-foreground">
            <span>Available slots</span>
            <span className={statusStyles.accent}>
              {shelter?.capacityAvailable}/{shelter?.capacityTotal}
            </span>
          </div>
          <div className="mt-2 h-2.5 rounded-full bg-muted overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                shelter?.status === 'Open' ? 'bg-success' : shelter?.status === 'Full' ? 'bg-error' : 'bg-muted-foreground'
              }`}
              style={{ width: `${availabilityRatio}%` }}
            />
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            {shelter?.capacityTotal - shelter?.capacityAvailable} occupied of {shelter?.capacityTotal} total capacity
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
        <div className="rounded-lg bg-muted/40 p-3">
          <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Phone</div>
          <a href={`tel:${shelter?.contactPhone}`} className="font-medium text-primary hover:underline">
            {shelter?.contactPhone}
          </a>
        </div>
        <div className="rounded-lg bg-muted/40 p-3">
          <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Email</div>
          <a href={`mailto:${shelter?.contactEmail}`} className="font-medium text-primary hover:underline break-all">
            {shelter?.contactEmail}
          </a>
        </div>
        <div className="rounded-lg bg-muted/40 p-3">
          <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Alert context</div>
          <div className="font-medium text-card-foreground">
            {shelter?.relatedAlertCount > 0
              ? `${shelter.relatedAlertCount} active alert${shelter.relatedAlertCount > 1 ? 's' : ''} nearby`
              : 'Monitoring active conditions'}
          </div>
        </div>
      </div>

      {showDetails && (
        <div className="mt-4 border-t border-border pt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Support services</div>
              <p className="text-sm text-card-foreground">{shelter?.services.join(', ')}</p>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Operating notes</div>
              <p className="text-sm text-card-foreground">{shelter?.notes}</p>
            </div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Linked alerts</div>
            {shelter?.relatedAlerts?.length > 0 ? (
              <div className="space-y-2">
                {shelter.relatedAlerts.map((alert) => (
                  <div key={alert.id} className="rounded-lg border border-border bg-muted/30 p-3">
                    <div className="font-medium text-card-foreground">{alert.title}</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {alert.location} • {alert.source}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-border p-3 text-sm text-muted-foreground">
                No directly linked active alerts right now. Shelter remains listed for preparedness and overflow support.
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowDetails((prev) => !prev)}
          iconName={showDetails ? 'ChevronUp' : 'ChevronDown'}
          iconPosition="right"
        >
          {showDetails ? 'Hide Details' : 'View Details'}
        </Button>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" asChild iconName="Navigation" iconPosition="left">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${shelter?.name}, ${shelter?.city}, ${shelter?.state}`)}`}
              target="_blank"
              rel="noreferrer"
            >
              Get Directions
            </a>
          </Button>
          <Button variant="default" size="sm" asChild iconName="PhoneCall" iconPosition="left">
            <a href={`tel:${shelter?.contactPhone}`}>Contact</a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RescueShelterCard;
