import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, ImagePlus, Download, Share2 } from "lucide-react";
import { useAI } from "@/lib/hooks/useAI";
import { StyleSystem } from "./StyleSystem";

export function BatchGenerationPanel() {
  const { generate, isLoading, error, progress, results } = useAI();
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [styleStrength, setStyleStrength] = useState(0.7);
  const [batchSize, setBatchSize] = useState(4);
  const [basePrompt, setBasePrompt] = useState("");

  const handleGenerate = async () => {
    if (!basePrompt) return;

    try {
      await generate({
        model: "stable-diffusion-xl",
        prompt: basePrompt,
        guidance: 7.5,
        stylePreset: selectedStyles[0],
        styleStrength,
        batchSize,
      });
    } catch (error) {
      console.error("Batch generation error:", error);
    }
  };

  const handleDownload = async (url: string) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `generated-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      <div className="space-y-6">
        <Card className="p-4">
          <Label>Base Prompt</Label>
          <Input
            value={basePrompt}
            onChange={(e) => setBasePrompt(e.target.value)}
            placeholder="Enter your base prompt..."
            className="mt-2"
          />
        </Card>

        <StyleSystem
          selectedStyles={selectedStyles}
          styleStrength={styleStrength}
          onStyleSelect={(styleId) =>
            setSelectedStyles((prev) =>
              prev.includes(styleId)
                ? prev.filter((id) => id !== styleId)
                : [...prev, styleId],
            )
          }
          onStyleStrengthChange={setStyleStrength}
          onStyleClear={() => setSelectedStyles([])}
        />

        <Card className="p-4">
          <Label>Batch Size: {batchSize}</Label>
          <Input
            type="number"
            value={batchSize}
            onChange={(e) => setBatchSize(Number(e.target.value))}
            min={1}
            max={8}
            className="mt-2"
          />
        </Card>

        <Button
          onClick={handleGenerate}
          disabled={isLoading || !basePrompt}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating... {Math.round(progress)}%
            </>
          ) : (
            <>
              <ImagePlus className="w-4 h-4 mr-2" />
              Generate Batch
            </>
          )}
        </Button>
      </div>

      <Card className="p-4">
        <h3 className="font-semibold mb-4">Generated Images</h3>
        <ScrollArea className="h-[600px]">
          <div className="grid grid-cols-2 gap-4">
            {results.map((result, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="aspect-square relative group">
                  <img
                    src={result.url}
                    alt={`Generated ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-white hover:text-white hover:bg-white/20"
                      onClick={() => handleDownload(result.url)}
                    >
                      <Download className="h-5 w-5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-white hover:text-white hover:bg-white/20"
                      onClick={() =>
                        navigator.share({
                          title: "Generated Image",
                          text: result.prompt,
                          url: result.url,
                        })
                      }
                    >
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
}
