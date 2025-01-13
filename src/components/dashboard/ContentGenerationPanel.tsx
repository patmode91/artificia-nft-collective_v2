import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { useTheme } from "@/lib/hooks/useTheme";
import { useAI } from "@/lib/hooks/useAI";
import { Loader2, Wand2 } from "lucide-react";

const ContentGenerationPanel = () => {
  const { theme, toggleTheme } = useTheme();
  const { generate, isLoading, error, progress } = useAI();
  const [prompt, setPrompt] = useState("");
  const [guidance, setGuidance] = useState(7.5);
  const [batchSize, setBatchSize] = useState(1);

  const handleGenerate = async () => {
    try {
      await generate({ prompt, guidance, batchSize });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Content Generation</h2>
        <Tooltip>
          <TooltipTrigger>
            <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
          </TooltipTrigger>
          <TooltipContent>
            Toggle Dark Mode
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Prompt</Label>
          <Tooltip>
            <TooltipTrigger>
              <Textarea
                placeholder="Enter your prompt here..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </TooltipTrigger>
            <TooltipContent>
              Enter a prompt to generate AI art.
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="space-y-2">
          <Label>Guidance Scale: {guidance}</Label>
          <Tooltip>
            <TooltipTrigger>
              <Slider
                min={1}
                max={20}
                step={0.1}
                value={[guidance]}
                onValueChange={([value]) => setGuidance(value)}
              />
            </TooltipTrigger>
            <TooltipContent>
              Adjust the guidance scale for the AI model.
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="space-y-2">
          <Label>Batch Size: {batchSize}</Label>
          <Tooltip>
            <TooltipTrigger>
              <Input
                type="number"
                value={batchSize}
                onChange={(e) => setBatchSize(Number(e.target.value))}
                min={1}
                max={10}
              />
            </TooltipTrigger>
            <TooltipContent>
              Set the number of images to generate in a batch.
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {error && (
        <div className="text-red-500">
          {error.message}
        </div>
      )}

      <Button
        className="w-full"
        onClick={handleGenerate}
        disabled={isLoading || !prompt}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Generating... {Math.round(progress)}%
          </>
        ) : (
          <>
            <Wand2 className="w-4 h-4 mr-2" />
            Generate
          </>
        )}
      </Button>
    </Card>
  );
};

export default ContentGenerationPanel;
