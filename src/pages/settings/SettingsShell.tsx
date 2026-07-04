import { ShieldAlert, Cpu, Bell } from "lucide-react";

export default function SettingsShell() {
  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Platform Settings</h1>
        <p className="text-sm text-muted-foreground">
          Calibrate OEE target levels, alert tolerances, and notification channels.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel 1 */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4 col-span-2">
          <h3 className="text-sm font-semibold border-b border-border pb-2">OEE Evaluation & Alarms</h3>
          
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">OEE Warning Threshold (%)</label>
              <input
                type="number"
                defaultValue={85}
                disabled
                className="w-full bg-muted border border-border rounded-lg px-3 py-1.5 text-xs text-muted-foreground cursor-not-allowed"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">OEE Critical Threshold (%)</label>
              <input
                type="number"
                defaultValue={70}
                disabled
                className="w-full bg-muted border border-border rounded-lg px-3 py-1.5 text-xs text-muted-foreground cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Panel 2 */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-semibold border-b border-border pb-2 flex items-center gap-2">
            <Bell className="h-4 w-4" /> System Health Rules
          </h3>
          <div className="space-y-2 text-xs text-muted-foreground">
            <div className="p-3 bg-muted/40 rounded-lg flex items-start gap-2 border border-border">
              <ShieldAlert className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block text-foreground">Kiln Thermal Alarm</span>
                Trigger warn state immediately if shell thermometer exceeds 1500°C for over 5 mins.
              </div>
            </div>

            <div className="p-3 bg-muted/40 rounded-lg flex items-start gap-2 border border-border">
              <Cpu className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block text-foreground">Sensor Interlocks</span>
                Emergency automated shutoff loops are configured directly in secondary PLC registers.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
