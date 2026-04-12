import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import EmergencyAlertIndicator from '../../components/ui/EmergencyAlertIndicator';
import { useAppData } from '../../contexts/AppDataContext';
import { useAuth } from '../../contexts/AuthContext';
import { disasterGames, TRUSTED_GAME_HOSTS } from '../../data/disasterGames';

const isTrustedGameUrl = (link) => {
  try {
    const parsedUrl = new URL(link);
    return parsedUrl.protocol === 'https:' && TRUSTED_GAME_HOSTS.includes(parsedUrl.hostname);
  } catch {
    return false;
  }
};

const getDisasterTypeStyles = (disasterType) => {
  if (disasterType.includes('Flood')) {
    return 'bg-blue-100 text-blue-700';
  }

  if (disasterType.includes('Earthquake')) {
    return 'bg-amber-100 text-amber-700';
  }

  if (disasterType.includes('Fire')) {
    return 'bg-rose-100 text-rose-700';
  }

  if (disasterType.includes('Storm')) {
    return 'bg-violet-100 text-violet-700';
  }

  return 'bg-emerald-100 text-emerald-700';
};

const DisasterGamesPage = () => {
  const { user } = useAuth();
  const { alerts, profile } = useAppData();
  const [redirectNotice, setRedirectNotice] = useState('');

  const activeAlertCount = alerts.filter((alert) => !(alert?.acknowledgedBy || []).includes(user?.uid)).length;
  const latestAlert = alerts[0]
    ? {
        title: alerts[0].title,
        preview: `${alerts[0].description.substring(0, 100)}...`,
        time: new Date(alerts[0].timestamp).toLocaleTimeString('en-IN')
      }
    : null;

  const verifiedGames = useMemo(
    () => disasterGames.filter((game) => game.verified && isTrustedGameUrl(game.externalLink)),
    []
  );

  useEffect(() => {
    if (!redirectNotice) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setRedirectNotice('');
    }, 4000);

    return () => window.clearTimeout(timeoutId);
  }, [redirectNotice]);

  const handlePlayNow = (game) => {
    if (!isTrustedGameUrl(game.externalLink)) {
      setRedirectNotice(`We could not verify the external link for ${game.gameTitle}.`);
      return;
    }

    setRedirectNotice(`You are being redirected to ${game.sourceName} in a new browser tab.`);
    window.setTimeout(() => {
      window.open(game.externalLink, '_blank', 'noopener,noreferrer');
    }, 250);
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Disaster Education Games - Disaster Preparedness and Response Education System</title>
      </Helmet>

      <Header userRole={profile?.role || 'public'} alertCount={activeAlertCount} onMenuToggle={() => {}} />

      <EmergencyAlertIndicator
        alertCount={activeAlertCount}
        alertLevel={activeAlertCount > 0 ? 'medium' : 'low'}
        latestAlert={latestAlert}
      />

      <main className="container mx-auto px-4 py-8">
        <section className="rounded-2xl border border-border bg-card p-6 shadow-soft md:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                <Icon name="Gamepad2" size={16} />
                Disaster Games
              </div>
              <h1 className="text-3xl font-bold text-foreground">Disaster Education Games</h1>
              <p className="mt-3 text-muted-foreground">
                Play interactive games to learn disaster preparedness and safety. Each activity below redirects to a
                trusted educational website in a new tab.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-border bg-background p-4">
                <div className="text-2xl font-bold text-foreground">{verifiedGames.length}</div>
                <div className="text-sm text-muted-foreground">Verified game links</div>
              </div>
              <div className="rounded-xl border border-border bg-background p-4">
                <div className="text-2xl font-bold text-foreground">100%</div>
                <div className="text-sm text-muted-foreground">Open in a new tab</div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <div className="flex items-start gap-3">
            <Icon name="ShieldCheck" size={20} className="mt-0.5 text-emerald-700" />
            <div>
              <h2 className="font-semibold text-emerald-900">External website notice</h2>
              <p className="text-sm text-emerald-800">
                These are seed entries backed by trusted preparedness sources. You will leave DisasterEd when you click
                a game, and the content will open in a separate browser tab.
              </p>
            </div>
          </div>
        </section>

        <div aria-live="polite" className="mt-4 min-h-6">
          {redirectNotice && (
            <div className="rounded-xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm font-medium text-primary">
              {redirectNotice}
            </div>
          )}
        </div>

        <section className="mt-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {verifiedGames.map((game) => (
              <article
                key={game.id}
                className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-soft transition-quick hover:-translate-y-1 hover:shadow-elevated"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-card-foreground">{game.gameTitle}</h2>
                    <p className="mt-2 text-sm text-muted-foreground">{game.description}</p>
                  </div>
                  <div className="rounded-xl bg-primary/10 p-3 text-primary">
                    <Icon name="ExternalLink" size={20} />
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getDisasterTypeStyles(game.disasterType)}`}>
                    {game.disasterType}
                  </span>
                  <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                    Source: {game.sourceName}
                  </span>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                    Verified
                  </span>
                </div>

                <div className="mt-6 rounded-xl border border-border bg-background p-4 text-sm text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <Icon name="Info" size={16} className="mt-0.5 text-primary" />
                    <span>Play opens an external educational site in a new tab.</span>
                  </div>
                </div>

                <div className="mt-6">
                  <Button
                    onClick={() => handlePlayNow(game)}
                    iconName="ExternalLink"
                    iconPosition="right"
                    fullWidth
                  >
                    Play Now
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default DisasterGamesPage;
