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
import { Progress } from "@/components/ui/progress";
import { Loader2, Upload, CheckCircle, XCircle } from "lucide-react";
import { nftService } from "@/lib/services/nft-service";
import { useWeb3 } from "@/lib/web3";
import { useTransaction } from "@/lib/hooks/useTransaction";
import { useQueryClient } from "@tanstack/react-query";

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
  const [txHash, setTxHash] = useState("");
  const { address } = useWeb3();
  const queryClient = useQueryClient();

  const {
    status,
    confirmations,
    error: txError,
    isLoading,
  } = useTransaction(txHash);

  const handleMint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile || !address) return;

    setError("");
    setTxHash("");

    try {
      const result = await nftService.mintNFT(imageFile, {
        name,
        description,
        attributes: [
          {
            trait_type: "Creator",
            value: address,
          },
        ],
      });

      setTxHash(result.transactionHash);

      // Invalidate NFT queries to refresh the list
      queryClient.invalidateQueries(["nft"]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to mint NFT");
    }
  };

  const renderStatus = () => {
    if (!txHash) return null;

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">
            {status === "confirmed" && "NFT Minted Successfully"}
            {status === "pending" && "Minting in Progress..."}
            {status === "failed" && "Minting Failed"}
          </span>
          {status === "confirmed" && (
            <CheckCircle className="h-5 w-5 text-green-500" />
          )}
          {status === "failed" && <XCircle className="h-5 w-5 text-red-500" />}
        </div>

        {status === "pending" && (
          <Progress value={(confirmations / 1) * 100} className="h-2" />
        )}

        <div className="text-xs text-muted-foreground break-all">
          Transaction: {txHash}
        </div>
      </div>
    );
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
              disabled={isLoading}
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
              disabled={isLoading}
            />
          </div>

          {renderStatus()}

          {(error || txError) && (
            <Alert variant="destructive">
              <AlertDescription>{error || txError}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !address || status === "confirmed"}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Minting...
              </>
            ) : status === "confirmed" ? (
              "NFT Minted Successfully"
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
