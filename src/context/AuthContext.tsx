import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  googleProvider,
  signInWithPopup,
  updateProfile
} from '../lib/firebase';
import { User } from 'firebase/auth';
import { toast } from "@/components/ui/sonner";

interface AuthContextProps {
  currentUser: User | null;
  isLoading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  logIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (displayName: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast.success("Account created successfully!");
    } catch (error: any) {
      toast.error(`Sign up failed: ${error.message}`);
      throw error;
    }
  };

  const logIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Logged in successfully!");
    } catch (error: any) {
      toast.error(`Login failed: ${error.message}`);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success("Logged in with Google successfully!");
    } catch (error: any) {
      toast.error(`Google login failed: ${error.message}`);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully!");
    } catch (error: any) {
      toast.error(`Logout failed: ${error.message}`);
      throw error;
    }
  };

  const updateUserProfile = async (displayName: string) => {
    if (!currentUser) {
      toast.error("No user is currently signed in");
      return;
    }
    try {
      await updateProfile(currentUser, { displayName });
      // Trigger a re-render with the new user data
      setCurrentUser(auth.currentUser);
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.error(`Failed to update profile: ${error.message}`);
      throw error;
    }
  };

  const value = {
    currentUser,
    isLoading,
    signUp,
    logIn,
    signInWithGoogle,
    logout,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};