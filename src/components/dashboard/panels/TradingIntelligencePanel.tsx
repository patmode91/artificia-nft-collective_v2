import React from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  BarChart,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface TradingIntelligencePanelProps {
  marketAnalysis?: {
    trends: Array<{ name: string; value: number; change: number }>;
    predictions: Array<{
      asset: string;
      prediction: string;
      confidence: number;
    }>;
    patterns: Array<{ type: string; asset: string; strength: number }>;
    recommendations: Array<{ action: string; asset: string; reason: string }>;
  };
}

const defaultMarketAnalysis = {
  trends: [
    { name: "BTC/USD", value: 45000, change: 2.5 },
    { name: "ETH/USD", value: 3200, change: 1.8 },
    { name: "SOL/USD", value: 120, change: -0.5 },
  ],
  predictions: [
    { asset: "BTC", prediction: "Bullish", confidence: 85 },
    { asset: "ETH", prediction: "Neutral", confidence: 60 },
    { asset: "SOL", prediction: "Bearish", confidence: 70 },
  ],
  patterns: [
    { type: "Double Bottom", asset: "BTC", strength: 80 },
    { type: "Bull Flag", asset: "ETH", strength: 65 },
    { type: "Head & Shoulders", asset: "SOL", strength: 75 },
  ],
  recommendations: [
    { action: "Buy", asset: "BTC", reason: "Strong upward momentum" },
    { action: "Hold", asset: "ETH", reason: "Consolidation phase" },
    { action: "Sell", asset: "SOL", reason: "Bearish pattern forming" },
  ],
};

const TradingIntelligencePanel: React.FC<TradingIntelligencePanelProps> = ({
  marketAnalysis = defaultMarketAnalysis,
}) => {
  return (
    <div className="p-6 bg-background w-full h-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Trading Intelligence</h1>
        <Button variant="outline" className="gap-2">
          <TrendingUp className="h-4 w-4" />
          Refresh Analysis
        </Button>
      </div>

      <Tabs defaultValue="market-analysis" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="market-analysis" className="gap-2">
            <LineChart className="h-4 w-4" />
            Market Analysis
          </TabsTrigger>
          <TabsTrigger value="predictions" className="gap-2">
            <BarChart className="h-4 w-4" />
            Price Predictions
          </TabsTrigger>
          <TabsTrigger value="patterns" className="gap-2">
            <AlertTriangle className="h-4 w-4" />
            Pattern Signals
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="gap-2">
            <ArrowUpRight className="h-4 w-4" />
            Trade Recommendations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="market-analysis">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {marketAnalysis.trends.map((trend, index) => (
              <Card key={index} className="p-4">
                <h3 className="font-semibold">{trend.name}</h3>
                <div className="mt-2 text-2xl">
                  ${trend.value.toLocaleString()}
                </div>
                <div
                  className={`mt-1 ${trend.change >= 0 ? "text-green-500" : "text-red-500"}`}
                >
                  {trend.change}%
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="predictions">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {marketAnalysis.predictions.map((prediction, index) => (
              <Card key={index} className="p-4">
                <h3 className="font-semibold">{prediction.asset}</h3>
                <div className="mt-2">{prediction.prediction}</div>
                <div className="mt-1 text-muted-foreground">
                  Confidence: {prediction.confidence}%
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="patterns">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {marketAnalysis.patterns.map((pattern, index) => (
              <Card key={index} className="p-4">
                <h3 className="font-semibold">{pattern.asset}</h3>
                <div className="mt-2">{pattern.type}</div>
                <div className="mt-1 text-muted-foreground">
                  Strength: {pattern.strength}%
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recommendations">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {marketAnalysis.recommendations.map((recommendation, index) => (
              <Card key={index} className="p-4">
                <h3 className="font-semibold">{recommendation.asset}</h3>
                <div
                  className={`mt-2 font-medium ${recommendation.action === "Buy" ? "text-green-500" : recommendation.action === "Sell" ? "text-red-500" : "text-yellow-500"}`}
                >
                  {recommendation.action}
                </div>
                <div className="mt-1 text-muted-foreground">
                  {recommendation.reason}
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TradingIntelligencePanel;
