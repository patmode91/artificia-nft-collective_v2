import { ReactNode, useEffect, useState } from "react";
import { Web3Context, web3Service } from ".";
import { ethers } from "ethers";
import { useAuth } from "../auth";

interface Web3ProviderProps {
  children: ReactNode;
}

export function Web3Provider({ children }: Web3ProviderProps) {
  const [provider, setProvider] =
    useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      // Handle account changes
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      // Handle chain changes
      window.ethereum.on("chainChanged", handleChainChanged);

      return () => {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged,
        );
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      };
    }
  }, []);

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      // User disconnected
      disconnect();
    } else {
      // Update the current account
      setAddress(accounts[0]);
    }
  };

  const handleChainChanged = (chainId: string) => {
    // Reload the page on chain change as recommended by MetaMask
    window.location.reload();
  };

  const connect = async () => {
    try {
      setIsConnecting(true);
      setError(null);

      if (!user) {
        throw new Error("User not authenticated");
      }

      const connection = await web3Service.connect();
      setProvider(connection.provider);
      setSigner(connection.signer);
      setAddress(connection.address);
      setChainId(connection.chainId);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to connect"));
      disconnect();
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setProvider(null);
    setSigner(null);
    setAddress(null);
    setChainId(null);
    setError(null);
  };

  return (
    <Web3Context.Provider
      value={{
        provider,
        signer,
        address,
        chainId,
        connect,
        disconnect,
        isConnecting,
        error,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
}
