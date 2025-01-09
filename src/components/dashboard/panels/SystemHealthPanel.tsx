import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Activity, Server, Database, Wifi } from "lucide-react";
import { analyticsWebSocket } from "@/lib/services/analytics-websocket";
import { cacheService } from "@/lib/services/cache-service";

export function SystemHealthPanel() {
  const [healthMetrics, setHealthMetrics] = useState<any>(null);
  const [cacheMetrics, setCacheMetrics] = useState<any>(null);

  useEffect(() => {
    const updateMetrics = () => {
      setHealthMetrics(analyticsWebSocket.getHealthMetrics());
      setCacheMetrics(cacheService.getMetrics());
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "bg-green-500";
      case "degraded":
        return "bg-yellow-500";
      case "disconnected":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-6">System Health</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Wifi className="h-5 w-5" />
              <h3 className="font-medium">WebSocket</h3>
            </div>
            <Badge
              variant={
                healthMetrics?.status === "healthy" ? "default" : "destructive"
              }
            >
              {healthMetrics?.status}
            </Badge>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Latency</span>
              <span>{healthMetrics?.latency.toFixed(2)}ms</span>
            </div>
            <Progress
              value={Math.min(100, 100 - (healthMetrics?.latency || 0) / 100)}
              className="h-2"
            />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Database className="h-5 w-5" />
            <h3 className="font-medium">Cache Performance</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Hit Rate</span>
              <span>
                {cacheMetrics
                  ? (
                      (cacheMetrics.hits /
                        (cacheMetrics.hits + cacheMetrics.misses)) *
                      100
                    ).toFixed(1)
                  : 0}
                %
              </span>
            </div>
            <Progress
              value={
                cacheMetrics
                  ? (cacheMetrics.hits /
                      (cacheMetrics.hits + cacheMetrics.misses)) *
                    100
                  : 0
              }
              className="h-2"
            />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="h-5 w-5" />
            <h3 className="font-medium">Message Rate</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Messages/min</span>
              <span>{healthMetrics?.messageCount || 0}</span>
            </div>
            <div className="text-xs text-muted-foreground">
              Errors: {healthMetrics?.errorCount || 0}
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Server className="h-5 w-5" />
            <h3 className="font-medium">System Status</h3>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div
                className={`h-2 w-2 rounded-full ${getStatusColor(healthMetrics?.status)}`}
              />
              <span className="text-sm">
                {healthMetrics?.status || "Unknown"}
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              Uptime:{" "}
              {healthMetrics ? Math.floor(healthMetrics.uptime / 1000) : 0}s
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
