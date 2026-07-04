import { Component, type ErrorInfo, type ReactNode } from "react";
import { ShieldAlert, RefreshCw } from "lucide-react";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught telemetry/logic error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center bg-card border border-destructive/25 rounded-xl m-6">
          <div className="bg-destructive/10 text-destructive p-3 rounded-full flex items-center justify-center mb-4">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold tracking-tight mb-2">Telemetry Panel Error</h2>
          <p className="text-sm text-muted-foreground max-w-md mb-6">
            An unexpected error occurred while processing plant intelligence telemetry. 
            Details: <span className="font-mono text-xs block mt-2 bg-muted p-2 rounded text-left overflow-x-auto select-all max-h-24">{this.state.error?.message || "Unknown error"}</span>
          </p>
          <button
            onClick={this.handleReset}
            className="flex items-center gap-2 bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-lg px-4 py-2 text-sm font-medium transition-all shadow-sm"
          >
            <RefreshCw className="h-4 w-4" />
            Reload Workspace
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
