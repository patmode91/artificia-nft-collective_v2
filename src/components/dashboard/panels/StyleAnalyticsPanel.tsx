import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, TrendingUp, Zap, Users } from "lucide-react";
import { styleAnalytics } from "@/lib/services/style-analytics";
import { STYLE_PRESETS } from "@/lib/models";

export function StyleAnalyticsPanel() {
  const [selectedStyle, setSelectedStyle] = useState<string>(
    STYLE_PRESETS[0].id,
  );
  const [analytics, setAnalytics] = useState<any>(null);
  const [popularCombos, setPopularCombos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      setLoading(true);
      try {
        const [styleData, combosData] = await Promise.all([
          styleAnalytics.getStyleAnalytics(selectedStyle),
          styleAnalytics.getPopularCombinations(5),
        ]);
        setAnalytics(styleData);
        setPopularCombos(combosData);
      } catch (error) {
        console.error("Failed to load analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, [selectedStyle]);

  return (
    <div className="p-6 space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">
            <BarChart className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="performance">
            <Zap className="w-4 h-4 mr-2" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="combinations">
            <Users className="w-4 h-4 mr-2" />
            Popular Combinations
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <ScrollArea className="h-[600px]">
            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {STYLE_PRESETS.map((style) => (
                  <Card
                    key={style.id}
                    className={`p-4 cursor-pointer transition-all ${selectedStyle === style.id ? "ring-2 ring-primary" : "hover:bg-accent"}`}
                    onClick={() => setSelectedStyle(style.id)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-20 h-20 rounded-lg overflow-hidden">
                        <img
                          src={style.previewUrl}
                          alt={style.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{style.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {style.description}
                        </p>
                        {analytics?.usageCount && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Usage</span>
                              <span>{analytics.usageCount} generations</span>
                            </div>
                            <Progress
                              value={analytics.performance.successRate}
                              className="h-2"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="performance">
              {analytics && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="p-4">
                    <h3 className="font-medium mb-2">Success Rate</h3>
                    <div className="text-2xl font-bold">
                      {analytics.performance.successRate.toFixed(1)}%
                    </div>
                    <Progress
                      value={analytics.performance.successRate}
                      className="mt-2"
                    />
                  </Card>

                  <Card className="p-4">
                    <h3 className="font-medium mb-2">
                      Average Generation Time
                    </h3>
                    <div className="text-2xl font-bold">
                      {analytics.performance.generationSpeed.toFixed(1)}s
                    </div>
                  </Card>

                  <Card className="p-4">
                    <h3 className="font-medium mb-2">Quality Score</h3>
                    <div className="text-2xl font-bold">
                      {analytics.averageQualityScore.toFixed(1)}/10
                    </div>
                  </Card>
                </div>
              )}
            </TabsContent>

            <TabsContent value="combinations">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {popularCombos.map((combo, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-center gap-4">
                      <TrendingUp className="w-8 h-8 text-primary" />
                      <div>
                        <h3 className="font-medium">
                          {
                            STYLE_PRESETS.find((s) => s.id === combo.styles[0])
                              ?.name
                          }{" "}
                          +{" "}
                          {
                            STYLE_PRESETS.find((s) => s.id === combo.styles[1])
                              ?.name
                          }
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Used {combo.count} times
                        </p>
                        <div className="mt-2">
                          <Progress
                            value={combo.averageScore * 10}
                            className="h-2"
                          />
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </ScrollArea>
        </div>
      </Tabs>
    </div>
  );
}
