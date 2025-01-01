import { Suspense, useState } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import Home from "./components/home";
import ErrorBoundary from "./components/ErrorBoundary";
import { AuthProvider } from "./lib/auth";
import { Web3Provider } from "./lib/web3/Web3Provider";
import { AuthModal } from "./components/auth/AuthModal";
import { useAuth } from "./lib/auth";
import { queryClient } from "./lib/query";

const LoadingFallback = () => (
  <Card className="flex h-screen w-full items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
  </Card>
);

function AppContent() {
  const { user, loading } = useAuth();
  const [showAuth, setShowAuth] = useState(!user);

  if (loading) return <LoadingFallback />;

  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingFallback />}>
        <>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
          <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
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
