import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider, hasFirebaseConfig } from '../lib/firebase';

const AuthContext = createContext(null);

const USER_STORAGE_KEY = 'disastered_user';

const normalizeUser = (firebaseUser) => {
  if (!firebaseUser) {
    return null;
  }

  const storedUser = localStorage.getItem(USER_STORAGE_KEY);
  let parsedStoredUser = null;

  if (storedUser) {
    try {
      parsedStoredUser = JSON.parse(storedUser);
    } catch {
      parsedStoredUser = null;
    }
  }

  return {
    uid: firebaseUser.uid,
    name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
    email: firebaseUser.email || '',
    photoURL: firebaseUser.photoURL || '',
    role: parsedStoredUser?.role || 'public',
    provider: firebaseUser.providerData?.[0]?.providerId || 'google.com',
    loginTime: new Date().toISOString()
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setAuthLoading(false);
      return undefined;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      const normalizedUser = normalizeUser(firebaseUser);
      setUser(normalizedUser);

      if (normalizedUser) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(normalizedUser));
        localStorage.setItem('user', JSON.stringify(normalizedUser));
      } else {
        localStorage.removeItem(USER_STORAGE_KEY);
        localStorage.removeItem('user');
      }

      setAuthLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    if (!hasFirebaseConfig || !auth) {
      throw new Error('Firebase configuration is missing. Add your VITE_FIREBASE_* values in .env and restart the dev server.');
    }

    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  };

  const signOutUser = async () => {
    if (!auth) {
      setUser(null);
      localStorage.removeItem(USER_STORAGE_KEY);
      localStorage.removeItem('user');
      return;
    }

    await signOut(auth);
  };

  const value = useMemo(() => ({
    user,
    authLoading,
    isAuthenticated: Boolean(user),
    signInWithGoogle,
    signOutUser,
    hasFirebaseConfig
  }), [user, authLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
