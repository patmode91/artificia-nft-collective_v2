import React from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { STYLE_PRESETS, VALIDATION } from "@/lib/models";

interface StyleSystemProps {
  selectedStyles: string[];
  styleStrength: number;
  onStyleSelect: (styleId: string) => void;
  onStyleStrengthChange: (value: number) => void;
  onStyleClear: () => void;
}

export function StyleSystem({
  selectedStyles,
  styleStrength,
  onStyleSelect,
  onStyleStrengthChange,
  onStyleClear,
}: StyleSystemProps) {
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
              <Label>Style Mix Ratio</Label>
              <Slider
                defaultValue={[0.5]}
                min={0}
                max={1}
                step={0.1}
                className="w-full"
              />
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={onStyleClear}
          >
            Clear Styles
          </Button>
        </div>
      )}
    </Card>
  );
}
