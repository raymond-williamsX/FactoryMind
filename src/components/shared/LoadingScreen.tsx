import { Cpu } from "lucide-react";

export default function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] w-full p-6 text-center select-none">
      <div className="relative flex items-center justify-center">
        {/* Pulse Outer Rings */}
        <div className="absolute h-16 w-16 rounded-full border border-primary/20 animate-ping opacity-75" />
        <div className="absolute h-12 w-12 rounded-full border border-primary/30 animate-pulse" />
        
        {/* Spinner Core */}
        <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center shadow-md animate-spin duration-1000">
          <Cpu className="h-5 w-5 text-primary-foreground" />
        </div>
      </div>
      <h3 className="mt-6 text-sm font-semibold tracking-wide uppercase text-muted-foreground animate-pulse">
        Loading Telemetry Core...
      </h3>
    </div>
  );
}
