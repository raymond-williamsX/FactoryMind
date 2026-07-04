import { Link } from "react-router-dom";
import { Factory, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-6 text-center select-none bg-background">
      <div className="bg-muted text-muted-foreground p-4 rounded-2xl flex items-center justify-center mb-6 border border-border">
        <Factory className="h-10 w-10 text-muted-foreground/80 animate-pulse" />
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight mb-2">404 — Section Offline</h1>
      <p className="text-sm text-muted-foreground max-w-md mb-8">
        The factory division or analytics view you are trying to reach does not exist or has been decommissioned.
      </p>
      <Link
        to="/dashboard"
        className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/95 rounded-lg px-5 py-2.5 text-sm font-medium transition-all shadow-md"
      >
        <ArrowLeft className="h-4 w-4" />
        Return to Overview
      </Link>
    </div>
  );
}
