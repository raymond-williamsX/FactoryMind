import { useLocation } from "react-router-dom";
import { Sun, Moon, Menu, Bell, CheckCircle, Search, User } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useSidebar } from "@/context/SidebarContext";
import { cn } from "@/lib/utils";

export default function TopBar() {
  const { theme, toggleTheme } = useTheme();
  const { isCollapsed, toggleSidebar, isMobile } = useSidebar();
  const location = useLocation();

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
        <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-muted-foreground font-semibold uppercase tracking-wider min-w-0 overflow-hidden">
          {breadcrumbs.map((crumb, idx) => (
            <div key={crumb} className={cn("flex items-center gap-1.5 shrink-0", idx === 0 && "hidden sm:flex")}>
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
        {/* Search — only on xl+ */}
        <div className="relative hidden xl:block w-48">
          <Search className="absolute left-2 top-2 h-3 w-3 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search register tags..."
            disabled
            className="w-full bg-muted/50 border border-border rounded-sm pl-7 pr-3 py-1 text-[11px] text-muted-foreground focus:outline-none cursor-not-allowed"
          />
        </div>

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

        {/* User profile */}
        <div className="flex items-center gap-2 border-l border-border pl-2 sm:pl-3 ml-0.5 sm:ml-1 h-6">
          <div className="h-6 w-6 rounded-sm bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold text-[10px] shrink-0 dark:bg-primary/20">
            <User className="h-3.5 w-3.5" />
          </div>
          <div className="hidden lg:flex flex-col text-left">
            <span className="text-[10px] font-bold uppercase leading-none text-foreground">Operator</span>
            <span className="text-[9px] text-muted-foreground leading-none mt-1">Control Room A</span>
          </div>
        </div>
      </div>
    </header>
  );
}
