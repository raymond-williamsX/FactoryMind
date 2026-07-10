import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { dbService } from "@/services/dbService";
import type { 
  Plant, 
  Region, 
  Organization 
} from "@/services/dbService";

interface OrgContextType {
  currentPlant: Plant | null;
  assignedPlants: Plant[];
  allPlants: Plant[];
  currentRegion: Region | null;
  currentOrg: Organization | null;
  isLoadingOrg: boolean;
  setCurrentPlant: (plant: Plant) => void;
  refreshOrgData: () => Promise<void>;
}

const OrgContext = createContext<OrgContextType | undefined>(undefined);

export const OrgProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, profile, isAuthenticated } = useAuth();
  const [currentPlant, setCurrentPlantState] = useState<Plant | null>(null);
  const [assignedPlants, setAssignedPlants] = useState<Plant[]>([]);
  const [allPlants, setAllPlants] = useState<Plant[]>([]);
  const [currentRegion, setCurrentRegion] = useState<Region | null>(null);
  const [currentOrg, setCurrentOrg] = useState<Organization | null>(null);
  const [isLoadingOrg, setIsLoadingOrg] = useState<boolean>(false);

  // Switch the active plant and reload its regional hierarchy details
  const setCurrentPlant = useCallback(async (plant: Plant) => {
    setCurrentPlantState(plant);
    if (!plant) {
      setCurrentRegion(null);
      setCurrentOrg(null);
      return;
    }

    try {
      // Resolve region details
      const regionsList = await dbService.getRegions();
      const plantRegion = regionsList.find(r => r.id === plant.region_id);
      if (plantRegion) {
        setCurrentRegion(plantRegion);
        
        // Resolve organization details
        const orgsList = await dbService.getOrganizations();
        const regionOrg = orgsList.find(o => o.id === plantRegion.organization_id);
        if (regionOrg) {
          setCurrentOrg(regionOrg);
        }
      }
    } catch (err) {
      console.error("Failed to load regional hierarchy for plant:", plant.name, err);
    }
  }, []);

  const refreshOrgData = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setAssignedPlants([]);
      setAllPlants([]);
      setCurrentPlantState(null);
      setCurrentRegion(null);
      setCurrentOrg(null);
      return;
    }

    setIsLoadingOrg(true);
    try {
      // Load all plants and user specific plant assignments concurrently
      const [allPlantsList, userAssignments] = await Promise.all([
        dbService.getPlants(),
        dbService.getUserPlantAssignments(user.id),
      ]);

      setAllPlants(allPlantsList);
      setAssignedPlants(userAssignments);

      // Resolve initial plant selection
      let defaultPlant: Plant | null = null;

      // 1. Check if user profile has a designated primary plant assigned
      if (profile?.assigned_plant_id) {
        defaultPlant = allPlantsList.find(p => p.id === profile.assigned_plant_id) || null;
      }

      // 2. Fallback to the first assigned plant
      if (!defaultPlant && userAssignments.length > 0) {
        defaultPlant = userAssignments[0];
      }

      // 3. Fallback to first plant in the system if user is super admin or executive
      const isPrivileged = 
        profile?.user_roles?.role_name === "super_admin" || 
        profile?.user_roles?.role_name === "read_only_executive";
      
      if (!defaultPlant && isPrivileged && allPlantsList.length > 0) {
        defaultPlant = allPlantsList[0];
      }

      if (defaultPlant) {
        await setCurrentPlant(defaultPlant);
      } else {
        setCurrentPlantState(null);
        setCurrentRegion(null);
        setCurrentOrg(null);
      }
    } catch (err) {
      console.error("Error loading organization data:", err);
    } finally {
      setIsLoadingOrg(false);
    }
  }, [isAuthenticated, user, profile, setCurrentPlant]);

  // Load organization and plant assets whenever authentication state settles
  useEffect(() => {
    refreshOrgData();
  }, [refreshOrgData]);

  return (
    <OrgContext.Provider
      value={{
        currentPlant,
        assignedPlants,
        allPlants,
        currentRegion,
        currentOrg,
        isLoadingOrg,
        setCurrentPlant,
        refreshOrgData,
      }}
    >
      {children}
    </OrgContext.Provider>
  );
};

export const useOrg = () => {
  const context = useContext(OrgContext);
  if (context === undefined) {
    throw new Error("useOrg must be used within an OrgProvider");
  }
  return context;
};
