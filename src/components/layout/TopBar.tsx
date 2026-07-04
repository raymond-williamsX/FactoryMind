import { useLocation } from "react-router-dom";
import { Sun, Moon, Menu, Bell, CheckCircle, Search, User } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useSidebar } from "@/context/SidebarContext";
import { cn } from "@/lib/utils";

export default function TopBar() {
  const { theme, toggleTheme } = useTheme();
  const { isCollapsed, toggleSidebar } = useSidebar();
  const location = useLocation();

  // Simple breadcrumbs mapping based on paths
  const getBreadcrumbs = () => {
    const path = location.pathname;
    if (path === "/dashboard") return ["Platform", "Overview"];
    if (path === "/plants") return ["Plant Operations", "Assets"];
    if (path === "/analytics") return ["Analytics", "Telemetry"];
    if (path === "/settings") return ["Platform", "Configuration"];
    return ["Platform", "View"];
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="h-16 border-b border-border bg-card text-card-foreground flex items-center justify-between px-6 sticky top-0 z-20 select-none">
      {/* Left: Hamburger + Breadcrumbs */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        {isCollapsed && (
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors hidden lg:block"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
          {breadcrumbs.map((crumb, idx) => (
            <div key={crumb} className="flex items-center gap-2">
              {idx > 0 && <span className="text-muted-foreground/45">/</span>}
              <span className={cn(idx === breadcrumbs.length - 1 && "text-foreground font-semibold")}>
                {crumb}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Middle: Live Plant Telemetry Status (industrial touch) */}
      <div className="hidden md:flex items-center gap-6 text-xs border-x border-border/80 px-6 py-1 mx-4">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
          <div>
            <span className="text-muted-foreground">Dangote Obajana:</span>{" "}
            <span className="font-semibold text-foreground">94.2% OEE</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
          <div>
            <span className="text-muted-foreground">Dangote Ibese:</span>{" "}
            <span className="font-semibold text-foreground">91.8% OEE</span>
          </div>
        </div>
      </div>

      {/* Right: Search, Alarm Center, Theme Toggle, User Profiling */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden xl:block w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search assets, telemetry, logs..."
            disabled
            className="w-full bg-muted/65 border border-border rounded-lg pl-9 pr-4 py-1.5 text-xs text-muted-foreground focus:outline-none cursor-not-allowed"
          />
        </div>

        {/* Alarm Bell Button */}
        <button className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-all relative">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-destructive" />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-all"
          aria-label="Toggle Theme"
        >
          {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </button>

        {/* User profile dropdown trigger placeholder */}
        <div className="flex items-center gap-2 border-l border-border pl-3 ml-1">
          <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold text-xs shrink-0 dark:bg-primary/20 dark:text-primary-foreground">
            <User className="h-4 w-4" />
          </div>
          <div className="hidden lg:flex flex-col text-left">
            <span className="text-xs font-semibold leading-none">Dangote Operator</span>
            <span className="text-[10px] text-muted-foreground leading-none mt-1">Control Room 4A</span>
          </div>
        </div>
      </div>
    </header>
  );
}
