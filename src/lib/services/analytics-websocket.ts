import { supabase } from "../supabase";
import { styleAnalytics } from "./style-analytics";
import { cacheService } from "./cache-service";

type AnalyticsUpdate = {
  type: "generation" | "trend" | "performance";
  data: any;
  timestamp: number;
};

class AnalyticsWebSocket {
  private subscribers: Set<(update: AnalyticsUpdate) => void> = new Set();
  private healthMetrics = {
    lastUpdate: Date.now(),
    messageCount: 0,
    errorCount: 0,
    latency: 0,
  };

  constructor() {
    this.initializeRealtimeSubscription();
  }

  private async initializeRealtimeSubscription() {
    const channel = supabase
      .channel("analytics_updates")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "style_analytics" },
        async (payload) => {
          const start = performance.now();
          try {
            // Update local analytics
            await styleAnalytics.trackGeneration(payload.new);

            // Invalidate relevant caches
            cacheService.delete(`style_analytics_${payload.new.style_id}`);
            if (payload.new.combined_with) {
              cacheService.delete(
                `style_analytics_${payload.new.combined_with}`,
              );
            }

            // Notify subscribers
            this.notifySubscribers({
              type: "generation",
              data: payload.new,
              timestamp: Date.now(),
            });

            // Update health metrics
            this.healthMetrics.messageCount++;
            this.healthMetrics.latency = performance.now() - start;
            this.healthMetrics.lastUpdate = Date.now();
          } catch (error) {
            console.error("Error processing analytics update:", error);
            this.healthMetrics.errorCount++;
          }
        },
      )
      .subscribe();

    return channel;
  }

  subscribe(callback: (update: AnalyticsUpdate) => void) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  private notifySubscribers(update: AnalyticsUpdate) {
    this.subscribers.forEach((callback) => callback(update));
  }

  getHealthMetrics() {
    return {
      ...this.healthMetrics,
      uptime: Date.now() - this.healthMetrics.lastUpdate,
      status: this.getConnectionStatus(),
    };
  }

  private getConnectionStatus() {
    const timeSinceLastUpdate = Date.now() - this.healthMetrics.lastUpdate;
    if (timeSinceLastUpdate > 300000) return "disconnected"; // 5 minutes
    if (timeSinceLastUpdate > 60000) return "degraded"; // 1 minute
    return "healthy";
  }
}

export const analyticsWebSocket = new AnalyticsWebSocket();
