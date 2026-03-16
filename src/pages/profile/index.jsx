import React from 'react';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import ProfileForm from '../../components/profile/ProfileForm';
import { useAppData } from '../../contexts/AppDataContext';

const ProfilePage = () => {
  const { profile, saveProfile, missingProfileFields, isProfileComplete } = useAppData();

  return (
    <div className="min-h-screen bg-background">
      <Header userRole={profile?.role || 'public'} alertCount={0} onMenuToggle={() => {}} />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-3xl font-bold text-foreground">My Profile</h2>
            <p className="text-muted-foreground mt-2">
              Manage the key details used across the disaster preparedness and response education system.
            </p>
          </div>
          {!isProfileComplete && (
            <Button
              variant="outline"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              iconName="AlertTriangle"
              iconPosition="left"
            >
              Profile Incomplete
            </Button>
          )}
        </div>

        <ProfileForm
          initialValues={profile}
          title="Profile Details"
          description="Some fields may already be filled from Google sign-in. Please complete the remaining necessary details and keep them updated."
          submitLabel="Save Profile"
          onSubmit={saveProfile}
          highlightMissing
          missingFields={missingProfileFields}
        />
      </div>
    </div>
  );
};

export default ProfilePage;
