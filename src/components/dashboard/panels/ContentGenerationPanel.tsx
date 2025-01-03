import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ImageIcon, CheckCircle2, Tags, Eye, Loader2 } from "lucide-react";
import AIModelSelector from "./AIModelSelector";
import { GenerationResult } from "@/lib/api-client";

interface ContentGenerationPanelProps {
  artProgress?: number;
  qualityScore?: number;
  generatedImages?: Array<GenerationResult>;
}

const ContentGenerationPanel = ({
  artProgress: initialProgress = 0,
  qualityScore = 87,
  generatedImages: initialImages = [],
}: ContentGenerationPanelProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [artProgress, setArtProgress] = useState(initialProgress);
  const [generatedImages, setGeneratedImages] = useState(initialImages);

  const handleGenerate = async (settings: any) => {
    setIsGenerating(true);
    setArtProgress(0);

    try {
      const results = await generate(settings);
      setGeneratedImages(results);
    } catch (error) {
      console.error("Generation error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-6 bg-background w-full h-full">
      <h1 className="text-2xl font-bold mb-6">Content Generation Panel</h1>

      <Tabs defaultValue="progress" className="w-full">
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
              <Progress value={artProgress} className="w-full" />
              <div className="mt-2 flex items-center justify-between text-sm text-muted-foreground">
                <span>{Math.round(artProgress)}% Complete</span>
                {isGenerating && (
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

        <TabsContent value="metadata" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Metadata Management</h3>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="style">Style</Label>
                <Input id="style" placeholder="Enter art style" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tags">Tags</Label>
                <Input id="tags" placeholder="Enter tags (comma separated)" />
              </div>
              <Button className="w-full">Update Metadata</Button>
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
                {generatedImages.map((image) => (
                  <div key={image.id} className="space-y-2">
                    <img
                      src={image.url}
                      alt={`Generated art ${image.id}`}
                      className="w-full aspect-square object-cover rounded-lg"
                    />
                    <div className="text-sm space-y-1">
                      {Object.entries(image.metadata).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="font-medium capitalize">{key}:</span>
                          <span className="text-muted-foreground">{value}</span>
                        </div>
                      ))}
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
