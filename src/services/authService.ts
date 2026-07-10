import { supabase } from "@/lib/supabase";
import type { 
  AuthResponse, 
  Session, 
  User 
} from "@supabase/supabase-js";

export interface UserCredentials {
  email: string;
  password: string;
}

// Helper to sanitize error messages for enterprise user display
export function getAuthErrorMessage(error: any): string {
  if (!error) return "An unknown authentication error occurred.";
  const message = error.message || String(error);
  
  if (message.includes("Invalid login credentials")) {
    return "Invalid email or password. Please verify your credentials.";
  }
  if (message.includes("Email not confirmed")) {
    return "This account's email has not been confirmed. Please check your inbox.";
  }
  if (message.includes("User already registered")) {
    return "An account with this email address already exists.";
  }
  if (message.includes("Password should be")) {
    return "Password does not meet strength requirements. It must be at least 6 characters.";
  }
  if (message.includes("Failed to fetch") || message.includes("Network")) {
    return "Network connection issue. Supabase database server may be unreachable.";
  }
  return message;
}

export const authService = {
  /**
   * Email & Password Sign In
   */
  async signIn({ email, password }: UserCredentials): Promise<AuthResponse> {
    try {
      const response = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (response.error) throw response.error;
      return response;
    } catch (error: any) {
      throw new Error(getAuthErrorMessage(error));
    }
  },

  /**
   * Sign Up with custom metadata
   */
  async signUp(
    { email, password }: UserCredentials,
    metadata: {
      fullName: string;
      roleName: string;
      assignedPlantId?: string | null;
      departmentId?: string | null;
      timezone?: string;
    }
  ): Promise<AuthResponse> {
    try {
      const response = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: metadata.fullName,
            role_name: metadata.roleName,
            assigned_plant_id: metadata.assignedPlantId || null,
            department_id: metadata.departmentId || null,
            timezone: metadata.timezone || "UTC",
          },
        },
      });
      if (response.error) throw response.error;
      return response;
    } catch (error: any) {
      throw new Error(getAuthErrorMessage(error));
    }
  },

  /**
   * Log out session
   */
  async signOut(): Promise<void> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      throw new Error(getAuthErrorMessage(error));
    }
  },

  /**
   * Request Forgot Password link
   */
  async forgotPassword(email: string, redirectTo: string): Promise<void> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });
      if (error) throw error;
    } catch (error: any) {
      throw new Error(getAuthErrorMessage(error));
    }
  },

  /**
   * Reset password for authenticated user (after redirect)
   */
  async resetPassword(password: string): Promise<void> {
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });
      if (error) throw error;
    } catch (error: any) {
      throw new Error(getAuthErrorMessage(error));
    }
  },

  /**
   * Get active session
   */
  async getSession(): Promise<Session | null> {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return data.session;
    } catch (error: any) {
      console.warn("Failed to retrieve Supabase session:", error.message);
      return null;
    }
  },

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;
      return data.user;
    } catch (error: any) {
      return null;
    }
  },

  /**
   * Subscribe to auth changes (auto logins, logouts, token refresh)
   */
  onAuthStateChange(callback: (session: Session | null) => void) {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        callback(session);
      }
    );
    return subscription;
  },
};
