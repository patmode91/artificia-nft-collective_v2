import { NFTContract } from "../contracts/NFTContract";
import { web3Service } from "../web3";
import { ipfsService } from "./ipfs-service";
import { supabase } from "../supabase";
import { useEffect } from "react";

export class NFTService {
  private contract: NFTContract | null = null;

  async initialize() {
    const signer = web3Service.getSigner();
    if (!signer) throw new Error("No signer available");

    const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
    if (!contractAddress) throw new Error("No contract address configured");

    this.contract = new NFTContract(contractAddress, signer);
  }

  async mintNFT(
    imageFile: File,
    metadata: {
      name: string;
      description: string;
      attributes?: Array<{ trait_type: string; value: string | number }>;
    },
  ) {
    if (!this.contract) await this.initialize();

    try {
      // Upload image to IPFS
      const imageUri = await ipfsService.uploadFile(imageFile);

      // Prepare metadata
      const nftMetadata = {
        name: metadata.name,
        description: metadata.description,
        image: imageUri,
        attributes: metadata.attributes || [],
      };

      // Get signer's address
      const signer = web3Service.getSigner();
      if (!signer) throw new Error("No signer available");
      const address = await signer.getAddress();

      // Mint NFT
      const { tokenId, transactionHash } = await this.contract.mint(
        address,
        nftMetadata,
      );

      // Save to Supabase
      const { data, error } = await supabase.from("nfts").insert([
        {
          token_id: tokenId,
          contract_address: import.meta.env.VITE_CONTRACT_ADDRESS,
          metadata: nftMetadata,
          image_url: ipfsService.getIPFSUrl(imageUri),
          is_minted: true,
        },
      ]);

      if (error) throw error;

      return {
        tokenId,
        transactionHash,
        metadata: nftMetadata,
      };
    } catch (error) {
      console.error("NFT minting error:", error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to mint NFT",
      );
    }
  }
}

export const nftService = new NFTService();

useEffect(() => {
  const handleNFTServiceStateChange = async () => {
    try {
      // Perform any necessary state updates here
    } catch (error) {
      console.error("Failed to update NFT service state:", error);
    }
  };

  handleNFTServiceStateChange();
}, []);
