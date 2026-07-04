import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  Activity,
  AlertTriangle,
  Zap,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ShieldCheck,
  Building2,
  Sliders
} from "lucide-react";
import { cn } from "@/lib/utils";

type LineStatus = "optimal" | "warning" | "critical";

type ProductionLine = {
  id: string;
  name: string;
  location: string;
  oee: number;
  throughput: number; // tons/hr
  status: LineStatus;
  temp: number; // °C
  pressure: number; // bar
  vibration: string; // mm/s
};

const mockProductionLines: ProductionLine[] = [
  { id: "L-OBA-1", name: "Obajana Kiln Line 1", location: "Kogi, Nigeria", oee: 94.2, throughput: 340, status: "optimal", temp: 1450, pressure: 2.1, vibration: "Normal" },
  { id: "L-IBE-2", name: "Ibese Clinker Line 2", location: "Ogun, Nigeria", oee: 91.8, throughput: 280, status: "optimal", temp: 1420, pressure: 1.9, vibration: "Normal" },
  { id: "L-OBA-3", name: "Obajana Kiln Line 3", location: "Kogi, Nigeria", oee: 84.5, throughput: 310, status: "warning", temp: 1510, pressure: 2.4, vibration: "Slightly High" },
  { id: "L-GBO-1", name: "Gboko Grinding Line 1", location: "Benue, Nigeria", oee: 92.1, throughput: 190, status: "optimal", temp: 85, pressure: 0.8, vibration: "Normal" },
  { id: "L-SEN-1", name: "Dakar Cement Line 1", location: "Sénégal", oee: 62.4, throughput: 150, status: "critical", temp: 1390, pressure: 3.2, vibration: "High" },
];

export default function DashboardShell() {
  const [selectedLine, setSelectedLine] = useState<ProductionLine | null>(null);
  const [searchFilter, setSearchFilter] = useState("");

  const filteredLines = mockProductionLines.filter(line =>
    line.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    line.location.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      {/* Title Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Dangote Cement Group — Enterprise Plant Performance
        </h1>
        <p className="text-sm text-muted-foreground">
          Real-time OEE, sensor telematics, and active clinker kiln indicators.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-card border border-border p-5 rounded-xl flex items-center justify-between shadow-sm relative overflow-hidden group">
          <div className="space-y-1">
            <span className="text-xs font-medium text-muted-foreground">Average Group OEE</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono">91.0%</span>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20 px-1.5 py-0.5 rounded-full font-medium flex items-center gap-0.5">
                <TrendingUp className="h-2.5 w-2.5" /> +1.2%
              </span>
            </div>
          </div>
          <div className="bg-primary/5 text-primary p-3 rounded-lg group-hover:scale-105 transition-transform">
            <Activity className="h-5 w-5" />
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-card border border-border p-5 rounded-xl flex items-center justify-between shadow-sm relative overflow-hidden group">
          <div className="space-y-1">
            <span className="text-xs font-medium text-muted-foreground">Total Output (Daily)</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono">14,270t</span>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20 px-1.5 py-0.5 rounded-full font-medium flex items-center gap-0.5">
                <TrendingUp className="h-2.5 w-2.5" /> +4.8%
              </span>
            </div>
          </div>
          <div className="bg-primary/5 text-primary p-3 rounded-lg group-hover:scale-105 transition-transform">
            <Building2 className="h-5 w-5" />
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-card border border-border p-5 rounded-xl flex items-center justify-between shadow-sm relative overflow-hidden group">
          <div className="space-y-1">
            <span className="text-xs font-medium text-muted-foreground">Active Telemetry Alarms</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono">2 Warnings</span>
              <span className="text-[10px] bg-amber-500/10 text-amber-500 dark:bg-amber-500/20 px-1.5 py-0.5 rounded-full font-medium">
                1 Resolved
              </span>
            </div>
          </div>
          <div className="bg-amber-500/10 text-amber-500 p-3 rounded-lg group-hover:scale-105 transition-transform">
            <AlertTriangle className="h-5 w-5" />
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-card border border-border p-5 rounded-xl flex items-center justify-between shadow-sm relative overflow-hidden group">
          <div className="space-y-1">
            <span className="text-xs font-medium text-muted-foreground">Total Group Load</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono">42.8 MW</span>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20 px-1.5 py-0.5 rounded-full font-medium">
                Optimal
              </span>
            </div>
          </div>
          <div className="bg-primary/5 text-primary p-3 rounded-lg group-hover:scale-105 transition-transform">
            <Zap className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Main Content Split Area */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* Primary Data Table */}
        <div className={cn(
          "bg-card border border-border rounded-xl shadow-sm overflow-hidden transition-all duration-300 w-full",
          selectedLine ? "lg:w-2/3" : "w-full"
        )}>
          {/* Table Toolbar */}
          <div className="p-4 border-b border-border flex flex-col sm:flex-row justify-between gap-3 bg-muted/20">
            <input
              type="text"
              placeholder="Filter by line name or location..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="bg-background border border-border rounded-lg px-3 py-1.5 text-sm w-full sm:w-64 focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <div className="flex gap-2">
              <button disabled className="text-xs bg-muted border border-border px-3 py-1.5 rounded-lg font-medium text-muted-foreground cursor-not-allowed">
                Columns
              </button>
              <button disabled className="text-xs bg-muted border border-border px-3 py-1.5 rounded-lg font-medium text-muted-foreground cursor-not-allowed">
                Export CSV
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/40 border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <th className="p-4">Asset ID</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">OEE Rating</th>
                  <th className="p-4">Throughput</th>
                  <th className="p-4">State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-sm">
                {filteredLines.map((line) => (
                  <tr
                    key={line.id}
                    onClick={() => setSelectedLine(line.id === selectedLine?.id ? null : line)}
                    className={cn(
                      "hover:bg-muted/40 cursor-pointer transition-colors duration-200",
                      selectedLine?.id === line.id && "bg-primary/5 dark:bg-primary/10 border-l-2 border-l-primary"
                    )}
                  >
                    <td className="p-4 font-mono text-xs text-muted-foreground">{line.id}</td>
                    <td className="p-4 font-semibold">{line.name}</td>
                    <td className="p-4 text-muted-foreground text-xs">{line.location}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold w-10 text-right">{line.oee}%</span>
                        <div className="w-20 bg-muted rounded-full h-1.5 overflow-hidden">
                          <div
                            className={cn(
                              "h-full rounded-full",
                              line.status === "optimal" && "bg-emerald-500",
                              line.status === "warning" && "bg-amber-500",
                              line.status === "critical" && "bg-rose-500"
                            )}
                            style={{ width: `${line.oee}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-xs">{line.throughput} t/hr</td>
                    <td className="p-4">
                      <span className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium uppercase tracking-wider text-[10px]",
                        line.status === "optimal" && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
                        line.status === "warning" && "bg-amber-500/10 text-amber-600 dark:text-amber-400",
                        line.status === "critical" && "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                      )}>
                        {line.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {filteredLines.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-muted-foreground text-sm">
                      No production lines match your filter criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Pagination */}
          <div className="p-4 border-t border-border flex items-center justify-between bg-muted/10 text-xs text-muted-foreground">
            <span>Showing {filteredLines.length} of {mockProductionLines.length} assets</span>
            <div className="flex items-center gap-1.5">
              <button disabled className="p-1 rounded border border-border hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed">
                <ChevronsLeft className="h-3.5 w-3.5" />
              </button>
              <button disabled className="p-1 rounded border border-border hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed">
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              <button disabled className="p-1 rounded border border-border hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed">
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
              <button disabled className="p-1 rounded border border-border hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed">
                <ChevronsRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Side Details/Telemetry Panel (Slides in when line is selected) */}
        <AnimatePresence>
          {selectedLine && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-card border border-border rounded-xl shadow-md w-full lg:w-1/3 overflow-hidden shrink-0 flex flex-col"
            >
              {/* Panel Header */}
              <div className="p-4 border-b border-border flex items-center justify-between bg-muted/20">
                <div className="flex items-center gap-2">
                  <Sliders className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-sm">Asset Diagnostics</span>
                </div>
                <button
                  onClick={() => setSelectedLine(null)}
                  className="text-xs hover:bg-muted px-2 py-1 rounded border border-border text-muted-foreground transition-colors"
                >
                  Close
                </button>
              </div>

              {/* Panel Content */}
              <div className="p-5 space-y-5">
                <div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider font-mono">
                    {selectedLine.id}
                  </span>
                  <h3 className="text-base font-bold leading-tight mt-0.5">{selectedLine.name}</h3>
                  <span className="text-xs text-muted-foreground">{selectedLine.location}</span>
                </div>

                {/* Status Block */}
                <div className={cn(
                  "p-3 rounded-lg border flex gap-3 text-xs",
                  selectedLine.status === "optimal" && "bg-emerald-500/5 border-emerald-500/20 text-emerald-800 dark:text-emerald-300",
                  selectedLine.status === "warning" && "bg-amber-500/5 border-amber-500/20 text-amber-800 dark:text-amber-300",
                  selectedLine.status === "critical" && "bg-rose-500/5 border-rose-500/20 text-rose-800 dark:text-rose-300"
                )}>
                  <ShieldCheck className="h-4 w-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block uppercase tracking-wide text-[10px]">
                      Status: {selectedLine.status}
                    </span>
                    <span>All core vibration, temperature, and torque registers are conforming to standard specifications.</span>
                  </div>
                </div>

                {/* Telematics/Sensor Grid */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                    Live Telemetry Registers
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-muted/40 border border-border/80 rounded-lg p-3 text-center">
                      <span className="text-[10px] text-muted-foreground block font-medium">Clinker Temp</span>
                      <span className="text-lg font-bold font-mono text-foreground mt-0.5 block">
                        {selectedLine.temp}°C
                      </span>
                    </div>
                    <div className="bg-muted/40 border border-border/80 rounded-lg p-3 text-center">
                      <span className="text-[10px] text-muted-foreground block font-medium">Kiln Pressure</span>
                      <span className="text-lg font-bold font-mono text-foreground mt-0.5 block">
                        {selectedLine.pressure} bar
                      </span>
                    </div>
                    <div className="bg-muted/40 border border-border/80 rounded-lg p-3 text-center col-span-2">
                      <span className="text-[10px] text-muted-foreground block font-medium">Kiln Shell Vibration</span>
                      <span className="text-base font-bold text-foreground mt-0.5 block">
                        {selectedLine.vibration}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Controls */}
                <div className="pt-2 border-t border-border flex gap-2">
                  <button disabled className="flex-1 text-center bg-primary text-primary-foreground hover:bg-primary/90 text-xs py-2 rounded-lg font-medium shadow-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                    Adjust Feed Rate
                  </button>
                  <button disabled className="flex-1 text-center border border-border hover:bg-muted text-xs py-2 rounded-lg font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                    Trigger Interlock
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
