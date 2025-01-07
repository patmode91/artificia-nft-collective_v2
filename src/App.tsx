import { Suspense } from "react";
import { Routes, Route, Navigate, useRoutes } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import Home from "./components/home";
import ErrorBoundary from "./components/ErrorBoundary";
import { AuthProvider } from "./lib/auth";
import { Web3Provider } from "./lib/web3/Web3Provider";
import { queryClient } from "./lib/query";
import routes from "tempo-routes";

const LoadingFallback = () => (
  <Card className="flex h-screen w-full items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
  </Card>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Web3Provider>
        <AuthProvider>
          <ErrorBoundary>
            <Suspense fallback={<LoadingFallback />}>
              {import.meta.env.VITE_TEMPO && useRoutes(routes)}
              <Routes>
                <Route
                  path="/"
                  element={
                    <Navigate to="/dashboard/content-generation" replace />
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <Navigate to="/dashboard/content-generation" replace />
                  }
                />
                <Route path="/dashboard/:section" element={<Home />} />
                {import.meta.env.VITE_TEMPO && <Route path="/tempobook/*" />}
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </AuthProvider>
      </Web3Provider>
    </QueryClientProvider>
  );
}

export default App;
