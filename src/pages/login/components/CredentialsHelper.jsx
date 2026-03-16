import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const envTemplate = `VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=`;

const CredentialsHelper = () => {
  const [isVisible, setIsVisible] = useState(false);

  const setupItems = [
    'Add your Firebase web app credentials to the VITE_FIREBASE_* variables in .env.',
    'Enable Google sign-in in Firebase Authentication.',
    'Create a Firestore database for profiles, progress, and live alerts.',
    'Add your local and production domains to Firebase authorized domains.',
    'Restart the Vite dev server after updating .env.'
  ];

  const copyToClipboard = (text) => {
    navigator.clipboard?.writeText(text)?.then(() => {
      return true;
    });
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsVisible(!isVisible)}
        iconName="HelpCircle"
        iconPosition="left"
        className="mb-4"
      >
        Firebase Setup
      </Button>

      {isVisible && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-elevated p-4 z-10">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-card-foreground">Google Sign-In Setup</h4>
            <button
              onClick={() => setIsVisible(false)}
              className="text-muted-foreground hover:text-card-foreground transition-quick"
            >
              <Icon name="X" size={16} />
            </button>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-medium text-primary">Required env keys</div>
                  <div className="mt-2 text-xs font-mono bg-white/20 px-2 py-2 rounded break-all whitespace-pre-wrap">
                    {envTemplate}
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(envTemplate)}
                  className="p-1 hover:bg-white/20 rounded transition-quick"
                  title="Copy env keys"
                >
                  <Icon name="Copy" size={14} />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {setupItems.map((item, index) => (
                <div key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Icon name="CheckCircle2" size={16} className="text-success mt-0.5" />
                  <span>{index + 1}. {item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 p-2 bg-muted/50 rounded text-xs text-muted-foreground">
            <Icon name="Info" size={12} className="inline mr-1" />
            This project now uses Firebase Authentication instead of demo credentials.
          </div>
        </div>
      )}
    </div>
  );
};

export default CredentialsHelper;
