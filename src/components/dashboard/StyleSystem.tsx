import React from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { STYLE_PRESETS } from "@/lib/models";

interface StyleSystemProps {
  selectedStyles: string[];
  styleStrength: number;
  onStyleSelect: (styleId: string) => void;
  onStyleStrengthChange: (value: number) => void;
  onStyleClear: () => void;
}

export const StyleSystem = ({
  selectedStyles,
  styleStrength,
  onStyleSelect,
  onStyleStrengthChange,
  onStyleClear,
}: StyleSystemProps) => {
  return (
    <Card className="p-4 space-y-4">
      <div className="space-y-2">
        <Label>Style Presets</Label>
        <Tooltip>
          <TooltipTrigger>
            <div className="grid grid-cols-2 gap-2">
              {STYLE_PRESETS.map((style) => (
                <Button
                  key={style.id}
                  variant={selectedStyles.includes(style.id) ? "default" : "outline"}
                  onClick={() => onStyleSelect(style.id)}
                >
                  {style.name}
                </Button>
              ))}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            Select a style preset to apply to the generated art.
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="space-y-2">
        <Label>Style Strength: {styleStrength}</Label>
        <Tooltip>
          <TooltipTrigger>
            <Slider
              min={0}
              max={1}
              step={0.1}
              value={[styleStrength]}
              onValueChange={([value]) => onStyleStrengthChange(value)}
            />
          </TooltipTrigger>
          <TooltipContent>
            Adjust the strength of the selected style.
          </TooltipContent>
        </Tooltip>
      </div>

      <Button variant="outline" onClick={onStyleClear} className="w-full">
        Clear Styles
      </Button>
    </Card>
  );
};
