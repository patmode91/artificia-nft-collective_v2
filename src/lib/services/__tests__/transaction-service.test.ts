import { describe, it, expect, vi, beforeEach } from "vitest";
import { transactionService } from "../transaction-service";
import { web3Service } from "../../web3";

vi.mock("../../web3", () => ({
  web3Service: {
    getProvider: vi.fn(),
  },
}));

describe("TransactionService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should watch a transaction and update its status", async () => {
    const mockProvider = {
      waitForTransaction: vi.fn().mockResolvedValue({
        status: 1,
        confirmations: 1,
      }),
    };

    vi.mocked(web3Service.getProvider).mockReturnValue(mockProvider as any);

    const hash = "0x123";
    const result = await transactionService.watchTransaction(hash);

    expect(result.status).toBe("confirmed");
    expect(result.confirmations).toBe(1);
    expect(mockProvider.waitForTransaction).toHaveBeenCalledWith(hash, 1);
  });

  it("should handle failed transactions", async () => {
    const mockProvider = {
      waitForTransaction: vi.fn().mockResolvedValue({
        status: 0,
        confirmations: 1,
      }),
    };

    vi.mocked(web3Service.getProvider).mockReturnValue(mockProvider as any);

    const hash = "0x123";
    const result = await transactionService.watchTransaction(hash);

    expect(result.status).toBe("failed");
    expect(result.error).toBe("Transaction failed");
  });

  it("should notify subscribers of transaction updates", () => {
    const hash = "0x123";
    const callback = vi.fn();

    transactionService.subscribe(hash, callback);

    const transaction = {
      hash,
      status: "pending" as const,
      confirmations: 0,
    };

    // Simulate transaction update
    vi.mocked(transactionService as any).notifyListeners(hash, transaction);

    expect(callback).toHaveBeenCalledWith(transaction);
  });
});
