import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  FileJson,
  FileImage,
  ExternalLink,
  Copy,
  CheckCircle,
} from "lucide-react";
import { ipfsService } from "@/lib/services/ipfs-service";

interface MetadataViewerProps {
  metadata: {
    ipfs_image_cid?: string;
    ipfs_metadata_cid?: string;
    [key: string]: any;
  };
  imageUrl?: string;
}

export function MetadataViewer({ metadata, imageUrl }: MetadataViewerProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const openIPFSLink = (cid: string) => {
    window.open(ipfsService.getIPFSUrl(cid), "_blank");
  };

  return (
    <Card className="p-4">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="metadata">Metadata</TabsTrigger>
          <TabsTrigger value="ipfs">IPFS</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              {imageUrl && (
                <Card className="overflow-hidden">
                  <img
                    src={imageUrl}
                    alt="Generated"
                    className="w-full h-auto"
                  />
                </Card>
              )}
            </div>
            <div className="space-y-2">
              {metadata.prompt && (
                <div>
                  <h4 className="font-medium">Prompt</h4>
                  <p className="text-sm text-muted-foreground">
                    {metadata.prompt}
                  </p>
                </div>
              )}
              {metadata.model && (
                <Badge variant="secondary">{metadata.model}</Badge>
              )}
              {metadata.guidance && (
                <Badge variant="secondary">Guidance: {metadata.guidance}</Badge>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="metadata">
          <ScrollArea className="h-[400px] w-full rounded-md border p-4">
            <pre className="text-sm">{JSON.stringify(metadata, null, 2)}</pre>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="ipfs" className="space-y-4">
          {metadata.ipfs_image_cid && (
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-2">
                <FileImage className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium">Image CID</p>
                  <p className="text-sm text-muted-foreground">
                    {metadata.ipfs_image_cid}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleCopy(metadata.ipfs_image_cid!, "image")}
                >
                  {copied === "image" ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => openIPFSLink(metadata.ipfs_image_cid!)}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {metadata.ipfs_metadata_cid && (
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-2">
                <FileJson className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="font-medium">Metadata CID</p>
                  <p className="text-sm text-muted-foreground">
                    {metadata.ipfs_metadata_cid}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    handleCopy(metadata.ipfs_metadata_cid!, "metadata")
                  }
                >
                  {copied === "metadata" ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => openIPFSLink(metadata.ipfs_metadata_cid!)}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
}
