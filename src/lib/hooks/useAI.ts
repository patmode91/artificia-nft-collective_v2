import { useState, useEffect } from "react";
import { endpoints, GenerationParams, GenerationResult } from "../api-client";

export function useAI() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<GenerationResult[]>([]);

  const generate = async (params: GenerationParams) => {
    try {
      setIsLoading(true);
      setError(null);
      setProgress(0);
      setResults([]);

      // Calculate total steps based on batch size
      const totalSteps = params.batchSize || 1;
      let completedSteps = 0;

      // Generate images in sequence
      for (let i = 0; i < totalSteps; i++) {
        const result = await endpoints.ai.generate({
          ...params,
          batchSize: 1,
          seed: params.seed ? params.seed + i : undefined,
        });

        completedSteps++;
        setProgress((completedSteps / totalSteps) * 100);
        setResults((prev) => [...prev, result]);
      }

      return results;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Generation failed");
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleAIStateChange = async () => {
      try {
        // Perform any necessary state updates here
      } catch (error) {
        console.error("Failed to update AI state:", error);
      }
    };

    handleAIStateChange();
  }, []);

  return {
    generate,
    isLoading,
    error,
    progress,
    results,
  };
}
