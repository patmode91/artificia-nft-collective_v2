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
import { AI_MODELS, STYLE_PRESETS, VALIDATION } from "@/lib/models";
import { useAI } from "@/lib/hooks/useAI";

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
    style: STYLE_PRESETS[0].id,
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
  const selectedStyle = STYLE_PRESETS.find((s) => s.id === settings.style);

  // Apply style preset
  const handleStyleChange = (styleId: string) => {
    const style = STYLE_PRESETS.find((s) => s.id === styleId);
    if (style) {
      setSettings((prev) => ({
        ...prev,
        style: styleId,
        prompt: `${prev.prompt}\n${style.prompt}`.trim(),
        negativePrompt:
          `${prev.negativePrompt}\n${style.negativePrompt}`.trim(),
      }));
    }
  };

  // Handle generation
  const handleGenerate = async () => {
    try {
      const results = await generate(settings);
      onGenerate(settings);
    } catch (err) {
      // Error is handled by the useAI hook and displayed below
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
            {selectedModel && (
              <p className="text-sm text-muted-foreground">
                Max batch size: {selectedModel.maxBatchSize}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Style Preset</Label>
            <Select value={settings.style} onValueChange={handleStyleChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select style" />
              </SelectTrigger>
              <SelectContent>
                {STYLE_PRESETS.map((style) => (
                  <SelectItem key={style.id} value={style.id}>
                    {style.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Prompt</Label>
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
            <p className="text-sm text-muted-foreground">
              {settings.prompt.length}/
              {selectedModel?.maxPromptLength || VALIDATION.prompt.maxLength}{" "}
              characters
            </p>
          </div>

          <div className="space-y-2">
            <Label>Negative Prompt</Label>
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
          </div>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          {selectedModel?.supportedFeatures.includes("guidance_scale") && (
            <div className="space-y-2">
              <Label>Guidance Scale: {settings.guidance}</Label>
              <Slider
                min={VALIDATION.guidance.min}
                max={VALIDATION.guidance.max}
                step={0.1}
                value={[settings.guidance]}
                onValueChange={([value]) =>
                  setSettings({ ...settings, guidance: value })
                }
              />
            </div>
          )}

          <div className="space-y-2">
            <Label>Batch Size: {settings.batchSize}</Label>
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
          </div>

          <div className="space-y-2">
            <Label>Variations per Image: {settings.variations}</Label>
            <Slider
              min={VALIDATION.variations.min}
              max={VALIDATION.variations.max}
              step={1}
              value={[settings.variations]}
              onValueChange={([value]) =>
                setSettings({ ...settings, variations: value })
              }
            />
          </div>

          {selectedModel?.supportedFeatures.includes("seed") && (
            <div className="space-y-2">
              <Label>Seed</Label>
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
