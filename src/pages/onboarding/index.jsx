import React from 'react';
import { Navigate } from 'react-router-dom';
import ProfileForm from '../../components/profile/ProfileForm';
import { useAppData } from '../../contexts/AppDataContext';

const OnboardingPage = () => {
  const { profile, saveProfile, missingProfileFields, isProfileComplete } = useAppData();

  if (isProfileComplete) {
    return <Navigate to="/disaster-learning-modules" replace />;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-4xl">
        <ProfileForm
          initialValues={profile}
          title="Complete Your Profile"
          description="Before you continue, add the necessary details so your learning progress, alerts, and emergency readiness records are stored correctly."
          submitLabel="Save And Continue"
          onSubmit={saveProfile}
          highlightMissing
          missingFields={missingProfileFields}
        />
      </div>
    </div>
  );
};

export default OnboardingPage;
