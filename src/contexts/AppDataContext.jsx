import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc
} from 'firebase/firestore';
import { useAuth } from './AuthContext';
import { db } from '../lib/firebase';
import {
  createDefaultAssessmentProgress,
  createDefaultDrillProgress,
  createDefaultModuleProgress,
  createDefaultProfile,
  requiredProfileFields,
  sampleAlerts
} from '../data/appDefaults';

const AppDataContext = createContext(null);

const defaultProgress = {
  modules: createDefaultModuleProgress(),
  drills: createDefaultDrillProgress(),
  assessments: createDefaultAssessmentProgress()
};

const toDateString = (value) => {
  if (!value) {
    return null;
  }

  if (typeof value === 'string') {
    return value;
  }

  if (typeof value?.toDate === 'function') {
    return value.toDate().toISOString();
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  return null;
};

const sanitizeAlert = (alertDoc) => {
  const data = alertDoc.data();
  return {
    id: alertDoc.id,
    ...data,
    timestamp: toDateString(data?.timestamp) || new Date().toISOString(),
    acknowledgedBy: data?.acknowledgedBy || []
  };
};

export const AppDataProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState(null);
  const [progress, setProgress] = useState(defaultProgress);
  const [alerts, setAlerts] = useState(sampleAlerts);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setProfile(null);
      setProgress(defaultProgress);
      setAlerts(sampleAlerts);
      setDataLoading(false);
      return undefined;
    }

    if (!db) {
      setProfile(createDefaultProfile(user));
      setProgress(defaultProgress);
      setAlerts(sampleAlerts);
      setDataLoading(false);
      return undefined;
    }

    setDataLoading(true);

    const userRef = doc(db, 'users', user.uid);
    const progressRef = doc(db, 'users', user.uid, 'appData', 'progress');
    const alertsQuery = query(collection(db, 'alerts'), orderBy('timestamp', 'desc'));

    const unsubscribers = [];

    unsubscribers.push(onSnapshot(userRef, async (snapshot) => {
      if (!snapshot.exists()) {
        const initialProfile = {
          ...createDefaultProfile(user),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };
        await setDoc(userRef, initialProfile, { merge: true });
        setProfile(createDefaultProfile(user));
      } else {
        setProfile({
          ...createDefaultProfile(user),
          ...snapshot.data()
        });
      }
    }));

    unsubscribers.push(onSnapshot(progressRef, async (snapshot) => {
      if (!snapshot.exists()) {
        await setDoc(progressRef, defaultProgress, { merge: true });
        setProgress(defaultProgress);
      } else {
        const data = snapshot.data();
        setProgress({
          modules: { ...createDefaultModuleProgress(), ...(data?.modules || {}) },
          drills: { ...createDefaultDrillProgress(), ...(data?.drills || {}) },
          assessments: { ...createDefaultAssessmentProgress(), ...(data?.assessments || {}) }
        });
      }
      setDataLoading(false);
    }));

    unsubscribers.push(onSnapshot(alertsQuery, (snapshot) => {
      if (snapshot.empty) {
        setAlerts(sampleAlerts);
      } else {
        setAlerts(snapshot.docs.map(sanitizeAlert));
      }
    }, () => {
      setAlerts(sampleAlerts);
    }));

    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, [isAuthenticated, user]);

  const missingProfileFields = requiredProfileFields.filter((field) => !profile?.[field]?.toString().trim());
  const isProfileComplete = missingProfileFields.length === 0;

  const saveProfile = async (values) => {
    if (!user || !db) {
      setProfile((prev) => ({ ...prev, ...values }));
      return;
    }

    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, {
      ...values,
      email: user.email || values?.email || '',
      updatedAt: serverTimestamp()
    }, { merge: true });
  };

  const mergeProgressSection = async (section, itemId, payload) => {
    if (!user) {
      return;
    }

    let nextSection = {};
    let nextValue = {};

    setProgress((prev) => {
      nextSection = {
        ...prev[section],
        [itemId]: {
          ...(prev?.[section]?.[itemId] || {}),
          ...payload
        }
      };
      nextValue = nextSection[itemId];

      return {
        ...prev,
        [section]: nextSection
      };
    });

    if (!db) {
      return;
    }

    const progressRef = doc(db, 'users', user.uid, 'appData', 'progress');
    await setDoc(progressRef, {
      [section]: nextSection
    }, { merge: true });
  };

  const updateModuleProgress = (moduleId, payload) =>
    mergeProgressSection('modules', moduleId, {
      lastAccessed: new Date().toISOString(),
      ...payload
    });

  const updateDrillProgress = (drillId, payload) =>
    mergeProgressSection('drills', drillId, {
      lastAttempt: new Date().toISOString(),
      ...payload
    });

  const updateAssessmentProgress = (assessmentId, payload) =>
    mergeProgressSection('assessments', assessmentId, {
      lastAttempt: new Date().toISOString(),
      ...payload
    });

  const acknowledgeAlert = async (alertId) => {
    if (!user) {
      return;
    }

    setAlerts((prev) => prev.map((alert) =>
      alert.id === alertId
        ? { ...alert, acknowledgedBy: [...new Set([...(alert.acknowledgedBy || []), user.uid])] }
        : alert
    ));

    if (!db || alertId.startsWith('sample-')) {
      return;
    }

    const alertRef = doc(db, 'alerts', alertId);
    await updateDoc(alertRef, {
      acknowledgedBy: arrayUnion(user.uid)
    });
  };

  const createAlert = async (alertData) => {
    const alertPayload = {
      title: alertData?.title,
      description: alertData?.message,
      type: alertData?.type || 'general',
      severity: alertData?.severity || 'medium',
      location: alertData?.location || 'Public Broadcast',
      source: profile?.organization || 'Disaster Preparedness and Response Education System',
      impactLevel: 'Public',
      affectedAreas: [],
      expectedDuration: alertData?.expiryTime || 'Until revoked',
      recommendedActions: [],
      channels: alertData?.channels || [],
      recipients: alertData?.recipients || [],
      acknowledgedBy: [],
      createdBy: user?.uid || null,
      timestamp: serverTimestamp()
    };

    if (!db) {
      const localAlert = {
        id: `local-${Date.now()}`,
        ...alertPayload,
        timestamp: new Date().toISOString()
      };
      setAlerts((prev) => [localAlert, ...prev]);
      return localAlert;
    }

    const docRef = await addDoc(collection(db, 'alerts'), alertPayload);
    return docRef.id;
  };

  const value = useMemo(() => ({
    profile,
    progress,
    alerts,
    dataLoading,
    isProfileComplete,
    missingProfileFields,
    saveProfile,
    updateModuleProgress,
    updateDrillProgress,
    updateAssessmentProgress,
    acknowledgeAlert,
    createAlert
  }), [profile, progress, alerts, dataLoading, isProfileComplete, missingProfileFields]);

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
};

export const useAppData = () => {
  const context = useContext(AppDataContext);

  if (!context) {
    throw new Error('useAppData must be used within an AppDataProvider');
  }

  return context;
};
