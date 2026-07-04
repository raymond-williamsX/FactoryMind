import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Factory,
  LineChart,
  Settings,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Database,
  History
} from "lucide-react";
import { useSidebar } from "@/context/SidebarContext";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  path: string;
  icon: React.ComponentType<any>;
};

const mainNavItems: NavItem[] = [
  { label: "Overview", path: "/dashboard", icon: LayoutDashboard },
  { label: "Plant Operations", path: "/plants", icon: Factory },
  { label: "Advanced Analytics", path: "/analytics", icon: LineChart },
];

const bottomNavItems: NavItem[] = [
  { label: "Platform Settings", path: "/settings", icon: Settings },
];

export default function Sidebar() {
  const { isCollapsed, toggleSidebar } = useSidebar();

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 64 : 260 }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      className={cn(
        "flex flex-col h-screen sticky top-0 border-r border-border bg-card text-card-foreground select-none overflow-hidden shrink-0 z-30"
      )}
    >
      {/* Brand Header */}
      <div className="flex items-center h-16 px-4 border-b border-border justify-between shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="bg-primary text-primary-foreground p-1.5 rounded-lg flex items-center justify-center shrink-0">
            <Cpu className="h-5 w-5" />
          </div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="font-bold text-sm tracking-tight whitespace-nowrap bg-gradient-to-r from-foreground to-foreground/75 bg-clip-text"
              >
                FactoryMind AI
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {!isCollapsed && (
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-md hover:bg-muted text-muted-foreground transition-colors hidden lg:block"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto overflow-x-hidden">
        {mainNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group relative duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )
            }
          >
            <item.icon className="h-5 w-5 shrink-0" />
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
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
      <div className="p-3 border-t border-border space-y-3 shrink-0 bg-muted/40">
        <div className="space-y-1.5">
          {bottomNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )
              }
            >
              <item.icon className="h-5 w-5 shrink-0" />
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="whitespace-nowrap overflow-hidden"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          ))}
        </div>

        {/* Collapsed Toggle Button for small sidebar */}
        {isCollapsed && (
          <button
            onClick={toggleSidebar}
            className="flex items-center justify-center w-full py-2 hover:bg-muted text-muted-foreground rounded-lg transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        )}

        {/* System Health */}
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="p-2.5 bg-card border border-border rounded-lg flex flex-col gap-1 text-[11px] text-muted-foreground whitespace-nowrap overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Database className="h-3 w-3 text-emerald-500" />
                  Telematics Server
                </span>
                <span className="text-emerald-500 font-semibold">ONLINE</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <History className="h-3 w-3" />
                  Telemetry Delay
                </span>
                <span className="font-mono">12ms</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  );
}
