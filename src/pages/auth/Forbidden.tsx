import { Link } from "react-router-dom";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface ForbiddenProps {
  isInline?: boolean;
}

export default function Forbidden({ isInline = false }: ForbiddenProps) {
  const { profile } = useAuth();
  
  const content = (
    <div className="flex flex-col items-center justify-center p-6 text-center select-none">
      <div className="bg-destructive/10 text-destructive p-4 rounded-xl flex items-center justify-center mb-6 border border-destructive/25 animate-pulse">
        <ShieldAlert className="h-10 w-10 text-destructive" />
      </div>
      <h1 className="text-3xl font-extrabold tracking-tight mb-2">403 — Sector Restrict</h1>
      <p className="text-sm text-muted-foreground max-w-md mb-2">
        Access Denied. Your security clearance role (<strong className="text-foreground uppercase text-xs">{profile?.user_roles?.display_name || "Guest"}</strong>) does not have permission to view this division.
      </p>
      <p className="text-xs text-muted-foreground/60 max-w-sm mb-8">
        If you require authorization, contact the Plant Operations administrator for Obajana or Ibese systems.
      </p>
      {!isInline && (
        <Link
          to="/dashboard"
          className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/95 rounded-md px-5 py-2.5 text-sm font-medium transition-all shadow-md"
        >
          <ArrowLeft className="h-4 w-4" />
          Return to Overview
        </Link>
      )}
    </div>
  );

  if (isInline) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-140px)] w-full bg-background/50 backdrop-blur-xs p-6 border border-border/40 rounded-xl m-6">
        {content}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      {content}
    </div>
  );
}
