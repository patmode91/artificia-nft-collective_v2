import React from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, BarChart, Activity, TrendingUp } from "lucide-react";

interface PerformancePanelProps {
  generationStats?: {
    totalGenerated: number;
    successRate: number;
    averageTime: number;
  };
  profitLoss?: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  marketMakingKPIs?: {
    spreadEfficiency: number;
    orderFillRate: number;
    liquidityScore: number;
  };
  historicalData?: {
    performance: number[];
    dates: string[];
  };
}

const PerformancePanel = ({
  generationStats = {
    totalGenerated: 1250,
    successRate: 92.5,
    averageTime: 3.2,
  },
  profitLoss = {
    daily: 2500,
    weekly: 15000,
    monthly: 45000,
  },
  marketMakingKPIs = {
    spreadEfficiency: 94.2,
    orderFillRate: 87.8,
    liquidityScore: 8.9,
  },
  historicalData = {
    performance: [85, 87, 89, 92, 90, 93, 95],
    dates: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },
}: PerformancePanelProps) => {
  return (
    <div className="w-full h-full bg-background p-6">
      <h1 className="text-3xl font-bold mb-6">Performance Metrics</h1>

      <Tabs defaultValue="generation" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="generation" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Generation Stats
          </TabsTrigger>
          <TabsTrigger value="pnl" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            P&L
          </TabsTrigger>
          <TabsTrigger value="kpis" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            Market Making KPIs
          </TabsTrigger>
          <TabsTrigger value="historical" className="flex items-center gap-2">
            <LineChart className="h-4 w-4" />
            Historical
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generation">
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4">
              <h3 className="text-lg font-medium mb-2">Total Generated</h3>
              <p className="text-3xl font-bold">
                {generationStats.totalGenerated}
              </p>
            </Card>
            <Card className="p-4">
              <h3 className="text-lg font-medium mb-2">Success Rate</h3>
              <p className="text-3xl font-bold">
                {generationStats.successRate}%
              </p>
            </Card>
            <Card className="p-4">
              <h3 className="text-lg font-medium mb-2">Average Time</h3>
              <p className="text-3xl font-bold">
                {generationStats.averageTime}s
              </p>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="pnl">
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4">
              <h3 className="text-lg font-medium mb-2">Daily P&L</h3>
              <p className="text-3xl font-bold text-green-500">
                +${profitLoss.daily}
              </p>
            </Card>
            <Card className="p-4">
              <h3 className="text-lg font-medium mb-2">Weekly P&L</h3>
              <p className="text-3xl font-bold text-green-500">
                +${profitLoss.weekly}
              </p>
            </Card>
            <Card className="p-4">
              <h3 className="text-lg font-medium mb-2">Monthly P&L</h3>
              <p className="text-3xl font-bold text-green-500">
                +${profitLoss.monthly}
              </p>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="kpis">
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4">
              <h3 className="text-lg font-medium mb-2">Spread Efficiency</h3>
              <p className="text-3xl font-bold">
                {marketMakingKPIs.spreadEfficiency}%
              </p>
            </Card>
            <Card className="p-4">
              <h3 className="text-lg font-medium mb-2">Order Fill Rate</h3>
              <p className="text-3xl font-bold">
                {marketMakingKPIs.orderFillRate}%
              </p>
            </Card>
            <Card className="p-4">
              <h3 className="text-lg font-medium mb-2">Liquidity Score</h3>
              <p className="text-3xl font-bold">
                {marketMakingKPIs.liquidityScore}/10
              </p>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="historical">
          <Card className="p-4">
            <h3 className="text-lg font-medium mb-4">
              Weekly Performance Trend
            </h3>
            <div className="h-[400px] flex items-end justify-between">
              {historicalData.performance.map((value, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className="w-16 bg-primary rounded-t"
                    style={{ height: `${value * 3}px` }}
                  />
                  <span className="mt-2 text-sm">
                    {historicalData.dates[index]}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PerformancePanel;
