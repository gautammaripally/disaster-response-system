import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { useAuth } from '../../../contexts/AuthContext';

const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signInWithGoogle, hasFirebaseConfig } = useAuth();
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const nextPath = location.state?.from?.pathname || '/disaster-learning-modules';

  const handleGoogleSignIn = async () => {
    setErrors({});
    setIsLoading(true);

    try {
      await signInWithGoogle();
      navigate(nextPath, { replace: true });
    } catch (error) {
      setErrors({
        general: error?.message || 'Google sign-in failed. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-card border border-border rounded-lg shadow-elevated p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Shield" size={32} color="white" strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-bold text-card-foreground mb-2">
            Sign In
          </h1>
          <p className="text-muted-foreground">
            Use your Google account to access the DisasterEd platform
          </p>
        </div>

        {errors?.general && (
          <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-lg">
            <div className="flex items-center space-x-2">
              <Icon name="AlertCircle" size={18} color="var(--color-error)" />
              <span className="text-error text-sm font-medium">
                {errors?.general}
              </span>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {!hasFirebaseConfig && (
            <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
              <div className="flex items-start space-x-2">
                <Icon name="AlertTriangle" size={18} className="text-warning mt-0.5" />
                <div className="text-sm text-warning">
                  Firebase is not configured yet. Add your `VITE_FIREBASE_*` keys in `.env`, then restart the app.
                </div>
              </div>
            </div>
          )}

          <Button
            variant="default"
            fullWidth
            loading={isLoading}
            iconName="Chrome"
            iconPosition="left"
            onClick={handleGoogleSignIn}
            disabled={!hasFirebaseConfig}
            className="h-11"
          >
            {isLoading ? 'Signing In...' : 'Continue With Google'}
          </Button>

          <div className="rounded-lg border border-border bg-muted/40 p-4">
            <div className="flex items-start space-x-3">
              <Icon name="ShieldCheck" size={18} className="text-primary mt-0.5" />
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Your session is managed by Firebase Authentication.</p>
                <p>Users who sign in are currently treated as `public` by default until role management is connected.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
