import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Upload,
  Wand2,
  Code2,
  Tags,
  Sparkles,
  Loader2,
  CheckCircle2,
} from "lucide-react";

interface NFTCreationWizardProps {
  onComplete?: (data: {
    artwork: File | null;
    metadata: {
      name: string;
      description: string;
      attributes: Array<{ trait_type: string; value: string }>;
    };
    contractSettings: {
      name: string;
      symbol: string;
      royalties: number;
    };
  }) => void;
}

export function NFTCreationWizard({ onComplete }: NFTCreationWizardProps) {
  const [activeStep, setActiveStep] = useState("artwork");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [artwork, setArtwork] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [metadata, setMetadata] = useState({
    name: "",
    description: "",
    attributes: [] as Array<{ trait_type: string; value: string }>,
  });
  const [contractSettings, setContractSettings] = useState({
    name: "",
    symbol: "",
    royalties: 10,
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setArtwork(file);
      setPreviewUrl(URL.createObjectURL(file));
      simulateAIAnalysis();
    }
  };

  const simulateAIAnalysis = () => {
    setIsProcessing(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          // Simulate AI suggestions
          setMetadata({
            name: "AI Generated NFT",
            description: "A unique piece of digital art enhanced by AI",
            attributes: [
              { trait_type: "Style", value: "Abstract" },
              { trait_type: "Colors", value: "Vibrant" },
              { trait_type: "Mood", value: "Energetic" },
            ],
          });
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const handleComplete = () => {
    onComplete?.({ artwork, metadata, contractSettings });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto p-6 bg-background">
      <Tabs value={activeStep} onValueChange={setActiveStep}>
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="artwork" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Artwork
          </TabsTrigger>
          <TabsTrigger value="metadata" className="flex items-center gap-2">
            <Tags className="h-4 w-4" />
            Metadata
          </TabsTrigger>
          <TabsTrigger value="contract" className="flex items-center gap-2">
            <Code2 className="h-4 w-4" />
            Smart Contract
          </TabsTrigger>
        </TabsList>

        <TabsContent value="artwork" className="space-y-4">
          <div className="grid gap-4">
            <Label>Upload Artwork</Label>
            <div className="grid gap-4">
              {!artwork ? (
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <Input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="artwork-upload"
                    onChange={handleFileUpload}
                  />
                  <Label
                    htmlFor="artwork-upload"
                    className="flex flex-col items-center gap-2 cursor-pointer"
                  >
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      Click to upload or drag and drop
                    </span>
                  </Label>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  {isProcessing && (
                    <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center gap-4">
                      <Loader2 className="h-8 w-8 animate-spin" />
                      <div className="w-48">
                        <Progress value={progress} />
                      </div>
                      <span className="text-sm">Analyzing artwork...</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <Button
            onClick={() => setActiveStep("metadata")}
            className="w-full mt-4"
            disabled={!artwork}
          >
            <Wand2 className="mr-2 h-4 w-4" />
            Generate Metadata
          </Button>
        </TabsContent>

        <TabsContent value="metadata" className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={metadata.name}
                onChange={(e) =>
                  setMetadata({ ...metadata, name: e.target.value })
                }
                placeholder="Enter NFT name"
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={metadata.description}
                onChange={(e) =>
                  setMetadata({ ...metadata, description: e.target.value })
                }
                placeholder="Enter NFT description"
              />
            </div>

            <div className="space-y-2">
              <Label>Attributes</Label>
              {metadata.attributes.map((attr, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={attr.trait_type}
                    onChange={(e) => {
                      const newAttrs = [...metadata.attributes];
                      newAttrs[index].trait_type = e.target.value;
                      setMetadata({ ...metadata, attributes: newAttrs });
                    }}
                    placeholder="Trait type"
                  />
                  <Input
                    value={attr.value}
                    onChange={(e) => {
                      const newAttrs = [...metadata.attributes];
                      newAttrs[index].value = e.target.value;
                      setMetadata({ ...metadata, attributes: newAttrs });
                    }}
                    placeholder="Value"
                  />
                </div>
              ))}
            </div>
          </div>

          <Button
            onClick={() => setActiveStep("contract")}
            className="w-full mt-4"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Configure Smart Contract
          </Button>
        </TabsContent>

        <TabsContent value="contract" className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label>Contract Name</Label>
              <Input
                value={contractSettings.name}
                onChange={(e) =>
                  setContractSettings({
                    ...contractSettings,
                    name: e.target.value,
                  })
                }
                placeholder="Enter contract name"
              />
            </div>

            <div className="space-y-2">
              <Label>Symbol</Label>
              <Input
                value={contractSettings.symbol}
                onChange={(e) =>
                  setContractSettings({
                    ...contractSettings,
                    symbol: e.target.value,
                  })
                }
                placeholder="Enter token symbol"
              />
            </div>

            <div className="space-y-2">
              <Label>Royalties (%)</Label>
              <Input
                type="number"
                value={contractSettings.royalties}
                onChange={(e) =>
                  setContractSettings({
                    ...contractSettings,
                    royalties: Number(e.target.value),
                  })
                }
                min="0"
                max="100"
              />
            </div>
          </div>

          <Button onClick={handleComplete} className="w-full mt-4">
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Complete NFT Creation
          </Button>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
