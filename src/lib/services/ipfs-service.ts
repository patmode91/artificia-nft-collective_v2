import { create, IPFSHTTPClient } from "ipfs-http-client";
import { Buffer } from "buffer";

class IPFSService {
  private client: IPFSHTTPClient;
  private gateway: string;

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

    this.gateway = "https://ipfs.io/ipfs";
  }

  async uploadFile(file: File | Blob): Promise<{
    cid: string;
    url: string;
    size: number;
  }> {
    try {
      const added = await this.client.add(file, {
        progress: (prog) => console.log(`Upload progress: ${prog}`),
      });

      return {
        cid: added.cid.toString(),
        url: `${this.gateway}/${added.cid.toString()}`,
        size: added.size,
      };
    } catch (error) {
      console.error("IPFS upload error:", error);
      throw new Error("Failed to upload file to IPFS");
    }
  }

  async uploadJSON(metadata: object): Promise<{
    cid: string;
    url: string;
  }> {
    try {
      const data = JSON.stringify(metadata);
      const added = await this.client.add(data);

      return {
        cid: added.cid.toString(),
        url: `${this.gateway}/${added.cid.toString()}`,
      };
    } catch (error) {
      console.error("IPFS metadata upload error:", error);
      throw new Error("Failed to upload metadata to IPFS");
    }
  }

  async uploadBatch(files: (File | Blob)[]): Promise<
    {
      cid: string;
      url: string;
      size: number;
    }[]
  > {
    try {
      const results = await Promise.all(
        files.map((file) => this.uploadFile(file)),
      );
      return results;
    } catch (error) {
      console.error("IPFS batch upload error:", error);
      throw new Error("Failed to upload batch to IPFS");
    }
  }

  getIPFSUrl(cid: string): string {
    return `${this.gateway}/${cid}`;
  }

  async isValidCID(cid: string): Promise<boolean> {
    try {
      await this.client.pin.add(cid);
      return true;
    } catch {
      return false;
    }
  }
}

export const ipfsService = new IPFSService();
