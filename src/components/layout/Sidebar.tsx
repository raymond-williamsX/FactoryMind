import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Factory,
  LineChart,
  Settings,
  ChevronLeft,
  ChevronRight,
  Cpu,
  X,
  LogOut,
  MapPin,
  ChevronsUpDown,
} from "lucide-react";
import { useSidebar } from "@/context/SidebarContext";
import { useAuth } from "@/context/AuthContext";
import { useOrg } from "@/context/OrgContext";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import type { Plant } from "@/services/dbService";

type NavItem = {
  label: string;
  path: string;
  icon: React.ComponentType<any>;
  permission: string;
};

const mainNavItems: NavItem[] = [
  { label: "Overview", path: "/dashboard", icon: LayoutDashboard, permission: "view:dashboard" },
  { label: "Plant Operations", path: "/plants", icon: Factory, permission: "view:plants" },
  { label: "Advanced Analytics", path: "/analytics", icon: LineChart, permission: "view:analytics" },
];

const bottomNavItems: NavItem[] = [
  { label: "Platform Settings", path: "/settings", icon: Settings, permission: "view:settings" },
];

export default function Sidebar() {
  const { isCollapsed, toggleSidebar, isMobile, isMobileOpen, setIsMobileOpen } = useSidebar();
  const location = useLocation();

  // Close mobile drawer on navigation
  useEffect(() => {
    if (isMobile) {
      setIsMobileOpen(false);
    }
  }, [location.pathname, isMobile, setIsMobileOpen]);

  // ── MOBILE: Full-width drawer with backdrop overlay ──────────────────────
  if (isMobile) {
    return (
      <>
        {/* Backdrop */}
        <AnimatePresence>
          {isMobileOpen && (
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsMobileOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Drawer */}
        <AnimatePresence>
          {isMobileOpen && (
            <motion.aside
              key="mobile-sidebar"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
              className="fixed left-0 top-0 h-full w-72 z-50 flex flex-col bg-card text-card-foreground border-r border-border shadow-2xl"
            >
              <SidebarContent
                isCollapsed={false}
                isMobile={true}
                onClose={() => setIsMobileOpen(false)}
                toggleSidebar={toggleSidebar}
              />
            </motion.aside>
          )}
        </AnimatePresence>
      </>
    );
  }

  // ── DESKTOP: Collapsible icon-rail ───────────────────────────────────────
  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 64 : 260 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className={cn(
        "flex flex-col h-screen sticky top-0 border-r border-border bg-card text-card-foreground select-none overflow-hidden shrink-0 z-30"
      )}
    >
      <SidebarContent
        isCollapsed={isCollapsed}
        isMobile={false}
        toggleSidebar={toggleSidebar}
      />
    </motion.aside>
  );
}

// ── Shared sidebar body ────────────────────────────────────────────────────
function SidebarContent({
  isCollapsed,
  isMobile,
  onClose,
  toggleSidebar,
}: {
  isCollapsed: boolean;
  isMobile: boolean;
  onClose?: () => void;
  toggleSidebar: () => void;
}) {
  const { profile, hasPermission, logout } = useAuth();
  const { currentPlant, assignedPlants, allPlants, setCurrentPlant } = useOrg();
  const [showPlantDropdown, setShowPlantDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // Determine selectable plants list
  const isPrivileged = 
    profile?.user_roles?.role_name === "super_admin" || 
    profile?.user_roles?.role_name === "read_only_executive";
  
  const selectablePlants: Plant[] = isPrivileged ? allPlants : assignedPlants;

  // Initials for avatar fallback
  const getInitials = () => {
    if (!profile?.full_name) return "OP";
    return profile.full_name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <>
      {/* Brand Header */}
      <div className="flex items-center h-14 px-4 border-b border-border justify-between shrink-0 bg-muted/20">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="bg-slate-800 dark:bg-slate-700 text-white p-1 rounded-sm flex items-center justify-center shrink-0">
            <Cpu className="h-4 w-4" />
          </div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="font-bold text-xs tracking-wider uppercase whitespace-nowrap text-foreground"
              >
                FactoryMind AI
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Close button: X on mobile, ChevronLeft on desktop expanded */}
        {isMobile ? (
          <button
            onClick={onClose}
            className="p-1 rounded-sm hover:bg-muted text-muted-foreground transition-colors border border-transparent hover:border-border"
            aria-label="Close navigation"
          >
            <X className="h-4 w-4" />
          </button>
        ) : (
          !isCollapsed && (
            <button
              onClick={toggleSidebar}
              className="p-1 rounded-sm hover:bg-muted text-muted-foreground transition-colors hidden lg:block border border-transparent hover:border-border"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )
        )}
      </div>

      {/* Dynamic Plant Switcher Selector */}
      {!isCollapsed && selectablePlants.length > 1 && (
        <div className="px-3 pt-3 shrink-0 relative">
          <button
            onClick={() => setShowPlantDropdown((prev) => !prev)}
            className="w-full flex items-center justify-between gap-2 px-3 py-2 bg-muted/40 hover:bg-muted/80 border border-border rounded-md text-xs font-semibold text-foreground transition-all duration-150 outline-none"
          >
            <div className="flex items-center gap-2 min-w-0">
              <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
              <span className="truncate">{currentPlant?.name || "Unassigned"}</span>
            </div>
            <ChevronsUpDown className="h-3 w-3 text-muted-foreground shrink-0" />
          </button>

          <AnimatePresence>
            {showPlantDropdown && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowPlantDropdown(false)} 
                />
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-3 right-3 top-full mt-1 bg-card border border-border rounded-md shadow-xl z-50 max-h-48 overflow-y-auto overflow-x-hidden py-1"
                >
                  {selectablePlants.map((plant) => (
                    <button
                      key={plant.id}
                      onClick={() => {
                        setCurrentPlant(plant);
                        setShowPlantDropdown(false);
                      }}
                      className={cn(
                        "w-full text-left px-3 py-2 text-xs transition-colors hover:bg-muted font-medium block truncate",
                        currentPlant?.id === plant.id
                          ? "text-primary bg-primary/5 font-semibold"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {plant.name}
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Navigation List */}
      <nav className="flex-1 py-4 space-y-1 overflow-y-auto overflow-x-hidden">
        {mainNavItems
          .filter((item) => hasPermission(item.permission))
          .map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-2.5 text-xs font-semibold transition-all duration-150 border-l-[3px]",
                  isActive
                    ? "bg-slate-100 dark:bg-slate-900 text-foreground border-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-slate-100/50 dark:hover:bg-slate-900/50 border-transparent"
                )
              }
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="whitespace-nowrap overflow-hidden"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          ))}
      </nav>

      {/* Footer Nav & Platform Status */}
      <div className="border-t border-border space-y-3 shrink-0 bg-muted/10 pb-3">
        <div className="space-y-1 pt-2">
          {bottomNavItems
            .filter((item) => hasPermission(item.permission))
            .map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-4 py-2.5 text-xs font-semibold transition-all duration-150 border-l-[3px]",
                    isActive
                      ? "bg-slate-100 dark:bg-slate-900 text-foreground border-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-slate-100/50 dark:hover:bg-slate-900/50 border-transparent"
                  )
                }
              >
                <item.icon className="h-4 w-4 shrink-0" />
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="whitespace-nowrap overflow-hidden"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </NavLink>
            ))}
        </div>

        {/* Collapsed Toggle Button for small sidebar (desktop only) */}
        {!isMobile && isCollapsed && (
          <div className="px-3">
            <button
              onClick={toggleSidebar}
              className="flex items-center justify-center w-full py-1.5 hover:bg-muted text-muted-foreground border border-border rounded-sm transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* User profile section */}
        <div className="border-t border-border/80 pt-3 px-3">
          {isCollapsed ? (
            <button
              onClick={handleLogout}
              className="flex items-center justify-center w-full h-8 rounded hover:bg-destructive/15 text-muted-foreground hover:text-destructive border border-transparent hover:border-destructive/20 transition-all duration-150"
              title="Log Out Session"
            >
              <LogOut className="h-4 w-4" />
            </button>
          ) : (
            <div className="flex flex-col gap-2.5">
              {/* Profile Card */}
              <div className="flex items-center gap-2.5 p-2 bg-card/60 border border-border/60 rounded">
                {profile?.profile_photo_url ? (
                  <img
                    src={profile.profile_photo_url}
                    alt={profile.full_name}
                    className="h-7 w-7 rounded-sm object-cover border border-border shrink-0"
                  />
                ) : (
                  <div className="h-7 w-7 rounded-sm bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold text-[9px] shrink-0 dark:bg-primary/20">
                    {getInitials()}
                  </div>
                )}
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] font-bold text-foreground truncate uppercase leading-none">
                    {profile?.full_name || "Operator"}
                  </span>
                  <span className="text-[9px] text-muted-foreground/80 truncate leading-none mt-1">
                    {profile?.user_roles?.display_name || "Read-Only"}
                  </span>
                </div>
              </div>

              {/* Logout Trigger */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-1.5 bg-destructive/10 hover:bg-destructive text-destructive hover:text-white border border-destructive/20 hover:border-transparent rounded font-semibold text-[10px] uppercase tracking-wider transition-all duration-150 active:scale-[0.98]"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign Out Node
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
