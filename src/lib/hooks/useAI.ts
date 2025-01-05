<<<<<<< HEAD
import { useState } from "react";
import { GenerationParams, GenerationResult } from "../models";
import { aiService } from "../services/ai-service";
=======
import { useState, useEffect } from "react";
import { endpoints, GenerationParams, GenerationResult } from "../api-client";
>>>>>>> 3c8cb07db8e5ced0068231abaca2aceb1497ad95

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

<<<<<<< HEAD
  const cancelGeneration = () => {
    aiService.interrupt();
    setIsLoading(false);
    setProgress(0);
  };
=======
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
>>>>>>> 3c8cb07db8e5ced0068231abaca2aceb1497ad95

  return {
    generate,
    cancelGeneration,
    isLoading,
    error,
    progress,
    results,
  };
}
