import { Link } from "react-router-dom";
import { KeyRound, ArrowLeft } from "lucide-react";

export default function Unauthorized() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-6 text-center select-none">
      <div className="bg-amber-500/10 text-amber-500 p-4 rounded-xl flex items-center justify-center mb-6 border border-amber-500/25">
        <KeyRound className="h-10 w-10 text-amber-500 animate-bounce" />
      </div>
      <h1 className="text-3xl font-extrabold tracking-tight mb-2">401 — Authentication Offline</h1>
      <p className="text-sm text-muted-foreground max-w-md mb-8">
        Your current session is unauthorized or has expired. Please sign in to verify your plant credentials and access this sector.
      </p>
      <div className="flex gap-4">
        <Link
          to="/login"
          className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/95 rounded-md px-5 py-2.5 text-sm font-medium transition-all shadow-md"
        >
          Proceed to Login
        </Link>
        <Link
          to="/"
          className="flex items-center gap-2 bg-muted hover:bg-muted/80 border border-border text-foreground rounded-md px-5 py-2.5 text-sm font-medium transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          Home
        </Link>
      </div>
    </div>
  );
}
