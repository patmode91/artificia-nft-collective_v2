import { ethers } from "ethers";
import { ipfsService } from "../services/ipfs-service";
import { useEffect } from "react";

const NFT_ABI = [
  "function mint(address to, string memory uri) public returns (uint256)",
  "function tokenURI(uint256 tokenId) public view returns (string memory)",
  "function ownerOf(uint256 tokenId) public view returns (address)",
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
];

export class NFTContract {
  private contract: ethers.Contract;

  constructor(address: string, signer: ethers.Signer) {
    this.contract = new ethers.Contract(address, NFT_ABI, signer);
  }

  async mint(
    to: string,
    metadata: object,
  ): Promise<{
    tokenId: string;
    transactionHash: string;
  }> {
    try {
      // Upload metadata to IPFS
      const metadataUri = await ipfsService.uploadJSON(metadata);

      // Mint NFT
      const tx = await this.contract.mint(to, metadataUri);
      const receipt = await tx.wait();

      // Get token ID from transfer event
      const transferEvent = receipt.events?.find(
        (event: any) => event.event === "Transfer",
      );
      const tokenId = transferEvent?.args?.tokenId.toString();

      if (!tokenId) {
        throw new Error("Failed to get token ID from transaction");
      }

      return {
        tokenId,
        transactionHash: receipt.transactionHash,
      };
    } catch (error) {
      console.error("NFT minting error:", error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to mint NFT",
      );
    }
  }

  async getTokenURI(tokenId: string): Promise<string> {
    return await this.contract.tokenURI(tokenId);
  }

  async getOwner(tokenId: string): Promise<string> {
    return await this.contract.ownerOf(tokenId);
  }
}

// Add useEffect hook to handle contract state changes
useEffect(() => {
  const handleStateChange = async () => {
    try {
      const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
      const signer = web3Service.getSigner();
      if (contractAddress && signer) {
        const contract = new NFTContract(contractAddress, signer);
        // Perform any necessary state updates here
      }
    } catch (error) {
      console.error("Failed to update contract state:", error);
    }
  };

  handleStateChange();
}, []);
