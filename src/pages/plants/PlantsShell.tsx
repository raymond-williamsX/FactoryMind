import { Activity, Cpu, Sliders } from "lucide-react";

export default function PlantsShell() {
  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Plant Operations & Assets</h1>
        <p className="text-sm text-muted-foreground">
          Detailed unit controllers, kiln feeds, and mechanical asset trees.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/5 text-primary p-2.5 rounded-lg">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Crusher Operations</h3>
              <span className="text-xs text-muted-foreground">Dangote Obajana</span>
            </div>
          </div>
          <div className="p-3 bg-muted/30 border border-border/80 rounded-lg text-xs space-y-2">
            <div className="flex justify-between">
              <span>Feed Rate Limit</span>
              <span className="font-mono font-semibold">1,200 t/h</span>
            </div>
            <div className="flex justify-between">
              <span>Motor Torque</span>
              <span className="font-mono font-semibold text-emerald-500">Normal (62%)</span>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/5 text-primary p-2.5 rounded-lg">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Preheater Tower</h3>
              <span className="text-xs text-muted-foreground">Dangote Ibese</span>
            </div>
          </div>
          <div className="p-3 bg-muted/30 border border-border/80 rounded-lg text-xs space-y-2">
            <div className="flex justify-between">
              <span>Stage 4 Temp</span>
              <span className="font-mono font-semibold">860 °C</span>
            </div>
            <div className="flex justify-between">
              <span>Oxygen Level</span>
              <span className="font-mono font-semibold text-emerald-500">Optimal (2.4%)</span>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/5 text-primary p-2.5 rounded-lg">
              <Sliders className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Cooler Fan Systems</h3>
              <span className="text-xs text-muted-foreground">Dangote Gboko</span>
            </div>
          </div>
          <div className="p-3 bg-muted/30 border border-border/80 rounded-lg text-xs space-y-2">
            <div className="flex justify-between">
              <span>Air Flow Velocity</span>
              <span className="font-mono font-semibold">42 m/s</span>
            </div>
            <div className="flex justify-between">
              <span>Bearing Vibration</span>
              <span className="font-mono font-semibold text-amber-500">Elevated (3.8 mm/s)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
