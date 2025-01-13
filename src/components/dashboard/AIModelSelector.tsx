import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Wand2,
  Image as ImageIcon,
  Settings2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { AI_MODELS, VALIDATION, STYLE_PRESETS } from "@/lib/models";
import { useAI } from "@/lib/hooks/useAI";
import { StyleSystem } from "./StyleSystem";

interface AIModelSelectorProps {
  onGenerate?: (settings: {
    model: string;
    prompt: string;
    negativePrompt: string;
    guidance: number;
    style: string;
    batchSize: number;
    variations: number;
    seed?: number;
  }) => void;
}

const AIModelSelector = ({ onGenerate = () => {} }: AIModelSelectorProps) => {
  const { generate, isLoading, error, progress } = useAI();
  const [settings, setSettings] = useState({
    model: AI_MODELS[0].id,
    prompt: "",
    negativePrompt: "",
    guidance: VALIDATION.guidance.default,
    selectedStyles: [] as string[],
    styleStrength: VALIDATION.styleStrength.default,
    batchSize: VALIDATION.batchSize.default,
    variations: VALIDATION.variations.default,
    seed: Math.floor(Math.random() * 1000000),
  });

  useEffect(() => {
    const selectedModel = AI_MODELS.find((m) => m.id === settings.model);
    const selectedStyle = STYLE_PRESETS.find((s) => s.id === settings.style);
    if (selectedModel && selectedStyle) {
      setSettings((prev) => ({
        ...prev,
        prompt: `${prev.prompt}\n${selectedStyle.prompt}`.trim(),
        negativePrompt: `${prev.negativePrompt}\n${selectedStyle.negativePrompt}`.trim(),
      }));
    }
  }, [settings.model, settings.style]);

  // Get the selected model's configuration
  const selectedModel = AI_MODELS.find((m) => m.id === settings.model);

  // Handle style selection
  const handleStyleSelect = (styleId: string) => {
    setSettings((prev) => {
      const currentStyles = prev.selectedStyles;
      if (currentStyles.includes(styleId)) {
        return {
          ...prev,
          selectedStyles: currentStyles.filter((id) => id !== styleId),
        };
      }
      if (currentStyles.length >= 2) {
        return {
          ...prev,
          selectedStyles: [currentStyles[1], styleId],
        };
      }
      return {
        ...prev,
        selectedStyles: [...currentStyles, styleId],
      });
    });
  };

  // Handle generation
  const handleGenerate = async () => {
    try {
      const results = await generate({
        ...settings,
        stylePreset: settings.selectedStyles[0],
        styleStrength: settings.styleStrength,
      });
      onGenerate(settings);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Card className="p-6">
      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="basic" className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            Basic Settings
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            <Settings2 className="h-4 w-4" />
            Advanced
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <div className="space-y-2">
            <Label>AI Model</Label>
            <Tooltip>
              <TooltipTrigger>
                <Select
                  value={settings.model}
                  onValueChange={(value) =>
                    setSettings({ ...settings, model: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    {AI_MODELS.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        {model.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TooltipTrigger>
              <TooltipContent>
                Select an AI model for generating art.
              </TooltipContent>
            </Tooltip>
          </div>

          <StyleSystem
            selectedStyles={settings.selectedStyles}
            styleStrength={settings.styleStrength}
            onStyleSelect={handleStyleSelect}
            onStyleStrengthChange={(value) =>
              setSettings({ ...settings, styleStrength: value })
            }
            onStyleClear={() =>
              setSettings({ ...settings, selectedStyles: [] })
            }
          />

          <div className="space-y-2">
            <Label>Prompt</Label>
            <Tooltip>
              <TooltipTrigger>
                <Textarea
                  placeholder="Enter your prompt here..."
                  value={settings.prompt}
                  onChange={(e) =>
                    setSettings({ ...settings, prompt: e.target.value })
                  }
                  maxLength={
                    selectedModel?.maxPromptLength || VALIDATION.prompt.maxLength
                  }
                />
              </TooltipTrigger>
              <TooltipContent>
                Enter a prompt to generate AI art.
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="space-y-2">
            <Label>Negative Prompt</Label>
            <Tooltip>
              <TooltipTrigger>
                <Textarea
                  placeholder="Enter negative prompt here..."
                  value={settings.negativePrompt}
                  onChange={(e) =>
                    setSettings({ ...settings, negativePrompt: e.target.value })
                  }
                  maxLength={
                    selectedModel?.maxPromptLength || VALIDATION.prompt.maxLength
                  }
                />
              </TooltipTrigger>
              <TooltipContent>
                Enter a negative prompt to exclude certain elements.
              </TooltipContent>
            </Tooltip>
          </div>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          {selectedModel?.supportedFeatures.includes("guidance_scale") && (
            <div className="space-y-2">
              <Label>Guidance Scale: {settings.guidance}</Label>
              <Tooltip>
                <TooltipTrigger>
                  <Slider
                    min={VALIDATION.guidance.min}
                    max={VALIDATION.guidance.max}
                    step={0.1}
                    value={[settings.guidance]}
                    onValueChange={([value]) =>
                      setSettings({ ...settings, guidance: value })
                    }
                  />
                </TooltipTrigger>
                <TooltipContent>
                  Adjust the guidance scale for the AI model.
                </TooltipContent>
              </Tooltip>
            </div>
          )}

          <div className="space-y-2">
            <Label>Batch Size: {settings.batchSize}</Label>
            <Tooltip>
              <TooltipTrigger>
                <Slider
                  min={VALIDATION.batchSize.min}
                  max={Math.min(
                    selectedModel?.maxBatchSize || VALIDATION.batchSize.max,
                    VALIDATION.batchSize.max,
                  )}
                  step={1}
                  value={[settings.batchSize]}
                  onValueChange={([value]) =>
                    setSettings({ ...settings, batchSize: value })
                  }
                />
              </TooltipTrigger>
              <TooltipContent>
                Set the number of images to generate in a batch.
              </TooltipContent>
            </Tooltip>
          </div>

          {selectedModel?.supportedFeatures.includes("seed") && (
            <div className="space-y-2">
              <Label>Seed</Label>
              <Tooltip>
                <TooltipTrigger>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      value={settings.seed}
                      onChange={(e) =>
                        setSettings({ ...settings, seed: parseInt(e.target.value) })
                      }
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      onClick={() =>
                        setSettings({
                          ...settings,
                          seed: Math.floor(Math.random() * 1000000),
                        })
                      }
                    >
                      Random
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  Set a seed for reproducible results.
                </TooltipContent>
              </Tooltip>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {error && (
        <Alert variant="destructive" className="mt-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}

      <div className="mt-6">
        <Button
          className="w-full"
          onClick={handleGenerate}
          disabled={
            isLoading ||
            !settings.prompt ||
            settings.prompt.length < VALIDATION.prompt.minLength
          }
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating... {Math.round(progress)}%
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4 mr-2" />
              Generate {settings.batchSize} Images
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};

export default AIModelSelector;
