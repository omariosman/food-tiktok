import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types';
import { authHelpers, dbHelpers } from '../services/supabase';
import { UserType } from '../types/database';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, userType?: UserType) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let subscription: any;

    const setupAuth = async () => {
      // Check current session
      const { data: { user: authUser } } = await authHelpers.getCurrentUser();
      
      if (authUser) {
        const { data: profile } = await dbHelpers.getUserProfile(authUser.id);
        if (profile) {
          setUser(profile);
        } else {
          // If no profile found but user exists, create a basic user object
          const basicUser: User = {
            id: authUser.id,
            email: authUser.email || '',
            name: (authUser as any).user_metadata?.name || authUser.email?.split('@')[0] || 'User',
            user_type: 'normal' as UserType,
            created_at: new Date().toISOString(),
          };
          setUser(basicUser);
        }
      }
      setLoading(false);

      // Set up auth state listener only if supabase is available (not in mock mode)
      const { supabase } = await import('../services/supabase');
      if (supabase) {
        const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (session?.user) {
              const { data: profile } = await dbHelpers.getUserProfile(session.user.id);
              if (profile) {
                setUser(profile);
              } else {
                // If no profile found but user exists, create a basic user object
                const basicUser: User = {
                  id: session.user.id,
                  email: session.user.email || '',
                  name: (session.user as any).user_metadata?.name || session.user.email?.split('@')[0] || 'User',
                  user_type: 'normal' as UserType,
                  created_at: new Date().toISOString(),
                };
                setUser(basicUser);
              }
            } else {
              setUser(null);
            }
            setLoading(false);
          }
        );
        subscription = authSubscription;
      }
    };

    setupAuth();

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await authHelpers.signIn(email, password);
    if (error) throw error;
  };

  const signUp = async (email: string, password: string, name: string, userType: UserType = 'normal') => {
    const { error } = await authHelpers.signUp(email, password, { name }, userType);
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await authHelpers.signOut();
    if (error) throw error;
  };

  const resetPassword = async (email: string) => {
    const { error } = await authHelpers.resetPassword(email);
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};