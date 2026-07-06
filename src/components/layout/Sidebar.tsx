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
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className={cn(
        "flex flex-col h-screen sticky top-0 border-r border-border bg-card text-card-foreground select-none overflow-hidden shrink-0 z-30"
      )}
    >
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

        {!isCollapsed && (
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-sm hover:bg-muted text-muted-foreground transition-colors hidden lg:block border border-transparent hover:border-border"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Navigation List */}
      <nav className="flex-1 py-4 space-y-1 overflow-y-auto overflow-x-hidden">
        {mainNavItems.map((item) => (
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
      <div className="border-t border-border space-y-3 shrink-0 bg-muted/10 pb-4">
        <div className="space-y-1 pt-3">
          {bottomNavItems.map((item) => (
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

        {/* Collapsed Toggle Button for small sidebar */}
        {isCollapsed && (
          <div className="px-3">
            <button
              onClick={toggleSidebar}
              className="flex items-center justify-center w-full py-1.5 hover:bg-muted text-muted-foreground border border-border rounded-sm transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* System Health */}
        <AnimatePresence>
          {!isCollapsed && (
            <div className="px-4">
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="p-3 bg-muted/40 border border-border rounded-sm flex flex-col gap-1.5 text-[10px] text-muted-foreground whitespace-nowrap overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Database className="h-3 w-3 text-emerald-600" />
                    PLC Link
                  </span>
                  <span className="text-emerald-600 font-bold">OK</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-medium">
                    <History className="h-3 w-3" />
                    Response
                  </span>
                  <span className="font-mono text-foreground font-semibold">12ms</span>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  );
}
