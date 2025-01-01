import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import Home from "./components/home";
import ErrorBoundary from "./components/ErrorBoundary";
import routes from "tempo-routes";

const LoadingFallback = () => (
  <Card className="flex h-screen w-full items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
  </Card>
);

function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingFallback />}>
        <>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
          {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
        </>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
