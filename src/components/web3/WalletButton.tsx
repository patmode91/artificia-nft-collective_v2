import { Button } from "@/components/ui/button";
import { useWeb3 } from "@/lib/web3";
import { Loader2, Wallet } from "lucide-react";

export function WalletButton() {
  const { connect, disconnect, address, isConnecting, error } = useWeb3();

  const handleClick = async () => {
    if (address) {
      disconnect();
    } else {
      await connect();
    }
  };

  return (
    <Button
      onClick={handleClick}
      variant={address ? "outline" : "default"}
      disabled={isConnecting}
    >
      {isConnecting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Connecting...
        </>
      ) : address ? (
        <>
          <Wallet className="mr-2 h-4 w-4" />
          {`${address.slice(0, 6)}...${address.slice(-4)}`}
        </>
      ) : (
        <>
          <Wallet className="mr-2 h-4 w-4" />
          Connect Wallet
        </>
      )}
    </Button>
  );
}
