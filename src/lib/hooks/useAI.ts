import { useState } from "react";
import { GenerationParams, GenerationResult } from "../models";
import { aiService } from "../services/ai-service";

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

      // Calculate total steps based on batch size
      const totalSteps = params.batchSize;
      let completedSteps = 0;

      const generatedResults: GenerationResult[] = [];

      // Generate images in sequence
      for (let i = 0; i < totalSteps; i++) {
        const result = await aiService.generate(
          {
            ...params,
            seed: params.seed ? params.seed + i : undefined,
          },
          (stepProgress) => {
            // Update progress for current step
            const overallProgress =
              ((completedSteps + stepProgress / 100) / totalSteps) * 100;
            setProgress(overallProgress);
          },
        );

        generatedResults.push(result);
        completedSteps++;
        setProgress((completedSteps / totalSteps) * 100);
      }

      setResults(generatedResults);
      return generatedResults;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Generation failed");
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const cancelGeneration = () => {
    aiService.interrupt();
    setIsLoading(false);
    setProgress(0);
  };

  return {
    generate,
    cancelGeneration,
    isLoading,
    error,
    progress,
    results,
  };
}
