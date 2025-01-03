import { ethers } from "ethers";
import { web3Service } from "../web3";

type TransactionStatus = "pending" | "confirmed" | "failed";

interface Transaction {
  hash: string;
  status: TransactionStatus;
  confirmations: number;
  error?: string;
  gasPrice?: string;
  gasUsed?: string;
  timestamp?: number;
}

interface BatchTransaction {
  batchId: string;
  transactions: Transaction[];
  progress: number;
  status: "pending" | "partial" | "complete" | "failed";
  startTime: number;
  endTime?: number;
}

interface TransactionStats {
  total: number;
  confirmed: number;
  failed: number;
  pending: number;
  averageConfirmationTime: number;
  averageGasPrice: string;
  totalGasUsed: string;
}

class TransactionService {
  private transactions: Map<string, Transaction> = new Map();
  private batches: Map<string, BatchTransaction> = new Map();
  private listeners: Map<string, Set<(tx: Transaction) => void>> = new Map();
  private batchListeners: Map<string, Set<(batch: BatchTransaction) => void>> =
    new Map();

  async watchTransaction(hash: string, requiredConfirmations: number = 1) {
    const provider = web3Service.getProvider();
    if (!provider) throw new Error("No provider available");

    const initialTx: Transaction = {
      hash,
      status: "pending",
      confirmations: 0,
      timestamp: Date.now(),
    };

    this.transactions.set(hash, initialTx);

    try {
      // Get initial gas price
      const tx = await provider.getTransaction(hash);
      if (tx?.gasPrice) {
        initialTx.gasPrice = tx.gasPrice.toString();
        this.transactions.set(hash, initialTx);
        this.notifyListeners(hash, initialTx);
      }

      // Wait for confirmation
      const receipt = await provider.waitForTransaction(
        hash,
        requiredConfirmations,
      );

      const status = receipt.status === 1 ? "confirmed" : "failed";
      const transaction: Transaction = {
        hash,
        status,
        confirmations: receipt.confirmations,
        error: status === "failed" ? "Transaction failed" : undefined,
        gasPrice: receipt.effectiveGasPrice.toString(),
        gasUsed: receipt.gasUsed.toString(),
        timestamp: initialTx.timestamp,
      };

      this.transactions.set(hash, transaction);
      this.notifyListeners(hash, transaction);

      return transaction;
    } catch (error) {
      const failedTx: Transaction = {
        hash,
        status: "failed",
        confirmations: 0,
        error: error instanceof Error ? error.message : "Transaction failed",
        timestamp: initialTx.timestamp,
      };

      this.transactions.set(hash, failedTx);
      this.notifyListeners(hash, failedTx);

      throw error;
    }
  }

  async watchBatch(batchId: string, transactions: string[]) {
    const batch: BatchTransaction = {
      batchId,
      transactions: [],
      progress: 0,
      status: "pending",
      startTime: Date.now(),
    };

    this.batches.set(batchId, batch);

    try {
      const results = await Promise.allSettled(
        transactions.map((hash) => this.watchTransaction(hash)),
      );

      const completed = results.filter((r) => r.status === "fulfilled").length;
      batch.progress = (completed / transactions.length) * 100;
      batch.status = completed === transactions.length ? "complete" : "partial";
      batch.endTime = Date.now();
      batch.transactions = transactions.map(
        (hash) => this.transactions.get(hash)!,
      );

      this.notifyBatchListeners(batchId, batch);
      return batch;
    } catch (error) {
      batch.status = "failed";
      batch.endTime = Date.now();
      this.notifyBatchListeners(batchId, batch);
      throw error;
    }
  }

  async getOptimalGasPrice() {
    const provider = web3Service.getProvider();
    if (!provider) throw new Error("No provider available");

    const gasPrice = await provider.getGasPrice();
    const networkBusy = gasPrice.gt(ethers.utils.parseUnits("100", "gwei"));

    return {
      gasPrice,
      suggested: networkBusy ? gasPrice.mul(12).div(10) : gasPrice,
      networkBusy,
    };
  }

  getTransactionStats(): TransactionStats {
    const txs = Array.from(this.transactions.values());
    const confirmedTxs = txs.filter((tx) => tx.status === "confirmed");

    const totalGasUsed = confirmedTxs.reduce(
      (sum, tx) => sum.add(tx.gasUsed || "0"),
      ethers.BigNumber.from(0),
    );

    const averageGasPrice = confirmedTxs.length
      ? confirmedTxs
          .reduce(
            (sum, tx) => sum.add(tx.gasPrice || "0"),
            ethers.BigNumber.from(0),
          )
          .div(confirmedTxs.length)
      : ethers.BigNumber.from(0);

    const averageConfirmationTime = confirmedTxs.length
      ? confirmedTxs.reduce((sum, tx) => {
          const confirmationTime = tx.timestamp
            ? (Date.now() - tx.timestamp) / 1000
            : 0;
          return sum + confirmationTime;
        }, 0) / confirmedTxs.length
      : 0;

    return {
      total: txs.length,
      confirmed: confirmedTxs.length,
      failed: txs.filter((tx) => tx.status === "failed").length,
      pending: txs.filter((tx) => tx.status === "pending").length,
      averageConfirmationTime,
      averageGasPrice: averageGasPrice.toString(),
      totalGasUsed: totalGasUsed.toString(),
    };
  }

  subscribe(hash: string, callback: (tx: Transaction) => void) {
    if (!this.listeners.has(hash)) {
      this.listeners.set(hash, new Set());
    }
    this.listeners.get(hash)?.add(callback);

    const transaction = this.transactions.get(hash);
    if (transaction) {
      callback(transaction);
    }

    return () => {
      this.listeners.get(hash)?.delete(callback);
    };
  }

  subscribeToBatch(
    batchId: string,
    callback: (batch: BatchTransaction) => void,
  ) {
    if (!this.batchListeners.has(batchId)) {
      this.batchListeners.set(batchId, new Set());
    }
    this.batchListeners.get(batchId)?.add(callback);

    const batch = this.batches.get(batchId);
    if (batch) {
      callback(batch);
    }

    return () => {
      this.batchListeners.get(batchId)?.delete(callback);
    };
  }

  private notifyListeners(hash: string, transaction: Transaction) {
    this.listeners.get(hash)?.forEach((callback) => callback(transaction));
  }

  private notifyBatchListeners(batchId: string, batch: BatchTransaction) {
    this.batchListeners.get(batchId)?.forEach((callback) => callback(batch));
  }
}

export const transactionService = new TransactionService();
