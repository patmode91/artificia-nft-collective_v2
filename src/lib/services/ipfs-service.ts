import { create, IPFSHTTPClient } from "ipfs-http-client";
import { useEffect } from "react";

class IPFSService {
  private client: IPFSHTTPClient;

  constructor() {
    const projectId = import.meta.env.VITE_IPFS_PROJECT_ID;
    const projectSecret = import.meta.env.VITE_IPFS_PROJECT_SECRET;
    const auth = `Basic ${Buffer.from(`${projectId}:${projectSecret}`).toString("base64")}`;

    this.client = create({
      host: "ipfs.infura.io",
      port: 5001,
      protocol: "https",
      headers: {
        authorization: auth,
      },
    });
  }

  async uploadFile(file: File): Promise<string> {
    try {
      const added = await this.client.add(file);
      this.handleStateChange(); // Call handleStateChange after uploading file
      return `ipfs://${added.path}`;
    } catch (error) {
      console.error("IPFS upload error:", error);
      throw new Error("Failed to upload file to IPFS");
    }
  }

  async uploadJSON(metadata: object): Promise<string> {
    try {
      const data = JSON.stringify(metadata);
      const added = await this.client.add(data);
      return `ipfs://${added.path}`;
    } catch (error) {
      console.error("IPFS metadata upload error:", error);
      throw new Error("Failed to upload metadata to IPFS");
    }
  }

  getIPFSUrl(hash: string): string {
    return `https://ipfs.io/ipfs/${hash.replace("ipfs://", "")}`;
  }

  private handleStateChange = async () => {
    try {
      // Perform any necessary state updates here
      console.log("IPFS state updated");
    } catch (error) {
      console.error("Failed to update IPFS state:", error);
    }
  };
}

export const ipfsService = new IPFSService();

useEffect(() => {
  const handleIPFSStateChange = async () => {
    try {
      // Perform any necessary state updates here
      console.log("IPFS state updated");
    } catch (error) {
      console.error("Failed to update IPFS state:", error);
    }
  };

  handleIPFSStateChange();
}, []);
