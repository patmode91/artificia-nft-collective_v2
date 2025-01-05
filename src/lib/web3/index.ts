import { ethers } from "ethers";
import { createContext, useContext, useEffect, useState } from "react";

export type Web3ContextType = {
  provider: ethers.providers.Web3Provider | null;
  signer: ethers.Signer | null;
  address: string | null;
  chainId: number | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  isConnecting: boolean;
  error: Error | null;
};

export const Web3Context = createContext<Web3ContextType | null>(null);

export function useWeb3() {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error("useWeb3 must be used within a Web3Provider");
  }
  return context;
}

export class Web3Service {
  private provider: ethers.providers.Web3Provider | null = null;
  private signer: ethers.Signer | null = null;

  async connect(): Promise<{
    provider: ethers.providers.Web3Provider;
    signer: ethers.Signer;
    address: string;
    chainId: number;
  }> {
    if (!window.ethereum) {
      throw new Error("No Web3 provider found");
    }

    this.provider = new ethers.providers.Web3Provider(window.ethereum);

    // Request account access
    await window.ethereum.request({ method: "eth_requestAccounts" });

    this.signer = this.provider.getSigner();
    const address = await this.signer.getAddress();
    const network = await this.provider.getNetwork();

    // Handle Web3 state changes
    this.handleStateChange();

    return {
      provider: this.provider,
      signer: this.signer,
      address,
      chainId: network.chainId,
    };
  }

  async switchNetwork(chainId: number): Promise<void> {
    if (!window.ethereum) throw new Error("No Web3 provider found");

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
    } catch (error: any) {
      if (error.code === 4902) {
        // Chain not added, implement add chain logic here
        throw new Error("Network not added to MetaMask");
      }
      throw error;
    }
  }

  getProvider(): ethers.providers.Web3Provider | null {
    return this.provider;
  }

  getSigner(): ethers.Signer | null {
    return this.signer;
  }

  private handleStateChange = async () => {
    try {
      // Perform any necessary state updates here
      console.log("Web3 state updated");
    } catch (error) {
      console.error("Failed to update Web3 state:", error);
    }
  };
}

export const web3Service = new Web3Service();

useEffect(() => {
  const handleWeb3StateChange = async () => {
    try {
      // Perform any necessary state updates here
      console.log("Web3 state updated");
    } catch (error) {
      console.error("Failed to update Web3 state:", error);
    }
  };

  handleWeb3StateChange();
}, []);
