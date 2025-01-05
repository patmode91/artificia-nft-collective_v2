import React from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  // Update state to indicate an error has occurred
  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  // Log error details for debugging
  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  // Reset error state when component updates
  public componentDidUpdate(prevProps: Props, prevState: State) {
    if (prevState.hasError && !this.state.hasError) {
      console.log("Error state has been reset");
    }
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="h-full w-full flex items-center justify-center p-6">
          <Alert variant="destructive" className="max-w-xl">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Something went wrong</AlertTitle>
            <AlertDescription className="mt-2">
              {this.state.error?.message}
            </AlertDescription>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Reload Page
            </Button>
          </Alert>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
