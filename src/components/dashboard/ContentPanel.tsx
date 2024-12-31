import React from "react";
import { Card } from "@/components/ui/card";
import ContentGenerationPanel from "./panels/ContentGenerationPanel";
import TradingIntelligencePanel from "./panels/TradingIntelligencePanel";
import MarketMakingPanel from "./panels/MarketMakingPanel";
import PerformancePanel from "./panels/PerformancePanel";
import AgentControlPanel from "./panels/AgentControlPanel";

interface ContentPanelProps {
  activePanel?:
    | "content-generation"
    | "trading"
    | "market-making"
    | "performance"
    | "agent-control";
}

const ContentPanel = ({
  activePanel = "content-generation",
}: ContentPanelProps) => {
  const renderPanel = () => {
    switch (activePanel) {
      case "content-generation":
        return <ContentGenerationPanel />;
      case "trading":
        return <TradingIntelligencePanel />;
      case "market-making":
        return <MarketMakingPanel />;
      case "performance":
        return <PerformancePanel />;
      case "agent-control":
        return <AgentControlPanel />;
      default:
        return <ContentGenerationPanel />;
    }
  };

  return (
    <Card className="flex-1 bg-background overflow-auto h-full w-full border-0 rounded-none">
      {renderPanel()}
    </Card>
  );
};

export default ContentPanel;
