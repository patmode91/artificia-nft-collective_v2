import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Share2 } from "lucide-react";
import { ipfsService } from "@/lib/services/ipfs-service";

interface NFTCardProps {
  tokenId: string;
  name: string;
  description: string;
  imageUrl: string;
  contractAddress: string;
  metadata: Record<string, any>;
}

export function NFTCard({
  tokenId,
  name,
  description,
  imageUrl,
  contractAddress,
  metadata,
}: NFTCardProps) {
  const openEtherscan = () => {
    const baseUrl = "https://etherscan.io/token";
    window.open(`${baseUrl}/${contractAddress}/${tokenId}`, "_blank");
  };

  const shareNFT = async () => {
    try {
      await navigator.share({
        title: name,
        text: description,
        url: imageUrl,
      });
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <div className="aspect-square">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-lg">{name}</CardTitle>
        <CardDescription className="mt-2 line-clamp-2">
          {description}
        </CardDescription>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Button variant="outline" size="sm" onClick={openEtherscan}>
          <ExternalLink className="h-4 w-4 mr-2" />
          View
        </Button>
        <Button variant="outline" size="sm" onClick={shareNFT}>
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </CardFooter>
    </Card>
  );
}
