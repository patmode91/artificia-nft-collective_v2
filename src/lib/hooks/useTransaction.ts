import { useState, useEffect } from "react";
import { transactionService } from "../services/transaction-service";

export function useTransaction(hash?: string) {
  const [status, setStatus] = useState<"pending" | "confirmed" | "failed">();
  const [confirmations, setConfirmations] = useState(0);
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (!hash) return;

    const unsubscribe = transactionService.subscribe(hash, (tx) => {
      setStatus(tx.status);
      setConfirmations(tx.confirmations);
      setError(tx.error);
    });

    return () => unsubscribe();
  }, [hash]);

  useEffect(() => {
    const handleTransactionStateChange = async () => {
      if (!hash) return;

      try {
        const result = await transactionService.watchTransaction(hash);
        setStatus(result.status);
        setConfirmations(result.confirmations);
        setError(result.error);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Transaction failed");
      }
    };

    handleTransactionStateChange();
  }, [hash]);

  const watch = async (newHash: string, requiredConfirmations = 1) => {
    try {
      const result = await transactionService.watchTransaction(
        newHash,
        requiredConfirmations,
      );
      setStatus(result.status);
      setConfirmations(result.confirmations);
      setError(result.error);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Transaction failed");
      throw err;
    }
  };

  return {
    status,
    confirmations,
    error,
    watch,
    isLoading: status === "pending",
    isConfirmed: status === "confirmed",
    isFailed: status === "failed",
  };
}
