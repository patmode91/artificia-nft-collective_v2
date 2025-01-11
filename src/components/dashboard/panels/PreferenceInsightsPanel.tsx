import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Brain, Sparkles, History, Settings, TrendingUp } from "lucide-react";
import { styleRecommendation } from "@/lib/services/style-recommendation";
import { useAuth } from "@/lib/auth";
import { STYLE_PRESETS } from "@/lib/models";

export function PreferenceInsightsPanel() {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPreferences = async () => {
      if (!user?.id) return;
      setLoading(true);
      try {
        const userPrefs = await styleRecommendation.getUserPreferences(user.id);
        setPreferences(userPrefs);
      } catch (error) {
        console.error("Failed to load preferences:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPreferences();
    const interval = setInterval(loadPreferences, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, [user?.id]);

  const getPreferenceScore = (styleId: string) => {
    return preferences?.stylePreferences?.get(styleId) || 0;
  };

  const getParameterDistribution = (param: string) => {
    if (!preferences?.parameterPreferences?.[param]) return [];

    const values = preferences.parameterPreferences[param];
    const total = values.length;

    // Create distribution buckets
    const buckets = new Map<number, number>();
    values.forEach((value) => {
      const bucket = Math.floor(value * 10) / 10;
      buckets.set(bucket, (buckets.get(bucket) || 0) + 1);
    });

    return Array.from(buckets.entries()).map(([value, count]) => ({
      value,
      percentage: (count / total) * 100,
    }));
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Preference Insights</h2>

      <Tabs defaultValue="styles" className="w-full">
        <TabsList>
          <TabsTrigger value="styles">
            <Brain className="w-4 h-4 mr-2" />
            Style Preferences
          </TabsTrigger>
          <TabsTrigger value="parameters">
            <Settings className="w-4 h-4 mr-2" />
            Parameter Preferences
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="w-4 h-4 mr-2" />
            Learning History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="styles">
          <ScrollArea className="h-[600px]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {STYLE_PRESETS.map((style) => (
                <Card key={style.id} className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 rounded-lg overflow-hidden">
                      <img
                        src={style.previewUrl}
                        alt={style.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{style.name}</h3>
                        <Badge variant="secondary">
                          {(getPreferenceScore(style.id) * 100).toFixed(0)}%
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {style.description}
                      </p>
                      <Progress
                        value={getPreferenceScore(style.id) * 100}
                        className="mt-2"
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="parameters">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-4">
              <h3 className="font-medium mb-4">
                Guidance Strength Distribution
              </h3>
              <div className="space-y-2">
                {getParameterDistribution("guidance").map((bucket) => (
                  <div key={bucket.value} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{bucket.value.toFixed(1)}</span>
                      <span>{bucket.percentage.toFixed(1)}%</span>
                    </div>
                    <Progress value={bucket.percentage} />
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="font-medium mb-4">Style Strength Distribution</h3>
              <div className="space-y-2">
                {getParameterDistribution("styleStrength").map((bucket) => (
                  <div key={bucket.value} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{bucket.value.toFixed(1)}</span>
                      <span>{bucket.percentage.toFixed(1)}%</span>
                    </div>
                    <Progress value={bucket.percentage} />
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card className="p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Learning Progress</h3>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  {preferences?.interactionCount || 0} Interactions
                </Badge>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Style Understanding</span>
                    <span>
                      {(preferences?.styleUnderstandingScore || 0).toFixed(0)}%
                    </span>
                  </div>
                  <Progress value={preferences?.styleUnderstandingScore || 0} />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Parameter Optimization</span>
                    <span>
                      {(preferences?.parameterOptimizationScore || 0).toFixed(
                        0,
                      )}
                      %
                    </span>
                  </div>
                  <Progress
                    value={preferences?.parameterOptimizationScore || 0}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Success Rate</span>
                    <span>{(preferences?.successRate || 0).toFixed(0)}%</span>
                  </div>
                  <Progress value={preferences?.successRate || 0} />
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
