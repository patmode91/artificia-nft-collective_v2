import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Upload } from "lucide-react";
import { nftService } from "@/lib/services/nft-service";
import { useWeb3 } from "@/lib/web3";

interface MintNFTDialogProps {
  isOpen: boolean;
  onClose: () => void;
  imageFile?: File;
  previewUrl?: string;
}

export function MintNFTDialog({
  isOpen,
  onClose,
  imageFile,
  previewUrl,
}: MintNFTDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { address } = useWeb3();

  const handleMint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile || !address) return;

    setError("");
    setLoading(true);

    try {
      await nftService.mintNFT(imageFile, {
        name,
        description,
        attributes: [
          {
            trait_type: "Creator",
            value: address,
          },
        ],
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to mint NFT");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Mint NFT</DialogTitle>
          <DialogDescription>
            Create a new NFT from your generated artwork
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleMint} className="space-y-4">
          {previewUrl && (
            <div className="rounded-lg overflow-hidden">
              <img
                src={previewUrl}
                alt="NFT Preview"
                className="w-full h-48 object-cover"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter NFT name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter NFT description"
              required
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={loading || !address}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Minting...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Mint NFT
              </>
            )}
          </Button>

          {!address && (
            <Alert>
              <AlertDescription>
                Please connect your wallet to mint NFTs
              </AlertDescription>
            </Alert>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
