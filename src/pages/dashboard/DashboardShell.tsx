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
    <div className="p-4 max-w-[1600px] mx-auto space-y-4">
      {/* Title Header */}
      <div className="flex flex-col gap-0.5 border-b border-border pb-3">
        <h1 className="text-lg font-bold tracking-tight text-foreground uppercase">
          Dangote Cement Group — Enterprise Plant Performance
        </h1>
        <p className="text-xs text-muted-foreground">
          Real-time OEE metrics, raw feed telemetry, and clinker kiln diagnostics.
        </p>
      </div>

      {/* KPI Tiles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* KPI 1: OEE */}
        <div className="bg-card border border-border border-l-4 border-l-primary p-4 rounded-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Average Group OEE</span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold font-mono text-foreground">91.0%</span>
              <span className="text-[9px] text-emerald-600 font-semibold flex items-center gap-0.5">
                <TrendingUp className="h-2.5 w-2.5" /> +1.2%
              </span>
            </div>
          </div>
          <div className="text-muted-foreground p-1">
            <Activity className="h-4.5 w-4.5" />
          </div>
        </div>

        {/* KPI 2: Output */}
        <div className="bg-card border border-border border-l-4 border-l-sky-600 p-4 rounded-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Total Output (Daily)</span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold font-mono text-foreground">14,270t</span>
              <span className="text-[9px] text-emerald-600 font-semibold flex items-center gap-0.5">
                <TrendingUp className="h-2.5 w-2.5" /> +4.8%
              </span>
            </div>
          </div>
          <div className="text-muted-foreground p-1">
            <Building2 className="h-4.5 w-4.5" />
          </div>
        </div>

        {/* KPI 3: Alarms */}
        <div className="bg-card border border-border border-l-4 border-l-destructive p-4 rounded-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Active Telemetry Alarms</span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold font-mono text-destructive">2 Warnings</span>
              <span className="text-[9px] text-muted-foreground font-semibold">
                1 Resolved
              </span>
            </div>
          </div>
          <div className="text-destructive p-1">
            <AlertTriangle className="h-4.5 w-4.5" />
          </div>
        </div>

        {/* KPI 4: Energy */}
        <div className="bg-card border border-border border-l-4 border-l-emerald-600 p-4 rounded-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Total Group Load</span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold font-mono text-foreground">42.8 MW</span>
              <span className="text-[9px] text-emerald-600 font-semibold">
                Optimal
              </span>
            </div>
          </div>
          <div className="text-muted-foreground p-1">
            <Zap className="h-4.5 w-4.5" />
          </div>
        </div>
      </div>

      {/* Grid Content Split Area */}
      <div className="flex flex-col lg:flex-row gap-4 items-start">
        
        {/* Primary Data Grid */}
        <div className={cn(
          "bg-card border border-border rounded-sm overflow-hidden transition-all duration-150 w-full",
          selectedLine ? "lg:w-2/3" : "w-full"
        )}>
          {/* Table Toolbar */}
          <div className="p-3 border-b border-border flex flex-col sm:flex-row justify-between gap-3 bg-muted/20">
            <input
              type="text"
              placeholder="Search assets..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="bg-background border border-border rounded-sm px-3 py-1 text-xs w-full sm:w-64 focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <div className="flex gap-1">
              <button disabled className="text-[10px] uppercase bg-muted border border-border px-3 py-1 rounded-sm font-bold text-muted-foreground cursor-not-allowed">
                Columns
              </button>
              <button disabled className="text-[10px] uppercase bg-muted border border-border px-3 py-1 rounded-sm font-bold text-muted-foreground cursor-not-allowed">
                Export
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/40 border-b border-border text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  <th className="p-3 border-r border-border/50">Asset ID</th>
                  <th className="p-3 border-r border-border/50">Name</th>
                  <th className="p-3 border-r border-border/50">Location</th>
                  <th className="p-3 border-r border-border/50">OEE Rating</th>
                  <th className="p-3 border-r border-border/50">Throughput</th>
                  <th className="p-3">State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-xs">
                {filteredLines.map((line) => (
                  <tr
                    key={line.id}
                    onClick={() => setSelectedLine(line.id === selectedLine?.id ? null : line)}
                    className={cn(
                      "hover:bg-muted/30 cursor-pointer transition-colors duration-100",
                      selectedLine?.id === line.id && "bg-slate-100 dark:bg-slate-900 border-l-[3px] border-l-primary"
                    )}
                  >
                    <td className="p-3 font-mono text-[10px] text-muted-foreground border-r border-border/40">{line.id}</td>
                    <td className="p-3 font-bold border-r border-border/40 text-foreground">{line.name}</td>
                    <td className="p-3 text-muted-foreground border-r border-border/40">{line.location}</td>
                    <td className="p-3 border-r border-border/40">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold w-8 text-right">{line.oee}%</span>
                        <div className="w-16 bg-muted rounded-none h-1.5 overflow-hidden border border-border/40">
                          <div
                            className={cn(
                              "h-full",
                              line.status === "optimal" && "bg-emerald-600",
                              line.status === "warning" && "bg-amber-600",
                              line.status === "critical" && "bg-destructive"
                            )}
                            style={{ width: `${line.oee}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="p-3 font-mono border-r border-border/40">{line.throughput} t/hr</td>
                    <td className="p-3">
                      <span className={cn(
                        "inline-flex items-center px-1.5 py-0.5 rounded-none text-[9px] font-bold uppercase tracking-wider",
                        line.status === "optimal" && "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20",
                        line.status === "warning" && "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20",
                        line.status === "critical" && "bg-destructive/10 text-destructive border border-destructive/20"
                      )}>
                        {line.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {filteredLines.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-muted-foreground">
                      No assets found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Pagination */}
          <div className="p-2 border-t border-border flex items-center justify-between bg-muted/10 text-[10px] text-muted-foreground uppercase font-bold">
            <span>Total Assets: {mockProductionLines.length}</span>
            <div className="flex items-center gap-1">
              <button disabled className="p-1 rounded-sm border border-border hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed">
                <ChevronsLeft className="h-3 w-3" />
              </button>
              <button disabled className="p-1 rounded-sm border border-border hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed">
                <ChevronLeft className="h-3 w-3" />
              </button>
              <button disabled className="p-1 rounded-sm border border-border hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed">
                <ChevronRight className="h-3 w-3" />
              </button>
              <button disabled className="p-1 rounded-sm border border-border hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed">
                <ChevronsRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Side Details/Telemetry Panel */}
        <AnimatePresence>
          {selectedLine && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.15 }}
              className="bg-card border border-border rounded-sm shadow-sm w-full lg:w-1/3 overflow-hidden shrink-0 flex flex-col"
            >
              {/* Panel Header */}
              <div className="p-3 border-b border-border flex items-center justify-between bg-muted/20">
                <div className="flex items-center gap-2">
                  <Sliders className="h-4 w-4 text-primary" />
                  <span className="font-bold text-xs uppercase tracking-wider">Asset Register Diagnostics</span>
                </div>
                <button
                  onClick={() => setSelectedLine(null)}
                  className="text-[9px] uppercase font-bold hover:bg-muted px-2 py-1 rounded-sm border border-border text-muted-foreground transition-colors"
                >
                  Dismiss
                </button>
              </div>

              {/* Panel Content */}
              <div className="p-4 space-y-4 text-xs">
                <div>
                  <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider font-mono">
                    System Tag: {selectedLine.id}
                  </span>
                  <h3 className="text-sm font-bold text-foreground mt-0.5 uppercase">{selectedLine.name}</h3>
                  <span className="text-[10px] text-muted-foreground">{selectedLine.location}</span>
                </div>

                {/* Status Block */}
                <div className={cn(
                  "p-3 rounded-none border flex gap-3 text-xs",
                  selectedLine.status === "optimal" && "bg-emerald-500/5 border-emerald-500/20 text-emerald-800 dark:text-emerald-300",
                  selectedLine.status === "warning" && "bg-amber-500/5 border-amber-500/20 text-amber-800 dark:text-amber-300",
                  selectedLine.status === "critical" && "bg-destructive/5 border-destructive/20 text-destructive"
                )}>
                  <ShieldCheck className="h-4 w-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block uppercase tracking-wider text-[9px]">
                      Register Code: {selectedLine.status}
                    </span>
                    <span className="text-[11px] block mt-0.5 leading-relaxed">
                      Continuous telemetry conforms to regulatory guidelines. Auto-interlock algorithms active.
                    </span>
                  </div>
                </div>

                {/* Sensor Grid */}
                <div className="space-y-2">
                  <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">
                    Live PLC Register Sensor Logs
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-muted/30 border border-border rounded-sm p-2 text-center">
                      <span className="text-[9px] text-muted-foreground block font-bold uppercase">Kiln Heat</span>
                      <span className="text-sm font-bold font-mono text-foreground mt-0.5 block">
                        {selectedLine.temp}°C
                      </span>
                    </div>
                    <div className="bg-muted/30 border border-border rounded-sm p-2 text-center">
                      <span className="text-[9px] text-muted-foreground block font-bold uppercase">Kiln Pressure</span>
                      <span className="text-sm font-bold font-mono text-foreground mt-0.5 block">
                        {selectedLine.pressure} bar
                      </span>
                    </div>
                    <div className="bg-muted/30 border border-border rounded-sm p-2 text-center col-span-2">
                      <span className="text-[9px] text-muted-foreground block font-bold uppercase">Bearing Vibration</span>
                      <span className="text-xs font-bold text-foreground mt-0.5 block uppercase">
                        {selectedLine.vibration}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Button Set */}
                <div className="pt-2 border-t border-border flex gap-2">
                  <button disabled className="flex-1 text-center bg-primary text-primary-foreground hover:bg-primary/90 text-[10px] uppercase font-bold py-2 rounded-sm shadow-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                    Adjust Feed
                  </button>
                  <button disabled className="flex-1 text-center border border-border hover:bg-muted text-[10px] uppercase font-bold py-2 rounded-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                    Shutdown kiln
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
