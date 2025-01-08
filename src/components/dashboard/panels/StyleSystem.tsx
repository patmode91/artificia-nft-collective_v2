import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Loader2, Wand2 } from "lucide-react";
import { STYLE_PRESETS, VALIDATION, combineStyles } from "@/lib/models";
import { StyleResult } from "@/lib/models/types";

interface StyleSystemProps {
  selectedStyles: string[];
  styleStrength: number;
  onStyleSelect: (styleId: string) => void;
  onStyleStrengthChange: (value: number) => void;
  onStyleClear: () => void;
  onPreviewUpdate?: (preview: StyleResult) => void;
}

export function StyleSystem({
  selectedStyles,
  styleStrength,
  onStyleSelect,
  onStyleStrengthChange,
  onStyleClear,
  onPreviewUpdate,
}: StyleSystemProps) {
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);
  const [mixingRatio, setMixingRatio] = useState(0.5);

  // Update preview when styles or parameters change
  useEffect(() => {
    if (!onPreviewUpdate || selectedStyles.length === 0) return;

    const updatePreview = async () => {
      setIsGeneratingPreview(true);
      try {
        const weights =
          selectedStyles.length === 2
            ? [mixingRatio, 1 - mixingRatio]
            : undefined;
        const result = combineStyles(selectedStyles, weights);
        onPreviewUpdate(result);
      } catch (error) {
        console.error("Failed to generate preview:", error);
      } finally {
        setIsGeneratingPreview(false);
      }
    };

    const debounceTimer = setTimeout(updatePreview, 500);
    return () => clearTimeout(debounceTimer);
  }, [selectedStyles, styleStrength, mixingRatio, onPreviewUpdate]);

  return (
    <Card className="p-4 space-y-4">
      <div>
        <Label className="text-base font-semibold">Style Presets</Label>
        <p className="text-sm text-muted-foreground mb-4">
          Select up to 2 styles to mix
        </p>

        <ScrollArea className="h-[200px] pr-4">
          <div className="grid grid-cols-2 gap-4">
            {STYLE_PRESETS.map((style) => (
              <Card
                key={style.id}
                className={`p-3 cursor-pointer transition-all ${selectedStyles.includes(style.id) ? "ring-2 ring-primary" : "hover:bg-accent"}`}
                onClick={() => onStyleSelect(style.id)}
              >
                <div className="aspect-video rounded-md overflow-hidden mb-2">
                  <img
                    src={style.previewUrl}
                    alt={style.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-medium">{style.name}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {style.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      {selectedStyles.length > 0 && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Style Strength: {styleStrength}</Label>
            <Slider
              value={[styleStrength]}
              min={VALIDATION.styleStrength.min}
              max={VALIDATION.styleStrength.max}
              step={VALIDATION.styleStrength.step}
              onValueChange={([value]) => onStyleStrengthChange(value)}
            />
          </div>

          {selectedStyles.length === 2 && (
            <div className="space-y-2">
              <Label>
                Style Mix Ratio: {(mixingRatio * 100).toFixed(0)}% /{" "}
                {((1 - mixingRatio) * 100).toFixed(0)}%
              </Label>
              <Slider
                value={[mixingRatio]}
                min={0}
                max={1}
                step={0.1}
                onValueChange={([value]) => setMixingRatio(value)}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>
                  {STYLE_PRESETS.find((s) => s.id === selectedStyles[0])?.name}
                </span>
                <span>
                  {STYLE_PRESETS.find((s) => s.id === selectedStyles[1])?.name}
                </span>
              </div>
            </div>
          )}

          {isGeneratingPreview && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Updating preview...
              </div>
              <Progress value={100} className="w-full" />
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={onStyleClear}
          >
            <Wand2 className="h-4 w-4 mr-2" />
            Clear Styles
          </Button>
        </div>
      )}
    </Card>
  );
}
