import React, { Suspense, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import ContentGenerationPanel from "./panels/ContentGenerationPanel";
import TradingIntelligencePanel from "./panels/TradingIntelligencePanel";
import MarketMakingPanel from "./panels/MarketMakingPanel";
import PerformancePanel from "./panels/PerformancePanel";
import AgentControlPanel from "./panels/AgentControlPanel";
import { Loader2 } from "lucide-react";
import ErrorBoundary from "../ErrorBoundary";

interface ContentPanelProps {
  activePanel?:
    | "content-generation"
    | "trading"
    | "market-making"
    | "performance"
    | "agent-control";
}

// Loading fallback component to show a spinner while content is loading
const LoadingFallback = () => (
  <Card className="flex h-full w-full items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
  </Card>
);

const ContentPanel = ({ activePanel: propActivePanel }: ContentPanelProps) => {
  const { section } = useParams();
  const [activePanel, setActivePanel] = useState(
    propActivePanel || section || "content-generation"
  );

  // Update active panel when propActivePanel or section changes
  useEffect(() => {
    setActivePanel(propActivePanel || section || "content-generation");
  }, [propActivePanel, section]);

  // Render the appropriate panel based on the activePanel state
  const renderPanel = () => {
    const Panel = (() => {
      switch (activePanel) {
        case "content-generation":
          return ContentGenerationPanel;
        case "trading":
          return TradingIntelligencePanel;
        case "market-making":
          return MarketMakingPanel;
        case "performance":
          return PerformancePanel;
        case "agent-control":
          return AgentControlPanel;
        default:
          return ContentGenerationPanel;
      }
    })();

    return (
      <ErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
          <Panel />
        </Suspense>
      </ErrorBoundary>
    );
  };

  return (
    <Card className="flex-1 bg-background overflow-auto h-full w-full border-0 rounded-none">
      {renderPanel()}
    </Card>
  );
};

export default ContentPanel;
