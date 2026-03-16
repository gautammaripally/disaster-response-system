import React from "react";
import { BrowserRouter, Navigate, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import AdminDashboard from './pages/admin-dashboard';
import LoginPage from './pages/login';
import DisasterLearningModules from './pages/disaster-learning-modules';
import FireSafety from './pages/disaster-learning-modules/components/fire-safety';
import EarthquakeDrill from './pages/disaster-learning-modules/components/earthquake-safety';
import SeekShelterfromStorm from './pages/disaster-learning-modules/components/cyclone-awareness';
import OfficialDisasterWarnings from './pages/disaster-learning-modules/components/StormOfficialWarnings';
import EyeofCyclone from './pages/disaster-learning-modules/components/CycloneEyeSafety';
import UnplugElectronicsforCycloneSafety from './pages/disaster-learning-modules/components/CyclonePowerSafety';
import BurnFirstAid from './pages/disaster-learning-modules/components/first-aid-basics';
import CutsandBleedingFirstAid from './pages/disaster-learning-modules/components/CutsBleedingAid';
import FracturesandBrokenBonesFirstAid from './pages/disaster-learning-modules/components/FractureAid';
import NosebleedFirstAid from './pages/disaster-learning-modules/components/NosebleedAid';
import CPRFirstAid from './pages/disaster-learning-modules/components/CprAid';
import FloodAwareness from './pages/disaster-learning-modules/components/FloodAwareness';
import FloodPreparedness from './pages/disaster-learning-modules/components/flood-preparedness';
import FloodEvacuationSafety from './pages/disaster-learning-modules/components/FloodEvacuationSafety';
import ElectrocutionRiskinFloods from './pages/disaster-learning-modules/components/FloodElectrocutionRisk';
import FloodRescueandAid from './pages/disaster-learning-modules/components/FloodRescueAid';
import GettingHelpinanEmergency from './pages/disaster-learning-modules/components/EmergencyGetHelp';
import EarthquakeCarSafety from './pages/disaster-learning-modules/components/EarthquakeCarSafety';
import EarthquakeSafetyWheelchairUsers from './pages/disaster-learning-modules/components/EarthquakeWheelchairSafety';
import EarthquakeSafetySteps from './pages/disaster-learning-modules/components/EarthquakeHelpFriends';
import EarthquakeDosandDonts from './pages/disaster-learning-modules/components/EarthquakeDosDonts';
import FireSafetyTraining from './pages/disaster-learning-modules/components/fire-safety-training';
import EmergencyPanicExample from './pages/disaster-learning-modules/components/EmergencyTraining';
import UsingaFireBlanket from './pages/disaster-learning-modules/components/FireBlanketTraining';
import FireSafetyDosandDonts from './pages/disaster-learning-modules/components/FireSafetyDosDonts';
import PreparednessAssessment from './pages/preparedness-assessment';
import VirtualEmergencyDrills from './pages/virtual-emergency-drills';
import RealTimeAlerts from './pages/real-time-alerts';
import ProfilePage from './pages/profile';
import OnboardingPage from './pages/onboarding';
import { ProtectedRoute, PublicOnlyRoute } from './components/auth/ProtectedRoute';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Navigate to="/disaster-learning-modules" replace />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/disaster-learning-modules" element={<DisasterLearningModules />} />
          <Route path="/disaster-learning-modules/fire-safety" element={<FireSafety />} />
          <Route path="/disaster-learning-modules/earthquake-safety" element={<EarthquakeDrill />} />
          <Route path="/disaster-learning-modules/cyclone-awareness" element={<SeekShelterfromStorm />} />
          <Route path="/disaster-learning-modules/StormOfficialWarnings" element={<OfficialDisasterWarnings />} />
          <Route path="/disaster-learning-modules/CycloneEyeSafety" element={<EyeofCyclone />} />
          <Route path="/disaster-learning-modules/CyclonePowerSafety" element={<UnplugElectronicsforCycloneSafety />} />
          <Route path="/disaster-learning-modules/first-aid-basics" element={<BurnFirstAid />} />
          <Route path="/disaster-learning-modules/CutsBleedingAid" element={<CutsandBleedingFirstAid />} />
          <Route path="/disaster-learning-modules/FractureAid" element={<FracturesandBrokenBonesFirstAid />} />
          <Route path="/disaster-learning-modules/NosebleedAid" element={<NosebleedFirstAid />} />
          <Route path="/disaster-learning-modules/CprAid" element={<CPRFirstAid />} />
          <Route path="/disaster-learning-modules/FloodAwareness" element={<FloodAwareness />} />
          <Route path="/disaster-learning-modules/flood-preparedness" element={<FloodPreparedness />} />
          <Route path="/disaster-learning-modules/FloodEvacuationSafety" element={<FloodEvacuationSafety />} />
          <Route path="/disaster-learning-modules/FloodElectrocutionRisk" element={<ElectrocutionRiskinFloods />} />
          <Route path="/disaster-learning-modules/FloodRescueAid" element={<FloodRescueandAid />} />
          <Route path="/disaster-learning-modules/EmergencyGetHelp" element={<GettingHelpinanEmergency />} />
          <Route path="/disaster-learning-modules/fire-safety-training" element={<FireSafetyTraining />} />
          <Route path="/disaster-learning-modules/EarthquakeCarSafety" element={<EarthquakeCarSafety />} />
          <Route path="/disaster-learning-modules/EarthquakeWheelchairSafety" element={<EarthquakeSafetyWheelchairUsers />} />
          <Route path="/disaster-learning-modules/EarthquakeHelpFriends" element={<EarthquakeSafetySteps />} />
          <Route path="/disaster-learning-modules/EarthquakeDosDonts" element={<EarthquakeDosandDonts />} />
          <Route path="/disaster-learning-modules/EmergencyTraining" element={<EmergencyPanicExample />} />
          <Route path="/disaster-learning-modules/FireBlanketTraining" element={<UsingaFireBlanket />} />
          <Route path="/disaster-learning-modules/FireSafetyDosDonts" element={<FireSafetyDosandDonts />} />
          <Route path="/preparedness-assessment" element={<PreparednessAssessment />} />
          <Route path="/virtual-emergency-drills" element={<VirtualEmergencyDrills />} />
          <Route path="/real-time-alerts" element={<RealTimeAlerts />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
