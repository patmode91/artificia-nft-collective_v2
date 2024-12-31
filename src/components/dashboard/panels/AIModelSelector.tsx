import React from "react";
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
import { Wand2, Image as ImageIcon, Settings2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

const styles = [
  { label: "Anime", value: "anime" },
  { label: "Realistic", value: "realistic" },
  { label: "Abstract", value: "abstract" },
  { label: "Digital Art", value: "digital-art" },
];

const models = [
  { label: "Stable Diffusion", value: "stable-diffusion" },
  { label: "DALL-E", value: "dall-e" },
  { label: "Midjourney", value: "midjourney" },
];

const AIModelSelector = ({ onGenerate = () => {} }: AIModelSelectorProps) => {
  const [settings, setSettings] = React.useState({
    model: "stable-diffusion",
    prompt: "",
    negativePrompt: "",
    guidance: 7.5,
    style: "realistic",
    batchSize: 4,
    variations: 2,
    seed: Math.floor(Math.random() * 1000000),
  });

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
                {models.map((model) => (
                  <SelectItem key={model.value} value={model.value}>
                    {model.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Style Preset</Label>
            <Select
              value={settings.style}
              onValueChange={(value) =>
                setSettings({ ...settings, style: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select style" />
              </SelectTrigger>
              <SelectContent>
                {styles.map((style) => (
                  <SelectItem key={style.value} value={style.value}>
                    {style.label}
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
            />
          </div>

          <div className="space-y-2">
            <Label>Negative Prompt</Label>
            <Textarea
              placeholder="Enter negative prompt here..."
              value={settings.negativePrompt}
              onChange={(e) =>
                setSettings({ ...settings, negativePrompt: e.target.value })
              }
            />
          </div>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <div className="space-y-2">
            <Label>Guidance Scale: {settings.guidance}</Label>
            <Slider
              min={1}
              max={20}
              step={0.1}
              value={[settings.guidance]}
              onValueChange={([value]) =>
                setSettings({ ...settings, guidance: value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Batch Size: {settings.batchSize}</Label>
            <Slider
              min={1}
              max={8}
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
              min={1}
              max={4}
              step={1}
              value={[settings.variations]}
              onValueChange={([value]) =>
                setSettings({ ...settings, variations: value })
              }
            />
          </div>

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
        </TabsContent>
      </Tabs>

      <div className="mt-6">
        <Button className="w-full" onClick={() => onGenerate(settings)}>
          <Wand2 className="w-4 h-4 mr-2" />
          Generate {settings.batchSize} Images
        </Button>
      </div>
    </Card>
  );
};

export default AIModelSelector;
