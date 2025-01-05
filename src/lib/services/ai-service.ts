import { HfInference } from "@huggingface/inference";
<<<<<<< HEAD
import { GenerationParams, GenerationResult, AI_MODELS } from "../models";
import { supabase } from "../supabase";
=======
import { AI_MODELS } from "../models";
import { supabase } from "../api-client";
import { useEffect } from "react";
>>>>>>> 3c8cb07db8e5ced0068231abaca2aceb1497ad95

class AIGenerationError extends Error {
  constructor(
    message: string,
    public code:
      | "RATE_LIMIT"
      | "INVALID_PARAMS"
      | "BATCH_FAILED"
      | "INTERRUPTED"
      | "UNKNOWN",
    public details?: any,
  ) {
    super(message);
    this.name = "AIGenerationError";
  }
}

export class AIService {
  private hf: HfInference;
  private rateLimitCounter: Map<string, { count: number; resetTime: number }> =
    new Map();
<<<<<<< HEAD
  private interrupted = false;
=======
  private interrupted: boolean = false;
>>>>>>> 3c8cb07db8e5ced0068231abaca2aceb1497ad95

  constructor() {
    this.hf = new HfInference(import.meta.env.VITE_HUGGINGFACE_API_KEY);
  }

  private checkRateLimit(modelId: string) {
    const limit = this.rateLimitCounter.get(modelId);
    const now = Date.now();

    if (limit) {
      if (now < limit.resetTime) {
        if (limit.count >= 10) {
          throw new AIGenerationError("Rate limit exceeded", "RATE_LIMIT", {
            resetIn: Math.ceil((limit.resetTime - now) / 1000),
          });
        }
        limit.count++;
      } else {
        this.rateLimitCounter.set(modelId, {
          count: 1,
          resetTime: now + 60000,
        });
      }
    } else {
      this.rateLimitCounter.set(modelId, { count: 1, resetTime: now + 60000 });
    }
  }

  private validateParameters(params: GenerationParams) {
    const model = AI_MODELS.find((m) => m.id === params.model);
    if (!model) {
      throw new AIGenerationError("Invalid model selected", "INVALID_PARAMS");
    }

    if (params.prompt.length < 3) {
      throw new AIGenerationError("Prompt too short", "INVALID_PARAMS");
    }

    if (params.prompt.length > model.maxPromptLength) {
      throw new AIGenerationError(
        `Prompt exceeds maximum length of ${model.maxPromptLength}`,
        "INVALID_PARAMS",
      );
    }

    if (params.guidance < 1 || params.guidance > 20) {
      throw new AIGenerationError(
        "Guidance scale must be between 1 and 20",
        "INVALID_PARAMS",
      );
    }
  }

  async generate(
    params: GenerationParams,
    onProgress?: (progress: number) => void,
  ): Promise<GenerationResult> {
    this.interrupted = false;
    this.validateParameters(params);
    this.checkRateLimit(params.model);

    try {
      if (onProgress) onProgress(10);

      // Generate image using HuggingFace
      const response = await this.hf.textToImage({
        model: params.model,
        inputs: params.prompt,
        parameters: {
          negative_prompt: params.negativePrompt,
          guidance_scale: params.guidance,
          seed: params.seed,
        },
      });

      if (this.interrupted) {
        throw new AIGenerationError("Generation interrupted", "INTERRUPTED");
      }

      if (onProgress) onProgress(50);

      // Upload to Supabase storage
      const fileName = `generated/${Date.now()}-${Math.random().toString(36).substring(7)}.png`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("images")
        .upload(fileName, response, {
          contentType: "image/png",
          cacheControl: "3600",
        });

      if (uploadError) throw uploadError;

      if (onProgress) onProgress(80);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("images")
        .getPublicUrl(fileName);

      // Save generation metadata
      const { data: generationData, error: generationError } = await supabase
        .from("art_generations")
        .insert([
          {
            prompt: params.prompt,
            result_url: urlData.publicUrl,
            metadata: {
              model: params.model,
              guidance: params.guidance,
              seed: params.seed,
              negative_prompt: params.negativePrompt,
              style_preset: params.stylePreset,
              style_strength: params.styleStrength,
            },
          },
        ])
        .select()
        .single();

      if (generationError) throw generationError;

      if (onProgress) onProgress(100);

      return {
        url: urlData.publicUrl,
        seed: params.seed || Math.floor(Math.random() * 1000000),
        prompt: params.prompt,
        model: params.model,
        stylePreset: params.stylePreset,
        metadata: generationData.metadata,
      };
    } catch (error) {
      if (error instanceof AIGenerationError) throw error;
      throw new AIGenerationError(
        "Failed to generate or save image",
        "UNKNOWN",
        error,
      );
    }
  }

  interrupt() {
    this.interrupted = true;
  }
}

export const aiService = new AIService();
<<<<<<< HEAD
=======

export type GenerationParams = {
  model: string;
  prompt: string;
  negativePrompt?: string;
  guidance: number;
  seed?: number;
  batchSize?: number;
};

export type GenerationResult = {
  url: string;
  params: GenerationParams;
};

useEffect(() => {
  const handleAIServiceStateChange = async () => {
    try {
      // Perform any necessary state updates here
    } catch (error) {
      console.error("Failed to update AI service state:", error);
    }
  };

  handleAIServiceStateChange();
}, []);
>>>>>>> 3c8cb07db8e5ced0068231abaca2aceb1497ad95
