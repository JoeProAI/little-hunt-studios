'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

interface UserData {
  email: string;
  displayName: string;
  credits: number;
  subscriptionTier: 'free' | 'pro' | 'studio';
  totalVideosGenerated: number;
  totalSpent: number;
  createdAt: Date;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, displayName: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
  signInWithGoogle: async () => {},
  signInWithEmail: async () => {},
  signUpWithEmail: async () => {},
  signOut: async () => {},
  refreshUserData: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async (uid: string) => {
    try {
      console.log('Fetching user data for UID:', uid);
      const userDocRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const data = userDoc.data() as UserData;
        console.log('User data from Firebase:', data);
        setUserData(data);
      } else {
        console.log('User document does not exist for UID:', uid);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const refreshUserData = async () => {
    if (user) {
      console.log('Refreshing user data...');
      await fetchUserData(user.uid);
    } else {
      console.log('Cannot refresh: No user logged in');
    }
  };

  useEffect(() => {
    console.log('AuthContext: Setting up auth listener');
    
    // Set a timeout to stop loading if Firebase doesn't respond
    const timeout = setTimeout(() => {
      console.warn('AuthContext: Firebase auth timeout - stopping loading');
      setLoading(false);
    }, 5000); // 5 second timeout
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('AuthContext: Auth state changed', user ? 'User logged in' : 'No user');
      clearTimeout(timeout); // Clear timeout once we get a response
      setUser(user);
      
      if (user) {
        await fetchUserData(user.uid);
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    }, (error) => {
      console.error('AuthContext: Auth state change error:', error);
      clearTimeout(timeout);
      setLoading(false);
    });

    return () => {
      clearTimeout(timeout);
      unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Check if user document exists, if not create it
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        // New user - create profile with 3 free credits
        await setDoc(userDocRef, {
          email: user.email,
          displayName: user.displayName || 'User',
          credits: 3,
          subscriptionTier: 'free',
          totalVideosGenerated: 0,
          totalSpent: 0,
          createdAt: new Date(),
        });
        // Immediately fetch the new user data
        await fetchUserData(user.uid);
      }
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      throw new Error(error.message);
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      console.error('Email sign-in error:', error);
      throw new Error(error.message);
    }
  };

  const signUpWithEmail = async (email: string, password: string, displayName: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;
      
      // Create user profile with 3 free credits
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        email: user.email,
        displayName: displayName || 'User',
        credits: 3,
        subscriptionTier: 'free',
        totalVideosGenerated: 0,
        totalSpent: 0,
        createdAt: new Date(),
      });
      
      // Immediately fetch the new user data
      await fetchUserData(user.uid);
    } catch (error: any) {
      console.error('Email sign-up error:', error);
      throw new Error(error.message);
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setUserData(null);
    } catch (error: any) {
      console.error('Sign-out error:', error);
      throw new Error(error.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        loading,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        signOut,
        refreshUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
