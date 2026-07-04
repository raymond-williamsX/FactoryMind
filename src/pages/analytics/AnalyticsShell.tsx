import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import { Thermometer, Activity, Percent } from "lucide-react";

type TelemetryData = {
  time: string;
  ObajanaKiln: number;
  IbeseKiln: number;
};

const temperatureData: TelemetryData[] = [
  { time: "00:00", ObajanaKiln: 1420, IbeseKiln: 1390 },
  { time: "04:00", ObajanaKiln: 1450, IbeseKiln: 1410 },
  { time: "08:00", ObajanaKiln: 1430, IbeseKiln: 1400 },
  { time: "12:00", ObajanaKiln: 1485, IbeseKiln: 1440 },
  { time: "16:00", ObajanaKiln: 1440, IbeseKiln: 1420 },
  { time: "20:00", ObajanaKiln: 1410, IbeseKiln: 1385 },
];

export default function AnalyticsShell() {
  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Advanced Analytics & Telemetry</h1>
        <p className="text-sm text-muted-foreground">
          Historical sensor trends, predictive kiln thermals, and OEE regressions.
        </p>
      </div>

      {/* Chart Layout Card */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary/5 text-primary p-2 rounded-lg">
            <Thermometer className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Clinker Kiln Temperature Trends</h3>
            <span className="text-xs text-muted-foreground">Target Zone: 1400°C - 1500°C</span>
          </div>
        </div>

        {/* Recharts Container */}
        <div className="h-[320px] w-full text-xs">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={temperatureData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="time" className="fill-muted-foreground" />
              <YAxis domain={[1200, 1600]} className="fill-muted-foreground" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  borderColor: "hsl(var(--border))",
                  borderRadius: "8px",
                  color: "hsl(var(--foreground))"
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="ObajanaKiln"
                name="Obajana Line 1 Kiln"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="IbeseKiln"
                name="Ibese Line 2 Kiln"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <Activity className="h-4 w-4" /> Thermal Diagnostics
          </div>
          <p className="text-xs text-muted-foreground">
            Kiln thermal variations are currently well within stable thresholds. Peak thermal stress detected in Obajana Line 1 Kiln at 12:00 hours reached 1485°C, resolving safely without sensor interlock triggers.
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <Percent className="h-4 w-4" /> Machine Learning Estimator
          </div>
          <p className="text-xs text-muted-foreground">
            Kiln combustion efficiency is predicted to maintain 92.5% for the next 24 hours based on continuous raw feed telemetry and exhaust emission moisture curves.
          </p>
        </div>
      </div>
    </div>
  );
}
