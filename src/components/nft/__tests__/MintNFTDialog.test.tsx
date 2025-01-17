import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MintNFTDialog } from "../MintNFTDialog";
import { nftService } from "@/lib/services/nft-service";
import { useWeb3 } from "@/lib/web3";

vi.mock("@/lib/web3", () => ({
  useWeb3: vi.fn(),
}));

vi.mock("@/lib/services/nft-service", () => ({
  nftService: {
    mintNFT: vi.fn(),
  },
}));

describe("MintNFTDialog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useWeb3).mockReturnValue({
      address: "0x123",
      isConnecting: false,
      error: null,
    } as any);
  });

  it("should render correctly", () => {
    render(
      <MintNFTDialog
        isOpen={true}
        onClose={() => {}}
        imageFile={new File([], "test.png")}
        previewUrl="test.png"
      />,
    );

    expect(screen.getByText("Mint NFT")).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Description")).toBeInTheDocument();
  });

  it("should handle minting process", async () => {
    const mockTxHash = "0x456";
    vi.mocked(nftService.mintNFT).mockResolvedValue({
      tokenId: "1",
      transactionHash: mockTxHash,
      metadata: {},
    });

    render(
      <MintNFTDialog
        isOpen={true}
        onClose={() => {}}
        imageFile={new File([], "test.png")}
        previewUrl="test.png"
      />,
    );

    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Test NFT" },
    });
    fireEvent.change(screen.getByLabelText("Description"), {
      target: { value: "Test Description" },
    });

    fireEvent.click(screen.getByText("Mint NFT"));

    await waitFor(() => {
      expect(nftService.mintNFT).toHaveBeenCalledWith(
        expect.any(File),
        expect.objectContaining({
          name: "Test NFT",
          description: "Test Description",
        }),
      );
    });
  });

  it("should show error message when minting fails", async () => {
    vi.mocked(nftService.mintNFT).mockRejectedValue(new Error("Mint failed"));

    render(
      <MintNFTDialog
        isOpen={true}
        onClose={() => {}}
        imageFile={new File([], "test.png")}
        previewUrl="test.png"
      />,
    );

    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Test NFT" },
    });
    fireEvent.change(screen.getByLabelText("Description"), {
      target: { value: "Test Description" },
    });

    fireEvent.click(screen.getByText("Mint NFT"));

    await waitFor(() => {
      expect(screen.getByText("Mint failed")).toBeInTheDocument();
    });
  });

  it("should handle transaction status updates", async () => {
    const mockTxHash = "0x789";
    vi.mocked(nftService.mintNFT).mockResolvedValue({
      tokenId: "2",
      transactionHash: mockTxHash,
      metadata: {},
    });

    render(
      <MintNFTDialog
        isOpen={true}
        onClose={() => {}}
        imageFile={new File([], "test.png")}
        previewUrl="test.png"
      />,
    );

    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Test NFT 2" },
    });
    fireEvent.change(screen.getByLabelText("Description"), {
      target: { value: "Test Description 2" },
    });

    fireEvent.click(screen.getByText("Mint NFT"));

    await waitFor(() => {
      expect(nftService.mintNFT).toHaveBeenCalledWith(
        expect.any(File),
        expect.objectContaining({
          name: "Test NFT 2",
          description: "Test Description 2",
        }),
      );
    });

    await waitFor(() => {
      expect(screen.getByText("Minting in Progress...")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText("NFT Minted Successfully")).toBeInTheDocument();
    });
  });

  it("should handle transaction failure", async () => {
    const mockTxHash = "0xabc";
    vi.mocked(nftService.mintNFT).mockResolvedValue({
      tokenId: "3",
      transactionHash: mockTxHash,
      metadata: {},
    });

    render(
      <MintNFTDialog
        isOpen={true}
        onClose={() => {}}
        imageFile={new File([], "test.png")}
        previewUrl="test.png"
      />,
    );

    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Test NFT 3" },
    });
    fireEvent.change(screen.getByLabelText("Description"), {
      target: { value: "Test Description 3" },
    });

    fireEvent.click(screen.getByText("Mint NFT"));

    await waitFor(() => {
      expect(nftService.mintNFT).toHaveBeenCalledWith(
        expect.any(File),
        expect.objectContaining({
          name: "Test NFT 3",
          description: "Test Description 3",
        }),
      );
    });

    vi.mocked(nftService.mintNFT).mockRejectedValue(new Error("Transaction failed"));

    await waitFor(() => {
      expect(screen.getByText("Minting Failed")).toBeInTheDocument();
    });
  });
});
