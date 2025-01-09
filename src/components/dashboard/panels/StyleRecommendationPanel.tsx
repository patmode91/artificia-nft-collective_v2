import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wand2, Sparkles, Zap, Lightbulb } from "lucide-react";
import { styleRecommendation } from "@/lib/services/style-recommendation";
import { STYLE_PRESETS } from "@/lib/models";

export function StyleRecommendationPanel() {
  const [selectedStyle, setSelectedStyle] = useState<string | undefined>();
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [combinations, setCombinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadRecommendations = async () => {
      setLoading(true);
      try {
        const [styleRecs, combos] = await Promise.all([
          styleRecommendation.getRecommendations({
            baseStyle: selectedStyle,
          }),
          selectedStyle
            ? styleRecommendation.getStyleCombinations(selectedStyle)
            : Promise.resolve([]),
        ]);
        setRecommendations(styleRecs);
        setCombinations(combos);
      } catch (error) {
        console.error("Failed to load recommendations:", error);
      } finally {
        setLoading(false);
      }
    };

    loadRecommendations();
  }, [selectedStyle]);

  return (
    <div className="p-6 space-y-6">
      <Tabs defaultValue="recommendations" className="w-full">
        <TabsList>
          <TabsTrigger value="recommendations">
            <Wand2 className="w-4 h-4 mr-2" />
            Style Recommendations
          </TabsTrigger>
          <TabsTrigger value="combinations">
            <Sparkles className="w-4 h-4 mr-2" />
            Style Combinations
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <ScrollArea className="h-[600px]">
            <TabsContent value="recommendations">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendations.map((rec, index) => {
                  const style = STYLE_PRESETS.find((s) => s.id === rec.styleId);
                  if (!style) return null;

                  return (
                    <Card
                      key={rec.styleId}
                      className={`p-4 cursor-pointer transition-all ${selectedStyle === rec.styleId ? "ring-2 ring-primary" : "hover:bg-accent"}`}
                      onClick={() => setSelectedStyle(rec.styleId)}
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
                            {rec.reason}
                          </p>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Confidence</span>
                              <span>{(rec.confidence * 100).toFixed(1)}%</span>
                            </div>
                            <Progress
                              value={rec.confidence * 100}
                              className="h-2"
                            />
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="combinations">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {combinations.map((combo, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-center gap-4">
                      <Lightbulb className="w-8 h-8 text-primary" />
                      <div className="flex-1">
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
                          {combo.reason}
                        </p>
                        <div className="mt-2 space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Confidence</span>
                            <span>{(combo.confidence * 100).toFixed(1)}%</span>
                          </div>
                          <Progress
                            value={combo.confidence * 100}
                            className="h-2"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>
                              Suggested Mix:{" "}
                              {(combo.suggestedRatio * 100).toFixed(0)}%
                            </span>
                            <span>
                              Guidance: {combo.suggestedGuidance.toFixed(1)}
                            </span>
                          </div>
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
