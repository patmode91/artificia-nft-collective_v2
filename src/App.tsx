import { Suspense, useState, useEffect, useCallback } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import Home from "./components/home";
import ErrorBoundary from "./components/ErrorBoundary";
import { AuthProvider, useAuth } from "./lib/auth";
import { Web3Provider } from "./lib/web3/Web3Provider";
import { AuthModal } from "./components/auth/AuthModal";
import { queryClient } from "./lib/query";

const LoadingFallback = () => (
  <Card className="flex h-screen w-full items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
  </Card>
);

function AppContent() {
  const { user, loading } = useAuth();
  const [showAuth, setShowAuth] = useState(!user);

  useEffect(() => {
    if (!user) {
      setShowAuth(true);
    } else {
      setShowAuth(false);
    }
  }, [user]);

  const handleAuthClose = useCallback(() => {
    setShowAuth(false);
  }, []);

  if (loading) return <LoadingFallback />;

  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingFallback />}>
        <>
          <Routes>
            <Route
              path="/"
              element={<Navigate to="/dashboard/content-generation" replace />}
            />
            <Route
              path="/dashboard"
              element={<Navigate to="/dashboard/content-generation" replace />}
            />
            <Route path="/dashboard/:section" element={<Home />} />
          </Routes>
          {showAuth && <AuthModal isOpen={showAuth} onClose={handleAuthClose} />}
        </>
      </Suspense>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Web3Provider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </Web3Provider>
      {process.env.NODE_ENV === "development" && <ReactQueryDevtools />}
    </QueryClientProvider>
  );
}

export default App;
