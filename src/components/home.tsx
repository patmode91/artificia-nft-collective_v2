import React, { useState, Suspense } from "react";
import Sidebar from "./dashboard/Sidebar";
import ContentPanel from "./dashboard/ContentPanel";
import ErrorBoundary from "./ErrorBoundary";
import { Card } from "./ui/card";
import { Loader2 } from "lucide-react";

interface HomeProps {
  initialSection?: string;
}

const LoadingFallback = () => (
  <Card className="flex h-full w-full items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
  </Card>
);

const Home = ({ initialSection = "content-generation" }: HomeProps) => {
  const [activeSection, setActiveSection] = useState(initialSection);

  return (
    <div className="flex h-screen w-full bg-background">
      <ErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
          <Sidebar
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />
        </Suspense>
      </ErrorBoundary>

      <ErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
          <ContentPanel activePanel={activeSection as any} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default Home;
