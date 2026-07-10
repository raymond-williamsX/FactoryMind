import { supabase } from "@/lib/supabase";

// ── TYPES AND INTERFACES ─────────────────────────────────────────────────────

export interface Organization {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  created_by?: string | null;
}

export interface Region {
  id: string;
  organization_id: string;
  name: string;
  created_at: string;
  updated_at: string;
  created_by?: string | null;
}

export interface Plant {
  id: string;
  region_id: string;
  name: string;
  location: string | null;
  created_at: string;
  updated_at: string;
  created_by?: string | null;
}

export interface Department {
  id: string;
  plant_id: string;
  name: string;
  created_at: string;
  updated_at: string;
  created_by?: string | null;
}

export interface UserRole {
  id: string;
  role_name: string;
  display_name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  role_id: string | null;
  department_id: string | null;
  assigned_plant_id: string | null;
  phone_number: string | null;
  profile_photo_url: string | null;
  account_status: "active" | "suspended" | "pending";
  last_login: string | null;
  timezone: string;
  created_at: string;
  updated_at: string;
  
  // Relational mappings populated via joins
  user_roles?: UserRole | null;
  departments?: Department | null;
  plants?: Plant | null;
}

export interface UserPlantAssignment {
  id: string;
  user_id: string;
  plant_id: string;
  created_at: string;
  plant?: Plant;
}

// Helper to format database errors for user display
export function getDbErrorMessage(error: any): string {
  if (!error) return "A database error occurred.";
  return error.message || String(error);
}

// ── DATABASE OPERATIONS SERVICE ──────────────────────────────────────────────

export const dbService = {
  /**
   * Fetch complete user profile with role, plant, and department joins
   */
  async getUserProfile(userId: string): Promise<Profile | null> {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          *,
          user_roles(*),
          departments(*),
          plants(*)
        `)
        .eq("id", userId)
        .maybeSingle();

      if (error) throw error;
      return data as Profile | null;
    } catch (error: any) {
      console.error("Error fetching user profile:", error);
      throw new Error(getDbErrorMessage(error));
    }
  },

  /**
   * Fetch all permissions assigned to a specific role ID
   */
  async getRolePermissions(roleId: string): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from("role_permissions")
        .select("permission")
        .eq("role_id", roleId);

      if (error) throw error;
      return (data || []).map((rp: any) => rp.permission);
    } catch (error: any) {
      console.error("Error fetching role permissions:", error);
      return [];
    }
  },

  /**
   * Fetch all plants assigned to a user (including secondary assignments)
   */
  async getUserPlantAssignments(userId: string): Promise<Plant[]> {
    try {
      const { data, error } = await supabase
        .from("user_plant_assignments")
        .select(`
          plant_id,
          plant:plants(*)
        `)
        .eq("user_id", userId);

      if (error) throw error;
      return (data || [])
        .map((item: any) => item.plant)
        .filter(Boolean) as Plant[];
    } catch (error: any) {
      console.error("Error fetching user plant assignments:", error);
      return [];
    }
  },

  /**
   * Update profile fields (like timezone, phone number, etc.)
   */
  async updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile> {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)
        .select()
        .single();

      if (error) throw error;
      return data as Profile;
    } catch (error: any) {
      console.error("Error updating profile:", error);
      throw new Error(getDbErrorMessage(error));
    }
  },

  /**
   * Update the user last login timestamp
   */
  async updateLastLogin(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          last_login: new Date().toISOString(),
        })
        .eq("id", userId);
      if (error) throw error;
    } catch (error) {
      console.error("Failed to update user last login timestamp:", error);
    }
  },

  /**
   * Fetch list of all system roles (used during registration / configuration)
   */
  async getRoles(): Promise<UserRole[]> {
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("*")
        .order("display_name", { ascending: true });

      if (error) throw error;
      return (data || []) as UserRole[];
    } catch (error: any) {
      console.error("Error fetching roles:", error);
      return [];
    }
  },

  /**
   * Fetch all organizations
   */
  async getOrganizations(): Promise<Organization[]> {
    try {
      const { data, error } = await supabase
        .from("organizations")
        .select("*")
        .order("name", { ascending: true });

      if (error) throw error;
      return (data || []) as Organization[];
    } catch (error: any) {
      console.error("Error fetching organizations:", error);
      return [];
    }
  },

  /**
   * Fetch regions, optionally filtered by organization
   */
  async getRegions(organizationId?: string): Promise<Region[]> {
    try {
      let query = supabase.from("regions").select("*");
      if (organizationId) {
        query = query.eq("organization_id", organizationId);
      }
      const { data, error } = await query.order("name", { ascending: true });

      if (error) throw error;
      return (data || []) as Region[];
    } catch (error: any) {
      console.error("Error fetching regions:", error);
      return [];
    }
  },

  /**
   * Fetch plants, optionally filtered by region
   */
  async getPlants(regionId?: string): Promise<Plant[]> {
    try {
      let query = supabase.from("plants").select("*");
      if (regionId) {
        query = query.eq("region_id", regionId);
      }
      const { data, error } = await query.order("name", { ascending: true });

      if (error) throw error;
      return (data || []) as Plant[];
    } catch (error: any) {
      console.error("Error fetching plants:", error);
      return [];
    }
  },

  /**
   * Fetch departments, optionally filtered by plant
   */
  async getDepartments(plantId?: string): Promise<Department[]> {
    try {
      let query = supabase.from("departments").select("*");
      if (plantId) {
        query = query.eq("plant_id", plantId);
      }
      const { data, error } = await query.order("name", { ascending: true });

      if (error) throw error;
      return (data || []) as Department[];
    } catch (error: any) {
      console.error("Error fetching departments:", error);
      return [];
    }
  },
};
