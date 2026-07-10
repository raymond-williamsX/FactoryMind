import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { User, Session } from "@supabase/supabase-js";
import { authService } from "@/services/authService";
import { dbService } from "@/services/dbService";
import type { Profile } from "@/services/dbService";

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  permissions: string[];
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  hasPermission: (permission: string) => boolean;
  hasRole: (roleName: string) => boolean;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Re-fetch user profile and permissions from the database
  const refreshProfile = useCallback(async () => {
    const currentUser = await authService.getCurrentUser();
    if (!currentUser) {
      setProfile(null);
      setPermissions([]);
      return;
    }

    try {
      const userProfile = await dbService.getUserProfile(currentUser.id);
      if (userProfile) {
        setProfile(userProfile);
        
        // Fetch role permissions if the user has an assigned role
        if (userProfile.role_id) {
          const rolePerms = await dbService.getRolePermissions(userProfile.role_id);
          setPermissions(rolePerms);
        } else {
          setPermissions([]);
        }
        setError(null);
      } else {
        // User exists in auth but no profile row (trigger fail or sync delay)
        console.warn("Auth user exists but profile record not found in public schema.");
        setProfile(null);
        setPermissions([]);
      }
    } catch (err: any) {
      console.error("Error loading user profile permissions:", err);
      setError(err.message || "Failed to load enterprise user profile.");
    }
  }, []);

  // Helper to load session and hook up auth updates
  useEffect(() => {
    let isMounted = true;
    let authListener: any = null;

    const initializeAuth = async () => {
      try {
        const session = await authService.getSession();
        if (session && isMounted) {
          setUser(session.user);
          await refreshProfile();
          // Log login activity
          await dbService.updateLastLogin(session.user.id);
        }
      } catch (err: any) {
        console.error("Auth initialization failed:", err);
        if (isMounted) {
          setError("Platform core is currently offline or unreachable.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }

      // Listen for session and auth updates
      authListener = authService.onAuthStateChange(async (session: Session | null) => {
        if (!isMounted) return;
        
        setIsLoading(true);
        if (session) {
          setUser(session.user);
          try {
            await refreshProfile();
            await dbService.updateLastLogin(session.user.id);
          } catch (err) {
            console.error("Failed to refresh profile on auth state change:", err);
          }
        } else {
          setUser(null);
          setProfile(null);
          setPermissions([]);
        }
        setIsLoading(false);
      });
    };

    initializeAuth();

    return () => {
      isMounted = false;
      if (authListener) {
        authListener.unsubscribe();
      }
    };
  }, [refreshProfile]);

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.signOut();
      setUser(null);
      setProfile(null);
      setPermissions([]);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to log out of the session.");
    } finally {
      setIsLoading(false);
    }
  };

  const hasPermission = useCallback(
    (permission: string): boolean => {
      if (!profile) return false;
      // Super admin has bypass permissions
      if (profile.user_roles?.role_name === "super_admin") return true;
      return permissions.includes(permission);
    },
    [profile, permissions]
  );

  const hasRole = useCallback(
    (roleName: string): boolean => {
      return profile?.user_roles?.role_name === roleName;
    },
    [profile]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        permissions,
        isAuthenticated: !!user,
        isLoading,
        error,
        hasPermission,
        hasRole,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
