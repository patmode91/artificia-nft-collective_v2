import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ImageIcon,
  CheckCircle2,
  Tags,
  Eye,
  Loader2,
  Download,
  Share2,
} from "lucide-react";
import AIModelSelector from "./AIModelSelector";
<<<<<<< HEAD
import { useAI } from "@/lib/hooks/useAI";
import { GenerationResult } from "@/lib/models";
=======
import { GenerationResult } from "@/lib/api-client";
>>>>>>> 3c8cb07db8e5ced0068231abaca2aceb1497ad95

interface ContentGenerationPanelProps {
  artProgress?: number;
  qualityScore?: number;
<<<<<<< HEAD
=======
  generatedImages?: Array<GenerationResult>;
>>>>>>> 3c8cb07db8e5ced0068231abaca2aceb1497ad95
}

const ContentGenerationPanel = ({
  artProgress: initialProgress = 0,
  qualityScore = 87,
}: ContentGenerationPanelProps) => {
  const { generate, isLoading, error, progress, results } = useAI();
  const [activeTab, setActiveTab] = useState("progress");
  const [generatedImages, setGeneratedImages] = useState<GenerationResult[]>(
    [],
  );

  // Handle the generation process
  const handleGenerate = async (settings: any) => {
    try {
      const newResults = await generate({
        ...settings,
        batchSize: settings.batchSize || 1,
      });

<<<<<<< HEAD
      setGeneratedImages((prev) => [...newResults, ...prev]);
      setActiveTab("preview"); // Switch to preview tab after generation
    } catch (err) {
      console.error("Generation error:", err);
    }
  };

  const handleDownload = async (url: string) => {
    try {
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
    } catch (err) {
      console.error("Download error:", err);
    }
  };

  const handleShare = async (image: GenerationResult) => {
    try {
      await navigator.share({
        title: "Generated Image",
        text: image.prompt,
        url: image.url,
      });
    } catch (err) {
      console.error("Share error:", err);
    }
=======
    try {
      const results = await generate(settings);
      setGeneratedImages(results);
    } catch (error) {
      console.error("Generation error:", error);
    } finally {
      setIsGenerating(false);
    }
>>>>>>> 3c8cb07db8e5ced0068231abaca2aceb1497ad95
  };

  return (
    <div className="p-6 bg-background w-full h-full">
      <h1 className="text-2xl font-bold mb-6">Content Generation Panel</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="progress">
            <ImageIcon className="mr-2 h-4 w-4" />
            AI Art Progress
          </TabsTrigger>
          <TabsTrigger value="quality">
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Quality Metrics
          </TabsTrigger>
          <TabsTrigger value="metadata">
            <Tags className="mr-2 h-4 w-4" />
            Metadata
          </TabsTrigger>
          <TabsTrigger value="preview">
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="progress" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AIModelSelector onGenerate={handleGenerate} />

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                Generation Progress
              </h3>
              <Progress value={progress} className="w-full" />
              <div className="mt-2 flex items-center justify-between text-sm text-muted-foreground">
                <span>{Math.round(progress)}% Complete</span>
                {isLoading && (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating...
                  </div>
                )}
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="quality" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Quality Assessment</h3>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Progress value={qualityScore} className="w-full" />
              </div>
              <span className="text-lg font-medium">{qualityScore}%</span>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              Generated Art Preview
            </h3>
            <ScrollArea className="h-[600px] w-full rounded-md border p-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {generatedImages.map((image, index) => (
                  <div key={`${image.url}-${index}`} className="space-y-2">
                    <div className="relative group">
                      <img
                        src={image.url}
                        alt={`Generated art ${index + 1}`}
                        className="w-full aspect-square object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-white hover:text-white hover:bg-white/20"
                          onClick={() => handleDownload(image.url)}
                        >
                          <Download className="h-5 w-5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-white hover:text-white hover:bg-white/20"
                          onClick={() => handleShare(image)}
                        >
                          <Share2 className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-sm space-y-1">
                      <p className="font-medium line-clamp-1">{image.prompt}</p>
                      <p className="text-muted-foreground text-xs">
                        Model: {image.model} • Seed: {image.seed}
                      </p>
                      {image.stylePreset && (
                        <p className="text-muted-foreground text-xs">
                          Style: {image.stylePreset}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentGenerationPanel;
