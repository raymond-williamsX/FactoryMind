import { useLocation } from "react-router-dom";
import { Sun, Moon, Menu, Bell, CheckCircle } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useSidebar } from "@/context/SidebarContext";
import { useAuth } from "@/context/AuthContext";
import { useOrg } from "@/context/OrgContext";
import { cn } from "@/lib/utils";

export default function TopBar() {
  const { theme, toggleTheme } = useTheme();
  const { isCollapsed, toggleSidebar, isMobile } = useSidebar();
  const { profile } = useAuth();
  const { currentPlant, currentRegion } = useOrg();
  const location = useLocation();

  const getBreadcrumbs = () => {
    const path = location.pathname;
    const crumbs = [];

    // Prepend region & plant context if active
    if (currentRegion) {
      crumbs.push(currentRegion.name);
    }
    if (currentPlant) {
      crumbs.push(currentPlant.name);
    }

    // Add current view title
    if (path === "/dashboard") crumbs.push("Overview");
    else if (path === "/plants") crumbs.push("Operations");
    else if (path === "/analytics") crumbs.push("Telemetry Logs");
    else if (path === "/settings") crumbs.push("Configuration");
    else crumbs.push("View");

    return crumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  // Get initials for profile fallback
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
    <header className="h-14 border-b border-border bg-card text-card-foreground flex items-center justify-between px-3 sm:px-4 sticky top-0 z-20 select-none">
      {/* Left Side: Hamburger & Breadcrumbs */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {/* Mobile hamburger — always visible on mobile */}
        {isMobile && (
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-sm hover:bg-muted text-muted-foreground transition-colors border border-transparent hover:border-border shrink-0"
            aria-label="Open navigation"
          >
            <Menu className="h-4 w-4" />
          </button>
        )}

        {/* Desktop collapsed hamburger */}
        {!isMobile && isCollapsed && (
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-sm hover:bg-muted text-muted-foreground transition-colors border border-transparent hover:border-border shrink-0"
            aria-label="Expand sidebar"
          >
            <Menu className="h-4 w-4" />
          </button>
        )}

        {/* Breadcrumbs */}
        <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] text-muted-foreground font-semibold uppercase tracking-wider min-w-0 overflow-hidden">
          {breadcrumbs.map((crumb, idx) => (
            <div key={`${crumb}-${idx}`} className={cn("flex items-center gap-1.5 shrink-0", idx === 0 && "hidden sm:flex")}>
              {idx > 0 && <span className="text-muted-foreground/35">/</span>}
              <span className={cn(idx === breadcrumbs.length - 1 && "text-foreground truncate")}>
                {crumb}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Middle: Clinical OEE Badging (hidden on mobile) */}
      <div className="hidden md:flex items-center gap-4 text-[10px] uppercase font-semibold border-x border-border/80 px-4 h-6 shrink-0">
        <div className="flex items-center gap-1.5">
          <CheckCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
          <div>
            <span className="text-muted-foreground">Obajana Kilns:</span>{" "}
            <span className="text-foreground font-bold">94.2% OEE</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <CheckCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
          <div>
            <span className="text-muted-foreground">Ibese Kilns:</span>{" "}
            <span className="text-foreground font-bold">91.8% OEE</span>
          </div>
        </div>
      </div>

      {/* Right Side: Search, Theme, Profile */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* Alarm Bell */}
        <button className="p-1.5 rounded-sm hover:bg-muted text-muted-foreground transition-all relative border border-transparent hover:border-border">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-destructive" />
        </button>

        {/* Theme Switch */}
        <button
          onClick={toggleTheme}
          className="p-1.5 rounded-sm hover:bg-muted text-muted-foreground transition-all border border-transparent hover:border-border"
          aria-label="Toggle Theme"
        >
          {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </button>

        {/* User profile widget */}
        <div className="flex items-center gap-2.5 p-1 border-l border-border pl-2 sm:pl-3 ml-0.5 sm:ml-1 h-6">
          {profile?.profile_photo_url ? (
            <img
              src={profile.profile_photo_url}
              alt={profile.full_name}
              className="h-6 w-6 rounded-sm object-cover border border-border shrink-0"
            />
          ) : (
            <div className="h-6 w-6 rounded-sm bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold text-[9px] shrink-0 dark:bg-primary/20">
              {getInitials()}
            </div>
          )}
          <div className="hidden lg:flex flex-col text-left justify-center">
            <span className="text-[10px] font-bold uppercase leading-none text-foreground truncate max-w-[100px]">
              {profile?.full_name || "Operator"}
            </span>
            <span className="text-[8px] text-muted-foreground leading-none mt-1 truncate max-w-[100px]">
              {profile?.departments?.name || "Operations Unit"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
