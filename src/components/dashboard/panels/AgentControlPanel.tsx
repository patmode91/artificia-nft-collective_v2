import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Brush, LineChart, Store } from "lucide-react";

interface AgentControlPanelProps {
  agents?: {
    id: string;
    name: string;
    type: "art" | "trading" | "market" | "other";
    status: boolean;
    parameters: Record<string, number>;
  }[];
}

const defaultAgents = [
  {
    id: "1",
    name: "Art Generator Bot",
    type: "art",
    status: true,
    parameters: { creativity: 0.8, quality: 0.7 },
  },
  {
    id: "2",
    name: "Trading Bot Alpha",
    type: "trading",
    status: false,
    parameters: { riskLevel: 0.5, tradeFrequency: 0.6 },
  },
  {
    id: "3",
    name: "Market Maker Bot",
    type: "market",
    status: true,
    parameters: { spread: 0.3, depth: 0.8 },
  },
];

const AgentControlPanel = ({
  agents = defaultAgents,
}: AgentControlPanelProps) => {
  const [agentStates, setAgentStates] = useState(agents);

  useEffect(() => {
    setAgentStates(agents);
  }, [agents]);

  const handleSwitchChange = (id: string, status: boolean) => {
    setAgentStates((prev) =>
      prev.map((agent) =>
        agent.id === id ? { ...agent, status } : agent
      )
    );
  };

  return (
    <div className="p-6 bg-background w-full h-full">
      <h1 className="text-2xl font-bold mb-6">Agent Control Center</h1>

      <Tabs defaultValue="art" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="art" className="flex items-center gap-2">
            <Brush className="w-4 h-4" />
            Art Generation
          </TabsTrigger>
          <TabsTrigger value="trading" className="flex items-center gap-2">
            <LineChart className="w-4 h-4" />
            Trading
          </TabsTrigger>
          <TabsTrigger value="market" className="flex items-center gap-2">
            <Store className="w-4 h-4" />
            Market Making
          </TabsTrigger>
        </TabsList>

        {["art", "trading", "market"].map((type) => (
          <TabsContent key={type} value={type}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {agentStates
                .filter((agent) => agent.type === type)
                .map((agent) => (
                  <Card key={agent.id} className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Bot className="w-5 h-5" />
                        <h3 className="font-medium">{agent.name}</h3>
                      </div>
                      <Switch
                        checked={agent.status}
                        onCheckedChange={(status) => handleSwitchChange(agent.id, status)}
                      />
                    </div>

                    <div className="space-y-4">
                      {Object.entries(agent.parameters).map(
                        ([param, value]) => (
                          <div key={param} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <label className="text-sm capitalize">
                                {param}
                              </label>
                              <Input
                                type="number"
                                value={value}
                                onChange={() => {}}
                                className="w-20"
                                min={0}
                                max={1}
                                step={0.1}
                              />
                            </div>
                            <Slider
                              value={[value]}
                              max={1}
                              step={0.1}
                              className="w-full"
                            />
                          </div>
                        ),
                      )}
                    </div>

                    <div className="mt-4 flex justify-end space-x-2">
                      <Button variant="outline" size="sm">
                        Reset
                      </Button>
                      <Button size="sm">Apply</Button>
                    </div>
                  </Card>
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default AgentControlPanel;
